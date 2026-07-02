# Git hooks

两个 hook 在 `.githooks/` 下，启用：

```sh
git config core.hooksPath .githooks
```

绕过单次：

```sh
git commit --no-verify
git push --no-verify
```

## `pre-commit`

文件 staged 时触发。检查两件事：

- **`_posts/*.md` 的 YAML frontmatter**（需要 python3 + pyyaml）
- **`assets/images/*.svg` 的 svgo 优化**（需要 node）

任一失败 → 阻断 commit。

## `pre-push`

push 之前触发。跑 `bash scripts/check-all.sh`（默认 fast 模式）。

跑：
- `svgo`（约 2-5s）
- `frontmatter`（约 1s）
- `internal-links`
- `aria-labels`
- `code-fence-langs`
- `series`

跳过 jekyll build（避免 30s+ 等待）。失败 → 阻断 push。

## 需要完整构建验证（--full）

慢检查（color-contrast / jekyll / pagefind / markdownlint）不自动跑。
提交前手动跑：

```sh
bash scripts/check-all.sh --full
```

## 单项检查

```sh
bash scripts/check-all.sh --only svgo
bash scripts/check-all.sh --only frontmatter
bash scripts/check-all.sh --skip jekyll
```

## Hook 静默降级

任何 hook 检测到工具缺失（python3 / pyyaml / node）会**跳过对应检查并警告**而不是阻断。这样新 clone 的环境不会被卡住。

CI 仍然是 source of truth —— hooks 是 fast feedback，不替代 CI。