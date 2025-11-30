import { z } from "zod";
import { createTRPCRouter, restrictedPublicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";
import { RegisterRateLimit } from "~/server/rateLimit";



// ENUM gender untuk Prisma
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

// Zod enum untuk validasi
const genderEnum = z.enum([Gender.MALE, Gender.FEMALE]);

// TURNSTILE
async function verifyTurnstile(token: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        response: token,
      }),
    }
  );

  return res.json() as Promise<{ success: boolean }>;
}

export const registerRouter = createTRPCRouter({
  create: restrictedPublicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        idCardNumber: z.string().min(1),
        birthDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
        gender: genderEnum,
        phone: z.string().min(1),
        email: z.string().email(),
        username: z.string().min(1),
        password: z.string().min(6),
        turnstileToken: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        name,
        idCardNumber,
        birthDate,
        gender,
        phone,
        email,
        username,
        password,
        turnstileToken,
      } = input;

       // ---------------------------------------
      // VERIFY RATE LIMIT
      // ---------------------------------------

        const ip = ctx.ip ?? "anonymous";

      // RATE LIMIT
      const result = await RegisterRateLimit.limit(ip);

      if (!result.success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Terlalu banyak percobaan registrasi. Coba lagi nanti.",
        });
      }


      // ---------------------------------------
      // VERIFY TURNSTILE
      // ---------------------------------------
      const verify = await verifyTurnstile(turnstileToken);
      if (!verify.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Gagal verifikasi keamanan. Mohon refresh halaman.",
        });
      }

      // ---------------------------------------
      // CEK DUPLIKASI USER
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
          message: "Username / Email / Phone / NIK sudah digunakan.",
        });
      }

      // ---------------------------------------
      // HASH PASSWORD
      // ---------------------------------------
      const passwordHash = await bcrypt.hash(password, 10);


      const parsedBirthDate = new Date(birthDate);
      if (isNaN(parsedBirthDate.getTime())) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Format tanggal lahir tidak valid.",
        });
      }
      // ---------------------------------------
      // SIMPAN DATA USER
      // ---------------------------------------
      await db.user.create({
        data: {
          name,
          idCardNumber,
          birthDate: parsedBirthDate,
          gender,
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
