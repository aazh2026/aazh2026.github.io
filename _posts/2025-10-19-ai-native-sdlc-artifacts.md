---
layout: post
title: "AI-Native SDLC：交付件驱动的研发革命"
date: 2025-10-19T10:00:00+08:00
tags: [AI-Native, SDLC, Artifacts, Spec-Driven, Software-Engineering]
author: Aaron
series: "AI-Native-Artifacts"
series_title: "AI-Native SDLC 交付件体系"

redirect_from:
  - /ai-native-sdlc-artifacts.html
---

*"AI 时代，规范（Spec）成为唯一真相源。"
*

---

## TL;DR

- **核心判断**：AI 时代软件研发的最大变化，不是流程阶段的变化，而是**关键交付件（Artifacts）的变化**
- **三大特征**：机器可读（Machine-Readable）、结构化（Structured）、全链路可追溯（Traceable）
- **核心理念**：从"文档记录"到"规范驱动"，Spec 成为代码、测试、文档的唯一真相源
- **六层交付件体系**：Intent → Product → Architecture → Execution → Quality → Operations
- **实施路径**：从 PRD 改造开始，逐步构建完整的交付件体系

---

## 📋 本文结构

- [AI 时代研发流程的变与不变](#ai-时代研发流程的变与不变)
- [为什么交付件成为核心？](#为什么交付件成为核心)
- [AI-Native 交付件的三大特征](#ai-native-交付件的三大特征)
- [六层交付件体系全景](#六层交付件体系全景)
- [从文档到规范：思维转变](#从文档到规范思维转变)
- [实施路线图](#实施路线图)
- [写在最后](#写在最后)

---

## AI 时代研发流程的变与不变

### 传统 SDLC 的困境

想象一个典型的软件开发项目：

**产品经理**写了一份 PRD，投入了大量时间描述功能细节。开发开始后，这份文档就被束之高阁，没人再看。

**架构师**画了一堆架构图，但在实际编码中，开发者往往凭直觉做技术决策，架构图和最终代码渐行渐远。

**测试人员**根据需求写测试用例，但当需求变更时，测试用例很难同步更新，导致测试覆盖不全。

**结果是**：需求、设计、代码、测试各自为政，形成一个又一个的**信息孤岛**。

### 常见的反模式

| 反模式 | 表现 | 后果 |
|--------|------|------|
| **文档即墓碑** | PRD 写完就不再更新 | 文档与代码脱节 |
| **口头需求** | 重要信息只在会议中传递 | 信息丢失、理解偏差 |
| **代码即文档** | 只有代码，没有设计记录 | 维护困难、知识流失 |
| **测试滞后** | 快上线时才写测试 | 质量风险、返工成本 |
| **运维黑盒** | 部署靠个人经验 | 故障频发、难以恢复 |

### AI 带来的新可能

当 AI Agent 能够理解和执行规范时，一切都变了。

**不再是**：
- 人写文档 → 人读文档 → 人写代码

**而是**：
- 人写规范 → AI 读规范 → AI 生成代码/测试/文档

**关键在于**：规范必须**机器可读**、**结构化**、**可追溯**。

---

## 为什么交付件成为核心？

### 什么是交付件（Artifacts）？

在软件工程中，交付件是研发过程中产生的**有形产出物**：

- 需求阶段的：PRD、用户故事
- 设计阶段的：架构文档、API 规范
- 开发阶段的：代码、配置文件
- 测试阶段的：测试用例、测试报告
- 运维阶段的：部署手册、监控配置

### 传统交付件的问题

**1. 为人类阅读而设计**

传统交付件（如 Word 文档、PPT）是为人类阅读优化的：
- 自然语言描述，存在歧义
- 非结构化，难以解析
- 图文混排，机器难以理解

**2. 静态且孤立**

- 文档一旦写成，很少更新
- 不同交付件之间缺乏关联
- 无法自动同步变化

**3. 无法驱动自动化**

传统交付件只能供人阅读，无法被工具直接消费：
- 不能自动生成代码
- 不能自动执行测试
- 不能自动部署运维

### AI-Native 交付件的优势

```
传统交付件                    AI-Native 交付件
─────────────────────────────────────────────────
人类可读  ──────────────────►  人类 + 机器可读
自然语言  ──────────────────►  结构化规范
静态文档  ──────────────────►  动态真相源
信息孤岛  ──────────────────►  全链路关联
人工维护  ──────────────────►  AI 辅助生成/同步
```

**关键洞察**：

> 当 AI 能够理解和执行规范时，规范就不再是"参考文档"，而是"执行指令"。
> 
> 这意味着：**写规范就是在写代码**。

---

## AI-Native 交付件的三大特征

### 特征一：机器可读（Machine-Readable）

**定义**：交付件必须能够被 AI Agent 直接解析和理解，而不仅仅是供人类阅读。

**为什么重要？**

在 AI-Native 研发流程中：
- AI 读取 PRD 生成代码
- AI 读取架构规范做技术决策
- AI 读取用户故事生成测试用例
- AI 读取运维手册执行部署

如果交付件不能被机器读取，AI 就无法参与，流程就无法自动化。

**实践方式**：

| 传统方式 | AI-Native 方式 |
|----------|----------------|
| Word 文档描述 API | OpenAPI/Swagger 规范 |
| 自然语言描述业务规则 | JSON Schema / DSL |
| PPT 展示架构图 | C4 Model + 结构化数据 |
| Excel 管理测试用例 | Gherkin / Cucumber 规范 |

**示例对比**：

**传统 PRD（自然语言）**：
```
用户登录功能：
用户输入用户名和密码，点击登录按钮。
系统验证用户名和密码是否正确。
如果正确，跳转到首页；如果错误，显示错误信息。
```

**AI-Native PRD（结构化）**：
```yaml
feature:
  name: "User Login"
  id: "F-001"
  
acceptance_criteria:
  - given: "用户输入有效凭证"
    when: "点击登录"
    then: "跳转到首页，生成会话令牌"
    
  - given: "用户输入无效凭证"
    when: "点击登录"
    then: "显示错误信息 '用户名或密码错误'"
    
api_contract:
  endpoint: "POST /api/v1/auth/login"
  request:
    username: "string, required, min:3, max:50"
    password: "string, required, min:8"
  response:
    200: "{ token: string, user: object }"
    401: "{ error: 'Invalid credentials' }"
```

### 特征二：结构化（Structured）

**定义**：交付件必须有明确的结构、字段和格式，避免模糊和随意性。

**为什么重要？**

结构化的交付件：
- 可以被验证（是否符合规范）
- 可以被比较（版本差异）
- 可以被转换（生成代码、测试等）
- 可以被查询（检索、统计）

**反模式：Vibe Coding**

"Vibe Coding" 是指：
> 凭感觉、靠直觉、没有明确规范的编码方式。

在 AI 时代，如果交付件不规范，AI 就会产生幻觉，生成不符合预期的代码。

**实践方式**：

为每种交付件定义**标准模板**：

```yaml
# Product Intent 模板
product_intent:
  version: "1.0"
  metadata:
    created_by: "string"
    created_at: "date"
    status: "draft | review | approved"
  
  problem:
    description: "string, required"
    target_users: "array of persona"
    current_pain: "string"
  
  solution:
    vision: "string, required"
    key_features: "array of feature"
    success_metrics: "array of metric"
  
  constraints:
    technical: "array of string"
    business: "array of string"
    timeline: "string"
```

### 特征三：可追溯（Traceable）

**定义**：从需求到代码到测试到部署，每个环节都能追溯其来源和依赖。

**为什么重要？**

当系统出现问题时，你需要知道：
- 这段代码对应哪个需求？
- 这个 bug 影响哪些功能？
- 这次变更需要更新哪些测试？
- 这个需求是否已经实现？

可追溯性让**影响分析**和**变更管理**成为可能。

**实践方式**：

**统一标识符体系**：

```
PI-001: Product Intent（产品意图）
  └─ PRD-001: Product Requirement Doc（需求文档）
      └─ US-001: User Story（用户故事）
          ├─ AC-001: Acceptance Criteria（验收标准）
          │   └─ TC-001: Test Case（测试用例）
          ├─ ARCH-001: Architecture Decision（架构决策）
          │   └─ API-001: API Spec（API规范）
          └─ CODE-001: Implementation（代码实现）
              └─ DEPLOY-001: Deployment（部署配置）
```

**追溯矩阵**：

| 需求 ID | 用户故事 | 架构设计 | 代码文件 | 测试用例 | 状态 |
|---------|----------|----------|----------|----------|------|
| PI-001 | US-001, US-002 | ARCH-001 | auth/login.py | TC-001, TC-002 | ✅ Done |
| PI-002 | US-003 | ARCH-002 | payment/gateway.py | TC-003 | 🚧 In Progress |

---

## 六层交付件体系全景

### 体系概览

```
┌─────────────────────────────────────────────────────────────────┐
│                     AI-Native SDLC 交付件体系                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  L1: Intent（意图层）                                              │
│  ├── Product Intent（产品意图）                                     │
│  └── Business Context（业务上下文）                                 │
│                                                                   │
│  L2: Product（产品定义层）                                          │
│  ├── PRD（产品需求文档）                                           │
│  ├── User Story Pack（用户故事包）                                  │
│  └── Acceptance Criteria（验收标准）                                │
│                                                                   │
│  L3: Architecture（系统设计层）                                     │
│  ├── Architecture Spec（架构规范）                                  │
│  ├── API Contract（API 契约）                                      │
│  └── Tech Decision Records（技术决策记录）                          │
│                                                                   │
│  L4: Execution（工程执行层）                                        │
│  ├── Execution Plan（执行计划）                                     │
│  ├── Task Breakdown（任务拆解）                                     │
│  └── Code with Context（带上下文的代码）                            │
│                                                                   │
│  L5: Quality（质量验证层）                                          │
│  ├── Quality Contract（质量契约）                                   │
│  ├── Test Spec（测试规范）                                          │
│  └── Review Checklist（评审清单）                                   │
│                                                                   │
│  L6: Operations（运行与演化层）                                     │
│  ├── Deployment Spec（部署规范）                                    │
│  ├── Operations Runbook（运维手册）                                 │
│  └── Incident Response（故障响应）                                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 各层详解

#### L1: Intent（意图层）

**核心问题**：我们要解决什么问题？为谁解决？

**交付件**：

1. **Product Intent（产品意图）**
   - 业务背景与问题陈述
   - 目标用户画像
   - 成功指标定义
   - 约束条件（技术、业务、时间）

2. **Business Context（业务上下文）**
   - 业务流程图
   - 领域模型
   - 关键术语表

**AI 如何参与**：
- AI 辅助用户画像生成
- AI 分析竞品，提炼差异化
- AI 预测成功指标的合理性

#### L2: Product（产品定义层）

**核心问题**：产品应该做什么？用户如何使用？

**交付件**：

1. **PRD（Product Requirement Document）**
   - 功能需求列表
   - 用户流程图
   - UI/UX 原型
   - 非功能需求

2. **User Story Pack（用户故事包）**
   - 用户故事（As a... I want... So that...）
   - 验收标准（Given... When... Then...）
   - 优先级（MoSCoW）
   - 依赖关系

3. **Acceptance Criteria（验收标准）**
   - 功能验收条件
   - 性能指标
   - 兼容性要求
   - 安全要求

**AI 如何参与**：
- AI 根据 Intent 生成 PRD 初稿
- AI 将 PRD 拆解为用户故事
- AI 生成验收标准
- AI 检查用户故事的完整性和一致性

#### L3: Architecture（系统设计层）

**核心问题**：系统如何构建？技术如何选型？

**交付件**：

1. **Architecture Spec（架构规范）**
   - 系统架构图（C4 Model）
   - 模块划分与职责
   - 数据流图
   - 技术栈选型

2. **API Contract（API 契约）**
   - OpenAPI/Swagger 规范
   - 数据模型定义（JSON Schema）
   - 错误码规范
   - 版本策略

3. **Tech Decision Records（技术决策记录）**
   - 决策背景
   - 备选方案对比
   - 最终选择及理由
   - 影响评估

**AI 如何参与**：
- AI 根据需求生成架构方案
- AI 生成 API 规范
- AI 评估技术选型的合理性
- AI 检查架构的扩展性和安全性

#### L4: Execution（工程执行层）

**核心问题**：如何高效地实现？如何跟踪进度？

**交付件**：

1. **Execution Plan（执行计划）**
   - 里程碑定义
   - 时间线规划
   - 资源分配
   - 风险评估

2. **Task Breakdown（任务拆解）**
   - 史诗（Epic）→ 故事（Story）→ 任务（Task）
   - 任务依赖图
   - 负责人分配
   - 估算（Story Points）

3. **Code with Context（带上下文的代码）**
   - 代码注释关联需求 ID
   - 架构决策记录（ADR）嵌入
   - 自动化生成的代码文档

**AI 如何参与**：
- AI 根据架构生成代码脚手架
- AI 自动拆解任务并估算工时
- AI 生成代码注释和文档
- AI 实时同步需求变更到代码

#### L5: Quality（质量验证层）

**核心问题**：如何确保质量？如何定义"完成"？

**交付件**：

1. **Quality Contract（质量契约）**
   - 代码质量标准
   - 测试覆盖率要求
   - 性能基准
   - 安全合规要求

2. **Test Spec（测试规范）**
   - 单元测试规范
   - 集成测试场景
   - E2E 测试用例
   - 性能测试脚本

3. **Review Checklist（评审清单）**
   - 代码评审清单
   - 设计评审清单
   - 发布前检查清单

**AI 如何参与**：
- AI 根据验收标准生成测试用例
- AI 自动执行代码审查
- AI 检测潜在的安全漏洞
- AI 评估测试覆盖率

#### L6: Operations（运行与演化层）

**核心问题**：如何部署？如何运维？如何迭代？

**交付件**：

1. **Deployment Spec（部署规范）**
   - 部署架构图
   - 部署脚本（IaC）
   - 配置管理
   - 回滚策略

2. **Operations Runbook（运维手册）**
   - 日常运维流程
   - 监控指标定义
   - 告警规则
   - 故障排查 SOP

3. **Incident Response（故障响应）**
   - 故障分级标准
   - 响应流程
   - 升级机制
   - 复盘模板

**AI 如何参与**：
- AI 根据架构生成部署脚本
- AI 自动配置监控和告警
- AI 辅助故障诊断
- AI 生成故障复盘报告

---

## 从文档到规范：思维转变

### 思维转变一：从"写给人看"到"写给机器执行"

**传统思维**：
> "这份 PRD 写得清楚，开发能看懂就行。"

**AI-Native 思维**：
> "这份 PRD 要写得足够结构化，AI 能根据它生成代码。"

**实践建议**：
- 使用结构化格式（YAML/JSON）而非自然语言
- 定义明确的字段和约束
- 提供示例数据

### 思维转变二：从"静态文档"到"动态真相源"

**传统思维**：
> "PRD 写完了，开始开发，文档就不用管了。"

**AI-Native 思维**：
> "PRD 是唯一的真相源，代码、测试、文档都从这里生成。"

**实践建议**：
- 所有交付件使用版本控制（Git）
- 建立变更通知机制
- 自动化同步下游产物

### 思维转变三：从"信息孤岛"到"全链路关联"

**传统思维**：
> "PRD 是产品的事，代码是开发的事，测试是 QA 的事。"

**AI-Native 思维**：
> "所有交付件都是关联的，变更一处，处处同步。"

**实践建议**：
- 使用统一的标识符体系
- 建立追溯矩阵
- 工具链集成（需求→代码→测试→部署）

---

## 实施路线图

### Phase 1：从 PRD 开始（1-2 周）

**目标**：将 PRD 改造为 AI-Readable 格式

**行动**：
1. 定义 PRD 模板（YAML/JSON 格式）
2. 将现有 PRD 转换为新格式
3. 训练 AI 根据 PRD 生成代码草稿
4. 验证效果，迭代优化

**成功指标**：
- AI 能根据 PRD 生成 70%+ 可用的代码脚手架
- PRD 变更能自动同步到代码注释

### Phase 2：扩展用户故事（2-4 周）

**目标**：建立用户故事和验收标准体系

**行动**：
1. 将 PRD 拆解为结构化用户故事
2. 为每个用户故事编写 Given-When-Then 验收标准
3. AI 根据验收标准生成测试用例
4. 建立需求-代码-测试的追溯关系

**成功指标**：
- 测试用例覆盖率 > 80%
- 需求变更能自动识别影响范围

### Phase 3：架构规范（4-8 周）

**目标**：架构设计机器可读

**行动**：
1. 使用 C4 Model 描述架构
2. 将 API 规范化为 OpenAPI 格式
3. AI 根据架构规范生成代码框架
4. 建立架构决策记录（ADR）体系

**成功指标**：
- 代码符合架构规范（自动检查）
- 架构变更能自动提示需要修改的代码

### Phase 4：完整链路（8-12 周）

**目标**：建立完整的六层交付件体系

**行动**：
1. 补齐执行计划、质量契约、运维手册
2. 工具链集成（需求管理→代码生成→测试执行→部署）
3. 建立变更影响分析能力
4. 培训团队，推广使用

**成功指标**：
- 80%+ 的代码由 AI 根据规范生成
- 需求到部署的全链路自动化

---

## 写在最后

**AI-Native SDLC 的本质**：

> 不是用 AI 做传统的事情，而是**重新定义**研发流程中"什么是最关键的交付件"。

当 AI 能够理解和执行规范时，规范就不再是"参考材料"，而是"执行指令"。

这意味着：
- **写规范就是在写代码**
- **维护规范就是在维护系统**
- **规范的完整性和准确性，决定了 AI 产出的质量**

**关键成功因素**：

1. **从简单开始**：不要试图一次性改造所有交付件，从 PRD 开始
2. **工具链支持**：选择合适的工具（Cursor、Claude、Copilot 等）
3. **团队培训**：让团队理解"为什么"和"怎么做"
4. **持续迭代**：根据实际效果不断优化交付件模板

**最后的话**：

> 在 AI 时代，最优秀的工程师不是代码写得最快的，而是**规范写得最清晰的**。
> 
> 因为清晰的规范，能让 AI 发挥出最大的价值。

---

## 📚 本系列文章

| 篇号 | 标题 | 链接 | 状态 |
|------|------|------|------|
| 01 | **Product Intent：AI 时代的意图定义** | [/product-intent-definition/](/product-intent-definition/) | ✅ 已发布 |
| 02 | **TDD vs Intent-Driven Development** | [/tdd-intent-driven/](/tdd-intent-driven/) | ✅ 已发布 |
| 03 | **Intent Complexity：AI时代的软件工程指标** | [/intent-complexity-metrics/](/intent-complexity-metrics/) | ✅ 已发布 |
| 04 | **User Story Pack：用户故事的自动化** | [/user-story-pack-automation/](/user-story-pack-automation/) | ✅ 已发布 |
| 05 | **Architecture Spec：架构设计的机器可读化** | [/architecture-spec-machine-readable/](/architecture-spec-machine-readable/) | ✅ 已发布 |
| 06 | **Execution Plan：工程执行的 AI 编排** | [/execution-plan-ai-orchestration/](/execution-plan-ai-orchestration/) | ✅ 已发布 |
| 07 | **Quality Contract：质量验证的契约化** | [/quality-contract-validation/](/quality-contract-validation/) | ✅ 已发布 |
| 08 | **Operations Runbook：运维的自动化手册** | [/operations-runbook-automation/](/operations-runbook-automation/) | ✅ 已发布 |
| 09 | **Traceability：需求到代码到测试的自动追踪** | [/traceability-auto-tracking/](/traceability-auto-tracking/) | ✅ 已发布 |
| 10 | **交付件模板大全：开箱即用** | [/artifacts-templates-collection/](/artifacts-templates-collection/) | ✅ 已发布 |

---

**AI-Native SDLC 交付件体系系列**
*由 Aaron 整理发布*

*Published on 2026-05-19*
*阅读时间：约 15 分钟*
