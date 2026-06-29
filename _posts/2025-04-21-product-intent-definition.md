---
layout: post
title: "\"Product Intent：AI 时代的意图定义\""
date: 2025-04-21T00:00:00+08:00
permalink: /posts/product-intent-definition//
tags: [Product Intent, AI产品, 意图驱动, 产品定义, AI-Native]
author: "@postcodeeng"
series: AI-Native软件工程系列 #01
description: 'Product Intent五维框架替代传统PRD，精确描述"要解决什么"和"不能做什么"，将Level 4留给AI决定，是AI时代的产品定义方法。'
redirect_from:
  - /product-intent-definition.html
---

> *「2024年，一个产品经理和工程师坐下来讨论新功能。产品经理说：'我们需要一个智能推荐系统'。三个月后，工程师交付了一个'精准'的推荐算法——推荐的是用户已经买过的商品。这不是技术失败，这是意图失败。在AI时代，定义'做什么'比'怎么做'重要十倍，而Product Intent就是连接两者的桥梁。」*

---

> **TL;DR**
>
> 本文核心观点：
> 1. **需求文档的局限** — PRD 为人类工程师设计，AI 无法通过讨论消除歧义，导致"意图失败"
> 2. **Product Intent 五维框架** — 业务/用户/功能/约束/演化五个维度，替代传统功能列表
> 3. **Level 2-3 关注区间** — Product Intent 精确描述"要解决什么"和"不能做什么"，Level 4 留给 AI 决定
> 4. **约束即产品** — 在 AI 时代，正确的意图定义比代码更珍贵

---

## 需求文档的黄金时代与 AI 时代的意图危机

### 传统需求文档的黄金时代

过去二十年，软件产品开发依赖一套成熟的文档体系：

**PRD（Product Requirements Document）**：
- 功能列表
- 用户故事
- 验收标准
- 界面原型

这套体系在**人工编码时代**是有效的，因为：
- 工程师需要详细规格才能写出正确代码
- 文档是沟通的主要媒介
- 需求变更成本高，需要提前定义清楚

### AI 时代的意图危机

**场景：智能客服系统**

传统 PRD 这样写：
三个月后的问题：
- AI 在回答退货问题时，给出了过期的退货政策
- 对于 angry customer，AI 的回复过于机械，导致投诉升级
- 当用户询问库存时，AI 有时会"编造"库存数字

**问题不在于 AI 的能力，而在于 PRD 没有捕捉到真正的意图。**

### PRD 的局限性

| 局限 | 表现 | 后果 |
|------|------|------|
| **静态性** | 文档写完后很少更新 | 与实际业务脱节 |
| **二义性** | "智能回复"可以有100种理解 | AI 实现与期望不符 |
| **缺约束** | 只定义功能，不定义边界 | AI 越界行为 |
| **无演化** | 假设需求不变 | 无法适应业务变化 |

**核心洞察**：PRD 是为人类工程师设计的——他们可以通过讨论、澄清、迭代来消除歧义。但 AI 不会问你"你真正的意思是什么"，它会按照最可能的理解去执行。

> 💡 **Key Insight**
>
> PRD 是为人类工程师设计的——他们可以通过讨论、澄清、迭代来消除歧义。但 AI 不会问你"你真正的意思是什么"，它会按照最可能的理解去执行。

<object data="/assets/images/2025-04-21-product-intent-definition-03-prd-vs-intent.svg" type="image/svg+xml" width="100%" aria-label="PRD 的局限性（插图）" role="img"></object>

---

## Product Intent 的定义与原则

### 定义

**Product Intent（产品意图）**：对产品功能的目标、约束、边界和演化路径的完整、精确、可验证的描述，旨在让 AI 系统能够理解和执行人类的业务意图。

不是"告诉 AI 写什么代码"，而是"告诉 AI 要解决什么问题、在什么约束下、以什么标准衡量"。

### Product Intent vs PRD

| 维度 | PRD | Product Intent |
|------|-----|----------------|
| **核心问题** | "系统应该有什么功能？" | "系统应该实现什么业务目标？" |
| **描述对象** | 功能、界面、交互 | 意图、约束、成功标准 |
| **完备性** | 依赖人工补充 | 自包含、可验证 |
| **AI 友好度** | 需要人工解释 | 可直接被 AI 理解 |
| **演化性** | 版本化文档 | 动态意图图谱 |

### 核心原则

**原则 1：意图优先于实现**

Product Intent 首先回答"要解决什么业务问题"，而不是"系统需要什么功能"。当意图清晰时，实现方案有多种选择；当意图模糊时，任何实现都是猜测。在 AI 时代，这意味着你告诉 AI 的第一句话应该是目标描述，而不是功能规格。

