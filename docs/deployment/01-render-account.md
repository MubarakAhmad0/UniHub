# Lesson 1: Render Account Setup

In this lesson, you'll set up your Render account and connect it to your GitHub repository. By the end, you'll have a Render project ready to receive your UniHub application.

---

## What is Render?

Render is a cloud platform that handles the heavy lifting of deploying your application:
- **Build** - Compiles your Docker image or detects your framework
- **Deploy** - Runs your application with automatic HTTPS
- **Scale** - Handles load balancing and optional auto-scaling
- **Database** - Provides managed PostgreSQL with automatic backups

It's simpler than AWS or Kubernetes but teaches you real deployment concepts.

---

## Step 1: Sign Up for Render

1. Go to **[render.com](https://render.com)**
2. Click **"Get Started"**
3. Choose **"Sign up with GitHub"** (easiest - uses your existing GitHub account)

```
┌─────────────────────────────────────────────┐
│           render.com                        │
│                                             │
│   ┌─────────────────────────────────┐       │
│   │  Sign up with GitHub            │       │
│   └─────────────────────────────────┘       │
│                                             │
│   ┌─────────────────────────────────┐       │
│   │  Sign up with Email             │       │
│   └─────────────────────────────────┘       │
│                                             │
└─────────────────────────────────────────────┘
```

4. Authorize Render to access your GitHub account
5. Complete the onboarding (name, project preferences - can skip most)

---

## Step 2: Understanding the Dashboard

Once logged in, you'll see the Dashboard:

```
┌─────────────────────────────────────────────────────────────┐
│  RENDER                                    [New +]          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Services                     │  Jobs                       │
│  ─────────────────────────    │  ─────────────────────      │
│  (empty yet)                 │  (shows past deployments)   │
│                                                             │
│  Postgres                     │  Static Sites               │
│  ─────────────────────────    │  (empty yet)                │
│  (empty yet)                 │                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Terms

| Term | Meaning |
|------|---------|
| **Service** | A running instance of your app (web service) |
| **Postgres** | Managed PostgreSQL database |
| **Static Site** | For hosting static HTML/CSS/JS |
| **Job** | One-off tasks (like running a script) |

---

## Step 3: Connect Your GitHub Repository

1. In the left sidebar, click **"New +"**
2. Select **"Web Service"**

```
┌─────────────────────────────────────────────┐
│  New +                                        │
│  ─────                                       │
│  Web Service   ← Select this                 │
│  Background Job                              │
│  PostgreSQL                                │
│  Redis                                        │
│  Static Site                                 │
│  Cron Job                                     │
└─────────────────────────────────────────────┘
```

3. On the next screen, look for **"Connect a repository"**

```
┌─────────────────────────────────────────────┐
│  Connect a repository                       │
│  ───────────────────────                    │
│  📦 GitHub      ← Click to connect           │
│  GitLab                                           │
│  Bitbucket                                     │
└─────────────────────────────────────────────┘
```

4. Select your **UniHub** repository from the list

---

## Step 4: Configure Basic Settings

After connecting your repo, you'll see the configuration screen:

```
┌────────────────────────────────────────────────────┐
│  Name: unihub                                     │
│  ─────────────────────────────────────────────    │
│  Branch: main                      ▼               │
│  Root Directory: (leave empty)                   │
│  Build Command: pnpm run build                   │
│  Start Command: node server.js                    │
└────────────────────────────────────────────────────┘
```

**Fill in these fields:**

| Field | Value | Why |
|-------|-------|-----|
| **Name** | `unihub` | Your service identifier |
| **Branch** | `main` | Default branch |
| **Root Directory** | (leave empty) | Project is at repo root |
| **Build Command** | `pnpm run build` | Compiles Next.js for production |
| **Start Command** | `node server.js` | Starts the standalone Next.js app |

> **Note**: Your Dockerfile already outputs a `standalone` build (see `next.config.mjs` line 17: `output: "standalone"`). This means the start command is `node server.js`, not `next start`.

---

## Step 5: Choose Plan

At the bottom of the page, you'll see pricing options:

```
┌────────────────────────────────────────────────────┐
│  Pricing                                          │
│  ─────────────────────────────────────────────    │
│  ○ Free     $0/mo                                 │
│  ● Starter  $7/mo                                 │
│  ○ Pro      $25/mo                                │
└────────────────────────────────────────────────────┘
```

**For now:** Select **Free** (we'll test everything first)

The free tier:
- Sleeps after 15 minutes of inactivity
- 750 hours/month
- 1GB RAM limit

---

## Step 6: Add Environment Variables (For Now - Skip)

You'll see an **"Environment Variables"** section. For now:
- Leave it empty
- We'll add all required variables in Lesson 3

---

## Step 7: Create the Service

1. Click **"Create Web Service"** at the bottom

```
┌────────────────────────────────────────────────────┐
│              Create Web Service  (button)           │
└────────────────────────────────────────────────────┘
```

2. Render will start building - you'll see logs:

```
┌─────────────────────────────────────────────────────┐
│  BUILDING...                                        │
│  ─────────────────────────────────────────────      │
│  [2024-01-15 10:30:45] Cloning repository...        │
│  [2024-01-15 10:30:47] Detected Node.js app         │
│  [2024-01-15 10:30:48] Installing dependencies...   │
│  [2024-01-15 10:31:12] Running build command...     │
│  [2024-01-15 10:32:05] Build completed!            │
│  [2024-01-15 10:32:07] Deploying...                │
└─────────────────────────────────────────────────────┘
```

---

## Step 8: Wait for Deployment

The first build takes 3-5 minutes. Watch the logs!

When complete, you'll see:

```
┌─────────────────────────────────────────────────────┐
│  ✓ Service is live!                                │
│  ─────────────────────────────────────────────      │
│  URL: https://unihub.onrender.com                   │
└─────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### "Build Failed" Errors

**Problem**: Build command fails
**Solution**:
- Check the build logs in the **"Logs"** tab
- Most common issue: missing dependencies
- Your `package.json` must have pnpm as package manager

**Fix**: If Render doesn't detect pnpm, add this to your **Environment Variables**:
```
Key: npm_config_pnpm
Value: https://pnpm.peter.sh/
```

### "Application Error" After Deploy

**Problem**: App starts but crashes
**Solution**:
- Check the **"Logs"** tab
- Most common: missing environment variables
- We'll fix this in Lesson 3

---

## What You've Learned

✅ Created a Render account connected to GitHub
✅ Configured a Web Service for UniHub
✅ Understood the build and deploy flow

## What's Next

In **Lesson 2**, we'll create your PostgreSQL database on Render - essential for UniHub to store users, sessions, and all application data.

---

## Commands Reference

None for this lesson - everything was done through the Render UI.

## Related Files

- Your GitHub repository is now linked to Render
- No local changes needed