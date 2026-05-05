import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils";
import { departments } from "./departments";
import { users } from "./users";

export const courseLevelEnum = pgEnum("course_level", [
  "UNDERGRADUATE",
  "GRADUATE",
]);

export const courseStatusEnum = pgEnum("course_status", [
  "OPEN",
  "LIMITED",
  "FULL",
  "CLOSED",
]);

export const courses = pgTable("courses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  faculty: text("faculty"),
  level: courseLevelEnum("level").default("UNDERGRADUATE"),
  credits: integer("credits").default(3),
  seatsTotal: integer("seats_total").default(30),
  seatsAvailable: integer("seats_available").default(30),
  departmentId: integer("department_id").references(() => departments.id),
  lecturerId: integer("lecturer_id").references(() => users.id),
  prerequisites: text("prerequisites").array(),
  status: courseStatusEnum("status").default("OPEN"),
  ...timestamps,
});

export const coursesRelations = relations(courses, ({ one, many }) => ({
  department: one(departments, {
    fields: [courses.departmentId],
    references: [departments.id],
  }),
  lecturer: one(users, {
    fields: [courses.lecturerId],
    references: [users.id],
  }),
}));

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
