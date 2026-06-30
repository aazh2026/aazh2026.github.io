#!/usr/bin/env node
/**
 * Collapse every `series:` value in _posts/*.md to its canonical slug as
 * declared in _data/series.yml. Idempotent — running on already-migrated
 * posts is a no-op.
 *
 * Mapping rules (see _data/series.yml for the source of truth):
 *   - "AI-Native Engineering"           → aise
 *   - "AI-Native软件工程"               → aise
 *   - "AI-Native软件工程系列 #N"        → aise
 *   - "Agent-OS-Series" / "Agent OS" / → agent-os
 *     "agent-os" / "AI-OS"
 *   - "Memory Engineering"             → memory-engineering
 *   - "AI安全洞察" / "AI-Native Security" → ai-native-security
 *   - "AI产品洞察" / "产业深度洞察" / "企业架构洞察" → industry-insight
 *
 * Posts with no `series:` are left alone (essays).
 *
 * Usage:
 *   node scripts/fix-series.js            # all posts
 *   node scripts/fix-series.js file.md... # one or more files
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const yaml = require("js-yaml");

const ROOT = path.resolve(__dirname, "..");

function loadRegistry() {
  const text = fs.readFileSync(path.join(ROOT, "_data/series-slugs.yml"), "utf8");
  const parsed = yaml.load(text);
  // Build: pattern-regex → slug.
  const map = [];
  for (const entry of parsed) {
    for (const pat of entry.match_patterns || []) {
      map.push({ re: new RegExp(pat), slug: entry.slug });
    }
  }
  return { parsed, map };
}

function fixFile(file, registry) {
  const src = fs.readFileSync(file, "utf8");
  const fmMatch = /^---\n([\s\S]*?)\n---/.exec(src);
  if (!fmMatch) return { changed: false };
  let fm;
  try {
    fm = yaml.load(fmMatch[1]);
  } catch (e) {
    console.error(`  ${path.relative(ROOT, file)}: YAML parse error: ${e.message}`);
    return { changed: false };
  }
  const before = fm.series;
  if (!before) return { changed: false };

  // Canonical slug already?
  if (registry.parsed.some((e) => e.slug === before)) return { changed: false };

  // Find a pattern that matches.
  let newSlug = null;
  for (const { re, slug } of registry.map) {
    if (re.test(before)) {
      newSlug = slug;
      break;
    }
  }
  if (!newSlug || newSlug === before) return { changed: false };

  // Rewrite frontmatter preserving indentation style.
  // The original `series:` line is replaced verbatim.
  const lineRe = /^(\s*series:\s*)(.+?)\s*$/m;
  const newSrc = src.replace(lineRe, (_m, prefix, _value) => `${prefix}${newSlug}`);
  if (newSrc === src) {
    return { changed: false, note: `series: line not found in ${file}` };
  }
  fs.writeFileSync(file, newSrc);
  return { changed: true, before, after: newSlug };
}

function main() {
  const argv = process.argv.slice(2);
  const inputs = argv.length
    ? argv
    : fs.readdirSync(path.join(ROOT, "_posts"))
        .filter((f) => f.endsWith(".md"))
        .map((f) => path.join(ROOT, "_posts", f));

  const registry = loadRegistry();
  let totalChanged = 0;
  let filesChanged = 0;
  const byTarget = {};

  for (const file of inputs) {
    const r = fixFile(file, registry);
    if (r.changed) {
      filesChanged++;
      totalChanged++;
      byTarget[r.after] = (byTarget[r.after] || 0) + 1;
      console.log(`  ${path.relative(ROOT, file)}: "${r.before}" → ${r.after}`);
    }
    if (r.note) console.error(r.note);
  }
  console.log("");
  console.log(
    `[fix-series] ${totalChanged} post(s) collapsed across ${filesChanged} file(s):`
  );
  for (const [slug, n] of Object.entries(byTarget).sort((a, b) => b[1] - a[1])) {
    console.log(`  → ${slug}: ${n}`);
  }
}

main();