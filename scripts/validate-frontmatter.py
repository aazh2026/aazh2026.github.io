#!/usr/bin/env python3
"""Validate Jekyll post frontmatter as proper YAML.

Catches:
- YAML parse errors (e.g., unescaped inner quotes, malformed scalars)
- Missing required fields: layout, title, date
- Empty required fields
- Title that doesn't survive YAML parsing (returns None or empty)
- date that doesn't survive YAML parsing as a real date

Exits 0 on success, 1 on any error.
"""
import os
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML not installed. Run: pip install pyyaml", file=sys.stderr)
    sys.exit(2)

POSTS_DIR = Path(__file__).parent.parent / "_posts"
REQUIRED = ("layout", "title", "date")


def split_frontmatter(text: str):
    """Return (frontmatter_str, body) or None if no valid frontmatter."""
    if not text.startswith("---\n"):
        return None
    end = text.find("\n---\n", 4)
    if end == -1:
        return None
    return text[4:end], text[end + 5:]


def validate_post(path: Path):
    errors = []
    text = path.read_text(encoding="utf-8")
    fm = split_frontmatter(text)
    if fm is None:
        return [f"missing or malformed frontmatter (--- delimiters)"]

    fm_str, _ = fm
    try:
        data = yaml.safe_load(fm_str)
    except yaml.YAMLError as e:
        return [f"YAML parse error: {e}"]

    if not isinstance(data, dict):
        return [f"frontmatter is not a YAML mapping (got {type(data).__name__})"]

    for key in REQUIRED:
        if key not in data:
            errors.append(f"missing required field: {key}")
        elif data[key] in (None, "", []):
            errors.append(f"empty required field: {key}")

    # Sanity: title must be a non-empty string
    if "title" in data and not isinstance(data["title"], str):
        errors.append(f"title is not a string (got {type(data['title']).__name__})")

    # date must parse — yaml.safe_load gives datetime for valid ISO 8601
    if "date" in data and not hasattr(data["date"], "year"):
        errors.append(f"date did not parse as a datetime (got {type(data['date']).__name__}: {data['date']!r})")

    return errors


def main():
    if not POSTS_DIR.is_dir():
        print(f"ERROR: posts dir not found: {POSTS_DIR}", file=sys.stderr)
        sys.exit(2)

    total = 0
    bad = 0
    for path in sorted(POSTS_DIR.glob("*.md")):
        total += 1
        errors = validate_post(path)
        if errors:
            bad += 1
            print(f"\n❌ {path.name}")
            for e in errors:
                print(f"   - {e}")

    print(f"\n{'='*60}")
    if bad == 0:
        print(f"✅ {total}/{total} posts have valid YAML frontmatter")
        return 0
    else:
        print(f"❌ {bad}/{total} posts have frontmatter errors")
        return 1


if __name__ == "__main__":
    sys.exit(main())
