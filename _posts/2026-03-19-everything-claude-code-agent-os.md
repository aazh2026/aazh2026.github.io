---
layout: post
title: "\"Harness Engineering 实战：Everything Claude Code 的系统化约束之道\""
date: 2026-03-19T16:00:00+08:00
permalink: /everything-claude-code-harness-engineering/
tags: [AI-Native, Harness-Engineering, Claude-Code, System-Design]
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
> 
> everything-claude-code 是 Harness Engineering 的完整实战案例。它证明了：**AI 工程的核心不是 prompt 调优，而是构建系统化的约束机制（Harness）**。通过 Eval Harness、Rules Engine、自动化 Hooks 和持续学习机制，将不可控的 LLM 输出转化为可预测、可测试、可进化的工程系统。这篇文章从 Harness 的四大支柱出发，深度解析如何用系统化方法"驯服"AI。

---

> **什么是 Harness Engineering？**
> 
> 一句话定义：**把 AI 行为装进一个可测试、可约束、可进化的系统**。
> 
> 不是相信 AI 会做对，而是确保 AI 必须做对。

---


## Harness Engineering 的本质

### 为什么传统方法失败了？

大多数开发者使用 AI 的方式：

**问题**：
- Prompt 调优是**一次性技巧**，无法复用
- AI 行为**不可预测**，同样的输入可能产生不同输出
- 没有**积累机制**，每次都从零开始
- **质量不可控**，依赖 AI "自觉"

### Harness Engineering 的定义

> **Harness Engineering = 把 AI 行为装进一个可测试、可约束、可进化的系统**

借用 OpenAI 的定义：
> "Harness 是让 AI Agent 保持可控的工具和实践集合。"

但 everything-claude-code 更进一步：
- **不是**给 AI 一套工具让它更自由
- **而是**给 AI 一套约束让它更可靠

### 核心思想对比

| 维度 | Prompt Engineering | Harness Engineering |
|------|-------------------|---------------------|
| **关注点** | 单次对话优化 | 系统化约束设计 |
| **可复用性** | 低（场景特定） | 高（跨项目通用） |
| **可预测性** | 低（非确定性） | 高（约束强制） |
| **质量保障** | 靠运气 | 系统化测试 |
| **持续改进** | 无 | 自动学习沉淀 |

### everything-claude-code 的 Harness 设计

这个项目是 Harness Engineering 的**完整实战案例**：

<object data="/assets/images/2026-03-19-everything-claude-code-agent-os-01-harness-pillars.svg" type="image/svg+xml" width="100%"></object>

**核心洞察**：
> "不是相信 AI 会做对，而是确保 AI 必须做对。"

---

<object data="/assets/images/2026-03-19-everything-claude-code-agent-os-03-harness-system.svg" type="image/svg+xml" width="100%"></object>

## Harness 的四大支柱

everything-claude-code 的 Harness 体系由四个核心支柱构成：

<object data="/assets/images/2026-03-19-everything-claude-code-agent-os-02-agent-os-layers.svg" type="image/svg+xml" width="100%"></object>

<object data="/assets/images/2026-03-19-everything-claude-code-agent-os-04-ascii-arch.svg" type="image/svg+xml" width="100%"></object>

### 支柱 1：Eval Harness（测试层）

**核心问题**：如何知道 AI 做得对不对？

**解决方案**：把 AI 输出当作产品，建立测试体系。

**关键洞察**：
- AI 输出不是"艺术品"，而是"产品"
- 产品必须有质量标准
- 标准必须可测试

> 💡 **Key Insight**
> 
> Eval Harness 的本质是将 AI 行为转化为可量化、可复现的测试对象。没有度量就没有改进——你无法优化一个无法测量的系统。

### 支柱 2：Rules Engine（约束层）

**核心问题**：如何防止 AI 做错？

**解决方案**：系统化强制（不是建议）。

**约束类型**：
- **硬约束**：必须满足（如安全规则）
- **软约束**：建议满足（如代码风格）
- **流程约束**：必须按步骤执行（如 TDD）

### 支柱 3：Hooks & Automation（执行层）

**核心问题**：如何自动化执行 Harness？

**解决方案**：自动触发机制。

| Hook | 触发时机 | 动作 |
|------|---------|------|
| `pre-commit` | 提交前 | 自动 review |
| `post-eval` | 评估后 | 记录 metrics |
| `session-stop` | 会话结束 | continuous-learning |
| `error-occurs` | 出错时 | 查询知识库 |

