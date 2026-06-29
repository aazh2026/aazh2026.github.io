---
layout: post
title: "\"Kimi 团队的 Attention Residuals：挑战 Transformer 残差连接\""
date: 2026-03-18T17:00:00+08:00
permalink: /kimi-attention-residuals-transformer/
tags: [Machine Learning, Transformer, Attention, Architecture, Kimi]
description: "Kimi 团队提出 Attention Residuals，用可学习动态聚合替代固定残差连接，Block AttnRes 在接近标准 Transformer 内存开销下实现显著效果提升。"
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
>
> 本文核心观点：
> 1. **可学习的动态聚合** — Kimi 团队提出 Attention Residuals（AttnRes），用可学习的注意力机制替代固定残差连接，每层动态决定聚合前面哪些层的表征。
> 2. **Block AttnRes 解决内存问题** — 完整 AttnRes 内存随层数平方增长；Block AttnRes 通过分块方案将内存降到接近标准 Transformer，同时保留选择性聚合能力。
> 3. **标准残差的严格超集** — 当注意力权重均匀分布时，AttnRes 数学上退化为标准残差；但通常模型学到更有信息量的非均匀权重，在翻译、语言建模、文本分类等基准上取得显著改进。
> 4. **对 Transformer 架构的原创贡献** — 这是中国企业对 Transformer 核心组件的原创改进，AttnRes 的参数化连接为神经架构搜索（NAS）提供了新的搜索空间。

---

## Transformer 的残差连接问题

### 标准残差连接

Transformer 使用 PreNorm 架构：

**关键特性**：
- 每层输出 = 输入 + 子层输出
- 权重固定为 1.0
- 所有前面层贡献相等累积

### 固定聚合的问题

**问题 1：贡献稀释**

随着深度增加：
- 早期层的贡献被稀释
- 信息难以传递到深层
- 梯度流动问题

**问题 2：无法选择性关注**

某些任务需要：
- 关注特定层的输出
- 忽略噪声层
- 动态调整权重

但固定残差连接无法做到。

**问题 3：隐藏状态增长失控**

导致：
- 训练不稳定
- 需要大的学习率调整
- 数值问题

---

## Attention Residuals 的核心思想

### 基本思想

### 用注意力机制替代固定相加

**关键创新**：
- 每层可以选择性关注前面所有层
- 权重由输入决定（可学习）
- Softmax 归一化保证稳定性

> 💡 **Key Insight**
>
> 每层可以选择性关注前面所有层，权重由输入决定（可学习），Softmax 归一化保证稳定性。这意味着模型动态决定聚合哪些层的信息，而不是被固定权重稀释。

### 直观理解

标准残差连接将每一层的输出简单地加回输入，形成 `output = input + SubLayer(output)` 的形式。这种"复制粘贴"式的传递方式让所有层以相同权重累积——最终深层网络无法分辨哪些信息来自哪个学习阶段。

### 与标准 Attention 的区别

| 维度 | 标准 Self-Attention | Attention Residuals |
|------|---------------------|---------------------|
| **关注对象** | 序列位置 | 网络层 |
| **Query** | 当前 token | 当前层输出 |
| **Key/Value** | 其他 tokens | 前面层输出 |
| **目的** | 捕获序列依赖 | 选择性聚合层表征 |

<object data="/assets/images/2026-03-18-kimi-attention-residuals-01-residual-comparison.svg" type="image/svg+xml" width="100%" aria-label="Standard Residual vs Attention Residuals" role="img"></object>

*图 1：Standard Residual（❌）使用固定权重（=1.0）的加法残差连接，所有层贡献均等；Attention Residual（✅）通过注意力机制动态决定各层的聚合权重，实现选择性层聚合。*

<object data="/assets/images/2026-03-18-kimi-attention-residuals-02-layer-aggregation.svg" type="image/svg+xml" width="100%" aria-label="层聚合方式对比与 Block AttnRes" role="img"></object>

*图 2：层聚合方式对比——标准残差连接的固定权重导致贡献稀释；Attention Residuals 通过可学习权重实现自适应层聚合，Block AttnRes 在保持内存效率的同时实现这一机制。*

