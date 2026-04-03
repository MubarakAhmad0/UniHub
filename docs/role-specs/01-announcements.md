# 01 · Announcements

**Route:** `/dashboard/academic/announcements`

Announcements are the primary broadcast channel from the university to its members.
Types: `system` (IT/registry), `faculty` (course-specific), `event` (campus events).

---

## Student (current build)

| Feature | Status |
|---|---|
| View all announcements (tabbed: All / System / Faculty / Events) | ✅ |
| Mark announcement as read / unread | ✅ |
| Filter by type | ✅ |
| Priority badge on high-priority items | ✅ |
| Post or create announcements | 🚫 |

---

## Lecturer

Lecturers can only author **Faculty** announcements and only for courses they are assigned to teach.

| Feature | Status | Notes |
|---|---|---|
| View all announcements | ✅ | Same tab layout as student |
| Mark as read / unread | ✅ | |
| **Post new announcement** | 🆕 | "New Announcement" button visible in top-right |
| **Type selector in post form** | 🆕 | Limited to `faculty` and `event` only — `system` is hidden |
| **Course selector in post form** | 🆕 | Dropdown shows only the lecturer's assigned courses |
| **Priority toggle in post form** | 🆕 | Can mark their own announcement as high priority |
| **Edit own announcements** | 🆕 | Edit icon on cards they authored |
| **Delete own announcements** | 🆕 | Delete/trash icon with confirmation dialog |
| Pin announcements | 🚫 | Admin-only privilege |
| Post `system` type | 🚫 | Hidden from type dropdown |
| Edit/delete other authors' announcements | 🚫 | |

### UI changes needed
- Add **"New Announcement" button** in page header (top-right next to breadcrumb).
- **Post form (Sheet/Dialog):** fields for `Title`, `Type` (faculty/event only), `Course` (their assigned courses), `Priority` toggle, `Body`.
- Announcement cards authored by the lecturer show **edit ✏ / delete 🗑 icons** on hover.
- Author byline on each card (`Posted by Prof. X`).

---

## Admin

Admins have full broadcast authority over all announcement types.

| Feature | Status | Notes |
|---|---|---|
| View all announcements | ✅ | |
| Mark as read / unread | ✅ | |
| **Post new announcement** | 🆕 | |
| **Full type selector** | 🆕 | `system`, `faculty`, `event` — all visible |
| **Audience selector** | 🆕 | University-wide / specific faculty / specific course / specific year |
| **Priority toggle** | 🆕 | |
| **Schedule for future publish** | 🆕 | Date/time picker; shows "Scheduled" badge until published |
| **Pin announcement** | 🆕 | Pinned items appear at top of list with 📌 icon |
| **Edit any announcement** | 🆕 | Regardless of author |
| **Delete any announcement** | 🆕 | With confirmation dialog |
| **Unpublish / archive** | 🆕 | Soft-delete — keeps record but hides from students |
| **Announcement management table** | 🆕 | Separate tab "Manage" with sortable table of all announcements, status, author, reach |

### UI changes needed
- Add **"New Announcement" button** + **"Manage" tab** alongside the existing All/System/Faculty/Event tabs.
- **Manage tab:** data table with columns `Title`, `Type`, `Author`, `Audience`, `Published`, `Status`, `Actions` (edit/delete/archive/pin).
- **Post form:** extended with `Audience`, `Schedule`, `Pin` toggle.
- Pinned announcements render at the top of each tab with a distinct highlighted style.
- Status badges: `Published`, `Scheduled`, `Archived`.
