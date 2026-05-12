import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const QUOTE_FOLDER = process.env.CLOUDINARY_QUOTE_FOLDER ?? "junkcaptain-quotes";

export type QuoteUploadSignature = {
  cloudName: string;
  apiKey: string;
  signature: string;
  timestamp: number;
  folder: string;
};

/** Server-signed params so the browser can upload directly to Cloudinary (avoids Vercel body limits). */
export function getQuoteUploadSignature(): QuoteUploadSignature | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;

  const timestamp = Math.round(Date.now() / 1000);
  const folder = QUOTE_FOLDER;
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, apiSecret);

  return { cloudName, apiKey, signature, timestamp, folder };
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options?: { folder?: string }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options?.folder ?? QUOTE_FOLDER,
        resource_type: "image",
      },
      (err, result) => {
        if (err) return reject(err);
        if (!result?.secure_url) return reject(new Error("No URL returned"));
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}
