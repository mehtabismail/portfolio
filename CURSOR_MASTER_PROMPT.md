# CURSOR MASTER PROMPT — Portfolio SaaS Platform
# Save this file as `CURSOR_MASTER_PROMPT.md` in your project root.
# In Cursor: reference this file in every chat with "@CURSOR_MASTER_PROMPT.md"
# or add its contents to your `.cursor/rules` file so it applies automatically.

---

## 🧠 PROJECT IDENTITY

You are building a **multi-tenant SaaS portfolio platform** called [YOUR PLATFORM NAME].

The platform starts as a single developer's personal portfolio (Mehtab's) and evolves into
a place where any developer/designer can come, click "Create My Portfolio", and get their
own fully-managed portfolio site with a CMS admin panel — all powered by the same codebase.

**Stack:**
- Framework: Next.js (App Router, TypeScript, strict mode)
- Your portfolio data: Firebase Firestore + Firebase Admin SDK (server-only)
- Platform user data: Supabase (PostgreSQL + RLS + Supabase Auth)
- Media/Images: Cloudinary (one account, folder-separated)
- Animations: GSAP + Lenis smooth scroll
- Deployment: Vercel (ISR support)
- Styling: Existing CSS files in `/public/assets/css/` + per-template CSS modules

**Golden Rule: The owner's portfolio (Firebase) and the platform users (Supabase) are
COMPLETELY SEPARATE systems. They never share a client, a query, or an auth flow.
Firebase = owner only. Supabase = everyone else. This separation must never be violated.**

---

## 📁 CANONICAL FOLDER STRUCTURE

This is the target structure. Never deviate from it. Every new file must go in the
correct location based on whether it belongs to: (a) the owner's portfolio,
(b) the platform, (c) a user's portfolio, or (d) a shared utility.

