import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { QuoteFailureLog } from "@/lib/models/QuoteFailureLog";

export type RecordQuoteFailureParams = {
  requestId: string;
  httpStatus: number;
  errorCode: string;
  errorMessage: string;
  stage: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  message?: string;
  imageUrls?: string[];
  potentialCustomerId?: string;
};

export async function recordQuoteFailure(p: RecordQuoteFailureParams): Promise<void> {
  try {
    await connectDB();
    await QuoteFailureLog.create({
      requestId: p.requestId,
      name: p.name ?? "",
      email: p.email ?? "",
      phone: p.phone ?? "",
      address: p.address ?? "",
      message: p.message ?? "",
      imageUrls: p.imageUrls ?? [],
      httpStatus: p.httpStatus,
      errorCode: p.errorCode,
      errorMessage: p.errorMessage.slice(0, 2000),
      stage: p.stage,
      potentialCustomerId:
        p.potentialCustomerId && mongoose.Types.ObjectId.isValid(p.potentialCustomerId)
          ? new mongoose.Types.ObjectId(p.potentialCustomerId)
          : undefined,
      resolved: false,
    });
  } catch (err) {
    console.error("QuoteFailureLog write failed:", err);
  }
}
