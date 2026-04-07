# Data Requirements — Document Requests

**Route:** `/dashboard/services/documents`

---

## Core Data Entities

### Document Type
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Document type key (e.g., "transcript") |
| `name` | `string` | Yes | Display name |
| `fee` | `number` | Yes | Cost in RM (0 = free) |
| `processingDays` | `number` | Yes | Estimated processing time |
| `description` | `string` | No | Additional info |
| `isActive` | `boolean` | Yes | Whether available for request |
| `requiresPayment` | `boolean` | Yes | Whether fee applies |

### Document Request
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `reference` | `string` | Yes | Auto-generated reference (e.g., "DOC-2026-0041") |
| `docTypeId` | `string` | Yes | Document type key |
| `docTypeName` | `string` | Yes | Document type display name |
| `requestedById` | `number` | Yes | Requester user ID |
| `requestedByName` | `string` | Yes | Requester display name |
| `purpose` | `string` | Yes | Purpose of request |
| `addressedTo` | `string \| null` | No | Who document should be addressed to |
| `copies` | `number` | Yes | Number of copies |
| `urgency` | `"normal" \| "urgent"` | Yes | Processing speed |
| `urgentFee` | `number` | Yes | Additional fee for urgent (e.g., RM15) |
| `totalFee` | `number` | Yes | `docType.fee * copies + (urgency === "urgent" ? 15 : 0)` |
| `status` | `"submitted" \| "processing" \| "ready" \| "collected" \| "rejected"` | Yes | Request status |
| `submittedDate` | `Date` | Yes | When submitted |
| `estReadyDate` | `Date \| null` | No | Estimated ready date |
| `adminNote` | `string \| null` | No | Admin note (e.g., rejection reason) |
| `documentUrl` | `string \| null` | No | Download URL when ready |
| `collectedAt` | `Date \| null` | No | When collected |
| `createdAt` | `Date` | Yes | Creation timestamp |
| `updatedAt` | `Date` | Yes | Last modified timestamp |

---

## Derived/Computed Data

### Request Display
| Field | Type | Description |
|---|---|---|
| `statusLabel` | `string` | Human-readable status |
| `statusColor` | `string` | Color class for status badge |
| `formattedSubmittedDate` | `string` | Human-readable date |
| `formattedEstReadyDate` | `string \| null` | "Est. ready: Apr 4, 2026" |
| `isReady` | `boolean` | `status === "ready"` |
| `isDownloadable` | `boolean` | `status === "ready" && documentUrl !== null` |
| `isOverdue` | `boolean` | Past estimated ready date and not ready |

### Request Workflow Steps
| Step | Status |
|---|---|
| 1 | Submitted |
| 2 | Processing |
| 3 | Ready |
| 4 | Collected |

---

## Tab Filter Data

### Tab Types
| Tab | Filter Logic |
|---|---|
| My Requests | Requests where `requestedById === currentUserId` |
| Staff Docs (manager) | Staff-specific document requests |
| Manage (admin) | All document requests |

---

## Form Data

### New Document Request (2-Step Form)

#### Step 1: Select Document Type
| Field | Type | Required | Notes |
|---|---|---|---|
| `docTypeId` | `string` | Yes | Button grid of document types |

Each option displays:
- Name
- Fee ("RM X" or "Free")
- Processing time ("X working days")

#### Step 2: Details
| Field | Type | Required | Notes |
|---|---|---|---|
| `purpose` | `string` | Yes | Text input |
| `addressedTo` | `string` | No | Text input (optional) |
| `copies` | `number` | Yes | Number input (default 1) |
| `urgency` | `"normal" \| "urgent"` | Yes | Select |

### Available Document Types (Mock Data)
| ID | Name | Fee | Days |
|---|---|---|---|
| transcript | Official Transcript | RM 10 | 5 |
| enrolment | Enrolment Verification Letter | Free | 3 |
| good_standing | Good Standing Letter | Free | 3 |
| graduation | Graduation Certificate | RM 20 | 10 |
| moi | Medium of Instruction Letter | Free | 5 |
| completion | Completion Letter | Free | 5 |

---

## Request Card Data

### Display Fields
| Field | Type | Description |
|---|---|---|
| `docTypeName` | `string` | Document type |
| `reference` | `string` | Reference number |
| `submittedDate` | `string` | Submission date |
| `purpose` | `string` | Request purpose |
| `status` | `string` | Status badge |
| `estReadyDate` | `string \| null` | Estimated ready date |
| `adminNote` | `string \| null` | Admin note (visible if rejected) |

### Actions by Status
| Status | Available Actions |
|---|---|
| submitted | View only |
| processing | View only (shows "Processing" with clock icon) |
| ready | Download button |
| collected | View only |
| rejected | View only (shows admin note) |

---

## Admin Manage Panel Data

### Requests Table
| Column | Data Source | Sortable |
|---|---|---|
| Reference | `request.reference` | Yes |
| Document Type | `request.docTypeName` | Yes |
| Requester | `request.requestedByName` | Yes |
| Purpose | `request.purpose` | Yes |
| Submitted | `request.submittedDate` | Yes |
| Status | `request.status` | Yes |
| Actions | Process / Reject / Mark Ready / Mark Collected | — |

### Admin Actions
| Action | Data Needed | Result |
|---|---|---|
| Process | `request.id` | Sets `status = "processing"` |
| Mark Ready | `request.id`, `documentUrl` | Sets `status = "ready"`, adds download link |
| Mark Collected | `request.id` | Sets `status = "collected"` |
| Reject | `request.id`, `adminNote` | Sets `status = "rejected"`, adds note |

---

## Staff Documents Panel (Manager Tab)

Manager-specific document request features (details depend on implementation).

---

## Authorization Checks
| Check | Purpose |
|---|---|
| `hasRole("admin")` | Show Manage tab, process requests, mark ready/collected, reject |
| `hasRole("manager")` | Show Staff Docs tab |
| Student role | Submit requests, view own requests, download when ready |
| `isOwner(request.requestedById)` | Student can only see own requests |
