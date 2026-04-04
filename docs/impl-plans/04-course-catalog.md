# Implementation Plan — 04 · Course Catalog

**Route:** `/dashboard/academic/courses`  
**Pattern:** A (conditional UI — same page, role-gated elements added)  
**Current file:** `app/dashboard/academic/courses/page.tsx` (297 lines, client component)

---

## What Changes

### For Manager
- Course cards assigned to them show a **"Teaching" badge**
- Card footer on teaching courses: `Enroll` button replaced by `"Manage Course →"` link
- Seat display on teaching courses: `"12 enrolled / 30 seats"` format instead of `"available"`
- Lecturer name shown on ALL cards (Q9 = yes, visible to everyone)

### For Admin
- **"Add Course" button** in page header
- **View toggle** (Grid / Table) in page top bar
- Table view: sortable columns with Edit/Archive/Delete actions
- Each card/row has a **three-dot menu**: Edit / Archive / Delete / Assign Lecturer

---

## Files to Create / Modify

### [MODIFY] `app/dashboard/academic/courses/page.tsx`
```tsx
const { hasRole } = useAuth();
const isAdmin   = hasRole("admin");
const isManager = hasRole("manager");

// Header additions
{isAdmin && <Button onClick={() => setAddCourseOpen(true)}>Add Course</Button>}
{isAdmin && <ViewToggle value={viewMode} onChange={setViewMode} />}

// Pass role context down to CourseCard
courses.map(c => (
  <CourseCard
    key={c.id}
    course={c}
    isTeaching={isManager && myCourseCodes.includes(c.code)}
    canAdmin={isAdmin}
  />
))
```

### [MODIFY] Existing course card (extract to component)

### [NEW] `app/dashboard/academic/courses/_components/course-card.tsx`
Extracted and extended. New props:
```ts
type CourseCardProps = {
  course: Course;
  isTeaching?: boolean;   // manager: show Teaching badge, Manage link
  canAdmin?: boolean;     // admin: show three-dot menu
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  onAssignLecturer?: () => void;
}
```
Card changes:
- **Lecturer name line** always rendered: `"Lecturer: Prof. Jane Smith"` (below code/credits)
- If `isTeaching`: show `<Badge className="bg-primary/15">Teaching</Badge>` + swap footer button for `<Button asChild><Link href="/dashboard/academic/my-courses">Manage Course →</Link></Button>`
- If `canAdmin`: three-dot menu (⋮) in card top-right with Edit / Archive / Delete / Assign Lecturer

### [NEW] `app/dashboard/academic/courses/_components/course-form-sheet.tsx`
Admin-only. Create or edit a course:
```ts
Fields:
  code: string            (e.g., "CS 601")
  title: string
  faculty: string (Select) 
  level: "Undergraduate" | "Graduate" (Select)
  credits: number
  description: Textarea
  prerequisites: string[] (multi-select of existing course codes)
  seats: number
  status: "Open" | "Limited" | "Full" | "Closed" (Select)
  lecturer: string (Select of manager users)
```
Save → updates mock data + `toast("Course updated")`.

### [NEW] `app/dashboard/academic/courses/_components/courses-table.tsx`
Admin table view (shown when `viewMode === "table"`):
- Columns: Code, Title, Faculty, Level, Lecturer, Seats (enrolled/total), Status, Actions
- Actions column: Edit / Archive / Delete
- Row click → opens Edit form sheet

### [NEW] `app/dashboard/academic/courses/_components/assign-lecturer-modal.tsx`
Simple Dialog:
- Searchable dropdown of available managers (from mock data)
- Allows multiple lecturers per course
- Save → updates course's `lecturer` field

---

## Mock Data Changes
- Add `lecturer: string` field to each course (e.g., `"Prof. Elena Rossi"`)
- Add `status: "Open" | "Limited" | "Full" | "Closed"` (already has `"Open"/"Limited"/"Full"`)
- Add `enrolledCount: number` to distinguish from `available` seats

```ts
const courses = [
  {
    id: 1,
    code: "CS 601",
    lecturer: "Prof. Elena Rossi",
    enrolledCount: 18,   // enrolled students
    seats: { available: 12, total: 30 },
    // ...
  }
]
```

---

## Scope / Not in Scope
| In scope | Out of scope |
|---|---|
| Lecturer name on all cards | Real lecturer user lookup |
| Teaching badge + manage link (manager) | Course-lecturer assignment DB write |
| Add/Edit course form (admin, mock) | Prerequisites validation logic |
| Table view with actions (admin) | Bulk course import |
| Assign Lecturer modal | Faculty/department management |
