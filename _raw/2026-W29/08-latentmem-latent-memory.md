---
paper_id: 08
title_en: "LatentMem: Personalized Latent Memory for Multi-Agent Collaboration"
title_cn: "LatentMem：面向多智能体协作的个性化隐空间记忆"
category: AI Agent / 记忆系统
tier: A
collected: 2026-07-02
week: 2026-W29
---

## 源信息

- **作者 / 机构**：上海 AI 实验室等
- **发布时间**：2026-02（arXiv: 2602.03036）
- **原文**：[arXiv:2602.03036](https://arxiv.org/abs/2602.03036)
- **代码**：未在素材中给出

## 核心技术亮点

- Experience Bank（向量检索原始轨迹）+ 记忆编码器将交互压缩为少量记忆 token（如 8 个），按角色生成差异化记忆向量
- **LMPO 算法基于 RL 反向优化记忆提取策略**，跨任务保持 7.1% 性能提升，存储效率较传统方法提升约 40%
- 解决多角色 Agent 共享扁平记忆导致的专业信息错位问题

## 推荐受众

多 Agent 协作系统设计者实现角色感知的长期经验复用机制。

## 初步分诊

- **适配性**：Tier A — 单篇 deep-dive
- **契合点**：
  1. 直接呼应本周核心趋势的"episodic memory 重构长期记忆检索"
  2. 与 E-mem 形成强烈对比：**E-mem 主张"不压缩"，LatentMem 主张"极致压缩（8 tokens）"**
  3. "按角色生成差异化记忆向量" 解决 W28 H-EPM / W27 EvoCF 没明确处理的"角色感知"问题
- **候选标题**：*"8 个 token 跨任务保持 7.1%：极简记忆的反直觉"*
- **候选 Key Insight**：*"记忆系统的瓶颈不是存什么，是谁能用什么。8 tokens 比 8K tokens 更准，因为后者是给所有人的。"*
- **写作前置任务**：
  1. "8 个 token" 是 8 个还是"如 8 个"区间？需复核（"如 8 个" 是模糊表达，写作时要给具体数字）
  2. "7.1% 性能提升" 必须给具体 benchmark + baseline
  3. "存储效率提升约 40%" 缺对比对象 —— 是相对 E-mem？还是相对摘要式？
  4. LMPO 算法（基于 RL 反向优化）可与 W28 UnityMAS-O 联动成 "Agent 记忆与策略的 RL 化" 主题