---

## 技术细节：从 AttnRes 到 Block AttnRes

### Attention Residuals（AttnRes）

### 数学公式

AttnRes 将层聚合从固定加权求和改为注意力加权聚合。用数学语言表达，第 $l$ 层的输出 $\mathbf{y}^l$ 是前面所有层值的加权平均：

$$\mathbf{y}^l = \sum_{i=1}^{l} \text{Softmax}(\mathbf{q}^l \cdot \mathbf{k}^i) \cdot \mathbf{v}^i$$

其中 $\mathbf{q}^l$ 是当前层的 Query（由当前层输出经线性变换得到），$\mathbf{k}^i$ 和 $\mathbf{v}^i$ 分别是第 $i$ 层输出的 Key 和 Value。注意力权重 $\text{Softmax}(\mathbf{q}^l \cdot \mathbf{k}^i)$ 由当前层动态计算，而非手工设定——这与标准残差 $y_l = x_l + F(x_l)$ 中固定为 1.0 的权重形成鲜明对比。当所有注意力权重相等（$=1/l$）时，AttnRes 退化为标准残差，因此标准残差是 AttnRes 的一个特例。

### PyTorch 伪代码

Block AttnRes 的核心实现分为块内聚合和块间残差两步。块内聚合需要维护一个 `prev_values` 列表，收集当前块内所有前面层的 Value；`prev_keys` 收集对应的 Key，然后在当前层 Query 与所有前面层的 Key 计算注意力权重后，对 Value 做加权求和得到聚合结果。关键代码片段：

```python
# 块内 AttnRes 计算
prev_values = [v1, v2, v3, v4]   # 当前块内前面层的 Value
prev_keys   = [k1, k2, k3, k4]   # 对应的 Key
q = W_q @ x                       # 当前层 Query

# 计算注意力权重并归一化
attn_weights = softmax(q @ torch.stack(prev_keys).T / sqrt(d))
# 加权求和
attn_output = attn_weights @ torch.stack(prev_values)  # 聚合结果
```

块间使用标准残差连接：`x = x + attn_output` 或 `x = x + f(attn_output)`，具体取决于是否使用门控机制。推理时可以缓存每个块的聚合结果，实现接近标准 Transformer 的推理速度。

**问题**：
- 第 L 层需要存储前面 L-1 层的输出
- 内存随深度线性增长：O(L × B × S × D)
- 对于大模型（L=96, B=32, S=4096, D=8192）不可行

> 💡 **Key Insight**
>
> 第 L 层需要存储前面 L-1 层的输出，内存随深度线性增长 O(L × B × S × D)。对于大模型（L=96, B=32, S=4096, D=8192）来说，完整 AttnRes 的内存需求在当前硬件上不可行——这就是 Block AttnRes 分块方案出现的直接原因。

### Block AttnRes：工程解决方案

**核心思想**：分块注意力

### 具体方法

Block AttnRes 的核心设计思想是"分块局部性"：将 L 层 Transformer 划分为多个大小为 B 的块（例如 B=4 或 B=8），块内各层执行完整的 AttnRes 操作（当前层可以选择性地关注块内所有前面层的输出），块与块之间则通过标准残差连接实现信息流动。

这个设计的直觉来自两方面。第一，实践中发现 AttnRes 的选择性聚合收益主要集中在邻近层之间——太远的历史层（如第 3 层关注第 20 层）提供的边际信息量递减，因此不需要维护所有历史层的完整注意力。第二，深度网络的层级结构天然具有局部性：浅层捕获局部特征，深层捕获全局语义，块内 AttnRes 正好在这个粒度上建模层级间的选择性信息流动。

分块策略的选择需要权衡：较小的 B（如 B=4）提供更细粒度的选择性但内存开销更大；较大的 B（如 B=8）更接近标准 Transformer 的内存效率但牺牲了部分灵活性。KimI 团队的实验表明 B=4 或 B=8 是较好的折中点，在翻译（WMT'14 En-De BLEU 28.5）和语言建模（WikiText-103 PPL 17.2）等任务上都取得了显著优于标准 Transformer 的结果。

**内存优化**：

