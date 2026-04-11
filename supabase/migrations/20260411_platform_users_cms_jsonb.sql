-- Run in Supabase SQL editor or via migration tooling.
ALTER TABLE platform_users
  ADD COLUMN IF NOT EXISTS cms_user JSONB,
  ADD COLUMN IF NOT EXISTS cms_site JSONB,
  ADD COLUMN IF NOT EXISTS cms_contact JSONB;
