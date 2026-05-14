# 博客文章写作指南

## 📋 标准模板位置

`_templates/article-template.md`

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

## 📝 模板结构

### 1. Frontmatter
```yaml
---
layout: post
title: "文章标题"
date: 2026-05-14T08:00:00+08:00
tags: [标签1, 标签2]
author: "@postcodeeng"
---
```

### 2. TL;DR（第一块引用）
```
> **TL;DR**
>
> 要点1 — 简短描述
> 要点2 — 简短描述
> 要点3 — 简短描述
> 要点4 — 简短描述
```

### 3. 本文结构
```
## 📋 本文结构

1. [第一章](#chapter1) — 副标题
2. [第二章](#chapter2) — 副标题
```

### 4. 章节标题
使用 h2（衬线字体，clay 色）和 h3（无衬线，左边框）

```
## 第一章标题

内容...

### 小节标题

内容...
```

### 5. Key Insight 标注
在段落之间插入，用来说明核心观点：

```
> 💡 **Key Insight**
>
> 核心观点一句话总结
```

### 6. 段落格式
- 每段 2-4 行
- 段与段之间空一行
- 避免大段文字

## ✅ 写作检查清单

发布前检查：

- [ ] 标题是否有吸引力？（可以带问号或数字）
- [ ] TL;DR 是否完整且有亮点？
- [ ] Key Insight 是否到位？
- [ ] 段落是否简短（2-4行）？
- [ ] 标签是否正确？
- [ ] 日期是否正确？

## 📌 示例文章

已按此模板重构的参考：
- 《为什么你的 Claude 每次都要从零开始》
- 《Codex 为什么跑着跑着就停了》
- 《知识便宜了，但你的问题变贵了》

## 🔗 相关资源

- [HTML Effectiveness 参考](https://thariqs.github.io/html-effectiveness/)
- `_templates/article-template.md` - 文章模板
- `WRITING-GUIDE.md` - 本指南