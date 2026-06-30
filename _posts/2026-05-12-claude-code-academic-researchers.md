---
layout: post
title: "从 ChatGPT 到 Claude Code：学术研究者的 AI 原生工作流"
date: 2026-05-12T14:00:00+08:00
tags: [AI-Native软件工程, Claude Code, 学术研究, AI工具]
description: "学术研究者应从\"上传文件给AI\"转为\"带AI进文件夹\"的工作流范式，CLAUDE.md可从Role/Standards/Writing/Critique四个维度定制研究助手。"
author: "@postcodeeng"
series: aise
---

> **TL;DR**
>
> 一篇面向零技术背景学术研究者的 Claude Code 入门教程，获得了 4.2M views：
> 1. **核心理念转变** — 不是把文件带给 AI，而是把 AI 带进文件夹
> 2. **研究者专属场景** — 文献综述、访谈编码、数据清洗、审稿意见解释
> 3. **CLAUDE.md 的研究版本** — Role/Standards/Writing/Critique 四个维度定制研究助手
> 4. **AI 时代的学术判断力** — AI 能做 labor intensive 任务，但"什么算学问"是人的责任

---

## 4.2M views 背后的巨大需求

> 💡 **Key Insight**
>
> 全球有数百万研究者在用 AI 可以处理的任务上浪费大量时间，但他们不知道怎么开始。这篇是最接近"一键上手"的指南。

Mushtaq Bilal 博士写了这篇面向零技术背景学术研究者的 Claude Code 入门教程。4.2M views，5.8K likes，1.2K 转发。这个数字说明的不是内容有多深，而是需求有多大。

**传统学术研究的工作流：**
- 50 篇 PDF 要读 → 手工逐一打开、标注、整理
- 访谈记录要找主题 → 手工编码、反复遍历
- 数据要清洗 → Excel 手动处理
- 文献综述要综合 → Word 里复制粘贴

这些都是 AI 最擅长处理的 labor intensive、time consuming、repetitive 任务。但大多数研究者不知道可以从 AI 获得帮助，更不知道怎么获得帮助。

---

<object data="/assets/images/2026-05-12-claude-code-academic-researchers-01-paradigm.svg" type="image/svg+xml" width="100%" aria-label="4.2M views 背后的巨大需求" role="img"></object>

## 范式转变：从"上传文件"到"带 AI 进文件夹"

> 💡 **Key Insight**
>
> 浏览器 AI 和本地 AI 工具的根本区别不是技术，是交互范式：前者是"你带着文件找 AI"，后者是"你带着 AI 进文件夹"。

这是 Claude Code 和 ChatGPT/Gemini 的核心区别：

**浏览器 AI（ChatGPT、Claude）：**
局限：每次只能处理少量文件，上下文窗口有限，文件处理后不保存。

**Claude Code：**
优势：同时处理 45 篇论文，创建新文件，保留工作历史，跨文件关联分析。

| 维度 | 浏览器 AI | Claude Code |
|------|----------|-------------|
| **文件数量** | 少量（上下文限制） | 45+ 同时处理 |
| **工作留存** | 不保存 | 自动保存 session |
| **跨文件分析** | 困难 | 原生支持 |
| **创建新文件** | 需要手动复制 | 直接写入文件夹 |

---

## 研究者的具体场景

**定性研究者（访谈分析）**

加载一文件夹访谈记录，然后：
1. "给我每个参与者如何谈论'职业发展'的完整记录"
2. "这些访谈中有什么贯穿始终的主题？"
3. "哪些参与者的观点相互矛盾？"

**定量研究者（数据分析）**

加载混乱的 CSV 或 Excel，然后：
1. "清洗这个数据集，处理缺失值和异常值"
2. "跑描述性统计，输出可视化"
3. "解释审稿人这条意见的统计含义"

**系统性评价（Literature Review）**

把 50 篇相关论文放进文件夹，然后：
1. "根据以下标准筛选：[列出标准]"
2. "输出一个表格，包含每篇论文的标题、方法、主要发现、风险评估"
3. "哪些论文对 [具体论点] 提出了反驳？"

