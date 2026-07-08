// Minimal in-memory sliding-window rate limiter for the lead-submission route.
// Per-instance only (resets on redeploy / new serverless instance) — enough to
// stop naive form spam without external infrastructure.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

export function rateLimitOk(key: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const list = (hits.get(key) ?? []).filter((t) => t > windowStart);
  if (list.length >= MAX_PER_WINDOW) {
    hits.set(key, list);
    return false;
  }
  list.push(now);
  hits.set(key, list);
  // Opportunistic cleanup so the map doesn't grow unbounded.
  if (hits.size > 1000) {
    for (const [k, v] of hits) {
      if (v.every((t) => t <= windowStart)) hits.delete(k);
    }
  }
  return true;
}
