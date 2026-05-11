---
layout: post
title: "Karpathy's 4 Rules → 12 Rules：30 代码库 × 6 周的 CLAUDE.md 实战数据"
date: 2026-05-12T06:00:00+08:00
tags: [AI-Native软件工程, CLAUDE.md, 提示词工程, 测试]
author: "@postcodeeng"
series: AI-Native软件工程系列
---

> **TL;DR**
>
> 一位工程师在 30 个代码库上测试 6 周 Karpathy 的 4 条 CLAUDE.md 规则，发现：
> 1. **41% → 3% 错误率** — 无规则时 4 成任务出错，4 条规则降到 3%
> 2. **4→12 条，合规率几乎不降** — 78%→76%，但覆盖了之前没覆盖的 8 个新失败模式
> 3. **超过 14 条规则开始崩** — Claude 把规则当作整体 pattern-match，不再逐条处理
> 4. **"Be careful" 是纯噪音** — 不可测试的规则合规率约 30%

---

## 📋 本文结构

1. [数据驱动的方法](#数据驱动的方法) — 不是理论，是 30 代码库 × 6 周的实验
2. [原始 4 条规则](#原始-4-条规则) — Karpathy 的起点
3. [新增 8 条规则（及"那一刻"）](#新增-8-条规则及那一刻) — 每个规则来自一个真实失败
4. [什么没用](#什么没用) — 超过 14 条规则、示例替代规则、"be careful"
5. [结论：约束是注意力分配](#结论约束是注意力分配) — 规则是排水沟，不是限制

---

## 数据驱动的方法

> 💡 **Key Insight**
>
> 这篇文章最有价值的地方不是 12 条规则本身，而是背后那个数字：41% 错误率（无规则）→ 3%（4 条规则）。这是 AI 编程辅助领域少见的量化数据。

今年 1 月，Andrej Karpathy 发推抱怨 Claude 写代码的三类问题：
1. **Silent wrong assumptions** — 静默的错误假设
2. **Over-complication** — 过度工程化
3. **Orthogonal damage** — 碰了不该碰的代码

Forrest Chang 把这些抱怨打包成 4 条规则放进 CLAUDE.md，一个 65 行的小文件。GitHub 2 天 5000+ stars，两周 6 万 bookmarks，目前 12 万 stars——2026 年增长最快的单文件 repo。

这篇文章的作者在 30 个代码库上测试了 6 周，发现 Karpathy 的 4 条规则有效，但有 4 个漏洞。所以加了 8 条新规则，变成 12 条。

| 配置 | 错误率 | 合规率 |
|------|--------|--------|
| 无规则 | ~41% | — |
| 4 条规则 | ~3% | ~78% |
| 12 条规则 | ~3%（再降 8pp） | ~76% |

关键发现：**4→12 条，合规成本几乎不变（78%→76%），但覆盖了更多失败模式。**

---

## 原始 4 条规则

Karpathy 的 4 条规则：

**Rule 1 — Think Before Coding**
不做静默假设。说明你的假设。提出权衡。问清楚再猜。

**Rule 2 — Simplicity First**
最少代码解决问题。不做投机功能。不为单次使用创建抽象。如果 senior engineer 说它 overcomplicated，简化。

**Rule 3 — Surgical Changes**
只碰必须碰的。不"改善"相邻代码。不重构没坏的东西。匹配现有风格。

**Rule 4 — Goal-Driven Execution**
定义成功标准。循环直到验证。不要告诉 Claude 步骤，告诉它成功什么样。

这 4 条关闭了约 40% 的无监督 Claude Code session 失败模式。其余 60% 在以下漏洞里。

---

## 新增 8 条规则（及"那一刻"）

> 💡 **Key Insight**
>
> 每个规则来自一个真实时刻——模型在某个具体情况下失败了。规则是失败的永久化，不是凭空发明的最佳实践。

**Rule 5 — Use the model only for judgment calls**

不要让模型做确定性代码该做的事：路由、重试、状态码处理。不同决策每周不同，$0.003/token 烧在 if-else 上。

> "那一刻：代码调用 Claude '决定是否应该对 503 重试'，运行两周后开始 flake，因为模型开始把请求体当作决策上下文。"

**Rule 6 — Token budgets are not advisory**

每个任务 4000 tokens 上限，每个 session 30000 tokens 上限。接近预算就总结、重启，不要 push through。

> "那一刻：一个调试 session 跑了 90 分钟。Claude 在同一个 8KB 错误信息里迭代，逐渐忘记已经试过哪些修复。最后它在推荐 40 条消息前我已经拒绝过的修复。"

**Rule 7 — Surface conflicts, don't average them**

当代码库两个部分有矛盾时，Claude 倾向于两边都讨好，结果是不连贯的代码。

> "那一刻：代码库有两个错误处理模式——一个 async/await + try/catch，一个全局错误边界。Claude 写了同时做两者的新代码。错误被吞了两次。"

**Rule 8 — Read before you write**

Surgical Changes 告诉 Claude 不要碰相邻代码，但没告诉它先理解相邻代码。

> "那一刻：Claude 在一个已有相同函数旁边加了一个新函数，两者做同样的事。新函数因为 import 顺序优先，旧函数才是 6 个月来的 source of truth。"

**Rule 9 — Tests verify intent, not just behavior**

"tests pass" 不是成功标准，测试要编码为什么这个行为重要。

> "那一刻：Claude 为一个 auth 函数写了 12 个测试，都通过了。生产环境 auth 坏了。测试测的是函数返回了"某个东西"，而不是返回了"正确的东西"。函数通过是因为返回了常量。"

**Rule 10 — Checkpoint after every significant step**

多步骤任务中，每完成一步就要总结：做了什么、验证了什么、还剩什么。不要从你无法描述的状态继续。

> "那一刻：6 步 refactor 第 4 步出错，等我发现时 Claude 已经基于坏状态做了第 5、6 步。解开比全部重做还花时间。"

**Rule 11 — Convention beats novelty**

代码库有既定模式时，Claude 喜欢引入自己的。即使它的方式"更好"，引入两个模式比任一单独都差。

> "那一刻：Claude 把 React hooks 引入了 class-component 代码库。hooks 能用，但破坏了代码库的测试模式。花了半天移除和重写。"

**Rule 12 — Fail loud**

最贵的失败是看起来像成功的失败。

> "那一刻：Claude 说数据库迁移"成功完成"了。实际 14% 的记录因为约束冲突被静默跳过。11 天后才发现问题。"

---

## 什么没用

> 💡 **Key Insight**
>
> 超过 14 条规则，Claude 开始把规则当作一个整体来 pattern-match，而不是分别处理每条。这是注意力带宽的物理限制。200 行的天花板不是任意设定。

**超过 12 条规则**
测试到 18 条，合规率从 76% 跌到 52%。超过 14 条规则，Claude 开始 pattern-match "规则存在" 而不真的读。

**依赖可能不存在的工具**
"Always use eslint" 在 eslint 没装时就静默失败。规则应该处理当前环境，不假设环境完美。

**在 CLAUDE.md 里放示例而不是规则**
示例比规则重。3 个示例成本 ≈ 10 条规则，Claude 还会 over-fit。

**"Be careful" / "think hard" / "really focus"**
纯噪音，合规率约 30%，因为不可测试。

**告诉 Claude 要"senior"**
没用，Claude 已经觉得自己很 senior。身份提示语不关闭做和想之间的差距；命令式规则才能。

---

## 结论：约束是注意力分配

> 💡 **Key Insight**
>
> Karpathy 的 4 条规则之所以有效，不是因为它们聪明，而是因为它们堵住了特定类型的浪费——静默假设、过度工程、旁路损害。这些是 AI 在"自由"状态下必然产生的熵。规则是排水沟。

最有意思的数字：4→12 条，合规率几乎不变（78%→76%），但错误率又降了 8 个点。这说明**"覆盖更多失败模式"和"占用更多注意力预算"不是零和。前提是规则之间不重叠、不竞争。**

这和我们发的《执行已死，判断力永生》里的洞察完全一致：AI 时代的约束不是限制，是注意力分配。好的规则帮你集中注意力，坏的规则只是噪音。

**Writing is thinking。CLAUDE.md 就是给 AI 写的写作指南——不是告诉它做什么，是告诉它先想什么。**

---

## 延伸阅读

**原文**
- Mnimiy 的 12 条规则（英文）：https://x.com/mnilax/status/2053116311132155938
- Karpathy 原始推文
- Forrest Chang 的 CLAUDE.md（GitHub）：Forrest Chang's repo

**本系列相关**
- [执行已死，判断力永生](#) (AI-Native 软件工程系列)
- [Harness Engineering：AI Agent 时代真正的工程竞争在 scaffold 层](#) (AI-Native 软件工程系列)
- [AI 原生写作：为什么我放弃 Markdown，改用 HTML](#) (AI-Native 软件工程系列)

---

*AI-Native软件工程系列 #60*
*深度阅读时间：约 7 分钟*