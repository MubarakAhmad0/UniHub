import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { permissions } from "./permissions";
import { roles } from "./roles";

export const rolesToPermissions = t.pgTable(
  "roles_to_permissions",
  {
    roleId: t
      .integer("role_id")
      .notNull()
      .references(() => roles.id, {
        onDelete: "cascade",
      }),
    permissionId: t
      .integer("permission_id")
      .notNull()
      .references(() => permissions.id, {
        onDelete: "cascade",
      }),
  },
  (s) => [
    t.primaryKey({
      columns: [s.permissionId, s.roleId],
    }),
    t.index().on(s.roleId),
  ],
);

export const rolesToPermissionsRelations = relations(
  rolesToPermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolesToPermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolesToPermissions.permissionId],
      references: [permissions.id],
    }),
  }),
);
