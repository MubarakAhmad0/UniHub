# 03 — Library Utilities Residue

---

## ✅ REMOVED — Critical Items

### `lib/aws/` (entire folder)
- `get-secret.ts` — AWS Secrets Manager client (secrets now in `.env`)
- `s3-utils.ts` — S3 file upload utility (delivery proof photos, order docs)
- `sqs-utils.ts` — SQS message queue publisher (async order processing jobs)

All three files + the `lib/aws/` directory deleted.

### `lib/ai/groq-parser.ts`
Groq SDK-based AI parser for TikTok Shop order messages. System prompt was explicitly `"You are a data extraction specialist for a flower delivery service."` Extracted sender name, message card content ("Tulisan atas Kad"), and delivery date from Malay/English customer messages.

File + `lib/ai/` directory deleted.

### `lib/notification/gchat.ts`
319-line file routing to 14 different Google Chat spaces — all ERP operations channels (Shopify sync, Lalamove webhooks, florist alerts, blackmarks, TikTok order updates, Business Central monitoring, etc.). None have a UniHub equivalent.

File + `lib/notification/` directory deleted.

### `lib/tiktok-session.ts`
TikTok Shop order session manager: session creation, token validation, per-IP and per-order rate limiting, cleanup routines. Backed by the now-deleted `tiktok_sessions` and `tiktok_rate_limit` DB tables.

File deleted.

### `lib/middleware/tiktok-session-auth.ts`
HOF middleware wrapping API routes with TikTok session token validation (`x-session-token` header). Also contained CORS configuration for the external TikTok order form domain (`TIKTOK_FORM_DOMAIN` env var).

File deleted.

### `lib/bc-auth.ts`
OAuth2 client credentials flow for Microsoft Business Central API. Cached access tokens for the flower company's accounting/ERP backend.

File deleted.

### `lib/event-emitter.ts`
`GroupEventEmitter` singleton emitting `delivery_group_status_changed` events for real-time delivery logistics tracking.

File + `lib/SSE/server-sent-events.ts` + `lib/SSE/` directory deleted.

### `lib/users/ot-supervision-mgmt.ts` ⚠️ PII
Hardcoded overtime supervision lead-to-staff tree with real employee names (e.g., "ARIF AFFENDI BIN ABDUL GHANI") and internal employee ID codes (e.g., "BT0193", "BTN0095").

File + `lib/users/` directory deleted.

---

## 🟡 PENDING — Medium Priority

### `lib/middleware/api-key-auth.ts` remove the erp specific logic then
**Status:** Still exists. The pattern is useful (better-auth API key validation), but it has ERP-specific logic baked in:
- Checks for `orderId` and `orderNumber` in key metadata
- Checks for a `tiktokOrder` permission flag

**Decision needed:** OK APPROVED
- [ ] REPLACE — Strip the TikTok/order-specific checks. Make the HOF generic (`withApiKeyAuth()`) for future UniHub integration endpoints that need key-based auth.

---

## 🟡 PENDING — Partial Residue in Kept Files

### `lib/utils.ts` — 7 ERP-specific functions still present 

| Function | ERP Origin | Action | REMOVE ALL THIS
|----------|-----------|--------|
| `UnitType` type | Flower inventory units (STK=Stalks, BDL=Bundles, BRICK, BUD, PSI…) | 🔴 REMOVE |
| `mapUnitNames()` | Maps those unit codes to display names | 🔴 REMOVE |
| `extractShopifyId()` | Parses Shopify GraphQL ID (`gid://shopify/Product/123`) | 🔴 REMOVE |
| `extractSize()` | Extracts bouquet size from variant display name | 🔴 REMOVE |
| `formatAdjustedDeliveryTime()` | Subtracts 15 min from delivery time for "preparation" buffer | 🔴 REMOVE |
| `formatCurrency()` | Formats as Malaysian Ringgit `RM X.XX` | 🟡 REMOVE or REPLACE with a generic formatter |
| `formatDistance()` | Formats as `X.XX km` for delivery routing | 🔴 REMOVE |



The remaining functions in `lib/utils.ts` (`cn`, `formatDate`, `formatDuration`, `toSentenceCase`, `toTitleCase`, `composeEventHandlers`, `convertBigIntToString`, `convertBigIntToNumber`, `replacer`, `changeTimezone`, `roundTo`) are all generic and should be **kept**. KEEP THIS
