# status.207 Portfolio

## Project overview

A cozy, slightly gamified portfolio site for Kashi Kweyu. Features a splash screen, three color themes (morning/dusk/cabin) that auto-switch based on time of day, and a soft, pastel forest aesthetic.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.2.7 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Backend | Supabase (auth sessions, contacts) |
| Hosting | Vercel |
| Bot protection | Cloudflare Turnstile |

## Design tokens

All colors are CSS custom properties in `app/globals.css`. Three themes:

| Token | Morning (light) | Dusk | Cabin (dark) |
|-------|-----------------|------|--------------|
| `--bg-page` | #d8e0d2 | #2a2e26 | #0E1410 |
| `--bg-card` | #e8ede2 | #353a30 | #161C17 |
| `--bg-linen` | #f4ecdc | #3f4438 | #1f2419 |
| `--moss` | #a8bb96 | #7a9072 | #6F8A4E |
| `--fern` | #7a9072 | #5a6e52 | #3D5A2E |
| `--rose` | #b8928f | #a8786f | #a8786f |
| `--rose-deep` | #966e6c | #8a5e58 | #8a5e58 |
| `--honey` | #d8b87a | #b89870 | #C89A3A |
| `--ink` | #4a4238 | #d8d0c2 | #EDE4C8 |
| `--whisper` | #8a8278 | #8a8278 | #6f7560 |

**Shape system:**
- `--radius-card`: 12px
- `--radius-btn`: 8px
- `--radius-pill`: 999px

**Fonts:**
- Serif: Fraunces (headings)
- Pixel: Pixelify Sans (labels, buttons)
- Mono: IBM Plex Mono (body, code)

## Repo structure

```
app/
├── (pages)/           # Route segments
│   ├── about/
│   ├── blog/
│   ├── contact/
│   ├── projects/
│   ├── shop/
│   └── skills/
├── admin/             # Protected admin dashboard
├── api/               # API routes
│   ├── admin/         # Admin auth endpoints
│   └── contact/       # Contact form submission
├── globals.css        # Design tokens + base styles
└── layout.tsx         # Root layout with fonts, themes

components/
├── ambient/           # Decorative elements (SoftLeaves)
├── icons/             # SVG icon components
├── layout/            # Header, Footer
├── theme/             # AutoTheme switcher
├── CookieConsent.tsx
└── SplashScreen.tsx

lib/
├── auth/              # Session management
└── supabase/          # Supabase clients

supabase/
└── migrations/        # SQL migrations
```

## Coding rules

1. **Tailwind 4 syntax**: Use canonical classes (`border-(--shadow)` not `border-[var(--shadow)]`)
2. **Mobile-first**: All layouts start mobile, scale up with `sm:`, `md:`, `lg:`
3. **Theme-aware colors**: Use CSS custom properties for all colors
4. **No emoji in code**: Unless user explicitly requests
5. **Atomic commits**: One concern per commit, max 6 files, max 250 lines changed
6. **Server components by default**: Only use `"use client"` when needed

## Git rules

- Branch from `main` for features: `feat/`, `fix/`, `chore/`
- No AI attribution in commits
- Commit messages: plain descriptive or conventional prefixes
- Never commit `.env*` files or secrets
- Never commit `.claude/` directory

## Testing rules

[NO TEST FRAMEWORK CONFIGURED - add when needed]

## Security rules

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client
- Admin routes protected by session verification
- Contact form has rate limiting + Turnstile CAPTCHA
- Never commit secrets to version control

## Current status

- [x] Core pages (home, about, skills, blog, contact)
- [x] Three-theme system with auto-switching
- [x] Splash screen
- [x] Cookie consent modal
- [x] Admin dashboard (auth protected)
- [x] Contact form with Supabase storage
- [ ] Blog posts connected to database
- [ ] Projects page content
- [ ] Shop functionality

## Known issues

- Linter cache sometimes shows stale warnings (restart VS Code to fix)
- Blog posts currently use temporary state, not Supabase

## Agent instructions

When working on this codebase:

1. Read `app/globals.css` for design tokens before styling
2. Check `components/icons/` for existing icons before creating new ones
3. Use `lib/supabase/server.ts` for server-side Supabase operations
4. Use `lib/supabase/client.ts` for client-side operations
5. Run `npm run lint` before committing
6. Follow the commit discipline in the global CLAUDE.md preferences
