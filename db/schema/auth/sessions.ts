import * as t from "drizzle-orm/pg-core";
import { users } from "../../schema";
import { timestamps } from "../utils";

export const sessions = t.pgTable("sessions", {
  id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  expiresAt: t.timestamp("expires_at").notNull(),
  token: t.text("token").notNull().unique(),
  ipAddress: t.text("ip_address"),
  userAgent: t.text("user_agent"),
  userId: t
    .integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  impersonatedBy: t.text("impersonated_by"),
  ...timestamps,
});
