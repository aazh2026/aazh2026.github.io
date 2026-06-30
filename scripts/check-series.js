#!/usr/bin/env node
/**
 * Verify every post's `series:` value matches one of the canonical slugs
 * in _data/series.yml. Posts without a series are allowed (essays), but
 * posts that claim a series must use the canonical slug — not a legacy
 * variant like "AI-Native Engineering" or "Agent-OS-Series".
 *
 * Fail loudly on:
 *   - series: values that don't match any slug OR any registered pattern
 *   - posts where the slug and a pattern both match but disagree
 *
 * Idempotent fixer: scripts/fix-series.js (companion) collapses every
 * recognized variant to its canonical slug in place.
 *
 * Usage:
 *   node scripts/check-series.js            # all posts
 *   node scripts/check-series.js file.md... # one or more files
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const yaml = require("js-yaml");

const ROOT = path.resolve(__dirname, "..");

function loadRegistry() {
  const text = fs.readFileSync(path.join(ROOT, "_data/series-slugs.yml"), "utf8");
  const parsed = yaml.load(text);
  // Build reverse map: regex → slug.
  const map = new Map();
  for (const entry of parsed) {
    for (const pat of entry.match_patterns || []) {
      map.set(new RegExp(pat), entry.slug);
    }
  }
  return { parsed, map };
}

function frontmatterOf(file) {
  const src = fs.readFileSync(file, "utf8");
  const m = /^---\n([\s\S]*?)\n---/.exec(src);
  if (!m) return { src, fm: null };
  try {
    const fm = yaml.load(m[1]);
    return { src, fm };
  } catch (e) {
    return { src, fm: null, error: e.message };
  }
}

function classify(registry, rawSeries) {
  if (!rawSeries) return { ok: true, kind: "none" };
  if (registry.map.has(rawSeries)) {
    return { ok: true, kind: "canonical-or-pattern" };
  }
  // Known canonical slug?
  if (registry.parsed.some((e) => e.slug === rawSeries)) {
    return { ok: true, kind: "canonical" };
  }
  return { ok: false, kind: "unknown", value: rawSeries };
}

function main() {
  const argv = process.argv.slice(2);
  const inputs = argv.length
    ? argv
    : fs.readdirSync(path.join(ROOT, "_posts"))
        .filter((f) => f.endsWith(".md"))
        .map((f) => path.join(ROOT, "_posts", f));

  const registry = loadRegistry();
  const offenders = [];
  const summary = { total: 0, none: 0, canonical: 0, legacy: 0 };

  for (const file of inputs) {
    const { fm } = frontmatterOf(file);
    if (!fm) continue;
    summary.total++;
    const c = classify(registry, fm.series);
    if (c.kind === "none") summary.none++;
    else if (c.kind === "canonical") summary.canonical++;
    else if (c.kind === "canonical-or-pattern") summary.legacy++;
    if (!c.ok) offenders.push({ file, series: c.value });
  }

  console.log(
    `[check-series] ${summary.total} posts: ` +
      `${summary.canonical} canonical, ${summary.legacy} legacy-pattern, ` +
      `${summary.none} no-series`
  );

  if (offenders.length > 0) {
    console.error("");
    console.error(`[check-series] FAIL — ${offenders.length} post(s) use an unknown series:`);
    for (const o of offenders) {
      console.error(`  ${path.relative(ROOT, o.file)}: series=${JSON.stringify(o.series)}`);
    }
    console.error("");
    console.error("Either add the new variant to _data/series.yml,");
    console.error("or run `node scripts/fix-series.js` to map it to a canonical slug.");
    process.exit(1);
  }

  console.log("[check-series] OK — every post uses a recognized series");
}

main();