```
/
├── middleware.ts                        ← SINGLE middleware file (renamed from proxy.ts)
│
├── app/
│   ├── layout.tsx                       ← Root layout (fonts, global CSS only)
│   ├── globals.css
│   │
│   ├── (site)/                          ← OWNER'S portfolio (Firebase-backed, untouched)
│   │   ├── layout.tsx
│   │   ├── page.tsx                     ← Owner homepage
│   │   ├── work/
│   │   ├── about/
│   │   ├── contact/
│   │   └── archive/
│   │
│   ├── (admin)/                         ← OWNER'S admin CMS (Firebase-backed, untouched)
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── login/
│   │       ├── user/
│   │       ├── site/
│   │       ├── contact/
│   │       └── projects/
│   │
│   ├── (platform)/                      ← PLATFORM pages (Supabase-backed)
│   │   ├── layout.tsx                   ← Platform shell layout
│   │   ├── page.tsx                     ← Platform landing / discover page
│   │   ├── create/                      ← Onboarding: create a new portfolio
│   │   │   └── page.tsx
│   │   ├── login/                       ← Supabase Auth login for platform users
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── blogs/                       ← Platform-wide blog discovery
│   │       └── page.tsx
│   │
│   ├── u/                               ← PUBLIC user portfolios (Supabase, ISR)
│   │   └── [slug]/
│   │       ├── page.tsx                 ← User's portfolio home
│   │       ├── work/
│   │       │   ├── page.tsx
│   │       │   └── [projectSlug]/
│   │       │       └── page.tsx
│   │       ├── about/
│   │       │   └── page.tsx
│   │       ├── contact/
│   │       │   └── page.tsx
│   │       └── blogs/
│   │           ├── page.tsx
│   │           └── [blogSlug]/
│   │               └── page.tsx
│   │
│   ├── dashboard/                       ← PLATFORM USER admin panels (Supabase Auth)
│   │   └── [slug]/
│   │       ├── layout.tsx               ← Auth guard + dashboard shell
│   │       ├── page.tsx                 ← Dashboard home
│   │       ├── projects/
│   │       │   ├── page.tsx
│   │       │   ├── new/
│   │       │   │   └── page.tsx
│   │       │   └── [projectSlug]/
│   │       │       └── page.tsx
│   │       ├── blogs/
│   │       │   ├── page.tsx
│   │       │   ├── new/
│   │       │   │   └── page.tsx
│   │       │   └── [blogSlug]/
│   │       │       └── page.tsx
│   │       ├── integrations/            ← Medium, Dev.to, GitHub connections
│   │       │   └── page.tsx
│   │       └── settings/
│   │           └── page.tsx             ← Template picker, slug, SEO, theme
│   │
│   └── api/
│       ├── admin/                       ← OWNER'S API routes (Firebase, untouched)
│       │   ├── login/
│       │   ├── logout/
│       │   ├── content/[key]/
│       │   ├── projects/
│       │   └── revalidate/
│       └── platform/                    ← PLATFORM API routes (Supabase)
│           ├── auth/
│           │   └── callback/            ← Supabase OAuth callback
│           │       └── route.ts
│           ├── users/
│           │   └── route.ts
│           ├── projects/
│           │   └── route.ts
│           ├── blogs/
│           │   └── route.ts
│           └── integrations/
│               ├── medium/
│               │   └── route.ts         ← RSS fetch + cache
│               └── devto/
│                   └── route.ts         ← Dev.to API fetch + cache
│
├── components/
│   ├── [existing owner components]      ← DO NOT MODIFY these
│   ├── admin/                           ← Owner admin components (untouched)
│   └── platform/                        ← NEW: platform-only components
│       ├── TemplateCard.tsx
│       ├── TemplatePicker.tsx
│       ├── BlogCard.tsx
│       ├── BlogsDiscovery.tsx
│       ├── UserCard.tsx
│       └── CreatePortfolioForm.tsx
│
├── templates/                           ← TEMPLATE ENGINE (critical for scalability)
│   ├── index.ts                         ← Registry of all templates
│   ├── types.ts                         ← Shared TemplateProps type
│   └── minimal/                         ← Template 1: current design (your portfolio)
│       ├── index.tsx                    ← Root template component
│       ├── theme.ts                     ← CSS variables / design tokens
│       └── components/
│           ├── Hero.tsx
│           ├── WorkGrid.tsx
│           ├── WorkDetail.tsx
│           ├── About.tsx
│           ├── Contact.tsx
│           ├── Footer.tsx
│           └── Blogs.tsx
│
├── lib/
│   ├── content/                         ← OWNER content layer (Firebase, UNTOUCHED)
│   │   ├── content-mode.ts
│   │   ├── dynamic-content.ts
│   │   ├── static-content.ts
│   │   ├── firebase-admin.ts
│   │   ├── provider.ts
│   │   └── index.ts
│   ├── admin/                           ← OWNER admin lib (UNTOUCHED)
│   │   ├── auth.ts
│   │   ├── content-service.ts
│   │   ├── firestore-write.ts
│   │   ├── revalidate.ts
│   │   ├── schemas.ts
│   │   ├── defaults.ts
│   │   └── types.ts
│   ├── supabase/                        ← NEW: Supabase layer
│   │   ├── client.ts                    ← Browser Supabase client (singleton)
│   │   ├── server.ts                    ← Server Supabase client (per-request)
│   │   ├── middleware.ts                ← Supabase session refresh helper
│   │   └── queries/
│   │       ├── users.ts                 ← getUserBySlug, createUser, updateUser
│   │       ├── projects.ts              ← getProjects, upsertProject, deleteProject
│   │       ├── blogs.ts                 ← getBlogs, upsertBlog, incrementViewCount
│   │       └── integrations.ts          ← getIntegrations, saveIntegration
│   └── integrations/
│       ├── medium.ts                    ← RSS feed fetch (cached 1hr)
│       └── devto.ts                     ← Dev.to API fetch (cached 1hr)
│
├── data/                                ← OWNER static fallback data (UNTOUCHED)
│   ├── index.ts
│   ├── user.ts
│   ├── site.ts
│   ├── contact.ts
│   └── projects.ts
│
└── scripts/                             ← Dev scripts (UNTOUCHED)
    ├── seed-firestore.ts
    ├── migrate-media-cloudinary.ts
    └── ...
```

