---
layout: post
title: "HarnessFix：Agent 失败别只调模型，去修运行框架"
date: 2026-09-20T18:00:00+08:00
tags: [Agent运行时, Harness排障, Trace归因, HTIR, 框架修复]
description: "Agent 失败常来自 harness 而非模型本身。HarnessFix 把失败轨迹编译成 Trace IR，做步级数据流/控制流归因，找出哪个 harness 机制导致失败，再生成作用域受限的 patch。"
author: "@postcodeeng"
series: aise
subtopic: agent-runtime
---

> **TL;DR**
>
> 当 Agent 在任务上失败时，默认假设是「模型太弱」或「prompt 不够好」。
> HarnessFix 指出：很多时候问题是 harness（执行环境、工具接口、上下文管理）的实现缺陷，不是模型的问题。
> 把失败轨迹编译成结构化 Trace IR，做归因分析，再生成修复 patch——4 个基准上比原始 harness 提升 6.3%–18.4%。

---

## 传统 self-improving agent 的盲区

现在主流的 agent 自改进方法集中在：

- **Prompt 优化** — 改写 system prompt，加 examples
- **Workflow 搜索** — 找更好的任务分解顺序
- **运行时监督** — 给 agent 更多反馈信号

这些方法的共同假设是：**失败的原因在 agent 本身（模型能力 / prompt 质量），不在运行环境**。

HarnessFix 要打破这个假设。它的核心主张是：

> **很多时候 agent 失败是因为 harness 的实现缺陷——工具接口定义错误、上下文管理有 bug、生命周期编排异常、验证逻辑有问题——而不是 agent 本身不够好。**

举一个具体的例子：Agent 调工具时超时返回空结果，问题可能不是 agent 不会处理，而是 harness 的**超时配置不合理**或**结果序列化有 bug**。

---

## HarnessFix 三步走

### Step 1：编译成 Harness-aware Trace IR（HTIR）

原始失败轨迹是碎片化的——日志、工具输出、中间状态混在一起。

HarnessFix 把这些编译成结构化的 **HTIR**，包含：
- **步级数据流** — 每一步的输入、输出、状态变化
- **步级控制流** — 步骤之间的依赖关系和条件分支
- **Harness 机制对齐** — 每个运行时步骤对应哪个 harness 组件（工具接口、上下文窗口、验证器……）

### Step 2：归因分析（Attribution）

有了结构化的 HTIR，做失败归因：

```
失败点 → 哪一步 → 哪个 harness 机制 → 具体实现问题
```

这一步输出 **Flaw Record**：哪段代码的哪个 harness 机制有什么类型的缺陷。

### Step 3：生成修复 Patch

Flaw Record 映射到**作用域受限的修复操作符**，生成针对特定 harness 缺陷的 patch，并通过回归验证决定是否接受。

关键：patch 是在「flaw-specific 修复规范」下生成的，不是全局改写 harness，作用域受到严格控制。

---

## 核心结果

| 基准 | HarnessFix 提升 |
|------|----------------|
| 基准 A | **+18.4%** |
| 基准 B | **+12.1%** |
| 基准 C | **+6.3%** |
| 基准 D | **+9.7%** |

显著优于 human-designed 和 self-evolution 基线。

这意味着：即使不换模型、不改 prompt，仅修复 harness 本身，就能带来可观的 agent 性能提升。

---

## 为什么这个方向重要：把 Agent 运行时当软件系统来对待

长久以来，agent 框架（LangChain agent runtime、AutoGen、Claude Agent SDK……）被视为「基础设施」——出了问题就调 prompt、换模型、限制工具数量。

HarnessFix 的框架把 **harness 本身当成需要测试、诊断、修复的软件系统**：

- 失败轨迹 = 程序的 debug trace
- Flaw Record = bug report
- 修复 patch = software patch

这开启了一种可能性：**未来 agent 开发团队会需要有专门的「harness 工程师」**，负责调试 agent 运行时层面的问题，就像现在有专门的 SRE 调试分布式系统一样。

---

## 批评性解读

**HTIR 的归因质量取决于 trace 的完整性**。如果 harness 本身没有输出足够的 trace 信息，归因就会受限。这要求 harness 在设计时就要考虑可观测性，不是事后补救。

**6.3%–18.4% 的提升幅度在不同基准上差异很大**。最差情况只有 6.3%——这提示并非所有 agent 失败都能归因到 harness，也并非所有 harness 缺陷都能被这个框架修复。适用范围有边界。

**patch 生成的自动化程度**。框架能生成 patch，但 patch 的质量是否达到人类工程师水平、是否可能引入新 bug，论文没有充分讨论。

---

*论文：From Failed Trajectories to Reliable LLM Agents: Diagnosing and Repairing Harness Flaws（arXiv:2606.06324）*
