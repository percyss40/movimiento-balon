create table if not exists public.player_surveys (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  player_id text not null,
  player_name text not null,
  overall integer not null check (overall between 1 and 99),
  pace integer not null check (pace between 1 and 99),
  shooting integer not null check (shooting between 1 and 99),
  passing integer not null check (passing between 1 and 99),
  dribbling integer not null check (dribbling between 1 and 99),
  defense integer not null check (defense between 1 and 99),
  physical integer not null check (physical between 1 and 99)
);

alter table public.player_surveys enable row level security;

drop policy if exists "public can insert player surveys" on public.player_surveys;
create policy "public can insert player surveys"
on public.player_surveys
for insert
to anon, authenticated
with check (true);

drop policy if exists "authenticated can read player surveys" on public.player_surveys;
create policy "authenticated can read player surveys"
on public.player_surveys
for select
to authenticated
using (true);

drop policy if exists "authenticated can delete player surveys" on public.player_surveys;
create policy "authenticated can delete player surveys"
on public.player_surveys
for delete
to authenticated
using (true);
