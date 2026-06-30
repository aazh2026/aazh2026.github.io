#!/usr/bin/env node
// scripts/check-svgo.js
//
// Verify every SVG in assets/images is already svgo-optimized.
//
// Used by CI (link-check.yml, deploy.yml, pages.yml) as a regression gate.
// If any SVG could be reduced further by svgo with svgo.config.mjs, the
// script prints the offenders and exits non-zero so the build fails.
//
// Why a separate script rather than `svgo --check`?
//   svgo v4 has no --check / --dry-run flag. Implementing the verify step
//   on top of the svgo API is ~20 lines and lets us produce actionable
//   output (path, before/after sizes, % savings).
//
// Usage:
//   node scripts/check-svgo.js                       # default: assets/images/**/*.svg
//   node scripts/check-svgo.js assets/images/foo.svg  # override with one file
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
    console.error("[check-svgo] no SVG inputs found");
    process.exit(0);
  }

  // loadConfig reads svgo.config.mjs from cwd; chdir to repo root first.
  process.chdir(ROOT);
  const config = await loadConfig();

  let totalBefore = 0;
  let totalAfter = 0;
  const offenders = [];

  for (const file of inputs) {
    const before = fs.readFileSync(file, "utf8");
    const result = optimize(before, { path: file, ...config });
    if (result.error) {
      console.error(`[check-svgo] error processing ${file}: ${result.error}`);
      process.exitCode = 1;
      continue;
    }
    const beforeBytes = Buffer.byteLength(before, "utf8");
    const afterBytes = Buffer.byteLength(result.data, "utf8");
    totalBefore += beforeBytes;
    totalAfter += afterBytes;
    if (afterBytes < beforeBytes) {
      offenders.push({
        file: path.relative(ROOT, file),
        before: beforeBytes,
        after: afterBytes,
        pct: ((1 - afterBytes / beforeBytes) * 100).toFixed(1),
      });
    }
  }

  const pct = ((1 - totalAfter / totalBefore) * 100).toFixed(2);
  console.log(
    `[check-svgo] ${inputs.length} files, ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)} (${pct}% below svgo optimum)`
  );

  if (offenders.length > 0) {
    console.error("");
    console.error(`[check-svgo] FAIL — ${offenders.length} SVG(s) are not svgo-optimized:`);
    for (const o of offenders) {
      console.error(
        `  ${o.file}: ${formatBytes(o.before)} → ${formatBytes(o.after)} (${o.pct}% reducible)`
      );
    }
    console.error("");
    console.error("Run `npm run optimize-svgo` locally and commit the result.");
    process.exit(1);
  }

  console.log("[check-svgo] OK — all SVGs already at svgo optimum");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});