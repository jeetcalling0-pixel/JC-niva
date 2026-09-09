# JC NIVA — Digital Craftsmanship

A light, responsive Next.js website for independent coaches who need a clear, conversion-focused online presence. It includes a private Supabase-backed owner editor, honest testimonials, editable pricing, a contact form, and the supplied legal pages.

## Stack

- Next.js App Router and React
- Supabase Auth, Postgres, Storage and Realtime
- Plain responsive CSS; no UI-kit dependency
- Ready for Vercel

## Local development

1. Install Node 20+ and run `npm install`.
2. Copy `.env.example` to `.env.local` and add the Supabase project URL and anon key.
3. In the Supabase SQL editor, run `supabase/migrations.sql`.
4. Create the owner user `jeetcalling0@gmail.com` in **Authentication → Users** and set a strong password. Do not enable public sign-ups.
5. Add `SUPABASE_SERVICE_ROLE_KEY` only to your local terminal environment, then run `node scripts/seed-content.mjs`. Do not place this key in client code or commit it.
6. Run `npm run dev` and open `http://localhost:3000`. The owner editor is at `/admin`; it is intentionally not linked in public navigation.

Without Supabase variables, public pages still show the approved fallback content and legal documents. The contact form and owner editor correctly show configuration guidance instead of pretending to save data.

## Updating content

After the seed step, sign in at `/admin` with the owner account. The JSON editor manages all global public copy, CTA URLs, colours, SEO fields and pricing. Leave a package's `price` string empty to keep the price hidden. The dashboard also manages testimonial publication, legal-page content and uploads to the public `media` bucket. Published settings and testimonials are subscribed to through Supabase Realtime.

## Deployment

Create a Vercel project connected to the Git repository. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel environment settings. The service-role key is only needed for the one-time seed script and must never be exposed to the browser. Set the production URL in `src/app/layout.js`, `src/app/sitemap.js`, and `src/app/robots.js` after the final domain is known.

Run `npm run build` before deployment. The repository deliberately excludes secrets, `.env.local`, generated Next files and dependencies.
