---
layout: post
title: "AI时代PRD长什么样？——从文档到Executable Specification"
date: 2026-03-09T08:00:00+08:00
tags: [Executable PRD, 需求工程, AI-Native, 产品文档, 范式转移]
author: Aaron
series: AI-Native软件工程

redirect_from:
  - /2026/03/09/executable-prd.html
---

# AI时代PRD长什么样？——从文档到Executable Specification

> *「2025年，产品经理Alice的PRD被AI直接编译成了可运行的代码。不是生成代码框架，是真正的业务逻辑、数据库Schema、API接口、前端页面。她的PRD不再是'给工程师看的文档'，是'产品的源代码'。这就是Executable Specification的时代。」*

---

## 一、传统PRD的困境

### PRD是什么？

**Product Requirements Document（产品需求文档）**，产品经理的核心产出，用来描述：
- 产品要解决什么问题
- 目标用户是谁
- 功能需求是什么
- 业务流程如何
- 验收标准怎样

### 传统PRD的典型结构

```
PRD-用户下单功能-v1.2.docx

1. 背景与目标
   - 提升移动端下单转化率
   - 目标：从15%提升到25%

2. 用户故事
   - 作为用户，我希望一键下单，以便快速完成购买

3. 功能需求
   3.1 商品选择
       - 用户可以从购物车选择商品
       - 支持批量选择
   
   3.2 地址填写
       - 自动填充默认地址
       - 支持新增地址
   
   3.3 支付方式
       - 支持微信支付、支付宝、信用卡
   
   3.4 订单确认
       - 显示订单摘要
       - 显示预计送达时间

4. 业务流程
   [流程图]

5. 验收标准
   - 下单流程3步完成
   - 页面加载时间<2秒
   - 支付成功率>99%

6. 界面原型
   [Figma链接]
```

### 传统PRD的困境

**困境1：文档与实现的鸿沟**

```
产品经理写PRD（1周）
    ↓
工程师阅读PRD（2天）
    ↓
工程师理解有误，需要澄清（1天）
    ↓
工程师开始开发（2周）
    ↓
开发完成，产品经理验收（2天）
    ↓
发现与预期不符，修改（1周）
```

**总周期：5-6周**

**问题**：自然语言的歧义性导致理解偏差。

**困境2：PRD的维护成本**

```
场景：需求变更

传统流程：
1. 产品经理修改PRD
2. 通知相关工程师
3. 工程师修改代码
4. 测试人员修改测试用例
5. 文档人员更新文档

问题：
- PRD修改了，代码改了，测试改了，文档改了
- 但它们之间没有自动关联
- 经常出现"改了A忘改B"
```

**困境3：PRD的不可执行性**

```
PRD描述："用户下单后，系统应该发送确认邮件"

问题：
- 邮件什么时候发？（同步？异步？）
- 邮件发送失败怎么办？
- 邮件内容模板在哪里？
- 如何测试这个功能？

PRD无法回答这些问题，需要在开发阶段补充。
```

**困境4：AI时代的加速困境**

```
AI可以10秒生成代码
    ↓
但产品经理需要1周写PRD
    ↓
PRD成为瓶颈
```

AI加速了代码生成，但需求定义的速度没有跟上。

---

## 二、Executable Specification：新范式

### 什么是Executable Specification？

**Executable Specification（可执行规格说明）**：

一种结构化的、机器可读的、可直接编译为可运行代码的产品需求描述。

不是"给工程师看的文档"，是"产品的源代码"。

### Executable PRD vs 传统PRD

| 维度 | 传统PRD | Executable PRD |
|------|---------|----------------|
| 格式 | 自然语言文档 | 结构化代码/配置 |
| 读者 | 人类工程师 | 人类 + AI/机器 |
| 歧义性 | 高 | 低（结构化） |
| 可执行性 | 否 | 是 |
| 维护成本 | 高（多份文档） | 低（单一真相源） |
| 与代码关系 | 分离 | 一体 |

### Executable PRD的核心理念

**核心理念1：需求即代码**

```
传统：
PRD → 工程师理解 → 写代码

Executable：
PRD（可执行格式）→ AI编译 → 可运行代码
```

**核心理念2：单一真相源**

```
传统：
PRD.docx + 代码 + 测试 + 文档 = 多个版本，容易不一致

Executable：
PRD.spec = 需求 + 生成代码 + 生成测试 + 生成文档
```

**核心理念3：意图显式化**

```
传统：
"用户下单后发送确认邮件"
（隐含了很多假设）

Executable：
spec:
  trigger: order.completed
  action: send_email
  template: order_confirmation
  async: true
  retry: 3
  fallback: log_error
（所有细节都显式定义）
```

---

## 三、Executable PRD的技术实现

