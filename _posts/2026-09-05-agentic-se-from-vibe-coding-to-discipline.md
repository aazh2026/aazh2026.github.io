# Agentic SE：从 Vibe Coding 到治理纪律

---

## 这不是 vibe coding

agentic-se.org 开宗明义：**这不是一次性的"vibe coding"，不是追逐自主编程 agent 的营销叙事**。这是 Structured Agentic Software Engineering（SASE）——一套关于人类与 AI 队友之间纪律化、可审计协作的框架。

核心主张：行业正在从"AI 辅助编程"（SE 2.0，Copilot 时代）走向"目标导向的 AI 代理编程"（SE 3.0，Devin 时代）。但这个跃迁带来一个根本矛盾——**速度与信任之间的鸿沟**。

---

## 那个没人愿意谈的数字

Agent PR 的中位处理时间是 13.2 分钟。但同时：

- "看起来合理但引入回归"的修复比例：**29.6%**
- SWE-Bench 考核通过率：人类审查后从 12.47% 跌到 3.97%
- 遭遇长期延迟或无人审查的 Agent PR 比例：**超过 68%**

瓶颈不在生成，在于验证。Agent 高速输出，人工审查变成瓶颈，生产力增益被审查成本抵消。

这就是 SASE 要解决的问题：不是让 agent 更快，而是**让 agent 的输出在结构上可审查**。

---

## 核心机制：MRP 和 CRP

SASE 有两个核心工件，名字听起来很拗口，但机制很清晰：

**MRP：Merge-Ready Pack（合并就绪包）**

Agent 完成任务后提交的不是裸 PR，而是一个**有证据支持的包**：测试结果、覆盖率数据、静态分析报告、变更理由说明、审计追踪。

这不是把代码丢给审查者让他们自己判断。审查者看到的是一个完整的证据链——功能是否完整、测试是否通过、是否符合项目的"卫生标准"。审查行为从逐行阅读变成**验证证据**。

**CRP：Consultation Request Pack（咨询请求包）**

当 Agent 遇到模糊性或超出权限的高风险决策时，它不是自己猜一个方向继续跑，而是生成一个 CRP：问题摘要 + 建议选项 + Agent 推荐方案。人类教练回复一个 VCR（Version Controlled Resolution）——一个持久化的、带版本控制的决定。

关键设计：**CRP 是 Agent 反向调用人类的机制**。不是人类盯着 Agent 干活，而是 Agent 在需要时主动叫人类过来，并且把上下文打包好让人类能快速做决定。

这个机制解决了 agent 独自在黑箱里跑、跑偏了没人知道的问题。

---

## 人类的角色翻转：从 coder 到 Agent Coach

SASE 提出的最有价值的框架性观点是**人类角色的重新定义**：

- 传统：人类写代码，Agent 辅助补全
- Agentic SE：人类定义目标/约束/完成证据，Agent 执行，证据由 MRP 交付

人类从**代码执行者**变成**目标设定者 + 证据验证者 + 复杂决策仲裁者**。10x 开发者的定义从"自己写代码最厉害"变成"能调度和管理一群 AI 队友"。

---

## 双环境架构：ACE 和 AEE

SASE 将开发环境拆分为两个专门的工作台：

**ACE（Agent Command Environment）**：人类指挥中心。这里是人类设定目标、审核 MRP、处理 CRP、制定策略的地方。人类教练在这里保持对全局的感知，而不被 Agent 高速输出淹没。

**AEE（Agent Execution Environment）**：Agent 执行工厂。Agent 原生的工具链在这里运行——AST 级操作工具、语义搜索引擎、超并行调试器、权限边界内的 MCP 服务器。这个环境针对 Agent 优化，剥离了以人为中心的视觉辅助。

两个环境的分离镜像了认知与执行的分离：**ACE 决定做什么，AEE 执行并报告证据**。

---

## 核心工件体系

SASE 用一套持久化、版本控制的工件替代了临时性的对话式提示：

| 工件 | 谁写 | 作用 |
|------|------|------|
| **BriefingScript** | 人类 | 目标、成功标准、架构约束、解决方案蓝图——机器可执行的任务规范 |
| **LoopScript** | 人类 | Agent 工作流的声明性定义——任务如何分解、并行策略、自动化验证步骤 |
| **MentorScript** | 人类 | 项目规范的结构化编码，版本化并持续应用——AGENTS.md 的正式版本 |
| **MRP** | Agent | 有证据支持的交付物包——代码 + 测试结果 + 覆盖率 + 变更理由 |
| **CRP** | Agent | 反向调用人类的结构化请求——问题 + 选项 + 推荐方案 |
| **VCR** | 人类 | 对 CRP 的持久化回应——版本控制、可审计、供未来参考 |

---

## 关键洞察：Specification is the new implementation

SASE 最有穿透力的一句话：**Specification is the new implementation**。

当 Agent 能生成代码时，代码不再稀缺。稀缺的是**清晰定义目标、约束和成功证据的能力**。BriefingScript 的质量直接决定 Agent 的返工率。把规格写清楚比写代码重要。

这也解释了为什么 MentorScript 不是一个 .md 文件而是一个**一等工程制品**——它需要版本控制、需要机器可读、需要被当作代码一样审查和测试。

---

## 局限性

SASE 不是银弹。它的设计者也很清楚地列出了翻车场景：

- **小团队或早期项目**：写 BriefingScript 和 MRP 的开销通常超过收益，当审查者本身持有完整上下文时，这些工件反而是负担
- **需求不稳定时**：BriefingScript 假设目标是稳定的。如果任务中期需求变了，Agent 会过度优化原始 spec，产生刚性风险
- **低信任的 Agent 流水线**：MRP 是证据包，不是正确性证明。在 29.6% 回归率面前，一份包装精美的证据包可能制造虚假信心
- **工具链不成熟**：ACE/AEE 分离需要 Agent 可靠地消费结构化工件，而当前模型对结构化格式的遵守程度参差不齐

---

## 一句话总结

Vibe coding 是让 Agent 跑起来不管方向。SASE 是**先把目标写成规格，再让 Agent 按规格提供证据**。速度与信任的鸿沟不是因为 Agent 不够快，而是因为审查者没有证据可验证，只能逐行读代码。

SASE 的赌注是：把人类从代码审查者变成证据验证者，把 Agent 从高速生成者变成有据可查的交付者。这是 SE 3.0 时代的工程纪律。

---

**参考**

- [agentic-se.org](https://agentic-se.org)
- [Agentic Software Engineering: Foundational Pillars and a Research Roadmap — arXiv:2509.06216](https://arxiv.org/abs/2509.06216)
- [Structured Agentic Software Engineering — AgentPatterns.ai](https://agentpatterns.ai/patterns/agent-design/structured-agentic-software-engineering/)
