# Product Naming Resolution (Decision #2)

**Status:** Requires confirmation
**Created:** 2026-01-11
**Decision Required By:** Before product launch

---

## Problem Statement

Conflicting product names exist across documentation:

**Name Variant 1:** "Next.js Portfolio Starter" (used in MASTER_PRICING_GUIDE.md)
**Name Variant 2:** "Next.js 14 SaaS Starter" (used in older pricing docs)

Both refer to the same product based on description matching, but inconsistent naming creates confusion.

---

## Evidence of Conflict

### Where "Portfolio Starter" Appears:
- **MASTER_PRICING_GUIDE.md** (lines 171-197)
  - Product name: "Next.js Portfolio Starter Template"
  - Description: "Production-ready portfolio website with JSON-based CMS, admin dashboard, multi-theme system"
  - Pricing: Personal $79, Team $149

### Where "SaaS Starter" Appears:
- **digital-products-catalog-pricing.md** (lines 34+, 615, 629, 691, 738, 967)
  - Product name: "Next.js 14 SaaS Starter"
  - Description varies but includes: "Multi-tenant SaaS boilerplate", "Authentication, billing, admin"
  - Pricing: Varies from $149 to $299 in different sections

### Where "SaaS/Portfolio Starter" Both Appear:
- **DOCUMENTATION_ARCHITECTURE_REPORT.md** (line 222)
  - "Next.js SaaS/Portfolio Starter" (slash indicates uncertainty)

---

## Analysis

### Option 1: These Are Different Products

**Hypothesis:** Portfolio Starter and SaaS Starter are separate products.

**Evidence Supporting This:**
- Different pricing ($79/$149 vs $149/$299)
- Different descriptions (portfolio focus vs SaaS/multi-tenant focus)
- SaaS starter mentions "billing integration" which portfolio doesn't

**Evidence Against This:**
- Both extract from same codebase (this portfolio platform)
- No indication of two separate product builds in codebase
- Would require building two distinct templates

**Verdict:** Unlikely - building two separate products not mentioned anywhere else.

---

### Option 2: Same Product, Different Names (LIKELY)

**Hypothesis:** Same product, naming evolved over time.

**Evidence Supporting This:**
- Both described as "Next.js 14" templates
- Both extractable from current portfolio codebase
- Timeline: Older docs say "SaaS Starter", newer docs say "Portfolio Starter"
- Description overlap: Authentication, dashboard, multi-theme

**Evidence Against This:**
- Different pricing tiers documented

**Verdict:** Most likely - name evolved from "SaaS Starter" to "Portfolio Starter" as project focus clarified.

---

### Option 3: Portfolio Starter is Simplified SaaS Starter

**Hypothesis:** Portfolio Starter is a lighter version without SaaS features.

**Evidence Supporting This:**
- Lower price point ($79 vs $149)
- Portfolio focused on content showcase
- SaaS focused on multi-tenant billing

**Evidence Against This:**
- No documentation of feature differences
- No indication of two build variants

**Verdict:** Possible but not documented anywhere.

---

## Recommended Resolution

### Primary Recommendation: Standardize on "Portfolio Starter"

**Rationale:**
1. **Accuracy:** Current codebase IS a portfolio platform, not a SaaS application
2. **Clarity:** "Portfolio Starter" accurately describes what's extractable
3. **Marketing:** More honest - current platform lacks SaaS-specific features (billing, multi-tenancy)
4. **Simplicity:** One product, one name, less confusion

**Action Items:**
- [ ] Confirm product name: "Next.js Portfolio Starter Template"
- [ ] Update all documentation to use consistent name
- [ ] Decide on final pricing tier (recommend $79 Personal, $149 Team from MASTER_PRICING_GUIDE)
- [ ] If future SaaS template is built, give it a different name ("Next.js SaaS Boilerplate")

---

### Alternative: Rename to "Full-Stack Next.js Starter"

**Rationale:**
- Neutral name (not portfolio, not SaaS-specific)
- Describes what it is: Full-stack Next.js application
- Leaves room for use cases (portfolio, SaaS, blog, etc.)

**Cons:**
- Less specific, harder to market
- "Starter" is generic

---

### Alternative: Keep "SaaS Starter" Name

**Rationale:**
- "SaaS" is trending keyword, better SEO
- Higher perceived value (justify $149-299 pricing)
- Competitive positioning vs other SaaS starters

**Cons:**
- Misleading - current platform is NOT a SaaS (no multi-tenancy, billing integration incomplete)
- Would require adding SaaS features to justify name
- Ethical concern about accurate marketing

**Not Recommended** - Inaccurate description of current codebase.

---

## Pricing Conflict Resolution

### Current Pricing Documented:

**MASTER_PRICING_GUIDE.md (2026-01-07):**
- Personal: $79
- Team: $149
- Enterprise: Contact

**digital-products-catalog-pricing.md (older):**
- Multiple prices listed: $149, $199, $299 (inconsistent)

### Recommended Final Pricing:

**Option A: MASTER_PRICING_GUIDE pricing (Recommended)**
- Personal: $79
- Team: $149
- Enterprise: Contact

