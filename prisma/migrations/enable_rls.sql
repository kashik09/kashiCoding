-- Enable Row Level Security (RLS) on all tables
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- ============================================
-- 1. ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SupportTicket" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_product_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_seat_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_reset_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_phase_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ad_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.student_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. USERS
-- ============================================

DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;

CREATE POLICY "Users can view their own profile"
ON public.users
FOR SELECT
USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile"
ON public.users
FOR UPDATE
USING (auth.uid()::text = id)
WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Admins can manage all users"
ON public.users
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- ============================================
-- 3. AUTH / SECURITY TABLES
-- ============================================

-- Accounts
DROP POLICY IF EXISTS "Users can view their own accounts" ON public.accounts;
DROP POLICY IF EXISTS "Users can manage their own accounts" ON public.accounts;
DROP POLICY IF EXISTS "Admins can manage all accounts" ON public.accounts;

CREATE POLICY "Users can view their own accounts"
ON public.accounts
FOR SELECT
USING ("userId" = auth.uid()::text);

CREATE POLICY "Admins can manage all accounts"
ON public.accounts
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Sessions
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can manage their own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Admins can manage all sessions" ON public.sessions;

CREATE POLICY "Users can view their own sessions"
ON public.sessions
FOR SELECT
USING ("userId" = auth.uid()::text);

CREATE POLICY "Admins can manage all sessions"
ON public.sessions
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Verification tokens
DROP POLICY IF EXISTS "Admins can manage verification tokens" ON public.verification_tokens;

CREATE POLICY "Admins can manage verification tokens"
ON public.verification_tokens
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Password reset tokens
DROP POLICY IF EXISTS "Admins can manage password reset tokens" ON public.password_reset_tokens;

CREATE POLICY "Admins can manage password reset tokens"
ON public.password_reset_tokens
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Device sessions
DROP POLICY IF EXISTS "Users can view their own device sessions" ON public.device_sessions;
DROP POLICY IF EXISTS "Users can manage their own device sessions" ON public.device_sessions;
DROP POLICY IF EXISTS "Admins can manage all device sessions" ON public.device_sessions;

CREATE POLICY "Users can view their own device sessions"
ON public.device_sessions
FOR SELECT
USING ("userId" = auth.uid()::text);

CREATE POLICY "Admins can manage all device sessions"
ON public.device_sessions
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- ============================================
-- 4. PUBLIC CONTENT
-- ============================================

-- Projects
DROP POLICY IF EXISTS "Anyone can view published projects" ON public.projects;
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can do everything with projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can manage all projects" ON public.projects;

CREATE POLICY "Public can view published projects"
ON public.projects
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage all projects"
ON public.projects
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Digital products
DROP POLICY IF EXISTS "Public can view published products" ON public.digital_products;
DROP POLICY IF EXISTS "Admins can manage all products" ON public.digital_products;

CREATE POLICY "Public can view published products"
ON public.digital_products
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage all products"
ON public.digital_products
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Content pages (terms, privacy, about)
DROP POLICY IF EXISTS "Public can view published content pages" ON public.content_pages;
DROP POLICY IF EXISTS "Admins can manage all content pages" ON public.content_pages;

CREATE POLICY "Public can view published content pages"
ON public.content_pages
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage all content pages"
ON public.content_pages
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Page contents (marketing content only)
DROP POLICY IF EXISTS "Public can view marketing page content" ON public.page_contents;
DROP POLICY IF EXISTS "Admins can manage all page content" ON public.page_contents;

CREATE POLICY "Public can view marketing page content"
ON public.page_contents
FOR SELECT
USING (slug IN ('services', 'request-form'));

CREATE POLICY "Admins can manage all page content"
ON public.page_contents
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- ============================================
-- 5. REQUESTS & SUPPORT
-- ============================================

-- Project requests
DROP POLICY IF EXISTS "Anyone can submit project requests" ON public.project_requests;
DROP POLICY IF EXISTS "Users can view their own requests" ON public.project_requests;
DROP POLICY IF EXISTS "Users can view their own project requests" ON public.project_requests;
DROP POLICY IF EXISTS "Admins can manage all requests" ON public.project_requests;
DROP POLICY IF EXISTS "Admins can manage all project requests" ON public.project_requests;

CREATE POLICY "Anyone can submit project requests"
ON public.project_requests
FOR INSERT
WITH CHECK ("userId" IS NULL OR "userId" = auth.uid()::text);

