import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import quoteRouter from "./routes/quote.js";
import authRouter from "./routes/auth.js";
import customersRouter from "./routes/customers.js";
import notificationsRouter from "./routes/notifications.js";
import notificationsReadRouter from "./routes/notificationsRead.js";

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(cors({ origin: true }));
app.use(express.json());

app.use("/api/quote", quoteRouter);
app.use("/api/login", authRouter);
app.use("/api/customers", customersRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/notifications/read", notificationsReadRouter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
}

start();
