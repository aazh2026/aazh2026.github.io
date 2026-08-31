---
layout: post
title: "从可追溯到可问责：Agentic 软件工程的责任结构"
date: 2026-08-31T12:10:00+08:00
tags: [Agent OS, 软件工程, AI安全, 供应链]
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
>
> 本文核心观点：
> 1. **Traceability ≠ Justifiability** — 两者回答不同的问题：Provenance 问"从哪来"，Traceability 问"怎么关联"，Justifiability 问"证据是否授权了这个过渡"
> 2. **47 个平台的测量结论** — 没有一个平台的默认记录发出内容寻址的行为元组身份（model version + instructions + tool definitions + runtime config）
> 3. **30 个仓库的 verifiability hole** — 15 个采用 attestation tooling 的仓库中有 7 个发布 source-only releases，声明的 binding 在表面上无法被检查
> 4. **Structural gap** — 问题根源不是没有接入框架，而是记录类别本身在默认状态下不存在

---

## 背景：一个 Promotion 事故

某团队的 CI/CD pipeline 在执行了一个 blocking behavioral gate 和完整 evaluation suite 之后，授权了一个 AI 系统的 promotion。事后检查发现：14 条 evidence record 中，identity 字段全部为空；唯一存活的 identifier 指向一个 runtime slot，在两个不同 release 中被验证为相同的值。

这个缺陷没有被 pipeline 自己的任何检查标记出来。它是被外部工具读取 pipeline 发布的 artifacts 时发现的，一周内修复完毕。

论文由此提出两个可测量的问题：

1. **交付平台的默认记录能够表达关于一个 promotion 的什么信息？**
2. **一个 pipeline 声明的 assurance，它的 published evidence 实际上实现了多少？**

## Traceability、Provenance、Justifiability：三个层次的分界

论文把追溯链条拆成三个层次：

| 层次 | 回答什么问题 | 现有框架 |
|------|-------------|---------|
| **Provenance** | 这东西从哪来？ | W3C PROV、OpenLineage |
| **Traceability** | 这些东西怎么关联？ | ticket keys、build numbers、consistent identifiers |
| **Justifiability** | 当时的证据是否授权了这个过渡？ | 没有框架能做到 |

ISO/IEC/IEEE 12207 对 traceability 的定义要求建立"两个逻辑实体之间的关系，尤其是有前后继关系的事物"；NIST SA-8(22) 说"可能追踪到代表其采取行动的主体"。论文照单全收这些定义，然后指出：没有任何工具能裁决这些定义所承诺的内容。

关键的区分是：Justifiability 是唯一能 say NO 的一环。in-toto 明确说不负责判断 supply chain layout 是否合理；PROV 声明"对 plan 的性质不作规定性要求"；GUAC 返回答案但从不拒绝；Proof-or-Stop 最接近，它定义了 promotion 作为 admissibility decision 可以返回 NO，但前提是框架已被 adoption。

## 测量一：47 个平台的文档调查

**方法**：两轮分类协议（第二轮 blind），188 个双评分单元，每一个 consulted page 都用内容哈希和时间戳固定。评分协议是三元标签：default（平台默认发出）、opt-in（需要配置才发出）、absent（文档中没有）。

**核心发现**：在 47 个平台中，**没有任何一个平台的默认记录发出内容寻址的行为元组身份**——第二轮 blind 评分在这个维度上是 0/47。行为元组 = (model version, instructions, tool definitions, retrieval configuration, runtime configuration, environment)。

另一个趋势：27 个 agent 平台中，有 16 个采用了 immutable nominal versioning 作为默认方案——版本整数背后是可变指针，这是 artifact supply chain 社区已经判定为不够的一层。

## 测量二：30 个仓库的深度仪器

第二个工具从 pipeline 自身发布的 artifacts（不借助 producer 配合）计算"realized assurance depth"，然后与 pipeline 配置声明的 depth 对比。

核心发现是 **verifiability hole**：15 个选出来专门使用 attestation tooling 的仓库中，有 7 个发布 source-only releases。这意味着它们声明的 binding 在它们声明的表面上根本无法被检查——声明和可验证的证据活在两个没有任何链接的公共表面上。

可检查的情况下，结论：7 个可测量的 adopters 中，有 5 个实现了端到端的 declared binding。两个 measured shortfall 都出在 identity binding 这一环。

## 四条件规范：什么是"可问责的 Promotion"

论文给出了 promotion 可被问责的四个充分条件：

1. **Artifact Continuity**：被评估的 exact artifact = 被部署的 exact artifact。验证方式：内容寻址比较 build package，不靠 build number 或 stage name。
2. **Behavioral Continuity**：被评估的完整行为元组 = 正在运行的元组。相同代码在不同 model version 下行为不同，artifact continuity 是必要条件但非充分条件。
3. **Evidence Continuity**：引用的证据对应那个行为元组，且由它生成而非前身。跨变更复用的 evaluation 会破坏这个条件。
4. **Authority Continuity**：实际授予的授权覆盖实际部署的内容，在正确范围内，由有权限的主体在正确时间点授予。

这四个条件构成了 justifiability 的规格说明——一个 promotion-time check over already-published records，当任一 required relationship 缺失时拒绝过渡。

## Survey 的 expiry clock

论文明确说明了什么能推翻每个发现：

- **负面 cell**：每个 bounded-absent grade 命名了 consulted pages，如果有人能举出一个描述该能力的页面，则推翻
- **Headline 结论**：找到一个默认发出内容寻址行为元组身份的平台，即可推翻；该结论在标准化路径 shipping 时失效
- **Depth instrument**：如果某个 rung 判定被证明与仓库实际记录不符，则推翻操作化

---

## 结尾

这篇论文的核心贡献是一套测量工具，而非新框架。Survey 建立了 ceiling（没有任何平台的默认记录能表达 behavioral rung 所需的身份）；depth study 建立了 floor（即使在 artifact 层级，declared versus realized 的差距也可测量）。两者共同指向一个结构性发现：行业在 traceability 层面的记录系统性地不足以支持 justifiability，而 justifiability 是唯一能在 promotion 时拒绝不合格部署的那一环。

---

*Published on 2026-08-31*

**参考链接**

- Paper: [From Traceability to Justifiability: Accountability Structures in Agentic Software Engineering](https://arxiv.org/abs/2608.23610) — arXiv:2608.23610
- Replication package: [https://github.com/mentu-ai/from-traceability-to-justifiability](https://github.com/mentu-ai/from-traceability-to-justifiability)
