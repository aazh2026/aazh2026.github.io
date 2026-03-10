---
layout: post
title: "Product Intent：AI 时代的意图定义"
date: 2026-03-09T00:00:00+08:00
permalink: /2026/03/09/product-intent-definition.html
tags: [Product Intent, AI产品, 意图驱动, 产品定义, AI-Native]
author: Sophi
series: AI-Native软件工程系列 #01
---

> *「2024年，一个产品经理和工程师坐下来讨论新功能。产品经理说：'我们需要一个智能推荐系统'。三个月后，工程师交付了一个'精准'的推荐算法——推荐的是用户已经买过的商品。这不是技术失败，这是意图失败。在AI时代，定义'做什么'比'怎么做'重要十倍，而Product Intent就是连接两者的桥梁。」*

---

## 📋 本文结构

1. [意图的崩塌：为什么需求文档不再够用](#一意图的崩塌为什么需求文档不再够用) — 从PRD到Product Intent的范式转移
2. [什么是 Product Intent](#二什么是-product-intent) — 定义与核心概念
3. [Product Intent 的五个维度](#三-product-intent-的五个维度) — 完整的意图描述框架
4. [从 Intent 到 Implementation](#四从-intent-到-implementation) — AI 如何理解并执行意图
5. [实战：电商推荐系统的意图重构](#五实战电商推荐系统的意图重构) — 传统需求 vs Product Intent
6. [写在最后：产品管理者的角色进化](#六写在最后产品管理者的角色进化) — 从需求翻译到意图架构

---

## 一、意图的崩塌：为什么需求文档不再够用

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
```
功能：用户咨询自动回复
- 输入：用户问题（文本）
- 处理：调用大模型生成回复
- 输出：回复内容
- 验收标准：回复准确率 > 80%
```

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

---

## 二、什么是 Product Intent

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

```
❌ PRD 思维：
"系统需要一个推荐算法，使用协同过滤，
基于用户历史行为计算相似度..."

✅ Product Intent：
"意图：帮助用户发现可能感兴趣但尚未了解的商品
目标：点击率 > 5%，购买转化率 > 2%
约束：不重复推荐已购买商品，不侵犯隐私"
```

**原则 2：约束与自由并重**

Product Intent 不仅定义要做什么，更精确定义**不能做什么**。

```
边界约束：
- 不能推荐缺货商品
- 不能推荐用户明确不感兴趣的商品
- 不能基于敏感属性（种族、宗教）进行推荐
```

**原则 3：可验证的成功标准**

意图必须有明确的验证方式：

```
成功标准：
- 定量：CTR > 5%, CVR > 2%, 平均推荐多样性 > 0.7
- 定性：用户调研中 "推荐有用" 评分 > 4/5
- 边界：误推荐率 < 0.1%
```

---

## 三、Product Intent 的五个维度

完整的 Product Intent 包含五个维度，缺一不可。

### 维度 1：业务意图（Business Intent）

**核心问题**：这个功能要解决什么业务问题？

```yaml
business_intent:
  problem: 用户在海量商品中难以发现感兴趣的商品
  opportunity: 提升用户发现效率，增加购买转化
  success_metrics:
    - metric: 推荐位点击率
      target: "> 5%"
      baseline: "当前 2%"
    - metric: 推荐商品购买占比
      target: "> 30%"
      baseline: "当前 15%"
```

### 维度 2：用户意图（User Intent）

**核心问题**：用户希望通过这个功能获得什么价值？

```yaml
user_intent:
  user_segments:
    - segment: 新用户
      goal: 快速了解平台商品范围
      pain_point: 不知道从哪里开始浏览
    - segment: 老用户
      goal: 发现新品，避免重复
      pain_point: 总是看到相似商品
    - segment: 目的性购买者
      goal: 找到最佳选项
      pain_point: 需要比较多件商品
  
  user_scenarios:
    - scenario: 浏览时
      expectation: 发现惊喜
    - scenario: 搜索后
      expectation: 看到相关补充
    - scenario: 购物车
      expectation: 搭配建议
```

### 维度 3：功能意图（Functional Intent）

**核心问题**：系统需要具备什么能力？

```yaml
functional_intent:
  core_capabilities:
    - capability: 理解用户偏好
      description: 基于浏览、点击、购买历史构建用户画像
      precision_requirement: "相关性 > 0.8"
    
    - capability: 商品匹配
      description: 将用户画像与商品特征匹配
      coverage_requirement: "全站商品覆盖率 > 95%"
    
    - capability: 多样性控制
      description: 避免推荐过于相似的商品
      diversity_metric: "类别分散度 > 0.6"
  
  non_functional_requirements:
    latency: "< 100ms"
    availability: "> 99.9%"
    scalability: "支持10倍流量增长"
```

### 维度 4：约束意图（Constraint Intent）

**核心问题**：系统绝对不能做什么？边界在哪里？

```yaml
constraint_intent:
  hard_constraints:
    - constraint: 隐私保护
      rule: 不使用未授权的个人数据
      enforcement: 数据访问审计
    
    - constraint: 公平性
      rule: 不因用户 demographics 区别对待
      verification: 定期公平性审计
    
    - constraint: 准确性
      rule: 不展示过时或错误信息
      example: "价格、库存必须实时准确"
  
  soft_constraints:
    - constraint: 解释性
      preference: 能够解释为什么推荐某商品
      priority: "高，但非阻断"
    
    - constraint: 新鲜度
      preference: 优先推荐新品
      priority: "中"
```

### 维度 5：演化意图（Evolution Intent）

**核心问题**：这个功能如何随时间和反馈演进？

```yaml
evolution_intent:
  learning_mechanism:
    feedback_sources:
      - explicit: 用户反馈（点赞/点踩）
      - implicit: 点击、购买、停留时长
    adaptation: 模型每周自动重训练
  
  iteration_plan:
    phase_1:
      scope: 首页个性化推荐
      timeline: "M1-M2"
    phase_2:
      scope: 全站推荐位统一
      timeline: "M3-M4"
    phase_3:
      scope: 跨品类推荐优化
      timeline: "M5-M6"
  
  sunset_criteria:
    - criteria: CTR 连续4周低于 3%
      action: 启动诊断和优化
    - criteria: 用户投诉率 > 0.5%
      action: 暂停功能并复盘
```

---

## 四、从 Intent 到 Implementation

### Product Intent 的层级结构

```
┌─────────────────────────────────────────────────────────────┐
│ Level 1: 战略意图 (Strategic Intent)                         │
│ "成为最懂用户的电商平台"                                      │
└─────────────────────────────┬───────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Level 2: 产品意图 (Product Intent)                           │
│ "通过个性化推荐提升用户发现和购买效率"                        │
└─────────────────────────────┬───────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Level 3: 功能意图 (Feature Intent)                           │
│ "首页个性化推荐模块：在100ms内展示5个相关商品"                 │
└─────────────────────────────┬───────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Level 4: 实现意图 (Implementation Intent)                     │
│ "使用向量检索 + 排序模型，Top-K召回后精排"                     │
└─────────────────────────────────────────────────────────────┘
```

**关键洞察**：Product Intent 关注 Level 2-3，将 Level 4 留给 AI 决定。

### AI 如何理解 Product Intent

**传统方式**：
```
产品经理 → PRD → 工程师理解 → 代码实现
                ↑
         （信息丢失和扭曲发生在这里）
```

**Intent-Driven 方式**：
```
产品经理 → Product Intent (结构化) → AI 意图理解引擎 
                                     ↓
                              生成实现方案 → 代码生成
                                     ↓
                              意图验证引擎 ←→ 人类审查
```

### 意图验证循环

```
Product Intent
      ↓
AI 实现
      ↓
验证：是否满足所有约束？
      ↓
Yes → 部署 + 监控
No  → 反馈 → 调整 Intent 或 AI 实现
      ↓
运行时监控：实际行为是否符合意图？
      ↓
持续学习和优化
```

---

## 五、实战：电商推荐系统的意图重构

### 场景：重构推荐系统

**传统 PRD 方式**：

```
需求文档 v1.2
==============

功能：首页推荐模块
- 展示位置：首页瀑布流
- 展示数量：20个商品
- 数据来源：用户历史行为
- 算法：协同过滤
- 更新频率：每天一次
- 成功指标：点击率 > 3%
```

**三个月后的问题**：
- 推荐大量已购买商品
- 价格区间与用户消费能力不匹配
- 新用户推荐质量极差
- 无法解释为什么推荐某商品

### Product Intent 重构

```yaml
product_intent:
  id: RECOMMENDATION-HOME-001
  name: 首页个性化发现
  
  business_intent:
    problem: 用户难以从海量商品中发现感兴趣的商品
    opportunity: 通过个性化推荐提升发现效率和购买转化
    success_metrics:
      - metric: 推荐位点击率
        target: "> 8%"
        measurement: 7日滚动平均
      - metric: 推荐商品GMV占比
        target: "> 35%"
      - metric: 用户满意度（调研）
        target: "> 4.2/5"
  
  user_intent:
    segments:
      new_users:
        goal: 快速了解平台，建立信任
        strategy: 热门 + 多样性 + 低客单价商品
      returning_users:
        goal: 发现新品，提升复购
        strategy: 个性化 + 补货提醒 + 关联推荐
      high_value_users:
        goal: 高效找到想要的商品
        strategy: 精准匹配 + 高品质筛选
  
  functional_intent:
    core_capabilities:
      - name: 用户画像构建
        inputs: [浏览, 点击, 加购, 购买, 收藏]
        freshness: 实时更新
      - name: 商品召回
        methods: [向量相似度, 协同过滤, 热门趋势]
        coverage: "> 95% 商品池"
      - name: 个性化排序
        factors: [相关性, 多样性, 新鲜度, 利润]
        latency: "< 50ms"
    
    constraints:
      - 不展示已购买商品（除非可复购）
      - 价格区间匹配用户历史消费层级
      - 库存实时同步，不展示缺货商品
      - 新用户冷启动：前3次推荐用热门策略过渡
  
  constraint_intent:
    hard:
      - 隐私：不使用站外数据
      - 公平：不因性别/地域歧视性推荐
      - 准确：价格、库存、优惠必须实时准确
    soft:
      - 可解释：能够提供推荐理由
      - 可控：用户可标记"不感兴趣"
  
  evolution_intent:
    feedback_loop:
      signals: [点击, 购买, 跳过, 负反馈]
      model_update: 每日增量 + 每周全量
    
    experimentation:
      a_b_test: 持续运行至少1个实验
      metrics: [CTR, CVR, 长期留存]
    
    monitoring:
      alerts:
        - CTR 环比下降 > 20%
        - 推荐商品缺货率 > 5%
        - 用户负反馈率 > 1%
```

### 实施结果对比

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

## 六、写在最后：产品管理者的角色进化

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

这就是 Product Intent 的意义。

---

## 📚 延伸阅读

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
