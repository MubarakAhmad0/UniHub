# Lesson 3: Complete Environment Variables Reference

In this lesson, you'll configure every environment variable UniHub needs. This is critical - miss any variable and your app won't work properly.

---

## Why Environment Variables Matter

Environment variables store sensitive configuration that shouldn't be hardcoded:

```
┌─────────────────────────────────────────────────────────────┐
│                    Environment Variables                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   DATABASE    │  │     AUTH     │  │     SMTP     │     │
│  │   DB_URL      │  │  AUTH_SECRET │  │  EMAIL_USER  │     │
│  │               │  │               │  │  EMAIL_PASS  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    OAUTH     │  │    APP       │  │    OTHER     │     │
│  │  GOOGLE_ID   │  │  APP_URL     │  │  NODE_ENV    │     │
│  │  GOOGLE_SEC  │  │  NEXTAUTH_URL │  │  DATABASE_LOGS│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## All Environment Variables

Here's the complete list. I'll explain each one:

### 1. Database

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_URL` | ✅ Yes | PostgreSQL connection string |

**Example:**
```
postgres://unihub:password123@unihub-db:5432/unihub
```

---

### 2. Authentication (better-auth)

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_SECRET` | ✅ Yes | Secret key for signing auth tokens (JWT) |
| `NODE_ENV` | ✅ Yes | Set to `production` in Render |

**How to generate AUTH_SECRET:**

Run this in your local terminal:

```bash
# Using Node.js (recommended - installed with UniHub)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use an online generator: https://generate-secret.vercel.app/32

> **Important**: This secret is used to sign session tokens. If you lose it, users will be logged out. Keep it safe!

**Example:**
```
AUTH_SECRET=your-secret-key-here-32-chars-long-abcdef123456789
NODE_ENV=production
```

---

### 3. SMTP Email (Nodemailer)

| Variable | Required | Description |
|----------|----------|-------------|
| `EMAIL_USER` | ✅ Yes | Your email address (for Gmail, this is your full email) |
| `EMAIL_PASS` | ✅ Yes | App password (not your regular password!) |
| `EMAIL_FROM` | Optional | Sender name/email (defaults to EMAIL_USER) |

**For Gmail:**

1. Go to your Google Account → **Security**
2. Enable **2-Step Verification** (required)
3. Go to **App Passwords** (search "app password" in settings)
4. Create a new app password for "Mail"
5. Use that 16-character password as `EMAIL_PASS`

**Example:**
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
EMAIL_FROM=UniHub <your-email@gmail.com>
```

> ⚠️ **Important**: Gmail has strict rate limits (500 emails/day for free accounts). For production, consider SendGrid or Resend.

---

### 4. Google OAuth

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_GOOGLE_ID` | Optional | Google OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | Optional | Google OAuth Client Secret |

**How to get these:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Go to **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **OAuth client ID**
5. Set application type to **Web application**
6. Add authorized redirect URI:
   ```
   https://your-domain.com/api/auth/callback/google
   ```
7. Copy the **Client ID** and **Client Secret**

**Example:**
```
AUTH_GOOGLE_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 5. Application URLs

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | ✅ Yes | Your production URL |
| `NEXTAUTH_URL` | Optional | Same as APP_URL (for better-auth) |

**Example:**
```
NEXT_PUBLIC_APP_URL=https://unihub.onrender.com
NEXTAUTH_URL=https://unihub.onrender.com
```

> When using a custom domain later (e.g., `unihub.youruniversity.edu`), update this to your real domain.

---

### 6. Optional: Development/Debug

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_LOGS` | No | false | Log all SQL queries (useful for debugging) |

**Example:**
```
DATABASE_LOGS=false
```

---

## Complete Environment Variables List

Copy this template to add all variables to Render:

```
# ===================
# DATABASE
# ===================
DB_URL=postgres://unihub:YOUR_PASSWORD@unihub-db:5432/unihub

# ===================
# AUTHENTICATION
# ===================
AUTH_SECRET=YOUR_GENERATED_SECRET_HERE
NODE_ENV=production

# ===================
# EMAIL (SMTP)
# ===================
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx

# ===================
# GOOGLE OAUTH (Optional)
# ===================
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# ===================
# APPLICATION
# ===================
NEXT_PUBLIC_APP_URL=https://unihub.onrender.com
NEXTAUTH_URL=https://unihub.onrender.com

# ===================
# DEBUG (Optional)
# ===================
DATABASE_LOGS=false
```

---

## Adding Variables to Render

1. Go to your **unihub** Web Service
2. Click **"Environment"** in the sidebar
3. For each variable:
   - Click **"Add Environment Variable"**
   - Enter the **Key** (e.g., `DB_URL`)
   - Enter the **Value**
   - Click **"Save Changes"**

```
┌─────────────────────────────────────────────────────┐
│  Environment Variables                              │
│  ──────────────────────────────────────────────     │
│                                                     │
│  DB_URL           ●●●●●●●●●●●●●●  [Edit] [Delete]  │
│  AUTH_SECRET      ●●●●●●●●●●●●●●  [Edit] [Delete]  │
│  EMAIL_USER       ●●●●●●●●●●●●●●  [Edit] [Delete]  │
│  ...                                               │
│                                                     │
│  + Add Environment Variable                         │
└─────────────────────────────────────────────────────┘
```

---

## Verifying Your Configuration

After adding all variables:

1. Wait for automatic redeploy (2-3 minutes)
2. Check the **"Logs"** tab
3. Look for these success messages:

```
✓ Database connected
✓ Auth initialized
✓ Server started
```

---

## Troubleshooting

### "Missing AUTH_SECRET"

**Error**: `AUTH_SECRET must be set`
**Solution**: Generate and add AUTH_SECRET

### "Email not sending"

**Error**: `Authentication failed` or `Invalid credentials`
**Solution**:
- For Gmail: Use an **App Password**, not your regular password
- Check EMAIL_USER and EMAIL_PASS are correct

### "OAuth not working"

**Error**: `Invalid client ID` or callback error
**Solution**:
- Verify AUTH_GOOGLE_ID is correct
- Check redirect URI matches exactly in Google Console

### "Database connection failed"

**Error**: `ECONNREFUSED` or `Connection refused`
**Solution**:
- Verify DB_URL format is correct
- Ensure PostgreSQL service is running
- Check both services are in same region

---

## What You've Learned

✅ Configured all database connection variables
✅ Set up authentication secrets
✅ Configured email (SMTP) credentials
✅ Set up Google OAuth credentials (optional)
✅ Defined application URLs

---

## What's Next

In **Lesson 4**, we'll verify your Dockerfile is compatible with Render's build environment. Your existing Dockerfile should work, but let's confirm.

---

## Related Files

- `lib/auth.ts` - Uses AUTH_SECRET
- `lib/auth/send-email.ts` - Uses EMAIL_USER, EMAIL_PASS
- `db/index.ts` - Uses DB_URL
- `Dockerfile` - Build configuration