**原则 2：约束与自由并重**

Product Intent 不仅定义要做什么，更精确定义**不能做什么**。一个完备的 constraint_intent 包括：hard constraints（绝对不能越过的红线）、soft constraints（尽量满足的边界）、以及隐式假设（哪些条件下当前意图不再适用）。这些约束是 AI 行为的边界，没有它们，AI 会自由发挥到意想不到的方向。

**原则 3：可验证的成功标准**

意图必须有明确的验证方式：每个维度都需要定义"如何判断成功了"。这包括可量化的指标（如点击率、转化率）、不可量化但可判断的标准（如"推荐结果要有解释力"）、以及验证频率（每天检查、每周评审）。没有验证方式的意图只是愿望，不是目标。

> 💡 **Key Insight**
>
> Product Intent 不仅定义要做什么，更精确定义不能做什么。

---

## 五维意图框架

完整的 Product Intent 包含五个维度，缺一不可。

<object data="/assets/images/2025-04-21-product-intent-definition-01-intent-dimensions.svg" type="image/svg+xml" width="100%" aria-label="五维意图框架（插图）" role="img"></object>

### 维度 1：业务意图（Business Intent）

**核心问题**：这个功能要解决什么业务问题？

### 维度 2：用户意图（User Intent）

**核心问题**：用户希望通过这个功能获得什么价值？

### 维度 3：功能意图（Functional Intent）

**核心问题**：系统需要具备什么能力？

### 维度 4：约束意图（Constraint Intent）

**核心问题**：系统绝对不能做什么？边界在哪里？

### 维度 5：演化意图（Evolution Intent）

**核心问题**：这个功能如何随时间和反馈演进？

---

## 从意图到实现

### Product Intent 的层级结构

<object data="/assets/images/2025-04-21-product-intent-definition-02-intent-hierarchy.svg" type="image/svg+xml" width="100%" aria-label="Product Intent 的层级结构（插图）" role="img"></object>

**关键洞察**：Product Intent 关注 Level 2-3，将 Level 4 留给 AI 决定。

> 💡 **Key Insight**
>
> Product Intent 关注 Level 2-3，将 Level 4 留给 AI 决定。

### AI 如何理解 Product Intent

AI 系统读取 Product Intent 文档时，会将五个维度解析为结构化的上下文输入。与解析传统 PRD 不同，AI 不会从功能列表中推断意图，而是直接从 business_intent 获取目标、从 user_intent 获取用户价值期望、从 functional_intent 获取能力要求、从 constraint_intent 获取行为边界、从 evolution_intent 获取演化条件。

这个解析过程有两个关键特性。首先，**意图的优先级决定 AI 的决策权重**：当 constraint_intent 中的某个约束与 functional_intent 中的某个功能冲突时，AI 会优先满足约束，因为约束定义了"不能做什么"。其次，**每个维度都有隐式的验证触发器**：AI 在生成实现方案时，会主动检查是否满足 constraint_intent 中的所有 hard constraints，如果方案违反任何一条，AI 会标记并重新生成。

这也是为什么五维框架中的 constraint_intent 和 evolution_intent 最为关键——它们直接影响 AI 的输出质量和安全性。

### 意图验证循环

Product Intent 的执行不是一次性事件，而是一个持续运转的闭环。循环的起点是 Intent Definition（意图定义），AI 接收完整的五维输入；接着进入 AI Implementation（AI 实现）阶段，AI 根据意图生成代码或方案；然后通过 Verification Against Constraints（约束验证）检查实现是否满足所有约束；最后 Feedback to Intent（反馈回传）将验证结果写回意图层，形成累积的意图知识。

这个循环中，constraint_intent 和 evolution_intent 是两个核心锚点。constraint_intent 中的每一条 hard constraint 都是循环的验证门——如果验证失败，AI 必须重新实现而不是忽略约束。evolution_intent 则定义了循环的演进条件：当某些监控指标触发阈值时，evolution_intent 中预设的迭代规则会自动调整 functional_intent 中的参数，使得整个系统具备自适应性。

在电商推荐系统的重构中，这个循环表现为：每周根据 click-through rate 和用户投诉率的监控数据，AI 自动调整 functional_intent 中的推荐策略参数，而不需要人工介入。这种"意图定义—AI 实现—约束验证—反馈演进"的循环，是 Intent-Driven Development 与传统需求实现模式的根本区别。

---

## 实战：电商推荐系统的意图重构

### 场景：重构推荐系统

### 传统 PRD 方式

**三个月后的问题**：
- 推荐大量已购买商品
- 价格区间与用户消费能力不匹配
- 新用户推荐质量极差
- 无法解释为什么推荐某商品

### Product Intent 重构

### 实施结果对比

