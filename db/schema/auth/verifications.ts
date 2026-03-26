import * as t from "drizzle-orm/pg-core";
import { timestamps } from "../utils";

export const verifications = t.pgTable("verifications", {
  id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  identifier: t.text("identifier").notNull(),
  value: t.text("value").notNull(),
  expiresAt: t.timestamp("expires_at").notNull(),
  ...timestamps,
});
