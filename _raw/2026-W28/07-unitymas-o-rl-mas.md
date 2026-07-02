---
paper_id: 07
title_en: "UnityMAS-O: A General RL Optimization Framework for LLM-Based Multi-Agent Systems"
title_cn: "UnityMAS-O：基于 RL 的多智能体系统端到端联合优化框架"
category: AI Agent / Multi-Agent
tier: A
collected: 2026-07-02
week: 2026-W28
---

## 源信息

- **作者 / 机构**：中国人民大学
- **发布时间**：2026-05（arXiv: 2605.26646）
- **原文**：[arXiv:2605.26646](https://arxiv.org/pdf/2605.26646)
- **代码**：[chenyiqun/UnityMAS-O](https://github.com/chenyiqun/UnityMAS-O)

## 核心技术亮点

- 将用户定义 MAS（规划 / 搜索 / 验证等角色）转为可归因 MARL 问题，支持 credit assignment 到各 Agent 行为
- 检索增强 QA 与迭代代码生成任务上，**小模型 MAS 经 RL 优化后性能提升 >150%**，协作效率显著改善
- 提供 MAS → RL 转换 DSL 与 PPO / MAPPO trainer

## 推荐受众

Multi-Agent 框架设计者想从"手工 prompt 编排"升级为"可训练协同策略"的实操指南。

## 初步分诊

- **适配性**：Tier A — 单篇 deep-dive
- **契合点**：
  1. 直接呼应本周核心趋势的"RL 工作流优化"
  2. 与 [[agent-systems-tour]] 的"Multi-Agent 范式 4"形成"RL 化升级"的外延
- **候选标题**：*"Multi-Agent 的下一站：把 prompt 编排换成可训练策略"*
- **候选 Key Insight**：*"手工 prompt 编排是 MAS 的'手工 SQL'，RL 优化是它的'索引优化器'。"*
- **写作前置任务**：
  1. "小模型 MAS 性能提升 >150%" 的口径需明确 —— 是端到端成功率，还是某子任务指标
  2. "MAS → RL 转换 DSL"是工程化亮点，建议作为正文核心图（DSL 结构 + PPO/MAPPO 训练流程）
  3. 与 EvoCF 关系：EvoCF 解决"记忆复用"，UnityMAS-O 解决"策略优化"，可联动成"Multi-Agent 双视角"