**核心价值**：无人值守的自动化流水线。

### 支柱 4：Continuous Learning（进化层）

**核心问题**：如何让 Harness 越用越强？

**解决方案**：经验自动沉淀为机制。

**关键突破**：
- 传统 AI：每次都是 fresh start
- Harness：每次都在进化

---

## Eval Harness：把 AI 行为变成可测试对象

### 为什么需要 Eval Harness？

**LLM 的核心问题：非确定性**

人类工程师：
- 可以 review 代码质量
- 可以判断是否符合需求
- 可以指出具体问题

但这个过程是**人工、耗时、不可规模化的**。

### Eval Harness 的设计

**核心理念**：把"判断 AI 做得对不对"也变成可自动化的任务。

#### 1. Capability Eval（能力评估）

**问题**：AI 是否具备完成特定任务的能力？

### 执行流程

Eval Harness 的执行流程分为三个层次：

#### 2. Regression Eval（回归评估）

**问题**：新功能是否破坏了旧功能？

**关键设计**：
- 每次修改后自动运行全量测试
- 对比 baseline 确保没有退化
- 量化指标（响应时间、错误率等）

#### 3. pass@k 指标

**问题**：AI 的成功率有多高？

**定义**：k 次尝试中至少成功 1 次的概率。

**应用场景**：
- 评估不同 prompt 的效果
- 评估不同模型的能力
- 追踪项目随时间的改进

### Eval Harness 在 everything-claude-code 中的实现

Eval Harness 在 everything-claude-code 中通过 `eval-harness` Skill 实现自动化。开发者通过简单的命令触发完整的评估流程，无需手动运行测试。

### 触发方式

通过 `/eval` 命令触发评估流程，系统自动运行所有已注册的测试用例并生成报告。

### 输出示例

评估完成后，系统输出详细的测试报告，包括通过率、失败案例和性能指标。

## Rules Engine：系统化约束（不是建议）

### Prompt vs Rule：本质区别

| 维度 | Prompt | Rule |
|------|--------|------|
| **性质** | 请求 | 约束 |
| **强制性** | 软 | 硬 |
| **可检查性** | 难 | 易 |
| **一致性** | 低 | 高 |

### 示例对比

Rules 和 Prompt 的核心差异在于约束力。Prompt 是一种请求，AI 可以选择忽略或偏离；而 Rule 是一种硬性约束，系统会强制执行，不满足则拒绝。

### Rules 的分类

Rules Engine 中的规则分为三类，分别应对不同的约束场景：

> 💡 **Key Insight**
> 
> Rules Engine 的核心价值在于将"建议"转化为"强制"。当约束被系统化执行，质量保障就不再依赖人的自觉性。

#### 1. 硬约束（Hard Constraints）

**定义**：必须满足，不满足则拒绝。

**示例**（security.md）：

#### 2. 软约束（Soft Constraints）

**定义**：建议满足，不满足可以讨论。

**示例**（coding-style.md）：

#### 3. 流程约束（Process Constraints）

**定义**：必须按特定流程执行。

**示例**（tdd-process.md）：

### Rules Engine 的实现

Rules Engine 的核心是一个基于 YAML 规则文件的执行引擎。每个规则文件定义具体的约束条件，系统在 AI 输出时自动检查是否满足。Reviewer Agent 读取规则文件，对照检查输出，违规时触发相应的处理逻辑。

### Reviewer Agent 的工作流程

Reviewer Agent 是 Rules Engine 的执行者。它接收 AI 的输出，与规则库逐一比对，检查安全边界、代码风格、流程合规性等多个维度。任何违规项都会生成详细的报告，供开发者后续处理。

### Rule 文件的演进

Rules 不是一成不变的，它们随着项目发展不断演进：

**V1: 静态规则** — 硬编码的规则集合，适合单一场景。

**V2: 参数化规则** — 规则支持参数配置，适应不同环境。

**V3: 自适应规则** — 根据历史数据自动调整规则权重和阈值，实现持续优化。

---

## Hooks & Automation：无人值守的执行层

### 为什么需要 Hooks？

**问题**：Harness 需要人工触发，效率低、容易遗漏。

**解决方案**：自动化触发机制。

### Hook 类型

#### 1. 代码生命周期 Hooks

