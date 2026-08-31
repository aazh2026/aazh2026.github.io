---
layout: post
title: "REAP: 从生产流量自动构建评测基准"
date: 2026-08-31T12:30:00+08:00
tags: [评测基准, 软件工程, Agent评估, AI编程]
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
>
> 本文核心观点：
> 1. **公开基准与工业生产脱节** — SWE-bench 语言分布偏 Python、prompt 偏正式 issue、任务类型偏 bug fix，与真实 monorepo 流量存在系统性偏差
> 2. **REAP 流水线** — 从真实开发者×Agent 会话日志自动筛选任务，三道自动化验证层（prompt quality filters、test relevance filter、multi-run validation）替代手工审核
> 3. **Harvest 基准** — 多语言（Hack 为主）、verbatim 开发者 prompt、fail-to-pass 验证；五模型 solve rate 42.9%–58.2%
> 4. **滚动重 curation** — monorepo 基础设施的 ephemeral 特性要求基准持续刷新，自动化是前提而非优化

---

## 背景：评测的三难困境

AI 编程代理的生产部署需要快速、可重复的评估信号，但现有方法都面临权衡：

**在线 A/B 测试**：信号真实，但需数周达到统计显著性，工程资源消耗大，且有用户风险。

**影子部署**：不向用户提供 agent 输出，但模型输出和环境状态在运行之间变化，可重复性差。

**公开离线基准**：速度快、可重复，但与生产流量存在系统性偏差。

SWE-bench 的偏差具体表现在：语言分布偏 Python（vs Hack/C++/Kotlin）；Prompt 风格偏结构化 issue（vs 口语化开发者请求）；Codebase 结构偏独立开源仓库（vs ephemeral 工具链的工业 monorepo）；任务类型偏 bug fix（vs 大量 refactoring 和 feature work）。此外，冻结基准面临 data contamination 风险——任务可能出现在模型训练数据中。

## REAP 两阶段架构

REAP 分两个主要阶段：**Dataset Construction**（构建候选集）和 **Verification**（验证过滤）。

### Dataset Construction

**真实开发者对话**：从生产 AI 编程助手收集对话，每个对话映射到随后被 approve、merge 到 monorepo 的 solution diff。助手被记录了每次 AI 生成内容被开发者接受并保留在最终 diff 中的 provenance，使 prompt 和 diff 之间建立严格的 one-to-one mapping。

**Backed-out Evaluation Environment**：把 solution diff 从当前 codebase backing out，在 pre-change 状态上运行 agent 评估，确保 agent 无法通过读取 committed solution files 作弊。随着 codebase 演化，越来越多的历史 diffs 会与当前 master 冲突，因此 REAP 设计为 rolling benchmark——定期重新 curation 任务集。

**Candidate Test Retrieval**：使用 probabilistic test retrieval 服务，对每个 diff 返回统计上可能受影响的 candidate tests，限制为"最近一次在 master 上通过且未被标记为 disabled 或 known-flaky"的测试。

### Verification：三道过滤门

Raw candidate set 有三类噪音：与 diff 没有因果关系的 candidate tests、无法通过测试可靠评估的 prompts、transient infrastructure failures 导致的错误 fail-to-pass label。SWE-bench Verified 靠 90 个工程师手工审核每个 task；REAP 用自动化验证替代。

**Prompt Quality Filters**：
- **Solution Diff Leakage**：如果 prompt 明确引用 solution diff identifier（agent 可通过内部工具检索），则剔除
- **Non-Testable Prompts**：LLM 分类器（Claude Sonnet 4.5）判断 prompt 是否可通过测试可靠评估，17 个任务类别中只有"testable set"（bug fix、feature request、refactoring 等）才通过
- **Template Prompts**：排除匹配已知 system prompts 或 template messages 的自动化消息

**Test Relevance Filter**：即使 test 在 pre/post change 上表现出 fail-to-pass 行为，也可能是 coincidental failure——REAP 用 agentic test-relevance validation 检查测试是否 causally connected to the diff。

**Multi-Run Test Validation**：在高精度幸存集上运行多跑验证，确认 fail-to-pass 信号稳定，排除 flaky tests。

三道过滤顺序是刻意设计的：语义检查在执行之前先缩小候选集，使 multi-run F2P 检查只在很小的高精度幸存集上运行。

## Harvest 基准

REAP 用于 curation 的生产系统限制为 single-turn 对话（case-study 范围选择，非 pipeline 级别限制）。Harvest 基准的任务构成：多语言（覆盖 4+ 编程语言，多数为 Hack）；verbatim 开发者请求（不是从 issue reconstruction）；fail-to-pass (F2P) tests 验证，不依赖 LLM judge。

## 评测结果

Harvest 上五大前沿模型的 solve rates：42.9%–58.2%（Claude Opus 4.6 最高）。论文指出这些结果揭示了公开基准上看不到的模型能力差异。

---

## 结尾

REAP 的核心贡献是一个从生产流量自动构建评测基准的流水线——当生产环境中有足够的开发者×Agent 交互日志时，基准构建从"人工定义任务"转变为"从真实流量中过滤和验证"的工程问题。SWE-bench Verified 用手工审核解决了原始基准的噪音问题；REAP 用自动化验证层实现了同样的质量目标，同时解决了 monorepo 规模下持续重 curation 的成本问题。

---

*Published on 2026-08-31*

**参考链接**

- Paper: [REAP: Automatic Curation of Coding Agent Benchmarks from Interactive Production Usage](https://arxiv.org/abs/2604.01527) — arXiv:2604.01527（Accepted at ASE 2026 Industry Showcase）
- Artifact: [https://anonymous.4open.science/r/REAP_artifact](https://anonymous.4open.science/r/REAP_artifact)
