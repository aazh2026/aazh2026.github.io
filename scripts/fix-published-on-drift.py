#!/usr/bin/env python3
"""
Fix "Published on" date drift in post footers.

For each _posts/*.md:
  - Extract frontmatter date (YYYY-MM-DD).
  - If a `*Published on YYYY-MM-DD...` line exists with a different date,
    replace that date with the frontmatter date, preserving any trailing
    decorations (e.g. "| 深度阅读时间：约 12 分钟*").

Run from repo root: python3 scripts/fix-published-on-drift.py
"""

import re
import sys
from pathlib import Path

POSTS_DIR = Path("_posts")
PUBLISHED_RE = re.compile(r"^\*Published on (\d{4}-\d{2}-\d{2})(.*?)\*?\s*$")
FRONTMATTER_DATE_RE = re.compile(r"^date:\s*(\d{4}-\d{2}-\d{2})")


def fix_post(path: Path) -> bool:
    text = path.read_text()
    lines = text.splitlines(keepends=False)

    # Find frontmatter date (assumed between first two ---)
    fm_date = None
    if lines and lines[0].strip() == "---":
        for i in range(1, len(lines)):
            if lines[i].strip() == "---":
                break
            m = FRONTMATTER_DATE_RE.match(lines[i])
            if m:
                fm_date = m.group(1)
                break

    if not fm_date:
        return False

    changed = False
    out = []
    for line in lines:
        m = PUBLISHED_RE.match(line)
        if m:
            pub_date, suffix = m.group(1), m.group(2)
            if pub_date != fm_date:
                suffix = suffix or ""
                # Preserve closing `*` if the original had it
                closing = ""
                if line.rstrip().endswith("*") and not suffix.endswith("*"):
                    closing = "*"
                # If suffix already ends with "*", close it before
                if suffix.endswith("*"):
                    new_line = f"*Published on {fm_date}{suffix}"
                else:
                    new_line = f"*Published on {fm_date}{suffix}{closing}"
                out.append(new_line)
                changed = True
            else:
                out.append(line)
        else:
            out.append(line)

    if changed:
        path.write_text("\n".join(out) + "\n")
    return changed


def main():
    if not POSTS_DIR.is_dir():
        print(f"error: {POSTS_DIR} not found; run from repo root", file=sys.stderr)
        sys.exit(2)

    fixed = []
    for p in sorted(POSTS_DIR.glob("*.md")):
        if fix_post(p):
            fixed.append(p.name)

    if not fixed:
        print("No drift found.")
    else:
        print(f"Fixed {len(fixed)} post(s):")
        for n in fixed:
            print(f"  {n}")


if __name__ == "__main__":
    main()
