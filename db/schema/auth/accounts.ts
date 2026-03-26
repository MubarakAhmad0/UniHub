import * as t from "drizzle-orm/pg-core";
import { users } from "../core";
import { timestamps } from "../utils";

export const accounts = t.pgTable("accounts", {
  id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  accountId: t.text("account_id").notNull(),
  providerId: t.text("provider_id").notNull(),
  userId: t
    .integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: t.text("access_token"),
  refreshToken: t.text("refresh_token"),
  idToken: t.text("id_token"),
  accessTokenExpiresAt: t.timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: t.timestamp("refresh_token_expires_at"),
  scope: t.text("scope"),
  password: t.text("password"),
  ...timestamps,
});

export type NewAccount = typeof accounts.$inferInsert;
