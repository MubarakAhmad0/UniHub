# Implementation Plan — 14 · Clubs

**Route:** `/dashboard/community/clubs`  
**Pattern:** A (conditional UI — same page, role-gated tabs and controls)  
**Current file:** `app/dashboard/community/clubs/page.tsx` (18,591 bytes)

---

## What Changes

### Manager View (additive)
- **"My Advisory Clubs" tab** alongside All Clubs / My Clubs
- Advisory club cards: member count + pending endorsements badge
- Club detail (advisory mode): extra tabs — Roster, Activities, Pending Endorsements
- Endorse Activity button on activity rows
- "Step Down as Advisor" option in three-dot menu

### Admin View (conditional additions)
- **"Manage Clubs" tab** with data table
- **Approve/Reject queue** for new club applications
- **"Create Club" button** in header
- Budget panel per club
- Assign/change advisor

---

## Files to Create / Modify

### [MODIFY] `app/dashboard/community/clubs/page.tsx`
```tsx
const isAdmin   = hasRole("admin");
const isManager = hasRole("manager");

// Header additions
{isAdmin && (
  <Button onClick={() => setCreateClubOpen(true)}>Create Club</Button>
)}

// Tabs
<TabsTrigger value="all">All Clubs</TabsTrigger>
<TabsTrigger value="my">My Clubs</TabsTrigger>
{isManager && <TabsTrigger value="advisory">My Advisory Clubs</TabsTrigger>}
{isAdmin && (
  <TabsTrigger value="manage">
    Manage {pendingApplications > 0 && <Badge variant="destructive" className="ml-1">{pendingApplications}</Badge>}
  </TabsTrigger>
)}
```

### [NEW] `_components/advisory-clubs-tab.tsx`
Manager-only tab content. List of clubs where the manager is the assigned advisor:

Club card (advisory variant):
```tsx
<Card>
  <CardHeader>
    <div className="flex justify-between">
      <div>
        <Badge className="bg-amber-100 text-amber-700 text-[10px] mb-1">Advisor</Badge>
        <h3>{club.name}</h3>
      </div>
      {club.pendingEndorsements > 0 && (
        <Badge variant="destructive">{club.pendingEndorsements} pending</Badge>
      )}
    </div>
    <p className="text-xs text-muted-foreground">{club.memberCount} members · {club.category}</p>
  </CardHeader>
  <CardFooter>
    <Button size="sm" onClick={() => openAdvisoryDetail(club)}>Manage →</Button>
  </CardFooter>
</Card>
```

#### `advisory-club-detail-sheet.tsx`
Right-side Sheet with tabs:
```
Tabs: Roster | Activities | Pending Endorsements

Roster tab:
  Table: Member Name | Student ID | Role (President/Member) | Joined date

Activities tab:
  List of club activities (past + upcoming)
  Each activity: name, date, description, endorsement status
  If status = "pending" → [Endorse] button

Pending Endorsements tab:
  Filtered view of activities needing endorsement
  Large Endorse / Decline per item
  Endorse → toast("Activity endorsed") + status update

Three-dot menu on Sheet header:
  "Step Down as Advisor" → ConfirmDialog → toast("Admin has been notified") 
```

### [NEW] `_components/clubs-manage-panel.tsx`
Admin-only tab/panel:

**Layout:**
```
Sub-tabs: [All Clubs] [Pending Applications] [Dissolved]

All Clubs sub-tab:
  Table: Name | Category | Members | Status | Advisor | Budget Total | Actions
  Actions: Edit | Assign Advisor | Set Budget | Dissolve

Pending Applications sub-tab:
  Cards: Club name | Proposed by | Founding members | Proposed advisor
  [Approve] [Reject with reason]

Dissolved sub-tab:
  Read-only list of archived clubs
```

**"Assign Advisor" dialog:**
```
"Assign Faculty Advisor to [Club Name]"
Current advisor: [if any]
New advisor: Select from managers (searchable)
Cancel | Assign
```

**"Set Budget" dialog:**
```
"Budget Allocation — [Club Name]"
Allocated: number input (RM)
Spent so far: [read-only from mock data]
Save
```

### [NEW] `_components/create-club-form-sheet.tsx`
Admin-only Sheet:
```
"Create Club"
Name:             text input
Category:         Select (Academic/Sports/Cultural/Tech/Social/Community)
Description:      Textarea
Faculty Advisor:  Select (managers) — required
Founding Members: multi-input (name + student ID rows, "Add" button)
Cancel | Create Club
```
On create: adds to club list with status "Active", `toast("Club created")`.

---

## Club Creation by Students
Students can request a new club from the "All Clubs" tab:
```tsx
<Button variant="outline" size="sm">Apply to Start a Club</Button>
```
Opens a form similar to `CreateClubFormSheet` but labelled "Club Application":
- Same fields but `Faculty Advisor` is a suggested name (text input, not a selector)
- Submitted → status "pending_approval" → shown in admin's Pending Applications queue
- `toast("Application submitted — admin will review it")`

---

## Mock Data Changes
```ts
type ClubStatus = "active" | "pending_approval" | "dissolved";

type Club = {
  // ... existing
  status: ClubStatus;
  advisor: string | null;          // manager's name
  budget: { allocated: number; spent: number };
  pendingEndorsements: number;     // count for advisor badge
  memberCount: number;
}

const advisoryClubs: Club[] = clubs.filter(c => c.advisor === currentManagerName);

const pendingApplications: Club[] = clubs.filter(c => c.status === "pending_approval");
```

---

## Scope / Not in Scope
| In scope | Out of scope |
|---|---|
| Manager advisory tab + club detail | Real advisor assignment DB write |
| Endorse activity (local) | Club budget spending tracker |
| Step down as advisor (UI, toast) | Email notification to admin |
| Admin manage panel (all clubs table) | Club event integration |
| Pending applications queue (approve/reject) | Financial reporting |
| Create club form (admin, mock) | Club member chat / communication |
| Student "Apply to Start a Club" flow | |
