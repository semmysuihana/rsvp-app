import NextAuth from "next-auth";
import { LoginRateLimit } from "~/server/rateLimit";
import { getClientIp } from "~/server/ip";
import type { NextRequest } from "next/server";
import { authOptions } from "~/server/auth";

// Type-safe handler wrapper
const handler = NextAuth(authOptions) as (req: NextRequest) => Promise<Response>;

/**
 * Rate-limited POST for credential callback
 */
export async function POST(request: NextRequest): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname.endsWith("/callback/credentials")) {
    const ip = await getClientIp(request);
    const { success } = await LoginRateLimit.limit(ip);

    if (!success) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded" }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  return handler(request);
}

/**
 * GET handler
 */
export async function GET(request: NextRequest): Promise<Response> {
  return handler(request);
}
