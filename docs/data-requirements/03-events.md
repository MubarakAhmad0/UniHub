# Data Requirements — Campus Events

**Route:** `/dashboard/campus/events`

---

## Core Data Entities

### Event
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `title` | `string` | Yes | Event title |
| `category` | `"academic" \| "cultural" \| "club" \| "sports" \| "workshop" \| "other"` | Yes | Event type/category |
| `description` | `string` | Yes | Full event description |
| `date` | `Date` | Yes | Event date |
| `startTime` | `string` | Yes | Start time (HH:MM) |
| `endTime` | `string` | Yes | End time (HH:MM) |
| `venue` | `string` | Yes | Event location/room |
| `capacity` | `number \| null` | No | Maximum attendees |
| `rsvpCount` | `number` | Yes | Current RSVP count |
| `organiserId` | `number` | Yes | User ID of event creator |
| `organiserName` | `string` | Yes | Display name |
| `status` | `"published" \| "cancelled" \| "pending"` | Yes | Publication state |
| `isFeatured` | `boolean` | Yes | Whether featured/highlighted |
| `createdAt` | `Date` | Yes | Creation timestamp |
| `updatedAt` | `Date` | Yes | Last modified timestamp |

### RSVP
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `eventId` | `number` | Yes | Associated event ID |
| `userId` | `number` | Yes | User who RSVPed |
| `userName` | `string` | Yes | Display name |
| `studentId` | `string` | Yes | Student ID number |
| `rsvpStatus` | `"going" \| "interested"` | Yes | RSVP response type |
| `rsvpDate` | `Date` | Yes | When RSVP was submitted |

---

## Derived/Computed Data

### Event Display
| Field | Type | Description |
|---|---|---|
| `formattedDate` | `string` | Human-readable date (e.g., "Sat, Apr 12") |
| `formattedTime` | `string` | Time range (e.g., "14:00–16:00") |
| `timeAgo` | `string` | Relative time since creation |
| `isPast` | `boolean` | Whether event date has passed |
| `isToday` | `boolean` | Whether event is today |
| `isThisWeek` | `boolean` | Whether event is this week |
| `availableSpots` | `number \| null` | `capacity - rsvpCount` (null if no cap) |
| `isFull` | `boolean` | `rsvpCount >= capacity` |

### User RSVP State
| Field | Type | Description |
|---|---|---|
| `userRsvpStatus` | `"going" \| "interested" \| "none"` | Current user's RSVP state |

---

## Tab Filter Data

### Tab Types
| Tab | Filter Logic |
|---|---|
| All Events | `status === "published"` AND (`isFuture OR isToday`) |
| Featured | `isFeatured === true` |
| My Events | Events where user has RSVPed OR is organiser |

### My Events Sub-views (Manager)
| Sub-view | Filter Logic |
|---|---|
| RSVPd | Events where user has RSVPed |
| Organised | Events where `organiserId === currentUserId` |

---

## Form Data (Create/Edit Event)

### Student Form Fields
| Field | Type | Notes |
|---|---|---|
| `title` | `string` | Text input |
| `category` | `"academic" \| "cultural" \| "club"` | Select (restricted) |
| `date` | `Date` | Date picker |
| `startTime` | `string` | Time picker |
| `endTime` | `string` | Time picker |
| `venue` | `string` | Text input |
| `description` | `string` | Textarea |
| `capacity` | `number \| null` | Number input (optional) |
| **Result** | `status = "pending"` | Requires admin approval |

### Manager Form Fields
| Field | Type | Notes |
|---|---|---|
| `title` | `string` | Text input |
| `category` | `"academic" \| "cultural" \| "club"` | Select |
| `date` | `Date` | Date picker |
| `startTime` | `string` | Time picker |
| `endTime` | `string` | Time picker |
| `venue` | `string` | Text input |
| `description` | `string` | Textarea |
| `capacity` | `number \| null` | Number input (optional) |
| `isFeatured` | `boolean` | Switch toggle |
| **Result** | `status = "published"` | Immediate publish |

### Admin Form Fields (all manager fields +)
| Field | Type | Notes |
|---|---|---|
| `category` | All categories | No restrictions |
| **Additional** | Can edit/cancel ANY event | Not just own events |

---

## Attendee List Data

### Display Fields
| Field | Type | Description |
|---|---|---|
| `userName` | `string` | Attendee display name |
| `studentId` | `string` | Student ID number |
| `rsvpStatus` | `"going" \| "interested"` | Response type |
| `rsvpDate` | `string` | When RSVP was submitted |

---

## Manage Tab Data (Admin Only)

### Table Columns
| Column | Data Source | Sortable |
|---|---|---|
| Title | `event.title` | Yes |
| Category | `event.category` | Yes |
| Organiser | `event.organiserName` | Yes |
| Date | `event.date` | Yes |
| Featured | `event.isFeatured` | Yes |
| Status | `event.status` | Yes |
| RSVPs/Cap | `event.rsvpCount / event.capacity` | Yes |

### Actions
| Action | Data Needed |
|---|---|
| Edit | `event.id` |
| Cancel | `event.id` (set `status = "cancelled"`) |
| Feature toggle | `event.id` (toggle `isFeatured`) |
| Delete | `event.id` |

### Pending Submissions
| Field | Type | Description |
|---|---|---|
| `event` | `Event` | Full event data |
| `submittedBy` | `string` | Student name |
| `submittedDate` | `string` | When submitted |

### Pending Actions
| Action | Data Needed |
|---|---|
| Approve | `event.id` (set `status = "published"`) |
| Reject | `event.id`, `reason` (set `status = "cancelled"`) |

---

## Authorization Checks
| Check | Purpose |
|---|---|
| `hasRole("admin")` | Show Manage Events tab, edit/cancel any event, feature toggle, approve/reject pending |
| `hasRole("manager")` | Create events directly (published), edit/cancel own events, toggle feature |
| `isOwner(event.organiserId)` | Show edit/cancel controls on specific event card |
| Student role | Submit events (pending approval), RSVP to events |
