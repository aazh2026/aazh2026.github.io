// Sweep: add description: frontmatter to 203 Jekyll posts missing it.
// Each agent processes a batch of ~10 posts. args = { batches: [[slug,...], ...] }

export const meta = {
  name: 'description-sweep',
  description: 'Add description: frontmatter to 203 Jekyll posts',
  phases: [
    { title: 'Fill' },
    { title: 'Verify' },
    { title: 'Fix-up' },
  ],
}

const ROOT = '/Users/openclaw/.openclaw/aazh2026.github.io'
const REF_DESC = `"深入探讨Fred Brooks的"没有银弹"论断在AI时代的适用性，分析AI能解决什么、不能解决什么，以及它引入的新认知复杂度。"`

// Accept args in any reasonable form: top-level array, {batches:[...]}, or JSON string.
let _b = args
if (typeof _b === 'string') {
  try { _b = JSON.parse(_b) } catch (e) { _b = [] }
}
const batches = Array.isArray(_b) ? _b : (_b && _b.batches) || []
log(`Loaded ${batches.length} batches. Each agent fills description: for ~10 posts.`)

const VERIFY_SCHEMA = {
  type: 'object',
  required: ['batch', 'all_have_description', 'missing'],
  additionalProperties: false,
  properties: {
    batch: { type: 'integer' },
    all_have_description: { type: 'boolean' },
    missing: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
}

async function fillBatch(batch, idx) {
  return await agent(
    `Add a \`description:\` frontmatter field to each of these ${batch.length} Jekyll blog posts.

Working directory: ${ROOT}

Posts in this batch:
${batch.map(slug => `- _posts/${slug}.md`).join('\n')}

REFERENCE — example of an existing good description (from 2026-03-15-no-silver-bullet-ai.md):
\`\`\`yaml
description: ${REF_DESC}
\`\`\`

GUIDELINES:
1. Read each post in full first. Note the existing TL;DR (if present) and the post's core thesis.
2. Generate a description in Chinese (the post's primary language) of 1-2 sentences / 30-80 characters that:
   - Captures the post's main argument or contribution
   - Reads like a journalistic summary, not a clickbait
   - Uses terminology consistent with the post itself
   - Avoids the leading phrases "本文" / "这篇文章" / "介绍" (just start with the substance)
3. Insert the line \`description: "<the description>"\` immediately AFTER the \`tags:\` line in the frontmatter.
4. If the post uses unquoted tags like \`tags: [foo, bar]\`, keep that style — description is always double-quoted.
5. If a post already has a \`description:\` field (none should, but be defensive), SKIP it.
6. For posts with no clear TL;DR or a wall-of-text intro, derive the description from the first non-TL;DR paragraph and the post's H1/H2 sections.

OUTPUT: A one-paragraph summary of how many posts you updated and any you skipped.`,
    { label: `fill:batch-${idx}`, phase: 'Fill', model: 'sonnet' }
  ).catch(e => ({ error: String(e), batch: idx, slugs: batch }))
}

async function verifyBatch(batch, idx) {
  return await agent(
    `Verify that each of these ${batch.length} Jekyll blog posts has a valid \`description:\` frontmatter field.

Working directory: ${ROOT}

Posts to check:
${batch.map(slug => `- _posts/${slug}.md`).join('\n')}

For each post, check:
1. \`description:\` field exists in the frontmatter (between the two \`---\` markers)
2. The description is non-empty
3. The description is 20-150 characters (Chinese chars count as 1)
4. The description is double-quoted

Use Bash + grep or Read the post to verify. Return the result as JSON.

If all posts have valid descriptions, return \`all_have_description: true\` with empty \`missing\` array.`,
    { label: `verify:batch-${idx}`, phase: 'Verify', schema: VERIFY_SCHEMA, model: 'sonnet' }
  ).catch(e => ({ batch: idx, all_have_description: false, missing: batch, notes: String(e) }))
}

async function fixup(batch, idx, notes) {
  return await agent(
    `Fix the description: frontmatter issues in this batch of ${batch.length} Jekyll blog posts.

Working directory: ${ROOT}

Posts in this batch:
${batch.map(slug => `- _posts/${slug}.md`).join('\n')}

Notes from verification:
${notes}

For each post flagged as missing or invalid, follow the description-generation guidelines from the Fill phase:
- 1-2 Chinese sentences / 30-80 characters
- Insert after \`tags:\` line
- Always double-quoted

If a post's description exists but is too short/long/wrong format, REWRITE it.

Return a one-paragraph summary of what you changed.`,
    { label: `fixup:batch-${idx}`, phase: 'Fix-up', model: 'sonnet' }
  ).catch(e => ({ error: String(e), batch: idx }))
}

phase('Fill')
log(`Phase 1: Filling description: for ${batches.length} batches...`)
const fillResults = await parallel(batches.map((b, i) => () => fillBatch(b, i)))
const fillOk = fillResults.filter(r => r && !r.error).length
log(`Fill complete: ${fillOk}/${batches.length} batches filled.`)

phase('Verify')
log(`Phase 2: Verifying ${batches.length} batches...`)
const verifies = await parallel(batches.map((b, i) => () => verifyBatch(b, i)))
const failedBatches = verifies
  .map((v, i) => (v && !v.all_have_description) ? { batch: i, slugs: batches[i], notes: v.notes || '' } : null)
  .filter(Boolean)
const passed = verifies.filter(v => v && v.all_have_description).length
log(`Verify complete: ${passed}/${batches.length} batches pass. ${failedBatches.length} need fix-up.`)

phase('Fix-up')
let fixed = 0
if (failedBatches.length) {
  log(`Phase 3: Fixing ${failedBatches.length} batches...`)
  const fixResults = await parallel(failedBatches.map(f => () => fixup(f.slugs, f.batch, f.notes)))
  fixed = fixResults.filter(Boolean).length
  log(`Fix-up complete: ${fixed}/${failedBatches.length} batches repaired.`)
}

return {
  total_batches: batches.length,
  filled: fillOk,
  verified_passed: passed,
  verify_failed: failedBatches.length,
  fixup_succeeded: fixed,
}
