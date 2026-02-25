import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { PotentialCustomer } from "@/lib/models/PotentialCustomer";
import { Notification } from "@/lib/models/Notification";
import { sendQuoteNotification, sendQuoteConfirmationToCustomer } from "@/lib/services/email";
import { uploadToCloudinary } from "@/lib/services/cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 4;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();
    const address = (formData.get("address") as string)?.trim();
    const message = ((formData.get("message") as string) ?? "").trim();

    if (!name || !email || !phone || !address) {
      return NextResponse.json(
        { error: "Name, email, phone, and address are required" },
        { status: 400 }
      );
    }

    const imageFiles = formData.getAll("images") as File[];
    const validImages = imageFiles.filter(
      (f) => f instanceof File && f.size > 0 && f.type.startsWith("image/")
    );

    if (validImages.length > MAX_IMAGES) {
      return NextResponse.json(
        { error: "Maximum 4 images allowed" },
        { status: 400 }
      );
    }

    for (const file of validImages) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "Each image must be under 5MB" },
          { status: 400 }
        );
      }
    }

    await connectDB();

    const imageUrls: string[] = [];
    const hasCloudinary =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    if (validImages.length > 0 && !hasCloudinary) {
      console.warn(
        "Cloudinary not configured: Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to backend/.env (or project root .env.local)"
      );
    }

    if (hasCloudinary) {
      for (const file of validImages) {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const url = await uploadToCloudinary(buffer);
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

    await sendQuoteConfirmationToCustomer({
      name: doc.name,
      email: doc.email,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! We'll be in touch soon with your free quote.",
      id: doc._id.toString(),
    });
  } catch (err) {
    console.error("Quote submission error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or call us." },
      { status: 500 }
    );
  }
}
