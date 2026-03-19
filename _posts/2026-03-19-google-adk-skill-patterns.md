---
layout: post
title: "Google ADK 五大 Skill 模式解读：AI Agent 内容设计的工程化"
date: 2026-03-19T15:00:00+08:00
permalink: /google-adk-skill-patterns/
tags: [AI-Native, Google, ADK, Skill, Agent, Context-Engineering]
author: Aaron
series: AI-Native Engineering
---

> **TL;DR**
> 
> Google Cloud 团队提出的 ADK Skill 五大设计模式标志着 AI Agent 开发从"格式标准化"进入"内容工程化"阶段。当 30+ 个工具（Claude Code、Gemini CLI、Cursor）都采用 SKILL.md 格式时，真正的差异化竞争不再是"会不会写 YAML"，而是"如何设计 Skill 的内容逻辑"。本文深度解析 Tool Wrapper、Generator、Reviewer、Inversion、Pipeline 五种模式，以及与 Context Engineering、Harness Engineering 的理论关联。

---

## 📋 本文结构

1. [背景：从格式战争到内容工程](#背景从格式战争到内容工程)
2. [Skill 模式的工程化思维](#skill-模式的工程化思维)
3. [模式一：Tool Wrapper（工具包装器）](#模式一tool-wrapper工具包装器)
4. [模式二：Generator（生成器）](#模式二generator生成器)
5. [模式三：Reviewer（审查者）](#模式三reviewer审查者)
6. [模式四：Inversion（反转模式）](#模式四inversion反转模式)
7. [模式五：Pipeline（流水线）](#模式五pipeline流水线)
8. [模式组合：构建复杂工作流](#模式组合构建复杂工作流)
9. [与 Context Engineering 的关联](#与-context-engineering-的关联)
10. [与 Harness Engineering 的呼应](#与-harness-engineering-的呼应)
11. [实践建议：选择正确的模式](#实践建议选择正确的模式)
12. [趋势：Skill 生态的标准化与分化](#趋势skill-生态的标准化与分化)
13. [结论：内容设计是新的护城河](#结论内容设计是新的护城河)

---

## 背景：从格式战争到内容工程

### SKILL.md 标准化的历程

**第一阶段：各显神通（2024 年初）**

| 工具 | 配置方式 | 问题 |
|------|----------|------|
| Cursor | .cursorrules | 特定格式 |
| Claude Code | claude.md | 另一套格式 |
| GitHub Copilot | 系统提示 | 又一种方式 |
| Windsurf | Rules | 各不相同 |

开发者困境：每换一个工具就要重写一遍上下文配置。

**第二阶段：格式收敛（2024 下半年）**

MCP（Model Context Protocol）和 SKILL.md 规范的出现：
- Anthropic 推出 MCP
- Google 推出 ADK Skill 规范
- 30+ 工具开始支持标准化格式

**第三阶段：内容工程（2025 至今）**

> "The specification explains how to package a skill, but offers zero guidance on how to structure the logic inside it."
> 
> "规范解释了如何打包 skill，但完全没有指导如何设计其中的逻辑。"

格式问题解决了，真正的挑战才开始：**如何设计 Skill 的内容**。

### 为什么内容设计如此重要？

**类比**：

- 格式标准化 = 大家都用 Word 文档（.docx）
- 内容设计 = 如何写出一份好的商业计划书

同样的格式，内容质量天差地别。

**Skill 的内容质量差异**：

| 维度 | 初级 Skill | 高级 Skill |
|------|-----------|-----------|
| **上下文加载** | 一次性加载全部 | 按需渐进加载 |
| **用户交互** | 单向指令 | 结构化对话 |
| **输出生成** | 自由发挥 | 模板约束 |
| **质量控制** | 无 | 内置检查点 |
| **可组合性** | 孤立 | 可与其他 Skill 组合 |

---

## Skill 模式的工程化思维

### 什么是设计模式？

借用软件工程中的设计模式概念：

> "设计模式是在特定场景下对常见问题的可复用解决方案。"

Google ADK 团队通过分析生态系统中数百个 Skill（从 Anthropic 到 Vercel 到 Google 内部），提炼出 5 种高频模式。

### 模式的核心价值

**1. 降低认知负荷**

不需要每次从零设计 Skill，选择合适的模式即可。

**2. 提高可预测性**

模式定义了 Agent 的行为边界，输出更可预期。

**3. 促进协作**

团队成员使用相同模式，Skill 之间可以组合。

**4. 沉淀最佳实践**

模式是经过验证的解决方案，避免重复踩坑。

---

## 模式一：Tool Wrapper（工具包装器）

### 核心思想

> 让 Agent 按需成为任何库的专家。

不是把 API 文档塞进系统提示，而是打包成 Skill，只在需要时加载。

### 工作机制

```
用户提问涉及 FastAPI
    ↓
Skill 检测关键词 "FastAPI"
    ↓
动态加载 references/conventions.md
    ↓
Agent 获得 FastAPI 专家知识
    ↓
生成符合规范的代码
```

### 典型结构

```yaml
# SKILL.md
name: fastapi-expert
description: FastAPI 开发专家
triggers:
  - keywords: ["fastapi", "FastAPI", "api endpoint"]
references:
  - path: references/fastapi-conventions.md
instructions: |
  当用户提及 FastAPI 时：
  1. 加载 references/fastapi-conventions.md
  2. 严格遵循其中的路由、依赖注入、异常处理规范
  3. 生成代码前检查是否符合所有约定
```

### 应用场景

- **框架规范**：React、Vue、Django、FastAPI 等
- **公司代码规范**：内部库使用指南
- **领域知识**：特定行业的术语和惯例

### 关键设计原则

**延迟加载（Lazy Loading）**：
- 不使用时零开销
- 只在相关上下文触发
- 保持主上下文窗口干净

**绝对权威**：
- 加载的规范是"绝对真理"
- Agent 不得偏离
- 确保一致性

---

## 模式二：Generator（生成器）

### 核心思想

> 通过"填空"强制一致的输出结构。

解决 Agent 输出不一致的问题：每次生成的文档结构不同，无法维护。

### 工作机制

```
用户需要生成 API 文档
    ↓
Generator Skill 加载模板（assets/template.md）
    ↓
向用户询问缺失变量（端点、参数、返回值）
    ↓
按模板填充内容
    ↓
应用风格指南（references/style-guide.md）
    ↓
输出结构化文档
```

### 典型结构

```yaml
# SKILL.md
name: api-doc-generator
description: API 文档生成器
assets:
  - path: assets/api-template.md
references:
  - path: references/api-style-guide.md
instructions: |
  你是 API 文档生成专家。
  
  工作流程：
  1. 加载 assets/api-template.md 作为输出模板
  2. 识别模板中需要填充的变量（{{endpoint}}, {{params}}, {{response}}）
  3. 向用户询问缺失的信息
  4. 按模板结构填充内容
  5. 应用 references/api-style-guide.md 的格式要求
  6. 输出完整文档
  
  约束：严格遵循模板结构，不得添加模板外的章节
```

### 模板示例（assets/api-template.md）

```markdown
# {{endpoint_name}}

## 端点
`{{method}} {{endpoint}}`

## 描述
{{description}}

## 请求参数
{{params_table}}

## 响应
{{response_schema}}

## 示例
{{code_example}}

## 错误码
{{error_codes}}
```

### 应用场景

- **API 文档**：保持所有端点文档结构一致
- **提交信息**：规范 commit message 格式
- **PR 描述**：标准化 Pull Request 模板
- **项目脚手架**：统一新项目结构

### 与 Tool Wrapper 的区别

| 维度 | Tool Wrapper | Generator |
|------|-------------|-----------|
| **目的** | 提供知识 | 强制结构 |
| **加载时机** | 检测到关键词 | 用户明确要求生成 |
| **输出** | 无固定格式 | 严格模板化 |
| **用户交互** | 单向 | 询问缺失信息 |

---

## 模式三：Reviewer（审查者）

### 核心思想

> 分离"检查什么"和"如何检查"。

不硬编码检查规则，而是外部化到可替换的 checklist。

### 工作机制

```
用户提交代码审查请求
    ↓
Reviewer Skill 加载 checklist
    ↓
逐项检查代码
    ↓
按严重度分类问题（Critical/Warning/Info）
    ↓
生成结构化审查报告
```

### 典型结构

```yaml
# SKILL.md
name: code-reviewer
description: 代码审查专家
references:
  - path: references/python-style-checklist.md
instructions: |
  你是代码审查专家。
  
  审查流程：
  1. 加载 references/python-style-checklist.md
  2. 对提交的代码逐项检查 checklist
  3. 发现问题时按严重度分类：
     - 🔴 Critical：安全漏洞、明显错误
     - 🟡 Warning：风格问题、可优化项
     - 🔵 Info：建议、备注
  4. 生成结构化报告：
     - 总体评分
     - 问题清单（按严重度排序）
     - 修复建议
  
  约束：严格按 checklist 检查，不得添加 checklist 外的主观判断
```

### Checklist 示例（references/python-style-checklist.md）

```markdown
# Python 代码审查清单

## Critical
- [ ] 无 SQL 注入风险
- [ ] 无硬编码密钥
- [ ] 无裸 except 语句

## Warning
- [ ] 函数长度 < 50 行
- [ ] 变量命名符合 PEP8
- [ ] 有适当的类型注解

## Info
- [ ] 有 docstring
- [ ] 复杂逻辑有注释
```

### 应用场景

- **代码审查**：自动化 PR 审查
- **安全审计**：OWASP 安全检查
- **合规检查**：GDPR、 accessibility 等
- **文档审查**：检查文档完整性

### 核心优势

**可替换的检查标准**：

```python
# Python 风格审查
references/python-style-checklist.md

# 安全审查（替换 checklist）
references/owasp-security-checklist.md

# 性能审查（替换 checklist）
references/performance-checklist.md

# 同一 Skill，不同标准
```

---

## 模式四：Inversion（反转模式）

### 核心思想

> Agent 先采访用户，再行动。

翻转传统的"用户驱动"模式，让 Agent 主动收集信息。

### 工作机制

```
用户：帮我规划一个新项目
    ↓
Agent（Inversion Skill）：先问清需求
  - "项目目标是什么？"
  - "技术栈偏好？"
  - "部署环境？"
  - "团队规模？"
  - "时间约束？"
    ↓
用户回答所有问题
    ↓
Agent：现在我有完整信息，开始生成方案
    ↓
输出详细项目计划
```

### 典型结构

```yaml
# SKILL.md
name: project-planner
description: 项目规划专家
instructions: |
  你是项目规划专家。
  
  ⚠️ 重要：在完成所有阶段前，不要开始生成最终方案！
  
  工作流程（分阶段）：
  
  ## Phase 1: 目标收集
  询问：
  - 项目的核心目标是什么？
  - 成功标准是什么？
  
  ## Phase 2: 约束收集
  询问：
  - 技术栈限制？
  - 部署环境？
  - 团队规模？
  - 时间线？
  - 预算？
  
  ## Phase 3: 风险识别
  询问：
  - 已知的技术难点？
  - 外部依赖？
  
  ## Phase 4: 方案生成（所有阶段完成后）
  基于收集的信息生成：
  - 项目结构
  - 技术选型
  - 开发计划
  - 风险缓解策略
  
  约束：必须完成 Phase 1-3 才能进入 Phase 4
```

### 应用场景

- **项目规划**：需求收集不充分导致返工
- **故障排查**：系统收集上下文
- **配置生成**：收集所有参数再生成配置
- **面试/评估**：标准化问题流程

### 关键设计：强制门控

```yaml
# 核心机制
constraints:
  - rule: "DO NOT start building until all phases are complete"
    enforcement: strict
```

Agent 被明确禁止在信息不全时生成输出。

### 为什么需要 Inversion？

**传统模式的问题**：

```
用户：帮我设计一个 API
Agent：好的！（基于猜测生成）
用户：不对，我需要支持 WebSocket
Agent：（重新生成）
用户：还有，要用 GraphQL
Agent：（再次重新生成）
...
```

反复修改，效率低下。

**Inversion 模式**：

```
Agent：先告诉我所有需求
用户：（一次性提供全部信息）
Agent：（基于完整信息生成）
```

一次到位。

---

## 模式五：Pipeline（流水线）

### 核心思想

> 严格多步骤工作流，带硬性检查点。

复杂任务不能被跳过或压缩，必须按步骤执行。

### 工作机制

```
任务：生成完整文档
    ↓
Step 1: 提取代码结构
    ↓
[检查点] 用户确认结构正确？
    ↓
Step 2: 生成 docstring
    ↓
[检查点] 用户确认 docstring？
    ↓
Step 3: 组装最终文档
    ↓
输出
```

### 典型结构

```yaml
# SKILL.md
name: documentation-pipeline
description: 文档生成流水线
assets:
  - path: assets/doc-template.md
references:
  - path: references/step-1-structure.md
  - path: references/step-2-docstring-guide.md
instructions: |
  你是文档生成专家。
  
  严格按以下流水线执行：
  
  ## Step 1: 结构提取
  - 加载 references/step-1-structure.md
  - 分析代码，提取类、函数、参数
  - 输出结构摘要
  - ⛔ 检查点：等待用户确认结构正确
  
  ## Step 2: Docstring 生成
  - 仅在 Step 1 确认后执行
  - 加载 references/step-2-docstring-guide.md
  - 为每个函数生成 docstring
  - ⛔ 检查点：等待用户确认 docstring
  
  ## Step 3: 文档组装
  - 仅在 Step 2 确认后执行
  - 加载 assets/doc-template.md
  - 组装最终文档
  - 输出完整文档
  
  ⚠️ 硬性约束：
  - 不能跳过任何步骤
  - 不能在没有用户确认时进入下一步
  - 每一步只加载当前步骤需要的参考文件
```

### 应用场景

- **文档生成**：确保不遗漏任何步骤
- **代码重构**：分阶段重构，每阶段验证
- **数据管道**：ETL 流程，每个转换步骤可审计
- **发布流程**：测试 → 构建 → 部署，不能跳过

### Pipeline vs Generator

| 维度 | Generator | Pipeline |
|------|-----------|----------|
| **步骤** | 单一步骤 | 多步骤 |
| **检查点** | 无 | 硬性检查点 |
| **用户交互** | 询问变量 | 每步确认 |
| **复杂度** | 简单任务 | 复杂任务 |
| **可中断** | 否 | 是（检查点可暂停）|

---

## 模式组合：构建复杂工作流

### 核心原则

> "Patterns compose."
> 
> "模式可以组合。"

### 组合示例

**示例 1：Pipeline + Reviewer**

```
文档生成流水线
    ↓
Step 1: 结构提取
Step 2: Docstring 生成
Step 3: 文档组装
    ↓
Step 4: [Reviewer] 质量检查
    ↓
输出
```

Pipeline 生成文档，Reviewer 检查质量。

**示例 2：Inversion + Generator**

```
项目规划
    ↓
[Inversion] 收集所有需求
    ↓
[Generator] 按模板生成项目计划
    ↓
输出
```

Inversion 确保信息完整，Generator 确保输出规范。

**示例 3：完整组合**

```
API 开发项目
    ↓
[Inversion] 收集需求
    ↓
[Generator] 生成 API 规范
    ↓
[Pipeline] 分阶段实现
  - Step 1: 数据库设计
  - Step 2: 端点实现
  - Step 3: 测试编写
    ↓
[Reviewer] 代码审查
    ↓
[Tool Wrapper] FastAPI 规范检查
    ↓
完成
```

### ADK SkillToolset 的支持

Google ADK 的 `SkillToolset` 支持渐进式加载：

- 只加载当前需要的 Skill
- 不浪费上下文 tokens
- 运行时动态组合

---

## 与 Context Engineering 的关联

### 回顾 Martin Fowler 的 Context Engineering

Context Engineering 的核心：
> "Curating what the model sees so that you get a better result."

三大类别：
1. 可复用 Prompts
2. 代码库作为上下文
3. Context Interfaces

### Google ADK 模式的映射

| ADK 模式 | Context Engineering 类别 |
|----------|------------------------|
| **Tool Wrapper** | Context Interfaces（按需加载） |
| **Generator** | 可复用 Prompts（模板化） |
| **Reviewer** | 代码库作为上下文（检查当前代码） |
| **Inversion** | Context Interfaces（动态收集） |
| **Pipeline** | 三者组合 |

### 深化理解

**ADK 模式是 Context Engineering 的工程化实现**：

- **Tool Wrapper** = 把领域知识封装成可插拔的 Context
- **Generator** = 用模板约束输出，减少 Context 噪声
- **Reviewer** = 让 Agent 主动分析 Context（代码）
- **Inversion** = 优化 Context 收集流程
- **Pipeline** = 分阶段管理 Context 复杂度

---

## 与 Harness Engineering 的呼应

### 回顾 OpenAI 的 Harness Engineering

三层架构：
1. **Context Engineering**（上下文工程）
2. **架构约束**（确定性检查 + LLM 检查）
3. **垃圾回收**（定期维护）

### ADK 模式的对应

| Harness 层次 | ADK 模式体现 |
|-------------|-------------|
| **Context Engineering** | Tool Wrapper、Inversion |
| **架构约束** | Generator（模板约束）、Reviewer（检查约束）、Pipeline（流程约束） |
| **垃圾回收** | Reviewer（代码质量检查） |

### 统一的框架

```
┌─────────────────────────────────────────────┐
│           AI-Native Engineering             │
├─────────────────────────────────────────────┤
│  Context Engineering (Martin Fowler)        │
│  ├── 可复用 Prompts                         │
│  ├── 代码库作为上下文                        │
│  └── Context Interfaces                     │
├─────────────────────────────────────────────┤
│  Harness Engineering (OpenAI)               │
│  ├── Layer 1: Context                       │
│  ├── Layer 2: 架构约束                       │
│  └── Layer 3: 垃圾回收                       │
├─────────────────────────────────────────────┤
│  Skill Patterns (Google ADK)                │
│  ├── Tool Wrapper   → Context Layer         │
│  ├── Generator      → Constraint Layer      │
│  ├── Reviewer       → Constraint + GC Layer │
│  ├── Inversion      → Context Layer         │
│  └── Pipeline       → All Layers            │
└─────────────────────────────────────────────┘
```

**结论**：三个概念从不同角度描述同一件事——如何让 AI Agent 高效、可靠地工作。

---

## 实践建议：选择正确的模式

### 决策树

```
任务需求分析
    ↓
需要特定领域知识？
    ├─ 是 → Tool Wrapper
    └─ 否 ↓
输出需要严格结构？
    ├─ 是 ↓
    │   需要分步骤执行？
    │       ├─ 是 → Pipeline
    │       └─ 否 → Generator
    └─ 否 ↓
需要检查/审查？
    ├─ 是 → Reviewer
    └─ 否 ↓
需要收集大量信息？
    ├─ 是 → Inversion
    └─ 否 → 简单 Prompt
```

### 实战建议

**1. 从简单开始**

不要过度设计。简单任务用简单 Prompt，复杂任务才用模式。

**2. 渐进增强**

```
Phase 1: 基础 Prompt
Phase 2: 加入 Tool Wrapper（添加知识）
Phase 3: 加入 Reviewer（添加检查）
Phase 4: 组合成 Pipeline（完整流程）
```

**3. 测试驱动**

为每个 Skill 编写测试用例：

```yaml
test_cases:
  - input: "创建一个 FastAPI 端点"
    expected_behavior: "加载 FastAPI Skill，询问端点详情"
  - input: "审查这段代码"
    expected_behavior: "加载 Reviewer Skill，按 checklist 检查"
```

**4. 文档化**

每个 Skill 必须包含：
- 用途说明
- 触发条件
- 输入/输出格式
- 依赖的参考文件

---

## 趋势：Skill 生态的标准化与分化

### 标准化趋势

**格式标准**：
- SKILL.md 成为事实标准
- MCP（Model Context Protocol）跨平台支持
- 30+ 工具兼容

**为什么标准化重要**：

| 利益相关方 | 收益 |
|-----------|------|
| **开发者** | 一次编写，多处使用 |
| **工具厂商** | 共享生态，降低用户切换成本 |
| **企业** | 内部 Skill 可跨团队复用 |
| **社区** | 沉淀最佳实践，快速传播 |

### 分化趋势

**内容差异化**：

虽然格式相同，但内容质量差异巨大：

| 层次 | 内容质量 | 竞争壁垒 |
|------|---------|----------|
| **Level 1** | 简单指令列表 | 无 |
| **Level 2** | 结构化模板 | 低 |
| **Level 3** | 多模式组合 | 中 |
| **Level 4** | 领域专家知识库 | 高 |
| **Level 5** | 自适应、自优化 Skill | 极高 |

### 未来预测

**1. Skill 市场**

类似 VS Code Extension 市场，将出现 Skill 商店：
- 官方 Skill（Google、Anthropic、OpenAI）
- 社区 Skill（开源贡献）
- 商业 Skill（企业级解决方案）

**2. Skill 即服务**

企业可能不再招聘"Python 开发者"，而是购买"Python 开发 Skill"：
- 包含公司代码规范
- 包含内部库知识
- 包含最佳实践
- 持续更新维护

**3. Skill 设计师**

新职业出现：
- 专门设计高质量 Skill
- 理解领域知识 + AI 交互设计
- 类似今天的 Prompt Engineer，但更系统化

---

## 结论：内容设计是新的护城河

### 核心洞察

> "当格式标准化后，真正的差异化在于内容设计。"

Google ADK 的五大模式告诉我们：

1. **不要只关注格式** - YAML 语法人人会写
2. **投资内容设计** - 这才是价值所在
3. **使用成熟模式** - 不要重复发明轮子
4. **组合创新** - 简单模式组合出复杂能力

### 对开发者的启示

**从"写代码"到"设计约束"**：

传统开发者：
```
需求 → 写代码 → 测试 → 部署
```

AI-Native 开发者：
```
需求 → 设计 Skill → Agent 执行 → 审查 → 迭代 Skill
```

**Skill 设计能力将成为核心竞争力**。

### 最后思考

Google ADK 的五大模式不是终点，而是起点。

随着生态发展，会出现更多模式：
- 特定领域的模式（医疗、法律、金融）
- 特定任务的模式（调试、优化、重构）
- 特定团队的模式（敏捷、瀑布、DevOps）

掌握模式思维，比掌握具体模式更重要。

> "模式是工具，不是教条。理解背后的原理，灵活运用，才是工程师的智慧。"

---

## 参考与延伸阅读

- [Google Agent Development Kit Documentation](https://google.github.io/adk-docs/) - ADK 官方文档
- [5 Agent Skill design patterns every ADK developer should know](https://x.com/googlecloudtech/status/2033953579824758855) - 本文来源推文
- [Context Engineering for Coding Agents](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html) - Martin Fowler
- [Harness Engineering](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html) - Martin Fowler on OpenAI
- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) - Anthropic

---

*本文基于 Google Cloud Tech 关于 ADK Skill 模式的推文深度解读。*

*发布于 [postcodeengineering.com](/)*
