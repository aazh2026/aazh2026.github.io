---
layout: post
title: "\"写代码和评代码必须分开：AI 编程的正确 architecture\""
date: 2026-05-26T08:00:00+08:00
tags: [AI-Native软件工程, 代码审查, Multi-Agent, 判断力与执行力分离]
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
>
> 1. **judgment 与 execution 必须分离** — 评判能力需要距离感，执行能力需要沉浸感，这两种认知状态是互斥的
> 2. **单模型无法可靠评判自己的工作** — 它没有能力保持外部观察者视角，总是对自己的作品给出过于正面的评价
> 3. **多模型交叉审查更可靠** — 不同模型的幻觉模式不同，当三个模型都认为某处有问题，误报概率接近于零
> 4. **"慢一点写更好的代码"是正确姿势** — 因为距离感是正确判断的前提，而不是 AI 能力的边界

---

## 一个被忽视的前提

过去一年关于"AI 编程"的讨论，大多集中在"如何让 AI 写出更多代码"。

vibe coding、10x 工程师、slop cannon——这些词暗示的逻辑是：AI 的价值在于加速执行。给它一个 prompt，它吐出一堆代码，你合并它，跑起来，迭代。

但这个逻辑忽视了一个前提：**AI 写的代码，谁来评判？**

如果你让同一个 AI 既写代码又评判代码，你遇到的不是 AI 能力的边界，而是**认知架构的根本限制**。

---

## 执行力和判断力是两种不同的智能

Anthropic 的工程团队在多篇文章里独立发现了同一个 pattern。

> 💡 **Key Insight**
>
> 三个不同的技术决策，背后是同一个认知原则——judgment 和 execution 必须结构性地分离。

在 [Harness Design](/engineering/harness-design-long-running-apps) 里，他们观察到：Generator agent 无法可靠地自我评价，总是对自己的工作给出过于正面的评价。他们解决这个问题的办法是增加一个独立的 Evaluator agent——专门负责挑错，和 Generator 完全分开。

在 [Managed Agents](/engineering/managed-agents) 的架构设计里，他们把"大脑"（推理能力）和"手"（执行环境）解耦。核心洞察是：执行能力和判断能力需要不同的结构，耦合在一起只会互相干扰。

在 [Code Execution with MCP](/engineering/code-execution-with-mcp) 里，他们让 AI 在 execution environment 里做 filtering 和 transformation，而不是把所有中间结果都传回 context。理由是：context window 是有限资源，AI 应该做判断性的工作，而不是被海量数据淹没。

这些看起来是不同的技术决策，但背后有一个统一的认知原则：

**评判能力需要距离感，而执行能力需要沉浸感。这两种认知状态是互斥的。**

> 💡 **Key Insight**
>
> judgment 和 execution 的分离不是组织问题，而是认知架构问题——距离感无法伪造。

## 为什么 AI 无法评价自己的工作

当一个 LLM 说"这段代码写得很好"，这个评价本身就不值得信任。不是因为它会撒谎——它不会——而是因为它没有能力撒谎。

这里的"撒谎"不是有意识的欺骗，而是指：**它无法在评判自己作品的时候，保持一个外部观察者的视角**。它不知道自己写这段代码花了多大力气，不知道自己对这个方案的情感依附，不知道自己其实在某个地方偷了懒然后用漂亮的变量名掩盖了它。

> 💡 **Key Insight**
>
> AI 对自己输出的过度正面评价不是态度问题，而是结构问题——它根本没有"外部视角"这个选项。

这个现象 Nolan Lawson 在他的博客里描述得很清楚：

> "Agents tend to respond by confidently praising the work—even when, to a human observer, the quality is obviously mediocre."

人也会这样。当你自己写了一段代码，你看它的角度和读者看它的角度是不同的。你知道它从哪里来，你知道你为什么这么命名变量，你脑补了那些"应该能看懂的注释"。读者没有这些信息，所以读者比你更容易发现问题。

