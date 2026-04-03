# 12 · Venue & Facilities

**Route:** `/dashboard/campus/venues`

Browse and book university venues (lecture halls, labs, sports facilities, meeting rooms) for events or activities.

---

## Student (current build)

| Feature | Status |
|---|---|
| Browse venue list with capacity, equipment, and photos | ✅ |
| Filter by type / capacity / availability | ✅ |
| View venue detail (description, equipment list, gallery) | ✅ |
| Submit a booking request (not confirmed instantly — subject to approval) | ✅ |
| View own booking request status | ✅ |
| Cancel a pending request | ✅ |
| Approve / manage any booking | 🚫 |

---

## Lecturer

Lecturers have academic booking priority and can reserve venues for classes or academic events without the approval queue (auto-approved up to a limit).

| Feature | Status | Notes |
|---|---|---|
| All student browsing features | ✅ | |
| **Auto-approved academic booking** | 🆕 | Bookings made by lecturers for academic purposes are auto-confirmed (no approval queue) within policy limits |
| **Book for a course** | 🆕 | "Linked Course" field in booking form; course-linked bookings appear on affected students' timetables |
| **Recurring booking** | 🆕 | E.g., "every Tuesday 2–4pm for the semester" in one request |
| **View tentative equipment** | 🆕 | When booking, can flag equipment needed (projector, lab kits); this is sent to facility staff |
| **View own upcoming venue bookings** | 🆕 | Booking history tab |
| Manage / approve others' bookings | 🚫 | Admin/facility staff only |
| Add / edit venue records | 🚫 | Admin only |

### UI changes needed
- **"Booking Type" selector** in form: Personal / Academic (Course-linked).
- **"Linked Course" dropdown** appears when Academic type is selected.
- **"Recurring" toggle** in booking form; reveals day-of-week + end date pickers.
- **Auto-confirmed badge** on booking confirmation: "✓ Confirmed (Academic Priority)".

---

## Admin

Full venue/facility management, booking approval workflow, and inventory tracking.

| Feature | Status | Notes |
|---|---|---|
| All student + lecturer booking features | ✅ | |
| **Approve / Reject booking requests** | 🆕 | Queue of pending student booking requests with Approve/Reject + reason |
| **Add a new venue** | 🆕 | Name, type, building, floor, capacity, equipment list, photos |
| **Edit venue details** | 🆕 | Any venue field |
| **Delete / archive venue** | 🆕 | Archive retains booking history |
| **Mark venue unavailable** | 🆕 | "Under Maintenance" or "Reserved" state; blocks all booking during that period |
| **Venue equipment inventory** | 🆕 | Track equipment per venue (projectors, chairs, etc.); mark items as broken/replaced |
| **Override / cancel any booking** | 🆕 | E.g., emergency re-allocation; notifies booker |
| **Booking calendar view** | 🆕 | View all venues side-by-side on a day/week calendar grid |
| **Utilization reports** | 🆕 | Most-booked venues, peak hours, capacity vs bookings ratio |
| **Set booking policies** | 🆕 | Max advance notice, max duration per role, blocked dates |

### UI changes needed
- **"Approval Queue" tab** with badge count of pending requests; table with: Requester, Venue, Date/Time, Purpose, Actions (Approve/Reject).
- **"Manage Venues" tab:** venue list in editable table + "Add Venue" button.
- **Venue editor (Sheet/Page):** all venue metadata + equipment list (add/remove items).
- **Calendar booking view:** horizontal swimlane per venue showing bookings as blocks.
- **Status override:** per-venue "Set Status" button → Available / Maintenance / Reserved with date range.
