# Credit Pricing Proposal

**Status:** Draft proposal requiring approval
**Created:** 2026-01-11
**Decision Required By:** Before membership sales launch

---

## Problem Statement

The credit system infrastructure is fully implemented in code, but pricing is undefined. Users receive credits through memberships but cannot spend them because there's no price list.

**Blocker:** Cannot launch membership sales without defining credit costs for services and products.

---

## Design Constraints

1. **Credits must be attractive** — Better value than paying cash to incentivize memberships
2. **Higher tiers = better value** — Pro and Managed members should get more per credit
3. **Simple math** — Easy to calculate and understand (no decimal credits)
4. **Floor protection** — Never drop below $50/hour equivalent
5. **Volume discount logic** — Bigger purchase = better rate per credit

---

## Proposed Credit Value System

### Option 1: Fixed Credit Value with Tiered Purchase Discount

**Base Credit Value:** 1 credit = $1.00 USD

**Membership Purchase Analysis:**
| Tier | Price | Credits | Cost Per Credit | Discount |
|------|-------|---------|-----------------|----------|
| **Basic Access** | $299 | 750 | $0.40/credit | 60% off |
| **Pro** | $1,499 | 1,500 | $1.00/credit | 0% off |
| **Managed** | $499/mo | 500/mo | $1.00/credit | 0% off |

**What This Means:**
- Basic tier gets credits at steep discount but limited features
- Pro/Managed pay face value but get priority service + rollover
- Credit discount is the main incentive for Basic, features are the incentive for Pro/Managed

**Conversion Logic:**
- If consulting costs 125 credits/hour → $125 face value
- Basic member pays: 125 credits (cost them $0.40 × 125 = $50) — **60% savings**
- Pro/Managed member pays: 125 credits (cost them $1.00 × 125 = $125) — **no cash savings, but priority service**

**Pros:**
- Simple to communicate: "1 credit = $1 value"
- Basic tier offers huge savings (incentive to join)
- Pro/Managed value comes from service quality, not price

**Cons:**
- Pro/Managed members pay same as cash (may question value)
- Basic members get best deal (may cannibalize higher tiers)

---

### Option 2: Tiered Credit Value (Credits Worth More at Higher Tiers)

**Variable Credit Value:**
- Basic tier: 1 credit = $0.80 USD value
- Pro tier: 1 credit = $1.00 USD value
- Managed tier: 1 credit = $1.25 USD value

**Membership Analysis:**
| Tier | Price | Credits | Credit Value | Total Value | Discount |
|------|-------|---------|--------------|-------------|----------|
| **Basic** | $299 | 750 | $0.80/credit | $600 | 50% off |
| **Pro** | $1,499 | 1,500 | $1.00/credit | $1,500 | 0% off |
| **Managed** | $499/mo | 500/mo | $1.25/credit | $625/mo | 20% bonus |

**Example Pricing (1 hour consulting = 100 credits):**
- Basic member: 100 credits × $0.80 = $80 value (paid $0.40/credit → 50% discount)
- Pro member: 100 credits × $1.00 = $100 value (paid $1.00/credit → face value)
- Managed member: 100 credits × $1.25 = $125 value (paid $1.00/credit → 25% premium)

**Pros:**
- Managed tier gets best value (justifies premium price)
- Pro tier gets face value (fair)
- Basic tier still gets discount (incentive to join)

**Cons:**
- More complex to explain
- Requires different pricing for same service based on membership tier
- May feel unfair to Basic members (same service costs more)

---

### Option 3: Flat Credit Pricing with Service Tiers

**Fixed Credit Value:** 1 credit = $1.00 USD for all services

**Service Pricing in Credits:**

#### Consulting Services
- **Standard Consulting:** 100 credits/hour ($100 cash equivalent)
- **Priority Consulting (Pro/Managed only):** 125 credits/hour ($125 cash equivalent)
- **Emergency/Rush Consulting (Managed only):** 150 credits/hour ($150 cash equivalent)

#### Development Services (Estimated, billed in increments)
- **Simple Landing Page:** 500 credits ($500 cash equivalent)
- **Portfolio Website:** 1,000-2,000 credits ($1,000-2,000)
- **E-Commerce Site:** 2,000-5,000 credits ($2,000-5,000)
- **Mobile App (Simple):** 1,500-3,000 credits ($1,500-3,000)
- **UI/UX Design Package:** 300-1,500 credits ($300-1,500)

#### Service Add-Ons
- **Extra Revision:** 50 credits ($50)
- **Content Edit (Batch):** 100 credits ($100)
- **Support Call (30 min):** 50 credits ($50)
- **Rush Delivery (24-48hr):** +50% credit surcharge
- **Emergency Fix (Out of hours):** 200 credits ($200)
- **Reopen Project:** 100 credits ($100)
- **Custom Request:** Variable (quoted in credits)

