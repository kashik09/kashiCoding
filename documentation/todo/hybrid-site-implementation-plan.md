# Hybrid Site Implementation Plan

**Status:** Ready to implement
**Created:** 2026-01-11
**Model:** Portfolio + Store + Services (Codex Implementation)

---

## Current State Analysis

### Existing Routes

**Public Pages:**
- ✅ `/` - Homepage (redirects to /shop per project rules)
- ✅ `/projects` - Portfolio projects
- ✅ `/products` - Product listings (needs alignment with /shop)
- ✅ `/shop` and `/shop/[slug]` - Product pages
- ✅ `/digital-products` - Another product view (consolidation needed)
- ✅ `/services` - Services page (needs expansion)
- ✅ `/memberships` - Membership tiers (needs updating)
- ✅ `/about` - About page
- ✅ `/contact` - Contact page
- ✅ `/cart` and `/checkout` - Shopping flow
- ❌ `/pricing` - MISSING (needs creation)
- ❌ `/students` - MISSING (needs creation)
- ❌ `/enterprise` - MISSING (needs creation)

### Current Navigation (Header.tsx lines 19-24)
```typescript
const publicLinks = [
  { href: '/projects', label: 'projects' },
  { href: '/products', label: 'products' },  // Should be '/shop'?
  { href: '/about', label: 'about' },
  { href: '/contact', label: 'contact' },
]
```

**Issues:**
- No "Services" link
- No "Pricing" link
- Confusing overlap: /products vs /shop vs /digital-products

---

## Implementation Plan

### Phase 1: Information Architecture (2 hours)

#### 1.1: Consolidate Product Routes
**Goal:** Single source of truth for products

**Decision Matrix:**
| Route | Purpose | Action |
|-------|---------|--------|
| `/shop` | Main product storefront | **KEEP** - Primary |
| `/products` | Legacy route | **REDIRECT** to /shop |
| `/digital-products` | Admin/alternative view | **KEEP** (different purpose) or redirect |

**Implementation:**
```typescript
// next.config.js - Add redirects
{
  source: "/products",
  destination: "/shop",
  permanent: true,
}
```

#### 1.2: Update Navigation (Header.tsx)
**Current:**
```typescript
const publicLinks = [
  { href: '/projects', label: 'projects' },
  { href: '/products', label: 'products' },
  { href: '/about', label: 'about' },
  { href: '/contact', label: 'contact' },
]
```

**New (Hybrid Model):**
```typescript
const publicLinks = [
  { href: '/projects', label: 'Portfolio' },
  { href: '/shop', label: 'Shop' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
]
```

**File:** `components/layout/Header.tsx`
**Lines to modify:** 19-24, 26-32

---

### Phase 2: Create Missing Pages (4 hours)

#### 2.1: Create `/pricing` Page
**File:** `app/(main)/pricing/page.tsx`

**Requirements:**
- Tier cards: Personal Basic, Personal Pro, Team Small, Team Large, Enterprise, Students
- Frequency toggle: Weekly, Monthly, Quarterly (discount), Yearly (best value)
- Credits/month display
- Clear CTA buttons
- Comparison table

**Pricing (from Model A):**
```typescript
const tiers = [
  { name: 'Personal Basic', monthly: 29, weekly: 8, quarterly: 78, yearly: 290 },
  { name: 'Personal Pro', monthly: 79, weekly: 21, quarterly: 213, yearly: 790 },
  { name: 'Team Small', monthly: 199, weekly: 53, quarterly: 537, yearly: 1990 },
  { name: 'Team Large', monthly: 349, weekly: 93, quarterly: 942, yearly: 3490 },
  { name: 'Student', monthly: 15, quarterly: 39, yearly: 145 },  // 50% off
  { name: 'Enterprise', contact: true },
]
```

**Template Structure:**
```tsx
export default function PricingPage() {
  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly')

  return (
    <div className="container mx-auto px-6 py-12">
      <h1>Pricing</h1>

      {/* Frequency Toggle */}
      <FrequencyToggle value={frequency} onChange={setFrequency} />

      {/* Tier Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map(tier => <PricingCard key={tier.name} tier={tier} frequency={frequency} />)}
      </div>

      {/* Comparison Table */}
      <ComparisonTable tiers={tiers} />

      {/* FAQ Section */}
      <PricingFAQ />
    </div>
  )
}
```

#### 2.2: Create `/students` Page
**File:** `app/(main)/students/page.tsx`

**Requirements:**
- Explain 50% discount for ages 13-18
- Strict scope boundaries
- Verification steps (manual for now)
- Student request form
- Link to /pricing with student tier highlighted

