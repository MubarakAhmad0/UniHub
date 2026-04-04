# Implementation Plan — 06 · Marks & GPA

**Route:** `/dashboard/academic/marks`  
**Pattern:** B (role-switched content — same route, completely different view per role)  
**Current file:** `app/dashboard/academic/marks/page.tsx` (18,240 bytes)

---

## What Changes

### Student View (unchanged baseline)
- Personal GPA, semester breakdown, per-course marks, grade trend chart

### Manager View (new)
Grade management for their own courses. Retitled **"Grade Management"**.
- Course selector at top
- Class roster table with inline-editable mark cells per component
- Grade distribution chart
- "Submit to Registry" button (soft-lock: marks still editable but flagged)

### Admin View (new)
Full oversight. Retitled **"Marks Management"**.
- Student search → transcript view
- Override any mark (with mandatory reason)
- "Publish Marks" action per course
- Audit log tab

---

## Files to Create / Modify

### [MODIFY] `app/dashboard/academic/marks/page.tsx`
Role-switching shell:
```tsx
if (hasRole("admin"))   return <AdminMarksView />;
if (hasRole("manager")) return <ManagerMarksView />;
return <StudentMarksView />;
```

### [NEW] `_components/student-view.tsx`
Current `page.tsx` content moved here, no changes.

### [NEW] `_components/manager-view.tsx`
Layout:
```
Header: "Grade Management"
Course selector (Select) — their teaching courses

Grade table:
  Columns: Student Name | Student ID | A1 (20) | A2 (20) | Midterm (30) | Final (30) | Total | Grade
  Cells: number input (inline editable, 0–max)
  Row state: "saved" | "unsaved" (unsaved rows highlighted with yellow border)
  "Save Row" button per row (appears when row is dirty)

Below table:
  Grade Distribution chart (bar: A/B/C/D/F counts)
  Class stats: avg, highest, lowest

Footer:
  "Submit to Registry" button:
    → opens ConfirmDialog: "Marks will be flagged for admin review on further edits. Continue?"
    → on confirm: toast("Submitted to registry") + sets submittedAt state
    → after submission: each cell shows a subtle "submitted" ring; editing any cell opens EditReasonDialog
```

#### `edit-reason-dialog.tsx` (sub-component)
Triggered when editing a cell after submission:
```
Dialog content:
  "Original value: 15"
  New value (pre-filled with current edit): number input
  Reason (required): Textarea
  Cancel | Save & Flag
```
On save: updates local state + `toast("Change flagged for admin review")`.

### [NEW] `_components/admin-view.tsx`
Layout:
```
Header: "Marks Management"
Student search bar (by name/ID) → loads their transcript inline

Tabs:
  [By Course]   — pick a course; see same grade table as manager but with Override button per cell
  [By Student]  — search a student; see full transcript
  [Audit Log]   — table of all mark changes
  [Publish]     — per-course publish controls

By Course tab:
  Course selector → same table as manager view
  Each cell has "Override" button on hover (icon only)
  → opens OverrideDialog: original value, new value, mandatory reason

Publish tab:
  List of courses with:
    Status: "Draft" | "Published"
    "Publish" button (if Draft) → toast("Marks published for CS 601")
    "Unpublish" button (if Published)

Audit Log tab:
  Table: Course | Student | Component | Old Value | New Value | Changed By | Timestamp | Reason
```

#### `override-dialog.tsx` (sub-component)
```
"Original value: 18"
New value: number input
Reason (required): Textarea
Cancel | Override
```

---

## Mock Data

```ts
// Manager view
const myCoursesWithGrades = [
  {
    courseId: "cs-105",
    courseName: "CS 105 · Data Structures",
    isSubmitted: false,
    students: [
      { id: "s001", name: "Alex Rivers",   a1: 18, a2: 16, midterm: 24, final: 0  },
      { id: "s002", name: "Jae Lee",       a1: 20, a2: 19, midterm: 28, final: 0  },
      // ...
    ]
  }
]

// Admin view
const auditLog = [
  { course: "CS 105", student: "Alex Rivers", component: "A1", oldVal: 15, newVal: 18, by: "Prof. Rossi", reason: "Marking error", ts: "2026-04-02" }
]
```

---

## Grade Letter Helper
```ts
function gradeFromTotal(total: number, maxTotal: number): string {
  const pct = (total / maxTotal) * 100;
  if (pct >= 85) return "A";
  if (pct >= 75) return "B";
  if (pct >= 65) return "C";
  if (pct >= 50) return "D";
  return "F";
}
```

---

## Scope / Not in Scope
| In scope | Out of scope |
|---|---|
| Manager grade table with inline editing | Real DB write for grades |
| Submit to Registry (soft-lock, local) | Registry API integration |
| Edit-after-submission reason dialog | Admin approval of flagged changes |
| Admin override dialog | Bulk CSV grade import |
| Publish Marks per course (local toggle) | Email notification on publish |
| Audit log (mock data) | Server-side pagination |
