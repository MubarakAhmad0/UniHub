# Extra Data Requirements — Shared, Global & Cross-Cutting

This file covers data needed for shared components, global state, cross-page dependencies, and features that span multiple pages.

---

## 1. User / Authentication Data

### Full User Profile (Available on Every Page)
| Field | Type | Description |
|---|---|---|
| `id` | `number` | User ID (numeric, auto-increment) |
| `name` | `string` | Display name |
| `email` | `string` | Email address |
| `role` | `"student" \| "manager" \| "admin"` | Primary role |
| `departmentId` | `number \| null` | Department association |
| `departmentName` | `string \| null` | Department display name |
| `isActive` | `boolean` | Whether account is active |
| `avatarUrl` | `string \| null` | Profile image URL |
| `initials` | `string` | Derived from name (fallback avatar) |
| `studentId` | `string \| null` | Student ID number (students only) |
| `faculty` | `string \| null` | Faculty name |
| `programme` | `string \| null` | Degree programme |
| `currentSemester` | `number \| null` | Current semester number |
| `year` | `number \| null` | Academic year |

### Role/Permission Checks (Client)
| Hook/Function | Returns | Used For |
|---|---|---|
| `useAuth().hasRole(role)` | `boolean` | Conditional UI rendering |
| `useAuth().hasAnyRole(roles[])` | `boolean` | Multi-role checks |
| `useAuth().isLoading` | `boolean` | Show loading skeleton |

### Role/Permission Checks (Server)
| Function | Returns | Used For |
|---|---|---|
| `getUserRoles()` | `string[]` | Server component role checks |
| `hasRole(role)` | `boolean` | Server-side authorization |

---

## 2. Department Data

### Department
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Department ID |
| `name` | `string` | Department name |
| `code` | `string` | Short code (e.g., "CS", "MTH") |
| `faculty` | `string` | Parent faculty |
| `type` | `"academic" \| "administrative"` | Department type |

### Used By
- Announcements (faculty-scoped filtering)
- Course catalog (faculty display)
- Profile (department assignment)
- All pages that filter by faculty/department

---

## 3. Course Data (Shared Across Pages)

### Minimal Course Reference
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Course ID |
| `code` | `string` | Course code (e.g., "CS 601") |
| `title` | `string` | Course name |
| `credits` | `number` | Credit hours |
| `faculty` | `string` | Offering faculty |

### Used By
| Page | How Course Data Is Used |
|---|---|
| Announcements | Course-scoped announcements |
| Course Catalog | Main course listing |
| My Courses | Enrolled/teaching courses |
| Study Plan | Planned courses per semester |
| Timetable | Course sessions |
| Attendance | Course attendance records |
| Marks | Course grades |
| Library | Class bookings linked to courses |
| Venues | Academic bookings |
| Clubs | Advisor course links |
| Marketplace | Course-linked listings |
| Complaints | Course-related cases |

---

## 4. Notification System Data

### Notification
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Notification ID |
| `userId` | `number` | Recipient user ID |
| `type` | `"announcement" \| "event" \| "forum" \| "grade" \| "attendance" \| "booking" \| "case" \| "document" \| "system"` | Notification category |
| `title` | `string` | Notification title |
| `body` | `string` | Notification message |
| `isRead` | `boolean` | Whether read |
| `link` | `string \| null` | URL to navigate to on click |
| `createdAt` | `Date` | When created |

### Delivery Methods
| Method | Description |
|---|---|
| In-app | Bell icon badge + notification dropdown |
| SSE (Server-Sent Events) | Real-time push notifications |
| Email | Via Nodemailer (configured in `lib/auth/send-email.ts`) |

---

## 5. Sidebar Navigation Data

### Nav Section Structure
| Field | Type | Description |
|---|---|---|
| `title` | `string` | Section label |
| `icon` | `LucideIcon` | Section icon |
| `key` | `string` | Persistence key for open state |
| `items` | `NavItem[]` | Child navigation items |

### Nav Item
| Field | Type | Description |
|---|---|---|
| `title` | `string` | Item label |
| `href` | `string` | Route path |
| `icon` | `LucideIcon` | Item icon |
| `badge` | `{ label, color } \| null` | Optional badge (e.g., pending count) |
| `isActive` | `boolean` | Whether current route matches |

