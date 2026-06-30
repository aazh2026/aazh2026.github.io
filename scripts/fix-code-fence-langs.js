#!/usr/bin/env node
/**
 * Add a language tag to every bare ``` fence in _posts/*.md.
 *
 * Why: bare fences containing `#` comments get rendered as h1 by kramdown,
 * polluting heading audits. The fix is a one-shot pass that inspects the
 * first non-empty line and assigns a tag heuristically.
 *
 * Heuristic — first non-empty line is matched (case-insensitive) against:
 *   html     → contains `<element>` or starts with `<!`
 *   yaml     → starts with `---`, `name:`, `version:`, or contains `:\s*\S`
 *   json     → starts with `{` or `[`
 *   bash     → starts with `#`, `$ `, or contains `git |npm |yarn |docker |brew `
 *   python   → contains `def `, `class `, `import `, `print(`, `self\.`, `:\s*$`
 *   ruby     → contains `def `, `do \|`, `end$`, `puts `, `\.each do`
 *   sql      → contains `SELECT |INSERT |UPDATE |DELETE |CREATE TABLE`
 *   css      → contains `{\s*$` or `^\s*\.\w+\s*{` or `^@media`
 *   javascript → contains `const `, `let `, `function `, `=>`, `require(`, `\bvar `
 *   text     → fallback for prose / Chinese content
 *
 * Usage:
 *   node scripts/fix-code-fence-langs.js            # all posts
 *   node scripts/fix-code-fence-langs.js file.md... # one or more files
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

const FENCE_OPEN = /^```\s*$/m;
const FENCE_ANY = /^```/;

function detectLang(firstLine) {
  const s = (firstLine || "").trim();
  if (!s) return "text";
  if (/^<(!|html|div|span|p|a |svg|\?xml)/i.test(s)) return "html";
  if (/^(---|\w[\w-]*:\s*\S)/.test(s)) return "yaml";
  if (/^[\{\[]/.test(s)) return "json";
  if (/^(#|\$\s|git\b|npm\b|yarn\b|docker\b|brew\b|pip\b)/i.test(s)) return "bash";
  if (/\bdef\s|\bclass\s|^import\s|\bprint\(|self\.|\.\w+\(self/.test(s)) return "python";
  if (/\bputs\b|\bdo\s*\|\w+\s*\||\.each\s+do\b|\bend\s*$/.test(s)) return "ruby";
  if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE TABLE)\b/i.test(s)) return "sql";
  if (/{\s*$|^\s*\.\w[\w-]*\s*\{|^@media\b/.test(s)) return "css";
  if (/\bconst\b|\blet\b|\bfunction\b|\bvar\b|=>|require\(/.test(s)) return "javascript";
  return "text";
}

function fixFile(file) {
  const src = fs.readFileSync(file, "utf8");
  const lines = src.split("\n");
  const changes = [];

  let inFence = false;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (FENCE_OPEN.test(line)) {
      // Bare opening fence.
      if (!inFence) {
        // Look ahead for the first non-empty line inside this fence.
        let j = i + 1;
        while (j < lines.length && !FENCE_ANY.test(lines[j])) j++;
        const firstContent = lines.slice(i + 1, j).find((l) => l.trim() !== "");
        const lang = detectLang(firstContent);
        lines[i] = "```" + lang;
        changes.push({ from: "```", to: "```" + lang });
      }
      inFence = !inFence;
      i++;
      continue;
    }
    // Tagged line that might be a typo'd close (e.g. ```text) — normalize to bare ```.
    if (inFence && /^```\S/.test(line)) {
      lines[i] = "```";
      changes.push({ from: line, to: "```" });
      inFence = false;
      i++;
      continue;
    }
    // Tagged opening fence — flip state.
    if (/^```\S/.test(line)) {
      inFence = !inFence;
    }
    i++;
  }

  if (changes.length > 0) {
    fs.writeFileSync(file, lines.join("\n"));
  }
  return { file, changes };
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
  const langHistogram = {};

  for (const file of inputs) {
    const r = fixFile(file);
    if (r.changes.length > 0) {
      filesChanged++;
      totalChanged += r.changes.length;
      const rel = path.relative(ROOT, file);
      const langs = r.changes.map((c) => c.to.replace("```", ""));
      console.log(`  ${rel}: ${langs.join(", ")}`);
      for (const l of langs) langHistogram[l] = (langHistogram[l] || 0) + 1;
    }
  }

  console.log("");
  console.log(`[fix-code-fence-langs] ${totalChanged} bare fence(s) tagged across ${filesChanged} file(s)`);
  console.log("Language histogram:");
  for (const [lang, n] of Object.entries(langHistogram).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${lang.padEnd(12)} ${n}`);
  }
}

main();