CREATE POLICY "Users can view their own project requests"
ON public.project_requests
FOR SELECT
USING (
  auth.uid()::text = "userId"
  OR "email" = (
    SELECT "email"
    FROM public.users
    WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Admins can manage all project requests"
ON public.project_requests
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Grievances
DROP POLICY IF EXISTS "Anyone can submit grievances" ON public.grievances;
DROP POLICY IF EXISTS "Users can view their own grievances" ON public.grievances;
DROP POLICY IF EXISTS "Admins can manage all grievances" ON public.grievances;

CREATE POLICY "Anyone can submit grievances"
ON public.grievances
FOR INSERT
WITH CHECK ("userId" IS NULL OR "userId" = auth.uid()::text);

CREATE POLICY "Users can view their own grievances"
ON public.grievances
FOR SELECT
USING (
  auth.uid()::text = "userId"
  OR "email" = (
    SELECT "email"
    FROM public.users
    WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Admins can manage all grievances"
ON public.grievances
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Support tickets
DROP POLICY IF EXISTS "Users can submit support tickets" ON public."SupportTicket";
DROP POLICY IF EXISTS "Users can view their support tickets" ON public."SupportTicket";
DROP POLICY IF EXISTS "Admins can manage all support tickets" ON public."SupportTicket";

CREATE POLICY "Users can submit support tickets"
ON public."SupportTicket"
FOR INSERT
WITH CHECK ("userId" = auth.uid()::text);

CREATE POLICY "Users can view their support tickets"
ON public."SupportTicket"
FOR SELECT
USING ("userId" = auth.uid()::text);

CREATE POLICY "Admins can manage all support tickets"
ON public."SupportTicket"
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- ============================================
-- 6. ANALYTICS
-- ============================================

-- Visits
DROP POLICY IF EXISTS "Anyone can log visits" ON public.visits;
DROP POLICY IF EXISTS "Admins can view all visits" ON public.visits;
DROP POLICY IF EXISTS "Admins can manage all visits" ON public.visits;

CREATE POLICY "Anyone can log visits"
ON public.visits
FOR INSERT
WITH CHECK (
  "pagePath" IS NOT NULL
  AND "visitorId" IS NOT NULL
  AND length(trim("pagePath")) > 0
  AND length(trim("visitorId")) > 0
);

CREATE POLICY "Admins can manage all visits"
ON public.visits
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Analytics events
DROP POLICY IF EXISTS "Anyone can log analytics events" ON public.analytics_events;
DROP POLICY IF EXISTS "Admins can manage analytics events" ON public.analytics_events;

CREATE POLICY "Anyone can log analytics events"
ON public.analytics_events
FOR INSERT
WITH CHECK (
  "action" IS NOT NULL
  AND length(trim("action")) > 0
);

CREATE POLICY "Admins can manage analytics events"
ON public.analytics_events
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- ============================================
-- 7. SHOPPING & ORDERS
-- ============================================

-- Carts
DROP POLICY IF EXISTS "Users can manage their own carts" ON public.carts;
DROP POLICY IF EXISTS "Admins can manage all carts" ON public.carts;

CREATE POLICY "Users can manage their own carts"
ON public.carts
FOR ALL
USING ("userId" = auth.uid()::text)
WITH CHECK ("userId" = auth.uid()::text);

CREATE POLICY "Admins can manage all carts"
ON public.carts
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Cart items
DROP POLICY IF EXISTS "Users can manage their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Admins can manage all cart items" ON public.cart_items;

CREATE POLICY "Users can manage their own cart items"
ON public.cart_items
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.carts
    WHERE carts.id = "cartId"
      AND carts."userId" = auth.uid()::text
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.carts
    WHERE carts.id = "cartId"
      AND carts."userId" = auth.uid()::text
  )
);

CREATE POLICY "Admins can manage all cart items"
ON public.cart_items
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Wishlist items
DROP POLICY IF EXISTS "Users can manage their own wishlist items" ON public.wishlist_items;
DROP POLICY IF EXISTS "Admins can manage all wishlist items" ON public.wishlist_items;

CREATE POLICY "Users can manage their own wishlist items"
ON public.wishlist_items
FOR ALL
USING ("userId" = auth.uid()::text)
WITH CHECK ("userId" = auth.uid()::text);

CREATE POLICY "Admins can manage all wishlist items"
ON public.wishlist_items
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;

CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
USING ("userId" = auth.uid()::text);

CREATE POLICY "Admins can manage all orders"
ON public.orders
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Order items
DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;

CREATE POLICY "Users can view their order items"
ON public.order_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.orders
    WHERE orders.id = "orderId"
      AND orders."userId" = auth.uid()::text
  )
);

