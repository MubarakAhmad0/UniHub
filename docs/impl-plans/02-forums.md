# Implementation Plan — 02 · Community Forums

**Route:** `/dashboard/campus/forums`  
**Pattern:** A (conditional UI — role-gated controls overlaid on existing three-panel layout)  
**Current file:** `app/dashboard/campus/forums/page.tsx` (589 lines, client component)

---

## What Changes

### For Manager (Lecturer/Staff)
In **their course forums only**:
- Thread rows show **Pin 📌 / Lock 🔒 / Delete 🗑 icon buttons** on hover
- Thread detail header shows **"Mark as Solution"** button on each reply card
- "+" button in "My Courses" sidebar section → **Create Course Forum modal**
- Forum list context menu → **Archive Forum** option
- Cannot post anonymously (anonymous checkbox is hidden)

### For Admin
- Full moderation controls on ALL forums (pin/lock/delete any thread, delete any reply)
- **"Manage Forums" tab** in page header area → data table of all forums
- Reported content badge (🚩) on forum list items with pending flags
- "Create Forum" button in the Manage tab

### For All users (Student included)
- Simple **Flag 🚩 button** added to thread rows and reply cards (Q6 decision)

---

## Files to Create / Modify

### [MODIFY] `app/dashboard/campus/forums/page.tsx`
- Pull `useAuth()` at top
- Derive `isAdmin`, `isManager` flags
- Pass moderation props into `ForumItem`, thread list, and thread detail

### [NEW] `app/dashboard/campus/forums/_components/thread-row.tsx`
Extract current inline thread `<button>` into a standalone component.  
New props:
```ts
type ThreadRowProps = {
  thread: Thread;
  isActive: boolean;
  onClick: () => void;
  // Moderation
  canModerate: boolean;   // true for admin, or manager of this course forum
  onPin?: () => void;
  onLock?: () => void;
  onDelete?: () => void;
}
```
Moderation icons (Pin, Lock, Delete) appear in a `<div>` on the right, visible on `hover` via `group-hover` when `canModerate` is true.

### [NEW] `app/dashboard/campus/forums/_components/reply-card.tsx`
Extract current reply card. New props:
```ts
type ReplyCardProps = {
  reply: Reply;
  canMarkSolution: boolean;  // manager who owns the course forum
  canDelete: boolean;        // admin = always; manager = own course forum
  onMarkSolution?: () => void;
  onDelete?: () => void;
  onFlag?: () => void;       // available to all users
}
```

### [NEW] `app/dashboard/campus/forums/_components/create-forum-modal.tsx`
Modal (Dialog) for creating a new course forum (manager) or any forum type (admin):
```ts
Fields:
  name: string
  type: "course" | "university" | "study_group" | "interest"  // admin sees all; manager only "course"
  icon: emoji string (picker)
  description: string
  linkedCourse?: string  // manager: dropdown of their courses
```
**For students:** Creating a study group/interest room → same modal but results in a **pending approval** state, not immediately visible.

### [NEW] `app/dashboard/campus/forums/_components/manage-forums-sheet.tsx`
Admin-only. Full-width Sheet or dedicated tab content:
- Data table: Forum Name, Type, Threads, Unread, Moderator, Status (Active/Archived), Actions
- Actions: Edit metadata / Archive / Assign Moderator (dropdown of managers)
- "Create Forum" button at top

### [MODIFY] Forum sidebar section header (inside `page.tsx`)
- "My Courses" section: add `+` icon button after the section label → opens `CreateForumModal` for managers
- Community section: existing "Create Room" CTA → now wired to open `CreateForumModal` with approval flow for students

---

## Key Moderation Logic

```tsx
// Derive per-forum moderation rights
function canModerateThisForum(forum: Forum, roles: string[], userId: string): boolean {
  if (roles.includes("admin")) return true;
  if (roles.includes("manager") && forum.type === "course") {
    // Check if this manager is assigned to this course forum
    // For now: mock — manager can moderate all course forums
    return true;
  }
  return false;
}
```

---

## Flag Flow (All users)
- Flag button (🚩) on thread rows and reply cards (always visible to any logged-in user)
- Clicking → `toast("Content flagged for review")` + local state marks it as flagged
- Mock: no actual API call; admin "Manage" tab shows flagged items with a badge

---

## Scope / Not in Scope
| In scope | Out of scope |
|---|---|
| Pin/lock/delete thread (UI, mock action) | Real DB writes for moderation |
| Mark Solution button on replies | Notification to thread author |
| Flag button for all users | Flag queue with real data |
| Create Forum modal (all roles) | Approval queue backend |
| Manage Forums sheet (admin) | Real-time thread count updates |
| Anonymous posting hidden for manager | |
