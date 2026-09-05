# Sub-Agents 与 Harness Engineering：AI 编码 Agent 的控制论

两条线索，同一个问题：**如何在复杂、长时间运行的代码任务里，让 AI Agent 真正可靠？**

一边是 Anthropic 的 Claude Code Sub-Agents 工程实践，解决的是"并行执行"和"Context 不污染"的问题。另一边是 Martin Fowler 网站上 Birgitta Böckeler 的 Harness Engineering 框架，解决的是"如何设计 Agent 的护栏和反馈环"的问题。两者合并，构成了一个完整的 AI 编码 Agent 架构图。

---

## Sub-Agents：Context 是预算，并行是收益

Anthropic 的 sub-agent 模式核心洞察是：**主会话的 context 是一个有限预算**。

长会话里，每次文件读取、每次工具调用结果、每个中间状态都在消耗这个预算。当 context 过大，agent 的性能会下降——不是模型变笨了，而是信号密度被稀释了，agent 更容易分心。

**Sub-agent 的本质是预算隔离**。把昂贵的工作（研究、跨文件修改、审查）分发到独立 context 的 sub-agent 里，主会话只接收摘要。子 agent 消耗的是它们自己的 context 预算，不影响主会话的清晰度。

三个核心使用模式：

- **研究优先**：不熟悉的模块，先派 sub-agent 研究合成摘要，而不是往主会话里塞二十个文件
- **并行修改**：同一模式跨多文件更新时，三个 sub-agent 并行，时间约为串行的三分之一
- **独立 Review**：审查者不知道实现过程中的 trade-off 决策，能发现"熟悉感"掩盖的问题

代价也很清晰：sub-agent 有启动开销，不适合顺序依赖任务，不适合同一文件并行编辑，不适合需要 agent 间互相通信的场景（那是 Agent Teams 的地盘）。

Enterprise 新特性里值得注意的细节是 **SubagentStop Hook**：子 agent 返回主会话之前会触发这个 hook，可以做测试门禁、密钥扫描、范围检查。这是一个关键的反馈控制点——不是等结果出来了再判断对错，而是在返回之前就拦截问题。

---

## Harness Engineering：把人类经验外部化

Harness Engineering 的框架更抽象，但也更根本。

Böckeler 提出的核心模型是：**Agent = Model + Harness**。Model 决定能力上限，Harness 决定你在那个能力上能信任它多少。

Harness 分两类：

**Guides（feedforward，前馈控制）**——在 agent 行动之前引导，预判错误行为。比如项目规范、代码风格文档、bootstrap 脚本、"我们这里不这么做"的隐性规则。目标是提高 agent 第一次就做对的概率。

**Sensors（feedback，反馈控制）**——在 agent 行动之后检测，让它自我修正。最有力的 sensors 是那些输出经过优化、可供 LLM 消费的信号——比如自定义 linter 消息直接包含修正指令，本质上是一种正向的 prompt injection。

光有 feedforward → agent 遵守规则但不知道效果好不好。光有 feedback → agent 重复犯同一个错。

两者都必须有，才能形成自我修正的闭环。

---

## 控制论视角：两条线索的交汇点

把两个框架放在一起，结构就清晰了：

**Sub-agents** 是执行架构——解决任务如何分解、并行、以及 context 如何隔离。**Harness Engineering** 是控制哲学——解决给定一个任务，如何设计引导和反馈让 agent 做对，并在出错时自我修正。

SubagentStop Hook 是两者最直接的交集：它是 harness 里的 feedback sensor 挂载在 sub-agent 执行生命周期上的钩子。

Fowler 文章里还有一个重要区分：**Computational vs Inferential** 的控制方式。

- **Computational**：确定性，CPU 执行，毫秒级。Linter、类型检查、单元测试、架构边界测试。每次变更都跑得起。
- **Inferential**：AI 代码审查、"LLM as judge"。昂贵且非确定，但能处理需要语义判断的问题。

现实系统里两者都需要。Computational sensors 解决 80% 的结构性问题，Inferential sensors 补充语义层。OpenAI 的实践是"分层架构 + 自定义 linter + 结构测试 + 定期漂移扫描"，Stripe 的实践是"pre-push hook + 基于启发式的 linter 选择 + blueprints 集成 feedback sensors"。

---

## Behaviour Harness：真实的短板

Böckeler 在文章里坦承，目前最薄弱的环节是 **Behaviour Harness**——如何验证 AI 生成的功能行为是否正确。

现状是：靠"AI 生成的测试套件是否 green"来判断。但把信心寄托在 AI 自己生成的测试上，是一个尚未解决的自举问题。部分团队在用"approved fixtures"模式（预先给定输入输出示例，让 agent 对照实现），但这只能覆盖部分场景。

这意味着，在 behaviour harness 成熟之前，人类审查仍然是必须的。Harness 的目标不是消灭人类输入，而是**把人类输入引导到最需要的地方**——也就是 behaviour 验证。

---

## 人类经验的外部化困境

Fowler 文章里有一句话戳中了本质：

> Agent 没有社会责任感、没有对 300 行函数的审美厌恶、没有"我们这里不这么做"的直觉、没有组织记忆。它不知道哪个 convention 是 load-bearing 的，也不知道技术正确的方案是否符合团队实际需求。

Sub-agents 和 Harness 都在试图解决同一个问题：如何把人类开发者的经验——那些隐性的、情境性的、存在于团队默契里的东西——外部化并让 AI agent 可用。

这是一个还没解决的工程问题。当前 harness 能处理结构性问题（圈复杂度、架构漂移、风格违规），能部分处理语义问题（语义重复、冗余测试），但高影响的问题（需求误解、过度工程化、组织层面的技术债务决策）仍然在 harness 的覆盖范围之外。

---

## 结论

Sub-agents 和 Harness Engineering 是同一枚硬币的两面：一个解决执行可靠性（不污染 context、不重复犯错），一个解决正确性保障（引导 + 反馈 + 自我修正）。

两者合在一起，指向的结论是：**AI 编码 Agent 的下一个工程挑战，不是让模型更强，而是在模型之上构建一套可验证、可组合、可进化的控制层**。这是 AI-Native 软件工程区别于传统工程的核心——代码不只是被写出来，而是被持续地验证和引导着写出来。

这条路还很长，但框架已经在清晰了。

---

**参考**

- [Claude Code Sub-Agents – Anthropic Engineering](https://www.anthropic.com/engineering/claude-code-subagents)（原文 404，参考 archived 版本及社区解读）
- [Harness Engineering for Coding Agent Users – Martin Fowler](https://martinfowler.com/articles/harness-engineering.html)
