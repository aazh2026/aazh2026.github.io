---
layout: post
title: "\"4个文件搞定详细设计：最小上下文集合实践\""
date: 2026-03-11T08:30:00+08:00
tags: [AI-Native, SDLC, 软件工程, 详细设计, 实践]
description: "AI-Native详细设计只需4个核心文件，删除Sequence Diagram等传统artifacts，追求信息密度最大化。"
author: "@postcodeeng"
series: AI-Native SDLC 实践
---

> **TL;DR**
>
> 本文核心观点：
> 1. **传统 artifacts 全部 AI 化是陷阱** — 把传统软件工程文档全部"AI 化"，结果必然是维护成本极高、AI 并不真正使用，很快变成"AI 版传统文档地狱"。
> 2. **最小设计集合只需 4 个 artifacts** — `intent.md`（目标）、`domain.md`（领域模型）、`api.yaml`（接口契约）、`constraints.md`（约束），足以驱动代码生成、测试生成和 PR review。
> 3. **信息密度 > 文档数量** — 4 个文件、200 行结构化定义，比 20 页自然语言设计文档更有价值。机器可读性是 AI-Native 设计的第一原则。
> 4. **简单是终极的复杂** — 删除 Sequence Diagram、Behavior Spec、Architecture Doc，只保留 AI 必须依赖的最小上下文集合。

# 4个文件搞定详细设计：最小上下文集合实践

很多人在设计 AI-Native SDLC artifacts 时犯一个典型错误：**把传统软件工程的所有设计文档"AI化"**。

结果是：
- Artifacts 太多，维护成本极高
- AI 也不会真正使用
- 很快变成"AI 版传统文档地狱"

真正有效的做法是：**只保留 AI 必须依赖的最小设计集合（Minimal Context Set）**。

> 💡 **Key Insight**
>
> 最小设计集合（Minimal Context Set）的本质是把 AI 的注意力当作稀缺资源——只提供 AI 必须依赖的信息，多余的文档只会稀释关键信号。

## 核心结论

如果目标是：
- AI 可以稳定写代码
- 人类可以 review
- 工程成本最低

那么**最小设计集合只有 4 个 artifacts**：

这四个已经足够驱动：代码生成、测试生成、PR review。

<object data="/assets/images/2026-03-11-minimal-design-set-01-four-files.svg" type="image/svg+xml" width="100%" aria-label="核心结论（插图）" role="img"></object>

## 为什么是这四个？

> 💡 **Key Insight**
>
> 这四个 artifacts 足够驱动：代码生成、测试生成、PR review。它们覆盖了 AI 软件工程最核心的上下文需求。

### 1. Intent（必须）

**文件：** `intent.md`

**作用：** 让 AI 知道**为什么要**做这个功能。

**如果没有 Intent：**
- AI 会过度实现
- 功能方向错误
- 设计不符合产品目标

**Intent 是 AI 软件工程的北极星。**

> 💡 **Key Insight**
>
> Intent 是 AI 软件工程的北极星。没有 Intent，AI 只是在写代码，不是在实现产品目标——方向错误是 AI 软件工程最隐蔽也最昂贵的风险。

### 2. Domain Model（必须）

**文件：** `domain.md`

**作用：** 定义业务对象，划定边界。

**如果没有 Domain Model：**
- AI 会"发明"实体
- 随意添加字段
- 创造不存在的关系

### 3. API Contract（强烈建议）

**文件：** `api.yaml`

**作用：** 结构化接口定义。

AI 会自动生成：Controller、Client、测试用例。

**如果没有 API Contract：**
- API 结构不一致
- Request/Response 设计混乱
- 前后端对接成本高

### 4. Constraints（必须）

**文件：** `constraints.md`

**作用：** 明确 AI 必须遵守的边界。

**如果没有 Constraints：**
- AI 写出简单但不可用的代码
- 不考虑安全
- 不考虑性能
- 不考虑并发

## 哪些传统 artifacts 可以删除？

> 💡 **Key Insight**
>
> 很多传统设计 artifact 其实完全可以删除。AI 更容易理解具体例子和结构化定义，而非抽象描述和图形。

### 1. Sequence Diagram（可以删）

**传统：** `sequence-diagram.puml`

**AI 时代的问题：**
- AI 解析图形能力弱
- 维护成本高
- 容易过期

**替代方案：** 用文字场景描述

### 2. Behavior Spec（大部分可以删）

**传统：** `behavior.md`

**现实：** 很多行为其实**测试用例**就可以表达。

AI 更容易理解具体例子，而非抽象描述。

### 3. Architecture Doc（大部分可删）

**传统：** `architecture.md` (10+ pages)

**现实：** 如果系统已有 Repo 结构、框架、依赖，AI 通常已经能理解。

**只需要一个简单的：**

### 4. Evaluation Spec（可删）

**传统：** `evaluation.md`

**现实：** 只要有 API Contract 和 Domain Model，AI 可以直接生成测试。

不需要单独写评估规格。

## AI 喜欢什么样的 artifacts？

| 格式 | 示例 | 原因 |
|------|------|------|
| **Markdown** | `intent.md` | 语义清晰 |
| **YAML** | `api.yaml` | 结构化 |
| **SQL** | `schema.sql` | 明确无歧义 |

