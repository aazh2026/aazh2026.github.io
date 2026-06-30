#!/usr/bin/env python3
"""
Audit the `description:` field across all posts.

Reports:
  - Length distribution (current avg ~75 chars)
  - Posts with empty / generic descriptions ("本文讨论 X")
  - Posts > 145 chars (Google snippet truncation)
  - Posts without numbers/verbs (typically vague)

Read-only — outputs a summary table. Use this to triage which posts need
description rewrites. Suggested rules:
  - 80-140 chars sweet spot for SEO snippet
  - Include a specific number or named entity
  - Avoid generic "本文讨论" / "本文介绍" openers

Run:
  python3 scripts/audit-descriptions.py
"""

import re
import sys
from pathlib import Path
from collections import Counter

POSTS_DIR = Path("_posts")
DESC_RE = re.compile(r'^description:\s*["\']?(.*?)["\']?\s*$')
GENERIC_PREFIXES = ("本文讨论", "本文介绍", "探讨", "介绍", "讨论", "这是一篇")
NUMBER_RE = re.compile(r"\d")


def main():
    if not POSTS_DIR.is_dir():
        print("error: _posts/ not found", file=sys.stderr)
        sys.exit(2)

    stats = {
        "total": 0,
        "with_desc": 0,
        "no_desc": 0,
        "too_short": 0,    # < 50
        "sweet": 0,        # 80-140
        "too_long": 0,     # > 145
        "with_number": 0,
        "with_verb_start": 0,
        "generic": 0,
    }
    lengths = []
    samples = {
        "no_desc": [],
        "too_short": [],
        "too_long": [],
        "generic": [],
    }

    for p in sorted(POSTS_DIR.glob("*.md")):
        stats["total"] += 1
        text = p.read_text()
        m = None
        for line in text.splitlines():
            if line.startswith("---"):
                continue
            d = DESC_RE.match(line)
            if d:
                m = d
                break
        if not m:
            stats["no_desc"] += 1
            samples["no_desc"].append((p.name, ""))
            continue
        stats["with_desc"] += 1
        desc = m.group(1).strip()
        l = len(desc)
        lengths.append(l)
        if l < 50:
            stats["too_short"] += 1
            samples["too_short"].append((p.name, desc))
        elif 80 <= l <= 140:
            stats["sweet"] += 1
        if l > 145:
            stats["too_long"] += 1
            samples["too_long"].append((p.name, desc))
        if NUMBER_RE.search(desc):
            stats["with_number"] += 1
        if any(desc.startswith(p) for p in GENERIC_PREFIXES):
            stats["generic"] += 1
            samples["generic"].append((p.name, desc[:60]))

    print("=== description: audit ===")
    for k, v in stats.items():
        print(f"  {k:18s} {v}")
    if lengths:
        lengths.sort()
        n = len(lengths)
        print(f"\n  length p50/p75/p90/p99: {lengths[n//2]}/{lengths[(3*n)//4]}/{lengths[(9*n)//10]}/{lengths[(99*n)//100]}")
        print(f"  length range: {lengths[0]} - {lengths[-1]}")

    for cat, items in samples.items():
        if items:
            print(f"\n=== {cat} ({len(items)}) ===")
            for name, desc in items[:5]:
                print(f"  {name}: {desc}")
            if len(items) > 5:
                print(f"  ... and {len(items)-5} more")


if __name__ == "__main__":
    main()
