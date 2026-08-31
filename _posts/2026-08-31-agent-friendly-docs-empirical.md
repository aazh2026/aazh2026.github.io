---
layout: post
title: "Agent 读文档和人想的不一样：来自 557 个真实 session 的行为证据"
date: 2026-08-31T16:10:00+08:00
tags: [AI编程, 文档工程, Agent行为, 实证研究]
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
>
> 本文核心观点：
> 1. **60.5% 的文档交互落在 agent 面向制品** — instruction files（AGENTS.md/CLAUDE.md）占 35.4%，working notes 占 25.1%；经典技术文档仅 10.6%，API reference 1.3%
> 2. **读文档→改代码的转移概率极低（0.002）** — 「读文档然后写代码」这个线性假设在相邻转移层面几乎不成立
> 3. **没有观察到显式的「读文档→跑验证」序列** — 读文档反而与更少的即时测试相关联（lift 0.23）
> 4. **文档落后于代码** — 多 commit PR 中，代码先于文档 4.7 倍；文档几乎总是被写成工作的输出而非输入
> 5. **广泛假设的「agent-friendly」属性缺乏行为支持** — 可操作性（actionability）和可验证性（verifiability）在数据中未获一致支持

---

## 背景：谁在读文档？

技术文档传统上是为人类开发者写的。但现在很大一部分代码变更由自主 coding agent 完成，它们读仓库、执行命令、在每个步骤中并非都有人参与。

一个关键问题因此浮现：如果 agent 现在是文档的重要消费者，那文档设计应该基于 agent **实际做了什么**，而不是基于人类对 agent 应该如何行为的直觉。

## 数据来源

论文在两个公开数据集上做行为挖掘：
- **SWE-chat**：557 个真实 agentic coding session，共 94,813 个开发事件，含 3,033 个文档交互事件
- **AIDev**：33,097 个 agent pull request，共 690,260 条文件级变更记录

## 核心发现一：Agent 读的文档类型和人以为的完全相反

预期：API reference、架构文档、故障排除指南。
实际：60.5% 的文档交互是**面向 agent 的制品**——instruction files（AGENTS.md、CLAUDE.md）35.4%，working notes（plans、thoughts/、brainstorms、verification logs）25.1%。

API reference 文档仅占 1.3%，故障排除文档 0.4%。经典技术文档（人写的）合计不过 10.6%。

这意味着当前文档工具和研究的主要焦点（API reference 质量）与 agent 实际消费的东西严重错位。

## 核心发现二：读文档和改代码之间几乎无关

**相邻转移概率**：`P(edit code | read doc) = 0.002`

即读一个文档后紧接着改代码的概率极低。三事件范围内的 unadjusted lift 是 1.05（略高于基线），但 stage-adjusted 模型中关联超过 1（OR 1.33 [1.09, 1.62]）。

文档 reads 之后最常跟着的是 reasoning（0.245）或 further documentation reads（0.270），而非 edit。

## 核心发现三：没有「读文档→跑验证」序列

没有观察到文档被显式用作预言（oracle）来检查代码的实例。读文档实际上与更少的即时测试相关联（lift 0.23，CI 0.08–0.45；adjusted OR 0.39 [0.25, 0.60]）和更少的构建（lift 0.15）。

这推翻了一个广泛假设：agent 会读文档来验证自己的实现。

## 核心发现四：Agent 自己写文档的速度几乎和读文档一样快

Production（1,401 事件）发生在 0.87 倍于 consultation（1,615 事件）的速率，41.5% 的 agentic PR 变更了文档。

但**时间方向不对称**：代码先于文档 4.7 倍于反向序列。文档几乎总是作为工作的输出被写入，而非作为后续工作的输入被消费。

## 描述模型：双叶循环而非线性旅程

从这些 traces 中，论文推导出一个描述性模型：**agent-documentation 交互是双叶循环**，而非「读文档→写代码→完成」的线性旅程。

- 一个叶：文档作为 agent-facing 工件（instruction files、working notes）被生产
- 另一个叶：文档作为外部信息源被消费
- 两叶之间弱连接：读文档→改代码的概率极低

## 广泛假设与实际证据的对比

| 假设 | 实际 |
|------|------|
| API reference 是 agent 主要文档消费 | API reference 仅占 1.3% |
| 读文档是验证的基础 | 读文档与更少测试相关联 |
| 文档是线性旅程的输入 | 双叶循环，文档几乎总是输出 |
| 文档先行于代码变更 | 代码先于文档 4.7x |

---

## 结尾

「把人类 README 喂给 Agent 就行」——这个假设在 33k PR 和 557 session 的行为证据面前基本不成立。Agent 的文档交互高度集中于自己生成的制品（instruction files、working notes），而人写的技术文档在其实际工作流中边缘化。更反直觉的是，文档消费和代码编辑之间的关联几乎为零，而文档变更几乎总是作为工作输出的结果而非工作输入的前提出现。这意味着未来仓库要补的不是更漂亮的 Markdown，而是**机器可操作的文档**：可验证、带断言入口、指令层的 agent-facing 制品，且与代码变更同步维护。

---

*Published on 2026-08-31*

**参考链接**

- Paper: [From Agent Behaviour to Agent-Friendly Documentation: An Empirical Study of How Coding Agents Discover, Read, and Write Technical Documentation](https://arxiv.org/abs/2608.20195) — arXiv:2608.20195
