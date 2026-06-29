# Git hooks

To enable the pre-commit hook that validates YAML frontmatter:

```sh
git config core.hooksPath .githooks
```

To bypass for a specific commit:

```sh
git commit --no-verify
```

The hook will:
- Validate any `_posts/*.md` in the commit
- Skip silently if python3 or PyYAML is missing (so it doesn't break a fresh clone)
- Exit non-zero on any validation error, blocking the commit
