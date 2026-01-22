# HOW THE FUNCTIONS WORK

**Repository**: kashi-kweyu-portfolio
**Generated**: 2026-01-18
**Purpose**: ELI5 (Explain Like I'm 5) explanations of every function in the codebase

---

## Table of Contents

1. [Authentication Functions](#1-authentication-functions)
2. [Cart & Shopping Functions](#2-cart--shopping-functions)
3. [Discount & Student Verification Functions](#3-discount--student-verification-functions)
4. [Order & Fulfillment Functions](#4-order--fulfillment-functions)
5. [License Functions](#5-license-functions)
6. [Download Functions](#6-download-functions)
7. [Wishlist Functions](#7-wishlist-functions)
8. [Audit Logging Functions](#8-audit-logging-functions)
9. [Account Suspension Functions](#9-account-suspension-functions)
10. [Currency & Pricing Functions](#10-currency--pricing-functions)
11. [Logging & Monitoring Functions](#11-logging--monitoring-functions)
12. [Rate Limiting Functions](#12-rate-limiting-functions)
13. [Email Functions](#13-email-functions)
14. [Availability Functions](#14-availability-functions)
15. [Utility Functions](#15-utility-functions)
16. [React Hooks](#16-react-hooks)
17. [Database Functions](#17-database-functions)
18. [Security Functions](#18-security-functions)

---

## 1. Authentication Functions

### `/lib/auth.ts` - The Main Security Guard

**`getServerSession()`**
[Like asking the security guard "Who's at the door right now?"]

- Checks if someone is logged in
- Returns their info if they are, nothing if they're not
- Works on the server side only (not in the browser)

```
Input: Nothing
Output: { user: { id, email, name, role } } OR null
```

---

**`requireAuth(redirectTo?)`**
[Like a bouncer who says "You can't come in unless you show your ID"]

- Checks if user is logged in
- If NOT logged in → kicks them to the login page
- If logged in → lets them through
- `redirectTo` tells where to send them after login

```
Input: Optional URL to redirect to after login
Output: Session if logged in, OR redirects to login page
```

---

**`requireAdmin(redirectTo?)`**
[Like a VIP bouncer who says "Only managers allowed in this room"]

- Same as `requireAuth` but stricter
- User must be logged in AND be an admin
- Regular users get kicked out

```
Input: Optional redirect URL
Output: Admin session OR redirect to login
```

---

**`hasRole(role)`**
[Like checking if someone has a specific badge]

- Looks at the user's role
- Says "yes" or "no" if they have that role

```
Input: Role to check ('USER', 'ADMIN', etc.)
Output: true or false
```

---

**`isAdmin()`**
[Quick check: "Are you the boss?"]

- Shortcut to check if someone is an admin
- Returns true/false

---

**`isAuthenticated()`**
[Quick check: "Are you logged in at all?"]

- Returns true if logged in
- Returns false if not logged in

---

**`getCurrentUserId()`**
[Like asking "What's your ID number?"]

- Gets the current user's unique ID
- Returns `null` if no one is logged in

---

**`getCurrentUser()`**
[Like asking "Tell me everything about yourself"]

- Gets the full user object (name, email, role, etc.)
- Returns `null` if no one is logged in

---

**`hasPermission(userId, resourceOwnerId, userRole, requiredRole?)`**
[Like asking "Can this person touch this thing?"]

- Checks if a user can access something
- Works like this:
  1. If you OWN it → YES
  2. If you're ADMIN → YES
  3. If you have the required role → YES
  4. Otherwise → NO

```
Input: User's ID, Resource owner's ID, User's role, Required role (optional)
Output: true or false
```

---

**`getUserDisplayName(user)`**
[Like making a name tag for someone]

- Takes a user object
- Returns their name, or email if no name, or "Anonymous"

```
Input: User object
Output: "John Doe" or "john@email.com" or "Anonymous"
```

---

### `/lib/auth-utils.ts` - Input Cleaners

**`normalizeEmail(value)`**
[Like making all letters lowercase so "JOHN@EMAIL.COM" becomes "john@email.com"]

- Makes email lowercase
- Trims whitespace

```
Input: "  JOHN@EMAIL.COM  "
Output: "john@email.com"
```

---

**`getNonEmptyString(value)`**
[Like checking if a box has anything in it]

- Returns the string if it has content
- Returns `undefined` if it's empty or just spaces

```
Input: "hello" → Output: "hello"
Input: "   " → Output: undefined
```

---

**`isValidEmail(value)`**
[Like checking if something looks like a real email address]

- Checks for @ symbol
- Checks for domain (like .com)
- Returns true/false

```
Input: "test@email.com" → Output: true
Input: "notanemail" → Output: false
```

---

**`isValidPassword(value)`**
[Like checking if a password is long enough]

- Must be at least 8 characters
- Must be no more than 72 characters (bcrypt limit)

```
Input: "short" → Output: false
Input: "longenoughpassword" → Output: true
```

---

### `/lib/auth-env.ts` - Environment Checkers

**`validateAuthEnv()`**
[Like checking if all the keys are in the drawer before opening the store]

- Runs at startup
- Makes sure all required secrets exist
- Throws error if something is missing

---

**`getAuthEnvStatus()`**
[Like a dashboard showing green/red lights for each setting]

- Returns which environment variables are set
- Useful for debugging

---

**`getEnv(name)`**
[Like opening a specific drawer to get something]

- Gets an environment variable by name
- Trims whitespace

```
Input: "DATABASE_URL"
Output: "postgresql://..." or undefined
```

---

**`requireEnv(name)`**
[Like saying "I NEED this key or I can't work"]

- Gets environment variable
- THROWS ERROR if it's missing

---

**`ensurePairedEnv(left, right, missing)`**
[Like checking you have BOTH shoes, not just one]

- Checks if two related env vars are both set
- Example: If you have GOOGLE_ID, you also need GOOGLE_SECRET

---

### `/lib/password.ts` - Password Security

**`hashPassword(password)`**
[Like scrambling eggs - you can't unscramble them]

- Takes a plain password like "mypassword123"
- Turns it into a long random-looking string
- Uses bcrypt with 12 rounds (very secure)
- Even if hackers steal the hash, they can't get the original password

```
Input: "mypassword123"
Output: "$2a$12$LQv3c1yqBW.../..." (60 characters of gibberish)
```

---

**`verifyPassword(password, hashedPassword)`**
[Like checking if a key fits a lock without seeing the lock's insides]

- Takes the password you typed
- Takes the scrambled version from the database
- Returns true if they match, false if not

```
Input: "mypassword123", "$2a$12$..."
Output: true (if correct) or false (if wrong)
```

---

### `/lib/admin-security.ts` - Admin-Level Security

**`createSignedToken<T>(payload, secret?)`**
[Like sealing a letter with a wax stamp that proves it's from you]

- Takes any data (like user info)
- Creates a token with a signature
- If anyone changes the data, the signature won't match

```
Input: { userId: "123", action: "delete" }
Output: "eyJhbGciOi..." (a JWT token)
```

---

**`verifySignedToken<T>(token, secret?)`**
[Like checking if the wax seal is intact and authentic]

- Takes a signed token
- Verifies the signature is valid
- Returns the data inside if valid
- Returns null if tampered with

```
Input: "eyJhbGciOi..."
Output: { userId: "123", action: "delete" } or null
```

---

**`hashValue(value, secret?)`**
[Like creating a fingerprint of something]

- Creates a unique "fingerprint" of any value
- Same input always gives same output
- Can't reverse it to get the original

---

**`getRequestIp(headers)`**
[Like reading the return address on a letter]

- Extracts the visitor's IP address from request headers
- Handles proxies and Cloudflare

---

**`getRequestCountry(headers)`**
[Like checking where a letter was mailed from]

- Gets the country from Vercel's geo headers
- Returns country code like "US" or "UG"

---

**`base64UrlEncode(data)` & `base64UrlDecode(input)`**
[Like encoding a message so it's safe to put in a URL]

- Converts data to/from URL-safe format
- Used for tokens in links

---

**`createHmacSignature(base, secret)`**
[Like creating a tamper-proof seal]

- Creates a cryptographic signature
- Used to verify data hasn't been changed

---

### `/lib/admin-stepup.ts` - Extra Admin Verification

**`requireAdminStepUp(request, session)`**
[Like a bank vault that requires TWO keys to open]

- For super sensitive admin actions
- Even if you're admin, you need to re-verify
- Checks for a special step-up token
- If missing, returns 403 (forbidden)

```
Input: Request, Session
Output: { authorized: true } or { error: "Step-up required" }
```

---

## 2. Cart & Shopping Functions

### `/lib/cart.ts` - Shopping Cart Manager

**`getOrCreateCart(userId)`**
[Like getting a shopping cart when you enter a store - if you don't have one, they give you a new empty one]

- Checks if user already has a cart
- If YES → returns it
- If NO → creates a new empty cart

```
Input: User ID
Output: Cart object with items
```

---

**`addToCart(userId, productId, licenseType)`**
[Like putting an item in your shopping cart]

- Gets your cart (or makes one)
- Adds the product with the license type you chose
- If item already exists → increases quantity

```
Input: User ID, Product ID, License type ("PERSONAL", "COMMERCIAL", "TEAM")
Output: Updated cart item
```

---

**`removeFromCart(userId, itemId)`**
[Like taking something out of your cart and putting it back on the shelf]

- Finds the item in your cart
- Deletes it completely

```
Input: User ID, Cart item ID
Output: Deleted item
```

---

**`updateCartItemQuantity(userId, itemId, quantity)`**
[Like changing "I want 1" to "I want 3"]

- Finds the item
- Updates how many you want
- If quantity is 0 → removes the item

```
Input: User ID, Item ID, New quantity
Output: Updated item
```

---

**`clearCart(userId)`**
[Like dumping everything out of your cart]

- Removes ALL items from the cart
- Cart still exists, just empty

---

**`calculateCartTotal(userId, currency?)`**
[Like the cashier adding everything up]

- Gets all items in cart
- Calculates subtotal (items × prices)
- Adds tax if applicable
- Converts to requested currency
- Returns the final total

```
Input: User ID, Currency (optional, defaults to USD)
Output: { subtotal: 100, tax: 10, total: 110, currency: "USD" }
```

---

**`getCartWithItems(userId)`**
[Like looking inside your cart to see everything with full details]

- Gets the cart
- Includes full product info for each item
- Shows prices, names, images, etc.

---

**`getCartItemCount(userId)`**
[Like counting how many items are in your cart]

- Returns just the number of items
- Used for the cart icon badge

```
Input: User ID
Output: 5 (number of items)
```

---

## 3. Discount & Student Verification Functions

### `/lib/discounts.ts` - Discount Calculator

**`getUserDiscountEligibility(userId)`**
[Like checking if you have a coupon or student ID]

- Checks if user is a verified student
- Checks if verification is still valid (not expired)
- Returns discount percentage if eligible

```
Input: User ID
Output: {
  eligible: true,
  discountType: "STUDENT",
  discountPercent: 20,
  expiresAt: "2026-12-31"
}
```

---

**`calculateDiscountedPrice(originalPrice, discountPercent)`**
[Like figuring out "20% off $100 = $80"]

- Takes original price
- Subtracts the discount percentage
- Returns new price

```
Input: 100, 20
Output: 80
```

---

**`getDiscountDisplayInfo(discountType)`**
[Like getting the label for a sale tag]

- Takes discount type
- Returns how to show it to users

```
Input: "STUDENT"
Output: { label: "Student Discount", badge: "20% OFF" }
```

---

**`canApplyForVerification(userId)`**
[Like checking if you can apply for a discount again]

- Students who get rejected can't spam applications
- Enforces a cooldown period
- Returns true/false

---

## 4. Order & Fulfillment Functions

### `/lib/order-fulfillment.ts` - Order Processor

**`canFulfillOrder(orderId)`**
[Like checking if a package is ready to ship]

- Checks order status (must be PROCESSING)
- Checks payment status (must be COMPLETED)
- Returns true if ready to fulfill

```
Input: Order ID
Output: { canFulfill: true } or { canFulfill: false, reason: "Payment not complete" }
```

---

### `/lib/order-number.ts` - Order Number Generator

**Order Number Generation**
[Like a deli ticket machine - each customer gets the next number]

- Creates unique order numbers like "ORD-2026-00001"
- Tracks the sequence in the database
- Never gives the same number twice

---

## 5. License Functions

### `/lib/license.ts` - License Manager

**`generateLicenseKey(prefix?)`**
[Like creating a unique serial number for a product]

- Creates a random, unique license key
- Format: "PREFIX-XXXX-XXXX-XXXX-XXXX"
- Uses cryptographically secure randomness

```
Input: "PERSONAL" (optional prefix)
Output: "PERSONAL-A7B2-C9D4-E5F6-G8H1"
```

---

**`logLicenseAudit(options)`**
[Like writing in a log book every time someone uses a license]

- Records license events (created, used, transferred)
- Stores who, what, when, where
- Used for security and tracking

---

**`canAssignSeat(licenseId)`**
[Like checking if there's room for one more person in a team plan]

- Team licenses have a max seat count
- Checks current seats vs maximum
- Returns true if there's room

```
Input: License ID
Output: true (if seats available) or false (if full)
```

**Constants:**
- `TEAM_LICENSE_MAX_SEATS` = 5 (team can have up to 5 people)
- `DOWNLOAD_ABUSE_THRESHOLD` = 10 (suspiciously many downloads)

---

## 6. Download Functions

### `/lib/downloads.ts` - Download Manager

**`createDownloadToken(payload)`**
[Like getting a special ticket that lets you into a movie for the next hour]

- Creates a temporary token for downloading
- Token expires after a set time (DOWNLOAD_TOKEN_TTL_SECONDS)
- Contains product ID, user ID, license ID

```
Input: { productId: "123", userId: "456", licenseId: "789" }
Output: "eyJhbGciOi..." (JWT token valid for ~1 hour)
```

---

**`verifyDownloadToken(token)`**
[Like the usher checking if your ticket is real and not expired]

- Checks if token is valid
- Checks if token hasn't expired
- Returns the payload if valid

```
Input: "eyJhbGciOi..."
Output: { productId: "123", userId: "456", licenseId: "789" } or null
```

---

**`hashIp(ip)`**
[Like creating a secret code name for an IP address]

- Takes an IP address like "192.168.1.1"
- Creates a hash so we can track abuse without storing actual IPs
- Privacy-preserving

```
Input: "192.168.1.1"
Output: "a7b2c9d4e5f6..." (hash)
```

---

**`getSafeProductFileUrl(rawUrl, requestHost?)`**
[Like checking if a download link goes to a safe place]

- Validates the URL is legitimate
- Ensures it's from allowed domains
- Prevents malicious redirects

---

**`logDownloadEvent(options)`**
[Like stamping a library card each time you borrow a book]

- Records who downloaded what
- Stores timestamp, IP hash, user agent
- Used for tracking and abuse detection

---

**`cleanupStalePendingDownloads(now?)`**
[Like a janitor cleaning up unfinished orders at closing time]

- Finds downloads that were started but never finished
- Removes them after a timeout
- Keeps the database clean

**Constants:**
- `DOWNLOAD_LIMIT` = 3 (downloads per product)
- `DOWNLOAD_WINDOW_DAYS` = 30 (within this many days)
- `DOWNLOAD_TOKEN_TTL_SECONDS` = 3600 (1 hour to use token)

---

### `/lib/upload-utils.ts` - File Upload Helpers

**`slugify(text)`**
[Like turning "My Cool Product!" into "my-cool-product"]

- Makes text URL-friendly
- Lowercase, no spaces, no special characters

```
Input: "My Cool Product!"
Output: "my-cool-product"
```

---

**`sanitizeFilename(name)`**
[Like removing anything dangerous from a filename]

- Removes characters that could cause problems
- Keeps letters, numbers, dots, hyphens
- Prevents path traversal attacks (like "../../../")

```
Input: "../../../etc/passwd"
Output: "etcpasswd"
```

---

**`generateSmartFilename(options)`**
[Like creating an organized name for a file with timestamp]

- Takes context (product name, type, etc.)
- Adds timestamp for uniqueness
- Creates descriptive, organized filename

```
Input: { productSlug: "cool-template", type: "source" }
Output: "cool-template_source_2026-01-18_143052.zip"
```

---

## 7. Wishlist Functions

### `/lib/wishlist.ts` - Wishlist Manager

**`getWishlistForUser(userId)`**
[Like looking at your "saved for later" list]

- Gets all products user has saved
- Includes full product details
- Ordered by when they were added

```
Input: User ID
Output: [{ product: {...}, addedAt: "..." }, ...]
```

---

**`addWishlistItem(userId, productId)`**
[Like clicking the heart icon on a product]

- Adds product to wishlist
- If already there → does nothing (idempotent)
- Returns the wishlist item

---

**`removeWishlistItem(userId, productId)`**
[Like un-hearting a product]

- Removes product from wishlist
- If not there → does nothing

---

**`isInWishlist(userId, productId)`**
[Like checking if the heart is already filled in]

- Quick check: is this product in user's wishlist?
- Returns true/false

---

## 8. Audit Logging Functions

### `/lib/audit-logger.ts` - Activity Tracker

**`createAuditLog(data)`**
[Like writing in a security log book every time something important happens]

- Creates a record of any action
- Stores who, what, when, where
- Can never be deleted (for security)

```
Input: { userId, action, resourceType, resourceId, details }
Output: Created audit log entry
```

---

**`logLoginAttempt(userId, email, success, ipHash?, userAgent?)`**
[Like recording who tried to enter the building and if they got in]

- Records every login attempt
- Tracks failures (for security)
- Includes browser and location info

---

**`logSettingsChange(userId, settingName, oldValue, newValue, ipHash?, userAgent?)`**
[Like writing "John changed the thermostat from 70 to 72 degrees"]

- Records when settings are changed
- Keeps old and new values
- Useful for undoing or investigating

---

**`logContentEdit(userId, resourceType, resourceId, changes, ipHash?, userAgent?)`**
[Like tracking who edited a Wikipedia page]

- Records content modifications
- Stores what changed
- Who made the change

---

**`logDeletion(userId, resourceType, resourceId, resourceData?, ipHash?, userAgent?)`**
[Like keeping a record of what was thrown away]

- Records when things are deleted
- Optionally keeps a copy of what was deleted
- Can help recover or investigate

---

**`logOrderStatusChange(userId, orderId, oldStatus, newStatus, ipHash?, userAgent?)`**
[Like tracking a package through the delivery system]

- Records order status changes
- Pending → Processing → Fulfilled
- Shows who changed it and when

---

**`getIpHash(request)`**
[Like creating a pseudonym for a visitor's address]

- Extracts IP from request
- Hashes it for privacy

---

**`getUserAgent(request)`**
[Like noting what kind of car someone drove to your store]

- Extracts browser/device info
- "Chrome on Windows" or "Safari on iPhone"

---

## 9. Account Suspension Functions

### `/lib/suspension.ts` - Account Control

**`suspendUser(userId, reason, suspendedBy)`**
[Like putting someone in timeout and taking away their privileges]

- Marks the user account as suspended
- REVOKES all their licenses (they can't use purchased products)
- Records who suspended them and why
- They can't log in or do anything

```
Input: User ID, "Violated terms of service", Admin ID
Output: Updated user (suspended)
```

---

**`unsuspendUser(userId, unsuspendedBy)`**
[Like letting someone out of timeout and giving their stuff back]

- Removes the suspension
- REACTIVATES their licenses
- Records who unsuspended them
- They can use the site again

```
Input: User ID, Admin ID
Output: Updated user (active)
```

---

### `/lib/suspension-middleware.ts` - Suspension Checker

**`checkUserSuspension(userId)`**
[Like checking if someone is on the "banned" list before letting them in]

- Looks up user's suspension status
- Returns suspension info if suspended

```
Input: User ID
Output: { suspended: false } or { suspended: true, reason: "...", since: "..." }
```

---

**`requireNotSuspended(request)`**
[Like a bouncer with a list of banned people]

- Middleware that runs before requests
- If suspended → blocks the request
- If not suspended → lets it through

---

**`canUserDownload(userId, licenseId)`**
[Like checking if someone is allowed to borrow books from the library]

- Checks: Is user suspended?
- Checks: Is the license active?
- Checks: Has user exceeded download limits?
- Returns true only if all checks pass

---

**`canUserPurchase(userId)`**
[Like checking if someone's credit is good enough to buy on account]

- Checks if user is suspended
- Suspended users can't make purchases

---

## 10. Currency & Pricing Functions

### `/lib/currency.ts` - Currency Converter

**`convertPrice(amount, from, to)`**
[Like using a currency exchange booth at the airport]

- Takes an amount in one currency
- Converts it to another currency
- Uses stored exchange rates

```
Input: 100, "USD", "UGX"
Output: 375000 (100 dollars = 375,000 shillings)
```

---

**`formatPrice(amount, currency)`**
[Like printing a price tag that looks nice]

- Formats number with currency symbol
- Handles decimal places correctly

```
Input: 99.99, "USD"
Output: "$99.99"

Input: 375000, "UGX"
Output: "UGX 375,000"
```

---

**`formatPriceShort(amount, currency)`**
[Like abbreviating "one million" to "1M"]

- Shorter version for large numbers
- "K" for thousands, "M" for millions

```
Input: 1500, "USD"
Output: "$1.5K"
```

---

**`isSupportedCurrency(currency)`**
[Like checking if you accept a certain type of money]

- Returns true if we support this currency
- Currently: USD, UGX

---

**`getDefaultCurrency()`**
[Like asking "what money do most people use here?"]

- Returns "USD" as the default

**Constants:**
- `SUPPORTED_CURRENCIES` = ["USD", "UGX"]
- `EXCHANGE_RATES` = { USD: 1, UGX: 3750 }
- `CURRENCY_INFO` = { USD: { symbol: "$", ... }, ... }

---

### `/lib/currency-preference.ts` - Currency Memory

**`getSavedCurrency()`**
[Like remembering what language you prefer]

- Gets user's saved currency preference from cookies/localStorage
- Returns the saved currency or null

---

**`saveCurrency(currency)`**
[Like saving your language preference]

- Stores currency preference
- Remembers it for next time

---

**`getDefaultCurrencyFromCountry(country)`**
[Like automatically setting language based on location]

- Takes country code (like "UG" for Uganda)
- Returns the appropriate currency
- UG → UGX, everything else → USD

---

## 11. Logging & Monitoring Functions

### `/lib/logger.ts` - System Logger

**`logger.info(message, context?)`**
[Like writing a normal entry in a diary]

- Logs informational messages
- "User logged in successfully"

---

**`logger.warn(message, context?)`**
[Like writing "Hmmm, this is weird..." in your diary]

- Logs warnings (not errors, but concerning)
- "User tried to access page without permission"

---

**`logger.error(message, error?, context?)`**
[Like writing "SOMETHING WENT WRONG!" in your diary]

- Logs errors with full details
- Includes stack trace
- "Database connection failed"

---

**`logger.debug(message, context?)`**
[Like writing detailed notes only for debugging]

- Only shows in development mode
- Very detailed technical info
- Hidden in production

---

**`logger.apiError(endpoint, error, context?)`**
[Like logging "The /api/users endpoint crashed because..."]

- Specialized for API route errors
- Includes endpoint path
- Includes error details

---

**`logger.authError(action, error, context?)`**
[Like logging "Login failed because password was wrong"]

- Specialized for auth errors
- Includes what action failed
- "2FA verification failed"

---

**`logger.validationError(field, value, message)`**
[Like logging "The email field had 'notanemail' which is invalid"]

- For form validation errors
- Shows which field, what value, why it's wrong

---

**`logger.performanceLog(metric, duration, context?)`**
[Like logging "The database query took 500ms"]

- Records performance metrics
- Helps find slow parts
- Duration in milliseconds

---

**`logErrorBoundary(error, errorInfo)`**
[Like logging when a React component crashes]

- Catches UI crashes
- Records what component failed
- Includes stack trace

---

**`logApiError(method, path, error, statusCode?)`**
[Like logging "GET /api/users failed with 500"]

- Records API failures
- Method (GET, POST, etc.)
- Path and status code

---

**`logDatabaseError(operation, model, error)`**
[Like logging "Trying to create User failed because..."]

- Database-specific errors
- What operation (create, update, delete)
- What table/model

---

## 12. Rate Limiting Functions

### `/lib/rate-limit.ts` - Request Throttler

**`getClientIp(request)`**
[Like checking the license plate of a car entering a parking lot]

- Extracts the client's IP address
- Handles various proxy headers
- Used to identify who's making requests

---

**`getRateLimitKey(request, scope)`**
[Like creating a unique ticket for "this person doing this action"]

- Combines IP + action type
- Creates unique identifier
- "192.168.1.1:login" or "192.168.1.1:api"

---

**`checkRateLimit(key, limit, windowMs)`**
[Like a nightclub counting "this person has entered 5 times in the last hour"]

- Tracks how many times a key has been used
- Within a time window
- Returns if they're over the limit

```
Input: "192.168.1.1:login", 5, 60000  // 5 attempts per minute
Output: {
  allowed: true,    // or false if over limit
  remaining: 3,     // attempts left
  resetAt: Date     // when limit resets
}
```

---

**`getRateLimitHeaders(result)`**
[Like putting a stamp on your hand showing how many entries you have left]

- Creates HTTP headers for rate limit info
- "X-RateLimit-Remaining: 3"
- Helps clients know when to slow down

---

## 13. Email Functions

### `/lib/email.ts` - Email Sender

**`getEmailConfigFromDB()`**
[Like looking up email settings from the admin panel]

- Fetches SMTP configuration from database
- Server, port, username, password
- Used for sending emails

---

**`getEmailConfigFromEnv()`**
[Like reading email settings from a config file]

- Gets SMTP config from environment variables
- Fallback if not in database

---

**Nodemailer Functions**
[Like the post office that actually sends your letters]

- Creates email transport
- Sends emails via SMTP
- Handles attachments, HTML, etc.

---

### `/lib/resend.ts` - Resend Email Service

**`getResendConfig()`**
[Like getting the API key for a fancy email service]

- Gets Resend API configuration
- API key, from address, etc.

---

**`getEmailDomain(address)`**
[Like extracting "gmail.com" from "user@gmail.com"]

- Gets the domain part of email
- Used for validation

```
Input: "user@gmail.com"
Output: "gmail.com"
```

---

**`extractEmail(address)`**
[Like extracting just the email from "John Doe <john@email.com>"]

- Handles formatted addresses
- Returns just the email part

```
Input: "John Doe <john@email.com>"
Output: "john@email.com"
```

---

## 14. Availability Functions

### `/lib/availability.ts` - Schedule Manager

**`calculateEffectiveAvailability(settings, currentDate?)`**
[Like figuring out if a store is open right now considering holidays, vacation, and hours]

- Takes availability settings
- Considers leave periods
- Considers holidays
- Returns current availability status

```
Input: { baseStatus: "AVAILABLE", leaveStart: "2026-01-20", leaveEnd: "2026-01-25" }
Output: { status: "AVAILABLE", reason: null }

(If checked on Jan 22nd):
Output: { status: "UNAVAILABLE", reason: "On leave until Jan 25" }
```

---

**`isOnLeave(date, leaveStart, leaveEnd)`**
[Like checking if someone is on vacation]

- Is the given date between leave start and end?
- Returns true/false

```
Input: "2026-01-22", "2026-01-20", "2026-01-25"
Output: true (Jan 22 is between Jan 20-25)
```

---

**`isHoliday(date)`**
[Like checking if today is a holiday]

- Checks against a list of holidays
- Returns true if it's a holiday

---

**`limitStatus(status)`**
[Like converting "very busy" to just "busy"]

- Normalizes availability status
- Ensures it's one of the valid options

---

**`formatDate(date)`**
[Like turning "2026-01-18" into "January 18, 2026"]

- Formats date for display
- Human-readable format

---

## 15. Utility Functions

### `/lib/utils.ts` - General Helpers

**`cn(...inputs)`**
[Like combining multiple clothing outfits into one, removing duplicates]

- Combines CSS class names
- Uses clsx + tailwind-merge
- Removes conflicting Tailwind classes

```
Input: "px-2 py-4", "px-4", { "hidden": false }
Output: "py-4 px-4"  // px-4 overrides px-2
```

---

**`truncate(text, length)`**
[Like cutting a long story short and adding "..."]

- Shortens text to specified length
- Adds "..." if truncated

```
Input: "This is a very long title", 10
Output: "This is a..."
```

---

**`normalizePublicPath(input)`**
[Like making sure all file paths start the same way]

- Ensures paths start with "/"
- Handles various input formats

```
Input: "images/photo.jpg"
Output: "/images/photo.jpg"
```

---

**`isLocalImageUrl(src)`**
[Like checking if a photo is from your computer or the internet]

- Checks if image URL is local
- Local: starts with "/" or relative
- External: starts with "http"

---

### `/lib/product-ui.ts` - Product Display Helpers

**`prettyCategory(category)`**
[Like turning "ICON_PACK" into "Icon Pack"]

- Makes category names human-readable
- Capitalizes properly

```
Input: "WEBSITE_TEMPLATE"
Output: "Website Template"
```

---

### `/lib/strings.ts` - String Utilities

Various string manipulation functions like:
- Capitalizing text
- Converting cases
- Trimming and cleaning strings

---

## 16. React Hooks

### `/lib/usePendingAction.ts` - Loading State Tracker

**`usePendingAction()`**
[Like a "loading..." spinner that knows when to show and hide]

- Tracks if an async action is running
- Shows loading state
- Handles errors

```javascript
const { isPending, run } = usePendingAction()

// isPending is false
await run(async () => {
  // isPending is true during this
  await saveData()
})
// isPending is false again
```

---

### `/lib/useAnalytics.ts` - Analytics Tracker

**`useAnalytics()`**
[Like a little helper that takes notes on everything users do]

- Tracks user behavior
- Sends data to analytics service

**Methods:**

**`trackPageView(data)`**
[Like noting "User visited the About page"]
- Records page visits
- Includes page name, referrer

**`trackEvent(data)`**
[Like noting "User did something interesting"]
- Custom event tracking
- Any action you want to measure

**`trackProjectView(projectId, projectTitle)`**
[Like noting "User looked at Project X"]
- Specific to viewing projects
- Helps know which projects are popular

**`trackClick(buttonName, location)`**
[Like noting "User clicked the Buy button on the product page"]
- Tracks button clicks
- Where they clicked from

**`trackFormSubmit(formName, success)`**
[Like noting "User submitted the contact form successfully"]
- Form submission tracking
- Success or failure

**`trackDownload(fileName, fileType)`**
[Like noting "User downloaded 'template.zip'"]
- Download tracking
- What and what type

**`trackThemeChange(themeName)`**
[Like noting "User switched to dark mode"]
- Theme preference tracking

---

**`usePageTracking(pageName)`**
[Like a stopwatch that starts when you enter a room and stops when you leave]

- Auto-tracks page view on mount
- Records time spent on page
- Reports when user leaves

---

### `/lib/preferences/useResolvedAppearance.ts` - Theme Helper

**`useResolvedAppearance()`**
[Like figuring out if it's day or night to set the right screen brightness]

- Gets user's theme preference
- Falls back to system preference
- Returns "light" or "dark"

```javascript
const appearance = useResolvedAppearance()
// appearance = "dark" if user or system prefers dark mode
```

---

## 17. Database Functions

### `/lib/prisma.ts` - Database Connection

**`prisma`**
[Like the one door that everyone uses to talk to the database]

- Singleton Prisma client
- Reuses connection in development
- Prevents too many connections

### Common Prisma Methods
[Like different ways to talk to a database]

**`prisma.*.findUnique()`**
[Like asking "Give me the ONE person named John"]
- Finds exactly one record by unique field
- Returns null if not found

**`prisma.*.findMany()`**
[Like asking "Give me ALL the products under $50"]
- Finds multiple records matching criteria
- Returns empty array if none found

**`prisma.*.create()`**
[Like adding a new card to a rolodex]
- Creates a new record
- Returns the created record

**`prisma.*.update()`**
[Like erasing and rewriting info on a card]
- Updates an existing record
- Must specify which record (by ID usually)

**`prisma.*.delete()`**
[Like removing a card from the rolodex]
- Deletes a record
- Gone forever (unless soft delete)

**`prisma.*.upsert()`**
[Like "add this card, but if it exists, just update it"]
- Creates if doesn't exist
- Updates if it does exist

**`prisma.$transaction()`**
[Like doing multiple things that either ALL happen or NONE happen]
- Groups multiple operations
- If any fails, all are rolled back
- Example: Transfer money = decrease from A AND increase to B

**`prisma.$queryRaw()`**
[Like writing your own database commands when Prisma isn't enough]
- Raw SQL queries
- For complex queries Prisma can't handle

---

## 18. Security Functions

### Summary of Security Layers

**Password Security**
[Like a safe with a combination lock]
- Passwords are hashed with bcrypt (12 rounds)
- Even if database is stolen, passwords are protected
- Takes ~250ms to verify (slows down attackers)

---

**JWT Tokens**
[Like sealed envelopes with tamper-evident stickers]
- Contains user info in encoded format
- Signed so any changes invalidate it
- Used for sessions and download links

---

**Rate Limiting**
[Like a bouncer counting how many times you've gone in and out]
- Limits requests per IP
- Prevents brute force attacks
- Slows down automated attacks

---

**CSRF Protection**
[Like making sure the letter was actually from who it says]
- Prevents fake requests from other websites
- Uses tokens that must match

---

**2FA (Two-Factor Authentication)**
[Like needing both a key AND a fingerprint to open a door]
- Password alone isn't enough
- Also need a code from your phone
- TOTP (Time-based One-Time Password)
- Backup codes for emergencies

---

**Admin Step-Up**
[Like needing to re-scan your badge for the really secure room]
- Even if you're admin
- Sensitive actions require re-verification
- Extra layer for dangerous operations

---

**IP Hashing**
[Like knowing "someone from this neighborhood" without knowing the exact address]
- Store hashed IPs, not real ones
- Can still detect patterns/abuse
- Respects privacy

---

**Download Tokens**
[Like a movie ticket that expires after the show]
- Time-limited access
- Specific to user + product
- Can't be shared or reused

---

**Trusted Devices**
[Like your own car having a garage door opener]
- Remember devices for 7 days
- Skip 2FA on trusted devices
- Can revoke from settings

---

**Audit Logging**
[Like security cameras recording everything]
- Every sensitive action logged
- Can't be deleted
- Who, what, when, where

---

**Account Suspension**
[Like freezing someone's membership]
- Blocks all access
- Revokes all licenses
- Can be undone by admin

---

## Quick Reference: Function Categories

| Category | Purpose | Key Functions |
|----------|---------|---------------|
| Auth | Who are you? | `getServerSession`, `requireAuth`, `hasRole` |
| Cart | Shopping basket | `addToCart`, `calculateCartTotal`, `clearCart` |
| Discounts | Special prices | `getUserDiscountEligibility`, `calculateDiscountedPrice` |
| Orders | Purchases | `canFulfillOrder`, order number generation |
| Licenses | Product keys | `generateLicenseKey`, `canAssignSeat` |
| Downloads | Getting files | `createDownloadToken`, `verifyDownloadToken` |
| Wishlist | Saved items | `addWishlistItem`, `isInWishlist` |
| Audit | Tracking | `createAuditLog`, `logLoginAttempt` |
| Suspension | Banning | `suspendUser`, `unsuspendUser` |
| Currency | Money conversion | `convertPrice`, `formatPrice` |
| Logging | System notes | `logger.info`, `logger.error` |
| Rate Limit | Speed limits | `checkRateLimit`, `getRateLimitHeaders` |
| Email | Sending mail | `getEmailConfig`, nodemailer functions |
| Availability | Schedule | `calculateEffectiveAvailability`, `isOnLeave` |
| Utils | Helpers | `cn`, `truncate`, `slugify` |
| Hooks | React state | `usePendingAction`, `useAnalytics` |
| Database | Data storage | `prisma.*` methods |
| Security | Protection | password hashing, JWT, 2FA |

---

## How Functions Work Together

### Example: User Buys a Product

```
1. User adds to cart
   └── addToCart(userId, productId, "PERSONAL")
       └── getOrCreateCart(userId)

2. User views cart
   └── getCartWithItems(userId)
       └── calculateCartTotal(userId, "USD")
           └── convertPrice() for each item
           └── getUserDiscountEligibility(userId) → applies 20% off

3. User checks out
   └── requireAuth() → must be logged in
   └── requireNotSuspended() → can't be banned
   └── checkRateLimit() → not too many requests
   └── Create order in database
   └── generateLicenseKey("PERSONAL")
   └── createAuditLog() → record the purchase
   └── clearCart(userId)

4. User downloads product
   └── canUserDownload(userId, licenseId)
   └── createDownloadToken() → temporary ticket
   └── verifyDownloadToken() → check the ticket
   └── logDownloadEvent() → record it
   └── Return file stream
```

---

*Generated: 2026-01-18*
*Document explains how functions work using ELI5 (Explain Like I'm 5) methodology*
