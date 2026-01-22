# Portfolio Platform Integration - Implementation Plan

## Project Overview

Transforming the portfolio website into a comprehensive dual-mode platform that offers both digital products and services, with strong security, admin controls, and credit-based service management.

---

## Completed ✅

### 1. Database Schema Design
- ✅ Extended Prisma schema with 15+ new models
- ✅ Added Digital Products system (products, licenses, downloads, reset requests)
- ✅ Added Services system (projects, phases, add-ons)
- ✅ Added Credit & Membership system
- ✅ Added Security & Audit models (audit logs, device sessions)
- ✅ Added System Configuration models (feature flags, backups)
- ✅ Extended User model with security, membership, and age verification fields
- ✅ Added new enums for all platform features
- ✅ Extended Role enum (OWNER, EDITOR, VIEWER)

**File**: `prisma/schema.prisma`
**Documentation**: `docs/schema-extensions.md`

### 2. UI Color Fixes
- ✅ Removed all hardcoded green colors from the codebase
- ✅ Replaced with theme-aware blue colors for success states
- ✅ Updated files:
  - `app/admin/projects/[id]/page.tsx`
  - `app/admin/projects/page.tsx`
  - `app/admin/requests/page.tsx`
  - `components/ui/Toast.tsx`

---

## In Progress 🔄

### 3. Project Documentation
- Creating comprehensive implementation guides
- API endpoint documentation
- Security protocols documentation

---

## Upcoming Priority Tasks 📋

### Phase 1: Core Infrastructure & Security (Week 1-2)

#### A. Authentication & Authorization
1. **Username/Password Authentication**
   - Implement secure credential-based auth for admin
   - Add password hashing (bcrypt)
   - Session management
   - CSRF protection

2. **Role-Based Access Control (RBAC)**
   - Implement permissions system
   - Owner: Full access
   - Admin: Manage content, users, requests
   - Editor: Edit content only
   - Viewer: Read-only access
   - User: Client dashboard only

3. **Security Features**
   - Input validation on all forms (sanitize emails, phone numbers, text)
   - Rate limiting (login attempts, API calls, form submissions)
   - 2FA setup (optional, for admins)
   - Device fingerprinting
   - IP hashing for security logs
   - SQL injection prevention
   - XSS protection

#### B. Notifications System
1. **Email Notifications**
   - Set up email service (Resend/SendGrid)
   - Templates for:
     - New request received
     - Request accepted/rejected
     - Project phase updates
     - Payment confirmations

2. **WhatsApp Notifications**
   - Integrate WhatsApp Business API or Twilio
   - Send alerts for:
     - New project requests
     - Urgent client messages
     - Payment received

---

### Phase 2: Admin Dashboard Enhancements (Week 2-3)

#### A. Admin Dashboard Improvements
1. **User Name Display**
   - Show logged-in admin name on dashboard
   - Add user avatar/profile pic
   - Quick stats summary

2. **Maintenance Mode Toggle**
   - Add toggle to unpublish site for editing
   - Show "Under Maintenance" page to visitors
   - Keep admin panel accessible

3. **Business Availability Toggle**
   - Toggle to show/hide "Available for Work" status
   - Display on homepage and contact pages
   - Update request form accordingly

4. **Charging Meter**
   - Visual meter showing:
     - Total revenue this month
     - Revenue by service type
     - Maintenance fees
     - Upcoming payments
   - Export reports

#### B. /admin/users Page Overhaul
1. **Remove Hardcoded Data**
   - Fetch real users from database
   - Display actual user information

2. **Working Buttons & Features**
   - Edit user permissions
   - Lock/unlock accounts
   - View user activity
   - Assign roles (Owner, Admin, Editor, Viewer, User)

3. **Access Control Management**
   - Grant editing access to specific users
   - Revoke access
   - View access history

4. **Link to Requests**
   - Show which users have submitted requests
   - Quick view of user's project history
   - Client status indicators

#### C. /admin/requests Page Enhancement
1. **Contact Information Display**
   - Show full contact details (email, phone)
   - Click-to-email, click-to-call buttons
   - WhatsApp quick link

2. **Accept/Reject Functionality**
   - Accept button: Send acceptance email, create service project
   - Reject button: Send rejection email with reason
   - Auto-increment contacted/rejected counters

3. **Statistics Tracking**
   - Contacted count (auto-increment when email sent)
   - Rejected count
   - Conversion rate
   - Average response time

---

### Phase 3: User Registration & Client Dashboard (Week 3-4)

#### A. User Registration System
1. **Account Creation**
   - Email/password signup
   - Email verification required
   - Optional phone number (can be changed with email verification)
   - Profile picture upload (small size limit)
   - Guardian email for minors (age 15+)

2. **Profile Management**
   - Edit name, email, phone
   - Upload/change profile picture
   - Update password
   - Enable 2FA

#### B. Client Dashboard
1. **Project Tracking**
   - View current projects
   - See project phase (Design, Build, Post-launch)
   - Revisions remaining counter
   - Timeline and deadlines
   - Milestone progress

2. **Subscription Management**
   - View membership tier
   - Credits remaining (visual bar)
   - Usage history
   - Renewal date
   - Upgrade/downgrade options

