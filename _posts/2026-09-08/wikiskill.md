---
title: "WikiSkill：让 Agent 经验演化成持久知识"
date: 2026-09-08
categories: [AI, Agent, Skill Evolution]
---

> 论文：*WikiSkill: Compiling Agent Experience into Persistent Knowledge for Skill Evolution*
> arXiv: [2608.27454](https://arxiv.org/abs/2608.27454)
> 作者：Liyan Tang, Cyrus Rashtchian, Chun-Sung Ferng, Andrew Tomkins, Da-Cheng Juan, Tu Vu（Google Research + Virginia Tech）

## 经验为什么不等于知识

大多数技能演化方法的共同问题：优化历史（rollout 轨迹、验证分数）散落在各次迭代里，每次新版本的技能提议都是从零开始分析原始轨迹，而不是站在前人肩膀上。

论文的核心观察：**原始执行经验（raw experience）和可执行技能（executable skill）之间，存在一个结构化知识积累的鸿沟**。不填这个鸿沟，技能演化就是在重复造轮子。

## WikiSkill 的三层架构

WikiSkill 把知识分成三个层次，强制分离关注点：

| 层次 | 内容 | 作用 |
|------|------|------|
| **Raw Layer** | 不可变的执行轨迹（observation-action 序列） | Wiki Maintainer 和 Skill Proposer 的分析原料 |
| **Wiki Layer** | 结构化持久知识：`patterns/`、`logs.md`、`skill-impact.md` | 跨迭代积累，Skill Proposer 按需读取 |
| **Skill Layer** | 当前活跃技能：`SKILL.md` + `PURPOSE.md` | 直接注入 Inference Agent 系统提示 |

关键设计：**Wiki 永久保留，即使对应的技能被回滚**。这保证了失败经验不会被丢弃，而是成为后续提案的审计材料。

## 四步演化循环

```
推理 rollout → Wiki 维护 → 技能提议 → 门控验证 → 更新 Wiki 日志
```

**Inference Agent**：使用当前技能对训练任务执行多轮 rollout。注意训练阶段**不提供 Wiki 访问**——论文消融实验证明，训练时让 Agent 直接查 Wiki 会降低最终技能质量（63.7% → 60.9%）。

**Wiki Maintainer**：对成功/失败轨迹采样，对失败轨迹做根因分析，增量编辑 `patterns/` 中的模式页、`logs.md` 和 `skill-impact.md`。

**Skill Proposer**：ReAct 风格的自主代理，按需读取 patterns/、logs.md、skill-impact.md 和原始轨迹，生成原子提案（新建或对已有技能的增量 patch）。

**Gating & Rollback**：在验证集上评估候选技能，性能提升则接受，否则回滚——但 Wiki 的编辑永久保留。

## 关键实验数据

### 主实验（5 模型 × 5 基准）

WikiSkill 在全部 5 个模型上均取得最高平均准确率：

| 模型 | 相比最强竞品提升 |
|------|----------------|
| Qwen-3.5-4B | +3.3 pp |
| Qwen-3.5-9B | +5.1 pp |
| Qwen-3.6-27B | +10.0 pp |
| Gemma-4-31B | +5.8 pp |
| Gemini-3.5-Flash | +12.0 pp |

代表性基准提升：
- **LiveMath**：Gemini-3.5-Flash 33.0% → 72.6%（+39.6 pp）
- **SpreadSheet**：Qwen-3.6-27B 40.8% → 81.7%（+40.9 pp）
- **ALFWorld**：Qwen-3.5-9B 34.7% → 63.4%（+28.7 pp）

### 技能演化与模型规模互补

WikiSkill 的收益随模型规模**递增**（+12.3% → +17.5% → +23.9%）。更重要的是：小模型配备技能后可以超过更大模型的无技能基线：

> Qwen-3.5-9B + WikiSkill = **47.4%**，超过 Qwen-3.6-27B 无技能的 **39.4%**

### 跨模型技能迁移

这是最反直觉的发现：**迁移技能往往优于自我演化**。

- Qwen-3.6-27B 演化的 SpreadSheet 技能在 Qwen-3.5-9B 上达到 **50.5%**，而自演只有 33.6%
- Qwen-3.5-4B 演化的 LiveMath 技能将 Gemini-3.5-Flash 从 33.0% 提升至 **67.5%**

这说明技能发现（找到有用的程序知识）和技能执行（模型能否可靠执行）是**可分离的能力**——迁移研究帮助我们区分二者。

### Wiki 访问的消融

| 配置 | 平均性能 |
|------|---------|
| Skill Proposer 无 Wiki 访问 | 48.7% |
| Skill Proposer 有 Wiki 访问 | **63.7%** |
| Inference Agent 训练时也访问 Wiki | 60.9% |

结论：**训练 rollout 阶段不访问 Wiki**是 WikiSkill 有效的关键设计决策之一。

## 实践意义

WikiSkill 的三层架构对工程实践的直接启示：

1. **不要丢弃失败轨迹**：失败经验是知识积累的原材料，需要结构化存储而非日志归档
2. **技能演化需要有记忆的提议者**：Skill Proposer 需要能访问历史提案记录（skill-impact.md），避免重复被拒绝的方向
3. **训练和推理的上下文访问策略不同**：训练时不给 Agent 查 Wiki 的权限，是为了让技能自包含，而不是依赖外部记忆
4. **小模型 + 好技能 > 大模型 + 无技能**：在算力受限场景，技能工程是性价比更高的优化方向

---

*论文真实数据 + 独立解读。未引用二手资料。*
