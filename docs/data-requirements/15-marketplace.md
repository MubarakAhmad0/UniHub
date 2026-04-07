# Data Requirements — Student Marketplace

**Route:** `/dashboard/community/marketplace`

---

## Core Data Entities

### Listing
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `title` | `string` | Yes | Listing title |
| `category` | `"textbook" \| "equipment" \| "notes" \| "stationery" \| "electronics" \| "clothing" \| "other"` | Yes | Item category |
| `description` | `string` | Yes | Full item description |
| `condition` | `"new" \| "like_new" \| "good" \| "fair" \| "poor"` | Yes | Item condition |
| `price` | `number \| null` | No | Asking price (null = make offer) |
| `isFree` | `boolean` | Yes | Whether item is free |
| `courseCode` | `string \| null` | No | Associated course code |
| `sellerId` | `number` | Yes | Seller user ID |
| `sellerName` | `string` | Yes | Seller display name |
| `isAnonymous` | `boolean` | Yes | Whether seller is anonymous |
| `status` | `"active" \| "sold"` | Yes | Listing status |
| `imageUrl` | `string \| null` | No | Item photo URL |
| `createdAt` | `Date` | Yes | Creation timestamp |
| `updatedAt` | `Date` | Yes | Last modified timestamp |

### Message
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Message ID |
| `listingId` | `number` | Yes | Associated listing |
| `senderId` | `number` | Yes | Sender user ID |
| `body` | `string` | Yes | Message content |
| `createdAt` | `Date` | Yes | When sent |

---

## Derived/Computed Data

### Listing Display
| Field | Type | Description |
|---|---|---|
| `categoryIcon` | `string` | Icon for category |
| `categoryBg` | `string` | Background color class |
| `conditionLabel` | `string` | Human-readable condition |
| `priceDisplay` | `string` | "RM X.XX", "Free", "Make offer" |
| `timeAgo` | `string` | Relative time (e.g., "3h ago") |
| `isOwn` | `boolean` | Whether current user is seller |

### Filter Data
| Filter | Data Source |
|---|---|
| Category | All unique categories |
| Price | Any price / Free / Under RM20 / Under RM50 |
| Search | Title search |

---

## Tab Filter Data

### Tab Types
| Tab | Filter Logic |
|---|---|
| All Listings | All listings where `status === "active"` |
| My Listings | Listings where `sellerId === currentUserId` |
| Moderation (admin) | All listings regardless of status |

---

## Listing Detail Sheet Data

### Display Fields
| Field | Type | Description |
|---|---|---|
| `title` | `string` | Listing title |
| `category` | `string` | Category badge |
| `condition` | `string` | Condition badge |
| `courseCode` | `string \| null` | Course badge (if present) |
| `price` | `string` | Formatted price |
| `description` | `string` | Full description |
| `seller` | `string` | "Anonymous student" or seller name |
| `timeAgo` | `string` | Posted time |

### Actions (Based on Role/Ownership)
| Scenario | Available Actions |
|---|---|
| Student viewing active listing | Contact Seller, Report listing |
| Owner viewing active listing | Edit, Mark as Sold |
| Admin viewing any listing | Warn Seller, Force Removal |

---

## Form Data

### Post Listing
| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | `string` | Yes | Text input |
| `category` | `string` | Yes | Button selector |
| `price` | `number` | No | Number input (0 = Free) |
| `courseCode` | `string` | No | Text input (optional) |
| `description` | `string` | Yes | Textarea |
| `condition` | `string` | Yes | Select |
| `isAnonymous` | `boolean` | Yes | Switch toggle |
| `imageUrl` | `string \| null` | No | File upload |

---

## Admin Moderation Panel Data

### Moderation Table
| Column | Data Source | Sortable |
|---|---|---|
| Title | `listing.title` | Yes |
| Category | `listing.category` | Yes |
| Seller | `listing.sellerName` | Yes |
| Price | `listing.price` | Yes |
| Status | `listing.status` | Yes |
| Posted | `listing.createdAt` | Yes |
| Actions | Warn / Remove | — |

### Admin Actions
| Action | Data Needed | Result |
|---|---|---|
| Warn Seller | `listing.id`, `warningMessage` | Sends warning notification |
| Force Removal | `listing.id` | Sets `status = "sold"`, removes from browse |

### Reported Listings
| Field | Type | Description |
|---|---|---|
| `listingId` | `number` | Reported listing |
| `reportedBy` | `number` | Reporter user ID |
| `reason` | `string` | Report reason |
| `reportedAt` | `Date` | When reported |

---

## Category Display Mapping

### Icons
| Category | Icon |
|---|---|
| textbook | Package |
| equipment | Laptop |
| notes | Package |
| stationery | Package |
| electronics | SmartphoneIcon |
| clothing | Shirt |
| other | Backpack |

### Background Colors
| Category | BG Class |
|---|---|
| textbook | `bg-blue-50` |
| equipment | `bg-primary/5` |
| notes | `bg-amber-50` |
| stationery | `bg-emerald-50` |
| electronics | `bg-purple-50` |
| clothing | `bg-orange-50` |
| other | `bg-muted/40` |

---

## Authorization Checks
| Check | Purpose |
|---|---|
| `hasRole("admin")` | Show Moderation tab, warn sellers, force remove listings |
| Manager role | Same as student (no special permissions) |
| Student role | Browse listings, post listings, contact sellers, report listings |
| `isOwn(listing.sellerId)` | Can edit/mark as sold own listings |
