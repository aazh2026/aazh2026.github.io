---
layout: post
title: "Architecture Spec：架构设计的机器可读化"
date: 2025-04-05T00:00:00+08:00
permalink: /posts/2025/04/05/architecture-spec-machine-readable.html/
tags: [Architecture, C4 Model, AI-Native, 架构设计, 系统规范]
author: Aaron
series: AI-Native SDLC 交付件体系 #05

redirect_from:
  - /2026/03/09/architecture-spec-machine-readable.html
---

> *「2024年，一位架构师画了一张完美的架构图——微服务拆分、消息队列、缓存策略，应有尽有。三个月后，新加入的工程师发现代码里的架构和图上的架构'好像不太一样'。不是图错了，而是图是'给人看的'，不是'给机器执行的'。在AI时代，架构设计需要从画图进化为可验证、可生成、可追溯的规格说明。」*

---

## 📋 本文结构

1. [传统架构文档的困境](#一传统架构文档的困境) — 为什么架构图总是被遗忘
2. [什么是 Architecture Spec](#二什么是-architecture-spec) — 机器可读的架构定义
3. [C4 Model + 结构化数据](#三c4-model--结构化数据) — 层次化架构描述
4. [API 契约即架构](#四api-契约即架构) — OpenAPI 作为架构载体
5. [AI 驱动的架构生成与验证](#五ai-驱动的架构生成与验证) — 从规格到实现
6. [实战：微服务系统的架构规范](#六实战微服务系统的架构规范) — 完整案例
7. [写在最后：架构即代码](#七写在最后架构即代码) — 范式转移的意义

---

## 一、传统架构文档的困境

### 经典架构交付物

传统软件架构设计通常产生以下交付物：

- **架构图**：PowerPoint、Visio、draw.io 绘制的框线图
- **架构文档**：Word 或 Confluence 中的文字说明
- **技术选型表**：对比各种技术栈的选择理由
- **决策记录**：ADR（Architecture Decision Records）

### 困境 1：图与代码的鸿沟

**场景**：架构师设计了一套微服务架构

```
架构图显示：
- Order Service
- Payment Service  
- Inventory Service
- 通过消息队列异步通信

实际代码：
- OrderService 直接调用 PaymentService 的 HTTP API
- InventoryService 被绕过，直接在 OrderService 里扣减库存
- 没有消息队列，全是同步调用
```

**问题**：架构图是"期望"，代码是"现实"，两者渐行渐远。

### 困境 2：二义性陷阱

架构图中的框和线代表什么？

```
[User] --> [API Gateway] --> [Service A]
              ↓
           [Service B]

问题：
- 箭头表示什么？（调用？数据流？依赖？）
- Service A 和 B 是什么关系？（并行？串行？ fallback？）
- 通信协议是什么？（HTTP？gRPC？消息队列？）
- 同步还是异步？
```

人类可以通过上下文理解，但 AI 无法确定。

### 困境 3：难以验证

**传统方式**：
```
架构师审查代码 → 发现偏离架构 → 口头提醒 → 下次可能还犯
```

**问题**：
- 人工审查成本高
- 容易遗漏
- 无法持续验证

### 困境 4：变更不同步

```
Week 1: 架构设计完成，文档发布
Week 2: 开发开始，遇到问题微调架构
Week 4: 架构调整，文档未更新
Week 8: 新成员看文档，已经被误导
Week 12: 文档和实际架构完全不同
```

**结果**：文档成为"历史的遗迹"。

### 困境 5：AI 无法理解

当 AI 尝试根据架构图生成代码时：

```
输入：架构图（PNG图片）
AI 尝试：OCR 识别文字 → 猜测框的含义 → 猜测线的含义
输出：大概率不符合预期的代码
```

架构图是视觉化的，不是结构化的。

---

## 二、什么是 Architecture Spec

### 定义

**Architecture Spec（架构规范）**：以结构化、机器可读的形式描述软件系统的架构设计，包括系统组件、组件间关系、通信协议、数据流、约束条件，可直接用于代码生成、架构验证和自动化文档。

### Architecture Spec vs 传统架构图

| 维度 | 传统架构图 | Architecture Spec |
|------|-----------|-------------------|
| **格式** | 图片/PPT | YAML/JSON/DSL |
| **读者** | 人类 | 人类 + AI/机器 |
| **精确性** | 二义性高 | 精确无二义 |
| **可验证** | 人工审查 | 自动化验证 |
| **可生成** | 不能 | 可生成代码/文档 |
| **版本控制** | 困难 | Git 友好 |

### 核心组成

```yaml
architecture_spec:
  metadata:          # 基本信息
  context:           # 系统上下文（C4 Level 1）
  containers:        # 容器/应用（C4 Level 2）
  components:        # 组件（C4 Level 3）
  code_structure:    # 代码结构（C4 Level 4）
  data_model:        # 数据模型
  api_contracts:     # API 契约
  constraints:       # 架构约束
  decisions:         # 架构决策
  evolution:         # 演进规划
```

---

## 三、C4 Model + 结构化数据

### C4 Model 简介

C4 Model 是 Simon Brown 提出的软件架构可视化方法，包含四个层次：

```
Level 1: System Context（系统上下文）
         系统与用户、外部系统的关系
         
Level 2: Container（容器）
         应用/服务级别的组件
         
Level 3: Component（组件）
         应用内部的模块/组件
         
Level 4: Code（代码）
         类/接口级别的结构
```

### 传统 C4 的局限

C4 通常用图表表示，但图表：
- 是静态的图片
- 难以版本控制
- 无法自动验证
- AI 难以解析

### 结构化 C4 Spec

**Level 1: System Context**

```yaml
architecture_spec:
  context:
    system_name: 电商平台
    system_description: 支持B2C交易的在线购物平台
    
    users:
      - name: 消费者
        description: 浏览商品、下单购买的终端用户
        interactions:
          - with: 电商平台
            description: 浏览、搜索、下单、支付
      
      - name: 商家
        description: 管理商品和订单的商家用户
        interactions:
          - with: 商家后台
            description: 商品管理、订单处理、数据分析
      
      - name: 运营人员
        description: 平台运营管理
        interactions:
          - with: 运营后台
            description: 活动配置、用户管理、数据监控
    
    external_systems:
      - name: 支付网关
        type: external
        description: 处理支付请求
        technology: 支付宝/微信支付/银联
        interactions:
          - from: 电商平台
            type: HTTPS
            description: 支付请求
      
      - name: 物流系统
        type: external
        description: 订单配送跟踪
        technology: 顺丰/圆通 API
        interactions:
          - from: 电商平台
            type: HTTPS
            description: 订单发货、物流查询
      
      - name: 短信服务
        type: external
        description: 发送验证码和通知
        technology: 阿里云短信
        interactions:
          - from: 电商平台
            type: HTTPS
            description: 短信发送
```

**Level 2: Container**

```yaml
  containers:
    - name: Web App
      type: web_application
      technology: React + TypeScript
      description: 消费者端Web应用
      responsibilities:
        - 商品浏览与搜索
        - 购物车管理
        - 订单流程
      
    - name: Mobile App
      type: mobile_application
      technology: Flutter
      description: iOS和Android移动应用
      responsibilities:
        - 移动端购物体验
        - 消息推送
      
    - name: API Gateway
      type: gateway
      technology: Kong / AWS API Gateway
      description: 统一API入口
      responsibilities:
        - 请求路由
        - 认证鉴权
        - 限流熔断
      
    - name: Order Service
      type: microservice
      technology: Python/FastAPI
      description: 订单核心服务
      database: Order DB
      responsibilities:
        - 订单生命周期管理
        - 订单状态机
      
    - name: Payment Service
      type: microservice
      technology: Go
      description: 支付处理服务
      database: Payment DB
      responsibilities:
        - 支付请求处理
        - 支付状态同步
        - 退款处理
      
    - name: Inventory Service
      type: microservice
      technology: Java/Spring Boot
      description: 库存管理服务
      database: Inventory DB
      responsibilities:
        - 库存扣减与释放
        - 库存查询
        - 库存预警
      
    - name: Message Queue
      type: queue
      technology: RabbitMQ / Kafka
      description: 异步消息通信
      responsibilities:
        - 订单事件广播
        - 服务解耦
      
    - name: Order DB
      type: database
      technology: PostgreSQL
      description: 订单数据持久化
      
    - name: Payment DB
      type: database
      technology: PostgreSQL
      description: 支付数据持久化
      
    - name: Inventory DB
      type: database
      technology: Redis + MySQL
      description: 库存数据（缓存+持久化）
      
    - name: Search Engine
      type: database
      technology: Elasticsearch
      description: 商品搜索引擎
```

**Level 3: Component**

```yaml
  components:
    service: Order Service
    components:
      - name: Order Controller
        type: controller
        responsibilities:
          - 接收HTTP请求
          - 参数校验
          - 调用业务逻辑
        
      - name: Order Service (Domain)
        type: service
        responsibilities:
          - 订单业务逻辑
          - 状态机管理
          - 事务协调
        
      - name: Order Repository
        type: repository
        responsibilities:
          - 数据访问抽象
          - 数据库操作
        
      - name: Payment Client
        type: client
        responsibilities:
          - 调用Payment Service
          - 处理支付相关逻辑
        
      - name: Inventory Client
        type: client
        responsibilities:
          - 调用Inventory Service
          - 库存操作协调
        
      - name: Event Publisher
        type: messaging
        responsibilities:
          - 发布订单事件
          - 消息序列化
```

**Level 4: Code Structure**

```yaml
  code_structure:
    service: Order Service
    language: Python
    
    structure:
      order_service/
      ├── app/
      │   ├── __init__.py
      │   ├── main.py              # FastAPI app 入口
      │   ├── config.py            # 配置管理
      │   └── dependencies.py      # 依赖注入
      ├── api/
      │   ├── __init__.py
      │   └── v1/
      │       ├── __init__.py
      │       ├── orders.py        # Order Controller
      │       └── health.py        # 健康检查
      ├── domain/
      │   ├── __init__.py
      │   ├── models/
      │   │   ├── __init__.py
      │   │   ├── order.py         # Order 实体
      │   │   └── order_item.py    # OrderItem 实体
      │   ├── services/
      │   │   ├── __init__.py
      │   │   └── order_service.py # Order Service (Domain)
      │   └── repositories/
      │       ├── __init__.py
      │       └── order_repository.py
      ├── infrastructure/
      │   ├── __init__.py
      │   ├── database.py          # 数据库连接
      │   ├── clients/
      │   │   ├── __init__.py
      │   │   ├── payment_client.py
      │   │   └── inventory_client.py
      │   └── messaging/
      │       ├── __init__.py
      │       └── event_publisher.py
      ├── tests/
      │   ├── unit/
      │   ├── integration/
      │   └── e2e/
      └── Dockerfile
```

---

## 四、API 契约即架构

### API 契约的重要性

API 是微服务架构中最关键的契约：
- 定义了服务边界
- 定义了数据交换格式
- 定义了错误处理方式
- 定义了版本策略

### OpenAPI 作为架构载体

OpenAPI Specification（原 Swagger）是描述 REST API 的标准格式。

```yaml
openapi: 3.0.0
info:
  title: Order Service API
  version: 1.0.0
  description: 订单服务API规范

servers:
  - url: https://api.example.com/v1
    description: Production

paths:
  /orders:
    post:
      summary: 创建订单
      operationId: createOrder
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OrderCreateRequest'
            examples:
              normal:
                summary: 正常下单
                value:
                  user_id: "U12345"
                  items:
                    - product_id: "P001"
                      quantity: 2
                  shipping_address:
                    name: "张三"
                    phone: "13800138000"
                    address: "北京市朝阳区..."
      responses:
        '201':
          description: 订单创建成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '400':
          description: 请求参数错误
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '409':
          description: 库存不足
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    
    get:
      summary: 查询订单列表
      operationId: listOrders
      parameters:
        - name: user_id
          in: query
          required: true
          schema:
            type: string
        - name: status
          in: query
          schema:
            type: string
            enum: [pending, paid, shipped, completed, cancelled]
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: page_size
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
      responses:
        '200':
          description: 订单列表
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OrderListResponse'

  /orders/{orderId}:
    get:
      summary: 获取订单详情
      operationId: getOrder
      parameters:
        - name: orderId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: 订单详情
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '404':
          description: 订单不存在

    patch:
      summary: 更新订单状态
      operationId: updateOrderStatus
      parameters:
        - name: orderId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                status:
                  type: string
                  enum: [cancelled]
                reason:
                  type: string
      responses:
        '200':
          description: 更新成功
        '400':
          description: 无效的状态转换

components:
  schemas:
    OrderCreateRequest:
      type: object
      required:
        - user_id
        - items
        - shipping_address
      properties:
        user_id:
          type: string
          description: 用户ID
        items:
          type: array
          minItems: 1
          items:
            $ref: '#/components/schemas/OrderItemRequest'
        shipping_address:
          $ref: '#/components/schemas/Address'
        coupon_code:
          type: string
          description: 优惠券代码
      
    OrderItemRequest:
      type: object
      required:
        - product_id
        - quantity
      properties:
        product_id:
          type: string
        quantity:
          type: integer
          minimum: 1
          maximum: 99
    
    Order:
      type: object
      properties:
        id:
          type: string
        user_id:
          type: string
        items:
          type: array
          items:
            $ref: '#/components/schemas/OrderItem'
        status:
          type: string
          enum: [pending, paid, shipped, completed, cancelled]
        total_amount:
          type: number
          format: decimal
        shipping_address:
          $ref: '#/components/schemas/Address'
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
    
    OrderItem:
      type: object
      properties:
        product_id:
          type: string
        product_name:
          type: string
        quantity:
          type: integer
        unit_price:
          type: number
        total_price:
          type: number
    
    Address:
      type: object
      required:
        - name
        - phone
        - address
      properties:
        name:
          type: string
        phone:
          type: string
          pattern: '^1[3-9]\\d{9}$'
        address:
          type: string
    
    OrderListResponse:
      type: object
      properties:
        items:
          type: array
          items:
            $ref: '#/components/schemas/Order'
        total:
          type: integer
        page:
          type: integer
        page_size:
          type: integer
    
    Error:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
        details:
          type: object
```

### API 契约的架构约束

API 规范隐含了架构约束：

```yaml
# 从 OpenAPI 推导的架构约束
constraints:
  - type: protocol
    description: Order Service 使用 HTTP/REST
    
  - type: data_format
    description: 请求/响应使用 JSON
    
  - type: versioning
    description: URL 路径版本控制 (/v1/)
    
  - type: error_handling
    description: 使用标准 HTTP 状态码
    
  - type: pagination
    description: 列表接口支持分页
    
  - type: authentication
    description: 需要用户认证（从 user_id 参数推断）
```

---

## 五、AI 驱动的架构生成与验证

### AI 如何理解 Architecture Spec

**1. 从需求生成架构建议**

```
输入：Product Intent
- "需要一个支持高并发的订单系统"
- "需要与支付、库存服务集成"
- "99.9% 可用性要求"

AI 分析：
- 高并发 → 需要缓存、异步处理
- 多服务集成 → 需要消息队列、Saga 模式
- 高可用 → 需要集群部署、熔断降级

输出：Architecture Spec 建议
- 微服务拆分方案
- 技术栈推荐
- 部署架构
```

**2. 从架构生成代码脚手架**

```yaml
# Architecture Spec 片段
service: Order Service
technology: Python/FastAPI
database: PostgreSQL
components:
  - Order Controller
  - Order Service
  - Order Repository

# AI 生成代码结构
order_service/
├── app/
│   ├── api/
│   │   └── orders.py      # Order Controller
│   ├── domain/
│   │   └── order_service.py # Order Service
│   └── infrastructure/
│       └── repositories/
│           └── order_repository.py
├── Dockerfile
└── docker-compose.yml
```

**3. 架构验证**

```python
# 架构规则引擎
class ArchitectureValidator:
    def validate(self, code_structure, architecture_spec):
        violations = []
        
        # 验证：Controller 应该只依赖 Service
        for controller in code_structure.controllers:
            for dep in controller.dependencies:
                if dep.type not in ['service', 'repository']:
                    violations.append({
                        'rule': 'controller_dependencies',
                        'message': f'{controller.name} 不应该直接依赖 {dep.name}'
                    })
        
        # 验证：Service 之间的调用关系
        for service in code_structure.services:
            for call in service.outbound_calls:
                if not self.is_allowed_call(service, call, architecture_spec):
                    violations.append({
                        'rule': 'service_dependencies',
                        'message': f'{service.name} 不应该调用 {call.target}'
                    })
        
        # 验证：API 契约遵守
        for endpoint in code_structure.endpoints:
            if not self.matches_openapi_spec(endpoint, architecture_spec.openapi):
                violations.append({
                    'rule': 'api_contract',
                    'message': f'{endpoint.path} 与 OpenAPI 规范不符'
                })
        
        return violations
```

### 架构漂移检测

```python
class ArchitectureDriftDetector:
    """检测代码是否偏离架构设计"""
    
    def detect(self, architecture_spec, actual_code):
        drifts = []
        
        # 检查：是否有未定义的依赖
        actual_dependencies = extract_dependencies(actual_code)
        allowed_dependencies = architecture_spec.allowed_dependencies
        
        for dep in actual_dependencies:
            if not is_allowed(dep, allowed_dependencies):
                drifts.append({
                    'type': 'unauthorized_dependency',
                    'from': dep.source,
                    'to': dep.target,
                    'severity': 'high'
                })
        
        # 检查：是否有缺失的组件
        defined_components = {c.name for c in architecture_spec.components}
        actual_components = {c.name for c in actual_code.components}
        
        for comp in defined_components - actual_components:
            drifts.append({
                'type': 'missing_component',
                'component': comp,
                'severity': 'medium'
            })
        
        # 检查：通信方式是否符合架构
        for service in actual_code.services:
            if service.communication != architecture_spec.communication:
                drifts.append({
                    'type': 'communication_mismatch',
                    'service': service.name,
                    'expected': architecture_spec.communication,
                    'actual': service.communication
                })
        
        return drifts
```

---

## 六、实战：微服务系统的架构规范

### 场景：订单管理系统

**Architecture Spec**：

```yaml
architecture_spec:
  id: ARCH-ORDER-001
  name: 订单管理系统架构
  version: 1.0.0
  
  # Level 1: Context
  context:
    description: 处理用户下单、支付、库存管理的订单核心系统
    
    actors:
      - name: 消费者
        type: user
        description: 通过Web/App下单的终端用户
      
      - name: 商家
        type: user
        description: 处理订单的商家
      
      - name: 运营
        type: user
        description: 平台运营人员
    
    external_systems:
      - name: 支付网关
        criticality: high
      - name: 物流系统
        criticality: medium
      - name: 短信服务
        criticality: low
  
  # Level 2: Containers
  containers:
    frontend:
      - name: Consumer Web
        technology: Next.js
      - name: Consumer App
        technology: Flutter
      - name: Merchant Portal
        technology: Vue.js
    
    backend:
      - name: API Gateway
        technology: Kong
        responsibilities: [路由, 认证, 限流]
      
      - name: Order Service
        technology: Python/FastAPI
        database: PostgreSQL
        cache: Redis
        responsibilities:
          - 订单创建与管理
          - 订单状态机
          - 订单查询
        
      - name: Payment Service
        technology: Go
        database: PostgreSQL
        responsibilities:
          - 支付请求
          - 支付状态同步
          - 退款处理
        
      - name: Inventory Service
        technology: Java/Spring Boot
        database: Redis + MySQL
        responsibilities:
          - 库存扣减
          - 库存释放
          - 库存查询
        
      - name: Notification Service
        technology: Node.js
        database: MongoDB
        responsibilities:
          - 短信发送
          - 邮件通知
          - 站内信
    
    infrastructure:
      - name: Message Queue
        technology: RabbitMQ
        patterns:
          - Order events → Fanout to Payment, Inventory, Notification
          - Dead letter queue for failed processing
      
      - name: Cache Cluster
        technology: Redis Cluster
        usage:
          - Session storage
          - Hot data caching
          - Rate limiting
      
      - name: Search Engine
        technology: Elasticsearch
        usage:
          - Order search for operations
          - Analytics queries
  
  # Communication Patterns
  communication:
    synchronous:
      - pattern: Request-Response
        used_for:
          - 用户查询操作
          - 服务间强一致性要求
        constraints:
          - timeout: 5s
          - retry: 3 times
          - circuit_breaker: true
    
    asynchronous:
      - pattern: Event-Driven
        used_for:
          - 订单状态变更通知
          - 跨服务数据同步
        events:
          - name: OrderCreated
            producers: [Order Service]
            consumers: [Payment Service, Inventory Service, Notification Service]
          - name: OrderPaid
            producers: [Payment Service]
            consumers: [Order Service, Inventory Service, Notification Service]
          - name: OrderShipped
            producers: [Order Service]
            consumers: [Notification Service]
  
  # Data Architecture
  data:
    strategy: Database per Service
    
    order_service:
      primary_db: PostgreSQL
      schema:
        - orders
        - order_items
        - order_status_history
      
    payment_service:
      primary_db: PostgreSQL
      schema:
        - payments
        - refunds
        - payment_transactions
      
    inventory_service:
      cache: Redis
      primary_db: MySQL
      schema:
        - inventory
        - inventory_transactions
        - stock_reservations
  
  # API Contracts
  apis:
    order_service:
      spec_file: ./openapi/order-service.yaml
      version: 1.0.0
      base_path: /api/v1/orders
    
    payment_service:
      spec_file: ./openapi/payment-service.yaml
      version: 1.0.0
      base_path: /api/v1/payments
    
    inventory_service:
      spec_file: ./openapi/inventory-service.yaml
      version: 1.0.0
      base_path: /api/v1/inventory
  
  # Non-Functional Requirements
  constraints:
    performance:
      - metric: API latency (p99)
        target: < 200ms
      - metric: Order creation
        target: < 500ms
      - metric: Database query
        target: < 50ms
    
    availability:
      - target: 99.9% uptime
      - RTO: < 30 minutes
      - RPO: < 5 minutes
    
    scalability:
      - target: 10,000 orders/minute
      - auto_scaling: enabled
      - horizontal_scaling: supported
    
    security:
      - authentication: JWT
      - authorization: RBAC
      - data_encryption: AES-256
      - audit_logging: required
    
    consistency:
      - order_status: strong consistency
      - inventory: eventual consistency (with compensation)
      - payment: strong consistency
  
  # Architecture Decisions
  decisions:
    - id: ADR-001
      title: 使用消息队列处理订单事件
      context: 订单创建后需要通知多个服务
      decision: 使用 RabbitMQ 发布订单事件
      consequences:
        - 服务解耦
        - 需要处理消息丢失
        - 需要实现幂等消费
      
    - id: ADR-002
      title: 库存服务使用 Redis + MySQL
      context: 高并发库存扣减
      decision: Redis 处理扣减，MySQL 持久化
      consequences:
        - 高性能
        - 需要处理 Redis-MySQL 一致性
        - 需要回滚机制
      
    - id: ADR-003
      title: 使用 Saga 模式处理分布式事务
      context: 订单创建涉及多个服务
      decision: 使用 Saga 编排模式
      consequences:
        - 最终一致性
        - 需要补偿逻辑
        - 需要监控和告警
  
  # Deployment Architecture
  deployment:
    platform: Kubernetes
    
    order_service:
      replicas: 3
      resources:
        cpu: 500m - 2000m
        memory: 512Mi - 2Gi
      hpa:
        min_replicas: 3
        max_replicas: 20
        target_cpu: 70%
    
    payment_service:
      replicas: 3
      resources:
        cpu: 500m - 1000m
        memory: 512Mi - 1Gi
    
    inventory_service:
      replicas: 5
      resources:
        cpu: 1000m - 2000m
        memory: 1Gi - 2Gi
```

### 生成的制品

从这个 Architecture Spec，AI 可以生成：

**1. 代码脚手架**
```bash
order-service/
├── app/
│   ├── api/
│   │   └── orders.py
│   ├── domain/
│   │   ├── models/
│   │   └── services/
│   └── infrastructure/
│       ├── repositories/
│       └── messaging/
├── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── hpa.yaml
├── Dockerfile
└── docker-compose.yml
```

**2. 部署配置**
```yaml
# k8s/order-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: order-service
  template:
    metadata:
      labels:
        app: order-service
    spec:
      containers:
        - name: order-service
          image: order-service:latest
          resources:
            requests:
              cpu: 500m
              memory: 512Mi
            limits:
              cpu: 2000m
              memory: 2Gi
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: order-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: order-service
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

**3. 监控配置**
```yaml
# monitoring/alerts.yaml
groups:
  - name: order-service
    rules:
      - alert: HighLatency
        expr: histogram_quantile(0.99, rate(order_api_latency_bucket[5m])) > 0.2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Order API latency is high"
      
      - alert: OrderFailureRate
        expr: rate(order_creation_failed_total[5m]) / rate(order_creation_total[5m]) > 0.01
        for: 5m
        labels:
          severity: critical
```

---

## 七、写在最后：架构即代码

### 范式转移

**传统架构设计**：
- 架构师画图 → 工程师看图 → 各自理解 → 实现偏差
- 文档是静态的、滞后的
- 架构验证靠人工

**Architecture Spec**：
- 架构师写规格 → AI 生成代码/验证 → 自动对齐
- 规格是动态的、可追溯的
- 架构验证自动化

### Architecture as Code 的核心原则

**1. 单一真相源**
- Architecture Spec 是架构的唯一真相源
- 代码、文档、部署配置都从这里生成

**2. 版本控制**
- 架构变更通过 Git 管理
- 代码审查包括架构审查

**3. 自动化验证**
- 每次提交自动验证架构合规性
- 架构漂移及时告警

**4. 可演化性**
- 架构规格支持版本管理
- 变更影响自动分析

### 架构师角色的进化

**从**：画图写文档
**到**：定义 Architecture Spec，指导 AI 生成和验证

**新技能**：
- 结构化架构描述
- 约束定义
- AI 协作

---

## 📚 延伸阅读

### C4 Model
- **The C4 Model for Visualising Software Architecture**: Simon Brown
- **c4model.com**: 官方文档和工具

### API 设计
- **OpenAPI Specification**: 官方规范文档
- **API Design Patterns**: API 设计模式

### 微服务架构
- **Building Microservices**: Sam Newman
- **The Twelve-Factor App**: 云原生应用方法论

### 架构验证
- **ArchUnit**: Java 架构测试框架
- **PlantUML**: 文本化架构图工具

---

*AI-Native SDLC 交付件体系 #05*  
*深度阅读时间：约 22 分钟*

*下一篇预告：《Execution Plan：工程执行的 AI 编排》*
