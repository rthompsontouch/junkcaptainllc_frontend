import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  customerId: mongoose.Types.ObjectId;
  type: "new_quote";
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    customerId: { type: Schema.Types.ObjectId, required: true, ref: "PotentialCustomer" },
    type: { type: String, enum: ["new_quote"], default: "new_quote" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification: Model<INotification> =
  mongoose.models.Notification ??
  mongoose.model<INotification>("Notification", NotificationSchema);
