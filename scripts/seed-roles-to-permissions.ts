/**
 * Seed script — assigns default permissions to roles.
 * Run with: pnpm exec tsx scripts/seed-roles-to-permissions.ts
 */

import { db } from "../db";
import { rolesToPermissions } from "@/db/schema/auth";

const permissionsMapping = {
  admin: [
    "courses:read",
    "courses:create",
    "courses:update",
    "courses:delete",
    "marks:read",
    "marks:update",
    "marks:delete",
    "attendance:read",
    "attendance:update",
    "attendance:delete",
    "clubs:read",
    "clubs:create",
    "clubs:update",
    "clubs:delete",
    "complaints:read",
    "complaints:create",
    "complaints:update",
    "documents:read",
    "documents:request",
    "documents:approve",
    "announcements:read",
    "announcements:create",
    "announcements:update",
    "announcements:delete",
    "users:read",
    "users:create",
    "users:update",
    "users:delete",
    "roles:read",
    "roles:create",
    "roles:update",
    "roles:delete",
    "events:read",
    "events:create",
    "events:update",
    "events:delete",
    "forums:read",
    "forums:create",
    "forums:update",
    "forums:delete",
    "library:read",
    "library:create",
    "venues:read",
    "venues:create",
    "venues:update",
    "venues:delete",
    "finances:read",
    "finances:update",
  ],
  student: [
    "courses:read",
    "marks:read",
    "attendance:read",
    "clubs:read",
    "clubs:create",
    "complaints:create",
    "complaints:read",
    "documents:request",
    "documents:read",
    "announcements:read",
    "events:read",
    "forums:read",
    "forums:create",
    "library:read",
    "venues:read",
    "finances:read",
  ],
  lecturer: [
    "courses:read",
    "courses:create",
    "courses:update",
    "marks:read",
    "marks:update",
    "attendance:read",
    "attendance:update",
    "clubs:read",
    "complaints:read",
    "complaints:create",
    "documents:read",
    "announcements:read",
    "announcements:create",
    "announcements:update",
    "events:read",
    "events:create",
    "forums:read",
    "forums:create",
    "library:read",
    "library:create",
    "venues:read",
    "venues:create",
    "venues:update",
  ],
};

async function seed() {
  console.log("Linking roles to permissions...");

  for (const [roleKey, perms] of Object.entries(permissionsMapping)) {
    const role = await db.query.roles.findFirst({
      where: (roles, { eq }) => eq(roles.key, roleKey),
    });

    if (!role) {
      console.error(
        `  ✗ Role '${roleKey}' not found. Run seed-roles.ts first.`,
      );
      continue;
    }

    console.log(`  Processing role: ${roleKey} (${role.id})`);

    for (const permStr of perms) {
      const [resource, action] = permStr.split(":");
      const perm = await db.query.permissions.findFirst({
        where: (permissions, { and, eq }) =>
          and(
            eq(permissions.resource, resource),
            eq(permissions.action, action),
          ),
      });

      if (!perm) {
        console.error(
          `    ✗ Permission '${permStr}' not found. Run seed-permissions.ts first.`,
        );
        continue;
      }

      await db
        .insert(rolesToPermissions)
        .values({
          roleId: role.id,
          permissionId: perm.id,
        })
        .onConflictDoNothing({
          target: [rolesToPermissions.permissionId, rolesToPermissions.roleId],
        });
      console.log(`    ✓ ${permStr}`);
    }
  }

  console.log("Done!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
