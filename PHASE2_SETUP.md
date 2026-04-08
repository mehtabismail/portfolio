# Phase 2 Setup Guide (Firestore + Cloudinary)

This project now supports two content flows:

- `static` mode: uses local files in `data/`
- `dynamic` mode: uses Firestore + Cloudinary URLs from Firestore

## 1) Choose content mode

Copy `env.template` to **`.env`** in `portfolio-next/` and set values (`.env` is gitignored). Use the same variable names on Vercel.

- `NEXT_PUBLIC_CONTENT_MODE=static` for local files
- `NEXT_PUBLIC_CONTENT_MODE=dynamic` for Firestore

Optional safety fallback:

- `NEXT_PUBLIC_DYNAMIC_FALLBACK_TO_STATIC=true`

If dynamic fetch fails, app falls back to local static data.

## 2) Firebase project (required for dynamic mode)

Create Firebase project named:

- `dynamic-portfolio`

Note: Firebase may append an ID suffix in the actual `project_id` (example: `dynamic-portfolio-76b69`).
Always use the exact `project_id` from your service-account JSON in `FIREBASE_PROJECT_ID`.

Enable Firestore and create these collections/documents:

- `user/main`
- `site/main`
- `contact/main`
- `projects/*` (one doc per project)

You can skip manual creation if you run the seeder command in step 6; it will create/update all required docs automatically.

### Expected structure

- `user/main`: same shape as `data/user.ts`
- `site/main`: same shape as `data/site.ts`
- `contact/main`: same shape as `data/contact.ts`
- `projects/{doc}`: same shape as `Project` in `data/projects.ts`

For project media, store Cloudinary URLs (or public IDs resolved to URLs) in fields like:

- `thumbnailUrl`
- `thumbnailHoverUrl`
- `heroImage` (optional)
- `gallery` (optional)

## 3) Firebase Admin credentials

In `.env` set:

- `FIREBASE_PROJECT_ID=dynamic-portfolio`
- `FIREBASE_CLIENT_EMAIL=...`
- `FIREBASE_PRIVATE_KEY=...`

Notes:

- Keep quotes around private key if needed.
- Convert actual line breaks to `\n` if required by your shell.

## 4) Cloudinary naming

Use a separate root folder:

- `dynamic-portfolio/projects/{slug}/...`

This avoids conflicts with existing portfolio assets.

## 5) Verify modes

### Static mode test

1. Set `NEXT_PUBLIC_CONTENT_MODE=static`
2. Run app
3. Confirm all content matches local `data/*.ts`

### Dynamic mode test

1. Set `NEXT_PUBLIC_CONTENT_MODE=dynamic`
2. Ensure Firestore has seeded docs
3. Run app
4. Change one field in Firestore and verify site updates

### Fallback test

1. Keep `dynamic` mode and `NEXT_PUBLIC_DYNAMIC_FALLBACK_TO_STATIC=true`
2. Break one Firebase env var
3. Confirm app still renders static data

## 6) Seed Firestore from current local data (Phase 2.4)

Run:

```bash
npm run seed:firestore
```

This creates/updates:

- `user/main`
- `site/main`
- `contact/main`
- `projects/{slug}` for all projects in `data/projects.ts`

Seeder also writes:

- `createdAt`
- `updatedAt`

for singleton docs and each project doc.

## 7) Verify dynamic data integrity

Run:

```bash
npm run verify:dynamic
```

It checks:

- `user/main`, `site/main`, `contact/main` exist with required fields
- `projects` collection exists and each doc has required fields
- includes validation for `isPublished`

## 8) Media preparation helpers (Cloudinary migration)

First, set Cloudinary env vars in `.env`:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_ROOT_FOLDER=dynamic-portfolio` (recommended)

### Populate media placeholders

```bash
npm run sync:media-placeholders
```

This will set missing fields on each project:

- `heroImageUrl` (defaults to `thumbnailUrl`)
- `gallery` (defaults to `[thumbnailUrl]`)
- `isPublished` (defaults to `true`)

### Validate media fields

```bash
npm run verify:media
```

Checks required image fields per project and reports Cloudinary URL coverage.

### Upload local media to Cloudinary and update Firestore automatically

```bash
npm run migrate:media-cloudinary
```

Optional force re-upload even if URL already points to Cloudinary:

```bash
npm run migrate:media-cloudinary -- --force
```

This script:

- uploads `thumbnailUrl` and `thumbnailHoverUrl` source files from `public/...`
- stores assets in `dynamic-portfolio/projects/{slug}/...`
- updates Firestore `projects/{slug}` docs with Cloudinary secure URLs

## 9) Deploy to Vercel (production)

**What you do (Vercel dashboard + Git)**

1. Push this app to GitHub/GitLab/Bitbucket (include the `portfolio-next` folder).
2. In [Vercel](https://vercel.com): **Add New Project** → import the repo.
3. If the repository root is the parent of `portfolio-next`, set **Root Directory** to `portfolio-next` (Install / Build / Output run from there).
4. **Environment variables** — add the same names as **`env.template`** / your local `.env` (at least for **Production**; add **Preview** too if dynamic mode should run on preview URLs). Do not upload `.env` to Git; paste each key in the Vercel UI.

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_CONTENT_MODE` | `dynamic` or `static` |
| `NEXT_PUBLIC_DYNAMIC_FALLBACK_TO_STATIC` | `true` recommended until you trust production |
| `FIREBASE_PROJECT_ID` | Exact project id from the service account JSON |
| `FIREBASE_CLIENT_EMAIL` | From service account JSON |
| `FIREBASE_PRIVATE_KEY` | Full private key; Vercel multiline field is OK, or one line with `\n` |
| `CONTENT_REVALIDATE_SECONDS` | Optional; default `60` |

**Do not** add `CLOUDINARY_*` to Vercel unless you run upload scripts from CI; the site reads image URLs from Firestore.

5. Deploy. After the first deploy, open the production URL and smoke-test Home, Work, one project, About, Contact.

**What’s already done in the repo**

- `package.json` includes `engines.node` (>= 20.9) so Vercel picks a compatible Node.
- Build is standard `next build` (no custom `vercel.json` required).

**Scripts (local / CI only, not required on Vercel)**

- `npm run seed:firestore`, `migrate:media-cloudinary`, etc. stay on your machine or a secure runner with env vars; they are not part of the Vercel build.

## Next implementation step (optional)

- On-demand revalidation when Firestore content changes (admin or webhook).
- Richer project pages (`heroImageUrl`, `gallery`, `videoUrl`) wired end-to-end.
- Small admin UI to edit Firestore.
