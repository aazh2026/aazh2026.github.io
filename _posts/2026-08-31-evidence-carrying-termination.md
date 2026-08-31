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
> 1. **LLM Agent 的终止边界问题** — 常见停止信号（DONE token、checklist、启发式、LLM critic）都只能产生 claim 但不证明 evidence 和 claim 之间的对应关系
> 2. **ECT（Evidence-Carrying Termination）** — Agent 必须产出结构化证书，每条 answer claim 都绑定到有效且在作用域内的 trace evidence；确定性验证器检查 binding、coverage、evidence、scope、transform 五类条件
> 3. **实测结果** — 静态 288 个 fault snapshots：ECT 0/288 不安全完成，对照 critic core 252/288；576 真实轨迹：ECT 0/66 premature termination，对照 controller 40/66
> 4. **Trust boundary** — ECT 证明的是"trace 范围内可重建"，不是"外部事实正确"或"安全"或"对齐"

---

## 背景：终止边界为何成问题

Interactive agent 面临两个核心控制问题：**下一步做什么**，以及——**已经做得够了吗？**

ReAct-style agent 交织推理与行动；feedback 和 reflection 可以触发另一次尝试。但"够了吗"这个问题长期被忽视或用粗糙的启发式解决。

常见的停止信号（DONE token、checklist、answer length 启发式、LLM critic）都只产生一个 claim，不证明这个 claim 和 trace evidence 之间的对应关系——每个最终 claim 是由哪个 observation 支撑的、evidence 是否覆盖了请求的 entity 和 time、派生值是否可被 replay 重构，这些问题在现有方案中均未得到回答。

## ECT 的核心设计

ECT 把"生成停止授权"和"检查停止授权"分开：

- **Agent** 提出一个 certificate proposal
- **确定性验证器** 根据 trusted task contract 和不可变 evidence ledger 检查它
- 只有所有检查通过，Agent 才被授权返回 COMPLETE

三个关键组件：

**Contract（Rt）**：trusted requirements，枚举每个任务的 required answer slots、允许的 transform 和参数、entity 和 temporal scopes、evidence cardinality、nullability 和 numeric tolerance。

**Ledger（Et）**：receipt 的集合，每个 receipt 把 task ID、call ID、tool ID 绑定到 arguments 和 response 的哈希、source path 和 value 哈希、execution 和 validation 状态、以及结构化 scope。

**Certificate（Ct）**：候选边界，包含 task descriptor 的 digest（冻结的 task-ID/family/parameters/required-slots）、normalized ledger digest，以及 claims 列表，形式为 `(slot, value, evidenceIDs, transform)`。

验证器是确定性的：对固定的 (Rt, Et, Ct) 三元组，总是返回相同结果。所有内部异常 closed to continue——任何检查失败都返回 continue。

## 五阶段验证流程

验证器执行五类 receipt-level 检查：

1. **Binding check**：task descriptor digest 必须与 trusted descriptor 匹配；ledger digest 必须与 candidate supplied 匹配
2. **Coverage check**：所有 required slots 必须存在，不允许 extra slots
3. **Evidence check**：每个 cited receipt 必须存在、属于该 task、已成功执行、已 validate
4. **Scope check**：receipt counts、entity/level/attribute/time scopes 必须与 contract 一致
5. **Transform check**：declared transform 和 exact parameters 必须在 contract 允许列表内，且 deterministic replay 必须等于 proposed value（在 contract tolerance 内）

Transform check 是 ECT 区别于其他方案的关键：不仅 evidence 要在，transform 本身必须被 contract 显式授权，replay 必须精确匹配。

## Trust Boundary

论文明确指出 ECT 的假设和局限：

- ECT 假设 Rt（contract）是 adequate 的，且 evidence adapter 诚实地记录了 validation、source、scope 和 values
- Hash binding 检测 changed 或 mismatched record，但不是 signature 或 remote attestation
- Malicious adapter 可以伪造内部一致的 ledger；contract 可以遗漏相关 requirement

ECT 能保证的是：**每个 required terminal claim 可以从一个 bound trace 在 declared contract 和 adapter 假设下被重建**。外部 truth、authenticity、effects、safety 和 alignment 都在证书范围之外。

## Benchmark 设计

评估用了 8 个生成的 world，每个贡献 6 个家族的 1 个 task：lookup、aggregation、top-k、temporal comparison、hierarchy join、missing-data abstention。独立 SQLite 和纯 Python oracle 必须在答案上精确一致，task 才被 admit。

每个 task 有 8 个受控 fault：false completion、irrelevant evidence、nested error under nominal transport success、scope mismatch、partial required-slot coverage、synthesis corruption、forged evidence reference、recoverable stagnation。

48 tasks × 9 conditions = 432 snapshots，其中 288 faulted held-out。

## 核心结果

**静态评估（288 held-out fault snapshots）**：

| Policy | Unsafe Completion Rate |
|--------|----------------------|
| ECT | **0/288（0%）** |
| Critic Core（inspected baseline）| 252/288（87.5%）|
| Difference | **−87.50 pp** |

H1 验证通过（p = 2.91 × 10⁻¹¹），六世界敏感性 bootstrap 区间 [−87.50, −87.50] pp。Clean snapshots 上 ECT 和所有 comparator 的 false continuation 都是 0。

**真实世界确认（576 trajectories）**：

| Outcome | ECT | Controller |
|---------|-----|-----------|
| Premature unsupported termination | **0/66** | 40/66（60.6%）|
| Supported completion | 97/132 | 92/132 |
| Successful recovery | 17/18 | — |

Premature termination 差异：−60.61 pp（95% interval [−78.79, −40.91] pp）。Supported completion 满足 −10 pp non-inferiority margin。

---

## 结尾

ECT 提出了一种携带证据的终止协议：Agent 输出不是"我认为完成了"，而是"这个 certificate 证明，在 contract 条件下，这条 trace 支持这个 claim"。验证器是确定性的，决策可复现、可追责。论文的核心发现是：当前主流终止方案（termination-critic core）在受控评估下的 unsafe completion rate 高达 87.5%，而 ECT 在相同条件下达到 0%。

---

*Published on 2026-08-31*

**参考链接**

- Paper: [When May an Agent Stop? Evidence-Carrying Termination for Tool-Using LLMs](https://arxiv.org/abs/2608.23623) — arXiv:2608.23623
