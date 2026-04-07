# Data Requirements — Attendance

**Route:** `/dashboard/academic/attendance`

---

## Student View Data

### Course Attendance Summary
| Field | Type | Required | Description |
|---|---|---|---|
| `courseId` | `number` | Yes | Course ID |
| `courseCode` | `string` | Yes | Course code |
| `courseName` | `string` | Yes | Course name |
| `totalSessions` | `number` | Yes | Total sessions held |
| `presentCount` | `number` | Yes | Sessions attended |
| `absentCount` | `number` | Yes | Sessions missed |
| `lateCount` | `number` | Yes | Late arrivals |
| `excusedCount` | `number` | Yes | Excused absences |
| `attendancePct` | `number` | Yes | `(presentCount / totalSessions) * 100` |
| `isAtRisk` | `boolean` | Yes | Below warning threshold |

### Session Record
| Field | Type | Description |
|---|---|---|
| `sessionId` | `number` | Session ID |
| `date` | `Date` | Session date |
| `status` | `"present" \| "absent" \| "late" \| "excused"` | Attendance status |
| `disputeStatus` | `"none" \| "pending" \| "resolved" \| "rejected"` | Dispute state |
| `disputeReason` | `string \| null` | Student's dispute explanation |

### Dispute Dialog Data
| Field | Type | Required | Notes |
|---|---|---|---|
| `sessionDate` | `Date` | Yes | Display in dialog title |
| `currentStatus` | `string` | Yes | Current attendance status |
| `lecturerName` | `string` | Yes | "Prof. [Name]" for display |
| `reason` | `string` | Yes | Textarea (required) |

---

## Manager View Data

### Teaching Course
| Field | Type | Required | Description |
|---|---|---|---|
| `courseId` | `number` | Yes | Course ID |
| `courseCode` | `string` | Yes | Course code |
| `courseName` | `string` | Yes | Course name |
| `roster` | `StudentAttendance[]` | Yes | Student list with attendance |
| `sessions` | `AttendanceSession[]` | Yes | All session records |
| `thresholdPct` | `number` | Yes | Warning threshold (default 80%) |

### Student Attendance
| Field | Type | Description |
|---|---|---|
| `studentId` | `number` | Student user ID |
| `studentName` | `string` | Display name |
| `studentNumber` | `string` | Student ID number |
| `attendancePct` | `number` | Overall attendance percentage |
| `sessionRecords` | `{ sessionId: number, status: string }[]` | Per-session status |
| `isAtRisk` | `boolean` | Below threshold |

### Attendance Session
| Field | Type | Description |
|---|---|---|
| `sessionId` | `number` | Session ID |
| `date` | `Date` | Session date |
| `records` | `{ [studentId: string]: "P" \| "A" \| "L" \| "E" }` | Student → status map |

### Quick Mark Overlay
| Field | Type | Description |
|---|---|---|
| `sessionDate` | `Date` | Today's date |
| `courseName` | `string` | Course name |
| `students` | `Student[]` | Roster list |
| `markedCount` | `number` | Students marked so far |
| `totalCount` | `number` | Total students |

---

## Admin View Data

### At-Risk Students (All Courses)
| Field | Type | Description |
|---|---|---|
| `studentId` | `number` | Student user ID |
| `studentName` | `string` | Display name |
| `studentNumber` | `string` | Student ID number |
| `courseCode` | `string` | Course code |
| `courseName` | `string` | Course name |
| `attendancePct` | `number` | Attendance percentage |
| `lastSessionDate` | `Date \| null` | Last session date |
| `sessionsMissed` | `number` | Total sessions missed |
| `thresholdPct` | `number` | Current threshold |

### Policy Settings
| Field | Type | Description |
|---|---|---|
| `warningThreshold` | `number` | Default 80% |
| `updatedAt` | `Date \| null` | Last policy update time |
| `updatedBy` | `string \| null` | Admin who last updated |

### Bulk Excuse Form
| Field | Type | Required | Notes |
|---|---|---|---|
| `dateFrom` | `Date` | Yes | Start date |
| `dateTo` | `Date` | Yes | End date |
| `courses` | `number[]` | Yes | Selected course IDs (or "All") |
| `reason` | `string` | Yes | Textarea |
| `affectedSessions` | `number` | Yes | Preview count |
| `affectedStudents` | `number` | Yes | Preview count |

---

## Session Status Codes

| Code | Meaning | Color |
|---|---|---|
| `P` | Present | Green |
| `A` | Absent | Red |
| `L` | Late | Amber |
| `E` | Excused | Blue |

---

## Edit Reason Dialog (Manager)

| Field | Type | Required | Notes |
|---|---|---|---|
| `sessionDate` | `Date` | Yes | Display in title |
| `studentName` | `string` | Yes | Display |
| `currentStatus` | `string` | Yes | Current value |
| `newStatus` | `"P" \| "A" \| "L" \| "E"` | Yes | Select dropdown |
| `reason` | `string` | Yes | Textarea (required for past sessions) |

---

## Derived/Computed Data

### Display Helpers
| Field | Type | Description |
|---|---|---|
| `formattedDate` | `string` | Session date display (e.g., "Mar 3") |
| `attendanceBarColor` | `string` | Color based on percentage |
| `riskBadge` | `{ label, color }` | At-risk indicator |
| `sessionsMissedDisplay` | `string` | "N of M sessions missed" |

### Threshold Calculations
```
isAtRisk = attendancePct < thresholdPct
sessionsNeeded = ceil((thresholdPct/100 * remainingSessions) - presentCount)
```

---

## Authorization Checks
| Check | Purpose |
|---|---|
| `hasRole("admin")` | View all at-risk students, set policy, bulk excuse |
| `hasRole("manager")` | Take attendance, edit sessions, quick mark, export |
| Student role | View own attendance, dispute sessions |
| `isTeaching(course)` | Manager can only manage attendance for own courses |
