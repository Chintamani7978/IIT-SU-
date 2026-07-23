# Supabase setup

The app reads live data from Supabase when `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set, and silently falls back to
`lib/mockDb.ts` when they are not — so local development works with no setup.

## One-time project setup

1. Create a free project at [supabase.com](https://supabase.com) (one team member owns it; invite the rest as collaborators).
2. Open the project's **SQL Editor** and run, in order:
   1. `migrations/20260724000001_initial_schema.sql`
   2. `migrations/20260724000002_seed_catalog.sql`
3. In **Project Settings → API Keys**, copy the project URL and the
   **publishable** key into `.env.local` (see `.env.example`). Never put the
   secret/service role key in this repo or in any `NEXT_PUBLIC_` variable.
4. Add the same two variables to the Vercel project's environment settings.

## Google sign-in setup

1. In Google Cloud Console, create an OAuth 2.0 Client ID (type: Web application).
   - Authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
     (shown in the Supabase dashboard under **Authentication → Sign In / Providers → Google**).
2. In the Supabase dashboard, enable the **Google** provider and paste the
   client ID + secret.
3. Under **Authentication → URL Configuration**:
   - Site URL: the production URL (e.g. `https://suiit.site`)
   - Additional redirect URLs: `http://localhost:3000/**` and the Vercel
     preview domain, so login works in development too.

The app's login page (`/login`) redirects through `/auth/callback`, which
exchanges the OAuth code for a session.

## Verifying

- `npm run dev` → `/departments` should show the same catalog as before, now
  served from Postgres (check the Supabase dashboard's API logs to confirm).
- Table editor → `subjects` should contain 73 rows.

## Making yourself admin

Sign in once through the app (Phase 2), then in the SQL editor:

```sql
update public.profiles set role = 'admin' where id = '<your-user-uuid>';
```

User UUIDs are listed under **Authentication → Users**.

## Changing the subject catalog

Edit `lib/mockDb.ts` (it doubles as the seed source), regenerate and re-run
the seed:

```bash
node scripts/generate-seed.mjs
```

The seed is idempotent (`on conflict ... do update`), so re-running it in the
SQL editor updates existing rows in place.

## Notes for future migrations

- Files in `migrations/` are named `YYYYMMDDHHMMSS_description.sql`. Add new
  ones rather than editing applied ones; if the team later adopts the Supabase
  CLI, create files with `supabase migration new <name>`.
- New tables in `public` are NOT exposed through the Data API automatically on
  new Supabase projects — every new table needs explicit `grant` statements
  plus RLS policies (see the pattern in the initial schema migration).
