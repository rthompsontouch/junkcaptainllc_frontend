/**
 * Run once to create an admin user for dashboard login.
 * Usage: npx tsx scripts/seedAdmin.ts  (from backend/) or npm run seed (from root)
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Try multiple paths so it works from root (npm run seed) or backend/ (cd backend && npm run seed)
[path.resolve(__dirname, "../.env"), path.resolve(process.cwd(), ".env"), path.resolve(process.cwd(), "backend", ".env")].forEach((p) => dotenv.config({ path: p }));
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../src/models/User.js";

const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@junkcaptainllc.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI required. Add it to backend/.env (copy from backend/.env.example)");
    process.exit(1);
  }

  await mongoose.connect(uri);

  const existing = await User.findOne({ email: EMAIL });
  if (existing) {
    await User.deleteOne({ email: EMAIL });
    console.log("Removed existing admin user, recreating...");
  }

  const hash = await bcrypt.hash(PASSWORD, 10);
  await User.create({
    email: EMAIL,
    passwordHash: hash,
    name: "Admin",
  });

  console.log("Admin user created:", EMAIL);
  console.log("Password:", PASSWORD);
  console.log("Change the password after first login!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
