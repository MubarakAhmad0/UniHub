# 16 · Complaints

**Route:** `/dashboard/services/complaints`

Students submit complaints or feedback about university services, teaching, facilities, or administration.

---

## Student (current build)

| Feature | Status |
|---|---|
| Submit a new complaint (category, subject, body, optional attachments) | ✅ | Categories include: teaching quality, facilities, services, **student conduct** |
| File a complaint against another student | ✅ | Harassment, misconduct, cheating, etc. |
| View own complaint history and status | ✅ |
| See status updates / responses from admin | ✅ |
| Reopen a resolved complaint | ✅ |
| Delete / withdraw a complaint | ✅ |
| View other students' complaints | 🚫 |

---

## Lecturer

Lecturers can submit complaints like any staff member. Additionally, if a complaint is filed **about a course they teach** or **their conduct**, they may be able to see a summary of that complaint (not the full identity of the complainant) and submit a response.

| Feature | Status | Notes |
|---|---|---|
| Submit a personal complaint | ✅ | Same as student |
| View own submitted complaints | ✅ | |
| **View complaints filed against their courses** | 🆕 | Complaints categorised as "Teaching / Course Quality" that reference their course code are made visible to them (anonymous complainant) |
| **Submit a formal response** | 🆕 | Lecturers can write a response that admin sees when reviewing the complaint |
| **Request clarification from admin** | 🆕 | A message field in the complaint thread visible only to the lecturer and admin |
| View complainant's identity | 🚫 | Always anonymised for the lecturer |
| View complaints about other lecturers | 🚫 | |
| Resolve or dismiss complaints | 🚫 | Admin only |

### UI changes needed
- **"Complaints About My Courses" tab** in the complaints page for lecturers; shows count badge.
- **Complaint card (lecturer view):** no complainant name shown; course code visible; status tag.
- **"Respond" button** on each complaint in that tab; opens a text response field.
- Response is logged in the admin's complaint thread view as "Lecturer Response".

---

## Admin

Full complaint management — receiving, assigning, responding, routing, and resolving all complaints.

| Feature | Status | Notes |
|---|---|---|
| All student features | ✅ | |
| **View all complaints** | 🆕 | Across all categories and users |
| **Filter by category, priority, status, date** | 🆕 | |
| **Assign a complaint to a staff member** | 🆕 | Route to the responsible department/person |
| **Change complaint status** | 🆕 | Open → In Review → Resolved → Closed |
| **Set priority** | 🆕 | Low / Medium / High / Urgent |
| **Reply to a complaint** | 🆕 | Official response visible to the student |
| **Mark as resolved** | 🆕 | Closes the complaint; student notified |
| **Reopen a resolved complaint** | 🆕 | If the student escalates |
| **Add internal notes** | 🆕 | Admin-only notes visible only to staff; not shown to student |
| **Escalate a complaint** | 🆕 | Flag to a senior admin or specific department head |
| **View complaint analytics** | 🆕 | Volume by category, average resolution time, open vs resolved |
| **Export complaint records** | 🆕 | CSV / PDF by date range or category |

### UI changes needed
- **"Manage Complaints" view** (admin default) with sortable data table.
- **Table columns:** ID, Student, Category, Subject, Priority, Status, Assigned To, Created, Last Updated, Actions.
- **Complaint detail page / Sheet:** full complaint body, attachment previews, internal notes panel, response composer, status/priority controls.
- **"Assign To" dropdown:** list of staff members.
- **Internal notes section:** clearly separate from the public reply thread.
- **Analytics tab:** bar charts + summary stats.
