# The Printers (Mysore) Pvt. Ltd. — CMS

A full-stack content management system for a newspaper publisher — a public
website plus a password-protected admin dashboard, built with Next.js,
PostgreSQL, and Prisma.

Publishes content for Deccan Herald, Prajavani, Sudha, and Mayura.

## What this is

Two things in one Next.js app:

1. **Public website** — Home, Brands, Team, Careers, Contact, Testimonials,
   Legacy. All server-rendered, all reading live from PostgreSQL.
2. **Admin CMS** at `/admin` — session-based login, then full CRUD for team
   members, job openings, career banners, a bulk JSON content editor, and
   header/footer menu management. No code changes needed for day-to-day
   content updates.

## Tech stack

| Tool | Role |
|---|---|
| Next.js (App Router) | Framework — public pages + admin panel in one codebase |
| TypeScript | Type safety across the whole app |
| PostgreSQL | Relational database |
| Prisma | ORM — type-safe queries, migrations |
| bcryptjs | Password hashing for admin accounts |
| Tailwind CSS | Styling |
| Docker | Local Postgres, identical across machines |

## Architecture, briefly

- **Public pages are Server Components.** Each page is an `async function`
  that calls Prisma directly (e.g. `prisma.teamMember.findMany()`) and
  renders the result — no separate API layer for reads.
- **Admin writes use Server Actions.** Forms in `/admin` call server
  functions directly (`src/app/admin/actions.ts`) — no hand-built API
  endpoints for mutations either.
- **Auth is session-based, not JWT.** Login creates a row in a `Session`
  table and sets a signed HTTP-only cookie. `middleware.ts` verifies the
  cookie's signature on every `/admin/*` request (fast, no DB call); the
  admin layout then does a real database lookup to confirm the session
  hasn't expired or been revoked. Chosen over JWT because access can be
  instantly revoked by deleting a row — relevant with a small, known set of
  admin users.
- **Content stays in sync via `revalidatePath`.** Every admin write calls
  this after saving, so the public page reflects the change on the very
  next request — no caching lag, no manual rebuild.

## Pages

| Route | What it shows | Data source |
|---|---|---|
| `/` | Hero, live stats | `SiteSetting` |
| `/brands` | Deccan Herald, Prajavani, Sudha, Mayura | `Brand` |
| `/team` | Team grouped by category | `TeamCategory` + `TeamMember` |
| `/careers` | Open job listings | `JobOpening` (status = OPEN) |
| `/careers/[slug]` | One job's detail page | Dynamic route |
| `/contact` | Offices + contacts by region | `Office` + `OfficeContact` |
| `/testimonials` | Reader/advertiser quotes | `Testimonial` |
| `/legacy` | Freeform history page | `PageContent` (JSON, key="legacy") |
| `/login` | Admin sign-in | `User`, bcrypt-verified |
| `/admin` | Dashboard | Protected by middleware + session check |
| `/admin/team`, `/admin/careers`, `/admin/career-banners` | CRUD forms | Server Actions |
| `/admin/content` | Bulk JSON editor | Syncs into real tables, or freeform `PageContent` |
| `/admin/menus` | Header/footer nav management | `MenuItem` |

## Getting started (local development)

```bash
npm install
docker compose up -d          # starts local Postgres
docker ps                     # confirm the container is running
npx prisma migrate dev        # applies all migrations
npx prisma db seed            # creates 5 admin accounts + sample content
npx ts-node --transpile-only prisma/seed-menu.ts   # populates header/footer nav
npm run dev
```

Open `http://localhost:3000`.

Admin login credentials are in `SEED_CREDENTIALS.md` (not committed — see
`.gitignore`). Log in at `/login`, then visit `/admin`.

## Testing the full admin → public loop

1. `/admin/team` → add a team member → open `/team` in another tab → confirm they appear
2. `/admin/menus` → add a header item → refresh any public page → confirm it's in the nav
3. `/admin/content` → click `brands` → edit a tagline → save → check `/brands`

If any of these don't reflect immediately, something's broken — that live
sync is the core feature of the CMS.

## Deployment

See `DEPLOYMENT.md` for the full walkthrough (Vercel + Neon Postgres).

**One required step for Vercel specifically:** add this to `package.json`
under `"scripts"` before deploying:
```json
"postinstall": "prisma generate"
```
Without it, Vercel's dependency caching can skip regenerating the Prisma
Client, causing a build-time error. This is a known Vercel + Prisma
interaction, not a bug in this codebase — see
[pris.ly/d/vercel-build](https://pris.ly/d/vercel-build).

## What's not built yet

- **Cloud image storage** — uploads currently save to local disk
  (`public/uploads`), which works locally but won't persist on serverless
  hosts like Vercel. Needs an S3 (or similar) swap before production
  image uploads are reliable.
- **Password change UI** — seeded admin passwords should be rotated before
  any real deployment; currently done by editing `prisma/seed.ts` and
  re-seeding.

## Project structure

```
prisma/
  schema.prisma       — all database models
  seed.ts             — admin users + sample content
  seed-menu.ts         — header/footer nav items
src/
  app/
    (public pages)     — page.tsx, brands/, team/, careers/, contact/, testimonials/, legacy/
    login/              — sign-in page + server action
    admin/              — dashboard, CRUD pages, content editor, menu management
  components/           — Header, Footer
  lib/                  — prisma client, auth, session signing, validation helpers
  middleware.ts          — protects /admin/*
```