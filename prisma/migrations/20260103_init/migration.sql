-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'MODERATOR', 'VIEWER', 'EDITOR', 'OWNER');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('WEB_APPLICATION', 'MOBILE_APPLICATION', 'DESKTOP_APPLICATION', 'E_COMMERCE', 'LANDING_PAGE', 'PORTFOLIO', 'CUSTOM_SOFTWARE', 'API_INTEGRATION', 'CONSULTING', 'OTHER');

-- CreateEnum
CREATE TYPE "BudgetRange" AS ENUM ('UNDER_1K', 'RANGE_1K_5K', 'RANGE_5K_10K', 'RANGE_10K_25K', 'RANGE_25K_50K', 'ABOVE_50K', 'NOT_SURE');

-- CreateEnum
CREATE TYPE "Timeline" AS ENUM ('URGENT', 'SHORT', 'MEDIUM', 'LONG', 'FLEXIBLE');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'REVIEWING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ProjectCategory" AS ENUM ('WEB_DEVELOPMENT', 'MOBILE_DEVELOPMENT', 'UI_UX_DESIGN', 'FULL_STACK', 'BACKEND', 'FRONTEND', 'DEVOPS', 'DATA_SCIENCE', 'MACHINE_LEARNING', 'BLOCKCHAIN', 'GAME_DEVELOPMENT', 'OTHER', 'PERSONAL', 'CLASS');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'LOCKED', 'BANNED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('TEMPLATE', 'THEME', 'UI_KIT', 'CODE_SNIPPET', 'DOCUMENTATION', 'ASSET', 'LICENSE', 'OTHER');

-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('PERSONAL', 'COMMERCIAL', 'TEAM');

