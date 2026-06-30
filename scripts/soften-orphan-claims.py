#!/usr/bin/env python3
"""
Soften orphan weak-attribution phrases in 2025 blog posts.

Targets phrases like 「研究表明」「数据显示」「一项研究表明」 that appear
without any supporting link within ~200 characters — these are the #1 audit
finding class (~85 of 130 total).

Rules (conservative):
  - Skip if phrase appears inside `>` blockquote lines, ``` code blocks,
    heading lines (#), or HTML tags.
  - Skip if the phrase is followed by a number within 30 characters (numeric
    data may be keep-able if the post is a case study).
  - Skip if a Markdown link `[...](...)` appears within 200 chars after the
    phrase (already supported).
  - Only target 2025-* posts (2026+ are already disciplined).

Safe replacements (literal):
  研究表明        -> 业界观察
  一项研究表明    -> 一些从业者报告
  多项研究表明    -> 多个团队的观察
  研究显示        -> 业界注意到
  研究发现        -> 业界发现
  数据显示        -> 据观察
  数据表明        -> 据观察

Run from repo root:
  python3 scripts/soften-orphan-claims.py --dry-run   # preview changes
  python3 scripts/soften-orphan-claims.py             # apply
"""

import argparse
import re
import sys
from pathlib import Path

POSTS_DIR = Path("_posts")
DATE_RE = re.compile(r"^2025-")

# (regex, replacement, semantic-style comment)
REPLACEMENTS = [
    (r"一项研究表明",  "一些从业者报告"),
    (r"多项研究表明",  "多个团队的观察"),
    (r"研究表明",      "业界观察"),
    (r"研究显示",      "业界注意到"),
    (r"研究发现",      "业界发现"),
    (r"数据显示",      "据观察"),
    (r"数据表明",      "据观察"),
]


def in_skippable_context(line: str, line_no: int) -> bool:
    """Avoid softening inside headings, blockquotes, code fences, html."""
    stripped = line.lstrip()
    if stripped.startswith("#"):       # headings
        return True
    if stripped.startswith(">"):       # blockquote
        return True
    if stripped.startswith("```"):     # code fence
        return True
    if stripped.startswith("|") or stripped.startswith("---"):
        return True
    return False


def has_nearby_link(text_window: str) -> bool:
    return bool(re.search(r"\[[^\]]+\]\([^)]+\)", text_window))


def has_nearby_number(text_window: str) -> bool:
    return bool(re.search(r"\d", text_window[:80]))


def process_post(path: Path, dry: bool) -> int:
    if not DATE_RE.match(path.name):
        return 0
    text = path.read_text()
    lines = text.splitlines(keepends=False)
    changed_count = 0

    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        new_line = line
        # window = this line + next ~5 lines for "nearby" check
        window_lines = lines[i:i + 6]
        window = "\n".join(window_lines)

        if not in_skippable_context(line, i):
            for pattern, repl in REPLACEMENTS:
                if re.search(pattern, new_line):
                    # skip if followed by a number on same line
                    after = new_line[re.search(pattern, new_line).end(): re.search(pattern, new_line).end() + 80]
                    if re.search(r"\d", after):
                        continue
                    # skip if a markdown link is nearby
                    if has_nearby_link(window):
                        continue
                    new_line2 = re.sub(pattern, repl, new_line)
                    if new_line2 != new_line:
                        if dry:
                            print(f"[dry-run] {path.name}:L{i+1}")
                            print(f"          - {line.strip()[:100]}")
                            print(f"          + {new_line2.strip()[:100]}")
                        new_line = new_line2
                        changed_count += 1

        new_lines.append(new_line)
        i += 1

    if changed_count and not dry:
        path.write_text("\n".join(new_lines) + "\n")
    return changed_count


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if not POSTS_DIR.is_dir():
        print("error: _posts/ not found; run from repo root", file=sys.stderr)
        sys.exit(2)

    total = 0
    targets = sorted(p for p in POSTS_DIR.glob("*.md") if DATE_RE.match(p.name))
    for p in targets:
        total += process_post(p, args.dry_run)

    verb = "would soften" if args.dry_run else "softened"
    print(f"\n{verb} {total} phrase(s) across {len(targets)} posts")


if __name__ == "__main__":
    main()
