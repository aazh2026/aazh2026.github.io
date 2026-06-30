## Description

<!-- What does this PR do? 1-3 sentences. -->

## Type of change

- [ ] New post (`_posts/`)
- [ ] New SVG asset (`assets/images/`)
- [ ] Bug fix
- [ ] Config / infrastructure
- [ ] Documentation
- [ ] Refactor (no behavior change)

## For new posts — checklist

- [ ] Filename is `YYYY-MM-DD-slug.md`
- [ ] Frontmatter has: `layout`, `title`, `date`, `tags`, `description`, (optional) `series`
- [ ] `description:` is 30-80 Chinese characters, no unescaped `"` inside
- [ ] No `# ` (h1) in body — layout already provides h1
- [ ] 1+ SVG diagram, naming `YYYY-MM-DD-slug-NN-desc.svg`
- [ ] `<object>` tags (not `<img>`) for SVGs
- [ ] `> 💡 **Key Insight**` between sections
- [ ] Tested locally: `bundle exec jekyll serve`

## Local validation

- [ ] `python3 scripts/validate-frontmatter.py` — passes
- [ ] `node scripts/check-internal-links.js` — passes
- [ ] `node scripts/check-color-contrast.js` — passes
- [ ] `markdownlint -c .markdownlint.json '_posts/**/*.md'` — no new errors

## CI expectations

These all run automatically:
- validate-frontmatter
- link-check
- markdownlint
- jekyll build
- (on main) deploy

## Screenshots / preview

<!-- If visual change, attach screenshot or link to a preview deployment -->

## Related issues

<!-- Link any related issues: Fixes #123, Closes #456 -->

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