---

## 🗄️ SUPABASE DATABASE SCHEMA

Run this SQL in your Supabase project. This is the complete, final schema.
Never add tables outside of this schema without updating this prompt first.

```sql
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
  avatar_url      TEXT,          -- Cloudinary URL: users/{slug}/avatar
  bio             TEXT,
  template_id     TEXT NOT NULL DEFAULT 'minimal'
                    CHECK (template_id IN ('minimal')),
                  -- Add new templates here: CHECK (template_id IN ('minimal', 'bold', 'developer'))
  is_published    BOOLEAN NOT NULL DEFAULT false,
  seo_title       TEXT,
  seo_description TEXT,
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
  end_date      TEXT,           -- NULL = current
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
  content          TEXT,              -- Markdown
  cover_image_url  TEXT,
  tags             TEXT[] DEFAULT '{}',
  status           TEXT NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft', 'published', 'archived')),
  source           TEXT NOT NULL DEFAULT 'platform'
                     CHECK (source IN ('platform', 'medium', 'devto', 'hashnode')),
  external_url     TEXT,             -- original URL for imported posts
  view_count       INTEGER NOT NULL DEFAULT 0,
  read_time_mins   INTEGER,          -- computed on save
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, slug)
);

-- ============================================================
-- INTEGRATIONS (Medium, Dev.to, GitHub, etc.)
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

-- Public can read published portfolios and their data
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

-- Users can only manage their own data
CREATE POLICY "users_manage_own_profile"    ON platform_users FOR ALL USING (auth.uid() = id);
CREATE POLICY "users_manage_own_projects"   ON projects       FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_manage_own_socials"    ON social_links   FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_manage_own_skills"     ON skills         FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_manage_own_experience" ON experiences    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_manage_own_blogs"      ON blogs          FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_manage_own_integrations" ON integrations FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- INDEXES (add from day one — do not skip)
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
```

---

## 🔐 MIDDLEWARE (middleware.ts)

The SINGLE middleware file handles both auth systems. Never split this.

```ts
// middleware.ts (root of project — REPLACES proxy.ts)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionValue } from "@/lib/admin/auth";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. OWNER ADMIN (Firebase session auth) ──────────────────────
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const isValid = await verifyAdminSessionValue(token);
    if (!isValid) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ── 2. PLATFORM USER DASHBOARD (Supabase Auth) ──────────────────
  if (pathname.startsWith("/dashboard")) {
    let response = NextResponse.next({ request });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
```

---

## 🎨 TEMPLATE ENGINE

This is the scalability backbone. Every new template is added here and ONLY here.

```ts
// templates/index.ts
import dynamic from "next/dynamic";
import type { UserPortfolioData } from "@/lib/supabase/types";
import type { ComponentType } from "react";

export type TemplateId = "minimal";
// When adding Template 2: export type TemplateId = "minimal" | "bold";

export type TemplateMeta = {
  id:              TemplateId;
  name:            string;
  description:     string;
  previewImageUrl: string;
  tags:            string[];
};

export type TemplateProps = {
  data: UserPortfolioData;
};

// Template registry — add new templates ONLY here
export const TEMPLATE_META: Record<TemplateId, TemplateMeta> = {
  minimal: {
    id:              "minimal",
    name:            "Minimal",
    description:     "Clean, typography-first. Perfect for designers and developers.",
    previewImageUrl: "/templates/previews/minimal.jpg",
    tags:            ["minimal", "dark", "typography", "animation"],
  },
  // Future: bold, developer, magazine, terminal, etc.
};

// Code-split: each template only loads for users who use it
export const TEMPLATE_COMPONENTS: Record<TemplateId, ComponentType<TemplateProps>> = {
  minimal: dynamic(() => import("@/templates/minimal")) as ComponentType<TemplateProps>,
};

export function getTemplate(id: string): ComponentType<TemplateProps> {
  return TEMPLATE_COMPONENTS[id as TemplateId] ?? TEMPLATE_COMPONENTS.minimal;
}
```

