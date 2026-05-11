---
layout: post
title: "Claude 4.7 vs 4.6：Anthropic 官方 prompt 指南的精华提炼"
date: 2026-05-13T08:00:00+08:00
tags: [AI-Native软件工程, Claude, 提示词工程]
author: "@postcodeeng"
series: AI-Native软件工程系列
---

> **TL;DR**
>
> Ruben Hassid 提炼的 Anthropic 31页 Claude 4.7 官方 prompt 指南：
> 1. **新模型做你让它做的，不是你以为你让它做的** — 4.7 不会揣测意图，要精确指定输出
> 2. **用正面指令，不要用负面指令** — "不要用术语"反而让 4.7 更多用术语
> 3. **用动词开头** — 每条 action verb 让 4.7 输出更具体
> 4. **长度要明确** — 长输入 + "总结" = 4.7 给长总结，明确说要短
> 5. **创意任务加"go beyond the basics"** — Anthropic 官方技巧，推过字面意思

---

## 📋 本文结构

1. [195K views 的实用指南](#195k-views-的实用指南) — 为什么这篇能 viral
2. [核心变化：4.6 揣测 vs 4.7 执行](#核心变化46-揣测-vs-47-执行) — 新模型不再猜你的意图
3. [7 步 Prompt 技巧](#7-步-prompt-技巧) — Anthropic 官方技巧的精华版
4. [绕过 Adaptive Thinking](#绕过-adaptive-thinking) — 让 4.7 始终用最大推理
5. [结论：精确即力量](#结论精确即力量)

---

## 195K views 的实用指南

Ruben Hassid 是 AI newsletter 作者，他的读者不想读 31 页 Anthropic 官方文档，所以他花了一个周末把这篇 31 页文档提炼成一篇短文。195K views，167 likes。

这说明大量用户在用 Claude，但大多数人不知道如何正确 prompt 它。我们之前发的 CLAUDE.md 系列文章（Karpathy 规则、12 条规则、21 条规则、Addy Osmani 的 Harness Engineering）都是从工程师视角讲的。这篇是从消费者视角讲的，互补。

---

## 核心变化：4.6 揣测 vs 4.7 执行

> 💡 **Key Insight**
>
> 新 Claude（4.7）做你让它做的事，不会揣测你是什么意思。你必须精确指定输出、顺序、边界。

最核心的变化：

**旧 Claude（4.6）：**
- 你说"Review this contract"
- Claude 尝试理解你的意思，给你它认为合理的东西

**新 Claude（4.7）：**
- 你说"Review this contract. Flag risks per clause. Rate severity 1-5. Suggest one rewrite per risky clause. Return as a table."
- Claude 严格按字面意思执行

4.6 会揣测意图、会自由发挥。4.7 按字面执行。这意味着**模糊 prompt 在 4.7 下会更准确地让你失望**——它不会自动填补空白，它只是执行你写的东西。

| 维度 | Claude 4.6 | Claude 4.7 |
|------|------------|------------|
| **意图揣测** | 会 | 不会 |
| **输出长度** | 根据任务自判断 | 根据 prompt 决定 |
| **负面指令** | 基本遵守 | 可能反而强化 |
| **Tools 调用** | 频繁 | 更审慎，reason between calls |

---

## 7 步 Prompt 技巧

### Step 1: 用具体范围替换"review"

**旧：**
> Review this contract.

**新：**
> Review this contract. Flag risks per clause. Rate severity 1-5. Suggest one rewrite per risky clause. Return as a table.

**技巧：命名每个输出。命名顺序。命名边界。**

### Step 2: 明确指定长度

4.7 根据它认为的任务大小来调整答案长度。如果你要短结果，明确说。

**旧：**
> Summarize this report.

**新：**
> Summarize this report in exactly 5 bullet points. Each bullet under 15 words. First word of each bullet: an action verb.

**技巧：命名格式，命名上限。**

### Step 3: 用正面指令，不要用负面指令

> 💡 **Key Insight**
>
> 负面指令在 4.7 上会粘在字面句子，不会起作用。"don't be negative" 本身是否定的（有点讽刺）。

**旧：**
> Don't use jargon. Don't use buzzwords. Don't sound like a marketer.

**新：**
> Write in plain English a 16-year-old could read aloud. Use short, concrete words: simple, specific, real. Replace "leverage" with "use." Replace "scalable" with "works at any size."

**技巧：告诉它要怎样，不是不要怎样。**

### Step 4: 用 action verbs 开头

每个 action verb 告诉 4.7 交付具体的东西。4.7 喜欢这样。

**旧：**
> Can you help me with the email?

**新：**
> Go to my Gmail. Find [contact] and read our last conversation. Write the answer email. Final draft. Send-ready. Goal: book a meeting with the CRO of Snowflake by Friday. Length: under 90 words. Tone: confident, casual, specific.

**技巧：用动词开头，告诉它具体的输出标准。**

### Step 5: 工具调用

4.7 比 4.6 调用更少工具，在调用之间 reasoning 更多。

**如果结果质量好，相信新的默认设置。如果要更多工具，明确 prompt：**
> Use web search aggressively. Verify every claim with at least 2 sources.

### Step 6: 新语气

4.6 更温暖、validation-forward、"Great question!" 风格。4.7 更直接、更少 validation、几乎零 emoji。

**如果你要温暖语气：**
> Use a warm, conversational tone. Acknowledge the user's framing before answering.

**更好的方式：** 粘贴 2-3 句你想要语气的句子，告诉 Claude 匹配那个节奏。

### Step 7: 创意任务加"go beyond the basics"

这个短语来自 Anthropic 官方文档。它推动 4.7 在创意或开放性工作上超过字面最低要求。

**旧：**
> Build a landing page for my AI consultancy.

**新：**
> Build a landing page for my AI consultancy. Sections (in this order): Hero... Logo bar... 3 case-study cards... Style: editorial, serif headlines, sans-serif body, generous whitespace. Animations: subtle on scroll. No purple gradients. **Go beyond the basics.** Polish like it's a real client deliverable.

---

## 绕过 Adaptive Thinking

> 💡 **Key Insight**
>
> Claude 有"thinking"模式，在回答前先思考。这让你每次都得到更好的答案。但新的 Claude 默认不 reasoning。他们叫"adaptive thinking"。有个技巧可以确保 Claude 始终用最大推理。

在 prompt 末尾加上：**"Think before answering (maximum reasoning)"**

这确保 4.7 在回答前用完整推理能力，而不是 adaptive thinking 的节省模式。

---

## 结论：精确即力量

Ruben 的指南和我们在工程实践角度讨论的完全一致：**好的 prompt 不是告诉 AI 做什么，是精确描述产出**。

CLAUDE.md 的本质也是这个：不是风格指南，是 pilot's checklist。每一行来自具体的、历史性的失败。

**4.7 时代的 prompt 原则：**
- 命名输出格式
- 命名输出长度
- 用正面指令
- 用 action verbs
- 指定语气
- 给创意任务加"go beyond the basics"

**模糊的 prompt 在 4.7 下比 4.6 更危险。** 4.6 会揣测并倾向于给你合理的东西。4.7 精确执行字面意思——如果你写的东西不是你意思，它不会自动填补空白。

---

## 延伸阅读

**原文**
- Ruben Hassid 的指南（英文）：https://x.com/rubenhassid/status/2053324202321834073

**本系列相关**
- [Karpathy's 4 Rules → 12 Rules](#) (CLAUDE.md 系列)
- [21 条 CLAUDE.md 指令](#) (CLAUDE.md 系列)
- [Harness Engineering：AI Agent 时代真正的工程竞争在 scaffold 层](#) (AI-Native 软件工程系列)

**工具**
- Claude101：Ruben 的免费 Claude 指南汇总 → claude101.com
- Anthropic 官方 31 页 prompt 文档

---

*AI-Native软件工程系列 #59*
*深度阅读时间：约 5 分钟*