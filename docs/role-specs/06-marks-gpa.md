# 06 · Marks & GPA

**Route:** `/dashboard/academic/marks`

Students view their grades, GPA, and per-course mark breakdowns.

---

## Student (current build)

| Feature | Status |
|---|---|
| Overall GPA display | ✅ |
| Semester-by-semester GPA history | ✅ |
| Per-course mark breakdown (assignments, midterm, final) | ✅ |
| Grade letter and percentage | ✅ |
| Grade trend chart | ✅ |
| Enter or change grades | 🚫 |
| View other students' marks | 🚫 |

---

## Lecturer

Lecturers use this page to **enter and manage marks** for students in their assigned courses. The page perspective flips from "my grades" to "grades I manage".

| Feature | Status | Notes |
|---|---|---|
| View own personal grades | 🚫 | Not applicable — lecturers are not enrolled students |
| **Course grade overview** | 🆕 | Top-level: list of their teaching courses with average grade, submission rate |
| **Select a course → view class roster with marks** | 🆕 | Table: Student Name, ID, Component marks (A1, A2, Midterm, Final), Total, Grade |
| **Enter marks per student per component** | 🆕 | Inline editable cells in the table; save row button |
| **Bulk import marks** | 🆕 | CSV upload for a course's marks |
| **Grade distribution chart** | 🆕 | Bar chart: how many A, B, C, D, F in the class |
| **Edit submitted marks** | 🆕 | After submission, edits still allowed but require a written reason; the change is flagged to admin for review (soft-lock — not blocked, but tracked) |
| **Submit marks for finalisation** | 🆕 | "Submit to Registry" button; marks are soft-locked — further edits are flagged to admin |
| View other lecturers' course marks | 🚫 | |
| Override finalised marks | 🚫 | Requires admin approval |

### UI changes needed
- **Page title:** "Grade Management" for lecturers.
- **Course selector:** sidebar or top-dropdown to switch between their teaching courses.
- **Grade table:** rows = students, columns = mark components + total + grade letter. Cells are inline-editable inputs (number fields with min/max).
- **"Submit to Registry" button** (bottom of table); triggers confirmation dialog.
- **Bulk import:** CSV upload zone / button.
- **Distribution chart:** small area or bar chart below the table.

---

## Admin

Full grade oversight, override capability, and final mark publication control.

| Feature | Status | Notes |
|---|---|---|
| **View marks for any student** | 🆕 | Search by student ID or name; see their full academic transcript view |
| **View marks for any course** | 🆕 | Cross-course, cross-lecturer |
| **Override a mark** | 🆕 | Override button per cell; requires a written reason; creates an audit entry |
| **Approve / reject mark overrides** | 🆕 | If a lecturer requests a post-submission change, admin approves it |
| **Finalise / publish marks** | 🆕 | Publish marks university-wide (makes visible to students); can do per course or semester |
| **Unpublish marks** | 🆕 | Revert to draft state if corrections needed |
| **Export grade reports** | 🆕 | CSV / PDF per course or per student cohort |
| **Set grade policies** | 🆕 | Configure grading scale (e.g., A = 85–100%), weightings |
| **Audit log** | 🆕 | View history of all mark changes (who changed what, when, with reason) |

### UI changes needed
- **Student search bar** at top; typing student name/ID loads their transcript.
- **Course-level grade table** same as lecturer view but with override button per cell.
- **Override dialog:** original value, new value, reason (required), confirmation.
- **Publish Marks button:** per-course or semester-wide publish action.
- **Audit log tab:** table with columns: Course, Student, Component, Old Value, New Value, Changed By, Timestamp.
