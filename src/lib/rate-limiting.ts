// src/lib/rate-limiting.ts - SELAH Rate Limiting System
// Technology that breathes with you
// One sacred journey per user per day - making AI personalization special

import type { RateLimitState } from "./types";

// In-memory storage for rate limiting (production should use Redis or database)
const rateLimitMap = new Map<string, RateLimitState>();

/**
 * Generate unique user identifier from request headers
 * Combines IP, User-Agent, and other fingerprinting data
 */
export function generateUserFingerprint(request: Request): string {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown";

  const userAgent = request.headers.get("user-agent") || "unknown";
  const acceptLanguage = request.headers.get("accept-language") || "unknown";

  // Create a reasonably unique fingerprint
  const fingerprint = `${ip}-${userAgent.slice(0, 50)}-${acceptLanguage.slice(0, 20)}`;

  // Hash it to make it more manageable
  return btoa(fingerprint)
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 32);
}

/**
 * Check if user is rate limited for AI requests
 */
export function checkRateLimit(userId: string): {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  message?: string;
} {
  const now = new Date();
  const windowStart = new Date(now);
  windowStart.setHours(0, 0, 0, 0); // Start of today

  const windowEnd = new Date(windowStart);
  windowEnd.setDate(windowEnd.getDate() + 1); // Start of tomorrow

  const existing = rateLimitMap.get(userId);

  // If no existing record, allow the request
  if (!existing) {
    return {
      allowed: true,
      remaining: 0, // One request per day
      resetTime: windowEnd,
    };
  }

  // Check if the existing record is from today
  const lastRequest = new Date(existing.lastRequest);
  const isToday = lastRequest >= windowStart && lastRequest < windowEnd;

  if (!isToday) {
    // Reset for new day
    return {
      allowed: true,
      remaining: 0,
      resetTime: windowEnd,
    };
  }

  // Already used their daily AI request
  return {
    allowed: false,
    remaining: 0,
    resetTime: windowEnd,
    message:
      "You've already experienced your personalized journey today. The universal journey is equally profound.",
  };
}

/**
 * Record an AI request for rate limiting
 */
export function recordAIRequest(userId: string): void {
  const now = new Date();

  const rateLimitState: RateLimitState = {
    userId,
    requestCount: 1,
    lastRequest: now.toISOString(),
    isBlocked: false,
    resetTime: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
  };

  rateLimitMap.set(userId, rateLimitState);
}

/**
 * Get rate limit information for a user
 */
export function getRateLimitInfo(userId: string): RateLimitState | null {
  return rateLimitMap.get(userId) || null;
}

/**
 * Clean up old rate limit entries (should be run periodically)
 */
export function cleanupRateLimits(): number {
  const now = new Date();
  const cutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000); // 48 hours ago

  let removed = 0;

  for (const [userId, state] of rateLimitMap.entries()) {
    const lastRequest = new Date(state.lastRequest);
    if (lastRequest < cutoff) {
      rateLimitMap.delete(userId);
      removed++;
    }
  }

  return removed;
}

/**
 * Check if user should be blocked based on abuse patterns
 */
export function checkForAbuse(
  userId: string,
  request: Request
): {
  blocked: boolean;
  reason?: string;
} {
  // Check for rapid requests (more than 5 in 5 minutes)
  const recentRequests = getRecentRequests(userId, 5 * 60 * 1000); // 5 minutes

  if (recentRequests > 5) {
    return {
      blocked: true,
      reason: "Too many requests in short time period",
    };
  }

  // Check for suspicious user agents
  const userAgent = request.headers.get("user-agent") || "";
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
  ];

  if (suspiciousPatterns.some((pattern) => pattern.test(userAgent))) {
    return {
      blocked: true,
      reason: "Automated requests not permitted",
    };
  }

  return { blocked: false };
}

/**
 * Get number of recent requests for a user
 */
