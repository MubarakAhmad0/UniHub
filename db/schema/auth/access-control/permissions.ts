import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { timestamps } from "../../utils";
import { rolesToPermissions } from "./roles-to-permissions";

export const permissions = t.pgTable(
  "permissions",
  {
    id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
    resource: t.text("resource").notNull(),
    action: t.text("action").notNull(),
    description: t.text("description"),
    ...timestamps,
  },
  (s) => [t.unique().on(s.resource, s.action)],
);

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolesToPermissions: many(rolesToPermissions),
}));

export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;
