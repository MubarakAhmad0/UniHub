# Shared Implementation Patterns

Patterns and conventions used by every page implementation plan in this directory.

---

## Role Keys (settled in DECISIONS.md)

| Role | DB key | Description |
|---|---|---|
| Admin | `admin` | Full access |
| Manager | `manager` | Lecturers, staff, faculty advisors |
| Student | `student` | Regular enrolled users |

---

## How to Read a User's Role (Client Components)

The project already has `useAuth()` in `lib/auth/use-auth.ts`.

```tsx
// In any "use client" page/component
const { hasRole, hasAnyRole } = useAuth();

const isAdmin    = hasRole("admin");
const isManager  = hasRole("manager");
const isStudent  = hasRole("student");
```

## How to Read a User's Role (Server Components / Layouts)

```tsx
// In any server component / page.tsx
import { getUserRoles, hasRole } from "@/lib/auth/utils";

const roles = await getUserRoles();
const isAdmin   = roles.includes("admin");
const isManager = roles.includes("manager");
```

---

## Pattern A — Conditional UI (same page, extra element)

Use this when the page structure stays the same but one or more buttons/sections are role-gated.

```tsx
"use client";
import { useAuth } from "@/lib/auth/use-auth";

export default function SomePage() {
  const { hasRole } = useAuth();

  return (
    <main>
      {/* Always visible */}
      <ContentList />

      {/* Manager + Admin only */}
      {hasRole("manager") || hasRole("admin") ? (
        <Button>New Announcement</Button>
      ) : null}

      {/* Admin only */}
      {hasRole("admin") ? <ManageTab /> : null}
    </main>
  );
}
```

## Pattern B — Role-Switched Page Content (same route, different view)

Use this when a manager sees a fundamentally different view on the same URL (e.g. Marks, My Courses).

```tsx
"use client";
import { useAuth } from "@/lib/auth/use-auth";
import { StudentView } from "./_components/student-view";
import { ManagerView } from "./_components/manager-view";
import { AdminView }   from "./_components/admin-view";

export default function SomePage() {
  const { hasRole, isLoading } = useAuth();
  if (isLoading) return <PageSkeleton />;

  if (hasRole("admin"))   return <AdminView />;
  if (hasRole("manager")) return <ManagerView />;
  return <StudentView />;
}
```

## Pattern C — Separate Route

Used only for pages where the entire domain is different (e.g. Payroll).
Those are not in scope for the current implementation milestone.

---

## Shared New Components Expected

| Component | Purpose | Used by |
|---|---|---|
| `RoleBadge` | Shows user's role as a badge in headers | All pages |
| `ManagerToolbar` | Consistent "manager actions" strip at top of page | Announcements, Events, Courses |
| `ConfirmDialog` | Reusable "are you sure?" dialog for destructive actions | Forums, Events, Clubs, Complaints |
| `PageSkeleton` | Consistent loading state while role loads | All Pattern B pages |

---

## File Naming Convention for Role-Split Components

```
app/dashboard/<section>/<page>/
  page.tsx                  ← entry point, role switch
  _components/
    student-view.tsx        ← what students see
    manager-view.tsx        ← what managers/lecturers see
    admin-view.tsx          ← what admins see
    <shared-components>.tsx ← used by 2+ views
```
