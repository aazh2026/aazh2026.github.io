---
paper_id: 08
title_en: "EvoCF: Multi-Agent Collaboration via Agentic Memory-Driven Evolutionary Counterfactual Planning"
title_cn: "EvoCF：基于智能体记忆驱动进化反事实规划的多智能体协作"
category: AI Agent / Multi-Agent
tier: A
collected: 2026-07-02
week: 2026-W27
---

## 源信息

- **作者 / 机构**：ICML 2026
- **发布时间**：2026
- **原文**：[微信公众号链接](http://mp.weixin.qq.com/s?src=11&timestamp=1782968840&ver=6817&signature=...) —— ⚠️ **链接不合规**：素材中只有微信公众号临时分享链接，arXiv 待正式收录；**写作前必须补到 arXiv 直链或 ICML 2026 accepted papers list**
- **代码**：未在素材中给出

## 核心技术亮点

- Store–Consolidate–Retrieve 记忆闭环驱动反事实规划（What-if reasoning），解决多 Agent 一次规划无回溯问题
- 显式约束诱导器将失败经验回灌记忆，在协作任务中比 LLaMAR / MacNet 基线 planning success rate 提升显著
- 框架模块化，Planner / Actor / Verifier 分离，便于接入 LangGraph 类编排

## 推荐受众

设计复杂多 Agent 协作系统与持久记忆模块的架构师。

## 初步分诊

- **适配性**：Tier A — 单篇 deep-dive
- **契合点**：Store–Consolidate–Retrieve 记忆闭环直接外延 [[agent-systems-tour]] 的"Multi-Agent 范式 4"；与 LLaMAR / MacNet 对比提供 Key Insight 的对比锚点
- **候选标题**：*"Multi-Agent 的反事实规划：用记忆闭环替代一次博弈"*
- **候选 Key Insight**：*"Multi-Agent 失败的主因不是规划不够聪明，是失败经验没有被下次规划读到。"*
- **写作前置任务**：
  1. 找到正式 arXiv ID 或 ICML 2026 官方收录链接 —— **目前素材来源仅微信公众号，触发博客"无孤儿归因"规则**
  2. "planning success rate 提升显著"是定性描述，写作时必须给具体百分点
  3. 反事实规划（counterfactual planning）的图示可作为 Hero 图骨架