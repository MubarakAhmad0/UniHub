# Data Requirements — Clubs & Societies

**Route:** `/dashboard/community/clubs`

---

## Core Data Entities

### Club
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `name` | `string` | Yes | Club name |
| `tagline` | `string` | Yes | Short tagline/slogan |
| `description` | `string` | Yes | Full club description |
| `category` | `"arts" \| "sports" \| "academic" \| "cultural" \| "tech" \| "religious" \| "volunteer"` | Yes | Club category |
| `founded` | `number` | Yes | Year founded |
| `memberCount` | `number` | Yes | Total member count |
| `joinMethod` | `"open" \| "application"` | Yes | How to join |
| `isActive` | `boolean` | Yes | Whether club is active |
| `emoji` | `string` | Yes | Icon/emoji for display |
| `socialLinks` | `{ instagram?: string, whatsapp?: string, website?: string }` | No | Social media links |
| `forumId` | `number \| null` | No | Associated forum ID |
| `createdAt` | `Date` | Yes | Creation timestamp |
| `updatedAt` | `Date` | Yes | Last modified timestamp |

### Membership
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `clubId` | `number` | Yes | Club ID |
| `userId` | `number` | Yes | User ID |
| `userName` | `string` | Yes | Display name |
| `studentId` | `string` | Yes | Student/staff ID |
| `status` | `"none" \| "pending" \| "member" \| "officer"` | Yes | Membership state |
| `joinedAt` | `Date` | Yes | When joined |

### Advisor Assignment
| Field | Type | Description |
|---|---|---|
| `clubId` | `number` | Club ID |
| `managerId` | `number` | Advisor user ID |
| `managerName` | `string` | Advisor display name |
| `assignedAt` | `Date` | When assigned |

### Upcoming Event
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Event ID |
| `title` | `string` | Event title |
| `date` | `Date` | Event date |
| `location` | `string` | Event location |
| `description` | `string \| null` | Event description |

---

## Derived/Computed Data

### Club Display
| Field | Type | Description |
|---|---|---|
| `categoryGradient` | `string` | CSS gradient class for banner |
| `categoryBadge` | `{ label, color }` | Visual category indicator |
| `memberStatusBadge` | `string` | "Joined ✓", "Application Pending", "Join", "Apply" |
| `isAdvising` | `boolean` | Whether current user is advisor |
| `isMember` | `boolean` | Whether current user is member |
| `isPending` | `boolean` | Whether membership application is pending |

---

## Tab Filter Data

### Tab Types
| Tab | Filter Logic |
|---|---|
| All Clubs | All clubs where `isActive === true` |
| My Clubs | Clubs where user has `status !== "none"` |
| Advisory Clubs (manager) | Clubs where user is assigned advisor |
| Manage (admin) | All clubs regardless of status |

### Category Filters
| Category | Description |
|---|---|
| All | No filter |
| Arts | `category === "arts"` |
| Sports | `category === "sports"` |
| Academic | `category === "academic"` |
| Cultural | `category === "cultural"` |
| Tech | `category === "tech"` |
| Religious | `category === "religious"` |
| Volunteer | `category === "volunteer"` |

---

## Club Detail Sheet Data

### Display Fields
| Field | Type | Description |
|---|---|---|
| `name` | `string` | Club name |
| `category` | `string` | Category badge |
| `memberCount` | `number` | Total members |
| `founded` | `number` | Year founded |
| `description` | `string` | Full description |
| `upcomingEvents` | `Event[]` | List of upcoming events |
| `socialLinks` | `{ ... }` | Social media links |

### Student Actions
| Action | Data Needed |
|---|---|
| Join (open club) | `club.id` → set membership `status = "member"` |
| Apply (application club) | `club.id` → set membership `status = "pending"` |

### Manager Advisory Tools
| Tool | Data Needed |
|---|---|
| View Full Roster | `club.id` → member list |
| Endorse Outstanding Activity | `club.id`, `eventId` (optional) |
| Step Down as Advisor | `club.id` → remove advisor assignment |

---

## Form Data

### Create Club (Admin)
| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | `string` | Yes | Text input |
| `tagline` | `string` | Yes | Short text |
| `description` | `string` | Yes | Textarea |
| `category` | `string` | Yes | Select |
| `joinMethod` | `"open" \| "application"` | Yes | Select |
| `emoji` | `string` | Yes | Emoji picker |
| `socialLinks` | `{ ... }` | No | Optional URL inputs |
| `advisor` | `User \| null` | No | Assign advisor |

---

## Admin Manage Panel Data

### Club Management Table
| Column | Data Source | Sortable |
|---|---|---|
| Name | `club.name` | Yes |
| Category | `club.category` | Yes |
| Members | `club.memberCount` | Yes |
| Advisor | `club.advisorName` | Yes |
| Status | `club.isActive` | Yes |
| Actions | Edit / Archive / Assign Advisor | — |

### Member Roster
| Field | Type | Description |
|---|---|---|
| `userName` | `string` | Member display name |
| `studentId` | `string` | Student/staff ID |
| `status` | `"member" \| "officer"` | Role in club |
| `joinedAt` | `Date` | When joined |

---

## Authorization Checks
| Check | Purpose |
|---|---|
| `hasRole("admin")` | Show Manage tab, create/edit/archive clubs, assign advisors |
| `hasRole("manager")` | Show Advisory Clubs tab, advisory tools (roster, endorse, step down) |
| Student role | Browse clubs, join/apply, view details |
| `isAdvising(club)` | Manager can only advise assigned clubs |
| `isMember(club)` | Student can see member-only details |
