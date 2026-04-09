import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils";
import { departments } from "./departments";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  studentId: text("student_id"),
  name: text("name"),
  email: text("email"),
  phoneNumber: text("phone_number").unique(),
  jobTitle: text("job_title"),
  departmentId: integer("department_id").references(() => departments.id),
  isActive: boolean("is_active").default(true),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  phoneNumberVerified: boolean("phone_number_verified"),
  role: text("role").default("user"),
  ...timestamps,
});

export const usersRelations = relations(users, ({ one }) => ({
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
}));
