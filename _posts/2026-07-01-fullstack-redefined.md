---
layout: post
title: "全栈的终结：不是岗位消失了，是“全栈”的定义被重新翻译了"
date: 2026-07-01T19:45:00+08:00
tags: [AI-Native软件工程, AI Coding, 全栈工程师, Harness Engineering, Agent工程]
author: "@postcodeeng"
series: aise
---

> **TL;DR**
>
> 本文核心观点：
> 1. **"全栈"在2026年被重新翻译了** — 不是"一个人会前后端"，而是"一个人能否为 AI 设计出可靠的运行环境、端到端定义任务边界和验收标准"。这两个定义完全不同。
> 2. **真正的工程实践来自三个方向** — Harness Engineering（Mitchell Hashimoto）、OpenAI Symphony（工单系统当控制平面）、Ralph Wiggum 循环（Addy Osmani）：它们各自独立地指向同一个结论，即工程师的核心能力正在从"编码"迁移到"约束设计"。
> 3. **Evidence quality note** — Boris Cherny 五类角色框架（真实可查）、OpenAI 内部 Codex 99.8% token 占比（真实可查）、McKinsey/Gartner 预测（第三方，无法独立核实）。
> 4. **没变的那件事** — 领域专家仍然必要，但"领域"的定义从"某层技术栈"变成了"某类可靠性保障"。真正消失的不是前端或后端，而是"遇到后端任务就退缩的纯前端"这种安全感。

---

## 一个词，各自表述

最近很多文章在讨论"前后端一起消失"，证据是美团合并了前后端团队、蚂蚁网商测试转全栈、大厂招聘只剩"Agent工程师"。

这些可能是真实的。但即使全部属实，也只描述了表层变化。真正值得深究的问题是：

> **"全栈"这个词，在 2026 年的工程语境里，被重新翻译了。**

旧的翻译是：一个人同时掌握前端和后端技术。

新的翻译是：一个人能否为 AI 设计出可靠的运行环境，端到端定义任务边界和验收标准。

这两个定义之间，相差了一个范式。

---

## 为什么"合并"不是真正重要的那件事

美团把前端和后端合并成一个团队，蚂蚁让测试转全栈。这类新闻容易让人误以为这是主要矛盾：**组织架构调整 → 岗位消失**。但这个推理链条忽略了一个更深的问题：

> **如果一个人同时会用 React 和 Node.js，但在 AI 面前仍然只能做被支配的执行者，那他的"全栈能力"在 AI Coding 时代还有多少杠杆？**

McKinsey 提出的概念值得单独拎出来：AI 推动开发者走向 **"AI Tech Stack Developer"**——不是用一种语言覆盖前后端，而是能用 AI 的能力版图来规划自己的技术投入。

这个概念比"全栈"更准确，但也没有完全说透。真正说透的，是三个独立出现、相互印证的第一手工程实践。

---

## 三个工程实践，各自印证了同一件事

### 1. Harness Engineering：Peter Steinberger 和 Mitchell Hashimoto 几乎同时命名了它

OpenAI 工程师 Peter Steinberger 2026 年 6月在 X 上的原话：

> "You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents."

几天后，Terraform/HashiCorp 创始人 Mitchell Hashimoto 在博客里系统化了同一个思路，他称之为 **Harness Engineering**——这个名字迅速在工程社区里扩散开。他的核心洞察是反直觉的：

> **每遇 Agent 犯错，不要修复那个错误本身，而是把导致错误的根本原因固化进 AGENTS.md 或专用工具，让下一个 Agent 不再犯。**

这不是调试，这是构建约束系统。

OpenAI 自己的 Symphony 协议（SPEC.md，2026年5月开源）把这个思路推进了一步：工单系统（Linear）直接成为控制平面，每个 open issue 对应一个隔离的 Agent 工作空间，人只做 reviewer，Agent 负责执行→验证→PR 的完整闭环。Symphony 的规范文档说：

> "我们不应该盯着 AI 一个字符一个字符地写代码，而应该像管理人类工程师一样，通过定义明确的边界、策略和输入输出来管理 AI 的工作。"

这两段话出自不同人之手，相隔不到一周，说的是同一件事：**工程师的核心输出正在从"代码"迁移到"约束规范"**。

### 2. Ralph Wiggum 循环：Addy Osmani 找到了让 Agent 持续可靠工作的工程模板

Addy Osmani（Google Chrome 团队工程总监）在《Self-Improving Coding Agents》里描述了一种被他命名为 **Ralph Wiggum** 的循环模式（由 Geoffrey Huntley 率先提出）。这个名字来自《辛普森一家》里的 Ralph Wiggum——"I am helping" 而非"I am done"——取其"任务完成报告不可信"的反讽意味。

