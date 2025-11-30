export async function getClientIp(req: Request): Promise<string> {
  const headers = req.headers;

  // 1. Cloudflare (CF-Connecting-IP)
  const cf = headers.get("cf-connecting-ip");
  if (cf) return cf;

  // 2. Reverse proxy (Nginx, Cloudflare, Load Balancer)
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const parts = forwardedFor.split(",");
    if (parts.length > 0) return parts[0]!.trim();
  }

  // 3. x-real-ip
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;

  // 4. Next.js fallback
  const fallback = headers.get("x-client-ip");
  if (fallback) return fallback;

  // 5. Last fallback: remote addr (Node)
  // NOTE: req.socket tidak ada di Web Request — jadi kasi default
  return "0.0.0.0";
}
