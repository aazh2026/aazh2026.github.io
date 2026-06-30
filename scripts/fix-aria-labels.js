#!/usr/bin/env node
/**
 * Replace generic `<object aria-label="插图">` placeholders in _posts/*.md
 * with labels derived from the nearest preceding heading. Idempotent — running
 * it on already-fixed files is a no-op.
 *
 * Two replacement patterns:
 *   1. Pure placeholder: aria-label="插图"
 *      → "{heading}（{filename-stem}）"  e.g. "冷启动策略（forgetting-tiers）"
 *   2. Suffix placeholder: aria-label="...（插图）"
 *      → strip the （插图）suffix and use the prefix as-is.
 *
 * The label source for #1 is the nearest preceding `^## ` or `^### ` heading
 * in the same file. If there's no preceding heading (rare — the object is at
 * the top of the file), falls back to "{filename-stem}" alone.
 *
 * Usage:
 *   node scripts/fix-aria-labels.js           # all posts
 *   node scripts/fix-aria-labels.js path...   # one or more files
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

// Matches a single <object ...> opening tag and its aria-label attribute.
// We deliberately don't try to match </object> — aria-label lives on the open.
const OBJECT_TAG = /<object\s+[^>]*?>/g;

function pickHeading(markdown, beforeIdx) {
  // Walk backwards from beforeIdx looking for the last heading line.
  // Heading syntax: `^#{1,6} `. We're scanning markdown source, so the
  // last heading that appears strictly before the object.
  const slice = markdown.slice(0, beforeIdx);
  const lines = slice.split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = /^#{1,6}\s+(.+?)\s*$/.exec(lines[i]);
    if (m) return m[1].trim();
  }
  return null;
}

function stemOf(assetPath) {
  const base = assetPath.split("/").pop() || assetPath;
  return base.replace(/\.svg$/i, "");
}

function newLabel(markdown, tagMatch) {
  const tagText = tagMatch[0];

  // Extract current aria-label
  const labelMatch = /\baria-label="([^"]*)"/.exec(tagText);
  if (!labelMatch) return null; // no aria-label — leave it alone
  const oldLabel = labelMatch[1];

  // Extract data= (asset path)
  const dataMatch = /\bdata="([^"]*)"/.exec(tagText);
  const assetPath = dataMatch ? dataMatch[1] : "";

  // Pattern 2: ...（插图）suffix — strip the suffix and reuse the prefix.
  const suffixMatch = /^(.*?)（插图）$/.exec(oldLabel);
  if (suffixMatch) {
    const cleaned = suffixMatch[1].trim();
    if (cleaned && cleaned !== "插图") {
      // Already had real content — just drop the suffix marker.
      return { oldLabel, replacement: cleaned };
    }
  }

  // Pattern 1: pure "插图" placeholder — derive from heading + filename.
  if (oldLabel === "插图") {
    const idx = tagMatch.index ?? 0;
    const heading = pickHeading(markdown, idx);
    const stem = stemOf(assetPath);
    const replacement = heading
      ? `${heading}（${stem}）`
      : `${stem} 图示`;
    return { oldLabel, replacement };
  }

  // Anything else — leave alone (might already be a meaningful label).
  return null;
}

function fixFile(file) {
  const src = fs.readFileSync(file, "utf8");
  let out = "";
  let lastEnd = 0;
  let changed = 0;
  const offenders = [];

  OBJECT_TAG.lastIndex = 0;
  let match;
  while ((match = OBJECT_TAG.exec(src))) {
    const result = newLabel(src, match);
    if (!result) continue;

    const newTag = match[0].replace(
      /\baria-label="[^"]*"/,
      `aria-label="${result.replacement.replace(/"/g, "&quot;")}"`
    );
    out += src.slice(lastEnd, match.index) + newTag;
    lastEnd = match.index + match[0].length;
    changed++;
    offenders.push({ oldLabel: result.oldLabel, replacement: result.replacement });
  }
  out += src.slice(lastEnd);

  if (changed > 0) {
    fs.writeFileSync(file, out);
  }
  return { file, changed, offenders };
}

function main() {
  const argv = process.argv.slice(2);
  const inputs = argv.length
    ? argv
    : fs.readdirSync(path.join(ROOT, "_posts"))
        .filter((f) => f.endsWith(".md"))
        .map((f) => path.join(ROOT, "_posts", f));

  let totalChanged = 0;
  let filesChanged = 0;
  for (const file of inputs) {
    const r = fixFile(file);
    if (r.changed > 0) {
      filesChanged++;
      totalChanged += r.changed;
      const rel = path.relative(ROOT, file);
      console.log(`  ${rel}: ${r.changed} placeholder(s) replaced`);
    }
  }
  console.log(
    `[fix-aria-labels] ${totalChanged} placeholder(s) replaced across ${filesChanged} file(s)`
  );
}

main();