-- Movimiento Balon: setup simple para guardar la app completa como JSON.
-- Pegalo en Supabase > SQL Editor > New query > Run.

create table if not exists public.app_state (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

drop policy if exists "Public can read app state" on public.app_state;
create policy "Public can read app state"
on public.app_state for select
to anon, authenticated
using (true);

drop policy if exists "Logged users can insert app state" on public.app_state;
create policy "Logged users can insert app state"
on public.app_state for insert
to authenticated
with check (true);

drop policy if exists "Logged users can update app state" on public.app_state;
create policy "Logged users can update app state"
on public.app_state for update
to authenticated
using (true)
with check (true);

insert into public.app_state (id, data)
values ('main', '{"players":[],"matches":[]}'::jsonb)
on conflict (id) do nothing;
