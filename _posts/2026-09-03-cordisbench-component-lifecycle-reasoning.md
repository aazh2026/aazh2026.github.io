# CordisBench：让 LLM 推理动态 harness 里的组件生命周期

## 背景

arXiv:2609.01600，Damien Sileo 等（Univ. Lille / Inria），2026 年 9 月。

当 agent 能修改自己的运行时——装插件、卸载依赖、动态调整组件——推理的负担就从「写对代码」变成了「预测在各种卸载顺序下系统的终态是什么」。

CordisBench 用 1200 道题 + 可执行运行时 Cordis，专门考这件事。

---

## 核心问题：order-sensitive cleanup

论文给了一个极简的例子说明为什么这很难：

两个插件临时修改同一个应用设置：

- **Plugin A**：记录初始值（NORMAL），写入 FAST，清理时恢复 NORMAL
- **Plugin B**：记录当前值（FAST），写入 SAFE，清理时恢复 FAST

不同卸载顺序产生不同终态：

- **B 先卸载**：SAFE → FAST → NORMAL
- **A 先卸载**：SAFE → NORMAL → FAST

每个插件的清理逻辑单独看都完全合理，但当生命周期重叠时，互相干扰。这不是 bug，是**设计空间本身的固有复杂性**。

---

## Cordis 运行时

Cordis 是一个管理组件依赖和清理的动态运行时，核心机制：

- 组件可以 require 其他组件提供的服务
- 移除一个 provider 可能强制依赖它的组件也离开
- 组件可以有 effects，effects 的清理在该组件离开时运行
- 不同组件的清理不必互相独立

**重要约束**：Cordis 的全局恢复和合流（confluence）保证依赖**独立条件**——当交互超过这些条件时，CordisBench 故意把系统推到那些边界之外，逼模型直接做状态推理。

---

## Benchmark 设计

### 基本信息

- **1200 题**，来自 240 个独立生成系统
- **两种设置**：Controlled formal（形式化命题）+ Cordis-native（可执行运行时）
- **六个交互规模**：2, 4, 8, 16, 24, 32 relevant interactions
- **评分**：Jaccard similarity（集合类问题）、per-observable accuracy（预测问题）、executed success（重配置问题）

### 五类任务

| 任务类型 | 问法 | 核心推理 |
|----------|------|----------|
| **Localization** | 哪些组件/槽位会被这个生命周期操作影响？ | 依赖追踪 |
| **Schedule Prediction** | 给定卸载顺序，预测最终应用可见状态 | 时序状态传播 |
| **Guaranteed Conditions** | 哪些条件在**所有**合法顺序下都成立？ | 跨顺序全称推理 |
| **Reachable Conditions** | 哪些条件在**至少一个**合法顺序下成立？ | 跨顺序存在推理 |
| **Reconfiguration** | 为使目标在所有顺序下达成，最小待处置依赖集是什么？ | 逆向规划 |

### 规模度量

- **Formal setting**：1 interaction = 一个 effect group（修改相邻状态条目的同类组件集合）
- **Cordis-native setting**：1 interaction = 一个 dependent，其清理会修改观察到的 slot

注意：这是「同时相关的交互数」，不是系统总大小。规模上了 16 之后问题才真正变难。

---

## 主要发现

### 发现一：小系统尚可，规模是杀手

| 任务 | Size 2 | Size 16 | Size 32 |
|------|--------|---------|---------|
| GPT-5.6 Luna - Formal Reachable Condition | 91.7% | 14.1% | — |
| GPT-5.6 Luna - Cordis-native Prediction | 93.8% | 74.5% | 56.4% |
| DeepSeek V4 Flash - Formal Prediction | 81.2% | 57.7% | — |

Localization 保持高位，但**终态预测**和**跨顺序条件推理**随着交互数上升急剧下降。即便是 GPT-5.6 Luna，在 formal setting 的 reachable condition 上从 91.7% 跌到 14.1%。

### 发现二：额外推理资源可以恢复部分能力，但代价显著

GPT-5.6 Luna 在 medium reasoning effort 下：

- Cordis-native prediction：31.2% → 85.4%
- Executed reconfiguration：0% → 50%

**成本**：medium effort 下平均每题消耗 **~2967 reasoning tokens**。这不是免费的。

### 发现三：模型能选对目标但用非最小手段

Reconfiguration 任务中：

| Model | 达成目标 | 其中非最小方案 |
|-------|---------|--------------|
| Gemini 3.7 Flash | 92/96 | — |
| GPT-5.6 Luna | 67/96 | 11 非最小 |
| DeepSeek V4 Flash | 33/96 | 32 非最小 |

DeepSeek V4 Flash 在 96 题中有 32 题虽然达成了目标，但用了超过必要的 prior disposals。模型的行为不是「不会」，而是「会但贵」。

### 发现四：输出长度限制严重影响大型实例

把 28 个被截断的主回应上限从 8,192 提到 32,768 tokens 后：

| 任务 | Size 32 - 前 | Size 32 - 后 |
|------|-------------|-------------|
| Guaranteed | 20.2% | 71.2% |
| Reachable | 31.1% | 45.0% |
| Prediction | 79.8% | 84.0% |

 Guaranteed conditions 提升最显著（+51pp），说明这类问题需要大量推理 token 才能完整输出所有满足条件的 label。

---

## 解读：self-modifying runtime 的薄弱点不在生成

CordisBench 揭示的核心张力：**模型能识别affected components，但预测终态和跨顺序推理是其薄弱点**。

这指向一个结构性问题：当 harness 能够动态修改自身配置时，状态传播和清理顺序推理成为一个独立的推理负担——这个负担不在「生成正确代码」的能力谱上，而在「理解系统动态行为」的能力谱上。

论文的建议值得重视：**让 harness 承担更多可形式化分析的生命周期行为，让模型专注在高层次目标选择和无法形式化的 effect 推理上**。这是 harness 工程下一关的核心命题——如何设计运行时使生命周期行为可被分析，而非全部压在模型推理上。

---

**链接**: https://arxiv.org/abs/2609.01600
