# Deploying to AWS

I can't create AWS resources on your behalf from here (no access to your AWS
account), but here's a concrete, tested-pattern path. This is the simplest
route for a Next.js + Postgres app on AWS — not the only one, but the one
with the fewest moving parts for a college project deadline.

## The shape of it

```
Browser → AWS Amplify Hosting (runs your Next.js app, SSR included)
              ↓
          RDS PostgreSQL (managed Postgres, replaces your local Docker container)
              ↓
          S3 bucket (for uploaded images — local disk storage doesn't
                      survive on Amplify's infrastructure between deploys)
```

## Step 1 — Push your code to GitHub

Amplify deploys from a Git repository.

```powershell
git init
git add .
git commit -m "Stage 3: auth + admin dashboard"
```

Create a repo on GitHub, then:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/printers-mysore.git
git push -u origin main
```

(`.gitignore` already excludes `.env`, `node_modules`, `SEED_CREDENTIALS.md` —
your secrets won't be pushed.)

## Step 2 — Create an RDS PostgreSQL database

In the AWS Console:
1. **RDS → Create database**
2. Engine: **PostgreSQL**
3. Templates: **Free tier** (enough for a college project)
4. Set a master username/password — write these down
5. Under **Connectivity**, set **Public access: Yes** (simplest for now;
   you can lock this down later with a VPC)
6. Create the database, wait ~5 minutes, then copy its **endpoint** (looks
   like `printers-mysore-db.xxxxx.ap-south-1.rds.amazonaws.com`)

Your new `DATABASE_URL` will look like:
```
postgresql://youruser:yourpassword@printers-mysore-db.xxxxx.ap-south-1.rds.amazonaws.com:5432/printersmysore
```

## Step 3 — Create an S3 bucket for uploads

Local disk uploads (`public/uploads/`) work on your laptop but **will not
persist** on Amplify — its build output is redeployed fresh each time, so
anything written to disk at runtime disappears. Before deploying:

1. **S3 → Create bucket**, e.g. `printers-mysore-uploads`
2. Keep "Block all public access" **off** only for this bucket if you want
   images directly viewable — otherwise front it with CloudFront (more
   setup, skip for now)
3. Create an IAM user with `s3:PutObject` / `s3:GetObject` permissions
   scoped to that bucket, and generate an access key

Then swap `src/lib/uploads.ts`'s `saveUploadedFile` to upload to S3 instead
of `fs.writeFile` — the function signature (returns `{ url, fileName,
mimeType, sizeBytes }`) stays the same, so nothing else in the app needs to
change. This is a good next task once you're ready — happy to write that
swap when you get here.

## Step 4 — Deploy to Amplify Hosting

1. **AWS Amplify → Create app → Host web app → GitHub** → authorize and
   pick your repo/branch
2. Amplify auto-detects Next.js. Under **Environment variables**, add:
   - `DATABASE_URL` = the RDS connection string from Step 2
   - `AUTH_SECRET` = a fresh long random string (**not** the one in your
     local `.env`)
3. Deploy. First build takes a few minutes.

## Step 5 — Run migrations + seed against RDS

From your laptop, temporarily point at the production database:

```powershell
$env:DATABASE_URL="postgresql://youruser:yourpassword@printers-mysore-db.xxxxx.ap-south-1.rds.amazonaws.com:5432/printersmysore"
npx prisma migrate deploy
npx prisma db seed
```

`migrate deploy` (not `migrate dev`) applies existing migrations without
prompting — the right command for a real database.

**Before this step**, edit `DEV_PASSWORDS` in `prisma/seed.ts` to real
passwords — don't seed the production database with the same passwords
that are sitting in this repo.

## What this costs

RDS free tier + Amplify free tier covers a low-traffic college project for
12 months under a new AWS account. After that, expect roughly $15-25/month
for the smallest RDS instance running continuously — stopping the RDS
instance when not actively demoing avoids most of that cost.

## Alternative: skip AWS RDS, keep Postgres managed elsewhere

If Amplify + RDS setup is more than you need before the deadline, a faster
path that still counts as "not localhost": deploy the app to **Vercel**
(built by the Next.js team, zero-config for this stack) and the database to
**Neon** or **Supabase** (both have generous free Postgres tiers). Same
`DATABASE_URL` swap, no AWS console navigation required. Worth considering
if the deadline is tight — you can always migrate to AWS afterward for the
"real" deployment once the demo is done.
