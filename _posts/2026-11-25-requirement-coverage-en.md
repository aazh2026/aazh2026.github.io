---
layout: post
title: "The Thing Test Coverage Doesn't Tell You: Requirement Coverage"
date: 2026-11-25T12:30:00+08:00
tags: [Requirement Coverage, Acceptance Criteria, Traceability, CI, Quality Gates, AI-Generated Code]
description: "Test coverage answers 'was this line executed', not 'was this requirement implemented'. I built specgate: it parses acceptance criteria, finds the evidence in your code, and reports requirement coverage. Deterministic, no LLM."
author: "@postcodeeng"
series: aise
subtopic: requirement-coverage
permalink: /requirement-coverage-en/
---

> **TL;DR**
>
> Test coverage has a structural blind spot: it measures **code**, not **requirements**.
> A spec with 12 acceptance criteria and a codebase with 10 functions at 92% coverage — those two numbers are unrelated.
> I built [`specgate`](https://github.com/aazh2026/specgate): it parses acceptance criteria, locates the
> evidence for each one in your code, reports requirement coverage, and works as a CI gate.
> Deterministic, no LLM, no API key.
>
> This is the English version of [测试覆盖率没告诉你的一件事：需求覆盖率](https://postcodeengineering.com/requirement-coverage/).

---

## The number that lied to me for a long time

I have written 314 articles on this blog, built tools like HarnessFix and LogicHunter, and done spec-driven test generation.

Every time I pushed, CI went green, the coverage badge read 88%, and I felt fine.

Until one day I reviewed a pull request and found a feature that had simply never been implemented. CI was green. Coverage was still climbing.

That was the moment I realised: **the coverage number was answering the wrong question.**

### What coverage actually measures

Coverage is "the proportion of lines that executed during the test run". That is a statement about **lines of code**.

What I wanted to know was "is acceptance criterion 12 in the spec implemented?"

There is no derivation between those two things:

| | Test coverage | Requirement coverage |
|---|---|---|
| Unit measured | lines / branches | acceptance criteria |
| Question answered | "was this line executed?" | "was this requirement implemented?" |
| Blind spot | an entire feature can be missing at 100% | — |

Take the extreme case: a repository with only `add(a, b) { return a + b }` and one test for it.

Coverage = 100%. But if the spec says "users can export invoices as CSV", coverage has **no opinion whatsoever** about that.

The reverse also holds. A 5,000-line legacy system at 30% coverage may have 95% of its requirements implemented perfectly.

**High coverage does not mean requirements are complete. Low coverage does not mean they are missing.**

It was never designed for this question.

---

## Why this got worse recently

Because the cost of writing code collapsed.

Writing a feature took 40 minutes in 2024: 35 minutes writing, 5 minutes thinking.
It takes about 8 minutes in 2026: 2 minutes writing, 6 minutes **reviewing**.

The bottleneck moved from writing to verifying. And acceptance criteria are the first thing to rot:

- A spec written three months ago — who still remembers what AC-7 meant?
- An agent changes a pile of files, one criterion's implementation gets quietly deleted, no test covered it, CI stays green.
- You hire someone for QA. Their first task is to read the spec and work out how the product is supposed to behave — and they find the spec itself is ambiguous.

Worse: **nothing maintains the link between the spec and the code.**
The spec lives in `docs/SPEC.md`, the code lives in `src/`, and the two are stitched together by human memory and `git blame`.

> While researching this, I found that GitHub already has mature tools for detecting AI code slop (`aislop`, 773 stars; `AI-SLOP-Detector`, 124 stars) and mature agent-trace debugging tools. But for *verifying the implementation against the spec*, the leading project has **14 stars**.
> The gap exists not because the idea lacks value, but because most people have not realised they have this blind spot.

---

## My approach: specgate

The core idea: **treat the acceptance criteria in your spec like test points in your code, then measure them the way coverage does.**

```text
  Requirement coverage: 80%  (5 criteria)

  ✔ covered    4
  ~ inferred   0
  ! untested   0
  ✗ uncovered  1

  Criterion                                    Status     Evidence
  ------------------------------------------------------------------------------
  AC-1         covered    #test/export.test.js:12
               User can export invoices as CSV
  AC-2         covered    #test/export.test.js:21
               Export respects the date range filter
  AC-5         uncovered  —
               Admin can schedule a recurring monthly export
```

### Why it has to be deterministic

I deliberately did **not** use an LLM. Three reasons:

1. **CI needs determinism.** The same code and the same spec must produce the same score, otherwise the number cannot be used as a gate.
2. **Cost.** Calling an LLM on every CI run means paying on every run, plus network latency, timeouts and rate limits.
3. **Trust.** Once a verdict is not reproducible, teams start ignoring it.

So specgate takes the **static analysis** route, in the same spirit as ESLint and Semgrep: lexical plus structural matching.

### Four steps

**Step one: parse the spec.** Find the acceptance criteria and give each a stable id. If you wrote an id, yours is used; if not, `AC-1`, `AC-2` are generated in order:

```markdown
## Acceptance Criteria

- [ ] AC-1: User can export invoices as CSV
- [ ] [AC-2] Export respects the date range filter
- [ ] Export fails loudly when the storage backend is unavailable
```

The last one has no id and still counts.

**Step two: index the code.** Walk source and test files, skipping `node_modules` and `dist`.

There is a trap here that I hit myself: code is camelCase, specs are natural language.
`resetPassword` has to match "reset their password", `export_csv` has to match "export csv", `HTTPResponse` has to match "http response".

My first attempt used a naive `split(/[^a-z0-9]+/)`, which turned `resetPassword` into a single token `resetpassword` and therefore never matched the English sentence "reset password". Splitting on identifier boundaries first, then tokenising, fixed it:

```js
.replace(/([a-z0-9])([A-Z])/g, '$1 $2')     // camelCase
.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')   // HTTPServer
.replace(/[_\-.]+/g, ' ')                    // snake_case / kebab-case
```

**Step three: find evidence in tiers.** This is the core of the design.

| Tier | Status | Meaning |
|---|---|---|
| `tagged` | `covered` | an explicit `// AC-1` marker points at it |
| `named` | `inferred` | a test name matched the criterion's keywords |
| `text` | `untested` | only implementation code matched; nothing pins the behaviour |
| — | `uncovered` | no evidence at all |

**Step four: score.** The tiers are weighted because they carry different amounts of confidence:

```text
score = 100 × (covered×1.0 + inferred×0.75 + untested×0.4 + uncovered×0.0) / total
```

`inferred` is deliberately discounted. A test called `test_reset` may be testing something completely different. Only an explicit marker earns full credit.

---

## How to use it

```bash
# The npm package is still queued, so use the release tarball (no token, no npm account needed)
npx --yes specgate-cli

# or point it at a specific spec
specgate --spec docs/SPEC.md

# CI gate: fail below 80% coverage
specgate --min 80 --fail-uncovered

# emit SARIF, straight into GitHub code scanning
specgate --sarif-out specgate.sarif --format sarif
```

### No spec yet? Start with init

Most people hit the same wall on first contact: **my project has no written spec.**
So I added `specgate init`:

```bash
npx --yes specgate-cli init
```

It detects your stack (language, test runner, package manager), generates a well-structured `SPEC.md`,
and drops a `.github/workflows/requirements.yml` gate into the repo.

Three steps to running:

1. `specgate init` — generate the spec skeleton and the CI gate
2. Rewrite the criteria and give each one an id
3. Add a `// AC-1` marker in the tests, then run `specgate` and read the result

GitHub Actions:

```yaml
name: Requirement coverage
on: [pull_request]

jobs:
  specgate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - uses: aazh2026/specgate@v0.1.7
        with:
          min: 80
          fail-uncovered: true
```

**The gate is the point.** If the spec says "users can export CSV", then a PR that does not implement it should be blocked.

---

## Turning "inferred" into "covered"

specgate's weakness is obvious: **it matches text, it does not understand meaning.**

"An operator can revoke a session" will not match `deleteToken()` — unless you tag it explicitly.

So the design leaves one clear upgrade path: a comment in your code.

```js
// AC-1: User can export invoices as CSV
test('exports invoices as CSV', () => { /* ... */ });
```

```python
# AC-2: Export respects the date range filter
def test_export_respects_date_range():
    ...
```

After that, the criterion moves from `inferred` (worth 0.75) to `covered` (full credit).
**This is the traceability design: the marker is the contract.**

I find the workflow natural:

1. Write the spec, split it into acceptance criteria, id each one
2. Implement the feature
3. While writing tests, add `# AC-3`
4. CI tells you which criterion is still unaccounted for

---

## Honestly, its limitations

I do not want to sell this as a silver bullet:

- **Text matching, not semantic understanding.** Requirements phrased very differently either fail to match or match spuriously. That is the inherent cost of the lexical approach.
- **`inferred` is still a heuristic.** The discount does not mean it is wrong, only that it cannot count as evidence.
- **Mixed Chinese and English needs care.** Chinese criteria matching English identifiers works poorly; write your criteria in the same language as your code identifiers.
- **It is not a test runner.** It does not know whether your tests pass. Use it alongside your existing suite.
- **Its value depends on how often you tag.** If a team never writes explicit markers, it degrades into a fuzzy keyword matcher and is worth less.

If your team does not tag anything today, I would start with the five most important criteria and build up a small `covered` baseline.

---

## Why it is open source

Not because it is particularly clever. Because **every team that writes code with AI has this blind spot, and most of them have not noticed**.

I searched GitHub: for verifying an implementation against a spec or acceptance criteria, the leading project has 14 stars.
The demand is real, it just has not been discovered yet.

Worth saying: the tool itself was written with AI (Claude plus me), which fits its own philosophy —
but it is **not** the product of a single LLM generation:
- 30 tests, all green
- Writing the tests caught two real bugs: the camelCase tokenisation, and the tag regex truncating at `//`
- Both bugs got a regression test

Which happens to make the point: **the ability to catch "it did not implement the spec" comes from the mechanism itself — spec plus tests plus gate.**
specgate is one side of that mechanism.

```bash
git clone https://github.com/aazh2026/specgate
cd specgate && npm test
```

MIT licensed. Issues and PRs welcome. If your team needs "check the implementation against the spec", or you are
building an AI-native development flow, I would be glad to compare notes.

---

### Further reading

- [测试覆盖率没告诉你的一件事：需求覆盖率](https://postcodeengineering.com/requirement-coverage/) — the Chinese version of this article
- [Spec-Driven Test Generation: write the contract first, then generate the tests](https://postcodeengineering.com/spec-driven-test-generation/) — the other half of this problem
- [HarnessFix series](https://postcodeengineering.com/) — self-repairing agent harnesses
