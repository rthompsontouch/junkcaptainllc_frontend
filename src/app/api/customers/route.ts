import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { PotentialCustomer } from "@/lib/models/PotentialCustomer";
import { ActiveCustomer } from "@/lib/models/ActiveCustomer";
import { Notification } from "@/lib/models/Notification";
import { requireAuth } from "@/lib/auth";

function toApiCustomer(doc: { _id: mongoose.Types.ObjectId; toObject?: () => Record<string, unknown> }) {
  const obj = (
    "toObject" in doc && typeof doc.toObject === "function"
      ? doc.toObject()
      : doc
  ) as Record<string, unknown>;
  const { _id, ...rest } = obj;
  return {
    id: (_id as mongoose.Types.ObjectId).toString(),
    ...rest,
  };
}

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const checkDuplicates = searchParams.get("checkDuplicates");

    if (checkDuplicates) {
      const potential = await PotentialCustomer.findById(checkDuplicates);
      if (!potential) {
        return NextResponse.json([]);
      }
      const email = (potential.email || "").trim().toLowerCase();
      const phone = (potential.phone || "").replace(/\D/g, "");
      const seen = new Set<string>();
      const ids: mongoose.Types.ObjectId[] = [];
      if (email) {
        const byEmail = await ActiveCustomer.find({
          email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
        });
        for (const d of byEmail) {
          const id = d._id.toString();
          if (!seen.has(id)) {
            seen.add(id);
            ids.push(d._id);
          }
        }
      }
      if (phone && phone.length >= 7) {
        const phoneRegex = new RegExp(phone.split("").join("\\D*"), "i");
        const byPhone = await ActiveCustomer.find({
          phone: { $regex: phoneRegex },
        });
        for (const d of byPhone) {
          const id = d._id.toString();
          if (!seen.has(id)) {
            seen.add(id);
            ids.push(d._id);
          }
        }
      }
      if (ids.length === 0) {
        return NextResponse.json([]);
      }
      const docs = await ActiveCustomer.find({ _id: { $in: ids } });
      return NextResponse.json(docs.map((d) => toApiCustomer(d)));
    }

    if (type === "potential") {
      const docs = await PotentialCustomer.find().sort({ createdAt: -1 });
      return NextResponse.json(docs.map((d) => toApiCustomer(d)));
    }
    if (type === "active") {
      const docs = await ActiveCustomer.find().sort({ updatedAt: -1 });
      return NextResponse.json(docs.map((d) => toApiCustomer(d)));
    }

    const [potential, active] = await Promise.all([
      PotentialCustomer.find().sort({ createdAt: -1 }),
      ActiveCustomer.find().sort({ updatedAt: -1 }),
    ]);
    return NextResponse.json({
      potential: potential.map((d) => toApiCustomer(d)),
      active: active.map((d) => toApiCustomer(d)),
    });
  } catch (err) {
    console.error("Fetch customers error:", err);
    return NextResponse.json(
      { error: "Failed to load customers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();

    const { name, email, phone, address, service, images, notes } = await request.json();

    const doc = await PotentialCustomer.create({
      name: name ?? "",
      email: email ?? "",
      phone: phone ?? "",
      address: address ?? "",
      service: service ?? "Quote Request",
      images: images ?? 0,
      notes: notes ?? "",
      date: new Date().toISOString().split("T")[0],
    });

    await Notification.create({
      customerId: doc._id,
      type: "new_quote",
      read: false,
    });

    return NextResponse.json(toApiCustomer(doc), { status: 201 });
  } catch (err) {
    console.error("Create customer error:", err);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();

    const body = await request.json();
    const { action, id, type, ...data } = body;

    if (action === "addService") {
      const { date, note } = body;
      if (!date?.trim()) {
        return NextResponse.json(
          { error: "Service date is required" },
          { status: 400 }
        );
      }
      const doc = await ActiveCustomer.findById(id);
      if (!doc) {
        return NextResponse.json(
          { error: "Customer not found" },
          { status: 404 }
        );
      }
      const serviceRecord = { date: date.trim(), note: (note || "").trim() };
      doc.serviceHistory = doc.serviceHistory || [];
      doc.serviceHistory.unshift(serviceRecord);
      doc.lastServiceDate = serviceRecord.date;
      doc.serviceNote = serviceRecord.note;
      await doc.save();
      return NextResponse.json(toApiCustomer(doc));
    }

    if (action === "merge") {
      const { potentialId, activeId } = body;
      const potential = await PotentialCustomer.findById(potentialId);
      const active = await ActiveCustomer.findById(activeId);
      if (!potential || !active) {
        return NextResponse.json(
          { error: "Customer not found" },
          { status: 404 }
        );
      }
      const mergeDate = new Date().toISOString().split("T")[0];
      const mergeNote = `Merged from quote request: ${(potential.notes || "").trim() || "No notes"}`;
      active.serviceHistory = active.serviceHistory || [];
      active.serviceHistory.unshift({ date: mergeDate, note: mergeNote });
      active.lastServiceDate = mergeDate;
      active.serviceNote = mergeNote;
      if (potential.notes?.trim()) {
        active.notes = [active.notes, potential.notes].filter(Boolean).join("\n\n---\n\n");
      }
      await active.save();
      await PotentialCustomer.findByIdAndDelete(potentialId);
      await Notification.deleteMany({ customerId: potentialId });
      return NextResponse.json(toApiCustomer(active));
    }

    if (action === "convert") {
      const doc = await PotentialCustomer.findById(id);
      if (!doc) {
        return NextResponse.json(
          { error: "Customer not found" },
          { status: 404 }
        );
      }

      const firstServiceDate = new Date().toISOString().split("T")[0];
      const firstServiceNote = "Converted from potential customer";
      const active = await ActiveCustomer.create({
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        address: doc.address,
        service: doc.service,
        lastServiceDate: firstServiceDate,
        serviceNote: firstServiceNote,
        serviceHistory: [{ date: firstServiceDate, note: firstServiceNote }],
        images: doc.images,
        imageUrls: doc.imageUrls,
        notes: doc.notes,
      });

      await PotentialCustomer.findByIdAndDelete(id);
      return NextResponse.json(toApiCustomer(active));
    }

    const idValid = mongoose.Types.ObjectId.isValid(id);
    if (!idValid) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    if (type === "potential") {
      const doc = await PotentialCustomer.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
      );
      if (!doc) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(toApiCustomer(doc));
    }

    if (type === "active") {
      const doc = await ActiveCustomer.findById(id);
      if (!doc) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      if (data.lastServiceDate !== undefined || data.serviceNote !== undefined) {
        const history = doc.serviceHistory || [];
        const updatedDate = data.lastServiceDate ?? doc.lastServiceDate;
        const updatedNote = data.serviceNote ?? doc.serviceNote;
        if (history.length > 0) {
          history[0] = { date: updatedDate, note: updatedNote };
        } else {
          history.unshift({ date: updatedDate, note: updatedNote });
        }
        data.serviceHistory = history;
      }
      Object.assign(doc, data);
      await doc.save();
      return NextResponse.json(toApiCustomer(doc));
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err) {
    console.error("Update customer error:", err);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = requireAuth(request);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();

    const { id, type } = await request.json();

    const idValid = mongoose.Types.ObjectId.isValid(id);
    if (!idValid) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    if (type === "potential") {
      const doc = await PotentialCustomer.findByIdAndDelete(id);
      if (!doc) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      await Notification.deleteMany({ customerId: id });
      return NextResponse.json({ success: true });
    }

    if (type === "active") {
      const doc = await ActiveCustomer.findByIdAndDelete(id);
      if (!doc) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err) {
    console.error("Delete customer error:", err);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
