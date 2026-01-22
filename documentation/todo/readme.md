# TODO Folder - Action Items

**Created:** 2026-01-11
**Purpose:** Track security fixes and implementation tasks

---

## Documents in This Folder

### 1. CRITICAL_SECURITY_FIXES.md
**Status:** Reference document
**Priority:** URGENT

Lists 6 critical security vulnerabilities with:
- Risk assessment (CVSS scores)
- Code locations to check
- Fix instructions
- Test commands

**Use this to:** Understand what security issues need attention

---

### 2. SECURITY_AUDIT_RESULTS.md
**Status:** Completed audit
**Priority:** Review findings

Audit results showing:
- ✅ 3 issues FIXED (path traversal, security headers, bcrypt)
- ⚠️ 2 issues PARTIAL (rate limiting, CSRF)
- ❌ 1 issue NOT FIXED (payment integration - BLOCKER)

**Use this to:** See current security status and prioritize remaining fixes

---

### 3. HYBRID_SITE_IMPLEMENTATION_PLAN.md
**Status:** Ready to execute
**Priority:** HIGH (business value)

Complete implementation guide for hybrid portfolio + shop + services site:
- 7 phases with detailed steps
- ~16 hours estimated work
- File-by-file changes listed
- Git commit strategy included

**Use this to:** Implement the new business model systematically

---

## Quick Action Summary

### 🔴 DO IMMEDIATELY (Security)

1. **CSRF Protection** (2 hours)
   - File: `lib/auth-options.ts`
   - Change: `sameSite: "lax"` → `sameSite: "strict"`
   - OR implement CSRF tokens

2. **Rate Limiting** (2-4 hours)
   - Check if NextAuth handles login rate limiting
   - Add rate limiting to auth routes if needed
   - Consider Upstash Redis for production

### 🚨 DO BEFORE LAUNCH (Critical Blocker)

3. **Payment Integration** (20-40 hours)
   - File: `app/api/memberships/purchase/route.ts` (line 38)
   - Install Stripe: `npm install stripe`
   - Implement payment intent creation
   - Add webhook handlers
   - Test end-to-end payments

---

## 🟢 DO FOR BUSINESS VALUE (Hybrid Site)

Follow `HYBRID_SITE_IMPLEMENTATION_PLAN.md` in this order:

1. **Phase 1:** Update navigation (2 hours)
2. **Phase 2:** Create pricing/students/enterprise pages (4 hours)
3. **Phase 3:** Update shop/services pages (3 hours)
4. **Phase 4:** Add project process documentation (2 hours)
5. **Phase 5:** Update legal pages (2 hours)
6. **Phase 7:** Test everything (2 hours)

**Total:** ~16 hours for complete hybrid implementation

---

## Priority Matrix

| Task | Impact | Effort | Priority | Timeline |
|------|--------|--------|----------|----------|
| Payment Integration | 🔴 Critical | 20-40h | P0 | Before launch |
| CSRF Fix | 🟡 High | 2h | P1 | This week |
| Rate Limiting | 🟡 High | 4h | P1 | This week |
| Hybrid Site (Nav) | 🟢 Medium | 2h | P2 | This week |
| Hybrid Site (Pages) | 🟢 Medium | 14h | P3 | Next 2 weeks |

---

## How to Use This Folder

1. **Review audit results** - Understand what's fixed vs what needs work
2. **Pick a priority** - Security first or business value first?
3. **Follow the plan** - Each document has step-by-step instructions
4. **Track progress** - Check off items as you complete them
5. **Commit systematically** - Use the git commit messages provided

---

## Decision Points

**Need your input on:**

1. **CSRF Protection:** Use `sameSite: strict` OR implement full CSRF tokens?
2. **Payment Provider:** Stripe (recommended) OR Flutterwave?
3. **Site Implementation:** Start now OR after security fixes?
4. **Navigation:** Use "Shop" OR "Products" as label?

---

## Next Steps

**Option A: Security First (Recommended)**
1. Fix CSRF (2 hours)
2. Add rate limiting (4 hours)
3. Integrate payments (40 hours)
4. Then implement hybrid site (16 hours)
**Total:** ~60 hours to production-ready

**Option B: Business Value First**
1. Implement hybrid site (16 hours)
2. Launch in "validation mode" with manual payments
3. Fix security gaps over time
4. Add real payments later
**Total:** 16 hours to validation launch

**Option C: Parallel Tracks**
1. Implement hybrid site (16 hours) - Designer/Frontend
2. Integrate payments (40 hours) - Backend developer
3. Run in parallel
**Total:** ~40 hours (if 2 people working)

---

**Last Updated:** 2026-01-11
**Status:** All documents complete and ready for execution
