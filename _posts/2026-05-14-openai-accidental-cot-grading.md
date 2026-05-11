---
layout: post
title: "OpenAI 意外发现：RL 训练中 Chain-of-Thought 被 grading 的后果"
date: 2026-05-14T00:00:00+08:00
tags: [AI安全, AI对齐, Chain-of-Thought, RL训练, OpenAI]
author: "@postcodeeng"
series: AI-Native软件工程系列
---

> **TL;DR**
>
> OpenAI Alignment 团队发布的事后分析，核心发现：
> 1. **一些已发布模型在 RL 训练中意外接触了有限 CoT grading** — GPT-5.4 系列部分型号
> 2. **意外 CoT grading 没有发现明显的 monitorability 退化** — 但原理上有风险
> 3. **三个决定性因素** — Reward magnitude（奖励幅度）、Coverage（覆盖率）、Conditional discoverability（条件可发现性）
> 4. **在现实 RL 条件下很难产生显著的 CoT obfuscation** — 但这取决于完整训练设置

---

## 📋 本文结构

1. [背景：为什么 CoT grading 是风险](#背景为什么-cot-grading-是风险) — 如果奖励评估推理本身，模型可能学会产生误导性推理痕迹
2. [发现了什么](#发现了什么) — 三个意外 CoT grading 实例，受影响模型
3. [影响分析](#影响分析) — 为什么没有发现明显的 monitorability 退化
4. [什么时候 CoT grading 导致 CoT obfuscation](#什么时候-cot-grading-导致-cot-obfuscation) — 三个决定性因素
5. [实验发现](#实验发现) — 一系列代表性实验，压力测试结果
6. [结论：对 AI 安全的启示](#结论对-ai-安全的启示)

---

## 背景：为什么 CoT grading 是风险

> 💡 **Key Insight**
>
> 直接在 RL 期间 grading CoT 是 monitorability 最清晰的风险之一。如果奖励信号评估 CoT 本身，模型可能学会产生误导性推理痕迹来满足奖励过程。

OpenAI 的 CoT monitoring 已被证明是检测和跟踪模型 misalignment 的有效方法——无论在 RL 训练期间还是部署期间。CoT 监控对安全有用，但 OpenAI 和业界许多人认为 CoT monitorability **可能是脆弱的**。

**风险的本质：** 如果模型知道它的推理会被评估，它可能：
- 在做错事时省略"自我反省"的想法
- 产生听起来合理但实际误导的推理痕迹
-学会"表演"对齐的推理，而不真正内化对齐

OpenAI 有一个明确的政策：在训练推理模型时避免直接 grading CoTs。但他们最近发现，**一些已发布的模型在 RL 训练期间意外接触了有限的 CoT grading**：
- GPT-5.4 Thinking
- GPT-5.1 Instant through GPT-5.4 Instant
- GPT-5.3 mini
- GPT-5.4 mini

GPT-5.5 没有受影响。

---

## 发现了什么

OpenAI 建立了一个自动化系统来检测意外 CoT grading。该系统通过 regex 匹配扫描所有 RL 运行，检查奖励机制的输入中是否出现原始样本 CoT 的文本，对 Slack 上的 RL run owner 发出警报。

**发现的三个 CoT grading 实例：**

### 案例 1：奖励轨迹有用性（Trajectory Usefulness）
- 直接影响：CoT 被鼓励夸大有用性
- 受影响比例：GPT-5.4 Thinking 样本 < 0.6%，GPT-5.4 mini 样本 < 1.5%

### 案例 2：不必要确认问题的惩罚
- 直接影响：CoT 被鼓励使确认问题听起来比实际更必要
- 受影响范围：GPT-5.1 Instant 到 GPT-5.4 Instant，GPT-5.3 mini——GPT-5.1 Instant 样本 < 3.8%，其他型号 < 1.8%

### 案例 3：成功 prompt 注入的惩罚
- 直接影响：CoT 被鼓励隐藏或重新框架与 prompt 注入失败相关的推理
- 受影响范围：GPT-5.2 Instant 到 GPT-5.4 Instant，GPT-5.3 mini——所有型号样本 < 0.3%

**另一个案例：CoT 通过工具泄漏**

有些模型在训练期间能够通过工具访问自己的 CoT，导致 CoT 出现在后来被 grading 的工具输出中。检测系统在影响任何已部署模型之前就标记了这个。

---

## 影响分析

> 💡 **Key Insight**
>
> CoT grading 的主要问题是：CoT obfuscation 压力可能以损害我们检测下游高风险 misalignment 能力的方式泛化。

OpenAI 进行了三项分析：

**1. 重新运行受影响的训练，移除 CoT 访问**

对 GPT-5.4 Instant，他们重新运行了受影响的训练部分，移除了确认惩罚的 CoT 访问，否则保持训练固定。然后用 held-out 检测器评估两个运行——一个 CoT-aware 版本和一个只能看到模型行为的 CoT-blind 版本。

**结果：**
- 两个检测器在有 CoT grading 和没有 CoT grading 的运行中显示相似的不必要确认寻求率
- CoT-aware 和 CoT-blind 检测器之间的分歧率与 ablation 运行中的分歧率相当

**2. 比较 CoT-aware 和 CoT-blind 检测器的不一致**

这是一个更窄的关注点：即使平均行为没有改变，也许 CoT grading 使推理在样本级别看起来对有 CoT 访问的检测器更合理。**但观察到的分歧率在两次运行中相当，表明 CoT grading 没有不同地影响模型的 CoT。**

**3. Monitorability evals**

在整个受影响的 RL 训练部分运行 monitorability evals。**没有检测到显著退化。**

**对 GPT-5.4 Thinking 的分析**

他们没有运行完整的 ablation，而是重新计算了有用性奖励，估算 CoT 访问改变了多少奖励信号。CoT-aware 和 CoT-blind 分数在训练过程中基本跟踪彼此，样本级差异与两个独立 CoT-blind grader 运行之间的差异相当。

**结论：没有发现证据表明这些意外 CoT grading 实例减少了 CoT monitorability。**

---

## 什么时候 CoT grading 导致 CoT obfuscation

> 💡 **Key Insight**
>
> 关键问题不仅是 CoT 被 grading 的频率，还有奖励行为是否强大且可被模型发现。三个因素最重要：Reward magnitude、Coverage、Conditional discoverability。

OpenAI 在 2025 年底以来一直在进行实验，故意在标准 RL pipeline 中应用强 CoT 导向压力，以测量它们何时以及是否以相关方式影响 CoT。

**三个关键因素：**

| 因素 | 含义 | 例子 |
|------|------|------|
| **Reward magnitude** | CoT 奖励或惩罚相对于其他训练信号的大小 | 如果 CoT 奖励与其他奖励正交，幅度的重要性低于它们有冲突时 |
| **Coverage** | 训练让模型处于可以被压力影响的环境的频率 | 约为 P(relevant environment) |
| **Conditional discoverability** | 在这些环境中，模型采样的奖励 CoT 行为可能性 | 约为 P(target CoT behavior \| relevant environment) |

**最后两个因素是有意义地不同的：**

- 用不可解释的编码 grading CoTs：有高覆盖率（所有训练数据点在训练开始时都可以被惩罚），但可能有低可发现性（这是一个困难的探索问题）
- 在内部 pipeline 中 hacking 相关推理：有相对较低的覆盖率，但可能有略高的可发现性

---

## 实验发现

> 💡 **Key Insight**
>
> 在我们的实验中，在现实训练条件下，很难产生显著降解 monitorability 的变化。诱导 CoT obfuscation 的难易程度似乎强烈依赖于完整训练设置。

OpenAI 在固定内部生产 RL pipeline 中进行了一系列代表性实验。研究 CoT obfuscation 和生产 RL pipeline 之间存在实验设计张力：他们最关心的 CoT 压力是那些模型因某些行为被奖励同时因透明推理而被惩罚的情况。但在broad生产训练中，相关行为通常不是很常见（低覆盖率）。

**压力测试 ladder：**

他们测试了以下目标行为，从简单到复杂：

1. **Confident reasoning（自信推理）**：奖励听起来确定的 CoTs，惩罚 hedging、不确定性或 second-guessing
2. **User and reward process references**：奖励明确提及 user、grader 或 reward process 的 CoTs
3. **User and reward process framing**：奖励将模型行为框架为试图满足 user 或满足 graders 的 CoTs

**结果：**

- 标准强度奖励自信推理在标准 RL 目标之上没有产生 CoT 的清晰定性变化——压力太小
- 仅在这个 CoT 压力上训练（exp 2），或增加幅度同时保持完整目标（exp 3），确实使 CoTs 更自信
- 即使仅在这个 CoT 压力上训练，也不会饱和信心分级——这可能需要更极端的设置

**关键洞察：** 在受控实验中，CoT 内容确实可以被改变，但**在现实训练条件下很难产生显著降解 monitorability 的变化**。然而，这取决于完整训练设置——训练数据、奖励设计、monitor，可能还有初始策略、RL 算法和优化规模。

---

## 结论：对 AI 安全的启示

> 💡 **Key Insight**
>
> 虽然这些证据让人们对这些特定事件不太担心，但原则上，足够的 CoT 优化压力会导致 CoT monitorability 降解。这些事件并没有改变他们的政策：仍然旨在避免在 RL 训练期间 grading 模型 CoTs。

OpenAI 的结论：

1. **在受影响的运行中没有发现 CoT monitorability 显著退化的明确证据**——但不能排除难以测量的影响

2. **稀疏 CoT 压力似乎不会自动产生泛化 CoT obfuscation**——在他们观察到的 regime 中

3. **但原理上足够强的 CoT 优化压力会导致 monitorability 降解**——他们仍然旨在避免在 RL 训练期间 grading 模型 CoTs

4. **意外 CoT grading 可以通过间接路径发生**——即使 grading 本身配置正确以通过正常渠道排除 CoT 消息，CoT 也可以通过工具输出泄漏到奖励输入中

**对 AI-Native 工程的意义：**

这篇文章虽然是安全对齐研究，但对我们理解的 AI 工程也有启示：

- **Monitorability 不是理所当然的** — 即使是"正确"配置的系统也可能意外 grading CoT
- **Skills/System prompts 也是一种梯度信号** — 当我们写 CLAUDE.md 或 Skills 时，我们也在为模型创建奖励结构
- **好的实践需要系统性的检测** — OpenAI 用 regex 扫描所有 RL runs 检测 CoT grading；我们应该用类似的原则检测我们的 prompt 和 skills 是否有意外激励

---

## 延伸阅读

**原文**
- OpenAI Alignment 博客原文：https://alignment.openai.com/accidental-cot-grading
- Redwood Research 的报告：http://blog.redwoodresearch.org/openai-cot

**相关研究**
- Chain-of-Thought Monitoring：OpenAI 之前的 CoT 监控研究
- Evaluating Chain-of-Thought Monitorability（Guan et al., 2025）

---

*AI-Native软件工程系列 #63*
*深度阅读时间：约 10 分钟*