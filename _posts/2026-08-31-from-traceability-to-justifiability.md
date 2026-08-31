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
> 1. **Traceability ≠ Justifiability** — 当前 Agent 系统的记录只有"痕迹"，没有"理由"，无法在 promotion 时真正拒绝一个不合格的部署
> 2. **47 个平台的测量结论** — 没有一个平台的默认记录发出内容寻址的行为元组身份（model version + instructions + tool definitions + runtime config）
> 3. **structural gap，不是 adoption gap** — 问题的根源不是平台没接入某个框架，而是记录类别本身就不存在
> 4. **Justifiability 是追溯链上唯一能 say NO 的一环** — provenance 问"从哪来"，traceability 问"怎么关联"，justifiability 问"证据是否授权了这个过渡"

---

## 一个真实发生的 Promotion 事故

某团队的 CI/CD pipeline 在执行了一个 blocking behavioral gate 和完整 evaluation suite 之后，授权了一个 AI 系统的 promotion。但事后检查发现：那 14 条 evidence record 里，identity 字段全部为空；唯一存活的那个 identifier 指向一个 runtime slot，在两个不同 release 中被验证为相同的值。

这个缺陷没有被 pipeline 自己的任何检查标记出来。它是被外部工具读取 pipeline 发布的 artifacts 时才发现的——一周内修复完毕。

这个案例暴露的不是某个团队的疏忽，而是两个可测量的问题：

1. **交付平台的默认记录能够表达关于一个 promotion 的什么信息？**
2. **一个 pipeline 声明的 assurance，它的 published evidence 实际上实现了多少？**

这是 paper *From Traceability to Justifiability: Accountability Structures in Agentic Software Engineering*（arXiv:2608.23610）要回答的核心问题。

## Traceability、Provenance、Justifiability：三个层次的分界

论文把追溯链条拆成三个层次，每个层次能回答不同的问题：

| 层次 | 回答什么问题 | 现有框架 |
|------|-------------|---------|
| **Provenance** | 这东西从哪来？ | W3C PROV、OpenLineage |
| **Traceability** | 这些东西怎么关联？ | ticket keys、build numbers、consistent identifiers |
| **Justifiability** | 当时的证据是否授权了这个过渡？ | **没有框架能做到** |

ISO/IEC/IEEE 12207 对 traceability 的定义其实已经相当强——要求建立"两个逻辑实体之间的关系，尤其是有前后继关系的事物"；NIST 的 SA-8(22) 更是明确说"可能追踪到代表其采取行动的主体"。论文把这些定义"照单全收"，然后指出：没有任何工具能裁决这些定义所承诺的内容。

关键的区分是 **justifiability 是唯一能 say NO 的一环**。in-toto 明确说它不负责判断 supply chain layout 是否合理；PROV 声明"对 plan 的性质不作规定性要求"；GUAC 摄入软件元数据后返回答案，但从不拒绝任何东西。Proof-or-Stop 是这个方向上最接近的先驱——它定义了 promotion 作为 admissibility decision 可以返回 NO，但前提是框架已经 adoption。

论文的两个测量工具把这个 gap 拆开来看。

## 测量一：47 个平台的文档调查

**方法**：两轮分类协议（第二轮 blind），188 个双评分单元，每一个 consulted page 都用内容哈希和时间戳固定。

评分协议是三元标签：default（平台默认发出这类记录）、opt-in（需要配置才发出）、absent（文档中没有）。

**核心发现**：在 47 个平台中，**没有任何一个平台的默认记录发出内容寻址（content-addressed）的行为元组身份**——第二轮 blind 评分在这个维度上的结果是 0/47。行为元组 = (model version, instructions, tool definitions, retrieval configuration, runtime configuration, environment)。

更值得关注的是另一个趋势：27 个 agent 平台中，有 16 个采用了 immutable nominal versioning 作为默认方案——版本整数背后是可变指针，这正是 artifact supply chain 社区已经判定为不够的那一层。

> 💡 **Key Insight**
>
> 行业正在用" immutable nominal versioning"（不可变的名义版本号）来解决"内容寻址身份"的问题，但前者根本无法满足后者的安全需求。这不是技术不够成熟——这是对问题本身的误解。

