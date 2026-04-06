# UniHub — AI Agent Context

## What is this?
UniHub is a **university student portal** built on Next.js 15.
Students access four sections — **Academic**, **Campus**, **Community**, and **Services**.
An **Admin module** manages users, roles, and permissions.
The root page (`/`) is the **login screen** — it redirects authenticated users to `/dashboard`.

## Tech Stack
| Layer | Library / Version |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Auth | better-auth v1 (email/password, Google OAuth, OTP, phone) |
| Database | PostgreSQL · Drizzle ORM v0.37 |
| API Layer | oRPC v1 · TanStack Query v5 |
| UI | shadcn/ui · Radix UI · Tailwind CSS v3 · Framer Motion v11 |
| Forms | React Hook Form v7 · Zod v3 |
| URL state | nuqs v2 |
| Global state | Zustand v5 |
| Package manager | pnpm v9 |

## Commands
```bash
# Development
pnpm dev          # Start dev server with Turbopack
pnpm build        # Production build
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit (type-check without building)

# Database
pnpm drizzle-kit push    # Sync schema to DB (no migration files — push mode)
pnpm drizzle-kit studio  # Open Drizzle Studio GUI
pnpm db:erd              # Regenerate erd.svg from current schema

# Setup & Seeding
pnpm setup                                          # Interactive first-run wizard
pnpm exec tsx scripts/seed-roles.ts                 # Seed default roles
pnpm exec tsx scripts/assign-role.ts <email> <key>  # Assign role to a user

# Scaffolding
pnpm artisan:plop  # Scaffold a new DataTable module (queries, actions, validations, UI)
```

## Domain Map
| Domain | Source path |
|---|---|
| Login page | `app/page.tsx` |
| Dashboard shell | `app/dashboard/layout.tsx` |
| General/Announcements | `app/dashboard/announcements/` |
| Academic section | `app/dashboard/academic/` |
| Campus section | `app/dashboard/campus/` |
| Community section | `app/dashboard/community/` |
| Profile section | `app/dashboard/profile/` |
| Services section | `app/dashboard/services/` |
| Admin portal | `app/(admin-module)/admin/` |
| oRPC API endpoint | `app/api/rpc/` |
| Auth API endpoint | `app/api/auth/` |
| Auth config | `lib/auth.ts` |
| Permission system | `lib/auth/permission-cache.ts` |
| oRPC client | `lib/orpc/index.ts` |
| oRPC server client | `lib/orpc/orpc.server.ts` |
| Database | `db/schema/` |
| Shared UI | `components/ui/` |
| Navigation | `components/navigation/` |
| Custom hooks | `hooks/` |

## Documentation
Detailed docs live in `docs/` — read the relevant file before working on that area:
| File | Covers |
|---|---|
| `docs/routes.md` | Every route, route groups, file naming conventions |
| `docs/database.md` | Schema layout, tables, relationships, migration workflow |
| `docs/lib.md` | Permission system, oRPC patterns, API handler, utility functions |
| `docs/components.md` | UI rules, navigation pattern, DataTable system, hooks |

## Boundaries — Never Touch Without Asking
| File / Folder | Reason |
|---|---|
| `.env` | Contains secrets |
| `db/schema/auth/` | better-auth owned tables — changing breaks sessions/auth |
| `middleware.ts` | Auth guard for all protected routes |
| `components/ui/` | shadcn/ui primitives — use CLI to add/update |
| `pnpm-lock.yaml` | Never edit manually |

## Code Style (follow exactly)
```tsx
// ✅ Server Component — fetch directly, no useEffect
export default async function CoursesPage() {
  const courses = await getCourses(); // db query or server client call
  return <CourseList courses={courses} />;
}

// ✅ Client Component — always "use client", lives in _components/
"use client";
export function CourseCard({ course }: { course: Course }) { ... }

// ✅ oRPC in Client Component
import { orpcQuery } from "@/lib/orpc";
const { data, isLoading } = orpcQuery.courses.list.useQuery({});

// ✅ Server Actions — always in _lib/actions.ts next to the page
"use server";
export async function createCourse(input: CreateCourseInput) { ... }

// ✅ Classname merging — always use cn()
import { cn } from "@/lib/utils";
<div className={cn("base-class", condition && "conditional-class")} />
```

## Key Architectural Patterns
- **Route co-location**: each feature folder has `_lib/` (actions, queries, validations) + `_components/` beside `page.tsx`
- **Permissions**: `resource:action` strings e.g. `"courses:create"` — check via `hasPermissionCached(userId, permission)`
- **Role bypass**: `admin` role skips all permission checks and always returns `true`
- **API response shape**: `{ success: boolean, data?: T, message?: string, errors?: unknown }`
- **IDs**: numeric auto-increment — `integer().primaryKey().generatedAlwaysAsIdentity()`
- **Timestamps**: always spread `timestamps` from `@/db/schema/utils` — never define `createdAt`/`updatedAt` manually
