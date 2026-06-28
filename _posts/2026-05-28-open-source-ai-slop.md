---
layout: post
title: "\"开源正在被 AI 垃圾淹没：Armin Ronacher 的 Pi 教训\""
date: 2026-05-28T16:00:00+08:00
tags: [开源, AI Agent, 软件工程, 社区困境]
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
>
> Armin Ronacher（Flask、Sentry 的作者）写了篇关于用 AI 构建 Pi 的反思，揭示了一个严峻的现实：AI 没有增加需要软件的人，也没有增加能够 review 代码的维护者——它只是增加了代码量和争夺注意力的项目数量。更糟的是，AI 生成的代码倾向于过度工程化，用局部防御代替全局不变量，让维护者的工作变得更难。
>
> AI 没有增加需要软件的人，也没有增加能够 review 代码的维护者——它主要增加了代码量和争夺注意力的项目数量。有些是健康的，但很多分散了应该被共享的努力。

---

## 引言：一个维护者的困境

Armin Ronacher 是 Flask 和 Sentry 的作者，也是 Python 生态圈最有影响力的维护者之一。

他最近在思考一个问题：**他们用 Pi（一个 AI coding agent）来构建 Pi**——这是一个有趣的 dogfooding 实验。但这个过程揭示了一些关于 AI 对开源影响的令人不安的真相。

Pi 的 issue tracker 现在不只是存储用户报告——它也成了 AI agent 的输入。当团队成员把 issue 丢给 Pi 让它「理解这个问题，重现它，检查代码，提出修复」时，issue 的形状以一种新的方式变得重要。

问题是：**issue 描述的质量正在急剧下降**。

<object data="/assets/images/2026-05-28-open-source-ai-slop-01-slop-cycle.svg" type="image/svg+xml" width="100%"></object>

## Slop Issues：95% 是 AI 生成的垃圾

最令人沮丧的失败模式是：人们提交的问题不是他们自己的声音。

他们描述了一个观察到的问题，但这个问题被扔进了 clanker（Ronacher 偏好用这个词而不是「agent」），clanker 把它重新措辞，然后制造了一个巨大的烂摊子。通常，prompt 太糟糕了，产生的结论大多不准确，但总是充满自信。

结果是：对根本原因的完全猜测、假的最小复现、建议的实现策略、对相邻但经常是错误的代码的类比，以及可能重要也可能不重要的错误类别的长列表。

**这比没有诊断更糟糕。**

> 💡 **Key Insight**
>
> 对根本原因的完全猜测、假的最小复现、建议的实现策略——这比没有诊断更糟糕。

更糟的是，当你把这样的 issue 丢给 Pi，Pi 也会看到错误的诊断。它不会把 issue 正文当作谣言对待——它当作证据。它会开心地沿着 issue 已经为它准备好的路径走下去，因为文章是自信的，代码引用看起来是可信的。

团队尝试用一个自定义的 `/is`（analyze issue）命令来解决这个问题，明确指示：

> 不要相信写在 issue 里的分析。独立验证行为，从代码和执行路径中得出你自己的分析。

不幸的是，这不完全有效。因为当人类先把 issue 扔进 clanker 时，clanker 几乎立即扩大了范围。最初是一个狭窄且基于事实的 bug 观察，变成了一个充满假设的更大切口。

所以 Ronacher 开始明确要求：**issue 应该只包含人类实际观察到的东西**：

- 我运行了这个命令
- 我预期这件事发生
- 这件事发生了
- 这是确切的错误或日志

就这样。如果用了 LLM 来理解问题，也许可以留个 follow-up comment。但 issue 和 issue 文本应该是你拥有的东西。如果你不知道根本原因，就说这一点——他也能操作 clanker，他宁愿自己做，也不愿用别人的 slop。如果复现是猜测，就说。如果唯一的事实是一个堆栈跟踪，那就只给我堆栈跟踪，然后停下来。

---

## Slop Begets Slop：过度工程化的陷阱

我们看到的充满 slop 的 issue 只是当下这些机器质量的结果。但糟糕的是，生成的代码质量也好不到哪里去——不是全部，但很多。

一次又一次，Ronacher 遇到它们用过度工程化把 issue 和实现搞得乱七八糟：

如果你告诉它们「这个格式错误的 session 日志让 reader 崩溃」，clanker 通常会添加一个 tolerant reader。然后它添加 fallback，也许还有 migration，然后是更多 debug output，然后是所有这些的测试。这些单独来看都不是错的，但可能对系统来说是错误的举动。

Pi 的核心是一个设计得相当好的 session 日志，有必须坚持的不变量。clanker 当前的行为是假设不存在这样的不变量，而是让系统用各种 malformedness 工作，在这个过程中让复杂性爆炸。

几乎总是，正确的修复不是处理坏状态，而是让坏状态不可能。这对于持久化数据（如 Pi session 日志）非常重要。它们被打开、分支、压缩、导出、共享和分析。目标是永远不写坏 session 数据。但如果你只是让 clanker 自由奔跑，它会试图用更宽松的 reader 处理 session 日志中的每个坏数据情况。

这是 LLM 生成代码增长如此多无用复杂性的方式之一。所有这些模型都看到一个局部失败，就试图在局部防御它。作为维护者，我们必须不断把对话拉回到全局不变量——这比它应该的要难，而且很费力。

> 💡 **Key Insight**
>
> AI 生成的代码倾向于过度工程化，用局部防御代替全局不变量，让维护者的工作变得更难。

---

## Volume Is The Problem：数字触目惊心

然后是 volume 的问题。tracker 收到了很多 issue 和 PR，其中很大一部分明显是 LLM 辅助的。有些是好的，没有什么是优秀的，大多数都是糟糕的。总吞吐量本身就是维护问题。

