---
title: "Beyond Resolution Rates：9374条轨迹揭示的Coding Agent失败真相"
date: 2026-09-16
tags:
  - coding-agent
  - empirical-study
  - nCSU
  - failure-analysis
  - SWE-bench
---

# Beyond Resolution Rates：9374条轨迹揭示的Coding Agent失败真相

> 失败不是因为patch太复杂，而是因为Agent根本没有理解代码在做什么。

## 研究背景

NCSU的Mehtiyev和Assunção在2026年发表了也许是迄今为止规模最大的coding agent行为研究：他们在SWE-bench Verified的500个真实任务上，跑完了19个Agent（8个框架 × 14个LLM），合计9374条轨迹。每对组合都完整跑完所有任务——这解决了之前研究最大的confound：**任务难度控制**。

之前的研究只能对比"Agent A vs Agent B"，但没办法说"在同等难度的任务下，谁更好"。这个数据集第一次让研究者能做**within-task配对比较**。

## 核心发现

### 发现一：Patch复杂度是伪命题

之前的工作假设：任务越难 = patch越大（改的行数越多）。这个研究彻底推翻了这个假设。

他们发现了12个"从未被任何Agent解决"的任务，这12个任务的patch都是**极简的单行修改**，人工标注认为它们是"容易"的任务——但所有Agent都失败了。

失败原因：**架构推理缺口（architectural reasoning gaps）和领域知识缺口**，而不是patch的编辑量。

django-15863是个经典案例：一个`floatformat`对`Decimal`精度丢精度的问题，修复只需要改一行。但这个bug的根因藏在Django的数值格式化抽象层，Agent需要理解整个链路的架构才能找到正确位置。12个never-solved任务，全是这个类型。

> **教训**：Benchmark的resolution rate低估了真实难度。简单patch的任务不代表容易，Agent真正卡住的是"这个代码为什么要这么写"。

### 发现二：轨迹长度是混淆变量

大量之前的工作报告"轨迹越长=越容易失败"。这个研究控制任务难度后发现：**这个相关性会反转**。

当控制了Agent身份这个变量后，轨迹长度和失败率正相关（越长的轨迹越容易失败）。
当控制了任务难度这个变量后，轨迹长度和失败率**负相关**（越长的轨迹反而成功率更高）。

原因：简单任务用短轨迹就能解决，困难任务需要更长轨迹，但之前的研究把"困难任务"和"长轨迹"混为一谈。

**真正有预测力的不是轨迹长度，而是轨迹结构（trajectory structure）**：

- **先收集上下文再编辑**的Agent，成功率更高
- **投入验证（validation）** 的Agent，成功率更高
- 这些策略是**Agent固有的**（agent-determined），而不是根据任务难度自适应调整的

也就是说：一个Agent在A任务上先验证再编辑，在B任务上也会这样做。这是这个Agent的"性格"，不是智能适配。

### 发现三：Claude 4 Sonnet vs GPT-4的同框架对照

论文给了个漂亮的对比：同一个SWE-agent框架，一个用Claude 4 Sonnet，一个用GPT-4，做同一个任务django-15863。

**Claude 4 Sonnet轨迹（37步）：**
- 遵循 "understand → reproduce → fix → verify" 工作流
- 一次编辑，零语法错误
- 任务成功

**GPT-4轨迹（36步）：**
- 找到正确文件后开始疯狂编辑
- 产生28个语法错误
- 从未运行项目测试套件
- 任务失败

步数几乎一样，但行为模式天壤之别。

### 发现四：LLM > Framework

这是最一致的结论：

> 使用**相同LLM**的Agent，在任务上的agreement（一致性）远超使用**相同框架**的Agent。

框架设计确实影响Agent的tactics（策略），但这个影响随着LLM能力增强而**缩小**。更强的LLM可以弥补框架的不足，更弱的LLM即便在精心设计的框架里也受限。

这意味着：**买更好的模型，比调框架更值。**

## 方法论亮点

研究团队设计了一套**13符号的轨迹编码系统**，比之前的8类型系统精细得多：

| 符号 | 含义 |
|------|------|
| Lb | 定位→浏览整个文件 |
| Lt | 定位→针对性读取 |
| Ls | 定位→搜索 |
| P | Patch（干净编辑） |
| Ps | Patch→语法错误 |
| Pi | Patch→导入错误 |
| Pr | 重新Patch（同文件） |
| Vp | 验证通过 |
| Vf | 验证失败 |
| Ve | 验证→运行时错误 |
| Vr | 重现脚本 |
| E | 环境设置 |
| G | 通用操作 |

关键是加入了**执行质量信息**（干净patch vs 语法错误patch），而不仅是动作类型。这让他们能区分"编辑了"和"编辑成功了"。

## 对从业者的意义

1. **不要迷信resolution rate**：20%的失败率背后，不是"有些任务太难"，而是某些类型的架构推理缺口是系统性的。
2. **强制验证回路**：Ve/Vf符号告诉你的——不在验证上投入的Agent，成功率系统性更低。你的harness有没有在每次编辑后自动运行测试？
3. **选模型比选框架重要**：在多个harness间横跳，不如把钱花在更强的模型上。
4. **轨迹结构才是干预点**：如果一个Agent先天不擅长先理解再动手，给它更好的prompt或convention可以在一定程度上弥补。

---

论文：[arXiv 2604.02547](https://ar5iv.labs.arxiv.org/html/2604.02547) — Mehtiyev & Assunção, NCSU, 2026