| Hook | 触发时机 | 动作 | 目的 |
|------|---------|------|------|
| `pre-write` | AI 开始写代码前 | 加载相关 Skill | 准备上下文 |
| `post-write` | AI 写完代码后 | 运行 linter | 即时检查 |
| `pre-commit` | 用户尝试提交前 | 运行 full eval | 质量门禁 |
| `post-commit` | 提交成功后 | 更新 metrics | 数据追踪 |

**示例**（.claude/hooks.yaml）展示了完整的 Hook 配置，包括触发时机、动作和执行条件。

#### 2. 会话生命周期 Hooks

| Hook | 触发时机 | 动作 | 目的 |
|------|---------|------|------|
| `session-start` | 新会话开始 | 加载项目上下文 | 保持一致性 |
| `session-stop` | 会话结束 | 运行 continuous-learning | 经验沉淀 |
| `error-occurs` | AI 出错时 | 查询知识库 | 快速恢复 |
| `checkpoint` | 用户标记检查点 | 保存状态 | 长期记忆 |

#### 3. 条件触发 Hooks

基于状态的条件触发机制允许 Hook 根据系统当前状态自动决定是否执行。例如，当错误率超过阈值时自动触发回归测试，当检测到性能下降时自动触发优化流程。

### Automation 的价值

Automation 将 Harness 从手动触发转变为自动执行，确保每个环节都不会因为人为遗漏而失效。

> 💡 **Key Insight**
> 
> Hooks 是 Harness 的"神经系统"——它们将各个组件连接成自动化流水线。没有 Hooks，Eval 和 Rules 只能靠人工触发，无法形成真正的系统。

### Harness 自动化方式
**关键差异**：
- 传统：依赖人的记忆和自觉性
- Harness：系统化强制，不会遗漏

---

## Continuous Learning：经验如何变成机制

### 传统 AI 的遗忘问题

**问题**：AI 没有长期记忆，同样的错误会反复出现。

### Continuous Learning 的设计

**核心理念**：把人工纠正变成系统能力。

#### 学习流程

Continuous Learning 的学习流程是一个自动化的闭环系统，每次会话结束后自动运行，将人工经验转化为系统能力。

#### 实现细节

Continuous Learning 的实现分为三个步骤：

**Step 1: 评估有效性** — 系统评估本次会话中的纠正是否真正解决了问题，筛选出有价值的经验。

**Step 2: 模式提取** — 从有效的纠正中提取重复模式，判断是否可以泛化到其他场景。

**Step 3: 生成 Skill** — 将提取的模式封装为可复用的 Skill，供后续会话使用。

  ### 正确模式
  ### 检查清单
  - [ ] 是否使用了 yield 而不是 return？
  - [ ] 是否处理了资源释放？
  - [ ] 是否使用 callable 作为 Depends 参数？
Week 1: 遇到依赖注入错误 3 次，每次人工解释
Week 2: 遇到同样的错误 2 次，每次人工解释
Week 3: 遇到同样的错误 2 次...
Week 1: 遇到错误 → 人工解释 → 系统自动学习
Week 2: 遇到错误 → AI 自动应用已学习的 Skill → 快速解决
Week 3+: 错误率显著下降
Harness Engineering（理论）
    ↓
everything-claude-code（实现）
    ↓
Agent OS（运行环境）
User Request
    ↓
Planner: 分解任务，输出设计文档
    ↓
Coder: 按设计实现代码
    ↓
Reviewer: 检查代码质量
    ↓
通过 → 提交
不通过 → 返回 Coder 修改
coding-style.md    → 编码规范
security.md        → 安全规则
testing.md         → 测试要求
tdd-process.md     → 流程约束
### Layer 5: 角色层 — 多 Agent 分裂

**核心思想**：避免"一个脑子"问题。

传统单 Agent：
多 Agent 分裂：
**关键设计**：
- 每个 Agent 有明确的职责边界
- Agent 之间通过结构化输出协作
- 避免上下文污染和能力混淆

### Layer 4: 能力层 — 可复用技能模块

**Skill 的定义**：封装特定能力的"AI 插件 + 行为模板"。

示例技能：

### TDD Skill
### eval-harness Skill
### continuous-learning Skill
### Layer 3: 控制层 — 机械约束（不是建议）

**核心思想**：把工程规范"编译进系统"。

不是：
而是：
**规则示例**（coding-style.md）：
**关键区别**：Prompt 是建议，Rules 是约束。

### Layer 2: 执行层 — 结构化命令

**Command 是用户与系统交互的接口**：

