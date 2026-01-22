# Local Development Guide

## What Was Fixed

### 1. Configuration Error ✓
**Problem:** NextAuth showed `error=Configuration` on login page

**Root Cause:** `.env` file was reduced to only `DATABASE_URL`, losing OAuth and email provider credentials that NextAuth requires.

**Solution:** Restored full `.env` from backup with all provider credentials. `.env.local` now overrides only database URLs for local development.

### 2. Missing Data ✓
**Problem:** Local database was empty, no projects/products visible

**Root Cause:**
- `npm run db:seed` was seeding **Supabase** (remote) instead of **local Docker**
- Node scripts don't automatically load `.env.local`

**Solution:** Created `sh-files/seed-local.sh` script that explicitly loads `.env.local` before seeding.

### 3. Offline Fonts ✓
**Problem:** Build failed trying to fetch Inter font from Google Fonts

**Solution:** Replaced with system font stack (no network required)

---

## Current Setup

### Environment Files

**`.env`** (committed, used in production):
- Supabase database URLs (remote)
- OAuth credentials (Google, GitHub)
- Email server config
- Other production settings

**`.env.local`** (gitignored, local only):
- Overrides database URLs to point to local Docker
- Local NextAuth URL and secret
- **Takes precedence** over `.env`

### Database Setup

**Remote (Supabase):**
- Database: `postgres`
- Has your production data
- Used by default if you delete `.env.local`

**Local (Docker):**
- Container: `myportfolio-pg`
- Database: `myportfolio`
- Empty by default, seeded with sample data
- Used when `.env.local` exists

---

## Common Tasks

### Start Local Development

```bash
# 1. Start Docker Postgres
bash sh-files/db-up.sh

# 2. Seed local database with sample data (first time only)
bash sh-files/seed-local.sh

# 3. Start dev server
npm run dev
```

### Database Operations (Local)

```bash
# Check migration status
bash sh-files/prisma-local.sh migrate status

# Apply migrations
bash sh-files/prisma-local.sh migrate deploy

# Create new migration
bash sh-files/prisma-local.sh migrate dev --name your_migration_name

# Open Prisma Studio (database GUI)
bash sh-files/prisma-local.sh studio

# Seed database
bash sh-files/seed-local.sh
```

### Switch Between Local and Remote

**Use Local Docker:**
```bash
# Keep .env.local file (overrides to local Docker)
# Database: myportfolio @ localhost:5432
```

**Use Supabase:**
```bash
# Temporarily rename .env.local
mv .env.local .env.local.backup

# Now uses .env settings (Supabase)
# Database: postgres @ Supabase
```

### Build and Deploy

```bash
# Build locally (offline-safe)
npm run build

# Deploy to production (uses .env, not .env.local)
vercel --prod
```

---

## File Reference

| File | Purpose | Committed? |
|------|---------|------------|
| `.env` | Production config (Supabase, OAuth) | ✓ Yes |
| `.env.local` | Local overrides (Docker Postgres) | ✗ No (gitignore) |
| `sh-files/db-up.sh` | Start/manage Docker container | ✗ No (gitignore) |
| `sh-files/prisma-local.sh` | Run Prisma with local env | ✗ No (gitignore) |
| `sh-files/seed-local.sh` | Seed local database | ✗ No (gitignore) |

---

## Current Data

### Local Docker Database
```
projects:         1 (JS Calculator)
digital_products: 5 (Portfolio starters, templates)
users:            0 (create via signup)
site_settings:    1 (configured)
```

### Supabase Database
- Contains your actual production data
- Not modified by local development
- Safe to use for development if needed

---

## Troubleshooting

### "Configuration" error on login
- Ensure `.env` has all OAuth credentials
- Check `.env` wasn't overwritten

### "Table does not exist" error
- Run: `bash sh-files/db-up.sh`
- Run: `bash sh-files/prisma-local.sh migrate deploy`

### No data showing in app
- Run: `bash sh-files/seed-local.sh`
- Verify: `docker exec myportfolio-pg psql -U postgres -d myportfolio -c "SELECT COUNT(*) FROM projects;"`

### Build fails (Google Fonts)
- Fixed! Using system fonts now
- No network required for builds

### Wrong database being used
- Check which env file exists: `ls -la .env*`
- `.env.local` = Local Docker
- No `.env.local` = Supabase

---

## Summary

✅ **Offline-friendly:** No Google Fonts network fetch
✅ **Local Docker:** Full database in container
✅ **Sample data:** Seeded with projects & products
✅ **NextAuth fixed:** No more Configuration errors
✅ **Production safe:** Remote data untouched

Your app now runs fully offline with local Docker Postgres! 🎉

---

## Importing Production Data

If you need to sync your local database with production Supabase data:

```bash
# Quick import script (one-time use)
SUPABASE_URL="<your-supabase-url>" \
LOCAL_URL="postgresql://postgres:postgres@localhost:5432/myportfolio?schema=public" \
node -e "
  const { PrismaClient } = require('@prisma/client');
  // ... see import-data.mjs for full script
"
```

**Note:** Your production data on Supabase is never modified. Imports are one-way: Supabase → Local Docker.

To re-import latest data, clear local and import again:
```bash
docker exec myportfolio-pg psql -U postgres -d myportfolio -c "TRUNCATE TABLE projects CASCADE;"
# Then run import script again
```
