---
layout: post
title: "\"为什么Context Engineering比Prompt Engineering更重要\""
date: 2025-04-09T02:00:00+08:00
tags: [Context Engineering, Prompt Engineering, AI工程, 软件架构]
description: "Context Engineering解决的是AI'基于什么回答'的问题——系统化地构建、管理、供给上下文信息，才是企业AI项目的真正瓶颈。"
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

它不知道用户是谁、订单状态如何、企业特殊规则、实时库存信息...

> 💡 **Key Insight**
>
> 不是Prompt写得不好，是**AI不知道上下文**。这是Context Engineering要解决的核心问题。

## Context Engineering的定义

Context Engineering不是另一个时髦的技术名词，而是AI工程化落地的真正抓手。它的核心问题很简单：AI回答的质量不取决于它有多聪明，而取决于它"知道什么"。

### 核心定义

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
<object data="/assets/images/2025-04-09-context-engineering-01-layers.svg" type="image/svg+xml" width="100%" aria-label="Context Engineering 五层金字塔" role="img"></object>
> 💡 **Key Insight**
> 
> **如何整合分散信息为AI可用的Context？**

### 信息的动态性

上下文在不断变化：
- 价格实时变动
- 库存实时变化
- 用户状态更新
- 业务规则调整

> 💡 **Key Insight**
>
> 上下文在不断变化：静态的Prompt无法应对动态的Context，数据管道必须支持实时更新。

### 信息的权限性

不同用户看到的信息不同：
- 普通用户 vs VIP用户
- 客服人员 vs 管理人员
- 内部系统 vs 外部系统

> 💡 **Key Insight**
>
> 不同用户看到的信息不同：Context Engineering必须解决权限问题，确保每个用户只看到自己有权限看到的上下文。

### 信息的过载性

Context太多，超出LLM窗口：
- 10万条FAQ
- 1000万条记录
- 1000轮历史对话

> 💡 **Key Insight**
>
> **如何在有限窗口中选择最相关的Context？**

> 💡 **Key Insight**
>
> Context太多，超出LLM窗口：必须通过向量检索、缓存层和多策略搜索，在有限窗口内放入最相关的上下文片段。

---

## Context Engineering的技术架构

## 五层技术架构

<object data="/assets/images/2025-04-09-context-engineering-02-dataflow.svg" type="image/svg+xml" width="100%" aria-label="Context Engineering 数据流" role="img"></object>
### Layer 1-2: 数据整合

数据整合是整个Context Engineering管道的基础。结构化数据来自关系型数据库，存储用户信息、订单记录、业务规则等高度组织化的内容。这部分数据通常通过API或直接数据库连接获取，格式规范，提取相对简单。

非结构化文档是另一大来源，包括产品手册、内部知识库、FAQ文档、政策文件等。这类内容无法直接入库，需要通过Embedding模型转换为向量，存入向量数据库供语义检索使用。Markdown、PDF、HTML等格式各有不同的解析方案。

知识图谱以实体-关系的形式组织信息，能够表达"用户A购买了商品B，商品B属于类别C"这类关联链路。知识图谱的优势在于支持多跳推理，当用户问题涉及复杂因果关系时，图遍历能发现传统关键词或向量检索无法触及的间接关联。

实时系统则负责提供最新状态：库存数量、价格变动、物流进度、用户最新操作。这些数据对AI客服场景尤为关键——用户问"我的订单到哪了"，AI必须能实时查询物流API而非给出过时的固定答案。实时系统通常通过事件流（Kafka/RabbitMQ）或直接API轮询接入Context管道。

> 💡 **Key Insight**
>
> 数据整合的关键不是把所有数据塞进去，而是为每种数据源设计合适的接入方式：结构化数据用API拉取，非结构化数据用Embedding向量化，知识图谱用图数据库存储多跳关系，实时数据用事件流保持更新。

### Layer 3-4: 索引与检索

索引与检索是Context Engineering管道的技术核心。当数据整合完成后，AI需要在毫秒级时间内从海量数据中召回最相关的上下文片段。

向量数据库是语义搜索的引擎。结构化数据和非结构化文档通过Embedding模型转换为高维向量，用户问题同样被嵌入向量空间，通过余弦相似度或点积运算找到语义最接近的内容。主流方案包括Pinecone、Milvus、Weaviate等，向量维度通常在768-1536之间，召回时取Top-K结果送入重排序模型。

图数据库解决关系型查询问题。当用户问题涉及"用户的订单对应的商品属于哪个供应商，这个供应商的退货政策是什么"这类多跳推理时，向量检索只能找到语义接近的片段，却无法表达实体间的链路关系。图数据库（如Neo4j、Nebula Graph）以节点和边存储实体关系，支持Cypher或GQL查询，让AI能够沿着关系路径逐步推导。

缓存层是性能优化的关键。用户的问询存在明显的热点效应：爆款商品的退货政策咨询量远高于长尾商品。将高频问题的检索结果缓存（如Redis），可以避免每次都执行完整的向量检索，延迟从百毫秒级降到十毫秒以内。缓存失效策略需要与数据更新频率联动，避免返回过期上下文。

多策略检索是生产环境的标配方案。单一检索策略总有盲区：纯向量检索对精确关键词匹配不友好（如产品型号、订单编号），纯关键词检索无法理解语义相近但表述不同的问题。最佳实践是将语义搜索、关键词搜索（BM25/TF-IDF）、图遍历三种策略的结果合并，经重排序模型（Cross-Encoder或RRF）打分后，取Top结果注入Context Window。这种混合检索策略能在召回率和精确率之间取得平衡。

> 💡 **Key Insight**
>
> 索引与检索的本质是解决"在海量数据中找到最相关的那个片段"——向量数据库负责语义相近，图数据库负责关系链路，缓存层负责性能，多策略检索负责覆盖各类查询模式。
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
    数据飞轮持续运转

> 💡 **Key Insight**
>
> Context Engineering不是一次性工程，而是持续运转的数据飞轮：用户越多，数据越丰富，Context越精准，AI表现越好，形成正向循环。

## 结尾

Context Engineering和Prompt Engineering不是对立关系，而是分工不同。Prompt Engineering解决"怎么说"，Context Engineering解决"AI基于什么说"。当企业发现AI表现不佳时，第一反应往往是聘请更资深的Prompt工程师——但大多数情况下，问题出在Context端：AI根本不知道该知道的东西。

真正的AI工程瓶颈，在于如何系统化地构建、管理、供给上下文信息。这需要数据架构师、知识工程师、检索系统专家，而不是更多的Prompt模板设计师。

投入80%的精力在Context Engineering上，才是企业AI项目的正确资源配置。