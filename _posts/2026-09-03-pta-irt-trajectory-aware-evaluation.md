# PTA-IRT：用历史执行轨迹给 SWE Agent 做高效打榜

## 背景

arXiv:2609.01603，中山大学 + 华为云联合团队，2026 年 9 月。

传统高效评测 SWE Agent 的套路是：在 large benchmark 里挑一个小子集，跑完拟合 pass/fail 矩阵，然后推断全量分数。问题是——**你只看到了结果，丢掉了过程**。

这篇论文提出 PTA-IRT（Privileged Trajectory-Aware Item Response Theory），把历史轨迹当作 privileged information 接进 IRT 框架，在低预算下实现更准确的能力估计和排名恢复。

---

## 问题：结果导向评测丢掉的是什么

SWE benchmark 的任务需要 multi-step 推理：读代码库、改文件、调工具、等测试结果。传统 IRT 方法把这一切压缩成二元结果——pass 或 fail。

论文指出，这丢失了三类过程信号：

1. **Context Explored**：探索了哪些文件、函数、代码区域
2. **Edits Executed**：尝试了哪些修改
3. **Path Overview**：走了哪条解题路径

这些轨迹信息在历史执行中已经存在，但传统方法从来不把它们当输入。

---

## PTA-IRT 三阶段框架

### Stage 1：构建 Agent 轨迹表示

用 trajectory parser 提取 action steps，再通过 prompt protocol 把每条历史轨迹压缩成结构化摘要，四个字段：

| 字段 | 作用 |
|------|------|
| Task Goal | agent 要完成什么 |
| Context Explored | 看了哪些代码区域 |
| Edits Executed | 做了哪些修改 |
| Path Overview | 整体解题策略 |

这些摘要和 pass/fail 矩阵一起用于 offline 训练，作为 privileged information。**注意**：这些摘要只对历史交互可用，对未评测任务不可用——这是privileged 信息的核心约束。

### Stage 2：轨迹感知的校准子集选择

传统 IRT 用 Fisher Information 选信息量最大的任务，但纯信息量最大化倾向于选过难且互相相似的任务，反而伤害分数恢复。

PTA-IRT 的解法：把轨迹信息接进 4PL IRT 模型。

**4PL response probability:**

```
pᵢⱼ = cⱼ + (dⱼ - cⱼ) · σ[aᵢⱼ(θᵢ - bᵢⱼ)]
```

关键是引入 **trajectory-adjusted parameters**：

```
aᵢⱼ = aⱼ + mᵢⱼ · Δaᵢⱼ
bᵢⱼ = bⱼ + mᵢⱼ · Δbᵢⱼ
```

其中 mᵢⱼ ∈ {0,1} 标记该任务是否有可用的轨迹摘要，(Δa, Δb) 是轨迹驱动的残差项。

**选择算法：**
1. 按 pass rate 把任务划分到 difficulty bins
2. 按 bin size 比例分配校准预算
3. 在每个 bin 内选 Info(j) 最大的任务

**Info(j) = Fisher(j) · log(1 + ESS(j))**

ESS（Effective Sample Size）衡量该任务有多少条可用轨迹，是轨迹丰富度的代理量。

### Stage 3：LUPI 范式的能力估计

新 agent 只在子集 S 上执行，但利用 teacher-student 训练范式：

- **Teacher**：同时看到 task + summary（Q + Z*）
- **Student**：只看到 task（Q）

训练目标同时包含 student supervision（全局参数）和 teacher supervision（轨迹调整参数），KL 散度项把轨迹条件下的测量蒸馏到学生模型里。

测试时：冻结所有网络权重，在 S 上用 L-BFGS 优化拟合标量能力 θ*，再结合共享的 item 参数预测全量 benchmark 上的 pass 概率。

---

## 实验结果

### RQ1：10% 校准预算下的表现

| 指标 | PTA-IRT | Best Baseline | 提升 |
|------|---------|---------------|------|
| Avg MAE | 0.041 | 0.150 (PSN-IRT) | **73% reduction** |
| Avg Kendall's τ | 0.888 | 0.847 (VI) | **21% improvement** |
| Avg Spearman's ρ | 0.973 | 0.950 (VI) | **2.4% improvement** |

即便在 5% 校准预算下，τ 也能达到 0.768——已经进入实用区间（≥0.7-0.8）。

### RQ2：消融实验

| 配置 | Avg MAE | Avg τ |
|------|---------|-------|
| Full PTA-IRT | **0.041** | **0.888** |
| w/o Trajectory Scorer | 0.054 | 0.860 |
| w/o LUPI | 0.068 | 0.773 |
| + Top-K | 0.176 | 0.825 |
| + Clustering | 0.171 | 0.812 |

每个组件都有贡献：去掉轨迹感知 scorer MAE 上升 32%，去掉 LUPI 上升 66%。分层选择显著优于 Top-K 和聚类方法。

### RQ4：轨迹通道的内容分工

跨通道相似性分析揭示了清晰的任务分工：

| 通道 | 与 Question 的相似度 | 与 Answer 的相似度 |
|------|---------------------|-------------------|
| Task Goal | **0.776** | 0.532 |
| Edits Executed | 0.530 | **0.670** |
| Context Explored | 0.502 | 0.533 |

- **Task Goal** 跟踪 issue 文本（接近 question）
- **Edits Executed** 跟踪提交的 patch（接近 answer）
- **Context Explored / Path Overview** 保持过程特异性

这说明轨迹摘要的不同字段携带不同类型的预测信号，不是冗余的。

---

## 解读：评测范式从「结果抽样」转向「过程抽样」

PTA-IRT 最大的方法论贡献是把 **trajectory 作为 privileged information** 引入了 IRT 框架。这不是简单的「多加点特征」，而是对评测认知的根本转换：

**旧范式**：在结果空间里抽样——哪些任务最能区分 agent 能力
**新范式**：在过程空间里抽样——哪些任务的过程多样性最高、最值得校准

未来刷榜成本会下降，但刷的方向变了：**trajectory 多样性** 将成为新的优化目标，而不是补丁正确率。这对 benchmark 设计者和 agent 开发者都有深远影响。

---

**链接**: https://arxiv.org/abs/2609.01603
