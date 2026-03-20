---
layout: post
title: "gstack vs Claude Code Skills：AI编程的两种哲学"
date: 2026-03-21T10:00:00+08:00
permalink: /gstack-vs-claude-code-skills/
tags: [AI-Native, Claude-Code, gstack, Skills, YC, Anthropic]
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
> 
> YC CEO Garry Tan 开源的 gstack 和 Anthropic 官方的 Skills 代表了 AI 编程的两种哲学：**流程治理** vs **能力扩展**。gstack 通过 15 个 "/命令" 将开发流程拆成 7 个阶段，强调角色分工和流程管控；Skills 通过 9 种类型扩展 Agent 能力边界，强调工具集成和上下文工程。两者并非对立，而是互补——gstack 是"如何组织开发"，Skills 是"如何扩展能力"。

---

## 📋 本文结构

1. [背景：两位关键人物](#背景两位关键人物)
2. [gstack：YC 的流程治理哲学](#gstackyc-的流程治理哲学)
3. [Claude Code Skills：Anthropic 的能力扩展哲学](#claude-code-skillsanthropic-的能力扩展哲学)
4. [核心对比：流程 vs 能力](#核心对比流程-vs-能力)
5. [使用场景：谁适合什么](#使用场景谁适合什么)
6. [互补性：1+1>2](#互补性11>2)
7. [未来趋势：融合还是分化](#未来趋势融合还是分化)

---

## 背景：两位关键人物

### Garry Tan：YC CEO 的 60 万行代码实验

**背景**：
- Y Combinator 总裁兼 CEO
- Palantir 早期设计/logo 设计者
- Posterous 联合创始人（卖给 Twitter）
- Bookface（YC 内部社交网络）建造者

**惊人数据**（过去 60 天）：
- 写了 **600,000+ 行**生产代码
- 每天 **10,000-20,000 行**可用代码
- 同时履行 YC CEO 的全部职责

**核心洞察**：
> "2026 年——我们正处于某种真实事物的黎明——一个人以过去需要 20 人团队的规模交付。"

### Thariq：Anthropic 工程师的 Skill 实践

**背景**：
- Anthropic 工程师
- Claude Code 核心开发者
- 内部使用数百个 Skills

**核心洞察**：
> "Skill 不只是 Markdown 文件，而是包含脚本、资产、数据的完整文件夹。"

---

## gstack：YC 的流程治理哲学

### 核心理念

**gstack 是一个流程，而不是工具的集合。**

将 Claude Code 变成一个**虚拟工程团队**：
- CEO（重新思考产品）
- 工程经理（锁定架构）
- 设计师（捕捉 AI slop）
- 偏执的审查员（发现生产 Bug）
- QA 主管（打开真实浏览器测试）
- 发布工程师（发布 PR）

### 15 个 "/命令" 与 7 个阶段

```
Think → Plan → Build → Review → Test → Ship → Reflect
```

| 阶段 | 命令 | 角色 | 功能 |
|------|------|------|------|
| **Think** | /office-hours | YC Office Hours | 6个强制问题重新定义产品 |
| **Think** | /plan-ceo-review | CEO/创始人 | 10节审查重新思考问题 |
| **Plan** | /plan-eng-review | 工程经理 | ASCII 图、数据流、边界情况 |
| **Plan** | /plan-design-review | 高级设计师 | 0-10 分评级每个设计维度 |
| **Plan** | /design-consultation | 设计合伙人 | 从零构建完整设计系统 |
| **Build** | （Claude Code 原生）| - | 代码生成 |
| **Review** | /review | 高级工程师 | 发现 CI 通过但生产爆炸的 Bug |
| **Review** | /investigate | 调试器 | 系统性根因调试 |
| **Review** | /design-review | 会编码的设计师 | 审计并修复设计问题 |
| **Review** | /codex | 第二意见 | OpenAI Codex CLI 独立审查 |
| **Test** | /qa | QA 主管 | 真实浏览器点击测试、修复 Bug |
| **Test** | /qa-only | QA 报告员 | 纯报告不修改 |
| **Ship** | /ship | 发布工程师 | 同步、测试、审计、推送、开 PR |
| **Ship** | /document-release | 技术写手 | 更新所有项目文档 |
| **Reflect** | /retro | 工程经理 | 团队感知的每周回顾 |

### 关键特性

**1. 流程连贯性**
```
/office-hours 写的文档 → /plan-ceo-review 读取
/plan-eng-review 写的测试计划 → /qa 读取
/review 发现的 Bug → /ship 验证修复
```

**2. 并行 Sprint 能力**
- 一个人同时运行 **10-15 个并行 Sprint**
- 不同功能、不同分支、不同 Agent
- 30 分钟完成一个 Sprint

**3. 安全护栏**
- /careful：破坏性命令前警告
- /freeze：限制编辑到单个目录
- /guard：/careful + /freeze

**4. 浏览器能力**
- /browse：真实 Chromium 浏览器
- /setup-browser-cookies：导入真实浏览器 cookies
- 100ms 每命令

---

## Claude Code Skills：Anthropic 的能力扩展哲学

### 核心理念

**Skill 是一个文件夹，而不仅仅是 Markdown 文件。**

包含：
- 脚本（scripts/）
- 资产（assets/）
- 数据（data/）
- 配置（config.json）
- Hooks（动态拦截）

### 9 种 Skill 类型

| 类型 | 功能 | 示例 |
|------|------|------|
| **Library & API Reference** | 库和 API 参考 | billing-lib、内部平台 CLI |
| **Product Verification** | 产品验证测试 | signup-flow-driver、checkout-verifier |
| **Data Fetching & Analysis** | 数据获取与分析 | funnel-query、grafana |
| **Business Process Automation** | 业务流程自动化 | standup-post、create-ticket |
| **Code Scaffolding** | 代码脚手架 | new-service、new-migration |
| **Code Quality & Review** | 代码质量审查 | adversarial-review、code-style |
| **CI/CD & Deployment** | CI/CD 与部署 | babysit-pr、deploy-service |
| **Runbooks** | 运维手册 | service-debugging、oncall-runner |
| **Infrastructure Operations** | 基础设施操作 | resource-orphans、cost-investigation |

### 关键特性

**1. 渐进式披露**
```
SKILL.md（概述）
    ↓
references/api.md（详细 API）
references/examples.md（示例）
scripts/utils.py（工具函数）
```

**2. 记忆能力**
- 在 Skill 目录存储数据
- 支持 SQLite、JSON、日志文件
- `${CLAUDE_PLUGIN_DATA}` 稳定存储

**3. Hooks 机制**
- PreToolUse：工具使用前拦截
- /careful：阻止 rm -rf、DROP TABLE
- /freeze：限制编辑范围

**4. 分发与共享**
- 代码仓库（.claude/skills/）
- 插件市场（未来）
- 团队内共享

---

## 核心对比：流程 vs 能力

### 对比维度

| 维度 | gstack | Claude Code Skills |
|------|--------|-------------------|
| **核心哲学** | 流程治理 | 能力扩展 |
| **组织方式** | 7 阶段开发流程 | 9 种能力类型 |
| **交互方式** | 15 个 "/命令" | Skill 描述触发 |
| **主要用户** | 个人开发者、创始人 | 团队、企业 |
| **设计目标** | 个人效率最大化 | 团队协作标准化 |
| **控制能力** | 强（流程锁定） | 中（能力导向） |
| **扩展能力** | 中（脚本支持） | 强（完整文件夹） |

### 流程 vs 能力的本质差异

**gstack 问的是**：
> "我们现在处于开发流程的哪个阶段？"
> "这个角色应该做什么？"
> "下一步是什么？"

**Skills 问的是**：
> "我们需要什么能力？"
> "这个工具能做什么？"
> "如何扩展 Agent 的能力边界？"

### 代码示例对比

**gstack 风格**（流程导向）：
```bash
# 第1步：重新定义问题
/office-hours
"我想构建一个每日简报应用"
→ "你实际上是在构建一个个人 AI 幕僚长"

# 第2步：CEO审查
/plan-ceo-review
→ 10节审查，挑战范围

# 第3步：工程审查
/plan-eng-review
→ ASCII图、数据流、测试矩阵

# 第4步：构建（Claude原生）

# 第5步：审查
/review
→ [AUTO-FIXED] 2个问题

# 第6步：QA
/qa https://staging.myapp.com
→ 打开真实浏览器，发现并修复Bug

# 第7步：发布
/ship
→ 测试：42 → 51，PR已创建
```

**Skills 风格**（能力导向）：
```python
# 发现可用的 Skill
skills = await client.discover_tools()
# [
#   {"name": "billing-lib", "description": "内部计费库"},
#   {"name": "deploy-service", "description": "部署服务"}
# ]

# 调用部署 Skill
await client.call_tool(
    "deploy-service",
    {"service": "api", "version": "v1.2.3"}
)

# QA Skill 自动运行测试
# 生成回归测试
# 验证修复
```

---

## 使用场景：谁适合什么

### 适合 gstack 的场景

**1. 个人开发者/创始人**
- 一个人需要完成 20 人团队的工作
- 需要严格的流程防止混乱
- 每天 10,000+ 行代码的产出目标

**2. 快速原型开发**
- 30 分钟完成一个 Sprint
- 10-15 个并行实验
- 快速验证想法

**3. 全栈项目**
- 需要产品、设计、工程、QA 全覆盖
- 没有专业分工的小团队

**4. YC 风格创业**
- 快速迭代、快速发布
- "先做再说"的文化
- 创始人亲自编码

### 适合 Skills 的场景

**1. 企业团队**
- 多人协作需要标准化
- 内部库和工具需要共享
- 安全和治理要求严格

**2. 专业分工**
- 有专门的 QA 团队
- 有平台工程团队
- 有运维团队

**3. 复杂系统**
- 微服务架构
- 多团队协作
- 需要标准化流程

**4. 长期维护**
- 代码库长期存在
- 需要可审计性
- 需要知识传承

---

## 互补性：1+1>2

### 如何结合使用

**理想架构**：
```
gstack（流程层）
    ├── /office-hours → 重新定义问题
    ├── /plan-eng-review → 架构设计
    └── /review → 代码审查
        ↓
Skills（能力层）
    ├── billing-lib Skill → 计费逻辑
    ├── deploy-service Skill → 部署
    └── qa-automation Skill → 测试
        ↓
Claude Code（执行层）
    └── 代码生成与执行
```

### Garry Tan 的 Skill 使用

实际上，**gstack 本身也是用 Skill 机制实现的**：

```bash
# gstack 安装位置
~/.claude/skills/gstack/

# 包含
├── SKILL.md          # 主文档
├── skills/           # 15个命令
│   ├── office-hours/
│   ├── review/
│   ├── qa/
│   └── ...
└── scripts/          # 支持脚本
```

**结论**：gstack 是 **Skills 的一个具体应用**——用 Skill 机制实现流程治理。

### 组合使用示例

**场景：构建新功能**

```bash
# Step 1: gstack 流程 - 重新定义问题
/office-hours
→ "你想构建 X，但实际上你需要 Y"

# Step 2: gstack 流程 - 架构设计
/plan-eng-review
→ 数据流图、API 设计、测试策略

# Step 3: Skills 能力 - 生成代码
# 调用 new-service Skill 生成脚手架
# 调用 frontend-design Skill 应用设计系统

# Step 4: Claude Code - 实现业务逻辑
# 原生代码生成

# Step 5: gstack 流程 - 审查
/review
→ 发现边界情况

# Step 6: Skills 能力 - 运行测试
# 调用 signup-flow-driver Skill 测试
# 调用 checkout-verifier Skill 验证

# Step 7: gstack 流程 - 发布
/ship
→ 部署、开 PR、更新文档
```

---

## 未来趋势：融合还是分化

### 两种可能的未来

**未来 A：融合**
- Anthropic 官方支持 gstack 式流程
- Skills 增加流程编排能力
- 一个统一的 Agent 框架

**未来 B：分化**
- gstack 成为 YC/创业生态的标准
- Skills 成为企业/团队的标准
- 两者各自发展，互不干扰

### 更可能的走向

**分层共存**：
```
应用层：gstack（流程）、其他工作流工具
    ↓
能力层：Skills（Anthropic）、Plugins（OpenAI）、Extensions（其他）
    ↓
模型层：Claude、GPT、Gemini 等
```

### 给开发者的建议

**现在应该做什么**：

1. **如果你是一个人快速开发**
   - 先用 gstack 建立流程
   - 逐步添加自定义 Skills

2. **如果你是团队协**
   - 建立团队 Skills 库
   - 参考 gstack 设计自己的流程

3. **如果你是平台工程**
   - 构建内部 Skills 市场
   - 整合 gstack 流程到 CI/CD

---

## 结论

### 核心洞察

**gstack 和 Skills 不是竞争关系，而是互补关系**：

- **gstack = 如何组织开发**（流程治理）
- **Skills = 如何扩展能力**（能力扩展）

**比喻**：
- gstack 是**乐谱**——规定了演奏的顺序和节奏
- Skills 是**乐器**——提供了演奏的能力
- Claude Code 是**演奏家**——执行具体的演奏

### 关键差异

| | gstack | Skills |
|--|--------|--------|
| **问题** | "我们现在该做什么？" | "我们能做什么？" |
| **答案** | 15 个命令，7 个阶段 | 9 种类型，无限扩展 |
| **价值** | 防止混乱，保证质量 | 扩展能力，标准化 |

### 最终建议

**不要二选一，要两者都用**：

1. 用 **gstack** 建立个人/团队的开发流程
2. 用 **Skills** 扩展团队的能力边界
3. 用 **Claude Code** 执行具体的代码生成

这才是 AI-Native 软件工程的完整图景。

---

## 参考与延伸阅读

- [gstack GitHub](https://github.com/garrytan/gstack) - Garry Tan 的开源工具集
- [Claude Code Skills](https://code.claude.com/docs/en/skills) - Anthropic 官方文档
- [Lessons from Building Claude Code: How We Use Skills](https://x.com/trq212/status/2033949937936085378) - Thariq 的分享

---

*本文基于 gstack 开源代码和 Anthropic 官方文档深度分析。*

*发布于 [postcodeengineering.com](/)*
