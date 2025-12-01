import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Global Redis instance (biar tidak reconnect setiap request)
const redis = Redis.fromEnv();

// Rate limit 5 request per 1 menit per IP
export const LoginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "1 m"),
  analytics: true,
});

export const RegisterRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "10 m"),
  analytics: true,
});

