import mongoose, { Schema, Document, Model } from "mongoose";

export interface IActiveCustomer extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  lastServiceDate: string;
  serviceNote: string;
  images: number;
  imageUrls?: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActiveCustomerSchema = new Schema<IActiveCustomer>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    service: { type: String, default: "Quote Request", trim: true },
    lastServiceDate: { type: String, required: true },
    serviceNote: { type: String, default: "" },
    images: { type: Number, default: 0 },
    imageUrls: [{ type: String }],
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ActiveCustomer: Model<IActiveCustomer> =
  mongoose.models.ActiveCustomer ??
  mongoose.model<IActiveCustomer>("ActiveCustomer", ActiveCustomerSchema);
