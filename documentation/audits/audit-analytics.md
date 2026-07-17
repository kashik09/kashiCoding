# Repo Audit: Analytics + Ads

Generated: 2025-12-23 17:38:35 UTC

This report scans the codebase to confirm what is implemented vs stubbed/mocked for:
- Admin Analytics dashboard
- Analytics tracking/storage
- Ads and ad-consent logic

> Tip: This is a static scan. It does not run the app or hit endpoints.

---


## Repo basics

- **Project root**: /home/kashi-kweyu/projects/portfolio/my-portfolio
- **ripgrep (rg) available**: no
- **Node version (if available)**: v20.19.6
- **NPM version (if available)**: 10.8.2

## Admin analytics page

- **File exists: app/admin/analytics/page.tsx**: yes

### Signals (mock vs real)

- Looking for mock data / TODOs / setTimeout loading tricks
- **Conclusion**: No obvious mock markers found (may be wired)

### Network/API usage

_No fetch calls or analytics endpoints referenced in this file._

## Analytics tracking (client)

- **File exists: lib/useAnalytics.ts**: yes

### Vercel Analytics track() usage

_No @vercel/analytics track() calls found._

### Server ingest usage (should POST to /api/analytics/track)

- **Conclusion**: Tracking likely ONLY goes to Vercel Analytics (not queryable by your admin UI)

## Analytics API routes

- **Exists: app/api/analytics/track/route.ts**: no
- **Exists: app/api/admin/analytics/route.ts**: no

### Any analytics routes in app/api

_No analytics references under app/api._

## Database (Prisma) checks

- **File exists: prisma/schema.prisma**: yes

### Search for AnalyticsEvent model

- **Conclusion**: No AnalyticsEvent model found (DB analytics storage likely NOT implemented)

## Ads + Ad-consent

- **Exists: app/api/me/ad-consent/route.ts**: yes
- **Exists: components/CookieNotice.tsx**: yes
- **Exists: components/AdSlot.tsx**: yes

### Where ad-consent is called from

```
./sh-files/audit-analytics.sh:169:consent_hits="$(find_matches "/api/me/ad-consent|ad-consent" ".")"
```

### AdsEnabled gating (site settings)

```
./sh-files/audit-analytics.sh:179:ads_hits="$(find_matches "adsEnabled|adsProvider|adsClientId" ".")"
```

## Summary (best-effort conclusions)

- If **Admin Analytics page** shows mock markers and no fetch calls, it is UI-only.
- If **useAnalytics.ts** has track() but no POST to /api/analytics/track, analytics is not stored in your DB.
- If **prisma/schema.prisma** has no AnalyticsEvent model, DB analytics storage is not implemented.
- If **/api/me/ad-consent** is referenced on public pages, anonymous users will trigger 401s unless gated.

---

✅ Done. Generated: `AUDIT_ANALYTICS.md`

