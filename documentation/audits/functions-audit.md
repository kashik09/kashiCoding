# FUNCTIONS AUDIT REPORT

**Repository**: kashi-kweyu-portfolio
**Framework**: Next.js 14.2.0 (App Router) + TypeScript + Tailwind CSS
**Audit Date**: 2026-01-18
**Auditor**: Automated Function Analysis

---

## Executive Summary

This audit catalogues all custom functions, utilities, hooks, and API handlers across the codebase. The project is a full-stack e-commerce and portfolio platform with enterprise-grade features.

| Category | Count |
|----------|-------|
| Total API Routes | 84 |
| Custom Utility Functions | 180+ |
| React Components | 75 |
| Lib/Utility Files | 41 |
| Database Models | 13+ |
| Authentication Methods | 5 |

### Complexity Rating Scale

| Rating | Description |
|--------|-------------|
| Low | Simple utility, single operation, wrapper function |
| Medium | Moderate logic, some branching, validation |
| High | Complex logic, multiple operations, DB transactions, error handling |

### Big O Notation Reference

Big O notation describes how an algorithm's performance (time or space) scales as input size grows.

[Like asking "If I have 10 things it takes 1 second, but what if I have 1 million things?"]

| Notation | Name | Example | ELI5 |
|----------|------|---------|------|
| **O(1)** | Constant | Array index lookup | No matter how big the list, same time - like knowing exactly which locker is yours |
| **O(log n)** | Logarithmic | Binary search | Like finding a word in a dictionary by opening to the middle and eliminating half each time |
| **O(n)** | Linear | Loop through array | Like reading every page of a book - twice the pages = twice the time |
| **O(n log n)** | Linearithmic | Merge sort, Quick sort | Like organizing cards by repeatedly splitting and merging |
| **O(n²)** | Quadratic | Nested loops | Like comparing every student to every other student - 10 students = 100 comparisons |
| **O(n³)** | Cubic | Triple nested loops | 3D comparisons - grows very fast |
| **O(2ⁿ)** | Exponential | Recursive fibonacci | Like a chain letter that doubles each round - explodes quickly |
| **O(n!)** | Factorial | Permutations | Like arranging people in every possible order - 10 people = 3,628,800 arrangements |

**Visual Growth (n = 10):**

```
O(1)       →  1
O(log n)   →  3
O(n)       →  10
O(n log n) →  33
O(n²)      →  100
O(n³)      →  1,000
O(2ⁿ)      →  1,024
O(n!)      →  3,628,800
```

**Other Notations:**

| Notation | Meaning |
|----------|---------|
| **Big O (O)** | Upper bound (worst case) - most commonly used |
| **Big Omega (Ω)** | Lower bound (best case) |
| **Big Theta (Θ)** | Tight bound (average case) |

---

## 1. Authentication & Session Functions

### `/lib/auth.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `getServerSession()` | Get current authenticated session | Low |
| `requireAuth(redirectTo?)` | Enforce authentication, redirect if not logged in | Medium |
| `requireAdmin(redirectTo?)` | Enforce admin role | Medium |
| `hasRole(role)` | Check user role | Low |
| `isAdmin()` | Check if user is admin | Low |
| `isAuthenticated()` | Check if user is authenticated | Low |
| `getCurrentUserId()` | Get current user's ID | Low |
| `getCurrentUser()` | Get current user object | Low |
| `hasPermission(userId, resourceOwnerId, userRole, requiredRole?)` | Permission checker | Medium |
| `getUserDisplayName(user)` | Format user display name | Low |

### `/lib/auth-utils.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `normalizeEmail(value)` | Normalize email to lowercase | Low |
| `getNonEmptyString(value)` | Validate non-empty strings | Low |
| `isValidEmail(value)` | Email format validation | Low |
| `isValidPassword(value)` | Password length validation (8-72 chars) | Low |

### `/lib/auth-env.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `validateAuthEnv()` | Validate required environment variables at startup | Medium |
| `getAuthEnvStatus()` | Check auth env status | Low |
| `getEnv(name)` | Get trimmed env var | Low |
| `requireEnv(name)` | Get required env var or throw | Low |
| `ensurePairedEnv(left, right, missing)` | Validate paired env vars | Medium |

