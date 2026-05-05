import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils";
import { departments } from "./departments";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  studentId: text("student_id").unique(),
  name: text("name"),
  email: text("email"),
  phoneNumber: text("phone_number").unique(),
  jobTitle: text("job_title"),
  departmentId: integer("department_id").references(() => departments.id),
  isActive: boolean("is_active").default(true),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  // Role field for permissions/roles; defaults to 'student'
  role: text("role").notNull().default("student"),
  image: text("image"),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  phoneNumberVerified: boolean("phone_number_verified"),
  ...timestamps,
});

export const usersRelations = relations(users, ({ one }) => ({
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
}));
