import { Router, Request, Response } from "express";
import { PotentialCustomer } from "../models/PotentialCustomer.js";
import { Notification } from "../models/Notification.js";
import { sendQuoteNotification } from "../services/email.js";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, message, imageCount = 0 } = req.body;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !address?.trim()) {
      res.status(400).json({
        error: "Name, email, phone, and address are required",
      });
      return;
    }

    const doc = await PotentialCustomer.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      service: "Quote Request",
      date: new Date().toISOString().split("T")[0],
      images: typeof imageCount === "number" ? imageCount : 0,
      notes: (message || "").trim(),
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
    });

    res.status(200).json({
      success: true,
      message: "Thank you! We'll be in touch soon with your free quote.",
      id: doc._id.toString(),
    });
  } catch (err) {
    console.error("Quote submission error:", err);
    res.status(500).json({
      error: "Something went wrong. Please try again or call us.",
    });
  }
});

export default router;
