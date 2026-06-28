---
layout: post
title: "为什么Context Engineering比Prompt Engineering更重要"
date: 2025-04-09T02:00:00+08:00
tags: [Context Engineering, Prompt Engineering, AI工程, 软件架构]
author: "@postcodeeng"
series: AI-Native软件工程系列 #01
permalink: /posts/context-engineering//

redirect_from:
  - /context-engineering/
---

> **TL;DR**
> 
> 本文核心观点：
> 1. **Prompt Engineering有天花板** — 边际收益递减，无法解决"AI知道什么"的问题
> 2. **Context Engineering是80%的工作** — 企业AI项目的真正瓶颈
> 3. **五层Context架构** — 从任务到组织的系统化上下文管理
> 4. **数据飞轮效应** — Context是企业的护城河

---

## Prompt Engineering的局限

> 💡 **Key Insight**
> 
> Prompt Engineering解决"怎么说"的问题，Context Engineering解决"知道什么"的问题。后者才是AI工程真正的瓶颈。

### 一个真实的失败案例

2024年初，某零售企业投入**百万预算**，搭建AI客服系统。

他们聘请了顶尖的Prompt Engineering专家，精心设计了**数百个Prompt模板**。每个Prompt都写得非常专业：

**但上线后，系统表现糟糕：**

| 问题场景 | AI表现 |
|---------|--------|
| 用户询问"上周买的iPhone能退吗" | 回答"请提供订单号"——用户已提供 |
| 询问"保修期多久" | 给出通用答案，不知企业延保政策 |
| 询问"订单为何未发货" | 无法查询真实物流状态 |

**问题出在哪里？**

不是Prompt写得不好，是**AI不知道上下文**。

它不知道用户是谁、订单状态如何、企业特殊规则、实时库存信息...

---

## Context Engineering的定义

### 🔥 核心定义

> **Context Engineering** = 系统化地构建、管理、提供给AI的**上下文信息基础设施**

### 与Prompt Engineering的对比

| 维度 | Prompt Engineering | Context Engineering |
|------|-------------------|---------------------|
| **关注点** | 如何表达指令 | 提供什么背景信息 |
| **解决问题** | AI"怎么回答" | AI"基于什么回答" |
| **技术栈** | 文本工程、模板设计 | 数据架构、知识图谱、RAG |
| **复杂度** | 低到中等 | **高** |
| **投入占比** | **20%** | **80%** |

### Context的五层金字塔
<object data="/assets/images/2025-04-09-context-eng-01-layers.svg" type="image/svg+xml" width="100%"></object>
> 💡 **Key Insight**
> 
> **如何整合分散信息为AI可用的Context？**

### 挑战2：信息的动态性

上下文在不断变化：
- 价格实时变动
- 库存实时变化
- 用户状态更新
- 业务规则调整

### 挑战3：信息的权限性

不同用户看到的信息不同：
- 普通用户 vs VIP用户
- 客服人员 vs 管理人员
- 内部系统 vs 外部系统

### 挑战4：信息的过载性

Context太多，超出LLM窗口：
- 10万条FAQ
- 1000万条记录
- 1000轮历史对话

> 💡 **Key Insight**
> 
> **如何在有限窗口中选择最相关的Context？**

---

## Context Engineering的技术架构

### 🏗️ 五层技术架构

<object data="/assets/images/2025-04-09-context-eng-02-delivery.svg" type="image/svg+xml" width="100%"></object>
### Layer 1-2: 数据整合

**数据源类型：**
- 结构化数据（数据库）
- 非结构化文档（Markdown、PDF）
- 知识图谱（实体关系）
- 实时系统（库存、物流）

### Layer 3-4: 索引与检索

**核心技术：**
- **向量数据库** → 语义搜索
- **图数据库** → 关系查询
- **缓存层** → 热点数据加速
- **多策略检索** → 语义+关键词+图遍历
<object data="/assets/images/2025-04-09-context-eng-02-delivery.svg" type="image/svg+xml" width="100%"></object>
## Context Engineering vs Prompt Engineering：实战对比

### 场景：AI客服系统

**只使用Prompt Engineering：**
你是一位专业的客服代表。
用户问题：{user_question}
请根据以下政策回答问题：
- 退货政策：7天内可退
- 保修政策：1年质保
## 用户信息
{context.user_info}

## 用户当前订单
{context.current_order}

## 相关政策
{context.relevant_policies}

## 实时信息
{context.realtime_status}

用户问题：{user_question}
    用户使用AI
        ↓
    产生交互数据
        ↓
    优化Context理解
        ↓
    AI表现更好
        ↓
    更多用户使用
        ↓
    （循环）