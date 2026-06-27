# Loop Engineering：把"你"从流程里抽出来

2026年6月7日，Peter Steinberger（OpenClaw 创始人、OpenAI 开发者）在 X 上发了一条帖子，24小时内获得了超过五百万次浏览：

> "Here's your monthly reminder that you shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents."

几天后，Anthropic Claude Code 的创始人兼负责人 Boris Cherny 在红杉资本 AI Ascent 大会上说了一句几乎同样的话：

> "我现在不再自己给 Claude 写提示词了。我有循环在跑，它们负责提示 Claude 并判断下一步怎么做。我的工作，是写循环。"

2026年1月，Fortune 杂志报道了更激进的数据：Cherny 在 X 上写道，他已经两个月没有手写一行代码了。"昨天提交了 22 个 PR，前天 27 个，每个 PR 都是 100% 由 Claude 写的。"Claude Code 上线后，Anthropic 的人均工程产出整体暴涨 150%。

这个转变有一个名字——Loop Engineering——由 Google 工程师 Addy Osmani 在一篇长文里正式命名。但真正值得问的问题不是"这是什么"，而是"它的理论根在哪里，实践中的具体机制是什么，以及谁在为系统整体负责"。

## 思想史：ReAct 的基因

理解 Loop Engineering 需要从它的理论根开始。

2022年10月，普林斯顿大学和 Google 联合发表了一篇论文，题目叫《ReAct: Synergizing Reasoning and Acting in Language Models》（arXiv:2210.03629，Yao et al.）。它的核心思想用一句话概括：**让 LLM 交替进行"思考"和"行动"，每做一步就停下来想想，然后决定下一步。**

工作循环是：Thought → Action → Observation → Thought → Action → Observation → ... → Final Answer

这篇论文的关键发现是：在两个交互式决策基准（ALFWorld 和 WebShop）上，ReAct 优于当时的 imitation learning 和 reinforcement learning 方法，提升幅度分别是 **+34%** 和 **+10%**（绝对值）。更重要的是，它只用了 1-2 个 in-context examples，就做到了这些。

ReAct 解决的是 LLM 的两个核心问题：**幻觉**（模型在推理链里自己产生错误信息）和**错误累积**（一个中间步骤错了，后面的推理全部建立在错误之上）。通过让模型在每步行动后观察环境反馈再决定下一步，它在 HotpotQA（问答）和 FEVER（事实核查）上也超越了纯 chain-of-thought 推理方法。

ReAct 是 Loop Engineering 的理论祖先。但 ReAct 解决的是"单步推理+行动"的局部问题；Loop Engineering 要解决的是"整条流水线如何持续运转"的全链路问题。

## 四代范式的演进线

Loop Engineering 放在整个 AI 编程方法论的演进序列里看，逻辑更清晰：

**第一代：Prompt Engineering（~2024）**。人写一条提示词，AI 给一次回答，人再写下一条。瓶颈是字面意义上的：你，是整个流程的瓶颈。

**第二代：Context Engineering（2025）**。焦点从单条提示词扩展到 AI 看到的整个信息环境——System Prompt、Memory、Tool 定义、历史记录。Anthropic 将其定义为 Prompt Engineering 的自然进化。但它仍然是单次运行。

**第三代：Harness Engineering（2025~2026初）**。焦点是为单次 Agent 运行配好所有装备——工具集、文件权限、沙箱环境。相当于"准备好工作台"，但 Agent 跑完一次就结束了。

**第四代：Loop Engineering（2026）**。焦点是设计替代"你"的自动驱动系统。你不再是操作者，而是系统设计者。

这条演进线的逻辑很清楚：**每一代都在把"人"从执行链里往外抽。**

## 五块积木：Osmani 的架构

Osmani 在文章里把 Loop 系统拆成了六块积木：

**1. 自动化（Automation）**：定时触发或事件触发，让循环真正自行运转。Claude Code 的 `/loop` 是这个机制的具体实现。

