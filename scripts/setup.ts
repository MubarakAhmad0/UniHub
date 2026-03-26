/**
 * Boilerplate Quick-Start Setup Script
 *
 * Usage: npx tsx scripts/setup.ts
 *
 * Prompts for basic config, then:
 *  1. Writes/updates .env
 *  2. Replaces placeholder text in source files
 *  3. Pushes DB schema (drizzle-kit push)
 *  4. Seeds default roles
 *  5. Creates admin user + assigns admin role
 */

import { execSync } from "child_process";
import { createInterface } from "readline";
import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

// ─── Prompt helper ────────────────────────────────────────────────────────────

const rl = createInterface({ input: process.stdin, output: process.stdout });

function prompt(question: string, defaultValue?: string): Promise<string> {
  return new Promise((resolve) => {
    const hint = defaultValue ? ` (default: ${defaultValue})` : "";
    rl.question(`${question}${hint}: `, (answer) => {
      resolve(answer.trim() || defaultValue || "");
    });
  });
}

function promptSecret(question: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(`${question}: `);
    let password = "";

    const { stdin } = process;
    const wasRaw = stdin.isRaw;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    const onData = (char: string) => {
      if (char === "\n" || char === "\r" || char === "\u0004") {
        stdin.setRawMode(wasRaw);
        stdin.pause();
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(password);
      } else if (char === "\u0003") {
        process.exit();
      } else if (char === "\u007f") {
        password = password.slice(0, -1);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(`${question}: ${"*".repeat(password.length)}`);
      } else {
        password += char;
        process.stdout.write("*");
      }
    };

    stdin.on("data", onData);
  });
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function generateSecret(length = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

function updateFile(
  filePath: string,
  replacements: Array<{ from: string | RegExp; to: string }>
): void {
  let content = fs.readFileSync(filePath, "utf-8");
  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }
  fs.writeFileSync(filePath, content, "utf-8");
}

function updateEnv(envPath: string, updates: Record<string, string>): void {
  let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf-8") : "";

  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=.*`, "m");
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`);
    } else {
      content += `\n${key}=${value}`;
    }
  }

  fs.writeFileSync(envPath, content, "utf-8");
}

function log(message: string) {
  console.log(`  ${message}`);
}

function step(title: string) {
  console.log(`\n\x1b[36m▶ ${title}\x1b[0m`);
}

function success(message: string) {
  console.log(`  \x1b[32m✓\x1b[0m ${message}`);
}

