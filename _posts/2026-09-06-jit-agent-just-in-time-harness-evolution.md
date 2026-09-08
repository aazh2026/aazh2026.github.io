---
layout: post
title: "JIT-Agent：让模型自己搭脚手架"
date: 2026-09-06T10:00:00+08:00
tags: [Agent, Prompt工程, LLM, 论文解读]
description: "JIT-Agent证明：脚手架设计是可训练、可迁移、可组合的能力维度——DeepSeek-V4-Flash靠它反超GPT-5.6。"
author: "@postcodeeng"
series: aise
subtopic: llm-agent
---

GPT-5.6 被一个参数量小一个数量级的模型反超了——不是因为模型变强了，而是因为它学会了**自己搭脚手架**。

这是 JIT-Agent 论文最让我不安的地方。

## 什么是 "harness"？

大多数 Agent 系统里，**脚手架（harness）** 是人类工程师提前搭好的：用什么格式做 planning、memory 怎么管理、工具怎么编排、什么情况下该查文档。这些设计是静态的、超参的、难以迁移的。

论文的核心问题是：**脚手架本身，能不能成为模型的"能力"之一？** 也就是说，模型能不能在遇到新任务时，**即时生成**适合自己的脚手架？

JIT-Agent 的答案：是。

## 四个模块，即时生成

JIT-Agent 把脚手架拆成四个可合成的模块，模型在运行时**按需生成**：

- **Memory Management（MM）**：决定哪些信息值得保留、怎么组织。不再是固定的 vector store 或 sliding window。
- **Planning Protocol（PP）**：用什么结构做推理分解。Chain-of-Thought？Tree-of-Thought？或者自定义的混合结构。
- **Action Protocol（AP）**：采取行动时的规范——要不要先做 sub-plan、什么情况下 rollback、多步之间如何对齐。
- **Tool Orchestration（TO）**：工具选择、排序、并行策略。不是预定义的 tool call 顺序，而是动态编排。

关键在于，这四个模块不是各自为政的。论文用了一个 **hierarchical composition** 机制：先确定 MM 作为上下文基础，再在其上构建 PP → AP → TO 的依赖链。

生成过程由一个轻量级的 **Meta-Harness Generator** 驱动，输入任务描述 + 历史轨迹片段，输出完整的 harness 配置。整个过程在单次 inference 内完成，不需要外部搜索或微调。

## 数据说话：反超是怎么发生的

论文在两个基准上做了验证：

- **DeepSearchQA**：DeepSeek-V4-Flash + JIT-Agent 比 GPT-5.6 高 **+9.1** 分。
- **OdysseyBench**：高出 **+4.3** 分。
- **GLM-5.2** 增益最大，最高 **+20.2** 分。

这些数字背后有一个值得注意的 pattern：**基座越小的模型，从 JIT-Agent 获得的增益越高**。GLM-5.2 的 +20.2 不是因为它本身最强，而是因为它原本的脚手架设计最弱——或者说，最缺少"定制脚手架"的能力。

这说明 JIT-Agent 解决的不只是效率问题，而是一个**能力维度**：**模型能否为自己的推理选择最优上下文结构**，这件事本身是可以被 harness 化的。

## 一个诚实的问题

JIT-Agent 的生成过程依赖**单次 inference 内完成**，这意味着 harness 的质量直接受制于基座模型的**元认知能力**。

换句话说：如果基座模型本身不擅长"理解自己需要什么"，它生成的 harness 大概率也是次优的。论文没有系统性地分析失败模式——什么时候 harness 生成会反而拖累主任务性能。**这是目前最大的黑盒。**

另外，四个模块的组合空间巨大，论文的消融实验覆盖了主要组合，但并非穷举。实际生产场景中，哪些组合是"安全区"、哪些是高风险区，目前还缺乏指南。

## 对实践者的意义

如果你是 Agent 系统的工程师，JIT-Agent 最直接的意义是：**把脚手架设计从工程问题升格为模型能力问题**。

这意味着：

- 以后评估 Agent 系统，不仅要看基座模型，还要看它**适配脚手架的能力**。
- 做 prompt 工程时，"给什么格式的 planning 指令"可能变成过去式——你可以让模型自己决定格式。
- 微调数据的设计可能需要从"教模型完成任务"扩展到"教模型在不同任务下选择合适的 harness"。

脚手架不是框架的附属品。它本身就是一个**可训练、可迁移、可组合的能力维度**。JIT-Agent 把这件事说清楚了——至于它能不能真正落进生产系统，还需要更多 failure mode 的研究。但方向是对的。

---

*论文：Guibin Zhang et al., "Scaling Harness Intelligence via Just-in-Time Harness Evolution", arXiv:2608.25593, 2026.*
