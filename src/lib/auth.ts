import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export interface JwtPayload {
  userId: string;
  email: string;
}

export function getAuthFromRequest(request: NextRequest): JwtPayload | null {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;

  const token = auth.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function requireAuth(request: NextRequest): { user: JwtPayload } | { error: Response } {
  const user = getAuthFromRequest(request);
  if (!user) {
    return {
      error: new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    };
  }
  return { user };
}
