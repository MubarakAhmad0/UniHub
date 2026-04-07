# Data Requirements — Venues & Facilities

**Route:** `/dashboard/campus/venues`

---

## Core Data Entities

### Venue
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `name` | `string` | Yes | Venue name (e.g., "Main Hall") |
| `type` | `"hall" \| "room" \| "lab" \| "studio" \| "outdoor" \| "other"` | Yes | Venue type |
| `building` | `string` | Yes | Building name |
| `floor` | `number` | No | Floor number |
| `capacity` | `number` | Yes | Maximum occupancy |
| `description` | `string \| null` | No | Venue description |
| `equipment` | `string[]` | No | Equipment/amenities list |
| `status` | `"available" \| "maintenance" \| "reserved"` | Yes | Current status |
| `maintenanceFrom` | `Date \| null` | No | Maintenance start date |
| `maintenanceTo` | `Date \| null` | No | Maintenance end date |
| `maintenanceNote` | `string \| null` | No | Optional maintenance note |
| `imageUrl` | `string \| null` | No | Venue photo URL |
| `createdAt` | `Date` | Yes | Creation timestamp |
| `updatedAt` | `Date` | Yes | Last modified timestamp |

### Venue Booking
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `venueId` | `number` | Yes | Venue ID |
| `venueName` | `string` | Yes | Venue display name |
| `userId` | `number` | Yes | Booker user ID |
| `userName` | `string` | Yes | Booker display name |
| `date` | `Date` | Yes | Booking date |
| `startTime` | `string` | Yes | Start time (HH:MM) |
| `endTime` | `string` | Yes | End time (HH:MM) |
| `purpose` | `string` | Yes | Booking purpose |
| `type` | `"personal" \| "academic"` | Yes | Booking type |
| `linkedCourseId` | `number \| null` | No | Associated course (academic bookings) |
| `linkedCourseCode` | `string \| null` | No | Course code display |
| `isRecurring` | `boolean` | No | Whether recurring |
| `recurringDay` | `string \| null` | No | Day of week for recurring |
| `recurringEndDate` | `Date \| null` | No | End date for recurring |
| `status` | `"confirmed" \| "pending" \| "rejected" \| "cancelled"` | Yes | Booking state |
| `createdAt` | `Date` | Yes | Creation timestamp |
| `updatedAt` | `Date` | Yes | Last modified timestamp |

---

## Derived/Computed Data

### Booking Display
| Field | Type | Description |
|---|---|---|
| `formattedDate` | `string` | Human-readable date |
| `formattedTime` | `string` | "14:00–16:00" |
| `duration` | `number` | Duration in hours |
| `isPast` | `boolean` | Whether booking date has passed |
| `isToday` | `boolean` | Whether booking is today |
| `statusBadge` | `{ label, color }` | Visual status indicator |
| `typeBadge` | `string` | "Personal" vs "Academic ✓" |

### Venue Availability
| Field | Type | Description |
|---|---|---|
| `isBookable` | `boolean` | `status === "available"` AND not booked in selected slot |
| `nextAvailableSlot` | `Date \| null` | Next open time slot |

---

## Manager View Data

### Teaching Courses (for Academic Booking)
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Course ID |
| `code` | `string` | Course code |
| `title` | `string` | Course name |

### Manager Booking Form Additions
| Field | Type | Notes |
|---|---|---|
| `bookingType` | `"personal" \| "academic"` | Button selector |
| `linkedCourse` | `Course \| null` | Select (visible if academic) |
| `isRecurring` | `boolean` | Switch (visible if academic) |
| `recurringDay` | `string \| null` | Day selector (visible if recurring) |
| `recurringEndDate` | `Date \| null` | Date picker (visible if recurring) |
| **Auto-confirmed** | Academic bookings skip approval queue | |

---

## Admin View Data

### Approval Queue
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Booking ID |
| `requesterName` | `string` | Booker display name |
| `venueName` | `string` | Venue name |
| `date` | `Date` | Booking date |
| `startTime` | `string` | Start time |
| `endTime` | `string` | End time |
| `purpose` | `string` | Booking purpose |
| `submittedDate` | `Date` | When submitted |

### Calendar Swimlane View
| Field | Type | Description |
|---|---|---|
| `date` | `Date` | Selected date |
| `lanes` | `Swimlane[]` | One per venue |

### Swimlane
| Field | Type | Description |
|---|---|---|
| `venueId` | `number` | Venue ID |
| `venueName` | `string` | Venue name |
| `bookings` | `CalendarBooking[]` | Bookings for this venue on this date |

### Calendar Booking
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Booking ID |
| `startTime` | `string` | Start time |
| `endTime` | `string` | End time |
| `userName` | `string` | Booker name |
| `courseCode` | `string \| null` | Course code (if academic) |
| `purpose` | `string` | Purpose |

### Venue Form (Admin)
| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | `string` | Yes | Text input |
| `type` | `string` | Yes | Select |
| `building` | `string` | Yes | Text input |
| `floor` | `number` | No | Number input |
| `capacity` | `number` | Yes | Number input |
| `description` | `string` | No | Textarea |
| `equipment` | `string[]` | No | Tag input (add/remove) |
| `status` | `"available" \| "maintenance" \| "reserved"` | Yes | Select |

### Set Status Dialog
| Field | Type | Required | Notes |
|---|---|---|---|
| `venueName` | `string` | Yes | Display in title |
| `status` | `"available" \| "maintenance" \| "reserved"` | Yes | Radio |
| `fromDate` | `Date` | No (if maintenance/reserved) | Date picker |
| `toDate` | `Date` | No (if maintenance/reserved) | Date picker |
| `note` | `string` | No | Optional text input |

### Policies Form
| Field | Type | Description |
|---|---|---|
| `studentMaxAdvanceDays` | `number` | How far in advance students can book |
| `studentMaxDuration` | `number` | Student max booking hours |
| `managerMaxDuration` | `number` | Manager max booking hours |
| `blockedDates` | `DateRange[]` | Date ranges when booking is disabled |

---

## Booking Form Data

### Student/Manager/Admin Booking Form
| Field | Type | Required | Notes |
|---|---|---|---|
| `venue` | `Venue` | Yes | Venue selector |
| `date` | `Date` | Yes | Date picker |
| `startTime` | `string` | Yes | Time picker |
| `endTime` | `string` | Yes | Time picker |
| `purpose` | `string` | Yes | Textarea |
| `bookingType` | `"personal" \| "academic"` | No (manager) | Manager only |
| `linkedCourse` | `Course \| null` | No (manager) | Manager only |
| `isRecurring` | `boolean` | No (manager) | Manager only |
| `recurringDay` | `string \| null` | No (manager) | Manager only |
| `recurringEndDate` | `Date \| null` | No (manager) | Manager only |

---

## Authorization Checks
| Check | Purpose |
|---|---|
| `hasRole("admin")` | Show Manage Venues tab, approval queue, venue CRUD, calendar view, set status |
| `hasRole("manager")` | Academic booking type (auto-confirmed), recurring bookings, course selector |
| Student role | Personal bookings only (goes through approval queue) |
| `isOwner(booking.userId)` | Can cancel own bookings |
