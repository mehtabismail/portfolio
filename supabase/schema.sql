-- Portfolio platform schema (Supabase SQL Editor: run once on a fresh project).
-- See CURSOR_MASTER_PROMPT.md for the canonical description.

-- ============================================================
-- PLATFORM USERS
-- ============================================================
CREATE TABLE platform_users (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  slug            TEXT UNIQUE NOT NULL,
  display_name    TEXT NOT NULL,
  role            TEXT,
  location        TEXT,
  email           TEXT,
  phone           TEXT,
  avatar_url      TEXT,
  bio             TEXT,
  template_id     TEXT NOT NULL DEFAULT 'minimal'
                    CHECK (template_id IN ('minimal')),
  is_published    BOOLEAN NOT NULL DEFAULT false,
  seo_title       TEXT,
  seo_description TEXT,
  cms_user        JSONB,
  cms_site        JSONB,
  cms_contact     JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PROJECTS (platform users)
-- ============================================================
CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
  slug            TEXT NOT NULL,
  title           TEXT NOT NULL,
  title_display   TEXT,
  description     TEXT,
  services        TEXT,
  tech_stack      TEXT[] DEFAULT '{}',
  categories      TEXT[] DEFAULT '{}',
  thumbnail_url   TEXT,
  thumbnail_bg    TEXT,
  hero_image_url  TEXT,
  gallery         TEXT[] DEFAULT '{}',
  live_url        TEXT,
  year            TEXT,
  role            TEXT,
  credits         TEXT,
  is_published    BOOLEAN NOT NULL DEFAULT false,
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  display_order   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, slug)
);

-- ============================================================
-- SOCIAL LINKS
-- ============================================================
CREATE TABLE social_links (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
  platform      TEXT NOT NULL,
  url           TEXT NOT NULL,
  label         TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- SKILLS
-- ============================================================
CREATE TABLE skills (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  category      TEXT,
  level         INTEGER CHECK (level BETWEEN 1 AND 5),
  display_order INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- EXPERIENCES
-- ============================================================
CREATE TABLE experiences (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
  company       TEXT NOT NULL,
  role          TEXT NOT NULL,
  start_date    TEXT,
  end_date      TEXT,
  description   TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- BLOGS
-- ============================================================
CREATE TABLE blogs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
  slug             TEXT NOT NULL,
  title            TEXT NOT NULL,
  content          TEXT,
  cover_image_url  TEXT,
  tags             TEXT[] DEFAULT '{}',
  status           TEXT NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft', 'published', 'archived')),
  source           TEXT NOT NULL DEFAULT 'platform'
                     CHECK (source IN ('platform', 'medium', 'devto', 'hashnode')),
  external_url     TEXT,
  view_count       INTEGER NOT NULL DEFAULT 0,
  read_time_mins   INTEGER,
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, slug)
);

-- ============================================================
-- INTEGRATIONS
-- ============================================================
CREATE TABLE integrations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
  provider       TEXT NOT NULL
                   CHECK (provider IN ('medium', 'devto', 'hashnode', 'github')),
  username       TEXT NOT NULL,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  last_synced_at TIMESTAMPTZ,
  UNIQUE(user_id, provider)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE platform_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links   ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills         ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences    ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_users"
  ON platform_users FOR SELECT
  USING (is_published = true);

CREATE POLICY "public_read_projects"
  ON projects FOR SELECT
  USING (
    is_published = true AND
    EXISTS (SELECT 1 FROM platform_users WHERE id = user_id AND is_published = true)
  );

CREATE POLICY "public_read_social_links"
  ON social_links FOR SELECT
  USING (EXISTS (SELECT 1 FROM platform_users WHERE id = user_id AND is_published = true));

CREATE POLICY "public_read_skills"
  ON skills FOR SELECT
  USING (EXISTS (SELECT 1 FROM platform_users WHERE id = user_id AND is_published = true));

CREATE POLICY "public_read_experiences"
  ON experiences FOR SELECT
  USING (EXISTS (SELECT 1 FROM platform_users WHERE id = user_id AND is_published = true));

CREATE POLICY "public_read_published_blogs"
  ON blogs FOR SELECT
  USING (status = 'published');

CREATE POLICY "users_manage_own_profile"    ON platform_users FOR ALL USING (auth.uid() = id);
CREATE POLICY "users_manage_own_projects"   ON projects       FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_manage_own_socials"    ON social_links   FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_manage_own_skills"     ON skills         FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_manage_own_experience" ON experiences    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_manage_own_blogs"      ON blogs          FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_manage_own_integrations" ON integrations FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_platform_users_slug       ON platform_users(slug);
CREATE INDEX idx_projects_user_id          ON projects(user_id);
CREATE INDEX idx_projects_slug             ON projects(slug);
CREATE INDEX idx_projects_order            ON projects(user_id, display_order);
CREATE INDEX idx_blogs_user_id             ON blogs(user_id);
CREATE INDEX idx_blogs_status              ON blogs(status);
CREATE INDEX idx_blogs_published_at        ON blogs(published_at DESC);
CREATE INDEX idx_blogs_view_count          ON blogs(view_count DESC);
CREATE INDEX idx_social_links_user_id      ON social_links(user_id);
CREATE INDEX idx_integrations_user_id      ON integrations(user_id);
