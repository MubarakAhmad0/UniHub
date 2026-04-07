# Data Requirements — Timetable

**Route:** `/dashboard/campus/timetable`

---

## Student View Data

### Schedule Slot
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Slot ID |
| `courseId` | `number` | Yes | Course ID |
| `courseCode` | `string` | Yes | Course code |
| `courseName` | `string` | Yes | Course title |
| `lecturerName` | `string` | Yes | Lecturer display name |
| `day` | `"monday" \| "tuesday" \| "wednesday" \| "thursday" \| "friday"` | Yes | Day of week |
| `startTime` | `string` | Yes | Start time (HH:MM) |
| `endTime` | `string` | Yes | End time (HH:MM) |
| `room` | `string` | Yes | Room/location |
| `type` | `"lecture" \| "tutorial" \| "lab"` | Yes | Session type |
| `color` | `string` | Yes | Display color for the slot |

### Time Grid
| Field | Type | Description |
|---|---|---|
| `days` | `string[]` | Days of the week (Mon–Fri) |
| `timeSlots` | `string[]` | Hourly time slots (e.g., "08:00"–"18:00") |

---

## Manager View Data

### Teaching Schedule Slot
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Slot ID |
| `courseId` | `number` | Yes | Course ID |
| `courseCode` | `string` | Yes | Course code |
| `courseName` | `string` | Yes | Course title |
| `day` | `string` | Yes | Day of week |
| `startTime` | `string` | Yes | Start time |
| `endTime` | `string` | Yes | End time |
| `room` | `string` | Yes | Room/location |
| `enrolledCount` | `number` | Yes | Number of enrolled students |

### Office Hour Slot
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Slot ID |
| `day` | `string` | Day of week |
| `startTime` | `string` | Start time |
| `endTime` | `string` | End time |
| `room` | `string` | Office location |
| `type` | `"one-time" \| "recurring"` | Recurrence type |
| `weeksRemaining` | `number \| null` | For recurring: weeks until end |

### Office Hours Form
| Field | Type | Required | Notes |
|---|---|---|---|
| `type` | `"one-time" \| "recurring"` | Yes | Select |
| `day` | `string` | Yes | Day selector (Mon–Fri) |
| `startTime` | `string` | Yes | Time picker |
| `endTime` | `string` | Yes | Time picker |
| `room` | `string` | Yes | Text input |
| `weeks` | `number` | No (recurring) | Number input |

---

## Admin View Data

### All Schedule Slots
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Slot ID |
| `courseId` | `number` | Course ID |
| `courseCode` | `string` | Course code |
| `lecturerId` | `number` | Lecturer user ID |
| `lecturerName` | `string` | Lecturer display name |
| `day` | `string` | Day of week |
| `startTime` | `string` | Start time |
| `endTime` | `string` | End time |
| `roomId` | `number` | Room ID |
| `room` | `string` | Room name |
| `type` | `"lecture" \| "tutorial" \| "lab"` | Session type |

### Room
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Room ID |
| `code` | `string` | Room code (e.g., "LT1") |
| `name` | `string` | Full room name |
| `building` | `string` | Building name |
| `floor` | `number` | Floor number |
| `capacity` | `number` | Seating capacity |
| `equipment` | `string[]` | Equipment list (e.g., ["Projector", "Whiteboard"]) |

### Conflict Detection
| Field | Type | Description |
|---|---|---|
| `hasRoomConflict` | `boolean` | Same room + overlapping time |
| `hasLecturerConflict` | `boolean` | Same lecturer + overlapping time |
| `conflictingSlot` | `ScheduleSlot \| null` | The conflicting slot |

### Create/Edit Slot Form
| Field | Type | Required | Notes |
|---|---|---|---|
| `course` | `Course` | Yes | Select |
| `lecturer` | `User` | Yes | Select from managers |
| `room` | `Room` | Yes | Select |
| `day` | `string` | Yes | Day selector |
| `startTime` | `string` | Yes | Time picker |
| `endTime` | `string` | Yes | Time picker |
| `conflictWarning` | `boolean` | No | Inline warning display |

### Manage Rooms Sheet
| Field | Type | Notes |
|---|---|---|
| `rooms` | `Room[]` | Full room list |
| `searchQuery` | `string` | Search filter |
| **Add Room Form** | | |
| `code` | `string` | Room code |
| `name` | `string` | Room name |
| `building` | `string` | Building |
| `floor` | `number` | Floor |
| `capacity` | `number` | Capacity |
| `equipment` | `string[]` | Equipment tags |

---

## Derived/Computed Data

### Display Helpers
| Field | Type | Description |
|---|---|---|
| `duration` | `number` | Session length in minutes |
| `formattedTime` | `string` | "08:00–10:00" |
| `slotPosition` | `{ top, height }` | CSS positioning in grid |
| `conflictBadge` | `{ visible, message }` | Conflict warning display |

### Conflict Detection Logic
```
hasConflict = slotA.roomId === slotB.roomId 
           && slotA.day === slotB.day 
           && slotA.startTime < slotB.endTime 
           && slotB.startTime < slotA.endTime
```

---

## Edit Mode Data (Admin)

### Empty Slot Click → Create
- Opens CreateSlotSheet with pre-filled day/time from clicked slot

### Existing Slot Click → Edit
- Opens EditSlotSheet with pre-filled data
- Has conflict detection on save

### Conflict Warning Display
| Field | Value |
|---|---|
| Icon | ⚠️ |
| Message | "Room conflict: [Room] is already booked [Day] [Time]" |
| Color | Amber warning |

---

## Authorization Checks
| Check | Purpose |
|---|---|
| `hasRole("admin")` | Edit mode toggle, create/edit/delete slots, manage rooms |
| `hasRole("manager")` | View teaching schedule, add office hours |
| Student role | View own timetable only |
| `isTeaching(course)` | Manager only sees own teaching sessions |
| `isEnrolled(course)` | Student only sees own enrolled courses |
