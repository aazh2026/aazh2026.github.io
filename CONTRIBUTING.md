# Contributing

欢迎向 Post-Code Engineering 博客贡献内容。这个仓库通过 GitHub Pages 部署。

## 🏗️ 本地开发

需要 Ruby 3.2+ 和 Bundler。

```bash
# 安装依赖
bundle install

# 启动开发服务器（带实时刷新）
bundle exec jekyll serve --livereload

# 构建生产版本
bundle exec jekyll build
```

服务器默认在 `http://localhost:4000` 启动。

## ✍️ 写新文章

文章放在 `_posts/` 目录，文件名格式：`YYYY-MM-DD-slug.md`。

### Frontmatter 必填字段

```yaml
---
layout: post
title: "你的文章标题"
date: 2026-01-15T10:00:00+08:00
tags: [AI-Native软件工程, 你的, 标签]
description: "30-80 字的 SEO 描述，第一句应回答'这篇文章的核心观点是什么'"
series: "AI-Native Engineering"  # 可选：所属系列
---
```

### 校验脚本

提交前本地跑：

```bash
# 验证 YAML frontmatter
python3 scripts/validate-frontmatter.py

# 检查内部链接
node scripts/check-internal-links.js

# 验证颜色对比度（WCAG AA）
node scripts/check-color-contrast.js

# lint markdown
markdownlint -c .markdownlint.json '_posts/**/*.md'
```

## 🎨 SVG 视觉规范

每篇文章应有 1-3 张 SVG 图，按 `WRITING-GUIDE.md` 规范：

- 背景 `#FAF9F5`，强调色 `#D97757`（clay），文字 `#141413`（slate）
- 字体：Georgia/serif 标题，ui-monospace 标签
- 必须 `viewBox` + `<title>` + `<desc>`（a11y）
- 命名：`YYYY-MM-DD-slug-NN-desc.svg`

压缩 SVG：

```bash
npx -y svgo --config=svgo.config.js assets/images/
```

## 🚫 不要做

- 不要在 `description:` 字段里嵌**未转义的双引号**（`"` 内部）。用单引号包裹或用 `「」` 中文引号
- 不要在文章正文用 `# 标题`（h1）—— layout 已提供 h1，正文用 `##` 起
- 不要在 frontmatter 用 `slug:` 字段（文件名已经定义了 slug）
- 不要在 `series-post-nav` 之外链接到 `/_posts/...md`（用 `/:title/` 形式）

## 🔍 5 套 CI 检查

每次 PR 都会跑：

1. `validate-frontmatter.yml` — YAML 合法性
2. `link-check.yml` — 内部 + 外部链接（lychee）
3. `markdownlint.yml` — 写作规范
4. `pages.yml` — jekyll build
5. `deploy.yml` — 部署到 GitHub Pages

**CodeQL** 每周一自动跑静态分析（`codeql.yml`）。

## 📬 提交流程

1. Fork 这个 repo
2. 创建 feature branch：`git checkout -b feature/my-new-post`
3. 写文章 + 加 SVG
4. 跑本地校验（见上）
5. Commit：`git commit -m "post: my new post title"`
6. Push 并开 PR
7. 等 CI 通过（5 套都绿）
8. 维护者 review 后合并

## 📜 许可

提交内容即同意采用 [CC BY-NC-SA 4.0](LICENSE) 许可。

---

## 🛠️ 仓库工具索引

| 路径 | 用途 |
|---|---|
| `scripts/validate-frontmatter.py` | YAML 校验 |
| `scripts/check-internal-links.js` | 内部链接检查 |
| `scripts/check-color-contrast.js` | WCAG AA 颜色对比度 |
| `scripts/generate-og-images.py` | OG 社交分享图生成 |
| `.githooks/pre-commit` | 提交时自动跑 YAML 校验 |
| `.github/workflows/*.yml` | 6 套 CI 流水线 |
| `_plugins/*.rb` | Jekyll 插件（image sitemap, news sitemap） |
| `_scratch/SWEEP-RESULTS.md` | 历史 batch 优化记录 |
| `WRITING-GUIDE.md` | 写作风格规范 |
| `AGENTS.md` | AI agent 操作指南（如有） |

## 🤖 给 AI Agent 的提示

如果是 AI agent 在改这个仓库，请：

1. **改动 frontmatter 后** 跑 `python3 scripts/validate-frontmatter.py` 验证
2. **改动 HTML/MD 文件** 后跑 `node scripts/check-internal-links.js`
3. **改动 CSS 颜色变量** 后跑 `node scripts/check-color-contrast.js`
4. **改动 SVG 视觉风格** 保持品牌色（`#FAF9F5`, `#D97757`, `#141413`, `#87867F`）
5. **生成 OG 图** 用 `python3 scripts/generate-og-images.py`
6. **避免 `target="_blank"`**（无外链 noopener 漏洞）
7. **description 字段用单引号** 或 `「」` 中文引号，避免 ASCII `"` 内嵌

每个 PR 都会被 5 套 CI 自动检查，提交前自查能省一轮 review 循环。
