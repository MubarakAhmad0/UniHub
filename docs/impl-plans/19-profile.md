# Implementation Plan — 19 · Profile

**Route:** `/dashboard/profile`  
**Pattern:** A (conditional field sections per role; admin gets user management additions)  
**Current file:** `app/dashboard/profile/page.tsx` (1,243 bytes — likely delegates to _components)

---

## What Changes

### Student View (mostly unchanged)
- Add **endorsement status** reference (links to Study Plan — not a new section here)
- No structural changes needed

### Manager View (additive fields)
- Replace the "Enrolment Info" section with **"Staff Info"** (Staff ID, Faculty, Department, Designation — all read-only)
- Add **"Office"** section: Office Location + Office Hours builder
- Add **"Bio & Research"** section: Bio text + Research interests tags + Public visibility toggle

### Admin View (search + user management)
- **User search bar** at top of profile page (admin-only)
- If viewing another user's profile: full edit mode + role change + activate/deactivate

---

## Files to Create / Modify

### [MODIFY] `app/dashboard/profile/page.tsx` or the main profile component
```tsx
const isAdmin   = hasRole("admin");
const isManager = hasRole("manager");
const isStudent = hasRole("student");

// Admin addition at top
{isAdmin && <UserSearchBar onSelectUser={setViewingUser} />}

// Conditionally render enrolment vs staff info section
{isStudent && <EnrolmentInfoSection />}
{isManager && <StaffInfoSection />}

// Manager-only sections
{isManager && <OfficeSectionCard />}
{isManager && <BioResearchCard />}

// Admin additions (when viewing self or another user)
{isAdmin && viewingUser && <AdminUserControls user={viewingUser} />}
```

### [NEW] `_components/staff-info-section.tsx`
Replaces the student's "Enrolment Info" card for the manager role:
```tsx
<Card>
  <CardHeader>
    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Staff Information</p>
  </CardHeader>
  <CardContent className="grid grid-cols-2 gap-4 text-sm">
    <div>
      <p className="text-xs text-muted-foreground">Staff ID</p>
      <p className="font-medium">STF-20240023</p>
    </div>
    <div>
      <p className="text-xs text-muted-foreground">Faculty</p>
      <p className="font-medium">Faculty of Computing</p>
    </div>
    <div>
      <p className="text-xs text-muted-foreground">Department</p>
      <p className="font-medium">Dept. of Computer Science</p>
    </div>
    <div>
      <p className="text-xs text-muted-foreground">Designation</p>
      <p className="font-medium">Associate Professor</p>
    </div>
  </CardContent>
</Card>
```
All read-only. Set by admin only.

### [NEW] `_components/office-section-card.tsx`
Manager-only editable card:
```
Office Location:
  Building: text input (e.g., "Block B")
  Room:     text input (e.g., "Room 203")
  [Save Location]

Office Hours:
  List of recurring slots (initially empty):
    Each slot: Day (Select) | Start (time) | End (time) | [Remove]
  [+ Add Time Slot] button
  [Save Office Hours]
```
Save → `toast("Office hours updated")` + local state update.  
These hours feed into the Timetable (manager view) and Map (office marker).

### [NEW] `_components/bio-research-card.tsx`
Manager-only editable card:
```
Public Visibility toggle:
  Switch + label "Show bio and office hours to all students"
  [If off]: greyed-out info text "Your public profile will be hidden"

Bio:
  Textarea (max 500 chars, char counter)
  "Save Bio" button

Research Interests:
  Tag input (type + Enter to add, × to remove)
  Suggested tags as clickable chips: AI, Machine Learning, Data Science, Architecture, ...
  "Save Interests" button
```

### [NEW] `_components/user-search-bar.tsx`
Admin-only. Appears at the very top of the profile page:
```tsx
<div className="mb-6 p-4 bg-muted/40 rounded-lg">
  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Admin — View User Profile</p>
  <div className="flex gap-2">
    <Input placeholder="Search by name or student/staff ID…" className="max-w-sm" value={searchQuery} onChange={...} />
    <Button onClick={handleSearch}>View Profile</Button>
    {viewingUser && (
      <Button variant="ghost" onClick={() => setViewingUser(null)}>Back to My Profile</Button>
    )}
  </div>
  {viewingUser && (
    <p className="text-xs text-muted-foreground mt-1">
      Viewing: <strong>{viewingUser.name}</strong> ({viewingUser.role})
    </p>
  )}
</div>
```

### [NEW] `_components/admin-user-controls.tsx`
Admin-only panel shown when viewing another user's profile (or always in admin's own profile):
```
Card: "Admin Controls"
  Role:   Select — student | manager | admin
          [Change Role] button → ConfirmDialog
  Status: Badge (Active/Inactive) + [Deactivate] / [Activate] button → ConfirmDialog
  [Reset Password] button → Dialog: "A password reset link will be sent to [email]" → Confirm
  [Verify Account] toggle — marks user as Verified ✓
```

---

## Mock Data (Manager profile)
```ts
const managerProfile = {
  staffId: "STF-20240023",
  faculty: "Faculty of Computing",
  department: "Dept. of Computer Science",
  designation: "Associate Professor",
  officeBuilding: "Block B",
  officeRoom: "Room 203",
  officeHours: [
    { day: "Monday",    start: "14:00", end: "16:00" },
    { day: "Thursday",  start: "10:00", end: "12:00" },
  ],
  bio: "Dr. Rossi specialises in distributed systems and advanced calculus pedagogy...",
  researchInterests: ["Distributed Systems", "Algorithms", "Mathematics Education"],
  publicVisible: true,
}
```

---

## Scope / Not in Scope
| In scope | Out of scope |
|---|---|
| Staff Info section (read-only) | DB write for staff metadata |
| Office section editable (local) | Profile info syncing with Map/Timetable |
| Office hours builder (local) | Public lecturer profile page (separate route) |
| Bio + research interests (local) | Photo upload |
| Admin user search + profile view | Audit log of profile changes |
| Admin role change / activate controls | Auth-level role enforcement on change |
| Reset password button (UI, toast) | Actual password reset email |
