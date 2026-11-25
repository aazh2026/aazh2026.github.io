---
layout: post
title: "审查轨迹比审查结论更值钱——用Tool-Call序列做Code Review训练信号"
date: 2026-09-18
---

**论文**: [Agentic Code Review in the Terminal: A Trajectory-Level Analysis of Behavior, Cost, and Human-Alignment](https://arxiv.org/abs/2607.16740) (arXiv:2607.16740)

**补充链接**: https://www.themoonlight.io/en/review/agentic-code-review-in-the-terminal-a-trajectory-level-analysis-of-behavior-cost-and-human-alignment

**一句话思想**: Code Review Agent 的价值不在于生成的评论文本有多像人，而在于有没有先走完完整的 tool call 轨迹（grep 调用链 → 查 blame 历史 → 看边界条件 → 再下结论）；轨迹级 reward 才是真正的训练信号，而不是文本相似度。

---

## 1. 为什么现有 Code Review 模型容易变成"lint 嘴替"

过去训练 code review 模型的标准范式：

- 收集一批 PR + 人工 review 文本
- 拿 review 文本当 ground truth
- 训一个模型去拟合"人类 reviewer 写了什么"

这个范式有一个根本问题：**人类 reviewer 的评论文本 ≠ 有价值的 review 行为**。

实际观察到的现象：
- 大部分 review 评论是风格/格式化建议（"这个变量名不顺眼"）
- 真正有价值的 review 行为是：追踪调用链、发现边界条件遗漏、识别 API 误用——这些往往**不出现在最终评论文本里**
- 模型学到的是"评论分布"，而不是"调查行为"

结果：模型输出看起来像人，但漏掉了真正重要的 bug。

---

## 2. 轨迹级分析的核心洞见

2607.16740 这篇的贡献是：**在 terminal 环境里系统性采集 agent code review 的 tool-call 轨迹**，而不是只拿最终的 review 文本做评估。

### 2.1 采集什么

他们采集的轨迹数据包含：

```json
[Session]
Step 1: grep -r "authenticate_user" src/ → 找到3处调用
Step 2: git blame src/auth.py:142 → 看谁改的，为什么改
Step 3: 查文档: openapi spec endpoint → 确认认证流程
Step 4: [发现边界条件] NULL token 未检查
Step 5: 写评论: "authenticate_user() 在 token==NULL 时未返回 error"
```

注意：**Step 5 的评论只是一句话，但 Step 1-4 的轨迹才是真正有价值的调查行为**。

### 2.2 轨迹 vs 评论的对比发现

| 维度 | 仅看评论文本 | 看完整轨迹 |
|---|---|---|
| 能发现 API 误用 | 42% | 89% |
| 能发现并发问题 | 28% | 71% |
| 能发现边界条件 | 51% | 82% |
| 调查深度（平均 tool calls） | N/A | 7.3 次 |

核心结论：**如果只拿评论文本训练，模型学到的是"已发现问题的表达方式"，而不是"如何发现有价值的问题"**。

---

## 3. 轨迹级 Reward Signal 的设计

基于轨迹分析的发现，一个合理的轨迹级 reward 设计应该包含：

### 3.1 多维度 reward 分解

```python
reward = 
    +1.0 * found_critical_bug          # 最终发现了bug（最终奖励）
    +0.3 * grep_call_chain_completed   # 查了调用链
    +0.3 * blame_history_checked       # 查了blame历史
    +0.3 * boundary_conditions_explored # 查了边界条件
    -0.5 * jumped_to_conclusion_early  # 没有充分调查就下结论
```

**"先调查再结论"被明确激励**，而不是只激励结论的正确性。

### 3.2 调查顺序约束

更进一步，可以加**顺序约束作为 soft constraint**：

- grep/查文档应该在写评论之前
- 如果评论出现在调查动作之前，给负分
- 这相当于把"reviewer 的行为模式"本身当成了监督信号

### 3.3 与 SWE-bench 的关系

这个方向对 SWE-bench 类任务特别有价值：

- SWE-bench 考的是"能不能修"，不考"怎么发现"
- 但真实 code review 的价值链在"发现"环节
- 轨迹 reward 可以弥补这个 gap：让 agent 学到"好的 reviewer 怎么想"，而不只是"给定 bug 怎么修"

---

## 4. 工程落地路径

**Before（传统方法）**：
```text
PR → 人工review文本 → 训练模型拟合文本 → 输出像人但漏bug
```

**After（轨迹方法）**：
```text
PR → 轨迹采集(工具调用序列) → 定义轨迹reward 
   → 训练模型学调查行为 → 输出能发现真正问题的agent
```

具体实施路径：

1. **采集真实轨迹**：在 CI/CD 流程中嵌入 review agent，每次 review 同时记录 tool call 序列
2. **人工标注高价值轨迹**：不是标注"评论对不对"，而是标注"调查过程是否充分"
3. **训 reward model**：用轨迹+标注训一个价值函数，作为强化学习的奖励信号
4. **微调 base model**：用轨迹级 reward 做 RLHF 或 DPO

---

**核心理念一句话**: review 模型的差距不在评论文本像不像人，而在有没有先做完整的调查动作；轨迹级 reward 让模型学到"好的 reviewer 怎么想"，而不是"bug 怎么修"。

---

*Tags: code-review, agent-trajectory, reward-model, SWE-bench, tool-call, RLHF*
