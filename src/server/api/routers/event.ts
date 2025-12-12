import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import type { Event as PrismaEvent, Guest as PrismaGuest } from "../../../../generated/prisma";

// =========================
// Zod Schema
// =========================
const guestSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  name: z.string(),
  phone: z.string(),
  email: z.string().nullable().optional(),
  rsvpStatus: z.enum(["WAITING", "CONFIRMED", "CANCELLED"]),
  notes: z.string().nullable().optional(),
  substituteName: z.string().nullable().optional(),
  pax: z.number(),
  sendCount: z.number(),
  maxSend: z.number(),
  lastSendAt: z.date().nullable(),
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

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
  description: z.string(),  
  createdAt: z.date(),
  updatedAt: z.date(),
});

const eventSchemaWithCapacity = eventSchema.extend({
  capacity: z.object({
    confirmed: z.number(),
    waiting: z.number(),
    canceled: z.number(),
  }),
  stats: z.object({
    confirmed: z.number(),
    waiting: z.number(),
    cancelled: z.number(),
    totalGuests: z.number(),
  }).optional(),
});

const eventSchemaWithGuestsCapacity = eventSchemaWithCapacity.extend({
  guests: z.array(guestSchema).optional(),
});

// =========================
// Type Definitions
// =========================
type EventWithGuestsCapacity = z.infer<typeof eventSchemaWithGuestsCapacity>;

// =========================
export const eventRouter = createTRPCRouter({

  // get stats
  getAllWithStats: protectedProcedure
    .output(z.array(eventSchemaWithCapacity))
    .query(async ({ ctx }) => {
      const userId = ctx.session?.user.id;

      const events = await db.event.findMany({ where: { userId } });
      const results: EventWithGuestsCapacity[] = await Promise.all(
        events.map(async (event) => {
          const [confirmed, waiting, canceled] = await Promise.all([
            db.guest.aggregate({
              _sum: { pax: true },
              where: { eventId: event.id, rsvpStatus: "CONFIRMED" },
            }),
            db.guest.aggregate({
              _sum: { pax: true },
              where: { eventId: event.id, rsvpStatus: "WAITING" },
            }),
            db.guest.aggregate({
              _sum: { pax: true },
              where: { eventId: event.id, rsvpStatus: "CANCELLED" },
            }),
          ]);
          return {
            ...event,
            capacity: {
              confirmed: confirmed._sum.pax ?? 0,
              waiting: waiting._sum.pax ?? 0,
              canceled: canceled._sum.pax ?? 0,
            },
          };
        })
      );

      return results;
    }),
  // GET ALL
  getAll: protectedProcedure
    .output(z.array(eventSchemaWithGuestsCapacity))
    .query(async ({ ctx }) => {
      const userId = ctx.session?.user.id;

      const events = await db.event.findMany({ where: { userId } });

      const results: EventWithGuestsCapacity[] = await Promise.all(
        events.map(async (event) => {
          const [confirmed, waiting, canceled] = await Promise.all([
            db.guest.aggregate({
              _sum: { pax: true },
              where: { eventId: event.id, rsvpStatus: "CONFIRMED" },
            }),
            db.guest.aggregate({
              _sum: { pax: true },
              where: { eventId: event.id, rsvpStatus: "WAITING" },
            }),
            db.guest.aggregate({
              _sum: { pax: true },
              where: { eventId: event.id, rsvpStatus: "CANCELLED" },
            }),
          ]);

          return {
            ...event,
            capacity: {
              confirmed: confirmed._sum.pax ?? 0,
              waiting: waiting._sum.pax ?? 0,
              canceled: canceled._sum.pax ?? 0,
            },
          };
        })
      );

      return results;
    }),

  // GET BY ID
  getById: protectedProcedure
    .input(z.string())
    .output(eventSchemaWithGuestsCapacity.nullable())
    .query(async ({ ctx, input }): Promise<EventWithGuestsCapacity | null> => {
      const userId = ctx.session?.user.id;

      const event = await db.event.findFirst({
        where: { id: input, userId },
        include: { guests: true },
      }) as (PrismaEvent & { guests: PrismaGuest[] }) | null;

      if (!event) return null;

      const [confirmed, waiting, canceled] = await Promise.all([
        db.guest.aggregate({
          _sum: { pax: true },
          where: { eventId: input, rsvpStatus: "CONFIRMED" },
        }),
        db.guest.aggregate({
          _sum: { pax: true },
          where: { eventId: input, rsvpStatus: "WAITING" },
        }),
        db.guest.aggregate({
          _sum: { pax: true },
          where: { eventId: input, rsvpStatus: "CANCELLED" },
        }),
      ]);

      return {
        ...event,
        capacity: {
          confirmed: confirmed._sum.pax ?? 0,
          waiting: waiting._sum.pax ?? 0,
          canceled: canceled._sum.pax ?? 0,
        },
      };
    }),

  // CREATE
  create: protectedProcedure
    .input(eventSchema.omit({ id: true, createdAt: true, updatedAt: true }))
    .mutation(async ({ input }) => {
      const result = await db.event.create({ data: input });
      return { message: "Event created successfully", data: result };
    }),

  // UPDATE
  update: protectedProcedure
    .input(eventSchema.omit({ createdAt: true, updatedAt: true }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      const event = await db.event.findUnique({ where: { id: input.id } });
      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      if (event.userId !== userId)
        throw new TRPCError({ code: "FORBIDDEN", message: "You don't have permission to update this event" });

      const { id, ...updateData } = input;
      const result = await db.event.update({ where: { id }, data: updateData });

      return { message: "Event updated successfully", data: result };
    }),

  // DELETE
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      const event = await db.event.findUnique({ where: { id: input } });
      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      if (event.userId !== userId)
        throw new TRPCError({ code: "FORBIDDEN", message: "You don't have permission to delete this event" });

      const result = await db.event.delete({ where: { id: input } });
      return { message: "Event deleted successfully", data: result };
    }),
});

export type EventRouter = typeof eventRouter;
