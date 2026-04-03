# lib/ — Shared Application Logic

## Directory Map
| Path | Purpose |
|---|---|
| `auth.ts` | better-auth config — plugins, providers, DB adapter, session settings |
| `auth/permission-cache.ts` | Server-only permission + role cache (Next.js cache tags) |
| `auth/send-email.ts` | Email sending via Nodemailer |
| `orpc/index.ts` | Typed oRPC client for browser use |
| `orpc/orpc.server.ts` | Server-side oRPC router client (Server Components + Actions) |
| `api-handler.ts` | Wraps Next.js route handlers with unified error handling |
| `middleware/` | Middleware utility functions |
| `notification/` | Server-Sent Events (SSE) notification push system |
| `SSE/` | SSE stream helpers |
| `logger/` | Pino-based structured logger |
| `tanstack-query/` | TanStack Query `QueryClient` provider setup |
| `data-table.ts` | DataTable column/sort/filter utility functions |
| `filter-columns.ts` | Column filter builder for DataTable |
| `export.ts` | CSV export from table data |
| `parsers.ts` | nuqs search param parsers (typed URL state) |
| `utils.ts` | App utilities: `cn()`, `formatDate()`, `formatCurrency()`, `toTitleCase()`, etc. |
| `bigint-utils.ts` | BigInt → string/number serialization helpers |
| `constants.ts` | App-wide constant values |
| `errors.ts` | Typed error classes |
| `id.ts` | ID generation (CUID2/nanoid helpers) |
| `colors.ts` | Color manipulation utilities |
| `fallbacks.ts` | UI fallback/placeholder helpers |
| `revalidation.ts` | Next.js `revalidatePath` / `revalidateTag` wrappers |
| `unstable_cache.ts` | Typed wrapper around `next/cache` `unstable_cache` |

---

## Permission System

File: `lib/auth/permission-cache.ts` — **server-only** (`import "server-only"`)

### How it works
1. On first call per user, fetches roles + permissions from DB via a JOIN query
2. Result is cached in Next.js data cache for **5 minutes (300s)**
3. Cache is tagged with `user-{id}`, `permissions`, `roles` for targeted invalidation
4. On sign-in, the cache for that user is automatically busted (via `databaseHooks` in `lib/auth.ts`)

### API
```ts
import {
  hasPermissionCached,
  hasRoleCached,
  hasAnyRoleCached,
  getUserPermissionsWithCache,
  invalidateUserPermissions,
  userDataCached,
} from "@/lib/auth/permission-cache";

// Check a specific permission
const canCreate = await hasPermissionCached(userId, "courses:create");

// Check a role (admin always returns true)
const isLecturer = await hasRoleCached(userId, "lecturer");

// Check if user has any of these roles
const hasDashboardAccess = await hasAnyRoleCached(userId, ["admin", "lecturer", "student"]);

// Get the full permissions object (roles + permission strings)
const { roles, permissions } = await getUserPermissionsWithCache(userId);

// Invalidate cache (call after changing a user's roles/permissions)
await invalidateUserPermissions(userId); // one user
await invalidateUserPermissions();       // all users (bust by tag)

// Get cached user with branch + department relations
const user = await userDataCached(userId);
```

### Permission string format
```
"resource:action"
// Examples:
"courses:read"
"courses:create"
"marks:update"
"clubs:delete"
```

### Important: `admin` role bypass
The `admin` role **always** returns `true` in all permission/role checks. Do not add explicit `admin` checks alongside `hasPermissionCached`.

---

## oRPC Data Fetching

oRPC is the primary API layer. Avoid REST API routes unless absolutely necessary.

### In Server Components or Server Actions
```ts
// 1. Import the side-effect to register $client globally (once per request context)
import "@/lib/orpc/orpc.server.ts";

// 2. Use the typed client directly — no HTTP round-trip
import { client } from "@/lib/orpc";
const courses = await client.courses.list({});
const course = await client.courses.getById({ id: 1 });
```

### In Client Components (via TanStack Query)
```ts
import { orpcQuery } from "@/lib/orpc";

// Query (read)
const { data, isLoading, error } = orpcQuery.courses.list.useQuery({});

// Mutation (write)
const mutation = orpcQuery.courses.create.useMutation({
  onSuccess: () => { /* invalidate / refetch */ },
});
mutation.mutate({ name: "New Course" });
```

---

## REST API Handler Pattern

Use this only for endpoints that can't go through oRPC (e.g. webhooks, file uploads).

```ts
// app/api/my-endpoint/route.ts
import { createApiHandler } from "@/lib/api-handler";

export const GET = createApiHandler(async (req) => {
  const data = await getMyData();
  return NextResponse.json({ success: true, data });
});

export const POST = createApiHandler(async (req) => {
  const body = MySchema.parse(await req.json()); // ZodError auto-caught
  const result = await createMyThing(body);
  return NextResponse.json({ success: true, data: result });
});
```

**Response shape** (all API routes):
```ts
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ZodError | unknown;
};
```

---

## Key Utilities (`lib/utils.ts`)
| Function | Usage |
|---|---|
| `cn(...classes)` | Merge Tailwind classes with conflict resolution |
| `formatDate(date, opts?)` | Format a date using `Intl.DateTimeFormat` |
| `formatCurrency(amount)` | Format as `RM 0.00` |
| `toTitleCase(str)` | `"hello_world"` → `"Hello World"` |
| `toSentenceCase(str)` | `"helloWorld"` → `"Hello world"` |
| `formatDuration(seconds)` | Seconds → human-readable duration string |
| `convertBigIntToString(obj)` | Recursively convert BigInt in an object to string |
| `roundTo(value, decimals?)` | Round a number to N decimal places |
