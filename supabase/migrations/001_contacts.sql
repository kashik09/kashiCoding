-- Create contacts table for storing form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Only authenticated users (admin) can read contacts
CREATE POLICY "Admin can read contacts" ON contacts
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Anyone can insert (for the contact form)
CREATE POLICY "Anyone can submit contact" ON contacts
  FOR INSERT
  WITH CHECK (true);

-- Only admin can update (mark as read, archive)
CREATE POLICY "Admin can update contacts" ON contacts
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create index for faster queries
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX idx_contacts_read ON contacts(read);
