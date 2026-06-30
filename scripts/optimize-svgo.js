#!/usr/bin/env node
// scripts/optimize-svgo.js
//
// Optimize every SVG in assets/images in place using svgo with
// svgo.config.mjs. Run this locally before committing new SVG assets so
// CI's check-svgo stays green.
//
// Usage:
//   npm run optimize-svgo
//   node scripts/optimize-svgo.js assets/images/foo.svg assets/images/bar.svg
"use strict";

const fs = require("node:fs");
const path = require("node:path");

// svgo v4 is ESM-only — load it via dynamic import from this CJS script.
const svgo = import("svgo");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_DIRS = ["assets/images"];

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    if (e.code === "ENOENT") return out;
    throw e;
  }
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.isFile() && p.endsWith(".svg")) out.push(p);
  }
  return out;
}

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KiB`;
  return `${(n / 1024 / 1024).toFixed(2)} MiB`;
}

async function main() {
  const { loadConfig, optimize } = await svgo;

  const argv = process.argv.slice(2);
  const inputs = argv.length
    ? argv
    : DEFAULT_DIRS.map((d) => path.join(ROOT, d)).flatMap((d) => walk(d));

  if (inputs.length === 0) {
    console.error("[optimize-svgo] no SVG inputs found");
    process.exit(0);
  }

  process.chdir(ROOT);
  const config = await loadConfig();

  let totalBefore = 0;
  let totalAfter = 0;
  let changed = 0;

  for (const file of inputs) {
    const before = fs.readFileSync(file, "utf8");
    const result = optimize(before, { path: file, ...config });
    if (result.error) {
      console.error(`[optimize-svgo] error processing ${file}: ${result.error}`);
      process.exitCode = 1;
      continue;
    }
    const beforeBytes = Buffer.byteLength(before, "utf8");
    const afterBytes = Buffer.byteLength(result.data, "utf8");
    totalBefore += beforeBytes;
    totalAfter += afterBytes;
    if (afterBytes < beforeBytes) {
      fs.writeFileSync(file, result.data);
      changed++;
      const pct = ((1 - afterBytes / beforeBytes) * 100).toFixed(1);
      console.log(`  ${path.relative(ROOT, file)}: ${formatBytes(beforeBytes)} → ${formatBytes(afterBytes)} (-${pct}%)`);
    }
  }

  const totalPct = ((1 - totalAfter / totalBefore) * 100).toFixed(2);
  console.log(
    `[optimize-svgo] ${changed}/${inputs.length} files updated, ` +
      `${formatBytes(totalBefore)} → ${formatBytes(totalAfter)} (-${totalPct}% total)`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});