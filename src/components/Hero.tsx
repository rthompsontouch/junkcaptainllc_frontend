"use client";

import Image from "next/image";
import { useState, useRef } from "react";

export default function Hero() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus("idle");
    setSubmitMessage("");

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("address", formData.address);
      form.append("message", formData.message);
      images.forEach((file) => form.append("images", file));

      const res = await fetch("/api/quote", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitStatus("error");
        setSubmitMessage(data.error || "Something went wrong. Please try again or call us.");
        return;
      }

      setSubmitStatus("success");
      setSubmitMessage(data.message || "Thank you! We'll be in touch soon with your free quote.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        message: "",
      });
      setImages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      setSubmitStatus("error");
      setSubmitMessage("Something went wrong. Please try again or call us.");
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
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 4);
      setImages(filesArray);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-32 pb-32">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero/lance-grandahl-VSXT9AV19Is-unsplash.jpg"
          alt="Junk removal service"
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
            <h2 className="text-2xl font-bold text-navy mb-6">
              Request a Free Quote
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitStatus === "success" && (
                <div className="bg-green-100 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm">
                  {submitMessage}
                </div>
              )}
              {submitStatus === "error" && (
                <div className="bg-red-100 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  {submitMessage}
                </div>
              )}
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
                  Upload Photos (Optional, up to 4)
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
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
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
                className="w-full bg-orange hover:bg-orange/90 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
            alt="Junk Captain LLC Logo"
            fill
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
