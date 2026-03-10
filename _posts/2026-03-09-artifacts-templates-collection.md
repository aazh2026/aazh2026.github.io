---
layout: post
title: "交付件模板大全：开箱即用的 AI-Native SDLC 规格"
date: 2026-03-09T00:00:00+08:00
permalink: /2026/03/09/artifacts-templates-collection.html
tags: [Templates, AI-Native, SDLC, 交付件, 规范, 工具包]
author: Aaron
series: AI-Native SDLC 交付件体系 #10

redirect_from:
  - /2026/03/09/artifacts-templates-collection.html
---

> *「2024年，一位技术负责人看着团队各自编写的需求文档叹气：'为什么同样的功能，每个人写的格式都不一样？'不是大家不专业，而是缺少统一的标准。在AI时代，交付件模板不仅是格式规范，更是与AI协作的接口协议——结构越标准，AI理解越准确。」*

---

## 📋 本文结构

1. [模板设计理念](#一模板设计理念) — 为什么需要统一模板
2. [Product Intent 模板](#二product-intent-模板) — 产品意图定义
3. [User Story Pack 模板](#三user-story-pack-模板) — 用户故事包
4. [Architecture Spec 模板](#四architecture-spec-模板) — 架构规范
5. [Execution Plan 模板](#五execution-plan-模板) — 执行计划
6. [Quality Contract 模板](#六quality-contract-模板) — 质量契约
7. [Operations Runbook 模板](#七operations-runbook-模板) — 运维手册
8. [Traceability Matrix 模板](#八traceability-matrix-模板) — 追溯矩阵
9. [使用指南与最佳实践](#九使用指南与最佳实践)

---

## 一、模板设计理念

### 设计原则

**原则 1：机器可读优先**

```yaml
# ✅ 好的模板
price:
  type: number
  min: 0
  max: 999999
  precision: 2

# ❌ 不好的模板
price: "价格必须是数字，大于0，最多2位小数"
```

**原则 2：自包含**

每个交付件模板应包含完整上下文，不依赖外部解释。

**原则 3：可验证**

模板中的每个字段都应有验证规则。

**原则 4：可扩展**

允许在标准字段基础上添加自定义字段。

---

## 二、Product Intent 模板

### 完整模板

```yaml
# product_intent.yaml
product_intent:
  # === 元数据 ===
  metadata:
    id: PI-{YYYYMMDD}-{NNN}
    version: "1.0.0"
    status: draft | review | approved | deprecated
    created_at: "2026-03-10T10:00:00Z"
    updated_at: "2026-03-10T10:00:00Z"
    owner: product_manager_name
    stakeholders:
      - name: stakeholder_name
        role: role_in_project
  
  # === 业务意图 ===
  business_intent:
    problem_statement: |
      描述要解决的业务问题。
      说明现状是什么，痛点在哪里。
    
    opportunity: |
      描述解决此问题带来的机会。
      预期的业务价值。
    
    target_users:
      - persona: 用户画像名称
        description: 用户特征描述
        pain_points:
          - 痛点1
          - 痛点2
        goals:
          - 目标1
          - 目标2
    
    success_metrics:
      - metric: 指标名称
        current_value: "当前值"
        target_value: "目标值"
        measurement_method: "测量方法"
        timeframe: "时间范围"
  
  # === 用户意图 ===
  user_intent:
    user_journeys:
      - journey_id: UJ-001
        name: 用户旅程名称
        steps:
          - step: 1
            action: 用户行为
            motivation: 用户动机
            friction: 可能的阻碍
    
    user_scenarios:
      - scenario_id: US-001
        name: 场景名称
        trigger: 触发条件
        user_goal: 用户目标
        expected_outcome: 期望结果
  
  # === 功能意图 ===
  functional_intent:
    core_capabilities:
      - capability_id: FC-001
        name: 核心能力名称
        description: 能力描述
        acceptance_criteria:
          - 验收标准1
          - 验收标准2
        priority: critical | high | medium | low
    
    non_functional_requirements:
      performance:
        - requirement: 性能要求描述
          metric: 量化指标
          target: 目标值
      
      scalability:
        - requirement: 扩展性要求
          target: 目标值
      
      reliability:
        - requirement: 可靠性要求
          target: 目标值
      
      security:
        - requirement: 安全要求
          standard: 参考标准
  
  # === 约束意图 ===
  constraint_intent:
    hard_constraints:
      - constraint_id: HC-001
        category: technical | business | legal | compliance
        description: 约束描述
        enforcement: 如何验证
        violation_handling: 违反时的处理
    
    soft_constraints:
      - constraint_id: SC-001
        category: technical | business
        description: 偏好描述
        priority: high | medium | low
        rationale: 原因说明
  
  # === 演化意图 ===
  evolution_intent:
    phases:
      - phase_id: P-001
        name: 阶段名称
        scope: 范围描述
        timeline: 时间计划
        deliverables:
          - 交付物1
          - 交付物2
    
    sunset_criteria:
      - criteria: 下线条件
        action: 触发动作
  
  # === 参考信息 ===
  references:
    related_documents:
      - type: prd
        link: document_link
      - type: design
        link: design_link
    
    competitive_analysis:
      - competitor: 竞品名称
        feature_comparison: 功能对比
```

### 使用示例

```yaml
product_intent:
  metadata:
    id: PI-20260310-001
    version: "1.0.0"
    status: approved
    owner: "张三"
  
  business_intent:
    problem_statement: |
      当前用户下单流程复杂，需要5步完成，转化率仅15%。
      竞品已完成简化至3步，转化率25%。
    
    opportunity: |
      通过简化下单流程，预计转化率提升至22%，
      年增收约500万元。
    
    target_users:
      - persona: 移动端购物者
        pain_points:
          - "填写信息过多"
          - "支付方式选择困惑"
    
    success_metrics:
      - metric: 下单转化率
        current_value: "15%"
        target_value: "22%"
        timeframe: "3个月"
```

---

## 三、User Story Pack 模板

### 完整模板

```yaml
# user_story_pack.yaml
user_story_pack:
  # === 元数据 ===
  metadata:
    id: USP-{feature}-{NNN}
    version: "1.0.0"
    product_intent_ref: PI-{id}
    created_at: "2026-03-10T10:00:00Z"
    author: author_name
  
  # === 用户故事 ===
  story:
    id: US-{NNN}
    title: 故事标题
    narrative:
      as_a: 用户角色
      i_want: 想要的功能
      so_that: 获得的价值
    
    priority: critical | high | medium | low
    estimate: story_points
    
    tags:
      - tag1
      - tag2
  
  # === 场景集 ===
  scenarios:
    - id: SC-{NNN}
      name: 场景名称
      type: happy_path | boundary | error | alternative
      description: 场景描述
      
      given:
        - 前置条件1
        - 前置条件2
      
      when:
        - 触发动作
      
      then:
        - 预期结果1
        - 预期结果2
      
      and_when:
        - 后续动作
      
      then:
        - 后续预期结果
  
  # === 示例数据 ===
  examples:
    - scenario_id: SC-{NNN}
      name: 示例名称
      data:
        # 具体测试数据
      expected:
        # 预期输出
  
  # === 业务规则 ===
  business_rules:
    - rule_id: BR-{NNN}
      name: 规则名称
      condition: 触发条件
      action: 执行动作
      exceptions:
        - 例外情况1
  
  # === 验收标准 ===
  acceptance_criteria:
    functional:
      - criteria: 功能验收点
        verification_method: automated | manual
    
    non_functional:
      - criteria: 非功能验收点
        metric: 量化指标
```

### 使用示例

```yaml
user_story_pack:
  metadata:
    id: USP-COUPON-001
    product_intent_ref: PI-20260310-001
  
  story:
    title: 使用优惠券
    narrative:
      as_a: 注册用户
      i_want: 在下单时使用优惠券
      so_that: 享受折扣优惠
    priority: high
    estimate: 8
  
  scenarios:
    - id: SC-001
      name: 正常使用满减券
      type: happy_path
      given:
        - 订单金额 ¥500
        - 有满400减100优惠券
      when: 选择使用该优惠券
      then:
        - 折扣金额 ¥100
        - 实付 ¥400
    
    - id: SC-002
      name: 订单金额不足门槛
      type: boundary
      given:
        - 订单金额 ¥399
        - 有满400减100优惠券
      when: 尝试使用该优惠券
      then:
        - 提示"订单金额未达到门槛"
```

---

## 四、Architecture Spec 模板

### 完整模板

```yaml
# architecture_spec.yaml
architecture_spec:
  # === 元数据 ===
  metadata:
    id: ARCH-{system}-{NNN}
    version: "1.0.0"
    status: draft | review | approved
    created_at: "2026-03-10T10:00:00Z"
    architect: architect_name
  
  # === Level 1: Context ===
  context:
    system_name: 系统名称
    system_description: 系统描述
    
    actors:
      - name: 参与者名称
        type: user | system
        description: 描述
        responsibilities:
          - 职责1
    
    external_systems:
      - name: 外部系统名
        type: database | service | gateway
        criticality: high | medium | low
        interfaces:
          - protocol: http | grpc | message_queue
            description: 接口描述
  
  # === Level 2: Containers ===
  containers:
    - name: 容器名称
      type: web_app | mobile_app | api_gateway | microservice | database | queue
      technology: 技术栈
      description: 描述
      responsibilities:
        - 职责1
      
      ports:
        - port: 8080
          protocol: http
          description: API端口
      
      data_stores:
        - type: database
          technology: PostgreSQL
      
      scaling:
        min_replicas: 3
        max_replicas: 20
  
  # === Level 3: Components ===
  components:
    service: 服务名
    components:
      - name: 组件名
        type: controller | service | repository | client | messaging
        responsibilities:
          - 职责
        dependencies:
          - 依赖组件
  
  # === Level 4: Code Structure ===
  code_structure:
    language: Python | Java | Go
    framework: FastAPI | Spring | Gin
    
    structure:
      - path: src/
        description: 源码目录
        children:
          - path: api/
            description: API层
          - path: domain/
            description: 领域层
          - path: infrastructure/
            description: 基础设施层
  
  # === 数据模型 ===
  data_model:
    entities:
      - name: 实体名
        fields:
          - name: 字段名
            type: 数据类型
            constraints:
              - 约束1
        relationships:
          - target: 关联实体
            type: one_to_many | many_to_one | many_to_many
  
  # === API 契约 ===
  api_contracts:
    - service: 服务名
      spec_file: path/to/openapi.yaml
      base_path: /api/v1/
      version: "1.0.0"
  
  # === 通信模式 ===
  communication:
    synchronous:
      - pattern: request_response
        used_for: 使用场景
        timeout: 5s
        retry: 3
    
    asynchronous:
      - pattern: event_driven
        events:
          - name: EventName
            producers: [Producer]
            consumers: [Consumer1, Consumer2]
  
  # === 约束 ===
  constraints:
    performance:
      - metric: latency_p95
        target: < 200ms
    
    security:
      - requirement: 安全要求
        standard: 标准参考
    
    compliance:
      - regulation: 法规名
        requirements:
          - 要求1
  
  # === 架构决策 ===
  decisions:
    - id: ADR-{NNN}
      title: 决策标题
      context: 决策背景
      decision: 决策内容
      consequences:
        - 正面影响
        - 负面影响
```

### 使用示例

```yaml
architecture_spec:
  metadata:
    id: ARCH-ORDER-001
    version: "1.0.0"
  
  context:
    system_name: 订单系统
    actors:
      - name: 消费者
        type: user
      - name: 支付网关
        type: system
  
  containers:
    - name: order-service
      type: microservice
      technology: Python/FastAPI
      database: PostgreSQL
```

---

## 五、Execution Plan 模板

### 完整模板

```yaml
# execution_plan.yaml
execution_plan:
  # === 元数据 ===
  metadata:
    id: EP-{feature}-{NNN}
    version: "1.0.0"
    product_intent_ref: PI-{id}
    architecture_ref: ARCH-{id}
    created_at: "2026-03-10T10:00:00Z"
  
  # === 上下文 ===
  context:
    team:
      - name: 成员名
        role: 角色
        capacity: 40h/week
    
    sprint:
      duration: 2_weeks
      start_date: "2026-03-15"
  
  # === 史诗 ===
  epics:
    - id: EP-{NNN}
      title: 史诗标题
      description: 描述
      business_value: 业务价值
      priority: critical | high | medium | low
      estimated_effort: story_points
      stories: [US-001, US-002]
  
  # === 故事 ===
  stories:
    - id: US-{NNN}
      title: 故事标题
      epic: EP-{id}
      narrative:
        as_a: 角色
        i_want: 需求
        so_that: 价值
      estimated_points: 8
      tasks: [TK-001, TK-002]
  
  # === 任务 ===
  tasks:
    - id: TK-{NNN}
      title: 任务标题
      story: US-{id}
      type: design | development | testing | documentation
      assignee: 负责人
      estimated_hours: 8
      
      subtasks:
        - id: SK-{NNN}
          title: 子任务标题
          estimated_hours: 2
      
      dependencies:
        - task: TK-{id}
          type: finish_to_start
  
  # === 依赖 ===
  dependencies:
    internal:
      - from: TK-001
        to: TK-002
        type: finish_to_start
    
    external:
      - task: TK-003
        system: 外部系统
        status: ready
  
  # === 时间线 ===
  timeline:
    milestones:
      - name: 里程碑名
        date: "2026-03-28"
        deliverables:
          - 交付物1
  
  # === 风险 ===
  risks:
    - id: RISK-{NNN}
      description: 风险描述
      probability: 0.3
      impact: high
      mitigation: 缓解措施
```

### 使用示例

```yaml
execution_plan:
  metadata:
    id: EP-COUPON-001
    product_intent_ref: PI-20260310-001
  
  epics:
    - id: EP-001
      title: 优惠券系统
      stories: [US-001, US-002]
  
  tasks:
    - id: TK-001
      title: 优惠券验证逻辑
      story: US-001
      estimated_hours: 8
```

---

## 六、Quality Contract 模板

### 完整模板

```yaml
# quality_contract.yaml
quality_contract:
  # === 元数据 ===
  metadata:
    id: QC-{feature}-{NNN}
    version: "1.0.0"
    product_intent_ref: PI-{id}
    user_story_pack_ref: USP-{id}
  
  # === 功能契约 ===
  functional:
    acceptance_criteria:
      - id: AC-{NNN}
        description: 验收标准描述
        given:
          - 前置条件
        when:
          - 触发动作
        then:
          - 预期结果
        automated: true | false
    
    business_rules:
      - id: BR-{NNN}
        rule: 规则描述
        validation: 验证方法
  
  # === 性能契约 ===
  performance:
    api_endpoints:
      - endpoint: /api/v1/endpoint
        metrics:
          - metric: latency_p95
            target: < 200ms
          - metric: throughput
            target: > 1000 rps
    
    load_test_scenarios:
      - name: 场景名
        concurrent_users: 1000
        duration: 30m
        expected: 预期结果
  
  # === 安全契约 ===
  security:
    authentication:
      - requirement: 认证要求
    
    authorization:
      - resource: 资源名
        access_control: 控制方式
    
    input_validation:
      - field: 字段名
        constraints:
          - type: 类型
          - min: 最小值
          - max: 最大值
    
    vulnerability_checks:
      - type: owasp_top_10
        frequency: every_build
  
  # === 合规契约 ===
  compliance:
    audit_logging:
      - event: 事件名
        required_fields:
          - 字段1
        retention: 7_years
    
    regulatory:
      - regulation: 法规名
        requirements:
          - 要求1
```

### 使用示例

```yaml
quality_contract:
  metadata:
    id: QC-COUPON-001
  
  functional:
    acceptance_criteria:
      - id: AC-001
        description: 满减券正常使用
        given:
          - 订单金额 ¥500
          - 有满400减100优惠券
        when: 使用优惠券
        then:
          - 实付 ¥400
```

---

## 七、Operations Runbook 模板

### 完整模板

```yaml
# operations_runbook.yaml
operations_runbook:
  # === 元数据 ===
  metadata:
    id: ORB-{system}-{NNN}
    version: "1.0.0"
    system_name: 系统名
    criticality: tier_1 | tier_2 | tier_3
  
  # === 系统概览 ===
  system_overview:
    description: 系统描述
    dependencies:
      - service: 依赖服务
        type: sync | async
        critical: true | false
  
  # === 部署 ===
  deployment:
    environments:
      - name: production
        cluster: 集群名
        namespace: 命名空间
        replicas: 5
    
    rollback:
      automatic: true | false
      requires_approval: true | false
  
  # === 监控 ===
  monitoring:
    metrics:
      - name: 指标名
        type: counter | gauge | histogram
        labels:
          - label1
    
    dashboards:
      - name: 仪表盘名
        panels:
          - title: 面板标题
            query: 查询语句
  
  # === 告警 ===
  alerting:
    rules:
      - alert: 告警名
        expr: 表达式
        for: 持续时间
        labels:
          severity: critical | warning | info
        annotations:
          summary: 摘要
    
    routing:
      - match:
          severity: critical
        receiver: pagerduty
  
  # === 操作手册 ===
  procedures:
    - id: PROC-{NNN}
      name: 操作名称
      frequency: on_demand | daily | weekly
      steps:
        - step: 1
          name: 步骤名
          commands:
            - 命令1
  
  # === 故障剧本 ===
  playbooks:
    - id: PB-{NNN}
      name: 剧本名
      trigger: 触发告警
      severity: critical | warning
      
      diagnosis:
        - step: 1
          name: 诊断步骤
          action: 执行动作
      
      remediation:
        - condition: 条件
          action: 修复动作
          approval: auto | manual
```

### 使用示例

```yaml
operations_runbook:
  metadata:
    id: ORB-ORDER-001
    system_name: 订单系统
  
  monitoring:
    metrics:
      - name: order_created_total
        type: counter
  
  playbooks:
    - id: PB-001
      name: 高订单失败率
      trigger: HighOrderFailureRate
```

---

## 八、Traceability Matrix 模板

### 完整模板

```yaml
# traceability_matrix.yaml
traceability_matrix:
  # === 元数据 ===
  metadata:
    id: TM-{project}-{NNN}
    version: "1.0.0"
    project: 项目名
  
  # === 需求追踪 ===
  requirements:
    - id: REQ-{NNN}
      title: 需求标题
      type: functional | non_functional
      priority: critical | high | medium | low
      
      traces:
        product_intent: PI-{id}
        user_stories: [US-001, US-002]
        architecture: ARCH-{id}
        test_cases: [TC-001, TC-002]
        code_files: [file1.py, file2.py]
        deployment: DEP-{id}
      
      status: implemented | testing | done
      
      verification:
        test_coverage: 95%
        last_tested: "2026-03-10"
        test_result: passed
  
  # === 变更影响分析 ===
  change_impact:
    - change_id: CHG-{NNN}
      description: 变更描述
      affected_items:
        requirements: [REQ-001]
        code: [file1.py]
        tests: [TC-001]
      
      risk_assessment:
        impact_level: high
        testing_required: true
        regression_scope: [feature1, feature2]
  
  # === 覆盖率报告 ===
  coverage:
    requirements:
      total: 100
      with_tests: 95
      coverage_rate: 95%
    
    code:
      line_coverage: 90%
      branch_coverage: 85%
```

---

## 九、使用指南与最佳实践

### 模板选择指南

| 场景 | 推荐模板 | 理由 |
|------|---------|------|
| 新产品立项 | Product Intent | 定义业务目标和用户价值 |
| 功能开发 | User Story Pack + Execution Plan | 详细需求+执行计划 |
| 系统重构 | Architecture Spec | 清晰的架构设计 |
| 上线准备 | Quality Contract + Operations Runbook | 质量+运维保障 |
| 全链路管理 | Traceability Matrix | 需求到代码追踪 |

### 文件组织建议

```
project/
├── intents/
│   └── product_intent.yaml
├── stories/
│   └── user_story_pack.yaml
├── architecture/
│   └── architecture_spec.yaml
├── plans/
│   └── execution_plan.yaml
├── quality/
│   └── quality_contract.yaml
├── operations/
│   └── operations_runbook.yaml
└── traceability/
    └── traceability_matrix.yaml
```

### 与 CI/CD 集成

```yaml
# .github/workflows/validate-artifacts.yml
name: Validate Artifacts
on:
  push:
    paths:
      - '**/product_intent.yaml'
      - '**/user_story_pack.yaml'
      - '**/architecture_spec.yaml'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Validate Schema
        run: |
          artifact-validator validate --schema ai-native-sdlc schemas/
      
      - name: Check Completeness
        run: |
          artifact-validator completeness check/
      
      - name: Generate Traceability
        run: |
          artifact-validator generate-traceability . --output traceability_matrix.yaml
```

### AI 辅助编写

```yaml
# .cursor/rules/artifacts.mdc
# Cursor IDE 规则文件

当用户要求创建交付件时：
1. 询问用户要创建的交付件类型
2. 使用对应的模板
3. 根据上下文自动填充字段
4. 提示用户补充必要信息
5. 验证生成的 YAML 格式
```

---

## 📚 模板版本管理

### 模板更新策略

```
v1.0.0 - 初始版本
v1.1.0 - 增加字段X
v2.0.0 - 破坏性变更：字段Y重命名
```

### 向后兼容

- 新增字段：向后兼容
- 删除字段：破坏性变更
- 重命名字段：破坏性变更

---

*AI-Native SDLC 交付件体系 #10*  
*深度阅读时间：约 15 分钟*

*系列完结，感谢阅读。*
