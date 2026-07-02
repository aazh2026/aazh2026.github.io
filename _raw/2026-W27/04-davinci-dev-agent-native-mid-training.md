---
paper_id: 04
title_en: "daVinci-Dev: Agent-native Mid-training for Software Engineering"
title_cn: "daVinci-Dev：面向软件工程的 Agent 原生中期训练"
category: AI Coding / 训练范式
tier: B
collected: 2026-07-02
week: 2026-W27
---

## 源信息

- **作者 / 机构**：SII、SJTU、GAIR
- **发布时间**：2026-01（arXiv: 2601.18418）
- **原文**：[arXiv:2601.18418](https://arxiv.org/abs/2601.18418)
- **代码**：未公开（论文中描述 Dctx / Denv 语料构造脚本与训练 config 可复现）

## 核心技术亮点

- 用 68.6B 上下文原生 + 3.1B 环境 rollout 轨迹做中期训练，强制模型学习 `localize → read → edit` 因果链而非独立 diff 预测
- SWE-Bench Verified：32B 达 56.1%、72B 达 58.5%；数据量仅为 Kimi-Dev 一半
- 空 patch 与 stuck-in-loop 率显著下降
- 开源 Dctx / Denv 语料构造脚本与训练 config，可直接复现

## 推荐受众

做代码模型 SFT / 继续训练、关注 SWE-bench 提升的 ML Engineer。

## 初步分诊

- **适配性**：Tier B — 合稿 / 外延
- **契合点**：与 SEAlign 形成"量级训练 vs 精准对齐"对照案例
- **推荐用法**：作为合稿 *"代码 Agent 的训练与对齐三连击"* 的第一条（量级路线）
- **数据校核**：写作前需复核 SWE-Bench Verified 的具体数字与 baseline（Kimi-Dev）对照表，避免凭空比较