CREATE POLICY "Admins can manage all order items"
ON public.order_items
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Purchases
DROP POLICY IF EXISTS "Users can view their purchases" ON public.digital_product_purchases;
DROP POLICY IF EXISTS "Admins can manage all purchases" ON public.digital_product_purchases;

CREATE POLICY "Users can view their purchases"
ON public.digital_product_purchases
FOR SELECT
USING ("userId" = auth.uid()::text);

CREATE POLICY "Admins can manage all purchases"
ON public.digital_product_purchases
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Licenses
DROP POLICY IF EXISTS "Users can view their licenses" ON public.licenses;
DROP POLICY IF EXISTS "Admins can manage all licenses" ON public.licenses;

CREATE POLICY "Users can view their licenses"
ON public.licenses
FOR SELECT
USING ("userId" = auth.uid()::text);

CREATE POLICY "Admins can manage all licenses"
ON public.licenses
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- License seat assignments
DROP POLICY IF EXISTS "Users can view their assigned seats" ON public.license_seat_assignments;
DROP POLICY IF EXISTS "License owners can manage seat assignments" ON public.license_seat_assignments;
DROP POLICY IF EXISTS "Admins can manage all seat assignments" ON public.license_seat_assignments;

CREATE POLICY "Users can view their assigned seats"
ON public.license_seat_assignments
FOR SELECT
USING (
  "assignedUserId" = auth.uid()::text
  OR "assignedUserEmail" = (
    SELECT "email"
    FROM public.users
    WHERE id = auth.uid()::text
  )
);

CREATE POLICY "License owners can manage seat assignments"
ON public.license_seat_assignments
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.licenses
    WHERE licenses.id = "licenseId"
      AND licenses."userId" = auth.uid()::text
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.licenses
    WHERE licenses.id = "licenseId"
      AND licenses."userId" = auth.uid()::text
  )
);

CREATE POLICY "Admins can manage all seat assignments"
ON public.license_seat_assignments
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Downloads
DROP POLICY IF EXISTS "Users can view their downloads" ON public.downloads;
DROP POLICY IF EXISTS "Admins can manage all downloads" ON public.downloads;

CREATE POLICY "Users can view their downloads"
ON public.downloads
FOR SELECT
USING ("userId" = auth.uid()::text);

CREATE POLICY "Admins can manage all downloads"
ON public.downloads
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Download reset requests
DROP POLICY IF EXISTS "Users can view their download reset requests" ON public.download_reset_requests;
DROP POLICY IF EXISTS "Users can submit download reset requests" ON public.download_reset_requests;
DROP POLICY IF EXISTS "Admins can manage all download reset requests" ON public.download_reset_requests;

CREATE POLICY "Users can view their download reset requests"
ON public.download_reset_requests
FOR SELECT
USING ("userId" = auth.uid()::text);

CREATE POLICY "Users can submit download reset requests"
ON public.download_reset_requests
FOR INSERT
WITH CHECK ("userId" = auth.uid()::text AND status = 'PENDING');

CREATE POLICY "Admins can manage all download reset requests"
ON public.download_reset_requests
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- ============================================
-- 8. SERVICES
-- ============================================

-- Service projects
DROP POLICY IF EXISTS "Users can view their service projects" ON public.service_projects;
DROP POLICY IF EXISTS "Admins can manage all service projects" ON public.service_projects;

CREATE POLICY "Users can view their service projects"
ON public.service_projects
FOR SELECT
USING ("userId" = auth.uid()::text);

CREATE POLICY "Admins can manage all service projects"
ON public.service_projects
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Project phase history
DROP POLICY IF EXISTS "Users can view their project phase history" ON public.project_phase_history;
DROP POLICY IF EXISTS "Admins can manage all project phase history" ON public.project_phase_history;

CREATE POLICY "Users can view their project phase history"
ON public.project_phase_history
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.service_projects
    WHERE service_projects.id = "projectId"
      AND service_projects."userId" = auth.uid()::text
  )
);

CREATE POLICY "Admins can manage all project phase history"
ON public.project_phase_history
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Service add-ons
DROP POLICY IF EXISTS "Users can view their service add ons" ON public.service_add_ons;
DROP POLICY IF EXISTS "Users can request service add ons" ON public.service_add_ons;
DROP POLICY IF EXISTS "Admins can manage all service add ons" ON public.service_add_ons;

