# 11 · Library Booking

**Route:** `/dashboard/campus/library`

Browse and book library resources — study rooms, equipment, and materials.

---

## Student (current build)

| Feature | Status |
|---|---|
| Browse available study rooms with availability slots | ✅ |
| Book a study room (date / time / duration) | ✅ |
| View own upcoming bookings | ✅ |
| Cancel own booking | ✅ |
| Browse borrowable resources (books, equipment) | ✅ |
| Request a resource loan | ✅ |
| Request a new resource (acquisition suggestion) | 🚫 (not wired) |

---

## Lecturer

Lecturers can book resources for class purposes and have access to extended booking options.

| Feature | Status | Notes |
|---|---|---|
| All student booking features | ✅ | |
| **Extended booking duration** | 🆕 | Lecturers can book rooms for longer periods (e.g., full-day) vs student limits |
| **Book on behalf of a class** | 🆕 | "Class Booking" option; links booking to a course; students enrolled in that course can see the reservation |
| **Request resource acquisition** | 🆕 | Submit a formal request for the library to acquire a specific book/resource; form with ISBN, title, author, justification |
| **View class booking history** | 🆕 | All bookings made by the lecturer, individually or for their classes |
| Priority booking over students | 🆕 | Lecturer bookings are confirmed before student requests in the same time slot |
| Manage library inventory | 🚫 | Admin/library staff only |

### UI changes needed
- **"Book for Class" toggle** in booking form; when selected adds a Course selector.
- **Booking type badge** on booking cards: "Personal" vs "Class".
- **"Request Acquisition" button** in page header; form: ISBN/Title, Author, Reason/Justification, Suggested Budget.

---

## Admin

Full library management including inventory, booking policies, and utilization analytics.

| Feature | Status | Notes |
|---|---|---|
| All student + lecturer features | ✅ | |
| **Add / edit / remove study rooms** | 🆕 | Name, floor, capacity, equipment list, images |
| **Add / edit / remove borrowable resources** | 🆕 | Title, type, quantity, condition |
| **Process acquisition requests** | 🆕 | Approve / Reject with reason; approved requests create a library task |
| **Manage booking policies** | 🆕 | Max duration per role, max concurrent bookings, blackout dates |
| **View all active bookings** | 🆕 | Full table: who, what room, what time, status |
| **Cancel any booking** | 🆕 | With notification to booker |
| **Utilization reports** | 🆕 | Room usage heatmap per day/week; most/least booked resources |
| **Set room status** | 🆕 | Available / Under Maintenance / Reserved (admin-only hold) |
| **Blackout dates** | 🆕 | Block booking for specific date ranges (e.g., exam period, public holidays) |

### UI changes needed
- **"Manage" tab** in page: sub-tabs for Rooms, Resources, Acquisitions, Policies.
- **Rooms sub-tab:** data table + "Add Room" button + room detail editor.
- **Acquisitions sub-tab:** queue of pending requests with Approve/Reject.
- **Policy sub-tab:** form with role-based limits (inputs per role).
- **Utilization view:** calendar heatmap + bar chart of most-used rooms.
