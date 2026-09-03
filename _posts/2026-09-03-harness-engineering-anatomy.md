# Harness Engineering：对 11 个生产级 Coding Agent 运行时做源码解剖

## 背景

arXiv:2609.00006，Paul Barbaste 等三人（Wavestone AI Lab），2026 年 7 月。

这是一篇罕见的工程解剖论文——不是跑 benchmark 打分，而是把 11 个生产级 coding agent 的运行时全部拉出来，从源码层面拆给你看。对象包括：

- **Provider-native**: Claude Code、Codex CLI、Gemini CLI、Mistral Vibe
- **Open-source 代表**: OpenHands、Aider、OpenClaw、Mini-SWE-Agent、Hermes、Pi、OpenCode
- **Meta-harness 对照**: Omnigent（Databricks）

总规模约 400 万行代码。

---

## 核心命题：Agent = Model + Harness

论文给的定义足够简洁：

```
Agent = Model + Harness
```

**Harness** 就是「除了模型以外的所有东西」——loop、tools、context、safety、orchestration、extension surfaces。作者认为 2026 年初「harness engineering」已经是一门将运行时作为工程对象的独立学科。

研究目标不是给这 11 个系统排名，而是描述它们**实际上是怎么建的**，以及这个类别正在往哪里走。

---

## 七个规范子系统

论文建立了 coding agent harness 的标准解剖图谱，分七个维度：

| 子系统 | 职责 | 最小实现 | 最大实现 |
|--------|------|----------|----------|
| Agent Loop | 推理与执行的交替 | Mini-SWE-Agent：线性 while + 一个 bash tool | OpenHands：事件溯源的持久化 EventLog |
| LLM Integration | provider 协议、prompt 组装、thinking/routing | Mini-SWE-Agent：单 LiteLLM call | Hermes：5 个自研 transport、29 个 provider profile |
| Tools & Actions | 定义并执行 agent 能做的事 | Mini-SWE-Agent：仅 bash | Claude Code：43 个类型化工具 + 延迟加载 |
| Memory & Context | 管理上下文窗口、跨 session 持久化 | Mini-SWE-Agent：无界线性历史 | Codex：跨 session 的 agent-maintained memory pipeline |
| Safety & Permissions | 决定什么能跑、什么要问、什么禁止 | Mini-SWE-Agent：步数/费用限制 | Codex：policy rules + LLM approval reviewer + 三平台 OS sandbox |
| Orchestration | 派生子 agent、协调多 agent | Aider：无（单 agent 设计） | Claude Code：递归组合；Omnigent：跨 vendor 协调 |
| Extensibility | 让用户和生态添加能力 | Mini-SWE-Agent：Python protocols | Pi：一切皆扩展运行时 |

---

## 三个关键 Loop 范式

### 1. 迭代式 Action-Observation Loop（9 个系统）

**OpenHands**：事件溯源conversation engine
- LocalConversation 驱动 Agent.step()
- 每次交互追加到持久化 EventLog
- conversation state 是一棵树，有可移动的 head，支持 replay/fork/branch navigation
- ParallelToolExecutor + resource-lock manager 并行执行工具
- StuckDetector：5 种失败场景 + 可配置阈值

**Claude Code**：SSE 流式 loop + 并发工具批处理
- 响应通过 Server-Sent Events 流式返回
- 工具通过单次 reduce 算法按并发安全性分区
- 写工具（edit、bash）默认不安全；读工具（grep、glob、file read）安全

**Codex**：Tokio async 状态机
- Session struct 通过 streaming ResponseItem 事件编排 turns
- FuturesOrdered 保证有序并行执行
- ToolCallRuntime 执行工具调用

**Gemini CLI**：Async-generator loop + 混合 loop 检测
- Async generator yield 类型化 ServerGeminiStreamEvent tuples
- 两级 loop 检测：cheap（SHA-256 哈希常见失败模式）+ 自适应（30 步后 LLM self-check）
- 文件修改工具强制串行；有独特的 auto-injected wait_for_previous boolean

**Mistral Vibe**：Middleware-pipeline loop
- 可组合 middleware 管道实现 turn-level policies
- 6 个内置 middleware：TurnLimit、PriceLimit、TokenLimit、AutoCompact、ContextWarning、ReadOnlyAgent

### 2. Reflection-Augmented Loop（仅 Aider）

三层嵌套：LLM 响应 → 执行 edit → 检查 lint 错误 → 反射修正（默认 3 次）。

### 3. Coordinator-Worker 模式（Claude Code、Codex、Hermes）

在迭代 loop 基础上加一层 hierarchical dispatch：coordinator 派生子 agent，上下文 fork，AbortController 隔离。

---

## 两个经验性absence（重要）

在 11 个系统、约 400 万行代码的规模上，论文确立了**两个惊人的共同absence**：

### Absence 1：没有任何 agent runtime 使用通用 agentic 框架

没有一家用 LangChain、LangGraph、AutoGen。全部手写 async loop。

### Absence 2：没有任何 agent runtime 用向量嵌入做代码检索

全场靠**确定性检索**——ripgrep、tree-sitter、glob。没有 embedding-based retrieval。

这两个 absence 是跨系统级别的一致性发现，不是某一家特例。

---

## Skills 采用率已超 MCP

一个有趣的量化发现：在 11 个系统中，skills 的采用率（9/11）已经**超过 MCP（8/11）**。这是 2026 年中的快照，说明 skill 分发机制在这个时间点已经是主流扩展手段。

---

## 行为策略从 Prompt Prose 向 Config 迁移

另一个跨系统趋势：行为策略（behavioral policies）正从**prompt prose 迁移到 config**。也就是说，原本写在大段 prompt 里的指令，现在变成了结构化的配置文件。这是 harness 作为平台化对象的另一个信号——配置比 prompt 更适合分发、版本化、审计。

---

## 平台化 Thesis

论文的最后一个论题：**2026 年上半年，coding harness 完成了从 tool 到 platform 的转身**。

平台化的边界在哪里？论文指出了几个具体方向：

- **Harness SDKs**：框架搭建的 harnesses 正在收敛到同一形态
- **Plugin/Skill marketplace**：带供应链安全的技能分发市场
- **Cross-vendor session importer**：跨 vendor 会话导入
- **MDM governance**：企业级治理
- **Agent-as-model gateway**：把 agent 作为模型网关

---

## 18 条设计建议 + 90 行最小可行 harness

论文在 Section 16 给出了 18 条设计建议，并附带一个实现其中 10 条的 90 行最小可行 harness scaffold。这些建议覆盖七个子系统，是目前最系统的 coding harness 工程实践参考。

---

## 解读：harness 作为一等工程对象

这篇论文最重要的意义不是某个具体发现，而是它确立了 **harness 作为独立工程对象的地位**。

上半年 coding harness 完成了从工具到平台的转身，平台化边界在 **hosting 与 skill 分发**，不在模型侧——模型你可以换，但 harness 的平台能力（扩展机制、治理、分发）是黏性所在。

两个 empirical absences 值得反复咀嚼：没有通用框架、没有向量检索。这不是技术选型问题，而是整个领域在用实践回答「什么是真正必要的复杂度」。

---

**链接**: https://arxiv.org/abs/2609.00006
