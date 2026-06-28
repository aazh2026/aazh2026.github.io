---
layout: post
title: "\"增量需求不再头疼：Delta Specification 工作流\""
date: 2026-03-11T09:00:00+08:00
tags: [AI-Native, SDLC, 增量开发, 需求管理]
author: "@postcodeeng"
series: AI-Native SDLC 实践
redirect_from:
  - /delta-specification.html
---

# 增量需求不再头疼：Delta Specification 工作流

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

<object data="/assets/images/2026-03-11-delta-specification-01-workflow.svg" type="image/svg+xml" width="100%"></object>

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

## 完整示例

### 当前系统

### 新需求：支持订单取消

**change.md:**
**domain.delta.md:**
**api.delta.yaml:**
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

如果你追求极致极简，用这个模板：

**示例：**

很多团队已经在这么用，对 AI 执行效果极好。

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