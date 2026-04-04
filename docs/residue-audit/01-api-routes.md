# 01 — API Route Residue

All critical API route residue has been removed.

---

## 1. ✅ Cron: Coldroom Balance Updater — REMOVED

**Was:** `app/api/cron/coldroom-balance/route.ts`

Queried MSSQL legacy database for flower inventory in warehouse branches (`BTHQ`, `BTKL`), updated `coldroomBalance` on `items` table.

**Removed:** Entire `app/api/cron/coldroom-balance/` folder and `app/api/cron/` directory.

---

## 2. ✅ Webhook: Shopify Product Sync — REMOVED

**Was:** `app/api/webhook/shopify/product/route.ts` + `app/api/webhook/shopify/_lib/`

Received Shopify product update events and synced to `products`/`variants` tables. Sent Google Chat notifications to `GOOGLE_CHAT_SHOPIFY_VARIANT_PRODUCT_UPDATE`.

**Removed:** Entire `app/api/webhook/shopify/` folder.

---

## 3. ✅ RPC Function: Delivery Management — REMOVED

**Was:** `app/api/rpc/_functions/delivery.ts`

255-line file providing `getOrdersByDate()` with filters for delivery sessions, branch location codes, and Malaysian province codes. Referenced `orders`, `deliveries`, `lineItems`, `variants`, `statusMaster` tables (none of which exist in UniHub).

**Removed:** File + `app/api/rpc/_functions/` directory.

> Note: `app/api/rpc/_orpc/index.ts` was already clean (`router = {}`). Left in place as a valid ORPC scaffolding stub for future UniHub RPC routes.

---

## 4. ✅ SSE Events: Delivery Group Updates — REMOVED

**Was:** `app/api/events/route.ts` + `lib/event-emitter.ts` + `lib/SSE/server-sent-events.ts`

Server-Sent Events endpoint pushing `delivery_group_status_changed` messages. `GroupEventEmitter` singleton was tied to delivery logistics.

**Removed:** All three files + `lib/SSE/` directory.

> If UniHub needs real-time push later, rebuild `lib/event-emitter.ts` with domain-appropriate types (e.g., `announcement_published`, `notification_received`).

---

## 5. ✅ Mobile SCM App — REMOVED

**Was:** `app/(mobile)/scm/` (entire route group)

A separate Supply Chain Management mobile web app embedded in the Next.js project. Included its own login flow, stock transfer screens, and MSSQL queries.

**Removed:** Entire `app/(mobile)/` directory (layout + scm sub-app).
