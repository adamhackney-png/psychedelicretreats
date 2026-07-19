# Psychedelic Retreats Australia

Independent Australian directory and information hub for legal psychedelic retreats
(international), Australian clinical services (ketamine, authorised psilocybin/MDMA
services), breathwork retreats, and integration practitioners. Content + directory
site — no bookings, no payments on-site, no user accounts. Revenue: affiliate links,
featured listings, enquiry-form lead generation.

**Owner:** Adam Hackney (adamhackney@gmail.com) · **Site contact:** info@psychedelicretreats.com.au

## Compliance rules (do not remove from templates)

These are baked into layouts/components — see [`CONTENT.md`](./CONTENT.md) before adding content:

1. No advertising of prescription-only medicines (TGA rules) — informational only, never promotional. No efficacy claims, no "treats/cures/heals" language, no therapeutic-outcome testimonials.
2. Australian psilocybin/MDMA and ketamine listings render in **neutral mode**: name, location, category, contact link only.
3. Every article has a medical disclaimer + "not medical advice" footer. Substance pages get a legal-status notice. Mental-health-adjacent pages get a Lifeline pointer.
4. Affiliate links use `rel="sponsored nofollow"` and the page shows an affiliate-disclosure notice.
5. No promotion of activity illegal in Australia; international pages state legality in the host jurisdiction only.

## Tech stack

- **Astro** (static output) + TypeScript + **Tailwind CSS v4** + MDX + `@astrojs/sitemap`
- Content collections (`src/content/`, schemas in `src/content.config.ts`): `listings`, `guides`, `news`, `destinations`, `authors`
- **Cloudflare Pages** hosting; **Cloudflare Pages Functions** (`/functions`) for the enquiry + operator claim/intake forms, with **Turnstile** anti-spam
- Search: **Pagefind** (static, zero cost)
- Analytics: Cloudflare Web Analytics (env var `PUBLIC_CF_ANALYTICS_TOKEN`)
- No database, no CMS, no client framework — Astro islands only where needed (quiz, filters, legality map)

## Project structure

```
/
├── functions/api/        # Cloudflare Pages Functions (enquire, claim)
├── src/
│   ├── components/       # Header, Footer, ListingCard, VettingChecklist, ...
│   ├── content/           # listings/ guides/ news/ destinations/ authors/ (.mdx)
│   ├── content.config.ts  # zod schemas for all collections
│   ├── data/               # static JSON (legality map, cost calculator data)
│   ├── layouts/
│   ├── lib/                 # site constants, SEO helpers
│   ├── pages/               # file-based routes
│   └── styles/global.css    # Tailwind v4 theme tokens (brand palette/fonts)
└── public/
```

## Commands

| Command             | Action                                      |
| :------------------- | :------------------------------------------- |
| `npm install`         | Install dependencies                         |
| `npm run dev`          | Start dev server at `localhost:4321`        |
| `npm run build`        | Build static site to `./dist/`              |
| `npm run preview`      | Preview the production build locally        |
| `npm run check`        | `astro check` — type errors across the site |
| `npm run check:links`  | Crawl `./dist/` for broken internal links (run after `build`) |

## Quality checks (Phase 5 baseline)

- **Type checking**: `npm run check` — 0 errors/warnings across the whole site.
- **Link check**: `npm run check:links` — crawls the built output for broken internal `<a href>` links.
- **Accessibility**: audited with `@axe-core/cli` against every page template (home, listing detail in both
  modes, category/clinic/integration pages, destinations, guides, news, all three tools, and every legal/utility
  page) — 0 violations. Re-run with `npx @axe-core/cli <url> [<url> ...]` against a running `npm run dev` server
  if you add new page types.
- **Lighthouse**: performance/accessibility/best-practices/SEO all ≥95 on every page sampled (most score
  99–100). One known exception: `/tools/legality-map/` scores ~93 on performance due to web-font-swap layout
  shift (CLS) — this is a font-loading characteristic shared by every page, it just crosses the threshold there
  because of that page's layout; consider `font-display: optional` or font preloading if you want to chase the
  last few points.

