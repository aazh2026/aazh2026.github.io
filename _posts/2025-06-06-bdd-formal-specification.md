---
layout: post
title: "\"BDD语义化升级：Gherkin到形式化规格的自动转换\""
date: 2025-06-06T00:00:00+08:00
tags: [AI-Native软件工程, BDD, Gherkin, 形式化规格, 规格即代码]
author: "@postcodeeng"
series: AI-Native软件工程系列 #4
---

> **TL;DR**
>
> 本文核心观点：
> 1. **Gherkin的局限** — 自然语言描述的验收标准存在歧义，无法自动验证
> 2. **形式化规格** — 用数学精确描述行为，实现真正的可执行规格
> 3. **AI桥梁** — LLM可以将自然语言Gherkin自动转换为形式化表达
> 4. **闭环验证** — 规格生成代码，代码反验证规格，形成自洽系统

<object data="/assets/images/2025-06-06-bdd-formal-specification-01-overview.svg" type="image/svg+xml" width="100%"></object>

---

## Gherkin的天花板

> 💡 **Key Insight**
> 
 Gherkin让非技术人员能读验收标准，但"能读"不等于"能精确执行"。自然语言的模糊性是系统Bug的重要来源。

### 经典Gherkin示例

**看起来清晰，但魔鬼在细节：**

| 模糊点 | 可能解释A | 可能解释B | 可能解释C |
|--------|----------|----------|----------|
| "VIP客户" | 积分≥1000 | 购买过3次以上 | 订阅了会员服务 |
| "$100的商品" | 原价$100 | 折扣前$100 | 一件商品$100 |
| "支付$90" | 最终金额$90 | 折扣$10 | 还需加税 |
| "VIP" | 终身VIP | 当月VIP | 特定等级VIP |

这些歧义在实际开发中需要反复确认，每次确认都是时间和认知成本。

举一个购物车结算的场景：

```gherkin
Scenario: VIP客户下单
  Given 用户"张三"是VIP客户
    And 张三的购物车中有商品A（标价$100）
  When 张三使用支付$90购买商品A
  Then 订单应该成功
```

这句话里，四处模糊全部被命中。"VIP客户"是哪一种？"$100"是原价还是折后价？"支付$90"是最终实付金额，还是享受了$10的折扣？"订单成功"是否包含了库存真正被扣减？同一个 scenario，业务方、开发、测试三方可能各读出完全不同的执行路径。开发按"VIP=当月订阅"实现，测试按"VIP=积分≥1000"设计用例，上线后发现张三是终身VIP但从未订阅，库存超卖了。

这种歧义不是个例。在真实项目中，每一个模糊点都会在 code review、QA 对齐、product owner 确认之间消耗 3-4 小时。形式化规格的目标，就是把这些歧义在写 Gherkin 之前就消除掉。

### 为什么模糊性是问题

**每次模糊点平均消耗3-4小时。**

这 3-4 小时花在哪里？以一个"VIP客户"的歧义为例：

**第一小时：发现歧义。** 测试发现同样的 scenario 通过了，但产品说这不是他想要的。开发说"你需求里没写清楚"。这时才意识到"VIP"的定义有分歧。

**第二小时：对齐定义。** 产品经理拉会，讨论"VIP"到底是积分门槛、订阅状态还是购买次数。会议结束后选了一个定义，但没有人更新文档。

**第三小时：更新文档与重新测试。** 需求文档更新了，测试用例需要重新设计，已经写好的自动化脚本也要改。整个团队同步这一处变更。

**第四小时：后续回归。** 上游改动影响了另一个模块，又发现了新的歧义——这时才发现"VIP"的定义在不同上下文里还不一致。

每一次"沟通成本"都是这样累积的。认知成本是隐性的，团队往往在项目 retrospect 才发现"我们讨论这个问题花了多少时间"。形式化规格的作用，是把"定义"写在校验工具能读的地方，让歧义在运行之前就被发现，而不是在 code review 里被吵出来。

---

## 形式化规格入门

> 💡 **Key Insight**
> 
 形式化规格不是给机器看的，而是给**所有人**一个无可争议的事实来源。数学是唯一的通用语言。

### 什么是形式化规格

用数学符号精确描述系统行为，消除所有自然语言歧义。

