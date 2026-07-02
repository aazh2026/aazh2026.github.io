#!/usr/bin/env bash
# scripts/check-all.sh
#
# Run all critical CI checks locally before push.
# Mirrors the checks in .github/workflows/*.yml.
#
# Usage:
#   bash scripts/check-all.sh              # fast checks only (default)
#   bash scripts/check-all.sh --full       # fast + jekyll build + pagefind
#   bash scripts/check-all.sh --skip X,Y   # skip specific checks
#   bash scripts/check-all.sh --only X,Y   # run only specified
#
# Fast checks (run by default and from pre-push):
#   svgo, frontmatter, internal-links, aria-labels,
#   code-fence-langs, series
#
# Slow checks (--full only):
#   color-contrast, jekyll, pagefind, markdownlint
#
# Exit codes:
#   0  all passed
#   1  one or more failed
#   2  invalid args / missing tools
set -u

# ANSI colors (only when stdout is a TTY)
if [[ -t 1 ]]; then
  BOLD='\033[1m'; GREEN='\033[32m'; RED='\033[31m'
  YELLOW='\033[33m'; DIM='\033[2m'; RESET='\033[0m'
else
  BOLD=''; GREEN=''; RED=''; YELLOW=''; DIM=''; RESET=''
fi

START=$(date +%s)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT"

# Parse args
MODE="fast"
SKIP=()
ONLY=()
while [[ $# -gt 0 ]]; do
  case $1 in
    --full) MODE="full"; shift ;;
    --fast) MODE="fast"; shift ;;
    --skip) IFS=',' read -ra SKIP <<< "$2"; shift 2 ;;
    --only) IFS=',' read -ra ONLY <<< "$2"; shift 2 ;;
    -h|--help)
      sed -n '2,25p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown arg: $1 (try --help)"; exit 2 ;;
  esac
done

# Decide whether to run a check
should_run() {
  local name="$1"
  for s in "${SKIP[@]:-}"; do
    [[ -n "$s" && "$s" == "$name" ]] && return 1
  done
  if [[ ${#ONLY[@]} -gt 0 ]]; then
    for o in "${ONLY[@]}"; do
      [[ "$o" == "$name" ]] && return 0
    done
    return 1
  fi
  return 0
}

# Run a single check, log to /tmp, append to RESULTS
declare -a RESULTS

run_check() {
  local name="$1"; shift
  if ! should_run "$name"; then
    echo -e "${DIM}⏭  SKIP $name${RESET}"
    RESULTS+=("SKIP|$name")
    return 0
  fi
  local log="/tmp/check-all-${name}.log"
  echo -e "${BOLD}→ $name${RESET}"
  local t0=$(date +%s)
  if "$@" > "$log" 2>&1; then
    local t1=$(date +%s)
    echo -e "  ${GREEN}✓ $name ($((t1-t0))s)${RESET}"
    RESULTS+=("PASS|$name")
    return 0
  else
    local t1=$(date +%s)
    echo -e "  ${RED}✗ $name ($((t1-t0))s)${RESET}"
    echo -e "  ${RED}log: $log${RESET}"
    tail -8 "$log" | sed 's/^/    /'
    RESULTS+=("FAIL|$name")
    return 1
  fi
}

# Tool detection — skip with warning if missing
need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠  $1 not installed — skipping $2${RESET}"
    return 1
  fi
  return 0
}

echo -e "${BOLD}━━━ check-all.sh (${MODE}) ━━━${RESET}"
echo -e "${DIM}Mirrors .github/workflows/ CI checks locally.${RESET}"
echo

FAIL=0

# ── Fast checks (always run by default) ─────────────────────────────
run_check svgo           node scripts/check-svgo.js           || FAIL=1
run_check frontmatter    python3 scripts/validate-frontmatter.py || FAIL=1
run_check internal-links node scripts/check-internal-links.js  || FAIL=1
run_check aria-labels    node scripts/check-aria-labels.js     || FAIL=1
run_check code-fence-langs node scripts/check-code-fence-langs.js || FAIL=1
run_check series         node scripts/check-series.js          || FAIL=1

# ── Full-only checks ────────────────────────────────────────────────
if [[ "$MODE" == "full" ]]; then
  run_check color-contrast node scripts/check-color-contrast.js || FAIL=1

  if need_cmd markdownlint "markdownlint check"; then
    run_check markdownlint markdownlint -c .markdownlint.json '_posts/**/*.md' || FAIL=1
  fi

  if [[ -d "_site" ]]; then
    rm -rf _site
  fi
  run_check jekyll bundle exec jekyll build --baseurl "" || FAIL=1

  if [[ -d "_site" ]]; then
    if npx --no-install pagefind --site _site > /tmp/check-all-pagefind.log 2>&1; then
      echo -e "  ${GREEN}✓ pagefind${RESET}"
      RESULTS+=("PASS|pagefind")
    else
      echo -e "  ${RED}✗ pagefind${RESET}"
      tail -5 /tmp/check-all-pagefind.log | sed 's/^/    /'
      RESULTS+=("FAIL|pagefind")
      FAIL=1
    fi
  fi
fi

END=$(date +%s)

# Summary
echo
echo -e "${BOLD}━━━ Summary ━━━${RESET}"
PASS_COUNT=0; FAIL_COUNT=0; SKIP_COUNT=0
for r in "${RESULTS[@]}"; do
  case "$r" in
    PASS*) PASS_COUNT=$((PASS_COUNT+1)) ;;
    FAIL*) FAIL_COUNT=$((FAIL_COUNT+1)) ;;
    SKIP*) SKIP_COUNT=$((SKIP_COUNT+1)) ;;
  esac
done
echo -e "  ${GREEN}✓ $PASS_COUNT passed${RESET} · ${RED}✗ $FAIL_COUNT failed${RESET} · ${DIM}⏭  $SKIP_COUNT skipped${RESET} · ${BOLD}$((END-START))s${RESET}"

if [[ $FAIL -ne 0 ]]; then
  echo
  echo -e "${RED}━━━ Failed. Logs: /tmp/check-all-*.log ━━━${RESET}"
  exit 1
fi
echo -e "${GREEN}━━━ All checks passed in $((END-START))s ━━━${RESET}"