```ts
// templates/types.ts
// Shared data shape passed into every template — must be complete
export type UserPortfolioData = {
  id:             string;
  slug:           string;
  display_name:   string;
  role:           string | null;
  location:       string | null;
  email:          string | null;
  phone:          string | null;
  avatar_url:     string | null;
  bio:            string | null;
  seo_title:      string | null;
  seo_description:string | null;
  template_id:    string;
  projects:       ProjectData[];
  social_links:   SocialLinkData[];
  skills:         SkillData[];
  experiences:    ExperienceData[];
  blogs:          BlogData[];
};

// Keep all sub-types in this file
export type ProjectData = { ... };
export type SocialLinkData = { ... };
export type SkillData = { ... };
export type ExperienceData = { ... };
export type BlogData = { ... };
```

---

## ⚡ PERFORMANCE RULES (NON-NEGOTIABLE)

Every developer working on this project must follow these rules.
Do not break them. Do not suggest alternatives.

### ISR Revalidation Windows
```ts
// Owner portfolio pages (Firebase)
export const revalidate = 60;        // 60 seconds

// Platform user portfolio pages (Supabase)
export const revalidate = 60;        // 60 seconds

// Blog listing pages
export const revalidate = 30;        // 30 seconds (blogs update more often)

// Individual blog post pages
export const revalidate = 120;       // 2 minutes

// Platform discovery / home
export const revalidate = 60;
```

### Lazy Loading — Mandatory for These Sections
All sections below the fold on the owner's homepage MUST be dynamically imported
with `ssr: false`. This protects above-the-fold performance.

```ts
// app/(site)/page.tsx — lazy load these, never SSR them
const DiscoverSection  = dynamic(() => import("@/components/platform/DiscoverSection"),  { ssr: false });
const BlogsSection     = dynamic(() => import("@/components/platform/BlogsSection"),     { ssr: false });
```

### Cloudinary Image Rules
- Always use Next.js `<Image>` with Cloudinary URLs, never raw `<img>` for user content
- Always include `f_auto,q_auto` Cloudinary transformations in URLs
- Folder structure: `portfolio-owner/` for owner, `platform-users/{slug}/` for others
- Never store images locally in `/public` for user-uploaded content

### Database Query Rules
- All Supabase queries use `.select()` with explicit columns — never `select("*")` in production
- All paginated lists use cursor-based pagination, not offset
- Never do N+1 queries — always join or batch
- View count increments happen client-side only (never block page render for analytics)

---

## 🔒 ENV VARIABLES

All variables must be present. Add to `.env.local` and Vercel dashboard.

```bash
# ── EXISTING (owner portfolio) ──────────────────────────────
NEXT_PUBLIC_CONTENT_MODE=dynamic
NEXT_PUBLIC_DYNAMIC_FALLBACK_TO_STATIC=true
CONTENT_REVALIDATE_SECONDS=60
ADMIN_SECRET=
ADMIN_SESSION_SECRET=
ADMIN_SESSION_TTL_HOURS=12
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_ROOT_FOLDER=dynamic-portfolio

# ── NEW (platform) ──────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server-only, never expose to client
```

---

## 🧩 FEATURE MODULES — BUILD ORDER & RULES

Build in this exact order. Do not skip phases. Do not build Phase 2 before Phase 1 is
tested and working.

### 🔴 PHASE 0 — Critical Fixes (Do First, Before Anything Else)

1. **Rename `proxy.ts` → `middleware.ts`** (admin routes are currently unprotected)
2. **Update `next.config.ts`** — add Cloudinary remote patterns + security headers
3. **Fix hardcoded image** — add `avatar_url` field to `UserData` type + Firestore,
   replace `src="/assets/img/Mehtab.jpg"` with `src={user.avatarUrl}` in `page.tsx`
4. **Fill in `app/api/admin/content/[key]/route.ts`** — it is currently empty