## Environment variables

Set these in **Cloudflare Pages → Settings → Environment variables** (Production and Preview):

| Variable                      | Used by                          | Notes                                              |
| :----------------------------- | :--------------------------------| :--------------------------------------------------|
| `TURNSTILE_SECRET`              | `/functions/api/*`               | Cloudflare Turnstile secret key (server-side)      |
| `PUBLIC_TURNSTILE_SITE_KEY`     | `EnquiryForm`/claim form (client) | Turnstile site key, safe to expose                 |
| `RESEND_API_KEY`                | `/functions/api/*`               | Or configure MailChannels instead — see below      |
| `CONTACT_EMAIL`                 | `/functions/api/*`               | `info@psychedelicretreats.com.au`                  |
| `MAILERLITE_API_KEY`            | quiz results delivery (future)   | Only needed if you move off the embedded form      |
| `PUBLIC_MAILERLITE_FORM_ID`     | `NewsletterSignup`, quiz         | MailerLite embedded form ID                        |
| `PUBLIC_CF_ANALYTICS_TOKEN`     | `BaseLayout`                     | Cloudflare Web Analytics token                     |
| `RETREATS_LOG_KV`               | `/functions/api/*` (KV binding)  | KV namespace binding for a JSON-line lead log       |

## Deploy runbook (30 minutes)

### 1. GitHub → Cloudflare Pages

1. Push this repo to GitHub (public or private both work).
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → select the repo.
3. Build settings: framework preset **Astro**, build command `npm run build`, output directory `dist`.
4. Deploy. Cloudflare Pages auto-detects `/functions` and deploys those as Pages Functions alongside the static build — no extra config needed.

### 2. Custom domain + bulk redirect

1. Add both `psychedelicretreats.com.au` and `psychedelicretreat.com.au` (singular typo-domain) as zones in the Cloudflare account.
2. Pages project → **Custom domains** → add `psychedelicretreats.com.au` (and `www` if desired).
3. **Bulk Redirects** (Cloudflare dashboard, not code): create a redirect list, rule `psychedelicretreat.com.au/*` → `https://psychedelicretreats.com.au/$1`, status 301, preserve query string. This is dashboard-only — there is no code representation of it in this repo.

### 3. Email Routing

1. Cloudflare dashboard → zone `psychedelicretreats.com.au` → **Email** → **Email Routing** → enable.
2. Add routing rule: `info@psychedelicretreats.com.au` → forward to `adamhackney@gmail.com`.
3. In Gmail: **Settings → Accounts and Import → Send mail as** → add `info@psychedelicretreats.com.au`, verify via the Cloudflare-forwarded confirmation email, so replies can go out from the brand address.

### 4. Turnstile + form email

1. Cloudflare dashboard → **Turnstile** → add a site, get **Site Key** + **Secret Key**.
2. Set `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET` as Pages env vars.
3. Sign up for **Resend** (free tier, 100 emails/day) or configure **MailChannels** — set `RESEND_API_KEY` (or MailChannels config) so `/functions/api/enquire` and `/functions/api/claim` can send mail.
4. Set `CONTACT_EMAIL=info@psychedelicretreats.com.au`.

### 5. MailerLite (newsletter + quiz lead magnet)

1. Create a free MailerLite account, create a form/group for the lead magnet and one for quiz results.
2. Copy the form ID into `PUBLIC_MAILERLITE_FORM_ID`. The `NewsletterSignup` component and quiz results screen use this — replace the placeholder `<form>` markup with MailerLite's official embed snippet once you have it, if you want their JS-driven UX instead of the plain HTML form included here.

### 6. Search Console / Analytics

1. Google Search Console + Bing Webmaster Tools: verify the domain, submit `/sitemap-index.xml`.
2. Cloudflare dashboard → **Web Analytics** → add site → copy the token into `PUBLIC_CF_ANALYTICS_TOKEN`.

## Content

See [`CONTENT.md`](./CONTENT.md) for the frontmatter reference and worked examples for adding a listing, guide, or news post.