**Justification:**
- Most recent pricing decision
- Competitive with market (under $100 for personal use)
- Aligns with value-based pricing (30-40 hours @ $50/hr = $1,500-2,000 dev cost, 5-10% pricing)

**Option B: Premium positioning**
- Personal: $99
- Team: $199
- Enterprise: Custom

**Justification:**
- Higher perceived value
- More margin for support costs
- Still under $200 (psychological threshold)

**Option C: Launch discount strategy**
- List price: Personal $99, Team $199
- Launch price: Personal $79, Team $149 (20% off first 50 customers)
- Creates urgency, rewards early adopters

---

## Feature Set Clarification

### What IS Included (Confirmed in Codebase):
- ✅ Next.js 14 App Router with TypeScript
- ✅ Authentication (NextAuth: email/password, Google, GitHub)
- ✅ User dashboard and admin panel
- ✅ Multi-theme system (13 themes via DaisyUI)
- ✅ Prisma database ORM (PostgreSQL)
- ✅ Project showcase / portfolio functionality
- ✅ Content management (JSON-based)
- ✅ File uploads and downloads
- ✅ Role-based access control (6 roles)
- ✅ 2FA for admins (TOTP)
- ✅ Responsive design (Tailwind CSS)

### What is NOT Included (Would Need for "SaaS Starter" Name):
- ❌ Multi-tenancy (no team workspaces)
- ❌ Stripe billing integration (payment integration incomplete)
- ❌ Subscription management (no recurring billing)
- ❌ Usage-based pricing logic
- ❌ Team invitation system (no invite flows)
- ❌ Webhook handlers (not implemented)

### Verdict:
- **"Portfolio Starter"** is accurate description
- **"SaaS Starter"** would be misleading until above features added

---

## Decision Matrix

| Criteria | Portfolio Starter | SaaS Starter | Full-Stack Starter |
|----------|-------------------|--------------|-------------------|
| **Accuracy** | ✅ Very accurate | ❌ Misleading | ✅ Accurate |
| **Marketing Appeal** | ⭐⭐⭐ Good | ⭐⭐⭐⭐ Better | ⭐⭐ Okay |
| **SEO Value** | ⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐ Good |
| **Competitive Positioning** | ⭐⭐⭐ Niche | ⭐⭐⭐⭐⭐ High-value | ⭐⭐ Generic |
| **Ethical Marketing** | ✅ Honest | ⚠️ Questionable | ✅ Honest |
| **Future Extensibility** | ⭐⭐⭐ Limited | ⭐⭐⭐⭐ High | ⭐⭐⭐⭐⭐ Very high |

**Recommendation:** Choose **"Portfolio Starter"** for honest marketing, or **"Full-Stack Starter"** for future flexibility.

---

## Questions for Confirmation

Before finalizing:

1. **Product Name:**
   - [ ] Confirm: "Next.js Portfolio Starter Template" (recommended)
   - [ ] OR: "Next.js Full-Stack Starter"
   - [ ] OR: Build SaaS features and justify "SaaS Starter" name

2. **Pricing:**
   - [ ] Confirm: Personal $79, Team $149 (MASTER_PRICING_GUIDE)
   - [ ] OR: Personal $99, Team $199 (premium positioning)
   - [ ] OR: Launch discount strategy

3. **Feature Set:**
   - [ ] Accept: Product is portfolio/dashboard template (not SaaS)
   - [ ] OR: Commit to adding SaaS features (multi-tenancy, billing, subscriptions)

4. **Future Products:**
   - [ ] If "SaaS Starter" is future product, give it different name: "Next.js SaaS Boilerplate" or "Next.js Multi-Tenant Starter"

---

## Implementation Checklist (If "Portfolio Starter" Confirmed)

- [ ] Update MASTER_PRICING_GUIDE.md (already correct)
- [ ] Update digital-products-catalog-pricing.md (replace all "SaaS Starter" with "Portfolio Starter")
- [ ] Update comprehensive-pricing-strategy.md (replace "SaaS Starter" references)
- [ ] Update DOCUMENTATION_ARCHITECTURE_REPORT.md (remove ambiguous "SaaS/Portfolio" slashes)
- [ ] Create product README for template (when extracted)
- [ ] Create marketing page copy (use "Portfolio Starter" consistently)
- [ ] Update any sales materials or mockups

**Estimated Time:** 1-2 hours to update all documentation

---

## Recommended Next Steps

1. **Human Decision Required:**
   - Confirm product name (Portfolio Starter vs SaaS Starter vs Full-Stack Starter)
   - Confirm pricing tier (MASTER_PRICING_GUIDE values or different)

2. **After Decision:**
   - Update all documentation for consistency
   - Add note to CURRENT_REALITY.md about product naming resolution
   - Update MASTER_PRICING_GUIDE.md if needed
   - Mark Decision #2 as resolved

---

**Decision Authority:** Kashi Kweyu (Owner)
**Status:** Awaiting confirmation
**Created:** 2026-01-11
**Last Updated:** 2026-01-11
