import { NextRequest } from 'next/server';

// Simple in-memory rate limiter for development
// In production, use Upstash Redis or similar
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  async limit(
    identifier: string,
    maxRequests: number,
    windowMs: number
  ): Promise<{ success: boolean; remaining: number; reset: number }> {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // Remove old requests outside the time window
    const validRequests = requests.filter((time) => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
      const oldestRequest = validRequests[0];
      const reset = oldestRequest + windowMs;

      return {
        success: false,
        remaining: 0,
        reset: Math.ceil((reset - now) / 1000),
      };
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return {
      success: true,
      remaining: maxRequests - validRequests.length,
      reset: Math.ceil(windowMs / 1000),
    };
  }

  // Cleanup old entries periodically
  cleanup() {
    const now = Date.now();
    for (const [key, times] of this.requests.entries()) {
      const validTimes = times.filter((time) => now - time < 3600000); // 1 hour
      if (validTimes.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validTimes);
      }
    }
  }
}

const rateLimiter = new RateLimiter();

// Cleanup every 5 minutes
setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);

// Rate limit configurations
export const RATE_LIMITS = {
  // AI generation - strict limits
  AI_GENERATE: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 10 requests per hour
  },
  // Project operations - moderate limits
  PROJECT_CRUD: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 30 requests per minute
  },
  // Authentication - strict limits
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 5 requests per 15 minutes
  },
  // General API - moderate limits
  API: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 60 requests per minute
  },
};

export async function rateLimit(
  request: NextRequest,
  config: { maxRequests: number; windowMs: number }
) {
  // Get identifier (IP address or user ID)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  const identifier = ip || 'default';

  const result = await rateLimiter.limit(
    identifier,
    config.maxRequests,
    config.windowMs
  );

  return result;
}

// Middleware helper
export async function checkRateLimit(
  request: NextRequest,
  config: { maxRequests: number; windowMs: number }
): Promise<Response | null> {
  const result = await rateLimit(request, config);

  if (!result.success) {
    return new Response(
      JSON.stringify({
        error: 'Rate limit exceeded',
        retryAfter: result.reset,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': result.reset.toString(),
        },
      }
    );
  }

  return null;
}
