-- =============================================================================
-- Campus Lost & Found — COMPLETE FRESH SETUP
-- Run this entire file in the Supabase SQL Editor on a NEW project.
-- =============================================================================

-- ── 1. ITEMS ─────────────────────────────────────────────────────────────────

create table items (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('lost', 'found')),
  title       text not null,
  description text,
  category    text not null,
  location    text not null,
  date_lost   date not null,
  image_url   text,
  status      text not null default 'open' check (status in ('open', 'resolved')),
  contact     text not null,
  user_id     uuid references auth.users(id) on delete set null,
  created_at  timestamptz default now()
);

alter table items enable row level security;

-- Public listing (app uses items_public view which omits contact)
create policy "Public read items" on items
  for select using (true);

create policy "Auth insert" on items
  for insert with check (auth.uid() = user_id);

create policy "Owner update" on items
  for update using (auth.uid() = user_id);

create policy "Owner delete" on items
  for delete using (auth.uid() = user_id);

create or replace view items_public as
  select
    id, type, title, description, category, location,
    date_lost, image_url, status, user_id, created_at
  from items;

grant select on items_public to anon, authenticated;

-- ── 2. PROFILES (required before claims) ─────────────────────────────────────

create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  role       text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function is_admin() to authenticated;

create policy "Users read own profile" on profiles
  for select using (auth.uid() = id);

create policy "Admin read all profiles" on profiles
  for select using (is_admin());

create policy "Users insert own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "Users update own profile" on profiles
  for update using (auth.uid() = id);

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── 3. CLAIMS ────────────────────────────────────────────────────────────────

create table claims (
  id           uuid primary key default gen_random_uuid(),
  item_id      uuid not null references items(id) on delete cascade,
  claimant_id  uuid not null references profiles(id) on delete cascade,
  message      text,
  status       text not null default 'pending'
               check (status in ('pending', 'approved', 'rejected')),
  created_at   timestamptz default now(),
  reviewed_at  timestamptz,
  unique (item_id, claimant_id)
);

alter table claims enable row level security;

create policy "Auth insert claim" on claims
  for insert with check (
    auth.uid() = claimant_id
    and exists (
      select 1 from items
      where id = item_id
        and status = 'open'
        and user_id is distinct from auth.uid()
    )
  );

create policy "User read own claims" on claims
  for select using (auth.uid() = claimant_id);

create policy "Admin read all claims" on claims
  for select using (is_admin());

create policy "Admin update claims" on claims
  for update using (is_admin());

create policy "Admin read all items" on items
  for select using (is_admin());

create policy "Admin update items" on items
  for update using (is_admin());

-- ── 4. SECURE CONTACT RPC ────────────────────────────────────────────────────

create or replace function get_item_contact(p_item_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_contact text;
  v_user_id uuid;
begin
  select contact, user_id into v_contact, v_user_id
  from items where id = p_item_id;

  if v_contact is null then return null; end if;
  if auth.uid() = v_user_id then return v_contact; end if;

  if exists (
    select 1 from claims
    where item_id = p_item_id
      and claimant_id = auth.uid()
      and status = 'approved'
  ) then
    return v_contact;
  end if;

  return null;
end;
$$;

grant execute on function get_item_contact(uuid) to authenticated;

-- ── 5. INDEXES ───────────────────────────────────────────────────────────────

create index idx_items_type on items(type);
create index idx_items_category on items(category);
create index idx_items_location on items(location);
create index idx_items_status on items(status);
create index idx_items_user_id on items(user_id);
create index idx_items_created_at on items(created_at desc);
create index idx_claims_item_id on claims(item_id);
create index idx_claims_claimant_id on claims(claimant_id);
create index idx_claims_status on claims(status);

-- ── 6. STORAGE POLICIES ───────────────────────────────────────────────────────
-- Skip bucket creation if you already have a public bucket named "item-images".
-- Upload path in the app: items/{user_id}/{filename}

drop policy if exists "Auth users can upload item images" on storage.objects;
drop policy if exists "Anyone can view item images" on storage.objects;
drop policy if exists "Users can update own item images" on storage.objects;
drop policy if exists "Users can delete own item images" on storage.objects;

create policy "Auth users can upload item images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'item-images'
  and (storage.foldername(name))[1] = 'items'
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "Anyone can view item images"
on storage.objects for select to public
using (bucket_id = 'item-images');

create policy "Users can update own item images"
on storage.objects for update to authenticated
using (
  bucket_id = 'item-images'
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "Users can delete own item images"
on storage.objects for delete to authenticated
using (
  bucket_id = 'item-images'
  and (storage.foldername(name))[2] = auth.uid()::text
);

-- =============================================================================
-- AFTER RUNNING THE ABOVE:
--
-- 1. Update your .env with THIS project's URL and anon key:
--      VITE_SUPABASE_URL=https://xxxx.supabase.co
--      VITE_SUPABASE_ANON_KEY=eyJ...
--
-- 2. Sign up in the app (#auth), then backfill your profile:
--      insert into profiles (id, email, role)
--      select id, email, 'user' from auth.users
--      on conflict (id) do update set email = excluded.email;
--
-- 3. Make yourself admin:
--      update profiles set role = 'admin' where email = 'your@email.com';
--
-- 4. Set admin contact in .env:
--      VITE_ADMIN_NAME=Campus Lost & Found Office
--      VITE_ADMIN_EMAIL=admin@knust.edu.gh
--      VITE_ADMIN_PHONE=+233...
--
-- 5. Restart dev server: npm run dev
-- =============================================================================
