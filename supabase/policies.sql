-- Row Level Security policies for the CRM tables (clients, meetings,
-- interactions, quotes). Applied directly to the project's Supabase
-- database on 2026-08-21 — this file exists so the policies are version
-- controlled and reproducible (e.g. if the project is reset or cloned into
-- a new Supabase project).
--
-- Context: all four tables already had RLS enabled but zero policies,
-- which defaults to deny-everything — including for the authenticated
-- admin. That silently broke both the public forms' backup writes (a 401
-- "row-level security policy" error) and the admin dashboard reads (which
-- just came back as empty results, no error, since RLS filters rows
-- rather than raising for SELECT).
--
-- Model: anon (public site visitors) may INSERT leads only — no read
-- access to client PII. authenticated (the logged-in admin) has full
-- read/write access to everything.

-- Public (anon) visitors may create leads through the landing contact
-- form and the booking flow (backup writes alongside the n8n webhook),
-- but cannot read, edit, or delete anything. The app generates the
-- client id client-side (crypto.randomUUID()) rather than reading it back
-- via .select(), since INSERT ... RETURNING requires a SELECT policy to
-- pass under RLS and anon intentionally has none.
create policy "anon can insert clients" on public.clients
  for insert to anon with check (true);

create policy "anon can insert meetings" on public.meetings
  for insert to anon with check (true);

create policy "anon can insert interactions" on public.interactions
  for insert to anon with check (true);

-- Authenticated = the admin dashboard's logged-in Supabase Auth user.
-- Full read/write across all four CRM tables.
create policy "authenticated full access clients" on public.clients
  for all to authenticated using (true) with check (true);

create policy "authenticated full access meetings" on public.meetings
  for all to authenticated using (true) with check (true);

create policy "authenticated full access interactions" on public.interactions
  for all to authenticated using (true) with check (true);

create policy "authenticated full access quotes" on public.quotes
  for all to authenticated using (true) with check (true);
