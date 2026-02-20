import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { PotentialCustomer } from "../models/PotentialCustomer.js";
import { ActiveCustomer } from "../models/ActiveCustomer.js";
import { Notification } from "../models/Notification.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

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

router.get("/", async (req: Request, res: Response) => {
  try {
    const type = req.query.type as string | undefined;
    const checkDuplicates = req.query.checkDuplicates as string | undefined;

    if (checkDuplicates) {
      const potential = await PotentialCustomer.findById(checkDuplicates);
      if (!potential) {
        res.json([]);
        return;
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
        res.json([]);
        return;
      }
      const docs = await ActiveCustomer.find({ _id: { $in: ids } });
      res.json(docs.map((d) => toApiCustomer(d)));
      return;
    }

    if (type === "potential") {
      const docs = await PotentialCustomer.find().sort({ createdAt: -1 });
      res.json(docs.map((d) => toApiCustomer(d)));
      return;
    }
    if (type === "active") {
      const docs = await ActiveCustomer.find().sort({ updatedAt: -1 });
      res.json(docs.map((d) => toApiCustomer(d)));
      return;
    }

    const [potential, active] = await Promise.all([
      PotentialCustomer.find().sort({ createdAt: -1 }),
      ActiveCustomer.find().sort({ updatedAt: -1 }),
    ]);
    res.json({
      potential: potential.map((d) => toApiCustomer(d)),
      active: active.map((d) => toApiCustomer(d)),
    });
  } catch (err) {
    console.error("Fetch customers error:", err);
    res.status(500).json({ error: "Failed to load customers" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, service, images, notes } = req.body;

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

    res.status(201).json(toApiCustomer(doc));
  } catch (err) {
    console.error("Create customer error:", err);
    res.status(500).json({ error: "Failed to create customer" });
  }
});

router.put("/", async (req: Request, res: Response) => {
  try {
    const { action, id, type, ...data } = req.body;

    if (action === "addService") {
      const { date, note } = req.body;
      if (!date?.trim()) {
        res.status(400).json({ error: "Service date is required" });
        return;
      }
      const doc = await ActiveCustomer.findById(id);
      if (!doc) {
        res.status(404).json({ error: "Customer not found" });
        return;
      }
      const serviceRecord = { date: date.trim(), note: (note || "").trim() };
      doc.serviceHistory = doc.serviceHistory || [];
      doc.serviceHistory.unshift(serviceRecord);
      doc.lastServiceDate = serviceRecord.date;
      doc.serviceNote = serviceRecord.note;
      await doc.save();
      res.json(toApiCustomer(doc));
      return;
    }

    if (action === "merge") {
      const { potentialId, activeId } = req.body;
      const potential = await PotentialCustomer.findById(potentialId);
      const active = await ActiveCustomer.findById(activeId);
      if (!potential || !active) {
        res.status(404).json({ error: "Customer not found" });
        return;
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
      res.json(toApiCustomer(active));
      return;
    }

    if (action === "convert") {
      const doc = await PotentialCustomer.findById(id);
      if (!doc) {
        res.status(404).json({ error: "Customer not found" });
        return;
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
      res.json(toApiCustomer(active));
      return;
    }

    const idValid = mongoose.Types.ObjectId.isValid(id);
    if (!idValid) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    if (type === "potential") {
      const doc = await PotentialCustomer.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
      );
      if (!doc) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(toApiCustomer(doc));
      return;
    }

    if (type === "active") {
      const doc = await ActiveCustomer.findById(id);
      if (!doc) {
        res.status(404).json({ error: "Not found" });
        return;
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
      res.json(toApiCustomer(doc));
      return;
    }

    res.status(400).json({ error: "Invalid type" });
  } catch (err) {
    console.error("Update customer error:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

router.delete("/", async (req: Request, res: Response) => {
  try {
    const { id, type } = req.body;

    const idValid = mongoose.Types.ObjectId.isValid(id);
    if (!idValid) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    if (type === "potential") {
      const doc = await PotentialCustomer.findByIdAndDelete(id);
      if (!doc) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      await Notification.deleteMany({ customerId: id });
      res.json({ success: true });
      return;
    }

    if (type === "active") {
      const doc = await ActiveCustomer.findByIdAndDelete(id);
      if (!doc) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json({ success: true });
      return;
    }

    res.status(400).json({ error: "Invalid type" });
  } catch (err) {
    console.error("Delete customer error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
