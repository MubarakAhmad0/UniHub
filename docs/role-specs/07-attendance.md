# 07 · Attendance

**Route:** `/dashboard/academic/attendance`

Students see their attendance record per course with percentage and session history.

---

## Student (current build)

| Feature | Status |
|---|---|
| Overall attendance percentage | ✅ |
| Per-course attendance breakdown | ✅ |
| Session-by-session log (date, status: Present/Absent/Late) | ✅ |
| Attendance warning indicator (below threshold) | ✅ |
| **Dispute an attendance record** | 🆕 | Dedicated "Dispute" button per session; submits a dispute request directly to the lecturer for review (not routed through Complaints) |
| Take attendance | 🚫 |
| Edit attendance records | 🚫 |

---

## Lecturer

Lecturers **take attendance** for their own classes and can review and amend records.

| Feature | Status | Notes |
|---|---|---|
| View own personal attendance | 🚫 | N/A for lecturers |
| **Teaching course attendance dashboard** | 🆕 | List of their courses with overall class attendance % each |
| **Select course → view class attendance sheet** | 🆕 | Rows = students; columns = each class session date |
| **Take attendance (new session)** | 🆕 | "Start Session" button; creates a new column for today's date |
| **Mark each student: Present / Absent / Late / Excused** | 🆕 | Radio or icon-button toggle per student row in the session |
| **Submit attendance session** | 🆕 | Locks the session; students can now see the result |
| **Edit past attendance** | 🆕 | Unlock a past session to correct a mistake; edit is logged |
| **View individual student's attendance history** | 🆕 | Click a student in the roster → their session-by-session log |
| **Attendance warnings** | 🆕 | Students below threshold (e.g., <80%) are highlighted in red |
| **Export attendance report** | 🆕 | CSV of attendance sheet per course |
| Take attendance for another lecturer's course | 🚫 | |

### UI changes needed
- **Page title:** "Attendance Management" for lecturers.
- **Course tabs / selector** at top.
- **Attendance sheet table:** rows = students, columns = session dates, cells = P/A/L/E badges (clickable to change if editing). Final column = attendance %.
- **"Start Session" button:** in page header; creates new column with today's date and opens quick-mark mode.
- **Quick-mark mode:** full-height overlay showing student list with large Present / Absent / Late buttons per row; "Submit" at bottom.
- Student rows with < threshold % get a red highlight and ⚠ icon.

---

## Admin

System-wide oversight of attendance policies and override capability.

| Feature | Status | Notes |
|---|---|---|
| **View attendance across all courses and all lecturers** | 🆕 | Filter by course, faculty, date range |
| **Override any attendance record** | 🆕 | Admin can change a student's status for any session; with mandatory reason |
| **Set attendance threshold policy** | 🆕 | Configure the minimum % before a warning is triggered (default 80%) |
| **Generate university-wide attendance reports** | 🆕 | CSV / PDF with filters by faculty, course, date range |
| **View students at risk** | 🆕 | Dashboard widget: students across all courses below the threshold |
| **Bulk excused absences** | 🆕 | Mark a date range as excused for a group (e.g., university event / public holiday) |

### UI changes needed
- **"Policy" tab** at top: threshold % input, save policy button.
- **"At Risk" dashboard:** table of students with their course, attendance %, last seen date.
- **Bulk excuse wizard:** date range picker + affected courses selector + reason field.
- **Admin view of session tables:** same lecturer grade sheet but all cells have an Override button accessible on hover.
