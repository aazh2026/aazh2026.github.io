---
layout: post
title: "Claude 五个 Level：为什么大多数人卡在 Level 1"
date: 2026-05-14T08:00:00+08:00
tags: [AI效率, Claude, AI使用技巧, 生产力]
author: "@postcodeeng"
---

# Claude 五个 Level：为什么大多数人卡在 Level 1

*来源：@nateherk · 27K 阅读 · 422 收藏*

---

两个用同一 AI 模型、付同样订阅费的人，可以获得完全不同的回报。差距不在于努力程度，而在于**架构**。

在 Chat、Cowork 和 Code 里花了 400+ 小时之后，**@nateherk** 绘制出了使用 Claude 的五个层级。每个层级解锁不同的工作类型和不同的报酬天花板。

---

## Level 1：搜索引擎替代品

打开 Claude。问一个问题。得到答案。关掉标签页。

也许让它帮你写封邮件。也许一个小脚本。也许解释你看过的某个东西。这就是 Level 1。每天省大约 30 分钟。

大多数人错过的升级：**直接粘贴截图**。Claude 能读图片。卡在这里的人花两秒钟打字描述截图内容，其实直接粘贴就行。

**为什么卡在这里：** 他们不知道 Claude 可以在对话之间保持上下文、把工作组织成项目、或者接入你每天使用的工具。他们一直把它当成了一个返回段落的搜索引擎。

**突破到 Level 2 的捷径：** 创建你的第一个 Project。选一个你经常返回的东西——你的业务、副业、重复性工作。放几个参考文档进去。写一个快速 system prompt 说明你是谁。现在这个项目里的每次对话都会预加载这些上下文。

---

## Level 2：记忆机器

Project 是这个层级的主干。其他一切都是围绕 Project 展开的。

周二你在项目里开一个新的对话，问："上周我们关于 Q2 发布会定了什么来着？"Claude 把对话调出来，引用了具体内容，从上次停下的地方继续。六个功能定义了这个层级：

**Memory 和历史对话搜索。** Claude 记得你的角色、你的偏好、你几周前做的决定。Memory 所有计划都能用。历史对话搜索是付费功能。结合项目的知识库，解决了"每次从零开始"的问题。

**Connectors。** Slack、Google Drive、Gmail、GitHub、Notion、Calendar。50+ 个。点一下加号，用 OAuth 登录就行了。现在 Claude 可以总结上周的 Slack 讨论、从 Drive 拉最新规范文档、或者查你的日历，不需要你粘贴任何东西。

**文件创建。** Claude 现在可以直接在对话里创建真正的 Excel 电子表格（含公式）、PowerPoint 演示文稿、Word 文档和 PDF。不是你预览的 artifacts，是你可以下载、发给客户的真实文件。免费用户也有这个功能。这是 chat 从头脑风暴工具变成交付工具的转折点。

**带持久存储的 Artifacts。** Artifacts 现在可以在会话之间保存数据，可以直接调用 Claude API，你可以用公开链接发布它们。一个不会写代码的人，可以在 Claude 对话里建一个客户反馈追踪器，保存它，把链接发给团队，当天就能用上一个可用的工具。不需要 Lovable、Bolt 或者定制开发。就是一场对话。

**内联可视化。** 当图表或图示比文字更能说明问题时，Claude 在对话里直接生成。点击它，切换图表类型，让它加变量并实时更新。所有计划免费。

**原生 Office 插件。** Claude 作为原生插件存在于 Excel、PowerPoint 和 Word 里。截至 2026 年 4 月，三者共享上下文。你在 Excel 里分析数据，切到 PowerPoint，Claude 用同一份分析生成幻灯片。

**Level 2 免费 vs 付费：** Memory、文件创建、内联可视化对所有人开放。历史对话搜索、持久 artifacts、Office 插件是 Pro 及以上。

**突破到 Level 3 的捷径：** 别再试图用 chat 做所有事情了。打开 Claude Desktop，点 cowork 标签页。

---

## Level 3：同事模式

如果你曾经想过"真希望 Claude 能直接在我的电脑上执行"，你就准备好了。

你指向下载文件夹——三个月的 PDF、截图、旧发票、乱七八糟。你说一次："把下载文件夹里的东西按类型分类、重命名一致、写个摘要给我。"去做咖啡吧。回来的时候已经好了。这是一个正经同事。

五个功能定义了这个层级：

**文件系统访问。** Cowork 在一个隔离的虚拟机里运行代码，但对你授权的文件夹有真正的读写权限。没给权限的东西它碰不到；给了权限的，它能完全拥有。

**Skills。** Skills 是以简单 markdown 文件定义的可复用工作流。建一次"每周客户报告"这样的 skill，以后再也不用解释了。已经有 100+ 个 skill 发布。建一次，任何地方都能跑。

**定时任务。** 输入 `/schedule`，Claude 保存任务按设定的时间表运行。每天早上 8 点的站会、每周一/周五的竞品简报、每月报告。

**手机控制。** 用 dispatch 把手机和桌面配对。从任何地方发送任务。在你不在的时候，Cowork 在桌面上运行，完成后 ping 你。

**Claude Design。** 独立的 Anthropic Labs 产品，Pro 计划附赠。用 plain English 描述一个原型、幻灯片、落地页或单页文档，Claude 把它建出来并设计好。通过自然对话迭代。

**突破到 Level 4 的捷径：** Claude Code。并行会话。Plan mode。Sub-agents。

---

## Level 4：工程师模式

Claude Code + 并行会话。`claude.md`、plan mode、sub-agents、worktrees、MCP、验证循环、自定义斜杠命令。这就是 $5K-$15K 自由职业工作变得可能的地方——因为 AI 干执行，你来做方向。

---

## Level 5：操作系统模式

云端 routines、hooks、channels、headless mode、Agent SDK、远程控制、autodream、任务预算、agent 团队。

卡住的原因不是技术。**是信任。**

---

*大多数人卡在 Level 1 到 Level 3。能够冲到 Level 4 和 Level 5 的人，不是因为更聪明。是因为更愿意放手。*