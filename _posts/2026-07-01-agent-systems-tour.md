---
layout: post
title: "AI Agent 系统巡礼：4 种架构范式 + 1 张选择地图"
date: 2026-07-01T11:00:00+08:00
tags: [AI-Native软件工程, Agent, Multi-Agent, Loop-Engineering, 架构选型]
description: "AI Agent 系统不是只有一种形态——按'人从哪里退出循环'分成 4 种范式：单 Agent 协作、流程工具包、技能库、循环工程，每种配一篇锚点。"
author: "@postcodeeng"
series: aise
subtopic: agents-and-multi-agent
---

> **TL;DR**
>
> 评估 AI Agent 系统的最好问题是：**"人从哪里退出循环？"** 答案决定你用哪种架构：
> 1. **单 Agent 协作** — 人还在驱动循环（适合探索期）
> 2. **流程工具包** — 人写流程，Agent 跑（适合团队标准化）
> 3. **技能库** — Agent 知道什么时候用什么能力（适合工程纪律）
> 4. **循环工程** — 人设计循环本身（适合规模化和长期）
> 5. **选错代价高** — 用 L1 范式做 L3 任务，团队会累死

---

## 写给正在选型的工程师

"我们要不要做一个 AI Agent？"——这是 2026 年每个技术团队都会问的问题。

接下来 3 个月你会遇到的选择题会非常多：

- 要不要用 Claude Code？
- 要不要上 gstack？
- 要不要学 agent-skills？
- 要不要做 Loop Engineering？

这四个选项不是"四个工具让你挑一个"，而是**四种不同的范式**。每种范式对"人在哪里"有不同的回答：人在驱动循环？人在写流程？人在设计技能？人在设计循环本身？

> 💡 **Key Insight**
>
> 评估 Agent 系统的最好问题不是"它能做什么"，而是"人从哪里退出循环"。**人退得越深，系统越自动化，但治理责任越大。**

## 4 种范式：一个选择框架

我按"人退出循环的深度"把当前主流的 AI Agent 实践分成 4 种范式。这个框架不来自任何权威，是我从过去 18 个月观察到的工程实践中提炼出来的。

| 范式 | 人在哪 | 适用阶段 | 锚点 |
|------|--------|---------|------|
| **单 Agent 协作** | 驱动循环、随时介入 | 探索期、PoC | [Agent-Driven Debugging](/posts/2026-03-12-agent-driven-debugging/) |
| **流程工具包** | 写流程，Agent 跑步骤 | 团队标准化 | [gstack vs Skills](/posts/2026-03-21-gstack-vs-claude-code-skills/) |
| **技能库** | 设计能力，Agent 调用 | 工程纪律沉淀 | [agent-skills](/posts/2026-06-27-agent-skills/) |
| **循环工程** | 设计循环本身 | 规模化、长期 | [Loop Engineering](/posts/2026-06-27-loop-engineering/) |

这 4 种范式不是升级路径，是并列选项。你的任务**可以同时运行在不同范式上**——比如 debug 用单 Agent 协作，CI 修复用循环工程。

## 范式 1：单 Agent 协作

### 你在这一阶段的特征

- AI 项目刚开始，主要目的是"试试看"
- 你和团队成员直接和 Claude / Cursor 对话
- 任务是一次性的、探索性的、不需要沉淀

### 核心问题

**怎么让 AI 帮你干活，而不是反过来？**

单 Agent 协作的关键不是"让 AI 写更多代码"，而是**重新定义人和 AI 的认知分工**。AI 拿信息处理（~75%），人拿决策判断（~25%）。这个比例不是拍脑袋——是反复观察调试、调研、Code Review 这些工作后总结出来的。

### 锚点文章

**[Agent-Driven Debugging：从调试到诊断](/posts/2026-03-12-agent-driven-debugging/)**

这篇把"调试"重新定义为"诊断"——从猎人变成驯兽师。它会给一个 75/25 法则和一个三层模型（个人诊断助手 → 团队诊断中心 → 组织诊断智能），告诉你如何用 Agent 处理 75% 的信息过载，人专注 25% 的高价值决策。

读完之后，你应该能用 Agent 完成以下任务之一：

- 跨 20 个微服务串日志
- 自动检索相似 bug 案例
- 生成结构化的根因报告

### 范式 1 的退出条件

当你开始**每周重复同样的 prompt**时，你已经准备好进入范式 2。

> 💡 **Key Insight**
>
> 单 Agent 协作的天花板是"个人效率"，不是"团队效率"。**当你的 prompt 库长到队友都记不住的时候，必须升级到流程工具包。**

## 范式 2：流程工具包