### 格式：结构化需求语言

**示例：用户下单功能**

```yaml
# order_feature.spec

spec_id: ORDER-001
name: 用户下单功能
description: 移动端一键下单，提升转化率

business_goals:
  - metric: conversion_rate
    current: 15%
    target: 25%
    timeline: Q2-2025

user_stories:
  - id: US-001
    role: 注册用户
    action: 一键下单
    benefit: 快速完成购买
    acceptance_criteria:
      - steps_count: 3
      - max_time: 60s
      - success_rate: >99%

entities:
  Order:
    fields:
      - name: id
        type: uuid
        required: true
      - name: user_id
        type: reference
        ref: User
        required: true
      - name: items
        type: array
        item_type: OrderItem
        required: true
      - name: total_amount
        type: decimal
        precision: 10
        scale: 2
        required: true
      - name: status
        type: enum
        values: [pending, paid, shipped, delivered, cancelled]
        default: pending
      - name: created_at
        type: timestamp
        auto: true
    
    business_rules:
      - rule_id: BR-001
        name: 库存检查
        condition: order.status == 'pending'
        action: check_inventory
        error_message: "商品库存不足"
      
      - rule_id: BR-002
        name: 价格计算
        condition: order.items.changed
        action: recalculate_total
      
      - rule_id: BR-003
        name: VIP折扣
        condition: user.tier == 'VIP' AND order.total >= 1000
        action: apply_discount(0.2)
        max_discount: 500

workflows:
  - id: WF-001
    name: 标准下单流程
    steps:
      - step: 1
        name: 选择商品
        ui: ProductSelectionScreen
        validations:
          - inventory > 0
          - price > 0
      
      - step: 2
        name: 确认地址
        ui: AddressConfirmationScreen
        data: user.default_address
        fallback: AddressInputScreen
      
      - step: 3
        name: 选择支付
        ui: PaymentMethodScreen
        options: [wechat, alipay, credit_card]
      
      - step: 4
        name: 订单确认
        ui: OrderSummaryScreen
        actions:
          - confirm: submit_order
          - cancel: abort
    
    post_actions:
      - action: send_confirmation_email
        async: true
        template: order_confirmation
        delay: 0
      
      - action: notify_inventory_system
        async: true
        event: order.created

apis:
  - path: /api/v1/orders
    method: POST
    description: 创建订单
    request:
      body: OrderCreateRequest
    response:
      success: Order
      error: OrderError
    rate_limit: 100/minute

ui:
  screens:
    - id: ProductSelectionScreen
      components:
        - type: ProductList
          data: cart.items
          actions:
            - select: add_to_order
        - type: Button
          text: "下一步"
          action: next_step
    
    - id: OrderSummaryScreen
      components:
        - type: OrderDetail
          data: order
        - type: PriceBreakdown
          items:
            - subtotal
            - discount
            - shipping
            - total
        - type: ButtonGroup
          buttons:
            - text: "确认下单"
              type: primary
              action: submit_order
            - text: "取消"
              type: secondary
              action: cancel

tests:
  - id: TEST-001
    name: 正常下单流程
    steps:
      - action: select_product
        params: { product_id: "P001", quantity: 2 }
      - action: confirm_address
      - action: select_payment
        params: { method: "wechat" }
      - action: submit_order
    expected:
      - order.status == 'pending'
      - email.sent == true
      - inventory.updated == true
  
  - id: TEST-002
    name: 库存不足场景
    steps:
      - action: select_product
        params: { product_id: "P002", quantity: 100 }
    expected:
      - error.code == 'INSUFFICIENT_INVENTORY'
      - error.message == '商品库存不足'

constraints:
  performance:
    - metric: page_load_time
      threshold: 2s
      priority: high
    - metric: api_response_time
      threshold: 500ms
      percentile: 95
  
  security:
    - requirement: input_validation
      scope: all_user_inputs
    - requirement: rate_limiting
      scope: order_creation
```

### 编译：从PRD到可运行系统

**编译流程**：

```
order_feature.spec
    ↓
Spec Compiler
    ↓
├─ Database Schema (SQL)
├─ API Definition (OpenAPI)
├─ Business Logic (Python/Java)
├─ UI Components (React/Vue)
├─ Test Cases (Jest/PyTest)
└─ Documentation (Markdown)
```

**编译示例**：

```yaml
# 输入：Entity定义
entities:
  Order:
    fields:
      - name: id
        type: uuid
      - name: total_amount
        type: decimal
        precision: 10
        scale: 2
```

```sql
-- 输出：数据库Schema
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total_amount DECIMAL(10, 2) NOT NULL,
    -- ...
);
```

