# Data Requirements — Study Plan

**Route:** `/dashboard/academic/study-plan`

---

## Student View Data

### Study Plan
| Field | Type | Required | Description |
|---|---|---|---|
| `studentId` | `number` | Yes | Student user ID |
| `programme` | `string` | Yes | Degree programme name |
| `faculty` | `string` | Yes | Faculty name |
| `currentSemester` | `number` | Yes | Current semester number |
| `totalCreditsRequired` | `number` | Yes | Total credits for graduation |
| `totalCreditsCompleted` | `number` | Yes | Credits earned so far |
| `totalCreditsInProgress` | `number` | Yes | Credits currently enrolled |
| `isEndorsed` | `boolean` | Yes | Whether advisor has endorsed |
| `endorsedBy` | `string \| null` | No | Advisor name |
| `endorsedAt` | `Date \| null` | No | When endorsed |

### Semester Plan
| Field | Type | Description |
|---|---|---|
| `semester` | `number` | Semester number |
| `semesterLabel` | `string` | Display label (e.g., "Fall 2024") |
| `courses` | `PlannedCourse[]` | Courses in this semester |
| `creditsPlanned` | `number` | Total credits this semester |

### Planned Course
| Field | Type | Description |
|---|---|---|
| `courseId` | `number` | Course ID |
| `courseCode` | `string` | Course code |
| `courseName` | `string` | Course title |
| `credits` | `number` | Credit hours |
| `category` | `"core" \| "elective" \| "free-elective"` | Requirement category |
| `status` | `"completed" \| "enrolled" \| "planned" \| "substituted"` | Enrollment state |
| `grade` | `string \| null` | Letter grade (if completed) |
| `substituteFor` | `string \| null` | Original course code if substituted |

### Degree Requirements
| Field | Type | Description |
|---|---|---|
| `coreCredits` | `number` | Required core credits |
| `electiveCredits` | `number` | Required elective credits |
| `freeElectiveCredits` | `number` | Required free elective credits |
| `coreCompleted` | `number` | Core credits earned |
| `electiveCompleted` | `number` | Elective credits earned |
| `freeElectiveCompleted` | `number` | Free elective credits earned |

---

## Manager View Data (Advisor Mode)

### Advisee
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Student user ID |
| `name` | `string` | Display name |
| `studentNumber` | `string` | Student ID number |
| `programme` | `string` | Degree programme |
| `faculty` | `string` | Faculty |
| `currentSemester` | `number` | Current semester |
| `isEndorsed` | `boolean` | Whether plan is endorsed |
| `studyPlan` | `StudyPlan` | Full study plan data |

### Advisor Toolbar Actions
| Action | Data Needed |
|---|---|
| Add Note | `courseId`, `noteText` |
| Suggest Substitution | `currentCourseId`, `substituteCourseId`, `reason` |
| Endorse Plan | `studentId` (toggles `isEndorsed`) |

### Add Note Dialog
| Field | Type | Required | Notes |
|---|---|---|---|
| `courseCode` | `string` | Yes | Display only |
| `courseName` | `string` | Yes | Display only |
| `note` | `string` | Yes | Textarea |

### Suggest Substitution Dialog
| Field | Type | Required | Notes |
|---|---|---|---|
| `currentCourse` | `Course` | Yes | Selector |
| `substituteCourse` | `Course` | Yes | Selector |
| `reason` | `string` | Yes | Textarea |
| **Result** | `pending approval` | | Sent to admin queue |

---

## Admin View Data

### Student Plan Search
| Field | Type | Required | Notes |
|---|---|---|---|
| `searchQuery` | `string` | Yes | Name or student ID |
| `results` | `Student[]` | Yes | Matching students |

### Substitution Queue
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Request ID |
| `studentId` | `number` | Student user ID |
| `studentName` | `string` | Display name |
| `studentNumber` | `string` | Student ID number |
| `replaceCourseCode` | `string` | Course to replace |
| `replaceCourseName` | `string` | Course name |
| `withCourseCode` | `string` | Substitute course code |
| `withCourseName` | `string` | Substitute course name |
| `reason` | `string` | Student's reason |
| `submittedDate` | `Date` | When submitted |
| `status` | `"pending" \| "approved" \| "rejected"` | Review state |

### Program Configuration
| Field | Type | Description |
|---|---|---|
| `id` | `number` | Program ID |
| `name` | `string` | Programme name |
| `faculty` | `string` | Faculty |
| `coreCreditsRequired` | `number` | Required core credits |
| `electiveCreditsRequired` | `number` | Required elective credits |
| `freeElectiveCreditsRequired` | `number` | Required free elective credits |
| `requiredCourses` | `number[]` | Course IDs required |
| `updatedAt` | `Date \| null` | Last update time |

---

## Course Slot Display Data

### Course Slot Card
| Field | Type | Description |
|---|---|---|
| `courseCode` | `string` | Course code |
| `courseName` | `string` | Course name |
| `credits` | `number` | Credit hours |
| `category` | `string` | Requirement type |
| `status` | `string` | Visual indicator |
| `grade` | `string \| null` | Grade if completed |
| `hasAdvisorNote` | `boolean` | Whether advisor added note |
| `advisorNote` | `string \| null` | Note content |

---

## Endorsement Banner

### Endorsed State
| Field | Value |
|---|---|
| Icon | CheckCircle (green) |
| Text | "Your plan has been endorsed by **[Advisor Name]**" |
| Color | `bg-emerald-50 border-emerald-200` |

### Not Endorsed State
| Field | Value |
|---|---|
| Icon | ℹ️ |
| Text | "Your plan hasn't been endorsed by an advisor yet. You can still enroll." |
| Color | `bg-muted text-muted-foreground` |

---

## Authorization Checks
| Check | Purpose |
|---|---|
| `hasRole("admin")` | Search any student's plan, view substitution queue, edit programs |
| `hasRole("manager")` | View advisees' plans (read-only), add notes, suggest substitutions, endorse |
| Student role | View own plan, see endorsement status |
| `isAdvisor(student)` | Manager can only advise their assigned students |
