---
layout: post
title: "AnalysisAgent：LLM Agent 装配分析工具的七个陷阱"
date: 2026-09-02T10:00:00+08:00
tags: [AI-Native软件工程, Agent工具装配, CI/CD智能化, 静态分析]
author: Aaron
series: AI-Native软件工程系列 #64

redirect_from:
  - /analysis-agent-automated-software-analysis/
---

> **TL;DR**
>
> 首次系统评测 LLM Agent 在「给项目装配并跑通静态分析/符号执行工具」任务上的表现。35 个 tool-project 对，自研 AnalysisAgent 用分阶段 + 单动作周期 + 证据校验拿到 Gemini-3-Flash 后端 **94% 人工核验成功率**，强于 ExecutionAgent 的 77%。结论：**Agent 架构设计比换更强 LLM 更关键；LLM 自报成功率普遍高估真实成功率；全程序分析 + Java 工具链最难。**
>
> **核心观点：把 Agent 从「写业务代码」推到「配齐研发基础设施」，是 CI/CD 智能化的暗线。架构问题不解决，换模型收益会封顶。**

---

## 1. 背景：从写代码到装配工具

过去一年，LLM Agent 的主流应用场景是「写业务代码」——给定需求，生成代码，通过测试。

但工程团队还有另一类高价值任务：**装配研发基础设施**。比如：

- 给项目装好 clang-tidy，跑通，生成报告
- 配置 semgrep 规则，覆盖关键路径
- 装配符号执行工具，定位复杂 bug

这类任务的特点是：工具已知、环境复杂、多步骤依赖。AI 在这些任务上的表现如何？这是之前没有人系统回答过的问题。

---

## 2. AnalysisBench：首个系统评测基准

研究团队构建了 AnalysisBench + AnalysisAgent：

- **35 个 tool-project 对**（7 种工具 × 10 个 C/C++/Java 项目）
- 工具类型：静态分析（clang-tidy、semgrep）、符号执行（KLEE、CBMC）、代码复杂度分析等
- 评测方式：人工核验 Agent 最终报告的准确性

关键数据：

- **Gemini-3-Flash 后端 + AnalysisAgent 架构 = 94% 人工核验成功率**
- **ExecutionAgent（同后端）= 77%**
- **LLM 自报成功率普遍高于真实成功率**，尤其在部分完成的场景

Architecture design matters more than model strength.

---

## 3. AnalysisAgent 的设计原则

ExecutionAgent 失败的地方，AnalysisAgent 成功，靠的是三个设计决策：

### 3.1 分阶段（Stage Mixing）

不把「工具装配」和「工具执行」混在一个阶段。把任务分成清晰的阶段：

```
阶段1：环境探测 → 阶段2：工具装配 → 阶段3：工具执行 → 阶段4：报告生成
```

每阶段有明确的输入输出，失败时能定位到具体阶段。

### 3.2 单动作周期

每个周期只执行一个动作（写一个文件、跑一个命令、检查一个输出），而不是一口气执行一串操作。

好处：失败时能准确知道是哪一步出了问题，不需要回溯一长串操作链。

### 3.3 证据校验

每步执行后验证结果是否可信。例如：

- 工具安装后检查版本号
- 分析完成后检查报告是否包含预期内容
- 报错后检查错误信息来源是否可靠

---

## 4. 七个陷阱（来自实验观察）

基于论文数据的归纳，LLM Agent 装配工具时最容易掉的七个陷阱：

### 陷阱 1：环境感知缺失
不知道依赖项已经安装，试图重复安装导致冲突。
*例：系统已有 LLVM，但 Agent 仍尝试下载源码编译。*

### 陷阱 2：路径假设硬编码
假设工具在固定路径，真实环境路径不同则失败。
*例：假设 `clang-tidy` 在 `/usr/bin/`，实际在 `/opt/homebrew/bin/`。*

### 陷阱 3：输出格式误解
把警告当成错误，或把错误信息中的建议当成真实问题。
*例：semgrep 输出 "consider using..." 被 Agent 标记为 "error found"。*

### 陷阱 4：部分成功误报
工具跑通了但只覆盖了部分分析维度，Agent 认为 100% 完成。
*例：只分析了 80% 的文件，但报告标题写 "Analysis Complete"。*

### 陷阱 5：Java 工具链尤其难
Maven/Gradle 生命周期与静态分析工具的集成比 C++ 复杂得多。
*例：需要先理解 Gradle 插件加载顺序，再配置 SpotBugs 任务。*

### 陷阱 6：全程序分析失败
需要跨文件的依赖分析时，工具装配正确但分析失败。
*例：CBMC 符号执行在处理跨文件指针时超时。*

### 陷阱 7：错误本地化失败
报错后 Agent 在错误位置附近打转，找不到真正原因。
*例：编译报错是头文件 A 的问题，但 Agent 反复修改调用方 B。*

---

## 5. 反直觉结论：架构比模型更关键

研究最反直觉的发现：**AnalysisAgent 用 Gemini-3-Flash 打败了 ExecutionAgent 用更强后端**。

差异来自架构设计，不来自 LLM 能力。

这意味着：

> 换更强模型能提升的上限，由架构设计决定。如果 stage mixing + evidence verification 没做对，换 GPT-5 也是在低上限上优化。

对于工程团队来说，这个结论的实践意义是：**先投资架构设计，再投资模型采购。** 顺序反了会浪费大量预算。

---

## 6. 可落地动作

- [ ] 选一个 C/C++ 项目，装好 clang-tidy 或 semgrep 其中之一
- [ ] 用 Agent 跑「装好→跑通→报告」全流程，人工核验成功率
- [ ] 对比不同 Agent 架构（stage mixing vs monolithic）的表现差异
- [ ] 记录哪个环节（环境感知 / 路径解析 / 输出解释）最容易失败

---

## 参考文献

- Evaluating LLM Agents on Automated Software Analysis Tasks. arXiv:2604.11270. AnalysisBench + AnalysisAgent. https://arxivx.org/abs/2604.11270
