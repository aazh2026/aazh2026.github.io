---
layout: post
title: "REAP: 从生产流量里蒸馏评测基准"
date: 2026-08-31T12:30:00+08:00
tags: [评测基准, 软件工程, Agent评估, AI编程]
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
>
> 本文核心观点：
> 1. **公开基准与工业生产脱节** — SWE-bench 语言分布偏 Python、prompt 偏正式 issue、任务类型偏 bug fix，和真实 monorepo 流量差异巨大
> 2. **REAP 的核心洞察** — 基准构建本身是"从生产流量里蒸馏"的工程问题：真实开发者×Agent 会话日志 + LLM 分类可测性 + Agentic 测试相关性验证 + 多跑稳定性检查
> 3. **Harvest 基准** — 多语言（Hack 为主）、真实 prompt 风格、fail-to-pass 验证，五大前沿模型 solve rate 42.9%–58.2%，揭示了公开基准上看不到的模型能力差异
> 4. **对大厂评测中台直接可抄的流水线** — 手工审核无法规模化，REAP 的自动化验证层解决了这个瓶颈

---

## 评测的三难困境

AI 编程代理的生产部署需要快速、可重复的评估信号。但现有方法都面临权衡：

**在线 A/B 测试**：信号真实，但需要数周才能达到统计显著性，工程资源消耗大，且有用户风险。

**影子部署**：不向用户提供 agent 输出，避免用户体验损伤，但引入了非确定性——模型输出和环境状态在运行之间变化，可重复性差。

**公开离线基准**：速度快、可重复，但与生产流量存在系统性偏差。

SWE-bench 是最常用的公开基准，但它的问题不是质量差，而是它测量的分布和工业生产完全不同。论文指出了四个关键偏差：

- **语言分布**：SWE-bench 来自 Python GitHub issues，而工业 monorepo 包含 Hack、C++、Kotlin 等多语言
- **Prompt 风格**：issue 是为人类开发者写的结构化描述，而生产流量是开发者直接输入 AI 助手的口语化、未充分说明的请求
- **Codebase 结构**：开源独立仓库 vs 大规模工业 monorepo（ephemeral 工具链、分布式构建基础设施）
- **任务类型分布**：issue-derived 偏 bug fix，生产流量包含大量 refactoring、migrations 和 feature work

此外还有 **data contamination** 问题：冻结的基准随着时间推移其任务越来越可能出现在模型训练数据中。

## REAP 的核心思路

Meta 的这篇论文 *REAP: Automatic Curation of Coding Agent Benchmarks from Interactive Production Usage*（arXiv:2604.01527）提出的解法可以概括为：**从真实开发者×Agent 会话日志中自动筛选出可评测的任务，然后用自动化验证层替代手工审核**。

REAP 做的是从生产流量里蒸馏 benchmark——这个设计原则本身就回答了一个常见误解：认为基准构建是"人工出题"的问题。REAP 的观点是，在有足够的生产日志的情况下，基准构建是"从生产流量里过滤和验证"的工程问题。

> 💡 **Key Insight**
>
> REAP 的核心贡献不是提出一个更好的基准数据集，而是提出一个**基准构建的自动化流水线**——使得在 monorepo 设置下持续、大规模地重新 curation 成为可能，而这正是手工审核无法规模化解决的问题。

## 两阶段架构

REAP 分两个主要阶段：**Dataset Construction**（构建候选集）和 **Verification**（验证过滤）。

### Dataset Construction

**真实开发者对话**：从生产 AI 编程助手收集真实对话，每个对话映射到一个随后被 approve、merge 到 monorepo 的 solution diff。助手被记录了每次 AI 生成内容被开发者接受并保留在最终 diff 中的 provenance——这个指标使得可以在 prompt 和 diff 之间建立严格的 one-to-one mapping。

**Backed-out Evaluation Environment**：把 solution diff 从当前 code base backing out（撤销修改），然后在这个 pre-change 状态上运行 agent 评估。这确保 agent 无法通过读取 committed solution files 来"作弊"。随着 codebase 演化，越来越多的历史 diffs 会与当前 master 冲突而失去资格，因此 REAP 设计为 rolling benchmark——定期重新 curation 任务集。

**Candidate Test Retrieval**：使用 build-system 的 probabilistic test retrieval 服务，对每个 diff 返回统计上可能受影响的一组 permissive candidate tests，限制为"在 master 上最近一次通过且未被标记为 disabled 或 known-flaky"的测试。

### Verification：三道过滤门

raw candidate set 有三类噪音：与 diff 没有因果关系的 candidate tests、无法通过测试可靠评估的 prompts、导致错误 fail-to-pass label 的 transient infrastructure failures。SWE-Bench Verified 靠 90 个工程师手工审核每个 task 来解决这些问题，但 monorepo 规模下每周期手工审核不可行——REAP 用自动化验证层替代。

