---
layout: post
title: "Perplexity 官方指南：Skill 的 Zen of Python 对比，和一个反直觉的研究结论"
date: 2026-05-13T16:00:00+08:00
tags: [AI-Native软件工程, AI Agent, Perplexity, Skills, 提示词工程]
author: "@postcodeeng"
series: AI-Native软件工程系列
---

> **TL;DR**
>
> Perplexity Research 发布的官方 Skill 设计指南，来自他们维护生产级 Skills 库的第一手经验：
> 1. **Python 的 Zen 在 Skill 写作里大多反向适用** — 简单 > 复杂（错）、显式 > 隐式（错）
> 2. **Skill 是目录，不是文件** — 包含 SKILL.md、scripts/、references/、assets/、config.json
> 3. **三层 context 成本** — Index（~100 tokens）→ Load（~5000 tokens）→ Runtime（无上限）
> 4. **自我生成的 Skills 平均无益** — 模型不能可靠地编写自己受益的 procedular knowledge

---

## 📋 本文结构

1. [Zen of Python vs Zen of Skills](#zen-of-python-vs-zen-of-skills) — 至少一半的 Python 智慧在 Skills 写作里是错的
2. [Skill 是什么：四个定义](#skill-是什么四个定义) — 目录、格式、可调用、渐进
3. [三层 context 成本](#三层-context-成本) — 每个 session 每个用户都在付 token 税
4. [什么时候需要 Skill，什么时候不需要](#什么时候需要-skill什么时候不需要) — 大多数 git 命令不需要
5. [如何构建 Skill](#如何构建-skill) — 四步流程，Evals 第一
6. [研究结论：自我生成的 Skills 平均无益](#研究结论自我生成的-skills-平均无益)
7. [结论：每个 Skill 都是税](#结论每个-skill-都是税)

---

## Zen of Python vs Zen of Skills

> 💡 **Key Insight**
>
> 在 PEP20 的 20 行智慧里，至少一半在写 Skills 时是完全错误的或积极误导的。写好 Python 代码和写好 Skills 需要的直觉和最佳实践差异巨大。

Perplexity Agents 团队审查了许多优秀工程师在工作中开发的 Skills 的 pull requests。结果几乎总是大量的评论和修订建议。因为许多写代码的有用模式在 Skill 创建里变成了反模式。

| Zen of Python | Zen of Skills |
|--------------|--------------|
| Simple is better than complex | A Skill is a folder, not a file. **Complexity is the feature.** |
| Explicit is better than implicit | Activation is implicit pattern matching. **Progressive disclosure.** |
| Sparse is better than dense | **Context is expensive. Maximum signal per token.** |
| Special cases aren't special enough to break the rules | **Gotchas ARE the special cases.** They're the highest-value content. |
| If the implementation is easy to explain, it may be a good idea | **If it's easy to explain, the model already knows it. Delete it.** |

这个对比太重要了——它揭示了我们在其他文章里讨论的同一个核心洞察的另一个面：

- Garry Tan：模型只是引擎，肥的是 harness 和 skills
- Addy Osmani：Agent = Model + Harness
- Mnimiy：约束改变注意力分配
- Perplexity：写好 Skills 需要完全不同于写代码的思维模式

---

## Skill 是什么：四个定义

> 💡 **Key Insight**
>
> 当你写一个 Skill，你不是在写普通的旧软件。你是在构建模型及其环境的 context。Skill 有不同的约束和不同的设计原则。如果你像写代码一样写 Skill，你会失败。

Perplexity 的定义：Skill 至少是四样东西。

### 1. Skill 是一个目录

Skill 不仅仅是一个 SKILL.md 文件。在很多情况下，Skill 包含几个文件。在以 Skill 命名的目录下，你可能有：

```
skill-name/
├── SKILL.md           # frontmatter 和 instructions
├── scripts/           # agent 运行而非重写的代码
├── references/        # 按条件加载的重文档
├── assets/            # 模板、schemas、数据
└── config.json        # 首步用户设置
```

这个 hub-and-spoke 模式让你保持 Skills 非常专注和紧凑。有时候，尤其是复杂的 Skills，从多层级 hierarchy 中受益。

**一个关键例子：** Perplexity 团队在美国个人所得税能力的 Skills 里用了三层 topical nesting。1,945 个 IRS 代码章节全部放在一个文件夹里，结果性能比不加载 Skill 还差。**组织成逻辑细分是确保高精度读取操作不可或缺的条件。**

### 2. Skill 是一个格式

核心 root `SKILL.md` 文件必须有 name 和 description。而且 Skill 必须精确映射到 Skill 所在目录的名称。名称全小写、无空格、可用连字符。

**description 是路由触发器，不是内部文档。** 这是常见的失败点。你会经常看到"Load when"，而不是"This Skill does"。

在 frontmatter 里，还有 `depends:`（创建层级 Skill 依赖）和 `metadata:`（用于审查和评估）。

### 3. Skill 是可调用的

agent 在运行时加载 Skill。重要的是，Skills 不是总是被 bundle 进 context 的。默认情况下，大多数 agent 系统在特定需要时渐进展开 Skills。

### 4. Skill 是渐进的

在 Computer 里，有三个不同层级的 context 成本：

| 层级 | 加载什么 | 预算 | 何时付出 |
|------|---------|------|---------|
| Index | 每个非隐藏 Skill 的 `name: description` | ~100 tokens per Skill | 每个 session，每个用户，始终 |
| Load | 完整 `SKILL.md` body | ~5,000 tokens | 运行时 |
| Runtime | `scripts/`、`references/`、`assets/`、子 Skills、`FORMATTING.md`、`SPECIAL_CASES.md` | 无上限 | 仅当 agent 读取它们时 |

**Index 成本是最紧的**——因为你每个 session、每个用户都在付出这个成本。它被注入到 system prompt 最开始。模型需要决定是否调用 `load_skill()`。

**Load 成本更宽松但仍紧张**——一旦加载 Skill body，剩余对话必须支付这个成本直到压缩边界。许多 thread 加载 3-5 个不同的 Skills，乘以这个成本。**有 fluff 的 Skills 几乎肯定会降解其他 Skills 以及整体 agent 能力。**

**Runtime 最宽松**——这可能是 20,000 tokens 或零 tokens。这是你可以考虑渐进扩展模型 context 的层级。

---

## 三层 context 成本

> 💡 **Key Insight**
>
> 在 Index 里，每个 token 都重要。加载的 Skill body 更宽松，runtime 最宽松。**如果你的 Skill 加载了但没做正确的事，那就是浪费 context。**

Pascal有句名言（法语更优美）："我只是把这封信写长了，因为我还没有时间把它写短。"

就像 Pascal 一样，你需要在每个 Skill 上投入时间。写一个短的 Skill 是很难的。如果你的 Skill 很容易写，它可能太长了或者不应该存在。**一个好的 Skill 和它能的一样短。**

---

## 什么时候需要 Skill，什么时候不需要

### 需要 Skill 的时候

- agent 没有特殊 context 会搞错
- 需要跨运行极度一致的某些不一致性或非决定性
- 你的知识持久但不在训练数据里（企业特定 workflows、cutoffs、品味）
- 模型不能从训练数据里学会的判断（比如 Henry Modisett 的设计 Skills：哪些字体用、哪些不用、这些字体的感觉）

### 不需要 Skill 的时候

**模型已经知道的事不需要 Skill：**
- 一系列需要执行的 git 命令——模型已经知道怎么做了，做成 Skill 是好文档但不是好 Skill

**全局 context 应该处理的：**
- 与大多数请求相关的知识——应该包含在全局 context 里，不是条件加载的 Skill 里

**快速变化的东西：**
- 如果某个东西变化快到你无法维护它——不要把它注入到 Skill 里，那只会导致 drift 和错误

### 每个 Skill 都是税

> 💡 **Key Insight**
>
> 你可以对你 Skill 里的每个句子应用这个测试："没有这个指令 agent 会搞错吗？"如果句子不需要在那里，它就不能承受在那里。**当你决定是否添加 Skill 时，记住这个税：每个 session 每个用户都要付 tokens。**

每次你添加一个额外的 Skill，你冒着让每个其他 Skill 稍微变差的风险。你需要确保最小化回归。

---

## 如何构建 Skill

### Step 0: 写 Evals

**先写一些 evals。** 你可以从以下来源获取评估案例：
- 真实用户查询：生产环境采样或你的 brain trust
- 已知失败：agent 失败因为 Skill 不存在
- 邻居混淆：接近你的领域边界但路由到另一个 Skill

至少确保测试 Skill 在需要时被加载。**负面例子极其强大，可能比正面例子更重要。**

### Step 1: Description

**这是 Skill 里最难的一行。** 它是路由触发器，不是文档。

❌ **差的 description 描述 Skill 做什么或为什么有用。**

✅ **好的 description 描述 agent 什么时候应该加载 Skill。**

例如，如果你有一个监控 pull requests 的 Skill：
- 不要写 Skill 做什么
- 写工程师在沮丧时说的话，他们想确保 PR 工作正常，比如"babysit"或"watch CI"或"make sure this lands"

**快速检查清单：**
- 以 "Load when..." 开头
- 目标 50 词或更少
- 描述用户意图，最好来自真实查询
- 不总结 workflow

### Step 2: 写 Body

**这还不是 Step 0 或 Step 1。** 在写内容之前，你需要先有 Evals 和 Description。

当向 LLM 传达 workflows 时，完全不同于向同事或运行时系统传达。人类需要文档、walkthrough 和经验，但几乎任何已经存在至少一年的软件工具，你只需要提到它的名字，LLM 就有了它需要的所有信息。

**写 body 时，跳过明显的东西。** 许多工程师在写 readme.md 时会列出一个接一个的命令。当你在写 Skill 时很容易退回到那个模式，但这会让你的 Skill 成为垃圾。

❌ **不要写：**
> `git log # find the commit; git checkout main; git checkout -b <clean-branch>; git cherry-pick <commit>;`

✅ **写：**
> "Cherry-pick the commit onto a clean branch. Resolve conflicts preserving intent. If it can't land cleanly, explain why."

**后者比前者好得多**，尤其是当事情出错时。不要 railroad 或过度规定——那是脆弱的。多个方法可以工作时要有灵活性。

**关注 gotchas 或负面例子。** 这些是极高信号的内容，因为它们经常引导模型不要做什么。如果你每次 agent 绊倒时加一行，你会在运行中学习，gotchas 会自然增长。

### Step 3: 用 Hierarchy

| 目录 | 用途 | 例子 |
|------|------|------|
| `scripts/` | agent 每轮都会重写的确定性逻辑 | 给它代码去 compose，不要重构建 |
| `references/` | 仅在满足条件时加载的重文档 | "如果 API 返回非 200，读 `api-errors.md`" |
| `assets/` | agent 复制和填充的输出模板 | `report-template.md`、output schemas |
| `config.json` | 首步用户设置 | 问 Slack channel，保存，下次重用 |

对于任何条件性或从主 Skill 分支的内容， breakout 到文件夹。如果特别复杂，记得也可以用多级 hierarchy。

---

## 研究结论：自我生成的 Skills 平均无益

> 💡 **Key Insight**
>
> 如果你发现自己尝试一次性生成 Skill 并在五分钟内提出 PR，结果几乎可以肯定低于标准。早期的研究已经表明：**"Self-generated Skills provide no benefit on average, showing that models cannot reliably author the procedural knowledge they benefit from consuming."**

模型不能可靠地编写自己受益的 procedular knowledge。这是这周最反直觉的发现之一。

我们一直在讨论 Skill 是判断力的外化。但 Perplexity 的研究表明：当前的模型在写作给自己用的 Skills 时，并不能从自己写的那些里受益。

这说明什么？**Skill 的价值来自人类判断的注入**，不是模型的自我生成。Garry Tan 说"skillify it"是他说的一句话让 agent 把那次艰难学到的东西变成永久基础设施——那个过程需要人类说出"那工作了，现在让它永久化"。

---

## 结论：每个 Skill 都是税

Perplexity 这篇文章最精炼的表达：

**"When you are deciding whether to add a Skill or not, remember this tax wherein every session and every user costs tokens."**

这周发的所有文章——Garry Tan、Mnimiy、Addy Osmani、Khairallah、Mushtaq、Perplexity——都在说同一件事的不同面：

- Skills 是判断力的外化，不是代码
- 每个 Skill 有 token 税，每个 session 每个用户付
- 好 Skill 如其短
- gotchas 是最高价值内容
- 自我生成的 Skills 平均无益——需要人类注入判断

Pascal 说："我只是把这封信写长了，因为我还没有时间把它写短。" 好的 Skill 也是这样——它需要时间，因为它是判断力的浓缩，不是代码的压缩。

---

## 延伸阅读

**原文**
- Perplexity Research 的完整指南：https://research.perplexity.ai/articles/designing-refining-and-maintaining-agent-skills-at-perplexity

**本系列相关**
- [Skillify：如何让 AI Agent 不再犯同样的错误](#) (AI-Native 软件工程系列)
- [Harness Engineering：AI Agent 时代真正的工程竞争在 scaffold 层](#) (AI-Native 软件工程系列)
- [Claude Skills 完整指南：把一次性 prompt 变成可积累的工作流资产](#) (AI-Native 软件工程系列)
- [执行已死，判断力永生](#) (AI-Native 软件工程系列)

---

*AI-Native软件工程系列 #62*
*深度阅读时间：约 9 分钟*