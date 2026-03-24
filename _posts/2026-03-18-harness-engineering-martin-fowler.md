---
layout: post
title: "Harness Engineering 解读：让 AI Agent 可控的工程实践"
date: 2026-03-18T18:00:00+08:00
permalink: /harness-engineering-martin-fowler/
tags: [AI-Native, Agent, Harness, Martin-Fowler, Engineering]
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
> 
> OpenAI 团队发布了一项内部工程实验：5 个月时间、零手写代码，生成了超过 100 万行代码。他们的关键实践是 "Harness"——一套约束 AI Agent 的工具和方法。Martin Fowler 对此进行了深度解读，提出 Harness Engineering 的核心思想：通过上下文工程、架构约束和"垃圾回收"机制，让 AI 生成的代码可维护、可信赖。
> 
> ⚠️ **声明**：本文是对 Martin Fowler 解读文章的再解读，包含我的个人观点和延伸思考，而非经过独立验证的技术报告。

---

## 📋 本文结构

1. [什么是 Harness？](#什么是-harness)
2. [OpenAI 的内部实验](#openai-的内部实验)
3. [Harness 的三层架构](#harness-的三层架构)
4. [从"生成 Anything"到"约束解空间"](#从生成-anything到约束解空间)
5. [Harness 会成为新的服务模板吗？](#harness-会成为新的服务模板吗)
6. [技术栈收敛：一个值得怀疑的预测](#技术栈收敛一个值得怀疑的预测)
7. [实践：用现有工具构建 Harness](#实践用现有工具构建-harness)
8. [我的尝试与踩坑](#我的尝试与踩坑)
9. [结论：可控的 AI 自主](#结论可控的-ai-自主)

---

## 什么是 Harness？

**Harness** 原意是"马具"——用来控制和引导马匹的工具。

在 AI 工程中，Harness 指的是：**让 AI Agent 保持可控的工具和实践集合**。

> 📌 *定义来源：Mitchell Hashimoto 在 [My AI Adoption Journey](https://mitchellh.com/writing/my-ai-adoption-journey#step-5-engineer-the-harness) 中首次提出 Harness 概念，后被 Martin Fowler 系统化阐述。*

### 为什么需要 Harness？

AI Agent 的能力带来了新的问题：

| 能力 | 风险 |
|------|------|
| 自主决策 | 可能做出错误选择 |
| 多步执行 | 错误会累积传播 |
| 代码生成 | 可能产生技术债务 |
| 长期运行 | 可能偏离目标 |

**Harness 的目的**：在给予 AI 自主性的同时，确保结果可预测、可维护、可信赖。

### Harness vs 传统工具链

| 维度 | 传统工具链 | Harness |
|------|-----------|---------|
| **目标** | 辅助人类开发 | 约束 AI 行为 |
| **确定性** | 人类判断为主 | 自动化约束为主 |
| **反馈循环** | Code Review | 实时验证 + 自动修复 |
| **适应性** | 静态规则 | 动态调整 |

---

## OpenAI 的内部实验

### 实验背景

> 📌 *以下信息来自 OpenAI 官方博客文章 [Harness Engineering](https://openai.com/index/harness-engineering/)（2025 年 3 月发布）和 Martin Fowler 的解读。*

**实验设置**：
- 零手写代码（"no manually typed code at all"）
- 使用内部 Codex Agent 开发
- 时间：5 个月
- 结果：超过 100 万行代码

**重要说明**：OpenAI 并未明确说明这是对外发布的商业产品，还是内部工具/原型系统。Fowler 的文章将其描述为 "real-world codebase"，但缺乏关于项目性质、维护状态和长期演化的详细信息。

**OpenAI 团队的关键洞察**：
> "当 Agent 遇到困难时，我们将其视为信号：识别缺失的内容——工具、护栏、文档——并通过让 Codex 自己编写修复程序将其反馈到仓库中。"
> 
> —— *OpenAI 工程团队*

### 为什么能成功？

不是 Prompt 工程，而是 **Harness 工程**。

OpenAI 团队构建了一套系统来：
1. **提供上下文**（Context Engineering）
2. **约束架构**（Architectural Constraints）
3. **维护质量**（Garbage Collection）

> 💡 **我的观点**：这个实验的样本量（一个项目）和时间跨度（5 个月）不足以得出普适结论。但它提供了一个有价值的思考框架——与其争论 "AI 能不能写代码"，不如思考 "如何让 AI 写的代码可维护"。

---

## Harness 的三层架构

> 📌 *以下三层架构模型由 Martin Fowler 基于 OpenAI 的实践归纳提炼，是对原始经验的系统化整理。*

```
┌─────────────────────────────────────────┐
│           Harness 架构                  │
├─────────────────────────────────────────┤
│  Layer 3: 垃圾回收 (Garbage Collection)  │
│  - 定期运行的 Agent                      │
│  - 发现文档不一致                        │
│  - 修复架构违规                          │
│  - 对抗熵增和腐烂                        │
├─────────────────────────────────────────┤
│  Layer 2: 架构约束                        │
│  - 确定性自定义 Linter                   │
│  - 结构化测试                            │
│  - LLM-based Agent 监控                   │
├─────────────────────────────────────────┤
│  Layer 1: 上下文工程                      │
│  - 持续增强的知识库                      │
│  - 动态上下文（可观测性数据）             │
│  - 浏览器导航等实时信息                   │
└─────────────────────────────────────────┘
```

### Layer 1: 上下文工程

**核心问题**：Agent 需要知道什么才能做出正确决策？

**OpenAI 的做法**：
- 在代码库中维护持续增强的知识库
- 提供动态上下文（错误日志、性能指标、用户行为）
- 允许 Agent 浏览网页获取最新信息

> "Context is king. The better the context, the better the AI's decisions."
> 
> —— *Martin Fowler 的总结*

### Layer 2: 架构约束

**核心问题**：如何防止 Agent 生成混乱的代码？

**混合方法**：
- **确定性约束**：自定义 Linter、结构测试（不可绕过）
- **LLM 约束**：让 Agent 自己检查架构合规性

**约束示例**（概念性说明）：
```yaml
# 伪代码：展示架构约束的思想，非真实配置格式
architecture_constraints:
  - rule: "所有 API 调用必须通过 service layer"
    enforcement: custom_linter
    
  - rule: "数据库访问必须封装在 repository 中"
    enforcement: structural_test
```

### Layer 3: 垃圾回收

**核心问题**：如何对抗代码腐烂？

**机制**：
- 定期运行的 Agent（如每天一次）
- 扫描代码库寻找：
  - 过时的文档
  - 架构违规
  - 不一致的命名
  - 死代码
- 自动生成修复 PR

**类比**：就像垃圾回收器自动管理内存，Harness 自动维护代码健康。

---

## 从"生成 Anything"到"约束解空间"

### 早期的错误假设

**AI 编码的初期愿景**：
- LLM 可以生成任何语言、任何模式的代码
- 无需约束，LLM 会自己搞定
- 无限的灵活性

### 现实的经验

OpenAI 的实验表明：

> "为了增加信任和可靠性，必须约束解决方案空间。"
> 
> —— *Martin Fowler 对 OpenAI 经验的解读*

**具体约束**：
- 特定的架构模式
- 强制的边界
- 标准化的结构

**代价**：
- 放弃一些"生成 Anything"的灵活性
- 需要更多的前期投入（Prompts、规则、Harness）
- 更多的技术 specifics

**收益**：
- 可维护的代码
- 可预测的行为
- 可信赖的系统

### 约束的类型

| 约束类型 | 示例 | 实施方式 |
|----------|------|----------|
| **架构模式** | MVC、Clean Architecture | 代码生成模板 + Linter |
| **命名规范** | 统一的命名约定 | 自动化检查 |
| **依赖规则** | 禁止循环依赖 | 静态分析 |
| **测试要求** | 代码覆盖率门槛 | CI/CD 检查 |
| **文档要求** | 所有公共 API 必须文档化 | Agent 扫描 + 自动生成 |

---

## Harness 会成为新的服务模板吗？

### 服务模板的演进

**传统服务模板（Golden Path）**：
- 帮助团队快速启动新服务
- 提供标准化的项目结构
- 集成常用工具链

**未来的 Harness 模板**（Fowler 的预测）：
- 针对常见应用拓扑的预配置 Harness
- 包含：
  - 自定义 Linter
  - 结构测试
  - 基础上下文和知识文档
  - 上下文提供者（可观测性、浏览器等）

### 选择 Harness，而非选择技术栈

> "开发者可能不再仔细选择每个库和框架，而是选择适合目标应用拓扑的 Harness。"
> 
> —— *Martin Fowler 的预测*

**工作流程**：
1. 选择 Harness 模板（如"电商后端 Harness"）
2. 根据具体需求调整
3. 随时间演进

### 挑战：分叉和同步

**问题**：
- 团队 A 改进了 Harness
- 团队 B 也想用这些改进
- 但团队 B 已经做了很多定制

> 💡 **我的观点**：这个"分叉与同步"问题在今天的基础设施即代码（IaC）和 Golden Path 实践中已经存在。Harness 并没有 magically 解决这个问题，只是把它转移到了新的抽象层。

---

## 技术栈收敛：一个值得怀疑的预测

### Fowler 的预测

> "我们可能会看到技术栈收敛到少数几个有高质量 Harness 支持的选项。"

### 我的质疑

这个预测有几个值得推敲的假设：

| 假设 | 现实检验 |
|------|----------|
| "Agent 友好性"会成为首要标准 | 目前看不到证据。人类开发者的偏好、企业现有投资、招聘市场仍是主导因素 |
| Harness 质量 > 个人喜好 | 历史上，技术栈选择从来不是纯技术决策，而是政治、生态、惯性的产物 |
| 小效率不重要了 | 当 Agent 生成有问题的代码时，人类开发者仍需介入调试，底层复杂度不会消失 |

> 💡 **我的观点**：技术栈收敛的预测过于乐观。更可能的结果是**分层收敛**——底层基础设施（如容器编排）可能收敛，但应用层技术栈会继续保持多样化。Harness 会成为新的抽象层，但不会消除技术栈的复杂性，只是把它隐藏起来。

---

## 实践：用现有工具构建 Harness

与其等待某个未来的 ".harness/config.yaml" 标准出现，不如用**今天就能用的工具**构建 Harness 的核心能力。

### Layer 1: 上下文工程（可用方案）

**工具组合**：

| 目标 | 工具 | 配置示例 |
|------|------|----------|
| 知识库 | `CONTEXT.md` / `ARCHITECTURE.md` | 放在项目根目录，供 AI 工具读取 |
| 动态上下文 | Sentry + Logflare | 错误日志自动注入 Agent 上下文 |
| 实时信息 | Playwright + Browser | 让 Agent 能浏览文档和 API 参考 |

**Cursor Rules 示例**（立即可用）：
```markdown
# .cursorrules

## 项目架构
- 使用 Clean Architecture，分层：API → Service → Repository → Model
- 所有数据库访问必须通过 Repository 层
- API 层只做输入验证和路由，不含业务逻辑

## 编码规范
- 使用 TypeScript 严格模式
- 所有公共函数必须有 JSDoc 注释
- 单元测试覆盖率必须 > 80%

## 上下文
- 项目文档在 /docs 目录
- API 文档运行 `npm run docs:serve` 查看
- 数据库 Schema 在 /prisma/schema.prisma
```

### Layer 2: 架构约束（可用方案）

**工具组合**：

| 约束类型 | 工具 | 配置 |
|----------|------|------|
| 依赖规则 | ESLint + `eslint-plugin-import` | 禁止循环依赖、强制分层导入 |
| 架构测试 | ArchUnit / ts-arch | 验证分层架构不被破坏 |
| 代码风格 | Prettier + ESLint | 统一代码格式 |
| 类型安全 | TypeScript 严格模式 | 编译时捕获类型错误 |

**ESLint 架构约束示例**：
```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // 禁止 repository 层直接导入 api 层
    'no-restricted-imports': ['error', {
      patterns: [{
        group: ['**/api/**'],
        message: 'Repository layer cannot depend on API layer'
      }]
    }],
    // 强制使用 Repository 模式
    'no-restricted-modules': ['error', {
      paths: [{
        name: 'prisma',
        message: 'Use repository layer instead of direct Prisma access'
      }]
    }]
  }
};
```

### Layer 3: 垃圾回收（可用方案）

**工具组合**：

| 任务 | 工具/方法 | 实现 |
|------|----------|------|
| 死代码检测 | `knip` / `ts-prune` | 自动检测未使用的导出 |
| 文档同步 | GitHub Action + LLM | 定期扫描代码变更，提醒更新文档 |
| 依赖更新 | Dependabot / Renovate | 自动创建依赖更新 PR |
| 代码质量 | SonarQube / Code Climate | 持续监控代码健康度 |

**GitHub Action 示例**（文档同步检查）：
```yaml
# .github/workflows/docs-sync.yml
name: Docs Sync Check
on:
  schedule:
    - cron: '0 9 * * *'  # 每天上午 9 点
  workflow_dispatch:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check for stale documentation
        run: |
          # 检查最近修改的文件对应的文档是否更新
          # 可集成 AI Agent 自动分析并创建提醒 Issue
          echo "Scanning for doc/code mismatches..."
```

---

## 我的尝试与踩坑

> 📌 *以下是我的第一手实践经验，非转述他人观点。*

### 尝试：用 Cursor + ESLint 构建最小 Harness

**目标**：让一个 React + TypeScript 项目在 Cursor Agent 模式下保持架构一致性。

**设置**：
1. 配置了 `.cursorrules` 文件，定义项目架构和规范
2. 配置了 ESLint 规则，禁止跨层导入
3. 使用 `knip` 检测死代码

**遇到的问题**：

| 问题 | 原因 | 解决/绕过 |
|------|------|----------|
| Cursor 不总是读取 `.cursorrules` | Agent 模式下的上下文窗口管理不透明 | 在 Prompt 中显式引用 |
| ESLint 规则被 Agent 绕过 | Agent 生成代码后没有自动运行 lint | 配置 pre-commit hook |
| "架构约束"变成枷锁 | 过度约束导致 Agent 反复陷入僵局 | 保留逃生舱口（`// eslint-disable-next-line`） |
| 上下文长度爆炸 | 大项目的 `CONTEXT.md` 超出模型窗口 | 分层文档，按需加载 |

### 关键发现

1. **确定性约束 > LLM 约束**
   - 让 Agent "检查自己的代码是否符合架构" 效果很差
   - 用 ESLint 强制约束，Agent 会在报错后调整（虽然有时会试图 disable 规则）

2. **上下文质量比上下文数量更重要**
   - 给 Agent 100 页的架构文档，它可能忽略关键信息
   - 给 Agent 10 条具体规则 + 3 个代码示例，效果更好

3. **Harness 需要逃生舱口**
   - 过度严格的约束会让 Agent 陷入反复修正的死循环
   - 保留人工介入的机制（如 `// harness-ignore` 注释）

### 一个实用的最小 Harness

```
my-project/
├── .cursorrules          # 给 AI 的上下文和约束
├── .eslintrc.js          # 确定性架构约束
├── docs/
│   ├── ARCHITECTURE.md   # 高层架构（供人读）
│   └── AI-CONTEXT.md     # AI 专用上下文（精炼版）
├── scripts/
│   └── harness-check.js  # 自定义检查脚本
└── .github/
    └── workflows/
        └── harness.yml   # CI 中运行 Harness 检查
```

---

## 结论：可控的 AI 自主

Harness Engineering 提供了一种思考框架：

**不是让 AI 完全自主，而是让 AI 在精心设计的约束下自主。**

### 核心原则

1. **Context is King**
   - 投资上下文工程
   - 质量 > 数量

2. **Constraints Enable Freedom**
   - 约束不是限制，而是保护
   - 但要保留逃生舱口

3. **Deterministic > LLM-based**
   - 用 Linter、类型系统、测试等确定性工具约束
   - 而不是依赖 Agent "自觉遵守"

4. **Iterative Improvement**
   - Harness 不是一次性构建
   - 当 AI 遇到困难时，改进 Harness

### 对开发者的意义

- **从编码到策展**：工作重心从写代码转向设计约束
- **从工具到系统**：关注整体系统而不仅是功能实现
- **从信任到验证**：不假设 AI 会做对，而是构建验证机制

### 最后思考

OpenAI 的实验提供了一个**思考起点**，而非**操作手册**。

> 💡 **我的观点**：Harness 的核心价值不在于它让你能用 AI 写 100 万行代码，而在于它迫使你回答一个基本问题——**什么样的约束能让 AI 生成的代码可维护？**

这个问题没有标准答案，但提出这个问题本身，就比盲目追求"AI 写更多代码"更有价值。

---

## 参考与延伸阅读

- [Harness Engineering: Leveraging Codex in an Agent-First World](https://openai.com/index/harness-engineering/) - OpenAI 官方文章（2025-03）
- [Harness Engineering - Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html) - Martin Fowler 的解读
- [Mitchell Hashimoto: My AI Adoption Journey](https://mitchellh.com/writing/my-ai-adoption-journey#step-5-engineer-the-harness) - Harness 概念来源
- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) - Anthropic 的 Agent 最佳实践

---

*本文包含对 Martin Fowler 和 OpenAI 文章的解读，以及我的个人实践经验和观点。如有错误，欢迎指正。*

*发布于 [postcodeengineering.com](/)*