| 方法 | 内存复杂度 | 备注 |
|------|-----------|------|
| 完整 AttnRes | O(L² × D) | 不可行 |
| Block AttnRes (B=4) | O(L²/B × D) | 减少 4x |
| Block AttnRes (B=8) | O(L²/B × D) | 减少 8x |
| 带压缩的 Block | O(L × D) | 接近标准 Transformer |

### Block 聚合表示

Block AttnRes 的块内聚合可以用公式统一表达：对于块 $b$ 内的第 $l$ 层（$l$ 属于块 $b$），其输出为块内前面层的注意力加权聚合加上标准残差路径：$\mathbf{y}^l = \text{AttnRes}(l, b) + \mathbf{x}^l$，其中 $\text{AttnRes}(l, b)$ 只在块内（L/B 的范围内）计算 Key/Value 的注意力，避免了完整 AttnRes 的 O(L²) 内存开销。



---

## 为什么可学习聚合更好？

### 理论优势

**1. 自适应信息流动**

> 💡 **Key Insight**
> 不同层捕获不同抽象级别的特征：浅层学语法、中层学语义、深层学推理。AttnRes 让模型动态选择需要哪一层的信息，而不是被固定权重稀释。

**2. 梯度流动优化**

> 💡 **Key Insight**
> 标准残差的加法路径会产生梯度消失；AttnRes 的注意力路径为每层创建独立的梯度通道，缓解了深层网络的梯度流动问题。

**3. 表达能力提升**

> 💡 **Key Insight**
> 标准残差不过是 AttnRes 的一个特例——当所有注意力权重都等于 1/L 时，两者在数学上等价。换言之，AttnRes 是标准残差的严格超集。
### 实证分析

> 💡 **Key Insight**
> Kimi 团队在翻译、语言建模、文本分类等基准上的实验表明：注意力权重并非均匀分布，而是呈现出自适应选择特性——某些层被显著增强，另一些则被抑制。

### 注意力权重可视化

注意力权重热力图是理解 AttnRes 行为的关键工具。横轴为当前层（Layer L），纵轴为被关注的层（Layer 1 到 L-1），颜色深浅表示学习到的注意力权重。Kimi's paper 中的实验显示：浅层（Layer 1-3）通常对最早的几层有较高权重，因为早期层捕获的是词法、语法等底层特征；深层（Layer L-3 到 L-1）则更关注中层语义层，形成层级化的信息流动。值得注意的是，某些任务中早期层会获得异常高的权重——这说明模型学到了"跳过中间层直接聚合"的能力，这是标准残差完全无法实现的。热力图的对角线填充（每层关注自己附近的几层）也是常见模式，表明局部性在深度网络中依然重要。

---



## 实验结果与性能分析

### 实验设置

**模型配置**：
- 基础：Transformer-base (L=12, D=768, H=12)
- 大模型：Transformer-large (L=24, D=1024, H=16)

**基准测试**：
- 机器翻译：WMT'14 En-De, En-Fr
- 语言建模：WikiText-103
- 文本分类：GLUE 基准

### 主要结果

**机器翻译（WMT'14 En-De）**：

| 模型 | BLEU | 参数量 | 训练时间 |
|------|------|--------|----------|
| Transformer-base | 27.3 | 65M | 100% |
| + AttnRes | **28.7** | 67M | 105% |
| + Block AttnRes (B=4) | 28.5 | 67M | 102% |

**语言建模（WikiText-103）**：

| 模型 | PPL | 参数量 |
|------|-----|--------|
| Transformer | 18.7 | 247M |
| + AttnRes | **17.2** | 251M |

**GLUE 基准（平均）**：

| 模型 | 分数 | 相比基线 |
|------|------|----------|
| BERT-base | 79.6 | - |
| + AttnRes | **81.3** | +1.7 |

### 效率分析

**训练速度**：

| 方法 | 相对速度 | 内存开销 |
|------|----------|----------|
| 标准 Transformer | 100% | 100% |
| AttnRes | 85% | 180% |
| Block AttnRes (B=4) | 95% | 125% |
| Block AttnRes (B=8) | 98% | 115% |

**推理速度**：

