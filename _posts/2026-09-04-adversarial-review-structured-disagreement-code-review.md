# 对抗式评审：三个智能体比五个更好

## 多智能体评审的悖论

早期的 multi-agent 辩论系统（Multi-Agent Debate）证明，给 coding agent 增加评审角色能提升代码质量。但当 agent 数量增加时，收益递减——五个 agent 的团队在仓库级任务上并不比三个更好，而且协调开销（tokens 和时间）成比例增长。

另一个极端是让 agent 变成被动工具（subagent）：主 agent 发指令，subagent 执行，没有真正的交互。这高效，但失去了同行评审的价值。

Adversarial Review（AR）提出了一个中间路径：不需要很多 agent，但需要**结构化的分歧**。

---

## 三角色协议

AR 定义三个角色：

- **Main Agent（M）**：主编码智能体，写代码、改代码
- **Reviewer（R）**：评审智能体，评估代码质量，标记 bug
- **Critic（C）**：批评智能体，专门审计 Reviewer 的评审意见

工作流分为内外两层：

**内层循环（评审层）**：代码冻结。Reviewer 写评审意见，Critic 对评审本身进行审计。如果两者有分歧，必须来回辩论直到达成一致的判断——这个过程叫「结构化分歧」。

**外层循环（编辑层）**：只有当 Reviewer 和 Critic 达成稳定的、有证据的共识之后，Main Agent 才能动手改代码。

Critic 的分歧不是开放式的自由文本，而是结构化的类别：DISAGREE_EVIDENCE（证据级别不同意，需引用具体代码行）、DISAGREE_CONCERN（担忧级别，不需要完整证据）等。每个分歧必须附带代码引用。

---

## False Consensus：最值得注意的失败模式

论文在 SWE-PRBench 上发现了一个关键现象：朴素的 AR（Critic 没有被要求结构化分歧时）产生了**虚假共识**——Reviewer 和 Critic 在没有充分证据的情况下达成了一致。

一个具体案例：Reviewer 提出一个 bug，Critic 正确指出这不是 bug，但 Reviewer 通过「社交压力」让 Critic 最终同意了这个不存在的 bug。两个 agent 都同意，并不意味着判断正确。

解决方式是一行 prompt 的改动：要求 Critic 必须将其分歧归类为 DISAGREE_EVIDENCE 或 DISAGREE_CONCERN，并引用具体代码行。这个约束强制 Critic 不接受 Reviewer 的说服，必须用证据说话。结果是 F1 达到了所有测试方法中的最高值。

---

## 三个基准上的结果

**LiveCodeBench**：87% 通过率，超越 Zero-shot（77%）和五 agent 的 MARS 基线（82%）。三个 agent 赢五个 agent，靠的是交互结构，不是 agent 数量。

**SWE-PRBench**：结构化分歧版本的 AR 在 F1 上达到 0.533，是所有测试方法中的最高分。

**SWE-bench Verified**：75.2%，超过 Zero-shot（71.6%）和 MARS（72.6%）。论文观察到 AR 经常推动 agent 向调用栈更深处挖掘——修复的是 bug 的根本原因，而不是表面症状。

---

## 实践中的意义

AR 可以用两种方式实现：严格的 Python 编排器，或者一个 SKILL.md 文件让自律型 agent（比如 Claude Code）自行遵循。这说明协议本身是轻量的，不需要复杂的基础设施。

Token 开销是 zero-shot 的约 4.5 倍，但论文认为它处于帕累托前沿——没有其他测试方法在更低的成本下达到同样的准确率。不过这是一个值得关注的成本：对于简单任务，这个开销可能不值得。

论文提到的另一个失败模式：**过度编辑**。在 intense review 过程的压力下，agent 有时会修复根本没有坏的地方，或者添加不必要的功能，导致测试失败。这是引入评审循环后需要警惕的副作用。

---

## 一个反直觉的结论

「对抗」在这个协议里的含义不是破坏性的。Critic 的存在不是为了推翻评审，而是强制评审基于证据而非社交压力做出判断。

这和人类评审里的健康分歧是同一件事——评审者知道自己的意见会被严格追问，所以必须更认真地对待每一个判断。AR 把这个机制带到了多智能体协作里。

---

**参考**

- 论文：arXiv:2608.18167（ICML 2026 Workshop on DL4C 接收）
- GitHub：github.com/AweAI-Team/BeyondSWE（同一作者团队）
