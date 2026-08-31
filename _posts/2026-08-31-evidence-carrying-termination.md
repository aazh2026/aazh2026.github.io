---
layout: post
title: "Agent 何时该停？证据携带终止协议"
date: 2026-08-31T12:20:00+08:00
tags: [Agent OS, Control Loop, LLM推理]
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
>
> 本文核心观点：
> 1. **LLM Agent 最隐蔽的 bug 是"不会停"** — 不是报错，而是过早交差（premature unsupported termination）或陷入重试死循环
> 2. **ECT（Evidence-Carrying Termination）** 把终止从启发式判断变成类型化验证：Agent 必须产出一个结构化证书，每条 answer claim 都绑定到有效且在作用域内的 trace evidence
> 3. **实测结果：0/288 不安全完成**（对照 critic core：252/288）；真实世界 22 任务簇中 0/66 premature termination（对照 controller：40/66）
> 4. **Trust boundary 划定清晰**：ECT 证明的是"trace 范围内可重建"，不是"外部事实正确"或"安全"或"对齐"

---

## 两个控制问题

Interactive agent 面临两个核心控制问题：**下一步做什么**，以及——**已经做得够了吗？**

ReAct-style agent 交织推理与行动；feedback 和 reflection 可以触发另一次尝试。这些是回答"下一步"的主流方法。但"够了吗"这个问题，长期被忽视或用粗糙的启发式解决。

常见的停止信号容易产生但缺乏根基：模型可以 emit DONE；checklist 可以说 APPROVED；启发式可以观察到一个长回答和之前的调用；LLM critic 可以判断答案看起来合理。但没有哪个能说清楚：每个最终 claim 是由哪个 observation 支撑的、那个 evidence 是否覆盖了请求的实体和时间、一个派生值是否可以被 replay 重构。

论文 *When May an Agent Stop? Evidence-Carrying Termination for Tool-Using LLMs*（arXiv:2608.23623）把这个问题的严重性量化了：用一个受控的 benchmark 证明了当前主流方案（termination-critic core）的 unsafe completion rate 高达 87.5%，然后给出了 ECT 这个解法。

## ECT 的核心设计思想

ECT 把"生成停止授权"和"检查停止授权"分开：

- **Agent** 提出一个 certificate proposal
- **确定性验证器** 根据 trusted task contract 和不可变 evidence ledger 检查它
- 只有所有检查通过，Agent 才被授权返回 COMPLETE

这个结构里有三个关键组件：

**Contract（Rt）**：trusted requirements，枚举每个任务的 required answer slots、允许的 transform 和参数、entity 和 temporal scopes、evidence cardinality、nullability 和 numeric tolerance。

**Ledger（Et）**：receipt 的集合，每个 receipt 把 task ID、call ID、tool ID 绑定到 arguments 和 response 的哈希、source path 和 value 哈希、execution 和 validation 状态、以及结构化 scope。

**Certificate（Ct）**：候选边界，包含 task descriptor 的 digest（冻结的 task-ID/family/parameters/required-slots）、normalized ledger digest，以及 claims 列表，形式为 `(slot, value, evidenceIDs, transform)`。

验证器（Algorithm 1）是确定性的：对固定的 (Rt, Et, Ct) 三元组，总是返回相同结果。所有内部异常 closed to continue——也就是说，任何检查失败都返回 continue，而不是 complete。

> 💡 **Key Insight**
>
> ECT 不判断"这个答案对不对"（那是外部 truth），它只判断"这条答案是不是从 trace 里可重建的"（这是 replay soundness）。这个边界划定使得验证器可以完全确定性，同时把需要 human insight 的部分留给外部裁判。

## 五阶段验证流程

一个 receipt 进入 ledger 时经过 adapter 的 validation；验证器检查时执行五类 receipt-level 检查：

1. **Binding check**：task descriptor digest 必须与 trusted descriptor 匹配；ledger digest 必须与 candidate supplied 匹配
2. **Coverage check**：所有 required slots 必须存在，不允许 extra slots
3. **Evidence check**：每个 cited receipt 必须存在、属于该 task、已成功执行、已 validate
4. **Scope check**：receipt counts、entity/level/attribute/time scopes 必须与 contract 一致
5. **Transform check**：declared transform 和 exact parameters 必须在 contract 允许列表内，且 deterministic replay 必须等于 proposed value（在 contract 提供的 tolerance 内）

最后一条是 ECT 区别于其他方案的关键：不仅 evidence 要在，而且 transform 本身必须被 contract 显式授权，并且 replay 必须精确匹配——不允许凭感觉写的 transform 声称派生值正确。

## 信任边界：ECT 不是什么

论文专门用一节来明确 ECT 的 trust boundary：

- ECT 假设 Rt（contract）是 adequate 的，且 evidence adapter 诚实地记录了 validation、source、scope 和 values
- Hash binding 检测 changed 或 mismatched record，但它不是 signature 或 remote attestation
- 一个 malicious adapter 可以伪造内部一致的 ledger
- 一个 contract 可以遗漏相关的 requirement

因此 ECT 能保证的是：**每个 required terminal claim 可以从一个 bound trace 在 declared contract 和 adapter 假设下被重建**。外部 truth、authenticity、effects、safety 和 alignment 都在证书范围之外。

这个边界的精确表述值得细读：ECT 证明的是 receipt-level 的 replay correctness，不是"这个任务实际上完成了"这一语义判断。这使得 ECT 可以完全 deterministic，同时清晰地把自己的 scope 与 external judge 的 scope 区分开来。

