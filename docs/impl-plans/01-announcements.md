# Implementation Plan — 01 · Announcements

**Route:** `/dashboard/academic/announcements`  
**Pattern:** A (conditional UI — same page, role-gated elements added)  
**Current file:** `app/dashboard/academic/announcements/page.tsx` (223 lines, client component)

---

## What Changes

### For Manager (Lecturer/Staff)
- Add **"New Announcement" button** in page header
- Add **Post form (Sheet)** with fields: Title, Type (faculty/event only), Course (their assigned courses), Priority toggle, Body
- Announcement cards authored by the current user show **Edit ✏ / Delete 🗑 icon buttons**
- Each card shows an **author byline** ("Posted by Prof. X")

### For Admin
- "New Announcement" button (all types unlocked)
- Post form adds: **Audience selector**, **Schedule date/time picker**, **Pin toggle**
- **"Manage" tab** added alongside All/System/Faculty/Event tabs
- Manage tab: full data table of all announcements with actions
- Pinned announcements render at top of each tab with a distinct style

---

## Files to Create / Modify

### [MODIFY] `app/dashboard/academic/announcements/page.tsx`
- Convert from standalone component to a role-switching shell
- Import and render `StudentView` by default; inject manager/admin elements conditionally
- Pass `userRole` down (derived from `useAuth()`)

### [NEW] `app/dashboard/academic/announcements/_components/announcement-card.tsx`
Shared card used by all roles. New props:
```ts
type AnnouncementCardProps = {
  item: Announcement;
  isRead: boolean;
  onToggleRead: (id: number) => void;
  isOwner?: boolean;       // manager — show edit/delete icons
  isPinned?: boolean;      // admin — show pin icon
  onEdit?: () => void;
  onDelete?: () => void;
  onPin?: () => void;
}
```

### [NEW] `app/dashboard/academic/announcements/_components/post-announcement-sheet.tsx`
Sheet form for creating/editing an announcement. Props control which fields are visible:
```ts
type PostAnnouncementSheetProps = {
  open: boolean;
  onClose: () => void;
  role: "manager" | "admin";
  // manager: typeOptions = ["faculty","event"], courseSelector shown
  // admin:   typeOptions = all, audienceSelector + schedulePickr + pinToggle shown
}
```
Fields:
- `Title` — text input
- `Type` — Select (`faculty`/`event` for manager; all for admin)
- `Course` — Select (manager only; their assigned courses)
- `Audience` — Select (admin only: University-wide / Faculty / Course / Year)
- `Priority` — Switch toggle
- `Publish At` — DateTimePicker (admin only; leave empty = immediate)
- `Pin` — Switch (admin only)
- `Body` — Textarea

### [NEW] `app/dashboard/academic/announcements/_components/manage-tab.tsx`
Admin-only tab. Data table with columns:
- Title, Type, Author, Audience, Status (Published/Scheduled/Archived), Priority, Pinned, Created, Actions
- Actions: Edit / Delete / Archive / Pin / Unpin

---

## Role-Gating Logic in `page.tsx`

```tsx
"use client";
import { useAuth } from "@/lib/auth/use-auth";

export default function AnnouncementsPage() {
  const { hasRole } = useAuth();
  const isAdmin   = hasRole("admin");
  const isManager = hasRole("manager");
  const canPost   = isAdmin || isManager;

  return (
    <div>
      <header>
        {/* breadcrumb ... */}
        {canPost && (
          <Button onClick={() => setPostOpen(true)}>New Announcement</Button>
        )}
      </header>

      <Tabs value={activeTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
          <TabsTrigger value="event">Events</TabsTrigger>
          {isAdmin && <TabsTrigger value="manage">Manage</TabsTrigger>}
        </TabsList>

        {/* existing tab content with updated AnnouncementCard */}

        {isAdmin && (
          <TabsContent value="manage">
            <ManageTab />
          </TabsContent>
        )}
      </Tabs>

      {canPost && (
        <PostAnnouncementSheet
          open={postOpen}
          role={isAdmin ? "admin" : "manager"}
        />
      )}
    </div>
  );
}
```

---

## Mock Data Changes
- Add `author: string` and `isPinned: boolean` fields to the announcement type
- Add `status: "published" | "scheduled" | "archived"` field

---

## Scope / Not in Scope
| In scope | Out of scope |
|---|---|
| Role-gated UI rendering | Real API calls / DB writes |
| Post form (all fields as mock) | Email/push notifications on post |
| Edit/delete own (manager) | Audit logging |
| Manage tab with static table | Pagination / server-side filtering |
| Pin UI (admin) | Scheduling actually deferring publish |