3. **Documents & Resources**
   - Access meeting links
   - Download project files
   - View contracts/agreements
   - Submit forms

4. **Communication**
   - Message admin directly
   - View notifications
   - Request add-ons (extra revisions, content edits, etc.)

---

### Phase 4: Digital Products & Services (Week 4-5)

#### A. Digital Products Section
1. **Product Catalog**
   - Browse products by category
   - Filter by tags
   - Search functionality
   - Preview images and demos

2. **Purchase Flow**
   - Select license type (Personal, Commercial, Team)
   - Payment integration (Stripe/PayPal)
   - Instant access after payment
   - License key generation

3. **Download Control**
   - 3 successful downloads within 14 days
   - Track download attempts
   - Device fingerprinting
   - Request reset (admin approval required)

4. **License Management (Admin)**
   - View all licenses
   - Revoke licenses (abuse detected)
   - Extend expiration dates
   - View download statistics

#### B. Services System
1. **Service Request to Project Conversion**
   - Convert accepted requests to service projects
   - Set project phases (Design → Build → Post-launch)
   - Define approved features (scope control)
   - Set revision limits

2. **Phase Management**
   - Track current phase
   - Auto-pause timeline if scope changes
   - Auto-pause if payment late
   - Admin can manually pause/resume

3. **Revision Tracking**
   - Design: 2 revisions max
   - Build: 1 revision max
   - Post-launch: bug fixes only
   - Extra revisions cost credits

4. **Add-Ons System**
   - Clients request add-ons
   - Credit cost calculator
   - Admin approval required
   - Types:
     - Extra revision (250 credits)
     - Content edit batch (150 credits)
     - Support call (300 credits)
     - Rush delivery (500 credits)
     - Emergency fix (400 credits)
     - Reopen stalled project (600 credits)

---

### Phase 5: Credit & Membership System (Week 5-6)

#### A. Membership Tiers
1. **Basic Access**
   - Duration: 6-12 months
   - Credits: 500-1000 total
   - No renewals
   - No rush work
   - Docs-only support

2. **Pro Membership** (Recommended)
   - Duration: 2 years
   - Credits: 1500/year
   - Yearly renewal
   - Limited rollover
   - Discounted add-ons
   - Priority reset requests

3. **Managed Membership**
   - Monthly or annual billing
   - Credits renew monthly
   - Hosting management included
   - Faster response times
   - Can downgrade/pause

#### B. Credit System
1. **Credit Transactions**
   - Track all credit usage
   - Show balance after each transaction
   - Descriptions for transparency
   - Export transaction history

2. **Top-Ups**
   - Available for Pro and Managed tiers
   - Purchase additional credits
   - Expire at membership end date

3. **Rollover Rules**
   - Max rollover cap enforced
   - Unused credits expire
   - Pro: limited rollover
   - Managed: no rollover (monthly renewal)

---

### Phase 6: Pricing & Payment System (Week 6-7)

#### A. Pricing Pages
1. **Service Pricing Display**
   - DIY build: $0-$450
   - Professional design: $1,500+
   - Hosting/apps: $15-$150/month
   - Maintenance: $20-$100/year
   - Dynamic pricing based on:
     - Website type (static/dynamic)
     - Complexity level
     - Timeline
     - Deployment options
     - Domain included
     - Hosting management

2. **Currency Conversion**
   - Display prices in multiple currencies
   - Conversion is display-only
   - Final charge uses payment method currency
   - Consistent rounding (round down)

3. **Seasonal Promos**
   - Admin can create promo codes
   - Time-limited offers
   - Discount percentage or fixed amount
   - No promo stacking by default

4. **Referral System**
   - Auto-track referrals
   - Manual approval by admin
   - Loyalty promos after 6-12 months

#### B. Payment Integration
1. **Stripe Integration**
   - One-time payments
   - Recurring subscriptions
   - Webhook handling
   - Invoice generation

2. **Payment Tracking**
   - Link payments to projects/memberships
   - Auto-update project status on payment
   - Send payment confirmations

---

### Phase 7: UI/UX Improvements (Week 7-8)

#### A. Responsive Design
1. **Mobile Optimization**
   - Optimize for phones (320px - 480px)
   - Tablet (768px - 1024px)
   - Desktop (1024px+)
   - Large screens/TVs (1920px+)

2. **Dynamic Layouts**
   - Fluid typography
   - Flexible grids
   - Touch-friendly buttons
   - Swipe gestures for mobile

#### B. Theme Management CMS
1. **Theme Grouping**
   - Group themes by light/dark
   - Visual theme selector
   - Live preview
   - Custom theme creator (admin only)

2. **Font Management**
   - Upload custom fonts
   - Google Fonts integration
   - Font pairing suggestions
   - Size/weight presets

3. **Easy Theme Switching**
   - Quick toggle in admin
   - Apply to entire site
   - Preview before applying
   - Revert option

#### C. Header Addition
1. **Main Page Header**
   - Logo
   - Navigation menu
   - CTA buttons
   - Mode switcher (Formal/Vibey)
   - User menu (if logged in)

---

