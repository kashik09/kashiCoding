# Master Pricing Guide

**Owner:** Kashi Kweyu Portfolio Platform
**Purpose:** Authoritative pricing strategy and product catalog
**Last Updated:** 2026-01-07
**Status:** Living document - pricing subject to validation

---

## Purpose of This Document

This document serves as the **single source of truth** for all pricing decisions across:
- Digital products (templates, components, tools)
- Services (consulting, development, maintenance)
- Memberships (credit-based access)

**This is not promotional material.** Prices listed reflect planning phase and require validation before implementation.

---

## Scope

### What This Document Covers:
- Pricing philosophy and frameworks
- Current service pricing
- Planned digital product pricing
- Membership tier structure
- Credit system (planned)
- Licensing tiers

### What This Document Does NOT Cover:
- Marketing copy or sales messaging
- Customer-facing product descriptions
- Payment integration technical details (see `/implementation`)

---

## Current Service Pricing

**Status:** Active - these prices are in use

| Service | Price (USD) | Price (UGX) | Notes |
|---------|-------------|-------------|-------|
| Web Development | From $500 | From 1,850,000 | Base price for small projects |
| Mobile Development | From $1,500 | From 5,500,000 | Native or cross-platform |
| UI/UX Design | From $300 | From 1,100,000 | Wireframes through mockups |
| Consulting | $100-150/hr | 370,000-555,000/hr | Technical guidance, code review |

**Pricing Model:** Value-based with cost-plus floor
**Minimum Hourly Rate:** $50/hr (break-even)
**Target Hourly Rate:** $75-150/hr (sustainable)

---

## Membership Tiers

**Status:** Implemented in code, payment integration pending

### Basic Access
- **Price:** $299 USD one-time
- **Credits:** 750 total
- **Duration:** 12 months (365 days)
- **Rollover:** None (0 credits)
- **Features:**
  - Documentation-only support
  - No rush work
  - Standard response time
  - Access to basic services
  - One-time purchase, no renewals

### Pro
- **Price:** $1,499 USD one-time
- **Credits:** 1,500 total (750/year for 2 years)
- **Duration:** 24 months (730 days)
- **Rollover:** Up to 300 credits (20% cap)
- **Features:**
  - Priority service queue
  - Priority reset requests
  - Yearly renewal option
  - Discounted add-ons
  - Advanced features access
  - Faster response time

### Managed
- **Price:** $499 USD/month
- **Credits:** 500 per month
- **Duration:** Monthly recurring
- **Rollover:** Up to 100 credits (20% cap)
- **Features:**
  - Hosting management included
  - Dedicated project manager
  - 24/7 priority support
  - Monthly or annual terms
  - Downgrade/pause allowed
  - Custom service requests
  - Fastest response time

---

## Credit System (PLANNED - Not Yet Priced)

**Status:** Infrastructure exists in code, pricing UNDEFINED

### What Credits Are:
- Virtual currency for purchasing services and add-ons
- Allocated through membership tiers
- Alternative to one-time cash payments
- Tracked in database per user

### What Credits Buy (UNDEFINED - Requires Decision):
**TBD - Human Decision Required:**
- [ ] Credit pricing for services (e.g., 1 hour consulting = X credits)
- [ ] Credit pricing for digital products (if applicable)
- [ ] Credit conversion rate (1 credit = $? USD value)
- [ ] Minimum credit spend threshold
- [ ] Credit discount vs cash (e.g., credits give 25% discount)

### Service Add-Ons (Credit Costs TBD):
| Add-On | Description | Credit Cost |
|--------|-------------|-------------|
| Extra Revision | Additional design/build iteration | TBD |
| Content Edit | Batch content updates | TBD |
| Support Call | Priority consultation call | TBD |
| Rush Delivery | Expedited project completion | TBD |
| Emergency Fix | Out-of-hours critical bug fix | TBD |
| Reopen Project | Resume paused/completed project | TBD |
| Custom | Ad-hoc service not in catalog | TBD |

**Note:** Add-on types defined in database schema but pricing not set.

---

## Digital Products Catalog (PLANNED)

**Status:** Products NOT yet built - pricing is projection

### Licensing Tiers

**Personal License:**
- 1 user only
- 1 active device/session
- Personal or limited commercial use
- No redistribution
- No team sharing
- No refunds after download

**Team License:**
- 2-5 users maximum (hard cap)
- Internal team use only
- Seats must be explicitly assigned
- No resale or redistribution
- Shared within one organization
- 14-day money-back guarantee

