const WINDOW_SECONDS = 600;
const MAX_REQUESTS = 5;

/** Fixed-window rate limit keyed by IP. Fails open (allows the request) if no KV binding is configured. */
export async function isRateLimited(kv: KVNamespace | undefined, ip: string, routeName: string): Promise<boolean> {
  if (!kv) return false;

  const bucket = Math.floor(Date.now() / 1000 / WINDOW_SECONDS);
  const key = `ratelimit:${routeName}:${ip}:${bucket}`;

  const current = Number((await kv.get(key)) ?? '0');
  if (current >= MAX_REQUESTS) return true;

  await kv.put(key, String(current + 1), { expirationTtl: WINDOW_SECONDS });
  return false;
}
