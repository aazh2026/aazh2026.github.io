---
layout: post
title: "TDD vs Intent-Driven Development"
date: 2025-04-26T00:00:00+08:00
tags: [TDD, Intent-Driven Development, AI开发, 软件方法论]
author: "@postcodeeng"
series: aise
description: "TDD在AI时代面临天花板，测试代码量是业务代码的3-5倍。Intent-Driven Development通过结构化SID文档和AI生成实现4倍效率提升，核心是验证意图正确性而非代码行为。"

redirect_from:
  - /tdd-intent-driven.html
---

> **TL;DR**
> 
> 本文核心观点：
> 1. **TDD有天花板** — 测试编写成本3-5倍于业务代码，边际收益递减
> 2. **AI生成代码的悖论** — 高覆盖率(90%+)但高Bug率，测试"自圆其说"
> 3. **IDD新范式** — 从"测试代码行为"到"验证意图正确性"
> 4. **效率提升4x** — IDD方式1小时完成，TDD方式4小时

---

## TDD的黄金时代与局限性

### TDD的核心价值

**红-绿-重构循环**：
> 💡 **Key Insight**
> 
> TDD的核心价值：设计驱动 + 快速反馈 + 重构安全网

### TDD的成功案例

- **JUnit** — Kent Beck用TDD开发，成为Java标准
- **Rails框架** — 内建测试支持，测试文化
- **GitHub** — 数万测试用例，CI/CD依赖

### TDD的局限性

**核心问题**：
- 测试代码量 : 业务代码量 = **3:1 到 5:1**
- 代码变，测试必须跟着变
- 测试通过 ≠ 没有Bug（只覆盖已知场景）

---

## AI生成代码的悖论

### AI代码的特点

| 特点 | 表现 |
|------|------|
| **生成速度** | 30秒生成10个函数+测试 |
| **测试覆盖率** | 90%+ |
| **Bug率** | 比人工代码还高 |

### 悖论：高覆盖率 + 高Bug率

**原因1：测试"自圆其说"**
**原因2：覆盖代码路径，不覆盖业务场景**
**原因3：边界条件不完整**
- AI测试了：1001、1000、999
- AI漏掉了：负数、零值、极大值、None

### TDD的困境

- AI 30秒生成代码，人工30分钟写测试
- 测试无法验证AI的"意图正确性"
- 测试维护成本爆炸

---

## Intent-Driven Development：新范式

<object data="/assets/images/2025-04-26-tdd-idd-01-comparison.svg" type="image/svg+xml" width="100%" aria-label="Intent-Driven Development：新范式" role="img"></object>

### 从TDD到IDD

| 维度 | TDD | IDD |
|------|-----|-----|
| **关注点** | 代码行为是否符合预期 | 代码是否准确表达业务意图 |
| **驱动源** | 测试用例 | 业务意图文档 |
| **测试编写** | 人工编写 | AI生成 + 人工审查 |
| **适用场景** | 人工编码 | AI辅助/生成编码 |

### IDD的核心概念

**1. 业务意图（Business Intent）**

不是"计算折扣"，而是：
**2. 意图验证（Intent Verification）**

验证：
- 代码是否实现了所有业务规则？
- 是否处理了所有边界条件？
- 是否满足性能约束？

<object data="/assets/images/2025-04-26-tdd-intent-driven-02-idv-loop.svg" type="image/svg+xml" width="100%" aria-label="Intent Verification Loop" role="img"></object>

### IDD开发流程

IDD的核心是一个**结构化的三步循环**，与TDD的红-绿-重构循环形成鲜明对比。

**第一步：编写结构化SID。** 开发者从业务意图出发，编写一份结构化意图文档（Structured Intent Document，简称SID）。SID不描述"如何计算折扣"，而是用精确的字段记录业务规则、约束条件和边界情况。这份文档是开发者和AI之间共享的合同，是后续所有工作的锚点。

**第二步：AI生成代码。** 将SID作为上下文注入AI prompt，AI根据SID生成对应的实现代码。每一条SID字段都映射到具体的函数或逻辑分支——这是"意图到代码的生成"阶段。与TDD要求人工编写测试不同，这里的代码和测试都是由AI在SID的约束下生成的。

**第三步：意图验证引擎检查。** 生成的代码进入Intent Verification Engine，由独立的grader按照SID定义的rubric逐项打分。任何未覆盖的业务规则或未处理的边界条件都会触发失败，失败信号直接反馈回第二步，触发新一轮修正循环。

这个循环的停止条件不是"测试通过"，而是"所有业务意图都被满足"。一旦验证通过，代码就可以进入下一阶段。

## IDD的技术实现

### 技术1：结构化意图文档（SID）

SID是IDD的核心工件，它将模糊的业务描述转化为机器可解析、AI可执行的结构化文档。每一份SID必须包含四个必填字段：**意图陈述（Intent Statement）** 用一句话说明业务目标是什么；**前置条件（Preconditions）** 列出调用该功能前的系统状态；**后置条件（Postconditions）** 定义功能完成后系统必须满足的状态；**示例用例（Example Cases）** 提供具体输入输出的数值例子。

以订单折扣系统为例，TDD会写"测试满100减20的逻辑"，而SID会这样写：

> **意图陈述**：当订单金额达到100元时，应用20元折扣
> **前置条件**：订单状态为"待支付"，用户未使用其他优惠
> **后置条件**：订单应付金额减少20元，折扣记录写入日志
> **示例用例**：输入金额100元，输出折后价80元；输入99元，输出99元（不打折）

