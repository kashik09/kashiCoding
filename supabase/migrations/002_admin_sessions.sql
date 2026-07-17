-- Admin sessions table for auth
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);

-- Auto-cleanup expired sessions (optional: run via cron)
-- DELETE FROM admin_sessions WHERE expires_at < NOW();
