---
layout: post
title: "Kozuchi Agent：本地 27B 权重怎么做审计友好的代码修复"
date: 2026-08-31T16:40:00+08:00
tags: [AI编程, 开源Agent, CI集成, 软件修复]
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
>
> 本文核心观点：
> 1. **不微调、本地跑 Qwen3.5-27B，靠 scaffold 工程达到 SWE-bench Verified 374/500** — 严格开放权重第一，Python 开放权重第一，Java 开放权重第一
> 2. **工程化 > 模型规模** — 显式阶段机 + 持久状态 + 确定性工具 + 模型无关动作接口 + 测试时跨候选选择
> 3. **CI 可复用阶段把跨集群人工触点数从 5 降到 1** — 把 Agent 修复从 benchmark trick 拉回可审计、可重复、可进 CI 的内部基础设施
> 4. **剩余差距主要是语义正确性 + 选择器后悔** — 不是编辑格式或闭源模型特权问题

---

## 背景：开放权重 Agent 修复的困境

工业软件工程团队越来越需要能将 bug 报告转化为正确补丁的 LLM agent，但 benchmark 规模的运营带来了长程 horizon、工具使用纪律、上下文持久化、异构集群和评估复用等挑战。

Kozuchi Agent 的核心问题：能否不微调、本地跑中等规模开放权重模型，靠 scaffold 工程达到可与闭源大模型竞争的代码修复能力？

## 核心技术设计

**显式阶段机**：修复流程被分解为明确定义的阶段（phase），每个阶段有明确的输入、输出和转换条件，而非将所有决策托付给模型自主探索。

**持久状态**：跨阶段维持状态，使 agent 能在长程任务中保持上下文连续性。

**确定性工具**：工具行为可预测、可复现，使 agent 的每次执行结果稳定。

**模型无关动作接口**：动作接口设计不依赖特定模型能力，使不同模型可互换替换。

**测试时跨候选选择（Test-time selection）**：在测试时从多个候选 patch 中选择最优，而非仅依赖模型一次性输出。

## 性能数字

- **SWE-bench Verified**：374/500（Qwen3.5-27B，无微调，TTS@8）
- **Multi-SWE-bench Java**：41/128（32.03%），严格开放权重第一，42 个提交中总体第四
- **Python**：135 个提交中排名第十二，开放权重第一
- **跨语言行为一致**：各阶段性能保持在 ±5 百分比点范围内

## CI 可复用阶段：跨集群人工触点从 5 降到 1

关键工程贡献：可复用的 CI stages 设计。

操作层面，可复用 CI 阶段将跨异构内部集群的人工触点数从 5 减少到 1。这意味着：
- 人工介入点标准化
- 修复流程可审计
- 结果可重复验证

## 剩余差距分析

跨两个 track 分析候选多样性、选择器后悔和补丁可靠性：

**主要失败原因**：
1. 语义正确性——模型对代码语义的理解偏差
2. Java 特定 harness 问题
3. 选择器后悔——选择了次优候选而非最优

**不是差距来源**：
- 编辑格式问题
- 闭源模型特权访问

这说明剩余差距是语义理解问题，而非工具或基础设施问题。

---

## 结尾

Kozuchi Agent 的核心信息是：把「Agent 修复」从 benchmark trick 拉回可审计、可重复、可进 CI 的内部基础设施——不靠微调，不靠大体量闭源 API，本地 27B 开放权重模型 + 严谨 scaffold 已能逼近闭源方案。显式阶段机和持久状态是关键工程决策，它们使 agent 的行为可追踪、结果可复现、错误可诊断。对企业而言，这意味着可以自建审计友好型修复 pipeline，不必依赖黑盒 API，也不必为每个新场景重新微调。

---

*Published on 2026-08-31*

**参考链接**

- Paper: [Kozuchi Agent: A Language-Agnostic Open-Weight Agent for Software Repair](https://arxiv.org/abs/2608.15579) — arXiv:2608.15579
- Conference: ASE '26 Industry Showcase (IEEE/ACM International Conference on Automated Software Engineering)
