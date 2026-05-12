type Bucket = { windowStart: number; count: number };

const store = new Map<string, Bucket>();

const MAX_KEYS = 5000;

function pruneIfNeeded() {
  if (store.size <= MAX_KEYS) return;
  const cutoff = Date.now() - 86_400_000;
  for (const [k, b] of store) {
    if (b.windowStart < cutoff) store.delete(k);
  }
  if (store.size > MAX_KEYS) {
    const keys = [...store.keys()].slice(0, store.size - Math.floor(MAX_KEYS / 2));
    keys.forEach((k) => store.delete(k));
  }
}

/**
 * Fixed-window counter (good enough per serverless instance to blunt abuse).
 * Returns whether the request is allowed; if not, `retryAfterMs` is time until window reset.
 */
export function takeRateLimitToken(
  key: string,
  limit: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfterMs: number } {
  const now = Date.now();
  pruneIfNeeded();

  let b = store.get(key);
  if (!b || now - b.windowStart >= windowMs) {
    b = { windowStart: now, count: 1 };
    store.set(key, b);
    return { ok: true };
  }

  if (b.count >= limit) {
    const retryAfterMs = Math.max(0, windowMs - (now - b.windowStart));
    return { ok: false, retryAfterMs };
  }

  b.count += 1;
  return { ok: true };
}
