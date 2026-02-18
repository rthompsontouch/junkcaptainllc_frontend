import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { Notification } from "../models/Notification.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

router.put("/", async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const doc = await Notification.findByIdAndUpdate(
      id,
      { $set: { read: true } },
      { new: true }
    );

    if (!doc) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ error: "Failed to mark read" });
  }
});

export default router;