CREATE POLICY "Users can view their service add ons"
ON public.service_add_ons
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.service_projects
    WHERE service_projects.id = "projectId"
      AND service_projects."userId" = auth.uid()::text
  )
);

CREATE POLICY "Users can request service add ons"
ON public.service_add_ons
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.service_projects
    WHERE service_projects.id = "projectId"
      AND service_projects."userId" = auth.uid()::text
  )
);

CREATE POLICY "Admins can manage all service add ons"
ON public.service_add_ons
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- ============================================
-- 9. MEMBERSHIPS & CREDITS
-- ============================================

-- Memberships
DROP POLICY IF EXISTS "Users can view their memberships" ON public.memberships;
DROP POLICY IF EXISTS "Admins can manage all memberships" ON public.memberships;

CREATE POLICY "Users can view their memberships"
ON public.memberships
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users."membershipId" = id
  )
);

CREATE POLICY "Admins can manage all memberships"
ON public.memberships
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Credit transactions
DROP POLICY IF EXISTS "Users can view their credit transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Admins can manage all credit transactions" ON public.credit_transactions;

CREATE POLICY "Users can view their credit transactions"
ON public.credit_transactions
FOR SELECT
USING ("userId" = auth.uid()::text);

CREATE POLICY "Admins can manage all credit transactions"
ON public.credit_transactions
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- User ad consents
DROP POLICY IF EXISTS "Users can manage their ad consent" ON public.user_ad_consents;
DROP POLICY IF EXISTS "Admins can manage all ad consents" ON public.user_ad_consents;

CREATE POLICY "Users can manage their ad consent"
ON public.user_ad_consents
FOR ALL
USING ("userId" = auth.uid()::text)
WITH CHECK ("userId" = auth.uid()::text);

CREATE POLICY "Admins can manage all ad consents"
ON public.user_ad_consents
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Student verifications
DO $$
BEGIN
  IF to_regclass('public.student_verifications') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view their student verification" ON public.student_verifications;
    DROP POLICY IF EXISTS "Users can submit student verification" ON public.student_verifications;
    DROP POLICY IF EXISTS "Users can update pending student verification" ON public.student_verifications;
    DROP POLICY IF EXISTS "Admins can manage all student verifications" ON public.student_verifications;

    CREATE POLICY "Users can view their student verification"
    ON public.student_verifications
    FOR SELECT
    USING ("userId" = auth.uid()::text);

    CREATE POLICY "Users can submit student verification"
    ON public.student_verifications
    FOR INSERT
    WITH CHECK ("userId" = auth.uid()::text AND status = 'PENDING');

    CREATE POLICY "Users can update pending student verification"
    ON public.student_verifications
    FOR UPDATE
    USING ("userId" = auth.uid()::text)
    WITH CHECK ("userId" = auth.uid()::text AND status = 'PENDING');

    CREATE POLICY "Admins can manage all student verifications"
    ON public.student_verifications
    FOR ALL
    USING (
      EXISTS (
        SELECT 1
        FROM public.users
        WHERE users.id = auth.uid()::text
          AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1
        FROM public.users
        WHERE users.id = auth.uid()::text
          AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
      )
    );
  END IF;
END $$;

-- ============================================
-- 10. ADMIN CONFIG & AUDIT
-- ============================================

-- Audit logs
DROP POLICY IF EXISTS "Admins can manage all audit logs" ON public.audit_logs;

CREATE POLICY "Admins can manage all audit logs"
ON public.audit_logs
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Site settings
DROP POLICY IF EXISTS "Admins can manage all site settings" ON public.site_settings;

CREATE POLICY "Admins can manage all site settings"
ON public.site_settings
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Feature flags
DROP POLICY IF EXISTS "Admins can manage all feature flags" ON public.feature_flags;

CREATE POLICY "Admins can manage all feature flags"
ON public.feature_flags
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- System backups
DROP POLICY IF EXISTS "Admins can manage all system backups" ON public.system_backups;

CREATE POLICY "Admins can manage all system backups"
ON public.system_backups
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);

-- Prisma migrations table (lock down from public access)
DROP POLICY IF EXISTS "Admins can manage prisma migrations" ON public._prisma_migrations;

CREATE POLICY "Admins can manage prisma migrations"
ON public._prisma_migrations
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'OWNER', 'MODERATOR', 'EDITOR')
  )
);
