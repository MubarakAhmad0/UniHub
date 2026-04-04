# Implementation Plan — 17 · Documents

**Route:** `/dashboard/services/documents`  
**Pattern:** A (additive for manager; admin gets a manage panel)  
**Current file:** `app/dashboard/services/documents/page.tsx` (13,083 bytes)

---

## What Changes

### Manager View (additive)
- **"Course Documents" tab** alongside My Requests
- Per-course: generate class list, grade sheet template, or course outline as downloadable PDFs
- Also submits staff document requests (employment letters, etc.)

### Admin View (conditional additions)
- **"Request Queue" tab** — all pending document requests
- **"Templates" tab** — manage document templates
- Process approval: approve, upload finalized doc, reject with reason

---

## Files to Create / Modify

### [MODIFY] `app/dashboard/services/documents/page.tsx`
```tsx
const isAdmin   = hasRole("admin");
const isManager = hasRole("manager");

// Tab additions for manager
{isManager && <TabsTrigger value="course-docs">Course Documents</TabsTrigger>}
{isManager && <TabsContent value="course-docs"><CourseDocumentsTab /></TabsContent>}

// Tab additions for admin
{isAdmin && <TabsTrigger value="queue">Request Queue {pendingCount > 0 && <Badge>{pendingCount}</Badge>}</TabsTrigger>}
{isAdmin && <TabsTrigger value="templates">Templates</TabsTrigger>}
```

### [NEW] `_components/course-documents-tab.tsx`
Manager-only tab:
```
Per-course section (one card per teaching course):

  Card: "MTH 301 · Advanced Calculus II"
  Generate:
    [↓ Class List (PDF)]       → generates mock PDF, toast("Downloading class list...")
    [↓ Grade Sheet Template]   → generates blank grade sheet CSV/PDF
    [↓ Course Outline]         → generates course info PDF
```
Each button triggers `toast("Generating [document]...")` + simulates a download via `window.URL.createObjectURL` with a placeholder blob or just a toast notification for now.

#### Staff document request section (reuse existing student request form):
```
"Request Staff Document"
Type: Select — Employment Verification Letter | Tax Summary | Payslip Copy | Other
Purpose: Textarea
Submit → adds to "My Requests" tab with "Pending" status
```

### [NEW] `_components/document-request-queue.tsx`
Admin-only tab:

**Filter bar:**
```tsx
<Select> {/* Type */} </Select>
<Select> {/* Status: All/Pending/Processing/Ready/Rejected */} </Select>
<Input placeholder="Search student…" />
```

**Requests table:**
```
Columns: #ID | Student | Document Type | Purpose | Submitted | Status | Actions
Actions per row:
  [Process] → opens RequestDetailSheet
  [Quick Reject] → opens reason dialog → toast
```

#### `request-detail-sheet.tsx`
```
Sheet title: "Document Request #[ID]"

Student info: name, ID, programme
Document type: [type]
Purpose: [purpose text]

Status Select (inline): Pending → Processing → Ready → Collected

Upload finalized document:
  Dropzone or file input: "Upload completed document (PDF)"
  On upload → status auto-set to "Ready", student can now download

Rejection:
  [Reject] button → reason dialog → status = Rejected
```

### [NEW] `_components/document-templates-tab.tsx`
Admin-only tab:
```
List of document templates:
  Each: Template name | Type | Last updated | Actions (Download, Replace, Edit label, Delete)

"Upload Template" button:
  Name: text input
  Type: Select (Transcript / Enrollment Letter / Course Outline / Other)
  File: PDF upload
```
All local state — no real upload in this phase.

---

## Mock Data Changes
```ts
type DocumentType =
  | "Transcript"
  | "Enrollment Letter"
  | "Course Completion Certificate"
  | "Conduct Certificate"
  | "Employment Verification"   // staff
  | "Tax Summary"               // staff
  | "Other";

type DocumentStatus = "pending" | "processing" | "ready" | "collected" | "rejected";

type DocumentRequest = {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterType: "student" | "manager";
  documentType: DocumentType;
  purpose: string;
  status: DocumentStatus;
  uploadedUrl?: string;   // admin uploads, student downloads
  rejectionReason?: string;
  submittedAt: string;
}

const mockRequests: DocumentRequest[] = [
  { id: "dr001", requesterId: "s001", requesterName: "Alex Rivers", requesterType: "student", documentType: "Transcript", purpose: "Graduate school application", status: "pending", submittedAt: "Apr 1" },
  { id: "dr002", requesterId: "s002", requesterName: "Jae Lee",    requesterType: "student", documentType: "Enrollment Letter", purpose: "Visa application", status: "processing", submittedAt: "Mar 30" },
]
```

---

## Scope / Not in Scope
| In scope | Out of scope |
|---|---|
| Manager course documents tab | Real PDF generation |
| Staff document request via existing form | S3 file upload |
| Admin request queue + detail sheet | Email notification on status change |
| Approve/process/reject flow (local) | Batch document generation |
| Templates tab (list + upload UI) | Template rendering engine |
