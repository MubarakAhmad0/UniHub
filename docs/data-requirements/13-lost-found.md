# Data Requirements — Lost & Found

**Route:** `/dashboard/campus/lost-found`

---

## Core Data Entities

### Lost/Found Item
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `title` | `string` | Yes | Item title (e.g., "Black Leather Wallet") |
| `category` | `"electronics" \| "clothing" \| "documents" \| "accessories" \| "keys" \| "bags" \| "other"` | Yes | Item category |
| `description` | `string` | Yes | Detailed description |
| `locationFound` | `string` | Yes | Where item was found |
| `dateFound` | `Date` | Yes | Date item was found |
| `reportedById` | `number` | Yes | User who reported the item |
| `reportedByName` | `string` | Yes | Reporter display name |
| `status` | `"active" \| "claimed" \| "returned" \| "archived"` | Yes | Item status |
| `photoUrl` | `string \| null` | No | Item photo URL |
| `daysOld` | `number` | Yes | Derived from `dateFound` |
| `createdAt` | `Date` | Yes | Creation timestamp |
| `updatedAt` | `Date` | Yes | Last modified timestamp |

### Claim
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `itemId` | `number` | Yes | Associated item ID |
| `claimantId` | `number` | Yes | User ID of claimant |
| `claimantName` | `string` | Yes | Claimant display name |
| `claimantStudentId` | `string` | Yes | Claimant student/staff ID |
| `submittedDate` | `Date` | Yes | When claim was submitted |
| `description` | `string` | Yes | Proof of ownership description |
| `status` | `"pending" \| "verified" \| "rejected"` | Yes | Claim review state |
| `rejectionReason` | `string \| null` | No | Reason if rejected |

---

## Derived/Computed Data

### Item Display
| Field | Type | Description |
|---|---|---|
| `formattedDate` | `string` | Human-readable date (e.g., "Apr 2, 2026") |
| `timeAgo` | `string` | Relative time (e.g., "5 days ago") |
| `categoryBadge` | `{ label, color, icon }` | Visual category indicator |
| `statusBadge` | `{ label, color }` | Visual status indicator |
| `isOverdue` | `boolean` | `daysOld > retentionPolicyDays` |

### Claim Stats
| Field | Type | Description |
|---|---|---|
| `totalClaims` | `number` | Total claims on item |
| `pendingClaims` | `number` | Unreviewed claims |
| `verifiedClaims` | `number` | Approved claims |

---

## Tab Filter Data

### Tab Types
| Tab | Filter Logic |
|---|---|
| Browse | All items where `status === "active"` |
| My Reports | Items where `reportedById === currentUserId` |
| Manage (admin) | All items regardless of status |

### Browse Filters
| Filter | Data Source |
|---|---|
| Category | All unique categories |
| Status | Active / Claimed / Returned / Archived |
| Search | Title, description, location |
| Date Range | Date found |

---

## Form Data

### Report Found Item
| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | `string` | Yes | Text input |
| `category` | `string` | Yes | Select |
| `description` | `string` | Yes | Textarea |
| `locationFound` | `string` | Yes | Text input |
| `dateFound` | `Date` | Yes | Date picker |
| `photoUrl` | `string \| null` | No | File upload |

### Submit Claim
| Field | Type | Required | Notes |
|---|---|---|---|
| `claimantName` | `string` | Yes | Auto-filled from session |
| `claimantStudentId` | `string` | Yes | Auto-filled from session |
| `description` | `string` | Yes | Textarea (proof of ownership) |

### Admin Add Found Item
| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | `string` | Yes | Text input |
| `category` | `string` | Yes | Select |
| `description` | `string` | Yes | Textarea |
| `locationFound` | `string` | Yes | Text input |
| `dateFound` | `Date` | Yes | Date picker |
| `photoUrl` | `string \| null` | No | File upload |

---

## Admin Manage Panel Data

### Items Table
| Column | Data Source | Sortable |
|---|---|---|
| Item | `item.title` | Yes |
| Category | `item.category` | Yes |
| Location Found | `item.locationFound` | Yes |
| Date | `item.dateFound` | Yes |
| Reporter | `item.reportedByName` | Yes |
| Status | `item.status` | Yes |
| Claims | `item.pendingClaims` | Yes |

### Claim Review Panel (Per Item)
| Field | Type | Description |
|---|---|---|
| `claimantName` | `string` | Claimant display name |
| `submittedDate` | `string` | When claim submitted |
| `description` | `string` | Proof description |
| `status` | `string` | Current claim status |

### Claim Actions
| Action | Data Needed | Result |
|---|---|---|
| Verify ✓ | `claim.id` | Sets `claim.status = "verified"`, `item.status = "returned"` |
| Reject | `claim.id`, `reason` | Sets `claim.status = "rejected"`, opens reason dialog |

### Retention Policy
| Field | Type | Description |
|---|---|---|
| `retentionDays` | `number` | Auto-archive threshold (default 30) |
| `updatedAt` | `Date \| null` | Last policy update time |

### Archive Overdue
| Action | Logic |
|---|---|
| Archive Overdue button | Sets `status = "archived"` for all items where `daysOld > retentionDays` AND `status === "active"` |

---

## Authorization Checks
| Check | Purpose |
|---|---|
| `hasRole("admin")` | Show Manage tab, view claims, verify/reject claims, archive overdue, set retention policy, add items |
| Manager role | Same as student (no special permissions) |
| Student role | Browse items, report found items, submit claims, view own reports |
| `isOwner(item.reportedById)` | Can edit/delete own reported items |
