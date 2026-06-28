---
layout: post
title: "\"Auto-Improving Software：coding agents 自己构建、运行、改进自己的平台\""
date: 2026-05-13T12:00:00+08:00
tags: [AI-Native软件工程, AI-Agent, Self-Improvement, Claude-Code, Platform-Engineering]
author: Aaron
series: AI-Native Engineering
---

> **TL;DR**
>
> 本文核心观点：
> 1. **Agent 开发平台是第一个可以自我改进的软件类别** — 因为 action、data、iteration tool 全都集中在一个地方
> 2. **五 prompt 循环覆盖整个 agent 开发生命周期** — Create / Improve / Extend / Hill Climb / Review
> 3. **Auto-improvement 的三个设计原则** — API 暴露一切 / 数据集中 / logs over everything
> 4. **Improve → Hill Climb 递归循环** — agent 自己对抗性测试自己，发现失败就修复，修复完再测试，直到通过

---

## 五个 prompt 覆盖完整生命周期

大多数 agent 开发平台只解决"创建"这一步，然后让开发者在其他地方完成测试、部署、迭代。

Ashpreet Bedi 的平台不一样——它用五个 prompt 覆盖整个 agent 开发生命周期：

> 💡 **Key Insight**
>
> Agent platforms are the first category of software where the actions, data, and the iteration tool all sit close enough that a coding agent can test end-to-end, make code changes, and test again until the agent improves.

### Create

Scaffolds a new agent。从零构建一个新的 agent scaffold。

### Improve

Hardens an existing agent against its own spec。发现 agent 在某些场景下失败 → 对抗性测试 → 修复。

### Extend

Adds new capabilities to an existing agent。为已有 agent 添加新能力，小步验证增量。

### Hill Climb

Runs the eval suite, diagnoses failures, fixes what's in scope。运行评估套件、诊断失败、修复范围内的问题。

### Review

Sweeps the repo for drift between docs, code, and config。自动修复文档、代码、配置之间的漂移。

---

<object data="/assets/images/2026-05-13-auto-improving-software-01-cycle.svg" type="image/svg+xml" width="100%"></object>

## 为什么 auto-improvement 现在才可能

大多数软件无法 auto-improve，因为它的输入和输出分散在多个工具之间。

要运行 auto-improvement 循环，coding agent 需要从三个不同工具拼装数据——每个工具背后有独立的认证体系、自己的操作方式。

理论上可行。实际上摩擦太大。

Ashpreet Bedi 的代码库从一开始就是为 auto-improvement 设计的：

- Coding agent 可以测试一个 agent
- 然后通过读取 sessions、traces、logs 判定 PASS 或 FAIL
- 如果 agent 失败了，它编辑 agent 代码，然后再次运行

---

## Create：从 prompt 到 agent 需要多久

Ashpreet Bedi 在 Claude Code 里输入的不是一个完整的 agent spec，而是一个粗略的意图："帮我建一个能总结 Slack 消息的 agent"。就这么一句话，没有工具列表、没有边界条件、没有部署方案。

然后 Claude 接过这句话，开始它的工作：先问几个问题澄清需求——agent 需要读取哪个频道、输出格式是什么、要不要定时运行——通过多轮对话把模糊的意图变成可执行的 spec。接着通过 MCP 协议查 Agno 文档，找到合适的 toolkit，把 scaffold 文件生成出来，在 `app/main.py` 里注册这个新 agent，重启 Docker 容器让改动生效，最后用 cURL 发一条测试请求验证它真的在跑。从第一行 prompt 到可运行的 agent，**5-10 分钟**。

这个速度改变了他愿意构建的东西。因为平台自动处理了所有基础设施工作——容器、网络、注册表——他开始构建一些以前根本不值得花时间做的 agent：总结隔夜 Slack 消息的 agent、起草每周汇报的 agent、标记 repo 里重要问题的 agent。这些任务以前撑不过一个多日项目。现在一个 coffee break 就能搞定一个。

---

## Improve → Hill Climb 递归循环

Improve 和 Hill Climb 构成了一对自我强化的递归循环：Improve 用对抗性测试硬化 agent，Hill Climb 用评估套件诊断失败，然后两者交替直到停止条件成立。整个过程不需要人工干预。

具体来看，Improve 的核心逻辑是"让 agent 对抗自己"。它先读取 agent 的 spec，然后故意构造边界情况、注入噪声数据、模拟异常输入——如果 agent 在任何场景下崩溃，Improve 就把失败 trace 记录下来，生成修复 prompt。Hill Climb 则接过这些失败记录，运行完整的 eval 套件，逐条判定哪些通过了、哪些还在失败，把诊断结果写回 agent 的修改队列。这是一个"失败→诊断→修复→再测试"的持续循环，每次迭代都让 agent 的能力边界往外扩一点，同时让它在自己划定的 spec 内更可靠。

Ashpreet Bedi 的代码库里，这个循环跑在本地 Docker 上，每次迭代的反馈周期大约 5 秒。Agent 读取 live logs，看到自己哪条 case 失败了，立刻编辑代码，然后重新跑——整个过程在几分钟内完成，不需要人盯着。这意味着在睡一觉之前，一个 agent 可以经历几十次改进循环，从"勉强能跑"变成"能应对对抗性测试"。这就是最小监督的真正含义：人只负责设计循环，不负责运转循环。

---

## 三个让 auto-improvement 成为可能的设计

### 1. API 暴露一切

每个关键操作都暴露为 API：运行 agent、读取 session、运行 eval。每个操作都可以用 cURL 或 bash 触发。

这意味着 coding agent 不需要点击 UI，它可以用脚本触发任何操作、读取任何结果。

### 2. 数据集中

Sessions 和 traces 存在同一个 Postgres 数据库里。Agent 触发一次运行，然后读取输出——不需要离开自己的环境。

大多数软件的问题不是"不能改进"，而是"数据和工具不在一个地方"。跨工具的数据搬运打断了改进循环。

### 3. Logs over everything

整个平台跑在本地 Docker 上。Coding agent 读取 live logs，随时看到运行状态。

测试 → 审查循环大约 **5 秒**。Logs 是解锁一切的实时反馈机制。

---

## 结尾

Ashpreet Bedi 说了一句值得记住的话：

> Agent platforms are the first category of software where the actions, data, and the iteration tool all sit close enough that a coding agent can test end-to-end, make code changes, and test again until the agent improves.

**Meaning: the platform that hosts the loop is the first thing the loop improves.**

这和 Garry Tan 的"复杂度棘轮"是同一个思路的系统性实现。棘轮只能向上走，不能向下走——因为平台本身在持续改进，而改进后的平台又能支撑更高效的改进循环。

> 💡 **Key Insight**
>
> The platform that hosts the loop is the first thing the loop improves.

这不是 agent 帮助人类写代码，这是 agent 在帮助人类构建一个能更高效构建 agent 的平台。第一批吃自己狗粮的 AI-native 基础设施。

---

## 相关链接

- **Ashpreet Bedi 原文**：https://x.com/ashpreetbedi/status/2053885390717890757
- **标签**：[#AI-Agent](/tags/#ai-agent) · [#Self-Improvement](/tags/#self-improvement) · [#Platform-Engineering](/tags/#platform-engineering)

---

*本系列相关：*
- *[Skillify：把每次失败变成永久结构性修复的 10 步清单](/skillify/)*
- *[复杂度棘轮：为什么 90% 测试覆盖率是必选项](/complexity-ratchet/)*
