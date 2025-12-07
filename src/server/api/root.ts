
import { registerRouter } from "~/server/api/routers/register";
import { eventRouter } from "./routers/event";
import { profileRouter } from "./routers/profile";
import { guestRouter } from "./routers/guest";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  register: registerRouter,
  event: eventRouter,
  profile: profileRouter,
  guest: guestRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
