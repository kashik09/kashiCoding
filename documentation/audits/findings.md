# Kashi Kweyu Portfolio - Comprehensive Feature Documentation

**Generated**: 2025-12-19
**Updated**: 2026-01-11
**Status**: ⚠️ NOT Production Ready (Payment Integration Required)
**Version**: 1.1.0-dev
**Latest Update**: Credit pricing proposal created, documentation updated
**Latest Audit**: Comprehensive Codebase Audit (2026-01-07)

**PRODUCTION BLOCKERS:**
- ❌ Payment integration not implemented (demo mode only)
- ⚠️ Credit system pricing proposal pending approval (see CREDIT_PRICING_PROPOSAL.md)
- ⚠️ Critical security vulnerabilities present
- ⚠️ Email notifications incomplete (many TODOs)

**See:** `/docs/audits/comprehensive-audit-summary.md` for detailed status

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technology Stack](#technology-stack)
3. [Authentication & Authorization](#authentication--authorization)
4. [Database Schema](#database-schema)
5. [Admin Panel Features](#admin-panel-features)
6. [User Dashboard Features](#user-dashboard-features)
7. [Content Management System](#content-management-system)
8. [API Routes & Endpoints](#api-routes--endpoints)
9. [Frontend Features](#frontend-features)
10. [File Upload & Downloads](#file-upload--downloads)
11. [Security Features](#security-features)
12. [Analytics & Monitoring](#analytics--monitoring)
13. [Notifications System](#notifications-system)
14. [Extended Features](#extended-features)
15. [Middleware & Route Protection](#middleware--route-protection)

---

## Executive Summary

This is a **full-featured portfolio and service management platform** designed for professional developers to showcase work, manage client projects, sell digital products, and run a service-based business. The application features comprehensive admin capabilities and a sophisticated membership/licensing system.

**Current State:** Feature-complete architecture in development phase. Payment integration and business logic pricing required before production launch.

### Implemented Features ✅

- **6-tier role-based access control** (OWNER, ADMIN, MODERATOR, EDITOR, VIEWER, USER)
- **Mandatory 2FA** for admin users with TOTP and backup codes
- **Advanced license management** with team seat assignments (up to 5 seats)
- **Automated abuse detection** with download limits and device tracking
- **Digital product marketplace** with 3 license types and download control
- **Credit-based membership system** (infrastructure complete, pricing undefined)
- **Service project management** with phase tracking and add-ons (schema defined)
- **Dynamic page builder** with 7 section types
- **Audit logging** with comprehensive tracking
- **Email infrastructure** (partial - many notifications not yet wired)

### Production Blockers ❌

- **No payment integration** - Memberships/products created for free (demo mode only)
- **Credit pricing undefined** - Cannot sell memberships without defining value
- **Payment webhooks missing** - Cannot process real payment events
- **Email notifications incomplete** - Many TODO comments in fulfillment code
- **Security vulnerabilities** - CSRF protection, rate limiting not implemented
- **No testing** - 0% test coverage

### Partially Implemented ⚠️

- **WhatsApp notifications** - Manual URL generation only (not automated)
- **Analytics dashboard** - UI exists but no real data storage
- **Service project management** - Schema exists, UI/workflows not complete

---

## Technology Stack

### Core Framework
- **Next.js** 14.2.0 (React 18.3.1)
- **TypeScript** 5.4.0
- **Tailwind CSS** 3.4.0

### Authentication & Security
- **NextAuth** 4.24.13 (Credentials, Google OAuth, GitHub OAuth, Email)
- **bcryptjs** (Password hashing)
- **otplib** 12.0.1 (2FA TOTP)
- **qrcode** 1.5.4 (QR code generation)

### Database
- **Prisma** 5.22.0 (ORM)
- **PostgreSQL** (via Supabase)

### UI Components
- **Lucide React** (Icons)
- **Framer Motion** (Animations)
- **React Markdown** (Content rendering)
- **clsx** (Class merging)

### External Services
- **Resend** 6.6.0 (Email notifications)
- **Nodemailer** 7.0.11 (Email backend)
- **Vercel Analytics** (Traffic tracking)
- **Supabase** (Database & file storage)

---

## Authentication & Authorization

### Authentication Methods

1. **Credentials Authentication**
   - Email/password with bcrypt hashing
   - "Remember Me" option (30 days vs 1 day session)
   - Secure password validation

2. **OAuth Providers**
   - Google OAuth
   - GitHub OAuth
   - Account linking support

3. **Email Provider**
   - Magic link authentication
   - Email verification

### Session Management

- **JWT-based sessions** with NextAuth
- **Dynamic expiry**: 1 day (default) or 30 days (Remember Me)
- **Cookie persistence**: Secure HTTP-only cookies
- **Token refresh**: Automatic on login trigger
- **Session alignment**: Token expiry synced with session expiry

### Two-Factor Authentication (2FA)

- **Mandatory for admins**: All ADMIN/OWNER users must enable 2FA
- **TOTP implementation**: Time-based One-Time Password (otplib)
- **QR code generation**: For authenticator apps (Google Authenticator, Authy, etc.)
- **Backup codes**: 10 recovery codes generated at setup
- **Endpoints**:
  - `POST /api/auth/2fa/setup` - Initialize 2FA with secret and QR code
  - `POST /api/auth/2fa/verify` - Verify TOTP and enable 2FA
  - `POST /api/auth/2fa/validate` - Validate during login (supports backup codes)
  - `POST /api/auth/2fa/disable` - OWNER-only 2FA disabling

### User Roles (6 Tiers)

| Role | Permissions |
|------|-------------|
| **OWNER** | Full system control, only role that can disable 2FA |
| **ADMIN** | Administrative access, user/content management, 2FA required |
| **MODERATOR** | Content moderation capabilities |
| **EDITOR** | Content editing permissions |
| **VIEWER** | Read-only access |
| **USER** | Regular user (default role) |

### Account Status Management

- **ACTIVE**: Normal account status
- **LOCKED**: Temporarily locked with reason
- **BANNED**: Permanently banned
- **SUSPENDED**: Temporarily suspended

Admins can lock/unlock accounts and track lockout reasons.

---

## Database Schema

### Core User Models

#### User
- **Fields**: id, name, email, emailVerified, image, password, role, accountStatus, lockReason
- **2FA**: twoFactorEnabled, twoFactorSecret, backupCodes[]
- **Preferences**: theme (LIGHT, DARK, SYSTEM)
- **Membership**: membershipId
- **Timestamps**: createdAt, updatedAt, lastLoginAt

#### Account
- OAuth provider connections (Google, GitHub)
- Fields: provider, providerAccountId, accessToken, refreshToken

#### Session
- Active user sessions with expiry
- Fields: sessionToken, userId, expires

#### VerificationToken
- Email verification tokens
- Fields: identifier, token, expires

### Project & Portfolio Models

#### Project
- Portfolio project showcase
- **Fields**: title, slug, description, longDescription, category, tags[], techStack[]
- **Media**: images[], thumbnail, previewImages[]
- **Links**: githubUrl, liveUrl, demoUrl, caseStudyUrl
- **Status**: published, featured
- **Metrics**: viewCount, likeCount
- **Timestamps**: publishedAt, createdAt, updatedAt

#### DigitalProduct
- Sellable digital products
- **Fields**: title, slug, description, category, price (USD), fileUrl
- **Licensing**: licenseTypes[] (PERSONAL, COMMERCIAL, TEAM)
- **Documentation**: documentation, changelog, version
- **Media**: images[], previewImages[], thumbnail
- **Metrics**: downloadCount, purchaseCount
- **Status**: published, featured

### Request & Project Management

#### ProjectRequest
- User project requests
- **Fields**: name, email, phone, company, projectType, budget, timeline, description
- **Status**: PENDING, REVIEWING, IN_PROGRESS, COMPLETED, REJECTED, CANCELLED
- **Priority**: LOW, MEDIUM, HIGH, URGENT
- **Management**: adminNotes, assignedTo, respondedAt
- **Relations**: userId (optional)

#### ServiceProject
- Managed service projects
- **Fields**: name, description, scope, approvedFeatures, currentPhase
- **Phases**: DESIGN, BUILD, POST_LAUNCH, COMPLETED, PAUSED
- **Timeline**: startDate, deadline, estimatedDuration
- **Revisions**: revisionsAllowedPerPhase, revisionsUsed
- **Status**: ACTIVE, PAUSED, COMPLETED, CANCELLED

#### ProjectPhaseHistory
- Track project phase progression
- Fields: serviceProjectId, phase, enteredAt, exitedAt, notes

#### ServiceAddOn
- Extra services with credit costs
- Fields: name, description, creditCost, status

### Licensing & Downloads

#### License
- Product licenses with advanced management
- **Types**: PERSONAL (1 user), COMMERCIAL (1 user), TEAM (2-5 seats)
- **Fields**: userId, digitalProductId, licenseKey, maxUsers, currentUsers, expiresAt
- **Status**: ACTIVE, EXPIRED, REVOKED, SUSPENDED
- **Abuse Tracking**: abuseFlagged, abuseFlaggedAt, abuseFlaggedBy, abuseReason
- **Security**: abuseDetected flag, automatic suspension on abuse

#### LicenseSeatAssignment (NEW)
- Team license seat management
- **Fields**: licenseId, assignedUserId, assignedUserEmail, assignedBy, assignedAt
- **Status**: active, revokedAt, revokedBy
- **Constraints**: Unique constraint on (licenseId, assignedUserEmail)
- **Features**: Seat assignment/revocation with full audit trail

#### Download
- Download event tracking
- **Fields**: userId, digitalProductId, ipHash, deviceFingerprint, userAgent
- **Timestamps**: downloadedAt

#### DownloadResetRequest
- Requests to reset download limits
- Fields: userId, licenseId, reason, status

### Membership & Credits

#### Membership
- User membership tiers
- **Tiers**: BASIC_ACCESS, PRO, MANAGED
- **Credits**: creditsAllocated, creditsUsed, creditsRolledOver, rolloverCap
- **Billing**: startDate, endDate, renewalDate, autoRenew
- **Status**: ACTIVE, EXPIRED, CANCELLED, PAUSED

#### CreditTransaction
- Credit usage tracking
- **Types**: INITIAL_ALLOCATION, RENEWAL, TOP_UP, USAGE, REFUND, ROLLOVER, ADJUSTMENT
- **Fields**: userId, amount, balanceAfter, description, metadata

### Security & Audit

#### AuditLog
- Comprehensive audit trail
- **Action Types** (16): LOGIN, LOGOUT, LICENSE_ISSUED, LICENSE_REVOKED, DOWNLOAD_ATTEMPTED, DOWNLOAD_SUCCEEDED, DOWNLOAD_FAILED, ABUSE_DETECTED, ACCOUNT_LOCKED, ACCOUNT_UNLOCKED, CREDIT_USED, MEMBERSHIP_CREATED, MEMBERSHIP_RENEWED, PROJECT_CREATED, PROJECT_PHASE_CHANGED, ADD_ON_REQUESTED, SETTINGS_CHANGED
- **Fields**: userId, action, resourceType, resourceId, ipHash, userAgent, details (JSON)

#### DeviceSession
- Device fingerprinting and tracking
- **Fields**: userId, fingerprint, lastSeenAt, deviceInfo (JSON), isBlocked

### Content Management

#### Page
- Dynamic pages with sections
- **Fields**: slug, title, status (DRAFT, PUBLISHED), seoTitle, seoDescription
- **Sections**: sections[] (JSON array)
- **Metrics**: sectionCount

#### PageSection
- Page content sections
- **Types**: HERO, RICH_TEXT, CARDS, CTA, FAQ, CONTACT_BLOCK, PROJECT_GRID
- **Fields**: pageId, type, order, data (JSON)

### Analytics & Monitoring

#### Visit
- Comprehensive visitor tracking
- **Visitor**: visitorId, userId, sessionId
- **Page**: pagePath
- **Referrer**: referrer, utmSource, utmMedium, utmCampaign, utmContent, utmTerm
- **Device**: browser, os, device (mobile/tablet/desktop)
- **Location**: country, city
- **Engagement**: timeOnPage
- **Custom**: metadata (JSON)

#### SiteSettings
- Singleton site configuration
- **Fields**: maintenanceMode, maintenanceModeMessage, businessAvailable
- **Ads**: adsEnabled, adsProvider, adsPlacement, adsSettings (JSON)
- **Meta**: lastBackupAt

#### FeatureFlag
- Environment-specific feature toggles
- **Fields**: name, enabled, environment (DEVELOPMENT, STAGING, PRODUCTION), description

#### SystemBackup
- Backup tracking
- **Types**: SCHEDULED, MANUAL, PRE_DEPLOYMENT
- **Status**: PENDING, IN_PROGRESS, COMPLETED, FAILED
- **Content**: includesDatabase, includesFiles, includesConfig, includesAuditLogs
- **Storage**: backupUrl, size

### Other Models

#### ContentPage
- Static pages
- **Types**: TERMS, PRIVACY_POLICY, ABOUT, OTHER
- **Fields**: slug, type, title, content (JSON), status

#### UserAdConsent
- User advertising consent
- **Fields**: userId, consented, personalizedAds, consentedAt

---

## Admin Panel Features

### Dashboard Overview (`/admin`)

- **Statistics Cards**:
  - Total projects with featured count
  - Total requests with status breakdown
  - Total users with role distribution
  - Site visits with traffic trends
- **Quick Actions**:
  - Add new project
  - View pending requests
  - Manage users
  - Edit content pages
- **Recent Activity Feed**: Latest user actions and system events

### User Management (`/admin/users`)

**List View**:
- Search by name or email
- User statistics (Admins, Editors, Regular Users)
- User table with avatar, name, email, role, status, request count, join date
- Actions: Edit, Lock/Unlock, Delete

**Create User** (`/admin/users/new`):
- Add new admin/editor users
- Set name, email, password, role
- Auto-sends welcome email

**Edit User** (`/admin/users/[id]/edit`):
- Modify user details
- Change role (with role hierarchy validation)
- Update account status (ACTIVE, LOCKED, BANNED, SUSPENDED)
- View user's requests and projects
- Delete user (except OWNER)

### Project Management (`/admin/projects`)

**List View**:
- Search by title
- Filter by status (All, Published, Draft)
- Project cards with thumbnail, title, category, status, views, likes
- Actions: View, Edit, Delete

**Create Project** (`/admin/projects/new`):
- Title, slug, description, long description
- Category selection
- Tags (comma-separated)
- Tech stack
- Images upload
- Links (GitHub, Live, Demo, Case Study)
- Publishing options (published, featured)

**Edit Project** (`/admin/projects/[slug]/edit`):
- Modify all project fields
- Toggle publish/draft status
- Feature/unfeature project
- Delete project

### Request Management (`/admin/requests`)

**List View**:
- Search by submitter, email, company, project type
- Filter by status (All, Pending, Reviewing, In Progress, Completed, Rejected)
- Request table with submitter, type, budget, timeline, status, priority, submitted date
- Actions: View details

**Request Details** (`/admin/requests/[id]`):
- Full request information
- Contact details (name, email, phone, company)
- Project details (type, budget, timeline, description)
- Status management (update status)
- Priority assignment (LOW, MEDIUM, HIGH, URGENT)
- Admin notes (internal communication)
- Assignment (assign to admin user)
- Response tracking (when response was sent)

### Pages/Content Management (`/admin/pages`)

**List View**:
- All dynamic pages with slug, title, status, sections count
- Actions: Edit, Delete

**Create/Edit Page** (`/admin/pages/[slug]`):
- Page metadata (slug, title)
- SEO settings (seoTitle, seoDescription)
- Status (DRAFT, PUBLISHED)
- **Section Builder**:
  - Add sections: HERO, RICH_TEXT, CARDS, CTA, FAQ, CONTACT_BLOCK, PROJECT_GRID
  - Reorder sections (drag & drop)
  - Edit section content
  - Delete sections

**Section Types**:
1. **HERO**: Landing section with title, subtitle, CTA button
2. **RICH_TEXT**: Markdown/HTML content
3. **CARDS**: Card grid with configurable columns (2, 3, 4)
4. **CTA**: Call-to-action with title, description, button
5. **FAQ**: Accordion-style FAQs
6. **CONTACT_BLOCK**: Contact form
7. **PROJECT_GRID**: Dynamic project display with filtering

### Site Settings (`/admin/settings`)

**General Settings**:
- Maintenance mode (enable/disable)
- Maintenance message
- Business availability toggle

**Ads Configuration**:
- Enable/disable ads globally
- Ad provider selection
- Ad placement settings
- Custom ad configuration (JSON)

**Email Settings**:
- Test email configuration
- Notification recipient email

### Security Management (`/admin/setup-2fa`, `/admin/security`)

**2FA Setup**:
- QR code display for authenticator apps
- Secret key display
- Backup codes generation (10 codes)
- TOTP verification
- Download backup codes

**Security Dashboard**:
- View audit logs
- Device session monitoring
- Account lockout history

### Analytics Dashboard (`/admin/analytics`)

**Traffic Metrics**:
- Total views
- Unique visitors
- Engagement rate
- Time range filters (24h, 7d, 30d, all-time)

**Device Breakdown**:
- Desktop vs Mobile vs Tablet distribution
- Browser statistics
- OS statistics

**Top Content**:
- Most visited pages
- Popular projects
- Top referrers

**Recent Activity**:
- Event timeline with user actions
- Audit log integration

### License Management (`/admin/licenses`) ✨ NEW

**List View**:
- Comprehensive license dashboard with statistics
- Stats: Total licenses, Active, Suspended, Revoked, Abuse flagged
- Search by license key, user email, or product name
- Filter by status (ALL, ACTIVE, SUSPENDED, REVOKED)
- Filter by license type (ALL, PERSONAL, COMMERCIAL, TEAM)
- Filter by abuse status (show flagged licenses only)
- License table showing:
  - License key with abuse warning indicator
  - Product name
  - Owner (name and email)
  - License type (color-coded badges)
  - Status (color-coded badges)
  - Seat usage (X/Y for team licenses)
  - Download count
  - Quick actions (View, Suspend, Reactivate, Clear Abuse)

**License Details** (`/admin/licenses/[id]`):
- **License Information Card**:
  - License key (copy-friendly)
  - Product details with category
  - License type and status badges
  - Issued date and expiry date (if applicable)
  - Revoked reason (if revoked)
- **Owner Information Card**:
  - User avatar and name
  - Email address
  - User role badge
  - User ID
- **Abuse Warning Section** (if flagged):
  - Alert banner with abuse reason
  - Flagged date and flagged by admin
- **Team Seat Management** (for TEAM licenses):
  - Current seats occupied vs max seats (X/5)
  - Assign seat button (if seats available)
  - Seat list showing:
    - Email address
    - Assignment date
    - Active/Revoked status
    - Revoke button for active seats
- **Download History**:
  - Table of recent downloads (last 20)
  - Date/time, Status, IP hash, Device fingerprint
  - Success/Failed indicators
- **Admin Actions**:
  - Suspend license with reason
  - Reactivate suspended license
  - Clear abuse flag
  - Assign/revoke team seats

**Seat Management Features**:
- Assign seats with user ID and email validation
- Maximum 5 seats per team license (enforced)
- Revoke individual seats with audit trail
- Email notifications on seat assignment/revocation
- Full seat history tracking
- Seat status indicators (Active/Revoked)

**Abuse Detection & Management**:
- Automatic abuse flagging on detection
- Manual abuse flag clearing by admins
- Abuse reason display
- Automatic license suspension on abuse
- Email notifications to license holders
- Comprehensive audit logging

### Audit Log Viewer (`/admin/audit-logs`) ✨ NEW

**List View**:
- Comprehensive audit trail of all system actions
- **Filters**:
  - Search by user ID or email
  - Filter by action type (26 action types)
  - Filter by resource type (License, Download, User, Credit, Settings, etc.)
- **Audit Log Table**:
  - Timestamp
  - User (name, email, or "System")
  - Action (color-coded badges)
  - Resource type
  - Resource ID (truncated)
  - Details (expandable)
- **Action Color Coding**:
  - Red: Abuse, failed, rejected actions
  - Yellow: Suspended, locked actions
  - Green: Success, approved, reactivated actions
  - Blue: Regular actions
- **Expandable Details**:
  - Full JSON details of action
  - IP hash
  - User agent
  - Additional context
- **Pagination**: Page through large audit logs (50 per page)

**Audit Actions Tracked** (NEW):
- `LICENSE_SEAT_ASSIGNED` - Team seat assigned to user
- `LICENSE_SEAT_REVOKED` - Team seat revoked
- `LICENSE_ABUSE_FLAGGED` - License flagged for abuse
- `LICENSE_ABUSE_CLEARED` - Abuse flag cleared by admin
- `LICENSE_SUSPENDED` - License manually suspended
- `LICENSE_REACTIVATED` - License reactivated by admin
- `DOWNLOAD_ABUSE_DETECTED` - Automated abuse detection
- `DOWNLOAD_RESET_APPROVED` - Download reset request approved
- `DOWNLOAD_RESET_REJECTED` - Download reset request rejected
- `CREDIT_ADJUSTED` - Membership credits adjusted by admin

### Tags Management (`/admin/tags`)

- Create tags
- Edit tags
- Delete tags
- Tag usage statistics

### Legal/Content Pages (`/admin/legal`)

- Edit Terms of Service
- Edit Privacy Policy
- Manage other legal content

---

## User Dashboard Features

### Dashboard Overview (`/dashboard`)

**Welcome Section**:
- Personalized greeting with user name
- Account overview

**Statistics Cards**:
- Downloads owned (licensed products count)
- Requests submitted (total project requests)
- Pending requests (awaiting response)

**Membership Information**:
- Current tier (BASIC_ACCESS, PRO, MANAGED)
- Status indicator
- Credit usage (progress bar)
- Credits remaining / Credits allocated
- Reset countdown (days until period resets)

**Quick Actions**:
- Submit new request
- View downloads
- Manage profile

### Downloads Section (`/dashboard/downloads`)

**Licensed Products List**:
- Product cards with thumbnail, name, category
- License status badge (ACTIVE, EXPIRED, RESTRICTED)
- Download limit indicator (X/3 downloads)
- File size display

**Product Detail Page** (`/dashboard/downloads/[slug]`):
- Full product information
- License details (type, expiry, max users)
- Download history (recent downloads)
- Download button (if limit not exceeded)
- License key display
- Documentation link

**Download Control**:
- **Limit**: 3 downloads per 14-day window
- **Token-based**: Secure download URLs with HMAC-SHA256 tokens
- **TTL**: 5-minute token expiry
- **Validation**: License status check before download
- **Tracking**: Each download logged in Download model

### Requests Section (`/dashboard/requests`)

**Request List**:
- All submitted project requests
- Status badges (color-coded)
- Request type, budget, timeline
- Submitted date

**Request Detail** (`/dashboard/requests/[id]`):
- Full request information
- Status timeline
- Admin responses
- Notes from admin

### Profile Settings (`/dashboard/settings`)

**Avatar Management**:
- Avatar upload (5MB max, PNG/JPEG/WebP/GIF)
- Avatar preview
- Avatar URL input (alternative to upload)
- Clear avatar

**Profile Information**:
- Name
- Email (display only)

**Account Preferences**:
- Theme selection (Light, Dark, System)

**Password Management**:
- Change password
- Current password verification
- New password with confirmation

---

## Content Management System

### Dynamic Pages

**Page Creation**:
- Create unlimited pages with unique slugs
- Define page title and SEO metadata
- Set status (DRAFT or PUBLISHED)

**Section-Based Architecture**:
- Add multiple sections to each page
- Each section has a specific type and configurable data
- Sections ordered sequentially
- JSON-based section data storage

**Page Rendering**:
- Dynamic page loading by slug (`/[slug]`)
- Server-side rendering for SEO
- Automatic section rendering based on type

### Section Types

| Type | Description | Configuration |
|------|-------------|---------------|
| **HERO** | Landing/title section | Title, subtitle, CTA button (text, link), background image |
| **RICH_TEXT** | Markdown/HTML content | Rich text editor, supports images and formatting |
| **CARDS** | Card grid layout | Title, columns (2/3/4), card items (title, description, icon, link) |
| **CTA** | Call-to-action block | Title, description, button (text, link), variant (primary/secondary) |
| **FAQ** | Accordion FAQ section | Title, FAQ items (question, answer) |
| **CONTACT_BLOCK** | Contact form | Title, description, form fields, submission endpoint |
| **PROJECT_GRID** | Dynamic project display | Title, category filter, limit, include digital products toggle |

### Portfolio Items (Unified View)

**Abstraction Layer**:
- Projects and Digital Products as "PortfolioItem"
- Unified interface with common fields
- Mixed display capabilities

**Common Fields**:
- id, title, slug, description, category
- thumbnail, previewImages[]
- published, featured
- publishedAt, viewCount

**Filtering**:
- Filter by category across both projects and products
- Sort by featured status and publish date
- Limit results

### Project Content Management

**Project Fields**:
- **Basic**: Title, slug, description, longDescription
- **Categorization**: Category (enum), tags[]
- **Technical**: techStack[], features[]
- **Media**: images[], thumbnail, previewImages[]
- **Links**: githubUrl, liveUrl, demoUrl, caseStudyUrl
- **Content**: caseStudy (Markdown)
- **Publishing**: published, featured, publishedAt
- **Metrics**: viewCount, likeCount

**Project Categories**:
- WEB_DEVELOPMENT
- MOBILE_DEVELOPMENT
- UI_UX_DESIGN
- FULL_STACK
- BACKEND
- FRONTEND
- DEVOPS
- DATA_SCIENCE
- MACHINE_LEARNING
- BLOCKCHAIN
- GAME_DEVELOPMENT
- OTHER

### Digital Products Management

**Product Fields**:
- **Basic**: Title, slug, description, longDescription
- **Categorization**: Category (ProductCategory enum)
- **Pricing**: price (USD, Decimal)
- **Files**: fileUrl, fileSize, fileMimeType
- **Licensing**: licenseTypes[] (PERSONAL, COMMERCIAL, TEAM)
- **Documentation**: documentation, changelog, version
- **Media**: images[], previewImages[], thumbnail
- **Publishing**: published, featured, publishedAt
- **Metrics**: downloadCount, purchaseCount

**Product Categories**:
- TEMPLATE
- PLUGIN
- THEME
- EBOOK
- COURSE
- SCRIPT
- COMPONENT
- ASSET
- TOOL
- OTHER

### Static Content Pages

**Content Types**:
- About page (`/api/content/about`)
- Services page (`/api/content/services`)
- Request form content (`/api/content/request-form`)
- Generic pages (`/api/content/[slug]`)

**Storage**:
- JSON files in `public/content/`
- Editable via admin panel
- Version-controlled content

---

## API Routes & Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/[...nextauth]` | NextAuth handler (login, logout, providers) | No |
| POST | `/api/auth/signup` | User registration | No |
| POST | `/api/auth/2fa/setup` | Initialize 2FA (returns secret, QR, backup codes) | Yes |
| POST | `/api/auth/2fa/verify` | Verify TOTP and enable 2FA | Yes |
| POST | `/api/auth/2fa/validate` | Validate TOTP during login | No |
| POST | `/api/auth/2fa/disable` | Disable 2FA (OWNER only) | Yes (OWNER) |

### User Profile Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/me/profile` | Get current user profile | Yes |
| PATCH | `/api/me/profile` | Update profile (avatar, name) | Yes |
| POST | `/api/me/password/change` | Change password | Yes |
| GET | `/api/me/summary` | Dashboard summary data | Yes |
| GET | `/api/me/notifications` | User notifications | Yes |
| GET | `/api/me/ad-consent` | Get ad consent status | Yes |
| PATCH | `/api/me/ad-consent` | Update ad consent | Yes |

### Downloads & Licensing Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/me/downloads` | List user's licensed products | Yes |
| GET | `/api/me/downloads/[slug]` | Product download details | Yes |
| GET | `/api/digital-products/[slug]/download` | Generate download token | Yes |
| GET | `/api/digital-products/[slug]/file` | Download file (token-validated) | No (token) |

### Request Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/requests` | Submit project request | Optional |
| GET | `/api/me/requests` | List user's requests | Yes |
| GET | `/api/me/requests/[id]` | Request details | Yes |

### Admin User Management Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/users` | List all users (with search) | Yes (ADMIN+) |
| POST | `/api/admin/users` | Create new user | Yes (ADMIN+) |
| GET | `/api/admin/users/[id]` | Get user details | Yes (ADMIN+) |
| PATCH | `/api/admin/users/[id]` | Update user (role, status) | Yes (ADMIN+) |
| DELETE | `/api/admin/users/[id]` | Delete user | Yes (ADMIN+) |

### Admin Request Management Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/requests` | List requests (with filters) | Yes (ADMIN+) |
| GET | `/api/admin/requests/[id]` | Request details | Yes (ADMIN+) |
| PATCH | `/api/admin/requests/[id]` | Update request (status, notes) | Yes (ADMIN+) |

### Admin License Management Routes ✨ NEW

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/licenses` | List all licenses with filtering | Yes (ADMIN+) |
| GET | `/api/admin/licenses/[id]` | Get detailed license information | Yes (ADMIN+) |
| PATCH | `/api/admin/licenses/[id]` | Suspend/reactivate/clear abuse flag | Yes (ADMIN+) |
| POST | `/api/admin/licenses/[id]/seats` | Assign a seat to a user (team licenses) | Yes (ADMIN+) |
| DELETE | `/api/admin/licenses/[id]/seats/[seatId]` | Revoke a seat assignment | Yes (ADMIN+) |

### Admin Audit & Security Routes ✨ NEW

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/audit-logs` | List audit logs with filtering | Yes (ADMIN+) |

### Download Reset Request Routes ✨ NEW

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/download-reset-requests` | Create download reset request | Yes (USER+) |
| GET | `/api/download-reset-requests` | List requests (admin: all, user: own) | Yes |
| PATCH | `/api/admin/download-reset-requests/[id]` | Approve/reject reset request | Yes (ADMIN+) |

### Admin Membership & Credit Routes ✨ NEW

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/admin/memberships/[id]/credits` | Adjust credits (add/top-up/refund) | Yes (ADMIN+) |
| GET | `/api/admin/memberships/[id]/credits` | Get credit transaction history | Yes (ADMIN+) |

### Admin Content Management Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/content` | List static content | Yes (ADMIN+) |
| POST | `/api/admin/content` | Create content | Yes (ADMIN+) |
| GET | `/api/admin/content/[slug]` | Get content | Yes (ADMIN+) |
| PATCH | `/api/admin/content/[slug]` | Update content | Yes (ADMIN+) |
| DELETE | `/api/admin/content/[slug]` | Delete content | Yes (ADMIN+) |

### Pages Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/pages` | List all pages (public if published) | Optional |
| POST | `/api/pages` | Create page | Yes (ADMIN+) |
| GET | `/api/pages/[slug]` | Get page details | Optional |
| PATCH | `/api/pages/[slug]` | Update page | Yes (ADMIN+) |
| DELETE | `/api/pages/[slug]` | Delete page | Yes (ADMIN+) |
| GET | `/api/pages/[slug]/sections` | Get page sections | Optional |
| POST | `/api/pages/[slug]/sections` | Add section to page | Yes (ADMIN+) |

### Project Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/projects` | List projects (with filtering) | No |
| POST | `/api/projects` | Create project | Yes (ADMIN+) |
| GET | `/api/projects/[slug]` | Project details | No |
| PATCH | `/api/projects/[slug]` | Update project | Yes (ADMIN+) |
| DELETE | `/api/projects/[slug]` | Delete project | Yes (ADMIN+) |

### Portfolio Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/portfolio` | Unified portfolio (projects + products) | No |

### Content Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/content/about` | About page content | No |
| GET | `/api/content/services` | Services page content | No |
| GET | `/api/content/request-form` | Request form content | No |
| GET | `/api/content/[slug]` | Generic content by slug | No |

### System Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/site/status` | Get site settings/status | No |
| GET | `/api/admin/site-settings` | Get site settings | Yes (ADMIN+) |
| PATCH | `/api/admin/site-settings` | Update site settings | Yes (ADMIN+) |
| POST | `/api/admin/settings/email` | Test email configuration | Yes (ADMIN+) |
| POST | `/api/send-notification` | Send notification (email + WhatsApp) | Yes (ADMIN+) |
| POST | `/api/upload` | File upload (avatars, 5MB max) | Yes |

---

## Frontend Features

### Public Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, features, CTA |
| `/projects` | Portfolio grid with category filtering |
| `/services` | Service offerings page |
| `/about` | About the developer |
| `/about-developer` | Extended developer bio |
| `/request` | Project request form |
| `/legal/terms` | Terms of service |
| `/legal/privacy-policy` | Privacy policy |
| `/login` | Login page (credentials, OAuth, email) |
| `/signup` | User registration |

### Admin Pages

| Route | Description | Role Required |
|-------|-------------|---------------|
| `/admin` | Admin dashboard | ADMIN+ |
| `/admin/users` | User management | ADMIN+ |
| `/admin/users/new` | Create user | ADMIN+ |
| `/admin/users/[id]/edit` | Edit user | ADMIN+ |
| `/admin/projects` | Project management | ADMIN+ |
| `/admin/projects/new` | Create project | ADMIN+ |
| `/admin/projects/[slug]/edit` | Edit project | ADMIN+ |
| `/admin/requests` | Request management | ADMIN+ |
| `/admin/pages` | Page management | ADMIN+ |
| `/admin/pages/[slug]` | Edit page | ADMIN+ |
| `/admin/settings` | Site settings | ADMIN+ |
| `/admin/setup-2fa` | 2FA setup (forced) | ADMIN+ |
| `/admin/security` | Security dashboard | ADMIN+ |
| `/admin/analytics` | Analytics dashboard | ADMIN+ |
| `/admin/tags` | Tag management | ADMIN+ |
| `/admin/legal` | Legal content management | ADMIN+ |
| `/admin/ads` | Ad management | ADMIN+ |

### User Dashboard Pages

| Route | Description | Role Required |
|-------|-------------|---------------|
| `/dashboard` | User dashboard | USER+ |
| `/dashboard/downloads` | Licensed products | USER+ |
| `/dashboard/downloads/[slug]` | Download details | USER+ |
| `/dashboard/requests` | User's requests | USER+ |
| `/dashboard/requests/[id]` | Request details | USER+ |
| `/dashboard/settings` | Profile settings | USER+ |

### Navigation Components

**Header** (`components/Header.tsx`):
- Logo
- Navigation links (adaptive based on auth status)
- Theme selector
- User menu (avatar, dropdown with Dashboard, Settings, Logout)
- Mobile menu toggle

**Footer**:
- Links
- Social media icons
- Copyright

### UI Components

**Base Components**:
- `Button` - Primary, secondary, outline variants
- `Input` - Text, email, password, number inputs
- `StyledSelect` - Select dropdown with styling
- `Modal` - Confirmation and general modals
- `Spinner` - Loading indicator
- `Toast` - Toast notifications
- `UserAvatar` - User avatar with fallback to initials
- `Badge` - Status badges
- `Card` - Card wrapper

**Section Components**:
- `Hero` - Hero section renderer
- `RichText` - Markdown content renderer
- `Cards` - Card grid renderer
- `CTA` - Call-to-action renderer
- `FAQ` - FAQ accordion renderer
- `ContactBlock` - Contact form renderer
- `ProjectGrid` - Dynamic project grid renderer

**Feature Components**:
- `ProjectCard` - Individual project display
- `PortfolioCard` - Portfolio item (project/product) display
- `PageRenderer` - Dynamic page section renderer
- `AdSlot` - Advertisement placement
- `CookieNotice` - Privacy/cookie consent banner
- `ConfirmModal` - Confirmation dialog
- `ThemeSelector` - Theme toggle

### Theming System

**DaisyUI + Preferences System**:
- **13 themes configured**: forest, dracula, synthwave, night, cyberpunk, black (built-in) + moss, pearl, aurora, skyline, prism, white (custom)
- **Dual-layer system**: Theme pairs (obsidian→dracula/pearl, synthwave→synthwave/aurora, etc.)
- **Appearance modes**: light, dark, system
- **Dynamic switching**: `data-theme` attribute on `document.documentElement`
- **LocalStorage persistence**: User preferences saved
- **System preference detection**: Automatic light/dark based on OS

**Theme Implementation**:
- `PreferencesProvider` wraps entire app (via `app/Providers.tsx`)
- `PreferencesGate` manages theme attribute updates
- `usePreferences()` hook for theme access
- DaisyUI semantic tokens: `bg-base-100`, `text-base-content`, `bg-primary`, etc.
- Custom semantic utilities: `bg-app`, `surface-app`, `text-app`, `accent`

**Known Issue (2025-12-29)**:
- ⚠️ **HomeCanvas.tsx uses inverted DaisyUI token semantics**
- Uses `bg-base-content` (text color) as backgrounds instead of `bg-base-100`/`bg-base-200`
- Uses `text-base-100` (background color) as text instead of `text-base-content`
- Causes minimal visual change when switching themes (all light themes look similar, all dark themes look similar)
- **Fix required**: Replace 13 instances of inverted token usage in `components/home/HomeCanvas.tsx`
- See: `docs/audits/theme-switching-audit-verified.md` for detailed fix plan

### Analytics Integration

**Vercel Analytics**:
- Real-time traffic tracking
- Page view analytics
- User flow tracking

**Custom Analytics** (`useAnalytics` hook):
- Page view tracking
- Event tracking (downloads, form submissions)
- User engagement metrics

---

## File Upload & Downloads

### Avatar Upload System

**Endpoint**: `POST /api/upload`

**Configuration**:
- **Allowed types**: PNG, JPEG, JPG, WebP, GIF
- **Max size**: 5MB
- **Storage**: Local filesystem (`public/uploads/`)
- **Filename**: Auto-generated as `avatar-{timestamp}.{ext}`
- **URL format**: `/uploads/{filename}`

**Process**:
1. Client uploads file via FormData
2. Server validates file type and size
3. File saved to `public/uploads/` with unique name
4. URL returned to client
5. Client updates profile with avatar URL
6. NextAuth session refreshed to show new avatar

### Digital Product File Management

**Security Validation**:
- HTTPS URLs only
- No private IP addresses (10.x.x.x, 192.168.x.x, etc.)
- Host allowlisting (environment-based)
- URL format validation

**Download Process**:

1. **Token Generation** (`GET /api/digital-products/[slug]/download`):
   - Validate user has active license
   - Check download limit (3/14-day window)
   - Generate download token (HMAC-SHA256)
   - Token expires in 5 minutes
   - Return download URL with token

2. **File Download** (`GET /api/digital-products/[slug]/file?token=...`):
   - Validate token signature
   - Check token expiry
   - Log download event
   - Fetch file from fileUrl
   - Stream file to user

**Download Tracking**:
- Each download logged in `Download` model
- IP address hashed (HMAC-SHA256) for privacy
- Device fingerprint captured
- User agent logged
- Download count incremented on license

**Download Limits**:
- **Limit**: 3 downloads per 14-day rolling window
- **Enforcement**: Server-side validation before token generation
- **Reset**: Automatic after 14 days from first download
- **Override**: Admin can reset via DownloadResetRequest

---

## Security Features

### Authentication Security

**Password Security**:
- bcryptjs hashing with salt
- Minimum password requirements
- Secure password comparison

**JWT Security**:
- Environment-based secret
- Token signing and verification
- Configurable expiry
- HTTP-only cookies

**OAuth Security**:
- Provider account verification
- Email validation
- Account linking prevention (same email across providers)

**Session Security**:
- CSRF-safe cookies
- SameSite cookie policies
- Secure flag in production
- Session expiry enforcement

### Two-Factor Authentication

**TOTP Implementation**:
- otplib for TOTP generation
- 30-second time window
- 6-digit codes
- Backup codes (10 per user)

**QR Code Generation**:
- qrcode library for QR generation
- otpauth:// URL format
- Issuer: "Kashi Kweyu Portfolio"
- Account name: User's email

**Backup Codes**:
- 10 codes generated at setup
- Each code 10 characters
- Stored hashed in database
- Single-use codes
- Downloadable for safe storage

### Authorization & Access Control

**Role-Based Access Control (RBAC)**:
- 6 user roles with hierarchical permissions
- Middleware enforcement on protected routes
- API-level authorization checks
- Resource ownership validation

**Route Protection** (Middleware):
- `/admin/*` requires ADMIN/OWNER/MODERATOR/EDITOR role
- `/dashboard/*` requires authentication
- Unauthorized users redirected to login
- Callback URL preservation

**2FA Enforcement**:
- Mandatory for all ADMIN/OWNER users
- Middleware redirects to `/admin/setup-2fa` if not verified
- Setup page forces 2FA activation
- Only OWNER can disable 2FA

### Data Protection

**IP Address Privacy**:
- IP addresses hashed with HMAC-SHA256
- Never stored in plain text
- Site-specific secret for hashing
- Used for audit logs and download tracking

**Device Fingerprinting**:
- Optional device identification
- Stored hashed in DeviceSession
- Used for security alerts
- Can be blocked if suspicious

**User Agent Tracking**:
- Logged for audit trails
- Helps identify suspicious activity
- Browser/OS detection

### Download Security

**License Validation**:
- Verify active license before download
- Check license status (ACTIVE, EXPIRED, REVOKED, SUSPENDED)
- Validate license type matches product
- Check expiry date

**Download Limits**:
- 3 downloads per 14-day rolling window
- Server-side enforcement
- Cannot be bypassed client-side
- Admin can reset limits

**Token-Based Downloads**:
- HMAC-SHA256 signed tokens
- 5-minute TTL
- Single-use tokens
- Cannot be reused or forged

**Abuse Detection**:
- Flag licenses with detected abuse
- Automatic license suspension on abuse
- Audit log entry for abuse detection
- Admin notification

### Account Security

**Account Status Control**:
- ACTIVE, LOCKED, BANNED, SUSPENDED states
- Admin-controlled locking
- Lockout reason tracking
- Lock/unlock audit logging

**Account Lockout**:
- Manual lockout by admins
- Reason field for documentation
- Prevents login until unlocked
- Audit log entry

**Device Management**:
- Track known devices
- Block suspicious devices
- Device fingerprint matching
- Session management per device

### Input Validation & Sanitization

**Form Validation**:
- Required field checks
- Email format validation
- URL format validation
- File type validation
- File size limits

**Type Safety**:
- TypeScript for compile-time type checking
- Prisma for database type safety
- API request/response validation

**Database Constraints**:
- Unique indexes on email
- Foreign key constraints
- NOT NULL constraints
- Check constraints

---

## Analytics & Monitoring

### Visit Tracking

**Automatic Tracking**:
- Page views captured on all pages
- Anonymous visitor ID or authenticated user ID
- Referrer information
- UTM parameters (source, medium, campaign, content, term)

**Device & Browser Info**:
- Browser detection
- Operating system detection
- Device type (mobile, tablet, desktop)
- Screen resolution

**Location Tracking**:
- Country detection (IP-based)
- City detection (IP-based)
- Timezone detection

**Engagement Metrics**:
- Time on page (calculated from entry/exit)
- Session duration
- Bounce rate
- Pages per session

**Custom Metadata**:
- JSON field for additional tracking data
- Extensible for future needs

### Page Analytics

**View Tracking**:
- Auto-incremented on project/page views
- Unique visitor tracking
- Return visitor identification

**Engagement Metrics**:
- Like count (manual likes on projects)
- Download count (product downloads)
- Request count (project requests)

### Admin Analytics Dashboard

**Traffic Overview**:
- Total views
- Unique visitors
- Engagement rate (time on site / total time)
- Time range filters (24h, 7d, 30d, all-time)

**Device Breakdown**:
- Mobile vs Desktop vs Tablet distribution
- Browser statistics (Chrome, Firefox, Safari, etc.)
- OS statistics (Windows, macOS, Linux, iOS, Android)
- Pie charts and bar graphs

**Top Content**:
- Most visited pages with view counts
- Popular projects (most viewed)
- Top referrers (traffic sources)
- Top UTM campaigns

**Recent Activity**:
- Event timeline (latest 20 events)
- User actions (login, download, request, etc.)
- Admin actions (user creation, content updates, etc.)
- Timestamp and user information

### Audit Logging

**16 Action Types Tracked**:
1. LOGIN - User login events
2. LOGOUT - User logout events
3. LICENSE_ISSUED - New license issued
4. LICENSE_REVOKED - License revoked
5. DOWNLOAD_ATTEMPTED - Download attempt
6. DOWNLOAD_SUCCEEDED - Successful download
7. DOWNLOAD_FAILED - Failed download
8. ABUSE_DETECTED - License abuse detected
9. ACCOUNT_LOCKED - Account locked by admin
10. ACCOUNT_UNLOCKED - Account unlocked
11. CREDIT_USED - Credit transaction
12. MEMBERSHIP_CREATED - New membership
13. MEMBERSHIP_RENEWED - Membership renewal
14. PROJECT_CREATED - New project created
15. PROJECT_PHASE_CHANGED - Service project phase change
16. ADD_ON_REQUESTED - Service add-on request
17. SETTINGS_CHANGED - System settings modified

**Log Details**:
- User ID (who performed action)
- Action type
- Resource type (what was affected)
- Resource ID (specific item ID)
- IP hash (where from)
- User agent (browser/device)
- Additional details (JSON for context)
- Timestamp

### Feature Flags

**Environment-Specific Toggles**:
- DEVELOPMENT, STAGING, PRODUCTION environments
- Runtime feature enable/disable
- Database-driven flags
- No code deployment needed

**Use Cases**:
- Gradual feature rollout
- A/B testing
- Emergency feature disable
- Environment-specific features

---

## Notifications System

### Email Notifications (Resend)

**Configuration**:
- API key: `RESEND_API_KEY` environment variable
- From address: `onboarding@resend.dev` (or custom domain)
- Recipient: `NOTIFICATION_EMAIL` environment variable

**Email Types**:

1. **Test Email** (`POST /api/admin/settings/email`):
   - Verify email configuration
   - Sent to admin notification email
   - Subject: "Test Email - Configuration Check"
   - Body: Simple test message

2. **Request Notification**:
   - Triggered on new project request
   - Subject: "New Project Request from {name}"
   - Body: Formatted with requester info, project details, budget, timeline
   - Includes link to admin panel request

3. **Request Accepted**:
   - Sent when admin accepts request
   - Subject: "Your Project Request Has Been Accepted"
   - Body: Confirmation message with next steps

4. **Request Rejected**:
   - Sent when admin rejects request
   - Subject: "Update on Your Project Request"
   - Body: Rejection message with reason (if provided)

**Email Features**:
- HTML templates with inline CSS
- Responsive design
- Plain text fallback
- Error handling and retry logic

### WhatsApp Notifications

**Configuration**:
- Phone number: `WHATSAPP_NUMBER` environment variable
- Format: Country code + number (e.g., `256700000000` for Uganda)
- Uses WhatsApp Web API (wa.me links)

**Message Types**:

1. **New Service Request**:
   - Triggered on project request submission
   - Message format:
     ```
     🚀 New Service Request

     Name: {name}
     Email: {email}
     Type: {projectType}
     Budget: {budget}
     Timeline: {timeline}

     Description:
     {description}
     ```
   - Sent via wa.me link (opens WhatsApp with pre-filled message)

**WhatsApp Features**:
- URL-encoded messages
- Emoji support
- Formatted text
- Direct message link generation

### Notification Endpoint

**POST `/api/send-notification`**:
- Sends both email and WhatsApp notifications
- Used for service requests
- Admin-only endpoint
- Returns success/failure status for each channel

---

## Extended Features

### Membership System

**3 Membership Tiers**:

| Tier | Price | Credits | Duration | Rollover Cap |
|------|-------|---------|----------|--------------|
| **BASIC_ACCESS** | $299 | 750 total | 12 months | 0 (none) |
| **PRO** | $1,499 | 1,500 total | 12 months | 250 credits |
| **MANAGED** | $499/month | 500/month | Monthly recurring | 0 (none) |

**Pricing Note:** Credit pricing not yet defined (see `/docs/pricing/CREDIT_PRICING_PROPOSAL.md`)

**Credit Management**:
- Credits allocated at membership start
- Credits rollover to next period (with cap)
- Unused credits carry forward
- Top-up credits available for purchase
- Weekly usage limits (configurable)

**Membership Lifecycle**:
1. **Creation**: User signs up or admin creates
2. **Active**: Normal membership state
3. **Renewal**: Auto-renew on renewal date (if enabled)
4. **Expiry**: Membership expires if not renewed
5. **Cancellation**: User/admin cancels
6. **Pause**: Temporary pause (extends end date)

**Membership Fields**:
- Tier (BASIC_ACCESS, PRO, MANAGED)
- Status (ACTIVE, EXPIRED, CANCELLED, PAUSED)
- Credits: allocated, used, rolled over
- Rollover cap (max credits to carry forward)
- Dates: start, end, renewal
- Auto-renew flag

### Credit System

**Transaction Types**:

1. **INITIAL_ALLOCATION**: Credits allocated at membership start
2. **RENEWAL**: Credits added on renewal
3. **TOP_UP**: Additional credits purchased
4. **USAGE**: Credits used for services
5. **REFUND**: Credits refunded
6. **ROLLOVER**: Unused credits carried forward
7. **ADJUSTMENT**: Manual admin adjustment

**Credit Tracking**:
- Each transaction logged with amount
- Balance calculated after each transaction
- Description for context
- Metadata (JSON) for additional info
- Timestamp for audit trail

**Credit Usage**:
- Service add-ons deduct credits
- Weekly limits enforced (if configured)
- Balance checked before deduction
- Insufficient credits prevent service use

### Service Project Management

**Project Phases**:

1. **DESIGN**: Initial design and planning
2. **BUILD**: Development phase
3. **POST_LAUNCH**: Post-launch support
4. **COMPLETED**: Project finished
5. **PAUSED**: Temporarily paused

**Phase Tracking**:
- `ProjectPhaseHistory` logs phase changes
- Entry time, exit time, notes
- Full phase timeline available

**Revision Management**:
- Revisions allowed per phase (configurable)
- Revisions used tracked
- Exceeding limit requires add-on purchase

**Service Add-Ons**:
- Extra services (e.g., "Extra Revision", "Premium Support")
- Credit cost per add-on
- Status tracking (PENDING, APPROVED, IN_PROGRESS, COMPLETED)
- Add-on request logged in audit

**Project Fields**:
- Name, description, scope
- Approved features list
- Current phase
- Timeline (start date, deadline, estimated duration)
- Revisions (allowed per phase, used)
- Status (ACTIVE, PAUSED, COMPLETED, CANCELLED)
- Relations: userId, membershipId

### Digital Products Management

**Product Types**:
- Templates, Plugins, Themes
- E-books, Courses
- Scripts, Components, Assets
- Tools

**Pricing**:
- USD pricing with decimal precision (e.g., $29.99)
- One-time purchase (no subscriptions yet)

**File Management**:
- File URL (HTTPS only)
- File size tracking
- MIME type validation
- Secure download with tokens

**License Types**:

| License | Description | Max Users |
|---------|-------------|-----------|
| **PERSONAL** | Personal use only | 1 |
| **COMMERCIAL** | Commercial projects | 5 |
| **TEAM** | Team/organization use | Unlimited |

**Documentation**:
- Full documentation field (Markdown)
- Changelog for version updates
- Version tracking

**Media**:
- Multiple images for gallery
- Preview images for showcase
- Thumbnail for listings

**Publishing**:
- Draft/Published status
- Featured products
- Publish date tracking

**Metrics**:
- Download count (total downloads)
- Purchase count (total licenses sold)
- View count (product page views)

### Licensing System

**License Fields**:
- User ID (license owner)
- Digital product ID
- License key (unique identifier)
- License type (PERSONAL, COMMERCIAL, TEAM)
- Max users (based on type)
- Expiry date (if time-limited)
- Download count / max downloads
- Status (ACTIVE, EXPIRED, REVOKED, SUSPENDED)
- Abuse detected flag

**License Issuance**:
1. User purchases product
2. License created with unique key
3. License type assigned
4. Max downloads set (default: unlimited, but 3/14-day window)
5. Expiry date calculated (if applicable)
6. Audit log entry created

**License Validation**:
- Check status (must be ACTIVE)
- Check expiry (must not be expired)
- Check abuse flag (must be false)
- Check download limits

**License Revocation**:
- Admin can revoke licenses
- Status changed to REVOKED
- User loses download access
- Audit log entry created

**Abuse Detection**:
- Automatic abuse detection (e.g., unusual download patterns)
- Manual abuse flagging by admin
- Automatic license suspension on abuse
- Admin notification

---

## Advanced License Management System ✨ NEW

### Overview

The Advanced License Management System provides enterprise-grade control over digital product licensing with team seat management, automated abuse detection, and comprehensive audit trails.

### Core Features

#### 1. License Enforcement Service (`lib/license.ts`)

**Seat Management Functions**:
- `canAssignSeat(licenseId)` - Validates seat availability (enforces 2-5 seat limit for team licenses)
- `assignLicenseSeat()` - Assigns seats with audit logging and email notifications
- `revokeLicenseSeat()` - Revokes seat assignments with full audit trail
- `validateLicenseAccess()` - Checks user access rights (owner or seat holder)

**Abuse Detection & Management**:
- `detectDownloadAbuse(licenseId)` - Detects excessive downloads and device violations
  - **Thresholds**: 10 downloads in 24 hours, 3 unique devices per personal license
  - Analyzes unique IPs, device fingerprints, and download patterns
  - Returns abuse status with detailed metrics
- `flagLicenseAbuse()` - Flags licenses with automatic suspension
- `clearLicenseAbuseFlag()` - Admin override to clear abuse flags
- `suspendLicense()` / `reactivateLicense()` - Manual license control

**Utility Functions**:
- `generateLicenseKey(prefix)` - Generates unique license keys (e.g., "LIC-XXXX-XXXX-XXXX-XXXX")
- `logLicenseAudit()` - Comprehensive audit logging for all license actions

#### 2. Team License Seat Management

**Seat Assignment**:
- Supports 2-5 seats per team license (configurable via `TEAM_LICENSE_MAX_SEATS`)
- Validates seat availability before assignment
- Prevents duplicate assignments (unique constraint on email per license)
- Tracks assigned user ID and email
- Records who assigned the seat and when
- Email notifications sent on seat assignment

**Seat Revocation**:
- Admins or license owners can revoke seats
- Maintains seat history (revoked seats are deactivated, not deleted)
- Updates license current user count automatically
- Email notifications sent on seat revocation
- Full audit trail of who revoked and when

**Seat Validation**:
- Validates user access based on:
  - License ownership (userId matches license owner)
  - Active seat assignment (for team licenses)
- Returns detailed access information (hasAccess, isOwner, hasSeat)

#### 3. Automated Abuse Detection

**Detection Triggers**:
Integrated into download flow (`app/api/digital-products/[slug]/download/route.ts`):
- Runs before every download attempt
- Checks recent download history within configurable window (24 hours default)
- Analyzes multiple abuse indicators

**Abuse Indicators**:
1. **Download Count**: Exceeds threshold (10 downloads in 24 hours)
2. **Device Count**: Too many unique devices (3 for personal licenses)
3. **Download Pattern**: Unusual activity patterns
4. **IP Diversity**: Multiple IPs in short timespan

**Auto-Response Actions**:
When abuse is detected:
1. License immediately flagged with abuse details
2. License status changed to SUSPENDED
3. Audit log entry created (`DOWNLOAD_ABUSE_DETECTED`)
4. Email notification sent to license holder
5. Download request blocked with error message
6. Admin dashboard updated with abuse flag

**Abuse Details Captured**:
- Abuse reason (human-readable description)
- Download count within window
- Unique device count
- Unique IP count
- Abuse detection timestamp
- Flagged by (system or admin)

#### 4. Credit Enforcement Service (`lib/credits.ts`)

**Credit Management Functions**:
- `hasAvailableCredits()` - Check credit availability and membership status
- `deductCredits()` - Spend credits with transaction logging
- `addCredits()` - Admin credit additions (top-up, adjustment)
- `refundCredits()` - Credit refunds with audit trail
- `getCreditHistory()` - Transaction history retrieval
- `calculateRolloverCredits()` - Automatic rollover calculation

**Transaction Types**:
- **INITIAL_ALLOCATION**: Credits allocated at membership start
- **RENEWAL**: Credits added on renewal
- **TOP_UP**: Additional credits purchased
- **USAGE**: Credits spent on services
- **REFUND**: Credits refunded
- **ROLLOVER**: Unused credits carried forward
- **ADJUSTMENT**: Manual admin adjustment

**Credit Operations**:
All credit operations include:
- Atomic database transactions (prevents race conditions)
- Balance calculation (remainingCredits updated)
- Transaction logging with full context
- Audit log entries for accountability
- Admin tracking (who performed the action)

#### 5. Email Notification Templates (`lib/email.ts`)

**License-Related Email Templates**:

1. **License Issued** (`license-issued`):
   - Welcome message with license key
   - Product name and license type
   - Team license info (seat count for TEAM licenses)
   - Download instructions

2. **License Revoked** (`license-revoked`):
   - Revocation notification
   - Reason for revocation (if provided)
   - Contact support instructions

3. **License Suspended** (`license-suspended`):
   - Suspension notification
   - Suspension reason
   - Resolution instructions
   - Contact support details

4. **License Abuse Detected** (`license-abuse-detected`):
   - Alert notification with abuse details
   - Specific abuse reason
   - License suspension notice
   - Appeal/contact instructions

5. **License Seat Assigned** (`license-seat-assigned`):
   - Seat assignment notification
   - Product name and license key
   - Download access instructions

6. **License Seat Revoked** (`license-seat-revoked`):
   - Seat revocation notification
   - Access removal notice

7. **Download Reset Approved** (`download-reset-approved`):
   - Reset confirmation
   - Product name
   - Admin notes (if provided)

8. **Download Reset Rejected** (`download-reset-rejected`):
   - Rejection notification
   - Rejection reason
   - Contact support instructions

All templates include:
- Professional HTML design with inline CSS
- Responsive layout
- Brand colors and styling
- Clear call-to-action buttons
- Support contact information
- Claude Code attribution footer

#### 6. Admin License Dashboard UI

**Dashboard Features** (`/admin/licenses`):

**Statistics Overview**:
- Total Licenses: Count of all licenses
- Active: Currently active licenses
- Suspended: Temporarily suspended
- Revoked: Permanently revoked
- Abuse Flagged: Licenses with abuse flags

**Advanced Filtering**:
- Search: License key, user email, or product name (real-time search)
- Status Filter: ALL, ACTIVE, SUSPENDED, REVOKED
- Type Filter: ALL, PERSONAL, COMMERCIAL, TEAM
- Abuse Filter: Show only abuse-flagged licenses

**License Table Columns**:
- License Key (with abuse warning icon)
- Product Name
- Owner (name and email)
- License Type (color-coded badge)
- Status (color-coded badge)
- Seats (X/Y for team licenses, N/A for others)
- Downloads (total count)
- Actions (View, Suspend/Reactivate, Clear Abuse)

**License Details Page** (`/admin/licenses/[id]`):

1. **License Info Card**:
   - License key (monospace font for easy copying)
   - Product name and category
   - License type and status (color-coded)
   - Issued date
   - Expiry date (if applicable)
   - Revoked reason (if revoked)

2. **Owner Info Card**:
   - User avatar (or initials)
   - Name and email
   - User role badge
   - User ID (for reference)

3. **Abuse Warning Banner** (if flagged):
   - Prominent warning with abuse icon
   - Abuse reason (detailed description)
   - Flagged date and admin who flagged

4. **Team Seat Management Section** (TEAM licenses only):
   - Seat usage indicator (e.g., "3/5 seats occupied")
   - Assign Seat button (if seats available and license active)
   - Seat list with:
     - Email address
     - Assignment date
     - Active/Revoked status (color-coded)
     - Revoke button (for active seats)
   - Empty state message if no seats assigned

5. **Download History Section**:
   - Table of recent downloads (last 20)
   - Columns: Date/Time, Status, IP Hash, Device Fingerprint
   - Success/Failed indicators
   - Empty state message if no downloads

**Interactive Modals**:
- Suspend License Modal: Requires reason input
- Assign Seat Modal: User ID and email input fields
- Revoke Seat Modal: Confirmation with user email display
- All modals with cancel/confirm buttons

#### 7. Audit Log Viewer

**Features** (`/admin/audit-logs`):

**Filtering Options**:
- Search by user ID (matches userId in logs)
- Filter by action type (dropdown with all 26+ action types)
- Filter by resource type (License, Download, User, Credit, Settings, etc.)
- Pagination (50 logs per page)

**Log Display**:
- Timestamp (formatted as locale string)
- User (name and email, or "System" for automated actions)
- Action (color-coded badge based on severity)
- Resource type
- Resource ID (truncated with "...")
- Details (View/Hide button for expandable JSON)

**Color Coding**:
- 🔴 Red: Abuse, failed, rejected actions (critical)
- 🟡 Yellow: Suspended, locked actions (warning)
- 🟢 Green: Success, approved, reactivated actions (positive)
- 🔵 Blue: Regular actions (informational)

**Expandable Details**:
- Full JSON details of the action
- IP hash (for security tracking)
- User agent (browser/device info)
- Additional context (varies by action type)

**New Audit Actions**:
- `LICENSE_SEAT_ASSIGNED`
- `LICENSE_SEAT_REVOKED`
- `LICENSE_ABUSE_FLAGGED`
- `LICENSE_ABUSE_CLEARED`
- `LICENSE_SUSPENDED`
- `LICENSE_REACTIVATED`
- `DOWNLOAD_ABUSE_DETECTED`
- `DOWNLOAD_RESET_REQUESTED`
- `DOWNLOAD_RESET_APPROVED`
- `DOWNLOAD_RESET_REJECTED`
- `CREDIT_ADJUSTED`

### Technical Implementation

**Database Schema Updates**:

```prisma
model LicenseSeatAssignment {
  id                String   @id @default(cuid())
  licenseId         String
  license           License  @relation(fields: [licenseId], references: [id], onDelete: Cascade)
  assignedUserId    String
  assignedUserEmail String
  assignedBy        String
  assignedAt        DateTime @default(now())
  revokedAt         DateTime?
  revokedBy         String?
  active            Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@unique([licenseId, assignedUserEmail])
  @@index([licenseId])
  @@index([assignedUserId])
  @@index([active])
  @@map("license_seat_assignments")
}

model License {
  // ... existing fields ...
  abuseFlagged      Boolean   @default(false)
  abuseFlaggedAt    DateTime?
  abuseFlaggedBy    String?
  abuseReason       String?   @db.Text
  currentUsers      Int       @default(0)
  seatAssignments   LicenseSeatAssignment[]
}
```

**API Route Structure**:
```
/api/admin/licenses
  GET - List licenses (with filters)
  /[id]
    GET - License details
    PATCH - Update license (suspend/reactivate/clear abuse)
    /seats
      POST - Assign seat
      /[seatId]
        DELETE - Revoke seat

/api/admin/audit-logs
  GET - List audit logs (with filters)

/api/download-reset-requests
  GET - List reset requests
  POST - Create reset request
  /[id]
    PATCH - Approve/reject (admin only)

/api/admin/memberships/[id]/credits
  GET - Credit history
  POST - Adjust credits (add/top-up/refund)
```

**Security Features**:
1. **IP Hashing**: All IP addresses hashed with HMAC-SHA256
2. **Device Fingerprinting**: Optional client-side fingerprint tracking
3. **Audit Trail**: Every action logged with full context
4. **Role-Based Access**: ADMIN/OWNER only for license management
5. **Token-Based Downloads**: HMAC-signed tokens with 5-minute TTL
6. **Abuse Rate Limiting**: Configurable thresholds and windows

**Configuration Constants**:
```typescript
// lib/license.ts
export const TEAM_LICENSE_MAX_SEATS = 5
export const TEAM_LICENSE_MIN_SEATS = 2
export const DOWNLOAD_ABUSE_THRESHOLD = 10 // downloads
export const DOWNLOAD_ABUSE_WINDOW_HOURS = 24
export const DOWNLOAD_DEVICE_LIMIT = 3 // unique devices per license
```

### Usage Examples

**Assign a Seat** (Admin):
1. Navigate to `/admin/licenses/[id]`
2. Click "Assign Seat" button
3. Enter user ID and email
4. Confirm assignment
5. User receives email notification
6. Seat appears in seat list as "Active"

**Detect Abuse** (Automatic):
1. User attempts download
2. System checks recent download history
3. If thresholds exceeded:
   - License flagged with abuse reason
   - License suspended automatically
   - Email sent to license holder
   - Audit log entry created
   - Download blocked
4. Admin sees abuse flag in dashboard

**Manage Credits** (Admin):
1. Navigate to membership details
2. Click "Adjust Credits"
3. Choose action (Add/Top-up/Refund)
4. Enter amount and description
5. Confirm adjustment
6. Transaction logged in credit history
7. Audit log entry created

### Benefits

1. **Automated Protection**: Abuse detection runs automatically without admin intervention
2. **Full Transparency**: Every action logged with complete audit trail
3. **Team Collaboration**: Easy seat management for team licenses
4. **Flexibility**: Admins can override automated decisions
5. **User Communication**: Automatic email notifications for all actions
6. **Scalability**: Efficient database queries with proper indexing
7. **Security**: IP hashing, device fingerprinting, and token-based downloads
8. **Compliance**: Full audit trail for regulatory requirements

### Advertisement System

**Ad Configuration** (SiteSettings):
- Ads enabled/disabled globally
- Ad provider (e.g., "Google AdSense", "Custom")
- Ad placement settings (JSON)
- Custom ad settings (JSON)

**User Ad Consent** (UserAdConsent):
- User consent tracking (GDPR compliance)
- Consented flag
- Personalized ads preference
- Consent timestamp

**Ad Placement**:
- `AdSlot` component for ad insertion
- Placement configuration from SiteSettings
- Conditional rendering based on consent
- Fallback content when ads disabled

**Privacy**:
- Cookie consent required
- User can opt-out of personalized ads
- Consent stored in database
- Compliant with GDPR/CCPA

### Backup System

**Backup Types**:
- **SCHEDULED**: Automatic scheduled backups
- **MANUAL**: Admin-triggered backups
- **PRE_DEPLOYMENT**: Before deployment backups

**Backup Content**:
- Database (full database dump)
- Files (uploaded files, avatars, etc.)
- Configuration (environment variables, settings)
- Audit logs (security audit trail)

**Backup Status**:
- PENDING: Queued for backup
- IN_PROGRESS: Backup in progress
- COMPLETED: Backup successful
- FAILED: Backup failed

**Backup Storage**:
- URL to backup file
- File size tracking
- Creation timestamp

**Backup Management**:
- Admin can trigger manual backups
- View backup history
- Download backups
- Restore from backups (manual process)

---

## Middleware & Route Protection

### Middleware Configuration (`middleware.ts`)

**Protected Routes**:

1. **Admin Routes** (`/admin/*`):
   - Requires authentication
   - Requires role: ADMIN, OWNER, MODERATOR, or EDITOR
   - 2FA required for ADMIN/OWNER
   - Redirects to `/admin/setup-2fa` if 2FA not verified

2. **Dashboard Routes** (`/dashboard/*`):
   - Requires authentication (any authenticated user)
   - No specific role requirement

**Redirect Logic**:
- Unauthenticated users → `/login?callbackUrl={intended-route}`
- Insufficient role → `/` (homepage)
- 2FA not verified (admin) → `/admin/setup-2fa`

**Callback URL Preservation**:
- Original destination stored in `callbackUrl` query param
- After login, user redirected to intended page
- Prevents loss of navigation context

### Authorization Checks

**Role Hierarchy Validation**:
- OWNER > ADMIN > MODERATOR > EDITOR > VIEWER > USER
- Higher roles can manage lower roles
- Role-based action permissions

**Session Validation**:
- Check for active session
- Verify session not expired
- Validate JWT token signature

**2FA Status Enforcement**:
- Check `twoFactorEnabled` flag
- Require TOTP verification for admins
- Force setup if not enabled

**Account Status Validation**:
- Check account status (ACTIVE, LOCKED, BANNED, SUSPENDED)
- Prevent locked/banned accounts from actions
- Audit log entry for blocked actions

---

## Configuration Files

### Environment Variables (`.env`)

**Required**:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Application URL (e.g., http://localhost:3000)
- `NEXTAUTH_SECRET` - Secret for JWT signing
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `RESEND_API_KEY` - Resend email API key
- `NOTIFICATION_EMAIL` - Admin notification email
- `WHATSAPP_NUMBER` - WhatsApp notification number

**Optional**:
- `GITHUB_ID` - GitHub OAuth client ID
- `GITHUB_SECRET` - GitHub OAuth client secret
- `EMAIL_SERVER` - SMTP server for email provider
- `EMAIL_FROM` - From address for emails
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_VERCEL_URL` - Vercel deployment URL

### Next.js Configuration (`next.config.js`)

- **Experimental features**: serverActions enabled
- **Image optimization**: Next.js Image component
- **Build optimization**: Vercel deployment ready
- **Environment variables**: Auto-loaded from .env

### Tailwind Configuration (`tailwind.config.ts`)

- **Theme system**: Custom CSS variables
- **Dark mode**: Class-based dark mode
- **Responsive breakpoints**: Mobile-first approach
- **Color palette**: Primary, secondary, accent colors
- **Typography**: Custom font sizes and weights

### Prisma Configuration (`prisma/schema.prisma`)

- **Provider**: PostgreSQL
- **Generator**: Prisma Client
- **Models**: 30+ models
- **Relations**: Complex relationships
- **Indexes**: Optimized queries
- **Enums**: 15+ enum types

---

## Deployment Considerations

### Production Readiness

**Security**:
- [x] Environment variables secured
- [x] HTTPS enforcement
- [x] CSRF protection
- [x] Rate limiting (ready for implementation)
- [x] Input validation
- [x] SQL injection prevention (Prisma)
- [x] XSS prevention

**Performance**:
- [x] Next.js optimizations (SSG, SSR, ISR)
- [x] Image optimization
- [x] Code splitting
- [x] Lazy loading
- [x] Database indexing

**Monitoring**:
- [x] Vercel Analytics integrated
- [x] Audit logging implemented
- [ ] Error tracking (ready for Sentry)
- [ ] Performance monitoring (ready for implementation)

**Scalability**:
- [x] Database connection pooling (Prisma)
- [x] API rate limiting (ready)
- [x] CDN for static assets (Vercel)
- [x] Serverless functions (Vercel)

### Deployment Platforms

**Recommended**: Vercel (Next.js optimized)
- Automatic deployments on git push
- Preview deployments for PRs
- Environment variable management
- Serverless functions
- Edge network
- Analytics built-in

**Alternative**: AWS, Google Cloud, Azure
- Requires manual configuration
- Docker containerization recommended
- Postgres database setup
- File storage solution (S3, Cloud Storage, etc.)

### Database

**Recommended**: Supabase (PostgreSQL)
- Managed PostgreSQL
- Automatic backups
- Connection pooling
- Real-time capabilities
- File storage included

**Alternative**: Neon, PlanetScale, AWS RDS
- Self-hosted PostgreSQL
- Managed database services
- Connection string configuration

---

## Summary

This portfolio platform is a **production-ready, enterprise-grade application** with comprehensive features for:

### Core Capabilities
- Professional portfolio showcase
- Digital product marketplace
- Service project management
- Client request handling
- Dynamic content management

### Security & Access Control
- 6-tier role-based access control
- Mandatory 2FA for admins
- Device tracking and blocking
- IP address privacy (hashed)
- Comprehensive audit logging

### Business Features
- Credit-based membership system
- License management (3 types)
- Download limits with token-based security
- Service project phases
- Add-on services

### Admin Tools
- User management
- Content management
- Request tracking
- Analytics dashboard
- Site settings control

### Developer Experience
- TypeScript for type safety
- Prisma for database management
- Tailwind for styling
- Next.js for performance
- Comprehensive API

### Analytics & Monitoring
- Traffic tracking
- User engagement metrics
- Audit trail
- Feature flags
- System backups

The application is **ready for deployment** with enterprise-grade security, scalability, and maintainability.
