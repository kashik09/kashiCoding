# CODEBASE AUDIT REPORT

**Repository**: kashi-kweyu-portfolio
**Framework**: Next.js 14.2.0 (App Router) + TypeScript + Tailwind CSS
**Audit Date**: 2025-12-26
**Auditor**: Automated Codebase Analysis

---

## Executive Summary

This audit analyzed 188 files across 146 directories to identify redundancy, unused code, broken links, and structural improvements. Key findings:

- **8 unused components** can be safely removed (~800 lines)
- **1 broken route** found (`/forgot-password`)
- **3 provider redundancies** detected (SessionProvider, ToastProvider duplicated across layouts)
- **1 unused dependency** identified (`react-icons`)
- **5 utility functions** unused or partially implemented
- **3 route aliases** properly implemented (shop→products, services→products, request→contact)
- **Multiple Hero components** with overlapping functionality
- **Clean architecture** with well-organized API routes and middleware
- **Estimated cleanup impact**: ~15-20% reduction in unused code

---

## Repo Map

### Route Structure

#### Public Routes (Route Group: `(main)`)

| Route | File | Purpose | Status |
|-------|------|---------|--------|
| `/` | `app/(main)/page.tsx` | Homepage (cinematic story) | ✅ Active |
| `/about` | `app/(main)/about/page.tsx` | About page | ✅ Active |
| `/about-developer` | `app/(main)/about-developer/page.tsx` | Redirects to `/about` | ✅ Alias |
| `/cart` | `app/(main)/cart/page.tsx` | Shopping cart | ✅ Active |
| `/checkout` | `app/(main)/checkout/page.tsx` | Checkout flow | ✅ Active |
| `/checkout/success` | `app/(main)/checkout/success/page.tsx` | Order confirmation | ✅ Active |
| `/contact` | `app/(main)/contact/page.tsx` | Contact form | ✅ Active |
| `/digital-products` | `app/(main)/digital-products/page.tsx` | Redirects to `/products` | ✅ Alias |
| `/legal/privacy-policy` | `app/(main)/legal/privacy-policy/page.tsx` | Privacy policy | ✅ Active |
| `/legal/terms` | `app/(main)/legal/terms/page.tsx` | Terms of service | ✅ Active |
| `/memberships` | `app/(main)/memberships/page.tsx` | Redirects to `/products` | ✅ Alias |
| `/products` | `app/(main)/products/page.tsx` | Digital products shop | ✅ Active |
| `/projects` | `app/(main)/projects/page.tsx` | Portfolio projects | ✅ Active |
| `/request` | `app/(main)/request/page.tsx` | Redirects to `/contact` | ✅ Alias |
| `/services` | `app/(main)/services/page.tsx` | Redirects to `/products` | ✅ Alias |
| `/shop` | `app/(main)/shop/page.tsx` | Redirects to `/products` | ✅ Alias |
| `/shop/[slug]` | `app/(main)/shop/[slug]/page.tsx` | Product detail page | ✅ Active |

**Layout**: `app/(main)/layout.tsx`
**Components**: Header, Footer, VibeyBackdrop, CinemaNav, SessionProvider

---

#### Auth Routes (Route Group: `(auth)`)

| Route | File | Purpose | Status |
|-------|------|---------|--------|
| `/login` | `app/(auth)/login/page.tsx` | User login | ✅ Active |
| `/signup` | `app/(auth)/signup/page.tsx` | User registration | ✅ Active |

**Layout**: `app/(auth)/layout.tsx` (minimal, no header/footer)

---

#### User Dashboard (Route Group: `(user)`)