| 命令 | 作用 | 触发 Agent |
|------|------|-----------|
| `/plan` | 架构规划 | Planner |
| `/tdd` | TDD 开发 | Coder + TDD Skill |
| `/verify` | 系统验证 | Reviewer |
| `/review` | 代码审查 | Reviewer |
| `/eval` | 能力评估 | eval-harness |
| `/checkpoint` | 保存关键节点 | 系统 |

**设计原则**：
- 每个命令对应明确的模式
- 命令内部有严格的执行流程
- 用户不需要记住复杂的 prompt

### Layer 1: 工具层 — MCP 直接操作世界

**MCP（Model Context Protocol）**：AI 直接操作外部系统的标准接口。

### GitHub MCP
**Supabase MCP**：
**核心价值**：消灭"人工搬运"环节。

传统流程：
MCP 流程：
---

## 真实场景推演：CRM 标签推荐系统

我们用完整的 everything-claude-code 系统来开发一个真实功能。

> 💡 **Key Insight**
> 
> 真实场景推演展示了 Harness 四大支柱如何协同工作：Eval 提供度量、Rules 提供约束、Hooks 提供自动化、Continuous Learning 提供进化。

### 需求

> 开发一个 SaaS CRM 的「客户标签推荐系统」
> 
> 功能：根据客户行为和资料，自动推荐标签

### 阶段 1：规划（/plan）

### 用户输入
**系统内部**：

1. **Command Router** 识别 `/plan` 命令
2. **Planner Agent** 启动
3. **输出结构化规划**：

**核心价值**：避免"直接写代码 → 重构地狱"

### 阶段 2：TDD 开发（/tdd）

开发者输入 `/tdd` 命令启动 TDD 开发流程。系统内部进入一个循环执行模式，由 TDD Skill 驱动整个红-绿-重构周期。

### 用户输入

TDD 开发流程包含以下阶段：

### 系统内部执行循环

系统内部执行循环是 TDD 的核心，它强制开发者先写测试，再写实现，最后重构。

#### 🔴 RED（先写测试）

TDD Skill 触发后，首先编写一个会失败的测试用例，明确功能预期。

### TDD Skill 触发

TDD Skill 自动加载 TDD 流程规范，确保每个步骤都遵循红-绿-重构的节奏。

#### 🟢 GREEN（实现功能）

Coder Agent 编写最简单可行的代码让测试通过，不做多余优化。

### Coder Agent 编写代码

Coder Agent 接收设计文档和测试用例，按规范实现功能代码。

#### 🔵 REFACTOR（优化）

**重构代码结构**：
- 提取 embedding 逻辑到服务层
- 优化数据库查询
- 添加缓存

#### ✅ VERIFY

### 运行测试

开发者在 TDD 循环的每个阶段都可以运行测试验证当前状态。

**边界检查**：
- 空客户资料处理
- 大量标签性能
- 并发请求

### 阶段 3：实时评估（eval-harness）

开发者输入 `/eval` 命令启动实时评估，系统调用 eval-harness Skill 执行完整的测试套件。

### 用户输入

**eval-harness Skill 执行**：

**核心价值**：AI 开发的"单元测试系统"

### 阶段 4：代码审查（/review）

开发者输入 `/review` 命令触发代码审查流程。Reviewer Agent 根据 Rules Engine 中的规则逐项检查代码。

### Reviewer Agent 检查清单

Reviewer Agent 的检查清单包括代码风格、安全性、性能和可维护性等多个维度。

### 阶段 5：系统验证（/verify）

**边界测试**：
- 空客户资料
- 极大标签数量
- 并发请求

**异常路径**：
- 数据库连接失败
- Embedding 服务不可用
- 向量搜索超时

**性能分析**：
- P50 响应时间: 45ms
- P99 响应时间: 120ms
- 吞吐量: 1000 req/s

### 阶段 6：Checkpoint（关键设计冻结）

在关键节点保存系统状态，确保重要的设计决策和上下文不会丢失。

### 保存关键状态

在 Checkpoint 阶段，系统执行以下保存操作：

**系统保存**：
- 当前架构设计
- 关键决策记录
- 上下文摘要
- 经验教训

**用于**：
- 长期项目记忆
- 新成员 onboarding
- 架构演进追踪

---

## 持续自我改进：经验如何变成机制

### 传统 AI 的问题

> "每次都是 fresh start"

同样的错误会反复出现，因为没有记忆和沉淀。

### continuous-learning Skill 的设计

**触发时机**：Session 结束（Stop Hook）

### 自动执行三件事

#### 1️⃣ 评估本次对话

