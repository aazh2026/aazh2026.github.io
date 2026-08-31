---
layout: post
title: "架构作为能力均衡器：规约格式如何影响 Coding Agent 产出质量"
date: 2026-08-31T14:00:00+08:00
tags: [Agent OS, 架构规约, LLM代码生成, 评测]
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
>
> 本文核心观点：
> 1. **格式 × 模型交互效应** — 最强模型（Sonnet 4.6、GPT-5）受规约格式影响极小（质量差异 0.17–0.92 分），而弱模型格式产生的差异高达 0.83–2.42 分
> 2. **代码邻近格式挽回能力鸿沟** — OpenAPI 和 TypeScript 契约等"代码邻近"格式可以帮助弱模型追回大部分与强模型之间的能力差距
> 3. **最强模型 self-validation 100%，最弱模型 0%** — 自验率在能力谱上从 100% 崩溃至 0%，这是部署风险中在 benchmark 分数里完全不可见的部分
> 4. **成本效率反转** — 中等能力模型（Haiku）消耗更多 token（735K）却得到更差结果（score 6.50），强模型（Sonnet）消耗更少（640K）却得更高分（8.42）

---

## 背景：架构规约的格式重要吗？

LLM-based coding agents 从高级描述生成完整软件系统，但架构规约（architecture specifications）的格式如何影响生成代码质量、这一效应是否因模型能力而异，此前没有系统研究。

论文提出一个核心实验：在五个信息等价但格式不同的规约下，对比六种模型的生成质量差异。

## 实验设计

**被测系统**：一个 Task Management API，七个组件（API Router、User/Project/Task/Comment/Notification 服务、Event Bus），组件间通过 Event Bus 通信，不直接互相调用，有 25 条 HTTP routes、六条硬约束、数据所有权规则等。

**五种规约格式**（信息完全等价，仅表示形式不同）：

| 格式 | 描述 |
|------|------|
| Prose（控制组） | 自然语言段落描述 |
| Mermaid + Constraints + ADRs | Mermaid 架构图 + 约束列表 + 决策记录 |
| OpenAPI + Mermaid + Constraints | 上述基础上加完整 OpenAPI 3.0 YAML |
| C4/Structurizr DSL | C4 层次分解（System Context → Container → Component）|
| TypeScript Contracts + ArchUnit Rules | TypeScript 接口契约 + ArchUnit 风格架构规则 |

**六个模型**：Anthropic（Sonnet 4.6、Haiku 4.5）、OpenAI（GPT-5、GPT-5-mini）、Google（Gemini 2.5 Pro、Gemini 2.5 Flash）。

每个模型 × 每种格式 = 15 cells，3 trials each = 90 trials。多轮 agent session，最多 50 turns。

## 核心结果

### 格式 × 模型交互效应

最强模型（Sonnet 4.6、GPT-5）：格式几乎无关，质量差异仅 0.17–0.92 分。

弱模型：格式产生 0.83–2.42 分的质量差异，code-proximate 格式（OpenAPI、TypeScript Contracts）挽回了大部分能力差距。

### TypeScript Contracts 的极端效果

最弱模型 Gemini Flash：
- Prose 格式下：API 路由覆盖率仅 **33%**
- TypeScript 契约格式下：**100%** 路由覆盖

仅规约格式一项，将覆盖率从 33% 提升至 100%。

### Self-validation 崩溃

Demo run rate 在能力谱上从 100%（Sonnet）崩溃至 0%（Gemini Flash）。弱模型从不端到端测试自己的输出，这是 benchmark 分数里完全隐形的部署风险。

### Token 消耗与质量反转

Haiku（中等模型）：735K tokens，score 6.50
Sonnet（强模型）：640K tokens，score 8.42

中等能力模型在进入编译调试循环时消耗更多 token，但输出更差——强模型会避免进入这些循环。

### 三种失败模式

论文识别出三种 distinct agent 失败模式，每种与规约格式有不同的交互：

1. **Compilation death spiral** — 编译错误引发反复修复，最终无法退出
2. **Premature termination** — 未能完成所有必要步骤就停止
3. **Perfectionist iteration** — 过度迭代但未聚焦于正确目标

## 混合评估方法

论文使用两种互补评估通道：

- **自动化静态约束检查**（约 80% 架构覆盖率）：通过静态 import 分析、结构完整性检查、TypeScript 编译检测约束违反
- **LLM-as-judge**（四个维度 1–10 分）：架构遵从性、完整性、代码质量、约束合规性

两种方法互补：judge 捕获语义违反（checker 漏掉），checker 捕获结构违反（judge 漏掉）。两者相关系数仅 r=0.21。

---

## 结尾

这篇论文的核心发现是：架构规约格式与模型能力之间存在强烈的交互效应——格式对强模型几乎无关，但对弱模型影响巨大。最强的"能力均衡器"是代码邻近的结构化契约格式（TypeScript Contracts、OpenAPI），而非自然语言描述。这意味着：在成本敏感部署中，用便宜模型 + 结构化规约的组合可能优于贵模型 + 自由格式的组合。

---

*Published on 2026-08-31*

**参考链接**

- Paper: [Architecture as Capability Equalizer for Coding Agents](https://arxiv.org/abs/2608.21747) — arXiv:2608.21747
