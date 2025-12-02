import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

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

});

export type ProfileRouter = typeof profileRouter;
