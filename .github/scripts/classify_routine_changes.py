"""Split a research-routine branch into files that may go straight to main and files that need review.

Mirrors STEP 6 of ops/routine-prompt.md, but only for what can be checked mechanically:
- ops/prospects.md and ops/compliance-checklist.md (the run log)
- new Australian breathwork / integration listings with no TODO-ADAM, affiliate link or featured tier
- new Australian clinic listings in neutral mode (TODO-ADAM allowed: it is an unrendered comment)
- edits to any existing listing that add no TODO-ADAM, affiliate link or featured tier
Anything else (news, guides, destinations, other new listings, deletions, code) goes to review.

Usage: classify_routine_changes.py <base-sha> <head-ref> <main-ref>
Writes eligible paths to auto.txt and the rest to review.txt (one per line, with a reason).
"""
import re
import subprocess
import sys

OPS_LOG = {"ops/prospects.md", "ops/compliance-checklist.md"}
AUTO_CATEGORIES = {"breathwork", "integration"}


def git(*args):
    return subprocess.run(["git", *args], check=True, capture_output=True, text=True).stdout


def frontmatter(text):
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    return m.group(1) if m else ""


def field(fm, name):
    m = re.search(rf"^{name}:\s*(.*)$", fm, re.M)
    return m.group(1).strip().strip('"\'') if m else None


def categories(fm):
    m = re.search(r"^categories:\s*\[(.*?)\]", fm, re.M | re.S)
    if m:
        return {c.strip().strip('"\'') for c in m.group(1).split(",") if c.strip()}
    m = re.search(r"^categories:\s*\n((?:\s+-\s+.*\n)+)", fm, re.M)
    if m:
        return {line.split("-", 1)[1].strip().strip('"\'') for line in m.group(1).splitlines()}
    return set()


def monetised(fm):
    return bool(field(fm, "affiliateUrl") or field(fm, "featuredTier"))


def new_listing_problem(text):
    fm = frontmatter(text)
    if not fm:
        return "no frontmatter"
    if field(fm, "country") != "Australia":
        return "new non-Australian listing"
    if monetised(fm):
        return "has an affiliate link or featured tier"
    if field(fm, "mode") == "neutral":
        return None
    cats = categories(fm)
    if not cats or not cats <= AUTO_CATEGORIES:
        return f"new listing with categories {sorted(cats)} (not breathwork/integration, not neutral mode)"
    if "TODO-ADAM" in text:
        return "new listing carries a TODO-ADAM"
    return None


def update_problem(old, new):
    fm_old, fm_new = frontmatter(old), frontmatter(new)
    if not fm_new:
        return "no frontmatter"
    if monetised(fm_new) and not monetised(fm_old):
        return "update adds an affiliate link or featured tier"
    if new.count("TODO-ADAM") > old.count("TODO-ADAM"):
        return "update adds a TODO-ADAM"
    return None


def main():
    base, head, main_ref = sys.argv[1:4]
    auto, review = [], []
    for line in git("diff", "--name-status", base, head).splitlines():
        status, path = line.split("\t", 1)
        if status not in ("A", "M"):
            review.append((path, f"status {status}"))
            continue
        # Never overwrite something that changed on main since the routine branched.
        if status == "M" and git("diff", "--name-only", base, main_ref, "--", path).strip():
            review.append((path, "also changed on main since the run started"))
            continue
        if path in OPS_LOG:
            auto.append(path)
        elif re.fullmatch(r"src/content/listings/[^/]+\.mdx", path):
            new = git("show", f"{head}:{path}")
            problem = new_listing_problem(new) if status == "A" else update_problem(git("show", f"{base}:{path}"), new)
            if problem:
                review.append((path, problem))
            else:
                auto.append(path)
        else:
            review.append((path, "not an auto-publish category"))

    with open("auto.txt", "w") as f:
        f.writelines(p + "\n" for p in auto)
    with open("review.txt", "w") as f:
        f.writelines(f"{p}\t{why}\n" for p, why in review)
    print(f"auto: {auto}\nreview: {review}")


if __name__ == "__main__":
    main()
