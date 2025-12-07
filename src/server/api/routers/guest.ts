import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";

// =========================
// ZOD SCHEMAS
// =========================
const guestSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  name: z.string(),
  phone: z.string(),
  rsvpStatus: z.enum(["WAITING", "CONFIRMED", "CANCELLED"]),
  notes: z.string().nullable().optional(),
  substituteName: z.string().nullable().optional(),
  pax: z.number(),
  sendCount: z.number(),
  maxSend: z.number(),
  lastSendAt: z.date().nullable(),
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
  createdAt: z.date(),
  updatedAt: z.date(),
  guests: z.array(guestSchema).optional(),
});

// =========================
// ROUTER
// =========================
export const guestRouter = createTRPCRouter({
  // GET EVENT WITH GUESTS (by eventId)
  getEventWithGuests: protectedProcedure
    .input(z.string())
    .output(eventSchema.nullable()) // sudah termasuk guests array
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      const event = await db.event.findUnique({
        where: { id: input },
        include: { guests: true },
      });

      if (!event || event.userId !== userId) {
        return null;
      }

      return eventSchema.parse(event); // guests sudah ada
    }),

  // GET GUEST BY ID
  getById: protectedProcedure
    .input(z.string())
    .output(guestSchema.extend({ event: eventSchema }).nullable())
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      const guest = await db.guest.findUnique({
        where: { id: input },
        include: { event: true },
      });

      if (!guest) {
        return null;
      }

      // Validasi kepemilikan
      if (guest.event.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to view this guest",
        });
      }

      return guest;
    }),

    delete: protectedProcedure
  .input(z.string())
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session?.user.id;

    const guest = await db.guest.findUnique({
      where: { id: input },
      include: { event: true }, // <-- ambil event sekaligus
    });

    if (!guest) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Guest not found" });
    }

    // Validasi kepemilikan
    if (guest.event.userId !== userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't have permission to delete this guest",
      });
    }

    await db.guest.delete({ where: { id: input } });

    return { message: "Guest deleted successfully" };
  }),

  // CREATE GUEST
  create: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        name: z.string().min(1, "Guest name is required"),
        phone: z.string().min(1, "Phone number is required"),
        notes: z.string().optional(),
        substituteName: z.string().optional(),
        pax: z.number().int().positive().default(1),
        maxSend: z.number().int().positive().default(3),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      // Verify event ownership
      const event = await db.event.findUnique({
        where: { id: input.eventId },
      });

      if (!event) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      }

      if (event.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to add guests to this event",
        });
      }

      // Create guest
      const guest = await db.guest.create({
        data: {
          eventId: input.eventId,
          name: input.name,
          phone: input.phone,
          notes: input.notes ?? null,
          substituteName: input.substituteName ?? null,
          pax: input.pax,
          maxSend: input.maxSend,
          rsvpStatus: "WAITING",
          sendCount: 0,
        },
      });

      return guest;
    }),


});


export type GuestRouter = typeof guestRouter;
export type EventSchema = z.infer<typeof eventSchema>;
export type GuestSchema = z.infer<typeof guestSchema>;