**Markdown**（如 `intent.md`）之所以是 AI 最喜欢的格式之一，是因为它的语义结构清晰。标题、列表、代码块、引用——这些格式标记本身就是一种上下文提示，帮助 AI 理解信息层级和逻辑关系。`# 标题` 表示主题，`## 小节` 表示子主题，`- 列表项` 表示并列表述。这种结构不需要额外的解析器，AI 直接从标记本身读取组织逻辑。

**YAML**（如 `api.yaml`）的优势在于它的类型安全性和无歧义性。YAML 的标量、映射、序列结构与编程语言的数据结构天然对应。AI 看到 `status: integer` 就知道这是整型，看到 `items: []` 就知道这是数组。类型明确、嵌套关系清晰，AI 生成的代码自然与定义保持一致，不容易出现"理解了意思但写错了类型"的问题。

**SQL**（如 `schema.sql`）的优势与 YAML 类似：它是**机器可读的领域定义语言**。表结构、字段类型、约束条件、索引——这些信息以标准化语法表达，AI 可以直接从中推导出数据访问层代码。SQL 的关键字（`PRIMARY KEY`、`NOT NULL`、`FOREIGN KEY`）本身就是业务规则的精确表达。

AI **最不喜欢**的格式是 PDF、PPT 和图片/Diagram，原因是这些格式没有可解析的 AST（抽象语法树）。PDF 里的文字是一个像素矩阵，AI 需要 OCR + 语义理解才能提取信息，而且提取后丢失了原始结构。PPT 的问题类似：文字分布在不同的 slide 和文本框里，逻辑关系需要人工推断。Sequence Diagram 这类图形更糟糕——节点和边的空间位置隐含语义，但 AI 很难可靠地还原这些关系。相比之下，Markdown、YAML、SQL 都是**纯文本、结构化、可直接解析**的格式，AI 处理它们的准确率远高于图像类格式。

## 三个 AI-Native 设计原则

> 💡 **Key Insight**
>
> 未来设计遵循三个原则：Context Density（上下文密度）、Machine Readability（机器可读性）、Drift Resistance（抗漂移）。简单是终极的复杂。

### 1. Context Density（上下文密度）

不是文档越多越好，而是**信息密度越高越好**。一份 20 页的设计文档，真正对 AI 有价值的信息可能只有 3 段；4 个结构化文件、200 行精确定义，反而能让 AI 直接执行。这背后的原因很简单：AI 处理信息的注意力是有限的。当文档长度增加但有效信息不增加时，AI 的注意力会被稀释，关键约束和业务规则淹没在冗余描述里。Context Density 的本质是把 AI 的注意力当作稀缺资源，只把必须知道的信息塞进去。正例：4 个文件、200 行、每个字符都是必要信息。❌ 反例：20 页文档，核心规则藏在第 15 页的第三段里。

### 2. Machine Readability（机器可读性）

设计必须满足三个条件：**结构清晰**（格式一致、层次分明）、**规则明确**（条件判断非模糊语言）、**无歧义**（同一表述不会产生两种理解）。结构化格式（YAML、SQL、JSON Schema）天然满足这三个条件，因为它们的语法本身就是规格说明。相比之下，自然语言的描述充满歧义——"通常情况下"、"一般而言"、"优先考虑"——这些词在人类交流中可接受，对 AI 来说却是精确执行的敌人。Machine Readability 还意味着设计产出的格式可以直接作为工具输入：YAML 被 API 工具直接消费，SQL Schema 被 ORM 直接使用，Markdown 被 LLM 直接读取。设计如果能做到"所见即所得"，AI 就能直接执行而无需额外转换。

### 3. Drift Resistance（抗漂移）

设计必须**不会很快过期**。API Contract（接口定义）是 Drift Resistance 最好的例子：一旦接口稳定，业务逻辑围绕它构建，接口本身不需要频繁改动。而 Sequence Diagram 是 Drift Resistance 最差的例子：随着代码演进，节点和边的实际关系早已改变，图形却很少同步更新，最终 Diagram 变成误导而非指导。Drift Resistance 高的设计还有一个特征：**它的维护动机来自业务变化，而不是实现变化**。业务需求变了，Intent 和 Domain Model 需要更新；但只要接口契约不变，API Contract 就不需要动。这种分离使得维护成本大幅降低。

## 更激进的极简：三文件实践

很多 AI 团队甚至只保留 **3 个文件**：

然后让 AI 生成：
- Schema
- Tests
- Implementation

## 实践建议

如果你想实践 AI-Native SDLC，从这个最小集合开始：

**不要超过 4 个 artifacts。**

否则很快就会变成：AI 版传统文档地狱。

## 终极形态：单文件系统

未来 AI-Native SDLC 可能变成单文件：

AI 直接生成整个系统。

> 💡 **Key Insight**
>
> 当 AI 能直接从 Intent 生成整个系统时，设计文档的形态也将随之消解——最小设计集合的终极形态是"无设计"，前提是 AI 的上下文窗口和推理能力足够强大。

## 总结

AI-Native 详细设计的关键是**极简**：

1. **只保留必要** —— 4 个 artifacts 足够
2. **删除可选** —— Sequence diagram、Architecture doc 可以去掉
3. **追求密度** —— 信息密度 > 文档数量
4. **机器优先** —— 结构 > 描述，代码 > 图形

记住：**简单是终极的复杂**。

---

*下一篇：《增量需求不再头疼：Delta Specification 工作流》*