---
layout: post
title: "\"Agent 的记忆系统设计：从短期到长期\""
date: 2025-07-07T10:00:00+08:00
tags: [AI, Agent, Memory-System, Vector-DB, Knowledge-Graph]
description: "Agent记忆系统分为工作/短期/长期三层，Vector DB与Knowledge Graph共同支撑智能检索。"
author: "@postcodeeng"
series: "Agent-OS-Series"
series_title: "从 SaaS 到 Agent OS"

redirect_from:
  - /agent-memory-system-design/
---

*"Agent 的智能不在于模型有多大，而在于它记得多少、记得多准、记得多久。"*

---

> **TL;DR**
>
> 1. **核心概念** — Agent 的智能不在于模型有多大，而在于它记得多少、记得多准、记得多久。记忆系统分为三个层次：Working Memory（秒-分钟级）、Short-term Memory（小时-天级）、Long-term Memory（永久）。
> 2. **关键机制** — 技术选型上，Vector DB 用于语义检索，Graph DB 用于关系推理，传统数据库用于结构化数据。
> 3. **实际效果** — 核心挑战是遗忘与保留的平衡，在信息生命周期中实现有策略的压缩与保留。
> 4. **延伸洞察** — 大模型提供了"智商"，记忆系统提供了"情商"和"经验"。

---

