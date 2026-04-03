# 17 · Documents

**Route:** `/dashboard/services/documents`

Students request and download official university documents such as transcripts, enrolment letters, and certificates.

---

## Student (current build)

| Feature | Status |
|---|---|
| Browse available document types | ✅ |
| Request a document (type, purpose, delivery method) | ✅ |
| Track request status (Pending / Processing / Ready / Collected) | ✅ |
| Download digital documents when ready | ✅ |
| View own request history | ✅ |
| Cancel a pending request | ✅ |
| Upload documents | 🚫 |
| Approve requests | 🚫 |

---

## Lecturer

Lecturers can request certain staff documents (employment verification, pay stubs) and can generate course-related documents for their classes.

| Feature | Status | Notes |
|---|---|---|
| Request staff documents (employment letter, payslips) | 🆕 | Separate set of document types relevant to staff/HR |
| View own request history | ✅ | |
| **Generate course documents** | 🆕 | Create and download: class list, grade sheet template, course outline PDF |
| **Download student enrollment verification** | 🆕 | For students in their class, generate an enrollment confirmation letter (for visa, scholarship purposes); requires student's consent flag |
| Student general document requests | 🚫 | Separate workflow |
| Approve document requests | 🚫 | Admin/Registry only |

### UI changes needed
- **"Staff Documents" tab** alongside "My Requests" (shown only for lecturers).
- **"Course Documents" section:** per-course dropdowns to generate class list, grade sheet, course outline.
- **Download button** generates a PDF on the fly with the course and date information pre-filled.

---

## Admin

Full document lifecycle management: template management, request approval/processing, and bulk generation.

| Feature | Status | Notes |
|---|---|---|
| All student features | ✅ | |
| **View all pending document requests** | 🆕 | Queue with filters: document type, status, urgency |
| **Approve and process a request** | 🆕 | Change status to Processing / Ready |
| **Reject a request** | 🆕 | With reason sent to student |
| **Upload completed document** | 🆕 | Attach the finalized PDF to a request; student can then download it |
| **Generate document from template** | 🆕 | Fill a template (e.g., transcript) using student data and generate PDF |
| **Manage document templates** | 🆕 | Upload and configure document templates (letterhead, layout) |
| **Add / edit document types** | 🆕 | Define available document types with processing time and fees |
| **Bulk generate documents** | 🆕 | E.g., generate transcripts for all graduating students at once |
| **Mark as collected** | 🆕 | For physical documents: mark when the student has picked it up |
| **Document request analytics** | 🆕 | Volume by type and month, average processing time |

### UI changes needed
- **"Request Queue" tab** (admin default): table with Student, Document Type, Purpose, Submitted Date, Status, Priority, Actions.
- **Request detail panel:** student info, request reason, history log (status changes with timestamps), action buttons (Approve, Upload, Reject).
- **"Templates" tab:** list of document templates with upload/replace/edit.
- **"Document Types" tab:** configure types, description, fee, expected processing days.
- **Bulk Generation:** course/semester/cohort selector → generate type → preview list → confirm download.
