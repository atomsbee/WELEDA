interface RateLimitEntry {
  count: number
  resetAt: number
}

type RateLimitAction = 'vote' | 'page'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const configs: Record<RateLimitAction, RateLimitConfig> = {
  vote: { maxRequests: 3, windowMs: 10 * 60 * 1000 }, // 3 per 10 min
  page: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 per 1 min
}

// In-memory store — auto-cleans stale entries
const store = new Map<string, RateLimitEntry>()

function cleanStaleEntries(): void {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key)
    }
  }
}

export function checkRateLimit(
  ip: string,
  action: RateLimitAction
): { allowed: boolean; retryAfter?: number } {
  // Periodically clean stale entries
  if (Math.random() < 0.05) cleanStaleEntries()

  const config = configs[action]
  const key = `${action}:${ip}`
  const now = Date.now()

  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    // First request in window
    store.set(key, { count: 1, resetAt: now + config.windowMs })
    return { allowed: true }
  }

  if (entry.count >= config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, retryAfter }
  }

  entry.count += 1
  return { allowed: true }
}
