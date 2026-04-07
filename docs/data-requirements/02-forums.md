# Data Requirements — Community Forums

**Route:** `/dashboard/campus/forums`

---

## Core Data Entities

### Forum
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `name` | `string` | Yes | Forum name (e.g., "CS 105 Discussion") |
| `type` | `"course" \| "university" \| "study_group" \| "interest"` | Yes | Forum category |
| `description` | `string` | No | Forum description |
| `icon` | `string` | No | Emoji/icon identifier |
| `moderatorId` | `number \| null` | No | User ID of assigned moderator |
| `status` | `"active" \| "archived"` | Yes | Forum status |
| `linkedCourseId` | `number \| null` | No | Associated course (for course forums) |
| `createdAt` | `Date` | Yes | Creation timestamp |
| `updatedAt` | `Date` | Yes | Last modified timestamp |

### Thread
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `forumId` | `number` | Yes | Parent forum ID |
| `title` | `string` | Yes | Thread title |
| `body` | `string` | Yes | Original post content |
| `authorId` | `number` | Yes | User ID of thread creator |
| `authorName` | `string` | Yes | Display name |
| `authorAvatar` | `string \| null` | No | Avatar URL or initials |
| `isPinned` | `boolean` | Yes | Whether pinned in forum |
| `isLocked` | `boolean` | Yes | Whether replies are disabled |
| `isSolutionMarked` | `boolean` | No | Whether a solution has been marked (course forums) |
| `isFlagged` | `boolean` | Yes | Whether reported/flagged |
| `isAnonymous` | `boolean` | Yes | Whether posted anonymously |
| `createdAt` | `Date` | Yes | Creation timestamp |
| `updatedAt` | `Date` | Yes | Last modified timestamp |

### Reply
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `threadId` | `number` | Yes | Parent thread ID |
| `body` | `string` | Yes | Reply content |
| `authorId` | `number` | Yes | User ID of reply creator |
| `authorName` | `string` | Yes | Display name |
| `authorAvatar` | `string \| null` | No | Avatar URL or initials |
| `isSolution` | `boolean` | No | Whether marked as the solution |
| `isFlagged` | `boolean` | Yes | Whether reported/flagged |
| `isAnonymous` | `boolean` | Yes | Whether posted anonymously |
| `createdAt` | `Date` | Yes | Creation timestamp |
| `updatedAt` | `Date` | Yes | Last modified timestamp |

---

## Derived/Computed Data

### Forum Stats
| Field | Type | Description |
|---|---|---|
| `threadCount` | `number` | Total threads in forum |
| `unreadCount` | `number` | Unread threads for current user |
| `pendingFlags` | `number` | Unreviewed flagged items |

### Thread Stats
| Field | Type | Description |
|---|---|---|
| `replyCount` | `number` | Total replies in thread |
| `lastReplyAt` | `Date \| null` | Timestamp of most recent reply |
| `lastReplyAuthor` | `string \| null` | Name of last reply author |
| `timeAgo` | `string` | Relative time since creation |
| `excerpt` | `string` | Truncated body preview |

---

## Sidebar Data

### Forum Sections
| Section | Data Needed |
|---|---|
| My Courses | Forums where `type === "course"` AND user is enrolled in linked course |
| Community Forums | Forums where `type === "university"` |
| Study Groups | Forums where `type === "study_group"` AND user is member OR pending approval |
| Interest Rooms | Forums where `type === "interest"` |

---

## Form Data (Create Forum)

### Manager Form Fields
| Field | Type | Notes |
|---|---|---|
| `name` | `string` | Text input |
| `type` | `"course"` | Fixed (manager can only create course forums) |
| `icon` | `string` | Emoji picker |
| `description` | `string` | Textarea |
| `linkedCourse` | `Course` | Dropdown of manager's assigned courses |

### Admin Form Fields
| Field | Type | Notes |
|---|---|---|
| `name` | `string` | Text input |
| `type` | `"course" \| "university" \| "study_group" \| "interest"` | Select (all types) |
| `icon` | `string` | Emoji picker |
| `description` | `string` | Textarea |
| `linkedCourse` | `Course \| null` | Optional (for course type) |
| `moderator` | `User \| null` | Assign moderator dropdown |

### Student Form Fields
| Field | Type | Notes |
|---|---|---|
| `name` | `string` | Text input |
| `type` | `"study_group" \| "interest"` | Select (restricted) |
| `icon` | `string` | Emoji picker |
| `description` | `string` | Textarea |
| **Result** | `pending approval` | Not immediately visible |

---

## Moderation Data

### Moderation Permissions
| Check | Purpose |
|---|---|
| `canModerateThisForum(forum)` | Returns true if admin OR manager of course forum |
| `canMarkSolution(reply)` | True if manager owns the course forum |
| `canDeleteReply(reply)` | True if admin OR manager owns course forum |

### Flag System
| Field | Type | Description |
|---|---|---|
| `flaggedBy` | `number[]` | User IDs who flagged |
| `flagReason` | `string \| null` | Optional reason from flagger |
| `flagStatus` | `"pending" \| "reviewed" \| "dismissed"` | Review state |

---

## Manage Tab Data (Admin Only)

### Table Columns
| Column | Data Source | Sortable |
|---|---|---|
| Forum Name | `forum.name` | Yes |
| Type | `forum.type` | Yes |
| Threads | `forum.threadCount` | Yes |
| Unread | `forum.unreadCount` | Yes |
| Moderator | `forum.moderatorName` | Yes |
| Status | `forum.status` | Yes |

### Actions
| Action | Data Needed |
|---|---|
| Edit metadata | `forum.id` |
| Archive | `forum.id` (set `status = "archived"`) |
| Assign Moderator | `forum.id`, `moderatorId` |
| Create Forum | Opens create form |

---

## Authorization Checks
| Check | Purpose |
|---|---|
| `hasRole("admin")` | Show Manage Forums tab, full moderation controls, create any forum |
| `hasRole("manager")` | Moderate own course forums, create course forums, mark solutions |
| `hasRole("student")` | Create study groups/interest (pending approval), flag content |
| `isAnonymous` | Hide author name on thread/reply display |