### 你在这一阶段的特征

- 单 Agent 协作已经用得顺手
- 但 prompt 在团队里发来发去，质量参差
- 团队开始要求"统一流程"

### 核心问题

**流程沉淀到哪里——文档、prompt、还是工具？**

文档没人看，prompt 散在 Slack 里。**真正的答案是工具。** 把流程封装成命令 / Skill，团队成员输入一个命令就走完一整套标准动作，AI 的具体实现被工具封装掉。

这就是 Garry Tan 的 gstack 和 Anthropic 官方的 Skills 出现的原因。

### 锚点文章

**[gstack vs Claude Code Skills：AI 编程的两种哲学](/posts/2026-03-21-gstack-vs-claude-code-skills/)**

这篇会颠覆一个常见误解：gstack 和 Skills 不是对立的两种哲学，而是**不同层次的协作**。

- **Skills** 是底层能力扩展机制（一个 Skill = 一个文件夹 = 脚本 + 资产 + 数据 + hooks）
- **gstack** 是基于 Skills 构建的开发流程工具（15 个命令覆盖 7 个开发阶段）

关系是：Skills 是乐器制造技术，gstack 是用该技术制造的特定乐器。

读完之后，你应该能回答：**我的团队流程应该用 gstack 这种"开箱即用"的工具，还是从 Skills 开始自建？** 答案是先用 gstack 快速建立流程，再用 Skills 扩展定制能力。

### 范式 2 的退出条件

当你开始**为每个流程都写 Skill 之后，思考"Skill 怎么管理"**时，进入范式 3。

## 范式 3：技能库

### 你在这一阶段的特征

- 流程工具包已经用熟
- Skills 越来越多（10+、20+、50+）
- 你发现 Skills 之间开始重复、互相覆盖、甚至冲突
- 团队开始抱怨"context window 撑爆了"

### 核心问题

**技能是工程纪律——怎么用架构强制 Agent 不做错事？**

范式 2 的问题是"工具太多"，范式 3 的回答是"工具要分层、有纪律"。技能库的核心不是 skill 的数量，而是 skill 的**设计纪律**和**可发现性**。

### 锚点文章

**[AI 编程代理的工程纪律：agent-skills 的反直觉设计](/posts/2026-06-27-agent-skills/)**

这篇是 Addy Osmani 的开源项目。它给的不是"24 个 skill"，而是一套**反自我欺骗机制**——每条 skill 都有一个"反借口表格"，告诉你哪些人类压力下忍不住做的事必须被阻止。

核心设计：

- **三层渐进式披露**：L1 注册（~100 token）→ L2 命中加载 → L3 按需拉取，实现 90% context 省流
- **反借口表格**：把"写完代码再补测试"、"这很简单不需要写 spec"这些借口显式列出来
- **三个元规则**：Surface Assumptions（显式假设）、Manage Confusion Actively（主动管理困惑）、Enforce Simplicity（强制简化，1000 行 vs 100 行 = 失败）
- **Beyoncé Rule**："如果你喜欢它，你应该给它写测试"——基础设施变更不是 bug 发现者，你的测试才是

读完之后，你应该能问自己：**我的 skill 设计是在"该做什么"还是在"不该做什么"？** 99% 的 skill 写错了——它们列动作不列边界。

### 范式 3 的退出条件

> 💡 **Key Insight**
>
> 技能库的成熟标志不是"skill 多"，而是"**agent 知道什么时候该用哪个 skill**"。这要求有 meta-skill（路由层）——这是 90% 团队漏掉的关键。

当你的 skill 库稳定但**任务规模超出人工监督**时，进入范式 4。

## 范式 4：循环工程

### 你在这一阶段的特征

- 技能库已经很完善
- 但你开始问："为什么我还要每天盯着 PR 看 CI 失败？"
- Uber 的故事（4 个月烧光全年预算）让你警觉：循环不设防会失控

### 核心问题

**人在循环里的位置是"操作 AI"还是"设计 AI 运行的循环"？**

这是范式 4 的根本问题。Peter Steinberger（OpenClaw 创始人）和 Boris Cherny（Claude Code 负责人）在 2026 年 6 月的公开陈述是同一句话：

> "You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents."

> "I don't prompt Claude anymore. I have loops running that prompt Claude and figuring out what to do. My job is to write loops."

人从"操作者"变成"循环的设计者"。

### 锚点文章

**[Loop Engineering：把"你"从流程里抽出来](/posts/2026-06-27-loop-engineering/)**

这篇会给你四层堆叠架构（LangChain 的实现映射）：

