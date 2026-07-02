-- Countrydex — schéma Supabase
-- Exécute ce script dans : Supabase → SQL Editor → New query → Run
-- Idempotent : fonctionne sur une base neuve ou déjà créée (sans colonne username).

-- Tables de base
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

-- Migration pseudo (ajout sur bases existantes)
alter table public.profiles add column if not exists username text;

update public.profiles
set username = 'exp_' || lower(substr(replace(id::text, '-', ''), 1, 8))
where username is null or trim(username) = '';

alter table public.profiles alter column username set not null;

alter table public.profiles drop constraint if exists profiles_username_length;
alter table public.profiles
  add constraint profiles_username_length check (char_length(username) between 3 and 20);

alter table public.profiles drop constraint if exists profiles_username_format;
alter table public.profiles
  add constraint profiles_username_format check (username ~ '^[a-zA-Z0-9_-]+$');

create unique index if not exists profiles_username_lower_idx
  on public.profiles (lower(username));

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
  user_username text;
begin
  birth_code := upper(new.raw_user_meta_data->>'birth_country_code');
  user_username := trim(new.raw_user_meta_data->>'username');

  -- Google OAuth : le starter est configuré après coup (onboarding)
  if birth_code is null or birth_code = '' then
    return new;
  end if;

  if user_username is null or user_username = '' then
    return new;
  end if;

  insert into public.profiles (id, username, birth_country_code)
  values (new.id, user_username, birth_code);

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
