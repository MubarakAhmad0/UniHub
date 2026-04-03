# 09 · Timetable

**Route:** `/dashboard/campus/timetable`

Students view their weekly class schedule — time, room, lecturer, and course per slot.

---

## Student (current build)

| Feature | Status |
|---|---|
| Weekly calendar view of enrolled courses | ✅ |
| Session detail on click (room, lecturer, duration) | ✅ |
| Week navigation | ✅ |
| Export / print timetable | ✅ (button, may not be wired) |
| View timetable of others | 🚫 |
| Edit schedule slots | 🚫 |

---

## Lecturer

Lecturers see a **teaching timetable** — all sessions they are scheduled to deliver, across all their courses.

| Feature | Status | Notes |
|---|---|---|
| View personal student timetable | 🚫 | N/A |
| **Teaching schedule view** | 🆕 | Same weekly calendar with courses they teach as sessions |
| **Room assignment shown per session** | 🆕 | Room code, building, floor visible on hover/click |
| **Student count per session** | 🆕 | Shown in session detail popup: "32 students" |
| **Quick link to take attendance** | 🆕 | "Take Attendance" shortcut inside the session popup |
| **Session conflict indicator** | 🆕 | Flag if two sessions overlap for the same room/time |
| **Office hours block** | 🆕 | Can add personal office hour blocks to their timetable (visible to their students) |
| Edit scheduled class times | 🚫 | Admin controls the timetable; lecturers can request changes |

### UI changes needed
- **Page title:** "Teaching Schedule" for lecturers.
- **Session cards (lecturer variant):** show Course code, enrolled count, room, "Take Attendance →" link.
- **"Add Office Hours" button:** opens a form to add recurring or one-off office hour blocks; these appear as a distinct colour on the calendar.
- **Session conflict badge** (⚠) on overlapping slots.

---

## Admin

Admins build and manage the timetable — creating, editing, and resolving conflicts across the entire university.

| Feature | Status | Notes |
|---|---|---|
| **View any lecturer's teaching schedule** | 🆕 | Lecturer picker at top; see their weekly view |
| **View any room's schedule** | 🆕 | Room picker; see what's booked when |
| **Create a new schedule slot** | 🆕 | Course + Room + Day + Start/End Time + Lecturer |
| **Edit an existing slot** | 🆕 | Change room, time, or lecturer assignment |
| **Delete a slot** | 🆕 | With confirmation and optional notification to affected students/lecturer |
| **Conflict detection** | 🆕 | Auto-flag when creating/editing a slot that clashes with an existing booking |
| **Room management** | 🆕 | Add/edit/delete rooms; set room capacity, equipment tags |
| **Bulk generate timetable** | 🆕 | Semester setup wizard that places courses based on constraints |
| ~~Publish timetable~~ | 🚫 | No draft/publish step — timetable is always live; changes are visible to students on next page refresh |
| **Export timetable** | 🆕 | CSV / PDF by course / room / faculty |

### UI changes needed
- **"Admin" mode toggle** at top that switches to an editable calendar.
- **Editable session blocks:** click-to-edit in the calendar grid; drag to change time.
- **"New Slot" button:** form with course, room, day, time.
- **Conflict resolution panel:** highlighted conflicts with suggested alternatives.
- **Rooms sidebar / tab:** list of rooms; click to view room's full week.
- No publish step needed — changes go live immediately on save (simple DB write; students see updated timetable on refresh).
