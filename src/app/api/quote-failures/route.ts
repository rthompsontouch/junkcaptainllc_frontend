import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { QuoteFailureLog } from "@/lib/models/QuoteFailureLog";
import { requireAuth } from "@/lib/auth";

function serialize(doc: { _id: mongoose.Types.ObjectId; toObject: () => Record<string, unknown> }) {
  const o = doc.toObject() as Record<string, unknown>;
  const { _id, potentialCustomerId, retriedCustomerId, ...rest } = o;
  return {
    id: (_id as mongoose.Types.ObjectId).toString(),
    potentialCustomerId: potentialCustomerId
      ? String(potentialCustomerId)
      : undefined,
    retriedCustomerId: retriedCustomerId ? String(retriedCustomerId) : undefined,
    ...rest,
  };
}

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const unresolvedOnly = searchParams.get("unresolved") === "1";
    const q = unresolvedOnly ? { resolved: false } : {};
    const docs = await QuoteFailureLog.find(q).sort({ createdAt: -1 }).limit(200).exec();
    return NextResponse.json(docs.map((d) => serialize(d)));
  } catch (err) {
    console.error("List quote failures error:", err);
    return NextResponse.json({ error: "Failed to load logs" }, { status: 500 });
  }
}
