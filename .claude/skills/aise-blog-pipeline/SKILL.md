---
name: aise-blog-pipeline
description: "本仓库 (aazh2026.github.io) 的完整博客内容生产 pipeline —— 从论文/行业素材到博客成稿。Use when: (1) user provides a batch of academic papers or industry intelligence reports and wants to ingest/archive them as raw materials; (2) user asks for topic recommendations based on accumulated raw materials in _raw/; (3) user wants to write a new post following this blog's narrative-driven conventions; (4) any combination of the above."
---

# AI-Native Software Engineering Blog Pipeline

项目级 skill，覆盖从原始素材（论文 / 行业情报）到博客成稿的完整 6 阶段流水线。

## When to Invoke

User says or implies any of:
- **Ingest signal**：「整理素材」「归档」「raw materials」+ 提供一批论文或行业报告
- **Recommend signal**：「推荐选题」「有什么可写的」「基于内容库」
- **Write signal**：「写一篇」「开稿」+ 已有 raw materials 或明确 topic
- **Pipeline signal**：任意组合（一次跑全部 6 阶段也可）

skill 可只跑 stage 1、stage 1-3，或完整 6 阶段。

## Inputs

- 学术论文（arXiv ID / 作者 / GitHub / 核心亮点）
- 行业情报报告（工具对比 / 市场数据 / benchmark 汇总）
- 已有 `_raw/` 目录（之前积累的素材）
- 已有 `_posts/`（决定外延锚点）
- `WRITING-GUIDE.md`（强制阅读的写作规范）

## Outputs

- `_raw/YYYY-WNN/`（论文）或 `_raw/intelligence/YYYY-MM-DD-topic/`（情报）
- `_raw/.../INDEX.md`（tier 矩阵 + 跨周机会 + 黄灯追踪）
- 选题推荐（Top 3，每条带完整 reasoning）
- 新博客 `_posts/YYYY-MM-DD-slug.md` + Hero SVG `assets/images/...svg`
- 2 个 commit（`content:` + `chore:`）+ push

## Pipeline Stages

### Stage 1 — Ingest & File

**论文**：
1. 算 ISO 周：`date -j -f "%Y-%m-%d" +"%G-W%V"`（macOS）
2. 建目录：`_raw/YYYY-WNN/`
3. 命名：`NN-slug.md`（NN 两位序号）
4. frontmatter 必填：
   - `paper_id`, `title_en`, `title_cn`, `category`, `tier`（初始判断）
   - `collected`, `week`
   - 源信息（作者 / arXiv / GitHub）
   - 核心亮点（**原文逐字搬运**，不二次解读）
   - 推荐受众
   - `overlap_with`（若有跨周重复）

**行业情报**：
1. 建目录：`_raw/intelligence/YYYY-MM-DD-topic-slug/`
2. 命名：`NN-report-slug.md`
3. frontmatter `type: industry-intelligence-report`
4. 原文逐字搬运，不擅自合并

**INDEX.md 模板**：
```yaml
---
title: "YYYY-WNN 周观察：[trend 一句话]"
date: YYYY-MM-DD
week: YYYY-WNN
collected: N papers
---
```
必备章节：
1. 本周核心趋势（一句话）
2. 适配性矩阵（table，含 tier / 类别 / 与前几周重叠）
3. 推荐成稿路径（A/B/C 三档）
4. 跨周联动机会（table）
5. 写作前黄灯（table，逐条挂 unresolved issue）
6. 与现有博客呼应点（link table）
7. 待跟进 checklist

### Stage 2 — Triage

按博客 DNA（架构/范式 > 工具评测；anti-hype；外延已有锚点）打 tier：

| Tier | 标准 | 处理 |
|------|------|------|
| **A** | 架构/范式；anti-hype 角度；强外延；可查证 arXiv | 单篇 deep-dive |
| **B** | 工程向；支持 Tier A 合稿；现有帖补充 | 合稿 / 外延 |
| **C** | 纯工具评测；纯 serving 细节；弱归因 | 跳过 |

**C 类的硬红线**：
- 投机解码变体连续出现 ≥2 周
- 仅 GitHub 无论文
- 仅微信公众号无 arXiv
- 框架评测无原理创新

### Stage 3 — Recommend Topics

按优先级找：

1. **跨周主题周** ⭐⭐⭐（3+ 篇跨周自然汇集，是最强信号）
2. **单 Tier A deep-dive**
3. **现有帖更新机会**
4. **合稿**（2-3 篇 Tier B）

