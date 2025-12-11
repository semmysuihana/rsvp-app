import NextAuth from "next-auth";
import { LoginRateLimit } from "~/server/rateLimit";
import { getClientIp } from "~/server/ip";
import { authOptions } from "~/server/auth";

const handler = NextAuth(authOptions);

export async function POST(req: Request, res: any) {
  const url = new URL(req.url);

  if (url.pathname.endsWith("/callback/credentials")) {
    const ip = await getClientIp(req);
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

  return handler(req, res);
}

export async function GET(req: Request, res: any) {
  return handler(req, res);
}
