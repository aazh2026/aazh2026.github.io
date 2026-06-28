// Full sweep: refine 204 posts + add meaningful SVGs.

export const meta = {
  name: 'refine-204-posts',
  description: 'Full sweep: refine every blog post + add meaningful SVGs',
  phases: [
    { title: 'Analyze' },
    { title: 'Execute' },
    { title: 'Verify' },
    { title: 'Fix-up' },
  ],
}

const POSTS = [
  '_posts/2025-01-11-cold-start.md',
  '_posts/2025-01-12-consistency-maintenance.md',
  '_posts/2025-01-13-forgetting-strategy.md',
  '_posts/2025-01-14-graceful-degradation-deep.md',
  '_posts/2025-01-15-kg-vector-fusion.md',
  '_posts/2025-01-16-memory-explainability.md',
  '_posts/2025-01-17-memory-hierarchy.md',
  '_posts/2025-01-18-memory-versioning.md',
  '_posts/2025-01-22-openclaw-insight-report.md',
  '_posts/2025-01-23-openclaw-security-vulnerability.md',
  '_posts/2025-01-24-secure-memory.md',
  '_posts/2025-01-25-semantic-caching.md',
  '_posts/2025-01-28-skill-hunter.md',
  '_posts/2025-01-29-virtual-memory-rag.md',
  '_posts/2025-02-01-agentic-engineering-definition.md',
  '_posts/2025-02-02-agentic-engineering-patterns.md',
  '_posts/2025-02-03-ai-tech-frontier.md',
  '_posts/2025-02-05-cognitive-debt.md',
  '_posts/2025-02-07-knuth-claude-opus.md',
  '_posts/2025-02-11-agency-agents-analysis.md',
  '_posts/2025-02-14-architect-new-capability-model.md',
  '_posts/2025-02-15-llm-as-computational-unit.md',
  '_posts/2025-02-16-prd-structured-transformation.md',
  '_posts/2025-02-17-servicenow-autonomous-workforce.md',
  '_posts/2025-02-21-ai-clean-room-dilemma.md',
  '_posts/2025-02-22-clinejection-attack-analysis.md',
  '_posts/2025-02-23-context-layer-architecture.md',
  '_posts/2025-02-24-gpt-54-analysis.md',
  '_posts/2025-02-25-openclaw-agent-swarm-consensus.md',
  '_posts/2025-03-01-code-watermark-traceability.md',
  '_posts/2025-03-02-eu-ai-act-compliance-guide.md',
  '_posts/2025-03-03-knowledge-base-as-code.md',
  '_posts/2025-03-08-organizational-memory-externalization.md',
  '_posts/2025-03-10-private-llm-mlops-pipeline.md',
  '_posts/2025-03-11-rag-friendly-documentation.md',
  '_posts/2025-03-16-ai-four-layer-power-structure.md',
  '_posts/2025-03-17-ai-native-security-framework.md',
  '_posts/2025-03-18-ai-transformation-organizational-genome.md',
  '_posts/2025-03-19-api-economy-moat.md',
  '_posts/2025-03-20-code-archaeology-new-employee.md',
  '_posts/2025-03-21-code-archaeology-playbook.md',
  '_posts/2025-03-22-prompt-reverse-engineering-technical.md',
  '_posts/2025-03-23-prompt-reverse-engineering.md',
  '_posts/2025-03-28-ai-adoption-s-curve.md',
  '_posts/2025-03-29-ai-cost-control.md',
  '_posts/2025-03-30-ai-ethics.md',
  '_posts/2025-03-31-ai-hallucination-governance.md',
  '_posts/2025-04-01-ai-native-architecture-patterns.md',
  '_posts/2025-04-02-ai-native-dx.md',
  '_posts/2025-04-04-aise-manifesto.md',
  '_posts/2025-04-05-architecture-spec-machine-readable.md',
  '_posts/2025-04-06-artifacts-templates-collection.md',
  '_posts/2025-04-08-codebase-intelligence.md',
  '_posts/2025-04-09-context-engineering.md',
  '_posts/2025-04-10-context-rot.md',
  '_posts/2025-04-11-data-as-intent.md',
  '_posts/2025-04-12-death-of-api-docs.md',
  '_posts/2025-04-13-death-of-code-reviews.md',
  '_posts/2025-04-14-executable-prd.md',
  '_posts/2025-04-15-execution-plan-ai-orchestration.md',
  '_posts/2025-04-16-intent-complexity-metrics.md',
  '_posts/2025-04-17-knowledge-assetization.md',
  '_posts/2025-04-18-large-scale-ai-governance.md',
  '_posts/2025-04-19-legacy-trap.md',
  '_posts/2025-04-21-product-intent-definition.md',
  '_posts/2025-04-22-prompt-library-governance.md',
  '_posts/2025-04-23-quality-contract-validation.md',
  '_posts/2025-04-24-semantic-diff.md',
  '_posts/2025-04-25-stop-writing-unit-tests.md',
  '_posts/2025-04-26-tdd-intent-driven.md',
  '_posts/2025-04-27-traceability-auto-tracking.md',
  '_posts/2025-04-28-user-story-pack-automation.md',
  '_posts/2025-05-02-clinejection-ai-native-security.md',
  '_posts/2025-05-03-future-of-code-generation.md',
  '_posts/2025-05-04-goodbye-loc-intent-complexity.md',
  '_posts/2025-05-06-multi-agent-collaboration-paradox.md',
  '_posts/2025-05-07-rag-cognitive-bias-trap.md',
  '_posts/2025-05-11-ai-architecture-review.md',
  '_posts/2025-05-12-aise-framework-theory.md',
  '_posts/2025-05-14-domain-terminology-governance.md',
  '_posts/2025-05-15-dora-metrics-ai-era-reconstruction.md',
  '_posts/2025-05-16-hybrid-cloud-ai-programming.md',
  '_posts/2025-05-17-prompt-library-enterprise-management.md',
  '_posts/2025-05-18-tdd-death-and-rebirth.md',
  '_posts/2025-05-21-ai-assisted-efficiency-metrics.md',
  '_posts/2025-05-22-ai-assisted-mentorship.md',
  '_posts/2025-05-23-ai-devsecops-shift-left.md',
  '_posts/2025-05-24-ai-hallucination-business-cost-model.md',
  '_posts/2025-05-26-prompt-engineering-ladder.md',
  '_posts/2025-05-28-agent-dd-swarm-programming.md',
  '_posts/2025-05-29-ai-code-license-compliance.md',
  '_posts/2025-05-30-ddd-meets-llm.md',
  '_posts/2025-06-01-privacy-compliance-ai-shift-left.md',
  '_posts/2025-06-02-rag-dd-retrieval-augmented-generation.md',
  '_posts/2025-06-03-service-contract-semantic-consistency.md',
  '_posts/2025-06-04-ai-technical-debt-identification.md',
  '_posts/2025-06-05-api-gateway-intelligent-orchestration.md',
  '_posts/2025-06-06-bdd-formal-specification.md',
  '_posts/2025-06-07-pdd-prompt-as-artifact.md',
  '_posts/2025-06-08-cdd-context-driven-development.md',
  '_posts/2025-06-09-cicd-ai-injection-points.md',
  '_posts/2025-06-12-contract-testing-automation.md',
  '_posts/2025-07-07-agent-memory-system-design.md',
  '_posts/2025-07-14-multi-agent-collaboration.md',
  '_posts/2026-03-11-ai-native-detailed-design.md',
  '_posts/2026-03-11-delta-specification.md',
  '_posts/2026-03-11-intent-driven-future.md',
  '_posts/2026-03-11-minimal-design-set.md',
  '_posts/2026-03-12-agent-driven-debugging.md',
  '_posts/2026-03-12-knowledge-isolation-index.md',
  '_posts/2026-03-12-sdd-20-prompt-engineering.md',
  '_posts/2026-03-13-ai-native-code-review.md',
  '_posts/2026-03-13-idd-intent-driven-development.md',
  '_posts/2026-03-13-tdd-vs-ai-first.md',
  '_posts/2026-03-14-adr-to-aidr.md',
  '_posts/2026-03-14-observability-evolution.md',
  '_posts/2026-03-14-post-code-era.md',
  '_posts/2026-03-15-abstraction-layers.md',
  '_posts/2026-03-15-ai-cost-optimization.md',
  '_posts/2026-03-15-ai-native-data-engineering.md',
  '_posts/2026-03-15-ai-native-deployment.md',
  '_posts/2026-03-15-ai-native-testing-strategy.md',
  '_posts/2026-03-15-ai-native-ux-ui.md',
  '_posts/2026-03-15-composition-over-inheritance.md',
  '_posts/2026-03-15-conways-law-20.md',
  '_posts/2026-03-15-elegant-engineering.md',
  '_posts/2026-03-15-feedback-loop-acceleration.md',
  '_posts/2026-03-15-harness-knowledge-management.md',
  '_posts/2026-03-15-harness-limits.md',
  '_posts/2026-03-15-interface-segregation.md',
  '_posts/2026-03-15-knowledge-must-be-in-repo.md',
  '_posts/2026-03-15-layered-architecture.md',
  '_posts/2026-03-15-lean-thinking-ai.md',
  '_posts/2026-03-15-no-silver-bullet-ai.md',
  '_posts/2026-03-15-parallel-agent-coordination.md',
  '_posts/2026-03-15-simple-vs-easy.md',
  '_posts/2026-03-15-single-responsibility.md',
  '_posts/2026-03-15-software-complexity.md',
  '_posts/2026-03-15-solid-revisited.md',
  '_posts/2026-03-15-systems-thinking-emergence.md',
  '_posts/2026-03-15-unix-philosophy-ai-era.md',
  '_posts/2026-03-15-verifier-economics.md',
  '_posts/2026-03-15-worse-is-better-revisited.md',
  '_posts/2026-03-16-github-supply-chain-attack.md',
  '_posts/2026-03-16-microservices-reflection.md',
  '_posts/2026-03-16-mmap-renaissance.md',
  '_posts/2026-03-16-preflight-validator.md',
  '_posts/2026-03-16-xml-dsl.md',
  '_posts/2026-03-17-codex-security-ai-vs-sast.md',
  '_posts/2026-03-17-openai-agent-runtime.md',
  '_posts/2026-03-17-prompt-injection-defense.md',
  '_posts/2026-03-17-rakuten-ai-transformation.md',
  '_posts/2026-03-17-wayfair-ai-scale.md',
  '_posts/2026-03-17-why-your-saas-needs-agent-layer.md',
  '_posts/2026-03-18-eda-schema-consistency.md',
  '_posts/2026-03-18-fixing-ai-slopware-job.md',
  '_posts/2026-03-18-harness-engineering-martin-fowler.md',
  '_posts/2026-03-18-kimi-attention-residuals.md',
  '_posts/2026-03-18-weight-norm-clipping.md',
  '_posts/2026-03-19-everything-claude-code-agent-os.md',
  '_posts/2026-03-20-alibaba-opensandbox-ai-agent-security.md',
  '_posts/2026-03-20-distributed-code-review-ai.md',
  '_posts/2026-03-20-firefox-149-ai-windows.md',
  '_posts/2026-03-20-langchain-open-swe-async-agent.md',
  '_posts/2026-03-20-meta-rogue-ai-agent-security.md',
  '_posts/2026-03-20-tradingagents-ai-quant-trading.md',
  '_posts/2026-03-21-gstack-vs-claude-code-skills.md',
  '_posts/2026-03-21-openai-instruction-hierarchy.md',
  '_posts/2026-03-21-openai-monitoring-coding-agents.md',
  '_posts/2026-03-23-ai-agent-deployment-cost.md',
  '_posts/2026-03-23-ai-cost-model.md',
  '_posts/2026-03-23-ai-tool-selection-framework.md',
  '_posts/2026-03-23-cursor-vs-claude-code.md',
  '_posts/2026-03-23-github-ai-strategy.md',
  '_posts/2026-03-31-agent-os-five-layer-architecture.md',
  '_posts/2026-05-06-context-inflation-law.md',
  '_posts/2026-05-11-execution-is-dead-judgment-lives.md',
  '_posts/2026-05-12-ai-native-writing-html-over-markdown.md',
  '_posts/2026-05-12-claude-code-academic-researchers.md',
  '_posts/2026-05-12-claude-multi-agent-systems.md',
  '_posts/2026-05-12-complexity-ratchet.md',
  '_posts/2026-05-12-karpathy-4-rules-to-12-rules.md',
  '_posts/2026-05-13-auto-improving-software.md',
  '_posts/2026-05-13-claude-skills-complete-guide.md',
  '_posts/2026-05-13-harness-engineering-addy-osmani.md',
  '_posts/2026-05-13-perplexity-agent-skills-guide.md',
  '_posts/2026-05-14-boris-cherny-coding-is-solved.md',
  '_posts/2026-05-14-designing-for-agents-teddy-riker.md',
  '_posts/2026-05-14-openai-accidental-cot-grading.md',
  '_posts/2026-05-14-when-knowledge-is-cheap-zohar-atkins.md',
  '_posts/2026-05-26-judgment-and-execution.md',
  '_posts/2026-05-28-ai-colleague-trust-boundary.md',
  '_posts/2026-05-28-ai-native-startup-paradox.md',
  '_posts/2026-05-28-ai-optimization-cycle-hours.md',
  '_posts/2026-05-28-ai-security-tax.md',
  '_posts/2026-05-28-anthropic-containment.md',
  '_posts/2026-05-28-goodhart-law-ai-metrics.md',
  '_posts/2026-05-28-open-source-ai-slop.md',
  '_posts/2026-05-28-self-improving-tax-agents.md',
  '_posts/2026-05-28-vibesec-reckoning.md',
  '_posts/2026-05-29-deterministic-ai-programming.md',
  '_posts/2026-06-11-loop-engineering.md',
  '_posts/2026-06-27-agent-skills.md',
  '_posts/2026-06-27-loop-engineering.md',
]

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
          type: { type: 'string' },
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
          approx_words: { type: 'integer' },
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
        rewrite_numbered_headings: { type: 'array', items: { type: 'object', properties: { from: { type: 'string' }, to: { type: 'string' } } } },
        add_key_insight_after: { type: 'array', items: { type: 'string' } },
        tighten_walls_of_text: { type: 'array', items: { type: 'string' } },
        fix_placeholder_text: { type: 'array', items: { type: 'string' } },
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
    issues: { type: 'array', items: { type: 'string' } },
  },
}

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
6. Produce a JSON plan following the schema.

