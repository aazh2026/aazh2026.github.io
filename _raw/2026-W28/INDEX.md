---
title: "2026-W28 周观察：可训练/可优化 + 开源实测（推理加速 / 代码 Agent 数据+对齐 / 多 Agent 记忆+RL）"
date: 2026-07-02
week: 2026-W28
collected: 8 papers
---

# 2026-W28 周观察索引

## 本周核心趋势（一句话）

**本周三个方向集中向可训练/可优化+开源实测演进：LLM 推理追求解耦投机解码与 KV 压缩降本，Coding Agent 聚焦仓库级长程任务数据与 SWE-bench 对齐训练，Multi-Agent 强调 RL 工作流优化与混合 episodic-procedural 记忆复用。**

## 适配性矩阵

| # | 论文 | 类别 | Tier | 与 W27 重叠 |
|---|------|------|------|-------------|
| 01 | [Domino](01-domino-speculative-decoding.md) | 推理优化 | C | 是（W27/01） |
| 02 | [OSCAR](02-oscar-rag-compression.md) | RAG 压缩 | B | — |
| 03 | [LCA](03-lca-latent-condensed-attention.md) | KV 压缩 | B | — |
| 04 | [DeNovoSWE](04-denovoswe-doc2repo.md) | 代码 Agent 数据 | **A** | — |
| 05 | [SEAlign](05-sealign-decision-point-alignment.md) | 代码 Agent 对齐 | **A** | 是（W27/06），链接已补 |
| 06 | [H-EPM](06-h-epm-hybrid-memory.md) | Agent 记忆 | **A** | — |
| 07 | [UnityMAS-O](07-unitymas-o-rl-mas.md) | Multi-Agent RL | **A** | — |
| 08 | [Omni-SimpleMem](08-omni-simplemem.md) | 多模态记忆 | B | — |

## 推荐成稿路径

### 路径 A：4 篇 Tier A 单篇（信息最丰富）

1. **DeNovoSWE** — 仓库级代码生成的下一个战场；外延 [[auto-improving-software]] 与 [[loop-engineering]]
2. **SEAlign** — 代码 Agent 失败模式分类学；外延 [[agent-skills]]
3. **H-EPM** — episodic + procedural 混合记忆；外延 [[agent-systems-tour]] 的多 Agent 范式
4. **UnityMAS-O** — Multi-Agent 的 RL 化升级；外延 [[agent-systems-tour]]

### 路径 B：2 篇合稿 + 1 篇单篇（节奏更稳）

1. **合稿 1："代码 Agent 训练闭环"** —— DeNovoSWE（数据）+ SEAlign（对齐）
   - 一张 SVG 画"数据→训练→评估"闭环
2. **合稿 2："Agent 记忆系统三连击"** —— W27 EvoCF（多 Agent 记忆）+ W28 H-EPM（单 Agent 经验）+ W28 Omni-SimpleMem（多模态/auto-research 范式）
   - **横跨两周** —— 是博客叙事的一种"主题周"组合
3. **单篇：UnityMAS-O** — RL 化的 Multi-Agent 独立成篇

### 路径 C：1 篇"auto-research 范式"短文（博客新范式探索）

- **Omni-SimpleMem** 的 "Bug Fix + 架构改动 > 超参搜索" 洞察太 anti-hype
- 可单独成 "auto-research：让模型自己设计 Agent" 的开篇短文
- 风险：素材厚度不够（仅 1 篇），可能变成"单篇撑场"

---

## 与 W27 的跨周联动机会

| W27 | W28 | 联动角度 |
|-----|-----|---------|
| EvoCF（多 Agent 记忆协作） | H-EPM（单 Agent 经验复用） | 同一记忆主题的"协作 vs 个体"双视角 |
| EvoCF（多 Agent 协作） | UnityMAS-O（MAS 的 RL 化） | "记忆"vs"策略"两条 MAS 升级路径 |
| SEAlign（链接待核实 ⚠️） | SEAlign（链接已补） | 本周解决了 W27 的黄灯 |
| daVinci-Dev / SWE-Lego | DeNovoSWE | "训练阶段"+"数据阶段"完整闭环 |
| Plan and Budget | LCA + OSCAR | "上下文成本"的三种降本手段（test-time scaling / KV 压缩 / RAG 压缩） |

**最大联动机会**：W27+W28 的"记忆系统主题周"（EvoCF + H-EPM + Omni-SimpleMem）。

---

## 写作前黄灯（必须先解决）

| 论文 | 问题 | 动作 |
|------|------|------|
| OSCAR | arXiv ID 是 `2602.xxxxx` 占位符 | 必须找到正式 ID |
| SEAlign | 链接 `2603.14987` 标注为"参考关联"非本体 | 在 ICSE 2026 proceedings 复核 |
| LCA | "KV Cache 缩减 90%" 缺实验配置 | 复核 batch / seq length |
| H-EPM | "8%~15% 完成率提升" 未给 benchmark 名 | 复核 BFCL / ToolBench / τ-bench |
| UnityMAS-O | ">150% 提升" 缺口径 | 明确是端到端还是子任务 |
| Omni-SimpleMem | "+411%" 是相对什么 baseline | 补 baseline + 样本数 |

---

## 待跟进

- [ ] OSCAR 正式 arXiv ID
- [ ] SEAlign 在 ICSE 2026 proceedings 复核（已是 W27 + W28 的老问题）
- [ ] 三篇 Tier A 论文的精读与 baseline 数据复核
- [ ] 选路径 A / B / C，或尝试"跨周联动主题周"（EvoCF + H-EPM + Omni-SimpleMem）

---

*收集于 2026-07-02；尚未成稿。*