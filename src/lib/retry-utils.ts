interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error, delayMs: number) => void;
  retryCondition?: (error: Error) => boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelayMs: 2000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  onRetry: () => {},
  retryCondition: (error: Error) => {
    const message = error.message || '';
    const isRateLimit = message.includes('429') || 
                       message.includes('Too Many Requests') ||
                       message.includes('rate limit') ||
                       message.includes('quota');
    return isRateLimit;
  },
};

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error;
  
  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      const shouldRetry = 
        attempt < opts.maxAttempts && 
        opts.retryCondition(lastError);
      
      if (shouldRetry) {
        const delayMs = Math.min(
          opts.initialDelayMs * Math.pow(opts.backoffMultiplier, attempt - 1),
          opts.maxDelayMs
        );
        
        opts.onRetry(attempt, lastError, delayMs);
        await sleep(delayMs);
      } else if (attempt === opts.maxAttempts) {
        throw lastError;
      }
    }
  }
  
  throw lastError!;
}

export class RateLimitError extends Error {
  retryAfterMs: number;
  
  constructor(retryAfterMs: number, message?: string) {
    super(message || `Rate limited. Retry after ${retryAfterMs}ms`);
    this.name = 'RateLimitError';
    this.retryAfterMs = retryAfterMs;
  }
}
