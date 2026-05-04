# Lesson 2: PostgreSQL Database Setup

In this lesson, you'll create a managed PostgreSQL database on Render. This is critical - your entire application depends on it: users, sessions, permissions, courses, announcements, everything.

---

## What is PostgreSQL?

PostgreSQL is a powerful, open-source relational database. It's the backbone of UniHub:

```
┌────────────────────────────────────────────────────────────┐
│                    Your Application                        │
│  ┌──────────────────────────────────────────────────┐     │
│  │  Next.js App (UniHub)                           │     │
│  └──────────────────────────────────────────────────┘     │
│                          │                                 │
│                          ▼                                 │
│  ┌──────────────────────────────────────────────────┐     │
│  │  PostgreSQL Database                            │     │
│  │  ─────────────────────────────────────────────   │     │
│  │  • users        • sessions                      │     │
│  │  • accounts     • permissions                   │     │
│  │  • roles        • course data                   │     │
│  │  • announcements • forum posts                   │     │
│  └──────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────┘
```

Render provides **managed PostgreSQL** - they handle backups, maintenance, and infrastructure. You just connect and use it.

---

## Step 1: Create PostgreSQL Database

1. In your Render dashboard, click **"New +"**
2. Select **"PostgreSQL"**

```
┌─────────────────────────────────────────────┐
│  New +                                        │
│  ─────                                       │
│  Web Service                                  │
│  Background Job                              │
│  PostgreSQL      ← Select this               │
│  Redis                                        │
│  Static Site                                 │
│  Cron Job                                     │
└─────────────────────────────────────────────┘
```

---

## Step 2: Configure Database Settings

You'll see a configuration screen:

