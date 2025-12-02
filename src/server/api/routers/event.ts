import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
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
getById: protectedProcedure
  .input(z.string())
  .output(eventSchema.nullable())  // <-- boleh null
  .query(async ({ ctx, input }) => {
    const userId = ctx.session?.user.id;

    const event = await db.event.findFirst({
      where: {
        id: input,
        userId,
      },
    });

    return event ?? null; 
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

  // UPDATE
  update: protectedProcedure
    .input(
      eventSchema.omit({ createdAt: true, updatedAt: true })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      // Cek apakah event milik user ini
      const event = await db.event.findUnique({ where: { id: input.id } });

      if (!event) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      }

      if (event.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to update this event",
        });
      }

      const { id, ...updateData } = input;
      const result = await db.event.update({
        where: { id },
        data: updateData,
      });

      return {
        message: "Event updated successfully",
        data: result,
      };
    }),

    // DELETE
  delete: protectedProcedure
  .input(z.string())
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session?.user.id;

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
