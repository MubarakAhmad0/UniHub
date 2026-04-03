# 03 · Campus Events

**Route:** `/dashboard/campus/events`

Students discover, filter, and RSVP to campus events. Featured events displayed prominently.  
Categories: Academic, Sports, Career, Cultural, Club. RSVP states: Going / Interested / None.

---

## Student (current build)

| Feature | Status |
|---|---|
| Browse all events with category filter | ✅ |
| Featured event banner/card | ✅ |
| RSVP (Going / Interested) | ✅ |
| My Events tab (RSVP'd events) | ✅ |
| Add to calendar | ✅ |
| Event detail sheet | ✅ |
| "Submit Event" button (not wired) | ✅ (UI only) |
| Create/manage events | 🚫 |
| Feature an event | 🚫 |

---

## Lecturer

Lecturers can publish events for academic or departmental purposes and manage events they own.

| Feature | Status | Notes |
|---|---|---|
| All student browsing/RSVP features | ✅ | |
| **Create Event** | 🆕 | Full event creation form (replaces stub "Submit Event") |
| **Event creation form fields** | 🆕 | Title, Category (Academic / Cultural / Club), Date & Time, Venue, Description, Capacity (optional), Thumbnail emoji/image |
| **Edit own events** | 🆕 | Edit icon appears on event cards the lecturer authored |
| **Cancel own events** | 🆕 | Sets event to `cancelled` status; attendees notified |
| **View attendee list for own events** | 🆕 | Count + list of names/student IDs who RSVPed Going |
| Feature an event | 🚫 | Admin-only privilege |
| Approve others' events | 🚫 | Admin-only |
| Create `Sports` category events | 🚫 | Sports Council / Admin only |

### UI changes needed
- **"New Event" button** replaces the stub "Submit Event" (top-right header area), triggers full event creation Sheet.
- **Event creation/edit Sheet:** fields as listed above; `Category` dropdown limited to appropriate options for lecturer.
- **My Events tab** gains a sub-toggle: "RSVPd" vs "Organised" so lecturers can manage their own events.
- **Event cards** for events the lecturer authored show Edit ✏ / Cancel ❌ action buttons.
- **Attendee list panel:** clicking "N going" on own event opens a Sheet listing attendees.

---

## Admin

Full event management including approval workflows, featuring, and analytics.

| Feature | Status | Notes |
|---|---|---|
| All student + lecturer features | ✅ | |
| **Create any category of event** | 🆕 | All categories unlocked |
| **Feature an event** | 🆕 | Toggle "Featured" on any event; appears in the hero banner |
| **Unfeature an event** | 🆕 | |
| **Edit any event** | 🆕 | Regardless of author |
| **Delete any event** | 🆕 | Hard delete with confirmation |
| **Cancel any event** | 🆕 | With bulk notification to RSVPed attendees |
| **Approve / Reject submitted events** | 🆕 | Queue for student-submitted events; Approve publishes, Reject sends reason |
| **Manage event categories** | 🆕 | Add/remove/rename categories |
| **Event management table** | 🆕 | "Manage Events" tab with sortable data table |
| **RSVP analytics** | 🆕 | Per-event: Going count, Interested count, capacity fill %, trends over time |
| **Export attendee lists** | 🆕 | CSV download of event attendees |
| **Bulk publish/cancel** | 🆕 | Multi-select in management table |

### UI changes needed
- **"Manage Events" tab** added alongside "All Events" and "My Events".
- **Manage tab:** data table with columns: Title, Category, Organiser, Date, Status (Published/Cancelled/Pending), Featured 📌, Capacity, RSVPs, Actions.
- **Pending approval badge** in tab label when there are events awaiting review.
- **Feature toggle** appears on every event card's three-dot menu (admin view).
- **Analytics sheet** accessible per event with charts (RSVP over time, capacity gauge).
