---
layout: post
title: "PRD的结构化转型：从Word到可执行的语义规格说明"
date: 2025-02-16T17:00:00+08:00
tags: [PRD, 需求工程, AI-Native, 可执行规格, 结构化文档, 产品管理]
author: Aaron

redirect_from:
  - /prd-structured-transformation.html
---

# PRD的结构化转型：从Word到可执行的语义规格说明

> *在AI生成代码的时代，最大的瓶颈不再是技术能力，而是需求表达的质量。当AI可以毫秒级生成代码时，一段模糊不清的PRD描述，可能导致数小时的返工；而一个结构化的、可执行的语义规格说明，则能让AI一次性产出可用的实现。这不是关于工具的讨论，而是关于思维方式的范式转移。*

---

## 问题的本质：Garbage In, Garbage Out

让我们从一个真实的场景开始。

某互联网公司的产品经理提交了一个PRD需求：

> **"用户可以在App上查看自己的订单历史。"**

这个描述看起来清晰，对吧？但当AI生成代码时，它面临无数未明确的决策点：

- 订单历史包含多久的记录？（最近30天？全部？可配置？）
- 排序规则是什么？（时间倒序？金额排序？可切换？）
- 支持分页吗？每页多少条？
- 异常场景如何处理？（空状态？网络错误？）
- 权限控制？（能看到别人的订单吗？管理员视角？）
- 数据实时性？（允许缓存吗？缓存多久？）

产品经理的脑海中可能有默认假设，但AI不知道。结果是：AI生成了一套代码，产品经理说"不是我要的"，工程师说"PRD没说清楚"，然后进入**需求澄清-重新生成-再次返工**的循环。

这就是**Garbage In, Garbage Out**在AI时代的具体表现。

### 传统PRD的系统性缺陷

传统PRD（基于Word、Confluence、飞书文档）在AI时代暴露出**结构性缺陷**：

**1. 自然语言的歧义性**
自然语言天生模糊。"快速加载"是多快？"用户友好"是什么标准？人类可以通过上下文和默契理解，但AI缺乏这种**共同背景**（Shared Context）。

**2. 静态文档的局限**
PRD写完后很少更新，但需求在演进。代码变了，测试变了，但PRD还是三个月前的版本。AI基于过时的PRD生成代码，结果必然偏差。

**3. 缺乏可验证性**
写完PRD后，怎么知道它"对"还是"错"？传统PRD没有**可执行性**——你不能运行它来验证是否符合预期。

**4. 追踪性断裂**
需求 → 设计 → 代码 → 测试，这条链路在传统PRD中是**隐式的、脆弱的**。当AI生成代码时，无法自动建立与原始需求的关联，导致可追溯性丢失。

**5. 人机协作的摩擦**
产品经理写PRD，工程师读PRD，AI基于PRD生成代码——三个人（产品、工程师、AI）对同一文档的理解可能完全不同。

---

## 解决方案：可执行的语义规格说明

解决这些问题的关键，是将PRD从**叙述性文档**转变为**结构化规格**（Structured Specification），最终进化为**可执行的语义规格说明**（Executable Semantic Specification）。

### 什么是可执行的语义规格说明？

简单来说，它是一种：
- **机器可读**（Machine-readable）：AI能直接解析，不需要NLP猜测
- **语义明确**（Semantically precise）：每个概念都有严格定义，没有歧义
- **可验证**（Verifiable）：可以自动检查是否符合预期
- **可追踪**（Traceable）：需求、代码、测试之间自动关联
- **版本化**（Versioned）：像代码一样管理变更

这不是科幻。在硬件设计、协议规范、安全关键系统领域，**形式化规格**（Formal Specification）已经使用了几十年。AI时代的产品开发，需要借鉴这些成熟实践。

### 结构化PRD的四个支柱

要实现这种转型，需要建立四个支柱：

#### 支柱一：Context（上下文）

传统PRD假设读者（工程师、AI）理解业务背景。结构化PRD**显式声明**所有上下文：

```yaml
context:
  user:
    role: 已登录的C端用户
    permissions: [view_own_orders]
    device: [iOS, Android, Web]
  
  business:
    domain: 电商订单系统
    regulations: [PCI-DSS, 个人信息保护法]
    peak_traffic: 10000 QPS
  
  dependencies:
    order_service: v2.3.1
    payment_gateway: Stripe API v2024-01
```

这个上下文块回答了一个关键问题：**我们在什么环境下解决这个问题？**

#### 支柱二：Constraints（约束）

约束定义了**解决方案的边界**。它们不是功能，而是限制条件：