### Sections Used
| Section | Key | Routes |
|---|---|---|
| General | `"general"` | Announcements |
| Academic | `"academic"` | Courses, My Courses, Marks, Attendance, Study Plan |
| Campus | `"campus"` | Events, Forums, Timetable, Map, Library, Venues, Lost & Found |
| Community | `"community"` | Clubs, Marketplace |
| Services | `"services"` | Complaints, Documents, Finances |
| Admin | `"admin"` | Admin portal |

---

## 6. Dashboard Home Data

### Dashboard Summary
| Field | Type | Description |
|---|---|---|
| `greeting` | `string` | "Good morning, [Name]" |
| `upcomingEvents` | `Event[]` | Next 3 campus events |
| `pendingAnnouncements` | `number` | Unread announcement count |
| `upcomingDeadlines` | `Deadline[]` | Next assignments/exams |
| `attendanceAlerts` | `number` | At-risk course count |
| `outstandingBalance` | `number \| null` | Current fees owed |
| `pendingBookings` | `number` | Unconfirmed booking count |
| `pendingCases` | `number` | Cases awaiting response |

---

## 7. DataTable System (Shared Component)

### DataTable Configuration
| Prop | Type | Description |
|---|---|---|
| `data` | `T[]` | Row data |
| `columns` | `ColumnDef<T>[]` | Column definitions |
| `pagination` | `{ pageIndex, pageSize }` | Current page state |
| `sorting` | `{ id, desc }[]` | Active sort columns |
| `filters` | `Filter[]` | Active filters |
| `globalFilter` | `string` | Search query |
| `rowCount` | `number` | Total rows (for server-side pagination) |

### Column Definition
| Field | Type | Description |
|---|---|---|
| `id` | `string` | Column key |
| `header` | `string` | Column header label |
| `accessorKey` | `string` | Data field key |
| `cell` | `Component` | Custom cell renderer |
| `enableSorting` | `boolean` | Whether sortable |
| `enableFiltering` | `boolean` | Whether filterable |
| `meta` | `{ className }` | Styling |

### Shared Features
| Feature | Description |
|---|---|
| Column sorting | Ascending/descending/none |
| Faceted filtering | Dropdown with facet counts |
| Date filtering | Date range picker |
| Global search | Text search across all columns |
| Column visibility | Toggle which columns show |
| CSV export | Download filtered data |
| Pagination | Page size selector + controls |

---

## 8. Permission System (RBAC)

### Permission String Format
```
"resource:action"
```

### Resources
| Resource | Actions |
|---|---|
| `courses` | `read`, `create`, `update`, `delete` |
| `marks` | `read`, `update`, `publish` |
| `attendance` | `read`, `update`, `manage` |
| `announcements` | `read`, `create`, `update`, `delete` |
| `events` | `read`, `create`, `update`, `delete`, `feature` |
| `forums` | `read`, `create`, `moderate`, `delete` |
| `clubs` | `read`, `create`, `update`, `delete`, `advise` |
| `bookings` | `read`, `create`, `update`, `approve`, `cancel` |
| `users` | `read`, `create`, `update`, `delete` |
| `roles` | `read`, `create`, `update`, `delete` |
| `permissions` | `read`, `assign` |
| `finances` | `read`, `update`, `admin` |
| `documents` | `read`, `create`, `process`, `admin` |
| `complaints` | `read`, `create`, `respond`, `resolve` |
| `lost_found` | `read`, `create`, `verify`, `admin` |
| `venues` | `read`, `create`, `approve`, `manage` |
| `library` | `read`, `book`, `manage`, `acquire` |
| `study_plan` | `read`, `advise`, `endorse`, `admin` |
| `timetable` | `read`, `update`, `manage` |
| `map` | `read`, `edit` |

### Roles
| Role | Key | Default Permissions |
|---|---|---|
| Admin | `admin` | All permissions (implicit bypass) |
| Manager | `manager` | Read all, update own teaching courses, advise clubs |
| Student | `student` | Read own data, create submissions |

---

