#!/usr/bin/env python3
"""
Strip the deprecated "*AI-Native软件工程系列 #NN*" footer line from posts.

The line is at the very end of the file, typically preceded by a `---` separator
and an empty line. We only remove it when:
  - It matches `^\*AI-Native软件工程系列 #[0-9]+\*?\s*$`
  - It sits within the last 10 lines of the file

References to the series inside article body (e.g., `*AI-Native软件工程系列 #NN`
inside a related-posts block) are NOT touched (they don't start with `*`/`*` and
aren't at end-of-file).

Run from repo root: python3 scripts/strip-series-footer.py [--dry-run]
"""

import argparse
import re
import sys
from pathlib import Path

POSTS_DIR = Path("_posts")
SERIES_RE = re.compile(r"^\*AI-Native软件工程系列\s+#\d+\*?\s*$")


def strip(path: Path, dry: bool) -> bool:
    text = path.read_text()
    lines = text.splitlines()
    if len(lines) < 3:
        return False

    candidates = []
    for idx, line in enumerate(lines):
        # last 10 lines only — footer zone
        if idx < len(lines) - 10:
            continue
        if SERIES_RE.match(line.strip()):
            candidates.append(idx)

    if not candidates:
        return False

    # Remove the matching line(s) and any single preceding blank line for each
    remove = set()
    for idx in candidates:
        remove.add(idx)
        # Also remove a preceding empty line if it sits just above
        if idx > 0 and lines[idx - 1].strip() == "":
            remove.add(idx - 1)

    if dry:
        print(f"[dry-run] {path.name}: would drop lines {sorted(remove)}")
        for idx in candidates:
            print(f"          L{idx+1}: {lines[idx]}")
        return True

    new_lines = [line for i, line in enumerate(lines) if i not in remove]
    path.write_text("\n".join(new_lines) + "\n")
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true",
                    help="Show what would change without modifying files")
    args = ap.parse_args()

    if not POSTS_DIR.is_dir():
        print(f"error: {POSTS_DIR} not found; run from repo root", file=sys.stderr)
        sys.exit(2)

    targets = sorted(POSTS_DIR.glob("*.md"))
    changed, dry_count = [], 0
    for p in targets:
        if SERIES_RE_OK := [l for l in p.read_text().splitlines() if SERIES_RE.match(l.strip())]:
            _ = SERIES_RE_OK  # noqa
        if strip(p, args.dry_run):
            dry_count += 1
            changed.append(p.name)

    verb = "would fix" if args.dry_run else "fixed"
    print(f"{verb} {len(changed)} post(s):")
    for n in changed:
        print(f"  {n}")


if __name__ == "__main__":
    main()