- **L1 Agent Loop** — 模型反复调用工具直到任务完成
- **L2 Verification Loop** — 独立的 grader 按 rubric 打分，失败则带反馈重试
- **L3 Event-driven Loop** — 事件触发 Agent 运行（cron / webhook / Slack 消息）
- **L4 Hill Climbing Loop** — 跑一个分析 Agent 去读 trace，重写 harness 配置

前三层自动化工作，**第四层自动化改进**——这是 Runkle 认为最有价值但最少被讨论的一层。

读完之后，你应该能画出**你的循环架构图**——从触发到执行到验证到改进，每层用什么 LangChain 原语（或对应工具）实现。

### 范式 4 的隐藏警告

范式 4 不是"自动化越高越好"。Osmani 警告了三个风险：

- **验证还是你的活**：Loop 无人值守运行，同时也在无人监督的情况下犯错
- **理解还是会烂**：Loop 替你写的代码越多，你和代码库之间的理解差距越大（**Comprehension Debt**）
- **认知投降**：当 Loop 自己跑得欢的时候，极易停止形成自己的判断（**Cognitive Surrender**）

Uber 的 2400 万美元账单是第一个风险的具象化。

> 💡 **Key Insight**
>
> Loop Engineering 给出的答案是：**人负责设计循环，AI 负责运转循环，人负责为循环的后果负责。** 这是治理问题，不是技术问题。

## 选型地图

现在你可以问自己：**我现在的任务在哪个范式？**

| 你的问题 | 范式 | 推荐入口 |
|---------|------|---------|
| "我想试试 AI 帮我写代码" | 单 Agent 协作 | [Agent-Driven Debugging](/posts/2026-03-12-agent-driven-debugging/) |
| "团队需要统一的 AI 工作流" | 流程工具包 | [gstack vs Skills](/posts/2026-03-21-gstack-vs-claude-code-skills/) |
| "我们的 skill 越来越乱" | 技能库 | [agent-skills](/posts/2026-06-27-agent-skills/) |
| "我们要把 AI 部署到生产，每天自动跑" | 循环工程 | [Loop Engineering](/posts/2026-06-27-loop-engineering/) |

**重要：范式不是升级路径。** 你的 debug 任务用单 Agent 协作最自然，CI 修复用循环工程最自然，硬要统一到范式 4 反而会让简单任务变复杂。

## 混合架构的常见错误

很多团队会犯一个错误：**用单一范式覆盖所有任务。** 比如"我们决定 all-in Loop Engineering"——这意味着日常 debug 也要走循环，团队会被迫为每条 bug 写 verifier、写 loop、写 grader。

更合理的混合是：

- **探索性任务**（debug、原型设计、调研）→ 单 Agent 协作
- **团队标准流程**（PR review、QA、发布）→ 流程工具包
- **高频重复任务**（代码风格检查、安全扫描）→ 技能库
- **无人值守任务**（CI 修复、依赖更新、报告生成）→ 循环工程

混合架构的关键不是技术，是**任务分类能力**——你能分清"哪些任务值得自动化循环"和"哪些任务应该留给人工判断"。

## 结尾

AI Agent 系统不是只有一种形态。它的形态由**"人从哪里退出循环"**决定。

范式 1（单 Agent 协作）让 AI 当助手，人在驱动；
范式 2（流程工具包）让 AI 跑步骤，人写流程；
范式 3（技能库）让 AI 调用能力，人设计纪律；
范式 4（循环工程）让 AI 跑循环，人设计循环本身。

每一种范式都有自己的天花板和适用场景。**没有"最好的范式"，只有"适合你的范式"。** 用错范式的代价不是技术债，是团队精力被错误的工作流耗尽。

读 4 篇锚点各 15 分钟（总共 60 分钟），比你乱试 3 个月高效得多。

> 💡 **Key Insight**
>
> AI Agent 选型的最常见错误是"追新不追适"——听说 Loop Engineering 很酷就把所有任务都上 Loop，结果简单任务被复杂化，团队累死。**先看任务匹配范式，再选工具。**

---

## 延伸阅读

1. [Agent-Driven Debugging](/posts/2026-03-12-agent-driven-debugging/) — 单 Agent 协作范式
2. [gstack vs Claude Code Skills](/posts/2026-03-21-gstack-vs-claude-code-skills/) — 流程工具包范式
3. [agent-skills 的反直觉设计](/posts/2026-06-27-agent-skills/) — 技能库范式
4. [Loop Engineering](/posts/2026-06-27-loop-engineering/) — 循环工程范式

---

*Published on 2026-07-01
深度阅读时间：约 8 分钟（4 篇合计约 60 分钟）*

Agents and Multi-Agent 子系列 —— 4 种范式一张地图