在电商推荐系统的 Product Intent 重构中，团队首先识别了三个月前用传统 PRD 方式交付时暴露的四个核心问题：推荐大量已购买商品（用户分层缺失）、价格区间与用户消费能力不匹配（约束缺失）、新用户推荐质量极差（functional_intent 不完整）、无法解释推荐原因（缺少验证标准）。针对每一个问题，团队在 constraint_intent 中定义了对应的约束条件，在 user_intent 中补充了用户分层画像，在 evolution_intent 中设定了推荐质量的监控指标。

重构后的系统在上线第一个月，点击率就从 3.2% 提升到了 9.1%，核心驱动因素是 constraint_intent 中"不推荐已购买商品"的 hard constraint 和用户分层策略的引入。用户投诉从每周 15+ 下降到每周 2-3 条，主要来源于"价格区间匹配"约束和可解释性要求的满足。开发周期从 6 周缩短到 4 周，因为 AI 在有完备约束的情况下可以一次性给出正确实现，而不需要反复澄清和迭代。

| 指标 | PRD 方式 | Product Intent 方式 | 提升 |
|------|---------|---------------------|------|
| 开发周期 | 6周 | 4周 | **-33%** |
| 上线后迭代次数 | 8次 major | 2次 major | **-75%** |
| 点击率 | 3.2% | 9.1% | **+184%** |
| 用户投诉 | 每周15+ | 每周2-3 | **-85%** |
| 业务方满意度 | 6/10 | 9/10 | **+50%** |

**关键差异**：
- **约束前置**：Product Intent 中的 hard constraints 让 AI 在一开始就知道边界
- **用户分层**：针对不同用户群体的不同策略，避免了"一刀切"的问题
- **可观测性**：evolution_intent 中定义的监控指标，让问题能被及时发现

---

## 结尾：产品管理者的角色进化

### 从"需求翻译官"到"意图架构师"

**传统产品经理**：
- 收集业务需求 → 写成 PRD → 跟进开发 → 验收上线
- 核心价值：信息传递和项目协调

**AI-Native 产品经理**：
- 理解业务目标 → 定义 Product Intent → 验证 AI 实现 → 监控意图执行
- 核心价值：意图定义和质量保证

### 技能栈的转变

| 传统技能 | 权重 | AI-Native 技能 | 权重 |
|----------|------|----------------|------|
| 原型设计 | 20% | 意图定义 | 30% |
| 需求分析 | 30% | 约束设计 | 25% |
| 项目管理 | 25% | AI 行为验证 | 25% |
| 数据分析 | 15% | 成功标准设计 | 15% |
| 沟通协调 | 10% | 人机协作设计 | 5% |

### 核心能力的重新定义

**1. 意图的精确表达能力**

不是"写清楚需求"，而是"在模糊的业务目标和精确的技术实现之间架起桥梁"。

**2. 约束的系统化思考**

识别所有可能的边界情况，将其编码为可验证的约束条件。

**3. 成功标准的设计能力**

定义"好"的多个维度，并建立量化评估体系。

**4. AI 行为的预判能力**

理解 AI 可能如何"误解"意图，提前在 Intent 定义中消除歧义。

### 最后的思考

Product Intent 不是另一个文档模板，而是一种新的思维方式。

它要求我们：
- **从功能思维转向意图思维** —— 不是"系统能做什么"，而是"系统为什么存在"
- **从精确实现转向精确约束** —— 不是"告诉 AI 每一步怎么做"，而是"告诉 AI 边界在哪里"
- **从静态文档转向动态验证** —— 不是"写完就扔"，而是"持续验证意图是否被正确执行"

在 AI 时代，代码变得廉价，但**正确的意图定义变得无比珍贵**。

> 💡 **Key Insight**
>
> 在 AI 时代，代码变得廉价，但正确的意图定义变得无比珍贵。

这就是 Product Intent 的意义。

---

## 延伸阅读

### 意图工程理论
- **Intent-Driven Development** — 意图驱动开发方法论
- **Behavior-Driven Development (BDD)** — Dan North 的经典理论
- **Specification by Example** — Gojko Adzic，用示例定义需求

### AI 与产品管理
- **Prompt Engineering for Product Managers** — 如何与 AI 有效沟通
- **AI Product Management** — 机器学习产品的特殊挑战
- **Human-in-the-Loop Design** — 人机协作系统设计

### 相关实践
- **OKR 框架** — 目标与关键结果，与 Product Intent 有共通之处
- **Design Sprint** — 快速验证产品假设
- **Jobs-to-be-Done** — 从用户"雇佣"产品的角度理解需求

---

*AI-Native软件工程系列 #01*  
*深度阅读时间：约 22 分钟*
