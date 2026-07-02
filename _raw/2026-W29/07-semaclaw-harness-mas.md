---
paper_id: 07
title_en: "SemaClaw: A Harness-Centric Open-Source Multi-Agent Application Framework"
title_cn: "SemaClaw：以 Harness 为核心的开放多智能体应用框架"
category: AI Agent / 框架
tier: B
collected: 2026-07-02
week: 2026-W29
---

## 源信息

- **作者 / 机构**：Midea AIRC
- **发布时间**：2026-04（arXiv: 2604.11548）
- **原文**：[arXiv:2604.11548](https://arxiv.org/abs/2604.11548)
- **代码**：未在素材中给出

## 核心技术亮点

- 明确提出 Agent **"Harness"（驾驭装置）工程理念**：双层架构分离运行时与应用逻辑
  - 三层上下文记忆管理
  - DAG 多 Agent 编排
  - 四模式任务调度
- 原生权限桥与四层插件体系，给出权限沙箱与工具调用的具体实现参考
- 开源框架带 Markdown 个人知识库集成，适合直接二次开发企业内 Agent 平台

## 推荐受众

AI Agent 平台架构师设计可控、安全的多智能体编排与治理底座。

## 初步分诊

- **适配性**：Tier B — 合稿 / 外延（边界 Tier A，因博客已有 [[harness-engineering-addy-osmani]] 锚点）
- **契合点**：
  1. "Harness" 命名直接呼应博客已有 [[harness-engineering-addy-osmani]] 锚点 —— **新论文为该方向补充了"工业级框架实现"**
  2. "双层架构分离运行时与应用逻辑" 与博客 [[loop-engineering]] 的 L1-L4 堆叠架构叙事天然对齐
- **独特价值**：Midea AIRC 是工业界而非纯学术界，框架名称 "Claw" 隐含 OpenClaw 作者背景（**作者自己**？需确认），写作时建议中立表述
- **写作前置任务**：
  1. "四模式任务调度" 具体是哪些模式？需精读论文
  2. Midea AIRC 与作者背景的关系需中立化处理（避免自我引用）
  3. 与 [[harness-engineering-addy-osmani]] 的关系是补充还是重写？—— 建议作为"工业实现补充"的外延引用