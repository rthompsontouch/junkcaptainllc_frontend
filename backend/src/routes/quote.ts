import { Router, Request, Response } from "express";
import multer from "multer";
import { PotentialCustomer } from "../models/PotentialCustomer.js";
import { Notification } from "../models/Notification.js";
import { sendQuoteNotification } from "../services/email.js";
import { uploadToCloudinary } from "../services/cloudinary.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
}).fields([{ name: "images", maxCount: 4 }]);

router.post("/", upload, async (req: Request, res: Response) => {
  try {
    const body = req.body as Record<string, string>;
    const name = body.name?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim();
    const address = body.address?.trim();
    const message = (body.message ?? "").trim();

    if (!name || !email || !phone || !address) {
      res.status(400).json({
        error: "Name, email, phone, and address are required",
      });
      return;
    }

    const files = req.files as { images?: Express.Multer.File[] } | undefined;
    const imageFiles = files?.images ?? [];
    const imageUrls: string[] = [];

    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      for (const file of imageFiles) {
        try {
          const url = await uploadToCloudinary(file.buffer);
          imageUrls.push(url);
        } catch (err) {
          console.error("Cloudinary upload error:", err);
        }
      }
    }

    const doc = await PotentialCustomer.create({
      name,
      email,
      phone,
      address,
      service: "Quote Request",
      date: new Date().toISOString().split("T")[0],
      images: imageUrls.length,
      imageUrls,
      notes: message,
    });

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

    res.status(200).json({
      success: true,
      message: "Thank you! We'll be in touch soon with your free quote.",
      id: doc._id.toString(),
    });
  } catch (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({ error: "Each image must be under 5MB" });
        return;
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        res.status(400).json({ error: "Maximum 4 images allowed" });
        return;
      }
    }
    console.error("Quote submission error:", err);
    res.status(500).json({
      error: "Something went wrong. Please try again or call us.",
    });
  }
});

export default router;
