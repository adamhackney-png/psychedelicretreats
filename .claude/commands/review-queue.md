# Review and merge pending automation branches

You are helping Adam (the human editor) review content branches drafted by his automations for psychedelicretreats.com.au. Adam is the only one who approves merges. You must not invent or "fix" facts — anything unverifiable stays as a TODO-ADAM comment or comes out of the content entirely.

## Step 1 — Find the queue

Run `git fetch origin --prune`, then list every remote branch and how far ahead of main it is:

```
for b in $(git ls-remote --heads origin | awk '{print $2}' | sed 's|refs/heads/||' | grep -v '^main$'); do
  echo "$b => $(git rev-list --count origin/main..origin/$b) commits ahead"
done
```

Branches with **0 commits ahead** are already merged — set them aside as "stale, safe to delete" and confirm the list with Adam at the end. Branches ahead of main are the review queue. Tell Adam what's in the queue before starting.

## Step 2 — Walk the queue, one branch at a time

For each unmerged branch, in date order:

1. Show `git diff main...origin/<branch>` and summarise in plain language what the branch adds or changes.
2. Show every `TODO-ADAM` comment in the changed files — these are the automation's own verification notes and open questions. Treat them as the checklist for this branch.
3. Help Adam verify the flagged items: fetch the operator's live pages where useful (pricing, dates, licence registers, review platforms) and show him what they currently say next to what the listing says.
4. Make any edits Adam requests. Whenever a listing file is edited, bump its `updatedAt` to today. Resolve or update TODO-ADAM comments to match what was actually verified.
5. Ask Adam explicitly: merge, hold, or skip. **Only merge a branch Adam explicitly approves in this session.** Held/skipped branches stay completely untouched — no rebasing, no tidying, no partial merges.

Watch for these standing rules from the content guide (CONTENT.md is authoritative — read it if in doubt):

- Never add efficacy/outcome claims for any substance, including operator-published condition lists or testimonials — even if the operator's site is full of them.
- Vetting fields are "stated" only when the operator's own public materials clearly say so; when in doubt, "unverified".
- Destination pages have no draft flag — they go live on merge, so review those extra carefully.
- Neutral-mode (Australian clinic) listings stay one factual sentence, no pricing, no adjectives.
- Spain psilocybin retreats are excluded (decriminalised ≠ legal). Costa Rica is on hold as legally ambiguous.

## Step 3 — Validate and push

After all approved branches are merged into main (regular merges):

1. Run `npm install` (first time only), then `npm run check` and `npm run build`. Both must pass **before** pushing. If something fails, show Adam the error and fix only the mechanical cause — never by changing facts.
2. Push main.
3. Delete every branch merged this session, plus the stale already-merged branches from Step 1 (local and remote: `git push origin --delete <branch>`), after Adam confirms the list.
4. Give Adam a short wrap-up: what merged, what's held and why, and anything he should pass back to his automations (e.g. a listing that needs a follow-up check).
