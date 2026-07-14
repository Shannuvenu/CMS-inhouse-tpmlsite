# The Printers (Mysore) Pvt. Ltd. — CMS

A full-stack content management system for a newspaper publisher — a public
website plus a password-protected admin dashboard, built with Next.js,
PostgreSQL, Prisma, and Clerk.

Publishes content for Deccan Herald, Prajavani, Sudha, and Mayura.

## What this is

Two things in one Next.js app:

1. **Public website** — Home, Brands, Team, Careers, Contact, Testimonials,
   Legacy. All server-rendered, all reading live from PostgreSQL.
2. **Admin CMS** at `/admin` — Clerk-based login, then full CRUD for team
   members, job openings (create/delete), career banners, offices/branches
   with contacts, a bulk JSON content editor, and header/footer menu
   management. No code changes needed for day-to-day content updates.

## Tech stack

| Tool | Role |
|---|---|
| Next.js (App Router) | Framework — public pages + admin panel in one codebase |
| TypeScript | Type safety across the whole app |
| PostgreSQL | Relational database |
| Prisma | ORM — type-safe queries, migrations |
| Clerk | Authentication — hosted login, user management, session handling |
| Vercel Blob | Image storage for team photos and career banners |
| Tailwind CSS | Styling |
| Docker | Local Postgres, identical across machines |

## Architecture, briefly

- **Public pages are Server Components.** Each page is an `async function`
  that calls Prisma directly (e.g. `prisma.teamMember.findMany()`) and
  renders the result — no separate API layer for reads.
- **Admin writes use Server Actions.** Forms in `/admin` call server
  functions directly (`src/app/admin/actions.ts`, `src/app/admin/offices/actions.ts`)
  — no hand-built API endpoints for mutations either.
- **Auth is handled by Clerk.** `src/middleware.ts` protects every
  `/admin/*` route; `src/app/admin/layout.tsx` additionally checks
  `auth()` server-side before rendering. User accounts are managed in
  Clerk's dashboard, not in this app's database — public sign-up is
  disabled, admins are invited manually.
- **Content stays in sync via `revalidatePath`.** Every admin write calls
  this after saving, so the public page reflects the change on the very
  next request — no caching lag, no manual rebuild.
- **Images are stored in Vercel Blob**, not on local disk — required for
  uploads to persist on Vercel's serverless infrastructure.

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
| `/login` | Admin sign-in | Clerk hosted UI |
| `/admin` | Dashboard | Protected by middleware + Clerk session check |
| `/admin/team` | Team CRUD, incl. photo upload | Server Actions |
| `/admin/careers` | Job postings — create/delete only, no edit | Server Actions |
| `/admin/career-banners` | Career page banner images | Server Actions |
| `/admin/offices` | Branches/offices + contacts, full CRUD | Server Actions |
| `/admin/content` | Bulk JSON editor | Syncs into real tables, or freeform `PageContent` |
| `/admin/menus` | Header/footer nav management | `MenuItem` |

## Getting started (local development)

```bash
npm install
docker compose up -d          # starts local Postgres
docker ps                     # confirm the container is running
npx prisma migrate dev        # applies all migrations
npx prisma db seed            # sample content (categories, brands, testimonials, offices)
npx ts-node --transpile-only prisma/seed-menu.ts   # populates header/footer nav
npm run dev
```

Open `http://localhost:3000`.

## Setting up admin access (Clerk)

1. Create a free account at [clerk.com](https://clerk.com), create an
   application
2. Copy the publishable + secret keys into `.env`:
3. In Clerk's dashboard: **User & Authentication → Restrictions** → disable
   public sign-up
4. **Users → Invite user** → add each real admin's email
5. They set a password via the invite email, then sign in at `/login`

## Setting up image uploads (Vercel Blob)

1. Vercel dashboard → project → **Storage** → **Create Database** → **Blob**
2. Copy the auto-generated `BLOB_READ_WRITE_TOKEN` into `.env` for local dev
   (production gets it automatically)

## Testing the full admin → public loop

1. `/admin/team` → add a team member with a photo → open `/team` in another
   tab → confirm they appear with the photo
2. `/admin/menus` → add a header item → refresh any public page → confirm
   it's in the nav
3. `/admin/offices` → add a branch with a contact → check `/contact`
4. `/admin/content` → click `brands` → edit a tagline → save → check
   `/brands`

If any of these don't reflect immediately, something's broken — that live
sync is the core feature of the CMS.

## Deployment

See `DEPLOYMENT.md` for the full walkthrough (Vercel + Neon Postgres).

**Two required steps for Vercel:**

1. Add this to `package.json` under `"scripts"`:
```json
   "postinstall": "prisma generate"
```
   Without it, Vercel's dependency caching can skip regenerating the Prisma
   Client, causing a build-time error.
2. Set all environment variables in Vercel's dashboard before deploying:
   `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`,
   `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`,
   `BLOB_READ_WRITE_TOKEN`.

## What's not built yet

- **Bulk job-posting edits** — postings are create-or-delete only by
  design; to change one, delete and re-add it.
- **In-app password reset for admins** — handled entirely through Clerk's
  own hosted flows, not a custom page in this app.

## Project structure