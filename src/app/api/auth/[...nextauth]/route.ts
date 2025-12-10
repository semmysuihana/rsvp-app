// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";
import type { NextAuthOptions } from "next-auth";
import { LoginRateLimit } from "~/server/rateLimit";
import { getClientIp } from "~/server/ip";
import type { User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { NextRequest } from "next/server";
import type { TurnstileResponse } from "~/types/auth";
import type { Session } from "next-auth";

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
        if (
          !credentials?.username ||
          !credentials?.password ||
          !credentials?.turnstile
        ) {
          return null;
        }

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
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            passwordHash: true,
            subscriptionPlan: true,
          },
        });

        if (!user) return null;

        const ok = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!ok) return null;

        return {
          id: user.id,
          username: user.username,
          name: user.name ?? "",
          subscriptionPlan: user.subscriptionPlan ?? null,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as User;
      }
      return session;
    },
  },
};

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
