# Data Requirements — Campus Map

**Route:** `/dashboard/campus/map`

---

## Core Data Entities

### Map Marker
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Auto-increment primary key |
| `name` | `string` | Yes | Marker name (e.g., "Block A — Computing") |
| `type` | `"academic" \| "admin" \| "library" \| "sports" \| "dining" \| "parking" \| "services"` | Yes | Building/facility type |
| `description` | `string` | No | Building description |
| `floors` | `number` | No | Number of floors |
| `coordinates` | `{ lat: number, lng: number }` | Yes | Map position |
| `zoom` | `number` | No | Recommended zoom level when focused |
| `underMaintenance` | `boolean` | Yes | Whether facility has maintenance notice |
| `emoji` | `string` | No | Icon/emoji for marker |
| `isActive` | `boolean` | Yes | Whether marker is visible |
| `createdAt` | `Date` | Yes | Creation timestamp |
| `updatedAt` | `Date` | Yes | Last modified timestamp |

### Special Marker Properties
| Field | Type | Description |
|---|---|---|
| `isManagerOffice` | `boolean` | Marks as manager's office |
| `managerId` | `number \| null` | Associated manager user ID |

---

## Student View Data

### Map State
| Field | Type | Description |
|---|---|---|
| `markers` | `Marker[]` | All visible markers |
| `layers` | `{ [layerType]: boolean }` | Layer visibility toggles |
| `centerCoordinates` | `{ lat, lng }` | Map center position |
| `zoomLevel` | `number` | Current zoom |

### Layer Types
| Layer | Description |
|---|---|
| Academic Buildings | Lecture halls, labs |
| Admin Offices | Administrative buildings |
| Library | Library buildings |
| Sports | Sports facilities |
| Dining | Cafeterias, food courts |
| Parking | Parking areas |
| Services | Other services (banking, clinic, etc.) |

---

## Manager View Data

### Today's Teaching Rooms
| Field | Type | Description |
|---|---|---|
| `courseCode` | `string` | Course code |
| `courseName` | `string` | Course title |
| `room` | `string` | Room name |
| `time` | `string` | Time slot (e.g., "10:00–12:00") |
| `markerId` | `number \| null` | Associated map marker ID |

### Manager Profile
| Field | Type | Description |
|---|---|---|
| `officeBuilding` | `string` | Building name |
| `officeRoom` | `string` | Room number |
| `officeMarkerId` | `number` | Map marker ID for office |

### Today's Rooms Panel
| Field | Type | Description |
|---|---|---|
| `todaysRooms` | `TodayRoom[]` | Teaching rooms for today |
| `locateRoom(markerId)` | `function` | Pan/zoom to marker |

---

## Admin View Data

### Edit Mode State
| Field | Type | Description |
|---|---|---|
| `editMode` | `boolean` | Whether editing is enabled |
| `selectedMarker` | `Marker \| null` | Currently editing marker |

### Marker Form
| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | `string` | Yes | Text input |
| `type` | `string` | Yes | Select (all types) |
| `description` | `string` | No | Textarea |
| `floors` | `number` | No | Number input |
| `underMaintenance` | `boolean` | Yes | Switch toggle |
| `coordinates` | `{ lat, lng }` | Yes | Auto-set by clicking map (read-only on edit) |

### Coordinate Setting
| Mode | How Coordinates Are Set |
|---|---|
| Create | Click on map → auto-fill coordinates |
| Edit | Read-only (existing coordinates) |

---

## Derived/Computed Data

### Marker Display
| Field | Type | Description |
|---|---|---|
| `iconColor` | `string` | Color based on marker type |
| `maintenanceBadge` | `boolean` | Show ⚠ badge |
| `isHighlighted` | `boolean` | Pulse animation (manager office) |

### Locate Function
| Action | Description |
|---|---|
| Pan | Move map center to marker coordinates |
| Zoom | Set zoom level to marker's recommended level |
| Highlight | Brief pulse animation on marker |

---

## Maintenance Badge Display

### Visual Indicators
| State | Display |
|---|---|
| Under Maintenance | Marker shows ⚠ icon overlay, visible to all users |
| Normal | Standard marker display |

---

## Authorization Checks
| Check | Purpose |
|---|---|
| `hasRole("admin")` | Show Edit Map toggle, add/edit/delete markers, set maintenance |
| `hasRole("manager")` | Highlight office marker, show Today's Rooms panel |
| Student role | View map, search buildings, toggle layers |
