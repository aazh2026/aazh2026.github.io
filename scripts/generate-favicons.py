#!/usr/bin/env python3
"""Generate all favicon sizes from favicon.png.

Outputs to assets/images/favicons/:
  - favicon.ico           (16/32/48 multi-res ICO)
  - favicon-16x16.png
  - favicon-32x32.png
  - apple-touch-icon.png  (180x180)
  - android-chrome-192x192.png
  - android-chrome-512x512.png
  - mstile-150x150.png

Reads the source favicon.png at the project root. If it's missing or
corrupt, falls back to programmatically drawing a simple "h" mark in the
brand clay color (#C46D4E) so the build never fails.
"""

import os
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "favicon.png"
OUT = ROOT / "assets" / " "  # placeholder
OUT = ROOT / "assets" / "images" / "favicons"
OUT.mkdir(parents=True, exist_ok=True)

CLAY = (196, 109, 78, 255)
IVORY = (250, 249, 245, 255)


def make_fallback(size: int) -> Image.Image:
    """Programmatically draw a simple "h" mark in brand colors."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # Rounded square background
    pad = max(2, size // 8)
    d.rounded_rectangle(
        [(pad, pad), (size - pad, size - pad)],
        radius=size // 6,
        fill=CLAY,
    )
    # White "h" — two strokes (vertical bar + hump)
    bar_w = max(2, size // 7)
    margin = size // 4
    base = size - margin
    # Vertical bar
    d.rectangle(
        [(margin, margin), (margin + bar_w, base)],
        fill=IVORY,
    )
    # Hump (right vertical + horizontal + left short vertical)
    top = (size + margin) // 2
    right_x = size - margin
    d.rectangle(
        [(right_x - bar_w, top), (right_x, base)],
        fill=IVORY,
    )
    d.rectangle(
        [(margin, top - bar_w // 2), (right_x, top + bar_w // 2)],
        fill=IVORY,
    )
    return img


def load_source() -> Image.Image:
    if not SRC.exists():
        print(f"[favicons] no source at {SRC}, using programmatic fallback")
        return make_fallback(512)
    try:
        im = Image.open(SRC).convert("RGBA")
        if im.size[0] < 16 or im.size[1] < 16:
            print(f"[favicons] source too small ({im.size}), using fallback")
            return make_fallback(512)
        return im
    except Exception as e:
        print(f"[favicons] failed to read {SRC}: {e}, using fallback")
        return make_fallback(512)


def main() -> int:
    src = load_source()
    src_512 = src.resize((512, 512), Image.LANCZOS)

    sizes = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "apple-touch-icon.png": 180,
        "android-chrome-192x192.png": 192,
        "android-chrome-512x512.png": 512,
        "mstile-150x150.png": 150,
    }
    for name, sz in sizes.items():
        out = src_512.resize((sz, sz), Image.LANCZOS)
        out.save(OUT / name, "PNG", optimize=True)
        print(f"[favicons] wrote {name} ({sz}x{sz})")

    # Multi-resolution ICO (16/32/48)
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    ico_imgs = [src_512.resize(sz, Image.LANCZOS) for sz in ico_sizes]
    ico_imgs[0].save(
        OUT / "favicon.ico",
        format="ICO",
        sizes=ico_sizes,
        append_images=ico_imgs[1:],
    )
    print(f"[favicons] wrote favicon.ico (16/32/48)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