Block AttnRes 可以在推理时缓存块表示，速度接近标准 Transformer。

---

## 内存优化：Block AttnRes 的工程智慧

### 计算 vs 内存权衡

**标准 Transformer**：
- 内存：O(L × D) 存储每层输出
- 计算：O(1) 每层聚合

**完整 AttnRes**：
- 内存：O(L² × D) 存储所有层间注意力
- 计算：O(L² × D) 注意力计算

**Block AttnRes**：
- 内存：O(L × D + B × D) ≈ O(L × D) （接近标准）
- 计算：O(L²/B × D) （可接受）

> 💡 **Key Insight**
> Block AttnRes 的核心洞察是：不需要在所有层之间做注意力。只需在块内（L/B 的范围内）做完整注意力，块间用标准残差，就能在极低的内存开销下获得大部分收益。

### 实现技巧

**1. 梯度检查点**

梯度检查点（Gradient Checkpointing）是训练大模型的标准内存优化技术，其核心思想是"用计算换内存"。标准 AttnRes 在反向传播时需要保存所有 L-1 层输出用于计算注意力权重梯度；启用梯度检查点后，只保存每隔 B 层的重要检查点，反向传播时在需要的地方重新计算中间层输出。PyTorch 中可以通过 `torch.utils.checkpoint.checkpoint` 包装前向计算实现。对于 AttnRes 来说，梯度检查点的收益尤其明显，因为注意力权重计算的反向传播需要遍历所有历史层的激活值，重计算成本相对较低，节省的内存更可观。

**2. 混合精度训练**

混合精度训练（FP16/BF16）是加速训练和减少显存占用的主流方法。AttnRes 的特殊之处在于 softmax 输出的注意力权重通常需要更高精度以保证数值稳定——Kimi 团队建议将注意力权重保持在 FP32，即使模型的其余部分使用 FP16 或 BF16。实现上，可以在 `autocast` 上下文中将 softmax 输出显式转换为 FP32，权重更新时再切回低精度。损失缩放（loss scaling）对于 BF16 训练通常不是必需的，但对于 FP16 仍需注意。

**3. 分块计算**

分块计算是 Block AttnRes 的核心工程技巧——将 L 层分成大小为 B 的多个块，块内执行完整的 AttnRes（选择性关注块内所有前面层），块间用标准残差连接。实现上维护一个滑动窗口：进入新块时丢弃最早的 B 层激活值，不再保存。处理流程是顺序的——先计算 Block 1 内所有层的 AttnRes，释放中间激活，再处理 Block 2——这使得内存峰值从 O(L × D) 降到 O(B × D)，基本接近标准 Transformer 的水平。实验数据（见效率分析表格）表明，B=4 时训练速度为标准 Transformer 的 95%，B=8 时达到 98%，同时保留了大部分选择性聚合的收益。

---



## 对 Transformer 架构的影响

### 短期影响

**1. 即插即用的改进**

Block AttnRes 可以：
- 直接替换现有 Transformer 的残差连接
- 无需修改其他组件
- 保持模型兼容性

**2. 训练和推理的分离**

训练时使用 Block AttnRes：
- 更好的梯度流动
- 更快的收敛

推理时可以：
- 保持 Block 结构
- 或回退到标准残差（如果权重接近均匀）

> 💡 **Key Insight**
>
> 训练时使用 Block AttnRes 有更好的梯度流动和更快收敛，推理时可以保持 Block 结构或回退标准残差。这种训练-推理分离让架构在部署时几乎没有额外开销。

### 长期影响

**1. 新架构范式**

从"层堆叠"到"动态图"：
**2. 神经架构搜索（NAS）**

AttnRes 的参数化连接为 NAS 提供了新的搜索空间。

> 💡 **Key Insight**
>
> AttnRes 的参数化连接为神经架构搜索（NAS）提供了新的搜索空间——哪些层应该互相关注、关注强度是多少，这些以前是固定的，现在都可以端到端学习。

**3. 可解释性提升**

注意力权重揭示了：
- 哪些层对当前任务重要
- 信息如何在网络中流动
- 模型的"关注点"

---

## 局限与未来方向

### 当前局限

**1. 只在标准基准上验证**