**Template Structure:**
```tsx
export default function StudentsPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1>Student Discount (13-18)</h1>

      <section>
        <h2>50% Off All Personal Tiers</h2>
        <p>Valid student ID or school email required</p>
      </section>

      <section>
        <h2>Verification Process</h2>
        <ol>
          <li>Submit student verification form</li>
          <li>Manual review (1-2 business days)</li>
          <li>Approval email with discount code</li>
        </ol>
      </section>

      <section>
        <h2>Strict Scope Policy</h2>
        <p>Student tier has stricter boundaries...</p>
      </section>

      <StudentVerificationForm />
    </div>
  )
}
```

#### 2.3: Create `/enterprise` Page
**File:** `app/(main)/enterprise/page.tsx`

**Requirements:**
- Scope-first approach
- NDA optional
- Contact form (reuse existing request system)
- No public pricing
- Custom requirements

**Template Structure:**
```tsx
export default function EnterprisePage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1>Enterprise Solutions</h1>

      <section>
        <h2>Scope-First Engagement</h2>
        <p>Custom pricing based on requirements</p>
      </section>

      <section>
        <h2>What We Offer</h2>
        <ul>
          <li>Dedicated support</li>
          <li>Custom integrations</li>
          <li>SLA guarantees</li>
          <li>NDA protection (optional)</li>
        </ul>
      </section>

      <EnterpriseContactForm />
    </div>
  )
}
```

---

### Phase 3: Update Existing Pages (3 hours)

#### 3.1: Update `/shop` Page
**File:** `app/(main)/shop/page.tsx`

**Add:**
- Product description: "Portfolio Starter Template"
- What's included section
- What's NOT included
- Delivery method explanation
- Support boundary
- License options (Personal/Team/Enterprise)

**Current shop page likely shows all products. Update to:**
```tsx
// Add prominent section for Portfolio Starter
<FeaturedProduct
  name="Portfolio Starter"
  description="Production-ready portfolio with Next.js 14, auth, admin dashboard"
  price={{ personal: 79, team: 149, enterprise: 'Contact' }}
  included={['Next.js 14 App Router', 'Authentication', 'Admin Panel', ...]}
  notIncluded={['Hosting', 'Ongoing support', 'Custom features']}
/>
```

#### 3.2: Update `/services` Page
**File:** `app/(main)/services/page.tsx`

**Current state:** Check what exists
**Add:**
- "Credits are prepaid service access" explainer
- Example pricing for common services
- "Cash always allowed" note
- Generously strict boundaries
- Bigger systems → subscription note
- Link to /pricing for credit packages

**Structure:**
```tsx
<section>
  <h2>How Credits Work</h2>
  <p>Credits are prepaid service units (not hours, not dollars)</p>
  <p>Use credits for scoped work. Cash always accepted as alternative.</p>
</section>

<section>
  <h2>Example Credit Costs</h2>
  <ul>
    <li>Small fix (typo, style tweak): 5-10 credits</li>
    <li>Feature addition (form field, button): 25-50 credits</li>
    <li>New page/section: 100-200 credits</li>
  </ul>
  <Link href="/pricing">View Credit Packages</Link>
</section>

<section>
  <h2>Project Phases</h2>
  <ProjectPhaseTimeline />
  <Link href="/services/process">Learn More</Link>
</section>
```

#### 3.3: Update `/contact` Page
**File:** `app/(main)/contact/page.tsx`

**Current:** Likely has a form
**Verify:** WhatsApp CTA logic (if WHATSAPP_NUMBER set, show WhatsApp button)

**Ensure:**
```tsx
{process.env.NEXT_PUBLIC_WHATSAPP_NUMBER && (
  <a
    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
    className="btn btn-primary"
  >
    Message on WhatsApp
  </a>
)}
```

---

### Phase 4: Create Service Process Documentation (2 hours)

#### 4.1: Create Project Phases Page
**File:** `app/(main)/services/process/page.tsx`

**Content:**
1. **Discovery & Scope**
   - 30-min discovery call (one-time)
   - Scope document creation
   - Fixed price quote
   - Communication: Email/WhatsApp

2. **Plan & Blueprint**
   - Low-fi sketches OR written spec (no heavy Figma requirement)
   - Tech stack decision
   - Timeline estimation
   - Approval checkpoint

3. **Build & Develop**
   - Development in phases
   - Weekly check-ins (15 min async or call)
   - Communication: WhatsApp/Discord/Email

4. **Review & Revisions**
   - What counts as revision: UI/copy/layout tweaks
   - What's NOT revision: New features
   - Revision limits per phase
   - Extra revisions: additional credits

