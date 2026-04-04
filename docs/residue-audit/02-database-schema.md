# 02 — Database Schema Residue

---

## ✅ REMOVED — Critical Items

### `db/mssql.ts`
Full Microsoft SQL Server connection pool for the legacy V1 ERP. Only consumer was the coldroom balance cron (also removed). **Deleted.**

### `db/schema/enums.ts`
166 lines of ERP-only enums: flower units (stalks, bundles, bricks, buds), delivery statuses, recipe types, stock transfer workflows, Malaysian state codes, `FLORIST` user role, etc. **Replaced with a clean placeholder** that encourages adding UniHub-specific enums as features are built.

### `db/schema/types.ts`
173-line file exporting `InferSelectModel` types for dozens of ERP tables (orders, deliveries, recipes, curations, line items, driver profiles, stock transfers, etc.). Imported from missing schema modules (`./inventory`, `./logistics`, `./productions`, `./order-management`). **Deleted + removed from schema index.**

### `db/schema/status-master.ts`
Logistics status lookup table with 30+ delivery/fulfilment statuses (`PACKED`, `WIP_PENDING_CURATION`, `BC_WIP_RECEIVED`, `BLACKMARK`, `OUT_FOR_DELIVERY`, etc.). **Deleted + removed from schema index.**

### `db/schema/auth/tiktok-sessions.ts`
Two tables — `tiktok_sessions` (order verification tokens) and `tiktok_rate_limit` (IP/order rate limiting for TikTok Shop form). **Deleted + removed from `auth/index.ts`.**

### `db/schema/core/addresses.ts`
Shopify shipping address table with province codes, lat/lng, and address validation status (`google_maps_correct`, `shopify_correct`, `both_wrong`). **Deleted + removed from `core/index.ts`.**

### `db/schema/core/customers.ts`
Shopify customer mirror table (email, phone, tags, currency, bcCustomerId). **Deleted + removed from `core/index.ts`.**

### `db/schema/core/bc-customers.ts`
Microsoft Business Central CRM customer sync table. **Deleted + removed from `core/index.ts`.**

---

## 🟡 PENDING — Medium Priority

### `db/schema/core/branches.ts`
**Status:** Still exists. Referenced by `users.branchId`.

In the ERP, branches were physical store locations (`BTHQ`, `BTKL`, `BTPG`, `BTJB`). UniHub may need a campus/location concept for multi-campus support but this is not the right model as-is.

**Decision needed:**
- [yes] REPLACE — Rename to `campuses`, update `users.campusId`, seed with actual campus locations

### `db/schema/core/departments.ts`
**Status:** Still exists. Referenced by `users.departmentId`.

Generic `(id, name)` table — usable, but currently conceptually ERP-framed. Needs to be seeded with actual university faculties/departments.

**Decision needed:**
- [yes] KEEP — Rename concept in docs/seed data to reflect academic departments (e.g., "Faculty of Engineering", "School of Business")

### `db/schema/core/users.ts` — ERP column residue
**Status:** Partially cleaned. Still has ERP-specific columns and the `LEGACY_ROLES` constant.

| Column | Action |
|--------|--------|
| `LEGACY_ROLES` constant | 🟡 Remove `FLORIST`, `VENDOR`, `CUSTOMER` entries — keep only if anything references them |
| `users.role` column | 🟡 Remove — UniHub uses the RBAC `userRoles` junction table, not a flat role column |
| `users.employeeId` | 🟡 Rename → `studentId` or add a proper `matricId` field for student records |
| `users.branchId` | 🟡 Evaluate with `branches` table decision above |
| `users.bcUserCode` | 🔴 Remove — Business Central user code, has no UniHub meaning |
| `users.oldId` | 🔴 Remove — Legacy migration ID, serves no purpose |
| `users.jobTitle` | 🟡 Evaluate — could be useful for staff/lecturers but semantics unclear |
| `users.departmentId` | 🟡 Evaluate with `departments` table decision above |
