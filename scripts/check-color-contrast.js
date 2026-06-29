#!/usr/bin/env node
// A11y color contrast checker for the site's design system.
// Verifies that all CSS color variables meet WCAG AA contrast (4.5:1 for body, 3:1 for large)
// against their intended background pairs.
//
// Fails CI if any color pair falls below threshold.

const fs = require('fs');
const path = require('path');

function relLum(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const f = c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(fg, bg) {
  const l1 = relLum(fg), l2 = relLum(bg);
  const [a, b] = [l1, l2].sort((a, b) => b - a);
  return (a + 0.05) / (b + 0.05);
}

const ROOT = path.join(__dirname, '..');
const scssPath = path.join(ROOT, 'assets', 'css', 'style.scss');
const scss = fs.readFileSync(scssPath, 'utf8');

// Extract color variables
const colors = {};
const re = /--(\w+):\s*(#[0-9a-fA-F]{6})/g;
let m;
while ((m = re.exec(scss))) colors[m[1]] = m[2];

// Extract light + dark mode color sets
// Light mode: :root { ... }  block at top
// Dark mode: [data-theme="dark"] { ... }  block
function extractBlock(scss, marker) {
  const idx = scss.indexOf(marker);
  if (idx === -1) return {};
  const start = scss.indexOf('{', idx);
  let depth = 1;
  let end = start + 1;
  while (end < scss.length && depth > 0) {
    if (scss[end] === '{') depth++;
    if (scss[end] === '}') depth--;
    end++;
  }
  const block = scss.slice(start, end);
  const set = {};
  const re = /--(\w+):\s*(#[0-9a-fA-F]{6})/g;
  let m;
  while ((m = re.exec(block))) set[m[1]] = m[2];
  return set;
}

const lightColors = extractBlock(scss, ':root');
const darkColors = extractBlock(scss, '[data-theme="dark"]');

// Test pairs (text color on background)
const PAIRS = [
  // Light mode (ivory bg #FAF9F5)
  { name: 'slate on ivory (body text)', fg: lightColors.slate, bg: lightColors.ivory, min: 4.5 },
  { name: 'g700 on ivory (secondary text)', fg: lightColors.g700, bg: lightColors.ivory, min: 4.5 },
  { name: 'g500 on ivory (meta text)', fg: lightColors.g500, bg: lightColors.ivory, min: 4.5 },
  { name: 'clay on ivory (accent on light)', fg: lightColors.clay, bg: lightColors.ivory, min: 3 },
  // Dark mode (dark bg #1a1a1a)
  { name: 'slate on dark (body text)', fg: darkColors.slate, bg: darkColors.ivory, min: 4.5 },
  { name: 'g700 on dark (secondary text)', fg: darkColors.g700, bg: darkColors.ivory, min: 4.5 },
  { name: 'g500 on dark (meta text)', fg: darkColors.g500, bg: darkColors.ivory, min: 4.5 },
];

let passed = 0, failed = 0;
console.log('Color contrast audit (WCAG AA):');
console.log('');
for (const p of PAIRS) {
  if (!p.fg || !p.bg) {
    console.log(`  SKIP ${p.name} (color not found)`);
    continue;
  }
  const ratio = contrast(p.fg, p.bg);
  const ok = ratio >= p.min;
  const mark = ok ? '✓' : '✗';
  console.log(`  ${mark} ${p.name}: ${ratio.toFixed(2)}:1 (need ${p.min}:1)`);
  if (ok) passed++; else failed++;
}
console.log('');
console.log(`${passed}/${PAIRS.length} pairs pass`);

if (failed > 0) {
  console.error(`\n✗ ${failed} contrast pair(s) below WCAG AA`);
  process.exit(1);
}
