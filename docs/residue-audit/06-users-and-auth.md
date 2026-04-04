# 06 — User Model & Auth Layer Residue

**Status: ✅ Complete.**

---

## ✅ `db/schema/core/users.ts` — Done

Cleaned. The following were removed or changed:

| Item | Action | Done |
|------|--------|------|
| `LEGACY_ROLES` constant | Removed entirely (RBAC via `userRoles` table supersedes flat roles) | ✅ |
| `users.role` column | Removed | ✅ |
| `users.bcUserCode` | Removed | ✅ |
| `users.oldId` | Removed | ✅ |
| `users.employeeId` | Renamed → `studentId` (`student_id` in DB) | ✅ |
| `users.branchId` | Removed (branches table deleted) | ✅ |
| `users.departmentId` | Kept — links to `departments` table (to be reseeded) | ✅ |
| `users.jobTitle` | Kept — useful for staff/lecturer display | ✅ |
| `branches` import + relation | Removed from `usersRelations` | ✅ |

> ⚠️ **DB Migration Required:** The column changes above are schema-level only. A Drizzle migration must be run (`pnpm drizzle-kit generate` + `push`) to apply them to the actual database. Column renames require special handling — Drizzle will generate a DROP + ADD, not a true rename. If data needs to be preserved, do the migration manually.

---

## ✅ `db/schema/core/branches.ts` — Removed

Deleted. The `branches` export was removed from `db/schema/core/index.ts`.

---

## ✅ `db/schema/core/departments.ts` — Kept, Reseed Pending

Table stays. Needs to be seeded with actual university academic departments/faculties (e.g., "Faculty of Engineering", "School of Business") in the setup script or seed file. The ERP never seeded this file so it's currently empty in any fresh install.

---

## ✅ `lib/middleware/api-key-auth.ts` — Rewritten

Stripped all TikTok/order-specific logic:
- Removed `orderId`, `orderNumber` from `ApiKeyValidationResult` and `AuthenticatedRequest`
- Removed metadata validation (`!metadata?.orderId || !metadata?.orderNumber`)
- Removed `tiktokOrder` permission check
- Removed `TIKTOK_FORM_DOMAIN` env var reference → replaced with generic `ALLOWED_ORIGIN`
- Updated JSDoc to describe generic usage

The HOF pattern (`withApiKeyAuth`) and CORS helpers are intact and ready for any future UniHub integration endpoint.

---

## ✅ Auth Schema — Already Handled

| Item | Status |
|------|--------|
| `tiktok_sessions` + `tiktok_rate_limit` DB tables | ✅ Removed |
| `lib/middleware/tiktok-session-auth.ts` | ✅ Removed |
| `lib/tiktok-session.ts` | ✅ Removed |
| `lib/bc-auth.ts` | ✅ Removed |
| TikTok export from `auth/index.ts` | ✅ Removed |