**文献综述**

50 篇 PDF 放进文件夹，然后：
1. "阅读所有论文，提取每篇的主要论点"
2. "按主题分类，输出 markdown 表格"
3. "哪些论文之间存在观点冲突？"

---

## CLAUDE.md 的研究者版本

> 💡 **Key Insight**
>
> CLAUDE.md 不需要完美，可以随项目演化而迭代。重要的是开始，然后让它和项目一起成长。

Mushtaq 推荐把 CLAUDE.md 分成四个维度，为研究场景定制 AI 行为：

**Role（角色）** — 告诉 Claude 你是谁。专业领域、研究阶段、用什么方法。"我是用定性方法研究职业发展的博士生，主要做半结构化访谈。"

**Standards（标准）** — 你的学术规范。引用格式、写作风格、哪些事情不可妥协。"所有引用用 APA 格式，不要改写原文意思。"

**Writing（写作风格）** — 你的表达偏好。用主动语态还是被动语态、段落长度、是否允许使用"首先、其次"这类连接词。

**Critique（批评方式）** — 你希望 AI 怎么挑毛病。是关注逻辑漏洞、还是数据可靠性、还是论证结构的完整性。

这四个维度构成一个完整的研究者画像。如果你不想手动写，直接让 Claude Code 根据你的描述自动生成初稿，然后按自己的风格调整——CLAUDE.md 不需要一步到位，它应该跟着你的研究一起演化。

---

## Auto-Memory：让 AI 记住你是谁

Claude Code 有一个被低估的功能：**Auto-Memory。**

随着你在项目中工作，Claude Code 会自动写短期笔记保存。每次 session 开始时，它读取 CLAUDE.md 和自己的笔记，获得关于你和你的项目的上下文。久而久之，它成为一个真正了解你研究方向、写作风格、偏好的研究助手。

你可以随时问它："Tell me what you have stored in your memory." 如果某条信息过时了（比如引用格式变了），直接让它更新。整个记忆系统是项目级别的——换一个新项目，AI 会从空白开始，不会把上一个项目的上下文带过来。

**关键约束：**
- 不要放机密信息进 CLAUDE.md 或让 AI 记忆的内容
- 几周更新一次 CLAUDE.md，防止它成为过时信息的来源

---

## 结尾：工具变，学术判断力不变

> 💡 **Key Insight**
>
> "Claude Code 擅长 labor intensive、time consuming、repetitive 任务。但它无法创造真正算作学问的东西，因为它给不了你新的、原创的论点。"

Mushtaq 在文章结尾说的这句话，和 Garry Tan 的 skillify 哲学、和我们这周发的所有文章完全一致：**AI 是工具，不是判断力的替代品。**

你可以让 AI 帮你：
- 读 50 篇论文并提取信息
- 在 20 份访谈记录里找主题
- 清洗混乱的数据集
- 按标准筛选文献

但你仍然需要决定：
- 什么是论点，什么是证据
- 哪些文献对你的研究真正相关
- 研究问题是否有趣、有价值

**工具改变的是 labor intensive 的部分。不变的是"什么是好的学术工作"这个判断。**

这就是为什么 AI 时代学术判断力更值钱——不是更少，是更多。

---

## 延伸阅读

**原文**
- Mushtaq Bilal 的教程（英文）：https://x.com/mushtaqbilalphd/status/2052338632426467550

**本系列相关**
- [执行已死，判断力永生]({% post_url 2026-05-11-execution-is-dead-judgment-lives %}) (AI-Native 软件工程系列)
- [Skillify：如何让 AI Agent 不再犯同样的错误]({% post_url 2026-05-13-claude-skills-complete-guide %}) (AI-Native 软件工程系列)
- [AI 原生写作：为什么我放弃 Markdown，改用 HTML]({% post_url 2026-05-12-ai-native-writing-html-over-markdown %}) (AI-Native 软件工程系列)

**工具**
- Claude Code：https://claude.com/download
- CLAUDE.md 指南（Karpathy 版本）：Forrest Chang's repo

---

*AI-Native软件工程系列 #57*
*深度阅读时间：约 6 分钟*