#### Digital Products (When Available)
- **Portfolio Starter Template (Personal):** 79 credits ($79)
- **Portfolio Starter Template (Team):** 149 credits ($149)
- **E-Commerce Kit (Personal):** 99 credits ($99)
- **E-Commerce Kit (Team):** 199 credits ($199)
- **Auth Boilerplate (Personal):** 49 credits ($49)
- **Auth Boilerplate (Team):** 99 credits ($99)

**Membership Value Analysis:**

**Basic Access ($299 for 750 credits):**
- 7.5 hours of consulting
- OR 1 small portfolio website
- OR 9 digital product templates (Personal licenses)
- Effective rate: $0.40/credit (60% discount vs cash)

**Pro ($1,499 for 1,500 credits):**
- 15 hours of consulting (face value)
- OR 1-2 medium websites
- OR 10-15 digital products
- PLUS priority service, rollover up to 250 credits
- Effective rate: $1.00/credit (face value)

**Managed ($499/month for 500 credits):**
- 5 hours of consulting per month
- OR 1 small project per month
- OR 5-10 digital products
- PLUS hosting, 24/7 support, project manager
- Effective rate: $1.00/credit (but includes premium services)

**Pros:**
- Dead simple: 1 credit = $1
- Easy to calculate: cash price = credit price
- Members understand exact value
- Basic tier gets massive discount (incentive)
- Pro/Managed get face value + premium features

**Cons:**
- Pro/Managed members might expect credit discount too
- Need to emphasize that value comes from features, not price

---

## Recommended Approach: Option 3 (Flat Pricing)

**Rationale:**
1. **Simplest to communicate** — "1 credit = $1, always"
2. **Easy to budget** — Members know exactly what they can afford
3. **Clear value proposition** — Basic = price discount, Pro/Managed = priority + features
4. **No tier discrimination** — Same service costs same credits regardless of membership

**How to Position Each Tier:**

**Basic Access:** *"Save 60% on services"*
- Pay $299, get $600 worth of credits
- Best for one-time projects or occasional users
- No rollover, standard service

**Pro:** *"Priority service + rollover flexibility"*
- Pay $1,499, get $1,500 worth of credits (face value)
- Credits last 12 months, rollover up to 250
- Priority queue, faster response times
- Value = service quality, not price discount

**Managed:** *"Hands-off solution with dedicated support"*
- Pay $499/month, get $500 worth of credits
- PLUS hosting management, project manager, 24/7 support
- Value = premium service + included hosting (normally $20-50/month)

---

## Implementation Checklist

If Option 3 approved:

- [ ] Update `MASTER_PRICING_GUIDE.md` with credit pricing table
- [ ] Create service price list in credits (consulting, dev, add-ons)
- [ ] Update database schema if needed (verify credit costs stored correctly)
- [ ] Add credit pricing to API routes (`/api/memberships/purchase`, `/api/checkout`)
- [ ] Update frontend to display credit costs alongside cash prices
- [ ] Create credit calculator tool for users (e.g., "1,500 credits = 15 hours consulting")
- [ ] Add credit balance warnings ("You need 100 credits for this service, you have 75")
- [ ] Document credit pricing in user-facing help/FAQ

**Estimated Implementation Time:** 4-6 hours (mostly documentation and UI updates)

---

## Alternative Recommendations

**If Pro/Managed need better incentive:**
- **Add bonus credits for annual prepay** — "Pay $1,499 for 1,500 credits + 10% bonus (150 extra)"
- **Increase rollover caps** — Pro: 500 credits (instead of 250), Managed: 200 credits (instead of 100)
- **Include free digital products** — Pro members get 2 free templates ($200 value)
- **Offer credit refills at discounted rates** — Pro members can buy 500 more credits for $400 (20% off)

**If Basic tier is too attractive:**
- **Reduce Basic credits to 600** (from 750) — Still 50% discount, less competition with Pro
- **Add more restrictions** — "Basic members: max 1 active project at a time"
- **Remove certain services** — "Rush delivery not available for Basic tier"

---

## Questions for Approval

Before finalizing:

1. **Approve Option 3 (Flat 1 credit = $1)?** Or prefer Option 1 or 2?
2. **Service pricing acceptable?** Consulting at 100-150 credits/hour, dev projects at 500+ credits?
3. **Add-on pricing reasonable?** Extra revision 50 credits, rush delivery +50% surcharge?
4. **Digital product pricing in credits?** Should templates cost credits or cash only?
5. **Basic tier too attractive?** Should credits be reduced to 600 or restrictions added?
6. **Pro/Managed need sweeteners?** Bonus credits, higher rollover, free products?

---

## Next Steps After Approval

1. Update `MASTER_PRICING_GUIDE.md` with approved credit pricing
2. Update `CURRENT_REALITY.md` to reflect credit pricing is defined
3. Update `comprehensive-audit-summary.md` to remove credit pricing blocker
4. Implement credit pricing in codebase (API routes, frontend display)
5. Create user-facing credit calculator/FAQ
6. Test checkout flow with credits
7. Ready for payment integration (Stripe/Flutterwave)

---

**Decision Authority:** Kashi Kweyu (Owner)
**Approval Required By:** Before membership launch
**Document Status:** Awaiting approval
**Created:** 2026-01-11
