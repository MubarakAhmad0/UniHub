/**
 * Assign a role to a user by email.
 * Usage: npx tsx scripts/assign-role.ts <email> <role-key>
 * Example: npx tsx scripts/assign-role.ts john@example.com admin
 * Available role keys: admin, manager, user
 */

import { config } from "dotenv";
config({ path: ".env" });

import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { roles, userRoles } from "../db/schema/auth";

const [email, roleKey] = process.argv.slice(2);

if (!email || !roleKey) {
  console.error("Usage: npx tsx scripts/assign-role.ts <email> <role-key>");
  console.error("Example: npx tsx scripts/assign-role.ts john@example.com admin");
  process.exit(1);
}

async function assignRole() {
  // Find user
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    console.error(`❌ No user found with email: ${email}`);
    process.exit(1);
  }

  // Find role
  const [role] = await db.select().from(roles).where(eq(roles.key, roleKey));
  if (!role) {
    console.error(`❌ No role found with key: "${roleKey}"`);
    console.error(`   Available keys: admin, manager, user`);
    process.exit(1);
  }

  // Insert (ignore if already assigned)
  await db
    .insert(userRoles)
    .values({ userId: user.id, roleId: role.id })
    .onConflictDoNothing();

  console.log(`✓ Assigned role "${role.name}" to ${user.email}`);
  process.exit(0);
}

assignRole().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
