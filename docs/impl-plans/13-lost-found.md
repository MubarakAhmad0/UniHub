# Implementation Plan — 13 · Lost & Found

**Route:** `/dashboard/campus/lost-found`  
**Pattern:** A (admin-only additions; manager = same as student)  
**Current file:** `app/dashboard/campus/lost-found/page.tsx` (15,947 bytes)

---

## What Changes

### Manager View
No change from student. Manager uses Lost & Found identically to students.  
No new components needed for the manager role.

### Admin View (conditional additions)
- **"Manage" tab** added alongside Browse / My Reports
- Manage tab: full table of all items/reports with filters
- Claim verification controls per item
- Archive overdue items button
- Retention policy config

---

## Files to Modify / Create

### [MODIFY] `app/dashboard/campus/lost-found/page.tsx`
```tsx
const isAdmin = hasRole("admin");

// Tab additions
{isAdmin && (
  <TabsTrigger value="manage">
    Manage <Badge className="ml-1">{pendingClaims.length}</Badge>
  </TabsTrigger>
)}
{isAdmin && (
  <TabsContent value="manage">
    <LostFoundManagePanel />
  </TabsContent>
)}
```

### [NEW] `_components/lost-found-manage-panel.tsx`
Admin-only. Layout:

**Filter bar:**
```tsx
<div className="flex gap-3 flex-wrap">
  <Select> {/* Status: All/Active/Claimed/Returned/Archived */} </Select>
  <Select> {/* Category: All/Electronics/Clothing/Documents/... */} </Select>
  <Input placeholder="Search …" />
  <Button variant="outline" size="sm" onClick={archiveOverdue}>Archive Overdue</Button>
</div>
```

**Items table:**
```
Columns: Item | Category | Location Found | Date | Reporter | Status | Claims | Actions
Actions per row: View Claims | Mark Returned | Archive | Delete
```

**Claim review panel (Sheet, per item):**
```
"Claims for: [Item Name]"
List of submitted claims (each):
  Claimant name | Submitted date | Description of proof
  [Verify ✓] [Reject]
```
Verify → sets item status to "Returned", `toast("Item marked as returned")`.  
Reject → opens small dialog for reason.

**Admin "Add Found Item" button:**
```
For staff/security to log items directly:
Form: Item name, Category, Description, Location found, Date found, Photo (optional)
```

**Retention Policy card** (bottom of manage tab):
```
"Auto-archive items unclaimed after [30] days"
Slider or number input
Save Policy
```

---

## Mock Data Changes
```ts
type ItemStatus = "active" | "claimed" | "returned" | "archived";

type Claim = {
  id: string;
  claimantName: string;
  claimantId: string;
  submittedDate: string;
  description: string; // proof description
  status: "pending" | "verified" | "rejected";
}

type LostFoundItem = {
  // ... existing
  status: ItemStatus;
  claims: Claim[];
  reportedBy: string;
  daysOld: number; // derived from date
}

const pendingClaims: LostFoundItem[] = lostFoundItems.filter(
  i => i.status === "claimed" && i.claims.some(c => c.status === "pending")
);
```

---

## Scope / Not in Scope
| In scope | Out of scope |
|---|---|
| Admin manage tab with table | DB write for status changes |
| Claim review sheet (verify/reject) | Notification to claimant |
| Archive overdue button (local) | Automated scheduled archiving |
| Retention policy setting (local) | Integration with security staff |
| Admin add found item form | Photo upload / image storage |
