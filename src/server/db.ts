// src/server/db.ts
import { PrismaClient } from "~/app/generated/prisma";

// Create a new PrismaClient instance
const createPrismaClient = () =>
  new PrismaClient({
    log: process.env.NODE_ENV === "development"
      ? ["query", "warn", "error"]
      : ["error"],
  });

declare global {
  /**
   * Global prisma instance cache so that we do not instantiate
   * multiple prisma clients during dev hot-reloads.
   */
  // 👇 explicit type is required to prevent `any` inference
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// 👇 Now `db` is strongly typed, no more `any`
export const db: PrismaClient = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