```yaml
constraints:
  performance:
    p95_response_time: < 200ms
    max_db_queries: 3
    cache_ttl: 300s
  
  security:
    data_encryption: AES-256
    audit_log: required
    pii_masking: [phone, email]
  
  compatibility:
    backward_compatible: true
    min_app_version: "3.2.0"
```

约束让AI知道：**什么能做，什么不能做**。这比模糊的"性能要好"精确一万倍。

#### 支柱三：Acceptance Criteria（验收标准）

验收标准定义了**完成的定义**（Definition of Done）。在结构化PRD中，验收标准是**可测试的**（Testable）：

```gherkin
Feature: 订单历史查询

  Scenario: 正常查询
    Given 用户已登录
    And 用户有5个历史订单
    When 用户请求订单历史
    Then 返回按时间倒序排列的订单列表
    And 响应时间小于200ms

  Scenario: 空状态
    Given 用户已登录
    And 用户没有历史订单
    When 用户请求订单历史
    Then 显示"暂无订单"提示
    And 提供"去购物"按钮

  Scenario: 权限拒绝
    Given 用户未登录
    When 用户请求订单历史
    Then 返回401未授权
    And 记录审计日志
```

这是**Gherkin语法**，但不仅限于此。关键是：**验收标准可以被自动执行和验证**。

#### 支柱四：Traceability（可追溯性）

每个需求都有唯一标识符，与代码、测试、部署自动关联：

```yaml
requirement:
  id: ORD-2024-001
  title: 订单历史查询
  priority: P0
  owner: product_team_a
  
  links:
    design_doc: Figma://order-history-v2
    api_spec: OpenAPI://order-api.yaml
    test_cases: [TC-001, TC-002, TC-003]
    related: [ORD-2023-089, PAY-2024-012]
```

当AI生成代码时，自动注入这些追踪标识：

```python
# REQ: ORD-2024-001
# Context: user=authenticated, device=mobile
# Constraints: p95<200ms, max_queries=3
def get_order_history(user_id: str, pagination: Pagination):
    ...
```

---

## CCC模型：Context-Constraints-Criteria

将上述四个支柱简化，就是**CCC模型**（Triple-C Model）：

```
┌─────────────────────────────────────────────────────┐
│                  PRD as Code                        │
├─────────────────────────────────────────────────────┤
│  Context        │  Constraints    │  Criteria       │
│  (在什么环境下)  │  (边界是什么)   │  (怎样算完成)   │
├─────────────────┼─────────────────┼─────────────────┤
│  • 用户角色      │  • 性能约束     │  • Given-When   │
│  • 业务规则      │  • 安全约束     │  • Then断言     │
│  • 系统边界      │  • 兼容性约束   │  • 可自动化测试 │
│  • 依赖关系      │  • 合规约束     │  • 可追溯       │
└─────────────────┴─────────────────┴─────────────────┘
```

CCC模型是一个**思维框架**，不强制特定格式。你可以用YAML、JSON、TOML、甚至纯文本（带结构化标记）来实现。关键是**思考方式**的转变：从"描述功能"到"定义规格"。

---

## PRD as Code：工具链实践

将PRD视为代码（PRD as Code），需要相应的工具链支持。

### 版本控制

像管理代码一样管理PRD：

```bash
# PRD存储在Git仓库
/prds
  /features
    order-history.yaml
    payment-refund.yaml
  /constraints
    performance-limits.yaml
  /criteria
    order-history.feature
```

**好处**：
- 版本历史可追溯
- 分支管理支持并行开发
- Code Review机制确保质量
- CI/CD可以自动验证PRD完整性

### 验证流水线

在CI中自动验证PRD：

```yaml
# .github/workflows/prd-validation.yml
name: PRD Validation
on:
  push:
    paths: ['prds/**']

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Validate Schema
        run: |
          prd-validator check --schema ccc-v1.json prds/
      
      - name: Check Completeness
        run: |
          prd-validator completeness prds/
      
      - name: Generate Tests
        run: |
          prd-validator generate-tests prds/ --output tests/
```

### IDE集成

在产品经理的IDE中提供：
- **自动补全**：输入`context.user.`自动提示可用字段
- **实时验证**：红色波浪线标记缺失的必填项
- **模板快速插入**：`prd-template-order`生成订单功能的标准结构
- **AI辅助编写**：基于已有PRD，AI建议类似的上下文或约束

---

## 对比：传统PRD vs 结构化PRD

让我们用同一个功能对比两种写法。

### 传统PRD（飞书文档节选）

---

**订单历史功能**

用户可以在App上查看自己的订单历史。订单按时间倒序排列，显示订单号、商品名称、金额、状态。

