---
layout: post
title: "SpecPath：同一个需求，换种说法就修出不同的 bug"
date: 2026-08-31T16:35:00+08:00
tags: [AI编程, 评测鲁棒性, 需求工程, Agent可靠性]
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
>
> 本文核心观点：
> 1. **规格路径敏感性（Specification-Path Sensitivity）** — 语义等价的最终契约，不同的演化路径，导致同一 Agent 系统产出行为不同的程序
> 2. **规格先行并非充分** — 过去基准只测「Agent 能否实现一个规格」，SpecPath 测的是「Agent 能否识别哪个规格仍是活跃契约」
> 3. **35/100 直接成功的执行块在等价格式历史下失败** — 总体数字几乎不变（78.8% vs 78.7%），但成功执行的身份在等价格式路径间发生变化
> 4. **规格归一化/对齐层成为 Agent 产品化的必要组件** — PRD 换个人写，补丁就变

---

## 背景：规格先行够了吗？

软件需求很少在 agent 工作期间保持不变。Issue 更新和 review 评论可能替换规则、撤回变通方案或缩小范围。可靠的 coding agent 必须不仅知道如何实现请求，还要知道**哪些请求仍构成活跃契约**。第二个问题在逻辑上先于第一个：即使实现技能完美，若 agent 解决了错误的契约，也实现的是错误的程序。

问题根源：对话是 append-only 记录，但其规格是可变的。当后续轮次 additively 添加时，累积全部是正确的；当后续轮次替换、限定或取消更早轮次时，「记住一切」和「跟随最新轮次」都不充分。Agent 必须从完整历史中恢复当前约束的规范化集合。

## SpecPath：规格路径敏感性

**规格路径敏感性（Specification-Path Sensitivity）**：等价最终契约的需求历史导致同一 agent 系统产生行为不同的程序。

**规格路径不变性（Specification-Path Invariance）**：如果历史 H 和 H′ 解析到相同最终契约 C⋆，则在固定 repository、verifier 和执行策略下，路径不变的 agent 应保持契约正确。

关键：Patch 或 trace 同一性不是目标——许多程序可能满足相同的行为义务。应保持不变的是**测试的契约实现**。

## 评估设计：双条件配对测试

每个任务家族构造多个解析到相同最终契约的历史，然后在固定 repository、verifier、agent 配置和执行预算下运行。

**直接条件 vs 控制条件**：将规范实现能力与对修订路径、措辞和添加上下文的敏感性分离。

每次执行仅在完整历史可见后才开始，并从同一 base repository 的新鲜副本启动。这种延迟执行设计将契约解析与中间轮次编写的代码惯性隔离。

## 核心发现：总体稳定，但执行身份变化

最终契约实现（FCR）：直接条件 78.8%，四个等价格式历史条件平均 78.7%。

**但：100 个直接成功的完整执行块中，35 个在至少一个等价格式历史上失败。**

这意味着：平均成功率可以保持稳定，而成功执行的**身份**在等价格式路径之间发生变化。

论文给出的具体例子：Tracecat PR #1245。最终契约区分必需和可选的 secret 获取——缺少必需 secret 必须抛出 SecretNotFoundError，可选查找返回提供的默认值或 None。Direct history 一次性陈述两条规则；Override history 先请求旧行为，再明确替换为相同的两条规则。两个历史在路径上不同但最终约束相同。然而 Override run 保留了被取代的行为并在 required-missing probe 上失败。

## 规格演化中的主动契约解析

论文识别了三种需求历史操作：
- **Addition**：激活新 atom
- **Override**：停用旧 atom 并激活其替代
- **Cancellation**：停用临时 atom

规范规格：最后轮次单独不够——在 split history 中，更早的 atom 可能保持活跃而不在最后消息中重复。

这意味着 agent 必须从完整历史中恢复规范化的活跃义务集合，而不是简单地取最后一条指令。

## 五种规格历史类型

每家族供应五种核心历史：
1. Direct：直接激活最终契约 atoms
2. Override：先激活旧 atoms，再 override
3. Split：在多轮中分散 atoms
4. Cancellation：临时 atom 被取消
5. Length-matched controls：长度匹配控制

---

## 结尾

SpecPath 的贡献是把「需求表述路径」变成可测量的因子：总体数字可以很好看（78.8% vs 78.7%），但同一执行块在等价格式历史间的失败才是真正的问题。这意味着未来评测不能只问「Agent 能否实现给定的规格」，还要问「Agent 能否在需求演化历史中识别哪些约束仍是活跃契约」。对产品化 Agent，这意味着需求端也需要归一化/对齐层——否则 PRD 换个人写、issue 描述换种口径，修出来的补丁行为就可能不一致。

---

*Published on 2026-08-31*

**参考链接**

- Paper: [SpecPath: Testing Coding Agents Across Contract-Equivalent Specification Histories](https://arxiv.org/abs/2608.09799) — arXiv:2608.09799
