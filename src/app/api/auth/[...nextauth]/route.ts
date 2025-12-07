// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";
import type { NextAuthOptions } from "next-auth";
import { LoginRateLimit } from "~/server/rateLimit";
import { getClientIp } from "~/server/ip";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type TurnstileResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Login",
      credentials: {
        username: {},
        password: {},
        turnstile: {},
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password || !credentials?.turnstile)
          return null;

        // VERIFY TURNSTILE
        const formData = new FormData();
        formData.append("secret", process.env.TURNSTILE_SECRET_KEY!);
        formData.append("response", credentials.turnstile);

        const verify = await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          { method: "POST", body: formData }
        );

        if (!verify.ok) return null;

        const data = (await verify.json()) as TurnstileResponse;
        if (!data.success) return null;

        // USER CHECK
        const user = await db.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) return null;

        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          username: user.username,
          name: user.name ?? "",
        };
      },
    }),
  ],

  callbacks: {
  async jwt({ token, user }: { token: JWT; user?: User }) {
    if (user) token.user = user;
    return token;
  },

  async session({ session, token }: { session: Session; token: JWT }) {
          const u = token.user as Partial<User>;

      session.user = {
        id: String(u.id),
        username: String(u.username),
        name: u.name ?? null,
        email: u.email ?? null,
        image: u.image ?? null,
      } as User;
    return session;
  },
},

};

const handler = NextAuth(authOptions) as (
  req: Request,
  res: Response
) => Promise<Response>;


async function rateLimitedHandler(req: Request, res: Response) {
  const pathname = new URL(
  req.url,
  process.env.NEXTAUTH_URL
).pathname;


  if (req.method === "POST" && pathname.endsWith("/callback/credentials")) {
    const ip = await getClientIp(req);
    const { success } = await LoginRateLimit.limit(ip);

    if (!success) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return handler(req, res);
}

export { rateLimitedHandler as GET, rateLimitedHandler as POST };
