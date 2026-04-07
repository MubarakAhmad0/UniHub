# Data Requirements — Complaints & Appeals

**Route:** `/dashboard/services/complaints`

---

## Core Data Entities

### Case
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `reference` | `string` | Yes | Auto-generated reference (e.g., "APP-2026-0012") |
| `type` | `"academic_appeal" \| "grade_dispute" \| "special_consideration" \| "grievance" \| "other"` | Yes | Case type |
| `title` | `string` | Yes | Case title |
| `description` | `string` | Yes | Full statement/description |
| `courseCode` | `string \| null` | No | Associated course (if applicable) |
| `semester` | `string \| null` | No | Associated semester |
| `submittedById` | `number` | Yes | Student user ID |
| `submittedByName` | `string` | Yes | Student display name |
| `submittedDate` | `Date` | Yes | When submitted |
| `status` | `"submitted" \| "under_review" \| "info_requested" \| "resolved"` | Yes | Case status |
| `outcome` | `"upheld" \| "rejected" \| "partially_upheld" \| null` | No | Final outcome |
| `outcomeNote` | `string \| null` | No | Outcome description |
| `assignedStaffId` | `number \| null` | No | Assigned admin staff |
| `assignedStaffName` | `string \| null` | No | Staff display name |
| `createdAt` | `Date` | Yes | Creation timestamp |
| `updatedAt` | `Date` | Yes | Last modified timestamp |

### Message
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Message ID |
| `caseId` | `number` | Yes | Associated case ID |
| `authorId` | `number` | Yes | Author user ID |
| `authorName` | `string` | Yes | Display name |
| `role` | `"student" \| "manager" \| "admin"` | Yes | Author role |
| `body` | `string` | Yes | Message content |
| `createdAt` | `Date` | Yes | When sent |

### Internal Note (Admin Only)
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Note ID |
| `caseId` | `number` | Associated case |
| `authorId` | `number` | Admin user ID |
| `body` | `string` | Note content |
| `createdAt` | `Date` | When created |

---

## Derived/Computed Data

### Case Display
| Field | Type | Description |
|---|---|---|
| `typeLabel` | `string` | Human-readable type (e.g., "Academic Appeal") |
| `typeColor` | `string` | Color class for type badge |
| `statusLabel` | `string` | Human-readable status |
| `statusColor` | `string` | Color class for status badge |
| `outcomeColor` | `string` | Color class for outcome (if resolved) |
| `stepProgress` | `number` | Current step index in workflow |
| `hasAdminMessages` | `boolean` | Whether case has admin replies |
| `adminMessageCount` | `number` | Count of admin messages |

### Case Workflow Steps
| Step | Status |
|---|---|
| 1 | Submitted |
| 2 | Under Review |
| 3 | Info Requested |
| 4 | Resolved |

---

## Tab Filter Data

### Tab Types
| Tab | Filter Logic |
|---|---|
| My Complaints | Cases where `submittedById === currentUserId` |
| Course Feedback (manager) | Cases where `courseCode` matches manager's courses |
| Manage (admin) | All cases regardless of owner |

### Case Types (for Submission)
| Type | Label | Description |
|---|---|---|
| academic_appeal | Academic Appeal | Grade disputes, re-grading requests |
| grade_dispute | Grade Dispute | Specific mark disagreement |
| special_consideration | Special Consideration | Medical, personal circumstances |
| grievance | Grievance | Staff conduct, facilities, process |

---

## Form Data

### Submit New Case (2-Step Form)

#### Step 1: Select Case Type
| Field | Type | Required | Notes |
|---|---|---|---|
| `type` | `string` | Yes | Button selector |

#### Step 2: Details
| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | `string` | Yes | Text input |
| `courseCode` | `string \| null` | No | Text input (if applicable) |
| `semester` | `string \| null` | No | Select (if applicable) |
| `description` | `string` | Yes | Textarea (statement) |

### Reply Box
| Field | Type | Required | Notes |
|---|---|---|---|
| `body` | `string` | Yes | Textarea |
| **Student** | Visible to administration | |
| **Manager** | "Submit formal lecturer response..." → sent to admin | |

---

## Case Detail Sheet Data

### Display Fields
| Field | Type | Description |
|---|---|---|
| `type` | `string` | Type badge |
| `status` | `string` | Status badge |
| `title` | `string` | Case title |
| `reference` | `string` | Reference number |
| `submittedDate` | `string` | Submission date |
| `description` | `string` | Full statement |
| `outcome` | `string \| null` | Outcome (if resolved) |
| `outcomeNote` | `string \| null` | Outcome details |
| `messages` | `Message[]` | Message thread |

### Info Requested Notice
| Condition | Display |
|---|---|
| `status === "info_requested"` | Amber border notice: "Admin has requested additional information — please reply below." |

---

## Admin Tools (Detail Sheet)

### Admin-Only Section
| Tool | Data Needed |
|---|---|
| Assign Staff | Dropdown of admin staff |
| Internal Notes | Textarea (hidden from student) |

### Admin Manage Panel
Refer to `ComplaintsManagePanel` component for admin management features.

---

## Authorization Checks
| Check | Purpose |
|---|---|
| `hasRole("admin")` | Show Manage tab, assign staff, internal notes, resolve cases |
| `hasRole("manager")` | Show Course Feedback tab, review/respond to cases for own courses |
| Student role | Submit cases, view own cases, reply to messages |
| `isOwner(case.submittedById)` | Student can only see own cases |
| `isCourseLecturer(case.courseCode)` | Manager can only see cases for own courses |
