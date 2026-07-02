---
paper_id: 03
title_en: "LCA: Latent-Condensed Attention for Efficient Long Context Modeling"
title_cn: "LCA：潜在空间压缩注意力实现长上下文高效推理"
category: AI工程化 / 长上下文
tier: B
collected: 2026-07-02
week: 2026-W28
---

## 源信息

- **作者 / 机构**：琶洲实验室、华南理工 — Zeng You et al.
- **发布时间**：2026-04（ACL 2026, arXiv: 2604.12452）
- **原文**：[arXiv:2604.12452](https://arxiv.org/pdf/2604.12452)
- **代码**：[bolixinyu/LCA](https://github.com/bolixinyu/LCA)

## 核心技术亮点

- 将 KV Cache 在 latent space 压缩；128K 上下文场景：prefill 加速 2.5×、KV Cache 缩减 90%、解码延迟降 1.8×
- 无需修改模型权重，以 plug-in attention 模块形式兼容 Qwen / MiniCPM 等架构
- 提供 Triton kernel 与 vLLM 集成示例

## 推荐受众

部署长上下文服务（文档 QA / 代码库理解）时降低显存与延迟的工程参考。

## 初步分诊

- **适配性**：Tier B — 合稿 / 外延
- **契合点**：与 OSCAR 配对作为合稿 *"长上下文的成本账"* 的另一条主线
- **与博客现有内容的关系**：可与 [[ai-cost-model]] 形成"成本叙事"的渐进式补充 —— ai-cost-model 谈推理总成本，LCA 谈长上下文的细分子账
- **写作前置任务**：
  1. "KV Cache 缩减 90%"是否对应特定 batch size / seq length？需复核论文实验配置
  2. 与已有 KV 压缩方案（StreamingLLM / H2O / Scissorhands）对比口径需明确