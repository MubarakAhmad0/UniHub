# Database — Drizzle ORM + PostgreSQL

## Technology
| | |
|---|---|
| ORM | Drizzle ORM v0.37 |
| Dialect | PostgreSQL |
| Config file | `drizzle.config.ts` — schema glob: `./db/schema/**/*.ts` |
| Legacy | MSSQL connector also present in `db/mssql.ts` (not primary) |

---

## Schema Layout
```
db/
  schema/
    auth/
      access-control/
        roles.ts              # roles table (id, name, key, description)
        permissions.ts        # permissions table (resource, action)
        user-roles.ts         # junction: users ↔ roles
        roles-to-permissions.ts  # junction: roles ↔ permissions
      accounts.ts             # OAuth accounts (better-auth)
      sessions.ts             # Active sessions (better-auth)
      verifications.ts        # OTP/email verification tokens
    core/
      users.ts                # Extended user table
      departments.ts          # Academic/admin departments
    enums.ts                  # All pgEnum definitions
    types.ts                  # TypeScript types inferred from schema
    utils.ts                  # Shared column helpers (timestamps, etc.)
    index.ts                  # Re-exports all schema for use elsewhere
```

---

## Key Tables

### Core Application Tables
| Table | Key columns | Description |
|---|---|---|
| `users` | `id`, `email`, `name`, `role`, `departmentId`, `isActive` | Extended better-auth users (uses \`studentId\`) |
| `departments` | `id`, `name` | Academic or administrative departments |

### Auth / RBAC Tables (in `db/schema/auth/`)
| Table | Key columns | Description |
|---|---|---|
| `roles` | `id`, `key`, `name`, `description` | Named roles (e.g. `admin`, `lecturer`, `student`) |
| `permissions` | `id`, `resource`, `action` | Granular permissions e.g. `courses:create` |
| `userRoles` | `userId`, `roleId` | Many-to-many: which roles a user has |
| `rolesToPermissions` | `roleId`, `permissionId` | Many-to-many: which permissions a role has |
| `sessions` | `userId`, `token`, `expiresAt` | Active login sessions |
| `accounts` | `userId`, `providerId` | Linked OAuth accounts (Google, etc.) |

---

## Column Conventions

### Always use the timestamps helper
```ts
import { timestamps } from "@/db/schema/utils";

export const myTable = pgTable("my_table", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  ...timestamps, // adds createdAt, updatedAt automatically
});
```

### Always use numeric auto-increment IDs
```ts
id: integer().primaryKey().generatedAlwaysAsIdentity()
```
> Never use `uuid()` or string IDs — the whole codebase uses numeric IDs.

### Infer types from the schema
```ts
export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
```

### Define relations alongside the table
```ts
export const myTableRelations = relations(myTable, ({ one, many }) => ({
  user: one(users, { fields: [myTable.userId], references: [users.id] }),
}));
```

---

## Workflow

```bash
# After modifying any file in db/schema/
pnpm drizzle-kit push    # Sync schema to the database (no migration files)

# Inspect or edit data visually
pnpm drizzle-kit studio

# Regenerate the ERD diagram (erd.svg at root)
pnpm db:erd
```

> This project uses **push mode** — there are no migration files. Never run `drizzle-kit generate`.

---

## Hard Rules
- **Do not edit `db/schema/auth/`** by hand — these tables are managed by better-auth plugins
- **Do not rename or drop columns** on live data without a data migration plan
- **Do not use `drizzle-kit generate`** — only `drizzle-kit push`
- All new application tables go in `db/schema/core/`
- Always export `type` aliases (`$inferSelect` / `$inferInsert`) from every table file
