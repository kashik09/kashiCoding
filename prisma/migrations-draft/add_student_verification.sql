-- Student Verification System Migration
-- Generated: 2026-01-11

-- Add new enums
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');
CREATE TYPE "VerificationMethod" AS ENUM ('SCHOOL_EMAIL', 'ID_UPLOAD', 'MANUAL');
CREATE TYPE "DiscountType" AS ENUM ('STUDENT', 'YOUTH_13_18', 'PROMOTIONAL', 'NONE');

-- Create StudentVerification table
CREATE TABLE "student_verifications" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE,
  "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
  "method" "VerificationMethod" NOT NULL,
  "schoolEmail" TEXT,
  "institutionName" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "evidenceUrl" TEXT,
  "notes" TEXT,
  "reviewedBy" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "discountType" "DiscountType" NOT NULL,
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "guardianEmail" TEXT,
  "guardianConsent" BOOLEAN DEFAULT false,
  "lastApplicationAt" TIMESTAMP(3),
  CONSTRAINT "student_verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Add discount fields to Order
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "discountApplied" BOOLEAN DEFAULT false;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "discountType" "DiscountType" DEFAULT 'NONE';
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "discountPercent" DECIMAL(5,2) DEFAULT 0;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "discountAmount" DECIMAL(10,2) DEFAULT 0;

-- Add user suspension tracking fields (if not exists)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "suspendedAt" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "suspendedReason" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "suspendedBy" TEXT;

-- Add resale protection fields to License
ALTER TABLE "licenses" ADD COLUMN IF NOT EXISTS "resaleProhibited" BOOLEAN DEFAULT true;
ALTER TABLE "licenses" ADD COLUMN IF NOT EXISTS "allowedUse" TEXT DEFAULT 'PERSONAL';
ALTER TABLE "licenses" ADD COLUMN IF NOT EXISTS "suspicionScore" INTEGER DEFAULT 0;
ALTER TABLE "licenses" ADD COLUMN IF NOT EXISTS "lastAbuseCheckAt" TIMESTAMP(3);

-- Create indexes
CREATE INDEX IF NOT EXISTS "student_verifications_userId_idx" ON "student_verifications"("userId");
CREATE INDEX IF NOT EXISTS "student_verifications_status_idx" ON "student_verifications"("status");
CREATE INDEX IF NOT EXISTS "student_verifications_expiresAt_idx" ON "student_verifications"("expiresAt");
CREATE INDEX IF NOT EXISTS "orders_discountType_idx" ON "orders"("discountType");
CREATE INDEX IF NOT EXISTS "users_suspendedAt_idx" ON "users"("suspendedAt");
CREATE INDEX IF NOT EXISTS "licenses_suspicionScore_idx" ON "licenses"("suspicionScore");