**2. 工作树（Worktree）**：Git worktree 在同一个仓库历史上切出独立工作目录，一个 Agent 的修改完全碰不到另一个。这解决了多 Agent 并行时的撞车问题。

**3. Skill**：把项目要求——代码风格、规范、架构、踩过的坑——打包给 Agent 每轮读取。Agent 每跑一遍都读一次，无需每次从零推导项目该怎么做。

**4. 插件与连接器（Plugins & Connectors）**：基于 MCP 协议，让 Agent 能读取 Issue Tracker、查数据库、操作外部工具。不能碰真实工具的 Loop 是小 Loop。

**5. 子 Agent（SubAgent）**：最关键的一块。**把写代码的和检查代码的拆成两个 Agent。** 让写代码的 Agent 给自己打分太容易放水；第二个独立 Agent 配不同的指令，甚至有时用不同的模型，专门负责审查。`/goal` 命令里做目标达成就判断的，就是这个子 Agent。

**6. 记忆（Memory）**：一个 Markdown 文件，或一个 Linear 看板，活在单个会话之外，记录什么做了、什么没做。Agent 会忘，文件不会。

这六块拼起来之后，整个工作流从一条线变成一个控制面板：**每天早上定时任务自动启动，扫描 CI 失败记录和 Open Issue，对每个值得处理的问题自动开 worktree，派一个子 Agent 去起草修复方案，再派第二个子 Agent 拿着技能文档和现有测试去审查，审查通过后自动开 PR。**

全程一个字不用敲。

## Boris Cherny 的实践样本

理论要看，实践也要看。

Cherny 的工作流是 Loop Engineering 最完整的样本。他在 GitHub Issue #1026 上分享了具体技巧：

**并行多会话**：别人开一个终端等一个 Claude，他同时跑 **5 个 Claude 实例**，每个在各自的 git worktree 和独立分支上。用 git worktree 给每个 Agent 配独立工作目录，互不干扰。把 Claude Code 看作**一组 workers**，不是单个助手。

**最强模型 + Thinking 模式**：所有编码任务用 Opus 4.5 并开启 Thinking 模式。"慢一点，但错误少得多。三个 correction prompt 的代价通常高于直接用最强模型一次做对。"

**具体数字**：2026年1月，他连续两天分别提交了 22 个 PR 和 27 个 PR，全部由 Claude 100% 编写。Anthropic 整体人均产出提升 150%。

这不是概念演示。这是已经被验证的生产力数字。

## Uber 的教训：成本不设防会怎样

有正面案例，也有反面教材。

2026年4月，Uber CTO Praveen Neppalli Naga 向管理层汇报了一个尴尬的情况：**2026年全年准备的 AI 工具预算，在前四个月全部花完了。** 以每人每月 1000 美元中位数计算，四个月涉及约 2400 万美元。两个月后，Uber 出台新规：每位员工、每款 AI 编码工具（Claude Code、Cursor 等），**每月调用上限 1500 美元**。员工可通过内部数据面板实时查看消耗额度，特殊场景经审批可突破限额。

从"尽可能多用"到"每人每月 1500 刀封顶"，Uber 只用了两个月。

这个案例的教训不是"AI 太贵了"——而是**Loop 在没有约束的情况下，会自己把自己跑爆**。Loop 的成本不只是 token 费用，还包括：Agent 跑了错误的方向浪费的计算资源、重复尝试浪费的时间、最后产出质量不达标需要人工兜底的人力成本。

## 认知债务：Osmani 最认真的警告

Osmani 在文章里花了一半篇幅讲一个被低估的风险，叫**认知债务**（Comprehension Debt）：

> "Loop 发了修复，但不等于你理解它怎么修的。"

