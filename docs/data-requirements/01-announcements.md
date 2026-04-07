# Data Requirements — Announcements

**Route:** `/dashboard/announcements`

---

## Core Data Entities

### Announcement
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `title` | `string` | Yes | Announcement title |
| `body` | `string` | Yes | Full announcement content/description |
| `type` | `"system" \| "faculty" \| "event"` | Yes | Announcement category/type |
| `priority` | `boolean` | Yes | Whether marked as urgent/high priority |
| `isPinned` | `boolean` | Yes | Whether pinned to top (admin only) |
| `status` | `"published" \| "scheduled" \| "archived"` | Yes | Publication state |
| `authorId` | `number` | Yes | User ID of the creator |
| `authorName` | `string` | Yes | Display name (e.g., "Prof. Elena Rossi") |
| `audience` | `"university-wide" \| "faculty" \| "course" \| "year"` | No (admin) | Target audience scope |
| `publishAt` | `Date \| null` | No | Scheduled publish date/time (null = immediate) |
| `courseId` | `number \| null` | No | Linked course (for faculty/course-scoped announcements) |
| `createdAt` | `Date` | Yes | Creation timestamp |
| `updatedAt` | `Date` | Yes | Last modified timestamp |

### User (Consumer)
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | User ID |
| `name` | `string` | Yes | Display name |
| `role` | `"student" \| "manager" \| "admin"` | Yes | User role for conditional UI |
| `departmentId` | `number \| null` | No | Department for faculty-scoped announcements |
| `enrolledCourses` | `Course[]` | No (student) | Student's enrolled courses (for course-scoped filtering) |
| `faculty` | `string` | No (student) | Student's faculty (for faculty-scoped filtering) |
| `year` | `number` | No (student) | Student's academic year (for year-scoped filtering) |

### User (Manager/Admin Creator)
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | User ID |
| `name` | `string` | Yes | Display name |
| `role` | `"manager" \| "admin"` | Yes | Creator role |
| `assignedCourses` | `Course[]` | No (manager) | Courses the manager teaches (limits type options) |

---

## Derived/Computed Data

### Read Status
| Field | Type | Description |
|---|---|---|
| `isRead` | `boolean` | Whether current user has viewed this announcement |

### Display Helpers
| Field | Type | Description |
|---|---|---|
| `excerpt` | `string` | Truncated body preview (~100 chars) |
| `timeAgo` | `string` | Relative time (e.g., "2h ago", "3 days ago") |
| `formattedDate` | `string` | Human-readable date (e.g., "Apr 5, 2026") |

---

## Tab Filter Data

### Tab Types
| Tab | Filter Logic |
|---|---|
| All | No filter — show all visible announcements |
| System | `type === "system"` |
| Faculty | `type === "faculty"` AND user's faculty matches |
| Event | `type === "event"` |
| Manage (admin) | Show all announcements regardless of audience |

---

## Form Data (Create/Edit Announcement)

### Manager Form Fields
| Field | Type | Notes |
|---|---|---|
| `title` | `string` | Text input |
| `type` | `"faculty" \| "event"` | Select (restricted for managers) |
| `course` | `Course \| null` | Select from manager's assigned courses |
| `priority` | `boolean` | Switch toggle |
| `body` | `string` | Textarea |

### Admin Form Fields (all manager fields +)
| Field | Type | Notes |
|---|---|---|
| `type` | `"system" \| "faculty" \| "event"` | Select (all types unlocked) |
| `audience` | `"university-wide" \| "faculty" \| "course" \| "year"` | Select |
| `publishAt` | `Date \| null` | DateTimePicker (schedule) |
| `isPinned` | `boolean` | Switch toggle |

---

## Manage Tab Data (Admin Only)

### Table Columns
| Column | Data Source | Sortable |
|---|---|---|
| Title | `announcement.title` | Yes |
| Type | `announcement.type` | Yes |
| Author | `announcement.authorName` | Yes |
| Audience | `announcement.audience` | Yes |
| Status | `announcement.status` | Yes |
| Priority | `announcement.priority` | Yes |
| Pinned | `announcement.isPinned` | Yes |
| Created | `announcement.createdAt` | Yes |

### Actions
| Action | Data Needed |
|---|---|
| Edit | `announcement.id` |
| Delete | `announcement.id` |
| Archive | `announcement.id` (set `status = "archived"`) |
| Pin/Unpin | `announcement.id` (toggle `isPinned`) |

---

## Authorization Checks
| Check | Purpose |
|---|---|
| `hasRole("admin")` | Show "New Announcement" button, Manage tab, pin toggle, audience selector |
| `hasRole("manager")` | Show "New Announcement" button, edit/delete own announcements |
| `isOwner(announcement.authorId)` | Show edit/delete icons on specific announcement card |
| `isAdmin` | Show pinned announcements at top of each tab |
