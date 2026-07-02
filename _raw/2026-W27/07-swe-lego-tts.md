---
paper_id: 07
title_en: "SWE-Lego: SFT-trained Software Engineering Agent with Test-time Scaling"
title_cn: "SWE-Lego：基于 SFT 与测试时扩展的软件工程代码智能体"
category: AI Coding + AI Agent（素材中两节均列出，可能为草稿排版问题，写作时只引一次）
tier: B
collected: 2026-07-02
week: 2026-W27
---

## 源信息

- **作者 / 机构**：华为诺亚
- **发布时间**：2026-01（arXiv: 2601.01426）
- **原文**：[arXiv:2601.01426](https://arxiv.org/abs/2601.01426)
- **代码**：[SWE-Lego](https://github.com/SWE-Lego)

## 核心技术亮点

- 步骤级错误掩码 + 课程学习 SFT，比 naive SFT 提升 2-4%；TTS 先串行扩 rounds 再并行选优，generative scorer 优于 regression
- 混合数据管线：GitHub 真实 PR + 注入 Bug 合成数据；严格过滤 Git 历史泄露与 tool error 噪声
- 开源 32k 任务实例 + 18k 专家轨迹及完整训练 / 推理配置

## 推荐受众

构建仓库级代码修复 Agent 并关注 test-time scaling 策略的团队。

## 初步分诊

- **适配性**：Tier B — 合稿 / 外延
- **契合点**：TTS 策略作为合稿 *"代码 Agent 训练三连击"* 的第三条（推理侧延伸）
- **与 daVinci-Dev / SEAlign 的差异**：前者是"训练阶段对齐"，SWE-Lego 是"推理阶段扩展"——天然互补
- **数据校核**：2-4% 提升是相对 baseline 还是 naive SFT？写作时必须给精确口径