import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";
import type { NextAuthOptions } from "next-auth";


export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) return null;

        const isCorrect = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isCorrect) return null;

        return {
          id: user.id,
          username: user.username,
          name: user.name ?? "",
        };
      },
    }),
  ],
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.user = {
        id: user.id,
        username: user.username,
        name: user.name,
      };
    }
    return token;
  },

  async session({ session, token }) {
    if (token.user) {
      session.user = token.user as typeof session.user;
    }
    return session;
  },
},
};

const handler = NextAuth(authOptions) as unknown as (
  req: Request,
  res: Response
) => void;

export { handler as GET, handler as POST };



