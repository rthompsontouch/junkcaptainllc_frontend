import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Notification } from "@/lib/models/Notification";
import { requireAuth } from "@/lib/auth";

function toApiNotification(
  doc: { _id: mongoose.Types.ObjectId; customerId: mongoose.Types.ObjectId; [key: string]: unknown }
) {
  const obj =
    "toObject" in doc && typeof (doc as unknown as { toObject: () => Record<string, unknown> }).toObject === "function"
      ? (doc as unknown as { toObject: () => Record<string, unknown> }).toObject()
      : doc;
  return {
    id: (obj._id as mongoose.Types.ObjectId).toString(),
    customerId: (obj.customerId as mongoose.Types.ObjectId).toString(),
    type: obj.type,
    read: obj.read,
    createdAt: (obj as { createdAt?: Date }).createdAt?.toISOString?.() ?? new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();

    const docs = await Notification.find().sort({ createdAt: -1 });
    return NextResponse.json(
      docs.map((d) => toApiNotification(d as unknown as { _id: mongoose.Types.ObjectId; customerId: mongoose.Types.ObjectId }))
    );
  } catch (err) {
    console.error("Fetch notifications error:", err);
    return NextResponse.json(
      { error: "Failed to load notifications" },
      { status: 500 }
    );
  }
}
