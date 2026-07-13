This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

# Stage 3 — Admin Dashboard (No Auth Yet, By Design)

## What's new
Full CRUD admin panel at `/admin` for Team Members and Job Openings, using
Next.js Server Actions (no separate API routes needed — that's the modern
Next.js pattern, not a shortcut).

- `/admin` — dashboard with counts
- `/admin/team` — list, add, edit, delete team members (grouped by category)
- `/admin/careers` — list, add, edit, delete job openings
- Deleting asks for confirmation first (can't be undone, and there's no
  "trash" — it's a real DB delete).
- Saving a team member or job change calls `revalidatePath` on the matching
  public page, so the public site updates immediately, same request. Test
  this explicitly, don't just trust it.

## ⚠️ Read this before you do anything else
**There is no login. `/admin` is wide open to anyone with the URL.** This
was your explicit call — build CRUD first, auth last — and that's a fine
sequencing decision for building this out correctly. But it means:
- Do NOT deploy this build to a public URL (Vercel, etc.) as-is.
- If you demo this to mam before auth exists, say so directly: "auth isn't
  wired in yet, that's the next piece." Don't let her discover it herself.
- The moment you build auth, every function in `src/app/admin/actions.ts`
  needs a session check added as its first line. I left a comment block at
  the top of that file explaining exactly what goes where.

## Run it
```bash
npm install
docker compose up -d
docker ps                          # confirm the DB container is up
npx prisma generate                # regenerate client (schema unchanged, but do this after any npm install)
npm run dev
```
Open `http://localhost:3000/admin` in your browser.

## Test the full loop — do this, don't skip it
1. Go to `/admin/team` → Add team member → fill in name, designation, pick
   a category → Create.
2. Open `/team` in another tab → confirm the new member shows up.
3. Go back to `/admin/team` → Edit that member → change the designation →
   Save.
4. Refresh `/team` → confirm the change reflects.
5. Delete the member → confirm the confirmation dialog appears → confirm →
   check `/team` again → member is gone.
6. Repeat the same loop for `/admin/careers` and `/careers` — including
   setting status to "Open" and confirming it actually shows up (jobs with
   status "Draft" intentionally stay hidden from the public careers page —
   that's not a bug, that's the point of having a status field).

If any of those 6 steps don't behave as described, something's broken —
tell me exactly which step failed and what you saw instead.

## What's still missing (don't tell mam this part is done)
- **Login/auth** — next task, as agreed.
- **Image uploads** — `TeamMember.photoId` and `CareerBanner` exist in the
  schema but there's no upload UI or file storage wired up. Team photos
  currently can't be added through the admin panel at all. Decide your
  storage approach (local disk vs. Cloudinary/S3) before building this —
  it changes the implementation.
- **Form validation beyond "required" fields** — e.g. nothing stops
  duplicate emails, garbage-length text, or a negative sort order.
- **TeamCategory management** — categories were seeded once and can't be
  added/edited/deleted through the UI. Fine for now since your 4 categories
  match mam's example exactly, but flag it if she asks for a 5th category.

## Known non-issue if you see it
Running `next build` inside sandboxed/Linux CI environments different from
your own machine can throw font-fetch or native-binary errors unrelated to
this code (cross-platform binary mismatch, blocked font CDN). If you hit
something like that specifically in a CI pipeline, it's an environment
problem, not a code problem — run `npm run build` locally on your own
machine to get the real signal.

