import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { QuoteFailureLog, type IQuoteFailureLog } from "@/lib/models/QuoteFailureLog";
import { PotentialCustomer } from "@/lib/models/PotentialCustomer";
import { Notification } from "@/lib/models/Notification";
import {
  createPotentialLeadDoc,
  finalizeQuoteSideEffects,
  type QuotePayload,
} from "@/lib/services/quotePipeline";
import { sendQuoteNotification, sendQuoteConfirmationToCustomer } from "@/lib/services/email";

async function ensureNotificationAndEmailsForExistingLead(
  customerId: mongoose.Types.ObjectId
): Promise<void> {
  const doc = await PotentialCustomer.findById(customerId);
  if (!doc) {
    throw new Error("Saved lead not found; it may have been removed.");
  }
  const existing = await Notification.findOne({ customerId: doc._id, type: "new_quote" });
  if (!existing) {
    await Notification.create({
      customerId: doc._id,
      type: "new_quote",
      read: false,
    });
  }
  await sendQuoteNotification({
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    address: doc.address,
    message: doc.notes,
    imageCount: doc.images,
    imageUrls: doc.imageUrls,
  });
  await sendQuoteConfirmationToCustomer({
    name: doc.name,
    email: doc.email,
  });
}

const OBJECT_ID_HEX = /^[a-fA-F0-9]{24}$/;

/** Resolve a dashboard / Mongo id or a public quote `requestId` (UUID) to a failure log document. */
export async function findQuoteFailureLogByKey(
  idOrRequestId: string
): Promise<IQuoteFailureLog | null> {
  await connectDB();
  const key = idOrRequestId.trim();
  if (!key) return null;

  if (OBJECT_ID_HEX.test(key)) {
    const byId = await QuoteFailureLog.findById(key);
    if (byId) return byId;
  }

  return QuoteFailureLog.findOne({ requestId: key }).sort({ createdAt: -1 }).exec();
}

export type QuoteFailureRetryResult = {
  customerId: string;
  logId: string;
  requestId: string;
};

/**
 * Same behavior as POST /api/quote-failures/retry: create lead and/or notifications, mark log resolved.
 */
export async function executeQuoteFailureRetry(
  log: IQuoteFailureLog
): Promise<QuoteFailureRetryResult> {
  if (log.resolved) {
    throw new Error("This entry was already retried or dismissed");
  }

  const payload: QuotePayload = {
    name: log.name,
    email: log.email,
    phone: log.phone,
    address: log.address,
    message: log.message,
    imageUrls: log.imageUrls ?? [],
  };

  let customerId: mongoose.Types.ObjectId;

  if (log.potentialCustomerId) {
    customerId = log.potentialCustomerId;
    await ensureNotificationAndEmailsForExistingLead(customerId);
  } else {
    const doc = await createPotentialLeadDoc(payload);
    customerId = doc._id as mongoose.Types.ObjectId;
    await finalizeQuoteSideEffects(doc);
  }

  log.resolved = true;
  log.resolvedAt = new Date();
  log.retriedCustomerId = customerId;
  await log.save();

  return {
    customerId: customerId.toString(),
    logId: log._id.toString(),
    requestId: log.requestId,
  };
}

/** Used by CLI and tests: lookup by Mongo `_id` or by `requestId` UUID. */
export async function retryQuoteFailureByKey(idOrRequestId: string): Promise<QuoteFailureRetryResult> {
  const log = await findQuoteFailureLogByKey(idOrRequestId);
  if (!log) {
    throw new Error("No quote failure log found for that id");
  }
  return executeQuoteFailureRetry(log);
}