**非形式化：** 用自然语言描述系统行为。这是我们最熟悉的方式——PRD、用户故事、会议记录都是这个形式。优点是所有人都能读，缺点是不同人读出不同意思，无法自动验证。"用户必须已登录"就是典型的非形式化描述。

**半形式化（结构化）：** 用伪代码或结构化模板表达系统行为。比自然语言更精确，但仍然依赖人的解读。Dafny 的合约、OpenAPI 规范、UML 图都属于这一层。"`requires: x > 0; ensures: result > 0`"是半形式化的典型写法，机器可以检查前置条件是否满足，但语义仍由人来保证。

**完全形式化（数学表达式）：** 用严格的数学符号描述系统行为。谓词逻辑、时序逻辑、状态机等都属于这一层。优点是绝对精确，缺点是学习曲线陡峭。"用户必须已登录"的形式化表达是：`∀s ∈ Session: logged_in(s) = true`，含义是"对于所有会话状态，会话都是已登录的"，没有第二种解释。
### 常用形式化方法

| 方法 | 适用场景 | 示例 |
|------|----------|------|
| **谓词逻辑** | 状态约束 | `∀x (P(x) → Q(x))` |
| **时序逻辑** | 事件顺序 | `◇(A ∧ ○B)` 最终A且接下来B |
| **状态机** | 状态转换 | `State × Event → State` |
| **代数规格** | 数据结构 | `push(pop(stack)) = stack` |
| **合约式** | 前置/后置条件 | `requires: x > 0; ensures: result > 0` |

### TLA+示例：简单规格

以下是一个完整的 TLA+ 规格，对应"并发订单不超卖"场景——库存有 10 件，100 个用户同时下单，最终成功订单不超过 10 件：

```tla
---- MODULE CartInventory ----
CONSTANT MaxInventory

VARIABLES inventory, orders

\* 初始化：库存为 MaxInventory，订单为空
Init ==
    /\ inventory = MaxInventory
    /\ orders = {}

\* 下单操作：库存足够时，允许创建订单
PlaceOrder ==
    /\ inventory > 0
    /\ \E order_id \in 1..100:
        orders' = orders \cup {
            [id |-> order_id, qty |-> 1, status |-> "pending"]
        }
    /\ inventory' = inventory - 1

\* 全局不变式：成功订单总数不超过初始库存
InventoryInvariant ==
    \A o \in orders: o.status = "success"
        => Cardinality({x \in orders: x.status = "success"}) <= MaxInventory

\* 规格的 Next 动作
Next ==
    \E order_id \in 1..100:
        /\ inventory > 0
        /\ orders' = orders \cup {
            [id |-> order_id, qty |-> 1, status |-> "success"]
          }
        /\ inventory' = inventory - 1
====

```

`MaxInventory` 是常量，在 TLC 模型检查时设为 10。`PlaceOrder` 是 PlusCal 算法里的原子动作，对应"检查库存 → 扣减库存 → 记录订单"的三步合一。`InventoryInvariant` 是全局不变式：任何成功订单，总数都不超过初始库存。

TLC 模型检查器会穷举所有可能的状态空间，验证：
1. **死锁自由**——任何状态下至少有一个动作可以执行，系统不会卡住
2. **不变式保持**——`InventoryInvariant` 在所有可达状态上都为真
3. **有界性**——状态空间是有限的（订单数有上限）

这个规格的验证时间通常在秒级，即使穷举了 100 个并发订单的所有可能组合。

---

## AI自动转换

> 💡 **Key Insight**
> 
 LLM的强项是理解自然语言，形式化方法的强项是精确表达。两者结合：LLM将Gherkin翻译为形式化规格，再翻译为可执行代码。

### 转换Pipeline

<object data="/assets/images/2025-06-06-bdd-formal-specification-02-closed-loop.svg" type="image/svg+xml" width="100%"></object>

<object data="/assets/images/2025-06-06-bdd-formal-specification-02-toolchain.svg" type="image/svg+xml" width="100%"></object>

<object data="/assets/images/2025-06-06-bdd-formal-specification-01-pipeline.svg" type="image/svg+xml" width="100%"></object>
---

## 工具链实践

> 💡 **Key Insight**
> 
 形式化方法不是银弹，但结合AI后，它可以成为日常工程工具。关键是选择合适的工具级别。

### 工具选择矩阵

