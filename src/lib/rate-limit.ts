interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000,
  maxRequests: 60,
  message: 'Too many requests. Please try again later.',
};

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;
  private cleanupInterval: NodeJS.Timeout;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.cleanupInterval = setInterval(() => this.cleanup(), this.config.windowMs);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime <= now) {
        this.store.delete(key);
      }
    }
  }

  isAllowed(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry || entry.resetTime <= now) {
      const resetTime = now + this.config.windowMs;
      this.store.set(identifier, {
        count: 1,
        resetTime,
      });
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime,
      };
    }

    if (entry.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    entry.count++;
    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  getRemainingRequests(identifier: string): number {
    const entry = this.store.get(identifier);
    if (!entry || entry.resetTime <= Date.now()) {
      return this.config.maxRequests;
    }
    return Math.max(0, this.config.maxRequests - entry.count);
  }

  reset(identifier: string) {
    this.store.delete(identifier);
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

const aiRequestLimiter = new RateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 20,
  message: 'Too many AI requests. Please wait a moment.',
});

const generalRequestLimiter = new RateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 60,
  message: 'Too many requests. Please try again.',
});

export function checkRateLimit(
  identifier: string,
  type: 'ai' | 'general' = 'general'
): { allowed: boolean; remaining: number; resetTime: number; message?: string } {
  const limiter = type === 'ai' ? aiRequestLimiter : generalRequestLimiter;
  const result = limiter.isAllowed(identifier);
  
  return {
    ...result,
    message: result.allowed ? undefined : limiter['config'].message,
  };
}

export function getRateLimitHeaders(
  identifier: string,
  type: 'ai' | 'general' = 'general'
): Record<string, string> {
  const limiter = type === 'ai' ? aiRequestLimiter : generalRequestLimiter;
  const remaining = limiter.getRemainingRequests(identifier);
  
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Limit': (type === 'ai' ? '20' : '60'),
  };
}

export { RateLimiter, aiRequestLimiter, generalRequestLimiter };