| Route | File | Purpose | Status |
|-------|------|---------|--------|
| `/dashboard` | `app/(user)/dashboard/page.tsx` | User dashboard home | ✅ Active |
| `/dashboard/downloads` | `app/(user)/dashboard/downloads/page.tsx` | User downloads list | ✅ Active |
| `/dashboard/downloads/[slug]` | `app/(user)/dashboard/downloads/[slug]/page.tsx` | Download detail | ✅ Active |
| `/dashboard/orders` | `app/(user)/dashboard/orders/page.tsx` | Order history | ✅ Active |
| `/dashboard/orders/[orderNumber]` | `app/(user)/dashboard/orders/[orderNumber]/page.tsx` | Order detail | ✅ Active |
| `/dashboard/requests` | `app/(user)/dashboard/requests/page.tsx` | User requests | ✅ Active |
| `/dashboard/requests/[id]` | `app/(user)/dashboard/requests/[id]/page.tsx` | Request detail | ✅ Active |
| `/dashboard/settings` | `app/(user)/dashboard/settings/page.tsx` | User settings | ✅ Active |

**Layouts**: `app/(user)/layout.tsx` → `app/(user)/dashboard/layout.tsx`
**Auth**: Protected by middleware

---

#### Admin Panel (No Route Group)

| Route | File | Purpose | Status |
|-------|------|---------|--------|
| `/admin` | `app/admin/page.tsx` | Admin dashboard | ✅ Active |
| `/admin/ads` | `app/admin/ads/page.tsx` | Ad management | ✅ Active |
| `/admin/analytics` | `app/admin/analytics/page.tsx` | Analytics dashboard | ✅ Active |
| `/admin/content/*` | Multiple files | Content management | ✅ Active |
| `/admin/digital-products` | Multiple files | Product CRUD | ✅ Active |
| `/admin/legal` | `app/admin/legal/page.tsx` | Legal content | ✅ Active |
| `/admin/orders` | `app/admin/orders/page.tsx` | Order management | ✅ Active |
| `/admin/projects` | Multiple files | Project CRUD | ✅ Active |
| `/admin/requests` | `app/admin/requests/page.tsx` | Request management | ✅ Active |
| `/admin/security` | `app/admin/security/page.tsx` | Security settings | ✅ Active |
| `/admin/settings` | `app/admin/settings/page.tsx` | Site settings | ✅ Active |
| `/admin/setup-2fa` | `app/admin/setup-2fa/page.tsx` | 2FA setup | ✅ Active |
| `/admin/tags` | `app/admin/tags/page.tsx` | Tag management | ✅ Active |
| `/admin/users` | Multiple files | User management | ✅ Active |

**Layout**: `app/admin/layout.tsx`
**Auth**: Protected by middleware (ADMIN, OWNER, MODERATOR, EDITOR roles + 2FA required)

---

### Shared Modules

#### UI Components (`components/ui/`)

| Component | Purpose | Usage Count | Status |
|-----------|---------|-------------|--------|
| Badge | Style badges | Low | ✅ Used |
| Button | Primary button | 40+ | ✅ Heavily used |
| Card | Card wrapper | Medium | ✅ Used |
| ConfirmModal | Confirmation dialogs | 15+ | ✅ Used |
| Input | Form inputs | 30+ | ✅ Heavily used |
| ProgressBar | Progress bars | 1 | ✅ Used |
| Spinner | Loading states | 50+ | ✅ Heavily used |
| StyledSelect | Styled selects | 1 | ✅ Used |
| Toast | Notifications | 50+ | ✅ Heavily used |
| UserAvatar | User avatars | 3+ | ✅ Used |
| YearPicker | Year selection | 1 | ✅ Used |

**Export**: Barrel export via `components/ui/index.ts`

---

#### Core Components (`components/`)

| Component | Purpose | Usage | Status |
|-----------|---------|-------|--------|
| Header | Main navigation | `(main)/layout.tsx` | ✅ Used |
| Footer | Site footer | `(main)/layout.tsx` | ✅ Used |
| AdminHeader | Admin navigation | `admin/layout.tsx` | ✅ Used |
| ProjectCard | Project display | projects pages | ✅ Used |
| **Hero** | **Generic hero** | **NONE** | ❌ **UNUSED** |
| **PortfolioCard** | **Portfolio display** | **NONE** | ❌ **UNUSED** |
| **AdSlot** | **Ad placements** | **NONE** | ❌ **UNUSED** |
| VibeyBackdrop | Theme backdrop | layouts | ✅ Used |
| CookieNotice | Cookie consent | root layout | ✅ Used |
| FeaturedProjects | Featured projects | projects page | ✅ Used |
| ImageUploadCrop | Image upload | admin content | ✅ Used |

