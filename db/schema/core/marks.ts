import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "../utils";
import { courses } from "./courses";
import { users } from "./users";

export const markTypeEnum = pgEnum("mark_type", [
  "ASSIGNMENT",
  "QUIZ",
  "MIDTERM",
  "FINAL",
  "PROJECT",
  "PARTICIPATION",
]);

export const marks = pgTable("marks", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  studentId: integer("student_id")
    .notNull()
    .references(() => users.id),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id),
  type: markTypeEnum("type").notNull(),
  score: integer("score"),
  maxScore: integer("max_score").default(100),
  grade: text("grade"),
  comments: text("comments"),
  gradedBy: integer("graded_by").references(() => users.id),
  gradedAt: timestamp("graded_at"),
  ...timestamps,
});

export const marksRelations = relations(marks, ({ one }) => ({
  student: one(users, {
    fields: [marks.studentId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [marks.courseId],
    references: [courses.id],
  }),
  grader: one(users, {
    fields: [marks.gradedBy],
    references: [users.id],
  }),
}));

export type Mark = typeof marks.$inferSelect;
export type NewMark = typeof marks.$inferInsert;
