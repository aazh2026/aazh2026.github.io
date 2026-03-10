---
layout: post
title: "Execution Plan：工程执行的 AI 编排"
date: 2026-03-09T00:00:00+08:00
permalink: /2026/03/09/execution-plan-ai-orchestration.html
tags: [Execution Plan, AI编排, 工程管理, 任务拆解, 研发效能]
author: Aaron
series: AI-Native SDLC 交付件体系 #06

redirect_from:
  - /2026/03/09/execution-plan-ai-orchestration.html
---

> *「2024年，一个技术主管盯着满墙的任务看板发愁：'为什么每个迭代的任务都完不成？'不是工程师不努力，而是任务拆解不合理——史诗拆成故事，故事拆成任务，全靠经验直觉。在AI时代，Execution Plan 让任务拆解从'艺术'变成'科学'，AI 可以基于 Product Intent 和 Architecture Spec 自动生成最优的执行计划。」*

---

## 📋 本文结构

1. [传统任务管理的困境](#一传统任务管理的困境) — 为什么估算总是不准
2. [什么是 Execution Plan](#二什么是-execution-plan) — 结构化的执行蓝图
3. [四层拆解：Epic → Story → Task → Subtask](#三四层拆解epic--story--task--subtask) — 层次化工作分解
4. [AI 驱动的任务生成与估算](#四ai-驱动的任务生成与估算) — 从规格到执行
5. [依赖管理与关键路径](#五依赖管理与关键路径) — 智能调度优化
6. [实战：订单功能的 Execution Plan](#六实战订单功能的-execution-plan) — 完整案例
7. [写在最后：从甘特图到可执行计划](#七写在最后从甘特图到可执行计划) — 范式转移的意义

---

## 一、传统任务管理的困境

### 经典敏捷估算

敏捷开发中，任务估算通常是这样的：

```
产品经理：这个功能需要多久？
工程师：（思考片刻）大概 3 天吧。
产品经理：好，那就排进这个迭代。

一周后...
工程师：还没做完，有依赖阻塞了。
产品经理：什么依赖？为什么不早说？
```

### 困境 1：估算偏差

**研究数据**：
- 软件项目估算平均偏差 **200-300%**
- 只有 **30%** 的功能按时交付
- **70%** 的项目超出预算

**根本原因**：
- 依赖考虑不全
- 风险预估不足
- 任务粒度不一致

### 困境 2：依赖黑洞

```
任务 A：开发订单创建接口
  ↓
任务 B：开发支付接口（依赖 A）
  ↓
任务 C：开发库存扣减（依赖 B）
  ↓
任务 D：集成测试（依赖 A、B、C）

问题：
- 这些依赖关系在哪里记录？
- 如果 A 延期，影响范围多大？
- 关键路径是什么？
```

### 困境 3：任务粒度不一致

```
工程师 A 的"任务"：
- 实现用户登录（预估：8 小时）
  → 实际上包含：API、前端、测试、联调

工程师 B 的"任务"：
- 配置 Redis 连接（预估：1 小时）
  → 实际上就真的是配置连接

结果：两个"任务"工作量相差 10 倍
```

### 困境 4：缺少上下文

```
任务描述：实现优惠券功能

问题：
- 基于什么架构？
- 使用什么技术栈？
- 有哪些约束条件？
- 验收标准是什么？

工程师只能猜测，导致返工。
```

### 困境 5：静态计划

```
周一：按计划应该完成 A
实际：A 只完成了 50%

问题：
- 后续任务怎么办？
- 计划是否需要调整？
- 谁来负责更新计划？

传统方式：人工调整，滞后且容易遗漏
```

---

## 二、什么是 Execution Plan

### 定义

**Execution Plan（执行计划）**：基于 Product Intent、Architecture Spec 和团队能力模型，由 AI 自动生成的、结构化的、可追踪的工程执行蓝图，包含任务拆解、工作量估算、依赖关系、资源分配和进度追踪。

### Execution Plan vs 传统任务列表

| 维度 | 传统任务列表 | Execution Plan |
|------|-------------|----------------|
| **来源** | 人工拆解 | AI 自动生成 |
| **粒度** | 不一致 | 标准化 |
| **依赖** | 隐式 | 显式、可计算 |
| **估算** | 直觉 | 数据驱动 |
| **上下文** | 分离 | 内嵌完整上下文 |
| **更新** | 人工 | 自动同步变更 |

### 核心组成

```yaml
execution_plan:
  metadata:           # 基本信息
  context:            # 执行上下文
  epics:              # 史诗级任务
  dependencies:       # 依赖关系图
  timeline:           # 时间线
  resources:          # 资源分配
  risks:              # 风险评估
  milestones:         # 里程碑
  tracking:           # 追踪机制
```

---

## 三、四层拆解：Epic → Story → Task → Subtask

### 层次化工作分解结构（WBS）

```
Epic（史诗）         - 业务目标，可独立交付的价值
  ↓
Story（用户故事）     - 用户可感知的功能点
  ↓
Task（任务）          - 技术实现单元
  ↓
Subtask（子任务）     - 最小执行单元
```

### Level 1: Epic

**定义**：可独立交付的业务价值单元，通常对应一个产品功能模块。

```yaml
epics:
  - id: EP-001
    title: 订单管理模块
    description: 支持用户创建、查看、管理订单
    
    business_value:
      - 提升下单转化率 10%
      - 降低客服咨询量 20%
    
    product_intent_ref: PI-ORDER-001
    architecture_ref: ARCH-ORDER-001
    
    acceptance_criteria:
      - 用户可以创建订单
      - 用户可以查看订单历史
      - 用户可以取消订单
      - 订单状态实时同步
    
    estimated_effort: 80  # story points
    estimated_duration: "4 weeks"
    priority: high
    
    stories: [ST-001, ST-002, ST-003, ST-004]
```

### Level 2: Story

**定义**：从用户角度描述的功能点，对应 User Story Pack。

```yaml
stories:
  - id: ST-001
    title: 创建订单
    narrative:
      as_a: 注册用户
      i_want: 创建购买订单
      so_that: 完成商品购买
    
    user_story_pack_ref: USP-ORDER-001
    
    acceptance_criteria:
      - 选择商品后创建订单
      - 计算订单金额（商品+运费-优惠）
      - 生成唯一订单号
      - 扣减库存
    
    estimated_effort: 21
    
    tasks:
      - TK-001: 订单领域模型设计
      - TK-002: 订单创建 API 实现
      - TK-003: 库存扣减集成
      - TK-004: 前端下单页面
      - TK-005: 单元测试
      - TK-006: 集成测试
```

### Level 3: Task

**定义**：技术实现单元，对应具体的开发工作。

```yaml
tasks:
  - id: TK-001
    title: 订单领域模型设计
    type: design
    
    context:
      tech_stack: Python/FastAPI
      database: PostgreSQL
      patterns: [DDD, Repository]
    
    deliverables:
      - Order 实体类
      - OrderItem 值对象
      - OrderStatus 枚举
      - OrderRepository 接口
    
    estimated_hours: 8
    
    subtasks:
      - SK-001: 定义 Order 实体字段和验证规则
      - SK-002: 实现 Order 状态机
      - SK-003: 设计 Order 数据库 Schema
      - SK-004: 编写领域模型单元测试
```

### Level 4: Subtask

**定义**：最小执行单元，通常对应一次代码提交。

```yaml
subtasks:
  - id: SK-001
    title: 定义 Order 实体字段和验证规则
    
    specification: |
      创建 Order 领域模型：
      - id: UUID (自动生成)
      - user_id: UUID (外键)
      - items: List[OrderItem] (至少1项)
      - total_amount: Decimal (> 0)
      - status: OrderStatus (默认 pending)
      - created_at: datetime
      - updated_at: datetime
      
      验证规则：
      - user_id 不能为空
      - items 不能为空
      - total_amount 必须等于 items 金额总和
    
    estimated_hours: 2
    
    acceptance_criteria:
      - Order 类可实例化
      - 验证规则正确
      - 单元测试覆盖
    
    ai_prompt: |
      基于以下架构规范，生成 Order 领域模型代码：
      
      技术栈：Python 3.11, Pydantic v2
      模式：领域驱动设计
      
      要求：
      1. 使用 Pydantic BaseModel
      2. 实现字段验证
      3. 包含 __repr__ 方法
      4. 添加类型注解
```

---

## 四、AI 驱动的任务生成与估算

### 从规格到任务的自动生成

```
输入：
├── Product Intent
├── Architecture Spec
├── User Story Pack
└── 历史项目数据

AI 处理：
├── 解析需求复杂度
├── 分析技术约束
├── 识别依赖关系
├── 估算工作量
└── 生成任务树

输出：
└── Execution Plan
```

### 智能任务拆解

**示例**：从 User Story 生成任务

```yaml
# 输入：User Story
story:
  title: 使用优惠券下单
  acceptance_criteria:
    - 验证优惠券有效性
    - 计算折扣金额
    - 处理优惠券冲突

# AI 生成的任务
tasks:
  - id: TK-COUPON-001
    title: 优惠券验证逻辑
    description: |
      实现优惠券验证：
      - 检查有效期
      - 检查使用次数
      - 检查用户资格
    estimated_hours: 6
    complexity: medium
    
  - id: TK-COUPON-002
    title: 折扣计算引擎
    description: |
      实现折扣计算：
      - 满减计算
      - 百分比折扣
      - 叠加规则检查
    estimated_hours: 8
    complexity: medium
    
  - id: TK-COUPON-003
    title: 优惠券应用接口
    description: |
      实现 API：
      - POST /api/v1/orders/apply-coupon
      - 输入：order_id, coupon_code
      - 输出：折扣后的订单
    estimated_hours: 4
    complexity: low
    dependencies: [TK-COUPON-001, TK-COUPON-002]
```

### 数据驱动的估算

```python
class AIEstimator:
    """基于历史数据的 AI 估算器"""
    
    def __init__(self, historical_data):
        self.model = train_effort_model(historical_data)
    
    def estimate(self, task_spec):
        """
        估算任务工作量
        
        考虑因素：
        - 代码复杂度
        - 技术栈熟悉度
        - 历史类似任务
        - 风险因子
        """
        features = {
            'lines_of_code_estimate': self.estimate_loc(task_spec),
            'complexity_score': self.calculate_complexity(task_spec),
            'tech_stack_complexity': self.get_tech_complexity(task_spec),
            'integration_points': self.count_integrations(task_spec),
            'test_coverage_requirement': task_spec.get('test_requirement', 0.8)
        }
        
        # 基础估算
        base_estimate = self.model.predict(features)
        
        # 应用风险调整
        risk_factors = self.identify_risks(task_spec)
        adjusted_estimate = self.apply_risk_adjustment(
            base_estimate, risk_factors
        )
        
        # 生成置信区间
        return {
            'optimistic': adjusted_estimate * 0.7,
            'nominal': adjusted_estimate,
            'pessimistic': adjusted_estimate * 1.5,
            'confidence': self.calculate_confidence(features)
        }
    
    def identify_risks(self, task_spec):
        """识别任务风险因子"""
        risks = []
        
        # 新技术风险
        if task_spec.get('new_technology'):
            risks.append({
                'type': 'new_tech',
                'factor': 1.3,
                'description': '使用未经验证的技术'
            })
        
        # 外部依赖风险
        if task_spec.get('external_dependencies'):
            risks.append({
                'type': 'external_dep',
                'factor': 1.2,
                'description': '依赖外部团队/系统'
            })
        
        # 性能要求风险
        if task_spec.get('performance_critical'):
            risks.append({
                'type': 'performance',
                'factor': 1.4,
                'description': '严格的性能要求'
            })
        
        return risks
```

### 工作量估算示例

```yaml
estimation:
  task_id: TK-001
  task_title: 订单领域模型设计
  
  ai_analysis:
    complexity_factors:
      - factor: 实体关系复杂度
        score: 7/10
        reason: Order 关联 OrderItem、User、Payment
      
      - factor: 业务规则复杂度
        score: 8/10
        reason: 状态机、金额计算、库存约束
      
      - factor: 技术栈熟悉度
        score: 8/10
        reason: 团队熟悉 Python/DDD
      
      - factor: 测试要求
        score: 9/10
        reason: 需要高单元测试覆盖率
    
    historical_similarity:
      - similar_task: TK-USER-003 用户领域模型
        actual_hours: 6
        similarity: 0.85
      
      - similar_task: TK-PAYMENT-001 支付领域模型
        actual_hours: 10
        similarity: 0.75
    
  estimated_hours:
    optimistic: 6
    nominal: 8
    pessimistic: 12
    confidence: 0.75
  
  breakdown:
    - activity: 实体设计
      hours: 2
    - activity: 状态机实现
      hours: 3
    - activity: Schema 设计
      hours: 1.5
    - activity: 单元测试
      hours: 1.5
  
  risks:
    - description: 状态机状态定义可能变更
      probability: 0.3
      impact: +2 hours
    
    - description: 金额计算精度问题
      probability: 0.2
      impact: +3 hours
```

---

## 五、依赖管理与关键路径

### 依赖关系建模

```yaml
dependencies:
  # 任务依赖定义
  task_dependencies:
    - task: TK-002
      depends_on: TK-001
      type: finish_to_start
      reason: 需要订单模型完成后才能开发API
    
    - task: TK-003
      depends_on: TK-001
      type: finish_to_start
    
    - task: TK-006
      depends_on: [TK-002, TK-003, TK-004]
      type: finish_to_start
      reason: 集成测试需要所有模块完成
  
  # 外部依赖
  external_dependencies:
    - task: TK-003
      depends_on:
        system: Inventory Service
        status: ready
        risk: medium
      
    - task: TK-005
      depends_on:
        system: Payment Gateway API
        status: contract_ready
        risk: low
  
  # 资源依赖
  resource_dependencies:
    - task: TK-004
      requires:
        role: frontend_developer
        availability: "2026-03-15"
```

### 关键路径分析

```python
class CriticalPathAnalyzer:
    """关键路径分析器"""
    
    def analyze(self, tasks, dependencies):
        # 构建任务图
        graph = self.build_graph(tasks, dependencies)
        
        # 计算最早开始/结束时间
        for task in self.topological_sort(graph):
            task.earliest_start = max(
                [dep.task.earliest_finish for dep in task.dependencies],
                default=0
            )
            task.earliest_finish = task.earliest_start + task.duration
        
        # 计算最晚开始/结束时间
        for task in reversed(self.topological_sort(graph)):
            task.latest_finish = min(
                [dep.task.latest_start for dep in task.successors],
                default=task.earliest_finish
            )
            task.latest_start = task.latest_finish - task.duration
        
        # 识别关键路径
        critical_path = [
            task for task in tasks
            if task.earliest_start == task.latest_start
        ]
        
        return {
            'critical_path': critical_path,
            'total_duration': sum(t.duration for t in critical_path),
            'float_analysis': self.calculate_float(tasks),
            'bottlenecks': self.identify_bottlenecks(graph)
        }
    
    def identify_bottlenecks(self, graph):
        """识别资源瓶颈"""
        resource_load = defaultdict(list)
        
        for task in graph.tasks:
            for day in range(task.start, task.end):
                resource_load[task.assigned_resource].append(day)
        
        bottlenecks = []
        for resource, days in resource_load.items():
            load = len(days) / (max(days) - min(days) + 1)
            if load > 0.9:
                bottlenecks.append({
                    'resource': resource,
                    'load': load,
                    'period': (min(days), max(days))
                })
        
        return bottlenecks
```

### 动态计划调整

```python
class DynamicPlanner:
    """动态计划调整器"""
    
    def __init__(self, execution_plan):
        self.plan = execution_plan
        self.current_status = {}
    
    def update_progress(self, task_id, progress):
        """更新任务进度"""
        self.current_status[task_id] = progress
        
        # 检查是否需要调整计划
        if self.is_delayed(task_id):
            impact = self.calculate_impact(task_id)
            suggestions = self.generate_adjustments(impact)
            
            return {
                'alert': f'任务 {task_id} 延期',
                'impact': impact,
                'suggestions': suggestions
            }
    
    def generate_adjustments(self, impact):
        """生成调整建议"""
        suggestions = []
        
        # 建议1：增加资源
        if impact['affected_tasks'] < 3:
            suggestions.append({
                'type': 'add_resource',
                'description': '增加开发人员加快进度',
                'effort': 'low'
            })
        
        # 建议2：任务并行化
        if self.can_parallelize(impact['bottleneck_task']):
            suggestions.append({
                'type': 'parallelize',
                'description': '将任务拆分为并行子任务',
                'effort': 'medium'
            })
        
        # 建议3：范围裁剪
        suggestions.append({
            'type': 'scope_reduction',
            'description': '将非核心功能移至下个迭代',
            'effort': 'high',
            'impact': '需要产品经理确认'
        })
        
        # 建议4：调整里程碑
        suggestions.append({
            'type': 'milestone_shift',
            'description': f'将里程碑延期 {impact["delay_days"]} 天',
            'effort': 'low'
        })
        
        return suggestions
```

---

## 六、实战：订单功能的 Execution Plan

### 场景：订单管理模块

```yaml
execution_plan:
  id: EP-ORDER-001
  name: 订单管理模块开发计划
  version: 1.0.0
  created_at: 2026-03-01
  
  context:
    product_intent: PI-ORDER-001
    architecture: ARCH-ORDER-001
    team:
      - name: 张三
        role: backend_lead
        capacity: 40h/week
      - name: 李四
        role: backend_dev
        capacity: 40h/week
      - name: 王五
        role: frontend_dev
        capacity: 40h/week
      - name: 赵六
        role: qa_engineer
        capacity: 40h/week
    sprint:
      duration: 2_weeks
      start_date: 2026-03-15
  
  epics:
    - id: EP-001
      title: 订单创建功能
      stories: [ST-001, ST-002]
      priority: critical
      milestone: "Sprint 1 结束"
      
    - id: EP-002
      title: 订单查询功能
      stories: [ST-003]
      priority: high
      milestone: "Sprint 1 结束"
      
    - id: EP-003
      title: 订单取消功能
      stories: [ST-004]
      priority: medium
      milestone: "Sprint 2 结束"
  
  stories:
    - id: ST-001
      title: 基础订单创建
      epic: EP-001
      tasks: [TK-001, TK-002, TK-003, TK-004, TK-005]
      estimated_points: 13
      
    - id: ST-002
      title: 优惠券集成
      epic: EP-001
      tasks: [TK-006, TK-007, TK-008]
      estimated_points: 8
      
    - id: ST-003
      title: 订单列表查询
      epic: EP-002
      tasks: [TK-009, TK-010, TK-011]
      estimated_points: 8
      
    - id: ST-004
      title: 订单取消
      epic: EP-003
      tasks: [TK-012, TK-013]
      estimated_points: 5
  
  tasks:
    # ST-001: 基础订单创建
    - id: TK-001
      title: Order 领域模型设计
      story: ST-001
      assignee: 张三
      estimated_hours: 8
      subtasks: [SK-001, SK-002, SK-003]
      
    - id: TK-002
      title: 订单创建 API 实现
      story: ST-001
      assignee: 李四
      estimated_hours: 12
      dependencies: [TK-001]
      
    - id: TK-003
      title: 库存服务集成
      story: ST-001
      assignee: 李四
      estimated_hours: 8
      dependencies: [TK-001]
      external_dependency:
        system: Inventory Service
        contact:  inventory_team@company.com
      
    - id: TK-004
      title: 前端下单页面
      story: ST-001
      assignee: 王五
      estimated_hours: 16
      dependencies: [TK-002]
      
    - id: TK-005
      title: 订单创建集成测试
      story: ST-001
      assignee: 赵六
      estimated_hours: 8
      dependencies: [TK-003, TK-004]
      
    # ST-002: 优惠券集成
    - id: TK-006
      title: 优惠券验证逻辑
      story: ST-002
      assignee: 李四
      estimated_hours: 8
      dependencies: [TK-001]
      
    - id: TK-007
      title: 订单金额计算（含优惠）
      story: ST-002
      assignee: 李四
      estimated_hours: 6
      dependencies: [TK-002, TK-006]
      
    - id: TK-008
      title: 优惠券前端界面
      story: ST-002
      assignee: 王五
      estimated_hours: 8
      dependencies: [TK-007]
      
    # ST-003: 订单列表查询
    - id: TK-009
      title: 订单查询 API
      story: ST-003
      assignee: 张三
      estimated_hours: 8
      dependencies: [TK-001]
      
    - id: TK-010
      title: 订单列表前端
      story: ST-003
      assignee: 王五
      estimated_hours: 12
      dependencies: [TK-009]
      
    - id: TK-011
      title: 分页与排序功能
      story: ST-003
      assignee: 张三
      estimated_hours: 6
      dependencies: [TK-009]
      
    # ST-004: 订单取消
    - id: TK-012
      title: 取消订单 API
      story: ST-004
      assignee: 李四
      estimated_hours: 8
      dependencies: [TK-002, TK-003]
      
    - id: TK-013
      title: 取消订单前端
      story: ST-004
      assignee: 王五
      estimated_hours: 4
      dependencies: [TK-012]
  
  timeline:
    sprint_1:
      start: "2026-03-15"
      end: "2026-03-28"
      deliverables:
        - EP-001: 订单创建功能（含优惠券）
        - EP-002: 订单查询功能
      
    sprint_2:
      start: "2026-03-29"
      end: "2026-04-11"
      deliverables:
        - EP-003: 订单取消功能
        - 性能优化
        - Bug 修复
  
  dependencies:
    internal:
      - from: TK-002
        to: TK-001
      - from: TK-003
        to: TK-001
      - from: TK-004
        to: TK-002
      - from: TK-005
        to: [TK-003, TK-004]
      - from: TK-007
        to: [TK-002, TK-006]
      - from: TK-012
        to: [TK-002, TK-003]
    
    external:
      - task: TK-003
        system: Inventory Service
        status: api_contract_ready
        risk: low
    
  critical_path:
    - TK-001 (Day 1-2)
    - TK-002 (Day 2-4)
    - TK-003 (Day 2-3)  # 可并行
    - TK-004 (Day 4-6)
    - TK-005 (Day 6-7)
    
    total_duration: "7 working days"
    float_tasks: [TK-006, TK-007, TK-008]  # 可调整
  
  risks:
    - id: RISK-001
      description: Inventory Service API 延期
      probability: 0.3
      impact: high
      mitigation: 提前对接，准备 mock 方案
      
    - id: RISK-002
      description: 优惠券规则复杂度超预期
      probability: 0.4
      impact: medium
      mitigation: 先实现基础满减，叠加规则延后
      
    - id: RISK-003
      description: 前端资源紧张
      probability: 0.2
      impact: medium
      mitigation: 考虑外包或延后低优先级任务
  
  tracking:
    metrics:
      - velocity: story_points/week
      - burndown: remaining_hours
      - lead_time: story_creation_to_done
      - cycle_time: in_progress_to_done
    
    dashboards:
      - sprint_burndown
      - epic_progress
      - team_capacity
      - risk_register
```

### AI 辅助的进度追踪

```yaml
progress_update:
  date: "2026-03-20"
  updates:
    - task: TK-001
      status: completed
      actual_hours: 9
      variance: +1
    
    - task: TK-002
      status: in_progress
      progress: 60%
      estimated_completion: "2026-03-22"
    
    - task: TK-003
      status: blocked
      reason: "Inventory Service API 文档不完整"
      escalation: true
  
  ai_analysis:
    sprint_health: at_risk
    
    predictions:
      - epic: EP-001
        on_track_probability: 0.65
        predicted_completion: "2026-03-30"  # 延期 2 天
        
      - epic: EP-002
        on_track_probability: 0.85
        predicted_completion: "2026-03-28"
    
    recommendations:
      - priority: high
        action: 召开 Inventory Service 对接会议
        owner: Tech Lead
        
      - priority: medium
        action: 将 TK-008（优惠券前端）移至 Sprint 2
        owner: Product Manager
        
      - priority: low
        action: 考虑增加李四下周工作量至 45h
        owner: Engineering Manager
```

---

## 七、写在最后：从甘特图到可执行计划

### 范式转移

**传统项目计划**：
- 项目经理手工制定
- 甘特图展示，静态展示
- 变更时人工调整
- 进度追踪滞后

**Execution Plan**：
- AI 自动生成
- 结构化规格，动态更新
- 变更自动传播
- 实时进度追踪和预测

### Execution Plan 的核心价值

| 价值 | 说明 |
|------|------|
| **准确性** | 数据驱动的估算，减少偏差 |
| **透明性** | 依赖关系清晰可见 |
| **适应性** | 动态调整，快速响应变化 |
| **可追溯** | 任务与需求、代码自动关联 |
| **可预测** | AI 预测延期风险，提前干预 |

### 实施建议

**阶段 1：工具化**
- 使用支持结构化 Execution Plan 的工具
- 建立历史项目数据库

**阶段 2：自动化**
- AI 辅助任务拆解
- 自动生成依赖图和关键路径

**阶段 3：智能化**
- 预测性进度管理
- 自动资源调配建议

---

## 📚 延伸阅读

### 项目管理
- **The Mythical Man-Month**: Fred Brooks
- **Agile Estimating and Planning**: Mike Cohn
- **Critical Chain**: Eliyahu Goldratt

### AI 与项目管理
- **AI in Project Management**: 研究论文
- **Predictive Analytics for Software Projects**

### 工程效能
- **Accelerate**: Nicole Forsgren et al.
- **DORA Metrics**: DevOps 效能指标

---

*AI-Native SDLC 交付件体系 #06*  
*深度阅读时间：约 20 分钟*

*下一篇预告：《Quality Contract：质量验证的契约化》*