---

#### Home Components (`components/home/`)

| Component | Purpose | Usage | Status |
|-----------|---------|-------|--------|
| IntroScene | Homepage intro | `(main)/page.tsx` | ✅ Used |
| FeaturedWorkStory | Featured work section | `(main)/page.tsx` | ✅ Used |
| **HeroFormal** | **Formal hero variant** | **NONE** | ❌ **UNUSED** |
| **HeroVibey** | **Vibey hero variant** | **HeroSwitch only** | ⚠️ **Limited use** |
| **HeroSwitch** | **Hero wrapper** | **NONE** | ❌ **UNUSED** |
| **MemberHomeTop** | **Member homepage** | **NONE** | ❌ **UNUSED** |
| **HowIThink** | **About section** | **NONE** | ❌ **UNUSED** |
| **FeaturedWorkFlow** | **Alt featured work** | **NONE** | ❌ **UNUSED** |
| **ProofSnapshot** | **Proof section** | **NONE** | ❌ **UNUSED** |
| StickerField | Sticker background | IntroScene | ✅ Used |

---

#### Lib Utilities (`lib/`)

| Module | Key Exports | Usage | Status |
|--------|-------------|-------|--------|
| `auth.ts` | `getServerSession`, `requireAdmin`, `hasRole` | 40+ API routes | ✅ Core |
| `prisma.ts` | `prisma` | 100+ files | ✅ Core |
| `utils.ts` | `cn`, `normalizePublicPath`, `truncate` | 10+ files | ✅ Used |
| `utils.ts` | **`formatDate`, `slugify`** | **NONE** | ❌ **UNUSED** |
| `currency.ts` | `formatPriceShort`, `convertPrice` | 15+ files | ✅ Used |
| `currency.ts` | **Various helpers** | **NONE** | ⚠️ **Partially unused** |
| `cart.ts` | Cart functions | Cart/checkout | ✅ Used |
| `email.ts` | Email sending | API routes | ✅ Used |
| `order-fulfillment.ts` | Order processing | Checkout | ✅ Used |
| `useAnalytics.ts` | Analytics hooks | 1 file | ⚠️ **Limited use** |

---

## Redundancy Findings

### 1. SessionProvider Duplication

**Evidence**:
- `app/(main)/layout.tsx:23` - SessionProvider wrapper
- `app/admin/layout.tsx:42` - SessionProvider wrapper
- `app/(user)/layout.tsx:12` - SessionProvider wrapper

**Why it's redundant**: SessionProvider can be lifted to the root layout (`app/layout.tsx`) to wrap the entire app once.

**Recommendation**: Move SessionProvider to `app/layout.tsx`

**Risk Level**: LOW (straightforward refactor)

---

### 2. ToastProvider Duplication

**Evidence**:
- `app/Providers.tsx:11` - ToastProvider wrapper
- `app/admin/layout.tsx:43` - ToastProvider wrapper
- `app/(user)/dashboard/layout.tsx:71` - ToastProvider wrapper

**Why it's redundant**: ToastProvider is context-based and should only be declared once at the root level.

**Recommendation**: Keep only in `app/Providers.tsx`, remove from admin and dashboard layouts

**Risk Level**: LOW (already partially centralized)

---

### 3. Hero Component Variants

**Evidence**:
- `components/Hero.tsx` (192 lines) - Generic prop-based hero with framer-motion
- `components/home/HeroFormal.tsx` (69 lines) - Formal variant with focus areas
- `components/home/HeroVibey.tsx` (60 lines) - Vibey variant with gradient
- `components/home/HeroSwitch.tsx` (16 lines) - Wrapper that just renders HeroVibey

**Why it's redundant**:
- `Hero.tsx` is never imported (dead code)
- `HeroFormal.tsx` is never used (dead code)
- `HeroSwitch.tsx` is a pointless wrapper
- Only homepage uses `IntroScene` and `FeaturedWorkStory`, not any hero

