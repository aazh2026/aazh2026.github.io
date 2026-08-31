---
layout: post
title: "LoopsBench：评测尺子该换了——从 Harness 到 Loop"
date: 2026-08-31T16:00:00+08:00
tags: [AI编程, Agent评测, 长程执行, 软件工程]
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
>
> 本文核心观点：
> 1. **评测对象从 Harness 上移到 Loop** — 现有基准只看「最终 patch 过没过」，LoopsBench 把评测扩展到跨时间尺度的计划维护、状态连续性和已完成的回归防护
> 2. **依赖 DAG + 流感知运行时** — 每个任务建模为依赖 DAG，测试沿就绪边界逐步释放，已完成节点持续作为回归义务保留
> 3. **最强配置（Opus-4.7 + Claude Code + outer continuation）只解出 25%** — 当前前沿 agent 在长程开发循环上仍有巨大差距
> 4. **路由与状态追踪是核心瓶颈** — 回归事件在所有评估的 loop 配置中均可见，计划仅恢复部分源恢复的依赖 DAG

---

## 背景：Harness Engineering 的边界

当前 coding agent 系统越来越多地暴露 loop 机制来处理持续的软件工作，例如 Codex goal mode、Claude Code goal mode 和 Claude Code 动态工作流。这些机制并不替代 harness，而是在其上添加了更高层次的控制面，使得目标、进度标准和任务分配可以在扩展执行中持久化。

核心挑战因此从单纯的 harness engineering 转移到 over the harness 的 loop engineering：在长程编程中，loop 必须 Governing execution across task structure、状态连续性和随着依赖工作积累而产生的回归压力。

现有基准（SWE-bench 及其变体）将任务抽象为终态：agents 接收独立 issue 或扁平规格，最终以任务成功为评判标准。这衡量的是 issue 解决能力，但不揭示 agent 是否保留中间义务、避免回归，或在依赖子问题中遵循可行顺序。

## 依赖 DAG：任务结构化的新方式

LoopsBench 将每个任务建模为依赖 DAG，其中节点是独立可测试的开发单元，边界编码前置关系。DAG 使得中间单元独立可测试，并提供源恢复的开发顺序作为序列分析的参考基准，而非最优性声明。

**四种 admitted 前置模式**：
- 顺序 PR 链（沿合并提交历史）
- 结构化模块复用（vv 编辑了 uu 引入的文件或符号）
- 功能性生产者-消费者 API 边界（vv 调用或导入 uu 创建的权威定义）
- 组合分层（vv 扩展 uu 声明的子类、模式或接口）

**评估协议**：流感知运行时沿依赖 DAG 逐层释放测试，每个多前置节点作为门控。Gate node vv 在所有前任处于 Ct 后加入就绪边界，其后代的测试在 T(v) 从 fail 翻转为 pass 前保持密封。

一旦单元清除门控，其测试及其前任的测试在每个后续层上保持作为回归测试强制执行。**Regression Rate** 因此衡量先前满足行为的保留，而不依赖分阶段评估者关于检查点结果或活动义务状态的反馈。

## 关键发现

**最强配置（Opus-4.7 + Claude Code + outer continuation）只解出 25.00% 的任务。**

三个主要发现：

1. **最强配置解决率仅 25%** — 当前前沿 coding agent 在需要跨时间尺度维护计划与状态的长程任务上仍有巨大差距
2. **被评估的 loops 遗漏前置关系，产生更长 patch，编写稀疏测试** — 路由负担和状态连续性压力未被现有 loop 实现很好处理
3. **回归事件在所有评估的 loop 配置中均可见** — 路由和状态追踪被识别为中央局限

具体问题：
- 记录的计划仅恢复源恢复依赖 DAG 的部分
- 上下文 renewal 在不同 loop 实现中表现不同
- 跨所有 loop 配置都可见回归事件

## 评测对比

| 基准 | 任务形式 | 单元暴露 | 依赖 DAG |
|------|---------|---------|---------|
| LoopsBench | 依赖 DAG | ✓ | ✓ |
| SWE-bench | issue | ✗ | ✗ |
| SWE-bench Pro | issue/feature | ✗ | ✗ |
| FeatureBench | feature | partial | ✗ |

LoopsBench 是**首个 loop engineering 评测基准**，将显式单元依赖 DAG 与流感知 harness 和 loop trace 诊断配对。

---

## 结尾

LoopsBench 揭示的核心问题是：Harness Engineering 管的是「单次执行中模型怎么调工具」，Loop Engineering 管的是「跨时间尺度怎么维护计划/状态/已完工作、怎么防回归」。当前的评测基础设施在后者上基本空白。最强配置 25% 的解出率说明，即使有 Claude Code 这样的成熟产品，长程自主执行仍是一个未被解决的工程问题——而这个问题无法通过更好的模型单独解决，需要在 loop 基础设施层面取得进展。

---

*Published on 2026-08-31*

**参考链接**

- Paper: [LoopsBench: From Harness Engineering to Loop Engineering in Coding Agent Evaluation](https://arxiv.org/abs/2608.00267) — arXiv:2608.00267
- Project page: [https://loopsbench.ai/](https://loopsbench.ai/)
- Code: [microsoft/Loopsbench](https://github.com/microsoft/Loopsbench)
