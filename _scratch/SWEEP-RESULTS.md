# Blog Sweep + Optimization — Cumulative Results

**Final date**: 2026-06-30
**Scope**: 204 posts, 546 SVG + 17 raster assets, 45 HTML files, 4 CI workflows
**Outcome**: 100% refined corpus, 0 broken links, 0 broken YAML, 0 broken assets, full a11y coverage

## Sweep history (in order)

### 1. `4e3e20e` refactor/posts-finish-sweep
- 80 429-failed posts fully refined (TL;DR + Key Insight + section fills + SVG embed)
- 17 posts needed a fix-up pass; all 17 repaired in round 2
- 58 new SVG files (491 → 549)
- Cleaned up corrupted Key Insight block in 2025-06-12-contract-testing-automation.md
- 5.26M tokens / 177 agent calls / 1h26m wall clock

### 2. `35c5a7c` chore/full-optimization
- SVGO: 549 → 546 SVG, 3.81 MB → 2.98 MB (17.4% smaller), max 85 KB → 36 KB
- Fixed 4 broken SVGs (truncated, mismatched `</g>`, stray `</tspan>`, missing `</text>`)
- 3 PNGs were actually JPEGs misnamed as .png — renamed to .jpg
- 3 truly orphan PNGs deleted
- 4 referenced PNGs (also JPEGs) renamed + posts updated
- 1 PNG was JPEG misnamed as .svg — renamed to .jpg
- 1 placeholder email removed from _config.yml
- 2 posts got missing `series:` frontmatter
- 1 post: fixed 3 broken internal links
- 570 files touched

### 3. `069d9ca` chore/description-sweep
- 203 posts got `description:` frontmatter (was 2/205 → now 205/205)
- 1-2 Chinese sentences / 30-80 characters each
- 1.5M tokens / 9m wall clock / 21 agent batches of 10

### 4. `d109d27` fix/description-quotes
- 16 posts had YAML parse errors from un-escaped ASCII double quotes inside
  `description: "..."` (agent had used `"操作AI"` inside the value)
- Fixed by converting all 16 from double-quoted to single-quoted form
- 16/16 verified with Python yaml.safe_load
- Root cause: the original `validate-frontmatter.sh` was a grep-based no-op that
  didn't actually parse YAML, so the bug slipped past CI

### 5. `b04d2e9` ci/link-checker
- New `.github/workflows/link-check.yml`
- Builds site with jekyll, runs lychee in --offline mode against _site
- Catches broken internal links + missing asset references
- Also added `loading="lazy" decoding="async"` to the one `<img>` tag in corpus

### 6. `14ef454` a11y/improvements
- 520 `<object>` tags got `aria-label` + `role="img"`
- Label source: SVG `<title>` (193) > current H2/H3 (324) > generic fallback (3)
- 2 multi-line `<object>` tags manually fixed
- New `_includes/skip-to-content.html` linked to `<main id="main-content">`
- Visually hidden until keyboard focus

### 7. `57dc1f0` chore/frontmatter-validator
- New `scripts/validate-frontmatter.py` using Python `yaml.safe_load`
- Replaces the broken `validate-frontmatter.sh` (was grep-based, had wrong path)
- `.github/workflows/validate-frontmatter.yml` rewritten to use Python + pyyaml
- New `.githooks/pre-commit` runs validator on commit
- Removed duplicate `_posts/aise-series.md` (root `aise-series.html` serves same)
- 204/204 posts pass validation

### 8. `c4abfd7` fix/html-links
- 16 broken internal HTML links repaired:
  - 9 hardcoded old date-style URLs in 404.html → `/slug/` form
  - 4 series-index links pointing to friendly slugs that don't match real posts
    (e.g., `agent-os-future-of-software` → `agent-memory-system-design`)
  - 1 favicon.png reference with no file → created favicon.png
  - 9 "planned future post" rows removed from series index pages
  - context-engineering permalink mismatch
- New `scripts/check-internal-links.js` for pre-build internal link check
- `link-check.yml` extended with Node pre-build step
- Final state: 0 broken internal links

### 9. `a5f73f6` feat/og-default
- Created `assets/images/og-default.png` (1200×630, 54 KB) for social sharing
- seo.html referenced this path but file was missing
- Brand colors, bilingual title, URL bar

## Final state

| Metric | Value |
|---|---|
| Posts | 204 |
| SVG files | 546 (max 36 KB, SVGO'd) |
| PNG files | 10 (all have SVG pairs) |
| JPG files | 7 (corrected misnamed PNGs) |
| HTML templates | 45 (32 _includes + 3 _layouts + 10 root) |
| Internal links | 175 (0 broken) |
| Posts with description | 205/205 |
| Posts with valid YAML | 204/204 |
| `<object>` with aria-label | 520/520 |
| CI workflows | 4 (pages / deploy / validate-frontmatter / link-check) |
| Pre-commit hook | 1 (frontmatter validation) |
| Defense layers | Agent prompt + pre-commit + 3-stage CI + deployed-site |

## Token economics (this session total)

| Phase | Tokens | Wall clock |
|---|---|---|
| finish-sweep | 5.26M | 1h26m |
| full-optimization | sync (script-driven) | <1m |
| description-sweep | 1.5M | 9m |
| link-check + html-links | sync (script-driven) | <5m |
| **Total** | **~7M** | **~1h35m** |

The finish-sweep dominates token usage because it ran agents in parallel
(80 Execute + 80 Verify + 17 Fix-up = 177 calls).