```python
# 输出：业务模型
class Order(BaseModel):
    id: UUID
    total_amount: Decimal = Field(max_digits=10, decimal_places=2)
    # ...
```

```typescript
// 输出：TypeScript类型
interface Order {
    id: string;
    total_amount: number;
}
```

### 可执行性：PRD即测试

```yaml
tests:
  - id: TEST-001
    name: 正常下单流程
    steps:
      - action: select_product
        params: { product_id: "P001", quantity: 2 }
      - action: confirm_address
      - action: select_payment
        params: { method: "wechat" }
      - action: submit_order
    expected:
      - order.status == 'pending'
      - email.sent == true
```

```python
# 生成的测试代码
class TestOrderWorkflow(unittest.TestCase):
    def test_normal_order_flow(self):
        # Step 1: 选择商品
        self.select_product(product_id="P001", quantity=2)
        
        # Step 2: 确认地址
        self.confirm_address()
        
        # Step 3: 选择支付
        self.select_payment(method="wechat")
        
        # Step 4: 提交订单
        order = self.submit_order()
        
        # 验证
        self.assertEqual(order.status, 'pending')
        self.assertTrue(email_service.sent)
```

---

## 四、Executable PRD的工作流程

### 新范式的工作流程

```
产品经理编写Executable PRD（结构化规格）
    ↓
AI编译器生成代码、测试、文档（分钟级）
    ↓
产品经理验证生成的系统（交互式）
    ↓
反馈循环，调整PRD（快速迭代）
    ↓
工程师审查和优化（关注架构和质量）
    ↓
部署上线
```

**周期：1-2天**（vs 传统5-6周）

### 各角色的转变

**产品经理**：
- **从**：写文档给工程师看
- **到**：写可执行的规格说明
- **技能**：结构化思维、业务规则建模

**工程师**：
- **从**：根据PRD写代码
- **到**：审查AI生成的代码，关注架构和边界情况
- **技能**：架构设计、代码审查、性能优化

**AI的角色**：
- **编译器**：将Executable PRD编译为代码
- **验证器**：自动测试和验证
- **助手**：解释规格、建议改进

---

## 五、实战：传统PRD vs Executable PRD

### 场景：优惠券功能

**传统PRD**：

```
优惠券功能PRD

背景：提升用户复购率

需求：
1. 用户可以领取优惠券
2. 用户可以在下单时使用优惠券
3. 优惠券有使用条件（满减、品类限制等）
4. 优惠券有过期时间

业务流程：
[流程图]

验收标准：
- 优惠券正确计算折扣
- 过期优惠券不能使用
- 一个订单只能使用一张优惠券
```

**问题**：
- "使用条件"具体是什么？
- 满减规则如何计算？
- 品类限制如何实现？
- 并发使用如何处理？

需要多次沟通才能明确。

**Executable PRD**：

```yaml
spec_id: COUPON-001
name: 优惠券系统

entities:
  Coupon:
    fields:
      - name: code
        type: string
        unique: true
      - name: type
        type: enum
        values: [percentage, fixed_amount]
      - name: value
        type: decimal
        validation: "> 0"
      - name: conditions
        type: json
        schema:
          min_order_amount: decimal?
          applicable_categories: array?
          applicable_products: array?
          user_tiers: array?
      - name: valid_from
        type: timestamp
      - name: valid_until
        type: timestamp
      - name: usage_limit
        type: integer
        default: 1
    
    business_rules:
      - rule_id: COUPON-R001
        name: 有效期检查
        condition: now() < coupon.valid_until
        error_message: "优惠券已过期"
      
      - rule_id: COUPON-R002
        name: 使用次数检查
        condition: coupon.usage_count < coupon.usage_limit
        error_message: "优惠券使用次数已达上限"
      
      - rule_id: COUPON-R003
        name: 订单金额门槛
        condition: |
          coupon.conditions.min_order_amount IS NULL 
          OR order.total >= coupon.conditions.min_order_amount
        error_message: "订单金额未达到优惠券使用门槛"
      
      - rule_id: COUPON-R004
        name: 品类限制
        condition: |
          coupon.conditions.applicable_categories IS NULL 
          OR order.items.all(item.category IN coupon.conditions.applicable_categories)
        error_message: "订单商品不符合优惠券适用范围"
      
      - rule_id: COUPON-R005
        name: 折扣计算
        action: |
          if coupon.type == 'percentage':
            discount = order.total * coupon.value
          else:
            discount = coupon.value
          return min(discount, order.total)  # 折扣不超过订单金额
      
      - rule_id: COUPON-R006
        name: 单订单限制
        condition: order.coupons.count == 0
        error_message: "一个订单只能使用一张优惠券"

workflows:
  - id: CLAIM-COUPON
    name: 领取优惠券
    steps:
      - validate_user_eligibility
      - check_coupon_availability
      - create_user_coupon_record
    
  - id: APPLY-COUPON
    name: 使用优惠券
    steps:
      - validate_coupon_validity
      - check_all_conditions
      - calculate_discount
      - apply_to_order
      - increment_usage_count

tests:
  - name: 满减优惠券正常使用
    given:
      coupon: { type: fixed_amount, value: 50, conditions: { min_order_amount: 200 } }
      order: { total: 250 }
    when: apply_coupon
    then:
      discount: 50
      final_amount: 200
  
  - name: 过期优惠券使用失败
    given:
      coupon: { valid_until: "2025-01-01" }
      current_date: "2025-02-01"
    when: apply_coupon
    then:
      error: "优惠券已过期"
  
  - name: 品类限制检查
    given:
      coupon: { conditions: { applicable_categories: ["electronics"] } }
      order: { items: [{ category: "clothing" }] }
    when: apply_coupon
    then:
      error: "订单商品不符合优惠券适用范围"
```

