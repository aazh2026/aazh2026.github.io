// Finish sweep: 80 posts that hit 429 mid-Execute in the prior sweep.
// Each agent looks up its own cached plan from the journal via Bash + node.
// args = { items: [{ slug, post }] }

export const meta = {
  name: 'refine-finish-80',
  description: 'Finish the 80 429-failed posts using cached Analyze plans',
  phases: [
    { title: 'Execute' },
    { title: 'Verify' },
    { title: 'Fix-up' },
  ],
}

const ROOT = '/Users/openclaw/.openclaw/aazh2026.github.io'
const GUIDE = `${ROOT}/WRITING-GUIDE.md`
const REF_POST = `${ROOT}/_posts/2026-06-27-loop-engineering.md`
const REF_SVG = `${ROOT}/assets/images/2026-06-27-loop-engineering-01-stack.svg`
const JOURNAL = '/Users/openclaw/.claude/projects/-Users-openclaw--openclaw-aazh2026-github-io/aa3101a7-36bf-4ace-acf5-9b1a05d30fc9/subagents/workflows/wf_9b7f996a-c2a/journal.jsonl'

// Accept args in any reasonable form: top-level array, {items:[...]}, or JSON string.
let _items = args
if (typeof _items === 'string') {
  try { _items = JSON.parse(_items) } catch (e) { _items = [] }
}
const items = Array.isArray(_items) ? _items : (_items && _items.items) || []
log(`Loaded ${items.length} posts. Each agent will look up its cached plan from the journal.`)

const VERIFY_SCHEMA = {
  type: 'object',
  required: ['post', 'passed', 'issues'],
  additionalProperties: false,
  properties: {
    post: { type: 'string' },
    passed: { type: 'boolean' },
    summary: { type: 'string' },
    issues: { type: 'array', items: { type: 'string' } },
  },
}

const LOOKUP_HINT = `First, retrieve the cached Analyze plan for slug "${'<SLUG>'}" from the journal:
\`\`\`bash
node -e "const fs=require('fs');const lines=fs.readFileSync('${JOURNAL}','utf8').split('\\n').filter(Boolean);for(const l of lines){try{const o=JSON.parse(l);if(o.type==='result'&&o.result&&o.result.post&&o.result.post.endsWith('${'<SLUG>'}.md')&&['needs_full_work','needs_minor_polish','already_refined'].includes(o.result.verdict)){console.log(JSON.stringify(o.result,null,2));break;}}catch{}}"
\`\`\`
Use the FIRST match (Analyze plan, not Verify plan).`

async function execute(item) {
  const hint = LOOKUP_HINT.replace(/<SLUG>/g, item.slug)
  return await agent(
    `Apply the cached refinement plan to the Jekyll blog post "${item.post}".

Working directory: ${ROOT}

${hint}

REFERENCE:
- Writing guide: ${GUIDE} (read §"SVG 嵌入规范" and §"SVG 视觉系统" for SVG conventions)
- Reference new-style post: ${REF_POST}
- Reference SVG: ${REF_SVG}

REQUIRED ACTIONS:
1. Read "${item.post}" in full first. Note the existing voice and current state — some prior steps may already be in place.
2. For each entry in plan.needs_new_svgs (object with filename / type / anchor_after / content_sketch):
   a. Create the file at \`${ROOT}/assets/images/<filename>\` using the new visual system (#FAF9F5 bg, #D97757 clay accent, #788C5D olive, #141413 text, #D1CFC5 borders, Georgia + ui-monospace fonts, viewBox, <title>+<desc> tags).
   b. Use the content_sketch to design concrete nodes/labels/arrows. Aim for 60-120 lines of SVG XML.
   c. If the file already exists, REPLACE it with the new version (do not duplicate).
3. Edit the post markdown to apply the cached plan:
   a. If plan.prose_fixes.missing_tldr is true: insert a TL;DR blockquote immediately after the frontmatter. Follow the format from ${REF_POST} (4 bold-label bullets + one closing sentence). If a TL;DR already exists in any form, REWRITE it to the blockquote format from ${REF_POST}.
   b. For each plan.needs_new_svgs entry: insert \`<object data="/assets/images/<filename>" type="image/svg+xml" width="100%"></object>\` immediately AFTER the paragraph whose first words match \`anchor_after\`. If the post already has an <object> embed for the same filename, SKIP the insertion.
   c. For each plan.empty_sections_to_fill entry: write approx_words words of substantive prose that fits the section heading, matches the post's voice, and references the post's existing terminology. Place it directly under the heading (replace any placeholder).
   d. For each plan.prose_fixes.rewrite_numbered_headings entry: replace the old heading with the new title-style heading.
   e. For each plan.prose_fixes.add_key_insight_after entry: insert \`> 💡 **Key Insight**\\n>\\n> <one-sentence insight>\` immediately after the matching paragraph. If a Key Insight already follows that paragraph, leave it.
   f. For each plan.prose_fixes.tighten_walls_of_text entry: insert a Key Insight callout or sub-heading to break up the wall.
   g. For each plan.prose_fixes.fix_placeholder_text entry: replace the placeholder string with intended prose.

HARD CONSTRAINTS:
- DO NOT rewrite paragraphs that are already correct. Only insert, replace headings, or fill empty sections.
- Match the post's voice: read 2-3 paragraphs above and below before writing new prose.
- Embed SVGs via \`<object data="/assets/images/..." type="image/svg+xml" width="100%"></object>\` (absolute path).
- Preserve all existing valid <object> embeds.
- For 2025-06-12-contract-testing-automation.md: a prior step left a corrupted Key Insight block (\`> 💡 **Key Insight**> \` followed by junk characters from a YAML multi-line parse). Clean this up to the canonical \`> 💡 **Key Insight**\\n>\\n> <one-sentence insight>\` form.

Return a one-paragraph summary of what you changed (or "no changes needed" if the post was already fully refined).`,
    { label: `execute:${item.slug}`, phase: 'Execute', model: 'sonnet' }
  ).catch(e => ({ error: String(e), post: item.post }))
}

