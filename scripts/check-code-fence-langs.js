#!/usr/bin/env node
/**
 * Verify every ``` fence in _posts/*.md has a language tag. Bare fences
 * get rendered as raw markdown by kramdown, so a # inside a bare fence
 * turns into an h1 heading — polluting the heading hierarchy.
 *
 * Exit 0 if every fence has a non-empty language tag, exit 1 otherwise.
 *
 * Usage:
 *   node scripts/check-code-fence-langs.js           # all posts
 *   node scripts/check-code-fence-langs.js file.md.. # one or more files
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const FENCE_RE = /^```(\S*)/;

function checkFile(file) {
  const src = fs.readFileSync(file, "utf8");
  const lines = src.split("\n");
  const offenders = [];
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const m = FENCE_RE.exec(lines[i]);
    if (!m) continue;
    if (!inFence && m[1] === "") {
      // Bare opening fence — fails the check.
      offenders.push({ line: i + 1, snippet: lines[i] });
    }
    // Toggle: any ``` line flips inFence (regardless of having a tag).
    inFence = !inFence;
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
    `[check-code-fence-langs] scanned ${inputs.length} file(s), ${total} bare fence(s) found`
  );

  if (total > 0) {
    console.error("");
    console.error(`[check-code-fence-langs] FAIL — ${total} bare fence(s) need a language tag:`);
    for (const r of byFile) {
      console.error(`  ${path.relative(ROOT, r.file)} (${r.offenders.length}):`);
      for (const o of r.offenders) {
        console.error(`    line ${o.line}: ${o.snippet}`);
      }
    }
    console.error("");
    console.error("Run `node scripts/fix-code-fence-langs.js` to auto-tag, or");
    console.error("add the language tag manually (```python, ```yaml, ```text, etc.).");
    process.exit(1);
  }

  console.log("[check-code-fence-langs] OK — no bare fences");
}

main();