import { db } from "@/db";
import {
  tiktokSessions,
  tiktokRateLimit,
} from "@/db/schema/auth/tiktok-sessions";
import { eq, and, lt } from "drizzle-orm";
import { sql } from "drizzle-orm";

interface CreateSessionParams {
  orderId: string;
  orderNumber: string;
  ipAddress?: string;
  userAgent?: string;
}

interface RateLimitCheck {
  allowed: boolean;
  resetAt?: Date;
  attemptsRemaining?: number;
}

// Rate limiting constants
// More lenient limits for development
const isDevelopment =
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV !== "production";
const IP_RATE_LIMIT = isDevelopment ? 100 : 5; // 100 attempts per hour in dev, 5 in prod
const ORDER_RATE_LIMIT = isDevelopment ? 50 : 3; // 50 attempts per hour in dev, 3 in prod
const RATE_LIMIT_WINDOW = isDevelopment ? 10 * 60 * 1000 : 60 * 60 * 1000; // 10 min in dev, 1 hour in prod
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in ms

export async function checkRateLimit(
  ipAddress: string,
  orderId: string,
): Promise<RateLimitCheck> {
  const now = new Date();
  const resetTime = new Date(now.getTime() + RATE_LIMIT_WINDOW);

  // Clean up expired rate limit entries
  await db.delete(tiktokRateLimit).where(lt(tiktokRateLimit.resetAt, now));

  // Check IP rate limit
  const ipLimit = await db.query.tiktokRateLimit.findFirst({
    where: and(
      eq(tiktokRateLimit.id, ipAddress),
      eq(tiktokRateLimit.type, "ip"),
    ),
  });

  if (ipLimit) {
    const attempts = parseInt(ipLimit.attempts);
    if (attempts >= IP_RATE_LIMIT) {
      return {
        allowed: false,
        resetAt: ipLimit.resetAt,
        attemptsRemaining: 0,
      };
    }
  }

  // Check order rate limit
  const orderLimit = await db.query.tiktokRateLimit.findFirst({
    where: and(
      eq(tiktokRateLimit.id, orderId),
      eq(tiktokRateLimit.type, "order"),
    ),
  });

  if (orderLimit) {
    const attempts = parseInt(orderLimit.attempts);
    if (attempts >= ORDER_RATE_LIMIT) {
      return {
        allowed: false,
        resetAt: orderLimit.resetAt,
        attemptsRemaining: 0,
      };
    }
  }

  return { allowed: true };
}

export async function incrementRateLimit(
  ipAddress: string,
  orderId: string,
): Promise<void> {
  const now = new Date();
  const resetTime = new Date(now.getTime() + RATE_LIMIT_WINDOW);

  // Update IP rate limit
  await db
    .insert(tiktokRateLimit)
    .values({
      id: ipAddress,
      type: "ip",
      attempts: "1",
      lastAttempt: now,
      resetAt: resetTime,
    })
    .onConflictDoUpdate({
      target: [tiktokRateLimit.id, tiktokRateLimit.type],
      set: {
        attempts: sql`(${tiktokRateLimit.attempts}::int + 1)::text`,
        lastAttempt: now,
      },
    });

  // Update order rate limit
  await db
    .insert(tiktokRateLimit)
    .values({
      id: orderId,
      type: "order",
      attempts: "1",
      lastAttempt: now,
      resetAt: resetTime,
    })
    .onConflictDoUpdate({
      target: [tiktokRateLimit.id, tiktokRateLimit.type],
      set: {
        attempts: sql`(${tiktokRateLimit.attempts}::int + 1)::text`,
        lastAttempt: now,
      },
    });
}

export async function createTikTokSession(
  params: CreateSessionParams,
): Promise<string> {
  // Generate secure random token
  const token = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION);

  await db.insert(tiktokSessions).values({
    token,
    orderId: params.orderId,
    orderNumber: params.orderNumber,
    ipAddress: params.ipAddress || null,
    userAgent: params.userAgent,
    expiresAt,
  });

  return token;
}

export async function validateTikTokSession(token: string): Promise<{
  valid: boolean;
  orderId?: string;
  orderNumber?: string;
}> {
  // Clean up expired sessions
  await db
    .delete(tiktokSessions)
    .where(lt(tiktokSessions.expiresAt, new Date()));

  const session = await db.query.tiktokSessions.findFirst({
    where: eq(tiktokSessions.token, token),
  });

  if (!session) {
    return { valid: false };
  }

  return {
    valid: true,
    orderId: session.orderId,
    orderNumber: session.orderNumber,
  };
}

export async function cleanupExpiredSessions(): Promise<void> {
  const now = new Date();

  // Clean up expired sessions
  await db.delete(tiktokSessions).where(lt(tiktokSessions.expiresAt, now));

  // Clean up expired rate limits
  await db.delete(tiktokRateLimit).where(lt(tiktokRateLimit.resetAt, now));
}
