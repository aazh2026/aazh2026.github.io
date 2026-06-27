# Loop Engineering：把"你"从流程里抽出来

2026年6月7日，Peter Steinberger（OpenClaw 创始人、OpenAI 开发者）在 X 上发了一条帖子，24小时内获得了超过五百万次浏览：

> "Here's your monthly reminder that you shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents."

几天后，Anthropic Claude Code 的创始人兼负责人 Boris Cherny 在一场邀请制活动上说了一句几乎同样的话：

> "我现在不再自己给 Claude 写提示词了。我有循环在跑，它们负责提示 Claude 并判断下一步怎么做。我的工作，是写循环。"

两段话，一个内核：AI 编程的范式正在从"人驱动 AI"切换到"系统驱动 AI"。这个转变有一个名字——Loop Engineering——由 Google 工程师 Addy Osmani 在一篇博客文章里正式命名。但真正值得问的问题不是"这是什么"，而是"它把什么变得更好了，把什么变得更糟了"。

## 四代范式，一条演进线

理解 Loop Engineering 最好的方式，是把它放在整个 AI 编程方法论的演进序列里看。

**第一代：Prompt Engineering（~2024）**。人写一条提示词，AI 给一次回答，人再写下一条。它的瓶颈是字面意义上的：你，是整个流程的瓶颈。每一步都需要人介入。

**第二代：Context Engineering（2025）**。焦点从单条提示词扩展到 AI 看到的整个信息环境——System Prompt、Memory、Tool 定义、历史记录。Anthropic 将其定义为 Prompt Engineering 的自然进化。但它仍然是单次运行，不具备自主持续运行的能力。

**第三代：Harness Engineering（2025~2026初）**。焦点是为单次 Agent 运行配好所有装备——工具集、文件权限、沙箱环境。相当于"准备好工作台"，但 Agent 跑完一次就结束了。

**第四代：Loop Engineering（2026）**。焦点是设计替代"你"的自动驱动系统。你不再是操作者，而是系统设计者。

这条演进线的逻辑很清楚：每一代都在把"人"从执行链里往外抽。Prompt Engineering 是人在回路里；Context Engineering 减少了人干预的频率；Harness Engineering 把人降到"装备管理员"；Loop Engineering 彻底把人的角色变成了"设计者"。

## 五步闭环是如何工作的

一个完整的 Loop 系统，会自动完成五个动作，不断循环：

```
发现工作 → 分配 Agent → 执行任务 → 验证结果 → 持久化状态
    ↑                                              ↓
    └──────── 决定下一步（重试/继续/停止） ←────────┘
```

**Discover**：主动扫描任务队列、PR 列表、Issue 面板。**Assign**：将任务分配给合适的子 Agent。**Act**：Agent 实际运行、写代码、调用工具、修复 Bug。**Verify**：检查输出是否达标，测试是否通过。**Persist**：记录已完成的工作和上下文，供下一轮使用。

关键在于 Verify 步骤：如果验证不通过，Loop 会**自动重试或调整策略**，而不是停下来等你介入。

以 Claude Code 的 `/goal` 命令为例（v2.1.139，2026年5月发布）：

```
/goal "将所有 API 接口迁移到新版 SDK，确保测试全部通过"
```

Claude 会自动跨多轮持续工作，每轮结束后由独立评估模型检查目标是否达成，追踪已消耗的时间、对话轮数和 Token 数量，达成目标才停止。

Boris Cherny 分享的实战用法更具体：

```
/loop babysit all my PRs. Auto-fix build issues,
and when comments come in, use a worktree agent to fix them.
```

翻译：让 Claude 持续监控所有 PR，自动修复 build 报错，有人评论就开一个独立的 worktree Agent 去处理。全程无人介入。

## 与 agent-skills 的镜像关系

这件事有趣的地方在于：Loop Engineering 和 agent-skills（我上个月写过）解决的是同一个底层问题，但方向恰好相反。

**agent-skills** 的解法是往单个代理里灌工程纪律——让它"不想"走最短路径。它的反借口表格（rationalization table）专门记录"人类/AI 在这一步会找什么借口来跳过它"。它的核心假设是：可以通过改变代理的内部判断来提升输出质量。

**Loop Engineering** 的解法是把人从流程里抽出来，设计系统让代理在循环中被正确地驱动。它的核心假设是：与其训练代理自律，不如用外部系统替代代理的自律。

这两个方向是镜像的。

agent-skills 的前提是：如果代理有足够的工程纪律，它可以在单次任务里把事情做对。Loop Engineering 的前提是：代理本身不需要自律，外部循环可以代替它的自律。

前者是内控，后者是外控。

## "认知债务"：真正的风险

Osmani 本人在博客里提到了一个被低估的风险，叫"认知债务"（Comprehension Debt）：

> "Loop 发了修复，但不等于你理解它怎么修的。"

当 Loop 替你写了成百上千行代码，你可能逐渐失去对代码库的理解。这不是假设——它有历史上的先例。1960 年代大型机时代，企业 IT 系统里积累了成吨的 COBOL 代码，没人完全理解，但所有人都依赖它们运行。当时的解法是"别动它"——一种保守的、被动的维持。这不是好状态，但它反映了真实的风险：系统复杂度超过人类管理能力时，你只能选择信任它，或者付出巨大的重构成本。

AI 时代这个风险来得更快。2026年6月，Uber 的 AI 工具预算在 4 个月内耗尽了全年额度，随后对每人每工具设置了月度上限。Loop 在没有约束的情况下，会自己把自己跑爆。

所以 Loop Engineering 真正的工程挑战不是"怎么让循环跑起来"，而是：
- 如何设置有效的 token 上限和最大轮次
- 如何设计人工干预钩子，在关键操作前强制暂停
- 如何确保人类保持"我还能接管"的能力，而不只是"我还可以看测试是否通过"

## Open Loop 与 Closed Loop

值得补充的一个区分是"开放循环"（Open Loop）和"封闭循环"（Closed Loop）。

**Closed Loop**：有严格成功标准和明确停止条件。适合数据迁移、测试修复、API 升级这类结果可以验证的任务。Verifier 是瓶颈，但也是安全阀——你总能知道"完成了没有"。

**Open Loop**：没有明确终点，优化探索式任务。适合研究性工作、架构探索、代码优化——这些任务天然没有停止条件，如果不加干预会永远跑下去。

大多数实际场景是两者混合：一个外层的 Closed Loop 套着若干 Open Loop。重要的是在设计阶段就把这个边界画清楚——循环的边界，就是成本的边界，也是风险的边界。

## 结尾

Loop Engineering 是 AI 编程范式的一次真正跃迁。它的意义不在于"更快的自动化"，而在于它改变了人和 AI 之间的权力结构：人从操作者变成了设计师。

但这个转变有一个隐含的代价：你的判断力必须比 AI 更早介入，而不是更晚。在 Prompt Engineering 时代，你通过写提示词参与了每一次决策。在 Loop Engineering 时代，你把决策权外包给了循环系统，但你需要为循环系统设计目标和约束——而这需要更深刻的理解，不是更浅的理解。

agent-skills 教单个代理自律。Loop Engineering 教系统替代人的自律。两者合一，才是完整的图景：单个代理有纪律，外部循环有约束。

问题是：谁在为这个系统整体负责？