- [为什么记忆是 Agent 的核心能力](#为什么记忆是-agent-的核心能力)
- [记忆的三个层次](#记忆的三个层次)
- [Working Memory：当下的上下文](#working-memory当下的上下文)
- [Short-term Memory：近期的经验](#short-term-memory近期的经验)
- [Long-term Memory：持久的知识](#long-term-memory持久的知识)
- [Knowledge Graph：关系的网络](#knowledge-graph关系的网络)
- [记忆系统的工程实现](#记忆系统的工程实现)
- [写在最后](#写在最后)

---

## 为什么记忆是 Agent 的核心能力

### 没有记忆的 Agent 是"傻子"

想象一下和一个"金鱼型"Agent 对话：

**这样的 Agent 能用吗？显然不能。**

### 记忆决定 Agent 的上限

| 能力维度 | 无记忆 Agent | 有记忆 Agent |
|----------|--------------|--------------|
| **个性化** | 每次对话从零开始 | 记住用户偏好、历史交互 |
| **连贯性** | 无法理解上下文 | 多轮对话保持连贯 |
| **学习效率** | 每次犯同样的错误 | 从错误中学习改进 |
| **知识积累** | 静态知识库 | 持续学习、动态更新 |
| **业务深度** | 通用回答 | 理解特定业务场景 |

💡 **Key Insight**

> 大模型提供了"智商"，记忆系统提供了"情商"和"经验"。

---

## 记忆的三个层次

### 人类记忆的启示

人类记忆分为：
- **感觉记忆**：毫秒级，瞬时感知
- **短期记忆**：秒-分钟级，当前关注
- **长期记忆**：永久存储，可提取的知识

Agent 的记忆系统设计可以借鉴这个分层：

> 💡 **Key Insight**
>
> Working/Short-term/Long-term 的分层不是人为划分，而是信息生命周期必经的三个阶段。

<object data="/assets/images/2025-07-07-agent-memory-01-tiers.svg" type="image/svg+xml" width="100%"></object>

---

## Working Memory：当下的上下文

### 什么是 Working Memory？

Working Memory 是 Agent 的"脑海"，存储当前正在处理的信息：

- 当前对话的最近几轮
- 正在执行的任务的状态
- 临时计算结果
- 当前关注的实体（客户、订单等）

### 实现方案

上下文窗口是最简单的实现方式：维护最近 5-10 轮对话，让模型始终"看到"最近的交互历史。这种 FIFO（先进先出）的策略在对话短于容量时效果很好，但当对话逐渐增长时，窗口前的上下文会像指缝间的沙子一样悄然流失。越早出现的关键信息越容易被"挤出"有效范围——比如用户在三轮对话前提到的某个偏好，在第十轮时可能已经被遗忘殆尽。

解决信息丢失有两条主要路径：一是**重要性加权**（Importance Weighting）——给每个对话轮次打重要性分数，优先保留高权重内容；二是**摘要触发**（Summarization）——在窗口即将溢出前，将早期对话压缩为摘要块，保留关键实体与结论。前者实现更简单，后者信息保留更完整，两者在实际系统中常组合使用。

滑动窗口与摘要的思路是：每积累 5-10 轮对话后，调用 LLM 将早期内容压缩为一段摘要。这段摘要不是完整记录的替代品，而是"记忆的压缩饼干"——牺牲细节换空间，保留核心要点供后续调用。

触发时机是设计的关键：太频繁浪费 LLM 调用成本，太稀疏则早期信息已经丢失。常见做法是**固定轮次触发**（每 N 轮）或**容量触 发**（窗口利用率超过阈值）。摘要的内容需要包含：关键实体的当前状态、已完成的任务结论、仍悬而未决的问题、以及需要跨窗口传递的背景信息。实体追踪是滑动窗口的"保险"：用轻量级字典记录关键实体的当前状态（偏好、任务进度、悬而未决的决策），在每次窗口刷新时作为上下文注入，确保重要实体不因摘要压缩而"失忆"。

### Working Memory 的关键设计

| 设计决策 | 建议 | 理由 |
|----------|------|------|
| **容量** | 5-10 轮对话 | 平衡上下文理解和成本 |
| **保留策略** | FIFO + 重要性加权 | 简单且有效 |
| **摘要触发** | 每 5-10 轮 | 避免频繁调用 LLM |
| **实体追踪** | 必须 | 保持对话焦点 |

---

## Short-term Memory：近期的经验

### 什么是 Short-term Memory？

Short-term Memory 存储最近几小时到几天的经验：

- 今天和用户的对话历史
- 最近执行的任务及其结果
- 最近学习的新知识
- 临时的业务状态

> 💡 **Key Insight**
>
> Short-term Memory 的核心价值不是"存储更多"，而是"在遗忘之前完成检索"——它的设计目标是在信息衰减到阈值之前，让 Agent 有机会用到它。

### 技术实现：Vector Database

**为什么用 Vector DB？**

因为需要**语义检索**——不是精确匹配关键词，而是理解含义后检索相关内容。

**示例：**

用户问："上周那个大客户怎么样了？"

- 关键词检索：找不到包含"大客户"的记录
- 向量检索：找到关于"Acme Corp"、"合同谈判"的记忆，即使没出现"大客户"这个词

**实现方案：**

### 向量检索的核心机制

以 Pinecone 或 Milvus 为例，实现流程分为三步：**嵌入（Embed）** → **存储（Store）** → **检索（Retrieve）**。每次对话结束时，将本次交互的摘要文本通过 embedding 模型转换为向量，存入 Vector DB，并附带上时间戳、对话 ID 等元数据。检索时，将当前 query 同样 embedding，在向量空间中找到最相似的 K 条记忆，返回给 Agent 作为上下文补充。

时序衰减是遗忘的核心策略：给每条记忆附加一个随时间指数衰减的权重分数（recency score），检索时结合余弦相似度和 recency score 做加权排序。最近的记忆权重高，随着时间推移逐渐降低，到达阈值后要么重新摘要、要么直接删除。对于特别重要的记忆（如用户的明确偏好），可以打上 pinned 标签永久保留，跳过遗忘机制。

### 记忆的遗忘机制

遗忘不是简单的删除，而是一个有策略的信息压缩过程。**基于时间的衰减**（Time-based Decay）和**基于重要性的提升**（Importance Boost）是两条主要路径：前者让记忆随时间自然淡化，后者让关键信息在衰减曲线上获得额外的"重力"，推迟被遗忘的时间点。在实际系统中，这两者通常结合使用——普通交互按时间衰减，Agent 显式标记的重要信息保留更久。

### 技术选型对比

| Vector DB | 优点 | 缺点 | 适用场景 |
|-----------|------|------|----------|
| **Pinecone** | 全托管、易用、性能好 | 贵、vendor lock-in | 快速启动、不想运维 |
| **Milvus/Zilliz** | 开源、高性能、功能丰富 | 需要运维 | 大规模、自研能力强的团队 |
| **PGVector** | PostgreSQL 扩展、成本低 | 性能一般 | 已有 PG 基础设施、小规模 |
| **Chroma** | 轻量、易嵌入 | 不适合生产 | 原型开发、本地测试 |
| **Weaviate** | 支持 GraphQL、多模态 | 学习曲线 | 需要复杂查询、多模态 |

---

## Long-term Memory：持久的知识

### 什么是 Long-term Memory？

Long-term Memory 存储 Agent 的"毕生所学"：

- **用户画像**：每个用户的偏好、习惯、历史
- **业务知识**：行业规则、最佳实践、成功案例
- **世界知识**：组织信息、流程规范、人际关系
- **学习成果**：从交互中总结的模式和经验

> 💡 **Key Insight**
>
> Long-term Memory 存储的是"结构性知识"而非"对话记录"——它需要 Agent 主动提炼和写入，而不是被动积累。

### 实现方案

### 用户画像

用户画像是 Long-term Memory 中最"个人化"的部分，存储与单个用户相关的所有结构化信息：人口统计学属性（年龄、职业、所在时区）、沟通风格（正式/随意、偏好长回复还是短回复）、已知偏好（偏好的报告格式、常用的专业术语）、历史交互记录（曾经问过什么、得到过什么答案）。这些数据通常存在 PostgreSQL 的 JSON 列或独立的 user_profile 表中，每次新对话开始时注入到 system prompt 或作为 RAG 检索的初始上下文。画像的更新频率取决于业务场景——主动学习型系统每轮对话后都更新；被动更新型则只在用户明确表达偏好时才写入。

### 业务知识库

业务知识库是 Agent 的"行业专家记忆"，存放产品手册、 Support SOP、常见问题解答、最佳实践案例库等相对稳定的结构化文档。与用户画像不同，业务知识库更新频率较低，通常由知识管理员（Knowledge Owner）维护，通过版本控制管理变更。技术实现上，业务知识库同样使用 Vector DB 存储，但通常按文档章节或 FAQ 条目切分，每条记录附带 metadata（产品线、版本号、适用角色），检索时根据当前对话上下文过滤 metadata，确保只返回与当前任务最相关的业务知识。RAG（检索增强生成）是将业务知识注入推理过程的标准做法：检索 → 拼入 prompt → LLM 生成答案。

### 组织知识

组织知识存放企业内部的流程规范、汇报关系、项目历史、团队约定等"软信息"。与业务知识的"静态事实"性质不同，组织知识具有鲜明的"过程性"和"关系性"——它描述的是谁做什么、如何协作、信息如何流动。典型存储形式包括：组织架构图（通常用 Graph DB 建模汇报关系）、工作流定义（用 BPMN 或简单状态机表示）、项目历史（用 wiki 或文档库按项目维度切分）。组织知识的注入发生在特定场景触发时——比如当对话涉及到"需要找谁审批"或"这个需求之前是怎么处理的"，系统从组织知识中检索相关信息，而不是每次对话都注入全部内容。

---

## Knowledge Graph：关系的网络

### 为什么需要 Knowledge Graph？

Vector DB 擅长语义相似性检索，但不擅长**关系推理**。

**示例问题：**

"谁是 @postcodeeng 的经理的经理？"

- Vector DB：无法理解"经理的经理"这种关系链
- Knowledge Graph：可以轻松遍历关系网络

> 💡 **Key Insight**
>
> Vector DB 和 Knowledge Graph 不是竞争关系——前者解决"这件事和哪些事语义相似"，后者解决"这件事和其他事物之间是什么关系"，两者共同构成完整的记忆检索层。

### 实现方案

推荐使用 Neo4j 作为 Knowledge Graph 的底层存储，它支持原生的属性图模型和 Cypher 查询语言，对关系遍历类查询（如"经理的经理"）性能远优于关系数据库。节点类型的设计应该根据业务实体来划分：**Person**（人）、**Document**（文档）、**System**（系统）、**Concept**（概念）；关系类型则描述实体间的语义连接：reports_to（汇报关系）、depends_on（依赖关系）、authored_by（创作关系）、part_of（归属关系）。

### 节点与关系的 Cypher 示例

以下是这个数据模型在 Neo4j 中的示例：

```cypher
// 创建节点
CREATE (p:Person {name: "@postcodeeng", title: "Engineer"})
CREATE (m:Person {name: "Manager", title: "Engineering Manager"})
CREATE (d:Document {name: "Q3 OKR", type: "OKR"})

// 创建关系
CREATE (p)-[:REPORTS_TO]->(m)
CREATE (m)-[:REPORTS_TO]->(d)
```

查询"@postcodeeng 的经理的经理"只需一条路径遍历：

```cypher
MATCH (p:Person {name: "@postcodeeng"})-[:REPORTS_TO*2]->(boss)
RETURN boss.name, boss.title
```

Cypher 的路径表达式 `[:REPORTS_TO*2]` 表示两层汇报关系，即"经理的经理"。这种查询在 SQL 中需要多次自连接才能实现，在 Graph DB 中则是一行原生表达。

### Knowledge Graph 的应用场景

| 场景 | KG 查询示例 |
|------|-------------|
| **权限查询** | "谁可以审批这个预算？" → 查找汇报链 |
| **影响分析** | "如果这个系统宕机，会影响哪些业务？" → 查找依赖关系 |
| **专家定位** | "谁是机器学习方面的专家？" → 查找技能关系 |
| **流程优化** | "这个流程的瓶颈在哪里？" → 分析流程图 |
| **客户分析** | "这个客户和哪些决策者有关系？" → 查找关系网络 |

---

## 记忆系统的工程实现

### 整体架构

<object data="/assets/images/2025-07-07-agent-memory-02-system.svg" type="image/svg+xml" width="100%"></object>

### 关键设计决策

### 记忆一致性

Working Memory、Short-term Memory、Long-term Memory 三个层次之间存在天然的一致性挑战：用户今天下午通过对话明确说"我换组了"，但 Long-term Memory 中的用户画像还是旧的；Short-term Memory 里记录了今天上午的任务结论，但 Short-term Memory 明天就会衰减，届时 Long-term Memory 里没有对应的存档。解决这个问题的核心思路是**事件驱动的写传播**（Event-driven Write-through）：每次重要交互发生后，以事件的形式同步到所有层次——更新 Working Memory 的同时，异步写入 Long-term Memory 的用户画像，而不是依赖定期的批量同步。

### 写传播与冲突解决

**写策略**上，常见的选择是 **Write-through**（同步写入所有层次，写入成功才返回）和 **Write-behind**（先写 Short-term Memory，异步批量写入 Long-term）。Write-through 一致性最高但延迟大；Write-behind 延迟低但短期窗口内可能读到旧数据。**冲突解决**上，当同一实体在不同层次被同时更新时，可以采用 Last-write-wins（以时间戳为准，简单但可能丢更新）或 Merge policy（基于字段级合并，比如用户画像中的偏好字段取并集，状态字段取最新）。对于金融、医疗等强一致性要求的场景，Merge policy 更合适。

### 多模态记忆

现代 Agent 的记忆来源不只有文本——用户可能上传截图、语音消息、PDF 文档，这些多模态内容需要被统一索引和检索。技术上通常采用 **CLIP**（OpenAI）或 **BLIP** 等多模态 embedding 模型，将图像、音频的视觉/听觉特征与文本映射到同一个向量空间，从而实现跨模态检索：用户用文字描述"上周那张架构图"，系统可以直接召回包含对应截图的记忆。

### 统一索引与跨模态检索

具体实现上，建议采用**统一索引 + 模态专属 pipeline**的架构：所有模态的向量索引共享同一个 Vector DB namespace，确保跨模态检索的体验一致；每种模态有独立的预处理 pipeline（图像 → OCR + 截图描述 → embedding，音频 → ASR 转写 + embedding），各自负责将原始内容转换为可检索的向量单元。召回时，将不同模态的检索结果按统一排序策略合并，给出最相关的记忆条目。Cross-modal retrieval 的典型场景是"用文字描述找图片、用图片找相关文字"，在技术支持场景（截屏 → 找相似问题）和销售场景（产品图片 → 找相关知识文档）中尤为实用。

### 隐私与安全

记忆系统涉及三类敏感数据，需要分级处理：**PII**（身份证号、医疗记录、财务信息）、**业务敏感数据**（客户名单、合同内容、内部决策）、**操作日志**（记忆访问记录、检索查询记录）。访问控制应在每层记忆上独立配置：Working Memory 仅当前会话可见，Short-term Memory 按用户 ID 隔离，Long-term Memory 中的用户画像只有经授权的 Agent 服务可读取。加密方面，建议所有持久化存储启用 at-rest 加密（Vector DB、Graph DB、PostgreSQL 均支持），传输层全程 TLS。

审计日志（Audit Log）是合规的重要组成：每次记忆的读写操作都应记录操作者（哪个 Agent/用户）、操作时间、操作内容（查询/写入/删除），日志本身也要防篡改。GDPR 等数据保护法规还要求"被遗忘权"（Right to be Forgotten）——用户删除账户时，所有层次记忆中的关联数据必须同步清除，这在多系统分散存储的场景下实现复杂度最高，需要在架构初期就将数据血缘（Data Lineage）纳入设计。

---

## 写在最后

**记忆系统是 Agent 的"大脑"，它决定了 Agent 能走多远。**

从简单的上下文窗口，到企业级的多层次记忆系统，这是一个逐步演进的过程：

1. **MVP 阶段**：Context Window + 简单的向量检索
2. **产品阶段**：添加 Short-term Memory + User Profiles
3. **企业阶段**：完整的 Long-term Memory + Knowledge Graph

**关键成功因素：**

- **数据质量**：垃圾进，垃圾出
- **检索精度**：召回率和准确率的平衡
- **隐私合规**：敏感数据的处理不能妥协
- **成本控制**：嵌入和存储的成本需要优化

**最后的话：**

> 一个 Agent 可以没有花哨的界面，可以没有复杂的工作流，但不能没有记忆。
> 
> 记忆让 Agent 从"工具"变成"伙伴"。

---

## 📚 延伸阅读

**本系列文章**

- [Agent OS：SaaS 之后的下一个软件形态](/agent-os-future-of-software/)
- [为什么你的 SaaS 产品需要 Agent 层？](/why-your-saas-needs-agent-layer/)
- [从 Human-driven 到 Agent-driven](/human-driven-to-agent-driven/)
- [Agent OS 的五层架构模型](/agent-os-five-layer-architecture/)
- [Multi-Agent 协作](/multi-agent-collaboration/)

**外部资源**

- [LangChain Memory](https://python.langchain.com/docs/modules/memory/)
- [Vector Databases Comparison](https://www.pinecone.io/learn/vector-database/)
- [Knowledge Graphs for AI](https://www.ontotext.com/knowledgehub/fundamentals/what-is-a-knowledge-graph/)

---

*Agent OS 系列 - 第 5 篇*
*由 @postcodeeng 整理发布*

*Published on 2026-04-07*
*阅读时间：约 18 分钟*

*下一篇预告：《Multi-Agent 协作》*
