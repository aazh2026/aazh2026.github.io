---
paper_id: 02
title_en: "Plan and Budget: Effective and Efficient Test-Time Scaling on Reasoning LLMs"
title_cn: "Plan and Budget：推理模型测试时缩放的规划与预算分配"
category: AI工程化 / 推理优化
tier: A
collected: 2026-07-02
week: 2026-W27
---

## 源信息

- **作者 / 机构**：ICLR 2026
- **发布时间**：2025-05（arXiv: 2505.16122）
- **原文**：[arXiv:2505.16122](https://arxiv.org/abs/2505.16122)
- **代码**：[junhongmit/P-and-B](https://github.com/junhongmit/P-and-B)

## 核心技术亮点

- 量化"推理失衡（Reasoning Miscalibration）"现象 —— 模型 think token 数与子问题真实难度不匹配造成浪费
- 提出 per-step difficulty estimator 动态分配 budget；DeepSeek-R1 / QwQ 类模型在数学推理任务上 token 削减 30%+ 且精度持平
- 开源难度探针 + 自适应 budget scheduler，可直接挂入 CoT 生成循环

## 推荐受众

做推理成本优化、长 CoT 裁剪的 LLM Ops 工程师。

## 初步分诊

- **适配性**：Tier A — 单篇 deep-dive
- **契合点**："推理失衡"概念直接呼应博客 [[context-engineering-field-guide]] 的"显式规划机制弥补 LLM 随机性"主线
- **候选标题**：*"测试时缩放的预算分配：把 think token 配到该花的地方"*
- **候选 Key Insight**：*"推理模型的最大浪费不是答案错，是 token 配错了。"*
- **写作注意**：需要把"30%+ token 削减"配上 baseline 模型名 + benchmark 名（论文中应给出 AIME / MATH-500 这类标准集），避免变成孤儿数字