当 Loop 替你写了成百上千行代码，你可能逐渐失去对代码库的理解。这不是假设，它有历史先例：1960 年代大型机时代，企业 IT 系统里积累了成吨的 COBOL 代码，没人完全理解，但所有人都依赖它们运行。当时的解法是"别动它"——一种保守的、被动的维持。系统复杂到超过人类管理能力时，你只能选择信任它，或者付出巨大的重构成本。

AI 时代这个风险来得更快。**一个丝滑的 Loop 会让认知债务膨胀得更快。**

Osmani 提出的解法不是"少用 Loop"，而是"保持判断力"：

- 定期 Review Loop 提交的变更，而不只是看测试是否通过
- 保留关键模块的"人工理解"义务
- Loop 可以跑，但工程师需要保持"我还能接管"的能力

他管另一个风险叫**认知投降**（Cognitive Surrender）：当 Loop 自己跑得欢的时候，意志不坚定的开发者极易被诱惑，不再自己进行判断，直接收下 Loop 给的一切结果。"Loop 分不清，使用者自己要分清。"

## Open Loop 与 Closed Loop

值得补充的一个架构区分是"开放循环"（Open Loop）和"封闭循环"（Closed Loop）。

**Closed Loop**：有严格成功标准和明确停止条件。适合数据迁移、测试修复、API 升级这类结果可以验证的任务。Verifier 是瓶颈，但也是安全阀——你总能知道"完成了没有"。

**Open Loop**：没有明确终点，优化探索式任务。适合研究性工作、架构探索——这些任务天然没有停止条件，如果不加干预会永远跑下去。

大多数实际场景是两者混合：外层 Closed Loop 套着若干 Open Loop。**循环的边界，就是成本的边界，也是风险的边界。**

## 结尾

Loop Engineering 是 AI 编程范式的一次真正跃迁。它的意义不在于"更快的自动化"，而在于它改变了人和 AI 之间的权力结构：人从操作者变成了设计师。

但这个转变有一个隐含的代价：**你的判断力必须比 AI 更早介入，而不是更晚。** 在 Prompt Engineering 时代，你通过写提示词参与了每一次决策。在 Loop Engineering 时代，你把决策权外包给了循环系统，但你需要为循环系统设计目标和约束——而这需要更深刻的理解，不是更浅的理解。

ReAct 给了 Loop Engineering 理论基础（+34% on ALFWorld，+10% on WebShop）；Boris Cherny 给了实践样本（22 PRs/day）；Uber 给了风险警示（4个月 2400 万美元）。这三组数据放在一起，才是 Loop Engineering 的完整图景。

agent-skills 教单个代理自律。Loop Engineering 教系统替代人的自律。两者合一，才是完整的图景。

问题是：谁在为这个系统整体负责？

**附：关键数据汇总**

| 来源 | 数字 | 含义 |
|---|---|---|
| ReAct 论文 (Yao et al., 2022) | +34% / +10% | ALFWorld/WebShop 基准超越 RL/IL 方法 |
| Peter Steinberger | 500万+ 浏览 / 24h | 2026年6月7日帖子，引爆 AI 编程圈 |
| Boris Cherny (Fortune, 2026.1) | 22 PRs / 27 PRs（连续两天） | 100% AI 生成的生产力上限 |
| Anthropic | 150% 人均产出提升 | Claude Code 带来的组织级效应 |
| Uber | 2400万美元（4个月）| 无上限 Loop 的成本失控 |
| Uber 新政 | 1500美元/人/月 | 成本控制后的使用上限 |

**参考来源**
- ReAct: Yao et al., arXiv:2210.03629 (2022)
- Peter Steinberger (@steipete), X, June 7, 2026
- Boris Cherny, [Fortune](https://fortune.com/2026/01/29/100-percent-of-code-at-anthropic-and-openai-is-now-ai-written-boris-cherny-roon/), January 29, 2026
- Addy Osmani, "Loop Engineering" 博客, Google Cloud AI Director
- [GitHub: cobusgreyling/loop-engineering](https://github.com/cobusgreyling/loop-engineering) — CLI 工具 loop-audit、loop-init
