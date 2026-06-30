---
layout: post
title: '交付件模板大全：开箱即用的 AI-Native SDLC 规格'
date: 2025-04-06T00:00:00+08:00
tags: [Templates, AI-Native, SDLC, 交付件, 规范, 工具包]
description: "提供Product Intent、User Story Pack、Architecture Spec等八大交付件模板，将AI-Native开发全流程标准化为可验证、可执行的接口协议。"
author: "@postcodeeng"
series: AI-Native SDLC 交付件体系
---

> **TL;DR**
>
> 本文核心观点：
> 1. **接口协议** — 在AI时代，交付件模板是团队与AI协作的接口协议，结构越标准，AI理解越准确
> 2. **八大模板** — 从 Product Intent 到 Traceability Matrix，覆盖需求到上线的全生命周期
> 3. **自包含可验证** — 每个模板字段自带验证规则，无需外部解释即可独立使用
> 4. **CI/CD 就绪** — 所有模板均可进入自动化流水线，实现Schema验证与质量卡点
>
> 统一的交付件模板，是AI-Native工程团队的基础设施。

---

> *「2024年，一位技术负责人看着团队各自编写的需求文档叹气：'为什么同样的功能，每个人写的格式都不一样？'不是大家不专业，而是缺少统一的标准。在AI时代，交付件模板不仅是格式规范，更是与AI协作的接口协议——结构越标准，AI理解越准确。」*

---

## 模板设计理念

<object data="/assets/images/2025-04-06-artifacts-templates-collection-01-template-ecosystem.svg" type="image/svg+xml" width="100%" aria-label="AI-Native SDLC 交付件模板生态" role="img"></object>

<object data="/assets/images/2025-04-06-artifacts-templates-collection-01-artifacts-relation.svg" type="image/svg+xml" width="100%" aria-label="AI-Native SDLC 交付件关系图" role="img"></object>

### 设计原则

**原则 1：机器可读优先**

**原则 2：自包含**

每个交付件模板应包含完整上下文，不依赖外部解释。

> 💡 **Key Insight**
>
> 每个交付件模板应包含完整上下文，不依赖外部解释。

**原则 3：可验证**

模板中的每个字段都应有验证规则。

> 💡 **Key Insight**
>
> 模板中的每个字段都应有验证规则。

**原则 4：可扩展**

允许在标准字段基础上添加自定义字段。

> 💡 **Key Insight**
>
> 允许在标准字段基础上添加自定义字段。

---

## Product Intent 模板

### 完整模板

Product Intent 是整个交付件体系的起点，定义"为什么要做这件事"。它的核心价值在于将业务目标转化为可度量的工程成果，让每个后续模板都能追溯到明确的业务意图。

```yaml
# Product Intent 示例：站内通知系统
title: '站内通知系统 v1.0'
date: 2025-04-06

business_objective: |
  降低用户因错过重要信息而产生的损失，提升产品完成核心流程的比例。
  目标：消息送达率从 62% 提升至 90%，用户主动查看率从 18% 提升至 40%。

target_users: |
  - 日活用户中近 30 天有关键操作但未完成转化的群体
  - 期待实时反馈的操作密集型用户（如订单状态、审核结果）

success_metrics:
  - 指标1: 消息送达率（服务端发送成功且客户端展示）≥ 90%
  - 指标2: 用户点开通知查看详情率 ≥ 40%
  - 指标3: 因通知触发的目标行为转化率 ≥ 15%
  - 指标4: 通知点击到完成操作的平均时长 ≤ 5 分钟

constraints: |
  - 遵守平台通知政策，避免过度打扰（每日上限 3 条/用户）
  - 消息内容加密传输，存储于用户本地及服务器端均需加密
  - 支持在用户设备离线时延迟投递，连网后补发

related_artifacts:
  - user_story_pack: "stories/2025-04-notification-system.md"
  - arch_spec: "arch/2025-04-notification-system.md"
```

