# 18 · Finances

**Route:** `/dashboard/services/finances`

Students view their financial standing: fee statements, payment history, outstanding balances, and financial aid.

---

## Student (current build)

| Feature | Status |
|---|---|
| Current balance and outstanding amount | ✅ |
| Fee statements by semester | ✅ |
| Payment history with receipts | ✅ |
| Financial aid / scholarship status | ✅ |
| Make a payment (button / link to payment gateway) | ✅ |
| Download receipt / invoice | ✅ |
| View other students' finances | 🚫 |
| Modify fees or scholarships | 🚫 |

---

## Lecturer

Lecturers see a **payroll / HR finance view** instead of a student fee view. The page content is entirely different for this role — it shows employment-related financial information.

| Feature | Status | Notes |
|---|---|---|
| Student fee statements | 🚫 | Replaced by payroll view |
| **Payslip history** | 🆕 | Monthly payslips with gross, deductions, net pay |
| **Download payslip PDF** | 🆕 | |
| **View tax documents** | 🆕 | Annual tax summary / EA form |
| **Bank account details** | 🆕 | View/update bank account number for salary deposit |
| **Leave balance overview** | 🆕 | Annual leave days used vs remaining (may overlap with an HR page if added later) |
| Modify fee structures | 🚫 | Admin only |
| View student financial data | 🚫 | Strictly protected |

### UI changes needed
- **Page title:** "Payroll & Finances" for lecturers.
- **Payslip list:** table with Month, Gross, Net, Deductions, Status (Paid), Download button.
- **"Tax Documents" tab:** annual summary forms per year.
- **"Bank Details" card:** masked account number + "Update" button.

---

## Admin

Full financial management for the university: fee structures, payment processing, financial aid, and reporting.

| Feature | Status | Notes |
|---|---|---|
| **View any student's financial account** | 🆕 | Search by student ID/name; see full balance and history |
| **Manage fee structures** | 🆕 | Set tuition fees by program, level, semester; manage additional fees (library, sports, etc.) |
| **Apply fees to students** | 🆕 | Bulk-apply fees for a new semester to all enrolled students |
| **Record a manual payment** | 🆕 | Log a cash/cheque payment on behalf of a student |
| **Issue a credit / waiver** | 🆕 | Apply a credit note (e.g., error correction) or fee waiver |
| **Manage scholarships / financial aid** | 🆕 | Create, edit, and assign scholarships; set award amount and conditions |
| **Process financial aid applications** | 🆕 | Review and approve/reject student aid applications |
| **Send payment reminders** | 🆕 | Push/email notifications to students with outstanding balances |
| **Financial reports** | 🆕 | Revenue by semester/faculty, outstanding balances summary, payment trends |
| **Export statement** | 🆕 | CSV / PDF of all transactions or per student |
| **Manage lecturer payroll** | 🆕 | Set salary, process monthly payroll run, upload payslip PDFs |

### UI changes needed
- **"Student Accounts" tab:** search bar + table of students with Outstanding Balance, Last Payment, Status.
- **Student account detail:** full fee statement + payment history + admin action buttons (Record Payment, Issue Credit, Waiver).
- **"Fee Structures" tab:** program × level × semester grid of fees; editable cells.
- **"Scholarships" tab:** list of scholarships with Create/Edit; applications queue below.
- **"Payroll" tab:** lecturer payroll table; "Run Payroll" button for month-end; upload payslip for each.
- **"Reports" tab:** charts (revenue, outstanding, trends) + CSV export.