-- CreateEnum
CREATE TYPE "LicenseStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "OrderPurchaseType" AS ENUM ('ONE_TIME', 'CREDITS');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ResetRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('WEB_DESIGN', 'WEB_DEVELOPMENT', 'MOBILE_APP', 'CUSTOM_SOFTWARE', 'CONSULTING', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "ProjectPhase" AS ENUM ('DESIGN', 'BUILD', 'POST_LAUNCH', 'COMPLETED', 'PAUSED');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AddOnType" AS ENUM ('EXTRA_REVISION', 'CONTENT_EDIT', 'SUPPORT_CALL', 'RUSH_DELIVERY', 'EMERGENCY_FIX', 'REOPEN_PROJECT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "AddOnStatus" AS ENUM ('PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MembershipTier" AS ENUM ('BASIC_ACCESS', 'PRO', 'MANAGED');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED', 'PAUSED');

-- CreateEnum
CREATE TYPE "CreditTransactionType" AS ENUM ('INITIAL_ALLOCATION', 'RENEWAL', 'TOP_UP', 'USAGE', 'REFUND', 'ROLLOVER', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('USER_LOGIN', 'USER_LOGOUT', 'LICENSE_ISSUED', 'LICENSE_REVOKED', 'DOWNLOAD_ATTEMPTED', 'DOWNLOAD_SUCCEEDED', 'DOWNLOAD_FAILED', 'ABUSE_DETECTED', 'ACCOUNT_LOCKED', 'ACCOUNT_UNLOCKED', 'CREDIT_USED', 'MEMBERSHIP_CREATED', 'MEMBERSHIP_RENEWED', 'PROJECT_CREATED', 'PROJECT_PHASE_CHANGED', 'ADD_ON_REQUESTED', 'SETTINGS_CHANGED', 'LICENSE_SUSPENDED', 'LICENSE_REACTIVATED', 'LICENSE_SEAT_ASSIGNED', 'LICENSE_SEAT_REVOKED', 'LICENSE_ABUSE_FLAGGED', 'LICENSE_ABUSE_CLEARED', 'DOWNLOAD_ABUSE_DETECTED', 'DOWNLOAD_RESET_REQUESTED', 'DOWNLOAD_RESET_APPROVED', 'DOWNLOAD_RESET_REJECTED', 'CREDIT_ADJUSTED', 'MEMBERSHIP_SUSPENDED', 'FEATURE_FLAG_TOGGLED');

-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('DEVELOPMENT', 'STAGING', 'PRODUCTION');

-- CreateEnum
CREATE TYPE "BackupType" AS ENUM ('SCHEDULED', 'MANUAL', 'PRE_DEPLOYMENT');

-- CreateEnum
CREATE TYPE "BackupStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ContentPageType" AS ENUM ('TERMS', 'PRIVACY_POLICY', 'ABOUT', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "theme" "Theme" NOT NULL DEFAULT 'SYSTEM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountLockedAt" TIMESTAMP(3),
    "accountLockedReason" TEXT,
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "birthDate" TIMESTAMP(3),
    "guardianEmail" TEXT,
    "isMinor" BOOLEAN NOT NULL DEFAULT false,
    "membershipId" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "password" TEXT,
    "backupCodes" JSONB,
    "twoFactorVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "project_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "attachments" TEXT[],
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "adminNotes" TEXT,
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "respondedAt" TIMESTAMP(3),
    "projectType" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,

    CONSTRAINT "project_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ProjectCategory" NOT NULL,
    "tags" TEXT[],
    "techStack" TEXT[],
    "features" TEXT[],
    "images" TEXT[],
    "thumbnail" TEXT,
    "githubUrl" TEXT,
    "liveUrl" TEXT,
    "demoUrl" TEXT,
    "caseStudyUrl" TEXT,
    "content" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "problem" TEXT,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visits" (
    "id" TEXT NOT NULL,
    "pagePath" TEXT NOT NULL,
    "pageTitle" TEXT,
    "visitorId" TEXT NOT NULL,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "userAgent" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "country" TEXT,
    "city" TEXT,
    "sessionId" TEXT,
    "duration" INTEGER,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "page" TEXT,
    "category" TEXT,
    "label" TEXT,
    "value" INTEGER,
    "device" TEXT,
    "referrer" TEXT,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digital_products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "tags" TEXT[],
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "previewImages" TEXT[],
    "personalLicense" BOOLEAN NOT NULL DEFAULT true,
    "commercialLicense" BOOLEAN NOT NULL DEFAULT true,
    "teamLicense" BOOLEAN NOT NULL DEFAULT false,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "changelog" TEXT,
    "documentation" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "purchaseCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creditPrice" INTEGER,
    "ugxPrice" DECIMAL(10,2),
    "usdPrice" DECIMAL(10,2),

    CONSTRAINT "digital_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlist_items" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digital_product_purchases" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "licenseType" "LicenseType" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "transactionId" TEXT,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "digital_product_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "licenses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "licenseKey" TEXT NOT NULL,
    "licenseType" "LicenseType" NOT NULL,
    "status" "LicenseStatus" NOT NULL DEFAULT 'ACTIVE',
    "maxUsers" INTEGER NOT NULL DEFAULT 1,
    "currentUsers" INTEGER NOT NULL DEFAULT 0,
    "abuseDetected" BOOLEAN NOT NULL DEFAULT false,
    "abuseReason" TEXT,
    "revokedAt" TIMESTAMP(3),
    "revokedReason" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "abuseFlagged" BOOLEAN NOT NULL DEFAULT false,
    "abuseFlaggedAt" TIMESTAMP(3),
    "abuseFlaggedBy" TEXT,

    CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "license_seat_assignments" (
    "id" TEXT NOT NULL,
    "licenseId" TEXT NOT NULL,
    "assignedUserId" TEXT NOT NULL,
    "assignedUserEmail" TEXT NOT NULL,
    "assignedBy" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "license_seat_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "downloads" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "licenseId" TEXT NOT NULL,
    "successful" BOOLEAN NOT NULL DEFAULT false,
    "ipHash" TEXT NOT NULL,
    "deviceFingerprint" TEXT,
    "userAgent" TEXT,
    "downloadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "downloads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "download_reset_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "ResetRequestStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "download_reset_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "licenseType" "LicenseType" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "tax" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "paymentProvider" TEXT,
    "transactionId" TEXT,
    "purchaseType" "OrderPurchaseType" NOT NULL,
    "creditsUsed" INTEGER,
    "membershipId" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "fulfilledAt" TIMESTAMP(3),
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "termsVersion" TEXT,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productSlug" TEXT NOT NULL,
    "licenseType" "LicenseType" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "licenseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_projects" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ServiceCategory" NOT NULL,
    "currentPhase" "ProjectPhase" NOT NULL DEFAULT 'DESIGN',
    "designRevisions" INTEGER NOT NULL DEFAULT 0,
    "designRevisionsMax" INTEGER NOT NULL DEFAULT 2,
    "buildRevisions" INTEGER NOT NULL DEFAULT 0,
    "buildRevisionsMax" INTEGER NOT NULL DEFAULT 1,
    "approvedFeatures" TEXT[],
    "scope" TEXT,
    "startDate" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "pauseReason" TEXT,
    "pausedAt" TIMESTAMP(3),
    "status" "ServiceStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "service_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_phase_history" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "phase" "ProjectPhase" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "project_phase_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_add_ons" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "AddOnType" NOT NULL,
    "description" TEXT NOT NULL,
    "creditCost" INTEGER NOT NULL,
    "status" "AddOnStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "service_add_ons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "tier" "MembershipTier" NOT NULL,
    "totalCredits" INTEGER NOT NULL,
    "usedCredits" INTEGER NOT NULL DEFAULT 0,
    "remainingCredits" INTEGER NOT NULL,
    "rolloverCredits" INTEGER NOT NULL DEFAULT 0,
    "rolloverCap" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "renewalDate" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "type" "CreditTransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "AuditAction" NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "details" JSONB,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceFingerprint" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "blockedReason" TEXT,
    "firstSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "device_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_pages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ContentPageType" NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_contents" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL DEFAULT 'site_settings_singleton',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "availableForBusiness" BOOLEAN NOT NULL DEFAULT true,
    "adsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "adsProvider" TEXT NOT NULL DEFAULT '',
    "adsClientId" TEXT,
    "adsPlacements" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "smtpHost" TEXT,
    "smtpPassword" TEXT,
    "smtpPort" INTEGER,
    "smtpSecure" BOOLEAN NOT NULL DEFAULT false,
    "smtpUsername" TEXT,
    "avatarUrl" TEXT,
    "availabilityMessage" TEXT,
    "availabilityStatus" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "leaveEnd" TIMESTAMP(3),
    "leaveStart" TIMESTAMP(3),
    "manualOverride" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "environment" "Environment" NOT NULL DEFAULT 'PRODUCTION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_backups" (
    "id" TEXT NOT NULL,
    "type" "BackupType" NOT NULL,
    "description" TEXT,
    "storageUrl" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "includesDatabase" BOOLEAN NOT NULL DEFAULT true,
    "includesFiles" BOOLEAN NOT NULL DEFAULT false,
    "includesConfig" BOOLEAN NOT NULL DEFAULT false,
    "includesAuditLogs" BOOLEAN NOT NULL DEFAULT false,
    "status" "BackupStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "system_backups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_ad_consents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "personalizedAds" BOOLEAN NOT NULL DEFAULT false,
    "consentedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_ad_consents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_accountStatus_idx" ON "users"("accountStatus");

-- CreateIndex
CREATE INDEX "users_membershipId_idx" ON "users"("membershipId");

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE INDEX "project_requests_userId_idx" ON "project_requests"("userId");

-- CreateIndex
CREATE INDEX "project_requests_email_idx" ON "project_requests"("email");

-- CreateIndex
CREATE INDEX "project_requests_status_idx" ON "project_requests"("status");

-- CreateIndex
CREATE INDEX "project_requests_createdAt_idx" ON "project_requests"("createdAt");

-- CreateIndex
CREATE INDEX "project_requests_projectType_idx" ON "project_requests"("projectType");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_slug_idx" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_category_idx" ON "projects"("category");

-- CreateIndex
CREATE INDEX "projects_featured_idx" ON "projects"("featured");

-- CreateIndex
CREATE INDEX "projects_published_idx" ON "projects"("published");

-- CreateIndex
CREATE INDEX "projects_createdAt_idx" ON "projects"("createdAt");

-- CreateIndex
CREATE INDEX "visits_pagePath_idx" ON "visits"("pagePath");

-- CreateIndex
CREATE INDEX "visits_visitorId_idx" ON "visits"("visitorId");

-- CreateIndex
CREATE INDEX "visits_timestamp_idx" ON "visits"("timestamp");

-- CreateIndex
CREATE INDEX "visits_sessionId_idx" ON "visits"("sessionId");

-- CreateIndex
CREATE INDEX "analytics_events_action_idx" ON "analytics_events"("action");

-- CreateIndex
CREATE INDEX "analytics_events_page_idx" ON "analytics_events"("page");

-- CreateIndex
CREATE INDEX "analytics_events_createdAt_idx" ON "analytics_events"("createdAt");

-- CreateIndex
CREATE INDEX "analytics_events_action_createdAt_idx" ON "analytics_events"("action", "createdAt");

-- CreateIndex
CREATE INDEX "analytics_events_page_createdAt_idx" ON "analytics_events"("page", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "digital_products_slug_key" ON "digital_products"("slug");

-- CreateIndex
CREATE INDEX "digital_products_slug_idx" ON "digital_products"("slug");

-- CreateIndex
CREATE INDEX "digital_products_category_idx" ON "digital_products"("category");

-- CreateIndex
CREATE INDEX "digital_products_published_idx" ON "digital_products"("published");

-- CreateIndex
CREATE INDEX "digital_products_featured_idx" ON "digital_products"("featured");

-- CreateIndex
CREATE INDEX "wishlist_items_userId_idx" ON "wishlist_items"("userId");

-- CreateIndex
CREATE INDEX "wishlist_items_productId_idx" ON "wishlist_items"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_items_userId_productId_key" ON "wishlist_items"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "digital_product_purchases_transactionId_key" ON "digital_product_purchases"("transactionId");

-- CreateIndex
CREATE INDEX "digital_product_purchases_userId_idx" ON "digital_product_purchases"("userId");

-- CreateIndex
CREATE INDEX "digital_product_purchases_productId_idx" ON "digital_product_purchases"("productId");

-- CreateIndex
CREATE INDEX "digital_product_purchases_paymentStatus_idx" ON "digital_product_purchases"("paymentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "licenses_licenseKey_key" ON "licenses"("licenseKey");

-- CreateIndex
CREATE INDEX "licenses_userId_idx" ON "licenses"("userId");

-- CreateIndex
CREATE INDEX "licenses_productId_idx" ON "licenses"("productId");

-- CreateIndex
CREATE INDEX "licenses_licenseKey_idx" ON "licenses"("licenseKey");

-- CreateIndex
CREATE INDEX "licenses_status_idx" ON "licenses"("status");

-- CreateIndex
CREATE INDEX "licenses_abuseFlagged_idx" ON "licenses"("abuseFlagged");

-- CreateIndex
CREATE INDEX "license_seat_assignments_licenseId_idx" ON "license_seat_assignments"("licenseId");

-- CreateIndex
CREATE INDEX "license_seat_assignments_assignedUserId_idx" ON "license_seat_assignments"("assignedUserId");

-- CreateIndex
CREATE INDEX "license_seat_assignments_active_idx" ON "license_seat_assignments"("active");

-- CreateIndex
CREATE UNIQUE INDEX "license_seat_assignments_licenseId_assignedUserEmail_key" ON "license_seat_assignments"("licenseId", "assignedUserEmail");

-- CreateIndex
CREATE INDEX "downloads_userId_idx" ON "downloads"("userId");

-- CreateIndex
CREATE INDEX "downloads_productId_idx" ON "downloads"("productId");

-- CreateIndex
CREATE INDEX "downloads_licenseId_idx" ON "downloads"("licenseId");

-- CreateIndex
CREATE INDEX "downloads_downloadedAt_idx" ON "downloads"("downloadedAt");

-- CreateIndex
CREATE INDEX "download_reset_requests_userId_idx" ON "download_reset_requests"("userId");

-- CreateIndex
CREATE INDEX "download_reset_requests_status_idx" ON "download_reset_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "carts_userId_key" ON "carts"("userId");

-- CreateIndex
CREATE INDEX "cart_items_cartId_idx" ON "cart_items"("cartId");

-- CreateIndex
CREATE INDEX "cart_items_productId_idx" ON "cart_items"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_productId_licenseType_key" ON "cart_items"("cartId", "productId", "licenseType");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_paymentStatus_idx" ON "orders"("paymentStatus");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE UNIQUE INDEX "order_items_licenseId_key" ON "order_items"("licenseId");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");

-- CreateIndex
CREATE INDEX "service_projects_userId_idx" ON "service_projects"("userId");

-- CreateIndex
CREATE INDEX "service_projects_currentPhase_idx" ON "service_projects"("currentPhase");

-- CreateIndex
CREATE INDEX "service_projects_status_idx" ON "service_projects"("status");

-- CreateIndex
CREATE INDEX "project_phase_history_projectId_idx" ON "project_phase_history"("projectId");

-- CreateIndex
CREATE INDEX "service_add_ons_projectId_idx" ON "service_add_ons"("projectId");

-- CreateIndex
CREATE INDEX "service_add_ons_status_idx" ON "service_add_ons"("status");

-- CreateIndex
CREATE INDEX "memberships_status_idx" ON "memberships"("status");

-- CreateIndex
CREATE INDEX "credit_transactions_userId_idx" ON "credit_transactions"("userId");

-- CreateIndex
CREATE INDEX "credit_transactions_membershipId_idx" ON "credit_transactions"("membershipId");

-- CreateIndex
CREATE INDEX "credit_transactions_createdAt_idx" ON "credit_transactions"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_resource_idx" ON "audit_logs"("resource");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "device_sessions_userId_idx" ON "device_sessions"("userId");

-- CreateIndex
CREATE INDEX "device_sessions_blocked_idx" ON "device_sessions"("blocked");

-- CreateIndex
CREATE UNIQUE INDEX "content_pages_slug_key" ON "content_pages"("slug");

-- CreateIndex
CREATE INDEX "content_pages_slug_idx" ON "content_pages"("slug");

-- CreateIndex
CREATE INDEX "content_pages_type_idx" ON "content_pages"("type");

-- CreateIndex
CREATE UNIQUE INDEX "page_contents_slug_key" ON "page_contents"("slug");

-- CreateIndex
CREATE INDEX "page_contents_slug_idx" ON "page_contents"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_name_key" ON "feature_flags"("name");

-- CreateIndex
CREATE INDEX "feature_flags_name_idx" ON "feature_flags"("name");

-- CreateIndex
CREATE INDEX "feature_flags_environment_idx" ON "feature_flags"("environment");

-- CreateIndex
CREATE INDEX "system_backups_status_idx" ON "system_backups"("status");

-- CreateIndex
CREATE INDEX "system_backups_createdAt_idx" ON "system_backups"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_ad_consents_userId_key" ON "user_ad_consents"("userId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "memberships"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "digital_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digital_product_purchases" ADD CONSTRAINT "digital_product_purchases_productId_fkey" FOREIGN KEY ("productId") REFERENCES "digital_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digital_product_purchases" ADD CONSTRAINT "digital_product_purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_productId_fkey" FOREIGN KEY ("productId") REFERENCES "digital_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "license_seat_assignments" ADD CONSTRAINT "license_seat_assignments_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "licenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "licenses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_productId_fkey" FOREIGN KEY ("productId") REFERENCES "digital_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "digital_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "memberships"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "licenses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "digital_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_projects" ADD CONSTRAINT "service_projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_phase_history" ADD CONSTRAINT "project_phase_history_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "service_projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_add_ons" ADD CONSTRAINT "service_add_ons_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "service_projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "memberships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_ad_consents" ADD CONSTRAINT "user_ad_consents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

