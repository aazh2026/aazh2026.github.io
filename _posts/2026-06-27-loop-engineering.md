# Loop Engineering：把"你"从流程里抽出来

2026年6月7日，Peter Steinberger（OpenClaw 创始人、OpenAI 开发者）在 X 上发了一条帖子，24小时内获得了超过五百万次浏览：

> "You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents."

几乎同时，Anthropic Claude Code 的创始人兼负责人 Boris Cherny 在红杉资本 AI Ascent 大会上说了几乎同样的话：

> "I don't prompt Claude anymore. I have loops running that prompt Claude and figuring out what to do. My job is to write loops."

Google 工程总监 Addy Osmani 在自己的博客上把这件事正式命名为 **Loop Engineering**，并拆解了它的完整架构。GitHub 用户 Cobus Greyling 在帖子发出后数小时内建了仓库 [cobusgreyling/loop-engineering](https://github.com/cobusgreyling/loop-engineering)，收录 7 个生产级模式、CLI 工具（loop-audit、loop-init、loop-cost）和失败案例——这个速度本身就是这件事影响力的证明。

## 核心定义

Osmani 的原文定义值得完整引用：

> "Loop engineering is replacing yourself as the person who prompts the agent. You design the system that does it instead. A loop here can be thought of a recursive goal where you define a purpose and the AI iterates until complete."

关键不是"更快的自动化"，而是**人从执行链里被替换出来**。你设计系统，系统替你跑腿。

## 五块积木 + 记忆

Osmani 把 Loop 系统拆成五个结构性组件，外加一个跨会话记忆层：

**1. 自动化（Automations）——心跳**

这是让 Loop 真正成为"循环"的部分，而不是"你跑一次我跑一次"的线性重复。在 Codex App 里，Automations tab 让你选择项目、prompt、频率、环境，产出自动进入 Triage 收件箱。Claude Code 用 `/loop` 做定时任务，用 `/goal` 做目标驱动——后者持续运行直到你写的停止条件真正成立，每轮结束后由**独立的评估模型**判断是否完成，而不是干活的那个模型自己判断。

Osmani 在这里点出了一个关键设计：**让写代码的模型和判断完成的模型分开**。这不只是子 Agent 的分离，而是验收逻辑的分离。

**2. 工作树（Worktrees）——并行安全**

当你同时跑超过一个 Agent，文件碰撞就开始了——两个 Agent 写同一个文件，跟两个工程师提交同一行代码一样头疼。Git worktree 的解法：在同一个仓库历史上切出独立工作目录，一个 Agent 的修改物理上碰不到另一个。

Claude Code 用 `--worktree` flag 给每个 session 独立工作区，用 `isolation: worktree` 设置给子 Agent 确保每个 helper 用完就清理。

**3. 技能（Skills）——项目知识不再每次从零推导**

没有 skill，Agent 每次会话都像金鱼一样忘记一切。有 skill，项目的编码规范、踩过的坑、构建步骤，在你第一次写下之后就永远生效。

Osmani 把这叫 **Intent Debt**——Agent 每轮都会用自信的猜测填补你意图里的空白，skill 就是把意图写在外面，Agent 每轮读取，不重复消耗。

**4. 插件与连接器（Plugins & Connectors）——Loop 碰到真实工具**

只能看文件系统的 Loop 是一个小的 Loop。基于 MCP 协议的连接器让 Agent 能读取 Issue Tracker、查数据库、 hit staging API、在 Slack 发消息。

Osmani 举了一个具体的差别：**"Loop 能说'修复方案在这里'"和"Loop 自动开 PR、更新 Linear 工单、在 CI 变绿后通知相关人"之间，隔着连接器的距离。**

**5. 子 Agent（Sub-agents）——写代码的不打分**

这是 Osmani 认为 Loop 里"最有用的结构性组件"：**把写代码的和检查代码的拆成两个 Agent。** 模型对自己写的代码打分太容易放水；第二个 Agent 配不同的指令，甚至有时用不同的模型，专门负责挑毛病。

Claude Code 的 `/goal` 在底层就是这么运作的：一个独立的模型判断 Loop 是否完成，而不是执行工作的那个模型。

**6. 记忆（Memory / State）——模型的遗忘写在磁盘上**

Agent 在两次运行之间会忘记一切，但磁盘不会。Memory 可以是一个 Markdown 文件，可以是一个 Linear 看板，活在单个会话之外，记录什么做了、什么没做。

Osmani 的原话：**"The agent forgets, the repo doesn't."**

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

仓库还提供三个 CLI 工具：
- `loop-audit`：评估 Loop 就绪程度的评分 CLI
- `loop-init`：脚手架工具，按模式生成 starter
- `loop-cost`：Token 消耗估算器

## 思想史：ReAct 的基因

理解 Loop Engineering 需要从它的理论根开始。

2022年10月，普林斯顿大学和 Google 联合发表了《ReAct: Synergizing Reasoning and Acting in Language Models》（arXiv:2210.03629，Yao et al.）。核心思想：**让 LLM 交替进行"思考"和"行动"，每做一步就停下来想想，然后决定下一步。**

工作循环：Thought → Action → Observation → ... → Final Answer

关键发现：在 ALFWorld 和 WebShop 两个交互式决策基准上，ReAct 优于当时的 imitation learning 和 reinforcement learning 方法，绝对值提升 **+34%** 和 **+10%**，只用了 1-2 个 in-context examples。

ReAct 是 Loop Engineering 的理论祖先。ReAct 解决"单步推理+行动"的局部问题；Loop Engineering 要解决"整条流水线如何持续运转"的全链路问题——它比 ReAct 高一层：不是让模型自己迭代，而是**设计让模型可以被迭代驱动的系统**。

## Boris Cherny 的实践样本

2026年1月，Fortune 杂志报道了 Cherny 在 X 上发布的具体数字：他已经超过两个月没有手写一行代码。"昨天提交了 22 个 PR，前天 27 个，每个 PR 都是 100% 由 Claude 写的。"Claude Code 上线后，Anthropic 整体人均工程产出提升 **150%**。他在红杉 AI Ascent 大会上补充："以前在 Meta，几百人干一年，能换来 2% 的生产力提升就已经烧高香了。150%？这是闻所未闻的效率。"

他的具体工作流：同时跑 **5 个 Claude 实例**，每个在各自的 git worktree 和独立分支上。关键工具是 `git worktree`——每个 worktree 给 Claude 一个独立文件夹，session 之间不会相互覆盖文件。他把 Claude Code 看作**一组 workers**，不是单个助手。

所有编码任务用 Opus 4.5 并开启 Thinking 模式。"慢一点，但错误少得多。三个 correction prompt 的代价通常高于直接用最强模型一次做对。"

## Uber 的教训：成本不设防会怎样

有正面案例，也有反面教材。

2026年4月，Uber CTO Praveen Neppalli Naga 向管理层汇报：2026年全年准备的 AI 工具预算，在前四个月全部花完。以每人每月 1000 美元中位数计算，涉及约 **2400 万美元**。两个月后出台新规：每位员工、每款 AI 编码工具，**每月调用上限 1500 美元**。

Loop 在没有约束的情况下，会自己把自己跑爆。

## 三个问题不会因为 Loop 变好而消失

Osmani 在文章结尾花了大量篇幅讲三个风险，而且他的观点是"这些问题随着 Loop 变好会变得更尖锐，不是更轻松"：

**验证还是你的活**：Loop 无人值守运行，同时也在无人监督的情况下犯错。拆出 verifier sub-agent 是为了让 Loop 的"完成了"有意义，但"完成了"仍然是声明，不是证明。

**理解还是会烂**：Loop 替你写的代码越多，你和代码库之间的理解差距越大。Osmani 把这叫 **Comprehension Debt**（认知债务）。一个丝滑的 Loop 会让它膨胀得更快，除非你主动去读 Loop 产出的东西。

**舒服的姿势是最危险的**：当 Loop 自己跑得欢的时候，极易停止形成自己的判断。Osmani 把这叫 **Cognitive Surrender**（认知投降）。设计 Loop 是解药还是毒药，取决于你是在用判断力设计它然后辅助提效，还是在用它逃避思考。

他的原话：**"The loop changes the work, it does not delete you from it."**

## 结尾

Loop Engineering 是 AI 编程范式的一次真正跃迁。它的意义不在于"更快的自动化"，而在于它改变了人和 AI 之间的权力结构：人从操作者变成了设计师。

但这个转变的代价是：**你的判断力必须比 AI 更早介入，而不是更晚。**

ReAct 给了 Loop Engineering 理论基础（+34% on ALFWorld，+10% on WebShop）。Boris Cherny 给了实践样本（22 PRs/day）。Cobus Greyling 的仓库把它变成了可复用的工具包（7 种模式 + CLI 工具）。Uber 给了风险警示（4个月 2400 万美元）。这三个维度放在一起，才是 Loop Engineering 的完整图景。

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
- Cobus Greyling, [cobusgreyling/loop-engineering](https://github.com/cobusgreyling/loop-engineering) — 7 production patterns + CLI tools (MIT license)
- ReAct: Yao et al., arXiv:2210.03629 (2022)
- Boris Cherny, [Fortune](https://fortune.com/2026/01/29/100-percent-of-code-at-anthropic-and-openai-is-now-ai-written-boris-cherny-roon/), January 29, 2026
- Boris Cherny, 红杉资本 AI Ascent 大会，2026年5月6日
