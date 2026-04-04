# Implementation Plan — 07 · Attendance

**Route:** `/dashboard/academic/attendance`  
**Pattern:** B (role-switched content — same route, completely different view per role)  
**Current file:** `app/dashboard/academic/attendance/page.tsx` (11,181 bytes)

---

## What Changes

### Student View (updated)
- Add **"Dispute" button** on each session row
- Dispute opens a small dialog with reason field → `toast("Dispute submitted to your lecturer")`

### Manager View (new)
Retitled **"Attendance Management"**. Takes attendance for courses they teach.
- Course tabs/selector at top
- Attendance sheet table (students × sessions)
- "Start Session" button → quick-mark overlay
- Edit past sessions with reason
- At-risk students highlighted

### Admin View (new)
Policy management + oversight.
- At-risk students dashboard
- Bulk excuse absences
- Threshold policy setter

---

## Files to Create / Modify

### [MODIFY] `app/dashboard/academic/attendance/page.tsx`
Role-switching shell:
```tsx
if (hasRole("admin"))   return <AdminAttendanceView />;
if (hasRole("manager")) return <ManagerAttendanceView />;
return <StudentAttendanceView />;
```

### [NEW] `_components/student-view.tsx`
Current `page.tsx` content + one addition per session row:
```tsx
// In each session row
<Button
  variant="ghost"
  size="sm"
  className="text-xs text-muted-foreground"
  onClick={() => setDisputeSession(session)}
>
  Dispute
</Button>
```

#### `dispute-dialog.tsx` (sub-component)
```
Dialog title: "Dispute Attendance — [Date]"
Current status: "Absent"
Reason (required): Textarea placeholder "Explain why this record is incorrect..."
Supporting note: "Your dispute will be sent to Prof. [Lecturer Name] for review."
Cancel | Submit Dispute
```
On submit: `toast("Dispute sent to Prof. Elena Rossi for review")`.

### [NEW] `_components/manager-view.tsx`
Layout:
```
Header: "Attendance Management"
Course selector tabs (one per teaching course)

Per course:
  Attendance sheet table:
    Row = student (Name, Student ID)
    Column = each past session date + "Attendance %" final column
    Cell = P (Present) / A (Absent) / L (Late) / E (Excused) badge
    Past sessions: read-only unless "Edit" mode toggled
    Edit mode per session: cell becomes a Select dropdown (P/A/L/E)
    Editing past session triggers "Edit Reason" dialog

  Below table:
    At-risk row: students with < 80% highlighted in red with ⚠ icon

Actions:
  "Start Session" button in header → opens QuickMarkOverlay
  "Edit Session" toggle per column header → enables editing that column's cells
  "Export" button → toast("Exported as CSV")
```

#### `quick-mark-overlay.tsx`
Full-height overlay when "Start Session" is clicked:
```
Header: "Session — [Today's Date] · [Course Name]"
Student list (each row):
  Avatar/initial | Student Name | Student ID
  Button row: [Present ✓] [Absent ✗] [Late ⏰] [Excused E]
  Default state = unmarked (grayed out)

Footer:
  [N / total] marked · Cancel · Submit Session
```
Submit → closes overlay, adds a new session column to the sheet, `toast("Session recorded")`.

#### `edit-reason-dialog.tsx`
```
"You are editing a past session: [Date]"
Student: Alex Rivers
Current status: Absent → New status: Present
Reason (required): Textarea
Cancel | Save Edit
```

### [NEW] `_components/admin-view.tsx`
Layout:
```
Header: "Attendance Overview (Admin)"

Tabs:
  [At Risk]     — students across all courses below threshold
  [Policy]      — configure threshold %
  [Bulk Excuse] — bulk excuse absences for a date range

At Risk tab:
  Table: Student Name | Course | Attendance % | Last Session | Sessions Missed
  Rows where % < threshold highlighted

Policy tab:
  "Attendance warning threshold"
  Slider or number input (default 80%)
  "Save Policy" button

Bulk Excuse tab:
  Date range picker (From / To)
  Course selector (multi-select or "All Courses")
  Reason (Textarea)
  "Preview affected sessions" → shows count
  "Apply Excuse" button
```

---

## Mock Data

```ts
// Manager view
const sessions: Session[] = [
  { date: "Mar 3", records: { "s001": "P", "s002": "A", "s003": "L" } },
  { date: "Mar 10", records: { "s001": "P", "s002": "P", "s003": "E" } },
]

const courseRoster = [
  { id: "s001", name: "Alex Rivers",   attendancePct: 90 },
  { id: "s002", name: "Jae Lee",       attendancePct: 72 }, // at-risk
  { id: "s003", name: "Sam Kaur",      attendancePct: 85 },
]
```

---

## Scope / Not in Scope
| In scope | Out of scope |
|---|---|
| Student dispute button + dialog | Dispute notification to lecturer |
| Manager attendance sheet view | Real-time session updates |
| Quick-mark session overlay | Biometric/QR check-in |
| Edit past session with reason (local) | DB write for attendance |
| Admin at-risk table (mock) | Report generation / CSV export |
| Admin policy tab (local state, no persist) | Policy DB persistence |
| Admin bulk excuse (UI only) | Email notification to students |
