# WELEDA Influencer Voting Platform

A production-ready community voting platform for WELEDA's "Next Creator" campaign. Visitors vote for their favourite influencer, protected against bots and duplicate votes.

## Tech Stack

| Tool | Version |
|------|---------|
| Next.js (App Router) | 14.x |
| TypeScript | 5.x (strict mode) |
| Tailwind CSS | 3.x |
| Supabase | @supabase/supabase-js 2.x |
| Framer Motion | 11.x |
| React Hook Form + Zod | 7.x / 3.x |
| Deployment | Vercel |

## Prerequisites

- Node.js 18+
- npm 9+
- A [Supabase](https://supabase.com) project (already configured via `.mcp.json`)
- The `SUPABASE_SERVICE_ROLE_KEY` from your Supabase dashboard (Settings → API)

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.local.example .env.local

# 3. Fill in all values in .env.local (see section below)

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the 5 seeded creators.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (JWT) from Supabase dashboard | `eyJhb...` |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only** service role key — never expose to browser | `eyJhb...` |
| `SUPABASE_HASH_SALT` | Random secret for hashing emails/IPs | `myRandomSalt123!` |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Google reCAPTCHA v3 site key (optional) | `6Lc...` |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA v3 secret key (optional) | `6Lc...` |
| `NEXT_PUBLIC_SITE_URL` | Full public URL of the site | `https://voting.weleda.com` |
| `CAMPAIGN_END_DATE` | Campaign end date in YYYY-MM-DD format | `2026-04-30` |
| `ADMIN_USERNAME` | Admin panel username | `admin` |
| `ADMIN_PASSWORD` | Admin panel password — use a strong password | `Weleda2026!` |

### Getting the Service Role Key

1. Go to your [Supabase dashboard](https://supabase.com/dashboard)
2. Select your project (`tzsgkspjfiozkqqjlaeo`)
3. Navigate to **Settings → API**
4. Copy the **service_role** key (secret — keep it private)
5. Paste it into `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`

## Adding Influencers via Admin Panel

1. Navigate to `/admin` in your browser
2. Enter credentials (configured in `.env.local`)
3. Click **"Influencer"** in the sidebar
4. Click **"Neuen Influencer hinzufügen"**
5. Fill in the form: name, handle, bio, hashtags, photo, video
6. Click **"Creator hinzufügen"** — photo/video are uploaded to Supabase Storage

## Changing the Campaign End Date

Update `CAMPAIGN_END_DATE` in `.env.local` (or Vercel environment variables):

```
CAMPAIGN_END_DATE=2026-06-30
```

The voting button automatically disables and shows "Voting beendet" after this date.

## Vercel Deployment Checklist

- [ ] Push code to GitHub
- [ ] Create new Vercel project, connect the repository
- [ ] Add all environment variables from `.env.local` in Vercel dashboard
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your actual production URL
- [ ] Ensure `SUPABASE_SERVICE_ROLE_KEY` is set (required for vote API to work)
- [ ] Update `robots.txt` → replace `your-domain.com` with actual domain
- [ ] Set up a custom domain if needed
- [ ] Run a test vote after deployment

## Admin Panel

URL: `/admin`
Credentials: Set via `ADMIN_USERNAME` + `ADMIN_PASSWORD` env vars

### Admin Pages
- **Dashboard** — total votes, top 3, recent activity
- **Influencer** — add/edit/delete creators, toggle active status, upload photos/videos
- **Berichte** — summary table + individual vote log, CSV export

## Post-Campaign Data Cleanup

After the campaign ends, run this SQL in your Supabase SQL editor to remove vote data:

```sql
-- WARNING: This is irreversible. Run only after campaign is fully closed.
-- Export all data first using the admin panel CSV export.

DELETE FROM votes;

-- Optionally reset vote counts
UPDATE influencers SET vote_count = 0;
```

## Environment Setup

This project uses [dotenv-vault](https://www.dotenv.org) for encrypted environment variable management.

### First time setup on a new machine

```bash
# Authenticate with dotenv-vault
npx dotenv-vault login

# Pull the latest .env.local from the vault
npx dotenv-vault pull
```

### After changing any env variable

```bash
npx dotenv-vault push
```

### Vercel deployment

1. Run: `npx dotenv-vault keys production`
2. Copy the `DOTENV_KEY` value
3. Add to Vercel: **Settings → Environment Variables**
   - Key: `DOTENV_KEY`
   - Value: *(paste key)*
4. Vercel will automatically decrypt `.env.vault` at build time

### Security rules

- **NEVER** commit `.env` or `.env.local` — these are in `.gitignore`
- **NEVER** commit `.env.keys` — this contains decryption secrets
- **SAFE** to commit `.env.vault` — this is the encrypted version
- Store `DOTENV_KEY` in your password manager

---

## Troubleshooting

### "Vote API returns server_error"
→ Check that `SUPABASE_SERVICE_ROLE_KEY` is set and correct.
→ Check Supabase dashboard → Database → Table Editor → `votes` for RLS policies.

### "Images not loading from Supabase Storage"
→ Verify the storage buckets are set to public in Supabase Storage settings.
→ Check that the domain `tzsgkspjfiozkqqjlaeo.supabase.co` is in `next.config.ts` `remotePatterns`.

### "Admin panel returns 401"
→ Ensure `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set in env.
→ Browser may be caching credentials — open in private window.

### "Build fails with TypeScript errors"
→ Run `npm install` first to ensure all type definitions are available.
→ Run `npx tsc --noEmit` to see all type errors.

### "Votes not incrementing in real-time"
→ The page uses ISR (revalidate 60s). Refresh after 60 seconds or trigger a revalidation.
→ In production, vote counts update within 1 minute.