字段说明：
- `business_objective` 使用"问题→目标"的叙事结构，量化当前状态和期望状态
- `success_metrics` 必须可测量、可验证，避免主观描述
- `constraints` 涵盖合规、性能、安全等非功能性边界
- `related_artifacts` 建立与其他交付件的链接，形成可追溯链路

### 使用示例

> 💡 **Key Insight**
>
> 在AI时代，交付件模板不仅是格式规范，更是与AI协作的接口协议——结构越标准，AI理解越准确

---

## User Story Pack 模板

### 完整模板

User Story Pack 将 Product Intent 拆解为具体的用户需求单元。每个 Pack 以标准的 `As a / I want / So that` 格式开场，后接可测试的验收条件——这是 AI Agent 理解"这件事做成什么样才算对"的核心依据。

```yaml
# User Story Pack 示例
user_story:
  role: "已注册用户"
  action: "在站内收到通知后"
  benefit: "能够快速查看通知内容并完成相关操作，减少切换 App 的麻烦"

acceptance_criteria:
  - "通知送达后 3 秒内，通知中心展示新通知，角标数字更新"
  - "点击通知后直接跳转到相关页面，不是通用的通知列表"
  - "在通知列表页，每条通知显示：发送时间、简短摘要、是否已读状态"
  - "未读通知排在已读前面，支持左滑标记为已读"

testable_conditions:
  - "条件1: 客户端在后台时，APNs 推送能唤醒 App 并在通知中心展示"
  - "条件2: 通知内容超过 50 字时，显示省略号，点击后展开全文"
  - "条件3: 同一用户每天收到的通知不超过 3 条（频率控制）"

dependencies:
  - "依赖1: 通知服务后端 API 已部署并通过压测（QPS ≥ 1000）"
  - "依赖2: 用户设备已开启通知权限"

effort_estimate: "M（5 人天），包含前端展示和频率控制逻辑"
```

`testable_conditions` 是区分 User Story Pack 与普通 Story 的关键：每个条件都是可自动化验证的断言，而非"功能应该是好用的"这种主观描述。AI Agent 在实现功能时，会将这些条件作为完成的定义。

### 使用示例

---

## Architecture Spec 模板

### 完整模板

Architecture Spec 为系统或模块提供完整的上下文视图。它不是单纯的架构图，而是包含决策理由、约束边界和非功能性要求的完整技术文档。AI Agent 在实现功能时，会先读取 Arch Spec 建立全局理解，再基于此分解任务。

```yaml
# Architecture Spec 示例：通知系统微服务
title: '通知系统微服务 Architecture Spec'
date: 2025-04-06
owner: "@backend-team"

overview: |
  通知系统作为独立微服务，通过消息队列解耦上游业务系统，
  负责通知的聚合、路由、发送和状态追踪。

system_context: |
  ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐
  │  上游业务服务 │───▶│  消息队列     │───▶│  通知微服务      │
  │  (订单/审核) │    │  (Kafka)     │    │  (本服务)        │
  └─────────────┘    └──────────────┘    └────────┬────────┘
                                                   │
                       ┌───────────────────────────┼───────────────────────────┐
                       │                           ▼                           │
                       │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
                       │  │  APNs       │  │  站内信存储  │  │  监控告警   │   │
                       │  │  (APNS)     │  │  (Redis)    │  │  (PagerDuty)│   │
                       │  └─────────────┘  └─────────────┘  └─────────────┘   │
                       └───────────────────────────────────────────────────────┘

component_design:
  - component: "通知聚合器"
    responsibility: "从 Kafka 消费上游事件，按用户维度聚合，批量写入发送队列"
    tech_stack: "Java 17 / Spring Boot 3 / Redis Streams"
  - component: "发送引擎"
    responsibility: "对接 APNs、极光、极光 push 等多通道，支持失败重试和频率控制"
    tech_stack: "Python 3.11 / asyncio / aiohttp"
  - component: "状态追踪器"
    responsibility: "记录每条消息的发送状态（发送中/成功/失败），供查询和告警"
    tech_stack: "ClickHouse / Grafana"

data_model: |
  通知记录（NotificationRecord）：
    - id: UUID（主键）
    - user_id: string（用户 ID）
    - channel: enum（apns/push/inapp）
    - title: string
    - body: string（加密存储）
    - status: enum（pending/sent/delivered/failed）
    - created_at: timestamp
    - delivered_at: timestamp（nullable）

api_contracts: |
  内部 API：
  - POST /api/v1/notifications/send（触发单条发送）
  - POST /api/v1/notifications/batch（批量发送，支持最多 100 条/请求）
  - GET /api/v1/notifications/{id}/status（查询发送状态）
  - GET /api/v1/users/{user_id}/notifications（查询用户通知列表，分页）

non_functional_requirements: |
  - 性能：单条发送延迟 P99 ≤ 200ms，批量发送延迟 P99 ≤ 2s
  - 可用性：SLA ≥ 99.9%，支持灰度发布和快速回滚
  - 安全：消息内容加密存储（AES-256），传输层 TLS 1.3
```

