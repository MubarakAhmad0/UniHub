# Lesson 9: Go-Live Checklist

In this lesson, you'll verify everything is ready for production. This checklist ensures your application is secure, functional, and ready for real users.

---

## Pre-Flight Checklist

Run through this list before announcing to users. Check each item:

---

## ✅ 1. Application Functionality

| Check | Verified |
|-------|----------|
| Login page loads at `/` | ☐ |
| Users can sign up | ☐ |
| Users can log in | ☐ |
| Users can log out | ☐ |
| Dashboard loads after login | ☐ |
| Navigation works | ☐ |
| Forms submit successfully | ☐ |
| No console errors in browser | ☐ |

---

## ✅ 2. Database

| Check | Verified |
|-------|----------|
| All tables created | ☐ |
| Can create new users | ☐ |
| Sessions persist | ☐ |
| Roles can be assigned | ☐ |
| Permissions work correctly | ☐ |

**Verify tables** - Go to PostgreSQL dashboard:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

---

## ✅ 3. Authentication

| Check | Verified |
|-------|----------|
| Email/password login works | ☐ |
| Session persists across page refreshes | ☐ |
| Logout clears session | ☐ |
| Protected routes redirect to login | ☐ |
| Invalid credentials show error | ☐ |

---

## ✅ 4. Email (If Configured)

| Check | Verified |
|-------|----------|
| Can request password reset | ☐ |
| Password reset email sends | ☐ |
| OTP emails send (if configured) | ☐ |

**Note**: If you haven't set up email yet, this will be a limitation to fix later.

---

## ✅ 5. Environment Variables

| Variable | Value Set |
|----------|-----------|
| `DB_URL` | ☐ |
| `AUTH_SECRET` | ☐ |
| `NODE_ENV` = production | ☐ |
| `NEXT_PUBLIC_APP_URL` | ☐ |
| `EMAIL_USER` (if email enabled) | ☐ |
| `EMAIL_PASS` (if email enabled) | ☐ |
| `AUTH_GOOGLE_ID` (if OAuth enabled) | ☐ |
| `AUTH_GOOGLE_SECRET` (if OAuth enabled) | ☐ |

---

## ✅ 6. Security

| Check | Verified |
|-------|----------|
| No credentials in code | ☐ |
| AUTH_SECRET is long and random | ☐ |
| Environment variables not exposed in UI | ☐ |
| No sensitive data in client-side code | ☐ |

---

## ✅ 7. Build & Deployment

| Check | Verified |
|-------|----------|
| `pnpm run build` passes locally | ☐ |
| GitHub Actions pipeline passes | ☐ |
| Render deployment succeeds | ☐ |
| No build warnings in logs | ☐ |

---

## ✅ 8. Domain & HTTPS

| Check | Verified |
|-------|----------|
| Custom domain resolves correctly | ☐ |
| HTTPS works (lock icon in browser) | ☐ |
| Mixed content warnings none | ☐ |
| Redirects work properly | ☐ |

---

## ✅ 9. Performance

| Check | Verified |
|-------|----------|
| Page loads under 3 seconds | ☐ |
| No memory leaks | ☐ |
| Database queries are fast | ☐ |
| Static assets cached | ☐ |

---

## ✅ 10. Monitoring

| Check | Verified |
|-------|----------|
| Can access logs | ☐ |
| Know how to check service status | ☐ |
| Health endpoint works (if added) | ☐ |
| Notification settings configured | ☐ |

---

## Final Deployment Steps

### 1. Create a Test User

Create a test account that you can use to verify everything works:

```bash
# Using the assign-role script
pnpm exec tsx scripts/assign-role.ts test@example.com admin
```

Or use the web interface to create an admin user.

### 2. Document the URL

Write down your production URL:

```
Production URL: https://unihub.youruniversity.edu
(or https://unihub.onrender.com if using default domain)
```

### 3. Back Up Database

Go to PostgreSQL dashboard → **Backups**:

- Verify automatic backups are enabled
- Create a manual backup before launch

### 4. Update Environment Variables for Production

If using a custom domain, ensure:

```
NEXT_PUBLIC_APP_URL=https://your-actual-domain.com
NEXTAUTH_URL=https://your-actual-domain.com
```

---

## Optional: Add a "Maintenance Mode" Banner

If you want to show a banner to users during final testing, you can add a global banner in `app/layout.tsx`. Remove it after go-live.

---

## What You've Learned

✅ Verified all application functionality
✅ Confirmed database is working correctly
✅ Tested authentication flows
✅ Validated security settings
✅ Checked build and deployment pipeline
✅ Verified domain and HTTPS
✅ Ensured monitoring is in place

---

## What's Next?

### Immediate Post-Launch

1. **Monitor for 48 hours** - Watch logs for any errors
2. **Check metrics** - CPU, memory, response times
3. **Gather feedback** - Have a few users test

### Future Improvements

| Feature | When to Add |
|---------|-------------|
| Email (SendGrid/Resend) | When you need reliable email |
| Redis caching | When you need better performance |
| Custom domain | When ready to brand |
| Multiple environments (staging) | When you want to test safely |
| Better monitoring | When you need more visibility |
| CI/CD for branches | When you have multiple developers |

---

## Congratulations! 🎉

You've completed the UniHub deployment guide!

### What You've Built

- ✅ Production-ready Next.js application
- ✅ PostgreSQL database with proper schema
- ✅ Automated CI/CD pipeline
- ✅ Monitoring and health checks
- ✅ Custom domain with HTTPS

### Your Production URL

```
https://unihub.youruniversity.edu
```

---

## Need Help?

If you run into issues:

1. **Check the logs** - Usually shows the problem
2. **Review this guide** - Each lesson has troubleshooting sections
3. **Search the error** - Most issues have known solutions
4. **Debug locally** - Replicate the issue locally first

---

## Related Documentation

- `docs/routes.md` - Application routes
- `docs/database.md` - Database schema
- `docs/lib.md` - Authentication and permissions
- `docs/components.md` - UI components