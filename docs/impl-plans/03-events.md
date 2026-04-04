# Implementation Plan — 03 · Campus Events

**Route:** `/dashboard/campus/events`  
**Pattern:** A (conditional UI — same page, role-gated elements added)  
**Current file:** `app/dashboard/campus/events/page.tsx` (520 lines, client component)

---

## What Changes

### For Manager
- **"New Event" button** in page header (replaces stub "Submit Event")
- Full event creation Sheet with all fields
- "My Events" tab gains a **sub-toggle: RSVPd / Organised**
- Manager's own event cards show **Edit ✏ / Cancel ❌ controls**
- Clicking "N going" on own event → **Attendee List Sheet**
- **Can toggle "Feature" on their own events**

### For Admin
- All manager capabilities + across all events
- **"Manage Events" tab** alongside All Events / My Events
- Manage tab: data table with bulk actions
- **Feature toggle** via three-dot menu on any event card
- Pending approval badge on "Manage Events" tab label when student submissions exist

### Students
- "Submit Event" button now actually opens a **submission form** (resulting in pending approval state)

---

## Files to Create / Modify

### [MODIFY] `app/dashboard/campus/events/page.tsx`
```tsx
const { hasRole } = useAuth();
const isAdmin   = hasRole("admin");
const isManager = hasRole("manager");
const canCreate = isAdmin || isManager;  // create directly
const canSubmit = !isAdmin && !isManager; // student submits for approval

// Header
{canCreate && <Button onClick={() => setCreateOpen(true)}>New Event</Button>}
{canSubmit  && <Button variant="outline" onClick={() => setSubmitOpen(true)}>Submit Event</Button>}

// Tabs
<TabsTrigger value="my">My Events</TabsTrigger>
{isAdmin && <TabsTrigger value="manage">Manage Events {pendingCount > 0 && <Badge>{pendingCount}</Badge>}</TabsTrigger>}

// My Events tab: for manager show RSVPd / Organised toggle
```

### [NEW] `app/dashboard/campus/events/_components/event-form-sheet.tsx`
Handles both create (manager/admin) and submit (student) flows. Props:
```ts
type EventFormSheetProps = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "submit";  
  // "create"  = immediate publish; 
  // "submit"  = creates pending approval;
  // "edit"    = updates existing
  existingEvent?: Event;
  role: "admin" | "manager" | "student";
}
```
Fields:
- `Title` — text input
- `Category` — Select (admin: all; manager: Academic/Cultural/Club; student: same as manager)
- `Date & Time` — date + time pickers
- `Venue` — text input
- `Description` — Textarea
- `Capacity` — number input (optional)
- `Feature Event` — Switch (admin + manager only)

### [NEW] `app/dashboard/campus/events/_components/event-card.tsx`
Extracted from inline JSX. New props:
```ts
type EventCardProps = {
  event: Event;
  variant: "featured" | "grid" | "list";
  onRsvp: (id: string, val: RsvpStatus) => void;
  onOpenDetail: (event: Event) => void;
  // Owner controls
  isOwner?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
  onToggleFeature?: () => void;  // admin/manager
  // Admin controls
  canAdmin?: boolean;
}
```
Owner/admin controls: three-dot menu (⋮) in card top-right, visible conditionally.

### [NEW] `app/dashboard/campus/events/_components/attendee-list-sheet.tsx`
Sheet showing list of RSVPed attendees for a manager's own event:
```ts
Fields displayed: Name, Student ID, RSVP status (Going/Interested), RSVP date
```
Triggered by clicking the "N going" stat on own event cards.

### [NEW] `app/dashboard/campus/events/_components/manage-events-tab.tsx`
Admin-only tab:
- Filter bar: Category, Date range, Status, Organiser
- Data table columns: Title, Category, Organiser, Date, Featured 📌, Status, RSVPs/Cap, Actions
- Actions per row: Edit / Cancel / Feature toggle / Delete
- Sub-section "Pending Submissions" at top when count > 0: cards with Approve / Reject + reason

### [MODIFY] `app/dashboard/campus/events/page.tsx` — My Events tab
For manager role, "My Events" tab content splits into two sub-views:
```tsx
{isManager && (
  <div className="flex gap-2 mb-4">
    <Button variant={myView === "rsvpd" ? "default" : "outline"} onClick={() => setMyView("rsvpd")}>RSVPd</Button>
    <Button variant={myView === "organised" ? "default" : "outline"} onClick={() => setMyView("organised")}>Organised</Button>
  </div>
)}
```

---

## Mock Data Changes
- Add `status: "published" | "cancelled" | "pending"` to `Event` type
- Add `organiserId: string` to identify owner
- Add `isFeatured` (already exists ✅)

---

## Scope / Not in Scope
| In scope | Out of scope |
|---|---|
| Create/Edit/Cancel event (UI + mock state) | Real DB writes |
| Feature toggle (UI + mock state) | Email/push to attendees on cancel |
| Approval queue tab (admin, mock data) | Actual approval workflow with notifications |
| Attendee list sheet (mock data) | Export attendee CSV |
| Student submit → pending status in UI | Admin analytics / charts |