async function verify(item) {
  return await agent(
    `Verify the refined blog post "${item.post}" against the 15-point checklist from ${GUIDE}.

Working directory: ${ROOT}

Steps:
1. Read "${item.post}" in full.
2. Verify each item (only flag actual issues):
   a. TL;DR block present and well-formed (> **TL;DR** blockquote with 4 bullets)
   b. Key Insight callouts present in long sections
   c. Section headings are title-style (no \`## 一、xxx\` numbering)
   d. At least one \`<object>\` embed pointing to an existing SVG
   e. All \`<object data="...">\` paths resolve to existing files (use Bash \`ls\`)
   f. No placeholder/empty sections (heading followed by no prose)
   g. SVG file follows the new visual system (sample-check first 30 lines of any referenced SVG)
   h. Frontmatter valid (date, title, author, series present)
   i. No markdown syntax errors
   j. Paragraph length mostly 2-4 lines
3. Return verdict JSON.

If unsure about a checklist item, mark it as passing.`,
    { label: `verify:${item.slug}`, phase: 'Verify', schema: VERIFY_SCHEMA, model: 'sonnet' }
  ).catch(e => ({ post: item.post, passed: false, issues: [String(e)] }))
}

async function fixup(failure) {
  return await agent(
    `Fix the remaining issues in the blog post "${failure.post}".

Working directory: ${ROOT}

Issues:
${failure.issues.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Read the post in full first. Apply ONLY the minimum changes needed to address the listed issues. Do NOT rewrite other content.

Return a one-paragraph summary of what you changed.`,
    { label: `fixup:${failure.post.split('/').pop().replace('.md','')}`, phase: 'Fix-up', model: 'sonnet' }
  ).catch(e => ({ error: String(e), post: failure.post }))
}

phase('Execute')
log(`Phase 1: Executing cached plans on ${items.length} posts...`)
const execResults = await parallel(items.map(item => () => execute(item)))
const execOk = execResults.filter(r => r && !r.error).length
log(`Execute complete: ${execOk}/${items.length} posts updated.`)

phase('Verify')
log(`Phase 2: Verifying ${items.length} posts...`)
const verifies = await parallel(items.map(item => () => verify(item)))
const failed = verifies
  .map((v, i) => (v && !v.passed) ? { post: items[i].post, issues: v.issues || [] } : null)
  .filter(Boolean)
const passed = verifies.filter(v => v && v.passed).length
log(`Verify complete: ${passed}/${items.length} posts pass. ${failed.length} need fix-up.`)

phase('Fix-up')
let fixed = 0
if (failed.length) {
  log(`Phase 3: Fixing ${failed.length} posts...`)
  const fixResults = await parallel(failed.map(f => () => fixup(f)))
  fixed = fixResults.filter(Boolean).length
  log(`Fix-up complete: ${fixed}/${failed.length} repaired.`)
}

return {
  total: items.length,
  executed: execOk,
  verified_passed: passed,
  verify_failed: failed.length,
  fixup_succeeded: fixed,
}