**第一道：Prompt Quality Filters**

- **Solution Diff Leakage**：如果 prompt 明确引用了 solution diff 的 identifier（agent 可以通过内部工具检索它），则剔除
- **Non-Testable Prompts**：LLM 分类器（基于 Claude Sonnet 4.5）判断 prompt 是否可以通过测试可靠评估，17 个任务类别中只有 a priori 定义的"testable set"（bug fix、feature request、refactoring 等）才通过
- **Template Prompts**：排除匹配已知 system prompts 或 template messages 的自动化消息

**第二道：Test Relevance Filter**

这是关键步骤：即使一个 test 在 pre/post change 上表现出 fail-to-pass 行为，它也可能是 coincidental failure——和 diff 没有因果关系。REAP 用 agentic test-relevance validation 来检查：测试是否 causally connected to the diff。

**第三道：Multi-Run Test Validation**

在高精度幸存集上运行多跑验证，确认 fail-to-pass 信号稳定，排除 flaky tests。

三道过滤的顺序是刻意设计的：语义检查在执行之前先缩小候选集，这样 multi-run F2P 检查只在很小的高精度幸存集上运行，大幅降低计算成本。

## Harvest 基准

REAP 用于 curation 的生产系统限制为 single-turn 对话（case-study 范围选择，非 pipeline 级别限制）。Harvest 基准的任务构成：

- **多语言**：覆盖 4+ 编程语言，**多数为 Hack**（这本身就与 SWE-bench 全 Python 形成鲜明对比）
- **Prompt 风格**：verbatim 开发者请求（不是从 issue reconstruction 的），反映真实生产中的未充分说明、口语化特点
- **验证方式**：fail-to-pass (F2P) tests，不依赖 LLM judge

## 评测结果：五模型对比

Harvest 上五大前沿模型的 solve rates：

| 模型 | Solve Rate |
|------|-----------|
| Claude Opus 4.6 | **58.2%** |
| 其他四个模型 | 42.9%–53%（具体因商业原因未列出）|

这个结果本身就揭示了公开基准上看不到的信息：模型在真实生产流量上的表现差异，和在 SWE-bench 上的分数排名并不完全对应。Claude Opus 4.6 最高，但差距是真实的、可以影响部署决策的。

> 💡 **Key Insight**
>
> Harvest 的 solve rate 显著低于某些公开基准报告的分数，但这不是"模型退步"——这是基准更贴近真实分布后的自然结果。在 Python-heavy、SWE-style issue 的基准上训练和调优的模型，在多语言、informal prompt、monorepo 结构的生产流量上表现下降，是预期的分布迁移。问题不在模型，在基准。

## 从"人工出题"到"生产蒸馏"

REAP 最重要的贡献可能不是 Harvest 本身，而是它所代表的方法论转变：**基准构建正在从"人工定义任务 + 人工验证质量"转向"从生产流量里自动蒸馏 + 自动化验证层质量保证"**。

这个转变的背景是：大模型的快速发展使得任何冻结的、手工构建的基准都在快速过时——要么已经被模型训练数据污染，要么已经不能反映当前模型的真实能力边界。rolling re-curation 是唯一可行的应对策略，而 rolling re-curation 的前提是自动化验证，否则成本无法承受。

对于大厂评测中台，REAP 的直接可操作性在于：它的 artifact（classifier prompts、annotation protocols）已经公开，可以直接复用到自己的生产日志上，构造自己的 in-distribution 基准。

## 与 SWE-bench Verified 的关系

SWE-bench Verified 通过手工审核 90 个工程师来解决原始 SWE-bench 的噪音问题——这是正确的方向，但不可扩展。REAP 的 LLM-based task classification 和 agentic test-relevance validation，本质上是用更 scalable 的方法自动化了 SWE-bench Verified 手工做的事情。

两者的核心洞察是一致的：raw 自动构建的 task pool 有三类噪音（test 无关、prompt 不可测、brittle 环境），必须过滤。但手工审核 vs 自动化过滤是 scalability 的分水岭。

---

## 结尾

REAP 揭示了一个基准构建领域正在发生的范式转变：当生产环境中有足够多的开发者×Agent 交互日志时，基准不再是"专家定义的标准题"，而是"从真实流量中过滤出来的代表性样本"。

这个转变对 Agent 评估的影响是深远的：公开基准（无论如何精心构建）都会与特定组织的生产分布产生偏差；真正有用的评估信号来自对自身生产流量的持续监控和 distillation。

对于构建评测基础设施的团队，REAP 提供了可以直接借鉴的流水线——从 classifier prompts 到 annotation protocols 再到 multi-run validation 的完整工程路径。而 Harvest 作为 case study 证明：即使在多语言、informal prompt、monorepo 结构的工业设置下，从生产流量中蒸馏出的基准仍然可以揭示模型之间有意义的性能差异。

---

*Published on 2026-08-31*
