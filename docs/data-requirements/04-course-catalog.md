# Data Requirements — Course Catalog

**Route:** `/dashboard/academic/courses`

---

## Core Data Entities

### Course
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `code` | `string` | Yes | Course code (e.g., "CS 601") |
| `title` | `string` | Yes | Course name/title |
| `description` | `string` | No | Course description |
| `faculty` | `string` | Yes | Faculty/department offering the course |
| `level` | `"undergraduate" \| "graduate"` | Yes | Academic level |
| `credits` | `number` | Yes | Credit hours |
| `prerequisites` | `string[]` | No | List of required course codes |
| `seatsTotal` | `number` | Yes | Total available seats |
| `seatsAvailable` | `number` | Yes | Remaining seats |
| `enrolledCount` | `number` | Yes | Currently enrolled students |
| `status` | `"open" \| "limited" \| "full" \| "closed"` | Yes | Enrollment status |
| `lecturerId` | `number \| null` | No | Assigned lecturer user ID |
| `lecturerName` | `string` | Yes | Lecturer display name (e.g., "Prof. Elena Rossi") |
| `semester` | `string` | Yes | Semester offered (e.g., "Fall 2024") |
| `createdAt` | `Date` | Yes | Creation timestamp |
| `updatedAt` | `Date` | Yes | Last modified timestamp |

### User (Student Viewer)
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | User ID |
| `role` | `"student"` | Yes | User role |
| `enrolledCourses` | `number[]` | Yes | Course IDs student is enrolled in |

### User (Manager VIEWER)
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | User ID |
| `role` | `"manager"` | Yes | User role |
| `assignedCourses` | `number[]` | Yes | Course codes/IDs the manager teaches |
| `name` | `string` | Yes | Display name |

### User (Admin VIEWER)
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | User ID |
| `role` | `"admin"` | Yes | User role |

---

## Derived/Computed Data

### Course Display
| Field | Type | Description |
|---|---|---|
| `isEnrolled` | `boolean` | Whether current student is enrolled |
| `isTeaching` | `boolean` | Whether manager teaches this course |
| `seatsDisplay` | `string` | Formatted seat info (e.g., "12 enrolled / 30 seats") |
| `statusBadge` | `{ label, color }` | Visual status indicator |
| `canEnroll` | `boolean` | `status !== "closed" && seatsAvailable > 0 && !isEnrolled` |

---

## View Toggle Data

### Grid View (Default)
Uses course cards with:
- Course code + title
- Credits
- Faculty
- Lecturer name (always visible)
- Seats availability
- Status badge
- Enrollment/management action button

### Table View (Admin Only)
| Column | Data Source | Sortable |
|---|---|---|
| Code | `course.code` | Yes |
| Title | `course.title` | Yes |
| Faculty | `course.faculty` | Yes |
| Level | `course.level` | Yes |
| Lecturer | `course.lecturerName` | Yes |
| Seats | `enrolledCount / seatsTotal` | Yes |
| Status | `course.status` | Yes |

---

## Form Data (Create/Edit Course — Admin Only)

### Course Form Fields
| Field | Type | Notes |
|---|---|---|
| `code` | `string` | Text input (e.g., "CS 601") |
| `title` | `string` | Text input |
| `faculty` | `string` | Select from faculties |
| `level` | `"undergraduate" \| "graduate"` | Select |
| `credits` | `number` | Number input |
| `description` | `string` | Textarea |
| `prerequisites` | `string[]` | Multi-select of existing course codes |
| `seatsTotal` | `number` | Number input |
| `status` | `"open" \| "limited" \| "full" \| "closed"` | Select |
| `lecturer` | `User \| null` | Select from manager users |

---

## Assign Lecturer Modal

### Data Needed
| Field | Type | Description |
|---|---|---|
| `availableLecturers` | `User[]` | Manager users not yet assigned |
| `currentLecturers` | `User[]` | Already assigned lecturers |
| `searchQuery` | `string` | Search by name |

---

## Three-Dot Menu Actions (Admin)

| Action | Data Needed | Dialog/Modal Fields |
|---|---|---|
| Edit | `course.id` | Full course form (pre-filled) |
| Archive | `course.id` | Confirm dialog |
| Delete | `course.id` | Confirm dialog (destructive) |
| Assign Lecturer | `course.id` | Lecturer selector |

---

## Card Display Logic

### Student Card
- Course code, title, credits
- Faculty
- Lecturer name
- Seats available
- "Enroll" button (if can enroll)
- "Enrolled" badge (if enrolled)

### Manager Card (Teaching Course)
- All student card fields
- "Teaching" badge
- "Manage Course →" link (replaces enroll button)
- Seats as "N enrolled / total seats"

### Manager Card (Non-Teaching)
- Same as student card

---

## Authorization Checks
| Check | Purpose |
|---|---|
| `hasRole("admin")` | Show "Add Course" button, view toggle, three-dot menu, table view |
| `hasRole("manager")` | Show "Teaching" badge on own courses, "Manage Course →" link |
| `isTeaching(course)` | Show management controls on specific course |
| Student role | Enroll in open courses |