### `/lib/password.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `hashPassword(password)` | Hash password with bcrypt (12 rounds) | Low |
| `verifyPassword(password, hashedPassword)` | Verify password against hash | Low |

### `/lib/admin-security.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `createSignedToken<T>(payload, secret?)` | Create HMAC-signed JWT token | Medium |
| `verifySignedToken<T>(token, secret?)` | Verify signed token | Medium |
| `hashValue(value, secret?)` | Create HMAC hash | Low |
| `getRequestIp(headers)` | Extract client IP from headers | Low |
| `getRequestCountry(headers)` | Extract country from Vercel headers | Low |
| `base64UrlEncode(data)` | URL-safe base64 encoding | Low |
| `base64UrlDecode(input)` | URL-safe base64 decoding | Low |
| `createHmacSignature(base, secret)` | Create HMAC-SHA256 signature | Low |

### `/lib/admin-stepup.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `requireAdminStepUp(request, session)` | Middleware for admin step-up authentication | High |

---

## 2. Cart & Shopping Functions

### `/lib/cart.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `getOrCreateCart(userId)` | Get or create user's cart | Medium |
| `addToCart(userId, productId, licenseType)` | Add item to cart | Medium |
| `removeFromCart(userId, itemId)` | Remove item from cart | Low |
| `updateCartItemQuantity(userId, itemId, quantity)` | Update item quantity | Medium |
| `clearCart(userId)` | Clear all items from cart | Low |
| `calculateCartTotal(userId, currency?)` | Calculate subtotal, tax, total | High |
| `getCartWithItems(userId)` | Get cart with full item details | Medium |
| `getCartItemCount(userId)` | Get number of items in cart | Low |

---

## 3. Discount & Student Verification Functions

### `/lib/discounts.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `getUserDiscountEligibility(userId)` | Check student discount eligibility | High |
| `calculateDiscountedPrice(originalPrice, discountPercent)` | Calculate discounted price | Low |
| `getDiscountDisplayInfo(discountType)` | Get discount display label & badge | Low |
| `canApplyForVerification(userId)` | Check if user can apply (cooldown) | Medium |

---

## 4. Order & Fulfillment Functions

### `/lib/order-fulfillment.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `canFulfillOrder(orderId)` | Check if order can be fulfilled | Medium |
| Additional functions | Order processing logic | High |

### `/lib/order-number.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| Order number generation | Managing order number sequences | Medium |

---

## 5. License & Product Key Functions

### `/lib/license.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `generateLicenseKey(prefix?)` | Generate unique license key | Medium |
| `logLicenseAudit(options)` | Log license audit events | Medium |
| `canAssignSeat(licenseId)` | Check if team license can add more seats | Medium |

**Constants:**
- `TEAM_LICENSE_MAX_SEATS`
- `DOWNLOAD_ABUSE_THRESHOLD`

---

## 6. Download & File Handling Functions

### `/lib/downloads.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `createDownloadToken(payload)` | Create download token | Medium |
| `verifyDownloadToken(token)` | Verify download token | Medium |
| `hashIp(ip)` | Hash IP address for privacy | Low |
| `getSafeProductFileUrl(rawUrl, requestHost?)` | Validate product file URL | Medium |
| `logDownloadEvent(options)` | Log download audit | Medium |
| `cleanupStalePendingDownloads(now?)` | Clean up failed downloads | High |

**Constants:**
- `DOWNLOAD_LIMIT`
- `DOWNLOAD_WINDOW_DAYS`
- `DOWNLOAD_TOKEN_TTL_SECONDS`

### `/lib/upload-utils.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `slugify(text)` | Convert text to URL slug | Low |
| `sanitizeFilename(name)` | Remove unsafe characters from filename | Low |
| `generateSmartFilename(options)` | Generate context-aware filename with timestamp | Medium |

---

## 7. Wishlist Functions

### `/lib/wishlist.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `getWishlistForUser(userId)` | Get user's wishlist with products | Medium |
| `addWishlistItem(userId, productId)` | Add product to wishlist (idempotent) | Medium |
| `removeWishlistItem(userId, productId)` | Remove product from wishlist | Low |
| `isInWishlist(userId, productId)` | Check if product is in wishlist | Low |

