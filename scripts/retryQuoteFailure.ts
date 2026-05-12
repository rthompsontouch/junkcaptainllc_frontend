/**
 * Retry a failed public quote submission from the CLI (same logic as dashboard / API).
 *
 * Usage:
 *   npm run retry-quote -- <requestId | failureMongoId>
 *
 * Loads `.env` then `.env.local` (local overrides) before any app modules.
 */
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

async function main() {
  const key = process.argv[2]?.trim();
  if (!key) {
    console.error("Usage: npm run retry-quote -- <requestId | failureMongoId>");
    console.error("  requestId      — UUID shown to the customer in the quote dialog");
    console.error("  failureMongoId — _id from the Quote issues table or MongoDB");
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is required (set in .env or .env.local)");
    process.exit(1);
  }

  const mongoose = (await import("mongoose")).default;
  const { retryQuoteFailureByKey } = await import("../src/lib/services/quoteFailureRetry");

  try {
    const result = await retryQuoteFailureByKey(key);
    console.log("Retry succeeded.");
    console.log("  customerId:", result.customerId);
    console.log("  logId:     ", result.logId);
    console.log("  requestId: ", result.requestId);
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  } finally {
    await mongoose.disconnect().catch(() => undefined);
  }
}

main();
