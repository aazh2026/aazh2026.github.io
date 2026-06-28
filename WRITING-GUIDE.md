# 博客文章写作指南

## 📋 标准模板位置

`_templates/article-template.md` —— **新式模板**（2026-05+ 推荐使用，无目录、叙事驱动）

`_templates/post-template.md` —— 旧式模板（含 `本文结构` TOC、编号章节）

## 🎯 参考风格

参考 HTML Effectiveness 的设计风格：
- 米白/象牙色背景 (#FAF9F5)
- 衬线字体用于标题（Georgia/Times）
- 无衬线字体用于正文
- Clay 色 (#D97757) 作为强调色
- 柔和的灰阶 (#87867F, #D1CFC5)
- 圆角卡片 (14px)
- 简洁的边框 (1.5px)

## 🎨 视觉风格

### 色彩系统
- **背景**: #FAF9F5 (ivory), #FFFFFF (paper)
- **主文字**: #1a1a1a (slate)
- **强调色**: #D97757 (clay)
- **灰阶**: #87867F, #D1CFC5

### 字体
- **标题**: Georgia/Noto Serif SC, serif
- **正文**: system-ui, -apple-system, sans-serif
- **代码**: SF Mono/Monaco, monospace

### 间距
- 使用 0.25rem/0.5rem/1rem/1.5rem/2rem/3rem 的间距系统
- 圆角: 0.375rem (sm), 0.5rem (md), 0.875rem (lg), 999px (pill)
- 边框: 1.5px solid

## 📝 模板结构（推荐新式）

### 1. Frontmatter

**新式**（2026-05+ 推荐）：
```yaml
---
layout: post
title: "文章标题"
date: 2026-06-27T10:00:00+08:00
tags: [AI-Native软件工程, 标签2, 标签3]
author: "@postcodeeng"
series: AI-Native Engineering
---
```

**旧式**（带系列编号、redirect_from）：
```yaml
---
layout: post
title: "文章标题"
date: 2026-05-26T14:00:00+08:00
tags: [AI-Native软件工程, Prompt工程, 组织能力]
author: "@postcodeeng"
series: AI-Native软件工程系列 #43

redirect_from:
  - /post-slug.html
---
```

### 2. TL;DR（第一块引用）

```markdown
> **TL;DR**
>
> 本文核心观点：
> 1. **核心概念** — 简短描述
> 2. **关键机制** — 简短描述
> 3. **实际效果** — 简短描述
> 4. **延伸洞察** — 简短描述
```

### 3. Hero 图（可选但推荐）

如果文章围绕一个核心模型/框架展开，**TL;DR 之后立即插入一张总览 SVG**。这是新式文章的主流模式（见 Goodhart、Anthropic Containment、VibeSec 等）。

### 4. 正文组织（新式：叙事驱动；旧式：编号章节）

**新式**（2026-05+ 推荐，无目录）：
- 用 `##` 章节标题直接展开
- 无 `## 📋 本文结构`
- 章节命名是标题性的，不是编号性的
- 结尾用 `## 结尾` 或 `## 写在最后`

**旧式**（带目录和编号）：
```
## 📋 本文结构

1. [第一章标题](#第一章标题)
2. [第二章标题](#第二章标题)

## 一、第一章标题
## 二、第二章标题
```

### 5. Key Insight 标注

段落之间插入，强化核心观点：

```markdown
> 💡 **Key Insight**
>
> 一句话总结本章核心观点（不要超过两行）
```

### 6. 段落格式

- 每段 2-4 行
- 段与段之间空一行
- 避免大段文字

## 🎨 SVG 嵌入规范（重要）

### 嵌入方式

**必须使用 `<object>` 标签**，不能用 `![](path)` 或 `<img>`：

```html
<object data="/assets/images/2026-06-27-loop-engineering-02-flow.svg" type="image/svg+xml" width="100%"></object>
```

理由：
- `<object>` 保留 SVG 的矢量特性和交互能力
- 支持 `width="100%"` 响应式自适应
- 主题色（#FAF9F5 背景）和文字色与博客一致
- 不需要额外的 alt 文本（`<title>` 在 SVG 内已定义）

### SVG 文件命名规范

```
YYYY-MM-DD-post-slug-NN-description.svg
```

- `YYYY-MM-DD`：与文章日期一致
- `post-slug`：与文章文件名一致（kebab-case）
- `NN`：两位数字序号（01、02、...）
- `description`：短横线连接的英文/中文描述

示例：
```
2026-06-27-loop-engineering-01-stack.svg
2026-06-27-loop-engineering-02-flow.svg
2026-06-27-loop-engineering-03-react.svg
2026-06-27-loop-engineering-04-components.svg
2026-06-27-agent-skills-01-disclosure.svg
2026-06-27-agent-skills-02-patterns.svg
```

### SVG 编号策略

**按叙事流编号**（最常见）：`01-overview.svg`、`02-detail-a.svg`、`03-detail-b.svg`

**按概念编号**：每个 SVG 表达独立概念时，按出现顺序编号即可

### SVG 放置策略

| 位置 | 适用场景 | 示例 |
|------|---------|------|
| TL;DR 之后（Hero 图） | 文章围绕一个核心模型/框架展开 | Goodhart、Anthropic Containment、VibeSec |
| 引入概念的小节内 | 概念解释后立即配图，强化理解 | Loop Engineering 五阶段、ReAct 循环 |
| 章节之间 | 作为章节分隔的视觉锚点 | DORA 对比图、四层权力结构 |

**重要**：SVG 引用按文章实际引用的顺序编号。`img2-batch` 系列 commit 的批改证明：经常存在"补图"操作，需要重命名以匹配叙事顺序。

### SVG 视觉系统（保持与博客一致）

```xml
<svg viewBox="0 0 680 360" xmlns="http://www.w3.org/2000/svg"
     font-family="ui-serif, Georgia, serif">
  <!-- 颜色系统 -->
  <!-- #FAF9F5 (背景) | #FFFFFF (卡片) -->
  <!-- #141413 (主文字) | #87867F (次文字) -->
  <!-- #D97757 (强调/clay) | #788C5D (olive) -->
  <!-- #D1CFC5 (边框) -->

  <rect width="680" height="360" fill="#FAF9F5"/>

  <!-- 标题 -->
  <text x="340" y="26" text-anchor="middle" font-size="14"
        font-weight="500" fill="#141413">标题文本</text>

  <!-- 副标题/数据来源 -->
  <text x="340" y="42" text-anchor="middle" font-size="10"
        fill="#87867F" font-family="ui-monospace, monospace">
    来源 · 日期
  </text>

  <!-- 卡片 -->
  <rect x="40" y="68" width="130" height="88" rx="8"
        fill="#FFFFFF" stroke="#D97757" stroke-width="1.8"/>
</svg>
```

**关键约束**：
- 必须指定 `viewBox`（保证响应式缩放）
- 标题用 `Georgia/serif`，代码/标签用 `ui-monospace`
- 边框 `stroke-width: 1.5-1.8`，圆角 `rx="8-10"`
- 强调色 `#D97757` 用在 stage 标签、关键节点、箭头
- 灰阶用 `#D1CFC5`（边框）/ `#87867F`（次文字）
- 长文图加入 `<title>` 和 `<desc>` 提升无障碍

### SVG 更新原则

- **改图不重命名**：直接在原文件上修改，文章自动反映改动
- 适合做 A/B 对比、微调字号、补充标签等迭代
- commit message 体现：`chore: 微调 XXX 图的 XXX 元素`

### 推荐阅读顺序

创建文章配图时：
1. **先写正文** — 确定核心概念和叙事顺序
2. **画 01 主图** — 通常是 Hero/总览图，放 TL;DR 后
3. **画 02+ 概念图** — 每章一图，配合 Key Insight 使用
4. **同步编号** — 按文章实际引用顺序编号（避免 02 在前 03 在后的情况）

## ✅ 写作检查清单

发布前检查：

### 内容
- [ ] 标题是否有吸引力？（可以带问号或数字）
- [ ] TL;DR 是否完整且有亮点？
- [ ] Key Insight 是否到位？
- [ ] 段落是否简短（2-4行）？
- [ ] 数据来源是否标注？
- [ ] 关键洞察是否引用了原话？

### SVG 配图
- [ ] 是否需要 Hero 图？（围绕核心模型的建议有）
- [ ] SVG 文件名是否符合 `YYYY-MM-DD-slug-NN-desc.svg`？
- [ ] 引用顺序是否与文件名序号一致？
- [ ] 是否使用 `<object>` 标签 + `width="100%"`？
- [ ] 颜色和字体是否符合视觉系统？

### 元信息
- [ ] 标签是否正确？
- [ ] 日期是否正确？
- [ ] series 字段是否填写？
- [ ] 是否需要 redirect_from（如果 URL 变更）？

## 📌 写作风格对比

### 新式（2026-05+ 推荐，叙事驱动）

适用：技术深度文、行业分析、热点解读

特点：
- 无 `## 📋 本文结构`
- 章节命名有标题性（"两种解法，一个问题"、"为什么 AI 让判断变得更稀缺"）
- 段落有引用块串联
- TL;DR 后立即放 Hero 图
- 结尾用 `## 结尾` 或 `## 写在最后`
- 元信息更简洁（无 redirect_from、无系列编号）

### 旧式（2025 标准模板）

适用：教程、体系化课程、系列文章

特点：
- 有 `## 📋 本文结构` TOC
- 章节用 `## 一、xxx`、`## 二、xxx` 编号
- 结论用 `## 结论` + `### 🎯 Takeaway` 表格
- 延伸阅读分经典案例/系列相关/学术理论三组
- 末尾带 `*AI-Native软件工程系列 #XX*` 标识

## 📌 示例文章

**新式参考**：
- 《Loop Engineering：把"你"从流程里抽出来》(2026-06-27)
- 《AI 编程代理的工程纪律：agent-skills 的反直觉设计》(2026-06-27)
- 《当 AI 编程走向"确定性"》(2026-05-29)
- 《Goodhart 定律回归》(2026-05-28)

**旧式参考**：
- 《Prompt Engineering 梯队建设》(2025-05-26)
- 《DORA 指标在 AI 时代的重构》(2025-05-15)
- 《企业 AI 开发的 S-curve Adoption》(2025-03-28)

## 🔗 相关资源

- [HTML Effectiveness 参考](https://thariqs.github.io/html-effectiveness/)
- `_templates/article-template.md` - 新式文章模板
- `_templates/post-template.md` - 旧式文章模板
- `WRITING-GUIDE.md` - 本指南
- `assets/images/` - SVG 配图目录