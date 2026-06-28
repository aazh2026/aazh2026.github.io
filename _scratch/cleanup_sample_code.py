#!/usr/bin/env python3
"""Remove obviously illustrative sample code blocks from _posts/.

Strategy (line-by-line state machine, no regex backtracking):
  1. Strip fenced code blocks (``` ... ```), including the trailing blank
     line that typically follows them.
  2. Drop orphaned bold labels that introduced the now-removed block
     (e.g. `**示例**：`, `**传统方式**：`).
  3. Clean dangling inline references (`如下所示`, `see below`, etc.).
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

POSTS_DIR = Path(__file__).resolve().parent.parent / "_posts"

ORPHAN_LABEL_PATTERNS = [
    re.compile(r"^\*\*(?:示例|传统方式|案例|解决方案|属性测试|AI\s*生成测试|运行时验证|新金字塔|示例代码|代码示例)\*\*[：:]\s*$"),
]

INLINE_REF_PATTERNS = [
    (re.compile(r"如下所示[，,。]?"), ""),
    (re.compile(r"如下代码所示[，,。]?"), ""),
    (re.compile(r"如下代码[，,。]?"), ""),
    (re.compile(r"如下例子[，,。]?"), ""),
    (re.compile(r"看下面这个例子[，,。]?"), ""),
    (re.compile(r"看下面的例子[，,。]?"), ""),
    (re.compile(r"见下例[，,。]?"), ""),
    (re.compile(r"看下面[，,。]?"), ""),
    (re.compile(r"\(see (?:the )?(?:example|code) below\)"), ""),
    (re.compile(r"as shown below,?\s*"), ""),
    (re.compile(r"as illustrated below,?\s*"), ""),
    (re.compile(r",?\s*see (?:the )?(?:example|code) below"), ""),
    (re.compile(r",?\s*for example,?\s*see below"), ""),
]

FENCE_RE = re.compile(r"^[ \t]*```")


def strip_fenced_blocks(lines: list[str]) -> tuple[list[str], int]:
    """Return (new_lines, blocks_removed)."""
    out: list[str] = []
    in_block = False
    removed = 0
    i = 0
    while i < len(lines):
        line = lines[i]
        if not in_block and FENCE_RE.match(line):
            in_block = True
            i += 1
            continue
        if in_block:
            if FENCE_RE.match(line) and line.strip() == "```":
                in_block = False
                removed += 1
                i += 1
                # Drop the blank line that typically follows the block
                if i < len(lines) and lines[i].strip() == "":
                    i += 1
                continue
            i += 1
            continue
        out.append(line)
        i += 1
    return out, removed


def strip_orphan_labels(lines: list[str]) -> tuple[list[str], int]:
    out: list[str] = []
    removed = 0
    i = 0
    while i < len(lines):
        stripped = lines[i].strip()
        matched = any(p.match(stripped) for p in ORPHAN_LABEL_PATTERNS)
        if matched:
            # Look ahead: if the next non-blank line is gone (we already
            # removed fenced blocks), or is just another label/list, drop
            # this line. Always drop — these labels were introducing code
            # blocks in our survey.
            removed += 1
            i += 1
            continue
        out.append(lines[i])
        i += 1
    return out, removed


def clean_inline_refs(text: str) -> tuple[str, int]:
    total = 0
    for pat, repl in INLINE_REF_PATTERNS:
        text, n = pat.subn(repl, text)
        total += n
    return text, total


def collapse_blank_runs(text: str) -> str:
    return re.sub(r"\n{3,}", "\n\n", text)


def process_file(path: Path) -> dict:
    original = path.read_text(encoding="utf-8")
    lines = original.split("\n")

    lines, blocks = strip_fenced_blocks(lines)
    lines, labels = strip_orphan_labels(lines)

    text = "\n".join(lines)
    text, refs = clean_inline_refs(text)
    text = collapse_blank_runs(text)

    if text != original:
        path.write_text(text, encoding="utf-8")

    return {"blocks": blocks, "labels": labels, "refs": refs, "changed": text != original}


def main() -> int:
    files = sorted(POSTS_DIR.glob("*.md"))
    totals = {"blocks": 0, "labels": 0, "refs": 0, "changed_files": 0}

    for f in files:
        stats = process_file(f)
        for k in ("blocks", "labels", "refs"):
            totals[k] += stats[k]
        if stats["changed"]:
            totals["changed_files"] += 1

    print(
        f"Files changed: {totals['changed_files']}/{len(files)}\n"
        f"Code blocks removed: {totals['blocks']}\n"
        f"Orphan labels removed: {totals['labels']}\n"
        f"Inline references cleaned: {totals['refs']}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())