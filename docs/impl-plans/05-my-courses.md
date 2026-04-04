# Implementation Plan — 05 · My Courses

**Route:** `/dashboard/academic/my-courses`  
**Pattern:** B (role-switched content — same route, completely different view per role)  
**Current file:** `app/dashboard/academic/my-courses/page.tsx` (not yet examined in detail but exists)

---

## What Changes

### Student View (unchanged baseline)
- List of enrolled courses, progress, materials link, upcoming deadlines, drop button

### Manager View (new)
Page retitled **"My Teaching Courses"**. Shows courses the manager teaches, not their own enrolment.
- Course cards: enrolled count, assignment count, avg attendance %
- Click a course → expanded drawer with tabs: **Materials | Assignments | Roster | Grades | Attendance**
- Materials tab: file list + Upload button + Publish toggle per file
- Assignments tab: list + "New Assignment" form
- Roster tab: student table with name, ID, attendance %
- Quick links to detailed Marks and Attendance pages

### Admin View (new)
Page retitled **"All Courses (Admin)"**. Shows all courses across the university.
- Filter bar: Faculty, Semester, Status, Search
- Course rows: Lecturer name (with quick-edit), Enrolled/Cap count, Status badge, three-dot Actions
- Force Enroll / Force Drop accessible from expanded roster view

---

## Files to Create / Modify

### [MODIFY] `app/dashboard/academic/my-courses/page.tsx`
Convert to role-switching shell:
```tsx
"use client";
import { useAuth } from "@/lib/auth/use-auth";
import { StudentMyCourses } from "./_components/student-view";
import { ManagerMyCourses } from "./_components/manager-view";
import { AdminAllCourses } from "./_components/admin-view";

export default function MyCoursesPage() {
  const { hasRole, isLoading } = useAuth();
  if (isLoading) return <PageSkeleton />;
  if (hasRole("admin"))   return <AdminAllCourses />;
  if (hasRole("manager")) return <ManagerMyCourses />;
  return <StudentMyCourses />;
}
```

### [NEW] `app/dashboard/academic/my-courses/_components/student-view.tsx`
Move current `page.tsx` content here verbatim. No changes to student experience.

### [NEW] `app/dashboard/academic/my-courses/_components/manager-view.tsx`
Teaching dashboard. Mock data: `teachingCourses` array with `enrolledCount`, `assignments`, `avgAttendance`.

Layout:
```
Page header: "My Teaching Courses"
Course cards (grid 2-col) → each card:
  - Course code + title
  - "Teaching" badge
  - Stats row: 32 students · 3 assignments · 78% attendance
  - "Manage →" button → opens CourseDrawer
```

#### `course-drawer.tsx` (sub-component)
Right-side drawer (Sheet) that opens when a course is selected:
```
Tabs: Materials | Assignments | Roster | Grades | Attendance

Materials tab:
  - File list: name, upload date, status (Draft/Published)
  - "Upload" button → file picker + label input
  - Per file: Publish toggle, Delete button

Assignments tab:
  - Assignment list: title, due date, max marks, visible toggle
  - "New Assignment" button → inline form (title, description, due datetime, max marks, visible toggle)

Roster tab:
  - Table: Student Name | Student ID | Attendance % | Grade (if published)

Grades tab:
  - Summary: class avg, highest, lowest
  - "Go to Grade Entry →" link to /dashboard/academic/marks

Attendance tab:
  - Class attendance percentage bar
  - "Go to Attendance →" link to /dashboard/academic/attendance
```

### [NEW] `app/dashboard/academic/my-courses/_components/admin-view.tsx`
All-courses admin overview.

Layout:
```
Page header: "All Courses (Admin View)"
Filter bar: Faculty Select | Semester Select | Status Select | Search input

Course table (DataTable-style):
  Columns: Code | Title | Faculty | Lecturer (editable) | Enrolled/Cap | Status | Actions
  Actions: View Roster | Force Enroll | Force Drop | Edit
```

#### Force Enroll/Drop Dialog:
```
Force Enroll:
  - Student search (by name/ID)
  - Reason field
  - "Confirm Enroll" button

Force Drop:
  - Student picker (from enrolled list)
  - Reason field (required)
  - "Confirm Drop" button
```

---

## Mock Data

### Manager mock:
```ts
const teachingCourses = [
  {
    id: "f-mth",
    code: "MTH 301",
    title: "Advanced Calculus II",
    enrolledCount: 32,
    assignmentCount: 3,
    avgAttendance: 78,
    materials: [
      { id: "m1", name: "Week 1 Slides.pdf", date: "Mar 1", status: "published" },
      { id: "m2", name: "Week 9 Notes.pdf", date: "Mar 28", status: "draft" },
    ],
    assignments: [
      { id: "a1", title: "Assignment 1", dueDate: "Feb 20", maxMarks: 20, visible: true },
      { id: "a2", title: "Assignment 2", dueDate: "Mar 14", maxMarks: 20, visible: true },
      { id: "a3", title: "Assignment 3", dueDate: "Apr 4", maxMarks: 20, visible: false },
    ],
    roster: [/* student list */],
  },
]
```

### Admin mock:
```ts
const allCourses = [/* existing courses + extra fields: faculty, lecturer name, enrolledCount */]
```

---

## Scope / Not in Scope
| In scope | Out of scope |
|---|---|
| Role-switching shell | Real course data from DB |
| Manager teaching dashboard with drawer | File upload (real S3/storage) |
| Materials list + publish toggle (mock) | Grade calculation |
| Assignment form (mock, local state) | Real-time roster updates |
| Admin all-courses table | Force enroll DB write |
| Force Enroll/Drop dialog (UI only) | Email notifications |
