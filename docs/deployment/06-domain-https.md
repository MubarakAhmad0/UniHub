# Lesson 6: Domain and HTTPS Setup

In this lesson, you'll connect a custom domain and enable automatic HTTPS. This makes your app accessible at a real URL instead of the default `.onrender.com` subdomain.

---

## Understanding Domains

### Without Custom Domain
```
https://unihub.onrender.com  ← Long, generic, hard to remember
```

### With Custom Domain
```
https://unihub.youruniversity.edu  ← Professional, memorable
```

---

## Prerequisites

Before starting, you need:
- A domain name (e.g., from Namecheap, GoDaddy, Cloudflare)
- Access to your domain's DNS settings

---

## Step 1: Get Your Render DNS Target

1. Go to your Render dashboard
2. Click on your **unihub** web service
3. Click **"Custom Domains"** in the sidebar
4. Click **"Add Domain"**

```
┌─────────────────────────────────────────────────────┐
│  Custom Domains                                      │
│  ─────────────────────────────────────────────      │
│                                                     │
│  No custom domains configured                      │
│                                                     │
│  + Add Domain                                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

5. Enter your desired domain (e.g., `unihub.youruniversity.edu`)
6. Click **"Add Domain"**

Render will show you the **DNS target** to point your domain to:

```
┌─────────────────────────────────────────────────────┐
│  Add Custom Domain                                   │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  Your domain: unihub.youruniversity.edu            │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  DNS Target                                  │   │
│  │  ─────────────────                           │   │
│  │  unihub.onrender.com                        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ✦ Add a CNAME record pointing your domain         │
│    to the DNS target above.                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Step 2: Configure DNS Records

Now you need to add a DNS record with your domain provider.

### Option A: CNAME (Most Common)

If your domain is `unihub.youruniversity.edu`:

| Record Type | Name/Host | Value/Target |
|-------------|-----------|--------------|
| CNAME | unihub | unihub.onrender.com |

### Option B: Apex Domain (no subdomain)

If you want to use just `youruniversity.edu` (without `unihub.`):

| Record Type | Name/Host | Value/Target |
|-------------|-----------|--------------|
| ALIAS | @ | unihub.onrender.com |

> **Note**: Not all registrars support ALIAS. Use a service like Cloudflare for apex domains.

---

### Example: Cloudflare DNS Setup

1. Log into Cloudflare
2. Select your domain
3. Go to **"DNS"** → **"Add record"**

```
┌─────────────────────────────────────────────────────┐
│  DNS Management                                     │
│  ─────────────────────────────────────────────────  │
│  Type    Name      Content              Proxy      │
│  ────    ────      ───────              ─────      │
│  CNAME   unihub    unihub.onrender.com  Proxied    │
│                                                     │
│  + Add record                                       │
└─────────────────────────────────────────────────────┘
```

### Example: Namecheap Setup

1. Log into Namecheap
2. Go to **"Domain List"** → **"Manage"** → **"Advanced DNS"**

```
┌─────────────────────────────────────────────────────┐
│  DNS Settings                                        │
│  ─────────────────────────────────────────────────  │
│  Type          Host         Value                   │
│  ────          ────         ──────                  │
│  CNAME Record  unihub       unihub.onrender.com    │
└─────────────────────────────────────────────────────┘
```

---

## Step 3: Verify DNS Propagation

After adding the DNS record, it can take **up to 24 hours** to propagate (usually much faster - 5-30 minutes).

### Check DNS Status

In your Render dashboard, next to your custom domain, it should show:

```
┌─────────────────────────────────────────────────────┐
│  Custom Domains                                      │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  unihub.youruniversity.edu          ✓ Active      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Test It

Open your custom domain in a browser:
```
https://unihub.youruniversity.edu
```

---

## Step 4: HTTPS (SSL/TLS)

**Great news**: Render provides **automatic HTTPS** for free!

### How It Works

1. After pointing your domain to Render
2. Render automatically provisions an SSL certificate
3. Let's Encrypt handles certificate management
4. Certificate auto-renews before expiration

### Verify HTTPS

Once your domain is active:

1. Visit `https://unihub.youruniversity.edu`
2. Click the lock icon in the browser address bar

```
🔒 HTTPS | Connection secure
Certificate valid
Issued by: Let's Encrypt
```

---

## Step 5: Update Environment Variable

After setting up your custom domain, update the app URL:

1. Go to your Render dashboard → **Environment**
2. Update these variables:

```
NEXT_PUBLIC_APP_URL=https://unihub.youruniversity.edu
NEXTAUTH_URL=https://unihub.youruniversity.edu
```

3. Save and wait for redeploy

---

## Troubleshooting

### Domain Shows "Not Verified"

**Problem**: DNS not pointing correctly
**Solution**:
- Double-check CNAME record
- Wait for propagation (up to 24 hours)
- Use https://dnschecker.org to verify

### HTTPS Not Working

**Problem**: Lock icon doesn't appear
**Solution**:
- Wait for certificate provisioning (can take 5-15 minutes after domain activates)
- Ensure you're using `https://` not `http://`

### Too Many Redirects

**Problem**: Browser shows "Too many redirects"
**Solution**:
- Check `NEXT_PUBLIC_APP_URL` matches your actual domain
- Update both `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL`

### 404 on Custom Domain

**Problem**: Domain loads but shows 404
**Solution**:
- Ensure DNS is fully propagated
- Check the CNAME is pointing to `unihub.onrender.com` (not `unihub.onrender.com/`)

---

## What You've Learned

✅ Configured custom domain in Render
✅ Added DNS records (CNAME)
✅ Enabled automatic HTTPS
✅ Updated environment variables for custom domain

---

## What's Next

In **Lesson 7**, we'll set up **GitHub Actions CI/CD** - automating lint checks, type checking, and triggering deployments automatically when you push code.

---

## DNS Record Summary

| Type | Use When | Example |
|------|----------|---------|
| CNAME | Subdomain (`unihub.`) | `unihub.youruniversity.edu` |
| ALIAS | Apex domain (`@`) | `youruniversity.edu` |

| Render Shows | You Point To |
|--------------|--------------|
| `unihub.onrender.com` | CNAME record |