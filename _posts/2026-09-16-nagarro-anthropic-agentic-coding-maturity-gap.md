---
title: "Anthropic的报告对了方向，但没算清距离——Nagarro的企业落地复盘"
date: 2026-09-16
tags:
  - enterprise
  - agentic-coding
  - adoption-gap
  - governance
---

# Anthropic的报告对了方向，但没算清距离

> 厂商的报告告诉你Agent能做什么。从业者的复盘告诉你，落地的时候卡在哪里。

## 这篇文章在说什么

Nagarro的人在2026年4月发了篇对Anthropic《Agentic Coding》报告的 practitioner's critique。我不知道Anthropic原文说了什么，但Nagarro这篇足够有意思——因为它代表了一类真实的焦虑：**报告里的世界和真实企业的世界之间，隔着多少工程和组织上的坑**。

核心论点：

> Anthropic正确地指出了destination（Agentic coding是正确方向），但低估了journey的难度。企业在"采用曲线"上真正卡住的地方，不是代码生成能力，而是**交付编排、治理、验证和记忆**。

## 企业真正卡住的四个地方

### 1. 交付编排（Delivery Orchestration）

单个Agent写代码是一回事。让Agent在真实项目中按照真实的依赖关系、时间线和质量标准交付工作，是另一回事。

报告讲的是"Agent能解决这个任务"。企业需要的是"Agent能在第三版PR已经打开、另一个PR正在review、main分支刚更新了依赖的情况下，正确地完成这个任务"。

这个区别听起来是工程问题，实际上是**认知负荷问题**——Agent处理多线条并发工作流的能力，远比单任务测试集展示的要弱。

### 2. 治理（Governance）

代码生成能力是充分条件，治理能力是必要条件。

企业需要：
- **谁对Agent生成的代码负责？** 工程师？Team Lead？采购Agent的IT部门？
- **什么级别的代码需要人工审查？** Agent生成的所有代码，还是特定风险等级的？
- **合规路径怎么走？** SOC 2、GDPR、各种行业监管——Agent的决策过程能审计吗？
- **Agent的行为日志保留多久？** 作为证据保留还是作为性能数据？

这些在报告中几乎不存在，但在企业采购决策中往往是一票否决的关卡。

### 3. 验证（Validation）

报告里Agent解决SWE-bench Verified的方式，是有标准答案的benchmark。真实工作没有标准答案——或者更准确地说，**验证Agent输出正确性的成本，有时候比人工重写还高**。

这是Nagarro提出的最务实的观察之一：**"通过测试"不等于"解决了问题"**。Agent可以生成能通过现有测试的代码，但：

- 测试本身可能不够全面
- 修复了A问题但引入了B问题（回归）
- 代码风格、架构设计与团队规范不一致

需要一个**独立于生成过程的验证层**，而这在大多数团队的AI集成方案中还是空白。

### 4. 记忆（Memory）

Anthropic的报告很关注上下文窗口(context window)——Agent一次能看多少代码。但企业真正需要的不是context window大小，而是**跨会话、跨任务、跨时间的记忆能力**。

具体来说：
- Agent在Ticket #1234中学到的关于这个代码库的知识，能不能在Ticket #5678中复用？
- 上个月的一次架构决策，Agent能不能在相关任务中反映出来？
- 不同Team的Agent之间，能不能共享关于同一套系统的知识？

这些问题目前没有标准答案，各家Agent的记忆方案（向量数据库、结构化Memory、显式知识库）都还在非常早期的阶段。

## 为什么这份报告值得读

不是因为它反驳了Anthropic——恰恰相反，它站在Anthropic的肩膀上，只是把厂商不会主动说的工程现实说了出来。

Vendor的报告讲的是**功能**， practitioner's critique讲的是**代价**。两者合起来才是完整图景。

如果你在评估Agentic coding的落地路径，这篇文章值得在Anthropic原始报告旁边对照着读。

---

来源：[Nagarro - Anthropic Agentic Coding Report Critique](https://www.nagarro.com/en/blog/anthropic-agentic-coding-report-agentic-coding-maturity-gap)，2026-04-23
