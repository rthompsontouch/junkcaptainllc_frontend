import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuoteFailureLog extends Document {
  requestId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  imageUrls: string[];
  httpStatus: number;
  errorCode: string;
  errorMessage: string;
  stage: string;
  /** If the lead row was created but a later step failed */
  potentialCustomerId?: mongoose.Types.ObjectId;
  resolved: boolean;
  resolvedAt?: Date;
  retriedCustomerId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteFailureLogSchema = new Schema<IQuoteFailureLog>(
  {
    requestId: { type: String, required: true, index: true },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    message: { type: String, default: "" },
    imageUrls: { type: [String], default: [] },
    httpStatus: { type: Number, required: true },
    errorCode: { type: String, default: "unknown" },
    errorMessage: { type: String, default: "" },
    stage: { type: String, default: "unknown" },
    potentialCustomerId: { type: Schema.Types.ObjectId, ref: "PotentialCustomer" },
    resolved: { type: Boolean, default: false, index: true },
    resolvedAt: { type: Date },
    retriedCustomerId: { type: Schema.Types.ObjectId, ref: "PotentialCustomer" },
  },
  { timestamps: true }
);

export const QuoteFailureLog: Model<IQuoteFailureLog> =
  mongoose.models.QuoteFailureLog ??
  mongoose.model<IQuoteFailureLog>("QuoteFailureLog", QuoteFailureLogSchema);
