import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPotentialCustomer extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  date: string;
  images: number;
  imageUrls?: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const PotentialCustomerSchema = new Schema<IPotentialCustomer>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    service: { type: String, default: "Quote Request", trim: true },
    date: { type: String, required: true },
    images: { type: Number, default: 0 },
    imageUrls: [{ type: String }],
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const PotentialCustomer: Model<IPotentialCustomer> =
  mongoose.models.PotentialCustomer ??
  mongoose.model<IPotentialCustomer>("PotentialCustomer", PotentialCustomerSchema);
