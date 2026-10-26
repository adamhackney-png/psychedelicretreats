# Growth backlog

Standing ideas, highest expected impact first. The Monday routine pulls from here when the week's data
doesn't suggest something better, marks items `[planned YYYY-MM-DD]`, and adds new ideas it spots.
Constraints: the compliance checklist applies to everything (no efficacy claims, no promoting prescription
substances, legality stated for international content). Paid ads are not an option for this niche.

## Search (SEO)
- [ ] Titles and descriptions for every guide written for Australian search intent ("…for Australians", AUD, 2026), each under 60/155 characters.
- [ ] Structured data: Organization + WebSite on every page, BreadcrumbList, FAQPage where a page has `faq`, ItemList on retreat/clinic index pages, Article on guides/news. (pr — site code)
- [ ] Internal links: every guide lists 3–6 relevant listings via `relatedListings`; every listing links back to its destination and category guide.
- [ ] Refresh the stalest guides: re-verify facts and sources, update `lastReviewed`, add what changed in 2026. (pr)
- [ ] New guides for Australian questions not yet covered, e.g. "Is psilocybin legal in Australia? State-by-state (2026)", "What happens at a Netherlands truffle retreat", "Travel insurance and psychedelic retreats", "Integration support in Australia after a retreat". Check existing guides first to avoid overlap. (pr)
- [ ] Destination pages for every country that has listings, each linking to its listings. (pr)
- [ ] Image alt text and Open Graph images for guides and listings that lack them. (pr)
- [ ] Check Core Web Vitals / page weight on the 5 most-viewed pages and fix anything slow. (pr)

- [ ] Search Console: request a recrawl for /guides/breathwork-retreats-in-australia/ and /guides/safety-screening-and-contraindications/ (not done 2026-10-26 — daily limit), then check the Page indexing report for any other pages still marked noindex from their draft days. (adam — needs a browser session with Claude)

## AI answers
- [ ] An "About / editorial policy" section that states methodology clearly — AI answer engines favour clearly sourced, attributable content.
- [ ] A concise FAQ block on each guide answering the exact question in its title in the first 2–3 sentences.

## Email
- [ ] Monthly digest to the Newsletter group (new listings, legal/news roundup, one guide) — drafted in MailerLite on the first Monday of each month.
- [ ] [planned 2026-11-02] Newsletter signup placement: inline after the first section of every guide, and on listing pages.
- [ ] Re-enable the retreat-match quiz as a lead magnet once traffic justifies it.

## Partnerships, links and revenue
- [ ] "Listed on Psychedelic Retreats Australia" badge + snippet operators can embed (backlink). (pr)
- [ ] Claim-your-listing emails to the 10 listings with the most operator clicks. (draft — Adam sends from info@)
- [ ] Research affiliate/referral programs for platforms our listings book through (e.g. BookRetreats, Retreat Guru) and for operators directly; list terms and sign-up links for Adam. (adam)
- [ ] [planned 2026-11-02] Find 10 relevant resource/links pages (harm-reduction orgs, integration directories, Australian psychedelic research groups) that could reasonably link to the vetting checklist or legal guide; draft polite suggestions. (draft)
- [ ] Operator referral report: once operator clicks exist, a monthly per-operator click summary to use in partnership pitches. (auto, via the weekly report)

## Added by sprint 2026-10-26
- [ ] [planned 2026-11-02] Retry "Is psilocybin legal in Australia? State-by-state" once page fetch works (needs primary state legislation). [carried from G-20261026-4] (pr)
- [ ] Rendered titles get a " | Psychedelic Retreats" suffix (+22 chars); consider a shorter suffix or dropping it on long titles. (pr — code)
- [ ] Verify which Australian breathwork operators are on BookRetreats before pursuing its affiliate programme. (adam)
- [ ] Add `lastReviewed` re-verification pass for the 10 guides (none have lastReviewed set). (pr)
- [ ] Add a "Find an operator" next step on retreat index pages [planned 2026-11-02] (pr)
- [ ] Confirm sitemap submission and indexing in Search Console [planned 2026-11-02] (adam)

## Added by sprint 2026-11-02
- [ ] Legal-guide sources: ask Adam to drop PDFs/links for the NSW, QLD, WA, SA, TAS, ACT, NT drug acts and the TGA position, since fetch is blocked for NSW/TGA (legislation.vic.gov.au works). (adam)
- [ ] Newsletter signup on listing pages and the retreat-match results (the guide placement shipped in the 2026-11-02 PR). (pr)
- [ ] Track which guide the newsletter join came from (e.g. a hidden source field in MailerLite) instead of relying on `page_path` in Analytics. (pr)
- [ ] Follow-up on the 10 link-suggestion targets in done/2026-11-02.md: note who replied, replace targets 3 and 8 with better ones. (draft)
