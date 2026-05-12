import { PotentialCustomer, type IPotentialCustomer } from "@/lib/models/PotentialCustomer";
import { Notification } from "@/lib/models/Notification";
import { sendQuoteNotification, sendQuoteConfirmationToCustomer } from "@/lib/services/email";
import { connectDB } from "@/lib/db";

export type QuotePayload = {
  name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  imageUrls: string[];
};

export async function createPotentialLeadDoc(
  payload: QuotePayload
): Promise<IPotentialCustomer> {
  await connectDB();
  return PotentialCustomer.create({
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    address: payload.address,
    service: "Quote Request",
    date: new Date().toISOString().split("T")[0],
    images: payload.imageUrls.length,
    imageUrls: payload.imageUrls,
    notes: payload.message,
  });
}

export async function finalizeQuoteSideEffects(doc: IPotentialCustomer): Promise<void> {
  await Notification.create({
    customerId: doc._id,
    type: "new_quote",
    read: false,
  });

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

export async function runFullQuotePipeline(payload: QuotePayload) {
  const doc = await createPotentialLeadDoc(payload);
  await finalizeQuoteSideEffects(doc);
  return doc;
}
