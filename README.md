# UniHub

A university student portal built with Next.js 15. Provides four domains — **Academic**, **Campus**, **Community**, and **Services** — plus an **Admin module** for user, role, and permission management.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Auth | better-auth (email/password, Google OAuth, OTP, phone) |
| Database | PostgreSQL + Drizzle ORM |
| API | oRPC + TanStack Query |
| UI | shadcn/ui, Radix UI, Tailwind CSS, Framer Motion |
| Forms | React Hook Form + Zod |
| Package manager | pnpm |

---

## Quick Start

Run the interactive setup script — it handles everything at once:

```bash
pnpm setup
```

It will ask for:
- App name
- Database URL
- Admin name, email, and password

Then it automatically:
1. Writes your `.env`
2. Pushes the database schema (`drizzle-kit push`)
3. Seeds default roles (`admin`, `lecturer`, `student`)
4. Creates the admin user and assigns the admin role

Then start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with your admin credentials.

---

## Manual Setup

### 1. Configure environment

Copy `.env.example` and fill in:

```env
DB_URL=postgresql://postgres:password@localhost:5432/unihub
AUTH_SECRET=your-random-secret
AUTH_URL=http://localhost:3000/api/auth
AUTH_TRUST_HOST=true
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
```

### 2. Run PostgreSQL (Docker)

```bash
docker run --name unihub-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

### 3. Push database schema

```bash
pnpm drizzle-kit push
```

### 4. Seed roles

```bash
pnpm exec tsx scripts/seed-roles.ts
```

### 5. Assign admin role to a user

After registering through the app:

```bash
pnpm exec tsx scripts/assign-role.ts your@email.com admin
```

---

## Project Structure

```
app/
  (admin-module)/admin/     # Admin: users, roles, permissions
  dashboard/
    academic/               # Courses, marks, attendance, study plan
    announcements/          # System-wide announcements board
    campus/                 # Events, forums, library, map, venues, timetable
    community/              # Clubs, marketplace
    profile/                # User profile and settings
    services/               # Complaints, documents, finances
  api/
    auth/                   # better-auth handlers
    rpc/                    # oRPC router endpoint
components/
  ui/                       # shadcn/ui primitives (do not edit)
  navigation/               # Sidebar nav sections
  data-table/               # Generic DataTable system
db/
  schema/
    auth/                   # better-auth tables (do not modify)
    core/                   # Application tables (users, branches, departments)
    enums.ts                # All pgEnum definitions
lib/
  auth.ts                   # better-auth config
  auth/                     # Session, permissions, email utilities
  orpc/                     # oRPC client & server config
scripts/
  setup.ts                  # First-run interactive setup
  seed-roles.ts             # Seed default roles
  assign-role.ts            # Assign a role to a user by email
```

---

## Role System

| Role | Key | Access |
|---|---|---|
| Administrator | `admin` | Full access — bypasses all permission checks |
| Lecturer | `lecturer` | Can manage course content, post announcements |
| Student | `student` | Standard read + personal data access |

Roles are managed in **Admin → Manage Roles**. Permissions (`resource:action`) are assigned to roles in **Admin → Manage Permissions**.

---

## Database

```bash
pnpm drizzle-kit push    # Push schema changes to DB
pnpm drizzle-kit studio  # Open Drizzle Studio GUI
pnpm db:erd              # Regenerate erd.svg ERD diagram
```

---

## Scaffold a DataTable Module

```bash
pnpm artisan:plop
```

1. Enter the module name (lowercase, singular — e.g. `course`)
2. Enter a route prefix (e.g. `dashboard/academic`)
3. Edit the generated `_lib/` files (queries, actions, validations) and `_components/`

---

## AI Agent Context

See `CLAUDE.md` at the root for project-wide AI rules.
Domain-specific context is in:
- `app/CLAUDE.md` — routing conventions
- `db/CLAUDE.md` — schema and database rules
- `lib/CLAUDE.md` — permission system, oRPC patterns
- `components/CLAUDE.md` — UI component rules