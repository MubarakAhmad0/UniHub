# 05 · My Courses

**Route:** `/dashboard/academic/my-courses`

Students see the courses they are currently enrolled in, with progress and materials access.

---

## Student (current build)

| Feature | Status |
|---|---|
| List of enrolled courses (card per course) | ✅ |
| Progress indicator per course | ✅ |
| Link to course materials / portal | ✅ |
| Upcoming assignment/deadline callouts | ✅ |
| Drop a course | ✅ (button, may not be wired) |
| Upload materials | 🚫 |
| View other students' data | 🚫 |

---

## Lecturer

For lecturers, "My Courses" becomes a **teaching dashboard** — the page title changes to "My Teaching Courses" and the data is completely different (courses they teach, not enroll in).

| Feature | Status | Notes |
|---|---|---|
| View list of courses they are assigned to teach | 🆕 | Cards show course code, title, semester |
| **Student enrollment count per course** | 🆕 | `32 students enrolled` shown on card |
| **View student roster** | 🆕 | Click into a course → roster tab with student name, ID, and attendance % |
| **Upload course materials** | 🆕 | Per-course: upload files (PDF, slides, etc.) with a label and date |
| **Manage uploaded materials** | 🆕 | Edit label, replace file, delete material |
| **Post assignment / deadline** | 🆕 | Create assignment entries with title, description, due date, max marks |
| **Edit / delete assignments** | 🆕 | |
| **View grade summary per course** | 🆕 | Quick summary: class average, highest, lowest; link to full grade entry (Marks page) |
| **View quick attendance summary** | 🆕 | Per course: overall class attendance %; link to full attendance page |
| Drop a course | 🚫 | Not applicable to lecturers |

### UI changes needed
- **Page heading** (conditional): "My Teaching Courses" for lecturer role.
- **Course card (lecturer variant):** shows `N students enrolled`, `M assignments`, and `P% avg attendance` instead of student's own progress metrics.
- **Course detail view / expanded drawer:** tabs within a selected course: `Materials`, `Assignments`, `Roster`, `Grades`, `Attendance`.
- **Upload button** in Materials tab; opens file picker with label input.
- **Assignment form** (Sheet): Title, Description, Due Date/Time, Max Marks, Visible to students toggle.

---

## Admin

Admins see all courses across all lecturers in a management view. The page title becomes "All Courses (Admin View)".

| Feature | Status | Notes |
|---|---|---|
| **View all active courses across the university** | 🆕 | Filterable by faculty, semester, status |
| **View enrollment stats per course** | 🆕 | Enrolled count, waitlist count, capacity |
| **View assigned lecturer(s)** | 🆕 | With quick-edit to reassign |
| **Reassign lecturer** | 🆕 | Dropdown to pick a different/additional lecturer |
| **Pause enrollment for a specific course** | 🆕 | Sets course to "Closed" status temporarily |
| **Force-enroll a student** | 🆕 | Admin override to enroll a student bypassing prerequisites or capacity |
| **Force-drop a student** | 🆕 | With reason field |
| **Export enrollment list** | 🆕 | CSV of students per course |

### UI changes needed
- **Filter bar:** Faculty selector, Semester selector, Status filter, Search.
- **Course row/card (admin):** shows Lecturer name with an edit icon, Enrolled/Cap count, Status badge, and Actions menu.
- **Force Enroll / Force Drop** accessible via a student's name in the roster view (within a course's expanded panel).
