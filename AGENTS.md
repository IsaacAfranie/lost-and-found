# AGENTS.md — Campus Lost & Found

## Project Overview

A web app for KNUST students to post, browse, and claim lost and found items on campus. Built solo as an MVP with a clean path to stretch features.

**Stack:** React + Vite + Custom CSS · Supabase (auth, database, storage) · Vercel

---

## Repository Structure

```
campus-lost-found/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/            # Reusable primitives (Button, Input, Badge, Modal, etc.)
│   │   ├── ItemCard.jsx   # Card shown in browse/search listing
│   │   ├── ItemForm.jsx   # Shared form for posting lost or found items
│   │   ├── FilterBar.jsx  # Category / location / date / status filters
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Home.jsx       # Landing / hero
│   │   ├── Browse.jsx     # Search + filter + listing grid
│   │   ├── Post.jsx       # Create a lost or found post
│   │   ├── ItemDetail.jsx # Single item view + resolve action
│   │   └── Auth.jsx       # Sign-in (campus email via Supabase Auth)
│   ├── hooks/
│   │   ├── useItems.js    # Fetch, filter, paginate items
│   │   └── useAuth.js     # Session, sign-in, sign-out
│   ├── lib/
│   │   └── supabase.js    # Supabase client initialisation
│   ├── utils/
│   │   └── match.js       # Keyword/category matching helpers
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── supabase/
│   └── schema.sql         # Database schema (committed for reference)
├── AGENTS.md
└── README.md
```

---

## Environment Variables

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Never commit `.env`. Use `.env.example` with empty values as the template.

---

## Database Schema

```sql
-- supabase/schema.sql

create table items (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('lost', 'found')),
  title       text not null,
  description text,
  category    text not null,   -- e.g. 'Electronics', 'ID/Cards', 'Keys', 'Clothing', 'Books', 'Other'
  location    text not null,   -- campus location string; free text for MVP
  date_lost   date not null,
  image_url   text,
  status      text not null default 'open' check (status in ('open', 'resolved')),
  contact     text not null,   -- name + contact (phone or email)
  user_id     uuid references auth.users(id) on delete set null,
  created_at  timestamptz default now()
);

-- Enable Row Level Security
alter table items enable row level security;

-- Anyone can read open items
create policy "Public read" on items
  for select using (true);

-- Authenticated users can insert
create policy "Auth insert" on items
  for insert with check (auth.uid() = user_id);

-- Owner can update their own item
create policy "Owner update" on items
  for update using (auth.uid() = user_id);
```

### Categories (use these values consistently across frontend + DB)
`Electronics` · `ID/Cards` · `Keys` · `Clothing` · `Books` · `Bag/Wallet` · `Other`

### Campus Locations (seed these in a constants file)
`Main Gate` · `KNUST Library` · `Science Building` · `Unity Hall` · `Great Hall` · `Sports Complex` · `Commercial Area` · `Other`

---

## Supabase Storage

Bucket name: `item-images`  
Set bucket to **public** for read access.  
Upload path per item: `items/{user_id}/{uuid}.{ext}`  
Max file size: 5 MB. Accepted types: `image/jpeg`, `image/png`, `image/webp`.

---

## Build Order (follow this sequence)

### Step 1 — Project Setup & Auth
- Initialise Vite + React + Tailwind
- Install and configure Supabase client (`src/lib/supabase.js`)
- Implement `useAuth` hook: email/password sign-in via Supabase Auth (campus email)
- Build `Auth.jsx` page: sign-in + sign-up form
- Protect Post and ItemDetail resolve action behind auth check
- Run `schema.sql` in Supabase SQL editor; verify RLS policies

### Step 2 — Create Post Form
- Build `ItemForm.jsx` with fields: type (lost/found toggle), title, description, category (select), location (select), date, contact, image upload
- On submit: upload image to Supabase Storage → get public URL → insert row into `items`
- Show loading + success/error states clearly
- Wire to `Post.jsx` page at `/post`

### Step 3 — Browse & Search Page
- Build `useItems` hook: fetch items from Supabase with filters applied server-side (`.eq`, `.ilike`, `.gte`, `.lte`)
- Build `FilterBar.jsx`: type toggle (lost/found/all), category dropdown, location dropdown, date range, status (open/resolved)
- Build `ItemCard.jsx`: thumbnail, title, category badge, location, date, status chip, type label
- Wire to `Browse.jsx` at `/browse` with URL-synced filter params (use `useSearchParams`)
- Implement keyword search: `ilike` on title + description

### Step 4 — Item Detail Page
- Build `ItemDetail.jsx` at `/item/:id`
- Display all item fields + full image
- Show "Mark as Resolved" button only to the item owner (check `user_id === session.user.id`)
- On resolve: update `status` to `'resolved'` in Supabase

### Step 5 — Basic Matching
- In `Browse.jsx`, when a user searches for a lost item keyword, surface a "Possible Matches" section showing found items with overlapping category + keywords (use `match.js` utility)
- `match.js` logic: score items by category match (2pts) + keyword overlap in title/description (1pt each), sort descending, show top 5

### Step 6 — Polish & Deploy
- Add empty states for no results, loading skeletons for item grid
- Add 404 page
- Confirm Tailwind responsive layout works on mobile
- Deploy frontend to Vercel; set env vars in Vercel dashboard
- Test full flow: sign up → post lost item → post found item → search → resolve

---

## Stretch Features (post-MVP)

Tackle these only after Step 6 is done and the app is live.

| Feature | Notes |
|---|---|
| Image similarity matching | Use CLIP embeddings via Supabase Edge Function or a small Python service; compare cosine similarity of image vectors |
| Keyword notifications | When a new found item is posted, query open lost items for keyword overlap and send email via Supabase's `pg_net` + Resend/Sendgrid |
| Admin/moderator view | Add a `role` column to a `profiles` table; gate `/admin` route on `role = 'admin'`; show flagged/reported items |
| Map view | Embed a campus map (static SVG or Leaflet.js) with pin markers per item; store `lat/lng` or map location enum |
| Comments/messaging | Add a `messages` table (`item_id`, `sender_id`, `body`, `created_at`); show thread on `ItemDetail.jsx` |

---

## Code Conventions

- **Components:** PascalCase functional components with named exports
- **Hooks:** `use` prefix, in `src/hooks/`
- **Constants:** Campus locations, categories, and status values live in `src/utils/constants.js` — never hardcode strings inline
- **Error handling:** All Supabase calls must destructure `{ data, error }` and handle `error` before using `data`
- **Forms:** Use controlled inputs with `useState`; validate client-side before calling Supabase
- **Images:** Always store `image_url` (public URL string) in DB, never binary blobs
- **Auth guards:** Use a `<ProtectedRoute>` wrapper component around any route that requires login

---

## Key Files Quick Reference

| File | Purpose |
|---|---|
| `src/lib/supabase.js` | Single Supabase client instance, imported everywhere |
| `src/hooks/useAuth.js` | Session state, signIn, signUp, signOut |
| `src/hooks/useItems.js` | Fetch + filter items; returns `{ items, loading, error }` |
| `src/utils/constants.js` | Categories, locations, status values |
| `src/utils/match.js` | Keyword/category scoring for basic matching |
| `supabase/schema.sql` | Source-of-truth DB schema |

---

## Out of Scope for MVP

- Real-time chat (use email/phone contact info instead)
- Push notifications
- Multi-campus support
- Payment or deposit flows
- Mobile app