# 08 · Study Plan

**Route:** `/dashboard/academic/study-plan`

Students view their degree progression, completed courses, and planned semesters toward graduation.

---

## Student (current build)

| Feature | Status |
|---|---|
| Degree progress overview (credits completed vs required) | ✅ |
| Planned courses per semester (drag-and-drop or static) | ✅ |
| Completed courses marked with grade | ✅ |
| Core / elective / free-elective credit counters | ✅ |
| Add a course to a planned semester | ✅ |
| Remove a course from plan | ✅ |
| Prerequisite conflict warnings | ✅ |
| Edit degree requirements | 🚫 |

---

## Lecturer

Lecturers access study plans in an **advisory** capacity — they can view plans for students who are their advisees and recommend adjustments, but cannot edit the plan directly.

| Feature | Status | Notes |
|---|---|---|
| View own degree plan | 🚫 | N/A |
| **View advisee students' study plans** | 🆕 | Only if the lecturer has been **explicitly assigned** as an academic advisor by admin (not all lecturers are advisors); searchable by student name/ID |
| **Add a recommendation note** | 🆕 | Sticky note on a course slot (e.g., "Consider taking this before CS 601") |
| **Suggest a course substitution** | 🆕 | Flag a course swap request to admin for approval |
| **Approve/endorse a student's plan** | 🆕 | "Endorse Plan" button that marks the plan as advisor-recommended; **advisory only** — students can still enroll without endorsement |
| Edit student's plan directly | 🚫 | Advisory only; student still makes final changes |
| Modify degree requirements | 🚫 | Admin only |
| View non-advisee students' plans | 🚫 | |

### UI changes needed
- **"Student Advisees" selector:** dropdown or sidebar list to pick which advisee's plan to view.
- **Read-only plan display** with an overlay advisor toolbar showing: Add Note, Suggest Substitution, Approve Plan.
- **Note tooltip** on course slots that have advisor notes.
- **Endorsement status banner** at top of plan: "Advisor Endorsed ✓" or "Not yet endorsed" (informational only, does not block enrollment).

---

## Admin

Admins manage degree programs, configure requirements, and handle plan overrides and substitutions.

| Feature | Status | Notes |
|---|---|---|
| **View any student's study plan** | 🆕 | Search by student ID/name |
| **Edit any student's plan directly** | 🆕 | With reason log (admin override) |
| **Approve course substitutions** | 🆕 | Substitution requests from advisors or students appear in an approval queue |
| **Configure degree programs** | 🆕 | Set required credits per category, required courses, elective rules per program |
| **Create / edit / delete programs** | 🆕 | E.g., add a new major or modify an existing program's requirements |
| **Graduation audit** | 🆕 | Run an automated check: which students have completed all requirements |
| **Override graduation eligibility** | 🆕 | Admin can mark a student as eligible / ineligible with a note |

### UI changes needed
- **"Programs" management tab:** list of degree programs with Edit capability.
- **Program editor:** define core courses (multi-select), credit minimums per category, credit totals.
- **Substitution queue:** table of pending substitution requests with Approve / Reject + reason.
- **Graduation audit panel:** run audit → results list students by completion status.
