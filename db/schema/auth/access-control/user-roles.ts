import { users } from "@/db/schema";
import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { roles } from "./roles";

export const userRoles = t.pgTable(
  "user_roles",
  {
    id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: t.integer("user_id").references(() => users.id),
    roleId: t.integer("role_id").references(() => roles.id),
    assignedAt: t.timestamp("assigned_at").defaultNow().notNull(),
  },
  (s) => [t.unique().on(s.userId, s.roleId), t.index().on(s.userId)],
);

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));