#### 2️⃣ 模式提取

### 识别有价值的模式

#### 3️⃣ 生成新技能

### 保存到学习目录

**生成的 Skill 示例**：

  检查点：
  - 是否使用了 yield 而不是 return？
  - 是否处理了资源释放？
**关键洞察**：
- AI 输出不是"艺术品"，而是"产品"
- 产品必须有质量标准
- 标准必须可测试

#### 2️⃣ Rules（约束层）

### 系统化强制（不是建议）

**约束类型**：
- **硬约束**：必须满足（如安全规则）
- **软约束**：建议满足（如代码风格）
- **流程约束**：必须按步骤执行（如 TDD）

#### 3️⃣ Hooks（执行层）

**自动触发机制**：

| Hook | 触发时机 | 动作 |
|------|---------|------|
| `pre-commit` | 提交前 | 自动 review |
| `post-eval` | 评估后 | 记录 metrics |
| `session-stop` | 会话结束 | continuous-learning |
| `error-occurs` | 出错时 | 查询知识库 |

**核心价值**：自动化流水线，无需人工干预。

#### 4️⃣ Metrics（度量层）

### 量化 AI 表现

### 和传统工程的对比

| 维度 | 传统软件工程 | AI Harness Engineering |
|------|-------------|----------------------|
| **测试对象** | 代码 | AI 行为 |
| **单元测试** | 函数测试 | Capability eval |
| **集成测试** | 模块测试 | Regression eval |
| **CI/CD** | 自动化部署 | 自动 hooks |
| **编码规范** | lint | Rules engine |
| **代码审查** | 人工 review | Reviewer Agent |
| **质量度量** | code coverage | pass@k, metrics |

### 为什么必须 Harness？

**因为 LLM 的本质特性**：

1. **非确定性**：同样的输入可能产生不同输出
2. **幻觉倾向**：可能生成看似正确但实际错误的内容
3. **上下文限制**：无法一次性记住所有约束
4. **错误累积**：小的偏差会随时间放大

**解决方案**：用系统约束代替"靠 AI 自觉"

---

## 系统流程图：完整运行视图

---

## 关键洞察：AI 工程的未来形态

### 1️⃣ AI 工程的核心不是"模型"，是"控制系统"

everything-claude-code 证明：

**模型能力正在快速收敛**（GPT-4、Claude、Gemini 差距缩小），**系统设计的差异将成为核心竞争力**。

### 2️⃣ 最重要的能力：把"经验 → 机制"

| 经验 | 机制 |
|------|------|
| 人类经验 | → Skill |
| Bug | → Eval |
| Code Review | → Reviewer Agent |
| 最佳实践 | → Rules |
| 项目知识 | → Checkpoint |

**持续学习不是可选项，是必选项**。

### 3️⃣ 未来软件工程形态

### 从
### 到
**开发者角色的转变**：

| 传统 | AI-Native |
|------|-----------|
| 写代码 | 设计约束 |
| Debug | 设计 Eval |
| Code Review | 训练 Reviewer |
| 技术决策 | 架构 Harness |

---

## 总结：从使用 AI 到设计系统

everything-claude-code 不是一个工具，而是一个**工程范式**。

它告诉我们：

1. **不要只关注 Prompt** — 那是表层技巧
2. **投资系统设计** — 这才是长期价值
3. **建立约束机制** — 不要相信 AI 自觉
4. **持续学习沉淀** — 把经验变成机制
5. **量化度量一切** — 不可测量的无法改进

### 最后思考

当我们谈论"AI 编程"时，大多数人想到的是：

> "让 AI 帮我写代码"

everything-claude-code 展示的是另一个愿景：

> "设计一个系统，让 AI 在约束下高效、可靠地工作"

这不是替代人类工程师，而是**升级人类工程师的角色**——从执行者变成设计师，从编码者变成系统架构师。

**Harness Engineering** 可能是软件工程下一个十年的核心范式。

---

## 参考与延伸阅读

- [everything-claude-code GitHub](https://github.com/affaan-m/everything-claude-code) - 开源项目
- [Skills.sh - everything-claude-code](https://skills.sh/affaan-m/everything-claude-code) - Skill 市场
- [Harness Engineering - Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html) - 理论基础
- [Building Effective Agents - Anthropic](https://www.anthropic.com/engineering/building-effective-agents) - Agent 设计最佳实践

---

*本文基于 everything-claude-code 开源项目的深度架构分析。*

*发布于 [postcodeengineering.com](/)*
