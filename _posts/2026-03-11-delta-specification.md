---
layout: post
title: "增量需求不再头疼：Delta Specification 工作流"
date: 2026-03-11T09:00:00+08:00
tags: [AI-Native软件工程, SDLC, 增量开发, 需求管理]
description: "增量需求用Delta Specification管理变化量而非重写完整PRD，Compatibility Rules防止AI过度重构。"
author: "@postcodeeng"
series: aise
---

## 增量需求不再头疼：Delta Specification 工作流

> **TL;DR**
>
> 本文核心观点：
> 1. **增量需求的核心是 Delta Specification** — AI 只需要理解变化部分，而非完整 PRD
> 2. **用 `changes/` 目录管理所有变更** — 类似 Git commit 和 Database Migration
> 3. **必须声明 Compatibility Rules** — 防止 AI 过度重构破坏已有逻辑
> 4. **定期将 delta merge 回 base spec** — 避免 spec 碎片化

在 AI-Native SDLC 里，增量需求最大的挑战不是"写需求"，而是：

**如何让 AI 在理解历史系统上下文的基础上，只实现增量变化。**

如果做不好，AI 会出现典型问题：
- 重写已有逻辑
- 改坏历史功能
- 破坏 API 兼容性
- 引入 Domain Drift

增量需求描述的核心不是 PRD，而是 **Delta Specification（增量规格）**。

## 核心原则

增量需求必须明确三件事：

AI 只需要理解**变化部分**。

> 💡 **Key Insight**
> Delta Specification 的本质是**只传递变化量**，而非重新传递整个系统上下文。AI 读取 `Base Spec + Delta` 的组合效果等同于读取完整需求文档，但信息量减少 80% 以上。

<object data="/assets/images/2026-03-11-delta-specification-01-workflow.svg" type="image/svg+xml" width="100%" aria-label="核心原则" role="img"></object>

## 推荐的工程结构

在已有设计基础上，引入 `changes/` 目录：

**核心思想：**
- 原始设计不改，只追加 change spec
- 类似 Git commit、Database migration

## 增量需求描述（Change Spec）

每个需求只需要一个文件：`change.md`

**重点：** 明确**影响范围**。

## Domain 增量描述

如果 domain 有变化，**不要改原文件**，写 `domain.delta.md`：

AI 只需要理解**新增/修改部分**。

## API 增量描述

API 变化同样使用 delta：

AI 可以自动：
- 更新 Controller
- 更新 Tests
- 更新 Client SDK
- 保持向后兼容

## 兼容性规则（非常重要）

增量需求必须明确**不允许破坏**的地方：

**否则 AI 很容易：**
- 重构系统
- 改动过大
- 引入回归 bug

## AI 执行流程

AI 读取顺序：

形成：**Base Context + Delta Context**

非常稳定。

<object data="/assets/images/2026-03-11-delta-specification-02-execution-flow.svg" type="image/svg+xml" width="100%" aria-label="AI 执行流程" role="img"></object>

> 💡 **Key Insight**
> Delta 模式天然支持**幂等变更**：相同的 delta 重复执行不会累积副作用，这与 Database Migration 的幂等性保证如出一辙。

## 完整示例

> 💡 **Key Insight**
> Delta Spec 的威力在示例中最容易体现：一个完整的 change 文件通常只有 15-30 行，却能精确驱动 AI 完成原本需要上百行 PRD 才能描述的改动。

### 当前系统

假设已有订单管理系统，支持创建订单和查询订单状态。现有系统包含以下组件：

**Domain 层**：Order 实体，字段包括 `id`、`customerId`、`items`、`totalAmount`、`status`（当前仅支持 `PENDING` 和 `COMPLETED`）、`createdAt`。OrderService 提供 `createOrder()` 和 `getOrder()` 方法。

**API 层**：现有两个 endpoint——`POST /orders`（创建订单）和 `GET /orders/{id}`（查询订单）。返回格式为 JSON，遵循统一的错误码规范。

**数据库层**：orders 表主键为 `id`，索引包括 `customerId` 和 `status`。订单记录创建后不允许修改金额和商品明细。

**Compatibility Rules（已有约束）**：API 保持向后兼容，不对外暴露内部字段 ID，不允许跨订单的操作原子性（这是已有设计决策，AI 不可改变）。

### 新需求：支持订单取消

