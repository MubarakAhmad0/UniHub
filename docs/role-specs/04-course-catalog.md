# 04 · Course Catalog

**Route:** `/dashboard/academic/courses`

Browse all available courses for the semester. Filters: search, faculty, level.  
Statuses: Open, Limited, Full. Action: Enroll / Join Waitlist.

---

## Student (current build)

| Feature | Status |
|---|---|
| Browse course grid with search and filters | ✅ |
| View course details (code, credits, description, prerequisites, seats) | ✅ |
| Enroll in a course (if seats available and prerequisites met) | ✅ |
| Join Waitlist (if full) | ✅ |
| Prerequisite met/not-met indicator | ✅ |
| Add/edit/delete courses | 🚫 |

---

## Lecturer

Lecturers use this page to view the catalog and get context on courses adjacent to theirs. Their primary course management happens on "My Courses" instead.

| Feature | Status | Notes |
|---|---|---|
| Browse course grid with search and filters | ✅ | |
| View course details | ✅ | |
| Enroll / Join Waitlist | 🚫 | Replaced by a read-only view |
| **"Teaching" badge** | 🆕 | Courses the lecturer is assigned to teach are marked with a "Teaching" badge; no enroll button on those |
| **Enrollment count detail** | 🆕 | On courses they teach, the seat display shows `12 enrolled / 30 seats` (student count, not just "available") |
| **Link to manage course** | 🆕 | A "Manage Course →" link on their teaching courses deep-links to My Courses > that course |
| Add/edit/delete courses | 🚫 | Admin only |

### UI changes needed  
- **"Teaching" badge** (`bg-primary/15 text-primary`) on lecturer's assigned course cards.
- **Card footer** on teaching courses swaps `Enroll` button for `Manage Course →` link button.
- Seat display on teaching courses shows enrolled/total count format.

---

## Admin

Full CRUD on the course catalog, including creating, editing, archiving courses and managing enrollment caps.

| Feature | Status | Notes |
|---|---|---|
| Browse and filter catalog | ✅ | |
| **"Add Course" button** | 🆕 | In page header, opens Course creation form |
| **Create course form** | 🆕 | Fields: Code, Title, Faculty, Level, Credits, Description, Prerequisites (multi-select), Seat Cap, Status |
| **Edit any course** | 🆕 | Edit ✏ icon in card footer; same form pre-filled |
| **Delete / Archive course** | 🆕 | Archive soft-removes (keeps history); delete is hard (admin only, with confirmation) |
| **Assign lecturer(s)** | 🆕 | On each course card/edit form: multi-select lecturer picker |
| **Adjust seat capacity** | 🆕 | Inline editable field on card or in edit form |
| **Open / Close enrollment** | 🆕 | Toggle course status between Open/Closed regardless of seats |
| **Bulk status update** | 🆕 | Select multiple courses → update status in one action |
| **Course management table view** | 🆕 | Toggle between grid and table view; table has sortable columns |

### UI changes needed
- **View toggle** (Grid / Table) in page top bar.
- **"Add Course" button** in page header.
- **Table view:** columns: Code, Title, Faculty, Level, Lecturer(s), Seats, Status, Actions.  
- **Card footer (admin):** three-dot menu with Edit / Archive / Delete / Assign Lecturer.
- **Assign Lecturer modal:** searchable dropdown of all lecturers; allows multiple assignments.
