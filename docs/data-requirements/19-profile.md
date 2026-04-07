# Data Requirements — Profile Settings

**Route:** `/dashboard/profile`

---

## Server-Side Data (Initial Load)

### Session User
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `number` | Yes | User ID |
| `name` | `string` | Yes | Display name |
| `email` | `string` | Yes | Email address |
| `role` | `"student" \| "manager" \| "admin"` | Yes | User role |
| `emailVerified` | `boolean` | Yes | Whether email is verified |
| `image` | `string \| null` | No | Avatar URL |
| `createdAt` | `Date` | Yes | Account creation date |

---

## Personal Tab Data

### Profile Form Fields
| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | `string` | Yes | Text input (pre-filled) |
| `email` | `string` | Yes | Text input (pre-filled, read-only?) |
| `phone` | `string` | No | Text input |
| `dateOfBirth` | `Date` | No | Date picker |
| `gender` | `string` | No | Select |
| `address` | `string` | No | Textarea |
| `emergencyContactName` | `string` | No | Text input |
| `emergencyContactPhone` | `string` | No | Text input |

### Password Form Fields
| Field | Type | Required | Notes |
|---|---|---|---|
| `currentPassword` | `string` | Yes | Password input |
| `newPassword` | `string` | Yes | Password input |
| `confirmPassword` | `string` | Yes | Password input (must match new) |

---

## Academic Identity Tab (Manager Only)

### Staff Profile Form
| Field | Type | Required | Description |
|---|---|---|---|
| `department` | `string` | No | Academic department |
| `officeLocation` | `string` | No | Office building/room |
| `officeHours` | `string` | No | Office hours description |
| `bio` | `string` | No | Professional bio |
| `researchInterests` | `string[]` | No | List of interests |
| `publications` | `string[]` | No | List of publications |
| `websiteUrl` | `string` | No | Personal/academic website |
| `assignedCourses` | `Course[]` | No | Courses currently teaching |

---

## Derived/Computed Data

### Account Security
| Field | Type | Description |
|---|---|---|
| `hasVerifiedEmail` | `boolean` | Email verification status |
| `lastPasswordChange` | `Date \| null` | When password was last changed |
| `activeSessions` | `number` | Number of active login sessions |
| `twoFactorEnabled` | `boolean` | Whether 2FA is enabled |

---

## Tab Visibility

### Personal & Security Tab
| Role | Visible |
|---|---|
| Student | ✅ |
| Manager | ✅ |
| Admin | ✅ |

### Academic Identity Tab
| Role | Visible |
|---|---|
| Student | ❌ |
| Manager | ✅ |
| Admin | ❌ (or ✅ if admin can edit own academic info) |

---

## Authorization Checks
| Check | Purpose |
|---|---|
| Session required | Must be logged in to access |
| `role === "manager"` | Show Academic Identity tab |
| `isOwnProfile` | Can only edit own profile (admin may edit others) |
