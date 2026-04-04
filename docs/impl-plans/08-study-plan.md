# Implementation Plan — 08 · Study Plan

**Route:** `/dashboard/academic/study-plan`  
**Pattern:** A (conditional UI for manager; same page with added advisor mode)  
**Current file:** `app/dashboard/academic/study-plan/page.tsx` (13,047 bytes)

---

## What Changes

### Student View (mostly unchanged)
- **Endorsement status banner** added at top: "Endorsed by advisor ✓" or "Not yet endorsed" — informational only, does not block enrollment

### Manager View (advisory mode, same page)
- Manager sees their **advisee list** instead of their own plan
- Select an advisee → see their plan in read-only mode with an advisor toolbar overlaid
- Advisor toolbar: Add Note, Suggest Substitution, Endorse Plan
- Endorsement is advisory only — it doesn't block the student from enrolling

### Admin View (conditional additions)
- "View as Student" search bar to access any student's plan
- Substitution approval queue tab
- Program editor tab (configure degree requirements)

---

## Files to Create / Modify

### [MODIFY] `app/dashboard/academic/study-plan/page.tsx`

```tsx
const { hasRole } = useAuth();
const isAdmin   = hasRole("admin");
const isManager = hasRole("manager");

// Student: show own plan + endorsement banner
// Manager: show advisee selector; when advisee selected → show their plan in read-only + advisor toolbar
// Admin: show own plan OR student plan via search + add admin tabs
```

### [NEW] `_components/endorsement-banner.tsx`
Shown to students only. Simple informational banner:
```tsx
// Endorsed state:
<div className="bg-emerald-50 border border-emerald-200 rounded-md px-4 py-2 flex items-center gap-2 text-sm">
  <CheckCircle className="h-4 w-4 text-emerald-600" />
  <span>Your plan has been endorsed by <strong>Prof. Elena Rossi</strong></span>
</div>

// Not endorsed:
<div className="bg-muted rounded-md px-4 py-2 text-sm text-muted-foreground">
  ℹ️ Your plan hasn't been endorsed by an advisor yet. You can still enroll.
</div>
```

### [NEW] `_components/advisee-selector.tsx`
Manager-only. Shown at top of page in manager mode:
```tsx
// Dropdown of their assigned advisees
<Select onValueChange={setSelectedAdvisee}>
  <SelectTrigger><SelectValue placeholder="Select an advisee…" /></SelectTrigger>
  <SelectContent>
    {advisees.map(a => (
      <SelectItem key={a.id} value={a.id}>{a.name} — {a.programme}</SelectItem>
    ))}
  </SelectContent>
</Select>
```
When no advisee selected: show empty state "Select a student to view their study plan."

### [NEW] `_components/advisor-toolbar.tsx`
Overlay toolbar shown when manager is viewing a student's plan:
```tsx
<div className="sticky bottom-0 bg-background border-t px-6 py-3 flex gap-3">
  <Button variant="outline" size="sm" onClick={() => setNoteOpen(true)}>
    <StickyNote className="h-4 w-4 mr-1" /> Add Note
  </Button>
  <Button variant="outline" size="sm" onClick={() => setSubstitutionOpen(true)}>
    <ArrowRightLeft className="h-4 w-4 mr-1" /> Suggest Substitution
  </Button>
  <Button size="sm" onClick={() => handleEndorse()}>
    <CheckCircle className="h-4 w-4 mr-1" />
    {isEndorsed ? "Endorsed ✓" : "Endorse Plan"}
  </Button>
</div>
```

#### `add-note-dialog.tsx`
```
"Add a note to this course slot"
Course: [selected course name]
Note: Textarea ("E.g., Consider taking this before applying for internships")
Cancel | Add Note
```
Note appears as a tooltip/popover on the course slot card.

#### `suggest-substitution-dialog.tsx`
```
"Suggest Course Substitution"
Replace: [current course selector]
With:    [substitute course selector]
Reason:  Textarea
"This will be sent to admin for approval."
Cancel | Submit Suggestion
```
Submit → toast("Substitution suggestion sent to admin").

### [NEW] `_components/admin-study-plan-additions.tsx`
Admin-only additions injected into the page:

**Student Plan Search bar:**
```tsx
<div className="mb-4">
  <Input placeholder="Search student by name or ID to view their plan…" />
</div>
```

**Substitution Queue tab** (shown as extra tab in page):
```
Tab label: "Substitutions"
Table: Student | Replace | With | Reason | Submitted | Actions (Approve/Reject)
```

**Programs tab** (shown as extra tab):
```
List of degree programs with "Edit" button each
Program editor (Sheet): 
  - Program name
  - Required credits (core / elective / free-elective)
  - Required courses (multi-select)
```

---

## Mock Data

```ts
// Manager view
const advisees = [
  { id: "s001", name: "Alex Rivers",   programme: "BSc Computer Science",  isEndorsed: false },
  { id: "s002", name: "Jae Lee",       programme: "BSc Computer Science",  isEndorsed: true  },
  { id: "s003", name: "Sam Kaur",      programme: "BSc Mathematics",       isEndorsed: false },
]

// Admin view
const substitutionRequests = [
  { id: "r1", student: "Alex Rivers", replace: "CS 301", with: "CS 320", reason: "Scheduling conflict", submitted: "Apr 1" }
]
```

---

## Scope / Not in Scope
| In scope | Out of scope |
|---|---|
| Endorsement banner (student) | Enrollment gate on endorsement |
| Advisee selector + read-only plan view | Advisor assignment DB write |
| Add Note to course slot (mock) | Persistent notes in DB |
| Suggest Substitution (mock form) | Admin substitution approval DB write |
| Endorse Plan button (local toggle) | Email to student on endorsement |
| Admin substitution queue (mock) | Real degree program configuration |
| Admin programs tab (read-only first) | Graduation audit engine |
