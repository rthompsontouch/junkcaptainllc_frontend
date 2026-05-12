import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  createPotentialLeadDoc,
  finalizeQuoteSideEffects,
  type QuotePayload,
} from "@/lib/services/quotePipeline";
import { recordQuoteFailure } from "@/lib/services/quoteFailureLog";
import { takeRateLimitToken } from "@/lib/rateLimitMemory";
import { getRateLimitClientKey } from "@/lib/requestClientKey";

const MAX_IMAGES = 4;
const QUOTE_SUBMIT_WINDOW_MS = 60_000;
const QUOTE_SUBMIT_MAX_PER_WINDOW = 15;

type ParseResult =
  | { ok: true; payload: QuotePayload }
  | { ok: false; status: number; error: string; partial?: QuotePayload };

function validateImageUrls(urls: string[], cloudName: string | undefined): string | null {
  if (urls.length > MAX_IMAGES) {
    return `Maximum ${MAX_IMAGES} images allowed`;
  }
  if (!cloudName && urls.length > 0) {
    return "Photo links are not accepted when image hosting is not configured";
  }
  for (const u of urls) {
    if (typeof u !== "string" || !u.startsWith("https://")) {
      return "Invalid image link";
    }
  }
  if (cloudName && urls.length > 0) {
    const prefix = `https://res.cloudinary.com/${cloudName}/`;
    if (!urls.every((u) => u.startsWith(prefix))) {
      return "Photo links must come from this site’s upload process";
    }
  }
  return null;
}

async function parseQuoteRequest(request: NextRequest): Promise<ParseResult> {
  const ct = request.headers.get("content-type") || "";

  if (ct.includes("application/json")) {
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return { ok: false, status: 400, error: "Invalid JSON body" };
    }

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const address = String(body.address ?? "").trim();
    const message = String(body.message ?? "").trim();
    const rawUrls = body.imageUrls;
    const imageUrls = Array.isArray(rawUrls)
      ? rawUrls.filter((x): x is string => typeof x === "string").slice(0, MAX_IMAGES)
      : [];

    if (!name || !email || !phone || !address) {
      return {
        ok: false,
        status: 400,
        error: "Name, email, phone, and address are required",
        partial: { name, email, phone, address, message, imageUrls },
      };
    }

    return { ok: true, payload: { name, email, phone, address, message, imageUrls } };
  }

  if (ct.includes("multipart/form-data")) {
    const formData = await request.formData();
    const name = (formData.get("name") as string)?.trim() ?? "";
    const email = (formData.get("email") as string)?.trim() ?? "";
    const phone = (formData.get("phone") as string)?.trim() ?? "";
    const address = (formData.get("address") as string)?.trim() ?? "";
    const message = ((formData.get("message") as string) ?? "").trim();

    const imageFiles = formData.getAll("images") as File[];
    const withBytes = imageFiles.filter((f) => f instanceof File && f.size > 0);
    if (withBytes.length > 0) {
      return {
        ok: false,
        status: 400,
        error:
          "This site no longer accepts large photo attachments through this form. Please refresh the page and try again so photos upload securely.",
        partial: { name, email, phone, address, message, imageUrls: [] },
      };
    }

    if (!name || !email || !phone || !address) {
      return {
        ok: false,
        status: 400,
        error: "Name, email, phone, and address are required",
        partial: { name, email, phone, address, message, imageUrls: [] },
      };
    }

    return { ok: true, payload: { name, email, phone, address, message, imageUrls: [] } };
  }

  return {
    ok: false,
    status: 415,
    error: "Please submit the quote using the form on our website.",
  };
}

export async function POST(request: NextRequest) {
  const requestId = randomUUID();

  const clientKey = getRateLimitClientKey(request);
  const rl = takeRateLimitToken(
    `quote-submit:${clientKey}`,
    QUOTE_SUBMIT_MAX_PER_WINDOW,
    QUOTE_SUBMIT_WINDOW_MS
  );
  if (!rl.ok) {
    const retrySec = Math.max(1, Math.ceil(rl.retryAfterMs / 1000));
    return NextResponse.json(
      {
        error:
          "Too many quote requests from this network. Please wait a minute and try again.",
        requestId,
      },
      {
        status: 429,
        headers: { "Retry-After": String(retrySec) },
      }
    );
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  const parsed = await parseQuoteRequest(request);
  if (!parsed.ok) {
    const snap = parsed.partial ?? {
      name: "",
      email: "",
      phone: "",
      address: "",
      message: "",
      imageUrls: [] as string[],
    };
    await recordQuoteFailure({
      requestId,
      httpStatus: parsed.status,
      errorCode: "validation",
      errorMessage: parsed.error,
      stage: "parse",
      ...snap,
    });
    return NextResponse.json({ error: parsed.error, requestId }, { status: parsed.status });
  }

  const { payload } = parsed;
  const imgErr = validateImageUrls(payload.imageUrls, cloudName);
  if (imgErr) {
    await recordQuoteFailure({
      requestId,
      httpStatus: 400,
      errorCode: "invalid_images",
      errorMessage: imgErr,
      stage: "validation",
      ...payload,
    });
    return NextResponse.json({ error: imgErr, requestId }, { status: 400 });
  }

  try {
    const doc = await createPotentialLeadDoc(payload);
    try {
      await finalizeQuoteSideEffects(doc);
    } catch (finalizeErr) {
      const msg = finalizeErr instanceof Error ? finalizeErr.message : String(finalizeErr);
      await recordQuoteFailure({
        requestId,
        httpStatus: 500,
        errorCode: "finalize",
        errorMessage: msg,
        stage: "notification_or_email",
        ...payload,
        potentialCustomerId: doc._id.toString(),
      });
      return NextResponse.json(
        {
          error:
            "Your request was saved, but we could not finish email or dashboard notifications. Please call us or try again—we have your details on file.",
          requestId,
          partialSuccess: true,
          customerId: doc._id.toString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! We'll be in touch soon with your free quote.",
      id: doc._id.toString(),
      requestId,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await recordQuoteFailure({
      requestId,
      httpStatus: 500,
      errorCode: "database",
      errorMessage: msg,
      stage: "database",
      ...payload,
    });
    console.error("Quote submission error:", err);
    return NextResponse.json(
      {
        error:
          "We could not save your request right now (often a temporary database issue). Please try again in a few minutes or call us.",
        requestId,
      },
      { status: 500 }
    );
  }
}
