# Implementation Plan — 11 · Library Booking

**Route:** `/dashboard/campus/library`  
**Pattern:** A (conditional UI — same page, role-gated additions)  
**Current file:** `app/dashboard/campus/library/page.tsx` (13,727 bytes)

---

## What Changes

### Manager View (additive)
- Booking form gains **"Book for Class"** toggle + Course dropdown
- Extended max duration allowed (local logic)
- **"Request Acquisition"** button in page header → form Sheet

### Admin View (conditional additions)
- **"Manage" tab** added alongside Browse / My Bookings
- Sub-tabs: Rooms, Resources, Acquisitions, Policies
- Cancel any booking
- Add/edit/remove rooms and resources

---

## Files to Create / Modify

### [MODIFY] `app/dashboard/campus/library/page.tsx`
```tsx
const isAdmin   = hasRole("admin");
const isManager = hasRole("manager");

// Header additions
{isManager && (
  <Button variant="outline" size="sm" onClick={() => setAcquisitionOpen(true)}>
    Request Acquisition
  </Button>
)}

// Tabs additions
{isAdmin && <TabsTrigger value="manage">Manage</TabsTrigger>}
{isAdmin && (
  <TabsContent value="manage"><LibraryManagePanel /></TabsContent>
)}
```

### [MODIFY] Existing booking form (extract if not already a component)
Add conditional fields for manager role:
```tsx
{isManager && (
  <>
    <div className="flex items-center gap-2">
      <Switch id="class-booking" checked={isClassBooking} onCheckedChange={setIsClassBooking} />
      <label htmlFor="class-booking" className="text-sm">Book for a class</label>
    </div>
    {isClassBooking && (
      <Select onValueChange={setLinkedCourse}>
        <SelectTrigger><SelectValue placeholder="Select course…" /></SelectTrigger>
        <SelectContent>
          {myTeachingCourses.map(c => <SelectItem key={c.id} value={c.id}>{c.code}</SelectItem>)}
        </SelectContent>
      </Select>
    )}
  </>
)}
```
Booking type badge on confirmed bookings: "Personal" vs "Class (MTH 301)".

### [NEW] `_components/acquisition-request-sheet.tsx`
Manager-only Sheet:
```
"Request Resource Acquisition"
Title:         text input
Author/Source: text input
Type:          Select — Book | Journal | Equipment | Software
ISBN / URL:    text input (optional)
Justification: Textarea (required)
Cancel | Submit Request
```
On submit: `toast("Acquisition request submitted to library admin")`.

### [NEW] `_components/library-manage-panel.tsx`
Admin-only. Multi-sub-tab panel:

**Rooms sub-tab:**
```
"Add Room" button
Table: Room Name | Floor | Capacity | Equipment | Status | Actions (Edit/Delete)
Edit form (inline Sheet): name, floor, capacity, equipment tags, status (Available/Maintenance)
```

**Resources sub-tab:**
```
"Add Resource" button
Table: Title | Type | Quantity | Condition | Actions
```

**Acquisitions sub-tab:**
```
List of pending acquisition requests
Each request card:
  Title | Type | Requested by | Justification
  [Approve] [Reject with reason]
```

**Policies sub-tab:**
```
Form:
  Student max booking duration: number input (hours, default 2)
  Manager max booking duration: number input (hours, default 8)
  Max concurrent bookings per student: number
  Blackout dates: date range picker (add/remove list)
Save Policy button
```

---

## Mock Data Changes
```ts
// Add to existing booking mock
type BookingType = "personal" | "class";
type Booking = {
  // ... existing fields
  type: BookingType;
  linkedCourse?: string;
}

// Acquisition requests
const acquisitionRequests = [
  { id: "aq1", title: "Introduction to Algorithms (4th Ed.)", type: "Book", requestedBy: "Prof. Rossi", justification: "Replace outdated 3rd edition for CS 105" },
]

// Rooms
const libraryRooms = [
  { id: "lr1", name: "Study Room A", floor: 1, capacity: 6,  equipment: ["Whiteboard", "TV Screen"], status: "available" },
  { id: "lr2", name: "Computer Lab",  floor: 2, capacity: 20, equipment: ["PCs x20", "Projector"],   status: "available" },
]
```

---

## Scope / Not in Scope
| In scope | Out of scope |
|---|---|
| Class booking toggle + course selector | Real priority booking enforcement |
| Booking type badge | DB write for bookings |
| Acquisition request form (mock) | Library staff workflow integration |
| Manage tab: Rooms CRUD (mock) | Real-time room availability calendar |
| Manage tab: Acquisitions queue (mock) | Purchase order generation |
| Manage tab: Policies form (local state) | Policy enforcement in booking flow |
