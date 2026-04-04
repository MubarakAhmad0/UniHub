# Implementation Plan — 09 · Timetable

**Route:** `/dashboard/campus/timetable`  
**Pattern:** B (role-switched content — student sees their schedule; manager sees teaching schedule)  
**Current file:** `app/dashboard/campus/timetable/page.tsx` (13,089 bytes)

---

## What Changes

### Student View (unchanged)
- Weekly schedule of enrolled courses

### Manager View (new)
Retitled **"Teaching Schedule"**. Shows sessions they teach.
- Session cards: course code, enrolled count, room, "Take Attendance →" shortcut
- "Add Office Hours" button → form to set recurring blocks

### Admin View (conditional additions on existing page)
- "Edit Mode" toggle enables timetable editing
- Click empty slot → create new slot
- Click existing slot → edit it
- Conflict warnings (same room double-booked)
- Room management sidebar
- Timetable is always live — saves go to DB directly, students see on refresh (Q17)

---

## Files to Create / Modify

### [MODIFY] `app/dashboard/campus/timetable/page.tsx`
Role-switching shell:
```tsx
if (hasRole("admin"))   return <AdminTimetableView />;
if (hasRole("manager")) return <ManagerTimetableView />;
return <StudentTimetableView />;
```

### [NEW] `_components/student-view.tsx`
Move current page content here. No changes to student experience.

### [NEW] `_components/manager-view.tsx`
Teaching schedule layout. Same calendar grid as student view but with teaching data:

Session card (manager variant):
```tsx
<div className="bg-primary/10 rounded p-2 text-xs space-y-0.5">
  <p className="font-semibold">{session.courseCode}</p>
  <p className="text-muted-foreground">{session.room} · {session.enrolledCount} students</p>
  <Link href="/dashboard/academic/attendance" className="text-primary underline text-[10px]">
    Take Attendance →
  </Link>
</div>
```

Office hours blocks rendered in a distinct colour (`bg-amber-100 text-amber-800`).

"Add Office Hours" button in page header:
```tsx
<Button variant="outline" size="sm" onClick={() => setOfficeHoursOpen(true)}>
  + Office Hours
</Button>
```

#### `office-hours-form.tsx`
Sheet form:
```
Type:  One-time | Recurring
Day:   Select (Mon–Fri)
Start: TimePicker
End:   TimePicker
Room:  text input (e.g., "Block B, Room 203")
[If Recurring] Weeks: number input (e.g., "Until end of semester")
Cancel | Add
```
On add: adds a local office-hours block to the calendar display.

### [NEW] `_components/admin-view.tsx`
Same calendar grid as student view, but with edit mode controls.

Page header additions:
```tsx
<div className="flex items-center gap-2">
  <span className="text-xs text-muted-foreground">Edit Mode</span>
  <Switch checked={editMode} onCheckedChange={setEditMode} />
  <Button variant="outline" size="sm">Manage Rooms</Button>
</div>
```

In edit mode:
- Empty calendar slots become clickable (dashed border, "+" cursor)
- Existing session slots have a pencil icon on hover
- Click empty slot → **CreateSlotSheet**
- Click existing slot → **EditSlotSheet**

Conflict detection: if a new/edited slot's room + time overlaps an existing booking → show inline warning badge (⚠ "Room conflict") on that slot.

#### `create-edit-slot-sheet.tsx`
```
"New Schedule Slot" / "Edit Schedule Slot"
Course:     Select (all courses)
Lecturer:   Select (manager users)
Room:       Select (from rooms list)
Day:        Select (Mon–Fri)
Start Time: TimePicker
End Time:   TimePicker
[Conflict warning if applicable]
Cancel | Save
```
On save: updates local state + `toast("Slot saved — students will see this on next refresh")`.

#### `manage-rooms-sheet.tsx` (admin only)
Right-side Sheet:
```
"Rooms"
Search input

Room list (each row):
  Room code | Building | Capacity | Equipment list | Actions (Edit / Delete)

"Add Room" button at top:
  Form: name, building, floor, capacity, equipment tags
```

---

## Mock Data

```ts
// Manager view
const teachingSchedule: ScheduleSlot[] = [
  { courseCode: "MTH 301", courseName: "Advanced Calculus II", day: "Monday",    start: "10:00", end: "12:00", room: "Block A, LT1", enrolledCount: 32 },
  { courseCode: "MTH 301", courseName: "Advanced Calculus II", day: "Wednesday", start: "14:00", end: "16:00", room: "Block A, LT1", enrolledCount: 32 },
  { courseCode: "CS 105",  courseName: "Data Structures",      day: "Tuesday",   start: "09:00", end: "11:00", room: "Lab 4, CS Block", enrolledCount: 28 },
]

const officeHours: OfficeHourSlot[] = [
  { day: "Thursday", start: "14:00", end: "16:00", room: "Block B, Room 203", type: "recurring" }
]

// Admin view
const rooms = [
  { id: "r1", code: "LT1", building: "Block A", floor: 1, capacity: 80, equipment: ["Projector","Whiteboard"] },
  { id: "r2", code: "Lab4", building: "CS Block", floor: 2, capacity: 30, equipment: ["PCs","Projector"] },
]
```

---

## Scope / Not in Scope
| In scope | Out of scope |
|---|---|
| Manager teaching schedule view | Real session data from DB |
| Office hours form (local) | Office hours visible to students (phase 2) |
| Admin edit mode toggle | Real-time conflict detection with DB |
| Create/Edit slot form (local state) | Bulk timetable generation wizard |
| Conflict warning (local comparison) | SMS/push notification on slot change |
| Manage Rooms sheet (mock CRUD) | Room booking integration |
