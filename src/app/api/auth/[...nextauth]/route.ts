// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { LoginRateLimit } from "~/server/rateLimit";
import { getClientIp } from "~/server/ip";
import { NextRequest } from "next/server";
import { authOptions } from "~/server/auth";

// NextAuth handler (App Router compatible)
const handler = NextAuth(authOptions);

// Rate-limited wrapper for NextRequest
export async function POST(request: NextRequest) {
  const url = new URL(request.url);

  if (url.pathname.endsWith("/callback/credentials")) {
    const ip = await getClientIp(request);
    const { success } = await LoginRateLimit.limit(ip);

    if (!success) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return handler(request);
}

export function GET(request: NextRequest) {
  return handler(request);
}