每条 topic 必须给：
- 标题候选（**模仿 agent-systems-tour 句式**："X 巡礼：N 种范式 + 1 张选择地图"）
- 锚点论文 + arXiv 链接
- Key Insight（1 句话，anti-hype 角度，中文 10-20 字）
- Hero SVG 概念（2×2 矩阵 / 流水线 / 对比表 / 等等）
- 外延锚点（Jekyll permalink）
- 风险等级（low/medium/high）

### Stage 4.5 — Template（根治 a11y 和 svgo 问题）

**根因预防**：上一篇 post 在 CI 暴露了两个 bug（SVG 未 svgo 优化 + `<object>` 缺 aria-label），都是手写习惯导致的。**根治方法是用模板**：

- **SVG 模板**：`_templates/svg-hero-template.svg`（已 svgo-clean）+ `_templates/svg-hero-template.README.md`（使用指南）
- **`<object>` 嵌入片段**：
  ```html
  <object data="/assets/images/YYYY-MM-DD-slug-NN-desc.svg"
          type="image/svg+xml"
          width="100%"
          aria-label="[一句话描述]"></object>
  ```

写入时复制模板 → 替换占位符 → 嵌入时用上方片段（必含 aria-label）。**不要再从空白写 SVG 或手写 `<object>` 标签。**

### Stage 4 — Write Article

**frontmatter（新式模板）**：
```yaml
---
layout: post
title: "..."
date: YYYY-MM-DDTHH:MM:SS+08:00
tags: [...]
description: "..."
author: "@postcodeeng"
series: aise
subtopic: <从兄弟帖继承的 subtopic>
---
```

**正文结构**：
- `> **TL;DR**` 首块引用（4-5 个 numbered points）
- Hero SVG（`<object>` 标签，width=100%）
- 主体段落（`##` 标题，无 TOC）
- 段落间 `> 💡 **Key Insight**` 标注（1-2 行）
- 内链：`[锚点文字](/YYYY-MM-DD-slug/)` —— Jekyll permalink
- 外链：`[anchor](https://arxiv.org/abs/...)`
- `## 结尾` 必须有
- Footer：`*Published on YYYY-MM-DD`（与 frontmatter date 对齐）

**视觉系统**（**强制**）：
- SVG：`<object data="/assets/images/YYYY-MM-DD-slug-NN-desc.svg" type="image/svg+xml" width="100%"></object>`
- 文件命名：`YYYY-MM-DD-slug-NN-desc.svg`
- 配色：bg `#FAF9F5` / paper `#FFFFFF` / accent `#D97757` / text `#141413` / subtext `#87867F` / border `#D1CFC5`
- 字体：标题 Georgia/serif；代码/标签 ui-monospace
- viewBox 必填（保证响应式）

**结构模板参考**（按兄弟帖）：
| 模板 | 参考帖 | 适用 |
|------|--------|------|
| 4 范式巡礼 | `agent-systems-tour.md` | N 篇范式对比 |
| Field guide | `context-engineering-field-guide.md` | 方法论总览 |
| L1-L4 堆叠 | `loop-engineering.md` | 分层架构 |
| 反借口 / 工程纪律 | `agent-skills.md` | 设计原则 |
| 工具对比 | `cursor-vs-claude-code.md` | 双/三方对比 |

### Stage 5 — Verify

**5.1 内容校验**

| 项 | 检查方式 |
|----|---------|
| 内链 permalink | `ls _posts/YYYY-MM-DD-slug.md` 对每个 cross-ref |
| 外链 arXiv | 对比表里缺的 ID 补上 |
| 数字软化 | 替换"X 公司 67%"为软化版（见下） |
| Footer 对齐 | `*Published on` == frontmatter `date:` |
| 视觉系统 | SVG 配色 / 字体 / viewBox |
| Footer 死规则 | 无 `*AI-Native软件工程系列 #XX*`；无 `postcodeengineering.com` URL |

**5.2 本地 CI 镜像（强制）**

```bash
npm run check-all          # fast checks（pre-push 自动跑）
npm run check-all:full     # + jekyll build + pagefind（发布前必跑）
```

`check-all.sh` 镜像 `.github/workflows/*.yml`：
- fast: svgo / frontmatter / internal-links / aria-labels / code-fence-langs / series
- full（--full）: + color-contrast / markdownlint / jekyll / pagefind

新增 SVG 必须先跑 `npm run optimize-svgo <path>` 再提交，否则 check-svgo 失败阻断 push。

**Hook 启用**（一次性）：
```bash
git config core.hooksPath .githooks
```

启用后 `git commit` 自动校验 frontmatter + svgo，`git push` 自动跑 fast checks。

### Stage 6 — Commit & Push

```bash
# Commit 1: content
git add _posts/YYYY-MM-DD-slug.md assets/images/YYYY-MM-DD-slug-*.svg
git commit -m "content: <subject>

<body>

Co-Authored-By: Claude <noreply@anthropic.com>"

# Commit 2: chore (scaffolding only)
git add _raw/
git commit -m "chore: <subject>

<body>

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push (single retry if SSL_ERROR_SYSCALL transient)
git push origin main
```

