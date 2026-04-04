# Implementation Plan — 12 · Venue & Facilities

**Route:** `/dashboard/campus/venues`  
**Pattern:** A (conditional UI — same page, role-gated elements added)  
**Current file:** `app/dashboard/campus/venues/page.tsx` (16,462 bytes)

---

## What Changes

### Manager View (additive)
- Booking form gains **"Booking Type"** selector (Personal / Academic)
- "Academic" type reveals **"Linked Course"** dropdown + **"Recurring"** toggle
- Academic bookings show as **auto-confirmed** (no approval queue delay) with a "✓ Confirmed" badge

### Admin View (conditional additions)
- **"Manage Venues" tab** added alongside Browse / My Bookings
- **"Approval Queue"** section in the Manage tab
- Booking calendar view (swimlane per venue)
- Venue add/edit/delete
- "Set Status" per venue

---

## Files to Create / Modify

### [MODIFY] `app/dashboard/campus/venues/page.tsx`
```tsx
const isAdmin   = hasRole("admin");
const isManager = hasRole("manager");

// Tab additions
{isAdmin && <TabsTrigger value="manage">Manage Venues {pendingCount > 0 && <Badge variant="destructive">{pendingCount}</Badge>}</TabsTrigger>}

// Pass booking mode to BookingForm
<BookingForm role={isAdmin ? "admin" : isManager ? "manager" : "student"} />
```

### [MODIFY] Existing booking form component (or extract)
Add conditional fields for manager:
```tsx
{isManager && (
  <div className="space-y-3">
    <div>
      <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">Booking Type</p>
      <div className="flex gap-2">
        <Button variant={bookingType === "personal" ? "default" : "outline"} size="sm" onClick={() => setBookingType("personal")}>Personal</Button>
        <Button variant={bookingType === "academic" ? "default" : "outline"} size="sm" onClick={() => setBookingType("academic")}>Academic</Button>
      </div>
    </div>
    {bookingType === "academic" && (
      <>
        <Select><SelectTrigger><SelectValue placeholder="Linked course…" /></SelectTrigger>
          <SelectContent>{myTeachingCourses.map(c => <SelectItem key={c.id} value={c.id}>{c.code}</SelectItem>)}</SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Switch id="recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
          <label htmlFor="recurring" className="text-sm">Recurring booking</label>
        </div>
        {isRecurring && (
          <div className="flex gap-2">
            <Select><SelectTrigger className="w-32"><SelectValue placeholder="Day" /></SelectTrigger>
              <SelectContent>{["Mon","Tue","Wed","Thu","Fri"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="date" placeholder="End date" className="flex-1" />
          </div>
        )}
      </>
    )}
  </div>
)}
```

On submit for manager (academic type):
```tsx
toast("✓ Booking confirmed (Academic Priority)");
// Local state: status = "confirmed" immediately, no "pending" step
```

### [NEW] `_components/venue-manage-panel.tsx`
Admin-only. Multi-tab panel:

**Approval Queue sub-tab:**
```
Header: "Pending Approvals" with count badge
List of student booking requests, each card:
  Requester name | Venue | Date/Time | Purpose
  [Approve] [Reject — reason dialog]
```

**Venues sub-tab:**
```
"Add Venue" button
Table: Name | Type | Building | Capacity | Status | Actions
Edit form (Sheet):
  name, type, building, floor, capacity, description
  Equipment list (add/remove tags)
  Status: Available | Maintenance | Reserved (with date range)
```

**Calendar sub-tab:**
```
Date picker at top
Swimlane view: rows = venues, columns = time slots
Existing bookings shown as coloured blocks (manager name, course)
Admin can click any block → view details + Cancel option
```

**Policies sub-tab:**
```
Student max advance notice: number input (days)
Student max duration: hours input
Manager max duration: hours input
Blocked dates: date range list
Save Policy
```

### [NEW] `_components/set-status-dialog.tsx`
Admin-only. Triggered from venue three-dot menu:
```
"Set Status for: [Venue Name]"
Status: Radio — Available | Under Maintenance | Reserved (Admin Hold)
[If Maintenance/Reserved]
  From: DatePicker
  To:   DatePicker
  Note: text input (optional)
Cancel | Apply
```

---

## Mock Data Changes
```ts
type BookingStatus = "confirmed" | "pending" | "rejected" | "cancelled";
type BookingType = "personal" | "academic";

type VenueBooking = {
  // ... existing
  type: BookingType;
  linkedCourse?: string;
  isRecurring?: boolean;
  status: BookingStatus;
}

// Pending student requests (admin view)
const pendingApprovals = [
  { id: "p1", requester: "Alex Rivers", venue: "Main Hall", date: "Apr 10", time: "14:00–16:00", purpose: "Club meeting", submitted: "Apr 3" },
]

// Venues with status
type Venue = {
  // ... existing
  status: "available" | "maintenance" | "reserved";
  maintenanceUntil?: string;
}
```

---

## Scope / Not in Scope
| In scope | Out of scope |
|---|---|
| Booking type selector + course/recurring fields | Real priority/auto-confirm enforcement |
| Academic booking auto-confirmed badge | DB write for bookings |
| Approval queue (admin, mock approve/reject) | Email notification to requester |
| Venue CRUD (admin, local state) | Equipment inventory tracking |
| Calendar swimlane view (mock blocks) | Conflict detection with DB |
| Set Status dialog per venue | Venue analytics / utilization charts |
