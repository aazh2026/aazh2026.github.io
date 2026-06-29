#!/usr/bin/env python3
"""Generate per-post 1200x630 OG social-share images.

Each post gets a unique image combining:
- Brand color palette
- Post title (Chinese, multi-line)
- Series name (small)
- First TL;DR bullet / description
- Post date

Saves to assets/images/og/<slug>.png.
Saves manifest to _scratch/og-manifest.json for verification.
"""
import json
import os
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).parent.parent
POSTS_DIR = ROOT / "_posts"
OG_DIR = ROOT / "assets" / "images" / "og"
OG_DIR.mkdir(parents=True, exist_ok=True)

# Brand colors (from style.scss)
IVORY = (250, 249, 245)
PAPER = (255, 255, 255)
SLATE = (20, 20, 19)
CLAY = (217, 119, 87)
CLAY_D = (184, 92, 62)
OAT = (227, 218, 204)
OLIVE = (120, 140, 93)
G500 = (135, 134, 127)
G300 = (209, 207, 197)
G200 = (230, 227, 218)

# Font paths (macOS)
FONT_ZH = '/System/Library/Fonts/STHeiti Medium.ttc'
FONT_ZH_BOLD = '/System/Library/Fonts/STHeiti Medium.ttc'
FONT_EN = '/System/Library/Fonts/Supplemental/Times New Roman.ttf'
FONT_MONO = '/System/Library/Fonts/Supplemental/Arial Unicode.ttf'


def fm_get(fm, key):
    m = re.search(rf'^{re.escape(key)}:\s*(.+?)\s*$', fm, re.MULTILINE)
    if not m:
        return None
    v = m.group(1).strip()
    # Strip surrounding quotes
    if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
        v = v[1:-1]
    # Unescape YAML escapes
    v = v.replace('\\"', '"').replace("\\'", "'")
    return v


def get_post_meta(fp):
    txt = fp.read_text(encoding="utf-8")
    m = re.match(r'^---\n(.*?)\n---', txt, re.DOTALL)
    if not m:
        return None
    fm = m.group(1)
    title = fm_get(fm, 'title') or fp.stem
    series = fm_get(fm, 'series') or ''
    date = fm_get(fm, 'date') or ''
    if date:
        date = date[:10]
    desc = fm_get(fm, 'description') or ''

    # Clean title (remove leading/trailing quotes that may have leaked)
    title = title.strip().strip('"').strip("'").strip()

    return dict(
        title=title,
        series=series,
        date=date,
        desc=desc[:140] if desc else '',
    )


def get_fonts():
    def f(path, size):
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            return ImageFont.load_default()
    return {
        'eyebrow': f(FONT_EN, 24),
        'title': f(FONT_ZH_BOLD, 64),
        'title_en': f(FONT_EN, 64),
        'series': f(FONT_MONO, 22),
        'desc': f(FONT_ZH, 28),
        'date': f(FONT_MONO, 20),
        'url': f(FONT_MONO, 26),
    }


def wrap_text(draw, text, font, max_width):
    """Wrap Chinese/English text to fit max_width."""
    if not text:
        return []
    lines = []
    current = ''
    for ch in text:
        test = current + ch
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] > max_width and current:
            lines.append(current)
            current = ch
        else:
            current = test
    if current:
        lines.append(current)
    return lines


def make_og(meta, fonts, out_path):
    W, H = 1200, 630
    img = Image.new('RGB', (W, H), IVORY)
    draw = ImageDraw.Draw(img)

    # Top accent bar
    draw.rectangle([0, 0, W, 10], fill=CLAY)

    # Subtle dot pattern (left third)
    for x in range(60, 200, 28):
        for y in range(150, 540, 28):
            draw.ellipse([x-2, y-2, x+2, y+2], fill=G200)

    # Right accent rectangle (clay block)
    draw.rectangle([W-180, 60, W-60, H-60], fill=OAT)
    draw.rectangle([W-180, 60, W-60, 80], fill=CLAY)
    draw.text((W-170, 100), 'POST', fill=SLATE, font=fonts['series'])
    draw.text((W-170, 130), 'CODE', fill=SLATE, font=fonts['series'])
    draw.text((W-170, 160), 'ENGINEERING', fill=G500, font=fonts['series'])

    # Eyebrow with series name
    eyebrow = meta['series'].upper() if meta['series'] else 'AI-NATIVE ENGINEERING'
    draw.text((80, 100), eyebrow[:36], fill=G500, font=fonts['eyebrow'])

    # Title (Chinese)
    is_chinese = bool(re.search(r'[一-鿿]', meta['title']))
    title_font = fonts['title'] if is_chinese else fonts['title_en']
    title_lines = wrap_text(draw, meta['title'], title_font, 820)
    if len(title_lines) > 3:
        title_lines = title_lines[:2] + [title_lines[2][:20] + '…']
    y = 160
    for line in title_lines:
        draw.text((80, y), line, fill=SLATE, font=title_font)
        y += 75

    # Underline accent
    draw.rectangle([80, y + 10, 220, y + 16], fill=CLAY)

    # Description (1-2 lines)
    if meta['desc']:
        desc_lines = wrap_text(draw, meta['desc'], fonts['desc'], 820)
        if len(desc_lines) > 2:
            desc_lines = desc_lines[:2]
        dy = y + 50
        for line in desc_lines:
            draw.text((80, dy), line, fill=G500, font=fonts['desc'])
            dy += 38

    # Bottom bar
    draw.rectangle([0, H-60, W, H], fill=SLATE)
    # Date
    if meta['date']:
        draw.text((80, H-42), meta['date'], fill=(180, 180, 175), font=fonts['date'])
    # URL
    draw.text((W-360, H-42), 'postcodeengineering.com', fill=IVORY, font=fonts['url'])

    img.save(out_path, 'JPEG', quality=85, optimize=True, progressive=True)


def main():
    fonts = get_fonts()
    posts = sorted(POSTS_DIR.glob("*.md"))
    manifest = {'generated': [], 'skipped': []}

    for i, fp in enumerate(posts):
        meta = get_post_meta(fp)
        if not meta or not meta.get('title'):
            manifest['skipped'].append({'slug': fp.stem, 'reason': 'no title'})
            continue
        # Use slug (filename without date prefix) for Jekyll permalink alignment
        slug = re.sub(r'^\d{4}-\d{2}-\d{2}-', '', fp.stem)
        out = OG_DIR / f"{slug}.jpg"
        try:
            make_og(meta, fonts, out)
            size = out.stat().st_size
            manifest['generated'].append({'slug': slug, 'size': size})
        except Exception as e:
            manifest['skipped'].append({'slug': slug, 'reason': str(e)})
        if (i + 1) % 20 == 0:
            print(f"  {i+1}/{len(posts)} done")

    # Write manifest
    manifest_path = ROOT / '_scratch' / 'og-manifest.json'
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False))

    total = len(manifest['generated'])
    skipped = len(manifest['skipped'])
    total_kb = sum(g['size'] for g in manifest['generated']) // 1024
    print(f"\n✓ Generated {total} OG images ({total_kb} KB total)")
    if skipped:
        print(f"⚠ Skipped {skipped}: {manifest['skipped'][:3]}")


if __name__ == '__main__':
    main()