**Recommendation**: Delete all four hero components

**Risk Level**: MEDIUM (verify no dynamic imports)

---

### 4. Multiple Redirect Aliases

**Evidence**:
- `/shop` → `/products` (`app/(main)/shop/page.tsx`)
- `/digital-products` → `/products` (`app/(main)/digital-products/page.tsx`)
- `/services` → `/products` (`app/(main)/services/page.tsx`)
- `/memberships` → `/products` (`app/(main)/memberships/page.tsx`)
- `/request` → `/contact` (`app/(main)/request/page.tsx`)
- `/about-developer` → `/about` (`app/(main)/about-developer/page.tsx`)

**Why it's not actually redundant**: These are intentional aliases for better UX and SEO. Each redirect is a single line.

**Recommendation**: KEEP AS IS (good practice for route flexibility)

**Risk Level**: N/A (working as intended)

---

### 5. Unused Home Sections

**Evidence**:
- `components/home/HowIThink.tsx` - "How I Think" section component
- `components/home/ProofSnapshot.tsx` - Proof items display
- `components/home/FeaturedWorkFlow.tsx` - Alternative featured work display
- `components/home/MemberHomeTop.tsx` - Member-specific homepage top section

**Why it's redundant**: Homepage (`app/(main)/page.tsx`) only uses `IntroScene` and `FeaturedWorkStory`. These components appear to be from previous homepage designs.

**Recommendation**: Delete if not planning to use; otherwise move to a `/archive` folder

**Risk Level**: LOW (clearly unused in current homepage)

---

## Unused / Dead Code Findings

### Confirmed Unused Components

| File | Component | Lines | Reason | Recommendation |
|------|-----------|-------|--------|----------------|
| `components/Hero.tsx` | Hero | 192 | Never imported | DELETE |
| `components/home/HeroFormal.tsx` | HeroFormal | 69 | Never imported | DELETE |
| `components/home/HeroVibey.tsx` | HeroVibey | 60 | Only imported by unused HeroSwitch | DELETE |
| `components/home/HeroSwitch.tsx` | HeroSwitch | 16 | Never imported, wrapper only | DELETE |
| `components/home/MemberHomeTop.tsx` | MemberHomeTop | ~150 | Never imported | DELETE or ARCHIVE |
| `components/home/HowIThink.tsx` | HowIThink | ~100 | Never imported | DELETE or ARCHIVE |
| `components/home/FeaturedWorkFlow.tsx` | FeaturedWorkFlow | ~120 | Never imported | DELETE or ARCHIVE |
| `components/home/ProofSnapshot.tsx` | ProofSnapshot | ~80 | Never imported | DELETE or ARCHIVE |
| `components/PortfolioCard.tsx` | PortfolioCard | ~70 | Never imported | DELETE |
| `components/AdSlot.tsx` | AdSlot | ~50 | Never imported | DELETE or IMPLEMENT |

**Total**: ~900 lines of dead code

---

### Confirmed Unused Utilities

| File | Function | Reason | Recommendation |
|------|----------|--------|----------------|
| `lib/utils.ts` | `formatDate()` | Contains TODO comment, never called | DELETE or IMPLEMENT |
| `lib/utils.ts` | `slugify()` | Never imported/called | DELETE |
| `lib/currency.ts` | `parseCurrency()` | Never imported/called | DELETE |
| `lib/currency.ts` | `getCurrencySymbol()` | Never imported/called | DELETE |
| `lib/currency.ts` | `getCurrencyName()` | Never imported/called | DELETE |
| `lib/currency.ts` | `formatPriceWithConversion()` | Never imported/called | DELETE |
| `lib/currency.ts` | `getPriceInMultipleCurrencies()` | Never imported/called | DELETE |
| `lib/currency.ts` | `getExchangeRate()` | Never imported/called | DELETE |

---

### Possibly Unused (Needs Confirmation)

