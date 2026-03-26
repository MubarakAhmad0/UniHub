import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils";
import { branches } from "./branches";
import { departments } from "./departments";

export const LEGACY_ROLES = {
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  USER: "USER",
  GUEST: "GUEST",
  FLORIST: "FLORIST",
  VENDOR: "VENDOR",
  CUSTOMER: "CUSTOMER",
  SUPPORT: "SUPPORT",
} as const;

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  employeeId: text("employee_id"),
  name: text("name"),
  email: text("email"),
  phoneNumber: text("phone_number").unique(),
  jobTitle: text("job_title"),
  role: text("role").$type<keyof typeof LEGACY_ROLES>(),
  departmentId: integer("department_id").references(() => departments.id),
  branchId: integer("branch_id").references(() => branches.id),
  oldId: integer("old_id"),
  isActive: boolean("is_active").default(true),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  phoneNumberVerified: boolean("phone_number_verified"),
  bcUserCode: text("bc_user_code"),
  ...timestamps,
});

export const usersRelations = relations(users, ({ one, many }) => ({
  branch: one(branches, {
    fields: [users.branchId],
    references: [branches.id],
  }),
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
 
}));
