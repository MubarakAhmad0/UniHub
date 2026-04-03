# Routing — App Directory

## App Router Conventions
- All `page.tsx` files are **Server Components** by default
- Do **not** add `"use client"` to a page — move client logic into `_components/`
- Data fetching happens directly in `page.tsx` via `async/await` — no `useEffect`, no client fetches on mount
- Layouts receive children as a prop and do not re-render on route changes

## Public vs Protected Routes
| Status | Routes |
|---|---|
| **Public** (no auth needed) | `/` (login), `/register`, `/reset-password`, `/unauthorized` |
| **Protected** (session required) | `/dashboard/**`, `/admin/**` |

Protection is enforced in `middleware.ts` via `better-auth` session cookie detection.
Unauthenticated users hitting protected routes are redirected to `/`.

## Route Groups (`app/`)
| Group | Purpose |
|---|---|
| `(admin-module)/` | Admin portal with its own layout — users, roles, permissions |
| `(mobile)/` | Mobile-specific views with a separate layout |
| `dashboard/` | Main student portal with sidebar layout |
| `api/auth/` | better-auth handler (`GET`/`POST` catch-all) |
| `api/rpc/` | oRPC router entry point |
| `i18n/` | Internationalization routes (next-intl) |
| `register/` | User self-registration |
| `reset-password/` | Password reset flow |
| `unauthorized/` | 403 access denied page |

## Dashboard Sections (`app/dashboard/`)
### Academic
| Route | Description |
|---|---|
| `academic/courses` | Course catalog — browse all available courses |
| `academic/my-courses` | Enrolled courses for the current student |
| `academic/announcements` | Announcements from lecturers or admin |
| `academic/study-plan` | Student's degree study plan |
| `academic/marks` | Academic marks and GPA tracker |
| `academic/attendance` | Attendance records |

### Campus
| Route | Description |
|---|---|
| `campus/events` | Campus events calendar |
| `campus/forums` | Discussion forums |
| `campus/library` | Library resource search |
| `campus/lost-found` | Lost and found board |
| `campus/map` | Interactive campus map |
| `campus/timetable` | Class timetable viewer |
| `campus/venues` | Venue booking |

### Community
| Route | Description |
|---|---|
| `community/clubs` | Student clubs and societies |
| `community/marketplace` | Student buy/sell marketplace |

### Services
| Route | Description |
|---|---|
| `services/complaints` | Submit and track complaints |
| `services/documents` | Request official documents |
| `services/finances` | View fees and financial info |

## Admin Routes (`app/(admin-module)/admin/`)
| Route | Description |
|---|---|
| `/admin` | Overview dashboard |
| `/admin/users` | User list — create, edit, deactivate |
| `/admin/roles` | Create and manage named roles |
| `/admin/permissions` | Assign `resource:action` permissions to roles |
| `/admin/password-changer` | Force-reset a user's password |

## File & Folder Naming Convention
```
app/dashboard/academic/courses/
  page.tsx              # Route entry — Server Component
  layout.tsx            # Optional section layout
  _components/
    course-list.tsx     # Client Component used by this page only
    course-card.tsx
  _lib/
    actions.ts          # Server Actions ("use server")
    queries.ts          # DB queries used by page.tsx or actions.ts
    validations.ts      # Zod schemas for this feature
```

> **Rule**: Anything in `_components/` and `_lib/` is private to that route.
> If a component needs to be shared across routes, move it to `components/`.

## Adding a New Page
1. Create the folder under the correct section (e.g. `app/dashboard/campus/bookings/`)
2. Add `page.tsx` (Server Component)
3. Add `_lib/queries.ts`, `_lib/actions.ts`, `_lib/validations.ts` as needed
4. Add `_components/` for any client-side UI
5. Add the route to the matching navigation component in `components/navigation/`
