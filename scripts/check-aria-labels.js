#!/usr/bin/env node
/**
 * Verify that every `<object>` tag in _posts/*.md has a meaningful
 * `aria-label`. Fails the build (exit 1) if any are bare placeholders.
 *
 * "Meaningful" means: not exactly "插图", and not ending in "（插图）".
 * Authors can replace a generic label with anything else; the CI just
 * refuses to let the placeholder land in committed posts.
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

function isBadLabel(s) {
  if (!s) return true;
  if (s === PLACEHOLDER_EXACT) return true;
  if (s.endsWith(PLACEHOLDER_SUFFIX)) return true;
  return false;
}

function checkFile(file) {
  const src = fs.readFileSync(file, "utf8");
  const offenders = [];
  OBJECT_TAG.lastIndex = 0;
  let m;
  while ((m = OBJECT_TAG.exec(src))) {
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
  return { file, offenders };
}

function main() {
  const argv = process.argv.slice(2);
  const inputs = argv.length
    ? argv
    : fs.readdirSync(path.join(ROOT, "_posts"))
        .filter((f) => f.endsWith(".md"))
        .map((f) => path.join(ROOT, "_posts", f));

  let total = 0;
  let filesAffected = 0;
  const byFile = [];

  for (const file of inputs) {
    const r = checkFile(file);
    if (r.offenders.length > 0) {
      total += r.offenders.length;
      filesAffected++;
      byFile.push(r);
    }
  }

  console.log(
    `[check-aria-labels] scanned ${inputs.length} file(s), ${total} placeholder label(s) found`
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
    process.exit(1);
  }

  console.log("[check-aria-labels] OK — no placeholder aria-labels found");
}

main();