`system_context` 部分推荐使用 ASCII 图或 Mermaid 语法，便于 AI 理解组件关系。`non_functional_requirements` 必须量化（用 P99/P95 等指标），不能只写"要快"。

### 使用示例

---

## Execution Plan 模板

### 完整模板

Execution Plan 将 Architecture Spec 中的设计决策转化为可执行、可追踪的具体任务。每个任务都有明确的负责人、截止日期和依赖关系，任务状态实时更新，让整个团队对进度有共同的理解。

```yaml
# Execution Plan 示例：通知系统 Sprint 1
sprint: "Sprint 2025-W15"
start_date: 2025-04-07
end_date: 2025-04-18

tasks:
  - task_id: "TASK-001"
    title: "通知微服务脚手架搭建"
    description: "初始化 Java 17 + Spring Boot 3 项目，配置 CI/CD、SonarQube 代码扫描、K8s 部署清单"
    owner: "@backend-team"
    deadline: 2025-04-09
    dependencies: []
    status: "done"
    notes: "CI 流水线需包含单元测试覆盖率 gate（≥ 80%）"

  - task_id: "TASK-002"
    title: "Kafka 消费者与通知聚合器实现"
    description: "实现从 Kafka 消费上游事件，按 user_id 聚合，写入 Redis 发送队列"
    owner: "@backend-team"
    deadline: 2025-04-14
    dependencies: ["TASK-001"]
    status: "in_progress"
    notes: "聚合时间窗口 500ms，需做性能测试"

  - task_id: "TASK-003"
    title: "APNs 发送通道对接"
    description: "实现 APNs HTTP/2 协议对接，支持 token-based 认证，失败重试（指数退避）"
    owner: "@backend-team"
    deadline: 2025-04-16
    dependencies: ["TASK-001"]
    status: "pending"
    notes: "需提前申请 Apple Developer 证书"

  - task_id: "TASK-004"
    title: "通知状态追踪与查询 API"
    description: "实现 NotificationRecord 的写入和查询，支持按 user_id 分页查询通知列表"
    owner: "@backend-team"
    deadline: 2025-04-16
    dependencies: ["TASK-002"]
    status: "pending"
    notes: "存储使用 ClickHouse，查询需建索引"

  - task_id: "TASK-005"
    title: "频率控制逻辑实现"
    description: "实现每用户每天不超过 3 条通知的频率控制，支持配置化调整阈值"
    owner: "@backend-team"
    deadline: 2025-04-17
    dependencies: ["TASK-002"]
    status: "pending"
    notes: "使用 Redis 计数器实现，TTL 设为 24 小时"

  - task_id: "TASK-006"
    title: "集成测试与性能压测"
    description: "端到端集成测试，覆盖正常路径和异常路径；压测发送接口（目标 QPS ≥ 1000）"
    owner: "@qa-team"
    deadline: 2025-04-18
    dependencies: ["TASK-003", "TASK-004", "TASK-005"]
    status: "pending"
    notes: "压测环境需准备 10 万用户测试数据"
```

`dependencies` 字段引用其他任务的 `task_id`，形成任务网络图。AI Agent 可以读取这个结构自动识别可并行任务和关键路径，从而生成更合理的执行顺序建议。