---

## 8. Audit Logging Functions

### `/lib/audit-logger.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `createAuditLog(data)` | Create generic audit log entry | Medium |
| `logLoginAttempt(userId, email, success, ipHash?, userAgent?)` | Log login attempts | Medium |
| `logSettingsChange(userId, settingName, oldValue, newValue, ipHash?, userAgent?)` | Log settings changes | Medium |
| `logContentEdit(userId, resourceType, resourceId, changes, ipHash?, userAgent?)` | Log content edits | Medium |
| `logDeletion(userId, resourceType, resourceId, resourceData?, ipHash?, userAgent?)` | Log deletions | Medium |
| `logOrderStatusChange(userId, orderId, oldStatus, newStatus, ipHash?, userAgent?)` | Log order changes | Medium |
| `getIpHash(request)` | Extract and hash IP from request | Low |
| `getUserAgent(request)` | Extract user agent from request | Low |

---

## 9. Account Suspension Functions

### `/lib/suspension.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `suspendUser(userId, reason, suspendedBy)` | Suspend user account & revoke licenses | High |
| `unsuspendUser(userId, unsuspendedBy)` | Unsuspend account & reactivate licenses | High |

### `/lib/suspension-middleware.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `checkUserSuspension(userId)` | Check suspension status | Medium |
| `requireNotSuspended(request)` | Middleware to block suspended users | Medium |
| `canUserDownload(userId, licenseId)` | Check download permission | Medium |
| `canUserPurchase(userId)` | Check purchase permission | Medium |

---

## 10. Currency & Pricing Functions

### `/lib/currency.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `convertPrice(amount, from, to)` | Convert between currencies | Low |
| `formatPrice(amount, currency)` | Format price with currency symbol | Low |
| `formatPriceShort(amount, currency)` | Short price format | Low |
| `isSupportedCurrency(currency)` | Validate currency code | Low |
| `getDefaultCurrency()` | Get default currency (USD) | Low |

**Constants:**
- `SUPPORTED_CURRENCIES`
- `EXCHANGE_RATES`
- `CURRENCY_INFO`

### `/lib/currency-preference.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `getSavedCurrency()` | Get user's saved currency preference | Low |
| `saveCurrency(currency)` | Save currency preference | Low |
| `getDefaultCurrencyFromCountry(country)` | Get currency based on geo location | Low |

---

## 11. Logging & Monitoring Functions

### `/lib/logger.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `logger.info(message, context?)` | Log info | Low |
| `logger.warn(message, context?)` | Log warning | Low |
| `logger.error(message, error?, context?)` | Log error | Low |
| `logger.debug(message, context?)` | Log debug (dev only) | Low |
| `logger.apiError(endpoint, error, context?)` | Log API errors | Medium |
| `logger.authError(action, error, context?)` | Log auth errors | Medium |
| `logger.validationError(field, value, message)` | Log validation errors | Low |
| `logger.performanceLog(metric, duration, context?)` | Log performance metrics | Low |
| `logErrorBoundary(error, errorInfo)` | Log React error boundary | Medium |
| `logApiError(method, path, error, statusCode?)` | Log API route errors | Medium |
| `logDatabaseError(operation, model, error)` | Log Prisma errors | Medium |

---

## 12. Rate Limiting Functions

### `/lib/rate-limit.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `getClientIp(request)` | Extract client IP | Low |
| `getRateLimitKey(request, scope)` | Generate rate limit key | Low |
| `checkRateLimit(key, limit, windowMs)` | Check & track rate limit | Medium |
| `getRateLimitHeaders(result)` | Get rate limit response headers | Low |

---

## 13. Email & Notification Functions

### `/lib/email.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `getEmailConfigFromDB()` | Load SMTP config from database | Medium |
| `getEmailConfigFromEnv()` | Load SMTP config from environment | Low |
| Nodemailer wrappers | Email sending functions | High |

### `/lib/resend.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `getResendConfig()` | Get Resend API configuration | Low |
| `getEmailDomain(address)` | Extract email domain | Low |
| `extractEmail(address)` | Extract email from formatted address | Low |

---

## 14. Availability Status Functions