业务方要求新增"取消订单"功能：用户在下单后、商家发货前，可以主动取消订单。取消操作需要记录原因和时间戳，已发货的订单不可取消。

**Domain 增量（domain.delta.md）**：Order 实体新增 `status` 取值 `CANCELLED`；新增 `cancelledAt` 字段（DateTime，nullable）；OrderService 新增 `cancelOrder(id)` 方法，业务规则：只有 `status == PENDING` 的订单可以取消，已发货（`SHIPPED`）或已完成（`COMPLETED`）的订单返回错误。

**API 增量（api.delta.yaml）**：新增 `POST /orders/{id}/cancel`，成功返回 200，订单状态变为 `CANCELLED`；若订单已发货返回 400 错误。

**Compatibility Rules（关键约束）**：`GET /orders/{id}` 必须继续正常工作，返回订单当前状态（包含 `CANCELLED`）；已存在的 `POST /orders` 不受影响；数据库 orders 表只允许追加字段，不允许修改已有记录结构。

```markdown
## 变更概述
新增「取消订单」功能，允许用户在订单未发货前取消订单。

## 影响范围
- domain/OrderService：新增 cancelOrder 方法
- api/OrderController：新增 POST /orders/{id}/cancel
- tests：新增 cancel 场景测试

## 兼容性规则
- 已发货订单不可取消，返回 400 错误
- 取消操作不删除订单记录，改为标记 status=CANCELLED
```

**完整 domain.delta.md 示例：**

```markdown
## Order 实体变更
新增字段：
- status: OrderStatus (PENDING, SHIPPED, CANCELLED)
- cancelledAt: DateTime (nullable)

新增方法：
- cancel(): void — 将 status 设为 CANCELLED，cancelledAt 设为当前时间
```

**完整 api.delta.yaml 示例：**

```yaml
paths:
  /orders/{id}/cancel:
    post:
      summary: 取消订单
      responses:
        200:
          description: 取消成功
        400:
          description: 订单已发货，无法取消
```

AI 可以：
- 修改 service（增加取消逻辑）
- 修改 controller（增加 endpoint）
- 修改 tests（增加取消场景）
- **不会破坏其他逻辑**

## 为什么这种方式效率高？

### 传统需求流程

**问题：** AI 需要重新理解**整个系统**，上下文复杂度高。

### Delta Spec 流程

**优势：** AI 只需要理解**变化部分**，上下文复杂度降低 **80% 以上**。

## 避免 Spec Drift

如果 change 很多，需要定期做一次 **Spec Merge**。

例如，每季度：

类似 Git squash，把所有 delta 合并回 base spec。

**否则：** changes 会越来越多，维护成本上升。

## 终极形态：Spec Versioning

未来 AI-Native SDLC 很可能变成：

AI 理解：

非常类似 **Database Migration** 的工作流。

## 增量需求 10 行模板

如果你追求极致极简，用这个 10 行模板就够了——它足够表达一个完整的增量需求，又不会让 AI 在读约束上消耗太多注意力。

```markdown
## [功能名称]
支持订单取消

## [影响范围]
- domain/OrderService：新增 cancelOrder 方法
- api/OrderController：新增 POST /orders/{id}/cancel
- tests：新增 cancel 场景测试

## [兼容性约束]
- GET /orders/{id} 保持兼容
- 已发货/已完成订单不可取消
- orders 表只追加字段，不修改已有记录

## [Domain 增量]
Order.status 新增 CANCELLED
Order 新增 cancelledAt: DateTime (nullable)

## [API 增量]
POST /orders/{id}/cancel → 200 / 400
```

这个模板的设计逻辑：**前 3 行说清楚要做什么和影响范围，中间 2 行声明 AI 不能动的边界，最后 2 行分别给 Domain 和 API 的具体变更**。10 行刚好覆盖完整，又没有一行是废话。很多团队已经在这么用，对 AI 执行效果极好。

## 总结

AI-Native 增量需求的最佳实践：

1. **不修改原 spec** —— 只追加 `changes/`
2. **用 Delta 描述变化** —— `domain.delta.md`, `api.delta.yaml`
3. **明确 Compatibility Rules** —— 防止 AI 过度重构
4. **定期 Merge Spec** —— 避免 spec 演化失控

一句话总结：

> AI-Native SDLC 的需求迭代，本质是 **Spec 的版本管理**，而不是文档修改。

---

*下一篇：《详细设计会消失吗？Intent-Driven 开发的未来》*
