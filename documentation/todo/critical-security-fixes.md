# 🚨 CRITICAL SECURITY FIXES - DO IMMEDIATELY

**Status:** Pending verification
**Created:** 2026-01-11
**Priority:** URGENT - Fix before any launch

---

## 1. Path Traversal Vulnerability (CVSS 8.6) ⚠️ HIGHEST RISK

**Risk:** Attackers can write files anywhere on server, potential RCE

**Location to Check:**
- `app/api/upload/route.ts`
- Any file upload handling code
- `lib/upload-utils.ts` (if exists)

**What to Look For:**
```typescript
// BAD - User-controlled filename used directly
const filename = file.name
await writeFile(`public/uploads/${filename}`, buffer)

// GOOD - Sanitized filename
function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.\./g, '')
    .replace(/^\.+/, '')
    .substring(0, 255)
}
```

**Fix Required:**
- [ ] Check if filename sanitization exists
- [ ] Add sanitizeFilename function if missing
- [ ] Verify no path traversal possible (../../etc/passwd)

**Test Command:**
```bash
# Search for file upload code
grep -r "writeFile\|createWriteStream" app/api/
```

---

## 2. No CSRF Protection (CVSS 8.8) ⚠️ CRITICAL

**Risk:** Forced actions on authenticated users (unwanted purchases, data changes)

**Location to Check:**
- `next.config.js` or `next.config.mjs`
- Cookie configuration
- Session settings

**What to Look For:**
```javascript
// BAD - No SameSite attribute
// cookies default to Lax or None

// GOOD - Strict SameSite
headers: [{
  key: 'Set-Cookie',
  value: 'SameSite=Strict; Secure; HttpOnly'
}]
```

**Fix Required:**
- [ ] Add SameSite=Strict to cookie config
- [ ] OR implement CSRF token system (4 hours work)

**Quick Fix (2 minutes):**
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [{
      source: '/:path*',
      headers: [{
        key: 'Set-Cookie',
        value: 'SameSite=Strict; Secure; HttpOnly'
      }]
    }]
  }
}
```

**Test Command:**
```bash
# Check if next.config has SameSite
cat next.config.js | grep -i "samesite"
```

---

## 3. No Rate Limiting on Auth (CVSS 8.2) ⚠️ CRITICAL

**Risk:** Brute force attacks, credential stuffing, account takeover

**Location to Check:**
- `app/api/auth/[...nextauth]/route.ts`
- `lib/rate-limit.ts` (if exists)
- `middleware.ts`

**What to Look For:**
```typescript
// BAD - No rate limiting
export async function POST(req: Request) {
  const { email, password } = await req.json()
  // ... authenticate
}

// GOOD - Rate limited
import { loginRateLimit } from '@/lib/rate-limit'
const { success } = await loginRateLimit.limit(ip)
if (!success) throw new Error('Too many attempts')
```

**Fix Required:**
- [ ] Check if Upstash Redis installed
- [ ] Check if rate limiting exists
- [ ] Add to login routes if missing

**Installation (if needed):**
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Test Command:**
```bash
# Check if rate limiting dependencies exist
cat package.json | grep -i "ratelimit\|upstash"
```

---

## 4. Weak Bcrypt Rounds (CVSS 7.8) ⚠️ HIGH

**Risk:** Faster password cracking if database breached

**Location to Check:**
- `lib/password.ts` or similar
- `app/api/auth/signup/route.ts`
- Any password hashing code

**What to Look For:**
```typescript
// BAD - Only 10 rounds
const salt = await bcrypt.genSalt(10)

// GOOD - 12+ rounds
const salt = await bcrypt.genSalt(12)
```

**Fix Required:**
- [ ] Find all bcrypt.genSalt() calls
- [ ] Verify rounds >= 12
- [ ] Update if needed

**Test Command:**
```bash
# Find bcrypt usage
grep -r "bcrypt.genSalt\|bcrypt.hash" app/ lib/
```

---

## 5. Missing Security Headers (CVSS 7.4) ⚠️ HIGH

**Risk:** XSS, clickjacking, MITM attacks

**Location to Check:**
- `next.config.js` or `next.config.mjs`
- `middleware.ts`

**What to Look For:**
```javascript
// BAD - No security headers

