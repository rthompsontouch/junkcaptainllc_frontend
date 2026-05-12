"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";

const MAX_IMAGES = 4;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

type CloudinarySign = {
  cloudName: string;
  apiKey: string;
  signature: string;
  timestamp: number;
  folder: string;
};

async function readJsonSafe(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { _parseError: true as const, rawPreview: text.slice(0, 280) };
  }
}

function cloudinaryUploadError(data: Record<string, unknown>, status: number): string {
  const err = data.error;
  if (err && typeof err === "object" && "message" in err && typeof (err as { message: unknown }).message === "string") {
    return (err as { message: string }).message;
  }
  if (typeof err === "string") return err;
  return `Upload failed (HTTP ${status})`;
}

export default function Hero() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogKind, setDialogKind] = useState<"success" | "error" | "warning">("error");
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogBody, setDialogBody] = useState("");
  const [dialogRefId, setDialogRefId] = useState<string | null>(null);

  const openDialog = useCallback(
    (kind: "success" | "error" | "warning", title: string, body: string, refId?: string | null) => {
      setDialogKind(kind);
      setDialogTitle(title);
      setDialogBody(body);
      setDialogRefId(refId ?? null);
      setDialogOpen(true);
    },
    []
  );

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  const fetchSignUpload = async (): Promise<CloudinarySign | null> => {
    const res = await fetch("/api/quote/sign-upload", { method: "POST" });
    if (!res.ok) return null;
    const d = await readJsonSafe(res);
    if (
      typeof d.cloudName !== "string" ||
      typeof d.apiKey !== "string" ||
      typeof d.signature !== "string" ||
      typeof d.timestamp !== "number" ||
      typeof d.folder !== "string"
    ) {
      return null;
    }
    return {
      cloudName: d.cloudName,
      apiKey: d.apiKey,
      signature: d.signature,
      timestamp: d.timestamp,
      folder: d.folder,
    };
  };

  const uploadOneToCloudinary = async (file: File, sig: CloudinarySign): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", sig.apiKey);
    fd.append("timestamp", String(sig.timestamp));
    fd.append("signature", sig.signature);
    fd.append("folder", sig.folder);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
      method: "POST",
      body: fd,
    });
    const data = await readJsonSafe(res);
    if (typeof data.secure_url === "string") return data.secure_url;
    throw new Error(cloudinaryUploadError(data, res.status));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const imageUrls: string[] = [];

      if (images.length > 0) {
        for (const file of images) {
          const sig = await fetchSignUpload();
          if (!sig) {
            openDialog(
              "error",
              "Photos could not be uploaded",
              "Our image service is not available right now. Remove your photos and submit text only, or call us at (910) 808-1125 and we’ll help you.",
              null
            );
            return;
          }
          try {
            const url = await uploadOneToCloudinary(file, sig);
            imageUrls.push(url);
          } catch (uploadErr) {
            const msg = uploadErr instanceof Error ? uploadErr.message : "Upload failed";
            openDialog(
              "error",
              "Photo upload failed",
              `${msg}\n\nYou can remove the photos and try again, or call (910) 808-1125.`,
              null
            );
            return;
          }
        }
      }

      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          message: formData.message.trim(),
          imageUrls,
        }),
      });

      const data = await readJsonSafe(res);
      const requestId = typeof data.requestId === "string" ? data.requestId : null;

      if (res.ok && data.success === true) {
        const msg =
          (typeof data.message === "string" && data.message) ||
          "Thank you! We'll be in touch soon with your free quote.";
        openDialog("success", "Request received", msg, requestId);
        setFormData({ name: "", email: "", phone: "", address: "", message: "" });
        setImages([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const partial = data.partialSuccess === true;
      const customerId = typeof data.customerId === "string" ? data.customerId : null;
      const errMsg =
        (typeof data.error === "string" && data.error) ||
        (res.status >= 500
          ? "The server had a problem. Please try again shortly or call (910) 808-1125."
          : "Something went wrong. Please try again or call us.");

      if (partial && customerId) {
        openDialog(
          "warning",
          "Partially saved",
          `${errMsg}\n\nIf you need immediate help, call (910) 808-1125. Your reference and saved lead id are below.`,
          requestId ? `${requestId} • Lead: ${customerId}` : `Lead: ${customerId}`
        );
        setFormData({ name: "", email: "", phone: "", address: "", message: "" });
        setImages([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      if ("_parseError" in data && data._parseError) {
        openDialog(
          "error",
          "Connection or server issue",
          `We could not read the server response (HTTP ${res.status}). Please try again or call (910) 808-1125.`,
          requestId
        );
        return;
      }

      openDialog("error", "Could not send your quote", errMsg, requestId);
    } catch {
      openDialog(
        "error",
        "Network error",
        "Check your internet connection and try again, or call (910) 808-1125.",
        null
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const arr = Array.from(e.target.files).slice(0, MAX_IMAGES);
    const oversize = arr.find((f) => f.size > MAX_FILE_BYTES);
    if (oversize) {
      openDialog(
        "error",
        "Photo too large",
        `Each photo must be under 5 MB. "${oversize.name}" is too large.`,
        null
      );
      e.target.value = "";
      return;
    }
    setImages(arr);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const dialogAccent =
    dialogKind === "success"
      ? "text-green-800"
      : dialogKind === "warning"
        ? "text-amber-800"
        : "text-red-700";

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-32 pb-32">
      {dialogOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
          onClick={() => setDialogOpen(false)}
          role="presentation"
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-100"
            onClick={(ev) => ev.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-dialog-title"
          >
            <h3 id="quote-dialog-title" className={`text-lg font-bold ${dialogAccent}`}>
              {dialogTitle}
            </h3>
            <p className="mt-3 text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{dialogBody}</p>
            {dialogRefId ? (
              <p className="mt-4 text-xs font-mono text-gray-500 break-all">
                Reference: {dialogRefId}
              </p>
            ) : null}
            <p className="mt-3 text-xs text-gray-500">
              Save this reference if you contact support—it matches our server logs.
            </p>
            <button
              type="button"
              className="mt-6 w-full py-3 bg-orange hover:bg-orange/90 text-white font-semibold rounded-lg transition-colors cursor-pointer"
              onClick={() => setDialogOpen(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero/lance-grandahl-VSXT9AV19Is-unsplash.jpg"
          alt="Professional junk removal truck and crew serving Raleigh, Cary, Apex, Durham - Junk Captain LLC"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-navy/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Title, Subtitle, CTAs */}
          <div className="text-white space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Fast & Reliable Junk Removal Service
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Serving Raleigh, Cary, Apex, Fuquay Varina & Durham
            </p>
            <p className="text-lg text-gray-300">
              Professional junk removal you can trust. Same-day service
              available. No job too big or small!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="tel:+19108081125"
                className="bg-orange hover:bg-orange/90 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors text-center"
              >
                Call Now
              </a>
              <a
                href="#services"
                className="bg-white/10 hover:bg-white/20 border-2 border-white text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors text-center backdrop-blur-sm"
              >
                Our Services
              </a>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-lg shadow-2xl p-8 text-gray-900">
            <h2 className="text-2xl font-bold text-navy mb-2">Request a Free Quote</h2>
            <p className="text-xs text-gray-500 mb-6">
              Photos upload securely to our image host first so your request always fits—no more silent failures from large files.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name and Email Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all text-sm text-gray-900 placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all text-sm text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Phone and Address Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all text-sm text-gray-900 placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Service Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all text-sm text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tell us about your junk removal needs
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={2}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all resize-none text-sm text-gray-900 placeholder:text-gray-500"
                ></textarea>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Photos (Optional, up to 4, max 5 MB each)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all text-sm text-gray-900 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange/10 file:text-orange hover:file:bg-orange/20"
                />
                {images.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                      <div key={`${image.name}-${index}`} className="relative group">
                        <img
                          src={imagePreviewUrls[index] ?? ""}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-orange hover:bg-orange/90 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? "Submitting..." : "Get Free Quote"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Logo at Bottom - Half on Hero, Half on Next Section */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
        <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80">
          <Image
            src="/hero/logo_original.png"
            alt="Junk Captain LLC - Professional junk removal Raleigh NC"
            fill
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