## Benchmark 设计：48 tasks × 8 faults

ECT 的评估用了 8 个生成的 world，每个贡献 6 个家族的 1 个 task：lookup、aggregation、top-k、temporal comparison、hierarchy join、missing-data abstention。独立 SQLite 和纯 Python oracle 必须在答案上精确一致，task 才被 admit——没有 LLM 提供 gold answers。

每个 task 有 8 个受控 fault，与 clean snapshot 配对：

| Fault 类型 | 描述 |
|-----------|------|
| False completion | Agent 声称完成但未满足条件 |
| Irrelevant evidence | 引用了与 claim 无关的 evidence |
| Nested error | 名义上 transport 成功但内部有错误 |
| Scope mismatch | claim 的 entity/time scope 与 evidence 不符 |
| Partial coverage | 部分 required slot 被覆盖 |
| Synthesis corruption | 从多个 evidence 合成时引入错误 |
| Forged reference | 引用了不存在的 receipt |
| Recoverable stagnation | 可恢复的停滞（ECT 可以触发 recovery） |

48 tasks × 9 conditions（1 clean + 8 faults）= 432 snapshots，其中 36 clean 和 288 faulted held-out。

## 核心结果：静态评估

主要终点是 **Unsafe Completion Rate（UCR）**——在 fault snapshots 上错误返回 complete 的比例。

**结果震撼：**

| Policy | UCR（288 held-out fault snapshots）|
|--------|--------------------------------------|
| ECT | **0/288（0%）** |
| Critic Core（ inspected baseline）| 252/288（87.5%）|
| Difference | **−87.50 pp** |

H1 验证通过（p = 2.91 × 10⁻¹¹），六世界敏感性 bootstrap 区间 [−87.50, −87.50] pp，无穷窄。

在 clean snapshots 上，ECT 和所有 comparator 的 false continuation 都是 0——ECT 不会"永远不停"。

单检查 ablation 显示：大多数 fault 类型被某个单一检查类别捕获，但有 residual cases 表明某些 fault 同时违反多个条件。

## 真实世界确认：576 trajectories 闭环研究

V2 研究用 24 个 held-out tasks（worlds 10-13，每个家族 4 tasks），从 supported clean checkpoint 和 recoverably incomplete checkpoint 两个起点出发，与四种 termination policy pipeline 比较：

- **Current critic core**（primary comparator）
- **Faithful enclosing controller**（实际生产用的是什么）
- **Full-trace LLM critic**（是否更强的 critic 能弥补差距）
- **ECT**

24 × 2 × 4 × 3 = 576 trajectories（3 seeds 处理非确定性）。

**结果：**

| Outcome | ECT | Controller |
|---------|-----|-----------|
| Premature unsupported termination | **0/66** | 40/66（60.6%）|
| Supported completion | 97/132（73.5%）| 92/132（69.7%）|
| Successful recovery（from 18 trajectories）| **17/18** | — |

ECT 相对于 controller 的 premature termination 差异：−60.61 pp（95% interval: [−78.79, −40.91] pp）。

支持完成的 non-inferiority margin 是 −10 pp；实际差值是 +3.79 pp（ECT 略好），区间 [0.00, 9.09] pp 满足 margin。

ECT 在 18 个可恢复的 trajectories 中执行了成功 recovery，其中 17 个随后在 support 下完成。所有三个闭环 gate（binding、coverage、evidence）都通过。

> 💡 **Key Insight**
>
> ECT 不是通过"更保守地停止"来降低 premature termination 率的——它通过要求 evidence 覆盖来精确区分"真的可以停了"和"看起来停了但 evidence 不够"。这是"更精确"而非"更保守"的终止语义。

## 对 Control Loop 和费用护栏的启示

把 ECT 嵌入 Agent 的 control loop 有几个直接的应用场景：

**第一，作为费用护栏**。很多 Agent 系统现在靠 max-step 硬切来避免无限消耗。ECT 提供了比 max-step 更精细的停机条件：只有在 trace evidence 支持完成时才能停，而不是在步骤用完时停。这样可以在保证安全的前提下让 Agent 充分完成任务。

**第二，作为外部审计的输入**。当一个 Agent 的终止决策被记录为 ECT certificate 时，审计者可以独立重放验证这个决策是否合理。这直接把"停机决策"变成了可追责的 artifact。

**第三，作为 recovery 触发器**。ECT 的"continue with reason codes"输出本身就是诊断信息，可以直接映射到对应的恢复策略。18 个 recoverably stuck trajectories 中 17 个在 recovery 后完成，说明 reason codes 的诊断精度足够高。

这和"cost-utility alignment"是互补方向：cost-utility alignment 解决的是"值不值得继续消耗"的问题，ECT 解决的是"有没有足够证据证明已经完成"的问题。两者可以叠加。

---

## 结尾

ECT 这篇论文解决了一个被长期忽视但极其重要的问题：LLM Agent 的终止边界验证。与其依赖启发式（max-step、answer length、self-verification），不如在控制循环中加入一个确定性的、证据化的停机协议。

关键在于：把"停不停"从模型判断变成类型化验证。Agent 的输出不是"我认为完成了"，而是"这个 certificate 证明，在 contract 条件下，这条 trace 支持这个 claim"。验证器是确定性的，所以决策可复现、可追责。

对于构建 Agent OS 的团队，ECT 提供了一个可以直接嵌入 control loop 的终止模块——不是替代 planning 和 tool use，而是专门解决"够了没有"这个一直被当作小问题对待的控制问题。

---

*Published on 2026-08-31*
