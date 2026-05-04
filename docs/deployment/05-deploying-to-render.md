# Lesson 5: Deploying to Render

In this lesson, we'll connect everything and deploy your UniHub application. By the end, your app will be live on the internet!

---

## Pre-Deployment Checklist

Before deploying, make sure you have:

| Item | Status |
|------|--------|
| ✅ GitHub repository connected to Render | From Lesson 1 |
| ✅ PostgreSQL database created | From Lesson 2 |
| ✅ All environment variables added | From Lesson 3 |
| ✅ Dockerfile verified | From Lesson 4 |
| ✅ Locally tested: `pnpm run build` | Must work |

---

## Step 1: Verify Environment Variables

Go to your Render dashboard → **unihub** web service → **Environment**.

You should have at least these variables:

```
DB_URL=postgres://unihub:***@unihub-db:5432/unihub
AUTH_SECRET=YOUR_SECRET_HERE
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NEXT_PUBLIC_APP_URL=https://unihub.onrender.com
```

---

## Step 2: Configure Build Settings

In your web service settings, verify these values:

```
┌─────────────────────────────────────────────────────┐
│  Build Settings                                      │
│  ──────────────────────────────────────────────      │
│                                                     │
│  Build Command:     pnpm run build                  │
│                                                     │
│  Publish Directory: /                               │
│                                                     │
│  Start Command:     node server.js                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Step 3: Trigger a Deployment

### Option A: Automatic (Push to GitHub)

Every time you push to your `main` branch, Render automatically builds and deploys:

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

Go to your Render dashboard - you'll see the build starting automatically:

```
┌─────────────────────────────────────────────────────┐
│  DEPLOYMENTS                                        │
│  ──────────────────────────────────────────────     │
│                                                     │
│  #3   Deploying...  (just now)                      │
│  #2   Deployed    (2 minutes ago)                  │
│  #1   Deployed    (5 minutes ago)                   │
└─────────────────────────────────────────────────────┘
```

### Option B: Manual Deploy

From the Render dashboard:
1. Click on your web service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## Step 4: Monitor the Build

The deployment will show logs in real-time:

```
┌─────────────────────────────────────────────────────┐
│  BUILD LOG                                           │
│  ──────────────────────────────────────────────     │
│  Cloning repository... (1s)                         │
│  Executing build command: pnpm run build...         │
│  ──────────────────────────────────────────────────  │
│  > unihub@4.0.0 build /app                          │
│  > next build                                       │
│                                                     │
│  ⚼  Phase: 1/5 (package)                            │
│  ✓   Run pnpm install (34.2s)                      │
│                                                     │
│  ⚼  Phase: 2/5 (nativeDependencies)                │
│  ✓   Native dependencies (12.1s)                   │
│                                                     │
│  ⚼  Phase: 3/5 (builder)                            │
│  ✓   Build Next.js (48.3s)                          │
│                                                     │
│  ⚼  Phase: 4/5 (runner)                            │
│  ✓   Build standalone (5.2s)                        │
│                                                     │
│  Build completed successfully! (2m 34s)             │
│  ──────────────────────────────────────────────────  │
│  Deploying application...                          │
└─────────────────────────────────────────────────────┘
```

---

## Step 5: Verify Deployment Success

After build completes, check:

### A. Check Service Status

Your service should show **"Live"**:

```
┌─────────────────────────────────────────────────────┐
│  unihub                                              │
│  ─────────────────                                  │
│                                                     │
│  Status:  ● Live (healthy)                          │
│                                                     │
│  URL: https://unihub.onrender.com                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### B. Check Application Logs

Click the **"Logs"** tab:

```
┌─────────────────────────────────────────────────────┐
│  LOGS                                               │
│  ─────────────────────────────────────────────────  │
│  10:30:15 AM: Database connected successfully      │
│  10:30:16 AM: Auth initialized                     │
│  10:30:17 AM: Server listening on port 3000        │
│  10:30:18 AM: Application ready                    │
└─────────────────────────────────────────────────────┘
```

### C. Visit the URL

Open your app URL in a browser:
```
https://unihub.onrender.com
```

You should see the UniHub login page!

---

## Step 6: Test Core Functionality

Once the app is live, test these basic features:

### Test 1: Sign Up a New User
1. Go to the login page
2. Click **"Sign up"**
3. Enter email, password, name
4. Click **"Create account"**

**Expected**: Account created, redirect to dashboard

### Test 2: Sign In
1. Sign out
2. Sign back in with your new account

**Expected**: Successful login, dashboard loads

### Test 3: Database Tables Created
1. Go to PostgreSQL dashboard in Render
2. Click **"Connect"** → **"PSQL Command"**
3. Run:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

**Expected**: You should see tables like `users`, `sessions`, `accounts`, `roles`, etc.

---

## Common Deployment Issues

### Issue: "Application Error" (Crash)

**Symptom**: App starts but immediately crashes
**Check**: 
- View the **Logs** tab
- Look for error messages

**Common fixes**:
| Error | Solution |
|-------|----------|
| `Missing DB_URL` | Add DB_URL in Environment |
| `Missing AUTH_SECRET` | Add AUTH_SECRET |
| `ECONNREFUSED` | Check DB connection string |
| `Module not found` | Check dependencies installed |

---

### Issue: Build Fails

**Symptom**: Build log ends with "Build failed"
**Check**:
- Look at the error in the build log

**Common fixes**:
| Error | Solution |
|-------|----------|
| `pnpm not found` | Check Dockerfile installs pnpm |
| `module not found` | Check package.json has all deps |
| `TypeScript errors` | Fix type errors locally first |

---

### Issue: 502 Bad Gateway

**Symptom**: URL shows "502 Bad Gateway"
**Check**:
- Service might have crashed
- Check the **Logs** tab

**Common fixes**:
| Error | Solution |
|-------|----------|
| Port not exposed | Dockerfile exposes 3000 |
| Start command wrong | Use `node server.js` |
| Crash on startup | Check all env vars present |

---

## Deployment Commands Reference

```bash
# Trigger deploy by pushing to main
git add .
git commit -m "Deploy to production"
git push origin main
```

---

## What You've Learned

✅ Deployed UniHub to Render
✅ Monitored build logs
✅ Verified application is running
✅ Tested basic functionality

---

## What's Next

In **Lesson 6**, we'll set up your **custom domain** and enable **HTTPS** - making your app accessible at a real domain like `unihub.youruniversity.edu`.

---

## Quick Reference

| Item | Value |
|------|-------|
| Your App URL | `https://unihub.onrender.com` |
| Build Command | `pnpm run build` |
| Start Command | `node server.js` |
| Port | 3000 |