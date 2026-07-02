---
paper_id: 02
title_en: "OSCAR: Online Soft Compression for RAG"
title_cn: "OSCAR：面向 RAG 的查询感知在线软压缩框架"
category: AI工程化 / RAG 与长上下文
tier: B
collected: 2026-07-02
week: 2026-W28
---

## 源信息

- **作者 / 机构**：Naver Labs Europe — Maxime Louis et al.
- **发布时间**：2026（ICLR 2026 accepted）
- **原文**：⚠️ **arXiv ID 占位**：素材中标注为 `arXiv:2602.xxxxx`，**实际数字未给出**；需补
- **代码**：[naver/pisco](https://github.com/naver/pisco)（naver/oscar 模型已开源）

## 核心技术亮点

- 对检索到的多文档做查询感知在线软压缩为紧凑向量表示，避免硬截断导致信息丢失；压缩倍率最高 128×
- 在 1B~24B LLM 的 RAG 流水线上实现最高 25× 推理加速，精度损失 <1%（NQ / HotpotQA）
- 可与重 ranker 联合训练，压缩开销被重排步骤吸收实现"零额外延迟"

## 推荐受众

RAG 系统工程师优化长上下文成本、减少 token 开销的直接落地方案。

## 初步分诊

- **适配性**：Tier B — 合稿 / 外延
- **契合点**：与博客 [[context-engineering-field-guide]] 的"context 成本"主题直接呼应
- **候选用法**：作为合稿 *"长上下文的成本账"* 的一个支线锚点（与 LCA 配对：OSCAR 压文档，LCA 压 KV Cache）
- **写作前置任务**：
  1. 必须找到正式 arXiv ID（素材中是 `2602.xxxxx` 占位符）
  2. "压缩倍率 128×"与"25× 推理加速"的口径需明确：是端到端 wall-time 还是仅 attention 部分