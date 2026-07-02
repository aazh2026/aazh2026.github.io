---
paper_id: 04
title_en: "SWE-Master: Unleashing the Potential of Software Engineering Agents via Post-Training"
title_cn: "SWE-Master：通过后训练释放软件工程智能体潜力"
category: AI Coding / 后训练
tier: A
collected: 2026-07-02
week: 2026-W29
---

## 源信息

- **作者 / 机构**：未在素材中给出（arXiv: 2602.02380）
- **发布时间**：2026-02
- **原文**：[arXiv:2602.02380](https://arxiv.org/abs/2602.02380)
- **代码**：未在素材中给出（"开源训练数据与轨迹筛选规则"）

## 核心技术亮点

- 系统化开源后训练框架：**数据合成 → 长视野 SFT → RL → 推理时扩展**，将基础代码模型训成 SE Agent
- SWE-bench Verified 上开源模型达 SOTA
- 详述轨迹过滤策略与测试时扩展（**串行优先 → 并行**）的实测收益
- 提供完整训练数据与轨迹筛选规则，可直接复现或迁移到内部代码模型后训练

## 推荐受众

AI 编程产品研发 / 模型微调团队构建自研代码 Agent 底座。

## 初步分诊

- **适配性**：Tier A — 单篇 deep-dive 或合稿主锚
- **契合点**：完整覆盖"数据→SFT→RL→TTS"四阶段，**正好补齐 W27+W28 代码 Agent 主题缺的最后一块**
  - W27 daVinci-Dev: 中期训练 / 因果链对齐
  - W28 DeNovoSWE: 数据合成（Doc→Repo）
  - W28 SEAlign: 对齐训练（决策点）
  - **W29 SWE-Master: 全栈后训练框架** ← 新增 TTS 与 RL 两阶段
- **候选标题**：*"代码 Agent 后训练四阶段：从基础模型到 SWE-bench SOTA"*
- **候选 Key Insight**：*"代码 Agent 的训练不是数据多就好，是四阶段漏斗里每一级都不漏。"*
- **写作前置任务**：
  1. "开源模型达 SOTA" 缺具体模型名 + 数字 —— 哪个 base model？哪个 SOTA 数字？
  2. "串行优先 → 并行" 的 TTS 策略与 W27 SWE-Lego 的"先串行扩 rounds 再并行选优"是同一思路，需复核差异
  3. 与 SEAlign 关系澄清：SWE-Master 是"通用框架"，SEAlign 是"决策点专项"——可联动但需明确差异化