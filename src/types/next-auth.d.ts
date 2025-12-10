import type { User } from "@prisma/client";
declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    name: string | null;
    email?: string | null;
    subscriptionPlan?: string | null;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: User;
  }
}
