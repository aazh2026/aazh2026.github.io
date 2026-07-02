#!/usr/bin/env node
/**
 * Verify that every `<object>` tag in _posts/*.md has a meaningful
 * `aria-label`. Fails the build (exit 1) if any are bare placeholders.
 *
 * "Meaningful" means: not exactly "插图", and not ending in "（插图）".
 *
 * EXCEPTION: <object type="image/svg+xml"> does NOT need aria-label.
 * html-validate's `aria-label-misuse` rule forbids it (the embedded SVG
 * has implicit role="img" and aria-label is not allowed there).
 * Instead, the SVG file itself must have <title> and <desc> for a11y
 * (enforced by visual review + the template README).
 *
 * Usage:
 *   node scripts/check-aria-labels.js             # all posts
 *   node scripts/check-aria-labels.js file.md ... # one or more files
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const PLACEHOLDER_EXACT = "插图";
const PLACEHOLDER_SUFFIX = "（插图）";
const OBJECT_TAG = /<object\s+[^>]*?>/g;
const LABEL_ATTR = /\baria-label="([^"]*)"/;
const TYPE_ATTR = /\btype="([^"]*)"/;

function isSvgObject(tag) {
  const m = TYPE_ATTR.exec(tag);
  return m && /image\/svg/i.test(m[1]);
}

function isBadLabel(s) {
  if (!s) return true;
  if (s === PLACEHOLDER_EXACT) return true;
  if (s.endsWith(PLACEHOLDER_SUFFIX)) return true;
  return false;
}

function checkFile(file) {
  const src = fs.readFileSync(file, "utf8");
  const offenders = [];
  let skipped = 0;
  OBJECT_TAG.lastIndex = 0;
  let m;
  while ((m = OBJECT_TAG.exec(src))) {
    if (isSvgObject(m[0])) {
      skipped++;
      continue;
    }
    const lm = LABEL_ATTR.exec(m[0]);
    const label = lm ? lm[1] : null;
    if (isBadLabel(label)) {
      offenders.push({
        index: m.index,
        snippet: m[0].slice(0, 120),
        label,
      });
    }
  }
  return { file, offenders, skipped };
}

function main() {
  const argv = process.argv.slice(2);
  const inputs = argv.length
    ? argv
    : fs.readdirSync(path.join(ROOT, "_posts"))
        .filter((f) => f.endsWith(".md"))
        .map((f) => path.join(ROOT, "_posts", f));

  let total = 0;
  let totalSkipped = 0;
  let filesAffected = 0;
  const byFile = [];

  for (const file of inputs) {
    const r = checkFile(file);
    totalSkipped += r.skipped;
    if (r.offenders.length > 0) {
      total += r.offenders.length;
      filesAffected++;
      byFile.push(r);
    }
  }

  console.log(
    `[check-aria-labels] scanned ${inputs.length} file(s), ${totalSkipped} SVG <object> skipped (a11y via SVG <title>/<desc>), ${total} placeholder label(s) found`
  );

  if (total > 0) {
    console.error("");
    console.error(`[check-aria-labels] FAIL — ${total} <object> tag(s) need real aria-label text:`);
    for (const r of byFile) {
      console.error(`  ${path.relative(ROOT, r.file)} (${r.offenders.length}):`);
      for (const o of r.offenders) {
        console.error(`    [${o.index}] label=${JSON.stringify(o.label)}  ${o.snippet}…`);
      }
    }
    console.error("");
    console.error("Run `node scripts/fix-aria-labels.js` to replace placeholders,");
    console.error("or edit the offending file manually to add a real label.");
    console.error("(SVG <object type=\"image/svg+xml\"> tags do NOT need aria-label.)");
    process.exit(1);
  }

  console.log("[check-aria-labels] OK — no placeholder aria-labels found");
}

main();