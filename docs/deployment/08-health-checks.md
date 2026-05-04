# Lesson 8: Health Checks and Monitoring

In this lesson, you'll learn how to monitor your application, check its health, and debug issues when they arise. This is essential for maintaining a production application.

---

## Why Monitoring Matters

```
┌─────────────────────────────────────────────────────────────┐
│                  Without Monitoring                          │
│  ────────────────────────────────────────────────────       │
│                                                             │
│  ✗ User reports: "Site is down!"                           │
│  ✗ You have no idea what's wrong                           │
│  ✗ Users wait for you to fix it                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  With Monitoring                            │
│  ────────────────────────────────────────────────────       │
│                                                             │
│  ✓ Dashboard shows: "DB connection failed"                │
│  ✓ You know immediately what's wrong                       │
│  ✓ Can fix before users notice                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Step 1: Check Application Status on Render

Render provides built-in health information:

1. Go to your Render dashboard
2. Click on your **unihub** service
3. Look at the status indicator:

```
┌─────────────────────────────────────────────────────┐
│  unihub                                              │
│  ─────────────────                                  │
│                                                     │
│  Status:  ● Live (healthy)                         │
│  Uptime:  99.9% (last 30 days)                     │
│  Deploy:  #12 (2 hours ago)                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Step 2: View Application Logs

Logs are your primary debugging tool. Access them from:

1. Your service dashboard
2. Click **"Logs"** tab

```
┌─────────────────────────────────────────────────────┐
│  LOGS                                    [Search ▼] │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  10:30:15 AM: Starting application...              │
│  10:30:16 AM: Database connected                   │
│  10:30:17 AM: Auth initialized                     │
│  10:30:18 AM: Server listening on port 3000        │
│  10:30:19 AM: Application ready                    │
│                                                     │
│  10:45:22 AM: GET / 200                             │
│  10:45:35 AM: POST /api/auth/sign-in 200           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Log Features

| Feature | Use |
|---------|-----|
| **Search** | Filter logs by keyword |
| **Filter** | Show only errors/warnings |
| **Download** | Export logs for analysis |

---

## Step 3: Create a Health Endpoint (Optional)

For more detailed health checking, you can create a `/api/health` endpoint. Create `app/api/health/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  try {
    // Test database connection
    await db.query("SELECT 1");
    
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
```

This will be at: `https://unihub.onrender.com/api/health`

---

## Step 4: Configure Health Check URL (Optional)

Render can automatically check your health endpoint:

1. Go to your service → **Settings**
2. Under **Health Check**, add:

```
URL: /api/health
```

This lets Render restart your service automatically if it becomes unhealthy.

---

## Step 5: Monitor Key Metrics

### On Render Dashboard, Check:

| Metric | Normal Range | Warning Sign |
|--------|--------------|---------------|
| **Memory** | < 80% of limit | Constantly high |
| **CPU** | < 60% average | Consistently high |
| **Response Time** | < 500ms | > 2 seconds |
| **Uptime** | 99%+ | Any downtime |

```
┌─────────────────────────────────────────────────────┐
│  Metrics (last 7 days)                             │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  Memory:  ████████░░░░░░░  245MB / 1GB             │
│                                                     │
│  CPU:     ███░░░░░░░░░░░░  15% average            │
│                                                     │
│  Requests: 12,453 total                             │
│                                                     │
│  Avg Response: 142ms                                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Step 6: Set Up Alerts (Optional)

For important notifications, you can set up:

### A. Render Notifications (Built-in)

1. Go to **Account Settings** → **Notifications**
2. Enable email notifications for:
   - Deploy failures
   - Service down
   - Cron job failures

### B. Uptime Monitoring (External)

Use a free service like **UptimeRobot** or **Healthchecks.io**:

1. Create account at https://healthchecks.io
2. Add a new check for your URL
3. Get ping URL
4. Add as cron job or background check

---

## Step 7: Common Issues and Solutions

### Issue: Service Shows "Crashed"

**Symptoms**: Status shows "Crashed" or "Unhealthy"
**Check**:
1. Look at the **Logs** tab
2. Find the error message
3. Common fixes:

| Error | Solution |
|-------|----------|
| `Out of memory` | Reduce memory usage or upgrade plan |
| `Module not found` | Check dependencies installed |
| `Port in use` | Usually a code issue, check logs |

---

### Issue: High Memory Usage

**Symptoms**: Memory always near the limit
**Solutions**:
- Check for memory leaks in code
- Restart the service (Deploy → "Restart")
- Upgrade to paid plan with more RAM

---

### Issue: Slow Response Times

**Symptoms**: Page loads take several seconds
**Solutions**:
- Check database queries (enable DATABASE_LOGS)
- Look at the slow queries in logs
- Consider adding Redis cache

---

## Step 8: Log Persistence

By default, Render keeps logs for a limited time. To keep logs longer:

| Method | Retention |
|--------|-----------|
| Render Dashboard | Last 1000 lines |
| Download via UI | As needed |
| Export to external | Custom setup |

---

## What You've Learned

✅ Viewed application status on Render dashboard
✅ Accessed and searched application logs
✅ Created a health endpoint
✅ Monitored key metrics (CPU, memory, response time)
✅ Set up notifications for failures

---

## What's Next

In **Lesson 9**, we'll create a **Go-Live Checklist** - a comprehensive list of things to verify before announcing your application to users.

---

## Quick Reference

| Tool | URL/Location |
|------|---------------|
| Service Status | Render Dashboard → Your service |
| Logs | Render Dashboard → Your service → Logs |
| Health Endpoint | `/api/health` (if created) |
| Metrics | Render Dashboard → Your service → Metrics |