**优势**：
- 所有业务规则显式定义
- 条件、计算逻辑精确
- 自动生成测试
- 可直接编译运行

---

## 六、Executable PRD的挑战与应对

### 挑战1：学习曲线

**问题**：产品经理需要学习结构化规格语言

**应对**：
- 可视化编辑器（类似Figma但更结构化）
- AI辅助编写（自然语言→结构化规格）
- 培训渐进式迁移

### 挑战2：复杂度管理

**问题**：复杂系统的规格可能很长

**应对**：
- 模块化（像代码一样import/reuse）
- 分层（高层概览→低层细节）
- 版本控制（Git管理规格变更）

### 挑战3：与遗留系统集成

**问题**：已有系统不是Executable PRD生成的

**应对**：
- 逆向工程（从代码生成规格）
- 渐进式迁移
- 混合模式（部分用Executable，部分传统）

### 挑战4：AI编译器的成熟度

**问题**：AI生成的代码质量不稳定

**应对**：
- 人类审查环节（必须）
- 自动化测试（必须）
- 逐步提升AI能力

---

## 七、写在最后：从文档到源代码的范式转移

### 软件工程的历史脉络

```
1970s: 瀑布模型
       需求文档 → 设计文档 → 代码 → 测试
       
2000s: 敏捷开发
       用户故事 → 迭代开发 → 持续交付
       
2020s: Executable Specification
       可执行规格 ←→ 编译 ←→ 可运行系统
```

每一代范式都缩短了"想法"到"实现"的距离。

### Executable PRD的意义

**不是**：让产品经理取代工程师
**而是**：让产品经理和工程师在同一语言上协作

**不是**：完全自动化开发
**而是**：自动化重复性工作，人类专注于创造性工作

**不是**：消灭文档
**而是**：让文档变得可执行、可验证、可维护

### 未来展望

**短期（1-2年）**：
- Executable PRD工具成熟
- 早期采用者（创业公司、创新团队）
- 与现有开发流程混合使用

**中期（3-5年）**：
- 行业标准形成
- 主流企业采用
- 产品经理技能转型

**长期（5-10年）**：
- "写PRD"成为编程的一种形式
- 产品经理 = 产品架构师
- 开发效率10倍提升

### 给产品经理的建议

**1. 开始学习结构化思维**
- 不是"描述功能"，是"定义规格"
- 学习业务规则建模
- 学习状态机、工作流

**2. 拥抱Executable工具**
- 尝试现有的低代码/无代码平台
- 学习结构化规格语言
- 与工程师协作定义规格

**3. 成为产品架构师**
- 不仅关注用户体验，关注系统架构
- 不仅关注功能，关注业务规则
- 不仅关注现在，关注可扩展性

---

## 📚 延伸阅读

### 相关概念
- **BDD (Behavior-Driven Development)**: 行为驱动开发，Executable Spec的思想前身
- **DSL (Domain-Specific Language)**: 领域特定语言
- **Model-Driven Development**: 模型驱动开发
- **Low-Code/No-Code**: 低代码/无代码平台

### 技术基础
- **YAML/JSON Schema**: 结构化数据定义
- **OpenAPI Specification**: API规格标准
- **GraphQL Schema**: 数据模型定义
- **Protocol Buffers**: 结构化数据序列化

### 工具实践
- **Figma Dev Mode**: 设计到开发的桥梁
- **Storybook**: 组件驱动的UI开发
- **Swagger/OpenAPI**: API规格和文档
- **JSON Schema**: 数据验证和文档

---

*Published on 2026-03-09*  
*深度阅读时间：约 18 分钟*

**AI-Native软件工程系列 #04** —— 从PRD到Executable Specification的需求工程革命