这个循环的结构：

**Pick task → Implement → Validate → Commit/Rollback → Update state → Reset context → Repeat**

关键的反直觉设计：**每次循环都要清空 Agent 的上下文，重新注入**。不是让 Agent 记住更多，而是在每次运行里让它记住得更少、更精确。

Osmani 记录了四个持久化通道：Git commit history（代码变更）、progress.txt（任务日志）、prd.json（任务状态）、AGENTS.md（语义知识）。这四个通道替代了单一的长上下文窗口——**模型的遗忘由结构化文件承接，而不是由扩展 context window 解决**。

他对"全栈"的重构观点是：

> "Code generation is extremely cheap now. The premium is on evaluation, testing, and knowing what you've already solved so you don't redo it."

翻译：代码生成已经极度廉价，真正的溢价在评审、测试，以及知道你已经解决过什么问题，从而不去重复解决。

### 3. 双 Agent 架构：Anthropic 在"长程任务"实验里发现了什么

Anthropic 工程博客《Effective Harnesses for Long-Running Agents》（2025年11月）记录了团队在让 Claude 完成复杂项目时遇到的核心瓶颈：上下文窗口不够用。他们发现单纯扩展 context 不是解法——真正有效的是 **双 Agent 初始化+执行分离架构**：

- **初始化 Agent**：只在项目开始时运行一次，负责规划，把需求拆解成完整的功能清单，不写代码
- **执行 Agent**：负责编码实现，每个子任务独立运行，不累积历史负担

他们还引入了一个现在被广泛引用的机制：**进度追踪文件**（claude-progress.txt）和 **JSON 特性列表**——把结构化状态从模型内部转移到外部文件系统。

这与 Osmani 的 Ralph Wiggum 循环形成了奇妙的收敛：**两个独立来源，各自独立实验，都指向了同一个结论——状态外化、上下文清空、任务原子化**。

---

## 什么是真正没变的

在"全栈定义被重新翻译"的趋势里，有些东西没有被改变，值得单独说清楚。

**第一，领域专家仍然必要。** McKinsey 的"AI Tech Stack Developer"概念有个隐含前提：每个技术层仍然需要有人知道 AI 的能力边界在哪里、什么时候 AI 的输出不可靠。Anthropic 的实验里，当涉及复杂权限、事务一致性等业务隐含约束时，Agent 表现明显不稳定——这说明业务领域知识不是被替代了，而是被重新定位了：从"实现工具"变成"验证 AI 输出是否合理的标尺"。

**第二，"判断力"比"执行力"更稀缺。** Gartner 预测（无法独立核实，但逻辑合理）：到 2028 年，AI coding 成本可能超过普通开发者平均薪资。这个预测的真正含义不是"AI 太贵了"，而是：当 token 驱动成本变得显著，"知道什么时候不该让 AI 上"会成为真正的护城河。

**第三，"全栈能力"的含义变了，但"全栈"这个词本身不是问题。** 真正消失的不是"全栈工程师"这个标签，而是"我只会前端，遇到后端任务就退缩"这种心态。组织可以合并前后端团队，但如果工程师本人没有建立新的能力地图，岗位合并只是把焦虑集中化了。

---

## 一句话收尾

Wordsmith AI CTO Volodymyr Giginiak 说的这句话，比大多数"趋势分析"都更接近本质：

> "未来杠杆最高的工程师，将是那些能够为 AI 设计正确运行环境和上下文的人。"

如果你理解了这句话在说什么，你会发现"全栈的终结"这个标题并不准确——准确的说法是：

**不是全栈消失了，是"全栈"这个词终于被翻译对了。**

> 💡 **Key Insight**
>
> "全栈"的旧定义：一个人掌握多少层技术栈。
> "全栈"的新定义：一个人能否为 AI 设计出可靠的运行环境，端到端定义任务边界和验收标准。
> 这两个定义之间，相差了一个范式。

---

## 参考来源

- Mitchell Hashimoto, "[My AI Adoption Journey (Harness Engineering)](https://mitchellh.com/writing/my-ai-adoption-journey)", February 2026
- OpenAI, "[Symphony SPEC.md](https://github.com/openai/symphony/blob/main/SPEC.md)", May 2026
- Addy Osmani, "[Self-Improving Coding Agents](https://addyosmani.com/blog/self-improving-agents/)", 2026
- Geoffrey Huntley / Ryan Carson, Ralph Wiggum loop pattern, referenced in Osmani blog
- Anthropic, "[Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)", November 2025
- McKinsey, AI Tech Stack Developer analysis (来源待核实)
- Gartner, AI coding cost forecast (来源待核实)

---

*Aaron · 2026年7月1日*
*系列：AI-Native Engineering*