### `/lib/availability.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `calculateEffectiveAvailability(settings, currentDate?)` | Calculate service availability | High |
| `isOnLeave(date, leaveStart, leaveEnd)` | Check if date is in leave period | Low |
| `isHoliday(date)` | Check if date is holiday | Low |
| `limitStatus(status)` | Limit availability status | Low |
| `formatDate(date)` | Format date for display | Low |

---

## 15. General Utility Functions

### `/lib/utils.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `cn(...inputs)` | Merge Tailwind CSS classes (clsx + tailwind-merge) | Low |
| `truncate(text, length)` | Truncate text to length | Low |
| `normalizePublicPath(input)` | Normalize file paths to public URLs | Low |
| `isLocalImageUrl(src)` | Check if image is local | Low |

### `/lib/product-ui.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| `prettyCategory(category)` | Format product category for display | Low |
| `PRODUCT_CATEGORY_LABEL` | Category label mapping | Low |

### `/lib/strings.ts`

| Function | Purpose | Complexity |
|----------|---------|------------|
| Various | String utility functions | Low |

---

## 16. React Hooks

### `/lib/usePendingAction.ts`

| Hook | Purpose | Complexity |
|------|---------|------------|
| `usePendingAction()` | Track async action state | Medium |

**Returns:** `{ isPending: boolean, run: (action: PendingAction) => Promise<void> }`

### `/lib/useAnalytics.ts`

| Hook | Purpose | Complexity |
|------|---------|------------|
| `useAnalytics()` | Analytics tracking | Medium |

**Methods:**
- `trackPageView(data)` - Track page views
- `trackEvent(data)` - Track custom events
- `trackProjectView(projectId, projectTitle)` - Track project views
- `trackClick(buttonName, location)` - Track button clicks
- `trackFormSubmit(formName, success)` - Track form submissions
- `trackDownload(fileName, fileType)` - Track downloads
- `trackThemeChange(themeName)` - Track theme changes

| Hook | Purpose | Complexity |
|------|---------|------------|
| `usePageTracking(pageName)` | Auto-track page views & time on page | Medium |

### `/lib/preferences/useResolvedAppearance.ts`

| Hook | Purpose | Complexity |
|------|---------|------------|
| `useResolvedAppearance()` | Resolved theme appearance with system preference detection | Medium |

---

## 17. Prisma & Database

### `/lib/prisma.ts`

| Export | Purpose | Complexity |
|--------|---------|------------|
| `prisma` | Singleton Prisma client instance | Low |

---

## 18. API Route Handlers (84 Total)

### Authentication Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth.js callback |
| `/api/auth/signup` | POST | User registration |
| `/api/auth/status` | GET | Check auth status |
| `/api/auth/password/request` | POST | Password reset request |
| `/api/auth/password/reset` | POST | Password reset confirmation |
| `/api/auth/2fa/setup` | POST | 2FA setup (generate QR code) |
| `/api/auth/2fa/verify` | POST | Verify 2FA code |
| `/api/auth/2fa/disable` | POST | Disable 2FA |
| `/api/auth/2fa/validate` | POST | Validate 2FA token |
| `/api/auth/2fa/verify-session` | POST | Verify 2FA for session |
| `/api/auth/trusted-devices` | GET | Manage trusted devices |
| `/api/auth/trusted-devices/[id]` | DELETE | Delete trusted device |
| `/api/auth/trusted-devices/validate` | POST | Validate device |

### User & Profile Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/me/profile` | GET/PUT | Get/update user profile |
| `/api/me/password/change` | POST | Change password |
| `/api/me/ad-consent` | POST | Save ad tracking consent |
| `/api/me/summary` | GET | Get user account summary |
| `/api/me/requests` | GET | Get user service requests |
| `/api/me/requests/[id]` | GET/PUT | Get/update specific request |
| `/api/me/notifications` | GET | Get user notifications |
| `/api/me/wishlist` | GET | Get wishlist |
| `/api/me/wishlist/[productId]` | POST/DELETE | Add/remove wishlist item |
| `/api/me/downloads` | GET | Get download history |
| `/api/me/downloads/[slug]` | GET | Download product file |

### Shopping & Cart Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/cart` | GET/POST/DELETE | Cart operations |
| `/api/cart/[itemId]` | PUT/DELETE | Update/delete cart item |
| `/api/shop/products` | GET | List products |
| `/api/shop/products/[slug]` | GET | Get product details |

