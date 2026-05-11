---
layout: post
title: "Skillify：如何让 AI Agent 不再犯同样的错误"
date: 2026-05-12T08:00:00+08:00
tags: [AI-Native软件工程, AI Agent, Skillify, GBrain, 测试工程]
author: "@postcodeeng"
series: AI-Native软件工程系列
---

> **TL;DR**
>
> Garry Tan 发布的"Skillify 方法论"完整版，核心是将每一次 AI 失败转化为永久的结构性修复：
> 1. **失败即基础设施** — 不是让它再也不会发生，而是让它结构性地不可能再发生
> 2. **Latent vs Deterministic** — 需要判断的工作用 AI，需要精确的工作用脚本，二者不可混用
> 3. **Skillify 作为动词** — 一个词就把临时调试变成永久基础设施
> 4. **10 步检查清单** — 每个技能都需要通过全部 10 步才算真正完成

---

## 📋 本文结构

1. [LangChain 的教训：工具不等于实践](#langchain-的教训工具不等于实践) — 价值 1.6 亿美元的认知差距
2. [两个失败，同一个形状](#两个失败同一个形状) — Agent 选择了聪明而不是纪律
3. [10 步 Skillify 检查清单](#10-步-skillify-检查清单) — 完整的技能建设流程
4. [Skillify 作为动词](#skillify-作为动词) — 一个词把临时调试变成永久基础设施
5. [第 3-5 步：测试的三层防线](#第-3-5-步测试的三层防线) — 单元测试、集成测试、LLM 评估
6. [第 6-8 步：路由的质量保证](#第-6-8-步路由的质量保证) — 解析器触发、评估和 DRY 审计
7. [结论：让失败成为永久改进](#结论让失败成为永久改进)

---

## LangChain 的教训：工具不等于实践

> 💡 **Key Insight**
>
> LangChain 给你健身房会员卡，但没有锻炼计划。测试工具不等于测试实践。框架给你仪表盘和单元测试助手，然后说"祝你好运"。

Garry Tan 上来就点名了 LangChain：他们融了 1.6 亿美元，三年开发，LangSmith 测试平台确实做得精致——轨迹评估、数据集流水线、LLM-as-judge、回归测试、工具单元测试框架。该有的都有。

但 pieces aren't a practice。

**LangChain 从未告诉你：测什么、按什么顺序、什么时候算完成。** 没有一个有观点的工作流说：先这个失败，然后写技能，然后写确定性代码，然后写单元测试，然后写 LLM 评估，然后加解析器触发，然后评估解析器，然后审计重复，然后冒烟测试，然后正确归档。

这个循环不存在。你得从散落的原始工具里自己发明它。

大多数 AI Agent 用户根本不测试他们的 agents，因为选择的框架给了健身房会员卡，没有给锻炼计划。大多数 AI Agent"可靠性"是基于感觉的：调 prompt、改 system message、"请不要产生幻觉"的咒语。那些东西在对话变复杂的一瞬间就会失效。

| 维度 | LangChain 给你的 | 你需要的 |
|------|-----------------|---------|
| **测试工具** | ✅ 有 | ✅ 有 |
| **工作流** | ❌ 没有 | ✅ 有（10步检查清单） |
| **验收标准** | ❌ 没有 | ✅ 有（通过全部10步） |
| **永久性** | ❌ 临时修复 | ✅ 结构性地不可能重复 |

---

## 两个失败，同一个形状

Garry 举了两个他自己的 agent 本周犯的错误：

**失败 1：已经在数据库里的旅行记录**

Garry 问 OpenClaw 一次快十年前的商务旅行，埋在日历历史里。简单问题，应该一秒找到。结果 agent 做了：
1. 调用 live calendar API → 被阻止（太久之前）
2. 试邮件搜索 → 噪音太多，无果
3. 又用不同参数试 calendar API → 仍然被阻止
4. 五分钟后，搜本地知识库 → 立刻找到了

答案一直在自己的数据里。3,146 个日历文件（2013-2026），已经索引，已经本地化，一个 grep 的事。Agent 就是没有先查那里。

**失败 2："28 分钟"**

同一天。Agent 说："你下次会议在 28 分钟后。"现实：88 分钟。Agent 在脑子里做了 UTC→PT 时区转换，差了一小时。实际上一个脚本（context-now.mjs）已经存在，输出精确的分钟数。Agent 就是没跑它。

**两个失败，同一个形状：Agent 有正确的工具，但选择了聪明而不是纪律。**

在 thin harness / fat skills 架构里，有一个关键区分：需要判断的工作 vs 需要精确的工作。Garry 称之为 latent 和 deterministic。

- **Deterministic（确定性）**：相同输入，相同输出，不需要模型。日历 grep 是确定性的。
- **Latent（潜在/判断性）**：需要推理的工作。Agent 用 latent 空间做了确定性工作——调 API、做推理、解释结果——而一个三行脚本就能瞬间返回答案。这就是 bug。不是答案错了，是做事的"位置"错了。

**解决方案的逻辑：** latent 空间构建确定性工具，然后确定性工具约束 latent 空间。模型的智能创建了防止模型犯错的约束。老的失败路径结构性地变得不可能。

---

## 10 步 Skillify 检查清单

> 💡 **Key Insight**
>
> 一个功能如果不通过全部 10 步，它就不是一个技能。它只是今天恰好能工作的代码。

每次一个失败被"晋升"时，Garry 使用这个 10 步检查清单：

```
□ 1. SKILL.md — the contract (name, triggers, rules)
□ 2. Deterministic code — scripts/*.mjs (no LLM for what code can do)
□ 3. Unit tests — vitest
□ 4. Integration tests — live endpoints
□ 5. LLM evals — quality + correctness
□ 6. Resolver trigger — entry in AGENTS.md
□ 7. Resolver eval — verify the trigger actually routes
□ 8. Check resolvable + DRY audit
□ 9. E2E smoke test
□ 10. Brain filing rules
```

关键创新在于：**Agent 自己写确定性脚本。** 技能文件（markdown，活在 latent 空间）告诉 agent 如何修复问题。Agent 读技能、理解问题、生成脚本来处理它。然后技能强制 agent 运行那个脚本，而不是在脑子里推理。

---

## Skillify 作为动词

> 💡 **Key Insight**
>
> "Skillify"从一个失败响应协议变成了我构建一切的方式。不是写规格文档。不是提工单。就是在对话里和 agent 聊，一起解决问题，然后说"skillify it"，原型就成了永久基础设施。

Garry 描述了他的实际工作流：

> Garry: "hot damn it worked. can you remember this as a webhook skill and skillify it, next time we need to do some webhooks? why was this so hard to get right? anyway it's good now. DRY it up too"

就这一句。一小时后 OAuth webhook 集成调通了。然后"skillify it"把那个临时调试 session 变成了一个持久的技能，有测试、有解析器入口、有文档。下次再需要 webhook，技能已经存在。Agent 读它。一个小时的硬知识变成了永久知识。

另一个例子。他注意到 agent 总是在发 ngrok 链接之前不检查它们是否真的能用：

> Garry: "can we make a skill that says whenever you send me a link you have to curl it yourself to make sure the endpoint is open and the tunnel works? skillify it!"

或者日历重复预订差点让他错过会议：

> Garry: "Here is one regular skill I need you to write. It's the calendar check skill. Tomorrow I have a double booked 11am. Make a skill, make it deterministic to check these kinds of things."

**一句话。代码、技能、测试、解析器入口、可解析性审计。一个呼吸内完成全部 10 步。**

这就是整个模式的精妙之处：prototype in conversation, see it work, say "skillify", and the prototype becomes permanent infrastructure。

---

## 第 3-5 步：测试的三层防线

**第三步：单元测试**

经典 vitest。确定性函数，确定性断言。比如 calendar-recall.mjs 导出 parseEventLine、eventMatchesKeyword、searchKeyword、formatJson 这些纯函数，每个都对着 fixture 数据测试。

这类 bug 是单元测试要抓的：parseEventLine 悄悄丢掉位置字段里有 Unicode 字符的事件。dateFromPath 对闰年日期返回 null。formatJson 在只有一个人时省略 attendees 数组。小、无聊、关键。

**第四步：集成测试**

这些测 live endpoints 和真实数据。calendar-recall.mjs 真的能在真实 brain repo 里找到事件吗？context-now.mjs 在日历缓存过期或缺失时能生成有效 JSON 吗？

真实数据有格式错误的 event lines、缺失的时区字段、Windows 行尾、跨越午夜的 events。规则：如果你发现自己手动检查脚本是否对真实数据做了正确的事，那个检查就应该是一个集成测试。

**第五步：LLM 评估**

这是有意思的部分。有些输出需要判断来评估。"这个日历摘要有用吗？"不是脚本能回答的是/否问题。所以用 LLM-as-judge——用一个模型评估另一个模型的输出。

对于 context-now，有 35 个评估每天跑。其中一个给 agent 喂这样的消息："我的航班大约 45 分钟后起飞，我能赶到 SFO 吗？"然后检查 agent 是在回答前跑了 context-now.mjs，还是试图在脑子里算。

正确的行为是跑脚本并引用结果。错误的行为是自己做心算。评估同时抓错答案和错误过程——因为即使这次心算碰巧对了，下次也会错。

**最诚实的评估启发式：在对话历史里搜"我操"或"啥情况"。那些就是你在缺失的测试用例。**

---

## 第 6-8 步：路由的质量保证

**第六步：解析器触发**

解析器是上下文的路由表：当 X 类型任务出现时，加载技能 Y。每个技能需要在 AGENTS.md（那个告诉 agent 存在哪些技能以及何时使用的文件）里有一个触发器入口。

这一步抓的 bug：你写了一个新技能但忘记加到解析器里。技能存在。能力存在。系统触达不了它。就像医院有外科医生但在目录里没列出。比没有技能还糟——你以为系统能处理它。

**第七步：解析器评估**

这是大多数人会完全错过的一层。解析器触发说"这个短语应该路由到这个技能"。解析器评估测试它实际上是否做到了。

两种失败模式：
- **假阴性**：技能应该触发但没有，因为触发描述错误或缺失
- **假阳性**：错误的技能触发了，因为两个触发器重叠

"我明天日历上有什么"应该路由到 calendar-check，不是 calendar-recall，也不是 google-calendar。三个技能，三个不同时间域，同一个可能匹配任何一个的短语。解析器评估在用户遇到之前抓住歧义。

**第八步：可解析性 + DRY 审计**

一个月后，Garry 有了 40+ 技能。有些是响应特定事件创建的，有些是跑 crons 的 sub-agents 创建的。没人维护解析器表。技能被创建但没被注册。

所以他建了 check-resolvable。一个 meta-test，walk 整个链：AGENTS.md 解析器 → SKILL.md → script/cron。如果一个脚本做了有用的事但没有从解析器的路径，它触达不了。LLM 永远不会知道用它。

第一次运行发现 40 个技能里有 6 个不可触达。15% 的系统能力是"暗"的：
- 一个航班追踪器，没人能通过问航班来调用它
- 一个内容创意生成器，只在 cron 上跑，不能手动触发
- 一个引用修复器，存在于 skills 目录但根本没在解析器里列出

DRY 审计并行跑。你不小心会有 15 个技能做差不多的事，解析器掷骰子决定用哪个。

---

## 结论：让失败成为永久改进

> 💡 **Key Insight**
>
> 在健康的软件工程团队里，每个 bug 都有一个测试。这个测试永远存在。Bug 变得结构性地不可能再发生。AI agents 应该以同样的方式工作。

Garry 的核心观点：

**Every failure becomes a skill. Every skill has evals. Every eval runs daily.**

Agent 的判断力永久改进，不只是当前 session，不只是上下文窗口还 hold 的时候。旅行失败不会再发生。时区失败不会再发生。而当前一个失败出现时（它会出现，因为这是和熵与品味对抗的对弈游戏），它也会被 skillified。

和你一起工作一年后的 agent，会被它在过去一年里犯的每个错误塑造。这不是"有就很好"。这是整个论点。

> "Boil the ocean. Make your agent do something, then skillify it. You do that every day and you have a god damn smart OpenClaw that does everything you want it to do."

---

## 延伸阅读

**原文**
- Garry Tan 的 skillify manifesto（英文）：https://x.com/garrytan/status/2046876981711769720

**核心项目**
- GBrain（知识引擎）：https://github.com/garrytan/gbrain
- GStack（编码技能框架）：https://github.com/garrytan/gstack

**本系列相关**
- [执行已死，判断力永生](#) (本文)
- [AI 原生写作：为什么我放弃 Markdown，改用 HTML](#) (AI-Native 软件工程系列)

---

*AI-Native软件工程系列 #56*
*深度阅读时间：约 10 分钟*