| 复杂度 | 工具 | 学习成本 | 适用场景 |
|--------|------|----------|----------|
| 低 | Dafny/Contracts | 1周 | 单个函数验证 |
| 中 | Alloy | 2-4周 | 数据结构/状态机 |
| 高 | TLA+ | 1-3月 | 分布式系统 |
| 超高 | Coq/Isabelle | 数月 | 安全关键系统 |

### AI增强BDD工具链

完整的 AI 增强 BDD 工具链分为五层，每一层都有 AI 可以加速的节点：

**第一层：Gherkin 解析。** cucumber-json 或 gherkin-lint 将 .feature 文件解析为结构化 JSON，提取 Scenario、Step、Tag 元信息。这一层 AI 用于自动检测 Gherkin 语法歧义（比如同一条 Step 有多个不同的 DocString）。

**第二层：LLM 翻译层。** Prompt 工程将 JSON 转换为形式化规格。根据工具选择矩阵，低复杂度的用 Dafny 合约（学习成本 1 周），中等的用 Alloy（2-4 周），高复杂的用 TLA+（1-3 月）。Prompt 里需要包含目标语言的 schema 约束，让 LLM 输出符合语法规范的代码。

**第三层：形式化规格导出。** 第二层的输出写入 .tla / .dfy / .als 文件，触发对应的类型检查器（TLC / Dafny verifier / Alloy）验证语法和基本性质。这一层 AI 负责根据错误信息修复形式化规格中的语法错误，通常 1-2 轮迭代可以收敛。

**第四层：代码生成。** 形式化规格通过 Coq 代码生成插件或 TLA+ Refinement 关系生成实现代码。Dafny 的 `method` 可以直接编译到 C# / Java / Go。这一层 AI 辅助将形式化规格映射到目标语言的实现模式，填补"规格说做什么，代码说怎么做"之间的空白。

**第五层：模型检查集成。** TLC / Alloy Analyzer 运行不变式验证，输出反例（counterexample）时，AI 负责将反例翻译为人类可读的调试报告，指出是规格的哪个操作序列导致了不变式违反。

关键洞察：AI 介入的程度逐层递减。第一层歧义检测 AI 效果最好，因为歧义检测本质上是模式识别；第三层语法修复 AI 效果次之，因为错误信息是结构化的；第四层代码生成 AI 效果最弱，因为形式化到实现的映射往往需要领域知识，没有足够样本让 LLM 泛化。

### 渐进式采用策略

**阶段1：增强Gherkin（1-2周）**
- 使用结构化Given-When-Then
- 添加显式约束注释
- AI辅助歧义检测

**阶段2：轻量形式化（1-2月）**
- 关键业务流程使用合约式编程
- 生成运行时断言
- 边界条件自动枚举

**阶段3：模型检查（3-6月）**
- 核心状态机使用TLA+
- 并发场景模型验证
- 规格-代码一致性检查

---

## 结尾
### 🎯 Takeaway

| 传统BDD | AI增强BDD |
|--------|----------|
| Gherkin是终点 | Gherkin是起点 |
| 自然语言描述 | 自然语言 → 形式化规格 → 代码 |
| 人工验证 | 自动模型检查+运行时验证 |
| 测试与规格分离 | 规格即测试，测试即规格 |
| 歧义靠沟通解决 | 歧义靠形式化消除 |

BDD的初衷是让业务、开发、测试三方对齐。形式化规格让这种对齐**可验证、可自动化**。

AI不是取代BDD，而是让BDD从"行为驱动开发"进化为"**行为驱动工程**"——从想法到可验证的实现，端到端自动化。

> "规格越精确，实现越自由。形式化不是束缚，而是给创造力明确的边界。"

---

## 📚 延伸阅读

**经典案例**
- AWS使用TLA+验证S3和DynamoDB核心算法：形式化方法在大规模系统的实践
- Microsoft的Dafny项目：合约式编程的生产环境应用

**本系列相关**
- [TDD的死亡与重生](#) (第1篇)
- [SDD 2.0：用户故事的Prompt工程化](#) (第2篇)
- [DDD meets LLM](#) (第3篇)

**学术理论**
- 《Specifying Systems》(Leslie Lamport): TLA+权威教材
- 《Software Abstractions》(Daniel Jackson): Alloy方法指南
- 《The B-Method》(Abrial): 形式化方法经典
- 《Design by Contract》(Bertrand Meyer): 合约式设计奠基论文

---

*AI-Native软件工程系列 #4*
*深度阅读时间：约 14 分钟*
