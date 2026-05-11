---
layout: post
title: "Harness Engineering：AI Agent 时代真正的工程竞争在 scaffold 层"
date: 2026-05-13T00:00:00+08:00
tags: [AI-Native软件工程, AI Agent, Harness Engineering, 架构]
author: "@postcodeeng"
series: AI-Native软件工程系列
---

> **TL;DR**
>
> Addy Osmani（Google Cloud AI Director）关于 Harness Engineering 的深度长文：
> 1. **Agent = Model + Harness** — 如果你不是模型，你就是 harness
> 2. **好 harness 胜过大模型** — 同一个模型在差 harness 里得分远低于在好 harness 里
> 3. **每个错误变成一条规则** — 失败是永久信号，不是可以重试后忘记的一次性事件
> 4. **竞争在 scaffold 层收敛** — 顶级 coding agents 的 harness 越来越像，模型越来越不重要

---

## 📋 本文结构

1. [Agent = Model + Harness](#agent--model--harness) — 核心等式
2. [Harness 到底是什么](#harness-到底是什么) — 六层组件
3. [重 reframing"skill issue"](#重-reframing-skill-issue) — 不是模型问题，是配置问题
4. [棘轮效应：每个错误变成一条规则](#棘轮效应每个错误变成一条规则) — 永久化改进
5. [从行为倒推 harness 设计](#从行为倒推-harness-设计) — 六层基础构件
6. [Harness 不缩小，只是移动](#harness-不缩小只是移动) — 模型好了，scaffold 不会消失
7. [结论：竞争在地基](#结论竞争在地基)

---

## Agent = Model + Harness

> 💡 **Key Insight**
>
> 一个 decent model 加 great harness 持续打败一个 great model 加 bad harness。今天模型能理论上做的和你实际看到它们做的之间的差距，在很大程度上是 harness 差距。

Addy Osmani 是 Google Cloud AI Director，曾在 Chrome 团队。他这篇关于 Harness Engineering 的文章获得了 70 万 views。

核心等式：

```
Agent = Model + Harness
```

如果模型不是你在做的事情，那你在做的事情就是 harness。

这个等式非常重要。过去两年整个行业在争哪个模型最聪明、哪个写 React 最干净、哪个 hallucinate 最少。这些讨论有价值，但它错过了系统另一半的东西：**模型只是一个运行中 agent 的输入之一**。

其余都是 harness：prompts、tools、context policies、hooks、sandboxes、subagents、feedback loops、wrapped around the model 的 recovery paths。

**Claude Code、Cursor、Codex、Aider、Cline——本质上都是 harnesses。** 底层模型可能跨平台都一样，但你体验到的行为是由 harness 主导的。

---

## Harness 到底是什么

> 💡 **Key Insight**
>
> Raw model 不是 agent。只有当 harness 提供给它状态、工具执行、feedback loops 和可强制执行的约束时，它才变成 agent。

Addy 给出了 harness 的具体组成：

**1. 指令文件**
- System prompts、CLAUDE.md、AGENTS.md、skill files、subagent instructions

**2. 工具**
- Tools、skills、MCP servers 及其技术描述

**3. 基础设施**
- 文件系统、sandboxes、headless browsers

**4. 编排逻辑**
- Spawning subagents、handling handoffs、routing models

**5. Hooks 和中间件**
- 确定性执行的钩子，如 lint 检查或 context compaction

**6. 可观测性**
- Logs、traces、cost 和 latency 计量

| 组件 | 作用 | 例子 |
|------|------|------|
| 指令文件 | 告诉 agent 怎么做 | CLAUDE.md, AGENTS.md |
| 工具 | agent 能做的事 | bash, file edit, MCP |
| 基础设施 | agent 的工作环境 | sandbox, filesystem |
| 编排逻辑 | 多 agent 协调 | subagent spawn, handoffs |
| Hooks | 强制执行约束 | pre-commit, type check |
| 可观测性 | 监控调试 | logs, traces |

---

## 重 reframing "skill issue"

> 💡 **Key Insight**
>
> 工程师倾向于在 agent 做了蠢事时责怪模型，说是"等待下一个版本"的问题。Harness engineering 的思维方式拒绝这种默认。失败通常是可读的。

HumanLayer 有一句话精辟地总结了这个现象：**"It's not a model problem. It's a configuration problem."**

Addy 列举了几个例子：

- 如果 agent 忽略了一个规范 → 把它加到 AGENTS.md
- 如果 agent 运行了破坏性命令 → 写一个 hook 阻止它
- 如果 agent 在 40 步任务里迷失 → 拆分成 planner 和 executor
- 如果 agent 总以 broken code 结束 → 在循环里接入 type-checking back-pressure signal

**性能基准测试证明了这一点：** 一个领先模型跑在现成框架里，分数往往远低于同一个模型跑在定制的、高度调优的 harness 里。把模型移到一个有更好 codebase tools、更紧 prompt、更sharp back-pressure 的环境，可以解锁原 setup 留下的能力。

---

## 棘轮效应：每个错误变成一条规则

> 💡 **Key Insight**
>
> Harness engineering 最重要的习惯是把 agent 错误当作永久信号——不是一次性可以重试后忘记的 fluke。如果 agent 提交了一个 PR，里面有被注释掉的测试然后被 merge 了——那是一个输入，不是可以忽略的事件。

**这条原则我们这周见过三次了：**
- Garry Tan：每次失败变成一个 skill，每次 skill 有测试每天跑
- Mnimiy：每次失败追加一条规则到 CLAUDE.md
- Addy：每次失败是 harness 的输入，不是模型的问题

Addy 的表达最精确：**约束只在你观察到真实失败时添加，只在有能力的模型让它冗余时移除。**

好的 system prompt 里的每一行都应该追溯到一个具体的、历史性的失败。因为这个，harness engineering 是一个 discipline，而不是一个 one-size-fits-all framework。**正确的 harness 对于特定 codebase 来说，完全是由其独特的失败历史塑造的。**

---

## 从行为倒推 harness 设计

> 💡 **Key Insight**
>
> 设计 harness 最有效的方式是从期望的行为开始，然后构建交付它的组件。如果一个组件的存在不能对应一个具体行为，它就应该被移除。

Addy 描述了六层基础构件：

**1. 文件系统和 Git — 持久状态**
模型只能在它们的上下文窗口能容纳的内容上操作。文件系统提供了工作区来读取数据、offload 中间工作、多 agent 协调的界面。Git 提供免费版本控制，让 agent 跟踪进度、分支实验、回滚错误。

**2. Bash 和代码执行 — 通用工具**
大多数 agent 操作一个 ReAct loop：reason、act via a tool call、observe、repeat。不需要为每个可想象的动作预建工具，给 agent bash 访问让它可以按需构建所需的东西。

**3. Sandboxes 和默认工具**
Bash 只有在安全运行时才有用。Sandbox 提供隔离环境让 agent 运行代码、检查文件、验证工作，不冒风险。好的 sandbox 带有强默认：预装语言运行时、测试 CLI、headless browsers。

**4. 内存和搜索 — 持续学习**
模型没有beyond训练权重和当前上下文的知识。Harness 用内存文件（如 AGENTS.md）桥接这个 gap，在每个 session 注入知识。对于实时信息（新的库版本、live data），web search 和 MCP 工具直接 bake 进 harness。

**5. 对抗 Context Rot**
模型在上下文窗口填满时推理退化。Harness 用三种技术管理稀缺：
- **Compaction**：智能摘要和 offload 旧上下文，防止 API 错误
- **Tool-call offloading**：把巨大的 tool 输出（如 2000 行日志）存文件系统，只在上下文里保留 essential headers
- **Progressive disclosure**：只在任务明确需要时 revealed instructions 和 tools，而不是启动时全部加载

**6. 长时执行**
自主的长时工作 suffer from early stopping 和差的 problem decomposition。Harness 用结构设计对抗：
- **Loops**：拦截模型退出尝试，强迫它基于 completion goal 在新上下文窗口继续
- **Planning**：强迫模型把目标分解成逐步 plan file，在每步后通过 self-verification hooks 检查工作
- **Splits**：把 generation 和 evaluation 分离到不同 agent，防止模型对自己工作的 inherent positive bias

---

## Harness 不缩小，只是移动

> 💡 **Key Insight**
>
> 随着模型改进，harness 的需求不会消失——它会移动。随着 floor 提高，ceiling 也提高。之前够不到的任务现在可以做了，带来全新的失败模式。

Addy 指出了一个反直觉的趋势：更好的模型让人以为 scaffolding 会变得过时。实际上不是。**每个 harness 组件 encode 一个假设：模型不能独立做什么。当模型改进，过时的 scaffolding 应该被移除，新的 scaffolding 必须被建起来到达下一个地平线。**

他还指出了一个训练循环的反馈：今天的模型 often 是 post-trained with specific harnesses in the loop，产生一定程度的 overfitting。模型对 harness 设计者优先考虑的具体动作（filesystem ops、bash、subagent dispatch）异常擅长。

这让 harness 成为一个 living system，不是静态配置文件。**"最好的" harness 是为你的独特任务和工作流优化的那个。**

---

## 结论：竞争在地基

> 💡 **Key Insight**
>
> 如果你看看今天 top coding agents，它们相互之间比和它们的底层模型更相似。模型不同，但 harness patterns 在收敛。行业在快速识别把 generative text 变成 shippable software 所需的 load-bearing scaffolding。

Addy 展望了几个方向：
- 多 agent 并行编排
- Agent 能分析自己的 traces 来修复 harness-level 失败
- 动态即时组装工具的环境

最终，harness 会从静态配置文件变成更像 compilers 的东西。

**这是我们这周一直在追踪的同一主题的权威版本：** Garry Tan 的 skillify、Mnimiy 的 CLAUDE.md rules、Saito 的 Missions、这条 Addy 的 Harness Engineering——全都在说同一件事：**AI 时代的工程竞争在地基（scaffold），不在模型本身。**

---

## 延伸阅读

**原文**
- Addy Osmani's Agent Harness Engineering（英文）：https://x.com/addyosmani/status/2053231239721885918
- Claude Code 架构分析（Fareed Khan）：https://levelup.gitconnected.com/building-claude-code-with-harness-engineering-d2e8c0da85f0

**本系列相关**
- [执行已死，判断力永生](#) (AI-Native 软件工程系列)
- [Skillify：如何让 AI Agent 不再犯同样的错误](#) (AI-Native 软件工程系列)

**核心概念**
- HumanLayer：agent failures as configuration "skill issues"
- 《Working Backwards》— 从期望行为倒推系统设计

---

*AI-Native软件工程系列 #58*
*深度阅读时间：约 9 分钟*