For needs_new_svgs:
- Only propose SVGs that would genuinely aid comprehension of a core concept.
- Each filename MUST follow \`YYYY-MM-DD-post-slug-NN-desc.svg\` (use the post's date+slug as prefix; numbers 01, 02, 03 in narrative order).
- anchor_after should be a 5-15 word snippet from the first paragraph that introduces the concept.
- content_sketch is a 30-80 word description of nodes/shapes/labels/arrows the SVG should contain.
- DO NOT propose SVGs if the post already has 2+ well-placed SVGs that cover the main concepts.

For empty_sections_to_fill:
- Only include sections whose heading is followed by no substantive prose.
- approx_words between 150-400.
- sketch must reference the post's existing terminology.

For prose_fixes:
- missing_tldr: true if no TL;DR blockquote exists.
- rewrite_numbered_headings: list {"from": "## 一、xxx", "to": "## 章节名"} for every numbered heading.
- add_key_insight_after: list of 5-15 word snippets from paragraphs after which a Key Insight callout would help.
- tighten_walls_of_text: list of section headings whose prose exceeds 5 consecutive paragraphs.
- fix_placeholder_text: list of inline placeholder strings.

If verdict is "already_refined", leave other arrays empty and explain in rationale.`,
    { label: `analyze:${post.split('/').pop().replace('.md', '')}`, phase: 'Analyze', schema: ANALYSIS_SCHEMA, model: 'sonnet' }
  ).catch(e => ({ error: String(e), post }))
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
- Reference SVG: ${REF_SVG}

