# Data Requirements — Marks & GPA

**Route:** `/dashboard/academic/marks`

---

## Student View Data

### GPA Summary
| Field | Type | Required | Description |
|---|---|---|---|
| `cumulativeGPA` | `number` | Yes | Overall GPA (e.g., 3.45) |
| `currentSemesterGPA` | `number` | Yes | Current semester GPA |
| `totalCreditsEarned` | `number` | Yes | Total credits completed |
| `totalCreditsRequired` | `number` | No | Credits needed for graduation |
| `academicStanding` | `"good" \| "warning" \| "probation"` | Yes | Academic status |

### Semester Breakdown
| Field | Type | Description |
|---|---|---|
| `semester` | `string` | Semester name (e.g., "Fall 2024") |
| `semesterGPA` | `number` | GPA for this semester |
| `courses` | `CourseMark[]` | Courses taken this semester |

### Course Mark
| Field | Type | Description |
|---|---|---|
| `courseId` | `number` | Course ID |
| `courseCode` | `string` | Course code |
| `courseName` | `string` | Course title |
| `credits` | `number` | Credit hours |
| `components` | `MarkComponent[]` | Individual assessment marks |
| `totalMarks` | `number` | Total score achieved |
| `maxTotalMarks` | `number` | Maximum possible score |
| `percentage` | `number` | `(totalMarks / maxTotalMarks) * 100` |
| `grade` | `string` | Letter grade (A/B/C/D/F) |
| `isPublished` | `boolean` | Whether marks are finalized |

### Mark Component
| Field | Type | Description |
|---|---|---|
| `name` | `string` | Component name (e.g., "A1", "Midterm", "Final") |
| `achieved` | `number` | Score achieved |
| `maxMarks` | `number` | Maximum possible score |
| `weight` | `number` | Weight percentage of total |
| `submittedDate` | `Date \| null` | When submitted/graded |

### Grade Trend
| Field | Type | Description |
|---|---|---|
| `semesters` | `string[]` | Semester labels for x-axis |
| `gpas` | `number[]` | GPA per semester for chart |

---

## Manager View Data

### Teaching Course with Grades
| Field | Type | Required | Description |
|---|---|---|---|
| `courseId` | `number` | Yes | Course ID |
| `courseCode` | `string` | Yes | Course code |
| `courseName` | `string` | Yes | Course name |
| `isSubmitted` | `boolean` | Yes | Whether marks submitted to registry |
| `submittedAt` | `Date \| null` | No | When submitted to registry |
| `students` | `StudentGrade[]` | Yes | Class roster with grades |

### Student Grade
| Field | Type | Description |
|---|---|---|
| `studentId` | `number` | Student user ID |
| `studentName` | `string` | Display name |
| `studentNumber` | `string` | Student ID number |
| `a1` | `number` | Assignment 1 score |
| `a2` | `number` | Assignment 2 score |
| `midterm` | `number` | Midterm exam score |
| `final` | `number` | Final exam score |
| `total` | `number` | Sum of all components |
| `maxTotal` | `number` | Maximum possible total |
| `grade` | `string` | Calculated letter grade |
| `rowState` | `"saved" \| "unsaved"` | Edit state indicator |

### Grade Distribution
| Field | Type | Description |
|---|---|---|
| `gradeCounts` | `{ A: number, B: number, C: number, D: number, F: number }` | Count per grade |
| `classAvg` | `number` | Average total percentage |
| `highest` | `number` | Highest total percentage |
| `lowest` | `number` | Lowest total percentage |

---

## Admin View Data

### Student Transcript
| Field | Type | Description |
|---|---|---|
| `studentId` | `number` | Student user ID |
| `studentName` | `string` | Display name |
| `studentNumber` | `string` | Student ID number |
| `programme` | `string` | Degree programme |
| `faculty` | `string` | Faculty |
| `cumulativeGPA` | `number` | Overall GPA |
| `semesterMarks` | `SemesterMark[]` | All semester marks |

### Semester Mark (Admin Transcript)
| Field | Type | Description |
|---|---|---|
| `semester` | `string` | Semester name |
| `courses` | `TranscriptCourse[]` | Courses with grades |

### Transcript Course
| Field | Type | Description |
|---|---|---|
| `courseCode` | `string` | Course code |
| `courseName` | `string` | Course title |
| `credits` | `number` | Credit hours |
| `grade` | `string` | Letter grade |
| `gradePoints` | `number` | Grade points (A=4.0, B=3.0, etc.) |

### Audit Log Entry
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Log entry ID |
| `courseCode` | `string` | Course code |
| `studentName` | `string` | Student name |
| `component` | `string` | Mark component changed |
| `oldValue` | `number` | Previous score |
| `newValue` | `number` | New score |
| `changedBy` | `string` | User who made the change |
| `timestamp` | `Date` | When changed |
| `reason` | `string` | Reason for change |

### Publish Status
| Field | Type | Description |
|---|---|---|
| `courseId` | `number` | Course ID |
| `courseCode` | `string` | Course code |
| `status` | `"draft" \| "published"` | Publication state |
| `publishedAt` | `Date \| null` | When published |

---

## Form Data

### Edit Reason Dialog (Manager)
| Field | Type | Required | Notes |
|---|---|---|---|
| `originalValue` | `number` | Yes | Display only |
| `newValue` | `number` | Yes | Number input |
| `reason` | `string` | Yes | Textarea (required after submission) |

### Override Dialog (Admin)
| Field | Type | Required | Notes |
|---|---|---|---|
| `originalValue` | `number` | Yes | Display only |
| `newValue` | `number` | Yes | Number input |
| `reason` | `string` | Yes | Textarea (required) |

### Student Search (Admin)
| Field | Type | Required | Notes |
|---|---|---|---|
| `searchQuery` | `string` | Yes | Name or student ID |
| `results` | `Student[]` | Yes | Matching students |

---

## Grade Calculation

### Grade Letter Helper
```
pct >= 85 → A (4.0)
pct >= 75 → B (3.0)
pct >= 65 → C (2.0)
pct >= 50 → D (1.0)
pct < 50  → F (0.0)
```

### GPA Calculation
```
GPA = Σ(gradePoints × credits) / Σ(credits)
```

---

## Tab Data (Admin)

### By Course Tab
- Same grade table as manager view
- Override button per cell

### By Student Tab
- Student search
- Full transcript view

### Audit Log Tab
- Table: Course, Student, Component, Old Value, New Value, Changed By, Timestamp, Reason
- Filters: Course, Date range, Changed By

### Publish Tab
- List of courses with publish/unpublish controls
- Status indicators

---

## Authorization Checks
| Check | Purpose |
|---|---|
| `hasRole("admin")` | Show all courses, override any mark, publish/unpublish, view audit log |
| `hasRole("manager")` | Edit grades for own courses, submit to registry |
| Student role | View own grades only |
| `isSubmitted` | Flag edits after submission (requires reason) |
| `isTeaching(course)` | Manager can only edit grades for own courses |
