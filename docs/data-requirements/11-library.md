# Data Requirements — Library Booking

**Route:** `/dashboard/campus/library`

---

## Core Data Entities

### Library Room
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `name` | `string` | Yes | Room name (e.g., "Study Room A") |
| `floor` | `number` | Yes | Floor number |
| `capacity` | `number` | Yes | Maximum occupancy |
| `equipment` | `string[]` | No | Equipment list (e.g., ["Whiteboard", "TV Screen"]) |
| `status` | `"available" \| "maintenance" \| "occupied"` | Yes | Current availability |
| `imageUrl` | `string \| null` | No | Room photo URL |
| `description` | `string \| null` | No | Room description |
| `createdAt` | `Date` | Yes | Creation timestamp |
| `updatedAt` | `Date` | Yes | Last modified timestamp |

### Booking
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `roomId` | `number` | Yes | Room ID |
| `roomName` | `string` | Yes | Room display name |
| `userId` | `number` | Yes | Booker user ID |
| `userName` | `string` | Yes | Booker display name |
| `date` | `Date` | Yes | Booking date |
| `startTime` | `string` | Yes | Start time (HH:MM) |
| `endTime` | `string` | Yes | End time (HH:MM) |
| `purpose` | `string` | No | Booking purpose |
| `type` | `"personal" \| "class"` | Yes | Booking type |
| `linkedCourseId` | `number \| null` | No | Associated course (class bookings) |
| `linkedCourseCode` | `string \| null` | No | Course code display |
| `status` | `"confirmed" \| "pending" \| "cancelled"` | Yes | Booking state |
| `createdAt` | `Date` | Yes | Creation timestamp |
| `updatedAt` | `Date` | Yes | Last modified timestamp |

### Resource
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `title` | `string` | Yes | Resource name |
| `type` | `"book" \| "journal" \| "equipment" \| "software"` | Yes | Resource category |
| `quantity` | `number` | Yes | Available quantity |
| `condition` | `"new" \| "good" \| "fair" \| "poor"` | Yes | Physical condition |
| `location` | `string` | No | Where to find it |
| `isAvailable` | `boolean` | Yes | Currently available |

---

## Derived/Computed Data

### Booking Display
| Field | Type | Description |
|---|---|---|
| `formattedDate` | `string` | Human-readable date |
| `formattedTime` | `string` | "10:00–12:00" |
| `duration` | `number` | Duration in hours |
| `isPast` | `boolean` | Whether booking date has passed |
| `isToday` | `boolean` | Whether booking is today |
| `typeBadge` | `string` | "Personal" vs "Class (MTH 301)" |

### Room Availability
| Field | Type | Description |
|---|---|---|
| `isBookable` | `boolean` | `status === "available"` AND not booked in selected slot |
| `availableSlots` | `TimeSlot[]` | Open time slots for the selected date |

---

## Manager View Data

### Teaching Courses (for Class Booking)
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Course ID |
| `code` | `string` | Course code |
| `title` | `string` | Course name |

### Manager Booking Form Additions
| Field | Type | Notes |
|---|---|---|
| `isClassBooking` | `boolean` | Switch toggle |
| `linkedCourse` | `Course \| null` | Select from teaching courses |
| **Extended Max Duration** | Manager can book longer slots (e.g., 8h vs 2h) |

### Acquisition Request
| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | `string` | Yes | Resource title |
| `authorOrSource` | `string` | Yes | Author/publisher/source |
| `type` | `"book" \| "journal" \| "equipment" \| "software"` | Yes | Select |
| `isbnOrUrl` | `string \| null` | No | ISBN or URL |
| `justification` | `string` | Yes | Textarea (required) |

---

## Admin View Data

### Manage Panel Tabs

#### Rooms Sub-tab
| Column | Data Source | Sortable |
|---|---|---|
| Room Name | `room.name` | Yes |
| Floor | `room.floor` | Yes |
| Capacity | `room.capacity` | Yes |
| Equipment | `room.equipment` | No |
| Status | `room.status` | Yes |

#### Resources Sub-tab
| Column | Data Source | Sortable |
|---|---|---|
| Title | `resource.title` | Yes |
| Type | `resource.type` | Yes |
| Quantity | `resource.quantity` | Yes |
| Condition | `resource.condition` | Yes |

#### Acquisitions Sub-tab
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Request ID |
| `title` | `string` | Resource title |
| `type` | `string` | Resource type |
| `requestedBy` | `string` | Requester name |
| `justification` | `string` | Reason provided |
| `status` | `"pending" \| "approved" \| "rejected"` | Review state |
| `requestedDate` | `Date` | When submitted |

### Policies Form
| Field | Type | Description |
|---|---|---|
| `studentMaxDuration` | `number` | Student max booking hours (default 2) |
| `managerMaxDuration` | `number` | Manager max booking hours (default 8) |
| `maxConcurrentPerStudent` | `number` | Max active bookings per student |
| `blackoutDates` | `DateRange[]` | Date ranges when booking is disabled |

---

## Form Data

### Booking Form
| Field | Type | Required | Notes |
|---|---|---|---|
| `room` | `Room` | Yes | Room selector |
| `date` | `Date` | Yes | Date picker |
| `startTime` | `string` | Yes | Time picker |
| `endTime` | `string` | Yes | Time picker |
| `purpose` | `string` | No | Text input |
| `isClassBooking` | `boolean` | No (manager) | Switch (manager only) |
| `linkedCourse` | `Course \| null` | No (manager) | Select (manager only) |

### Room Form (Admin)
| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | `string` | Yes | Text input |
| `floor` | `number` | Yes | Number input |
| `capacity` | `number` | Yes | Number input |
| `equipment` | `string[]` | No | Tag input |
| `status` | `"available" \| "maintenance"` | Yes | Select |

### Acquisition Request Form (Manager)
| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | `string` | Yes | Text input |
| `authorOrSource` | `string` | Yes | Text input |
| `type` | `string` | Yes | Select |
| `isbnOrUrl` | `string` | No | Text input |
| `justification` | `string` | Yes | Textarea |

---

## Authorization Checks
| Check | Purpose |
|---|---|
| `hasRole("admin")` | Show Manage tab (Rooms, Resources, Acquisitions, Policies), cancel any booking |
| `hasRole("manager")` | Class booking toggle, extended duration, request acquisition |
| Student role | Book rooms (personal only), view own bookings |
| `isOwner(booking.userId)` | Can cancel own bookings |