### 🟡 PHASE 1 — Supabase Foundation

5. Create Supabase project, run full SQL schema above
6. Create `lib/supabase/client.ts`, `lib/supabase/server.ts`
7. Update `middleware.ts` to handle Supabase dashboard auth (see middleware code above)
8. Build `lib/supabase/queries/` — users, projects, blogs, integrations
9. Install: `npm install @supabase/supabase-js @supabase/ssr`

### 🟡 PHASE 2 — Template Engine

10. Create `templates/index.ts` and `templates/types.ts`
11. Create `templates/minimal/` — wrap existing portfolio components into this template
12. Create `app/u/[slug]/page.tsx` — the user portfolio route with ISR + template engine
13. Generate static params from Supabase slugs

### 🟡 PHASE 3 — Portfolio Creation Flow

14. Build `app/(platform)/create/page.tsx` — multi-step form:
    - Step 1: Name, role, slug (check slug availability via API)
    - Step 2: Template picker (just "Minimal" for now, more coming)
    - Step 3: Confirm → Supabase creates user + seeds default data → redirect to dashboard
15. Build `app/(platform)/login/page.tsx` — Supabase Auth email/password
16. Add "Create Your Portfolio" button to owner's Footer component
17. Build `app/api/platform/auth/callback/route.ts` — Supabase OAuth callback

### 🟡 PHASE 4 — User Dashboard

18. Build `app/dashboard/[slug]/layout.tsx` — sidebar nav + auth check
19. Build dashboard pages: overview, projects CRUD, settings (template picker, SEO, slug)
20. Build project editor with Cloudinary image upload
21. Build portfolio publish/unpublish toggle

### 🟠 PHASE 5 — Blogs

22. Add blogs table (already in schema above)
23. Build `app/dashboard/[slug]/blogs/` — list, create, edit
24. Blog editor: Markdown with live preview (use `react-markdown` for rendering)
25. Build `app/u/[slug]/blogs/` — public blog list + individual blog pages (ISR)
26. Build `app/(platform)/blogs/` — platform-wide discovery (top viewed, latest, by tag)
27. Add lazy-loaded blog section to owner's portfolio homepage

### 🟠 PHASE 6 — Integrations

28. Build `lib/integrations/medium.ts` — RSS feed via `https://medium.com/feed/@{username}`
    (use `rss-parser` npm package, cache with `next: { revalidate: 3600 }`)
29. Build `lib/integrations/devto.ts` — Dev.to public API
30. Build `app/api/platform/integrations/medium/route.ts` — proxies RSS, cached
31. Build integrations settings page in dashboard — username inputs + sync button
32. Imported blogs show with `source: 'medium'` or `source: 'devto'` + `external_url`

### 🔵 PHASE 7 — Future Modules (Plan Only, Build Later)

- Roadmaps module: new `roadmaps` + `roadmap_steps` Supabase tables, same pattern as blogs
- Subdomain routing: `john-doe.yourplatform.com` → middleware reads subdomain, looks up slug
- Analytics: Supabase Edge Function for view count increments
- GitHub integration: show pinned repos, contribution graph via GitHub API
- More templates: `bold`, `developer`, `terminal` — add to template registry

---

## 📏 CODING STANDARDS

When writing any new code for this project, always follow these rules:

### TypeScript
- Strict mode is ON — never use `any`, never use `@ts-ignore`
- All Supabase query return types must be explicitly typed
- Keep `TemplateProps` as the single source of truth for what data templates receive

### Components
- Server Components by default — only add `"use client"` when you need browser APIs,
  event handlers, or hooks
- Never fetch data in Client Components — fetch in Server Components, pass as props
- Admin components are Client Components (they have forms/interactivity) — that's fine

### API Routes
- Every API route must check auth before doing anything else
- Owner admin routes: use `isAdminAuthenticatedFromRequest()`
- Platform routes: use Supabase `auth.getUser()` on the server client
- Always return `{ ok: true, data: ... }` on success, `{ ok: false, error: "..." }` on failure

