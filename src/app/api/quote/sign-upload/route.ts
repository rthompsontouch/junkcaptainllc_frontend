import { NextRequest, NextResponse } from "next/server";
import { getQuoteUploadSignature } from "@/lib/services/cloudinary";
import { takeRateLimitToken } from "@/lib/rateLimitMemory";
import { getRateLimitClientKey } from "@/lib/requestClientKey";

const SIGN_UPLOAD_WINDOW_MS = 60_000;
const SIGN_UPLOAD_MAX_PER_WINDOW = 32;

/** Returns short-lived signed params for direct browser → Cloudinary uploads. */
export async function POST(request: NextRequest) {
  const clientKey = getRateLimitClientKey(request);
  const rl = takeRateLimitToken(`quote-sign:${clientKey}`, SIGN_UPLOAD_MAX_PER_WINDOW, SIGN_UPLOAD_WINDOW_MS);
  if (!rl.ok) {
    const retrySec = Math.max(1, Math.ceil(rl.retryAfterMs / 1000));
    return NextResponse.json(
      { error: "Too many upload signature requests. Please wait a moment and try again." },
      {
        status: 429,
        headers: { "Retry-After": String(retrySec) },
      }
    );
  }

  const params = getQuoteUploadSignature();
  if (!params) {
    return NextResponse.json(
      { error: "Image uploads are not configured on the server." },
      { status: 503 }
    );
  }
  return NextResponse.json(params);
}