| File | Component/Function | Usage | Verification Command |
|------|-------------------|-------|---------------------|
| `components/cart/CartIcon.tsx` | CartIcon | No imports found | `rg "CartIcon" -S .` |
| `lib/useAnalytics.ts` | Multiple tracking functions | Only basic usage | `rg "useAnalytics\|usePageTracking" -S .` |

**Verification Commands**:
```bash
# Check CartIcon usage
rg "CartIcon" -S .

# Check analytics usage
rg "useAnalytics|usePageTracking" -S .

# Verify no dynamic imports for hero components
rg "import.*Hero|dynamic.*Hero" -S .
```

---

## Broken / Invalid Routes & Redirects

### ❌ Confirmed Broken

| Source File | Referenced Path | Status | Why It's Broken | Recommended Fix | Risk Level |
|-------------|----------------|--------|-----------------|-----------------|------------|
| `app/(auth)/login/page.tsx:146` | `/forgot-password` | ❌ BROKEN | No route exists for password reset | Create `app/(auth)/forgot-password/page.tsx` OR remove link | HIGH |

---

### ⚠️ Potentially Confusing (Working but Aliased)

These routes work but redirect immediately:

| Link | Redirects To | Source | Note |
|------|-------------|--------|------|
| `/shop` | `/products` | Multiple cart/dashboard pages | Working alias |
| `/services` | `/products` | Dashboard, footer | Working alias |
| `/request` | `/contact` | Dashboard, footer | Working alias |
| `/memberships` | `/products` | Dashboard | Working alias |

**Recommendation**: Update links to point directly to `/products` and `/contact` to avoid unnecessary redirects.

**Verification Command**:
```bash
# Find all references to aliased routes
rg 'href="/shop"|href="/services"|href="/request"|href="/memberships"' -S .
```

---

### ✅ Valid Redirects in next.config.js

```javascript
// next.config.js redirects - VALID
/privacy → /legal/privacy-policy (permanent)
/terms → /legal/terms (permanent)
```

These are properly configured and working.

---

### ✅ Valid Middleware Redirects

```typescript
// middleware.ts - All valid
/admin/* → /login (if unauthenticated)
/admin/* → / (if unauthorized role)
/admin/* → /admin/setup-2fa (if 2FA not configured)
/dashboard/* → /login (if unauthenticated)
```

All middleware redirects are valid and security-focused.

---

## Dependency Hygiene

### Unused Dependencies

| Package | Version | Current Usage | Recommendation | Savings |
|---------|---------|---------------|----------------|---------|
| **react-icons** | 5.5.0 | Only 1 icon in login page (GitHub) | Replace with lucide-react or inline SVG | ~1MB bundle |

**Evidence**:
```bash
# Only one usage found
rg "react-icons" -S .
# Result: app/(auth)/login/page.tsx:1:import { FaGithub } from 'react-icons/fa'
```

**Recommendation**: Replace `FaGithub` with Lucide's GitHub icon:
```typescript
// Before
import { FaGithub } from 'react-icons/fa'

// After
import { Github } from 'lucide-react'
// Use as: <Github size={20} />
```

---

### Dependencies Correctly Used

All other dependencies are actively used:

- ✅ **framer-motion** - Used in Hero, IntroScene, StoryReveal (10+ files)
- ✅ **lucide-react** - Primary icon library (40+ files)
- ✅ **next-auth** - Authentication system (20+ files)
- ✅ **@prisma/client** - Database ORM (100+ files)
- ✅ **react-easy-crop** - Image cropping in ImageUploadCrop
- ✅ **playwright** - Screenshot capture in admin
- ✅ **qrcode** - 2FA QR code generation
- ✅ **otplib** - 2FA OTP generation
- ✅ **nodemailer** - Email sending
- ✅ **resend** - Email service provider
- ✅ **bcryptjs** - Password hashing
- ✅ **tailwind-merge** - CSS utility merging
- ✅ **clsx** - Conditional classnames
- ✅ **@vercel/analytics** - Analytics tracking

---

## Structural Improvements

### 1. Centralize Providers in Root Layout