REQUIRED ACTIONS:
1. Read the post "${post}" in full first. Note the existing voice and structure.
2. For each SVG in needs_new_svgs:
   a. Create the file at \`${ROOT}/assets/images/filename\` using the new visual system (#FAF9F5 bg, #D97757 clay accent, #788C5D olive, #141413 text, #D1CFC5 borders, Georgia + ui-monospace fonts, viewBox, <title>+<desc> tags).
   b. Use the content_sketch to design concrete nodes/labels/arrows. Aim for 60-120 lines of SVG XML.
3. Edit the post markdown to:
   a. If prose_fixes.missing_tldr is true: insert a TL;DR blockquote immediately after the frontmatter. Follow the format from ${REF_POST} (4 bold-label bullets + one closing sentence).
   b. For each entry in needs_new_svgs: insert \`<object data="/assets/images/filename" type="image/svg+xml" width="100%"></object>\` immediately AFTER the paragraph whose first words match \`anchor_after\`.
   c. For each entry in empty_sections_to_fill: write approx_words words of substantive prose that fits the section heading, matches the post's voice, and references the post's existing terminology. Place it directly under the heading.
   d. For each rewrite_numbered_headings entry: replace the old heading with the new title-style heading.
   e. For each add_key_insight_after entry: insert \`> 💡 **Key Insight**\\n>\\n> <one-sentence insight>\` immediately after the matching paragraph.
   f. For each tighten_walls_of_text entry: insert a Key Insight callout or sub-heading to break up the wall.
   g. For each fix_placeholder_text entry: replace the placeholder string with the intended prose.

HARD CONSTRAINTS:
- DO NOT rewrite paragraphs that are already correct. Only insert, replace headings, or fill empty sections.
- Match the post's voice: read 2-3 paragraphs above and below before writing new prose.
- Embed SVGs via \`<object data="/assets/images/..." type="image/svg+xml" width="100%"></object>\` (with absolute path).
- Preserve all existing valid <object> embeds.

Return a one-paragraph summary of what you changed.`,
    { label: `execute:${post.split('/').pop().replace('.md', '')}`, phase: 'Execute', model: 'sonnet' }
  ).catch(e => ({ error: String(e), post }))
}

async function verify(post) {
  return await agent(
    `Verify the refined blog post "${post}" against the 15-point checklist from ${GUIDE}.

Working directory: ${ROOT}

Steps:
1. Read ${post} in full.
2. Verify each item (only flag actual issues):
   a. TL;DR block present and well-formed
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
    { label: `verify:${post.split('/').pop().replace('.md', '')}`, phase: 'Verify', schema: VERIFY_SCHEMA, model: 'sonnet' }
  ).catch(e => ({ post, passed: false, issues: [String(e)] }))
}

async function fixup(failure) {
  return await agent(
    `Fix the remaining issues in the blog post "${failure.post}".

Working directory: ${ROOT}

Issues:
${failure.issues.map((s, i) => `${i + 1}. ${s}`).join('\\n')}

Read the post in full first. Apply ONLY the minimum changes needed to address the listed issues. Do NOT rewrite other content.

Return a one-paragraph summary of what you changed.`,
    { label: `fixup:${failure.post.split('/').pop().replace('.md', '')}`, phase: 'Fix-up', model: 'sonnet' }
  ).catch(e => ({ error: String(e), post: failure.post }))
}

log(`Starting full sweep refinement of ${POSTS.length} posts.`)

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
  fixup_succeeded: fixed,
}
