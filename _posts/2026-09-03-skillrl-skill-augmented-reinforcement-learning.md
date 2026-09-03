# SkillRL — 基于递归技能增强强化学习的智能体进化

## 背景

arXiv:2602.08234，2026 年 2 月，ICLR 2026 Workshop。UNC Chapel Hill AIMING Lab + NEC Labs America 出品。

LLM Agent 在复杂任务上表现出色，但通常孤立运行——每次任务执行都是一次 episode，过去的成功和失败没有变成可复用的行为模式。

现有记忆方法主要存储原始轨迹，冗余且噪声多，难以提取高层可复用模式。SkillRL 提出：**不要给 Agent 记忆，给它们技能**。

---

## 核心思想：经验蒸馏替代轨迹存储

传统记忆方法：把原始轨迹存进外部数据库，作为未来相似任务的参考。

问题：原始轨迹冗长、充满噪声，模型很难从中提取关键信息。就像备考时不是提取关键概念，而是背下教材的每一页。

SkillRL 的思路：把 Diverse experiences（成功轨迹 + 失败轨迹）**蒸馏**成结构化的技能，形成层次化技能库 SkillBank。训练时从 SkillBank 检索，而不是从原始轨迹检索。

---

## 三大核心创新

### 创新一：经验蒸馏机制 → SkillBank

**从成功轨迹中提取战略模式**，从失败轨迹中提取反事实教训（"犯了什么错、为什么发生、如何避免"）。

SkillBank 分为两层：

| 层级 | 内容 | 作用 |
|------|------|------|
| **General Skills** | 通用战略指导，不绑定具体任务 | 跨任务复用的启发式 |
| **Task-Specific Skills** | 任务类别级别启发式 | 针对特定任务类型的策略 |

每个技能的结构（Claude Style）：

```json
{
  "skill_id": "gen_001",
  "title": "Systematic Exploration",
  "principle": "Search every plausible surface exactly once …",
  "when_to_apply": "Anytime the goal object count is not yet met …"
}
```

### 创新二：自适应检索策略

推理时根据任务需要，灵活调取通用启发式和任务特定启发式。

参数配置：
- `top_k`：每 episode 注入的通用技能数（默认 6）
- `task_specific_top_k`：任务特定技能数
- `retrieval_mode`：`template`（模板匹配）或 `embedding`（向量检索）

### 创新三：递归进化机制

SkillBank **不是静态存储，而是在 RL 训练过程中与 Agent 策略协同进化**。

进化触发条件：
- 验证失败率超过阈值（`update_threshold`，默认 0.4）
- 每次最多新增 3 个技能（`max_new_skills`）

这使得技能库和 Agent 策略形成正反馈：策略变强 → 发现更多失败模式 → 技能库进化 → 策略进一步变强。

---

## 训练框架

### 基础设置

- **Base model**：Qwen 2.5-7B-Instruct
- **Teacher model**：OpenAI o3（用于技能蒸馏）
- **RL 算法**：GRPO（Group Relative Policy Optimization）
- **环境**：ALFWorld、WebShop、7 个搜索增强 QA 任务

### 技能生成脚本

```bash
# ALFWorld
python skill_generation/alfworld.py \
  --memory_path memory_data/alfworld/generated_memories_alfworld_total.json \
  --output_path memory_data/alfworld/claude_style_skills.json

# WebShop
python skill_generation/webshop.py \
  --memory_path memory_data/webshop/generated_memories_webshop_100.json \
  --output_path memory_data/webshop/claude_style_skills.json
```

---

## 性能结果

### ALFWorld（核心基准）

| Model | Success Rate |
|-------|-------------|
| **SkillRL (Qwen 2.5-7B)** | **89.9%** |
| GPT-4o | 48.0% |
| Gemini 2.5 Pro | 60.3% |
| 强基线均值 | ~75% |

以 7B 参数超越 GPT-4o **41.9 个百分点**，超越 Gemini 2.5 Pro **29.6 个百分点**。

### 关键优势

| 指标 | 结果 |
|------|------|
| 相对强基线提升 | **15.3%+** |
| Token 压缩率 | **10-20x**（相比原始轨迹存储） |
| 随任务复杂度增加的鲁棒性 | 保持稳健 |

---

## 与 Reflexion/ExpeL/MemRL 的区别

| 方法 | 核心机制 | 抽象层次 |
|------|---------|---------|
| **Reflexion** | 语言反馈驱动的自我反思 | 轨迹级 |
| **ExpeL** | 从经验中归纳启示 | 轨迹级 |
| **MemRL** | 简单自我反思 | 轨迹级 |
| **SkillRL** | 层次化技能蒸馏 + RL 协同进化 | **技能级（结构化抽象）** |

SkillRL 的层次化抽象是性能飞跃的关键——把"发生了什么"变成"下次遇到类似情况该怎么做"。

---

## 解读：从"存储经验"到"提取行为模式"

SkillRL 的最重要贡献不是某个具体技巧，而是它重新定义了"Agent 如何从经验中学习"这个问题。

传统路线：存轨迹 → 检索轨迹 → 参考执行
SkillRL 路线：蒸馏经验 → 形成技能 → 策略与技能库协同进化

技能比轨迹更难获取，但获取后的迁移能力更强。10-20x 的 token 压缩率是这个思路的直接证明——同样或更好的性能，代价是更少的推理 token。

递归进化机制则是点睛之笔：SkillBank 不是一次性构建然后冻结，而是在 RL 训练过程中持续与策略共同演化。这意味着 Agent 越强，对失败模式的理解越深，技能库越精确，反过来又让 Agent 更强。

---

**链接**: https://arxiv.org/abs/2602.08234
