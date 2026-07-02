---
title: "2026-W29 周观察：投机解码/KV预取 + Agentic RAG + episodic memory 重构 + 代码 Agent 后训练/无Docker评估"
date: 2026-07-02
week: 2026-W29
collected: 8 papers
---

# 2026-W29 周观察索引

## 本周核心趋势（一句话）

**本周技术动向集中于用投机解码 / KV 缓存预取压低 RAG 与 Agent 高频调用的推理成本，Agentic RAG 与 episodic memory 重构长期记忆检索，以及 SWE-bench 导向的代码智能体后训练与无 Docker 评估新范式。**

## 适配性矩阵

| # | 论文 | 类别 | Tier | 与前几周重叠 |
|---|------|------|------|-------------|
| 01 | [JetSpec](01-jetspec-tree-speculative-decoding.md) | 投机解码 | C | 思路同 W27/W28 Domino |
| 02 | [PCR](02-pcr-rag-cache-reuse.md) | RAG 服务 | B | — |
| 03 | [A-RAG](03-a-rag-agentic-rag.md) | Agentic RAG | **A** | — |
| 04 | [SWE-Master](04-swe-master-post-training.md) | 代码 Agent 后训练 | **A** | 闭环 W27 daVinci-Dev + W28 DeNovoSWE + SEAlign |
| 05 | [SWE-World](05-swe-world-docker-free.md) | 代码 Agent 评估 | B | 是（W27/05），视角换到"评估基础设施"侧 |
| 06 | [E-mem](06-e-mem-episodic-reconstruction.md) | Agent 记忆 | **A** | 闭环 W27 EvoCF + W28 H-EPM |
| 07 | [SemaClaw](07-semaclaw-harness-mas.md) | MAS 框架 | B | 边界 A（呼应 [[harness-engineering-addy-osmani]]） |
| 08 | [LatentMem](08-latentmem-latent-memory.md) | Agent 记忆 | **A** | 与 E-mem 形成"压缩 vs 不压缩"对比 |

## 推荐成稿路径

### 路径 A：4 篇 Tier A 单篇（信息最丰富）

1. **A-RAG** — Agentic RAG 重构检索决策权；外延 [[context-engineering-field-guide]]
2. **E-mem** — 不压缩的 episodic 记忆；外延 [[agent-skills]] 的"少做事"反直觉
3. **LatentMem** — 8 tokens 极简记忆；外延 [[context-engineering-field-guide]]
4. **SWE-Master** — 代码 Agent 后训练全栈框架；外延 [[auto-improving-software]]

### 路径 B：跨周主题合稿（推荐）⭐

#### 主题 1：Agent 记忆系统三连击（W27 + W28 + W29）

| 周 | 论文 | 视角 |
|----|------|------|
| W27 | EvoCF | 多 Agent + 反事实规划 + 记忆闭环 |
| W28 | H-EPM | 单 Agent + episodic/procedural 双记忆 + 工具图 |
| W29 | E-mem | 多 Agent + episodic 子 Agent 路由 + 不压缩哲学 |
| W29 | LatentMem | 多 Agent + 8 tokens 极简压缩 + 角色感知 |

**可成稿**：*"Agent 记忆系统：四种范式一张地图"* —— 直接外延 [[agent-systems-tour]] 的"4 种范式"结构（已有 4 范式巡礼文章）

**候选 Key Insight**：*"Agent 记忆系统的分水岭不是存什么，是'谁来用'——单 Agent 视角、多 Agent 共享、角色感知、不压缩重构是四种答案。"*

#### 主题 2：代码 Agent 后训练闭环（W27 + W28 + W29）

| 周 | 论文 | 阶段 |
|----|------|------|
| W27 | daVinci-Dev | 中期训练 / 因果链对齐 |
| W28 | DeNovoSWE | 数据合成（Doc→Repo） |
| W28 | SEAlign | 对齐训练（决策点） |
| W29 | SWE-Master | 全栈后训练框架（SFT→RL→TTS） |
| W29 | SWE-World | 评估基础设施（无 Docker + TTC） |

