import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "../utils";
import { users } from "./users";

export const complaintStatusEnum = pgEnum("complaint_status", [
  "SUBMITTED",
  "ACKNOWLEDGED",
  "INVESTIGATING",
  "RESOLVED",
  "REJECTED",
]);

export const complaintCategoryEnum = pgEnum("complaint_category", [
  "ACADEMIC",
  "FACILITIES",
  "ADMINISTRATIVE",
  "HARASSMENT",
  "FINANCIAL",
  "OTHER",
]);

export const complaints = pgTable("complaints", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: complaintCategoryEnum("category").default("OTHER"),
  status: complaintStatusEnum("status").default("SUBMITTED"),
  priority: text("priority").default("NORMAL"),
  response: text("response"),
  resolvedBy: integer("resolved_by").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  ...timestamps,
});

export const complaintsRelations = relations(complaints, ({ one }) => ({
  user: one(users, {
    fields: [complaints.userId],
    references: [users.id],
  }),
  resolver: one(users, {
    fields: [complaints.resolvedBy],
    references: [users.id],
  }),
}));

export type Complaint = typeof complaints.$inferSelect;
export type NewComplaint = typeof complaints.$inferInsert;