### Orders & Checkout Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/orders` | GET | Order history |
| `/api/orders/[orderNumber]` | GET | Order details |
| `/api/orders/[orderNumber]/fulfill` | POST | Fulfill order |
| `/api/checkout` | POST | Create checkout session |
| `/api/payment/manual/confirm` | POST | Confirm manual payment |

### Content Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/content/landing` | GET | Landing page content |
| `/api/content/about` | GET | About page content |
| `/api/content/services` | GET | Services content |
| `/api/content/pricing` | GET | Pricing content |
| `/api/content/terms` | GET | Terms of service |
| `/api/content/privacy-policy` | GET | Privacy policy |
| `/api/content/request-form` | GET | Request form content |
| `/api/content/[slug]` | GET | Dynamic content pages |

### Admin Routes (18 total)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/admin/dashboard/stats` | GET | Dashboard statistics |
| `/api/admin/users` | GET/POST | List/create users |
| `/api/admin/users/[id]` | GET/PUT/DELETE | Manage user |
| `/api/admin/orders` | GET | List orders |
| `/api/admin/requests` | GET | List service requests |
| `/api/admin/requests/[id]` | PUT | Update request |
| `/api/admin/projects/[slug]` | PUT | Manage projects |
| `/api/admin/digital-products` | GET | List digital products |
| `/api/admin/digital-products/[id]` | GET/PUT | Manage product |
| `/api/admin/content` | GET | List content pages |
| `/api/admin/content/[slug]` | PUT | Update content |
| `/api/admin/analytics` | GET | Analytics data |
| `/api/admin/audit` | GET | Audit logs |
| `/api/admin/grievances` | GET | List grievances |
| `/api/admin/grievances/[id]` | PUT | Resolve grievance |
| `/api/admin/security-settings` | GET/PUT | Security settings |
| `/api/admin/settings/email` | GET/PUT | Email settings |
| `/api/admin/site-settings` | GET/PUT | Site settings |
| `/api/admin/screenshot` | POST | Screenshot capture |

### Student Verification Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/students/verification` | GET | Check student verification |
| `/api/student-verification/apply` | POST | Apply for verification |
| `/api/student-verification/status` | GET | Get verification status |
| `/api/admin/student-verifications` | GET | List verifications (admin) |
| `/api/admin/student-verifications/[id]/approve` | POST | Approve (admin) |
| `/api/admin/student-verifications/[id]/reject` | POST | Reject (admin) |

### Utility Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/upload` | POST | General file upload |
| `/api/upload/avatar` | POST | Avatar upload |
| `/api/site/status` | GET | Site status check |
| `/api/site/availability` | GET | Service availability |
| `/api/geo` | GET | Geolocation data |
| `/api/analytics/track` | POST | Analytics tracking |
| `/api/email/status` | GET | Email service status |
| `/api/send-notification` | POST | Send notifications |
| `/api/requests` | POST | Create service request |
| `/api/grievances` | POST | Submit grievance |

---

## 19. Framework & Library Functions Used

### Next.js Functions

| Function | Source | Purpose |
|----------|--------|---------|
| `NextRequest`, `NextResponse` | `next/server` | Route handlers |
| `useRouter()` | `next/navigation` | Client navigation |
| `usePathname()` | `next/navigation` | Current pathname |
| `useSearchParams()` | `next/navigation` | URL search params |
| `redirect()` | `next/navigation` | Server-side redirects |
| `revalidatePath()` | `next/cache` | ISR revalidation |
| `cookies()` | `next/headers` | Server-side cookies |
| `headers()` | `next/headers` | Request headers |
| `Image` | `next/image` | Optimized images |
| `Script` | `next/script` | Script injection |

### NextAuth.js Functions

| Function | Purpose |
|----------|---------|
| `getServerSession()` | Get session server-side |
| `SessionProvider` | Session context provider |
| `useSession()` | Client-side session hook |
| `signIn()` | Trigger sign in |
| `signOut()` | Trigger sign out |
| `CredentialsProvider` | Username/password auth |
| `GoogleProvider` | Google OAuth |
| `GitHubProvider` | GitHub OAuth |
| `EmailProvider` | Magic link auth |
| `PrismaAdapter` | Database adapter |