### 使用示例

---

## Quality Contract 模板

### 完整模板

Quality Contract 是 Execution Plan 完成后、AI Agent 投入实现之前的最后一道质量门。它定义的不只是"测什么"，而是"什么叫质量合格"——包括性能基线、监控指标和故障恢复预案。与普通测试计划的核心区别在于：Quality Contract 是与 AI Agent 的合约，违反即触发自动阻断。

```yaml
# Quality Contract 示例：通知系统
title: '通知系统 Quality Contract'
date: 2025-04-06
applies_to: "通知微服务 v1.0"
owner: "@qa-team"

quality_attributes:
  performance:
    - metric: "单条发送延迟 P99"
      baseline: "<= 200ms"
      measurement: "APM 端点耗时监控（DataDog）"
    - metric: "批量发送吞吐量"
      baseline: ">= 1000 QPS"
      measurement: "k6 压测结果"
    - metric: "通知送达率"
      baseline: ">= 90%（7 天滑动窗口）"
      measurement: "发送成功数 / 总发送请求数"

  reliability:
    - metric: "服务可用性"
      baseline: ">= 99.9%（月度）"
      measurement: "Datadog SLO 监控"
    - metric: "APNs 发送成功率"
      baseline: ">= 98%"
      measurement: "APNs 响应码统计"
    - metric: "消息零丢失"
      baseline: "0 条消息在传输过程中丢失"
      measurement: "Kafka offset 核对"

  security:
    - metric: "数据传输加密"
      baseline: "TLS 1.3 全链路"
      measurement: "mTLS 证书配置检查"
    - metric: "消息内容加密存储"
      baseline: "AES-256"
      measurement: "安全扫描报告"

acceptance_tests:
  - test_id: "AT-001"
    name: "通知发送端到端"
    description: "模拟上游业务系统发送通知事件，验证最终用户设备收到 APNs 推送"
    criteria: "客户端成功展示通知，状态为 delivered"
  - test_id: "AT-002"
    name: "频率控制验证"
    description: "同一用户超过 3 条/天阈值后，验证第 4 条被拒绝且返回 429"
    criteria: "超额请求返回 429 Too Many Requests"
  - test_id: "AT-003"
    name: "离线消息延迟投递"
    description: "模拟用户设备离线 2 小时后恢复联网"
    criteria: "恢复联网后 30 秒内收到延迟通知"

regression_suite:
  - "RS-001: 历史通知查询（验证分页、已读状态、排序）"
  - "RS-002: 多通道降级（APNs 不可用时降级到站内信）"
  - "RS-003: 通知撤回（发送后 5 秒内可撤回）"

monitoring_metrics:
  - "监控1: 发送队列积压数量（alert if > 1000，持续 5min）"
  - "监控2: APNs 错误率（alert if > 2%，持续 3min）"
  - "监控3: 平均端到端延迟（alert if > 500ms，P99）"

rollback_plan: |
  触发条件：集成测试或上线后监控发现 P0 级问题（如消息丢失、数据错乱）
  回滚步骤：
  1. 关闭通知微服务入口（K8s HPA 缩至 0）
  2. 通知上游业务系统切换到降级模式（本地缓存 + 延迟补偿）
  3. 保留现场日志和消息队列状态用于事后分析
  4. 2 小时内给出问题根因和修复方案
```

`quality_attributes` 中的每个指标都必须有量化的 `baseline` 和可执行的 `measurement` 方法。AI Agent 在实现功能时，会将 Quality Contract 作为验收标准——不是"测试通过了就行"，而是"所有指标都达标才算完成"。

### 使用示例

---

## Operations Runbook 模板

### 完整模板

Operations Runbook 是系统上线后的运维保障文档，记录从部署到故障恢复的完整操作手册。与 Architecture Spec 的区别在于：Arch Spec 回答"我们是怎么设计的"，Runbook 回答"出了问题怎么办"。它是 on-call 工程师的第一参考，也是 AI Agent 处理运维事件时的决策依据。

