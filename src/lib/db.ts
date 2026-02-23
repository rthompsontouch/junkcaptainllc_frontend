import mongoose from "mongoose";

type MongooseConnection = Awaited<ReturnType<typeof mongoose.connect>>;

declare global {
  // eslint-disable-next-line no-var
  var __mongoose_cache: { conn: MongooseConnection | null; promise: Promise<MongooseConnection> | null } | undefined;
}

const cached = global.__mongoose_cache ?? { conn: null, promise: null };
if (!global.__mongoose_cache) global.__mongoose_cache = cached;

export async function connectDB(): Promise<MongooseConnection> {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn as MongooseConnection;
}
