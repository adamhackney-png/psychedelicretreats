# Growth loop

Automated weekly growth work for psychedelicretreats.com.au. This repo is public, so nothing here contains
visitor, lead or revenue numbers — those live in the private "PRA weekly report" Google Sheet (Growth log tab).

- **Monday 8am (Melbourne) — "PRA weekly report" routine.** Reads last week's data and growth signals, checks
  `done/` for what the sprint shipped, records outcomes in the Growth log, and writes `plan.md`: 3–5 actions
  for the week ahead, drawn from the signals and from `backlog.md`.
- **Tuesday 9am — "PRA growth sprint" routine.** Carries out `plan.md` and writes `done/YYYY-MM-DD.md`.
  SEO metadata edits (title/description/relatedListings on existing pages) and listing edits publish
  automatically through the Routine intake Action; new pages, page-text rewrites and code go to one
  "[verify before merge]" PR. Emails are only ever drafted — Adam sends them.

## Action types in plan.md

| Type | Meaning |
|---|---|
| `auto` | The sprint does it and it goes live via the intake Action |
| `pr` | The sprint does it as a PR for Adam to merge (new guides, page text, site code) |
| `draft` | The sprint drafts something for Adam to send (outreach emails); newsletter drafts are made by the Monday routine in MailerLite |
| `adam` | Needs Adam (an account, a decision, a payment) — stated as one clear ask |

Each action has: an ID (`G-YYYYMMDD-n`), type, what, target page(s), the signal that justifies it, and how
success will be judged next week.
