# Data Requirements — Finances

**Route:** `/dashboard/services/finances`

---

## Student View Data

### Fee Summary
| Field | Type | Required | Description |
|---|---|---|---|
| `currentSemester` | `string` | Yes | Current semester (e.g., "Fall 2024") |
| `totalFees` | `number` | Yes | Total fees for semester |
| `totalPaid` | `number` | Yes | Total amount paid |
| `outstanding` | `number` | Yes | `totalFees - totalPaid` |
| `dueDate` | `string` | Yes | Payment due date (e.g., "15 Apr 2026") |
| `isOverdue` | `boolean` | Yes | Whether past due date |

### Fee Item
| Field | Type | Required | Description |
|---|---|---|---|
| `type` | `string` | Yes | Fee type (e.g., "Tuition", "Lab Fee") |
| `description` | `string` | Yes | Fee description |
| `amount` | `number` | Yes | Amount in RM |
| `isDeduction` | `boolean` | Yes | Whether a deduction (scholarship, etc.) |

### Payment
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Payment ID |
| `date` | `string` | Yes | Payment date |
| `reference` | `string` | Yes | Transaction reference (e.g., "TXN-2026-0012") |
| `amount` | `number` | Yes | Amount paid in RM |
| `method` | `string` | Yes | Payment method (e.g., "Online", "Bank Transfer") |
| `status` | `"completed" \| "pending" \| "failed"` | Yes | Payment status |
| `receiptUrl` | `string \| null` | No | Receipt download URL |

### Semester History
| Field | Type | Description |
|---|---|---|
| `semester` | `string` | Semester name |
| `fees` | `number` | Total fees for semester |
| `paid` | `number` | Total paid |
| `status` | `"clear" \| "outstanding"` | Whether fully paid |

---

## Derived/Computed Data

### Display Helpers
| Field | Type | Description |
|---|---|---|
| `formattedAmount` | `string` | "RM X,XXX.XX" |
| `outstandingBadge` | `{ label, color }` | Outstanding balance indicator |
| `semesterStatusBadge` | `{ label, color }` | "Cleared" (green) or "Outstanding" (amber) |

### Status Banner
| Condition | Display |
|---|---|
| `isOverdue === true` | Red banner: "Payment Overdue" + outstanding amount |
| `isOverdue === false` | Amber banner: "Outstanding Balance — Due [date]" + outstanding amount |

---

## Tab Filter Data

### Tab Types
| Tab | Filter Logic |
|---|---|
| Current Semester | Fee breakdown for `currentSemester` |
| Payment History | All payments made |
| All Semesters | Semester-by-semester summary |

---

## Current Semester Tab Data

### Fee Breakdown Table
| Column | Data Source |
|---|---|
| Type | `feeItem.type` |
| Description | `feeItem.description` |
| Amount | `feeItem.amount` (green if deduction) |

### Table Footer Rows
| Row | Calculation |
|---|---|
| Total Fees | `Σ(fees) - Σ(deductions)` |
| Paid | Latest payment or sum of recent payments |
| Outstanding | `totalFees - totalPaid` (highlighted) |

### Actions
| Action | Data Needed |
|---|---|
| Pay Now | `outstanding` amount, payment gateway URL |
| Download Statement | Generates PDF of fee breakdown |

---

## Payment History Tab Data

### Payments Table
| Column | Data Source | Sortable |
|---|---|---|
| Date | `payment.date` | Yes |
| Reference | `payment.reference` | Yes |
| Amount | `payment.amount` | Yes |
| Method | `payment.method` | Yes |
| Status | `payment.status` | Yes |
| Receipt | Download button | — |

---

## All Semesters Tab Data

### Semester Summary Cards
| Field | Type | Description |
|---|---|---|
| `semester` | `string` | Semester name |
| `fees` | `number` | Total fees |
| `paid` | `number` | Total paid |
| `status` | `string` | "Cleared" or "Outstanding" |
| `downloadReceipt` | `boolean` | Whether receipt is available |

---

## Admin View Data

### Admin Financial Dashboard
| Metric | Description |
|---|---|
| Total Outstanding | Sum of all student outstanding balances |
| Total Collected | Sum of all payments received |
| Overdue Count | Number of overdue accounts |
| Pending Payments | Number of pending/processing payments |

### Admin Tables
| Table | Columns |
|---|---|
| Student Balances | Student, Programme, Total Fees, Paid, Outstanding, Status |
| Recent Payments | Date, Student, Amount, Method, Status |
| Overdue Accounts | Student, Outstanding Amount, Due Date, Days Overdue |

---

## Manager View Data

Managers (lecturers/staff) see a **restricted access page**:
- No financial data visible
- Message: "This module is exclusively for student financial accounts."
- Redirects suggestion: "Staff payroll operations have been moved to the primary HR system."

---

## Authorization Checks
| Check | Purpose |
|---|---|
| `hasRole("admin")` | Show admin financial dashboard, all student balances |
| `hasRole("manager")` | **Restricted** — sees "Restricted Area" page |
| Student role | View own finances, make payments, download statements |
