#!/usr/bin/env python3
"""
Fix "*最后更新: YYYY-MM-DD*" footer drift — same shape as
fix-published-on-drift.py. Aligns the date to the frontmatter `date:` field.

Run from repo root: python3 scripts/fix-last-updated-drift.py
"""

import re
import sys
from pathlib import Path

POSTS_DIR = Path("_posts")
UPDATED_RE = re.compile(r"^\*最后更新[: ]\s*(\d{4}-\d{2}-\d{2})[*\s]?\*?\s*$")
FRONTMATTER_DATE_RE = re.compile(r"^date:\s*(\d{4}-\d{2}-\d{2})")


def fix_post(path: Path) -> bool:
    text = path.read_text()
    lines = text.splitlines(keepends=False)

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
        m = UPDATED_RE.match(line)
        if m and m.group(1) != fm_date:
            original = line
            closing = "*" if original.rstrip().endswith("*") else ""
            out.append(f"*最后更新: {fm_date}*{closing}")
            changed = True
        else:
            out.append(line)

    if changed:
        path.write_text("\n".join(out) + "\n")
    return changed


def main():
    if not POSTS_DIR.is_dir():
        print(f"error: {POSTS_DIR} not found", file=sys.stderr)
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
