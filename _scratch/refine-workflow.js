// Workflow: Refine all 204 blog posts + add meaningful SVGs.
// Phases: Analyze -> Execute -> Verify -> Fix-up.

export const meta = {
  name: 'refine-204-posts',
  description: 'Refine every blog post and add meaningful SVGs in the right place',
  phases: [
    { title: 'Analyze' },
    { title: 'Execute' },
    { title: 'Verify' },
    { title: 'Fix-up' },
  ],
}

const POSTS = args.posts
const ROOT = '/Users/openclaw/.openclaw/aazh2026.github.io'
const GUIDE = `${ROOT}/WRITING-GUIDE.md`
const REF_POST = `${ROOT}/_posts/2026-06-27-loop-engineering.md`
const REF_SVG = `${ROOT}/assets/images/2026-06-27-loop-engineering-01-stack.svg`

const ANALYSIS_SCHEMA = {
  type: 'object',
  required: ['post', 'verdict', 'needs_new_svgs', 'empty_sections_to_fill', 'prose_fixes'],
  additionalProperties: false,
  properties: {
    post: { type: 'string' },
    verdict: { type: 'string', enum: ['needs_full_work', 'needs_minor_polish', 'already_refined'] },
    rationale: { type: 'string' },
    needs_new_svgs: {
      type: 'array',
      items: {
        type: 'object',
        required: ['filename', 'type', 'anchor_after', 'content_sketch'],
        additionalProperties: false,
        properties: {
          filename: { type: 'string' },
          type: { type: 'string', enum: ['hero-overview', 'layered-architecture', 'comparison', 'flow', 'timeline', 'matrix', 'tree', 'pyramid', 'cycle'] },
          anchor_after: { type: 'string' },
          content_sketch: { type: 'string' },
        },
      },
    },
    empty_sections_to_fill: {
      type: 'array',
      items: {
        type: 'object',
        required: ['heading', 'approx_words', 'sketch'],
        additionalProperties: false,
        properties: {
          heading: { type: 'string' },
          approx_words: { type: 'integer', minimum: 100, maximum: 600 },
          sketch: { type: 'string' },
        },
      },
    },
    prose_fixes: {
      type: 'object',
      required: ['missing_tldr', 'rewrite_numbered_headings', 'add_key_insight_after', 'tighten_walls_of_text', 'fix_placeholder_text'],
      additionalProperties: false,
      properties: {
        missing_tldr: { type: 'boolean' },
        rewrite_numbered_headings: {
          type: 'array',
          items: { type: 'object', properties: { from: { type: 'string' }, to: { type: 'string' } } },
        },
        add_key_insight_after: {
          type: 'array',
          items: { type: 'string' },
        },
        tighten_walls_of_text: {
          type: 'array',
          items: { type: 'string' },
        },
        fix_placeholder_text: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  },
}

const VERIFY_SCHEMA = {
  type: 'object',
  required: ['post', 'passed', 'issues'],
  additionalProperties: false,
  properties: {
    post: { type: 'string' },
    passed: { type: 'boolean' },
    summary: { type: 'string' },
    issues: {
      type: 'array',
      items: { type: 'string' },
    },
  },
}

// === Helpers ===

async function analyze(post) {
  return await agent(
    `Analyze the Jekyll blog post "${post}" against the writing style + SVG conventions in ${GUIDE}.

Working directory: ${ROOT}

Steps:
1. Read ${GUIDE} for the 15-point refinement checklist and SVG visual system.
2. Read ${REF_POST} as the reference for "new-style" structure (TL;DR, Key Insight, hero SVG, narrative headings).
3. Read ${REF_SVG} as the reference SVG to match in new SVGs you propose.
4. Read the post "${post}" in full.
5. Decide a verdict: needs_full_work | needs_minor_polish | already_refined.
6. Produce a JSON plan.

For needs_new_svgs:
- Only propose SVGs that would genuinely aid comprehension of a core concept.
- Each filename MUST follow \`YYYY-MM-DD-post-slug-NN-desc.svg\` (use the post's date+slug as prefix; numbers 01, 02, 03 in narrative order).
- anchor_after should be a 5-15 word snippet from the first paragraph that introduces the concept (used by the execute stage to place the embed).
- content_sketch is a 30-80 word description of nodes/shapes/labels/arrows the SVG should contain.

For empty_sections_to_fill:
- Only include sections whose heading is followed by no substantive prose (skip headings that already have body content).
- approx_words between 150-400.
- sketch must reference the post's existing terminology, references, and prior paragraphs.

For prose_fixes:
- missing_tldr: true if no TL;DR blockquote exists.
- rewrite_numbered_headings: list {"from": "## 一、xxx", "to": "## 章节名"} for every numbered or off-style heading.
- add_key_insight_after: list of 5-15 word snippets from paragraphs after which a \`> 💡 **Key Insight**\` callout would help.
- tighten_walls_of_text: list of section headings whose prose exceeds 5 consecutive paragraphs without a visual break.
- fix_placeholder_text: list of inline placeholder strings to replace (e.g. "TODO", "场景1", "组件1") with their intended meaning inferred from context.

If verdict is "already_refined", leave all other arrays empty and explain in rationale.`,
    {
      label: `analyze:${post.split('/').pop().replace('.md', '')}`,
      phase: 'Analyze',
      schema: ANALYSIS_SCHEMA,
      model: 'sonnet',
    }
  ).catch(e => null)
}

async function execute(analysis, post) {
  return await agent(
    `Apply this refinement plan to the Jekyll blog post "${post}".

Working directory: ${ROOT}

Refinement plan (JSON):
${JSON.stringify(analysis, null, 2)}

REFERENCE:
- Writing guide: ${GUIDE} (read §"SVG 嵌入规范" and §"SVG 视觉系统" for SVG conventions)
- Reference new-style post: ${REF_POST}
- Reference SVG (read this file fully to understand the visual system before creating any new SVG): ${REF_SVG}

REQUIRED ACTIONS:
1. Read the post "${post}" in full first. Note the existing voice and structure.
2. For each SVG in \`needs_new_svgs\`:
   a. Create the file at \`${ROOT}/assets/images/\<filename\>\` using the new visual system (#FAF9F5 bg, #D97757 clay accent, #788C5D olive, #141413 text, #D1CFC5 borders, Georgia + ui-monospace fonts, viewBox, <title>+<desc> tags).
   b. Use the content_sketch to design concrete nodes/labels/arrows. Aim for 60-120 lines of SVG XML.
3. Edit the post markdown to:
   a. If prose_fixes.missing_tldr is true: insert a TL;DR blockquote immediately after the frontmatter. Follow the format from ${REF_POST} (4 bold-label bullets + one closing sentence).
   b. For each entry in needs_new_svgs: insert \`<object data="/assets/images/\<filename\>" type="image/svg+xml" width="100%"></object>\` immediately AFTER the paragraph whose first words match \`anchor_after\`.
   c. For each entry in empty_sections_to_fill: write approx_words words of substantive prose that fits the section heading, matches the post's voice, and references the post's existing terminology. Place it directly under the heading.
   d. For each rewrite_numbered_headings entry: replace the old heading with the new title-style heading.
   e. For each add_key_insight_after entry: insert \`> 💡 **Key Insight**\\n>\\n> <one-sentence insight that follows from the preceding paragraph>\` immediately after the matching paragraph.
   f. For each tighten_walls_of_text entry: insert a Key Insight callout or a sub-heading to break up the wall.
   g. For each fix_placeholder_text entry: replace the placeholder string with the intended prose.

HARD CONSTRAINTS:
- DO NOT rewrite paragraphs that are already correct. Only insert, replace headings, or fill empty sections.
- Match the post's voice: read 2-3 paragraphs above and below before writing new prose.
- Embed SVGs via \`<object data="/assets/images/..." type="image/svg+xml" width="100%"></object>\` (with absolute path).
- Preserve all existing valid <object> embeds.

Return a one-paragraph summary of what you changed.`,
    {
      label: `execute:${post.split('/').pop().replace('.md', '')}`,
      phase: 'Execute',
      model: 'sonnet',
    }
  ).catch(e => ({ error: String(e), post }))
}

async function verify(post) {
  return await agent(
    `Verify the refined blog post "${post}" against the 15-point checklist from ${GUIDE}.

Working directory: ${ROOT}

Steps:
1. Read ${post} in full.
2. Verify each item (mark which pass, which fail):
   a. TL;DR block present and well-formed
   b. Key Insight callouts present in long sections
   c. Section headings are title-style (no \`## 一、xxx\` numbering)
   d. At least one \`<object>\` embed pointing to an existing SVG
   e. All \`<object data="...">\` paths resolve to existing files (use Bash \`ls\`)
   f. No placeholder/empty sections (heading followed by no prose)
   g. SVG file follows the new visual system (sample-check first 30 lines of any referenced SVG)
   h. Frontmatter valid (date, title, author, series present)
   i. No markdown syntax errors (heading levels, link refs)
   j. Paragraph length mostly 2-4 lines (no wall-of-text blocks)
3. Return verdict JSON.

Read the post carefully. If unsure about a checklist item, mark it as passing — only flag actual issues.`,
    {
      label: `verify:${post.split('/').pop().replace('.md', '')}`,
      phase: 'Verify',
      schema: VERIFY_SCHEMA,
      model: 'sonnet',
    }
  ).catch(e => ({ post, passed: false, issues: [String(e)] }))
}

async function fixup(failure) {
  return await agent(
    `Fix the remaining issues in the blog post "${failure.post}".

Working directory: ${ROOT}

Issues to fix:
${failure.issues.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Read the post in full first. Apply ONLY the minimum changes needed to address the listed issues. Do NOT rewrite other content.

Return a one-paragraph summary of what you changed.`,
    {
      label: `fixup:${failure.post.split('/').pop().replace('.md', '')}`,
      phase: 'Fix-up',
      model: 'sonnet',
    }
  ).catch(e => ({ error: String(e), post: failure.post }))
}

// === Main flow ===

log(`Starting refinement of ${POSTS.length} posts.`)

phase('Analyze')
log('Phase 1: Analyzing all posts...')
const analysesRaw = await parallel(POSTS.map(p => () => analyze(p)))
const analyses = analysesRaw.map((a, i) => a ? { ...a, post: a.post || POSTS[i] } : null)
const analyzeOk = analyses.filter(Boolean).length
log(`Analyze complete: ${analyzeOk}/${POSTS.length} posts analyzed.`)

phase('Execute')
log('Phase 2: Applying refinements...')
const execResults = await parallel(
  analyses.map((a, i) => () => a ? execute(a, POSTS[i]) : null)
)
const execOk = execResults.filter(r => r && !r.error).length
log(`Execute complete: ${execOk}/${POSTS.length} posts updated.`)

phase('Verify')
log('Phase 3: Verifying all posts...')
const verifies = await parallel(POSTS.map(p => () => verify(p)))
const failed = verifies
  .map((v, i) => (v && !v.passed) ? { post: POSTS[i], issues: v.issues || [] } : null)
  .filter(Boolean)
const passed = verifies.filter(v => v && v.passed).length
log(`Verify complete: ${passed}/${POSTS.length} posts pass. ${failed.length} need fix-up.`)

phase('Fix-up')
let fixed = 0
if (failed.length) {
  log(`Phase 4: Fixing ${failed.length} posts...`)
  const fixResults = await parallel(failed.map(f => () => fixup(f)))
  fixed = fixResults.filter(Boolean).length
  log(`Fix-up complete: ${fixed}/${failed.length} repaired.`)
}

return {
  total: POSTS.length,
  analyzed: analyzeOk,
  executed: execOk,
  verified_passed: passed,
  verify_failed: failed.length,
  fixup_attempted: failed.length,
  fixup_succeeded: fixed,
}