```
┌─────────────────────────────────────────────────────┐
│  New PostgreSQL                                     │
│  ───────────────────────────────────────────────   │
│                                                     │
│  Name: unihub-db                                    │
│                                                     │
│  Database: unihub                                   │
│                                                     │
│  User: unihub                                       │
│                                                     │
│  Region: Oregon (US West)          ← Choose closest │
│                                                     │
│  Pricing                                           │
│  ─────────────────────────────────────────────      │
│  ○ Free    $0/mo    (256MB RAM)                    │
│  ● Starter $7/mo    (256MB RAM)                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Fill in these fields:**

| Field | Value | Why |
|-------|-------|-----|
| **Name** | `unihub-db` | Service name (lowercase, no spaces) |
| **Database** | `unihub` | Database name |
| **User** | `unihub` | Database user |
| **Region** | Choose closest to you | Lower latency |

---

## Step 3: Select Plan

| Plan | Cost | Use Case |
|------|------|----------|
| **Free** | $0/mo | Development, testing |
| **Starter** | $7/mo | Small production app |
| **Pro** | $25/mo | Production with high traffic |

**For now**: Select **Free** ($0/mo)

The free tier includes:
- 256MB RAM
- 1GB storage
- Daily backups (retained for 7 days)
- Automatic maintenance

---

## Step 4: Create the Database

Click **"Create Database"** at the bottom.

Wait 1-2 minutes for provisioning:

```
┌─────────────────────────────────────────────────────┐
│  Creating PostgreSQL instance...                   │
│  This usually takes 1-2 minutes.                   │
│                                                     │
│  ████████████████ 100%                              │
└─────────────────────────────────────────────────────┘
```

---

## Step 5: Get Connection Details

Once created, you'll see the database dashboard:

```
┌─────────────────────────────────────────────────────────────────┐
│  unihub-db                                                       │
│  ─────────────────                                              │
│                                                                  │
│  Connection    Internal URL    External URL                     │
│  ─────────    ───────────    ─────────────                     │
│                                                                  │
│  Username: unihub                                                │
│  Password: *********************************                     │
│  Host: unihub-db.internal                                       │
│  Port: 5432                                                     │
│  Database: unihub                                               │
│                                                                  │
│  ─────────────────────────────────────────────────────────      │
│  Connections can be made via the internal network               │
│  from other Render services at:                                │
│  postgres://unihub:password@unihub-db:5432/unihub                │
└─────────────────────────────────────────────────────────────────┘
```

### Why Two URLs?

| URL Type | Use Case |
|----------|----------|
| **Internal URL** | For apps **also running on Render** - faster, private |
| **External URL** | For apps running **outside Render** - local dev, other cloud |

Since your web service will also be on Render, **use the Internal URL**.

---

## Step 6: Copy the Connection String

Click the **copy button** next to the internal URL:

```
postgres://unihub:********************************@unihub-db:5432/unihub
```

This is your `DB_URL` for the environment variables!

It follows this format:
```
postgres://[username]:[password]@[host]:[port]/[database]
```

---

## Step 7: Connect Web Service to Database

Now you need to tell your Web Service about this database:

1. Go to your **unihub** Web Service (from Lesson 1)
2. Click **"Environment"** in the sidebar
3. Add a new environment variable:

```
Key:   DB_URL
Value: postgres://unihub:YOUR_PASSWORD@unihub-db:5432/unihub
```

> **Important**: Replace `YOUR_PASSWORD` with the actual password from the database dashboard.

---

## Step 8: Verify Connection

After adding DB_URL, your app will **automatically redeploy**.

1. Wait for deployment to complete (2-3 minutes)
2. Check the **"Logs"** tab
3. Look for successful database connection:

```
[DATABASE] Connection established
```

Or if there are errors, you'll see them in the logs.

---

## Important: Database Migrations

Your app needs to create all the tables before it can work. Right now, the database is empty - just the schema.

### Option A: Let Drizzle Push (Development)

In your `db/index.ts`, the code handles the connection. But you need to run the schema push.

**For production on Render**, add this to your **Environment Variables**:

```
Key:   NODE_ENV
Value: production
```

Then when the app starts, you might need to run migrations manually.

### Option B: Using Drizzle Studio

We haven't set this up for production yet. Here's how to do it:

1. Add to your **Environment Variables**:
```
Key:   DATABASE_PUSH
Value: true
```

2. In your `db/index.ts`, add conditional push on startup (for dev only):

```typescript
// Only for initial setup - remove after first run
if (process.env.DATABASE_PUSH === "true") {
  console.log("Database schema will be pushed on next deployment");
}
```

Actually, let's make this simpler. Here's what works on Render:

### Step 9: Force Schema Sync

Add this environment variable to trigger Drizzle push:

```
Key:   PUSHER_URL
Value: http://localhost:3001  (placeholder, not used)
```

Wait - the simplest approach is to use a **Post-deployment script**.

### Step 10: Create a Seed Script

Create a script that runs on deploy. Add to your package.json:

```json
"scripts": {
  "deploy:setup": "pnpm drizzle-kit push"
}
```

Then in Render, add to your **Build Command**:

```
pnpm install && pnpm run deploy:setup && pnpm run build
```

---

## Troubleshooting

### "Connection Refused" Error

**Problem**: App can't connect to database
**Solution**:
1. Verify DB_URL is correct
2. Ensure both services (Web Service + PostgreSQL) are in the **same region**
3. Check the password is correct

### "Database Does Not Exist" Error

**Problem**: Database name is wrong
**Solution**:
1. Check the database name in PostgreSQL dashboard
2. Ensure it's `unihub` (or whatever you set)

### "Role Does Not Exist" Error

**Problem**: Tables haven't been created
**Solution**:
Run the Drizzle push command - see Step 10 above.

---

## What You've Learned

✅ Created a managed PostgreSQL database on Render
✅ Connected it to your Web Service
✅ Understood internal vs external connection URLs

---

## Environment Variable Summary

Add this to your Web Service:

| Variable | Value | Source |
|----------|-------|--------|
| `DB_URL` | `postgres://unihub:***@unihub-db:5432/unihub` | PostgreSQL dashboard |

---

## What's Next

In **Lesson 3**, we'll cover **all** environment variables needed - auth secrets, SMTP for emails, OAuth credentials, and more. Without these, your app won't fully work.

---

## Related Files

- `db/index.ts` - Database connection
- `db/schema/` - All table definitions
- `drizzle.config.ts` - Drizzle configuration