*注：具体UI参考设计稿。*

---

### 结构化PRD（CCC模型）

```yaml
# order-history.yaml
requirement:
  id: ORD-2024-001
  title: 订单历史查询
  priority: P0

context:
  user:
    role: authenticated_customer
    permissions: [view_own_orders]
  
  data:
    order_fields: [id, items, total_amount, status, created_at]
    retention_period: 2_years

constraints:
  performance:
    p95_latency: < 200ms
    pagination: { default: 20, max: 100 }
  
  security:
    data_isolation: strict
    audit_log: required

criteria:
  scenarios:
    - name: 正常查询
      given: [用户已登录, 用户有历史订单]
      when: 请求订单历史
      then: [返回倒序列表, 包含必需字段, 响应时间<200ms]
    
    - name: 空状态
      given: [用户已登录, 用户无订单]
      when: 请求订单历史
      then: [显示空状态UI, 提供购物入口]
    
    - name: 权限拒绝
      given: [用户未登录]
      when: 请求订单历史
      then: [返回401, 记录审计日志]
```

### AI生成效果的对比

| 维度 | 传统PRD | 结构化PRD |
|------|---------|-----------|
| **首次通过率** | 30-40% | 80-90% |
| **返工次数** | 3-5次 | 0-1次 |
| **需求澄清时间** | 2-4小时 | 几乎为零 |
| **测试覆盖率** | 依赖工程师经验 | 自动生成完整测试 |
| **可追溯性** | 手动维护，易断裂 | 自动关联，全程追踪 |

---

## 实施路径：如何迁移现有PRD流程

对于已经使用传统PRD的组织，迁移不需要大爆炸式重构，可以**渐进式**进行。

### 阶段一：模板化（1-2个月）

- 设计CCC模型的Markdown模板
- 要求新PRD使用模板编写
- 旧PRD保持不变
- 目标：团队熟悉结构

### 阶段二：验证化（2-3个月）

- 引入PRD验证工具
- CI中增加PRD检查流水线
- 关键PRD（P0需求）必须结构化
- 目标：确保质量

### 阶段三：自动化（3-6个月）

- 验收标准自动生成测试用例
- PRD与代码、测试自动关联
- AI基于PRD直接生成代码框架
- 目标：提升效率

### 阶段四：智能化（6-12个月）

- AI辅助编写PRD（基于对话生成CCC结构）
- 需求变更的涟漪效应自动分析
- PRD与产品数据分析自动关联
- 目标：数据驱动迭代

---

## 挑战与局限

### 挑战一：学习成本

产品经理需要学习新的写作方式，初期会有阻力。解决方案：
- 提供**IDE插件**降低写作门槛
- **AI辅助生成**：产品经理口述需求，AI转换为CCC结构
- 从**关键需求**开始，逐步推广

### 挑战二：过度工程

不是所有需求都需要完整CCC结构。建议：
- **P0/P1需求**：完整CCC
- **P2需求**：简化版（仅Context + Criteria）
- **P3需求/技术债务**：传统方式即可

### 挑战三：工具生态

目前成熟的PRD as Code工具还不多。可以选择：
- **自研**：基于OpenAPI、Gherkin等现有标准扩展
- **开源**：关注领域如Cucumber、Spectacle等
- **SaaS**：一些新兴产品如Cycle、Avion正在探索

---

## 总结：从叙述到定义

PRD的结构化转型，本质是从**叙述需求**（Narrating Requirements）到**定义规格**（Defining Specifications）的范式转移。

在AI生成代码的时代，需求表达的质量直接决定了产出的质量。一个模糊的PRD，乘以AI的强大生成能力，只会放大错误；而一个精确的、可执行的语义规格说明，才能让AI真正成为**加速器**而非**放大器**。

**CCC模型**（Context-Constraints-Criteria）提供了一个实用的思维框架，帮助团队：
- 显式化隐含的假设
- 消除自然语言的歧义
- 建立需求到代码的自动桥梁
- 实现真正的端到端可追溯

这不是关于工具的选择，而是关于**思维方式**的升级。当产品经理从"写文档"转变为"定义规格"，当AI从"猜测意图"转变为"执行规格」，我们才能真正进入AI-Native的开发时代。

---

## 参考与延伸阅读

- [Gherkin Syntax Reference](https://cucumber.io/docs/gherkin/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Specification by Example - Gojko Adzic](https://)
- [Domain-Driven Design - Eric Evans](https://)
- [AI-Native Development Patterns](https://)

---

*Published on 2026-03-05 | 阅读时间：约 15 分钟*