# AI-Native Weekly 撰写规范

## 基本原则

1. **中文撰写**：所有内容必须使用中文
2. **人工策划**：不再使用 RSS 自动生成
3. **去重机制**：每期必须检查往期内容，避免重复

## 内容结构

```markdown
---
layout: post
title: "AI-Native Engineering Weekly | YYYY年MM月DD日 精选"
date: YYYY-MM-DDTHH:00:00+08:00
permalink: /YYYY/MM/DD/ai-native-weekly/
tags: [AI-Native, Engineering, Weekly, ...]
author: Aaron
series: AI-Native Engineering Weekly
---

# AI-Native Engineering Weekly | 本周精选

> 本期一句话总结

## 本周 Top 5

| 排名 | 主题 | 来源 | 核心洞察 |
|------|------|------|---------|
| 🥇 | ... | ... | ... |
| 🥈 | ... | ... | ... |
| 🥉 | ... | ... | ... |
| 4 | ... | ... | ... |
| 5 | ... | ... | ... |

## 🥇 Top 1: 标题

**来源:** [来源名称](链接)  
**核心洞察:** 一句话总结

### 详细内容
...

## 已覆盖主题追踪

- [x] 本期主题 1
- [x] 本期主题 2
...

**往期已覆盖（不再重复）：**
- 主题 A（日期）
- 主题 B（日期）
...
```

## 去重检查清单

撰写前必须检查往期内容，确保不重复：

### 已覆盖主题（持续更新）

**2026-03-17:**
- [x] Codex Security 架构
- [x] Agent 安全防护
- [x] Rakuten 企业实践
- [x] Wayfair 规模化应用
- [x] Agent Runtime 架构

**2026-03-18:**
- [x] Harness Engineering
- [x] Context Engineering
- [x] 多 Agent 并行构建编译器

**2026-03-20:**
- [x] 16 Claude 并行写编译器（详细版）
- [x] Codex 内部 Agent 监控
- [x] GPT-5.4 mini/nano
- [x] Agent 团队角色分工
- [x] AI 薪资透明度研究

### 选题来源优先级

1. **Anthropic Engineering Blog**
2. **OpenAI Engineering Blog**
3. **Google AI/DeepMind Blog**
4. **Replit Blog**
5. **LangChain Blog**
6. **Simon Willison's Blog**
7. **Martin Fowler**
8. **其他高质量技术博客**

### 内容质量要求

- 每篇 Top 文章必须有**核心洞察**
- 使用**表格**对比关键信息
- 包含**代码示例**或**架构图**
- 提供**实践建议**或**启示**
- 字数：每篇 Top 文章 300-800 字

### 更新频率

- **发布时间**：每周三上午 10:00
- **内容时效**：优先选择本周发布的内容
- **深度分析**：选择 1-2 个主题进行深度解读

## 自动化 RSS 生成已停止

cron 任务中已移除 AI-Native Weekly 的自动生成，改为每周三手动撰写。

如需查看 RSS 自动生成的历史内容，请查看 2026-03-11 至 2026-03-20 期间的文件。
