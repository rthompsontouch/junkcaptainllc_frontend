/**
 * Run once to create an admin user for dashboard login.
 * Usage: npm run seed
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../src/lib/models/User";

const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@junkcaptainllc.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Junk4God!";

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI required. Add it to .env (copy from .env.example)");
    process.exit(1);
  }

  await mongoose.connect(uri);

  const existing = await User.findOne({ email: EMAIL });
  if (existing) {
    console.log("Admin user already exists:", EMAIL);
    process.exit(0);
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
