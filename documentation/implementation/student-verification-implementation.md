# Student Verification & Anti-Resale Implementation Guide

**Implemented:** 2026-01-11
**Status:** Complete - Ready for Testing
**Version:** 1.0

---

## OVERVIEW

This implementation adds:
1. **Student/Youth verification system** (ages 13+, 50% discount)
2. **Manual admin approval workflow**
3. **Anti-resale license enforcement**
4. **Automated abuse detection**
5. **Account suspension mechanism**
6. **Legal policy updates**

**NO PAID SERVICES REQUIRED** - Everything uses manual verification and internal logic.

---

## FILES ADDED

### Prisma Schema & Migrations

1. `prisma/migrations-draft/add_student_verification.sql`
   - SQL migration for new tables and columns
   - Run this after updating schema.prisma

2. `prisma/schema-additions.prisma`
   - Instructions for adding fields to existing models
   - New StudentVerification model
   - New enums: VerificationStatus, VerificationMethod, DiscountType

### Library Functions

3. `lib/discounts.ts`
   - `getUserDiscountEligibility()` - Check if user has active discount
   - `calculateDiscountedPrice()` - Apply discount to price
   - `canApplyForVerification()` - Check cooldown/eligibility
   - `getDiscountDisplayInfo()` - Get display labels

4. `lib/suspension.ts`
   - `suspendUser()` - Suspend account + revoke licenses
   - `unsuspendUser()` - Reactivate account
   - `detectSuspiciousDownloads()` - Abuse detection algorithm
   - `checkAndSuspendIfAbused()` - Auto-suspend on high-confidence abuse

5. `lib/suspension-middleware.ts`
   - `checkUserSuspension()` - Check if user is suspended
   - `requireNotSuspended()` - API route guard
   - `canUserDownload()` - Download permission check
   - `canUserPurchase()` - Purchase permission check

### API Routes - Student Verification

6. `app/api/student-verification/apply/route.ts` (POST)
   - Submit verification application
   - Rate limited (3 per 24 hours)
   - Validates school email domains
   - Enforces 24-hour cooldown on rejection

7. `app/api/student-verification/status/route.ts` (GET)
   - Get current verification status
   - Returns eligibility and expiration info

8. `app/api/admin/student-verifications/route.ts` (GET)
   - List all verifications (filtered by status)
   - Paginated results
   - Admin only

9. `app/api/admin/student-verifications/[id]/approve/route.ts` (POST)
   - Approve verification
   - Set 12-month expiration
   - Log audit event

10. `app/api/admin/student-verifications/[id]/reject/route.ts` (POST)
    - Reject verification with reason
    - Enforce 24-hour cooldown
    - Log audit event

### Pages

11. `app/(main)/student/page.tsx`
    - Public student discount application page
    - Shows verification status
    - Application form (school email or ID upload)
    - Youth 13-18 guardian consent
    - Status indicators (pending/approved/rejected/expired)

12. `app/(admin)/admin/student-verifications/page.tsx`
    - Admin review dashboard
    - Filter by status (PENDING, APPROVED, REJECTED, etc.)
    - Quick approve/reject actions
    - Review notes field

### Scripts

13. `scripts/institution-check.ts`
    - Helper script for manual verification
    - Checks if institution name looks legitimate
    - Usage: `npx ts-node scripts/institution-check.ts "University Name" "Country"`
    - Returns confidence score + suggestions

### Documentation

14. `docs/legal/STUDENT_AND_ANTI_RESALE_POLICIES.md`
    - Complete legal policy text
    - Student/youth discount terms
    - Anti-resale enforcement
    - Fraud penalties
    - Data handling (GDPR-style)
    - Refund policy updates
    - Integration checklist for Terms/Privacy

15. `docs/STUDENT_VERIFICATION_IMPLEMENTATION.md` (this file)
    - Complete implementation guide

---

## SCHEMA CHANGES REQUIRED

### Step 1: Update schema.prisma

Add these sections to your `prisma/schema.prisma`:

#### A. Add new enums (at the end, around line 1013):

```prisma
enum VerificationStatus {
  PENDING
  APPROVED
  REJECTED
  EXPIRED
}

enum VerificationMethod {
  SCHOOL_EMAIL
  ID_UPLOAD
  MANUAL
}

enum DiscountType {
  STUDENT
  YOUTH_13_18
  PROMOTIONAL
  NONE
}
```

