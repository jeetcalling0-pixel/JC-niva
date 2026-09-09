-- Run in the Supabase SQL editor before configuring the site.
create extension if not exists "pgcrypto";

create table if not exists public.site_settings (
  id text primary key check (id = 'global'),
  content jsonb not null default '{}'::jsonb,
  updated_by text,
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  company text,
  quote text not null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  country text,
  website text,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.legal_documents (
  slug text primary key check (slug in ('privacy', 'terms', 'disclaimer')),
  title text not null,
  content text not null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings for each row execute procedure public.set_updated_at();
drop trigger if exists testimonials_updated_at on public.testimonials;
create trigger testimonials_updated_at before update on public.testimonials for each row execute procedure public.set_updated_at();
drop trigger if exists legal_documents_updated_at on public.legal_documents;
create trigger legal_documents_updated_at before update on public.legal_documents for each row execute procedure public.set_updated_at();

alter table public.site_settings enable row level security;
alter table public.testimonials enable row level security;
alter table public.enquiries enable row level security;
alter table public.legal_documents enable row level security;

create policy "public reads global settings" on public.site_settings for select using (id = 'global');
create policy "owner manages global settings" on public.site_settings for all to authenticated using ((auth.jwt() ->> 'email') = 'jeetcalling0@gmail.com') with check ((auth.jwt() ->> 'email') = 'jeetcalling0@gmail.com');

create policy "public reads published testimonials" on public.testimonials for select using (published = true);
create policy "owner manages testimonials" on public.testimonials for all to authenticated using ((auth.jwt() ->> 'email') = 'jeetcalling0@gmail.com') with check ((auth.jwt() ->> 'email') = 'jeetcalling0@gmail.com');

create policy "anonymous visitors submit enquiries" on public.enquiries for insert to anon, authenticated with check (true);
create policy "owner reads enquiries" on public.enquiries for select to authenticated using ((auth.jwt() ->> 'email') = 'jeetcalling0@gmail.com');

create policy "public reads legal pages" on public.legal_documents for select using (true);
create policy "owner manages legal pages" on public.legal_documents for all to authenticated using ((auth.jwt() ->> 'email') = 'jeetcalling0@gmail.com') with check ((auth.jwt() ->> 'email') = 'jeetcalling0@gmail.com');

insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do update set public = true;
create policy "public reads public media" on storage.objects for select using (bucket_id = 'media');
create policy "owner manages media" on storage.objects for all to authenticated using (bucket_id = 'media' and (auth.jwt() ->> 'email') = 'jeetcalling0@gmail.com') with check (bucket_id = 'media' and (auth.jwt() ->> 'email') = 'jeetcalling0@gmail.com');

do $$ begin
  alter publication supabase_realtime add table public.site_settings;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.testimonials;
exception when duplicate_object then null; end $$;