## 9. Theme & UI Preferences

### User UI Preferences
| Field | Type | Default | Description |
|---|---|---|---|
| `theme` | `"light" \| "dark" \| "system"` | `"system"` | Color scheme |
| `locale` | `string` | `"en"` | Language/locale |
| `sidebarCollapsed` | `boolean` | `false` | Sidebar state |
| `navOpenItems` | `{ [key: string]: boolean }` | `{}` | Which nav sections are open |

---

## 10. Audit Logging (Cross-Cutting)

### Audit Log Entry
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Log entry ID |
| `userId` | `number` | User who performed action |
| `userName` | `string` | User display name |
| `action` | `string` | Action performed (e.g., "marks.update") |
| `resource` | `string` | Resource type (e.g., "marks", "grades") |
| `resourceId` | `number` | Specific resource ID |
| `oldValue` | `string \| null` | Previous value |
| `newValue` | `string \| null` | New value |
| `reason` | `string \| null` | Reason provided |
| `ipAddress` | `string \| null` | Request IP |
| `timestamp` | `Date` | When action occurred |

### Pages That Generate Audit Logs
| Page | Actions Logged |
|---|---|
| Marks & GPA | Grade changes, overrides, publish |
| Attendance | Session edits, bulk excuses |
| Events | Feature toggles, cancellations |
| Forums | Content moderation, deletions |
| Clubs | Advisor changes, status changes |
| Venues | Booking approvals/rejections |
| Library | Booking cancellations, acquisitions |
| Lost & Found | Claim verifications, archives |
| Complaints | Status changes, resolutions |
| Documents | Request processing, rejections |

---

## 11. Cross-Page Data Dependencies

### Pages That Need User's Enrolled Courses
| Page | Why |
|---|---|
| Announcements | Filter course-scoped announcements |
| My Courses | Show enrolled course list |
| Timetable | Show class schedule |
| Attendance | Show per-course attendance |
| Marks | Show per-course grades |
| Study Plan | Track completed/enrolled courses |
| Library | Class booking course selector |
| Venues | Academic booking course selector |

### Pages That Need User's Teaching Courses
| Page | Why |
|---|---|
| Announcements | Manager selects course for faculty announcement |
| My Courses | Manager teaching dashboard |
| Timetable | Manager teaching schedule |
| Attendance | Manager takes attendance |
| Marks | Manager enters grades |
| Library | Class booking course selector |
| Venues | Academic booking course selector |
| Complaints | Course feedback tab |
| Clubs | Advisory tools |

### Pages That Need Campus Events
| Page | Why |
|---|---|
| Events | Main events page |
| Dashboard Home | Upcoming events preview |
| Clubs | Club-linked events |

---

## 12. Error States (Shared)

### Common Error States
| State | Display | Used By |
|---|---|---|
| Loading | Skeleton/spinner | All pages |
| Empty | "Nothing here yet" message | List/table views |
| No Results | "No X found" message | Filtered views |
| Unauthorized | 403 page / restricted message | Role-gated pages |
| Network Error | Retry button + error message | All data-fetching pages |
| Not Found | 404 page | Invalid routes/IDs |

---

## 13. Shared Mock Data Patterns

### User Mock Data
```ts
const users = [
  {
    id: 1,
    name: "Alex Rivers",
    email: "alex@university.edu",
    role: "student",
    studentId: "S12345678",
    faculty: "Computer Science",
    programme: "BSc Computer Science",
    currentSemester: 7,
    departmentId: 1,
  },
  {
    id: 2,
    name: "Prof. Elena Rossi",
    email: "elena@university.edu",
    role: "manager",
    departmentId: 1,
    assignedCourses: ["cs-105", "cs-201"],
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@university.edu",
    role: "admin",
    departmentId: null,
  },
]
```

### Course Mock Data
```ts
const courses = [
  {
    id: 1,
    code: "CS 601",
    title: "Data Structures",
    faculty: "Computer Science",
    level: "undergraduate",
    credits: 3,
    lecturerName: "Prof. Elena Rossi",
    seatsTotal: 30,
    seatsAvailable: 12,
    enrolledCount: 18,
    status: "open",
  },
]
```
