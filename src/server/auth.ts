import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";
import type { TurnstileResponse } from "~/types/auth";

// =======================
// Tipe untuk authorize
// =======================
type Credentials = {
  username: string;
  password: string;
  turnstile: string;
};

// =======================
// Tipe user dari database
// =======================
type AuthUser = {
  id: string;
  username: string;
  name: string | null;
  email: string | null;
  passwordHash: string;
  subscriptionPlan: string | null;
};

// =======================
// NextAuth Options
// =======================
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

      async authorize(credentials: Credentials | undefined) {
        if (
          !credentials?.username ||
          !credentials?.password ||
          !credentials?.turnstile
        ) {
          return null;
        }

        const username = credentials.username;
        const password = credentials.password;
        const turnstileToken = credentials.turnstile;

        // =======================
        // VERIFY TURNSTILE
        // =======================
        const formData = new FormData();
        formData.append("secret", process.env.TURNSTILE_SECRET_KEY!);
        formData.append("response", turnstileToken);

        const verifyResponse = await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          { method: "POST", body: formData }
        );

        if (!verifyResponse.ok) return null;

        const data = (await verifyResponse.json()) as TurnstileResponse;
        if (!data.success) return null;

        // =======================
        // USER CHECK DATABASE
        // =======================
        const user: AuthUser | null = await db.user.findUnique({
          where: { username },
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

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) return null;

        // =======================
        // RETURN USER
        // =======================
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
        token.user = user as NextAuthUser;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as NextAuthUser;
      }
      return session;
    },
  },
};