**Enterprise License:**
- 6+ users OR
- Redistribution rights OR
- White-label usage OR
- Client-facing tooling OR
- Institutional use
- Manual approval required
- No public pricing (negotiated)
- 30-day money-back guarantee

**Important:** At 6+ users, customers CANNOT buy Team license - they must contact for Enterprise.

---

## Product Catalog - Templates & Boilerplates

### 1. Next.js Portfolio Starter Template

**Description:** Production-ready portfolio website with JSON-based CMS, admin dashboard, multi-theme system, and automated screenshot capture.

**Status:** 70% extractable from current codebase

**What's Included:**
- Next.js 14 App Router with TypeScript
- JSON-based CMS (no database required)
- Admin content editor
- Multi-theme system (light/dark modes)
- Automated screenshot capture
- Responsive Tailwind CSS design
- Authentication-ready structure
- SEO optimized

**Pricing (USD):**
- Personal: $79
- Team: $149
- Enterprise: Contact

**Pricing (UGX):**
- Personal: 290,000
- Team: 550,000
- Enterprise: Contact

**Justification:** 30-40 hours @ $50/hr = $1,500-2,000 value. Priced at 5-10% of development cost for volume sales.

---

### 2. E-Commerce Starter Kit

**Description:** Full-featured e-commerce solution with product management, cart, checkout, and digital delivery.

**Status:** Extractable from current shop functionality

**What's Included:**
- Product catalog with filtering
- Shopping cart (Zustand state management)
- Multi-currency support (USD/UGX)
- License-based product delivery
- Stripe payment integration
- Order management system
- Admin dashboard
- Invoice generation

**Pricing (USD):**
- Personal: $99
- Team: $199
- Enterprise: Contact

**Pricing (UGX):**
- Personal: 365,000
- Team: 735,000
- Enterprise: Contact

**Justification:** 50-60 hours @ $50/hr = $2,500-3,000 value.

---

### 3. Authentication & User Management Boilerplate

**Description:** Drop-in authentication system with NextAuth.js, role-based access control, and user management.

**Status:** Extractable from current auth system

**What's Included:**
- NextAuth.js integration
- Role-based permissions (USER, ADMIN, OWNER)
- Social login (Google, GitHub)
- Email/password authentication
- Protected routes and API endpoints
- User profile management
- Password reset flow
- Session management

**Pricing (USD):**
- Personal: $49
- Team: $99
- Enterprise: Contact

**Pricing (UGX):**
- Personal: 180,000
- Team: 365,000
- Enterprise: Contact

**Justification:** 25-30 hours @ $50/hr = $1,250-1,500 value.

---

### 4. JSON-Based CMS Kit

**Description:** File-based content management system with API routes, visual editors, and version control.

**Status:** Extractable from current CMS

**What's Included:**
- JSON file storage (no database)
- REST API for content operations
- Visual content editors
- TypeScript types for content
- Automatic timestamps/versioning
- Git-friendly content structure
- Multi-page content support
- Easy backup and migration

**Pricing (USD):**
- Personal: $39
- Team: $79
- Enterprise: Contact

**Pricing (UGX):**
- Personal: 145,000
- Team: 290,000
- Enterprise: Contact

**Justification:** Quick extraction, high utility value.

---

## Pricing Philosophy

### Core Principles

**1. Price Based on Value Delivered, Not Hours Worked**

Example scenario:
- Client problem: Losing $10,000/month to manual processes
- Your solution: Automation saves $120,000/year
- Your price: $15,000 (12.5% of annual savings)
- Client ROI: 8x return
- Your effective rate: $750/hr (even if project took 20 hours)

**2. Cost-Plus as Minimum, Value-Based as Target**

Minimum pricing formula:
```
(Development Hours × $50/hr) + Overhead + 30% Profit Margin = Floor Price
```

Value-based formula:
```
(Client's Annual Gain × 10-30% Capture Rate) = Target Price
```

Always choose the higher of the two.

**3. Know Your Break-Even Rate**

Calculated break-even:
- Annual business costs: $13,100
- Annual personal costs: $51,500
- Total annual need: $64,600
- Billable hours/year: 1,356 (226 days × 6 hours)
- **Break-even rate:** $50/hour minimum

Never price below $50/hour equivalent.

**4. Different Models for Different Contexts**

- **Hourly:** Maintenance, unpredictable scope, ongoing support
- **Fixed Project:** Well-defined deliverables, medium projects
- **Value-Based:** Strategic work, revenue-generating features
- **Retainer:** Long-term relationships, predictable work
- **Performance-Based:** Confident in measurable outcomes

