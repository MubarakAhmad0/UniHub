# Implementation Plan — 18 · Finances

**Route:** `/dashboard/services/finances`  
**Pattern:** A (admin-only additions for now; manager payroll is deferred)  
**Current file:** `app/dashboard/services/finances/page.tsx` (13,844 bytes)  
**Note:** Manager payroll view (separate route) is deferred to a later milestone (Q20 decision).

---

## What Changes

### Manager View
**Deferred.** Manager sees the standard student Finances page for now (or an empty state).  
The payroll route (`/dashboard/staff/payroll`) will be built in a future milestone.  
For this phase: if manager role is detected, show a simple message:

```tsx
if (isManager) {
  return (
    <div className="flex-1 flex items-center justify-center flex-col gap-3 p-8">
      <Banknote className="h-10 w-10 text-muted-foreground" />
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        Payroll and staff financial information will be available in the Staff Portal.
        <br />Coming soon.
      </p>
    </div>
  );
}
```

### Admin View (conditional additions)
- **"Student Accounts" tab** — search students, view their balance, record payments, issue waivers
- **"Fee Structures" tab** — configure fee amounts per programme/level/semester
- **"Scholarships" tab** — create/assign scholarships, applications queue

---

## Files to Create / Modify

### [MODIFY] `app/dashboard/services/finances/page.tsx`
```tsx
const isAdmin   = hasRole("admin");
const isManager = hasRole("manager");

// Manager: placeholder
if (isManager && !isAdmin) return <ManagerPlaceholder />;

// Admin: extended tabs
<TabsTrigger value="student-accounts">Student Accounts</TabsTrigger>
<TabsTrigger value="fee-structures">Fee Structures</TabsTrigger>
<TabsTrigger value="scholarships">Scholarships</TabsTrigger>
```

### [NEW] `_components/manager-placeholder.tsx`
Simple centered placeholder (as described above). Minimal component, no complexity.

### [NEW] `_components/student-accounts-tab.tsx`
Admin-only tab:

**Student search:**
```tsx
<div className="flex gap-3">
  <Input placeholder="Search by name or student ID…" className="max-w-sm" />
  <Button>Search</Button>
</div>
```

**Results: student account card (once selected):**
```
Student info: name, ID, programme, year
Balance summary: Outstanding RM X | Paid this semester RM Y | Financial Aid RM Z

Fee statement table:
  Row: Fee type | Date | Amount | Status (Paid/Unpaid/Overdue)

Actions bar:
  [Record Payment]  → Dialog: amount, method (Cash/Bank Transfer/Online), reference
  [Issue Credit]    → Dialog: amount, reason
  [Issue Waiver]    → Dialog: amount, reason, approval note
```

### [NEW] `_components/fee-structures-tab.tsx`
Admin-only tab:
```
Semester selector at top

Table: Programme × Level grid
  Rows: programmes (BSc CS, BArch, etc.)
  Columns: Undergraduate / Graduate / Per Credit

Cells: editable number inputs (RM amount)
"Save Changes" button at bottom
```

### [NEW] `_components/scholarships-tab.tsx`
Admin-only tab:
```
Sub-tabs: [Scholarships List] [Applications]

Scholarships List:
  Table: Name | Amount (RM/semester) | Recipients | Status | Actions (Edit/Delete)
  "Create Scholarship" Button → Sheet form:
    Name, Description, Amount, Seats (slots), Eligibility criteria (textarea), Active toggle

Applications sub-tab:
  Pending scholarship applications from students
  Table: Student | Scholarship | GPA | Financial Need | Submitted | Actions (Approve/Reject)
```

---

## Mock Data

```ts
// Student accounts (admin view)
const studentAccounts = [
  {
    id: "s001",
    name: "Alex Rivers",
    studentId: "TP123456",
    programme: "BSc Computer Science",
    outstanding: 2500,
    paidThisSemester: 5000,
    financialAid: 1000,
    feeStatement: [
      { type: "Tuition Fee", date: "Jan 15", amount: 5000, status: "paid"    },
      { type: "Library Fee", date: "Jan 15", amount: 100,  status: "paid"    },
      { type: "Tuition Fee", date: "Apr 15", amount: 5000, status: "unpaid"  },
      { type: "Sports Fee",  date: "Jan 15", amount: 50,   status: "overdue" },
    ]
  }
]

// Fee structures
const feeStructures = [
  { programme: "BSc Computer Science", undergraduate: 5000, graduate: 6500, perCredit: 380 },
  { programme: "BArch Urban Design",   undergraduate: 5500, graduate: 7000, perCredit: 420 },
]

// Scholarships
const scholarships = [
  { id: "sch1", name: "Merit Excellence Award", amount: 2000, seats: 10, recipients: 7, active: true },
  { id: "sch2", name: "Need-Based Bursary",      amount: 1500, seats: 20, recipients: 14, active: true },
]
```

---

## Scope / Not in Scope
| In scope | Out of scope |
|---|---|
| Manager placeholder (deferred payroll) | Manager payroll route |
| Admin student account search + view | Real payment gateway integration |
| Record payment / issue credit (dialog, local) | Automated fee application |
| Fee structures table (editable, local) | Financial reporting charts |
| Scholarships list + create form | Scholarship application workflow |
| Applications approval queue (mock) | Auto-eligibility calculation |
