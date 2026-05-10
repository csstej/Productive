# Productive
Be Productive

Live app: https://csstej.github.io/Productive/

## Account Sync

The app can run local-only, or sync across devices with Supabase.

To enable account sync:

1. Create a Supabase project.
2. Run `docs/supabase.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Restart the dev server.

Login uses Supabase email magic links.
