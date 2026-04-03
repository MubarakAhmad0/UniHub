# 02 · Community Forums

**Route:** `/dashboard/campus/forums`

Three-panel layout: forum list sidebar → thread list → thread detail with replies.  
Forum types: `course`, `university`, `study_group`, `club`, `interest`.

---

## Student (current build)

| Feature | Status |
|---|---|
| Browse forums grouped by category (My Courses / University / Communities) | ✅ |
| View thread list per forum | ✅ |
| View thread detail with replies | ✅ |
| Upvote threads and replies | ✅ |
| Post a new thread (New Thread button) | ✅ |
| Reply to a thread | ✅ |
| Post anonymously | ✅ |
| Tag threads (notes, question, study-group, resources) | ✅ |
| Mark thread as solved (own threads) | ✅ |
| **Create Community Room** | ✅ (button exists, not wired) |
| Pin / lock threads | 🚫 |
| Delete others' threads/replies | 🚫 |

---

## Lecturer

Lecturers have moderation privileges **only within course forums assigned to them**.

| Feature | Status | Notes |
|---|---|---|
| All student browsing & reading features | ✅ | |
| Post threads in any forum | ✅ | Cannot post anonymously (identity always shown) |
| Reply to threads | ✅ | |
| Upvote | ✅ | |
| Post anonymously | 🚫 | Lecturers are always identified |
| **Pin a thread** | 🆕 | In their own course forums only; pin icon shown in thread list |
| **Lock a thread** | 🆕 | In their own course forums only; lock icon; prevents new replies |
| **Mark reply as Solution** | 🆕 | In threads inside their course forum; overrides student's own solved-marking |
| **Delete a thread** | 🆕 | In their own course forums; confirmation dialog; soft delete |
| **Delete a reply** | 🆕 | In their own course forums; with reason dropdown |
| **Create new course forum** | 🆕 | Auto-linked to one of their assigned courses; icon + name auto-filled |
| **Archive a course forum** | 🆕 | At end of semester; archived forums become read-only |
| Create university or interest forums | 🚫 | Admin only |
| Moderate other lecturers' course forums | 🚫 | |

### UI changes needed
- **Thread list panel:** Pin 📌 and Lock 🔒 icon buttons appear on thread rows when the viewing user is the course's lecturer.
- **Thread detail panel:** "Mark as Solution" button appears on each reply card header (replaces or supplements the student-only solved flag).
- **Delete controls:** three-dot menu (⋮) on thread rows and reply cards, visible only to the moderating lecturer.
- **Create Course Forum:** "+" button in the "My Courses" section header of the sidebar; opens a modal pre-filled with the lecturer's courses to select from.
- **Archive forum:** accessible via the forum list context menu (right-click / three-dot).

---

## Admin

Full moderation and structural control over the entire forum system.

| Feature | Status | Notes |
|---|---|---|
| All student + lecturer features | ✅ | |
| Post anonymously | 🚫 | Always identified as Admin |
| **Create any type of forum** | 🆕 | Course / University / Study Group / Club / Interest |
| **Edit forum metadata** | 🆕 | Name, description, icon, type |
| **Delete / archive any forum** | 🆕 | With cleanup confirmation |
| **Pin / unpin any thread globally** | 🆕 | |
| **Lock / unlock any thread** | 🆕 | |
| **Delete any thread or reply** | 🆕 | With audit log reason |
| **Assign moderator** | 🆕 | Grant a lecturer moderation rights to a specific forum |
| **View flagged / reported content** | 🆕 | Student report flags surface in admin inbox |
| **Forum analytics panel** | 🆕 | Post count, active users, most active threads per forum |
| **Bulk archive forums** | 🆕 | E.g., archive all course forums for a past semester at once |

### UI changes needed
- **Admin "Manage Forums" tab** added to the page (alongside the forum list); shows a data table of all forums with columns: Name, Type, Threads, Members, Status, Moderator, Actions.
- **Reported content badge** on forum list items with pending flags.
- **Forum detail header** gets an "Edit Forum" and "Assign Moderator" button for admin.
- **Thread / reply three-dot menus** always visible for admin across all forums.
