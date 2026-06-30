#!/usr/bin/env python3
"""
Canonicalize tag names in post frontmatter.

Targets:
  - "AI-Native" -> "AI-Native软件工程" (canonical form used in 79 posts;
    the 38 single-form uses get pulled into the same bucket. If both
    are present in a post, only the duplicate is removed.)
  - "AI-Agent"  -> "AI Agent" (typo fix; 3 instances)

Both renames are mechanical and reversible.

Run from repo root:
  python3 scripts/canonicalize-tags.py --dry-run   # preview
  python3 scripts/canonicalize-tags.py             # apply
"""

import argparse
import re
import sys
from pathlib import Path

POSTS_DIR = Path("_posts")
RENAMES = {
    "AI-Native": "AI-Native软件工程",
    "AI-Agent":  "AI Agent",
}


def normalize_tags(raw: str) -> tuple[str, bool]:
    """Return (new_string, changed?)."""
    parts = re.findall(r'"([^"]+)"|([^,\[\]]+)', raw)
    flat = [a or b for a, b in parts]
    flat = [s.strip() for s in flat if s and s.strip()]
    seen, new_parts = set(), []
    for t in flat:
        target = RENAMES.get(t, t)
        if target in seen:
            continue
        seen.add(target)
        new_parts.append(target)
    changed = new_parts != flat or any(t != s for t, s in zip(flat, [RENAMES.get(x, x) for x in flat]))
    if not changed:
        return raw, False
    serialized = ", ".join(new_parts)
    return serialized, True


def fix_post(path: Path, dry: bool) -> bool:
    text = path.read_text()
    lines = text.splitlines(keepends=False)
    if not lines or not lines[0].startswith("---"):
        return False
    # Find end of frontmatter
    end_idx = None
    for i in range(1, len(lines)):
        if lines[i].startswith("---"):
            end_idx = i
            break
    if end_idx is None:
        return False

    changed = False
    new_lines = lines[:]
    for i in range(1, end_idx):
        if lines[i].startswith("tags:"):
            raw_value = lines[i][len("tags:"):].strip()
            new_value, did_change = normalize_tags(raw_value)
            if did_change:
                new_lines[i] = f"tags: [{new_value}]"
                changed = True
                if dry:
                    print(f"[dry-run] {path.name}:L{i+1}")
                    print(f"          - {lines[i].strip()}")
                    print(f"          + {new_lines[i].strip()}")

    if changed and not dry:
        path.write_text("\n".join(new_lines) + "\n")
    return changed


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if not POSTS_DIR.is_dir():
        print("error: _posts/ not found", file=sys.stderr)
        sys.exit(2)

    fixed = 0
    for p in sorted(POSTS_DIR.glob("*.md")):
        if fix_post(p, args.dry_run):
            fixed += 1

    verb = "would canonicalize" if args.dry_run else "canonicalized"
    print(f"\n{verb} {fixed} post(s)")


if __name__ == "__main__":
    main()