// GOOD - Security headers present
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
]
```

**Fix Required:**
- [ ] Add security headers to next.config
- [ ] Test that headers appear in response

**Quick Fix (10 minutes):**
```javascript
// next.config.js
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
]

module.exports = {
  async headers() {
    return [{
      source: '/:path*',
      headers: securityHeaders
    }]
  }
}
```

**Test Command:**
```bash
# Check for security headers config
cat next.config.js | grep -i "x-frame\|x-content\|referrer"
```

---

## 6. Demo Mode Payment (CANNOT LAUNCH) ⚠️ BLOCKER

**Risk:** Free access to paid features, no revenue

**Location to Check:**
- `app/api/memberships/purchase/route.ts`
- `app/api/checkout/route.ts`
- Payment integration code

**What to Look For:**
```typescript
// BAD - Creates membership without payment
await prisma.membership.create({
  data: { userId, tier, status: 'ACTIVE' }
})
// No payment collection!

// GOOD - Payment first, then membership
const payment = await stripe.paymentIntents.create(...)
if (payment.status === 'succeeded') {
  await prisma.membership.create(...)
}
```

**Fix Required:**
- [ ] Verify Stripe/Flutterwave integrated
- [ ] Check if payment webhooks exist
- [ ] Test actual payment collection

**Test Command:**
```bash
# Check if payment providers installed
cat package.json | grep -i "stripe\|flutterwave"
# Check for demo mode comments
grep -r "demo mode\|TODO.*payment" app/api/
```

---

## Audit Checklist

Run these commands to check status:

```bash
# 1. Check file upload sanitization
grep -r "writeFile\|sanitize.*filename" app/api/ lib/

# 2. Check CSRF protection
cat next.config.js | grep -i "samesite"

# 3. Check rate limiting
cat package.json | grep -i "ratelimit"
grep -r "ratelimit\|limit(" app/api/auth/

# 4. Check bcrypt rounds
grep -r "genSalt" app/ lib/ | grep -o "genSalt([0-9]*)"

# 5. Check security headers
cat next.config.js | grep -A 10 "headers()"

# 6. Check payment integration
cat package.json | grep -i "stripe\|flutterwave"
grep -r "paymentIntent\|webhook" app/api/
```

---

## Priority Order

**Do TODAY (30 min):**
1. Security headers (10 min)
2. Bcrypt rounds (5 min)
3. Filename sanitization (15 min)

**Do THIS WEEK (2-4 hours):**
4. Rate limiting (2-4 hours)
5. CSRF tokens OR SameSite cookies (2 hours)

**Before LAUNCH (20-40 hours):**
6. Payment integration (Stripe/Flutterwave)
7. Complete email notifications
8. Define credit pricing

---

## Automated Check Script

Save as `docs/todo/security-check.sh`:

```bash
#!/bin/bash
echo "🔍 Security Audit Check"
echo "======================="

echo "\n1. File Upload Sanitization:"
grep -r "sanitizeFilename\|replace.*\.\." app/api/ lib/ 2>/dev/null && echo "✅ Found sanitization" || echo "❌ No sanitization found"

echo "\n2. CSRF Protection:"
grep -i "samesite" next.config.js 2>/dev/null && echo "✅ SameSite found" || echo "❌ No SameSite config"

echo "\n3. Rate Limiting:"
grep -i "ratelimit\|upstash" package.json 2>/dev/null && echo "✅ Rate limit dependency found" || echo "❌ No rate limiting"

echo "\n4. Bcrypt Rounds:"
grep -r "genSalt" app/ lib/ 2>/dev/null | grep -o "genSalt([0-9]*)" | sort -u

echo "\n5. Security Headers:"
grep -A 5 "X-Frame-Options\|X-Content-Type" next.config.js 2>/dev/null && echo "✅ Security headers found" || echo "❌ No security headers"

echo "\n6. Payment Integration:"
grep -i "stripe\|flutterwave" package.json 2>/dev/null && echo "✅ Payment provider found" || echo "❌ No payment provider"

echo "\n======================="
echo "Audit complete. Review findings above."
```

---

**Last Updated:** 2026-01-11
**Next Review:** After fixes applied
**Owner:** Kashi Kweyu