```yaml
# Operations Runbook 示例：通知系统 Web Service
title: '通知系统 Operations Runbook'
date: 2025-04-06
service_name: "notification-service"
version: "v1.0"
environment: "Kubernetes (AWS EKS)"

system_overview: |
  通知系统为独立微服务，部署于 AWS EKS，3 个副本（HPA 1-10），
  通过 ALB 暴露 HTTP 接口，上游依赖 Kafka 和 Redis。
  核心数据存储于 ClickHouse，监控使用 Datadog。

deployment_procedure: |
  部署前检查：
  - 确认 CI 流水线所有测试通过（unit + integration + e2e）
  - 确认 K8s 命名空间下有足够的资源配额（CPU > 2核，Memory > 4Gi）
  - 确认 Kafka Topic 已创建且分区数匹配

  部署步骤：
  1. 更新镜像 tag 到新版本（IMAGE_TAG=v{version}）
  2. 执行 kubectl set image deployment/notification-service app={new_image}
  3. 观察滚动更新（kubectl rollout status deployment/notification-service）
  4. 验证新版本 pod 健康（kubectl get pods，STATUS=Running）
  5. 执行冒烟测试：POST /api/v1/notifications/send 验证返回 200

  回滚步骤：
  kubectl rollout undo deployment/notification-service

health_checks: |
  - 端点检查：GET /health/liveness 返回 200
  - 依赖检查：GET /health/readiness 验证 Kafka 和 Redis 连通性
  - 监控指标：Datadog Dashboard "Notification Service Overview"
    - 关键指标：发送 QPS、APNs 错误率、队列积压数

common_failures:
  - symptom: "通知发送延迟（> 5s）"
    diagnosis: "可能原因：APNs 通道限流 / Kafka 消费者积压 / Redis 连接池耗尽"
    remedy: |
      1. 检查 Datadog APNs 错误率面板
      2. 检查 Kafka consumer lag（kafka-consumer-groups.sh）
      3. 检查 Redis 连接数（redis-cli info clients）
      4. 如是 APNs 限流：切换到站内信降级路径
      5. 如是消费者积压：临时扩容消费者数量

  - symptom: "服务大量 5xx 错误"
    diagnosis: "可能原因：OOMKilled / 下游依赖超时 / 代码 bug"
    remedy: |
      1. kubectl describe pod 查看 Events 是否有 OOMKilled
      2. kubectl logs 查看具体错误日志
      3. 如是 OOM：调整 resource.limits.memory，上调 50%
      4. 如是依赖超时：检查 ClickHouse 和 Redis 响应时间
      5. 必要时回滚到上一稳定版本

  - symptom: "通知丢失（用户反馈未收到）"
    diagnosis: "可能原因：Kafka 消息丢失 / 发送后状态写入失败 / APNs 静默丢弃"
    remedy: |
      1. 查询 ClickHouse notification_records 表，确认状态
      2. 如状态 sent 但用户未收到：查 APNs 状态码日志
      3. 如状态 pending 且超过 5 分钟：触发补偿重发逻辑
      4. 确认无 Kafka offset 重置操作

on_call_escalation: |
  L1（值班工程师）：处理常见故障，30 分钟内响应
  L2（后端负责人）：L1 无法解决时升级，涉及架构变更时升级
  L3（技术负责人）：P0 级故障（如消息大规模丢失），需立即升级

  升级渠道：PagerDuty → Slack #on-call → 电话（紧急）
  文档位置：Confluence / On-Call Runbooks / Notification Service

backup_restore: |
  数据备份策略：
  - ClickHouse 数据：每日凌晨 3 点自动备份到 S3（保留 30 天）
  - Redis 数据：RDB 持久化，每 15 分钟生成快照
  - Kafka 消息：Topic 保留策略设为 7 天

  恢复步骤：
  1. 从 S3 下载最近备份的 ClickHouse 快照
  2. 执行 restore 命令（clickhouse-backup restore）
  3. 验证数据完整性（抽检最近 1000 条记录）
  4. Redis 数据由应用层重建，无需手动恢复
```