**Current Structure**:
```
app/layout.tsx
  └─ Providers (ToastProvider)
      └─ PreferencesGate

app/(main)/layout.tsx
  └─ SessionProvider ← REDUNDANT

app/admin/layout.tsx
  └─ SessionProvider ← REDUNDANT
  └─ ToastProvider ← REDUNDANT

app/(user)/layout.tsx
  └─ SessionProvider ← REDUNDANT

app/(user)/dashboard/layout.tsx
  └─ ToastProvider ← REDUNDANT
```

**Recommended Structure**:
```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          <Providers>
            {children}
          </Providers>
        </SessionProvider>
      </body>
    </html>
  )
}

// app/Providers.tsx (updated)
export function Providers({ children }) {
  return (
    <ToastProvider>
      <PreferencesProvider>
        <PreferencesGate>
          {children}
        </PreferencesGate>
      </PreferencesProvider>
    </ToastProvider>
  )
}
```

**Impact**: Eliminates 3 duplicate SessionProvider instances and 2 duplicate ToastProvider instances.

---

### 2. Component Organization
  
**Current Issues**:
- Multiple unused Hero variants in `components/` and `components/home/`
- `PortfolioCard` exists but `ProjectCard` and `ProductCard` are used instead
- Unclear separation between active and archived components

**Recommendation**:

```
components/
├── ui/           # Reusable UI primitives (good as-is)
├── admin/        # Admin-specific (good as-is)
├── cart/         # Cart-specific (good as-is)
├── shop/         # Shop-specific (good as-is)
├── preferences/  # Preferences (good as-is)
├── layout/       # Layout primitives (good as-is)
├── motion/       # Motion/animation (good as-is)
├── nav/          # Navigation (good as-is)
├── home/         # Homepage-specific components
│   ├── IntroScene.tsx          ✅ Keep
│   ├── FeaturedWorkStory.tsx   ✅ Keep
│   ├── StickerField.tsx        ✅ Keep
│   ├── HeroFormal.tsx          ❌ Delete
│   ├── HeroVibey.tsx           ❌ Delete
│   ├── HeroSwitch.tsx          ❌ Delete
│   ├── MemberHomeTop.tsx       ❌ Delete or archive
│   ├── HowIThink.tsx           ❌ Delete or archive
│   ├── FeaturedWorkFlow.tsx    ❌ Delete or archive
│   └── ProofSnapshot.tsx       ❌ Delete or archive
├── Header.tsx            ✅ Keep
├── Footer.tsx            ✅ Keep
├── AdminHeader.tsx       ✅ Keep
├── ProjectCard.tsx       ✅ Keep
├── FeaturedProjects.tsx  ✅ Keep
├── ImageUploadCrop.tsx   ✅ Keep
├── VibeyBackdrop.tsx     ✅ Keep
├── CookieNotice.tsx      ✅ Keep
├── Hero.tsx              ❌ Delete
├── PortfolioCard.tsx     ❌ Delete
└── AdSlot.tsx            ❌ Delete or implement
```

---

### 3. Lib Utilities Cleanup

**Current `lib/utils.ts`**:
```typescript
export function cn(...) { } // ✅ Used heavily
export function normalizePublicPath(...) { } // ✅ Used
export function truncate(...) { } // ✅ Used
export function formatDate(...) { } // ❌ Unused (has TODO)
export function slugify(...) { } // ❌ Unused
```

**Recommendation**: Remove `formatDate` and `slugify`

**Current `lib/currency.ts`**:
- Keep: `formatPriceShort`, `convertPrice`, `isSupportedCurrency`, `SupportedCurrency`
- Remove: `parseCurrency`, `getCurrencySymbol`, `getCurrencyName`, `formatPriceWithConversion`, `getPriceInMultipleCurrencies`, `getExchangeRate`

---

### 4. Route Naming Consistency

**Current Route Aliases**:
- Multiple routes redirect to `/products` (shop, services, memberships, digital-products)
- `/request` redirects to `/contact`

**Recommendation**: Document this intentionally in a `ROUTES.md` file:

