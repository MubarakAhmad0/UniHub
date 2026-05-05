import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils";
import { users } from "./users";

export const clubStatusEnum = pgEnum("club_status", [
  "ACTIVE",
  "INACTIVE",
  "PENDING",
]);

export const clubs = pgTable("clubs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  logo: text("logo"),
  status: clubStatusEnum("status").default("PENDING"),
  memberCount: integer("member_count").default(0),
  advisorName: text("advisor_name"),
  advisorId: integer("advisor_id").references(() => users.id),
  presidentId: integer("president_id").references(() => users.id),
  contactEmail: text("contact_email"),
  meetingDay: text("meeting_day"),
  ...timestamps,
});

export const clubsRelations = relations(clubs, ({ one }) => ({
  advisor: one(users, {
    fields: [clubs.advisorId],
    references: [users.id],
  }),
  president: one(users, {
    fields: [clubs.presidentId],
    references: [users.id],
  }),
}));

export type Club = typeof clubs.$inferSelect;
export type NewClub = typeof clubs.$inferInsert;
