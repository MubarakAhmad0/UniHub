import { pgTable, text, timestamp, inet } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const tiktokSessions = pgTable("tiktok_sessions", {
  token: text("token").primaryKey(),
  orderId: text("order_id").notNull(),
  orderNumber: text("order_number").notNull(),
  ipAddress: inet("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const tiktokRateLimit = pgTable("tiktok_rate_limit", {
  id: text("id").primaryKey(), // IP or orderID
  type: text("type").notNull(), // 'ip' or 'order'
  attempts: text("attempts").notNull().default("1"),
  lastAttempt: timestamp("last_attempt")
    .default(sql`now()`)
    .notNull(),
  resetAt: timestamp("reset_at").notNull(),
});