`common_failures` 表格是 Runbook 的核心价值所在：每个故障都包含症状、诊断路径和补救步骤，on-call 工程师或 AI Agent 可以快速定位问题，而不是在紧急时刻临时推理。`health_checks` 给出日常巡检的关键指标，让问题在恶化前被发现。

### 使用示例

---

## Traceability Matrix 模板

### 完整模板

Traceability Matrix 是整个交付件体系的最后一环，它将业务需求（Product Intent）一路追踪到具体的代码实现和测试用例。每行代表一条完整的需求链路，从"为什么做"到"怎么做"到"怎么验证"，全程可审计。在 AI-Native 团队中，这个矩阵让 AI Agent 能够回答"这个改动会影响哪些需求"这类问题。

```yaml
# Traceability Matrix 示例：通知系统
title: '通知系统 Traceability Matrix'
date: 2025-04-06
version: "v1.0"

columns:
  - requirement_id: "产品需求 ID（来自 Product Intent）"
  - user_story_id: "对应的 User Story Pack 文件"
  - arch_spec_id: "Architecture Spec 文件"
  - execution_plan_task_ids: "实现该需求的任务 ID 列表"
  - test_case_ids: "对应的测试用例 ID"
  - qa_contract_id: "Quality Contract 中相关的质量指标"

rows:
  - requirement_id: "REQ-001: 消息送达率 ≥ 90%"
    user_story_id: "USP-001（通知发送与展示）"
    arch_spec_id: "ARCH-001（第 3.2 节发送引擎设计）"
    execution_plan_task_ids: ["TASK-002", "TASK-003", "TASK-006"]
    test_case_ids: ["AT-001", "AT-002"]
    qa_contract_id: "QA-PERF-001, QA-REL-002"

  - requirement_id: "REQ-002: 频率控制（≤ 3 条/用户/天）"
    user_story_id: "USP-001（接受标准第 3 条）"
    arch_spec_id: "ARCH-001（第 4.1 节频率控制设计）"
    execution_plan_task_ids: ["TASK-005"]
    test_case_ids: ["AT-002"]
    qa_contract_id: "QA-REL-001"

  - requirement_id: "REQ-003: 通知内容加密存储"
    user_story_id: "USP-002（安全需求）"
    arch_spec_id: "ARCH-001（第 5 节安全设计）"
    execution_plan_task_ids: ["TASK-001", "TASK-002"]
    test_case_ids: ["AT-003"]
    qa_contract_id: "QA-SEC-001, QA-SEC-002"

  - requirement_id: "REQ-004: 离线消息延迟投递"
    user_story_id: "USP-003（离线用户体验）"
    arch_spec_id: "ARCH-001（第 3.3 节延迟投递设计）"
    execution_plan_task_ids: ["TASK-002", "TASK-004"]
    test_case_ids: ["AT-004"]
    qa_contract_id: "QA-REL-003"
```

Traceability Matrix 的价值在于双向追溯：向前看，可以回答"这个 Product Intent 分解到了哪些具体任务"；向后看，可以回答"修改这段代码会影响哪些需求"。在 AI Agent 辅助代码修改时，这个矩阵提供了改动影响范围的全景视图，避免意外破坏未列入计划的需求。

---

## 使用指南与最佳实践

### 模板选择指南

| 场景 | 推荐模板 | 理由 |
|------|---------|------|
| 新产品立项 | Product Intent | 定义业务目标和用户价值 |
| 功能开发 | User Story Pack + Execution Plan | 详细需求+执行计划 |
| 系统重构 | Architecture Spec | 清晰的架构设计 |
| 上线准备 | Quality Contract + Operations Runbook | 质量+运维保障 |
| 全链路管理 | Traceability Matrix | 需求到代码追踪 |

### 文件组织建议

AI-Native SDLC 交付件建议按以下目录结构组织，形成清晰的检索路径：

