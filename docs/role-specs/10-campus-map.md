# 10 · Campus Map

**Route:** `/dashboard/campus/map`

Interactive map of the university campus with building markers, floor plans, and points of interest.

---

## Student (current build)

| Feature | Status |
|---|---|
| Interactive campus map with building markers | ✅ |
| Click building → name, function, floors | ✅ |
| Search for a building or room | ✅ |
| Layer toggles (academic / services / parking etc.) | ✅ |
| My Location indicator | ✅ |
| Add / edit map points | 🚫 |

---

## Lecturer

Lecturers have the same view as students but with additional context relevant to teaching.

| Feature | Status | Notes |
|---|---|---|
| All student map features | ✅ | |
| **Office location highlighted** | 🆕 | Lecturer's own office building/room is highlighted with a "My Office" marker on load |
| **Teaching rooms highlighted** | 🆕 | Rooms where they teach today are highlighted on the default view (matches timetable) |
| **Office hours location tag** | 🆕 | If office hours are set in profile/timetable, the office room gets a public label so students can find it |
| Add / edit map points | 🚫 | Admin only |

### UI changes needed
- **"Today's rooms" panel:** collapsible sidebar card listing today's teaching rooms with "Locate →" button that pans/highlights the map to that room.
- **"My Office" marker:** a distinct pin colour for the lecturer's office location (sourced from profile).

---

## Admin

Admins maintain the map content — adding buildings, points of interest, room labels, and maintenance states.

| Feature | Status | Notes |
|---|---|---|
| All student map features | ✅ | |
| **Add a building/point of interest** | 🆕 | Drag to place a pin, then fill in name, type, floors, description |
| **Edit an existing marker** | 🆕 | Click any marker → edit properties |
| **Delete a marker** | 🆕 | With confirmation |
| **Mark a building as under maintenance** | 🆕 | Applies a "⚠ Under Maintenance" overlay badge visible to all users |
| **Manage building floor plans** | 🆕 | Upload/replace floor plan images per building per floor |
| **Manage map layers** | 🆕 | Create/rename/reorder layers (Academic, Services, Parking, etc.) |
| **Publish map changes** | 🆕 | Optional draft mode before changes go live |

### UI changes needed
- **"Edit Map" toggle button** in page header (admin only); activates edit mode.
- **Edit mode toolbar:** Add Marker, Edit Selected, Delete Selected, Manage Layers.
- **Marker edit panel:** slides in from right; form with name, building type, floor count, description, maintenance toggle.
- **Maintenance badge** renders at map zoom levels ≥ a threshold on affected building markers.
