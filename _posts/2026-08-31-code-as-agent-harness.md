---
layout: post
title: "代码作为 Agent Harness：代码不再是输出，而是 Agent 的身体"
date: 2026-08-31T15:30:00+08:00
tags: [Agent OS, 代码生成, Harness Engineering, Agent架构]
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
>
> 本文核心观点：
> 1. **代码角色的根本转变** — 代码不再是 LLM 交出的作业，而是包裹模型的运行时外骨骼：承担 reasoning substrate、action interface、environment modeling
> 2. **Harness Interface 三功能** — 代码作为推理介质（程序化推理、可执行验证）、动作接口（策略生成、技能调用）、环境建模（repo/test/trace 作为可查状态）
> 3. **Harness Mechanisms 四机制** — 规划、记忆、工具使用、反馈驱动的控制与优化，使 harness 在长程执行中保持可靠和自适应
> 4. **多 Agent 协调** — 代码 artifacts 成为多 Agent 协调、互审、验证的共享工作空间

---

## 背景：代码的本体论转变

在新兴的 agentic 系统中，代码的角色正在发生根本性转变：它不再仅仅是目标输出，而 increasingly serves as an operational substrate for agent reasoning, acting, environment modeling, and execution-based verification。

这一视角被表述为 **code as agent harness**：以代码为 agent 基础设施基础的统一视图。

传统视角将代码视为 LLM 生成的终点；code as agent harness 视角将代码视为：
- **可执行的** — 模型输出变为具有形式可验证结果的操作
- **可检查的** — 中间计算暴露为结构化 traces，harness 可以读取、存储并据此行动
- **有状态的** — 进化中的程序以持久、可修改的形式表示跨步骤的任务进度

## 三层结构

论文围绕三个连接层组织 survey：

### 第一层：Harness Interface（代码作为接口）

代码在模型与任务环境之间形成基本接口。

**代码用于推理**：程序化推理（program-delegated reasoning）将中间计算外化为可执行代码，允许解释器、符号求解器、执行 traces 或过程奖励来检查和改进推理。

**代码用于动作**：生成的程序作为策略、工具调用、行为树或可复用技能，用于具身、GUI 和软件环境。

**代码用于环境建模**：程序状态、仓库、traces、模拟器和测试代表 agent 交互的环境状态、动态和反馈信号。

### 第二层：Harness Mechanisms（代码作为机制）

一旦代码进入 agent 循环，harness 必须决定下一步执行什么、保留什么有用状态、暴露什么工具、将失败转化为纠正行动。

**规划方法**：通过分解、结构接地、轨迹搜索或工作流编排来组织长程软件任务。

**记忆方法**：维护工作状态、检索仓库证据、存储可复用经验、支持共享交互历史。

**工具使用方法**：将 agent 连接到 API、仓库、执行环境和验证工具。

**反馈驱动的控制与优化**：使用静态分析、运行时错误、测试和人工反馈通过重复执行来修订代码。

### 第三层：Scaling the Harness（多 Agent 编排）

当多个 agent 在代码上运行时，harness 必须不仅支持个体推理和执行，还要协调角色、共享中间 artifacts、维持共同状态并验证集体进度。

**多 Agent 协作模式**：编程、修复、辩论、红队对抗和对抗性交互。

**工作流拓扑**：从集中式协调到分布式或流式协作。

代码 artifacts（仓库、测试、traces、工作流、执行状态）成为 agents 协调、互检和相互改进的共享工作空间。

## Agent Harness 的具体例子

Harness interface 层的代码 artifacts 包括：
- **程序化推理**：代码将中间计算外化为可执行程序
- **可执行策略**：生成的程序作为物理或模拟世界中与环境交互的可执行策略
- **Structured world representations**：repo/test/trace 作为可查状态
- **Regression tests**：agent 自己生成的测试作为验证 substrate
- **Temporary tools**：动态生成的一次性工具
- **DSL programs**：领域特定语言程序
- **Executable workflows**：可执行工作流
- **Reusable skills**：可复用技能库

## Harness Engineering 的开放挑战

论文列举了以下开放问题：

1. **超越最终任务成功的评估** — 仅评估任务完成与否不够，需要评估 harness 本身的可靠性
2. **不完整反馈下的验证** — Harness 如何在反馈不完整时仍保持正确性
3. **无回归的 harness 改进** — 如何改进 harness 而不引入新的回归
4. **跨多 Agent 的一致共享状态** — 共享 program state 的事务性保证与语义冲突解决
5. **安全关键动作的人类监督** — Human-in-the-loop 作为 harness 状态的一部分
6. **多模态环境扩展** — Harness 工程扩展到多模态环境

---

## 结尾

Code as agent harness 的核心洞察是反转了代码与 agent 的关系：代码不是 LLM 的输出结果，而是包裹模型的运行时外骨骼——承担推理外化、动作执行、环境建模和执行验证的功能。Agent 的终局不是"更会写代码"，而是"把代码变成自己的操作系统"。这引出了 Harness Engineering 作为新的工程学科，与 spec-first 和 agent-friendly docs 形成互补：后者管"怎么写"，前者管"写在哪儿活起来"。

---

*Published on 2026-08-31*

**参考链接**

- Paper: [Code as Agent Harness](https://arxiv.org/abs/2605.18747) — arXiv:2605.18747
- Related: [Awesome-Code-as-Agent-Harness Papers](https://github.com/YennNing/Awesome-Code-as-Agent-Harness-Papers)