**可成稿**：*"代码 Agent 后训练闭环：从基础模型到 SWE-bench SOTA 的五块拼图"*

**候选 Key Insight**：*"代码 Agent 训练不是数据多就好——漏掉任何一块，SWE-bench 数字都是虚的。"*

### 路径 C：1 篇"推理栈成本账"短文

- JetSpec + PCR + W27 Domino + W28 LCA —— 连续四周的推理加速栈
- 风险：博客不深入 serving 层；可能与 [[ai-cost-model]] 内容重叠

---

## 与前两周的跨周联动机会

| W27 | W28 | W29 | 联动角度 |
|-----|-----|-----|---------|
| EvoCF（多 Agent 记忆） | H-EPM（单 Agent 双记忆） | E-mem（多 Agent 不压缩）+ LatentMem（多 Agent 极简压缩） | **记忆系统主题周**（4 篇） |
| Domino（投机解码） | LCA（KV 压缩） | JetSpec（投机解码）+ PCR（KV 预取） | 推理加速栈（4 篇） |
| daVinci-Dev（中期训练） | DeNovoSWE（数据）+ SEAlign（对齐） | SWE-Master（后训练全栈）+ SWE-World（评估） | **代码 Agent 训练闭环**（5 篇） |
| Plan and Budget（test-time scaling） | — | SWE-Master（含 TTS 阶段） | test-time scaling 实操案例 |

---

## 写作前黄灯（必须先解决）

| 论文 | 问题 | 动作 |
|------|------|------|
| JetSpec / PCR / SWE-Master / E-mem / SemaClaw / LatentMem | **作者机构未在素材中列出**（除个别标 arXiv 编号外） | 写作前必须补作者机构 |
| A-RAG | "10-20pp" 区间跨度大 | 复核 HotpotQA / MuSiQue 细分 |
| A-RAG | "检索 token 用量反而更低" 缺具体数字 | 补绝对 token 数 + 节省比例 |
| SWE-Master | "开源模型达 SOTA" 缺具体模型名 + 数字 | 补 base model + 具体 SOTA 分数 |
| SWE-Master | "串行优先→并行" 与 W27 SWE-Lego 思路相同 | 复核差异 |
| E-mem | PMLR 2026 录用 vs arXiv preprint 关系需明确 | 复核 |
| E-mem | v4 更新（2026-06）具体变更需复核 | 复核是否有新实验或结论变更 |
| SemaClaw | "Claw" 命名与本博客 OpenClaw 创始人同名 | **写作中立化处理**，避免自我引用 |
| LatentMem | "8 个 token" 是 8 还是"如 8 个"区间 | 复核精确数字 |
| LatentMem | "7.1% 性能提升" 缺 benchmark + baseline | 补 |
| LatentMem | "存储效率提升约 40%" 缺对比对象 | 明确对比 E-mem 还是摘要式 |

---

## 提示

**作者身份注意**：本博客 OpenClaw 创始人（aazh2026）在 [[harness-engineering-addy-osmani]] 已有锚点。SemaClaw 的 "Claw" 命名 + Midea AIRC 工业界背景与本博客作者身份可能存在关联（**仅推测，未证实**）。**写作时建议：**
- 不直接挂 OpenClaw 引用
- 用"工业界近期同名框架"或"国内工业界类似思路"等中立表述
- 若证实是 OpenClaw 相关，则作为博客 [[harness-engineering-addy-osmani]] 的"工业实现补充"处理

---

## 待跟进

- [ ] 11 篇文章的作者机构补全（见黄灯表）
- [ ] 三篇 Tier A 论文的精读与 baseline 数据复核
- [ ] SEAlign arXiv ID 在 ICSE 2026 proceedings 复核（W27/W28 老问题，已拖三周）
- [ ] 选路径 A / B / C —— **路径 B 的两个主题周是本周最大素材价值**，强烈建议优先
- [ ] SemaClaw 与本博客作者关系核实

---

*收集于 2026-07-02；尚未成稿。*