### Phase 8: File Upload & Management (Week 8)

#### A. File Upload Limits
1. **Document Uploads**
   - Increase limit to 10MB per file
   - Support: PDF, DOC, DOCX, XLS, XLSX
   - Virus scanning
   - Secure storage (S3/Cloudflare R2)

2. **Profile Pictures**
   - Small size limit (500KB max)
   - Auto-resize/crop
   - Supported formats: JPG, PNG, WebP
   - Compression applied

#### B. File Management
1. **Admin File Browser**
   - View all uploaded files
   - Delete/rename files
   - Download files
   - View file metadata

---

### Phase 9: CMS & Website Planning (Week 9)

#### A. Website Type Options
1. **Types Offered**
   - Static websites (HTML/CSS/JS)
   - Dynamic websites (with backend)
   - E-commerce sites
   - CMS websites (WordPress, Webflow)
   - Web apps
   - Landing pages

2. **Pricing Factors**
   - Difficulty level (1-5 scale)
   - Functionality (features count)
   - Static vs dynamic
   - Deployment complexity
   - Domain registration
   - Hosting management option

3. **Planning Stages**
   - Stage 1: Initial consultation
   - Stage 2: Theme selection, brand identity discussion

#### B. Hosting Management
1. **Optional Service**
   - Client chooses: DIY hosting or managed
   - Managed hosting = extra cost
   - Commission on subscription management
   - Monthly hosting fee

2. **Hosting Options**
   - Vercel, Netlify (static/JAMstack)
   - AWS, DigitalOcean (dynamic)
   - Shared hosting (WordPress)
   - Custom server setup

---

### Phase 10: Legal & Compliance (Week 10)

#### A. Legal Pages
1. **Terms of Service**
   - Clear, understandable language
   - Service scope
   - Payment terms
   - Refund policy
   - Disclaimer

2. **Privacy Policy**
   - Data collection transparency
   - Cookie usage
   - Third-party services
   - User rights
   - GDPR/CCPA compliance

3. **Disclaimer**
   - No guarantees on specific outcomes
   - Client responsibilities
   - Limitation of liability

---

### Phase 11: Backup & Disaster Recovery (Week 10)

#### A. Automated Backups
1. **Scheduled Backups**
   - Biweekly automatic backups
   - Database always included
   - Optional: files, config, audit logs
   - Retention policy (keep last 6 backups)

2. **Manual Backups**
   - Before major changes
   - On-demand via admin panel
   - Full or partial backups

#### B. Restore System
1. **Panic Button**
   - Freeze all writes
   - Roll back to last stable backup
   - Admin-only access

2. **Selective Restore**
   - Restore specific tables
   - Compare backup versions
   - Preview before restore

---

### Phase 12: Feature Flags & Environments (Week 11)

#### A. Feature Flags
1. **Flag Management**
   - Enable/disable features by environment
   - Gradual rollouts
   - A/B testing support
   - User-specific flags

2. **Controlled Features**
   - Payment processing
   - Admin tools
   - Client previews
   - Experimental features

#### B. Environment Management
1. **Development**
   - Test new features
   - No real payments
   - Mock data

2. **Staging**
   - Pre-production testing
   - Real-like data
   - Client previews

3. **Production**
   - Live site
   - No direct edits
   - CI/CD deploys
   - Owner approval required for changes

---

## Implementation Guidelines

### Code Quality
- TypeScript for type safety
- ESLint + Prettier for consistent formatting
- Unit tests for critical functions
- Integration tests for API endpoints
- E2E tests for user flows

### Security Checklist
- [ ] All inputs validated and sanitized
- [ ] Rate limiting on all endpoints
- [ ] HTTPS only
- [ ] Secure session management
- [ ] Password hashing (bcrypt, min 12 rounds)
- [ ] SQL injection prevention (Prisma parameterized queries)
- [ ] XSS protection (Content Security Policy)
- [ ] CSRF tokens
- [ ] Audit logging for sensitive actions
- [ ] Regular security audits

### Performance
- Database indexing on frequently queried fields
- Caching strategy (Redis for sessions, CDN for static assets)
- Image optimization (Next.js Image component)
- Lazy loading
- Code splitting
- Bundle size monitoring

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast ratios
- Focus indicators
- Alt text for images

---

## Migration Plan

1. **Phase 1**: Apply database migrations in dev environment
2. **Phase 2**: Seed test data
3. **Phase 3**: Build and test features incrementally
4. **Phase 4**: Deploy to staging for user testing
5. **Phase 5**: Production deployment (with rollback plan)

---

## Success Metrics

- **Security**: Zero data breaches, < 0.1% failed auth attempts
- **Performance**: < 2s page load, < 500ms API response
- **Uptime**: 99.9% availability
- **User Satisfaction**: Positive client feedback, repeat customers
- **Revenue**: Track pricing effectiveness, conversion rates

---

## Next Steps

1. Review and approve this plan
2. Set up development environment
3. Apply database migrations
4. Begin Phase 1: Authentication & Security
5. Iterate and deploy incrementally

---

**Last Updated**: 2025-12-16
**Status**: Planning Complete, Ready for Implementation
