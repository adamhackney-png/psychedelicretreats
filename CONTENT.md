# Content Guide

How to add a listing, guide, or news post to Psychedelic Retreats Australia. This file is the
reference for any automation (human or otherwise) adding content — follow it exactly. The
authoritative schema is `src/content.config.ts`; if this document and that file ever disagree,
the schema wins — update this file to match.

All content lives in `src/content/<collection>/<slug>.mdx`. **The filename (without `.mdx`) is
the slug** — it becomes the URL segment and must be lowercase, hyphenated, no spaces (e.g.
`beckley-retreats-netherlands.mdx` → `/listing/beckley-retreats-netherlands/`).

Every collection file is an MDX file: YAML frontmatter between `---` lines, then a Markdown/MDX
body. `{/* ... */}` in the body is a JSX comment — it does not render. Use it for internal
editorial notes (see "TODO-ADAM convention" below) instead of writing them as visible text.

## Non-negotiable rules before you add anything

1. **Never write efficacy or promotional claims about a substance.** No "treats," "cures," "heals," no therapeutic-outcome testimonials. Informational tone only.
2. **Every fact needs a `sourceUrls` entry.** If you can't source a fact, don't state it as fact — mark it with a TODO-ADAM note instead (see below) or omit it.
3. **Neutral-mode listings** (`mode: "neutral"` — Australian ketamine/psychedelic-assisted-therapy services) get **one factual sentence** in the body. No description beyond that, no promotional framing, no pricing fields, no image gallery (at most a single logo image).
4. **New listings are always `claimed: false`.** Only the operator (via the claim form) or Adam directly should ever set `claimed: true`.
5. **New guides/news are always `draft: true`** unless Adam has explicitly reviewed and approved the content for `draft: false`. Draft content still renders on the site (with a visible "Draft — pending editorial review" banner and `noindex`) — it is not hidden, just flagged.
6. International retreat content states legality in the **host jurisdiction**, never claims anything is legal in Australia.

### The TODO-ADAM convention

Any fact that needs Adam's direct verification before publishing gets a JSX comment in the body,
prefixed `TODO-ADAM:`. This keeps unverified claims invisible to readers while still being visible
to editors. Example:

```mdx
{/*
  TODO-ADAM: price published in USD ($X,XXX) — convert to AUD and verify current
  pricing before publishing a price band.
*/}
```

Never put a TODO-ADAM note in a frontmatter field that renders publicly (e.g. `summary`,
`costTableAUD[].notes`) — those show up on the live page. Keep verification notes in the body,
as JSX comments, or omit the field entirely until it's verified.

---

## Adding a listing

**Path:** `src/content/listings/<slug>.mdx`

| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `name` | string | yes | Operator/service name as it should display. |
| `categories` | array of enum | yes | One or more of: `psilocybin`, `ayahuasca`, `san-pedro-and-other`, `breathwork`, `cannabis`, `luxury`, `ketamine`, `psychedelic-assisted-therapy`, `integration`. First entry drives the category badge/breadcrumb. |
| `mode` | `"standard"` \| `"neutral"` | yes | `neutral` = Australian ketamine/psychedelic-assisted-therapy service (see rule 3 above). Everything else is `standard`. |
| `destinationSlug` | string | yes | Must match a slug in `src/content/destinations/` for the destination page to link back (or `australia` for domestic listings — no destination page required for that one to exist yet). |
| `country` | string | yes | Display country. |
| `region` | string | no | City/region shown alongside country. |
| `priceBandAUD` | enum | no | One of `under3k`, `3k-6k`, `6k-10k`, `10kplus`. **Omit for neutral-mode listings** (rule 3). Omit entirely rather than guess if you don't have a sourced AUD figure — see cost guide TODO-ADAM pattern in existing listings. |
| `durationDays` | positive integer | no | Typical retreat length. |
| `languages` | array of string | no | Defaults to `["English"]`. |
| `groupSizeMax` | positive integer | no | |
| `website` | URL | yes | Operator's official site. |
| `affiliateUrl` | URL | no | Only set once an actual affiliate agreement exists — don't fabricate one. If set, the listing page renders it as the primary CTA with `rel="sponsored nofollow"` and an affiliate-disclosure notice automatically. |
| `enquiryEnabled` | boolean | no | Defaults `false`. Set `true` only once you also set `contactEmail` — this enables the on-site enquiry form for `standard` listings. |
| `contactEmail` | email | no | Operator contact email, used only when `enquiryEnabled: true`. |
| `claimed` | boolean | no | Defaults `false`. See rule 4. |
| `featuredTier` | `"featured"` \| `"premium"` | no | Only set once the operator is actually paying for that tier (see `/for-operators/`). |
| `vetting` | object, all required | yes | Six fields, each `"stated"` or `"unverified"`: `legalJurisdiction`, `medicalScreening`, `facilitatorExperience`, `emergencyProtocol`, `independentReviews`, `pricingDisclosed`. Mark `"stated"` only if the operator's own public materials clearly say so — otherwise `"unverified"`. When in doubt, `"unverified"`. |
| `sourceUrls` | array of URL, min 1 | yes | Direct links to the specific pages you sourced facts from, not just the homepage. |
| `images` | array of string | no | Defaults `[]`. Leave empty unless you have rights to use the image — the template shows a placeholder gradient (or, for neutral mode, a small logo) when empty. |
| `summary` | string, ≤200 chars | yes | One or two factual sentences — this is the meta description and card summary. |
| `publishedAt` | date | yes | `YYYY-MM-DD`. |
| `updatedAt` | date | yes | `YYYY-MM-DD`. Bump this whenever you edit the listing. |

Body: standard-mode listings get a few paragraphs of factual overview (see any existing listing
for tone/length). Neutral-mode listings get exactly one sentence.

### Worked example — standard mode

```mdx
---
name: "Example Retreat Co"
categories: ["psilocybin"]
mode: "standard"
destinationSlug: "netherlands"
country: "Netherlands"
region: "Amsterdam area"
durationDays: 5
languages: ["English"]
groupSizeMax: 12
website: "https://example-retreat.example/"
enquiryEnabled: false
claimed: false
vetting:
  legalJurisdiction: "stated"
  medicalScreening: "stated"
  facilitatorExperience: "unverified"
  emergencyProtocol: "unverified"
  independentReviews: "unverified"
  pricingDisclosed: "stated"
sourceUrls:
  - "https://example-retreat.example/program"
images: []
summary: "A 5-day legal psilocybin-truffle retreat near Amsterdam, combining guided ceremony with structured integration support."
publishedAt: 2026-07-19
updatedAt: 2026-07-19
---

Example Retreat Co runs 5-day residential retreats near Amsterdam using legally-sold psilocybin
truffles, for groups of up to 12 participants. [... factual description continues ...]

{/* TODO-ADAM: verify current pricing and confirm facilitator credentials before publishing. */}
```

### Worked example — neutral mode

```mdx
---
name: "Example Clinic"
categories: ["ketamine"]
mode: "neutral"
destinationSlug: "australia"
country: "Australia"
region: "Sydney, NSW"
languages: ["English"]
website: "https://example-clinic.example/"
enquiryEnabled: false
claimed: false
vetting:
  legalJurisdiction: "stated"
  medicalScreening: "stated"
  facilitatorExperience: "unverified"
  emergencyProtocol: "unverified"
  independentReviews: "unverified"
  pricingDisclosed: "unverified"
sourceUrls:
  - "https://example-clinic.example/about"
images: []
summary: "A Sydney clinic offering ketamine treatment for treatment-resistant depression, by psychiatrist referral only."
publishedAt: 2026-07-19
updatedAt: 2026-07-19
---

A Sydney clinic offering ketamine treatment for treatment-resistant depression, by psychiatrist referral only.
```

Note the body is the *same single sentence* as `summary` — that's intentional and required for neutral mode.

---

## Adding a guide

**Path:** `src/content/guides/<slug>.mdx`

| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `title` | string | yes | |
| `description` | string, ≤200 chars | yes | Meta description + card summary. |
| `cluster` | enum | no | One of `legal`, `retreats`, `safety`, `adjacent`, `news`. Used to surface "related guides" on category pages. |
| `authorSlug` | string | yes | Must match a slug in `src/content/authors/` (currently only `adam-hackney`). |
| `publishedAt` | date | yes | |
| `updatedAt` | date | yes | Bump on every edit. |
| `lastReviewed` | date | no | Only set once a human has actually re-checked the facts — shown on the page as "Last reviewed." |
| `sources` | array of `{title, url}` | no | Defaults `[]`. Rendered as a Sources list. |
| `faq` | array of `{q, a}` | no | Defaults `[]`. Rendered as an accordion with `FAQPage` JSON-LD automatically. |
| `relatedListings` | array of listing slugs | no | Defaults `[]`. Must match real slugs in `src/content/listings/` or they're silently skipped. |
| `draft` | boolean | no | Defaults `true`. See rule 5. |

### Worked example

```mdx
---
title: "Example Guide Title"
description: "One or two sentences summarising what this guide covers."
cluster: "retreats"
authorSlug: "adam-hackney"
publishedAt: 2026-07-19
updatedAt: 2026-07-19
sources:
  - title: "Primary source name"
    url: "https://example.com/source"
faq:
  - q: "A question a reader would actually ask?"
    a: "A direct, sourced answer."
draft: true
relatedListings: ["beckley-retreats-netherlands"]
---

Opening paragraph — no heading, this is the lede.

## First section heading

Body content. Use `##` (h2) for major sections — the table of contents only picks up h2s.

{/* TODO-ADAM: note anything that needs verification before draft:false. */}
```

---

## Adding a news post

**Path:** `src/content/news/<slug>.mdx`

Identical schema to guides, minus `cluster` (fixed to `"news"` automatically) and `relatedListings`
is still available. News posts use a lighter template (dateline + sources, no TOC/author sidebar
emphasis). Same `draft: true` default and TODO-ADAM convention apply.

```mdx
---
title: "Example News Headline"
description: "One-sentence summary of the news item."
authorSlug: "adam-hackney"
publishedAt: 2026-07-19
updatedAt: 2026-07-19
sources:
  - title: "Primary source"
    url: "https://example.com/source"
draft: true
---

A short news item, a few paragraphs, sourced.
```

If you add a news post that should appear in the homepage "Latest news" teaser, it will show up
automatically — the homepage pulls the 4 most recent items from the collection regardless of
draft status (drafts still show their draft badge on the `/news/` index but not on the homepage
teaser cards, so double-check draft items you don't want surfaced yet).

---

## Adding a destination

**Path:** `src/content/destinations/<slug>.mdx`. There's no `draft` field on this collection —
treat it as always-live, so be conservative and fully sourced before adding one.

| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `name` | string | yes | Display name (e.g. "Netherlands"). |
| `legalStatus.summary` | string | yes | One-sentence legal summary shown prominently. |
| `legalStatus.details` | string | yes | Fuller explanation, a paragraph. |
| `legalStatus.sourceUrls` | array of URL, min 1 | yes | |
| `costTableAUD` | array of `{item, low, high, notes?}` | yes (can be empty array) | `notes` renders publicly — write it as a normal user-facing caveat, never a TODO-ADAM note (see the incident this caused in Phase 5 — don't repeat it). |
| `faq` | array of `{q, a}` | no | Defaults `[]`. |

Body: two `##` sections by convention — `## What to expect` and `## Logistics from Australia`.
Use JSX comments for TODO-ADAM notes in the body (never in `costTableAUD[].notes`).

---

## Adding an author

**Path:** `src/content/authors/<slug>.mdx`. Fields: `name`, `role`, `bio` (all required strings),
`avatar` (optional string path). No body content — frontmatter only. Reference the slug via
`authorSlug` in guides/news.

---

## After adding content

1. `npm run check` — must show 0 errors (this validates every frontmatter field against the zod schema in `src/content.config.ts`).
2. `npm run build && npm run check:links` — confirms the build succeeds and nothing links to a slug that doesn't exist.
3. If you referenced a new listing slug from a guide's `relatedListings`, or a new destination slug from a listing, double check the slug spelling matches exactly (it's a plain string match, not validated by the schema beyond "is a string").
