# 05 — NPM Dependency Residue

---

## ✅ REMOVED

| Package | Done |
|---------|------|
| `mssql 11.0.1` | ✅ |
| `@types/mssql 9.1.7` | ✅ |
| `groq-sdk 0.31.0` | ✅ |
| `@mui/material 6.4.5` | ✅ |
| `@emotion/react 11.14.0` | ✅ |
| `@emotion/styled 11.14.0` | ✅ |
| `react-lottie 1.2.10` | ✅ |
| `@types/react-lottie 1.2.10` | ✅ |
| `react-filepond` + plugins | ✅ |
| `react-dropzone 14.3.8` | ✅ |

---

## ✅ KEPT

| Package | Reason |
|---------|--------|
| `@dnd-kit/core` + `modifiers` + `sortable` + `utilities` | Planned UniHub drag-and-drop features |
| `socket.io` + `socket.io-client` | Planned real-time features (notifications, live updates) |
| `lottie-react` | Animation library (single canonical version kept) |
| `recharts` | Future analytics and data visualization |
| `csv-stringify` | Backs `lib/export.ts` generic table-to-CSV export |
