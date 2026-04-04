# Implementation Plan — 10 · Campus Map

**Route:** `/dashboard/campus/map`  
**Pattern:** A (conditional UI — same page, admin edit-mode controls added)  
**Current file:** `app/dashboard/campus/map/page.tsx` (18,891 bytes)

---

## What Changes

### Student View (unchanged)
- Interactive map, building markers, search, layer toggles

### Manager View (additive)
- **"My Office" marker** highlighted in a distinct colour on map load
- **"Today's Rooms" panel** — collapsible card listing today's teaching rooms with "Locate →" button

### Admin View (conditional additions)
- **"Edit Map" toggle button** in page header
- Edit mode: add markers, edit existing, delete markers, set maintenance status
- Marker edit panel (right-side drawer)

---

## Files to Create / Modify

### [MODIFY] `app/dashboard/campus/map/page.tsx`
```tsx
const { hasRole } = useAuth();
const isAdmin   = hasRole("admin");
const isManager = hasRole("manager");

// Manager additions: inject TodaysRoomsPanel + highlight myOfficeMarkerId
// Admin additions: inject EditMapToggle + MarkerEditPanel when editMode
```

### [NEW] `_components/todays-rooms-panel.tsx`
Manager-only. Collapsible card on the left side of the map (or as an overlay panel):
```tsx
<Card className="absolute top-4 left-4 w-60 z-10 shadow-md">
  <CardHeader className="pb-2 pt-3 px-4">
    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Today's Teaching</p>
  </CardHeader>
  <CardContent className="px-4 pb-3 space-y-2">
    {todaysRooms.map(r => (
      <div key={r.room} className="flex items-center justify-between text-xs">
        <div>
          <p className="font-medium">{r.courseCode}</p>
          <p className="text-muted-foreground">{r.room} · {r.time}</p>
        </div>
        <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => locateRoom(r.markerId)}>
          Locate →
        </Button>
      </div>
    ))}
    {todaysRooms.length === 0 && (
      <p className="text-xs text-muted-foreground">No classes today.</p>
    )}
  </CardContent>
</Card>
```
`locateRoom(id)` → pan/zoom the map to that building marker + briefly highlight it (pulse animation).

### [MODIFY] Existing map marker rendering
When `isManager` is true:
- Find the marker matching the manager's office building
- Render it with a distinct pin colour/style: `className="fill-amber-500"` or a different marker icon
- Add a label "My Office" below the pin

### [NEW] `_components/edit-map-toggle.tsx`
Admin-only control in page header:
```tsx
<div className="flex items-center gap-2">
  <span className="text-xs text-muted-foreground">Edit Map</span>
  <Switch checked={editMode} onCheckedChange={setEditMode} id="edit-map-toggle" />
</div>
```
When `editMode` is true:
- All markers get an edit icon (✏) on hover
- An "Add Marker" floating button appears on the map canvas
- Clicking empty map area → opens `MarkerFormSheet` in create mode
- Clicking existing marker → opens `MarkerFormSheet` in edit mode

### [NEW] `_components/marker-form-sheet.tsx`
Admin-only right-side Sheet (slides in from the right):
```
Mode: "Add Marker" | "Edit Marker: [Name]"

Fields:
  Name:            text input (e.g., "Block A — Computing")
  Type:            Select — Academic Building | Admin Office | Library | Sports | Dining | Parking | Services
  Description:     Textarea
  Floors:          number input
  Under Maintenance: Switch toggle
  Coordinates:     (read-only, set by clicking the map — pre-filled on edit)

[If editing]
  "Delete Marker" button (destructive, with ConfirmDialog)

Footer: Cancel | Save
```
Save → updates `markers` local state + `toast("Marker updated")`.

When "Under Maintenance" is enabled: the marker renders with a ⚠ badge overlay visible to all users.

---

## Mock Data Changes

```ts
// Add to existing map markers
const markers = [
  // ... existing
  { id: "m-office", name: "Block B — Room 203 (Office)", type: "Academic Building", isManagerOffice: true, underMaintenance: false },
]

// Manager: today's teaching rooms (from timetable mock)
const todaysRooms = [
  { courseCode: "MTH 301", room: "Block A, LT1",     time: "10:00–12:00", markerId: "m-block-a" },
  { courseCode: "CS 105",  room: "Lab 4, CS Block",  time: "No class today", markerId: null },
]

// Manager profile mock
const managerProfile = {
  officeBuilding: "Block B",
  officeRoom: "Room 203",
  officeMarkerId: "m-office",
}
```

---

## Scope / Not in Scope
| In scope | Out of scope |
|---|---|
| Manager "My Office" marker highlight | Real office location from profile DB |
| Today's rooms panel (manager) | Wayfinding / route drawing |
| Admin edit mode toggle + marker CRUD | Map tile/layer management |
| Marker form (local state) | Floor plan image upload |
| Maintenance badge on markers | Real GPS location integration |
| Locate → pan/zoom to building | Multi-campus support |
