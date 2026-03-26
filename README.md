# Boilerplate

A Next.js 15 full-stack boilerplate with authentication, role-based access control, and a ready-to-use admin dashboard.

## Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Auth**: better-auth (email/password, Google OAuth, OTP)
- **Database**: PostgreSQL + Drizzle ORM
- **UI**: shadcn/ui, Tailwind CSS, Radix UI
- **Data fetching**: TanStack Query + oRPC
- **Forms**: React Hook Form + Zod

---

## Quick Start (New Project)

Run the interactive setup script — it handles everything in one go:

```bash
pnpm setup
```

It will prompt you for:
- App name
- Database URL
- Admin name, email, and password

Then it automatically:
1. Writes your `.env`
2. Updates placeholders (`layout.tsx` title, `package.json` name, email sender)
3. Pushes the database schema (`drizzle-kit push`)
4. Seeds default roles (admin, manager, user)
5. Creates the admin user and assigns the admin role

After setup:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with your admin credentials.

---

## Manual Setup

If you prefer to set things up step by step:

### 1. Configure environment

Copy and fill in `.env`:

```env
DB_URL=postgresql://postgres:password@localhost:5432/your_db
AUTH_SECRET=your-random-secret
AUTH_URL=http://localhost:3000/api/auth
AUTH_TRUST_HOST=true
```

### 2. Set up PostgreSQL (Docker)

```bash
docker run --name my-app-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
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

After registering a user through the app:

```bash
pnpm exec tsx scripts/assign-role.ts your@email.com admin
```

---

## Database

### View/edit data with Drizzle Studio

```bash
pnpm drizzle-kit studio
```

### Regenerate schema after changes

```bash
pnpm drizzle-kit push
```

---

## Role System

| Role | Key | Access |
|---|---|---|
| Administrator | `admin` | Full access — bypasses all permission checks |
| Manager | `manager` | Can manage users and view reports |
| User | `user` | Standard access |

Roles are managed via the **Admin → Manage Roles** page in the dashboard. Permissions can be assigned to roles via **Admin → Manage Permissions**.

---

## Scaffolding a DataTable

Use the built-in plop generator to scaffold a new data table module:

```bash
pnpm artisan:plop
```

1. Enter the module name (lowercase, singular — e.g. `product`, `invoice`)
2. Enter a route prefix (e.g. `dashboard`) — files are generated under `/app/{prefix}/{module}/`
3. Edit the generated files under `_lib/` (queries, actions, validations), then `_components/`

---

## Project Structure

```
app/
  (admin-module)/admin/   # Admin pages: users, roles, permissions
  dashboard/              # Main app dashboard
  api/auth/               # better-auth handlers
components/               # Shared UI components
db/
  schema/                 # Drizzle schema (auth + core)
lib/
  auth/                   # Session, permissions, role utils
  auth.ts                 # better-auth config
scripts/
  setup.ts                # Quick-start setup script
  seed-roles.ts           # Role seeder
  assign-role.ts          # Assign a role to a user by email
```