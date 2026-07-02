---
paper_id: 04
title_en: "DeNovoSWE: A Benchmark and Dataset for Long-Horizon Repository-Level Code Generation from Documentation"
title_cn: "DeNovoSWE：从文档生成仓库级代码的长程 SWE 任务数据集"
category: AI Coding / 数据集与评测
tier: A
collected: 2026-07-02
week: 2026-W28
---

## 源信息

- **作者 / 机构**：中国人民大学高瓴 AI 学院 — AweAI Team
- **发布时间**：2026-06（arXiv: 2606.10728）
- **原文**：[arXiv:2606.10728](https://arxiv.org/pdf/2606.10728)
- **代码**：[AweAI-Team/DeNovoSWE](https://github.com/AweAI-Team/DeNovoSWE)

## 核心技术亮点

- 构建 4,818 条 Doc→Repo 长程任务，含 Divide & Conquer + Critic & Repair 标注管线
- Qwen3-30B-A3B-Instruct 在 BeyondSWE-Doc2Repo 上从 5.8% → 47.2%，NL2RepoBench 从 4.3% → 23.0%
- 开源完整数据 + 评估 harness，可直接接入 SWE-agent / OpenHands

## 推荐受众

Coding Agent 研发团队做仓库级长程能力评测与 SFT / RL 数据构建。

## 初步分诊

- **适配性**：Tier A — 单篇 deep-dive 或合稿主锚
- **契合点**：
  1. 完美呼应本周核心趋势的"可训练/可优化"主线 —— DeNovoSWE 直接给出可用的 RL 训练数据
  2. 与 SEAlign 形成"数据侧（DeNovoSWE）+ 训练侧（SEAlign）"的双锚点
- **候选标题**：*"Doc→Repo：仓库级代码生成的下一个战场"*
- **候选 Key Insight**：*"代码 Agent 的下一道墙不是 bug 修复速度，是从零搭出一个仓库的能力。"*
- **写作前置任务**：
  1. 4,818 条任务的难度分布 / 领域覆盖需明确
  2. "Divide & Conquer + Critic & Repair 标注管线"是数据合成的关键创新点，写作时建议用一张 SVG 展示