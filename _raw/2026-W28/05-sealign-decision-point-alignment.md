---
paper_id: 05
title_en: "SEAlign: Aligning Code LLMs on Critical Decision Points for Software Engineering Agents"
title_cn: "SEAlign：面向 SWE Agent 关键决策点对齐的代码模型训练框架"
category: AI Coding / 对齐训练
tier: A
collected: 2026-07-02
week: 2026-W28
overlap_with: 2026-W27/06-sealign-decision-point-alignment.md
---

## 源信息

- **作者 / 机构**：北京大学（ICSE 2026 Distinguished Paper）
- **发布时间**：2026-05（ICSE 2026）
- **原文**：arXiv: 2603.14987（关联参考，**需在 ICSE 2026 proceedings 中复核正式链接**）/ 论文链接：[参考](https://arxiv.org/abs/2603.14987)
- **代码**：未在素材中给出（"开源训练数据与对齐 recipe"）

## 核心技术亮点

- 用 <1k 条决策点感知样本 SFT；Qwen2.5-Coder-14B 在 SWE-Bench-Verified 从 2.8% → 21.8%
- 空补丁率 52% → 22.8%，卡死率 27.8% → 15.6%
- **区别于 next-token preference**，显式约束 agent 在 patch 生成 / 文件定位等关键节点的行为分布
- 开源训练数据与对齐 recipe

## 推荐受众

做 Coding Agent 基座模型 post-training 或解决 agent 循环卡死 / 空 patch 问题的团队。

## 初步分诊

- **适配性**：Tier A — 单篇 deep-dive
- **W28 vs W27 差异**：本次提供了 arXiv ID 占位（2603.14987）—— **链接核实问题从"完全无 ID"降级为"ID 需在 ICSE proceedings 复核"**；标题更明确了"on Critical Decision Points"
- **契合点**：决策点 taxonomy 完美匹配博客 [[agent-skills]] 的"反借口 / 诊断"叙事；1k 样本对齐的 anti-hype 角度与博客基调一致
- **候选标题**：*"代码 Agent 失败模式分类学：1k 样本就能改命"*
- **候选 Key Insight**：*"99% 的代码 Agent 对齐数据在解决错的问题。"*
- **写作前置任务**：
  1. 在 ICSE 2026 proceedings 或 arXiv 复核正式 paper ID（素材中给的 2603.14987 是"关联参考"，不一定是 SEAlign 本体）
  2. 决策点 taxonomy 类目需逐条精读论文，避免误译
  3. 与 DeNovoSWE 关系澄清 —— SEAlign 是训练侧，DeNovoSWE 是数据侧，可联动成"代码 Agent 训练闭环"双锚点