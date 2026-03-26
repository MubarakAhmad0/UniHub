import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { timestamps } from "../../utils";
import { rolesToPermissions } from "./roles-to-permissions";
import { userRoles } from "./user-roles";

export const roles = t.pgTable("roles", {
  id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: t.text("name").notNull(),
  key: t.text("key").notNull().unique(),
  description: t.text("description"),
  ...timestamps,
});

export const rolesRelations = relations(roles, ({ many }) => ({
  rolesToPermissions: many(rolesToPermissions),
  userRoles: many(userRoles),
}));

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