这份SID既是一份规格说明，也是一份AI可以理解的prompt上下文。与TDD的测试用例相比，SID描述的是业务意图本身，而不是代码行为——这正是IDD与TDD的本质区别。

### 技术2：意图到代码的生成

SID的真正威力在于作为AI prompt的上下文。将完整的SID注入prompt后，AI不再是随机生成代码，而是在"合同约束"下生成。每个SID字段都映射到具体的函数或逻辑分支，AI的输出是可预期的、可验证的。

这一步的关键不在于"让AI写代码"，而在于**用结构化意图约束AI的输出空间**。AI收到的不再是"帮我写一个折扣函数"，而是"根据以下业务规则、前置条件、后置条件和示例用例，生成满足所有约束的实现代码"。这个差别就是"意图驱动"和"Prompt驱动"的核心差异。

### AI Prompt

以下是一份注入SID后的完整AI prompt示例：

```text
你是一个订单折扣系统的实现者。请根据以下结构化意图文档（ SID）生成代码。

【意图陈述】
当订单金额达到100元时，应用20元折扣；金额不满100元不打折。

【前置条件】
- 订单状态为"待支付"
- 用户未使用其他优惠

【后置条件】
- 订单应付金额减少20元
- 折扣记录写入日志

【示例用例】
- 输入金额100元，输出折后价80元
- 输入99元，输出99元（不打折）
- 输入150元，输出130元
- 输入负数或零，返回原价

请生成Python实现，要求包含类型注解和单元测试。
```

### AI输出

以下是AI根据上述SID生成的代码：

```python
from dataclasses import dataclass
from enum import Enum
from typing import Optional

class OrderStatus(Enum):
    PENDING = "待支付"
    PAID = "已支付"

@dataclass
class Order:
    amount: float
    status: OrderStatus
    discount_used: bool = False

def apply_discount(order: Order) -> float:
    """当订单金额 >= 100 时，应用 20 元折扣"""
    if order.status != OrderStatus.PENDING:
        raise ValueError("订单状态必须为待支付")
    if order.discount_used:
        raise ValueError("用户已使用其他优惠")
    if order.amount <= 0:
        return order.amount  # 负数或零返回原价
    if order.amount < 100:
        return order.amount
    discount = 20.0
    print(f"折扣记录：减免 {discount} 元")
    return order.amount - discount
```

这段代码的每一个分支都可以回溯到SID中的对应字段——意图陈述决定了函数逻辑，前置条件在入口处校验，后置条件通过返回值和日志体现，示例用例则映射到具体的测试分支。这就是"意图到代码的生成"的工作方式。
### 技术3：意图验证引擎

意图验证引擎是IDD的核心质量门禁。当AI根据SID生成代码后，引擎会自动运行一组验证项：前置条件是否在入口处被校验、后置条件是否通过返回值或副作用得到保证、示例用例中的每一组输入输出是否都能被代码正确处理。任何一项失败都会阻止代码进入下一阶段，确保"意图满足"不是一句空话。

### 技术4：意图保持监控

运行时监控代码行为是否持续符合预设意图。当业务规则或边界条件在运行时被违背时，系统立即触发告警而非等到用户发现Bug。这一机制弥补了传统测试"只验一次"的缺陷，让意图验证成为一个持续的过程而非一次性的检查。

---

## 实战：TDD vs IDD

### 场景：订单折扣系统

**TDD方式**（4小时）：人工编写测试用例，手动覆盖折扣逻辑的不同场景，从写测试到重构代码需要完整走完红-绿-循环，边界条件需要逐一补充。

**IDD方式**（1小时）：只需编写SID并注入AI prompt，代码与测试均由AI生成，意图验证引擎自动检查覆盖完整性，效率提升约4倍。

### 对比数据

| 指标 | TDD | IDD | 提升 |
|------|-----|-----|------|
| **开发时间** | 4小时 | 1小时 | **4x** |
| **业务规则覆盖** | 60% | 90%+ | **50%** |
| **边界条件覆盖** | 40% | 85% | **110%** |
| **维护成本** | 高 | 中 | **-40%** |

---

## 写在最后：范式转移的意义

### IDD不是取代TDD，是升级TDD

**继承的核心价值**：
- ✅ 快速反馈
- ✅ 设计驱动
- ✅ 安全网

**解决的痛点**：
- ✅ 测试编写成本高 → AI生成
- ✅ 测试维护成本高 → 意图稳定
- ✅ 无法验证AI代码 → 意图验证

### Takeaway

| 传统开发 | AI-Native开发 |
|---------|--------------|
| 开发者 = 代码工人 | 开发者 = **意图架构师** |
| 写代码 + 写测试 | 定义意图 + 审查AI |
| 关注"怎么做" | 关注"做什么" + "为什么" |
| 80%时间写代码 | 80%时间设计意图 |

### 软件工程演进脉络

> 💡 **Key Insight**
> 
> 每一代范式都解决了当时的关键问题：
> - TDD解决了快速迭代中的质量保证
> - **IDD解决了AI生成代码的意图验证**

### 最终判断

**TDD不会被杀死，但会被IDD增强。**

未来软件开发：
- **20%**：人工写的核心算法（TDD方式）
- **80%**：AI生成的业务代码（IDD方式）

这就是AI-Native软件工程的形态。

---

## 📚 延伸阅读

**理论基础**
- Kent Beck《Test-Driven Development》
- Dan North《Introducing BDD》
- Gojko Adzic《Specification by Example》

**相关技术**
- Property-Based Testing（基于属性的测试）
- Design by Contract（契约式设计）
- Formal Methods（形式化方法）

---

*AI-Native软件工程系列 #02*
*深度阅读时间：约 20 分钟*
