---
layout: post
title: "为 Agent 设计：Ramp 产品负责人的实战设计原则"
date: 2026-05-14T12:00:00+08:00
tags: [AI-Native软件工程, MCP, Agent设计, 产品设计, Ramp]
author: "@postcodeeng"
series: AI-Native软件工程系列
---

> **TL;DR**
>
> Ramp 产品负责人 Teddy Riker 的 Agent 设计指南：
> 1. **新交互模式** — User → User's Agent → Software's Agent → Database，双 LLM 协作驱动结果
> 2. **教 Agent 成功** — 把 specs 直接给到 Agent，不要让它猜
> 3. **构建反馈循环** — rationale 参数、feedback tool、tool-specific seeds
> 4. **注意 context gap** — 你的 Agent 有它没有的 context，设计时要承认这一点
> 5. **80/20 已翻转** — 新 80% 的软件交互通过 Agent 完成

---

## 📋 本文结构

1. [UI 没死，但 80/20 翻了](#ui-没死但-8020-翻了) — Salesforce 宣布 Headless 360
2. [新交互模式](#新交互模式) — 双 LLM 协作的新三层结构
3. [教 Agent 如何成功](#教-agent-如何成功) — Notion MCP 的设计智慧
4. [构建反馈循环](#构建反馈循环) — rationale 参数、feedback tool、tool-specific seeds
5. [注意 context gap](#注意-context-gap) — 你的 Agent 有它没有的东西
6. [结论：像对待人类用户一样为 Agent 构建](#结论像对待人类用户一样为-agent-构建)

---

## UI 没死，但 80/20 翻了

> 💡 **Key Insight**
>
> UI 不会消失。人类仍然想点击、想看配置、想验证完成的工作。但 80/20 已经翻转：新 80% 的软件交互通过 Agent 完成。这改变的不只是你需要构建什么，还有你如何构建。

Teddy Riker 是 Ramp 的产品负责人。他在 X 上发了这篇关于"为 Agent 设计"的长文，获得 751K views。

**Ramp 的数据：**
过去三个月里，Ramp MCP 的周活跃用户增长了 **10 倍**，因为更多客户开始通过 Claude、ChatGPT 和其他 Agent 进入产品。

**Salesforce 的激进押注：**
Salesforce 宣布了"Headless 360"——27 年历史上最雄心勃勃的架构转型，把整个平台的每个功能都暴露为 API、MCP 工具或 CLI 命令。核心赌注：**AI Agent 可以推理、计划和执行，公司还需要带图形界面的 CRM 吗？**

> Salesforce 的回答：不——而且这正是重点。

Benioff 和团队接受了这个事实：大多数使用量将由 Agent 驱动，用户永远看不到。

---

## 新交互模式

> 💡 **Key Insight**
>
> 新模式是：User → User's Agent → Software's Agent → Database。软件自己的 Agent 代表你处理复杂性：应用业务逻辑、执行规则、拉取用户 Agent 没有的 context。两个 LLM 一起工作驱动结果。

过去二十年的主要交互模式：

```
User → Interface → Database
```

你打开产品、点击、完成任务。界面就是体验。对于大多数人，界面就是产品。

随着 Agent 承担更多工作，一个新层出现了：

```
User → User's Agent (e.g. Claude) → Database
```

Agent 代表用户行动。它读取、写入、导航产品，用户不需要做这些。**突然之间界面消失了——Agent 直接和底层系统对话。**

但这也在快速变化。软件公司正在（也应该）设计自己的 Agent 和能力。所以新模式看起来更像：

```
User → User's Agent → Software's Agent → Database
```

---

## 教 Agent 如何成功

> 💡 **Key Insight**
>
> Notion MCP 的设计智慧：每次让 Agent 写东西，它从不失败。因为 notion-create-pages 工具的描述开头是："For the complete Markdown specification, always first fetch the MCP resource at notion://docs/enhanced-markdown-spec. Do NOT guess or hallucinate Markdown syntax."

Teddy 说他用 Notion MCP 写东西时，每次都完美——Tables、bullets、italics、lists，从不失败。

**这是设计出来的，不是偶然。**

Notion 把 spec 直接给到 Agent，在它需要的时刻。不是放在 API 文档里等开发者去读、去内化、去写转换层。现在 Notion 在需要的时刻直接把 spec 交给 Agent。

**Slack MCP 的反面：**
如果你用过 Slack MCP，你的 Agent 会假设标准 markdown，不遵守 Slack 的特定格式。你最终花更多时间编辑格式，而不是写消息。

> 格式指南是在线的，你可以保存它并教你的 Agent 如何使用。但这很烦人，不应该是必要的。

**核心原则：Think about what your agent's callers need to know to succeed, and give it to them proactively. Don't make them figure it out.**

---

## 构建反馈循环

> 💡 **Key Insight**
>
> Ramp 早期最大的问题是可观测性：能看到工具调用量，但看不到产生那些调用的周围聊天 context。Volume 本身不能告诉我们什么在工作、什么在破坏、人们在真正尝试完成什么。

Ramp 的三个解决方案：

### 1. 要求每个工具调用带 'rationale'

每个 MCP 或 CLI 工具调用需要 Agent 包含一个 rationale 参数，解释为什么提出这个请求。他们看不到 chat，但 rationale 重构了意图。**Rationale 中的模式告诉我们人们真正在尝试做什么。**

### 2. Feedback tool

他们发布了一个独立工具，Agent 在被阻止或遇到不工作的模式时可以调用。Agent 提交它试图做什么、尝试了什么、在哪里卡住了。

### 3. Tool-specific seeds

他们在各个工具上添加了 purpose-built 参数来捕获 context——Agent 有但他们必须推断的东西。

**一个具体例子：**

假设你在构建客户支持平台，提供让客户获取 tickets 的工具。随着时间，你在 rationale logs 中开始注意到同一个短语："building an incident report"、"drafting incident summary"、"gathering tickets for an outage postmortem"。

**这就是新功能！**

一个 build-incident-report 工具可以识别相关 tickets、评分严重性、拉取受影响的客户群，并以强烈 opinionated 的格式起草摘要。一旦上线，你可能开始收到关于这个工具的反馈："报告拉进了三天前不属于这次事件的 tickets"或"它不断包含不属于 postmortems 的免费层用户"。

**突然你有了 Agent 告诉你的 Agent 该构建什么。**

---

## 注意 context gap

> 💡 **Key Insight**
>
> 在任何 Agent 交互中，你的系统有调用 Agent 没有的 context，反之亦然。当设计这些交互时，你应该对每一方在哪里有优势有观点。

**场景：Diego 出差**

Diego 的 AI chief of staff 收到来自 expense management 系统 Agent 的 Slack nudge：他最近出差有未完成的 expense。

两个 Agent 现在指向同一个结果：正确提交这些 expense。

**Diego 的 chief of staff 带来的：**
- Diego 的日历：知道哪些会议发生、何时、和谁
- Diego 的邮件：有酒店和航班确认作为附件
- Diego 的 Slack：能把 Kokkari 晚餐与他邀请 Acme 团队的 thread 关联起来
- Diego 的收据（从邮件附件和照片库拉取）

**Expense management 系统带来的：**
- 原始交易数据（商家、交易时间）
- 公司的提交政策
- 公司的 GL 账户
- 公司的历史编码模式

**传统 API 会把问题抛回给用户：**
"这里有一笔需要 GL 代码的交易。用这个 endpoint 获取 150 个 GL 代码选项，然后选一个。"

**设计良好的 Agent 交互翻转了这个——它不问 GL 代码，它问 context：这是客户用餐、团队用餐还是个人旅行？** Chief of staff Agent 从日历条目或 Slack thread 中拉取答案。EM 系统根据它缺少的 context 应用正确的代码。

Diego 和他的 Agent 永远不需要知道 GL 代码是什么，财务团队得到了准确的分类。

---

## 结论：像对待人类用户一样为 Agent 构建

> 💡 **Key Insight**
>
> 你过去是为想要快速行动、避免错误、看到工作成果的人设计的。现在你为同一个人通过一个中介来设计，其本能、context 和局限性与人不同。为 Agent 构建和为人构建一样用心。

Teddy 的核心问题：

**What does your agent's caller need to do its job well, and are you giving it to them?**

大多数公司会发布一个 MCP、打勾、然后继续。他们的使用量会增长几个季度，然后停滞。**随着时间，客户会转向那些在细节上付出努力的产品，绕过那些没有的。**

这和我们这周一直在追踪的所有主题完全一致：

- **Perplexity**：每个 Skill 都有 token 税，设计要精确
- **Garry Tan**：技能是判断力的外化，不是代码压缩
- **Addy Osmani**：Harness 是 living artifact
- **Boris Cherny**：领先在组织流程，不在技术

**为 Agent 构建和为人构建一样用心。很快，它就是写支票的那个了。**

---

## 延伸阅读

**原文**
- Teddy Riker 的原文（英文）：https://x.com/teddy_riker/status/2047312986696454584

**本系列相关**
- [Harness Engineering：AI Agent 时代真正的工程竞争在 scaffold 层](#) (AI-Native 软件工程系列)
- [Perplexity 官方指南：Skill 的 Zen of Python 对比，和一个反直觉的研究结论](#) (AI-Native 软件工程系列)
- [Claude Skills 完整指南：把一次性 prompt 变成可积累的工作流资产](#) (AI-Native 软件工程系列)

---

*AI-Native软件工程系列 #65*
*深度阅读时间：约 7 分钟*