"""Split a research-routine branch into files that may go straight to main and files that need review.

Mirrors STEP 6 of ops/routine-prompt.md, but only for what can be checked mechanically:
- ops/prospects.md and ops/compliance-checklist.md (the run log)
- Australian breathwork / integration listings with no TODO-ADAM, affiliate link or featured tier
Anything else (news, guides, destinations, substance categories, deletions, code) goes to review.

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


def listing_problem(text):
    fm = frontmatter(text)
    if not fm:
        return "no frontmatter"
    if field(fm, "country") != "Australia":
        return "not an Australian listing"
    cats = categories(fm)
    if not cats or not cats <= AUTO_CATEGORIES:
        return f"categories {sorted(cats)} are not breathwork/integration only"
    if "TODO-ADAM" in text:
        return "carries a TODO-ADAM"
    if field(fm, "affiliateUrl") or field(fm, "featuredTier"):
        return "has an affiliate link or featured tier"
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
            problem = listing_problem(git("show", f"{head}:{path}"))
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