5. **Launch & Handover**
   - Deployment assistance
   - Documentation delivery
   - Training: detailed doc/email (default)
   - Optional training call (paid add-on)

6. **Maintenance & Support** (Optional)
   - Bug fixes only (not new features)
   - Subscription-based
   - Response time SLA

#### 4.2: Create PHASES_AND_SCOPE.md
**File:** `docs/pricing/PHASES_AND_SCOPE.md`

**Content:**
```markdown
# Project Phases and Scope Boundaries

## Communication Channels
- Primary: Email or WhatsApp
- Optional: Discord (for ongoing projects)
- Meetings: Limited per phase

## Meeting Limits
- Discovery: 30 min (one-time)
- Check-ins: 15 min weekly (async preferred)
- Revision calls: 15 min per phase
- Overflow: Async text communication

## Revision Policy
### What IS a Revision:
- UI tweaks (spacing, colors, fonts)
- Copy changes (text edits)
- Layout adjustments (position changes)

### What is NOT a Revision (New Scope):
- New features
- Additional pages
- Integration changes
- Data model changes

## Training Delivery
- Default: Detailed documentation + email walkthrough
- Paid upgrade: Live training call (30-60 min)

## Credit Usage
- Credits apply to: revisions beyond limit, extra pages, post-launch fixes
- Credits do NOT apply to: initial scope, bug fixes in warranty period
```

---

### Phase 5: Legal & Licensing Updates (2 hours)

#### 5.1: Update Terms of Service
**File:** `app/(main)/legal/terms/page.tsx`

**Add sections:**

**Product Licensing:**
```markdown
## Digital Product Licenses

### Personal License ($79)
- Single user
- Personal or commercial projects
- No redistribution
- No resale
- No sharing downloads

### Team License ($149)
- 2-5 users (hard cap)
- Internal team use only
- No redistribution
- No resale

### Enterprise License (Contact)
- 6+ users
- Custom terms
- NDA available
- Manual approval required

### Enforcement:
- Account suspension on abuse
- Download access revoked
- No refunds for violations
```

**Services Terms:**
```markdown
## Services Agreement

### Scope Policy:
- Scope fixed at written acceptance
- Changes require additional credits or cash payment
- "Revision" defined: UI/copy/layout tweaks only
- New features = new scope = additional payment

### Cancellation:
- Cancel anytime
- No refunds on prepaid credits
- Credits valid only during membership term
- Work-in-progress: prorated refund available (discretionary)

### Credits:
- Credits expire with membership term
- Rollover rules: [to be defined - mark "subject to change"]
- No cash value
- Non-transferable

### Payment Failure:
- Grace period: 7 days
- Work suspended after grace period
- Files archived after 30 days
- Reactivation fee may apply
```

**Data & Ownership:**
```markdown
## Data Ownership

### Service Projects:
- Client owns all work after final payment
- Kashi retains portfolio rights (with permission)

### Backups:
- Default retention: 90 days after project completion
- Managed tier: extended retention available
- Client responsible for own backups after handover
```

#### 5.2: Update Privacy Policy
**File:** `app/(main)/legal/privacy-policy/page.tsx`

**Add:** Manual operations disclosure
```markdown
## Current Operations

This site is in validation phase. Some processes are manual:

- Payment confirmation: Manual verification via WhatsApp/email
- Student verification: Manual review (1-2 days)
- Enterprise quotes: Manual calculation
- Credit adjustments: Manual admin action

We are working toward automation. Your data is secure regardless of manual vs automated processing.
```

---

### Phase 6: Documentation Updates (1 hour)

#### 6.1: Update CURRENT_REALITY.md
**File:** `docs/pricing/CURRENT_REALITY.md`

**Verify it matches new implementation:**
- Portfolio Starter product listed
- Services credit model explained
- Manual operations acknowledged
- Pricing tiers documented

**(Already updated by user - verify alignment)**

#### 6.2: Verify MASTER_PRICING_GUIDE.md
**File:** `docs/pricing/MASTER_PRICING_GUIDE.md`

**Check alignment with:**
- Portfolio Starter pricing ($79/$149)
- Service tier pricing (monthly: $29, $79, $199, $349)
- Student discount (50% off)
- Enterprise (contact only)

---

## Implementation Checklist

### Phase 1: Info Architecture ✅
- [ ] Add redirect: `/products` → `/shop`
- [ ] Update Header navigation (add Services, Pricing)
- [ ] Test navigation on mobile and desktop

### Phase 2: Create Pages ✅
- [ ] Create `/pricing` with tier cards and frequency toggle
- [ ] Create `/students` with verification form
- [ ] Create `/enterprise` with contact form