### Supabase Queries
- Never use the service role key in browser-accessible code
- All write operations go through API routes (never call Supabase write directly from components)
- Read operations for public pages can use the anon key server-side (RLS handles security)

### Styling
- Owner portfolio: existing CSS files in `/public/assets/css/` — DO NOT MODIFY
- Platform pages (`/create`, `/login`, `/blogs`, `/dashboard`): use CSS Modules
- Templates: each template has its own isolated CSS — never import owner CSS into a template
- User portfolio pages (`/u/[slug]`): styled entirely by the template — no global styles

### Revalidation
- After any Supabase write that changes a user's public portfolio, call:
  `revalidatePath('/u/' + slug)` and related sub-paths
- After any Firebase write (owner admin), `revalidateAllContentPaths()` already handles it

---

## 🧠 DECISION GUIDE FOR CURSOR

When you're unsure where something belongs, use this decision tree:

```
Is this data about the OWNER (Mehtab)?
  YES → Firebase + existing lib/content + existing lib/admin
  NO  →
    Is this about a PLATFORM USER's public portfolio?
      YES → Supabase (anon key, RLS, ISR) + app/u/[slug]/
      NO  →
        Is this the USER's private dashboard/CMS?
          YES → Supabase (auth, server client) + app/dashboard/[slug]/
          NO  →
            Is this a PLATFORM-LEVEL page (discover, create, blogs)?
              YES → Supabase + app/(platform)/
```

```
Is this a NEW TEMPLATE?
  → Add to templates/ folder
  → Register in templates/index.ts
  → Add template_id to Supabase CHECK constraint
  → Never touch existing templates
```

```
Is this a new THIRD-PARTY INTEGRATION (Medium, Dev.to, GitHub)?
  → Add fetch logic in lib/integrations/{provider}.ts
  → Add API proxy route in app/api/platform/integrations/{provider}/route.ts
  → Add provider to integrations table CHECK constraint
  → Add UI in app/dashboard/[slug]/integrations/page.tsx
```

---

## 🚫 THINGS THAT MUST NEVER HAPPEN

1. **Never import Firebase into Supabase code or vice versa**
2. **Never use the Supabase service role key in client-side code or public API routes**
3. **Never fetch data in Client Components** — pass from Server Components as props
4. **Never add `revalidate = 0` or `dynamic = 'force-dynamic'`** to user portfolio pages
5. **Never store user-uploaded images in `/public`** — always Cloudinary
6. **Never modify files in `lib/content/`, `lib/admin/`, `data/`, `app/(site)/`,
   `app/(admin)/`** unless fixing the Phase 0 bugs listed above
7. **Never add a new template by copying the portfolio page** — always use the
   `templates/` structure so it gets code-split automatically
8. **Never skip RLS** — every new Supabase table must have RLS enabled + policies

---

## 📦 PACKAGES TO INSTALL (as needed per phase)

```bash
# Phase 1 (Supabase)
npm install @supabase/supabase-js @supabase/ssr

# Phase 5 (Blogs)
npm install react-markdown remark-gfm
npm install rss-parser          # Medium RSS

# Phase 6 (Integrations)
# rss-parser already covers Medium
# Dev.to uses fetch (no package needed)

# Utility (install now)
npm install slugify              # for generating URL-safe slugs
```

---

## ✅ HOW TO USE THIS PROMPT IN CURSOR

1. Save this file as `CURSOR_MASTER_PROMPT.md` in your project root
2. At the start of every Cursor chat session, type:
   `@CURSOR_MASTER_PROMPT.md — I want to work on [specific feature]`
3. For new features, always say which Phase it belongs to
4. If Cursor suggests something that contradicts this document, this document wins
5. After completing each Phase, update the relevant section to mark it done

---

*Last updated: April 2026 — reflects full architecture discussion and code review*
*Owner portfolio: Next.js + Firebase + Cloudinary*
*Platform: Next.js + Supabase + Cloudinary + Vercel ISR*