**评判能力需要某种超脱**——你需要能够把作品当作别人的作品来看。

---

## 多模型交叉审查：ensemble 在代码审查上的应用

Nolan Lawson 描述了他的工作流：

> "Run a Claude sub-agent, Codex, and Cursor Bugbot to find bugs in this PR ranked by critical/high/medium/low."

<object data="/assets/images/2026-05-26-judgment-and-execution-02-ensemble.svg" type="image/svg+xml" width="100%"></object>

这不是简单的"人多力量大"。这是因为**不同模型的幻觉模式是不同的**。当三个模型都认为某处有问题，误报的概率接近于零；当只有一个模型说有问题，你需要人工复核。

这个原则在任何需要判断的领域都成立：医学诊断、金融风控、代码审查。

> 💡 **Key Insight**
>
> 当三个模型都认为某处有问题，误报的概率接近于零——这是 ensemble 方法在语言模型输出验证上的新应用。

这和机器学习里的 ensemble 方法是同一哲学——用多个不同的弱分类器组合成一个强分类器。只不过现在应用在语言模型的输出验证上。

---

## "慢一点写更好的代码"不是倒退

Nolan 的文章标题是 *Using AI to write better code more slowly*。"更慢"在这个语境里是赞美，不是批评。

因为"快"有时候是幻觉。快速产出 500 行没人看懂的代码，然后在生产环境引发一个 bug，这个"快"是假的。真正的快是：花时间理解代码为什么可能失败，然后在合并前把它修好。

这其实就是我一直说的**写作的道理**。写得好不是因为写得快，而是因为你愿意反复审视、修改、让更挑剔的人来看。

Editing is thinking. Review is thinking more carefully.

---

<object data="/assets/images/2026-05-26-judgment-and-execution-01-separation.svg" type="image/svg+xml" width="100%"></object>

## judgment 和 execution 分离是架构原则，不是 AI 的 bug

Unix 的 philosophy of small tools，每个工具只做一件事，用管道连接。这是 judgment/execution 分离在系统设计层面的体现。

测试驱动开发的"红/绿/重构"——先写一个失败的测试（judgment：我知道什么是错的），再写代码让它通过（execution），再重构（judgment：代码可以更好吗）。这是 judgment/execution 分离在开发流程层面的体现。

代码审查制度——一个人写代码，另一个人审查代码。这是 judgment/execution 分离在组织协作层面的体现。

现在，AI 编程揭示的是：在 AI 时代，这个原则依然成立，甚至更重要。因为 AI 模型的执行能力已经很强，但判断能力——特别是对自身输出的判断——依然很弱。结构性地分开它们，才能真正利用 AI 的能力而不是被它的自信误导。

---

## 结尾

下次当你让 AI 写代码的时候，问自己一个问题：**谁来评判它？**

如果答案是"同一个 AI"，你大概会在某个地方付出代价。代价的形式可能是：一个自信满满的 bug，一次没人 catch 的回归，一段没人能维护的代码。

如果答案是"另一个 AI"或者"我"，那才是正确的架构。

但这里的悖论是：人也有自己的距离感问题。我们对自己写的东西同样难以保持客观——只是形式不同，AI 是过度正面，人是过度熟悉。真正的答案可能是：**让判断者和被判断的对象之间的距离，尽可能大**。在不同模型、不同人、不同时间窗口之间切换，才能让距离感真正产生。

慢一点。分开写，分开评。

---

## 延伸阅读

- [Anthropic: Harness Design for Long-Running Apps](/engineering/harness-design-long-running-apps) — Generator-Evaluator 模式
- [Anthropic: Code Execution with MCP](/engineering/code-execution-with-mcp) — 为什么 context window 是有限资源
- [Nolan Lawson: Using AI to write better code more slowly](https://nolanlawson.com/2026/05/25/using-ai-to-write-better-code-more-slowly/) — 多模型交叉审查的实践