### React Hooks

| Hook | Purpose |
|------|---------|
| `useState()` | State management |
| `useEffect()` | Side effects |
| `useCallback()` | Memoized callbacks |
| `useRef()` | DOM refs |
| `useContext()` | Context consumption |
| `useReducer()` | Complex state |
| `useTransition()` | Concurrent features |
| `useDeferredValue()` | Deferred rendering |

### Framer Motion

| Function | Purpose |
|----------|---------|
| `motion.div`, `motion.button` | Animated components |
| `AnimatePresence` | Exit animations |
| `variants` | Animation definitions |
| `transition` | Animation timing |

### Prisma Client Methods

| Method | Purpose |
|--------|---------|
| `prisma.*.findUnique()` | Find single record |
| `prisma.*.findMany()` | Find multiple records |
| `prisma.*.create()` | Create record |
| `prisma.*.update()` | Update record |
| `prisma.*.delete()` | Delete record |
| `prisma.*.upsert()` | Upsert operation |
| `prisma.$transaction()` | Multi-statement transactions |
| `prisma.$queryRaw()` | Raw SQL queries |

### Other Major Libraries

| Library | Functions Used |
|---------|----------------|
| **OTPLib** | `authenticator.generateSecret()`, `generateToken()`, `verify()` |
| **QRCode** | `QRCode.toDataURL()` |
| **Nodemailer** | Email transport |
| **Resend** | Email API client |
| **bcryptjs** | `genSalt()`, `hash()`, `compare()` |
| **libphonenumber-js** | Phone validation |
| **react-easy-crop** | Image cropping |
| **Vercel Analytics** | `window.va()` |
| **TailwindCSS** | `cn()` utility |
| **DaisyUI** | CSS class utilities |
| **Lodash** | `_.debounce()`, `_.throttle()`, `_.cloneDeep()`, `_.get()`, `_.isEqual()` - utility functions for debouncing, deep cloning, safe property access |

---

## 20. Type Definitions

```typescript
// Auth Types
type UserRole = 'USER' | 'VIEWER' | 'EDITOR' | 'ADMIN' | 'MODERATOR' | 'OWNER'
interface SessionUser { id, email, name, role, image, twoFactorEnabled, twoFactorVerified }
interface AuthSession { user, expires }

// Cart Types
interface CartItem { id, cartId, productId, licenseType, quantity }

// Order Types
enum OrderStatus { PENDING, PROCESSING, FULFILLED, CANCELLED, REFUNDED }
enum PaymentStatus { PENDING, COMPLETED, FAILED, REFUNDED }

// License Types
enum LicenseStatus { ACTIVE, REVOKED, SUSPENDED, EXPIRED }
enum LicenseType { PERSONAL, COMMERCIAL, TEAM }

// Product Types
type PortfolioItemKind = 'PROJECT' | 'DIGITAL_PRODUCT'

// Currency Types
type SupportedCurrency = 'USD' | 'UGX'

// Discount Types
interface DiscountEligibility { eligible, discountType, discountPercent, expiresAt }

// Availability Types
type AvailabilityStatus = 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE'
```

---

## 21. Security Features Summary

| Feature | Implementation |
|---------|----------------|
| **Multi-factor Auth** | TOTP with backup codes |
| **Password Security** | bcrypt (12 rounds) |
| **Session Management** | JWT with NextAuth.js |
| **Role-based Access** | 6 user roles (USER to OWNER) |
| **Rate Limiting** | In-memory per-IP limiting |
| **Audit Logging** | Comprehensive action logging |
| **Admin Step-up** | Re-authentication for sensitive ops |
| **Trusted Devices** | 7-day device remembering |
| **IP Hashing** | Privacy-preserving IP tracking |
| **Download Tokens** | Time-limited file access |

---

## Appendix: File Index

| Directory | File Count | Primary Contents |
|-----------|------------|------------------|
| `/lib` | 41 | Utility functions, helpers |
| `/app/api` | 84 | API route handlers |
| `/components` | 75 | React components |
| `/types` | 5+ | TypeScript definitions |
| `/prisma` | 1 | Database schema |

---

*Generated: 2026-01-18*
