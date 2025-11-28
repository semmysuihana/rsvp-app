import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";

// =========================
// Zod Schema
// =========================
const eventSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  date: z.date(),
  time: z.date(),
  venueName: z.string(),
  address: z.string(),
  rtRw: z.string(),
  district: z.string(),
  subDistrict: z.string(),
  city: z.string(),
  googleMapUrl: z.string(),
  maxPax: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});


export const eventRouter = createTRPCRouter({
  // GET ALL

getAll: protectedProcedure
  .output(z.array(eventSchema))
  .query(async ({ ctx }) => {
    const userId = ctx.session?.user.id;
    return db.event.findMany({
      where: { userId },
    });
  }),


  // GET BY ID
  getById: publicProcedure
    .input(z.string())
    .output(eventSchema)
    .query(async ({ input }) => {
      const event = await db.event.findUnique({ where: { id: input } });

      if (!event) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      }

      return event;
    }),

  // CREATE
  create: protectedProcedure
    .input(
      eventSchema.omit({ id: true, createdAt: true, updatedAt: true })
    )
    .mutation(async ({ input }) => {
      const result = await db.event.create({ data: input });

      return {
        message: "Event created successfully",
        data: result,
      };
    }),
  delete: protectedProcedure
  .input(z.string())
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    // Cek apakah event milik user ini
    const event = await db.event.findUnique({ where: { id: input } });

    if (!event) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
    }

    if (event.userId !== userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't have permission to delete this event",
      });
    }

    const result = await db.event.delete({ where: { id: input } });

    return {
      message: "Event deleted successfully",
      data: result,
    };
  }),
});
export type EventRouter = typeof eventRouter;
