import { NextRequest, NextResponse } from "next/server";
import { findQuoteFailureLogByKey, executeQuoteFailureRetry } from "@/lib/services/quoteFailureRetry";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if ("error" in auth) return auth.error;

  let lookupKey: string;
  try {
    const body = (await request.json()) as {
      failureId?: string;
      id?: string;
      requestId?: string;
    };
    lookupKey = (body.failureId ?? body.id ?? body.requestId ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!lookupKey) {
    return NextResponse.json(
      { error: "Provide failureId (Mongo id) or requestId (UUID from the quote form)" },
      { status: 400 }
    );
  }

  try {
    const log = await findQuoteFailureLogByKey(lookupKey);
    if (!log) {
      return NextResponse.json({ error: "Log entry not found" }, { status: 404 });
    }

    const result = await executeQuoteFailureRetry(log);

    return NextResponse.json({
      success: true,
      customerId: result.customerId,
      logId: result.logId,
      requestId: result.requestId,
      message: "Quote lead processed successfully.",
    });
  } catch (err) {
    console.error("Quote failure retry error:", err);
    const msg = err instanceof Error ? err.message : "Retry failed";
    const status =
      msg.includes("already retried") || msg.includes("already marked") ? 400 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
