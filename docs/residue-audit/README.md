# Flower ERP → UniHub Residue Audit

This folder documents all code, files, APIs, and dependencies that were **residue from the original flower curation & delivery ERP**. Updated to reflect cleanup status.

## Audit Files

| File | What It Covers | Status |
|------|----------------|--------|
| [01-api-routes.md](./01-api-routes.md) | API routes (cron, webhooks, RPC functions) | ✅ Done |
| [02-database-schema.md](./02-database-schema.md) | DB tables, enums, and type definitions | ✅ Critical done / 🟡 Medium pending |
| [03-lib-utilities.md](./03-lib-utilities.md) | Utility libraries (AWS, AI, GChat, TikTok, BC) | ✅ Critical done / 🟡 Medium pending |
| [04-navigation-components.md](./04-navigation-components.md) | Orphaned nav components for ERP departments | 🟡 Pending review |
| [05-dependencies.md](./05-dependencies.md) | NPM packages that are ERP-specific | ✅ Critical done / 🟡 Medium pending |
| [06-users-and-auth.md](./06-users-and-auth.md) | ERP-specific fields in user model and auth | 🟡 Pending review |

## Decision Legend

- **`REMOVE`** — Delete entirely
- **`KEEP`** — Actually useful for UniHub, stays
- **`REPLACE`** — Keep pattern, rewrite for UniHub domain
- **`DEFER`** — Leave for now, noted why

## Severity Legend

- 🔴 **High** — Actively running code with no UniHub purpose
- 🟡 **Medium** — Dead code / needs rethinking for UniHub domain
- 🟢 **Low** — Minor naming / cosmetic issues
- ✅ **Done** — Removed/fixed