---

## Psychological Pricing Tactics

### Charm Pricing (Ending in 9)
Use for: B2C, products under $200
- $79 instead of $80
- $149 instead of $150
- $499 instead of $500

### Prestige Pricing (Round Numbers)
Use for: B2B, consulting, high-value services
- $1,500 instead of $1,499
- $5,000 instead of $4,999

### Price Anchoring
Show high price first to make target price appear reasonable:
- Team: $599 (anchor)
- Personal: $79 (appears like great deal)
- Most choose: Team (middle option)

### Decoy Pricing
Add option that makes target look good:
- Personal: $79 (10 features)
- Team: $149 (20 features) ← TARGET
- Enterprise: Custom pricing

---

## Bundle Pricing (PLANNED)

**Starter Bundle:** $199 (save $68)
- Portfolio Starter
- Auth Boilerplate
- CMS Kit
- Total value: $167 → Bundle: $199

**Developer Bundle:** $349 (save $148)
- All in Starter
- E-Commerce Kit
- Total value: $266 → Bundle: $349

**Complete Bundle:** $499 (save $297)
- All templates
- Lifetime updates
- Priority support
- Total value: $266 → Bundle: $499

---

## International Pricing

**Dual Currency Support:** USD + UGX (Ugandan Shilling)

**Conversion Rate (Approximate):**
- 1 USD ≈ 3,700 UGX
- Prices rounded to nearest 5,000 UGX for clean presentation

**Purchasing Power Parity (Future Consideration):**
- May implement regional pricing for other African markets
- Not yet implemented (requires payment provider with PPP support)

**Payment Methods (Planned):**
- Stripe (USD, international cards)
- Flutterwave (African markets)
- M-Pesa (Kenya, Tanzania)
- Airtel Money (Uganda)
- MTN Mobile Money (Uganda)
- PayPal (Under review)

---

## Discounting Strategy

### When to Discount:
- ✅ Launch promotion (first 50 customers)
- ✅ Seasonal sales (Black Friday, New Year)
- ✅ Bundle discount (buy more, save more)
- ✅ Volume discount (team licenses)
- ✅ Loyalty discount (existing customers)
- ✅ Student/Non-profit (goodwill, 50% max)

### When NOT to Discount:
- ❌ Customer asked (sets bad precedent)
- ❌ Desperate for sale (devalues product)
- ❌ Competitor cheaper (race to bottom)
- ❌ "Too expensive" complaint (wrong customer)

### Maximum Discount Rates:
- Launch: 40-50% off (first 50 sales only)
- Seasonal: 20-30% off (2-4 times per year)
- Bundle: 25-40% off (when buying multiple products)
- Volume: 10-30% off (based on quantity)
- Loyalty: 10-15% off (existing customers, upgrades)

---

## Raising Prices

### When to Raise:
- High demand (selling well, low refund rate)
- Product matured (more features added)
- Costs increased (hosting, tools, support)
- Market research (competitors raised prices)
- Annual review (10-20% increase for new customers)

### How to Communicate:
```
Subject: Price Update - You're Grandfathered In

We're increasing prices from $X to $Y starting [date].

Good news: As an existing customer, you keep your original price forever.

Want to upgrade? Do so before [date] at old pricing.

Why the increase? [Feature additions, team growth, etc.]
```

### Grandfathering Strategy:
- **Lifetime grandfathering:** Old customers keep old price forever (builds loyalty)
- **Limited grandfathering:** Old price for 1-2 years, then gentle increase
- **No grandfathering:** Give 90-day notice, offer one-time "lock in" option

---

## Revenue Projections (Year 1)

### Conservative Scenario:
- 3 templates @ $100 avg × 20 sales = $6,000
- 2 services @ $1,000 avg × 2/month = $24,000
- **Total:** $30,000/year

### Moderate Scenario:
- 5 products @ $150 avg × 50 sales = $37,500
- 3 services @ $1,500 avg × 3/month = $54,000
- 5 memberships @ $299-1,499 avg = $4,000
- **Total:** $95,500/year

### Aggressive Scenario:
- 10 products @ $200 avg × 100 sales = $200,000
- 5 services @ $2,000 avg × 4/month = $120,000
- 20 memberships @ $700 avg = $14,000
- **Total:** $334,000/year

**Note:** Projections are speculative. No historical sales data exists.

---

## Assumptions

