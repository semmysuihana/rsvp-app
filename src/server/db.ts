// src/server/db.ts
import { PrismaClient } from "../../generated/prisma";

// Fungsi untuk membuat PrismaClient
const createPrismaClient = (): PrismaClient =>
  new PrismaClient({
    log: process.env.NODE_ENV === "development"
      ? ["query", "warn", "error"]
      : ["error"],
  });

// Extend globalThis untuk menyimpan singleton PrismaClient
declare global {
  var prisma: PrismaClient | undefined;
}

// Gunakan singleton jika ada, kalau tidak buat baru
export const db: PrismaClient = globalThis.prisma ?? createPrismaClient();

// Simpan ke globalThis agar tidak membuat instance baru saat hot reload
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
