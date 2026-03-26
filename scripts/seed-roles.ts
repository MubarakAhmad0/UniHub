/**
 * Seed script — inserts default roles into the database.
 * Run with: npx tsx scripts/seed-roles.ts
 */

import { db } from "../db";
import { roles } from "../db/schema/auth";

const defaultRoles = [
  {
    name: "Administrator",
    key: "admin",
    description: "Full access to all system features",
  },
  {
    name: "Manager",
    key: "manager",
    description: "Can manage users and view reports",
  },
  {
    name: "User",
    key: "user",
    description: "Standard access for regular users",
  },
];

async function seed() {
  console.log("Seeding roles...");

  for (const role of defaultRoles) {
    await db
      .insert(roles)
      .values(role)
      .onConflictDoUpdate({
        target: roles.key,
        set: {
          name: role.name,
          description: role.description,
        },
      });
    console.log(`  ✓ ${role.name} (${role.key})`);
  }

  console.log("Done!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
