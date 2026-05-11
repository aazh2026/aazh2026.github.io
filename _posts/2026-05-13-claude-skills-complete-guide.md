---
layout: post
title: "Claude Skills 完整指南：把一次性 prompt 变成可积累的工作流资产"
date: 2026-05-13T12:00:00+08:00
tags: [AI-Native软件工程, Claude Skills, 工作流自动化, 提示词工程]
author: "@postcodeeng"
series: AI-Native软件工程系列
---

> **TL;DR**
>
> 一篇 161K views 的 Claude Skills 完整教程，核心区分：
> 1. **Saved prompt 是 conversation 起点，Skill 是 trained employee** — 质的区别，不是量的
> 2. **SKILL.md 是 instruction file，不是 prompt 集合** — 包含"从 start 到 finish 怎么做"、工具、格式
> 3. **四阶段建设流程** — 安装 → 构建 → 测试优化 → 完整 Skill 库
> 4. **10 个 Skill = 6.5 周/年 返还给用户** — 每周每 Skill 节省 30 分钟

---

## 📋 本文结构

1. [Saved Prompt vs Skill：质的区别](#saved-prompt-vs-skill质的区别) — 不是起点 vs 工具，是实习生 vs 训练有素的专业人士
2. [为什么 Skills 是当前 AI 最被低估的功能](#为什么-skills-是当前-ai-最被低估的功能) — 8 万+ community skills，多数人一个没装
3. [四阶段流程](#四阶段流程) — 安装 → 构建 → 测试 → 完整库
4. [SKILL.md 的写法](#skillmd-的写法) — 三问题测试 + YAML frontmatter + 分步指令
5. [三场景测试](#三场景测试) — 快乐路径、边缘情况、压力测试
6. [结论：Skill 库是复利](#结论skill-库是复利)

---

## Saved Prompt vs Skill：质的区别

> 💡 **Key Insight**
>
> "Saved prompt 是 conversation 的起点。Skill 是训练有素的员工。Saved prompt 说'这是如何开始'。Skill 说'这是从 start 到 finish 准确做这项工作所需的全部'——包括工具、失败处理、输出格式。

Khairallah AL-Awady 的这篇文章开头做了这个区分：

| 维度 | Saved Prompt | Skill |
|------|-------------|-------|
| **性质** | 对话的起点 | 训练有素的员工 |
| **输出质量** | 一次性，不一致 | 标准化，每次相同 |
| **持久性** | 每次需要重新解释 | 永久存在，自动执行 |
| **适用场景** | 一次性任务 | 重复性任务 |

**输出质量的差异是巨大的。**

当你给 Claude 一个一次性 prompt，你得到一次性质量。不一致的——有时候很棒，有时候一般。每次不同，因为你每次措辞略有不同。

当你激活一个 Skill，你得到标准化质量。每次相同的过程、相同的标准、相同的输出格式。

这就是**有 intern 和有 trained professional 的区别。**

---

## 为什么 Skills 是当前 AI 最被低估的功能

> 💡 **Key Insight**
>
> Anthropic 发布官方 Skills 已经多年，但大多数用户从未安装过一个。没人解释过如何正确使用它们。这就像教人如何招聘员工但不教如何管理员工。

现在有 **8 万+ community Skills 可用**，市场每周增长数千个。Anthropic 官方发布了 PDFs、Word docs、presentations、spreadsheets、design 的 Skills。

**但多数人一个都没装。**

原因很简单：大多数指南只展示如何安装一个 Skill，然后停了。就像展示如何招聘员工但从不教如何管理。

这篇文章覆盖完整生命周期：如何找到对的 Skills → 如何安装 → 如何从头构建自定义 ones → 如何测试和优化 → 如何部署到真实工作流 → 如何构建自动化整个操作的完整 Skill 库。

---

## 四阶段流程

### Phase 1：5 分钟安装第一个 Skill

**Skills 存的地方：** Skills 就是你电脑上的文件夹。每个文件夹里有一个叫 SKILL.md 的文件。在 Claude Code 里，它们住在 `.claude/skills/` 或全局 `~/.claude/skills/`。

**Phase 1 做什么：**
1. 浏览 skillsmp.com 或 github.com/anthropics/skills，找到相关的 Skill
2. 按照仓库里的说明安装
3. 在你通常手动做的真实任务上运行它
4. 比较输出质量和速度与你的常规 prompt 方法
5. 如果输出不完美，记下需要改进的地方

### Phase 2：从零构建第一个自定义 Skill

**三问题测试——构建前先回答：**

**问题 1：这个 Skill 做什么？**
要残酷地具体。不是"help with emails"，而是："Draft professional follow-up emails to prospects who attended our webinar, reference the specific session they attended, include one relevant case study, and end with a clear call to action for a 15-minute demo call."

**问题 2：什么时候激活？你实际会输入什么来触发它？**
"Write a follow-up email." "Draft a webinar follow-up." "Create a prospect email." 列出至少 5 个触发短语。

**问题 3：完美输出是什么样的？**
不要抽象描述。展示一个实际例子。粘贴一封你写的很棒的的真实邮件。**那个例子值 50 行指令。**

**SKILL.md 的两个部分：**

1. **YAML frontmatter**（顶部 `---` 之间的部分）：包含 name（kebab-case）和 description——一个 aggressive、specific 的段落，列出每个触发短语，明确说明 Skill 应该在什么时候激活、什么时候不激活。

2. **frontmatter 下方的 instructions**：用纯英文写的分步工作流。一步一步。顺序的。每步是一个清晰的动作。包含输入输出示例。包含边缘情况及如何处理。包含你的质量标准。整个文件保持在 500 行以内。

**禁止模糊语言**："format nicely" 或 "handle appropriately" 是不允许的。每条指令必须具体且可测试。

### Phase 3：测试、优化、做成 production-grade

**三场景测试：**

把你的 Skill 跑在三个场景上：
- **快乐路径**：正常的、直接的输入，代表 80% 的用例
- **边缘情况**：奇怪的、不寻常的或不完整的输入，测试边界。缺失数据、异常格式、冲突信息
- **压力测试**：最大、最乱、最复杂的任务版本。这揭示你的 Skill 是否 scalable，还是只能在简单输入上工作

如果你的 Skill 全部三个场景都通过，输出你可以舒服地给客户看的，你的就是 production-grade。

**每周优化循环：** 每次你使用一个 Skill 但输出不太对，立即更新 SKILL.md。经过一个月的优化，你的 Skill 将产出与训练有素的专业人士的工作无法区分的输出。

### Phase 4：为你的行业构建完整 Skill 库

> 💡 **Key Insight**
>
> 一个 Skill 是工具。十个 Skills 是劳动力。六个月后，你可以有覆盖你角色每个主要工作流的完整库。

**模式是通用的：** 识别任务 → 构建 Skills → 优化它们 → 让 Claude 处理执行，你处理战略。

**行业特定 Skill 想法：**

| 行业 | Skill 例子 |
|------|-----------|
| 房地产 | 房源文案撰写、市场分析生成器、客户跟进起草、比较销售研究、open house 准备简报 |
| 营销 | 营销活动简报生成器、广告文案撰写、分析报告编译、内容日历规划、A/B 测试分析 |
| 金融 | 费用报告处理器、发票分析器、预算差异解释器、客户投资组合摘要、监管合规检查 |
| 咨询 | 提案起草器、发现电话准备器、交付物格式化器、状态报告生成器、项目总结撰写 |
| 电商 | 产品描述撰写、客户评论分析、库存报告生成、竞品价格追踪、退货分析编译 |

---

## SKILL.md 的写法

**三问题测试背后的逻辑：**

Khairallah 强调在写任何 instruction 之前回答三个问题。这和我们在《Skillify》里讨论的完全一致——Garry Tan 也强调在写 SKILL.md 之前理解失败来自哪里。

**具体 vs 模糊的对比：**

❌ **模糊（禁止）：**
- "format nicely"
- "handle appropriately"
- "be professional"

✅ **具体（必须）：**
- "Return as a table with columns: Risk | Clause | Severity (1-5) | Recommended Rewrite"
- "First word of each bullet: action verb. Each bullet under 15 words."
- "Include one case study from [industry] published after 2024."

**真实例子的价值：**

粘贴一封你写的很棒的的真实邮件作为示例。那个例子值 50 行指令。因为它把"好"变成了具体的、可复制的，而不是抽象的描述。

---

## 三场景测试

> 💡 **Key Insight**
>
> 如果它通过了所有三个场景（快乐路径、边缘情况、压力测试），你就可以舒服地把输出给客户看。如果任何场景失败，失败告诉你具体需要加什么指令。

这和我们在其他文章里讨论的验证逻辑一致：

- **Garry Tan 的 Skillify**：每个 skill 有测试每天跑
- **Mnimiy 的 CLAUDE.md**：验证失败添加规则
- **Saito 的 Missions**：Validation Contract 在规划阶段写好

三者都是**对抗"看起来成功但实际失败"**的问题。

---

## 结论：Skill 库是复利

> 💡 **Key Insight**
>
> 一个 Skill 每周节省 30 分钟 = 每年 26 小时。十个 Skills 每周各节省 30 分钟 = 每年 260 小时 = 6.5 个完整工作周。

这篇文章的核心数学：

- 1 个 Skill × 30 分钟/周 = 26 小时/年
- 10 个 Skills × 30 分钟/周 = 260 小时/年 = 6.5 周

大多数人会继续每天把相同的指令 typing 进 Claude。构建 Skill 库的人，60 天内将运行完全不同的 operation。

这和我们这周一直在追踪的主题完全一致：**真正的积累不是信息，是系统**。Garry Tan 的 skillify、Addy Osmani 的 harness engineering、这篇文章的 Skill 库——全都在说：把你的判断力外化成可积累的资产。

---

## 延伸阅读

**原文**
- Khairallah 的完整指南（英文）：https://x.com/eng_khairallah1/status/2053769247822914031

**资源**
- SkillsMP：skillsmp.com
- Anthropic 官方 Skills：github.com/anthropics/skills

**本系列相关**
- [Skillify：如何让 AI Agent 不再犯同样的错误](#) (AI-Native 软件工程系列)
- [Harness Engineering：AI Agent 时代真正的工程竞争在 scaffold 层](#) (AI-Native 软件工程系列)
- [执行已死，判断力永生](#) (AI-Native 软件工程系列)

---

*AI-Native软件工程系列 #61*
*深度阅读时间：约 7 分钟*