# 14 · Clubs

**Route:** `/dashboard/community/clubs`

Students browse, join, and interact with student clubs and societies.

---

## Student (current build)

| Feature | Status |
|---|---|
| Browse clubs with category filter | ✅ |
| View club detail (description, members, president, activities) | ✅ |
| Join a club | ✅ |
| Leave a club | ✅ |
| View joined clubs (My Clubs tab) | ✅ |
| Create a new club | 🚫 (would need approval) |
| Manage club members or activities | 🚫 |

---

## Lecturer

Lecturers serve as **Faculty Advisors** to clubs — an oversight and endorsement role that clubs may be required to have. Advisors can view internal club details and provide formal endorsements.

| Feature | Status | Notes |
|---|---|---|
| Browse and discover all clubs | ✅ | |
| Join a club as a member | ✅ | |
| **Faculty Advisor dashboard** | 🆕 | A "My Advisory Clubs" tab showing clubs they advise |
| **View member roster** | 🆕 | For clubs they advise; full member list with join date and activity status |
| **View club activity / event history** | 🆕 | For clubs they advise; past and upcoming activities |
| **Endorse a club application** | 🆕 | When a new club is pending approval, the assigned advisor must endorse before admin finalises |
| **Endorse a club activity** | 🆕 | For clubs under their advisement; click "Endorse Activity" on activity requests to confirm faculty support |
| **Step down as advisor** | 🆕 | Remove themselves as advisor; triggers admin notification to assign new one |
| Approve/deny club creation | 🚫 | Admin finalises |
| Manage club finances | 🚫 | Admin/student affairs only |
| Remove club members | 🚫 | |

### UI changes needed
- **"My Advisory Clubs" tab** alongside All Clubs / My Clubs.
- **Advisory club card variant:** shows member count, pending endorsements badge, advisor badge on card.
- **Club detail (advisory view):** additional tabs: Roster, Activities, Pending Endorsements.
- **Endorse button** on pending activity rows in the Activities tab.

---

## Admin

Full club lifecycle management — creating, approving, managing budgets, and dissolving clubs.

| Feature | Status | Notes |
|---|---|---|
| All student and lecturer features | ✅ | |
| **Create a new club** | 🆕 | Name, description, category, founding members, assign faculty advisor |
| **Approve a club application** | 🆕 | After advisor endorsement; changes club status from Pending → Active |
| **Reject a club application** | 🆕 | With reason |
| **Edit any club's details** | 🆕 | Name, description, category, images |
| **Dissolve / archive a club** | 🆕 | Soft-delete; members are notified; club becomes read-only |
| **Assign / change faculty advisor** | 🆕 | Faculty selector on each club |
| **Manage club budget allocation** | 🆕 | Set budget per club; view spending requests |
| **Approve / reject budget requests** | 🆕 | Clubs submit budget requests; admin approves/rejects |
| **View all clubs in management table** | 🆕 | Sortable table: Name, Category, Members, Status, Advisor, Budget |
| **Force-remove a member** | 🆕 | E.g., disciplinary action; with reason log |

### UI changes needed
- **"Manage Clubs" tab** with data table.
- **"Create Club" button** in page header.
- **Club creation form (Sheet):** name, description, category, initial members (multi-name input), faculty advisor selector.
- **Approval queue section** in Manage tab: Pending tab showing clubs awaiting approval with Approve/Reject.
- **Budget panel** per club in detail view: allocated amount, spent amount, pending requests.
