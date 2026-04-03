# 13 · Lost & Found

**Route:** `/dashboard/campus/lost-found`

Students report lost items and browse found items to reclaim them.

---

## Student (current build)

| Feature | Status |
|---|---|
| Browse found items (photo, description, location found, date) | ✅ |
| Report a lost item (fill in description, last seen location, date) | ✅ |
| Claim a found item (submit claim with details) | ✅ |
| View own lost reports and claim status | ✅ |
| Edit / delete own lost report | ✅ |
| Moderate others' posts | 🚫 |

---

## Lecturer

Lecturers use this page identically to students for their own personal items. There is no elevated role privilege here — they are not moderators of the lost & found system.

| Feature | Status | Notes |
|---|---|---|
| All student features | ✅ | Identical experience |
| Moderate or remove items | 🚫 | Admin/security staff only |

> **Note:** No UI changes needed for the lecturer role on this page.

---

## Admin

Admins (or designated security staff under the admin role) manage the full lost & found workflow — verifying claims, removing old items, and setting retention policies.

| Feature | Status | Notes |
|---|---|---|
| All student features | ✅ | |
| **View all lost reports and found items** | 🆕 | Full list with filters: status, date range, category, location |
| **Verify a claim** | 🆕 | Confirm that the claimed item has been returned to its owner; changes item status to "Returned" |
| **Reject a claim** | 🆕 | With reason (e.g., insufficient proof) |
| **Mark item as returned** | 🆕 | Manually mark regardless of formal claim |
| **Delete / archive any report** | 🆕 | Remove spam or incorrectly filed entries |
| **Archive old unclaimed items** | 🆕 | Items older than N days with no claim get auto-archived or flagged for disposal |
| **Set retention policy** | 🆕 | Configure how many days an unclaimed item stays active before archiving |
| **Add found item on behalf of staff/security** | 🆕 | Admin can log an item found by security that a student didn't submit |
| **Send notification to claimant** | 🆕 | SMS/push to the claiming student to come collect |

### UI changes needed
- **"Manage" tab** alongside Browse/My Reports: shows full admin table of all items/reports.
- **Status filters:** Active / Claimed / Returned / Archived / Disputed.
- **Claim review panel:** per item, shows all submitted claims; admin picks Verified / Rejected for each.
- **"Archive Overdue Items" button:** one-click bulk archive based on retention policy.
- **Policy settings:** simple form to set retention period in days.
