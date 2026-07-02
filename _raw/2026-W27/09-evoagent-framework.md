---
paper_id: 09
title_en: "EvoAgent: An Open-Source Framework for Tool Use, Memory Evolution and Multi-Agent Orchestration"
title_cn: "EvoAgent：支持工具调用、记忆进化与多智能体编排的开源框架"
category: AI Agent / 框架
tier: C
collected: 2026-07-02
week: 2026-W27
---

## 源信息

- **作者 / 机构**：EvoAgent Community
- **发布时间**：2026-06
- **原文**：无正式论文 —— ⚠️ **只有 GitHub 仓库**
- **代码**：[EvoAgentLab/EvoAgent](https://github.com/EvoAgentLab/EvoAgent)

## 核心技术亮点

- 内置衰减 / 归档式动态记忆（重要强化、过时弱化），解决长会话 context 膨胀问题
- 声明式工作流（顺序 / 并行 / 条件 / 循环）+ 工具注册 + 参数校验 + 自动重试，生产级错误处理
- 提供可复现 eval harness，支持多 Agent 协作场景 benchmark 接入

## 推荐受众

需要从 Demo 升级到生产级 Multi-Agent 系统的后端工程师。

## 初步分诊

- **适配性**：Tier C — 跳过
- **理由**：
  1. 框架评测正好踩博客 DNA 红线 —— 博客主线是"范式与原理"，不是"工具与框架"
  2. 无论文、仅 GitHub —— 无法满足博客对引用可查证的要求
  3. 与 [[agent-skills]] / [[loop-engineering]] 已有锚点重叠度高
- **若用**：仅作为"社区开源参考"在正文 footnote 提及，不展开