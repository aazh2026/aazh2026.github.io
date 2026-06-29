---
layout: post
title: "\"AI-Native 详细设计：从文档到可执行上下文\""
date: 2026-03-11T08:00:00+08:00
tags: [AI-Native, SDLC, 软件工程, 详细设计]
description: "AI-Native详细设计从给人读的文档变成给AI执行的可执行上下文，六大Artifacts驱动生成。"
author: "@postcodeeng"
series: AI-Native SDLC 实践
---

# AI-Native 详细设计：从文档到可执行上下文

> **TL;DR**
>
> 本文核心观点：
> 1. **设计从文档变成上下文** — AI-Native 详细设计的核心变化是：从给人读的文档，变成给 AI 执行的上下文。设计必须结构化（Intent + Domain Model + API Contract + Behavior Spec + Constraints + Evaluation），才能驱动 AI 直接生成代码、测试和审查。
> 2. **设计质量被 AI 放大** — 设计不是变少了，而是变得更重要。传统流程中设计文档与代码脱节，AI-Native 流程中设计 artifacts 直接驱动 AI，设计的质量直接决定代码质量、生成效率和幻觉概率。
> 3. **Intent Architect 是新角色** — 设计师的核心价值从"画图"转向"定义意图"，图形产出减少，但上下文组织的责任更重，需要掌握结构化 artifacts 的组合能力。

<object data="/assets/images/2026-03-11-ai-native-detailed-design-02-ctx-evolution.svg" type="image/svg+xml" width="100%" aria-label="插图" role="img"></object>

传统软件工程里的详细设计文档正在死去。不是因为设计不重要了，而是因为它正在变成另一种东西——**可执行上下文（Executable Context）**。

这不是术语游戏，而是根本性的工程范式转移。

## 详细设计为什么正在死去

典型的详细设计文档长这样：

**核心问题：**

1. **AI 读不懂** —— 松散的自然语言，缺乏结构化约束
2. **信息密度低** —— 大量描述性文字，关键信息被淹没
3. **不可执行** —— 文档写完，开发还得重新理解一遍
4. **极易过期** —— 代码一改，文档就成了谎言

换句话说，传统详细设计是**给人看的**，但 AI 时代需要的是**给 AI 执行的**。

## 范式转移：从文档到上下文

详细设计的本质在改变：

新范式下，设计必须满足三个标准：

| 标准 | 要求 |
|------|------|
| **AI 可理解** | 结构化、无歧义、明确约束 |
| **AI 可执行** | 能直接驱动代码生成、测试生成、代码审查 |
| **AI 可验证** | 包含验收标准和评估规则 |

## 新的设计结构

AI-Native 详细设计不再是单一大文档，而是**多个结构化 artifacts 的组合**：

## 六种核心 Artifact

### Intent（意图）

> 💡 **Key Insight** — Intent 是 AI-Native 设计的起点。没有它，AI 的实现方向完全依赖 prompt，质量不可控。

让 AI 知道**为什么**要做这个功能。

没有 Intent，AI 会出现典型问题：过度实现、功能方向错误、设计与产品目标脱节。

### Domain Model（领域模型）

> 💡 **Key Insight** — Domain Model 是 AI 的业务边界定义。缺少它，AI 会凭"猜测"发明实体和关系，导致代码与真实业务脱节。

定义业务对象，划定 AI 的业务边界。

没有 Domain Model，AI 会"发明"实体、字段和关系，导致代码与业务不符。

### API Contract（API 契约）

> 💡 **Key Insight** — API Contract 是 AI 生成效率的杠杆。用 OpenAPI/JSON Schema 定义一次，Controller、Client SDK、测试用例都可以自动生成。

用 OpenAPI/JSON Schema 定义接口。

AI 可以自动生成：Controller、Client SDK、测试用例。

### Behavior Specification（行为规格）

> 💡 **Key Insight** — Behavior Specification 用场景描述替代图形时序图，本质是 BDD + AI Context，更容易被 AI 解析和执行。

用场景描述代替 Sequence Diagram。

本质上是 **BDD + AI Context**，比图形更易解析。

