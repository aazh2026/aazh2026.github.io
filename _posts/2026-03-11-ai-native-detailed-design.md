---
layout: post
title: "AI-Native 详细设计：从文档到可执行上下文"
date: 2026-03-11T08:00:00+08:00
tags: [AI-Native, SDLC, 软件工程, 详细设计]
author: Aaron
series: AI-Native SDLC 实践
redirect_from:
  - /2026/03/11/ai-native-detailed-design.html
---

# AI-Native 详细设计：从文档到可执行上下文

传统软件工程里的详细设计文档正在死去。不是因为设计不重要了，而是因为它正在变成另一种东西——**可执行上下文（Executable Context）**。

这不是术语游戏，而是根本性的工程范式转移。

## 传统详细设计的问题

典型的详细设计文档长这样：

```
design.md (20 pages)
├─ Class Diagram
├─ Sequence Diagram
├─ API Design
├─ Database Schema
├─ Error Handling
└─ Algorithm Description
```

**核心问题：**

1. **AI 读不懂** —— 松散的自然语言，缺乏结构化约束
2. **信息密度低** —— 大量描述性文字，关键信息被淹没
3. **不可执行** —— 文档写完，开发还得重新理解一遍
4. **极易过期** —— 代码一改，文档就成了谎言

换句话说，传统详细设计是**给人看的**，但 AI 时代需要的是**给 AI 执行的**。

## AI-Native 时代的核心变化

详细设计的本质在改变：

```
Detailed Design → Executable Design Context
```

新范式下，设计必须满足三个标准：

| 标准 | 要求 |
|------|------|
| **AI 可理解** | 结构化、无歧义、明确约束 |
| **AI 可执行** | 能直接驱动代码生成、测试生成、代码审查 |
| **AI 可验证** | 包含验收标准和评估规则 |

## 新的设计结构

AI-Native 详细设计不再是单一大文档，而是**多个结构化 artifacts 的组合**：

```
design/
├─ intent.md           # 意图：为什么要做这个
├─ domain-model.md     # 领域模型：业务对象定义
├─ api-contract.yaml   # API 契约：接口规范
├─ constraints.md      # 约束：性能、安全、一致性要求
└─ evaluation.md       # 评估：验收标准和测试策略
```

## 六种核心 Artifact

### 1. Intent（意图）

让 AI 知道**为什么**要做这个功能。

```markdown
# intent.md

Feature: One-click checkout

Goal:
Reduce checkout time for returning customers

Success metric:
Checkout completion rate +10%
```

没有 Intent，AI 会出现典型问题：过度实现、功能方向错误、设计与产品目标脱节。

### 2. Domain Model（领域模型）

定义业务对象，划定 AI 的业务边界。

```markdown
# domain-model.md

Entity: Order

Fields:
- id: UUID
- customerId: UUID
- status: enum(PENDING, PAID, CANCELLED)
- totalAmount: decimal

Rules:
- order must have at least one item
- totalAmount >= 0
```

没有 Domain Model，AI 会"发明"实体、字段和关系，导致代码与业务不符。

### 3. API Contract（API 契约）

用 OpenAPI/JSON Schema 定义接口。

```yaml
# api.yaml

POST /orders

request:
  customerId: string
  items:
    - productId: string
      quantity: number

response:
  orderId: string
  status: string
```

AI 可以自动生成：Controller、Client SDK、测试用例。

### 4. Behavior Specification（行为规格）

用场景描述代替 Sequence Diagram。

```markdown
# behavior.md

Scenario: checkout success

Given:
  user has cart items

When:
  user clicks checkout

Then:
  order created
  payment initiated
  inventory reserved
```

本质上是 **BDD + AI Context**，比图形更易解析。

### 5. Constraint Design（约束设计）

明确 AI 必须遵守的边界。

```markdown
# constraints.md

Latency:
  checkout API < 300ms

Consistency:
  order creation must be atomic

Security:
  all endpoints require JWT auth
```

没有约束，AI 通常写出简单但不可用的代码——不考虑性能、安全和一致性。

### 6. Evaluation Spec（评估规格）

定义如何验证实现是否符合预期。

```markdown
# evaluation.md

Test cases:
1. checkout success
2. payment failure
3. inventory shortage

Metrics:
- API latency
- error rate
```

AI 据此生成单元测试和集成测试。

## 设计与代码的关系变化

传统流程：

```
Design → Code
```

AI-Native 流程：

```
Design → AI → Code
```

设计的质量直接决定：代码质量、生成效率、幻觉概率。

**所以详细设计反而更重要了。**

## 设计角色的变化

传统角色：

```
Architect → Developer
```

AI-Native 角色：

```
Architect
    ↓
Context Engineer
    ↓
AI Developer
```

设计师的新身份是 **Intent Architect**，负责：
- 系统上下文定义
- 设计 artifacts 组织
- 约束和评估规则制定

## 图形设计的变化

传统设计依赖 UML、时序图、类图。

AI-Native 设计中，**图形减少**——因为 AI 更擅长处理文本、Schema、结构化数据，而不是图片。

未来的设计更多是：

```
markdown
yaml
json
sql
```

## 最小设计集合

实践中，80% 的场景只需要 **4 个文件**：

```
spec/
├─ intent.md       # 意图
├─ domain.md       # 领域模型
├─ api.yaml        # API 契约
└─ constraints.md  # 约束
```

这四个文件足够驱动：代码生成、测试生成、PR Review。

其他文档是可选增强层，非必要不增加。

## 未来的终极形态

详细设计可能演化为 **Executable Specification**：

```
spec/
├─ feature.yaml
├─ domain.yaml
├─ api.yaml
└─ constraints.yaml
```

AI 可以直接：

```
spec → system
```

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

这是软件工程的下一次革命。

---

*下一篇：《4个文件搞定详细设计：最小上下文集合实践》*