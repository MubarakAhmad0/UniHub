# 19 · Profile

**Route:** `/dashboard/profile`

Users view and update their personal information, preferences, and account settings.

---

## Student (current build)

| Feature | Status |
|---|---|
| View profile: name, ID, photo, faculty, programme, year | ✅ |
| Edit display name and profile picture | ✅ |
| View enrolment info (programme, intake, expected graduation) | ✅ |
| Change password | ✅ |
| Notification preferences | ✅ |
| Theme preference (light/dark) | ✅ |
| View academic advisor info | ✅ |
| Edit other users' profiles | 🚫 |

---

## Lecturer

Lecturers have a distinct profile with fields relevant to their staff role. The layout is the same but the data fields differ.

| Feature | Status | Notes |
|---|---|---|
| View and edit own display name and profile picture | ✅ | |
| Change password | ✅ | |
| Notification preferences | ✅ | |
| Theme preference | ✅ | |
| Student-specific fields (programme, GPA, student ID) | 🚫 | Replaced by staff fields |
| **Staff ID and Faculty** | 🆕 | View-only (set by admin) |
| **Department and designation** | 🆕 | E.g., "Associate Professor, Dept. of Computer Science" |
| **Office location** | 🆕 | Building + room number; used by Campus Map to place the "My Office" marker |
| **Office hours** | 🆕 | Set recurring day/time slots; shown on their profile + campus timetable |
| **Courses taught (current semester)** | 🆕 | Read-only; pulled from course assignments |
| **Research interests / bio** | 🆕 | Optional free-text bio visible to students on the public lecturer profile |
| **Public profile visibility** | 🆕 | Toggle whether their office hours and bio are visible to students |
| Edit other users' profiles | 🚫 | Admin only |

### UI changes needed
- **"Staff Info" section** (replaces "Enrolment Info"): Staff ID, Faculty, Department, Designation — all read-only.
- **"Office" section:** Office Location (building + room input), Office Hours (recurring day/time slot builder).
- **"Bio & Research" section:** rich text bio + research interests tags.
- **Public visibility toggle** at top of the public-facing sections.

---

## Admin

Admins can view and manage any user's profile, assign roles, and reset access credentials.

| Feature | Status | Notes |
|---|---|---|
| View and edit own profile | ✅ | |
| **View any user's profile** | 🆕 | Search by name/ID/email |
| **Edit any user's profile information** | 🆕 | Name, faculty, department, contact info |
| **Change a user's role** | 🆕 | Student → Lecturer→ Admin or vice versa; with confirmation |
| **Activate / deactivate an account** | 🆕 | Prevent login without deleting the account |
| **Reset a user's password** | 🆕 | Send a password reset link or set a temporary password |
| **Verify a user's identity** | 🆕 | Mark profile as "Verified" (e.g., after checking official ID) |
| **User management table** | 🆕 | Searchable, filterable list of all users with role and status |
| **Bulk role assignment** | 🆕 | Select multiple users → assign role |
| **Audit log of profile changes** | 🆕 | Who changed what field on whose profile |
| **View login history** | 🆕 | Per-user list of login timestamps and IPs |

### UI changes needed
- **"User Management" page** (admin-exclusive; could be a separate admin section or a tab in Profile when accessing another user).
- **User search bar** at top of admin profile view; results populate a table.
- **User Management table:** Name, ID, Role, Status (Active/Inactive), Verified, Last Login, Actions.
- **User detail panel (Sheet/Page):** full profile edit form + role selector + Activate/Deactivate + Reset Password + Verify toggles.
- **"Audit Log" tab** in user detail: timeline of all changes.
