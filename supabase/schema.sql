-- Campus Lost & Found Database Schema
-- Run this in Supabase SQL Editor

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

-- Enable Row Level Security
alter table items enable row level security;

-- Anyone can read items
create policy "Public read" on items
  for select using (true);

-- Authenticated users can insert
create policy "Auth insert" on items
  for insert with check (auth.uid() = user_id);

-- Owner can update their own item
create policy "Owner update" on items
  for update using (auth.uid() = user_id);

-- Create index for faster queries
create index idx_items_type on items(type);
create index idx_items_category on items(category);
create index idx_items_location on items(location);
create index idx_items_status on items(status);
create index idx_items_user_id on items(user_id);
create index idx_items_created_at on items(created_at desc);
