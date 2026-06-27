---
layout: post
title: "Loop Engineering：把\"你\"从流程里抽出来"
date: 2026-06-27T10:00:00+08:00
tags: [AI-Native软件工程, Loop Engineering, Agent, 工程效能]
author: "@postcodeeng"
series: AI-Native Engineering
---

2026年6月7日，Peter Steinberger（OpenClaw 创始人、OpenAI 开发者）在 X 上发了一条帖子，24小时内获得了超过五百万次浏览：

> "You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents."

几乎同时，Anthropic Claude Code 的创始人兼负责人 Boris Cherny 在红杉资本 AI Ascent 大会上说了几乎同样的话：

> "I don't prompt Claude anymore. I have loops running that prompt Claude and figuring out what to do. My job is to write loops."

Google 工程总监 Addy Osmani 在自己的博客上把这件事正式命名为 **Loop Engineering**，并拆解了它的完整架构。GitHub 用户 Cobus Greyling 在帖子发出后数小时内建了仓库 [cobusgreyling/loop-engineering](https://github.com/cobusgreyling/loop-engineering)，收录 7 个生产级模式、CLI 工具和失败案例——这个速度本身就是这件事影响力的证明。

三周后，LangChain 的 Sydney Runkle 在官方博客上发表《The Art of Loop Engineering》，把 Osmani 的概念落地成了 LangChain 框架的四层堆叠，每层都给了具体的 LangChain 原语。这是 Loop Engineering 从概念到工程实现的完整映射。

## 核心定义

Osmani 的原文定义值得完整引用：

> "Loop engineering is replacing yourself as the person who prompts the agent. You design the system that does it instead. A loop here can be thought of a recursive goal where you define a purpose and the AI iterates until complete."

关键不是"更快的自动化"，而是**人从执行链里被替换出来**。你设计系统，系统替你跑腿。

## 通用工作流：五阶段循环

Osmani 提出的通用 Loop 架构，所有编码循环——无论单 Agent 还是多 Agent——都遵循完全相同的五阶段，直到满足可验证的停止条件：

<object data="/assets/images/2026-06-27-loop-engineering-02-flow.svg" type="image/svg+xml" width="100%"></object>

**停止条件**是整个循环的核心：必须是可验证的证据，不是"看起来对了"。test pass / build clean / reviewer sign-off——没有证据就不算完成。这条原则 Osmani 自己在项目 README 里说得最狠：**"AI coding agents default to the shortest path — which often means skipping specs, tests, security reviews, and the practices that make software reliable."** 技能的作用，就是强制代理不走那条最短路径。

## Osmani 的六块积木

Osmani 把 Loop 系统拆成五个结构性组件，外加一个跨会话记忆层：

**1. 自动化（Automations）——心跳**

让 Loop 真正成为"循环"的部分。在 Codex App 里，Automations tab 让你选择项目、prompt、频率、环境，产出自动进入 Triage 收件箱。Claude Code 用 `/loop` 做定时任务，用 `/goal` 做目标驱动——后者持续运行直到停止条件成立，每轮结束后由**独立的评估模型**判断是否完成，而不是干活的那个模型自己判断。

**2. 工作树（Worktrees）——并行安全**

当你同时跑超过一个 Agent，文件碰撞就开始了。Git worktree 的解法：在同一个仓库历史上切出独立工作目录，一个 Agent 的修改物理上碰不到另一个。Claude Code 用 `--worktree` flag 给每个 session 独立工作区。

**3. 技能（Skills）——项目知识不再每次从零推导**

没有 skill，Agent 每次会话都像金鱼一样忘记一切。有 skill，项目的编码规范、踩过的坑、构建步骤，在你第一次写下之后就永远生效。Osmani 把这叫 **Intent Debt**——skill 就是把意图写在外面，Agent 每轮读取，不重复消耗。

**4. 插件与连接器（Plugins & Connectors）——Loop 碰到真实工具**

只能看文件系统的 Loop 是一个小的 Loop。基于 MCP 协议的连接器让 Agent 能读取 Issue Tracker、查数据库、hit staging API、在 Slack 发消息。Osmani 的原话：**"Loop 能说'修复方案在这里'和'Loop 自动开 PR、更新 Linear 工单、在 CI 变绿后通知相关人'之间，隔着连接器的距离。"**

**5. 子 Agent（Sub-agents）——写代码的不打分**

这是 Osmani 认为 Loop 里"最有用的结构性组件"：**把写代码的和检查代码的拆成两个 Agent。** 模型对自己写的代码打分太容易放水；第二个 Agent 配不同的指令，甚至有时用不同的模型，专门负责挑毛病。

Claude Code 的 `/goal` 在底层就是这么运作的：一个独立的模型判断 Loop 是否完成，而不是执行工作的那个模型。

**6. 记忆（Memory / State）——模型的遗忘写在磁盘上**

Agent 在两次运行之间会忘记一切，但磁盘不会。Memory 可以是一个 Markdown 文件，可以是一个 Linear 看板，活在单个会话之外。Osmani 的原话：**"The agent forgets, the repo doesn't."**

## Sydney Runkle 的四层堆叠：LangChain 的实现映射

Osmani 给了概念框架；Sydney Runkle 在 LangChain 官方博客上把它落地成了四层，每层都有具体的 LangChain 原语：

| 循环层级 | 作用 | 影响 | LangChain 原语 |
|---|---|---|---|
| **1. Agent Loop** | 模型反复调用工具，直到任务完成 | 自动化工作 | `create_agent` + 任何支持的模型 |
| **2. Verification Loop** | Agent 运行后按 rubric 打分，失败则带反馈重试 | 确保工作质量和正确性 | `RubricMiddleware` 或 `after_agent` hook |
| **3. Event-driven Loop** | 事件触发 Agent 运行，实时更新真实系统 | 自动化工作规模化 | LangSmith Deployment（cron/webhook）或 Fleet channels |
| **4. Hill Climbing Loop** | 生产轨迹喂给分析 Agent，持续改进 harness 配置 | harness 改进 | LangSmith Engine |

<object data="/assets/images/2026-06-27-loop-engineering-01-stack.svg" type="image/svg+xml" width="100%"></object>

**第一层（Agent Loop）** 是最基础的：模型加工具，在循环里调用直到任务完成。LangChain 的 `create_agent` 给的就是这个能力——选模型、插工具，Loop 就转起来了。

**第二层（Verification Loop）** 是关键的加质量机制：Agent 输出后，由一个独立的 grader 按 rubric 检查，失败则带反馈重试。Runkle 强调："自动化 grader 可以检查链接是否可访问；但只有人能注意到面向对象的框架对目标受众来说是不对的。" grader 可以是确定性的（如正则检查），也可以是 agentic 的（LLM as a judge）。成本代价是增加延迟和单次运行成本——但当质量比速度重要时，这是值得的，而大多数生产场景恰恰如此。

**第三层（Event-driven Loop）** 把 Agent 接入真实生态系统：定时触发、webhook、新文档到达——任何事件都可以触发 Agent 运行。Agent 不是你手动调用的东西，而是 larger system 里持续运行的组件。LangChain 的 Fleet 平台用 channels 和 schedules 处理这类触发，Runkle 举了自己内部文档 Agent 的例子：当 `#docs-pls` Slack 频道有消息时，Agent 自动启动。

**第四层（Hill Climbing Loop）** 是 Runkle 认为最有价值但最少被讨论的一层：每次 Agent 运行都会产生一条 trace（模型做了什么、调用了什么工具、grader 反馈是什么），Hill Climbing Loop 跑一个分析 Agent 去读这些 trace，用发现的结果重写 harness 配置——prompt 调整、工具调整、grader 调整。关键是 return arrow 不只回到顶层，而是直接修改 Agent Loop 本身——每轮外部循环都让内部循环更有效。

Runkle 的原话：**"前三层自动化工作。第四层——也是最重要的一层——自动化改进。"**

对于运行开源模型的团队，第四层可以进一步连接到 RL fine-tuning：用 trace 或 eval 结果作为训练信号，直接改进模型本身。

## 七种生产级模式

Cobus Greyling 的仓库收录了 7 个完整的 Loop 模式，每个都有 token 成本估算、适用频率和 starter 克隆包：

| 模式 | 频率 | Token 成本 | 说明 |
|---|---|---|---|
| **Daily Triage** | 1天-2小时 | Low | 扫描 CI 失败、Open Issue、最近提交，写入报告 |
| **PR Babysitter** | 5-15分钟 | High | 持续监控 PR，自动修复 build 报错 |
| **CI Sweeper** | 5-15分钟 | Very High | 持续清理 CI 失败，适合高频率构建 |
| **Dependency Sweeper** | 6小时-1天 | Medium | 检查依赖更新，安全地打 patch |
| **Changelog Drafter** | 1天或 tag 时 | Low | 自动生成 changelog |
| **Post-Merge Cleanup** | 1天-6小时 | Low | 合流后清理 dead code、测试 |
| **Issue Triage** | 2小时-1天 | Low | 分类 Issue，写入建议处理方案 |

仓库还提供三个 CLI 工具：`loop-audit`（评估 Loop 就绪程度）、`loop-init`（按模式生成脚手架）、`loop-cost`（Token 消耗估算器）。

## 思想史：ReAct 的基因

理解 Loop Engineering 需要从它的理论根开始。

2022年10月，普林斯顿大学和 Google 联合发表了《ReAct: Synergizing Reasoning and Acting in Language Models》（arXiv:2210.03629，Yao et al.）。核心思想：**让 LLM 交替进行"思考"和"行动"，每做一步就停下来想想，然后决定下一步。**

工作循环：Thought → Action → Observation → ... → Final Answer

关键发现：在 ALFWorld 和 WebShop 两个交互式决策基准上，ReAct 优于当时的 imitation learning 和 reinforcement learning 方法，绝对值提升 **+34%** 和 **+10%**，只用了 1-2 个 in-context examples。

ReAct 是 Loop Engineering 的理论祖先。ReAct 解决"单步推理+行动"的局部问题；Loop Engineering 要解决"整条流水线如何持续运转"的全链路问题。

## Boris Cherny 的实践样本

2026年1月，Fortune 杂志报道了 Cherny 在 X 上发布的具体数字：他已经超过两个月没有手写一行代码。"昨天提交了 22 个 PR，前天 27 个，每个 PR 都是 100% 由 Claude 写的。"Claude Code 上线后，Anthropic 整体人均工程产出提升 **150%**。

他的具体工作流：同时跑 **5 个 Claude 实例**，每个在各自的 git worktree 和独立分支上。他把 Claude Code 看作**一组 workers**，不是单个助手。所有编码任务用 Opus 4.5 并开启 Thinking 模式。"慢一点，但错误少得多。"

## Uber 的教训：成本不设防会怎样

有正面案例，也有反面教材。

2026年4月，Uber CTO Praveen Neppalli Naga 向管理层汇报：2026年全年准备的 AI 工具预算，在前四个月全部花完。以每人每月 1000 美元中位数计算，涉及约 **2400 万美元**。两个月后出台新规：每位员工、每款 AI 编码工具，**每月调用上限 1500 美元**。

## 三个问题不会因为 Loop 变好而消失

Osmani 在文章结尾花大量篇幅讲三个风险，而且他的观点是"这些问题随着 Loop 变好会变得更尖锐"：

**验证还是你的活**：Loop 无人值守运行，同时也在无人监督的情况下犯错。拆出 verifier sub-agent 是为了让 Loop 的"完成了"有意义，但"完成了"仍然是声明，不是证明。

**理解还是会烂**：Loop 替你写的代码越多，你和代码库之间的理解差距越大。Osmani 把这叫 **Comprehension Debt**（认知债务）。

**舒服的姿势是最危险的**：当 Loop 自己跑得欢的时候，极易停止形成自己的判断。Osmani 把这叫 **Cognitive Surrender**（认知投降）。

Runkle 在 LangChain 的文章里则从另一个角度补充了人机协作的必要性：**"自动化不等于把人类从循环里移除。在每一层，都有天然的人类介入点。"** 比如 Verification Loop 里，敏感工作流可以让人扮演 grader；Hill Climbing Loop 里，harness 改进在部署前可以走人类 review。

他的原话：**"Satya Nadella 把这个组织层面的赌注说得很清楚：尽早建立学习循环——让人类判断和 token 资本相互复利的公司——会建立起难以复制优势。"**

## 结尾

Loop Engineering 是 AI 编程范式的一次真正跃迁。它的意义不在于"更快的自动化"，而在于它改变了人和 AI 之间的权力结构：人从操作者变成了设计师。

但这个转变的代价是：**你的判断力必须比 AI 更早介入，而不是更晚。**

ReAct 给了 Loop Engineering 理论基础（+34% on ALFWorld，+10% on WebShop）。Boris Cherny 给了实践样本（22 PRs/day）。Cobus Greyling 的仓库把它变成了可复用的工具包（7 种模式 + CLI 工具）。Sydney Runkle 的 LangChain 四层堆叠给了完整的工程实现映射（Agent Loop → Verification Loop → Event-driven Loop → Hill Climbing Loop）。Uber 给了风险警示（4个月 2400 万美元）。

这四个维度放在一起，才是 Loop Engineering 的完整图景。

问题是：谁在为这个系统整体负责？

## 关键数据汇总

| 来源 | 数字 | 含义 |
|---|---|---|
| ReAct 论文 (Yao et al., 2022) | +34% / +10% | ALFWorld/WebShop 基准，超越 RL/IL 方法 |
| Peter Steinberger (@steipete) | 500万+ 浏览 / 24h | 2026年6月7日帖子 |
| Boris Cherny (Fortune, 2026.1) | 22 PRs / 27 PRs（连续两天） | 100% AI 生成的生产力上限 |
| Anthropic | 150% 人均产出提升 | Claude Code 带来的组织级效应 |
| Uber (2026.4) | 2400万美元（4个月）| 无上限 Loop 的成本失控 |
| Uber 新政 | 1500美元/人/月 | 成本控制后的使用上限 |

## 参考来源

- Addy Osmani, "[Loop Engineering](https://addyosmani.com/blog/loop-engineering/)", addyosmani.com, June 7, 2026
- Sydney Runkle, "[The Art of Loop Engineering](https://www.langchain.com/blog/the-art-of-loop-engineering)", langchain.com, June 16, 2026
- Cobus Greyling, [cobusgreyling/loop-engineering](https://github.com/cobusgreyling/loop-engineering) — 7 production patterns + CLI tools
- ReAct: Yao et al., arXiv:2210.03629 (2022)
- Boris Cherny, [Fortune](https://fortune.com/2026/01/29/100-percent-of-code-at-anthropic-and-openai-is-now-ai-written-boris-cherny-roon/), January 29, 2026
