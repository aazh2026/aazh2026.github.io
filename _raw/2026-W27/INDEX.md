---
title: "2026-W27 周观察：推理加速 / 代码 Agent 训练 / 多 Agent 记忆"
date: 2026-07-02
week: 2026-W27
collected: 9 papers
---

# 2026-W27 周观察索引

## 本周核心趋势（一句话）

**用可度量评估 + 显式记忆/规划机制弥补 LLM 随机性；推理侧追求即插即用加速；Coding Agent 强调仓库级轨迹对齐与无容器训练范式；Multi-Agent 向记忆驱动的反事实协作演进。**

## 适配性矩阵

| # | 论文 | 类别 | Tier | 状态 |
|---|------|------|------|------|
| 01 | [Domino](01-domino-speculative-decoding.md) | 推理优化 | C | 跳过 |
| 02 | [Plan and Budget](02-plan-and-budget-tt-scaling.md) | 推理优化 | **A** | 单篇 deep-dive |
| 03 | [Jacobi Forcing](03-jacobi-forcing-parallel-decoding.md) | 推理优化 | C | 跳过 |
| 04 | [daVinci-Dev](04-davinci-dev-agent-native-mid-training.md) | 代码 Agent 训练 | B | 合稿 / 外延 |
| 05 | [SWE-World](05-swe-world-docker-free.md) | 代码 Agent 训练 | B | 合稿 / 外延 |
| 06 | [SEAlign](06-sealign-decision-point-alignment.md) | 代码 Agent 训练 | **A** | 单篇 deep-dive |
| 07 | [SWE-Lego](07-swe-lego-tts.md) | 代码 Agent + Agent | B | 合稿 / 外延 |
| 08 | [EvoCF](08-evocf-counterfactual-planning.md) | Multi-Agent | **A** | 单篇 deep-dive |
| 09 | [EvoAgent](09-evoagent-framework.md) | Agent 框架 | C | 跳过 |

## 推荐成稿路径

### 路径 A（最稳）：3 篇单篇 deep-dive

1. **SEAlign** — 代码 Agent 失败模式分类学，外延 [[agent-skills]] 的诊断叙事
2. **EvoCF** — Multi-Agent 的反事实规划，外延 [[agent-systems-tour]] 的多 Agent 范式
3. **Plan and Budget** — 测试时缩放预算分配，外延 [[context-engineering-field-guide]]

### 路径 B（紧凑）：1 篇合稿

- **"代码 Agent 的训练与对齐三连击"** —— daVinci-Dev（量级）+ SEAlign（精度）+ SWE-Lego（推理）
- 一张 SVG 画 cost / accuracy 矩阵
- Plan and Budget 单独成稿，不并入

## 写作前黄灯（必须先解决）

| 论文 | 问题 | 动作 |
|------|------|------|
| SEAlign | arXiv 链接只有搜索页，未给 paper ID | 找到 ICSE 2026 proceedings 直链或 arXiv ID |
| EvoCF | 唯一链接是微信公众号，arXiv 待收录 | 找到 ICML 2026 accepted papers list 或 arXiv 直链 |
| EvoAgent | 无论文，仅 GitHub | 不成稿 |
| SWE-Lego | 在 AI Coding 和 AI Agent 两节均列出 | 写作时只引一次，避免读者混淆 |

## 与现有博客的呼应点

| 论文 | 可外延的现有文章 |
|------|-----------------|
| Plan and Budget | [[context-engineering-field-guide]] |
| SEAlign | [[agent-skills]]（反借口 / 诊断） |
| EvoCF | [[agent-systems-tour]]（Multi-Agent 范式） |
| SWE-World | [[loop-engineering]]（训练即基础设施） |
| daVinci-Dev / SWE-Lego | 可作为 [[auto-improving-software]] 的延伸 |

## 待跟进

- [ ] SEAlign 链接核实
- [ ] EvoCF 链接核实
- [ ] 三篇 Tier A 论文的精读与 baseline 数据复核
- [ ] 选择路径 A 还是路径 B，决定后开稿

---

*收集于 2026-07-02；尚未成稿。*