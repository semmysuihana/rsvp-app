import { getServerSession } from "next-auth";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "~/server/db";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ----------------------
// Helper
// ----------------------
function normalizeHeader(value: unknown): string {
  if (typeof value !== "string") return "";
  return value;
}

// ----------------------
// Create Context
// ----------------------
export const createTRPCContext = async () => {
  const session = await getServerSession(authOptions);
  const h = await headers();

  const rawForwarded: unknown = h.get("x-forwarded-for");
  const rawRealIp: unknown = h.get("x-real-ip");

  const forwarded = normalizeHeader(rawForwarded);
  const realIp = normalizeHeader(rawRealIp);

  const ip =
    forwarded.split(",")[0]?.trim() ??
    realIp.trim() ??
    "127.0.0.1";

  return {
    db,
    session,
    ip,
  };
};

// ----------------------
// Init tRPC — HARUS sebelum middleware & procedure lain
// ----------------------
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

// ----------------------
// Timing middleware
// ----------------------
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();
  const result = await next();
  if (process.env.NODE_ENV !== "production") {
  console.log(`[TRPC] ${path} took ${Date.now() - start}ms`);
}
  return result;
});

export const publicProcedure = t.procedure.use(timingMiddleware);

// ----------------------
// Protected middleware
// ----------------------
export const protectedMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
    },
  });
});

export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(protectedMiddleware);

// ----------------------
// Rate Limit
// ----------------------
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "10 s"),
});

const rateLimitMiddleware = t.middleware(async ({ ctx, next, path }) => {
  const ip = ctx.ip ?? "127.0.0.1";

  const { success } = await ratelimit.limit(ip + ":" + path);

  if (!success) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests, please slow down.",
    });
  }

  return next();
});

export const restrictedPublicProcedure =
  t.procedure.use(rateLimitMiddleware);

// ----------------------
// Caller Factory
// ----------------------
export const createCallerFactory = t.createCallerFactory;
