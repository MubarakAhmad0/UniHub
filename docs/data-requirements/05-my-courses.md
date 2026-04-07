# Data Requirements — My Courses

**Route:** `/dashboard/academic/my-courses`

---

## Student View Data

### Enrolled Course
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Course ID |
| `code` | `string` | Yes | Course code (e.g., "CS 601") |
| `title` | `string` | Yes | Course name |
| `lecturerName` | `string` | Yes | Lecturer display name |
| `progress` | `number` | Yes | Completion percentage (0-100) |
| `currentGrade` | `string \| null` | No | Current letter grade |
| `credits` | `number` | Yes | Credit hours |
| `semester` | `string` | Yes | Current semester |
| `nextDeadline` | `Date \| null` | No | Next upcoming assignment/exam date |
| `materialsCount` | `number` | Yes | Available course materials count |
| `announcementsCount` | `number` | Yes | Unread course announcements |

### Upcoming Deadline
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Assignment/exam ID |
| `courseCode` | `string` | Associated course code |
| `title` | `string` | Assignment/exam title |
| `dueDate` | `Date` | Due date and time |
| `type` | `"assignment" \| "exam" \| "quiz"` | Assessment type |
| `weight` | `number` | Percentage of final grade |
| `isSubmitted` | `boolean` | Whether student has submitted |

### Course Material
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Material ID |
| `title` | `string` | File/document title |
| `type` | `"pdf" \| "video" \| "link" \| "other"` | Material type |
| `uploadDate` | `Date` | When uploaded |
| `url` | `string` | Download/access URL |
| `fileSize` | `string \| null` | File size (e.g., "2.4 MB") |

---

## Manager View Data

### Teaching Course
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | Course ID |
| `code` | `string` | Yes | Course code |
| `title` | `string` | Yes | Course name |
| `enrolledCount` | `number` | Yes | Total enrolled students |
| `assignmentCount` | `number` | Yes | Total assignments created |
| `avgAttendance` | `number` | Yes | Average attendance percentage |
| `semester` | `string` | Yes | Current semester |
| `credits` | `number` | Yes | Credit hours |

### Course Material (Manager)
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Material ID |
| `name` | `string` | File name |
| `uploadDate` | `Date` | When uploaded |
| `status` | `"draft" \| "published"` | Visibility state |
| `url` | `string` | File URL |

### Assignment (Manager)
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Assignment ID |
| `title` | `string` | Assignment title |
| `description` | `string` | Full description |
| `dueDate` | `Date` | Due date and time |
| `maxMarks` | `number` | Maximum score |
| `isVisible` | `boolean` | Whether visible to students |
| `submissionsCount` | `number` | Number of student submissions |

### Roster Student
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Student user ID |
| `name` | `string` | Student display name |
| `studentId` | `string` | Student ID number |
| `attendancePct` | `number` | Attendance percentage |
| `currentGrade` | `string \| null` | Current letter grade |

---

## Admin View Data

### All Courses Table
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Course ID |
| `code` | `string` | Course code |
| `title` | `string` | Course name |
| `faculty` | `string` | Faculty/department |
| `lecturerName` | `string` | Lecturer display name (editable) |
| `enrolledCount` | `number` | Currently enrolled |
| `capacity` | `number` | Maximum capacity |
| `status` | `"open" \| "limited" \| "full" \| "closed"` | Enrollment status |
| `semester` | `string` | Current semester |

### Filter Options
| Filter | Data Source |
|---|---|
| Faculty | All unique faculties |
| Semester | All active semesters |
| Status | Open / Limited / Full / Closed |
| Search | Course code, title, lecturer name |

---

## Form Data

### Force Enroll Dialog
| Field | Type | Required | Notes |
|---|---|---|---|
| `studentSearch` | `string` | Yes | Search by name or student ID |
| `selectedStudent` | `User` | Yes | Selected student |
| `reason` | `string` | No | Optional reason note |

### Force Drop Dialog
| Field | Type | Required | Notes |
|---|---|---|---|
| `enrolledStudents` | `User[]` | Yes | Currently enrolled list |
| `selectedStudent` | `User` | Yes | Student to drop |
| `reason` | `string` | Yes | Required reason |

### Upload Material Form (Manager)
| Field | Type | Required | Notes |
|---|---|---|---|
| `file` | `File` | Yes | File upload |
| `title` | `string` | Yes | Display title |
| `status` | `"draft" \| "published"` | Yes | Initial visibility |

### New Assignment Form (Manager)
| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | `string` | Yes | Assignment title |
| `description` | `string` | Yes | Full instructions |
| `dueDate` | `Date` | Yes | Due date + time |
| `maxMarks` | `number` | Yes | Maximum score |
| `isVisible` | `boolean` | Yes | Student visibility toggle |

---

## Drawer Tabs Data (Manager Course Detail)

### Materials Tab
- List of materials with name, date, status
- Upload button
- Per-file: publish toggle, delete button

### Assignments Tab
- List of assignments with title, due date, max marks, visibility
- "New Assignment" button
- Submissions count per assignment

### Roster Tab
- Table: Name, Student ID, Attendance %, Grade

### Grades Tab
- Class average, highest score, lowest score
- Link to detailed marks page

### Attendance Tab
- Class attendance percentage bar chart
- Link to attendance management page

---

## Authorization Checks
| Check | Purpose |
|---|---|
| `hasRole("admin")` | Show all courses table, force enroll/drop, edit lecturer |
| `hasRole("manager")` | Show teaching courses only, manage materials/assignments/roster |
| Student role | Show enrolled courses only, view materials, submit assignments |
| `isEnrolled(course)` | Student can only see courses they're enrolled in |
| `isTeaching(course)` | Manager can only manage courses they teach |
