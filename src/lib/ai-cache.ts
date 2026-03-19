interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  ttl: number;
  maxSize: number;
}

const DEFAULT_TTL = 5 * 60 * 1000;
const DEFAULT_MAX_SIZE = 100;

class AICache<T> {
  private cache: Map<string, CacheEntry<T>>;
  private config: CacheConfig;
  private accessOrder: string[] = [];

  constructor(config: Partial<CacheConfig> = {}) {
    this.cache = new Map();
    this.config = {
      ttl: config.ttl ?? DEFAULT_TTL,
      maxSize: config.maxSize ?? DEFAULT_MAX_SIZE,
    };
  }

  private generateKey(flowName: string, input: unknown): string {
    const normalizedInput = JSON.stringify(input, Object.keys(input as object).sort());
    return `${flowName}:${normalizedInput}`;
  }

  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private evictLRU(): void {
    while (this.cache.size >= this.config.maxSize && this.accessOrder.length > 0) {
      const oldest = this.accessOrder.shift();
      if (oldest) {
        this.cache.delete(oldest);
      }
    }
  }

  get(flowName: string, input: unknown): T | null {
    const key = this.generateKey(flowName, input);
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.accessOrder = this.accessOrder.filter(k => k !== key);
      return null;
    }

    this.accessOrder = this.accessOrder.filter(k => k !== key);
    this.accessOrder.push(key);

    return entry.data;
  }

  set(flowName: string, input: unknown, data: T, ttl?: number): void {
    const key = this.generateKey(flowName, input);

    if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.config.ttl,
    });

    this.accessOrder = this.accessOrder.filter(k => k !== key);
    this.accessOrder.push(key);
  }

  invalidate(flowName?: string): void {
    if (flowName) {
      for (const key of this.cache.keys()) {
        if (key.startsWith(flowName)) {
          this.cache.delete(key);
          this.accessOrder = this.accessOrder.filter(k => k !== key);
        }
      }
    } else {
      this.cache.clear();
      this.accessOrder = [];
    }
  }

  getStats(): { size: number; maxSize: number; ttl: number } {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      ttl: this.config.ttl,
    };
  }
}

const aiResponseCache = new AICache<unknown>({
  ttl: 5 * 60 * 1000,
  maxSize: 100,
});

export function getCachedResponse<T>(
  flowName: string,
  input: unknown
): T | null {
  return aiResponseCache.get(flowName, input) as T | null;
}

export function setCachedResponse<T>(
  flowName: string,
  input: unknown,
  data: T,
  ttl?: number
): void {
  aiResponseCache.set(flowName, input, data, ttl);
}

export function invalidateFlowCache(flowName?: string): void {
  aiResponseCache.invalidate(flowName);
}

export function getCacheStats(): { size: number; maxSize: number; ttl: number } {
  return aiResponseCache.getStats();
}

export { AICache };
