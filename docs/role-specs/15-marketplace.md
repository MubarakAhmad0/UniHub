# 15 · Marketplace

**Route:** `/dashboard/community/marketplace`

Peer-to-peer marketplace for buying and selling second-hand items within the campus community (textbooks, electronics, stationery, etc.)

---

## Student (current build)

| Feature | Status |
|---|---|
| Browse all listings with category filter | ✅ |
| View listing detail (photos, description, price, seller) | ✅ |
| Post a new listing | ✅ |
| Edit own listing | ✅ |
| Delete own listing | ✅ |
| Mark listing as sold | ✅ |
| Contact seller (message/chat link) | ✅ |
| Save / favourite a listing | ✅ |
| Report a listing | ✅ (may not be wired) |
| Moderate others' listings | 🚫 |

---

## Manager (Lecturer / Staff)

Managers (lecturers and staff) participate in the marketplace on equal footing with students. The marketplace is **open to all university members** — buying and selling is unrestricted by role.

| Feature | Status | Notes |
|---|---|---|
| All student features | ✅ | Identical experience — can post, edit, buy, contact, save |
| Moderate/remove others' listings | 🚫 | Admin only |

> **Note:** No UI changes needed for the lecturer role on this page.  
> Lecturers have the same capabilities as students and the same interface.

---

## Admin

Admins moderate the marketplace to keep it safe, on-topic, and rule-compliant.

| Feature | Status | Notes |
|---|---|---|
| All student features | ✅ | |
| **View all reported listings** | 🆕 | Reports queue with reason, reporter, reported listing |
| **Remove / take down any listing** | 🆕 | With reason sent to the seller |
| **Restore a removed listing** | 🆕 | If removed in error |
| **Ban a user from the marketplace** | 🆕 | Prevent a specific user from posting; with duration (temporary/permanent) |
| **Manage categories** | 🆕 | Add, rename, or remove listing categories |
| **Set marketplace policies** | 🆕 | Max price ceiling, prohibited items list, max images per listing |
| **View marketplace analytics** | 🆕 | Total listings, active vs sold, most active sellers, top categories |

### UI changes needed
- **"Moderation" tab** in page (admin only): sub-tabs for Reported Listings and Banned Users.
- **Reported Listings table:** Listing title, Reporter, Reason, Date, Actions (Review / Remove / Dismiss).
- **Listing detail (admin):** additional "Admin Actions" section: Remove, Restore, Warn Seller.
- **"Manage Categories" section** in moderation: list with rename/delete + "Add Category" button.
- **Policy settings form:** configurable marketplace rules.
