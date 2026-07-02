---
paper_id: 06
title_en: "SEAlign: Aligning Code LLMs with Software Engineering Decision Points"
title_cn: "SEAlign：在关键决策点对齐代码 LLM 与软件工程行为"
category: AI Coding / 训练范式
tier: A
collected: 2026-07-02
week: 2026-W27
---

## 源信息

- **作者 / 机构**：北京大学（ICSE 2026 Distinguished Paper）
- **发布时间**：2026（预印）
- **原文**：[arXiv 搜索结果](https://arxiv.org/search/?searchtype=all&query=SEAlign+Peking+University+ICSE+2026) —— ⚠️ **链接待核实**：素材中只有 arXiv 搜索页，**未提供具体 paper URL 或 arXiv ID**；ICSE 2026 proceedings 也未给出直链
- **代码**：未在素材中给出

## 核心技术亮点

- 针对 empty patch（52% → 22.8%）和 stuck-in-loop（27.8% → 15.6%）做定向对齐；SWE-Bench-Verified 14B 模型从 2.8% → 21.8%
- 仅用 <1k 条决策点约束样本做 alignment，远小于常规 SFT 数据量
- 给出**决策偏差分类 taxonomy**，可用于诊断现有代码 Agent 失败模式

## 推荐受众

关注代码 Agent 行为诊断与低成本对齐的 AI Coding 研究者。

## 初步分诊

- **适配性**：Tier A — 单篇 deep-dive
- **契合点**：决策点 taxonomy 完美匹配博客 [[agent-skills]] 的"反借口 / 诊断"叙事；1k 样本对齐的 anti-hype 角度与博客基调一致
- **候选标题**：*"代码 Agent 失败模式分类学：1k 样本就能改命"*
- **候选 Key Insight**：*"99% 的代码 Agent 对齐数据在解决错的问题。"*
- **写作前置任务**：
  1. 必须找到正式 arXiv ID 或 ICSE 2026 proceedings 直链 —— 否则博客"无孤儿归因"规则会触发
  2. 决策点 taxonomy 类目需逐条精读论文，避免误译
- **黄灯**："Distinguished Paper Award" 是营销话术，写作时建议改为"获 ICSE 2026 Distinguished Paper Award 提名/获奖"具体口径，并核对会议官方公告