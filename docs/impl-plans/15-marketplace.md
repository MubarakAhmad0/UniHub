# Implementation Plan — 15 · Marketplace

**Route:** `/dashboard/community/marketplace`  
**Pattern:** A (admin-only additions; manager = same as student)  
**Current file:** `app/dashboard/community/marketplace/page.tsx` (19,702 bytes)

---

## What Changes

### Manager View
Same experience as students. Marketplace is open to all university members.  
No UI changes needed for the manager role specifically.

### All Users (student + manager) — Flag button
A **"Report Listing" 🚩** option added to each listing's three-dot menu.  
Currently the flag is wired to a local toast only.

### Admin View (conditional additions)
- **"Moderation" tab** added in page
- Sub-tabs: Reported Listings / Banned Users
- Listing detail view gets an "Admin Actions" section
- Manage categories

---

## Files to Create / Modify

### [MODIFY] `app/dashboard/community/marketplace/page.tsx`
```tsx
const isAdmin = hasRole("admin");

// Tab additions
{isAdmin && <TabsTrigger value="moderation">Moderation {reportedCount > 0 && <Badge variant="destructive">{reportedCount}</Badge>}</TabsTrigger>}
{isAdmin && (
  <TabsContent value="moderation">
    <MarketplaceModerationPanel />
  </TabsContent>
)}
```

### [MODIFY] Existing listing card (extract if needed)
Add "Report Listing" to three-dot menu for all users:
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    {isOwnListing && <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>}
    {isOwnListing && <DropdownMenuItem onClick={onMarkSold}>Mark as Sold</DropdownMenuItem>}
    {isOwnListing && <DropdownMenuItem className="text-destructive" onClick={onDelete}>Delete</DropdownMenuItem>}
    {!isOwnListing && (
      <DropdownMenuItem onClick={() => setReportOpen(true)} className="text-destructive">
        🚩 Report Listing
      </DropdownMenuItem>
    )}
  </DropdownMenuContent>
</DropdownMenu>
```

#### `report-listing-dialog.tsx`
```
"Report Listing"
Reason: Select — Prohibited item / Misleading description / Spam / Suspicious price / Other
Details (optional): Textarea
Cancel | Submit Report
```
On submit: `toast("Listing reported. Admin will review it.")` + local state marks listing as "reported by me".

### [NEW] `_components/marketplace-moderation-panel.tsx`
Admin-only. Multi-sub-tab:

**Reported Listings sub-tab:**
```
Filter: status (All/Pending/Actioned)
Table: Listing Title | Reporter | Reason | Date | Status | Actions
Actions: Review → opens detail sheet; Dismiss (no action); Remove listing

"Review" opens a Sheet:
  Listing detail (photo, description, price, seller)
  Report reason + reporter name visible to admin
  Admin Actions section:
    [Remove Listing] (with reason sent to seller)
    [Dismiss Report]
    [Warn Seller]
```

**Banned Users sub-tab:**
```
Table: User | Reason | Banned on | Duration (Temp/Permanent) | Expires | Unban
"Ban a User" button:
  User search | Reason | Duration: Temporary (days input) / Permanent
```

**Categories sub-tab:**
```
List of marketplace categories (each row: name, listing count)
[+ Add Category] | [Rename] | [Delete] (only if 0 listings)
```

---

## Mock Data Changes
```ts
type ListingStatus = "active" | "sold" | "removed" | "reported";

type Report = {
  id: string;
  listingId: string;
  reporterId: string;
  reason: string;
  details?: string;
  submittedAt: string;
  status: "pending" | "dismissed" | "actioned";
}

type BannedUser = {
  userId: string;
  name: string;
  reason: string;
  bannedAt: string;
  duration: "temporary" | "permanent";
  expiresAt?: string;
}

// Mock reported listings
const reports: Report[] = [
  { id: "r1", listingId: "l3", reporterId: "s002", reason: "Prohibited item", details: "Selling vape products", submittedAt: "Apr 3", status: "pending" },
]
```

---

## Scope / Not in Scope
| In scope | Out of scope |
|---|---|
| "Report Listing" option for all users | DB write for reports |
| Report dialog with reason | Email notification to admin |
| Admin moderation tab | Automated content scanning |
| Reported listings review (mock) | Seller appeal workflow |
| Ban user dialog (UI, local) | Auth-level account suspension |
| Category management (CRUD, local) | Category migration for existing listings |
