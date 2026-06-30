#!/usr/bin/env python3
"""
Audit redirect_from entries across posts.

For each post with `redirect_from:`, list all redirect targets. Without a
local Jekyll build we can't simulate `:title:` slugification exactly, so
this script does heuristic matching:

  1. Same-file slug:  if the target tail matches a known slug-base name
                       in any file's basename (without date prefix)
  2. Loose ASCII:     if the target tail matches an ASCII substring of
                       the file basename

Both heuristic-hits classify a target as `LIKELY_OK`. Anything else gets
classified as `UNCLEAR` for manual review.

This script is read-only. Add --strict to also flag targets whose
slug basename is shared across multiple posts (likely wrong redirect).

Run:
  python3 scripts/check-redirects.py
"""

import re
import sys
from pathlib import Path
from collections import defaultdict

POSTS_DIR = Path("_posts")
FILE_STEM_RE = re.compile(r"^\d{4}-\d{2}-\d{2}-(.+?)\.md$")


def list_slug_bases() -> dict[str, set[str]]:
    """Map each post file's slug-base to its full path."""
    out: dict[str, set[str]] = defaultdict(set)
    for p in POSTS_DIR.glob("*.md"):
        m = FILE_STEM_RE.match(p.name)
        if m:
            base = m.group(1).lower()
            out[base].add(p.name)
    return out


def status_for(target: str, file_bases: dict[str, set[str]]) -> str:
    """Heuristic match for a single redirect target."""
    t = target.strip("/").lower()
    if not t:
        return "EMPTY"
    # Exact slug-base match (strict)
    if t in file_bases:
        names = file_bases[t]
        if len(names) == 1:
            return "EXACT_OK"
        return "AMBIGUOUS"
    # Loose substring match (need user review)
    for base, names in file_bases.items():
        if t == base or t in base or base in t:
            return f"LOOSE_MATCH ({next(iter(names))})"
    return "UNCLEAR"


def main():
    if not POSTS_DIR.is_dir():
        print("error: _posts/ not found", file=sys.stderr)
        sys.exit(2)

    file_bases = list_slug_bases()

    by_target: dict[str, list[str]] = defaultdict(list)
    for p in sorted(POSTS_DIR.glob("*.md")):
        text = p.read_text()
        in_frontmatter = False
        in_redirect = False
        for line in text.splitlines():
            if line.startswith("---"):
                if in_frontmatter and not line == "---":
                    break
                in_frontmatter = not in_frontmatter
                continue
            if not in_frontmatter:
                continue
            if line.startswith("redirect_from:"):
                in_redirect = True
                continue
            if in_redirect:
                stripped = line.strip()
                if not stripped.startswith("-"):
                    in_redirect = False
                    continue
                m = re.match(r"-\s*(/[^\s]+)", stripped)
                if m:
                    target = m.group(1)
                    by_target[target].append(p.name)

    unclear = []
    ok = 0
    total = 0
    for target in sorted(by_target):
        total += 1
        s = status_for(target, file_bases)
        if s == "EXACT_OK":
            ok += 1
        else:
            unclear.append((target, s, by_target[target]))

    print(f"\n=== Redirect summary ===")
    print(f"Total targets:       {total}")
    print(f"Exact match:         {ok}")
    print(f"Loose / Unclear:     {len(unclear)}")
    print()
    print("=== Loose / Unclear targets (loose_match likely OK, but verify) ===")
    for target, s, sources in unclear:
        print(f"  {target:50s}  [{s}]  <- in {len(sources)} post(s)")
        for src in sources[:2]:
            print(f"      e.g. {src}")
    if not unclear:
        print("  (none)")


if __name__ == "__main__":
    main()