```
docs/
├── intent/           # Product Intent 文件
│   └── YYYY-MM-DD-product-name.md
├── stories/          # User Story Pack 文件
│   └── YYYY-MM-DD-feature-name.md
├── arch/             # Architecture Spec 文件
│   └── YYYY-MM-DD-component-name.md
├── exec/             # Execution Plan 文件（含任务 ID 映射）
│   └── YYYY-MM-DD-sprint-name.md
├── qa/               # Quality Contract 文件
│   └── YYYY-MM-DD-component-qa.md
└── runbook/          # Operations Runbook 文件
    └── YYYY-MM-DD-service-name.md
```

文件名统一采用 `YYYY-MM-DD-format-description.md` 格式，日期对应该交付件的版本日期或 sprint 开始日期，便于时间线追溯。版本控制上，每个交付件模板文件独立 Git 跟踪，不与代码混在同一仓库——这样代码和需求的变更历史互不干扰，PR 审查时也更清晰。

模板文件本身（而非具体项目的交付件）建议集中存放在一个 `templates/` 仓库或 `docs/templates/` 目录下，所有项目引用时指向统一版本，避免分散管理导致的模板漂移。

> 💡 **Key Insight**
>
> 在AI时代，交付件模板不仅是格式规范，更是与AI协作的接口协议——结构越标准，AI理解越准确

### 与 CI/CD 集成

交付件模板的可验证性是 CI/CD 自动化的前提。每个模板都可以嵌入自动化检查，将质量门禁从"人工 Review"前移到"提交即检查"。

**Schema 验证**

Product Intent、User Story Pack、Quality Contract 等 YAML/JSON 格式的模板，可以用 JSON Schema 定义字段约束。在 PR 提交时，CI 流水线执行 schema validation，任何必填字段缺失或格式错误都会阻断合并：

```yaml
# .github/workflows/validate-artifacts.yml（示例）
- name: Validate Product Intent Schema
  run: |
    # 用 yq 提取字段，用 jq 验证必填项
    yq e '.business_objective' intent.yaml | jq -s 'length > 0'
    yq e '.success_metrics[]' intent.yaml | jq -s 'length >= 2'
```

**Quality Contract 自动化检查**

Quality Contract 中的 `acceptance_tests` 和 `monitoring_metrics` 可以转化为具体的 CI step：用 k6 做性能测试、用 pytest 做端到端测试、用 Prometheus 规则做指标校验。测试结果写入 Quality Contract 对应的检查项，形成闭环。

**Execution Plan 与 Issue Tracker 联动**

Execution Plan 中的任务可以自动同步到 Linear、Jira 或 GitHub Projects——每个 `task_id` 对应一个工单，任务状态变更触发 Issue 状态更新。AI Agent 在执行任务时，工单状态就是执行计划状态的真实来源，无需手动维护两套系统。

**GitHub Actions 模板校验示例**

```yaml
# 模板 lint 流水线
- name: Lint all deliverable templates
  run: |
    # 1. Product Intent 必填字段检查
    for f in docs/intent/*.md; do
      yq e '.title' "$f" || exit 1
      yq e '.business_objective' "$f" || exit 1
      yq e '.success_metrics' "$f" || exit 1
    done

    # 2. User Story Pack acceptance_criteria 非空检查
    for f in docs/stories/*.md; do
      count=$(yq e '.acceptance_criteria | length' "$f")
      if [ "$count" -lt 1 ]; then echo "No acceptance criteria in $f"; exit 1; fi
    done
```

这种 CI 集成让模板规范从"文档建议"变成"工程约束"，团队成员在提交交付件时就能知道是否符合标准，而不是等到 Review 阶段才发现问题。

> 💡 **Key Insight**
>
> 在AI时代，交付件模板不仅是格式规范，更是与AI协作的接口协议——结构越标准，AI理解越准确

### AI 辅助编写

AI 编码 Agent 是交付件模板最重要的终端消费者之一。当团队使用 Claude Code、Copilot 或其他 AI 编程工具时，交付件模板就是 Agent 的"上下文输入规范"——格式越标准，Agent 理解越准确，产出质量越高。

**Product Intent 作为上下文起点**

