---
paper_id: 08
title_en: "Omni-SimpleMem: Autoresearch-Guided Discovery of Lifelong Multimodal Agent Memory"
title_cn: "Omni-SimpleMem：自主研究引导发现的终身多模态 Agent 记忆系统"
category: AI Agent / 多模态记忆
tier: B
collected: 2026-07-02
week: 2026-W28
---

## 源信息

- **作者 / 机构**：Aiming Lab
- **发布时间**：2026-04（arXiv: 2604.01007）
- **原文**：[arXiv:2604.01007](https://arxiv.org/abs/2604.01007)
- **代码**：[aiming-lab/SimpleMem](https://github.com/aiming-lab/SimpleMem)

## 核心技术亮点

- AutoResearch Pipeline 自动提假设 → 写代码 → 跑实验 → 提炼改进，约 50 轮迭代
- LoCoMo F1 从 0.117 → 0.598（**+411%**），Mem-Gallery 多模态 F1 0.254 → 0.797
- 最大增益来源：**Bug Fix（+175%）与架构改动（+44%）而非超参搜索**，给出记忆系统设计启示
- 即插即用 PyTorch 模块，支持文本 / 图像 / 音频 / 视频

## 推荐受众

需给 Agent 加长期跨会话记忆（客服 / 个人助理 / 多模态助手）的工程师直接集成参考。

## 初步分诊

- **适配性**：Tier B — 合稿 / 外延
- **契合点**：呼应本周核心趋势的"episodic-procedural 记忆复用"，但聚焦多模态场景（与 H-EPM 文本工具调用形成对比）
- **独特洞察**："最大增益来自 Bug Fix 与架构改动而非超参搜索" —— 这是**auto-research paradigm 的核心反直觉发现**，非常符合博客 anti-hype 基调
- **候选用法**：
  1. 作为合稿 *"记忆系统的工程实证"* 的第三个锚点（与 H-EPM、W27 EvoCF 配对）
  2. 或单独成 "auto-research 范式"的导论短文（+411% 这种"反直觉结论"是博客 ideal type）
- **写作前置任务**：
  1. "AutoResearch Pipeline" 的算法是否可复现？需明确给出原论文的具体描述
  2. LoCoMo / Mem-Gallery benchmark 的具体描述需补充（仅 0.117 → 0.598 跨度大但口径不明）
  3. +411% 这种百分比，写作时必须配 baseline + benchmark 名 + 样本数