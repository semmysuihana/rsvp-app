# Rate Limiting Implementation

## 📌 Overview

Aplikasi ini mengimplementasikan rate limiting untuk melindungi dari:
- Brute force attacks pada login
- Spam registration
- Abuse pada public endpoints

## 🔧 Konfigurasi

### Environment Variables
```env
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

## 📍 Protected Endpoints

### 1. NextAuth Route (`/api/auth/[...nextauth]`)
**File**: `src/app/api/auth/[...nextauth]/route.ts`

**Limit**: 5 requests per 1 menit per IP
**Scope**: POST requests (login attempts)
**Response**: 
- Status: `429 Too Many Requests`
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Body:
```json
{
  "error": "TOO_MANY_REQUESTS",
  "message": "Terlalu banyak percobaan login. Silakan tunggu beberapa saat.",
  "limit": 5,
  "remaining": 0,
  "reset": 1638360000
}
```

### 2. tRPC Public Procedures
**File**: `src/server/api/trpc.ts`

**Limit**: 20 requests per 10 detik per IP per endpoint
**Scope**: Semua procedure dengan `restrictedPublicProcedure`
**Response**: tRPC Error dengan code `TOO_MANY_REQUESTS`

#### Protected Procedures:
- `register.create` - Endpoint registrasi user baru

## 📝 Types

### File: `src/types/auth.ts`

```typescript
// Error codes
export type AuthErrorCode =
  | "TOO_MANY_REQUESTS"
  | "INVALID_CREDENTIALS"
  | "TURNSTILE_FAILED"
  | "SERVER_ERROR"
  | "INVALID_INPUT";

// Rate limit error response
export interface RateLimitError {
  error: "TOO_MANY_REQUESTS";
  message: string;
  limit?: number;
  remaining?: number;
  reset?: number;
}

// General auth error
export interface AuthError {
  error: AuthErrorCode;
  message: string;
}

// Alert UI component
export interface Alert {
  type: "success" | "error" | "warning" | "info";
  message: string;
}
```

## 🛠️ Usage

### Client-side (actionLogin.ts)

```typescript
const res = await signIn("credentials", {
  username,
  password,
  turnstile,
  redirect: false,
});

if (res.error === "TOO_MANY_REQUESTS") {
  // Show warning alert
  setAlert({
    type: "warning",
    message: "Terlalu banyak percobaan login. Silakan tunggu beberapa saat.",
  });
}
```

### Server-side (route.ts)

```typescript
const { success, limit, remaining, reset } = await rateLimit.limit(ip);

if (!success) {
  const errorResponse: RateLimitError = {
    error: "TOO_MANY_REQUESTS",
    message: "Terlalu banyak percobaan login.",
    limit,
    remaining,
    reset,
  };
  
  return new Response(JSON.stringify(errorResponse), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "X-RateLimit-Limit": limit.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": reset.toString(),
    },
  });
}
```

## ⚙️ Customization

### Mengubah Limit

#### Login Rate Limit
**File**: `src/server/rateLimit.ts`
```typescript
export const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), // ← ubah di sini
  analytics: true,
});
```

#### tRPC Rate Limit
**File**: `src/server/api/trpc.ts`
```typescript
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "10 s"), // ← ubah di sini
});
```

### Algoritma yang Tersedia

```typescript
// Fixed window
Ratelimit.fixedWindow(10, "10 s")

// Sliding window (recommended)
Ratelimit.slidingWindow(10, "10 s")

// Token bucket
Ratelimit.tokenBucket(5, "10 s", 10)
```

## 🔍 Monitoring

Rate limiting menggunakan Upstash Redis Analytics. Anda bisa monitor:
- Request count per IP
- Rate limit hits
- Blocked requests

Dashboard: https://console.upstash.com/

## 🧪 Testing

```bash
# Test rate limit dengan curl
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/callback/credentials \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"test","turnstile":"xxx"}'
  echo ""
done
```

Setelah 5 request, Anda akan mendapat response 429.

## 📚 References

- [Upstash Ratelimit Docs](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [tRPC Error Handling](https://trpc.io/docs/server/error-handling)
