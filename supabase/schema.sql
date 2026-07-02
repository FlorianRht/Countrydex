-- Countrydex — schéma Supabase
-- Exécute ce script dans : Supabase → SQL Editor → New query → Run

-- Tables
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  birth_country_code text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.visited_countries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  country_code text not null,
  visited_at date not null default current_date,
  is_starter boolean not null default false,
  unique (user_id, country_code)
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.visited_countries enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "visited_select_own" on public.visited_countries;
drop policy if exists "visited_insert_own" on public.visited_countries;
drop policy if exists "visited_delete_own" on public.visited_countries;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "visited_select_own"
  on public.visited_countries for select
  using (auth.uid() = user_id);

create policy "visited_insert_own"
  on public.visited_countries for insert
  with check (auth.uid() = user_id);

create policy "visited_delete_own"
  on public.visited_countries for delete
  using (auth.uid() = user_id and is_starter = false);

-- Starter automatique à l'inscription email (pays de naissance dans les metadata)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  birth_code text;
begin
  birth_code := upper(new.raw_user_meta_data->>'birth_country_code');

  -- Google OAuth : le starter est configuré après coup (onboarding ou cookie)
  if birth_code is null or birth_code = '' then
    return new;
  end if;

  insert into public.profiles (id, birth_country_code)
  values (new.id, birth_code);

  insert into public.visited_countries (user_id, country_code, is_starter)
  values (new.id, birth_code, true);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
