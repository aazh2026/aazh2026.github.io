---
paper_id: 03
title_en: "A-RAG: Agentic Retrieval-Augmented Generation with Autonomous Exploration"
title_cn: "A-RAG：自主探索式 Agentic RAG"
category: AI工程化 / Agentic RAG
tier: A
collected: 2026-07-02
week: 2026-W29
---

## 源信息

- **作者 / 机构**：中国科技大学 & Metastone
- **发布时间**：2026-02（arXiv: 2602.03442）
- **原文**：[arXiv:2602.03442](https://arxiv.org/abs/2602.03442)
- **代码**：[Ayanami0730/arag](https://github.com/Ayanami0730/arag)

## 核心技术亮点

- 将检索决策权交给 LLM Agent，提供分层检索接口（关键词 / 语义 / 块读取），支持多跳自主探索知识库而非固定 top-k 拼接
- HotpotQA / MuSiQue 多跳 QA 上比传统 RAG 准确率提升 **10-20pp**，**检索 token 用量反而更低**
- 含完整 Agent loop 与工具调用实现，可直接参照改造现有 RAG pipeline

## 推荐受众

RAG 系统工程师升级至 Agentic RAG 架构，改善多跳推理与噪声文档问题。

## 初步分诊

- **适配性**：Tier A — 单篇 deep-dive
- **契合点**：
  1. 完美呼应本周核心趋势的"Agentic RAG 重构检索"
  2. 直接外延博客 [[context-engineering-field-guide]] 的"工具调用扩展"叙事
- **候选标题**：*"Agentic RAG：把检索决策权交给 LLM"*
- **候选 Key Insight**：*"传统 RAG 把检索当'取数据'，Agentic RAG 把检索当'探索'——10-20pp 的差距就在这一步。"*
- **写作前置任务**：
  1. "10-20pp" 区间跨度大 —— HotpotQA 10pp，MuSiQue 20pp？还是其他细分？需复核
  2. "检索 token 用量反而更低" —— 这是 anti-hype 关键洞察，必须给具体数字（绝对 token 数 + 节省比例）
  3. "分层检索接口"是架构亮点，建议作为 Hero SVG（关键词 / 语义 / 块读取 三层漏斗）