1. **Target market:** Developers, startups, small businesses (global, English-speaking)
2. **Conversion rate:** 2-5% (industry standard for digital products)
3. **Average order value:** $150-250
4. **Customer lifetime value:** $300-500 (with upsells)
5. **Refund rate:** <3% (industry average)
6. **Support burden:** 10% of time (1 hour support per 10 hours development)
7. **Payment processor fees:** 2.9% + $0.30 (Stripe standard)
8. **Development time estimates:** Based on current codebase complexity
9. **Hourly rate floor:** $50/hr (never go below)
10. **Currency stability:** USD/UGX conversion rate stable (large fluctuations would require repricing)

---

## Limitations

### Explicitly Acknowledged:

**Payment Integration:**
- Currently in demo mode (no real payment collection)
- Must integrate Stripe and/or Flutterwave before accepting payments
- Membership purchases currently create free access (NOT production-ready)

**Credit System:**
- Infrastructure exists in code
- Pricing NOT defined (cannot sell memberships until resolved)
- No historical data on credit usage patterns

**Digital Products:**
- Products NOT yet extracted/packaged for sale
- Pricing based on estimated value, not market validation
- No customer feedback on pricing yet

**International Pricing:**
- Only USD/UGX supported currently
- Other African currencies require additional payment provider integration
- PPP (Purchasing Power Parity) not implemented

**Support Capacity:**
- Support time estimates assume 1-10 customers
- Scaling beyond 20 customers may require hiring support
- No documented SLA for Enterprise customers yet

---

## Open Decisions Requiring Confirmation

### CRITICAL - Blocks Launch:
- [ ] **Credit pricing:** Define conversion rate and service/product costs
- [ ] **Payment provider:** Choose Stripe, Flutterwave, or both for initial launch
- [ ] **Product naming:** Confirm if "Portfolio Starter" is the primary product

### HIGH Priority:
- [ ] **Launch discounts:** Approve 40% off for first 50 customers?
- [ ] **Bundle pricing:** Implement bundles or sell products individually only?
- [ ] **Enterprise pricing:** Set guidelines for negotiated pricing (min/max ranges)

### MEDIUM Priority:
- [ ] **Currency expansion:** Add KES (Kenya), TZS (Tanzania), or other markets?
- [ ] **PayPal support:** Include or skip for initial launch?
- [ ] **Refund automation:** Manual process or automated via payment provider?

---

## What May Change Later

### Pricing Adjustments:
- Annual price increases (10-20% for new customers)
- Launch discounts will expire after first 50-100 sales
- Bundle pricing may be introduced after individual product validation
- Enterprise pricing will evolve based on actual negotiations

### Product Additions:
- More templates may be added to catalog
- Component libraries planned but not prioritized
- SaaS products (screenshot service, API builder) are long-term roadmap

### Payment Providers:
- May add more African payment methods based on demand
- May integrate PayPal if European/American market grows
- May implement crypto payments if requested

### Credit System:
- Credit pricing will be set based on market feedback
- Add-on costs may adjust based on actual usage patterns
- Rollover caps may change based on customer requests

---

## Comparison to Competitors

**ShipFast (Marc Lou):**
- Price: $169
- Product: Next.js SaaS boilerplate
- MRR: ~$40,000/month
- Lesson: Simple product, strong marketing, single founder

**Tailwind UI:**
- Price: $299
- Product: Component library
- Revenue: $2M+/year
- Lesson: Premium pricing works with quality

**Our Position:**
- Price: $79-149 (more accessible)
- Product: Full portfolio platform (broader scope)
- Focus: African market + global developers

---

## Final Notes

This is a **living document**. Pricing is not set in stone.

**Process for Changes:**
1. Propose pricing change with rationale
2. Update this document with "Last Updated" date
3. Communicate changes to any affected customers
4. Monitor impact on conversion rate
5. Adjust again if needed (quarterly reviews)

**Review Schedule:**
- Monthly: Check conversion rates, refund rates, customer feedback
- Quarterly: Evaluate pricing adjustments
- Annually: Major pricing strategy review

**Next Actions Required:**
1. Define credit pricing (Decision #1 - CRITICAL)
2. Resolve product naming conflicts
3. Choose payment provider for launch
4. Validate pricing with beta customers (5-10 test sales)
5. Implement payment integration (technical work)

---

**Document Version:** 1.0 (Merged from 3 source documents)
**Created:** 2026-01-07
**Last Updated:** 2026-01-07
**Status:** Planning phase - requires validation before implementation
**Authority:** Single source of truth for all pricing decisions