Product Intent 包含业务目标、目标用户、约束条件，是 AI Agent 理解"为什么做"的第一手材料。在给 Agent 下达任务指令时，直接将 Product Intent 内容粘贴进去，比"做一个通知功能"这类模糊指令的产出质量高得多。

**User Story Pack 映射为 Agent 的任务分解**

User Story Pack 中的 `acceptance_criteria` 和 `testable_conditions` 直接构成了 Agent 的"Definition of Done"。Agent 在实现功能时，会以 acceptance_criteria 作为自测标准，而非仅凭"看起来没问题"就交差。

**Architecture Spec 为 Agent 提供全局视图**

Architecture Spec 让 Agent 理解当前模块在整个系统中的位置——依赖什么、被什么依赖、技术选型理由是什么。这对于维护性任务（修改现有功能）尤其关键：Agent 可以基于 Arch Spec 判断修改的影响范围，而不是只看到眼前文件。

**Quality Contract 作为 Agent 的验收测试**

Quality Contract 中的 `acceptance_tests` 和 `monitoring_metrics` 可以在 Agent 完成任务后自动运行——将人工验收转化为自动化测试。Agent 在实现阶段就知道"这些测试必须通过才能算完成"，形成内置的质量意识。

**与 AI 协作的 Prompt 模板配对**

每个交付件模板可以配对一个简短的 Prompt 模板，帮助团队成员快速调用 AI：

```
## Product Intent Prompt
基于以下业务目标，为 [功能名称] 编写 Product Intent：
目标：[业务目标描述]
约束：[非功能需求]
请用 YAML 格式输出，包含 business_objective、target_users、success_metrics、constraints。
```

这种"模板 + Prompt 配对"的方式，让 AI 辅助从单次对话升级为结构化协作——每次 AI 输出都符合团队规范，无需人工二次整理。

> 💡 **Key Insight**
>
> 在AI时代，交付件模板不仅是格式规范，更是与AI协作的接口协议——结构越标准，AI理解越准确

---

## 📚 模板版本管理

### 模板演进路径

<object data="/assets/images/2025-04-06-artifacts-templates-collection-02-template-evolution.svg" type="image/svg+xml" width="100%" aria-label="交付件模板的演进路径" role="img"></object>

### 模板更新策略

模板作为团队基础设施，需要随实践经验持续演进，但不应频繁破坏已有项目的交付件兼容性。更新策略的核心原则是：**小步迭代，明确版本，区分兼容性级别**。

**提出变更的流程**

任何团队成员都可以提出模板变更建议，流程为：Issue 描述变更需求 → 模板维护者评审 → 在 `templates/` 仓库提交 PR → Review 通过后合并并发布新版本。变更内容需包含：变更说明、版本号升级（SemVer）、兼容性评估。

**版本号规则（SemVer）**

- **主版本号升级**（v1 → v2）：破坏性变更，如删除字段、重命名字段、改变字段类型
- **次版本号升级**（v1.0 → v1.1）：向后兼容的新增，如新增可选字段、新增模板类型
- **补丁版本号升级**（v1.0.0 → v1.0.1）：文档修正、字段说明澄清，不改变结构

**破坏性变更的处理**

如果必须做破坏性变更（如某个字段被废弃），采用"双版本并行"策略：旧版模板继续支持 3 个月，新项目强制使用新版。3 个月后旧版标记为 deprecated，并在文档中说明迁移路径。禁止在不通知团队的情况下直接删除字段——这会导致历史交付件无法通过 Schema 验证。

**向后兼容的变更类型**

以下变更属于向后兼容，可以在任意版本升级中引入：
- 新增可选字段（原有字段和结构不变）
- 新增字段的说明文档（不改变 YAML 结构）
- 新增模板类型（如增加新的交付件模板）

以下变更属于破坏性变更，需要主版本升级：
- 删除或重命名已有字段
- 改变字段类型（如 string 改为 array）
- 修改必填字段的约束条件

### 向后兼容

- 新增字段：向后兼容
- 删除字段：破坏性变更
- 重命名字段：破坏性变更

---

*AI-Native SDLC 交付件体系*  
*深度阅读时间：约 15 分钟*
