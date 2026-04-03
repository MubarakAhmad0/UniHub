# Role Spec — Decisions Log

Recorded answers to all 24 design questions. These override any contradictory detail in individual spec files.

---

## Architecture

| # | Question | Decision |
|---|---|---|
| 1 | Role-specific view approach | **Conditional rendering** for small additions (button/section). **Separate route** only if the entire page purpose changes for the role (e.g., Marks, Finances). |
| 2 | Admin tiers | **Three flat roles only:** `admin`, `manager` (lecturers, staff), `student` (users). No Super Admin. |

---

## Announcements

| # | Question | Decision |
|---|---|---|
| 3 | Manager-posted announcements | **Immediate** — go live on post, no approval needed. |
| 4 | Student announcement suggestions | **No** — posting is manager/admin only. Students read only. |

---

## Forums

| # | Question | Decision |
|---|---|---|
| 5 | Creating community rooms | **Approval required** — student creates request, admin approves before room is visible. |
| 6 | Content flagging | **Simple flag only** — students can flag a post; admin sees it. No complex moderation queue UI. |

---

## Events

| # | Question | Decision |
|---|---|---|
| 7 | Student event submissions | **Admin approves** all student-submitted events before they go live. |
| 8 | Featuring events | **Managers (lecturers) can feature** their own events. Admin can also feature/un-feature any. |

---

## Course Catalog & My Courses

| # | Question | Decision |
|---|---|---|
| 9 | Lecturer name on catalog cards | **Yes** — visible to students on every course card. |
| 10 | Course material visibility | **Explicit publish step** — lecturer uploads, then clicks Publish to make visible to students. |

---

## Marks & GPA

| # | Question | Decision |
|---|---|---|
| 11 | Editing after "Submit to Registry" | **Soft-locked** — lecturer can still edit with a required reason; change is flagged for admin review but NOT blocked. |
| 12 | When students see marks | **Admin publishes** — marks are hidden from students until admin runs a "Publish Marks" action. |

---

## Attendance

| # | Question | Decision |
|---|---|---|
| 13 | Attendance warning threshold | **80%** (default, admin can configure). |
| 14 | Attendance disputes | **Dedicated dispute button** on the attendance page → request goes to the lecturer for review. |

---

## Study Plan

| # | Question | Decision |
|---|---|---|
| 15 | Advisor endorsement requirement | **Advisory only** — endorsement is optional/recommended; students can still enroll without it. |
| 16 | Advisor assignment | **Explicit separate assignment** by admin. Not all managers/lecturers are advisors automatically. |

---

## Timetable

| # | Question | Decision |
|---|---|---|
| 17 | Timetable visibility | **Always live** — admin updates the DB, students see the change on next refresh. No draft/publish step. Simple, no webhooks or real-time. |

---

## Complaints

| # | Question | Decision |
|---|---|---|
| 18 | Lecturer seeing complaint identity | **Anonymous** — lecturer sees the complaint body only; complainant name is hidden. |
| 19 | Students complaining about students | **Yes allowed** — students can file complaints against other students (harassment, misconduct, etc.) |

---

## Finances

| # | Question | Decision |
|---|---|---|
| 20 | Lecturer finances (payroll) route | **Separate route** (e.g., under a Staff/HR section) — but **deferred to a later milestone**, not part of current scope. Finances page remains student-only for now. |

---

## Marketplace

| # | Question | Decision |
|---|---|---|
| 21 | Marketplace access | **Open to all university members** — students and managers (lecturers/staff) can both buy and sell. |

---

## Clubs

| # | Question | Decision |
|---|---|---|
| 22 | Club creation initiation | **Students submit a request** (with founding members + proposed advisor) → admin approves/rejects. |
| 23 | Faculty advisor requirement | **Mandatory** — a club cannot be approved without an assigned faculty advisor. |

---

## Profile

| # | Question | Decision |
|---|---|---|
| 24 | Lecturer profile visibility | **All students** can view any lecturer's office hours and bio — not restricted to enrolled students. |
