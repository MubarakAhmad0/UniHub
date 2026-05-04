/**
 * Seed script — inserts default permissions into the database.
 * Run with: pnpm exec tsx scripts/seed-permissions.ts
 */

import { db } from "../db";
import { permissions } from "../db/schema/auth";

const defaultPermissions = [
  { resource: "courses", action: "read" },
  { resource: "courses", action: "create" },
  { resource: "courses", action: "update" },
  { resource: "courses", action: "delete" },
  { resource: "marks", action: "read" },
  { resource: "marks", action: "update" },
  { resource: "marks", action: "delete" },
  { resource: "attendance", action: "read" },
  { resource: "attendance", action: "update" },
  { resource: "attendance", action: "delete" },
  { resource: "clubs", action: "read" },
  { resource: "clubs", action: "create" },
  { resource: "clubs", action: "update" },
  { resource: "clubs", action: "delete" },
  { resource: "complaints", action: "read" },
  { resource: "complaints", action: "create" },
  { resource: "complaints", action: "update" },
  { resource: "documents", action: "read" },
  { resource: "documents", action: "request" },
  { resource: "documents", action: "approve" },
  { resource: "announcements", action: "read" },
  { resource: "announcements", action: "create" },
  { resource: "announcements", action: "update" },
  { resource: "announcements", action: "delete" },
  { resource: "users", action: "read" },
  { resource: "users", action: "create" },
  { resource: "users", action: "update" },
  { resource: "users", action: "delete" },
  { resource: "roles", action: "read" },
  { resource: "roles", action: "create" },
  { resource: "roles", action: "update" },
  { resource: "roles", action: "delete" },
  { resource: "events", action: "read" },
  { resource: "events", action: "create" },
  { resource: "events", action: "update" },
  { resource: "events", action: "delete" },
  { resource: "forums", action: "read" },
  { resource: "forums", action: "create" },
  { resource: "forums", action: "update" },
  { resource: "forums", action: "delete" },
  { resource: "library", action: "read" },
  { resource: "library", action: "create" },
  { resource: "venues", action: "read" },
  { resource: "venues", action: "create" },
  { resource: "venues", action: "update" },
  { resource: "venues", action: "delete" },
  { resource: "finances", action: "read" },
  { resource: "finances", action: "update" },
];

async function seed() {
  console.log("Seeding permissions...");

  for (const perm of defaultPermissions) {
    await db
      .insert(permissions)
      .values({
        resource: perm.resource,
        action: perm.action,
      })
      .onConflictDoUpdate({
        target: [permissions.resource, permissions.action],
        set: {
          resource: perm.resource,
          action: perm.action,
        },
      });
    console.log(`  ✓ ${perm.resource}:${perm.action}`);
  }

  console.log("Done!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
