# MEMORY.md - 长期记忆

## 博客写作范式转移（2026-03-09）

### 核心转变

**从"论文风格"到"博客风格"**

之前：文章像学术论文，大段文字，线性阅读，难以扫描
之后：文章像Twitter线程，结构化，扫描友好，易于传播

### 关键学习

**读者行为**
- 80%读者只扫描20%内容
- 平均阅读时间决定文章成败
- 金句和Key Insight决定传播力

**内容结构黄金法则**
1. TL;DR 必须有（4点核心观点）
2. 结构导航（6章节锚点）
3. 段落限制（2-4行）
4. Key Insight 卡片（每章至少1个）
5. 对比表格（传统 vs AI-Native）
6. Takeaway 总结（对比表）

**技术教训**
- Jekyll日期时间要用 `T00:00:00+08:00` 避免未来时间问题
- YAML frontmatter不能有嵌套引号
- GitHub Pages构建队列可能繁忙，需要耐心等待
- 文章宽度限制在680px最佳阅读体验

### 已建立的标准

**位置**：`BLOG-SOP.md`
**模板**：`_templates/article-template.md`
**指南**：`WRITING-GUIDE.md`

每次写博客前，必须阅读SOP并检查清单。

### 未来提醒

每月第一天回顾：
- 最受欢迎文章的Key Insight是什么
- 哪些文章被分享最多
- 更新SOP中的最佳实践

---

## 第 6 轮优化（2026-06-30）

新能力，新行为：

- **全文搜索**（PageFind）：构建后由 `npx pagefind --site _site` 生成 `_site/pagefind/`（4.5MB 索引，懒加载 + 命中后按需加载 chunk）。`site-search.html` 通过 `import("/pagefind/pagefind.js")` 调用 `pagefind.search()`，自带 BM25 排序 + `<mark>` 高亮 + excerpt。键盘 ↑/↓/Enter 可导航。404 页搜索同样接入。
- **首页分页**：10 篇 / 页，`/page2/` `/page3/` …… 用 `jekyll-paginate`。
- **Mermaid 条件加载**：仅当页面含 mermaid 块时动态加载（节省 ~3MB 阻塞），固定版本 + SRI。
- **TOC / Share buttons**：每篇 post 自动获得右侧 TOC（移动端隐藏）+ 底部分享栏（Twitter / LinkedIn / 复制链接）。Frontmatter 加 `toc: false` 可关闭 TOC。
- **Series 落地页改动态**：4 个手写 HTML 删了，换成 `_layouts/series.html` + `_series/*.md`。每个 series page 用 `series_match` Liquid 表达式做模糊匹配，能吸收 AISE 系列混乱的命名（"AI-Native软件工程系列 #N" / "AI-Native Engineering" / "aise" 都收）。
- **Per-series RSS**：`/series/{slug}/feed.xml` 自动生成（4 个 series）。
- **结构化数据**：post 用 `Article` schema 而非 `BlogPosting`（更丰富），homepage 加 `Person` schema，breadcrumb 自动按 series 跳转。
- **Web Vitals 上报**：LCP/CLS/INP/FCP/TTFB → Plausible custom events。
- **CSP meta fallback**：GH Pages 不解析 `_headers`，所以加 `<meta http-equiv="Content-Security-Policy">` 兜底。
- **Favicon 多尺寸**：`scripts/generate-favicons.py` 一键生成 .ico + 16/32/180/192/512。
- **Lighthouse CI + HTML validate CI**：周跑 + push 触发，阈值 perf≥90 / a11y≥95 / seo≥95。
- **新页面**：`/now/` `/uses/` `/colophon/`。
- **404 动态化**：从 `site.posts` 取最新 8 篇 + 中段 3 篇，不用硬编码。

### 模板行为变化（写新 post 时须知）

- 不用再手写 share 按钮
- 不用再加 `<style>` 块（全部在 `style.scss`）
- 写 series 时 frontmatter 写一个**简短**的 `series:` 字符串即可，会被 series page 模糊匹配
- SVG 资源命名：`<post-slug>-NN-figure-name.svg`，对应 frontmatter 自动找 OG 图

### 新增 / 修改的文件速查

新增：
- `_plugins/series_feeds.rb`
- `_layouts/series.html`
- `_series/{agent-os,memory-engineering,ai-native-security,aise}.md`
- `now.md`, `uses.md`, `colophon.md`
- `_data/author.yml`
- `scripts/generate-favicons.py`
- `scripts/{check-svgo,optimize-svgo,check-internal-links,check-color-contrast}.js`
- `static/_headers`
- `svgo.config.mjs`
- `.github/workflows/lighthouse.yml`, `.github/workflows/html-validate.yml`
- `.lighthouserc.json`, `.htmlvalidate.json`
- `package.json`, `package-lock.json`
- `lychee-excludes.txt`
- `assets/images/favicons/*` (自动生成)

修改：
- `_config.yml`（加 jekyll-paginate）
- `Gemfile`（加 jekyll-paginate）
- `_layouts/post.html`（接 TOC + share-buttons）
- `_includes/head.html`（meta CSP + favicon 多尺寸 + Mermaid 条件 + Web Vitals）
- `_includes/seo.html`（Article / FAQ / HowTo schema + author sameAs）
- `_includes/site-search.html`（PageFind ESM import + 懒加载 + 键盘导航）
- `_includes/toc.html`（变量对齐 + 简化）
- `_includes/share-buttons.html`（样式整合 + a11y 完善）
- `index.html`（paginate + 类名前缀）
- `404.html`（动态推荐 + PageFind 全文搜索）
- `site.webmanifest`（favicon 路径）
- `assets/css/style.scss`（吸收 230 行内联样式 + TOC / share / pagination 样式）

删除：
- `_plugins/search_index_generator.rb`（被 PageFind 取代）
- `_includes/{newsletter,series-nav,series-progress,share-card}.html`
- `{agent-os,memory-engineering,ai-native-security,aise}-series.html`（手写）
- `tags.html`（与 tags.md 重复）

---

*Last updated: 2026-06-30*