function warn(message: string) {
  console.log(`  \x1b[33m⚠\x1b[0m ${message}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const ROOT = path.resolve(__dirname, "..");

  console.log("\n\x1b[1m🚀 Boilerplate Setup\x1b[0m");
  console.log("─".repeat(40));
  console.log("Answer the prompts below. Press Enter to accept defaults.\n");

  // ── 1. Gather input ─────────────────────────────────────────────────────────
  const appName = await prompt("App name", "My App");
  const dbUrl = await prompt(
    "Database URL",
    `postgresql://postgres:password@localhost:5432/${slugify(appName)}`
  );
  const adminName = await prompt("Admin full name", "Admin");
  const adminEmail = await prompt("Admin email");
  if (!adminEmail) {
    console.error("\x1b[31m✗ Admin email is required.\x1b[0m");
    process.exit(1);
  }
  const adminPassword = await promptSecret("Admin password");
  if (adminPassword.length < 5) {
    console.error("\x1b[31m✗ Password must be at least 5 characters.\x1b[0m");
    process.exit(1);
  }

  rl.close();

  const appSlug = slugify(appName);
  const emailDomain = adminEmail.split("@")[1] ?? "myapp.com";

  // ── 2. Write .env ────────────────────────────────────────────────────────────
  step("Writing .env");
  const envPath = path.join(ROOT, ".env");
  updateEnv(envPath, {
    DB_URL: dbUrl,
    APP_NAME: appName,
    AUTH_SECRET: generateSecret(),
    AUTH_URL: "http://localhost:3000/api/auth",
    AUTH_TRUST_HOST: "true",
    APP_ENV: "development",
    NODE_ENV: "development",
  });
  success(".env updated");

  // ── 3. Replace placeholders in source files ──────────────────────────────────
  step("Updating source file placeholders");

  // app/layout.tsx — title & description
  const layoutPath = path.join(ROOT, "app", "layout.tsx");
  if (fs.existsSync(layoutPath)) {
    updateFile(layoutPath, [
      { from: /title: ["']Boilerplate App["']/, to: `title: "${appName}"` },
      {
        from: /description: ["']A generic boilerplate application["']/,
        to: `description: "The ${appName} application"`,
      },
    ]);
    success(`app/layout.tsx — title set to "${appName}"`);
  }

  // package.json — name
  const pkgPath = path.join(ROOT, "package.json");
  if (fs.existsSync(pkgPath)) {
    updateFile(pkgPath, [
      { from: /"name": "boilerplate"/, to: `"name": "${appSlug}"` },
    ]);
    success(`package.json — name set to "${appSlug}"`);
  }

  // lib/auth.ts — email sender
  const authPath = path.join(ROOT, "lib", "auth.ts");
  if (fs.existsSync(authPath)) {
    updateFile(authPath, [
      {
        from: /no-reply@myapp\.com/g,
        to: `no-reply@${emailDomain}`,
      },
    ]);
    success(`lib/auth.ts — sender set to "no-reply@${emailDomain}"`);
  }

  // ── 4. Push DB schema ────────────────────────────────────────────────────────
  step("Pushing database schema (drizzle-kit push)");
  try {
    execSync("npx drizzle-kit push --config=drizzle.config.ts", {
      cwd: ROOT,
      stdio: "inherit",
      env: { ...process.env, DB_URL: dbUrl },
    });
    success("Schema pushed");
  } catch {
    warn("drizzle-kit push failed — schema may already be up to date, continuing...");
  }

  // ── 5. Connect to DB and seed ────────────────────────────────────────────────
  // Load env so the db module picks up the new DB_URL
  config({ path: envPath, override: true });

  const { db } = await import("../db");

  step("Seeding default roles");
  const { roles } = await import("../db/schema/auth");

  const defaultRoles = [
    { name: "Administrator", key: "admin", description: "Full access to all system features" },
    { name: "Manager", key: "manager", description: "Can manage users and view reports" },
    { name: "User", key: "user", description: "Standard access for regular users" },
  ];

  for (const role of defaultRoles) {
    await db
      .insert(roles)
      .values(role)
      .onConflictDoUpdate({
        target: roles.key,
        set: { name: role.name, description: role.description },
      });
    success(`Role: ${role.name}`);
  }

  // ── 6. Create admin user ─────────────────────────────────────────────────────
  step("Creating admin user");

  const { users } = await import("../db/schema");
  const { userRoles } = await import("../db/schema/auth");
  const { eq } = await import("drizzle-orm");

  // Hash password the same way better-auth does (scrypt via @better-auth/utils or fallback)
  let hashedPassword: string;
  try {
    const { hashPassword } = await import("better-auth/crypto");
    hashedPassword = await hashPassword(adminPassword);
  } catch {
    // Fallback: use Node crypto scrypt (compatible with better-auth's default)
    hashedPassword = await new Promise<string>((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString("hex");
      crypto.scrypt(adminPassword, salt, 64, (err, key) => {
        if (err) reject(err);
        else resolve(`${salt}:${key.toString("hex")}`);
      });
    });
    warn(
      "Used fallback password hashing — if login fails, recreate the user via the app's sign-up page."
    );
  }

  // Upsert user
  const existingUsers = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, adminEmail));

  let adminUserId: number;

  if (existingUsers.length > 0) {
    adminUserId = existingUsers[0].id;
    warn(`User "${adminEmail}" already exists (id: ${adminUserId}), skipping creation`);
  } else {
    const inserted = await db
      .insert(users)
      .values({
        name: adminName,
        email: adminEmail,
        emailVerified: true,
        isActive: true,
      })
      .returning({ id: users.id });
    adminUserId = inserted[0].id;
    success(`User created (id: ${adminUserId})`);
  }

  // Create account entry (required for better-auth email+password login)
  const { accounts } = await import("../db/schema/auth");
  
  const existingAccounts = await db
    .select({ id: accounts.id })
    .from(accounts)
    .where(eq(accounts.userId, adminUserId));

  if (existingAccounts.length === 0) {
    await db.insert(accounts).values({
      userId: adminUserId,
      accountId: adminEmail,
      providerId: "credential",
      password: hashedPassword,
    });
    success("Credentials stored");
  } else {
    warn("Account already exists, skipping");
  }

  // ── 7. Assign admin role ────────────────────────────────────────────────────
  step("Assigning admin role");

  const [adminRole] = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.key, "admin"));

  await db
    .insert(userRoles)
    .values({ userId: adminUserId, roleId: adminRole.id })
    .onConflictDoNothing();

  success(`Admin role assigned to ${adminEmail}`);

  // ── Done ────────────────────────────────────────────────────────────────────
  console.log("\n\x1b[32m✅ Setup complete!\x1b[0m");
  console.log("─".repeat(40));
  log(`App:      ${appName}`);
  log(`Database: ${dbUrl}`);
  log(`Admin:    ${adminEmail}`);
  console.log("\nRun \x1b[1mnpm run dev\x1b[0m to start the app.\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("\n\x1b[31m✗ Setup failed:\x1b[0m", err.message ?? err);
  process.exit(1);
});