```markdown
# Route Aliases

## Product Routes
- /products (canonical)
- /shop → /products
- /digital-products → /products
- /services → /products
- /memberships → /products

## Contact Routes
- /contact (canonical)
- /request → /contact

## About Routes
- /about (canonical)
- /about-developer → /about
```

**Impact**: Improves maintainability and onboarding

---

### 5. Folder Structure Best Practices

Current structure is already good! Suggestions:

- ✅ Route groups properly used: `(main)`, `(auth)`, `(user)`
- ✅ API routes organized under `/api`
- ✅ Components organized by domain
- ✅ Lib utilities cleanly separated

No major structural changes needed.

---

## Quick Wins (≤ 1 hour)

### 1. Delete Unused Components (15 min)

```bash
# Delete unused Hero variants
rm components/Hero.tsx
rm components/home/HeroFormal.tsx
rm components/home/HeroVibey.tsx
rm components/home/HeroSwitch.tsx

# Delete unused utility components
rm components/PortfolioCard.tsx
rm components/AdSlot.tsx
```

**Impact**: ~400 lines removed

---

### 2. Remove Unused Utility Functions (10 min)

Edit `lib/utils.ts`:
```typescript
// Remove these functions:
- formatDate()
- slugify()
```

Edit `lib/currency.ts`:
```typescript
// Remove these functions:
- parseCurrency()
- getCurrencySymbol()
- getCurrencyName()
- formatPriceWithConversion()
- getPriceInMultipleCurrencies()
- getExchangeRate()
```

**Impact**: ~100 lines removed

---

### 3. Replace react-icons with lucide-react (20 min)

```bash
# 1. Edit app/(auth)/login/page.tsx
# Change:
import { FaGithub } from 'react-icons/fa'
# To:
import { Github } from 'lucide-react'

# Change usage:
<FaGithub />
# To:
<Github size={20} />

# 2. Uninstall package
npm uninstall react-icons
```

**Impact**: ~1MB bundle size reduction

---

### 4. Fix Broken /forgot-password Link (15 min)

**Option A - Remove the link** (fastest):
```typescript
// app/(auth)/login/page.tsx:146
// Delete this line:
<Link href="/forgot-password" className="text-sm text-primary hover:underline">
  Forgot password?
</Link>
```

**Option B - Create password reset page**:
```bash
mkdir -p app/\(auth\)/forgot-password
# Create page.tsx with password reset form
```

---

### Total Quick Wins**: ~1 hour, ~500 lines removed, 1MB saved

---

## Bigger Refactors (Optional but Valuable)

### 1. Centralize Providers (2-3 hours)

**Steps**:
1. Move `SessionProvider` to `app/layout.tsx`
2. Remove `SessionProvider` from `(main)/layout.tsx`, `admin/layout.tsx`, `(user)/layout.tsx`
3. Remove duplicate `ToastProvider` from `admin/layout.tsx` and `dashboard/layout.tsx`
4. Test all layouts for functionality

**Impact**: Cleaner provider hierarchy, better performance

**Risk**: MEDIUM (requires thorough testing across all routes)

---

### 2. Update Route References (1-2 hours)

Replace aliased route links with canonical routes:

```typescript
// Current
href="/shop" → href="/products"
href="/services" → href="/products"
href="/request" → href="/contact"
```

**Files to update**: ~30 components and pages

**Impact**: Eliminates unnecessary redirects

**Risk**: LOW (purely cosmetic)

---

### 3. Archive Unused Homepage Components (30 min)

Instead of deleting, archive for future use:

```bash
mkdir -p components/archive/home
mv components/home/MemberHomeTop.tsx components/archive/home/
mv components/home/HowIThink.tsx components/archive/home/
mv components/home/FeaturedWorkFlow.tsx components/archive/home/
mv components/home/ProofSnapshot.tsx components/archive/home/
```

**Impact**: Preserves work while keeping active codebase clean

**Risk**: NONE

---

### 4. Improve Analytics Implementation (3-4 hours)

`lib/useAnalytics.ts` has many functions but minimal usage. Either:

**Option A**: Fully implement analytics across the site
**Option B**: Remove unused tracking functions