## 黄灯追踪模板

跨 INDEX 持续维护：

| Item | Issue | Action | 跨几周 |
|------|-------|--------|--------|
| SEAlign arXiv ID | arxiv.org/search only | Find in ICSE 2026 proceedings | W27/W28/W29 |
| EvoCF arXiv ID | WeChat URL only | Find in ICML 2026 accepted papers list | W27/W28/W29 |
| 行业情报数字 | "Anthropic 官方材料" 模糊 | Find specific announcement URLs | intel |

## 软化模板（per WRITING-GUIDE.md）

❌ "Stripe 部署 1,370+ 工程师"
✅ "Stripe 在 2026 年公开案例分享中提到已规模化部署 Claude Code（具体规模未独立核实）"

❌ "Opus 4.8 = SWE-bench Verified 88.6%"
✅ "Anthropic 在 2026 H1 公布 Claude Opus 系列在 SWE-bench Verified 上的成绩稳居第一梯队（具体因子集和模型版本而异，[官方公告](URL)）"

❌ "67% 开发者认为写测试是必要的痛苦"
✅ "业界观察到的现象是 X% 区间的开发者认为测试是必要的痛苦"

❌ 编造案例（"2024 年某 SaaS 公司做了一个大胆的实验"）
✅ "业界反复观察到的现象是 X 区间的 Y%（具体数字因场景而异）"

❌ 时态错乱（在 2025 年的文章里写 2026 年事件）
✅ 严格按 frontmatter `date` 控制时态

## 兄弟帖参考（canonical patterns）

- `agent-systems-tour.md`（2026-07-01）—— 4-paradigm 巡礼模板 ⭐
- `context-engineering-field-guide.md`（2026-07-01）—— field guide 模板
- `loop-engineering.md`（2026-06-27）—— L1-L4 堆叠架构
- `agent-skills.md`（2026-06-27）—— 反借口 / 工程纪律
- `cursor-vs-claude-code.md`（2026-03-23）—— 工具对比
- `claude-multi-agent-systems.md`（2026-05-12）—— Multi-Agent 范式

## Worked Example — Memory Systems 4 Paradigms

完整跑过一遍的真实案例（2026-07-02）：

- **触发**：用户给了 25 篇论文（W27/W28/W29 三周）+ 3 篇行业情报
- **Stage 1**：建 `_raw/2026-W27/`、`_raw/2026-W28/`、`_raw/2026-W29/`、`_raw/intelligence/2026-07-02-coding-agent-landscape/`
- **Stage 2**：tier 矩阵 —— 25 篇中 11 篇 Tier A、8 篇 Tier B、6 篇 Tier C
- **Stage 3**：识别出 **跨周"记忆主题周"**（EvoCF + H-EPM + E-mem + LatentMem 4 篇自然汇集）→ 排 Top 1
- **Stage 4**：
  - 标题："AI Agent 记忆系统巡礼：4 种范式 + 1 张选择地图"
  - Hero SVG：2×2 矩阵（横轴 = 记忆压缩程度，纵轴 = 决策权归属）
  - Key Insight："Agent 记忆系统的分水岭不是存什么，是'谁来用、怎么用'"
- **Stage 5**：4 个内链全部验证存在；3 个 arXiv 链接补齐（H-EPM / E-mem / LatentMem）
- **Stage 6**：2 个 commit（`55583cf` content + `b6d3f6c` chore）+ push 成功

**踩坑**：第一次 push 遇 `SSL_ERROR_SYSCALL`，重试一次成功 —— 这是 macOS 上偶发的瞬态错误。

## Constraints（不可违反）

1. **博客 DNA**：架构/范式 > 工具评测；anti-hype；外延已有锚点
2. **引用卫生**：弱源必用软化模板（见上）
3. **视觉系统**：SVG 配色 / 字体 / 命名一致
4. **Footer 死规则**：`*Published on` 对齐 `date:`；禁 `*AI-Native软件工程系列 #XX*`；禁 `postcodeengineering.com` URL
5. **外链 arXiv 必填**：能补就补，缺则在文中保留 "ICML/ICSE 2026" 标识但**不挂 URL**

## 持续维护

- 每次完成一篇 post 后：更新 `_raw/.../INDEX.md` 的"待跟进"清单（关掉已解决项 + 加新黄灯）
- 每季度：清理 `_raw/` 旧文件夹（>90 天未引用 → 移到 `_raw/archive/`）
- 写作规范变更：同步更新 `WRITING-GUIDE.md` + 本 SKILL.md