- 尚未在超大模型（GPT-4 规模）上验证
- 长序列（>8K）效果未知
- 多模态任务未测试

**2. 计算开销**

即使 Block AttnRes：
- 仍有 2-5% 训练速度下降
- 需要仔细调优块大小
- 小批次时效率不高

**3. 与现有优化的兼容性**

- 与 FlashAttention 的集成
- 与 MoE（混合专家）的兼容性
- 需要进一步研究

### 未来方向

**1. 自适应块大小**

当前 Block AttnRes 使用统一固定的块大小 B，但直觉上不同深度的层可能需要不同程度的"历史记忆"。自适应块大小提议让块大小随层深度动态变化——浅层用较小的 B（更精细的选择性聚合），深层用较大的 B（更多依赖压缩表征）。实现方式可以是为每个块引入一个可学习的缩放因子，或者根据序列长度、任务类型在推理时动态选择 B 值。论文中 B=4 vs B=8 的对比实验已经显示不同 B 值对最终效果有显著影响，这为自适应 B 提供了实验基础。

**2. 层次化 AttnRes**

层次化 AttnRes 将 AttnRes 扩展到多尺度：块内使用细粒度的 AttnRes（关注单个层），块间使用粗粒度的 AttnRes（关注整个块的聚合结果）。这与视觉中的多尺度特征提取（如 SIFT 金字塔）或 HumanMAP 等层次化注意力机制在精神上一致。一个具体的设计是：先用标准 AttnRes 聚合块内各层，再对每个块的输出做一次块间 AttnRes，形成一个两层的聚合树。理论上这能让模型同时捕获从细粒度到粗粒度的多层次信息流。

**3. 跨模态扩展**

AttnRes 的核心思想——"可学习的跨层聚合"——可以跨出纯语言模态。在视觉 Transformer（ViT）中，每层可以选择性关注早期 patch embeddings 而非固定通过残差传递，这在理论上能让视觉模型更好地捕获从局部到全局的层次化表征。在多模态场景中，文本和图像的各层表征可以通过跨模态 AttnRes 相互 attend——例如语言模型的深层可以关注视觉模型的浅层特征，实现更紧密的模态融合。Kimi 团队在论文中提到这是未来探索方向，尚未有公开的实验结果。

---

## 结尾：架构创新的中国声音

Attention Residuals 代表了几个重要趋势：

### 1. 中国 AI 研究的原创贡献

不是跟随，而是引领：
- 挑战 Transformer 的基础组件
- 提出新的架构范式
- 高质量的工程实现

### 2. 实用主义的创新

不是追求炫酷，而是解决问题：
- 针对真实训练问题（梯度流动、信息稀释）
- 提供可扩展的解决方案（Block AttnRes）
- 详细的实验验证

### 3. 开源精神

- 论文详细披露实现细节
- 便于社区复现和扩展
- 推动领域进步

### 核心洞察

> **Transformer 的残差连接不是最优的，可学习的动态聚合可能更好。**

这不是对 Transformer 的否定，而是进化。

就像从 RNN 到 Attention，从 Attention 到 Transformer，现在可能是从固定残差到动态聚合的下一个步骤。

### 对开发者的启示

1. **关注架构创新**
   - Transformer 不是终点
   - 基础组件仍有改进空间
   - 简单的改变可能带来大的提升

2. **工程与理论并重**
   - 好想法需要好的实现
   - Block AttnRes 展示了工程智慧
   - 内存优化与算法创新同等重要

3. **中国 AI 的力量**
   - Kimi 团队展示了世界级研究能力
   - 中国公司可以做出原创贡献
   - 关注国内团队的研究成果

---

## 参考与延伸阅读

- [Attention Residuals](https://arxiv.org/abs/2603.15031) - Kimi 团队论文
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) - Transformer 原始论文
- [Fixup Initialization](https://arxiv.org/abs/1901.09321) - 相关残差连接研究
- [ReZero](https://arxiv.org/abs/2003.04887) - 另一种残差连接改进

---

*本文基于 Reddit r/MachineLearning 讨论和 arXiv 论文。*

*发布于 [postcodeengineering.com](/)*
