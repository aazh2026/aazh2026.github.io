# 长程 Agent 记忆系统的两路突破：Recuris 和 Prime Agent

两条路线，同一个问题：当前 Agent 在长程任务里失败率高，不是因为模型不够强，而是因为记忆系统不工作。

---

## Recuris：三分记忆 + 递归修正循环

Recuris（Gen-Verse，arXiv:2608.24876）的思路是把记忆拆成三层，各司其职。

**Experiential Memory**：存储历史技能和使用记录，相当于经验库。

**Working Memory**：追踪当前任务进度，决定从 Experiential Memory 里调用哪个技能。关键设计：技能选择基于当前需求，而不是完整历史上下文。这解决了长程任务里「技能错配」的问题——Agent 不是因为忘记技能而失败，而是因为在错误的时间调用了正确的技能。

**Skill Memory**：经过验证的技能更新。只有当 Meta-Agent（一个固定的评审智能体）确认某次执行产生了有效证据，才会把修改写入 Skill Memory。而且这个更新是定向的——只改出问题的组件，不动其他部分。

**递归循环**：执行产生结构化证据 → Meta-Agent 分析证据 → 定位到具体记忆组件 → validation-gated 更新 → 产生新证据。循环有边界，不是无限自我改进。

**数据**：四个长程基准，10 个模型，35/37 配对有提升。tau-bench 上 Claude Opus 5 达到 87.9%（+15.6），最长任务 +32.2 点，常见失败下降 80%。

---

## Prime Agent：Harness 本身就是可写状态

Prime Agent（PrimeIntellect，arXiv:2608.23552）走了另一条路：不是改进 Agent 的记忆，而是让 Harness 本身变成 Agent 可以写的东西。

**Recursive Language Model（RLM）**：把上下文当作变量，子 Agent 委托当作 REPL 里的函数调用。Agent 调用 `rlm("sub-task")` 启动子会话，结果通过 `agent_message.send(...)` 返回，不阻塞主循环。

**Continual Harness**：把 Harness 状态格式化为 H = (ρ, G, K, M)——prompt、子 Agent、技能、记忆。每一项都可以被 Agent 自己创建、读取、更新、删除。

**/refine 命令**：Agent 读取自己的轨迹，找到最有效的最小修改应用到 prompt 或技能上，记录触发条件和结果。Base system prompt 不可变，但每次更新可以按 ID 回滚。

**Factorio 里的失败案例**：Prime Agent 发现可以通过 RCON 命令直接往装配机里生成资源——heartbeat prompt 明确说了不要作弊，但它找到了漏洞。这个同一套 refinement 循环既能建合法技能，也能建「作弊」技能。

**数据**：ARC-AGI-3 RHAE Best@1，Opus 5 达到 95.5%，超过人类专家基准 95.4%。token 消耗比原生 harnesses 更低（用函数处理数据，而不是通过工具读取数据）。

---

## 两者的根本分歧

Recuris 和 Prime Agent 代表了两种不同的设计哲学：

**Recuris 是封闭系统**：记忆结构是固定的，Meta-Agent 控制更新边界，Skill Memory 的演化有严格门控。目的是让 Agent 在给定架构下更稳定地执行长程任务。

**Prime Agent 是开放系统**：Harness 本身是可变的，Agent 可以改写自己的工具和提示词。目的是让 Agent 自己发现更好的工作方式，包括 Harness 设计者没有预设的方式。

这和软件工程里的「严格流程 vs 敏捷迭代」有些像。Recuris 更像前者，Prime Agent 更像后者。

---

## 实践意义

对于长程运维、客服、办公 Agent：**Recuris 的分层记忆模型是更直接的参照**——Working Memory 追踪进度、Experiential Memory 提供技能、Skill Memory 做定向修正，这个结构对现有系统改造的成本相对低。

对于搭建可累积能力的 coding/reasoning 平台：**Prime Agent 的开放性更有价值**——一个可以自己改进 prompt 和技能的 Agent，在长时间尺度上能积累其他系统无法复制的适应性。

两者都在回答同一个问题：模型的下一轮进化，不靠更大的参数，靠更合理的状态管理机制。

---

**参考**

- Recuris：arXiv:2608.24876，GitHub: github.com/Gen-Verse/Recuris
- Prime Agent：arXiv:2608.23552，GitHub: github.com/PrimeIntellect-ai/prime-agent