#### B. Add StudentVerification model (after ContentPageType enum):

```prisma
model StudentVerification {
  id                 String             @id @default(cuid())
  userId             String             @unique
  status             VerificationStatus @default(PENDING)
  method             VerificationMethod
  schoolEmail        String?
  institutionName    String
  country            String
  evidenceUrl        String?
  notes              String?            @db.Text
  reviewedBy         String?
  reviewedAt         DateTime?
  discountType       DiscountType
  expiresAt          DateTime?
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt
  guardianEmail      String?
  guardianConsent    Boolean            @default(false)
  lastApplicationAt  DateTime?
  user               User               @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([status])
  @@index([expiresAt])
  @@index([createdAt])
  @@map("student_verifications")
}
```

#### C. Update User model (add these fields after line 49):

```prisma
  suspendedAt          DateTime?
  suspendedReason      String?                  @db.Text
  suspendedBy          String?
  studentVerification  StudentVerification?
```

Add this index (after line 53):
```prisma
  @@index([suspendedAt])
```

#### D. Update Order model (add these fields after line 476):

```prisma
  discountApplied  Boolean       @default(false)
  discountType     DiscountType  @default(NONE)
  discountPercent  Decimal       @default(0) @db.Decimal(5, 2)
  discountAmount   Decimal       @default(0) @db.Decimal(10, 2)
```

Add this index (after line 484):
```prisma
  @@index([discountType])
```

#### E. Update License model (add these fields after line 354):

```prisma
  resaleProhibited  Boolean   @default(true)
  allowedUse        String    @default("PERSONAL")
  suspicionScore    Int       @default(0)
  lastAbuseCheckAt  DateTime?
```

Add this index (after line 365):
```prisma
  @@index([suspicionScore])
```

#### F. Update AuditAction enum (add these after line 985):

```prisma
  STUDENT_VERIFICATION_SUBMITTED
  STUDENT_VERIFICATION_APPROVED
  STUDENT_VERIFICATION_REJECTED
  STUDENT_VERIFICATION_EXPIRED
  ACCOUNT_SUSPENDED
  ACCOUNT_UNSUSPENDED
  LICENSE_ABUSE_DETECTED
  RESALE_SUSPECTED
```

### Step 2: Create Migration

```bash
# Generate migration
npx prisma migrate dev --name add_student_verification

# Or if using direct SQL:
# Apply the SQL in prisma/migrations-draft/add_student_verification.sql
```

### Step 3: Generate Prisma Client

```bash
npx prisma generate
```

---

## SECURITY FEATURES

### Rate Limiting

- **Student verification applications:** 3 per 24 hours per IP
- Uses existing `lib/rate-limit.ts` in-memory limiter
- Prevents spam submissions

### Cooldown Enforcement

- **Rejection cooldown:** 24 hours before reapplication
- Tracked via `lastApplicationAt` field
- Prevents rapid retry attacks

### Abuse Detection

**Suspicious behavior triggers:**
1. **Excessive downloads:** >10 in 24 hours (30 points)
2. **Multiple IPs:** >5 unique IPs in 24 hours (40 points)
3. **Multiple devices (personal licenses):** >3 devices (30 points)
4. **High failure rate:** >50% failed downloads (20 points)

**Suspicion score:**
- 0-49: Normal (no action)
- 50-69: Medium confidence (flag for admin review)
- 70-100: High confidence (auto-suspend + revoke licenses)

**Auto-suspension threshold:** Score >= 70

### Input Validation

- School email domain validation (.edu, .ac.*, school, university, college)
- Institution name length check (minimum 10 characters)
- Guardian email required for youth (13-18)
- Guardian consent checkbox required for youth
- Evidence file/URL required for ID upload method

---

## HOW TO USE: FOUNDER CHECKLIST

### Initial Setup

1. **Run Prisma Migration**
   ```bash
   cd /path/to/project
   npx prisma migrate dev --name add_student_verification
   npx prisma generate
   ```

2. **Test Database Changes**
   ```bash
   # Verify tables created
   npx prisma studio
   # Look for: student_verifications table
   ```

3. **Update Legal Pages**
   - [ ] Copy sections from `docs/legal/STUDENT_AND_ANTI_RESALE_POLICIES.md`
   - [ ] Add to `app/(main)/legal/terms/page.tsx`
   - [ ] Add to `app/(main)/legal/privacy-policy/page.tsx`
   - [ ] Update "Last Updated" dates

