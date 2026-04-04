# Implementation Plan — 16 · Complaints

**Route:** `/dashboard/services/complaints`  
**Pattern:** B (role-switched content — manager gets a scoped view; admin gets full management)  
**Current file:** `app/dashboard/services/complaints/page.tsx` (21,615 bytes)

---

## What Changes

### Student View (updated)
- **Categories now include "Student Conduct"** for filing complaints against other students
- Category select in submission form updated

### Manager View (scoped role-switch)
- Manager still submits personal complaints like a student
- PLUS: sees **"Complaints About My Courses" tab** showing anonymous complaints about their courses
- Can submit a formal response per complaint
- Cannot see complainant identity

### Admin View (role-switch)
- Full case management dashboard
- All complaints across all users/categories
- Assign, prioritize, respond, resolve, internal notes

---

## Files to Create / Modify

### [MODIFY] `app/dashboard/services/complaints/page.tsx`
Role-switching shell:
```tsx
if (hasRole("admin"))   return <AdminComplaintsView />;
if (hasRole("manager")) return <ManagerComplaintsView />;
return <StudentComplaintsView />;
```

### [NEW] `_components/student-view.tsx`
Current page content + one change:  
Add "Student Conduct" to the category Select in the submission form:
```tsx
const CATEGORIES = [
  "Teaching Quality",
  "Facilities",
  "Administrative Services",
  "IT & Systems",
  "Student Conduct",   // NEW
  "Other",
]
```

### [NEW] `_components/manager-view.tsx`
Layout:
```
Tabs:
  [My Complaints]           — same as student view (manager's own submitted complaints)
  [About My Courses ({N})]  — complaints filed about their courses (anonymous)

My Complaints tab: identical to student view (reuse StudentComplaintsView)

"About My Courses" tab content:
  Info banner: "Complainant identities are not shown."
  List of complaint cards:
    Badge: course code (e.g., "CS 105")
    Category: "Teaching Quality"
    Date submitted
    Status badge: Open / In Review / Resolved
    Complaint body text
    [Respond] button
```

#### `complaint-response-sheet.tsx`
Opens when manager clicks "Respond":
```
Sheet title: "Submit Response — [Course] Complaint"
Info: "Your response will be seen by admin when reviewing this complaint."
Response: Textarea (required)
Cancel | Submit Response
```
On submit: `toast("Response submitted to admin")`.

### [NEW] `_components/admin-view.tsx`
Full case management. Retitled **"Complaints Management"**.

Layout:
```
Stats row: [Total Open] [In Review] [Resolved This Month] [Avg Resolution Time]

Filter bar: Category | Priority | Status | Assigned To | Date range | Search

Complaints table:
  Columns: ID | Student | Category | Subject | Priority | Status | Assigned | Created | Actions
  Priority colours: Low (muted) / Medium (amber) / High (orange) / Urgent (red)

Click a row → opens ComplaintDetailSheet
```

#### `complaint-detail-sheet.tsx`
Full right-side drawer:
```
Header: Complaint #001 — [Subject]
  Status Select | Priority Select | Assigned To Select (all inline)

Body: full complaint text + any attachments
      If category = "Student Conduct": shows Accused student name too

Manager Response (if exists): highlighted block
  "Response from Prof. Rossi (Apr 2):"
  [response text]

Timeline / thread:
  Each admin reply shown as a message bubble
  Internal notes shown with [Internal] badge — not visible to student

Compose:
  [Public Reply] [Internal Note] tabs
  Textarea
  Send button

Footer actions:
  Mark Resolved | Mark Closed | Escalate | Reopen
```

#### Components used by admin-view:
- `ComplaintStatsBar` — the four stats at top
- `ComplaintsFilterBar` — the filter strip
- `ComplaintsTable` — data table with sorting

---

## Mock Data Changes
```ts
type ComplaintCategory =
  | "Teaching Quality"
  | "Facilities"
  | "Administrative Services"
  | "IT & Systems"
  | "Student Conduct"
  | "Other";

type ComplaintPriority = "low" | "medium" | "high" | "urgent";

type ComplaintStatus = "open" | "in_review" | "resolved" | "closed";

type ComplaintReply = {
  id: string;
  author: string;      // admin name
  body: string;
  type: "public" | "internal";
  createdAt: string;
}

type Complaint = {
  id: string;
  studentId: string;
  studentName: string;         // shown to admin only
  category: ComplaintCategory;
  subject: string;
  body: string;
  courseCode?: string;         // for teaching quality complaints
  accusedStudent?: string;     // for student conduct complaints
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assignedTo?: string;
  managerResponse?: string;
  replies: ComplaintReply[];
  createdAt: string;
}

// Manager view: filter complaints where courseCode in manager's courses
// Hide studentName from manager view
```

---

## Scope / Not in Scope
| In scope | Out of scope |
|---|---|
| "Student Conduct" category in submit form | DB write for complaints |
| Manager "About My Courses" tab (mock) | Complainant anonymization in DB |
| Manager response submission (toast) | Email notification to student |
| Admin full management view | Escalation workflow |
| Complaint detail sheet with replies | Internal chat / notifications |
| Priority + status management (local) | SLA enforcement / auto-escalation |
