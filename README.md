# status.207

A cozy, slightly gamified portfolio for Kashi Kweyu. Soft pastel forest aesthetic, a splash screen, and three color themes that follow the time of day.

## Features

- **Three themes, auto-switched** — morning (light), dusk, and cabin (dark), driven by the visitor's local time. All colors are CSS custom properties, so every component is theme-aware for free.
- **Splash screen** — a small hello before the site fades in.
- **Ambient touches** — drifting leaves, pixel-font labels, serif headings.
- **Contact form** — Cloudflare Turnstile CAPTCHA + rate limiting, submissions stored in Supabase.
- **Admin dashboard** — session-protected area for reading contact submissions.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Backend | Supabase |
| Bot protection | Cloudflare Turnstile |
| Hosting | Vercel |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase key — never exposed to the client |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key (contact form) |
| `TURNSTILE_SECRET_KEY` | Turnstile server-side verification key |
| `ADMIN_PASSWORD` | Password for the admin dashboard login |

Database migrations live in `supabase/migrations/`.

## Project structure

```
app/            # Routes (App Router) — pages, admin, API
components/     # UI components (layout, icons, theme, ambient)
lib/            # Supabase clients, auth session helpers
styles/         # Additional styles
supabase/       # SQL migrations
```

Design tokens (colors, radii, fonts) are defined in `app/globals.css` — start there before styling anything.

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