## 测量二：30 个仓库的深度仪器

第二个工具从 pipeline 自身发布的 artifacts（不借助任何producer配合）计算"realized assurance depth"，然后与 pipeline 配置声明的 depth 对比。

结果最有意思的部分是一个 **verifiability hole**：15 个选出来专门使用 attestation tooling 的仓库中，有 7 个发布的是 source-only releases。这意味着它们声明的 binding（绑定关系）在它们声明的表面上根本无法被检查——声明和可验证的证据活在两个没有任何链接的公共表面上。

可检查的情况下，结论比较正面：7 个可测量的 adopters 中，有 5 个实现了端到端的 declared binding（占这个 stratum 的 1/3）。两个 measured shortfall 都出在 identity binding 这一环。

## 四条件规范：什么是"可问责的 Promotion"

论文给出了 promotion 可被问责的四个充分条件（来自已有先验框架，但有明确定义边界）：

1. **Artifact Continuity**：被评估的 exact artifact = 被部署的 exact artifact。验证方式：内容寻址比较 build package，不靠 build number 或 stage name。
2. **Behavioral Continuity**：被评估的完整行为元组 = 正在运行的元组。相同代码在不同 model version 下行为不同，artifact continuity 是必要条件但非充分条件。
3. **Evidence Continuity**：引用的证据对应那个行为元组，且由它生成而非前身。跨变更复用的 evaluation 会破坏这个条件。
4. **Authority Continuity**：实际授予的授权覆盖实际部署的内容，在正确范围内，由有权限的主体在正确时间点授予。

这四个条件加在一起，构成了 justifiability 的规格说明——一个 promotion-time check over already-published records，当任一 required relationship 缺失时拒绝过渡。

## 为什么这是 structural gap 而不是 adoption gap

测量结果的联合含义是：survey 建立了 ceiling——没有任何 pipeline 可以声明（let alone realize）behavioral-rung assurance，因为没有任何平台的默认记录能表达该环所需的身份。depth study 建立了 floor——即使在 artifact 层级，declared versus realized 的差距也是可测量的。

中间有一个三个结果都没有预测到的发现：即使记录存在，声明和可验证证据也可以活在没有链接的不同表面上。

这意味着：不是"再推一推 adoption"就能解决的 adoption gap。这是 **structural gap**——记录类别本身在默认状态下不存在，所以接入任何框架都是无根之木。

> 💡 **Key Insight**
>
> 供应链社区已经为 artifacts 解决了 identity 问题（内容寻址），同样的问题正在 models 上重演，而本文测量的是这个链条现在断在哪一环：delivery platform 记录 AI 系统 shipping 时的 behavioral configuration。

## 对 Agent OS 团队的含义

对于做企业级 Agent OS 的团队，这篇论文揭示了一个被 SWE-bench 分数掩盖的深层问题：**Agent 系统的可信赖部署需要的不是更好的 benchmark，而是能拒绝不合格 promotion 的记录基础设施。**

当 Agent 在企业内承担真实的代码编辑、部署、发布职责时，"能跑通测试"和"能过合规"之间隔着一整层 justifiability。对监管机构或内部审计来说，一个 Promotion 如果不能附上"这个 model version + 这套 instructions + 这些 tool definitions 在这个 runtime config 下产生了这些证据"的完整证据链，它在法律或合规层面就没有任何意义。

这也是为什么论文的标题把"traceability"和"justifiability"分开——前者是事后重建关系，后者是 promotion 时就能 refuse 的能力。对企业级 Agent 系统来说，前者是安全网，后者是门槛。

---

## 结尾

这篇论文的核心贡献不是提出一个新框架，而是一套测量工具和令人不安的测量结果：行业在 traceability 层面的记录系统性地不足以支持 justifiability，而 justifiability 是唯一能真正保护部署质量的那一环。

对于构建 Agent OS 的团队，这意味着：与其争论"要不要接 SLSA/in-toto/GUAC"，不如先问一个问题——**你的 pipeline 的默认记录，能不能说出"部署的这个东西就是评估的那个东西"？**

如果答案是否定的（现在大概率是否定的），那所有框架层面的讨论都还没有触到真正的问题。

---

*Published on 2026-08-31*