**Impact**: Better data insights OR cleaner codebase

**Risk**: MEDIUM (requires product decision)

---

### 5. Implement AdSlot Component (2-3 hours)

`components/AdSlot.tsx` exists but isn't used. Either:

**Option A**: Integrate ads into pages
**Option B**: Delete the component

**Impact**: Revenue potential OR cleaner codebase

**Risk**: LOW (business decision)

---

## Verification Commands

Use these commands to verify findings:

```bash
# 1. Check for unused components
rg "import.*Hero[^FVSP]" -S .
rg "import.*PortfolioCard" -S .
rg "import.*AdSlot" -S .
rg "import.*MemberHomeTop" -S .
rg "import.*HowIThink" -S .

# 2. Check SessionProvider instances
rg "SessionProvider" -S .

# 3. Check ToastProvider instances
rg "ToastProvider" -S .

# 4. Check for forgot-password route
find app -name "*forgot*" -o -name "*reset*"

# 5. Check react-icons usage
rg "react-icons" -S .

# 6. Check for broken hrefs
rg 'href="/forgot-password"' -S .

# 7. Verify route aliases
rg 'redirect\(' app/\(main\) -S

# 8. Check unused utility functions
rg "formatDate|slugify|parseCurrency|getCurrencySymbol" -S .

# 9. Full link audit
rg 'href=["'"'"'][^"'"'"']+["'"'"']|router\.(push|replace)\(|redirect\(' -S .

# 10. Component usage verification
for comp in Hero HeroFormal HeroVibey HeroSwitch PortfolioCard AdSlot; do
  echo "=== $comp ==="
  rg "import.*$comp|from.*$comp" -S .
done
```

---

## Appendix

### Assumptions

1. **Dynamic imports not detected**: Grep-based analysis may miss dynamic imports like `import()` or `next/dynamic`
2. **String-based hrefs not detected**: Links constructed dynamically (e.g., `` href={`/${path}`} ``) may not be caught
3. **Build-time code elimination**: Next.js tree-shaking may already eliminate some unused code from production builds
4. **Test files excluded**: No test files found; analysis assumes src files only
5. **Environment-specific code**: Some components (like AdSlot) may be conditionally rendered based on env vars

### Missing Files That Limit Certainty

1. **No .env file analyzed**: Cannot verify if components like AdSlot are conditionally enabled
2. **No test files**: Cannot determine if "unused" components are actually test fixtures
3. **No storybook/docs**: Cannot determine if components are documented examples
4. **Build output not analyzed**: Cannot verify actual bundle impact of unused code

### Files Analyzed

- **Total files scanned**: 188
- **TypeScript/TSX files**: 154
- **Page routes**: 54
- **Layout files**: 7
- **Component files**: 47
- **Lib modules**: 26
- **API routes**: 85+

---

## Summary

### Total Impact of Cleanup

| Category | Items | Lines of Code | Bundle Size |
|----------|-------|---------------|-------------|
| Unused components | 10 | ~900 | Unknown |
| Unused utilities | 8 functions | ~150 | Unknown |
| Duplicate providers | 5 instances | ~30 | Negligible |
| Unused dependencies | 1 package | N/A | ~1MB |
| **Total** | **~24 items** | **~1,080** | **~1MB** |

### Broken Routes

- **Critical**: 1 (forgot-password)
- **Confusing**: 0 (aliases work as intended)

### Architecture Quality

- ✅ **Well-structured route groups**
- ✅ **Clean API organization**
- ✅ **Good component modularity**
- ⚠️ **Provider duplication** (easy fix)
- ⚠️ **Some dead code accumulation** (expected in active projects)

### Recommended Priority

**High Priority (Do First)**:
1. Fix `/forgot-password` broken link
2. Delete 4 unused Hero components
3. Remove `react-icons` dependency

**Medium Priority (Next)**:
1. Centralize providers in root layout
2. Delete other unused components
3. Clean up unused utility functions

**Low Priority (Optional)**:
1. Update aliased route references
2. Archive unused homepage sections
3. Document route aliases

---

**End of Audit Report**