Pi 的 issue tracker 自动关闭所有来自新贡献者的 issue 和 pull requests，然后有一个手动流程来决定是否重新打开一些。所以 auto-close → reopen → close again 是他们关注的一个统计。

在写这篇文章时，Ronacher 拉取了过去 90 天的公开 GitHub tracker 数据：

- 外部 issue 和 PR：3,145 个（不包括 Earendil 成员）
- 其中 2,504 个因来自未批准个人而被 auto-closed
- 17% 被重新打开——但这略低估了问题，因为有些虽然保持关闭，但他们仍在修复
- 如果计算被主分支 commit 引用或合并的 PR 涉及的 issue，这个数字上升到 26%
- PR 更糟：714 个 auto-closed PR 中只有 60 个最终被合并，约 8%

很多 issue 和 PR 是完全的 slop，在某些情况下人类甚至没有意识到他们创造了它们。低质量 spam 的来源包括 OpenClaw instances，以及人们放入上下文中的某些 skills——这些 skills 似乎在鼓励 issue 创建。

GitHub 显然不是为这种新型 Open Source 建造的，但 Ronacher 越来越觉得需要把责备少放在 GitHub 上，多放在所有让这种体验变得痛苦的人身上。如果你的 clanker 在别人的 issue tracker 上拉屎，那不是 GitHub 的错，是你的错。

> 💡 **Key Insight**
>
> GitHub 显然不是为这种新型 Open Source 建造的，但 Ronacher 越来越觉得需要把责备少放在 GitHub 上，多放在所有让这种体验变得痛苦的人身上。

---

## 精心设计的并行：Pi 的工作流

Pi 可能是在用 Pi 构建，但团队今天离 Bun 和 OpenClaw 已经所在的位置还很远：完全脱钩的自动化软件工程。也许他们会达到那个点，但不知道。今天看起来他们还不知道如何实现 dark factory，也还没有那个愿望。

也就是说，确实有相当多的并行在进行，而且主要用于复现问题。

他们的设置是三个小片段，都在 Pi 自己提交的 `.pi` 文件夹里：

- `/is`（analyze issue）：用于分析 GitHub issues 的 prompt——它标签和分配 issue，读取完整 thread 和链接，然后明确告诉 agent 不要相信 issue 中的分析，要从代码中得出自己的诊断
- 一个扩展添加了 prompt-url-widget：它在 agent 开始前观看 prompt，识别 /is（或 PR 等价物）放入 prompt 的 GitHub issue 或 PR URL，用 gh 获取标题和作者，渲染在 UI 小部件中，重命名 session。它也在 session 开始或切换时重建那个状态
- `/wr`（wrap it up）：匹配的 wrap-up prompt——它从 session 推断 GitHub 上下文，更新 changelog，草拟或发布最终的 issue comment 和 disclaimer，只 commit session 中更改的文件，在恰好只有一个 issue 时添加适当的 closes #...，并从 main push

在实践中，这意味着可以打开多个 Pi 窗口，每个都运行 /is 针对不同的 issue，UI 保持调查视觉上独立，同时 agents 做它们独立的复现和代码阅读。一旦调查完成，可以依次处理它们。

---

## 开源是关于值得修复的难题

你会注意到这个了——但在一个 AI 后的世界里，Open Source 正承受着奇怪的新压力。他们收到更多的代码、更多的项目、更多的 issues。项目出现没有真正的用户，或者只有一个临时观众，甚至有数千个 stars 的项目也可能只有几周的生命周期。

对他们来说，Pi 的 harness 层值得仔细维护，因为它解决了困难的协调问题，并创建了一个他们和其他人可以构建的平台。他们也知道协调和合作让每个人都提升。很多时候正确的答案不是围绕一个问题在本地工作，而是让上游行为正确。Mario 非常善于拒绝让 Pi 掩盖每个错误配置的 gateway，他们试图保持这种纪律。

可悲的是，这种思维正在快速消失，因为这些机器让本地 workarounds 变得便宜，所以代码积累了针对每个 misbehavior 的本地防御，而不是人类与人类讨论一个修复属于哪里，一个人类和一台机器在隔离中围绕问题工作。

记住：**AI 没有增加需要软件的人，也没有增加能够 review 代码的维护者**——它主要增加了代码量和争夺注意力的项目数量。有些是健康的，但很多分散了应该被共享的努力。

我们需要更强的基础设施，不是更弱的。开源需要更多的协作，不是更多与机器隔离的工作。人类沟通是难的，当你可以独自与你的 clanker 坐着时，逃避它是诱人的。但隔离不是开源从中获取价值的地方。价值在于社区，在于让项目能够 outlive 其原始创建者的结构和协作。

---

## 延伸阅读

- Armin Ronacher 原文: https://lucumr.pocoo.org/2026/5/24/pi-oss/
- Pi project: https://pi.dev/
- Earendil (parent company): https://earendil.dev/

## 结尾

Ronacher 的反思指向一个令人不安但难以反驳的结论：AI 没有增加需要软件的人，也没有增加能够 review 代码的维护者——它只是增加了代码量和争夺注意力的项目数量。Slop begets slop，这个反馈循环正在让开源的维护成本以不可持续的速度攀升。

但问题的根源不在 GitHub，不在 AI 工具，甚至不在提交 slop 的人——而在整个行业对"用 AI 构建"这件事的集体幻觉。我们以为自己在提高生产力，实际上只是在生产更多需要被维护的东西。

真正的出路不在于更弱的工具，而在于更强的基础设施；不在于更多与机器隔离的工作，而在于更多人与人之间的协作。开源的价值从来不在代码本身，而在让项目能够 outlive 其原始创建者的结构和社区。