---
paper_id: 05
title_en: "SWE-World: Building Software Engineering Agents in Docker-Free Environments"
title_cn: "SWE-World：无 Docker 环境的软件工程智能体训练与评估"
category: AI Coding / 评估范式
tier: B
collected: 2026-07-02
week: 2026-W29
overlap_with: 2026-W27/05-swe-world-docker-free.md
---

## 源信息

- **作者 / 机构**：未在素材中给出（arXiv: 2602.03419，与 W27 同一篇）
- **发布时间**：2026-02
- **原文**：[arXiv:2602.03419](https://arxiv.org/abs/2602.03419)
- **代码**：未在素材中给出

## 核心技术亮点

- 用学习型环境代理模型替代物理容器，消除 SWE-bench 评估对 Docker 的依赖，大幅降低资源开销与运维复杂度
- 支持测试时扩展（TTC）与执行反馈模拟，环境与 Agent 解耦便于大规模并行评估
- 开源框架含环境代理训练方案与评估 harness，适合自建代码 Agent benchmark

## 推荐受众

AI Coding 平台基础架构团队搭建大规模代码 Agent 评测流水线。

## 初步分诊

- **适配性**：Tier B — 合稿 / 外延
- **W29 vs W27 差异**：
  - W27 强调"训练范式"（Qwen2.5-Coder-32B 6.2% → 52.0%）
  - W29 强调"评估范式"（TTC、执行反馈模拟、大规模并行评估）—— **同一篇论文，本周视角聚焦"评估基础设施"侧**
- **候选用法**：作为合稿 *"代码 Agent 后训练闭环"* 的评估侧锚点（与 SWE-Master 训练侧配对）
- **写作注意**：写作时不要直接复用 W27 已有内容，应聚焦"无 Docker 评估基础设施"这条新主线