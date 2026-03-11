---
layout: post
title: "4个文件搞定详细设计：最小上下文集合实践"
date: 2026-03-11T08:30:00+08:00
tags: [AI-Native, SDLC, 软件工程, 详细设计, 实践]
author: Aaron
series: AI-Native SDLC 实践
redirect_from:
  - /2026/03/11/minimal-design-set.html
---

# 4个文件搞定详细设计：最小上下文集合实践

很多人在设计 AI-Native SDLC artifacts 时犯一个典型错误：**把传统软件工程的所有设计文档"AI化"**。

结果是：
- Artifacts 太多，维护成本极高
- AI 也不会真正使用
- 很快变成"AI 版传统文档地狱"

真正有效的做法是：**只保留 AI 必须依赖的最小设计集合（Minimal Context Set）**。

## 核心结论

如果目标是：
- AI 可以稳定写代码
- 人类可以 review
- 工程成本最低

那么**最小设计集合只有 4 个 artifacts**：

```
spec/
├─ intent.md       # 意图
├─ domain.md       # 领域模型
├─ api.yaml        # API 契约
└─ constraints.md  # 约束
```

这四个已经足够驱动：代码生成、测试生成、PR review。

## 为什么只需要 4 个？

### 1. Intent（必须）

**文件：** `intent.md`

**作用：** 让 AI 知道**为什么要**做这个功能。

```markdown
# intent.md

Feature: One-click checkout

Goal:
Reduce checkout time for returning customers

Success metric:
Checkout completion rate +10%
```

**如果没有 Intent：**
- AI 会过度实现
- 功能方向错误
- 设计不符合产品目标

**Intent 是 AI 软件工程的北极星。**

### 2. Domain Model（必须）

**文件：** `domain.md`

**作用：** 定义业务对象，划定边界。

```markdown
# domain.md

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

**如果没有 Domain Model：**
- AI 会"发明"实体
- 随意添加字段
- 创造不存在的关系

### 3. API Contract（强烈建议）

**文件：** `api.yaml`

**作用：** 结构化接口定义。

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

AI 会自动生成：Controller、Client、测试用例。

**如果没有 API Contract：**
- API 结构不一致
- Request/Response 设计混乱
- 前后端对接成本高

### 4. Constraints（必须）

**文件：** `constraints.md`

**作用：** 明确 AI 必须遵守的边界。

```markdown
# constraints.md

Performance:
  API latency < 300ms

Security:
  All APIs require JWT

Consistency:
  Order creation must be atomic

Scalability:
  Support 10k concurrent users
```

**如果没有 Constraints：**
- AI 写出简单但不可用的代码
- 不考虑安全
- 不考虑性能
- 不考虑并发

## 哪些可以删掉？

很多传统设计 artifact 其实完全可以删除。

### 1. Sequence Diagram（可以删）

**传统：** `sequence-diagram.puml`

**AI 时代的问题：**
- AI 解析图形能力弱
- 维护成本高
- 容易过期

**替代方案：** 用文字场景描述

```markdown
Scenario: checkout success

1. User clicks checkout
2. System creates order
3. System reserves inventory
4. System initiates payment
5. System returns order confirmation
```

### 2. Behavior Spec（大部分可以删）

**传统：** `behavior.md`

**现实：** 很多行为其实**测试用例**就可以表达。

```markdown
Test Cases:
- checkout success
- checkout payment failure
- checkout inventory shortage
- checkout timeout
```

AI 更容易理解具体例子，而非抽象描述。

### 3. Architecture Doc（大部分可删）

**传统：** `architecture.md` (10+ pages)

**现实：** 如果系统已有 Repo 结构、框架、依赖，AI 通常已经能理解。

**只需要一个简单的：**

```markdown
# tech.md

Backend: Spring Boot
DB: PostgreSQL
Cache: Redis
Message Queue: Kafka
```

### 4. Evaluation Spec（可删）

**传统：** `evaluation.md`

**现实：** 只要有 API Contract 和 Domain Model，AI 可以直接生成测试。

不需要单独写评估规格。

## AI 最喜欢的 Artifact 形态

| 格式 | 示例 | 原因 |
|------|------|------|
| **Markdown** | `intent.md` | 语义清晰 |
| **YAML** | `api.yaml` | 结构化 |
| **SQL** | `schema.sql` | 明确无歧义 |

AI **最不喜欢**的：
- PDF
- PPT
- 图片/Diagram

## 真正的 AI-Native 设计原则

未来设计遵循三个原则：

### 1. Context Density（上下文密度）

不是文档越多越好，而是**信息密度越高越好**。

❌ 反例：20 页设计文档，关键信息只有 3 段
✅ 正例：4 个文件，200 行，AI 能直接执行

### 2. Machine Readability（机器可读性）

设计必须：
- 结构清晰
- 规则明确
- 无歧义

### 3. Drift Resistance（抗漂移）

设计必须**不会很快过期**。

- API Contract 不容易变 ✅
- Sequence Diagram 很容易过期 ❌

## 最极端的实践

很多 AI 团队甚至只保留 **3 个文件**：

```
spec/
├─ intent.md
├─ domain.md
└─ api.yaml
```

然后让 AI 生成：
- Schema
- Tests
- Implementation

## 给你的实践建议

如果你想实践 AI-Native SDLC，从这个最小集合开始：

```
spec/
├─ intent.md
├─ domain.md
├─ api.yaml
└─ constraints.md
```

**不要超过 4 个 artifacts。**

否则很快就会变成：AI 版传统文档地狱。

## 未来的终极形态

未来 AI-Native SDLC 可能变成单文件：

```yaml
# spec.yaml

feature: checkout

intent:
  goal: reduce checkout time
  metric: completion rate +10%

domain:
  Order:
    - id: UUID
    - customerId: UUID
    - status: enum

api:
  POST /checkout:
    request: { customerId, items }
    response: { orderId }

constraints:
  latency: < 300ms
  security: JWT required
```

AI 直接生成整个系统。

## 总结

AI-Native 详细设计的关键是**极简**：

1. **只保留必要** —— 4 个 artifacts 足够
2. **删除可选** —— Sequence diagram、Architecture doc 可以去掉
3. **追求密度** —— 信息密度 > 文档数量
4. **机器优先** —— 结构 > 描述，代码 > 图形

记住：**简单是终极的复杂**。

---

*下一篇：《增量需求不再头疼：Delta Specification 工作流》*