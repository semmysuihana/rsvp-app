// src/server/db.ts
import { PrismaClient } from "@prisma/client/edge";

const createPrismaClient = () =>
  new PrismaClient({
    log: process.env.NODE_ENV === "development"
      ? ["query", "warn", "error"]
      : ["error"],
  });

declare global {
  var prisma: PrismaClient | undefined;
}

export const db: PrismaClient = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
