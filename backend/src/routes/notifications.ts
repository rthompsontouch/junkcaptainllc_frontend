import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { Notification } from "../models/Notification.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

function toApiNotification(
  doc: { _id: mongoose.Types.ObjectId; customerId: mongoose.Types.ObjectId; [key: string]: unknown }
) {
  const obj =
    "toObject" in doc && typeof (doc as { toObject: () => Record<string, unknown> }).toObject === "function"
      ? (doc as { toObject: () => Record<string, unknown> }).toObject()
      : doc;
  return {
    id: (obj._id as mongoose.Types.ObjectId).toString(),
    customerId: (obj.customerId as mongoose.Types.ObjectId).toString(),
    type: obj.type,
    read: obj.read,
    createdAt: (obj as { createdAt?: Date }).createdAt?.toISOString?.() ?? new Date().toISOString(),
  };
}

router.get("/", async (req: Request, res: Response) => {
  try {
    const docs = await Notification.find().sort({ createdAt: -1 });
    res.json(docs.map((d) => toApiNotification(d as unknown as { _id: mongoose.Types.ObjectId; customerId: mongoose.Types.ObjectId })));
  } catch (err) {
    console.error("Fetch notifications error:", err);
    res.status(500).json({ error: "Failed to load notifications" });
  }
});

export default router;