### Phase 3: Update Pages ✅
- [ ] Update `/shop` - add Portfolio Starter featured section
- [ ] Update `/services` - add credits explainer and phase overview
- [ ] Update `/contact` - verify WhatsApp CTA logic

### Phase 4: Process Documentation ✅
- [ ] Create `/services/process` page
- [ ] Create `docs/pricing/PHASES_AND_SCOPE.md`

### Phase 5: Legal ✅
- [ ] Update Terms with product licensing section
- [ ] Update Terms with services agreement section
- [ ] Update Privacy with manual operations disclosure

### Phase 6: Documentation ✅
- [ ] Verify `CURRENT_REALITY.md` alignment
- [ ] Verify `MASTER_PRICING_GUIDE.md` alignment

### Phase 7: Testing ✅
- [ ] Test all navigation links
- [ ] Test pricing page frequency toggle
- [ ] Test student verification form submission
- [ ] Test enterprise contact form
- [ ] Verify WhatsApp CTA appears when number set
- [ ] Verify home redirect to /shop works
- [ ] Test mobile navigation
- [ ] Verify dark/light theme toggle works
- [ ] Verify footer stays sticky

---

## File Changes Summary

### New Files:
1. `app/(main)/pricing/page.tsx` - Pricing page with tiers
2. `app/(main)/students/page.tsx` - Student discount page
3. `app/(main)/enterprise/page.tsx` - Enterprise contact page
4. `app/(main)/services/process/page.tsx` - Project phases explainer
5. `docs/pricing/PHASES_AND_SCOPE.md` - Phase/revision definitions
6. `components/pricing/PricingCard.tsx` - Reusable pricing card component
7. `components/pricing/FrequencyToggle.tsx` - Frequency selector component
8. `components/pricing/ComparisonTable.tsx` - Feature comparison component

### Modified Files:
1. `components/layout/Header.tsx` - Update navigation links
2. `next.config.js` - Add /products → /shop redirect
3. `app/(main)/shop/page.tsx` - Add Portfolio Starter featured section
4. `app/(main)/services/page.tsx` - Add credits explainer, phase overview
5. `app/(main)/contact/page.tsx` - Verify WhatsApp CTA logic
6. `app/(main)/legal/terms/page.tsx` - Add licensing and services terms
7. `app/(main)/legal/privacy-policy/page.tsx` - Add manual operations disclosure

---

## Git Commit Strategy

### Commit 1: Info Architecture
```bash
git add next.config.js components/layout/Header.tsx
git commit -m "refactor(nav): consolidate products to shop, add services and pricing links

- Redirect /products to /shop for consistency
- Update header navigation to include Services and Pricing
- Support hybrid portfolio + shop + services model"
```

### Commit 2: Create Pricing Pages
```bash
git add app/(main)/pricing app/(main)/students app/(main)/enterprise components/pricing
git commit -m "feat(pricing): add pricing, students, and enterprise pages

- Create /pricing with tier cards and frequency toggle
- Add /students page with 50% discount and verification flow
- Add /enterprise page with contact form and custom pricing
- Implement reusable pricing components"
```

### Commit 3: Update Existing Pages
```bash
git add app/(main)/shop app/(main)/services app/(main)/contact
git commit -m "feat(services): update shop and services for hybrid model

- Add Portfolio Starter featured section to shop
- Add credits explainer to services page
- Add project phases overview to services
- Verify WhatsApp CTA in contact page"
```

### Commit 4: Documentation and Legal
```bash
git add app/(main)/services/process app/(main)/legal docs/pricing/PHASES_AND_SCOPE.md
git commit -m "docs(legal): add project phases and update terms

- Create /services/process page explaining project workflow
- Add PHASES_AND_SCOPE.md with revision definitions
- Update Terms with product licensing and services agreement
- Add manual operations disclosure to Privacy Policy"
```

---

## Estimated Time

| Phase | Hours |
|-------|-------|
| Phase 1: Info Architecture | 2 |
| Phase 2: Create Pages | 4 |
| Phase 3: Update Pages | 3 |
| Phase 4: Process Docs | 2 |
| Phase 5: Legal | 2 |
| Phase 6: Doc Review | 1 |
| Phase 7: Testing | 2 |
| **Total** | **16 hours** |

---

## Next Steps

1. **Review this plan** - Confirm approach aligns with vision
2. **Approve priority** - Which phases to tackle first?
3. **Begin implementation** - Start with Phase 1 (foundation)
4. **Iterate** - Test and refine as you build

**Status:** Ready to implement
**Created:** 2026-01-11
**Last Updated:** 2026-01-11