function getRecentRequests(userId: string, windowMs: number): number {
  const state = rateLimitMap.get(userId);
  if (!state) return 0;

  const now = Date.now();
  const lastRequest = new Date(state.lastRequest).getTime();

  if (now - lastRequest < windowMs) {
    return state.requestCount;
  }

  return 0;
}

/**
 * Record a request attempt (for abuse detection)
 */
export function recordRequestAttempt(userId: string): void {
  const existing = rateLimitMap.get(userId);

  if (existing) {
    const now = new Date();
    const lastRequest = new Date(existing.lastRequest);
    const timeDiff = now.getTime() - lastRequest.getTime();

    // If within 5 minutes, increment counter
    if (timeDiff < 5 * 60 * 1000) {
      existing.requestCount++;
      existing.lastRequest = now.toISOString();
    } else {
      // Reset counter
      existing.requestCount = 1;
      existing.lastRequest = now.toISOString();
    }

    rateLimitMap.set(userId, existing);
  } else {
    // First request
    recordAIRequest(userId);
  }
}

/**
 * Get rate limiting statistics for admin dashboard
 */
export function getRateLimitingStats(): {
  totalUsers: number;
  blockedUsers: number;
  requestsToday: number;
  topRequesters: Array<{ userId: string; requests: number }>;
} {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  let totalUsers = 0;
  let blockedUsers = 0;
  let requestsToday = 0;
  const userRequests: Array<{ userId: string; requests: number }> = [];

  for (const [userId, state] of rateLimitMap.entries()) {
    totalUsers++;

    if (state.isBlocked) {
      blockedUsers++;
    }

    const lastRequest = new Date(state.lastRequest);
    if (lastRequest >= todayStart) {
      requestsToday += state.requestCount;
    }

    userRequests.push({
      userId: userId.slice(0, 8) + "...", // Truncated for privacy
      requests: state.requestCount,
    });
  }

  // Sort by request count and take top 10
  const topRequesters = userRequests
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 10);

  return {
    totalUsers,
    blockedUsers,
    requestsToday,
    topRequesters,
  };
}

/**
 * Reset rate limit for a specific user (admin function)
 */
export function resetRateLimit(userId: string): boolean {
  const existed = rateLimitMap.has(userId);
  rateLimitMap.delete(userId);
  return existed;
}

/**
 * Get all rate limited users (admin function)
 */
export function getAllRateLimitedUsers(): RateLimitState[] {
  return Array.from(rateLimitMap.values());
}

/**
 * Middleware helper for checking rate limits in API routes
 */
export function withRateLimit(handler: Function) {
  return async (request: Request, ...args: any[]) => {
    const userId = generateUserFingerprint(request);

    // Check for abuse patterns
    const abuseCheck = checkForAbuse(userId, request);
    if (abuseCheck.blocked) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Request blocked",
          message: abuseCheck.reason,
          rateLimited: true,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": "1",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(
              Date.now() + 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        }
      );
    }

    // Record the attempt
    recordRequestAttempt(userId);

    // Continue with the handler
    return handler(request, ...args);
  };
}

/**
 * Get contemplative message for rate limited users
 */
export function getRateLimitMessage(resetTime: Date): string {
  const now = new Date();
  const hoursLeft = Math.ceil(
    (resetTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  );

  const messages = [
    "Your personalized journey has been experienced for today. Return tomorrow for fresh recognition.",
    "Like breath itself, personalization comes in cycles. Your next cycle begins tomorrow.",
    "Today's AI-guided recognition is complete. Tomorrow brings new possibilities for contemplation.",
    "The sacred technology rests between uses. Your next personalized experience awaits tomorrow.",
    `Your contemplative AI journey resets in ${hoursLeft} hours. Until then, the universal experience continues.`,
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

// Cleanup old entries every hour
if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      const removed = cleanupRateLimits();
      if (removed > 0) {
        console.log(`SELAH: Cleaned up ${removed} old rate limit entries`);
      }
    },
    60 * 60 * 1000
  ); // Every hour
}
