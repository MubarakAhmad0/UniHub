import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { timestamps } from "../utils";
import { users } from "./users";

export const announcementTypeEnum = pgEnum("announcement_type", [
  "SYSTEM",
  "FACULTY",
  "EVENT",
]);

export const announcementPriorityEnum = pgEnum("announcement_priority", [
  "LOW",
  "NORMAL",
  "HIGH",
]);

export const announcementStatusEnum = pgEnum("announcement_status", [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

export const announcements = pgTable("announcements", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  type: announcementTypeEnum("type").default("SYSTEM").notNull(),
  priority: announcementPriorityEnum("priority").default("NORMAL").notNull(),
  isPinned: boolean("is_pinned").default(false),
  status: announcementStatusEnum("status").default("DRAFT").notNull(),
  audience: text("audience"),
  courseCode: text("course_code"),
  authorName: text("author_name").notNull(),
  authorId: integer("author_id").references(() => users.id),
  publishedAt: timestamp("published_at"),
  ...timestamps,
});

export const announcementsRelations = relations(announcements, ({ one }) => ({
  author: one(users, {
    fields: [announcements.authorId],
    references: [users.id],
  }),
}));

export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;
