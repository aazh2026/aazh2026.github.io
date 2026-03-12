---
layout: post
title: "详细设计会消失吗？Intent-Driven 开发的未来"
date: 2026-03-11T09:30:00+08:00
tags: [AI-Native, SDLC, Intent-Driven, 未来趋势]
author: Aaron
series: AI-Native SDLC 实践
redirect_from:
  - /2026/03/11/intent-driven-future.html
---

# 详细设计会消失吗？Intent-Driven 开发的未来

前面三篇讲了 AI-Native 详细设计的变革、最小实践、增量工作流。

现在问一个更激进的问题：

**详细设计会消失吗？**

答案是：**会消失一半**。

## 正在发生的范式转移

AI-Native SDLC 正在出现一种新范式：

```
Intent-Driven Development（意图驱动开发）
```

核心思想：

> 很多"详细设计"会被 `intent + constraints + examples` 直接替代。

不是设计变少了，而是**设计的表达方式**彻底变了。

## 传统 vs Intent-Driven

### 传统详细设计

```
PRD (20 pages)
    ↓
Detailed Design (40 pages)
    ↓
Code
```

### Intent-Driven

```
Intent.md (20 lines)
    +
Constraints.md (10 lines)
    +
Examples/ (3-5 个示例)
    ↓
AI generates code
```

**信息密度提升了 100 倍。**

## Intent-Driven 的核心结构

只需要三个要素：

### 1. Intent（意图）

```markdown
# intent.md

Feature: Smart order routing

Goal:
Route orders to nearest warehouse to reduce shipping time

Why:
Current average shipping time is 5 days, target is 2 days

Success metric:
- Avg shipping time < 2 days
- Routing accuracy > 95%
```

**关键：** 说清楚"为什么要做"和"怎么算成功"。

### 2. Constraints（约束）

```markdown
# constraints.md

Functional:
- Must support real-time inventory check
- Must handle warehouse capacity limits
- Must fallback to next nearest if primary is full

Non-functional:
- Routing decision < 100ms
- 99.9% availability
- Must be backward compatible with existing order API
```

**关键：** 划定边界，告诉 AI 什么不能做。

### 3. Examples（示例）

```markdown
# examples.md

Example 1: Standard routing
- Input: Order from NYC, inventory available in NJ
- Output: Route to NJ warehouse
- Reason: Nearest with stock

Example 2: Capacity fallback
- Input: Order from SF, nearest warehouse (Oakland) is at capacity
- Output: Route to San Jose warehouse
- Reason: Next nearest with available capacity

Example 3: Out of stock
- Input: Order from Miami, no Florida warehouse has inventory
- Output: Route to Atlanta + notify customer of 1-day delay
- Reason: Balance speed and transparency
```

**关键：** 用具体例子说明期望行为，比抽象描述更有效。

## 为什么 Examples 比 Spec 更有效？

LLM 的本质是**模式匹配**。

给它看 3-5 个高质量例子，比 20 页抽象规格更容易理解。

| 方式 | AI 理解难度 | 人类编写成本 |
|------|------------|-------------|
| 抽象规格 | 高 | 高 |
| 具体例子 | 低 | 低 |

这就是 **Few-Shot Prompting** 在软件工程中的应用。

## Intent-Driven 的工作流程

```
1. Human writes:
   - intent.md
   - constraints.md
   - examples/ (3-5 个)

2. AI generates:
   - Domain model
   - API design
   - Implementation
   - Tests

3. Human reviews:
   - AI output
   - Add more examples if needed
   - Iterate

4. Done
```

**设计文档不是写出来的，是"示例驱动"生成的。**

## 什么场景适合 Intent-Driven？

| 场景 | 适合度 | 原因 |
|------|--------|------|
| **CRUD 操作** | ⭐⭐⭐⭐⭐ | 模式固定，例子足够 |
| **标准业务流程** | ⭐⭐⭐⭐⭐ | 有明确规则，可示例化 |
| **复杂算法** | ⭐⭐⭐ | 可能需要补充数学描述 |
| **创新性功能** | ⭐⭐ | 缺乏先例，需要更多设计 |
| **安全关键系统** | ⭐ | 需要严格验证，不能仅靠例子 |

**结论：** 80% 的业务开发适合 Intent-Driven，20% 的复杂系统仍需传统设计。

## 详细设计会完全消失吗？

不会。但会**分层**：

### Layer 1: Intent-Driven（80% 的需求）

```
intent + constraints + examples
    ↓
AI generates everything
```

适用于：常规业务功能、CRUD、标准流程

### Layer 2: Structured Design（15% 的需求）

```
domain.md + api.yaml + constraints.md
    ↓
AI generates with structure
```

适用于：复杂业务逻辑、跨模块交互、性能敏感功能

### Layer 3: Detailed Design（5% 的需求）

```
Full design artifacts
    ↓
Human reviews carefully
    ↓
AI implements with supervision
```

适用于：核心算法、安全关键、架构级变更

## 工程师角色的变化

### 传统工程师

```
60% 写代码
30% 写文档
10% 开会
```

### AI-Native 工程师

```
40% 定义 Intent & Examples
30% Review AI output
20% 处理复杂边界 case
10% 写关键代码
```

**核心能力转移：**
- 从"如何实现" → "想要什么"
- 从"写代码" → "定义问题和边界"
- 从"详细设计" → "高质量示例"

## 未来的终极形态

想象这样一个工作流：

```
Product Manager writes:
"我们需要一个智能订单路由系统，
目标是2天内送达，
参考这三个场景的例子..."

AI asks:
"如果最近仓库缺货，是延迟发货还是远距离发货？"

PM answers:
"远距离发货，但通知用户"

AI generates:
- 完整实现
- 测试用例
- 部署配置

Engineer reviews:
- 逻辑正确性
- 边界处理
- 性能优化点

Deploy
```

**详细设计在哪里？**

**在对话里，在例子中，在 AI 生成的代码里。**

不再需要单独的"设计文档"。

## 给实践者的建议

### 如果你今天开始

1. **从 Intent-Driven 入手**
   - 写清楚意图
   - 给 3-5 个高质量例子
   - 明确约束

2. **逐步引入结构化设计**
   - 当 AI 输出不稳定时
   - 当需要多人协作时
   - 当涉及复杂边界时

3. **保留详细设计用于关键系统**
   - 核心支付逻辑
   - 安全认证模块
   - 性能关键路径

### 关键心法

```
不是"要不要写设计文档"
而是"如何让 AI 理解我想要什么"

手段不重要，目标才重要。
```

## 总结

详细设计不会完全消失，但会**形态转移**：

| 时代 | 核心产出 | 形式 |
|------|---------|------|
| 传统 | 设计文档 | 长篇描述 |
| AI-Native 过渡 | 结构化 Artifacts | Markdown + YAML |
| Intent-Driven | 意图 + 示例 | 极简文本 |

**最终趋势：**

> 详细设计从"人写给人看"变成"人写给 AI 执行"，最终变成"人和 AI 共同探索问题空间"。

这是软件工程的下一次革命。

你准备好了吗？

---

*系列完结。四篇文章覆盖了 AI-Native 详细设计的变革逻辑、最小实践、增量工作流和未来趋势。希望对你有启发。*