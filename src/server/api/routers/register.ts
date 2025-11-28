import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export const registerRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        idCardNumber: z.string(),
        birthDate: z.string(),
        gender: z.string(),
        phone: z.string(),
        email: z.string().email(),
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const {
        name,
        idCardNumber,
        birthDate,
        gender,
        phone,
        email,
        username,
        password,
      } = input;

      // ---------------------------------------
      // CEK DUPLIKASI
      // ---------------------------------------
      const existing = await db.user.findFirst({
        where: {
          OR: [
            { username },
            { email },
            { phone },
            { idCardNumber },
          ],
        },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username / Email / Phone / NIK sudah digunakan",
        });
      }

      // ---------------------------------------
      // HASH PASSWORD
      // ---------------------------------------
      const passwordHash = await bcrypt.hash(password, 10);

      // ---------------------------------------
      // SAVE USER
      // ---------------------------------------
      await db.user.create({
        data: {
          name,
          idCardNumber,
          birthDate: new Date(birthDate),
          gender: gender as Gender,
          phone,
          email,
          username,
          passwordHash,
        },
      });

      return {
        success: true,
        message: "Register berhasil",
      };
    }),
});