### Constraint Design（约束设计）

> 💡 **Key Insight** — 约束设计是 AI 代码质量的保障。没有明确的边界约束，AI 通常写出功能可用但存在性能、安全、一致性隐患的代码。

明确 AI 必须遵守的边界。

没有约束，AI 通常写出简单但不可用的代码——不考虑性能、安全和一致性。

### Evaluation Spec（评估规格）

> 💡 **Key Insight** — Evaluation Spec 是 AI-Native 设计的闭环节点。有了它，AI 可以自主判断实现是否符合预期，而不需要人工逐条验收。

定义如何验证实现是否符合预期。

AI 据此生成单元测试和集成测试。

<object data="/assets/images/2026-03-11-ai-native-detailed-design-01-artifacts.svg" type="image/svg+xml" width="100%" aria-label="Evaluation Spec（评估规格）（插图）" role="img"></object>

## 设计与代码的解耦与重绑定

> 💡 **Key Insight** — 在 AI-Native 流程中，设计质量的权重被大幅放大。设计不再是一份"参考文档"，而是 AI 生成结果的直接上限。

传统流程：设计文档 → 开发人员理解 → 代码实现（信息传递有损耗）

AI-Native 流程：设计 artifacts → AI 直接执行 → 代码输出（无损传递）

设计的质量直接决定：代码质量、生成效率、幻觉概率。

**所以详细设计反而更重要了。**

## 设计师的新身份：Intent Architect

> 💡 **Key Insight** — 设计师的核心价值从"画图"转向"定义意图"。图形产出减少，但上下文组织的责任更重。

传统角色：需求澄清 → UI 设计 → 输出设计稿（静态文档）

AI-Native 角色：**Intent Architect**，负责：
- 系统上下文定义
- 设计 artifacts 组织
- 约束和评估规则制定

## 为什么 AI 时代图形在减少

> 💡 **Key Insight** — 图形在 AI-Native 设计中退居次位。AI 解析文本、Schema 和结构化数据的精度远高于图片，因此设计产出向结构化文档倾斜。

传统设计依赖 UML、时序图、类图。

AI-Native 设计中，**图形减少**——因为 AI 更擅长处理文本、Schema、结构化数据，而不是图片。

未来的设计更多是：结构化 artifacts（Markdown + JSON Schema + YAML），而非图表。

## 最小设计集合：四个核心文件

> 💡 **Key Insight** — 最小设计集合是 AI-Native 详细设计的实践核心。掌握这 4 个文件的组织方式，就能覆盖大多数场景。

实践中，80% 的场景只需要 **4 个文件**：

这四个文件足够驱动：代码生成、测试生成、PR Review。

其他文档是可选增强层，非必要不增加。

## 终极形态：Executable Specification

> 💡 **Key Insight** — Executable Specification 是详细设计的终极演化方向。设计一旦可执行，就消除了"文档与代码不一致"这个长期工程难题。

详细设计可能演化为 **Executable Specification**：

AI 可以直接：解析规格 → 生成代码 → 运行测试 → 验证结果，全流程无需人工介入。

这也是很多 AI 工程师在探索的方向：**Spec Driven Engineering**。

## 总结

AI-Native 时代的详细设计有五个关键变化：

1. **设计从文档变成上下文** —— Design Doc → Context Artifacts
2. **设计结构化** —— Markdown + YAML + JSON
3. **设计模块化** —— Domain、API、Behavior、Constraints、Evaluation 分离
4. **设计可执行** —— Design → AI → Code
5. **设计可验证** —— Evaluation Spec

更重要的是：未来详细设计可能会消失一半。

因为 AI-Native SDLC 正在出现新范式：**Intent-Driven Development**。很多"详细设计"会被 `intent + constraints + examples` 直接替代。

<object data="/assets/images/2026-03-11-ai-native-detailed-design-03-intent-driven.svg" type="image/svg+xml" width="100%" aria-label="总结（插图）" role="img"></object>

这是软件工程的下一次革命。

---

*下一篇：《4个文件搞定详细设计：最小上下文集合实践》*