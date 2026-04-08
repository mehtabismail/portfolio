# Portfolio Next.js (Phase 1 + Phase 2 foundation)

Next.js clone of the Dennis Snellenberg portfolio. Same look and structure, now with a Phase 2 content-provider foundation (static/dynamic mode switch).

## Run locally

Copy `env.template` to **`.env`** in this folder and fill in secrets (`.env` is gitignored). Then:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Next.js loads `.env` automatically.

## Build

```bash
npm run build
npm start
```

## Deploy (Vercel)

Use **Root Directory** `portfolio-next` if the repo root is the parent folder. Add the same keys as in **`env.template`** under Vercel → Environment Variables (see **`PHASE2_SETUP.md` § 9**). Do not commit `.env`; copy values manually into Vercel.

## Structure

- **`/`** – Home (hero, intro, recent work grid, tiles, horizontal items)
- **`/work`** – Work list with filters (All / Design / Development) and grid toggle (rows/columns)
- **`/work/[slug]`** – Project case study (11 projects: twice, the-damai, fabric, etc.)
- **`/about`** – About, services, Awwwards
- **`/contact`** – Contact form and details
- **`/archive`** – Archive placeholder

## Features (Phase 1)

- Loading screen (Hello/Bonjour/… then content reveal)
- Fixed nav (menu + socials) and hamburger
- Smooth scroll (Lenis)
- GSAP ScrollTrigger and magnetic buttons
- Work grid with category filter and rows/columns view
- Project data in `data/projects.ts` (mock; Phase 2 will use Firestore)
- All styles and assets from original site (in `public/assets`, `public/media`)

## Content modes (Phase 2.0)

- `static` mode: reads content from local `data/*.ts`
- `dynamic` mode: reads content from Firestore (image links from Cloudinary stored in Firestore)
- Optional fallback to static if dynamic fetch fails

See setup details in `PHASE2_SETUP.md`.

## Next phases

- **Phase 2:** Firebase Firestore for projects, site settings, about content
- **Phase 3:** Cloudinary for project images
- **Phase 4:** SEO polish, optional admin
