---
paper_id: 06
title_en: "H-EPM: Experience-Evolving Multi-Turn Tool-Use Agent with Hybrid Episodic-Procedural Memory"
title_cn: "H-EPM：混合情景-程序记忆驱动的多轮工具调用 Agent 经验进化框架"
category: AI Agent / 记忆系统
tier: A
collected: 2026-07-02
week: 2026-W28
---

## 源信息

- **作者 / 机构**：ICML 2026
- **发布时间**：2022026（ICML 2026 accepted），arXiv: 2512.07287
- **原文**：[arXiv:2512.07287](https://arxiv.org/abs/2512.07287)
- **代码**：[LISijia-dev/H-EPM](https://github.com/LISijia-dev/H-EPM)

## 核心技术亮点

- 将成功工具调用轨迹压缩为工具图（节点 = tool，边 = 先后关系），同时存储 episodic（情境）与 procedural（流程）记忆
- 推理时检索相似状态的历史子图引导下一步 tool call；RL 时以历史成功转移做 reward shaping
- 在多轮 API 调用与复杂工具链任务上超越 ReAct / MemGPT 类基线 8%~15% 完成率

## 推荐受众

构建生产级工具调用 Agent 需解决"越用越准"、经验复用与少样本适应的架构参考。

## 初步分诊

- **适配性**：Tier A — 单篇 deep-dive
- **契合点**：
  1. 完美呼应本周核心趋势的"episodic-procedural 记忆复用"
  2. 与 W27 的 EvoCF 形成"双周记忆叙事"：EvoCF 是多 Agent 记忆协作，H-EPM 是单 Agent 经验复用
- **候选标题**：*"工具调用 Agent 的两种记忆：episodic 教'在哪一步'，procedural 教'下一步该怎么走'"*
- **候选 Key Insight**：*"Agent 的'越用越准'靠的不是参数更新，是经验图谱能被检索到。"*
- **写作前置任务**：
  1. "8%~15% 完成率提升"必须给具体 benchmark 名（BFCL？ToolBench？τ-bench？）
  2. 工具图（tool graph）的 schema 需精读 —— 这是 Hero SVG 的核心可视化对象
  3. 与 EvoCF 的关系澄清：H-EPM 是单 Agent 内部记忆，EvoCF 是多 Agent 协作记忆；可考虑作为"记忆系统周主题"合稿的两个锚点