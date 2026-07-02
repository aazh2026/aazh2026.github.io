---
paper_id: 05
title_en: "SWE-World: Building Software Engineering Agents in Docker-Free Environments"
title_cn: "SWE-World：无 Docker 环境的软件工程智能体训练评估框架"
category: AI Coding / 训练范式
tier: B
collected: 2026-07-02
week: 2026-W27
---

## 源信息

- **作者 / 机构**：Hugging Face 等
- **发布时间**：2026-02（arXiv: 2602.03419）
- **原文**：[arXiv:2602.03419](https://arxiv.org/abs/2602.03419)
- **代码**：未在素材中给出（论文提供环境 proxy 与 test outcome simulator 可嵌入训练 pipeline）

## 核心技术亮点

- 用学习型环境代理模型替代物理 Docker 容器；Qwen2.5-Coder-32B SFT 后 SWE-bench Verified 从 6.2% → 52.0%，+TTS 达 68.2%
- 支持大规模并行无沙盒开销，提供环境 proxy 与 test outcome simulator 可嵌入训练 pipeline
- 详述无 Docker SFT 与 RL 两种范式在 patch correctness 上的 gap 分析

## 推荐受众

构建代码 Agent 训练 / 评测流水线的 AI 研发团队。

## 初步分诊

- **适配性**：Tier B — 合稿 / 外延
- **契合点**：无容器训练范式契合 [[loop-engineering]] 的"训练即基础设施"主题
- **推荐用法**：作为合稿的旁线锚点（容器 vs 环境 proxy 的工程成本对比），或并入 loop-engineering 的训练范式补充段落
- **数据校核**："6.2% → 52.0%" 这一基线提升跨度大，需复核论文中"是否启用 test-time scaling 前"的精确口径