4. **Add Navigation Link (Optional)**
   - Add "Student Discount" link to header/footer
   - Route: `/student`

5. **Test the Flow** (see Testing Checklist below)

### Approving a Student

**When a student submits verification:**

1. **Check your email** (if you've set up notifications)
   - OR navigate to `/admin/student-verifications`

2. **Review the application:**
   - Institution name: Does it look real?
   - Country: Does it match the institution?
   - School email: Is the domain educational?
   - Evidence (if uploaded): Is the ID legitimate?

3. **Use the institution check script (optional):**
   ```bash
   npx ts-node scripts/institution-check.ts "Stanford University" "United States"
   ```
   - Look for "Likely Valid: YES" + confidence level
   - This is advisory only - still verify manually

4. **Approve or Reject:**
   - **Approve:** Click "Approve" button, optionally add admin notes
   - **Reject:** Add rejection reason (required), click "Reject"

5. **Student is notified:**
   - Approved: Can see discount at checkout immediately
   - Rejected: Gets reason + can reapply after 24 hours

### Handling Suspensions

**Auto-Suspensions (System):**

1. **Check audit logs** at `/admin/audit-logs`
   - Filter by action: "LICENSE_ABUSE_DETECTED" or "ACCOUNT_SUSPENDED"

2. **Review the case:**
   - Suspicion score shown in audit details
   - Reasons listed (e.g., "10 downloads from 6 IPs")

3. **Decide:**
   - **Legitimate abuse:** Leave suspended, respond to user appeal if they contact you
   - **False positive:** Unsuspend via API or database

**Manual Suspensions:**

Use `lib/suspension.ts` functions in admin tools (you can build UI for this):

```typescript
import { suspendUser, unsuspendUser } from '@/lib/suspension'

// Suspend
await suspendUser(userId, "Reselling products on Gumroad", adminUserId)

// Unsuspend
await unsuspendUser(userId, adminUserId)
```

### Checking Discount Eligibility

**In your checkout flow:**

```typescript
import { getUserDiscountEligibility, calculateDiscountedPrice } from '@/lib/discounts'

// Get eligibility
const eligibility = await getUserDiscountEligibility(userId)

if (eligibility.eligible) {
  const originalPrice = 100
  const discountedPrice = calculateDiscountedPrice(originalPrice, eligibility.discountPercent)

  // Store in order
  await prisma.order.create({
    data: {
      // ... other fields
      discountApplied: true,
      discountType: eligibility.discountType,
      discountPercent: eligibility.discountPercent,
      discountAmount: originalPrice - discountedPrice,
      total: discountedPrice,
    }
  })
}
```

---

## TESTING CHECKLIST

### Student Verification Flow

**As a Student:**
- [ ] Navigate to `/student`
- [ ] Fill out application form (use real-looking data)
- [ ] Submit application
- [ ] Verify you see "PENDING" status
- [ ] Try to submit again (should be blocked: "You have a pending verification")

**As Admin:**
- [ ] Navigate to `/admin/student-verifications`
- [ ] See the pending application
- [ ] Click "Approve" (with optional notes)
- [ ] Verify status changes to "APPROVED"

**As Student (after approval):**
- [ ] Refresh `/student` page
- [ ] See "APPROVED" status with discount percentage
- [ ] Navigate to shop/checkout
- [ ] Verify discount is applied (you'll need to integrate discount display in checkout)

### Youth (13-18) Flow

- [ ] Select "Youth (13-18)" option
- [ ] Enter guardian email
- [ ] Check guardian consent box
- [ ] Submit
- [ ] Verify requires both fields

### Rejection Flow

**As Admin:**
- [ ] Reject an application with reason "Institution not found"

**As Student:**
- [ ] See "REJECTED" status with admin reason
- [ ] Try to reapply immediately (should be blocked: "Please wait before reapplying")
- [ ] Wait 24 hours OR manually update `lastApplicationAt` in database to past
- [ ] Reapply successfully

### Suspension Flow

**Manual Test:**
- [ ] Create test user
- [ ] Create test license
- [ ] Run abuse detection:
  ```typescript
  import { checkAndSuspendIfAbused } from '@/lib/suspension'
  await checkAndSuspendIfAbused(testUserId, testLicenseId)
  ```
- [ ] Manually create 15 downloads with different IPs in database
- [ ] Run detection again
- [ ] Verify user is suspended + licenses revoked

**Download Block Test:**
- [ ] Try to download with suspended account
- [ ] Should see error: "Account suspended"

### Cooldown Test

- [ ] Submit application
- [ ] Get it rejected
- [ ] Try to reapply within 24 hours
- [ ] Verify error: "Please wait before reapplying"

### Rate Limiting Test

- [ ] Submit 3 verification applications rapidly
- [ ] 4th attempt should fail: "Too many verification attempts"

---

## API ENDPOINTS SUMMARY

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/student-verification/apply` | User | Submit verification application |
| GET | `/api/student-verification/status` | User | Get current verification status |
| GET | `/api/admin/student-verifications` | Admin | List all verifications (filterable) |
| POST | `/api/admin/student-verifications/[id]/approve` | Admin | Approve verification (12-month validity) |
| POST | `/api/admin/student-verifications/[id]/reject` | Admin | Reject verification (24-hour cooldown) |

---

## INTEGRATIONS NEEDED

### 1. Checkout Flow

Update your checkout to apply discounts:

```typescript
// In app/api/checkout/route.ts or similar

import { getUserDiscountEligibility, calculateDiscountedPrice } from '@/lib/discounts'

// Before creating order
const eligibility = await getUserDiscountEligibility(userId)

if (eligibility.eligible) {
  subtotal = calculateDiscountedPrice(subtotal, eligibility.discountPercent)

  // Store discount info
  orderData.discountApplied = true
  orderData.discountType = eligibility.discountType
  orderData.discountPercent = eligibility.discountPercent
  orderData.discountAmount = originalSubtotal - subtotal
}
```

### 2. Product Pages

Show student pricing:

```typescript
// In product page component

import { getUserDiscountEligibility } from '@/lib/discounts'

const eligibility = await getUserDiscountEligibility(userId)

// Display both prices
<div>
  {eligibility.eligible ? (
    <>
      <span className="line-through">${price}</span>
      <span className="text-success">${calculateDiscountedPrice(price, eligibility.discountPercent)}</span>
      <span className="badge badge-success">Student Discount</span>
    </>
  ) : (
    <span>${price}</span>
  )}
</div>
```

### 3. Download Gates

Protect download endpoints:

```typescript
// In app/api/digital-products/[slug]/download/route.ts

import { canUserDownload } from '@/lib/suspension-middleware'
import { checkAndSuspendIfAbused } from '@/lib/suspension'

// Before generating download token
const downloadPermission = await canUserDownload(userId, licenseId)

if (!downloadPermission.allowed) {
  return NextResponse.json(
    { error: downloadPermission.reason },
    { status: 403 }
  )
}

// Run abuse detection
const suspensionCheck = await checkAndSuspendIfAbused(userId, licenseId)

if (suspensionCheck.suspended) {
  return NextResponse.json(
    { error: 'Account suspended for suspicious activity', reason: suspensionCheck.reason },
    { status: 403 }
  )
}

// Proceed with download...
```

### 4. Purchase Gates

Protect purchase endpoints:

```typescript
// In app/api/checkout/route.ts or similar

import { canUserPurchase } from '@/lib/suspension-middleware'

// Before processing payment
const purchasePermission = await canUserPurchase(userId)

if (!purchasePermission.allowed) {
  return NextResponse.json(
    { error: purchasePermission.reason },
    { status: 403 }
  )
}
```

---

## MONITORING & MAINTENANCE

### Daily Tasks

- [ ] Check `/admin/student-verifications?status=PENDING`
- [ ] Review and approve/reject new applications
- [ ] Check audit logs for abuse detections

### Weekly Tasks

- [ ] Review suspended accounts in audit logs
- [ ] Check for patterns (multiple rejections from same institution)
- [ ] Update suspicious behavior thresholds if needed

### Monthly Tasks

- [ ] Review false positive suspension rate
- [ ] Adjust abuse detection thresholds in `lib/suspension.ts` if needed
- [ ] Check for expired verifications (auto-expires after 12 months)
- [ ] Send reminders to expiring students (manual for now)

### Quarterly Tasks

- [ ] Review student discount usage stats
- [ ] Adjust discount percentage if needed
- [ ] Update legal policies if required

---

## FUTURE ENHANCEMENTS (Optional)

**Email Notifications:**
- Send approval/rejection emails automatically
- Reminder emails 30 days before expiration
- Suspension notification emails

**Automated Institution Lookup:**
- Integrate with education database API (paid service)
- Auto-approve known institutions
- Flag unknown institutions for manual review

**Improved Abuse Detection:**
- Machine learning-based pattern detection
- Integration with IP reputation services
- Browser fingerprinting (more reliable than device fingerprint)

**Self-Service Portal:**
- Students can upload replacement IDs
- Students can request early renewal (before expiration)
- Students can view discount usage history

**Analytics Dashboard:**
- Student verification approval rate
- Average review time
- Discount redemption rate
- Abuse detection accuracy

---

## TROUBLESHOOTING

### "Student verification not showing discount at checkout"

1. Check user has APPROVED status: `/student` page
2. Check expiration: `expiresAt` field in database
3. Verify checkout code calls `getUserDiscountEligibility()`
4. Check browser console for errors

### "Institution check script not working"

```bash
# Make sure ts-node is installed
npm install -D ts-node

# Run with explicit interpreter
npx ts-node scripts/institution-check.ts "University" "Country"
```

### "Abuse detection not triggering"

1. Check download records exist in database (`downloads` table)
2. Verify `ipHash` and `deviceFingerprint` are being saved
3. Check suspicion score manually:
   ```typescript
   import { detectSuspiciousDownloads } from '@/lib/suspension'
   const result = await detectSuspiciousDownloads(userId, licenseId)
   console.log(result)
   ```
4. Adjust thresholds in `lib/suspension.ts` if needed

### "Migration failed"

```bash
# Reset database (CAUTION: loses data)
npx prisma migrate reset

# Or create migration manually
npx prisma migrate dev --name fix_student_verification --create-only
# Edit the generated SQL file
npx prisma migrate dev
```

---

## SECURITY NOTES

### What This Implementation DOES:

✅ Prevents non-students from getting discounts (manual verification)
✅ Detects blatant resale patterns (excessive downloads, multiple IPs)
✅ Enforces cooldowns to prevent spam (24-hour rejection cooldown)
✅ Rate limits applications (3 per 24 hours)
✅ Revokes access for suspended users (download + purchase blocks)
✅ Logs all actions for audit (verification, suspension, abuse)

### What This Implementation DOES NOT:

❌ Detect sophisticated resale (single download, private redistribution)
❌ Prevent determined attackers with VPNs (requires paid fingerprinting service)
❌ Automatically verify educational institutions (requires paid API)
❌ Detect fake IDs (requires human review)
❌ Track post-download usage (honor system for license terms)

### Recommendations:

- **Manual review is critical** - Don't auto-approve based on .edu email alone
- **Monitor audit logs regularly** - Catch patterns early
- **Adjust thresholds based on your traffic** - Default values may need tuning
- **Be responsive to appeals** - False positives will happen
- **Document your decisions** - Use admin notes field consistently

---

## SUPPORT & QUESTIONS

If you encounter issues:

1. Check this guide first
2. Check Prisma schema is correctly updated
3. Check migration ran successfully: `npx prisma migrate status`
4. Check audit logs for error details
5. Review API error responses (they include details)

For questions about this implementation, refer to:
- `docs/legal/STUDENT_AND_ANTI_RESALE_POLICIES.md` for policies
- `lib/discounts.ts` for discount logic
- `lib/suspension.ts` for abuse detection logic
- API route files for endpoint details

---

## SUMMARY

**Implementation Status:** ✅ COMPLETE

**What Was Built:**
- Full student/youth verification system with manual approval
- Automated abuse detection with auto-suspension
- Legal policies for student discounts and anti-resale
- Admin tools for reviewing verifications
- Helper scripts for institution verification
- Comprehensive documentation

**What You Need to Do:**
1. Run Prisma migration (5 min)
2. Update legal pages (15 min)
3. Integrate discount logic into checkout (30 min)
4. Add download/purchase gates (30 min)
5. Test the entire flow (1 hour)

**Total Setup Time:** ~2-3 hours

**Maintenance Time:** ~1 hour/week (reviewing applications + monitoring)

---

**Last Updated:** 2026-01-11
**Version:** 1.0
**Author:** Codex (AI Implementation Agent)
