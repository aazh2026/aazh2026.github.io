---
paper_id: 03
title_en: "Jacobi Forcing: Turning Autoregressive LLMs into Parallel Decoders"
title_cn: "Jacobi Forcing：将自回归 LLM 转化为并行解码器"
category: AI工程化 / 推理优化
tier: C
collected: 2026-07-02
week: 2026-W27
---

## 源信息

- **作者 / 机构**：UCSD Hao AI Lab、上海交大 Deng Lab
- **发布时间**：2025-12（arXiv: 2512.14681）
- **原文**：[arXiv:2512.14681](https://arxiv.org/abs/2512.14681)
- **代码**：[hao-ai-lab/JacobiForcing](https://github.com/hao-ai-lab/JacobiForcing)

## 核心技术亮点

- 保留 AR 因果注意力与 KV Cache 兼容性，通过 Jacobi 固定点迭代实现块内并行解码；编码 / 数学任务最高 4× wall-clock 提速
- 无需重训或架构改动，作为 AR 模型 wrapper 即插即用；提供 HuggingFace 完整适配示例
- 给出 tokens-per-forward 与 accept length 随 block_size 变化的实测 trade-off 曲线

## 推荐受众

希望低成本提速非生成密集型（代码补全 / 结构化抽取）服务的部署工程师。

## 初步分诊

- **适配性**：Tier C — 跳过
- **理由**：纯并行解码实现细节，架构性弱；博客主线不深入 serving 层
- **若用**：作为代码补全场景下的"即插即用加速"一个段落引用；单独成稿性价比低