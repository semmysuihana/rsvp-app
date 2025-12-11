import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
// =========================
// Zod Schema
// =========================
const profileSchema = z.object({
  id: z.string(),
  name: z.string(),
  idCardNumber: z.string(),
  birthDate: z.date(),
  gender: z.enum(["MALE", "FEMALE"]),
  phone: z.string(),
  email: z.string(),
  username: z.string(),
  subscriptionPlan: z.enum(["FREE", "BASIC", "PRO"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const profileRouter = createTRPCRouter({
  // GET BY ID
  getById: protectedProcedure
    .input(z.string())
    .output(profileSchema.nullable())
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      // Ensure user can only get their own profile
      if (userId !== input) {
        return null;
      }

      const user = await db.user.findUnique({
        where: { id: input },
      });

      return user ?? null;
    }),
    // UPDATE PROFILE
update: protectedProcedure
  .input(
    profileSchema.omit({ id: true, createdAt: true, updatedAt: true, subscriptionPlan: true, birthDate: true })
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session?.user.id;

    if (!userId) {
      return null;
    }

    const result = await db.user.update({
      where: { id: userId },
      data: input,
    });

    return {
      message: "Profile updated successfully",
      data: result,
    };
  }),

  // UPDATE PASSWORD
  updatePassword: protectedProcedure
    .input(
      z.object({
        oldPassword: z.string().min(1),
        newPassword: z.string().min(8),
        confirmPassword: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Validate new password matches confirm password
      if (input.newPassword !== input.confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "New password and confirm password do not match",
        });
      }

      // Get current user
      const user = await db.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Verify old password
      const isCorrectPassword = await bcrypt.compare(
        input.oldPassword,
        user.passwordHash
      );

      if (!isCorrectPassword) {
        console.log("Old password is incorrect");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Old password is incorrect",
        });
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(input.newPassword, 10);

      // Update password
      await db.user.update({
        where: { id: userId },
        data: { passwordHash: newPasswordHash },
      });

      return {
        message: "Password updated successfully",
      };
    }),
});

export type ProfileRouter = typeof profileRouter;
