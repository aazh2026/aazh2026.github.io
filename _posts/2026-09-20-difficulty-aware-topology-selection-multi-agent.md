---
layout: post
title: "DATS：多 Agent 代码生成，该用哪种协作拓扑由模型自己决定"
date: 2026-09-20T14:00:00+08:00
tags: [多Agent系统, 协作拓扑, 难度感知, 代码生成, 强化学习路由]
description: "多 Agent 协作用固定拓扑是错误假设。DATS 让模型学习根据问题难度动态选择协作拓扑——最难问题 hierarchical 拓扑比单 Agent 高 21.1 分，token 成本却只高 10 倍。"
author: "@postcodeeng"
series: aise
subtopic: multi-agent
---

> **TL;DR**
>
> 多 Agent 代码生成长期用固定拓扑（Planner → Dev → Reviewer），这篇发现：
> 拓扑效果跟问题难度高度相关——最简单的问题单 Agent 和 hierarchical 几乎没差别；
> 最难的问题 hierarchical 比单 Agent 高 21.1 pass@1 分。
> DATS 用图网络预测每个拓扑的成功率，选择「成功概率减成本」最高的那个。

---

## 固定拓扑的根本问题

大多数多 Agent 代码生成系统的工作流是**人拍脑袋定的**：

```
Planner → 写计划 → Dev → 写代码 → Reviewer → 审查
```

这个拓扑对所有问题都一视同仁。但问题在于：**不同难度的问题，需要的协作模式根本不同**。

- 简单问题（写个快速排序）：一个 Agent 直接搞定就行，加协作层只会增加上下文搬运开销
- 复杂问题（实现一个分布式一致性协议）：需要多层验证和迭代，hierarchical 协作才能充分发挥作用

---

## 核心发现：拓扑效果随难度剧烈变化

论文在 APPS、HumanEval+、LiveCodeBench 的 614 个问题上评估了 5 种拓扑，发现了一个惊人的模式：

| 问题难度 | 单 Agent pass@1 | Hierarchical pass@1 | 差距 |
|---------|----------------|---------------------|------|
| 最简单（top 1/3） | 基线 | +2.4 分 | 可忽略 |
| 中等难度 | 基线 | +8 分左右 | 值得 |
| 最难（bottom 1/3） | 基线 | **+21.1 分** | 巨大 |

同时 token 成本：hierarchical 约是单 Agent 的 **10 倍**。

所以对简单问题用 hierarchical 是浪费，对难问题用单 Agent 是自杀。

---

## DATS：Difficulty-Aware Topology Selector

论文提出的 DATS 解决的就是这个问题：**让模型自己判断该用哪种拓扑**。

### 架构

1. **Topology Embedding**：把 5 种拓扑建模为「连通性顺序」上的节点，而非独立标签。图网络（graph network）在这里的作用是捕捉拓扑之间的结构关系。
2. **难度预测器**：输入问题的 39 个可解释特征（代码长度、循环深度、函数调用数等），输出每个拓扑的「成功率预测」。
3. **路由决策**：选择「预测成功率 - 成本」最大的拓扑。

关键设计：**成本是一个单一标量，可以在不重训练的情况下重新校准**。这意味着实际部署时可以用成本约束直接控制路由策略。

### 在 Budget-Matched 协议下的结果

固定 cost = always-hierarchical 成本的 40%：

| 方法 | pass@1 |
|------|--------|
| Always-hierarchical | 73.6% |
| Strongest learned competitor | 74.3% |
| **DATS** | **77.7%** |

4.1 分的 gain 在 4 种 backbone（跨越 14 分能力差距）上都成立。

---

## 为什么这不只是「选择器」，而是「自组织软件工厂」的前奏

把通信拓扑当成可学习空间，这个思想的价值远不止「省 token」。

传统软件工程里，「团队结构」是人定的。Fighter 模式、Master-Slave 模式、功能团队 vs 矩阵组织——这些都是人类管理者拍的板。

DATS 指向的是：**agent 团队的组织结构本身可以随任务动态优化**。这不是多 Agent 协作的门禁设计，而是**多 Agent 协作的拓扑学**。

当这个思路成熟后，「这个任务需要几个 agent、它们之间怎么连接」将不再是设计者拍脑袋决定的事，而是模型根据任务特征自适应涌现的结果。

---

## 批评性解读

**5 种拓扑还是太少**。真实项目里可能的协作模式远不止 5 种，而且这 5 种是预先定义的，不是学出来的。更大的搜索空间里可能存在更优的拓扑。

**39 个特征的可解释性是一把双刃剑**：可解释意味着部署时容易调试，但也意味着模型的能力上限被限制在人类能理解的特征范围内。

**跨域泛化（数学推理）的结果虽然显著**，但代码生成和数学推理的「协作拓扑需求」是否真可类比，存疑。

---

**[原论文：Learning How Much to Collaborate: Difficulty-Aware Topology Selection for Multi-Agent Code Generation](https://arxiv.org/abs/2609.13890)**（arXiv:2609.13890）
