import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "../utils";
import { users } from "./users";

export const documentTypeEnum = pgEnum("document_type", [
  "TRANSCRIPT",
  "CERTIFICATE",
  "LETTER",
  "ID",
  "OTHER",
]);

export const documentStatusEnum = pgEnum("document_status", [
  "PENDING",
  "PROCESSING",
  "READY",
  "REJECTED",
  "COLLECTED",
]);

export const documents = pgTable("documents", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  type: documentTypeEnum("type").notNull(),
  purpose: text("purpose"),
  status: documentStatusEnum("status").default("PENDING"),
  processedBy: integer("processed_by").references(() => users.id),
  processedAt: timestamp("processed_at"),
  pickupDate: timestamp("pickup_date"),
  notes: text("notes"),
  ...timestamps,
});

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
  processor: one(users, {
    fields: [documents.processedBy],
    references: [users.id],
  }),
}));

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
