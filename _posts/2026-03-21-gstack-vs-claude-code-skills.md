---
layout: post
title: "\"gstack vs Claude Code Skills：AI编程的两种哲学\""
date: 2026-03-21T10:00:00+08:00
permalink: /gstack-vs-claude-code-skills/
tags: [AI-Native, Claude-Code, gstack, Skills, YC, Anthropic]
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
> 
> YC CEO Garry Tan 开源的 gstack 和 Anthropic 官方的 Skills 看似代表 AI 编程的两种哲学（**流程治理** vs **能力扩展**），但深入分析发现：gstack 本身就是基于 Skills 机制实现的预置流程包。两者的关系不是对立，而是层次——Skills 是底层能力扩展机制，gstack 是基于该机制构建的开发流程工具。对于已经在使用 Claude Code 的开发者，建议：用 gstack 快速建立流程，用 Skills 扩展定制能力。
> 
> ⚠️ **读者定位**：本文假设你已经了解 Claude Code 的基本使用方式。如果你还没用过 Claude Code，建议先阅读 [Claude Code 官方文档](https://docs.anthropic.com/en/docs/agents/claude-code)。

---

## 背景：两个人，一个机制

### Garry Tan 与 gstack

Garry Tan（YC CEO）在 2025 年底开源了 gstack——一套基于 Claude Code 的开发流程工具。

> 📌 **关于"60万行代码"**：Tan 声称过去 60 天写了 60 万行"生产代码"。这个数据存在争议（如何定义"写"？是否包含生成代码？），本文不将其作为论证依据。gstack 的价值在于其流程设计，而非产量数据。

### Thariq 与 Skills

Thariq Nazeer（Anthropic 工程师，Claude Code 核心开发者）在 X 上分享了 Anthropic 内部使用 Skills 的经验。

他的核心观察：**"Skill 不只是 Markdown 文件，而是包含脚本、资产、数据的完整文件夹。"**

### 一个关键事实

初看之下，gstack 和 Skills 似乎是两个独立的项目，代表不同的方法论。但当我们检查 gstack 的代码结构时，发现了一个重要事实：

**gstack 本身就是用 Skills 机制实现的。**

这个发现改变了整篇文章的 premise——我们不是在面对"两种哲学"，而是在面对"一个机制的不同应用层次"。

---

## gstack：预置的开发流程

### 核心理念

gstack 将 Claude Code 变成一个**虚拟工程团队**，通过 15 个 "/命令" 把开发流程拆成 7 个阶段：

| 阶段 | 命令 | 角色定位 | 核心功能 |
|------|------|----------|----------|
| **Think** | /office-hours | YC Office Hours | 6个强制问题重新定义产品 |
| **Think** | /plan-ceo-review | CEO/创始人 | 10节审查重新思考问题 |
| **Plan** | /plan-eng-review | 工程经理 | ASCII 图、数据流、边界情况 |
| **Plan** | /plan-design-review | 高级设计师 | 0-10 分评级每个设计维度 |
| **Review** | /review | 高级工程师 | 发现 CI 通过但生产爆炸的 Bug |
| **Test** | /qa | QA 主管 | 真实浏览器点击测试、修复 Bug |
| **Ship** | /ship | 发布工程师 | 同步、测试、审计、推送、开 PR |

### 关键特性

**1. 流程连贯性**
**2. 安全护栏**
- /careful：破坏性命令前警告
- /freeze：限制编辑到单个目录
- /guard：/careful + /freeze

**3. 浏览器能力**
- /browse：真实 Chromium 浏览器
- /setup-browser-cookies：导入真实浏览器 cookies

---

## Skills：底层的能力扩展机制

### 核心理念

Skills 是 Claude Code 的**能力扩展机制**。一个 Skill 是一个文件夹，包含：
- 脚本（scripts/）
- 资产（assets/）
- 数据（data/）
- 配置（config.json）
- Hooks（动态拦截）

### 9 种 Skill 类型

| 类型 | 功能定位 | 典型示例 |
|------|----------|----------|
| **Library & API Reference** | 库和 API 参考 | billing-lib、内部平台 CLI |
| **Product Verification** | 产品验证测试 | signup-flow-driver、checkout-verifier |
| **Data Fetching & Analysis** | 数据获取与分析 | funnel-query、grafana |
| **Business Process Automation** | 业务流程自动化 | standup-post、create-ticket |
| **Code Scaffolding** | 代码脚手架 | new-service、new-migration |
| **Code Quality & Review** | 代码质量审查 | adversarial-review、code-style |
| **CI/CD & Deployment** | CI/CD 与部署 | babysit-pr、deploy-service |
| **Runbooks** | 运维手册 | service-debugging、oncall-runner |
| **Infrastructure Operations** | 基础设施操作 | resource-orphans、cost-investigation |

### 触发机制

与 gstack 的显式命令不同，Skills 通常通过**自然语言描述**触发：

### 关键特性

**1. 渐进式披露**
**2. Hooks 机制**
- PreToolUse：工具使用前拦截
- /careful：阻止 rm -rf、DROP TABLE
- /freeze：限制编辑范围

---

## 核心发现：gstack 是 Skills 的一种实现

### 证据：gstack 的文件结构

当我们检查 gstack 的安装目录，发现它完全符合 Skills 的规范：

<object data="/assets/images/2026-03-21-gstack-vs-claude-code-skills-01-tree.svg" type="image/svg+xml" width="100%"></object>
Skills（底层机制）
    ↓
gstack（基于 Skills 的应用层实现）
    ↓
15 个开发流程命令
**Step 2: 架构设计（gstack）**
**Step 3: 代码生成（Claude Code 原生）**
- 基于架构设计生成代码

**Step 4: 质量检查（gstack + 自定义 Skill）**
**Step 5: 测试验证（gstack）**
**Step 6: 发布（gstack + 自定义 Skill）**
### 架构图

### 给开发者的具体建议

**现在应该做什么**：

1. **如果你刚开始使用 Claude Code**
   - 先安装 gstack，快速建立开发流程
   - 在使用过程中记录哪些环节需要定制
   - 逐步添加自定义 Skills

2. **如果你已经在使用 gstack**
   - 学习其 Skills 结构（`~/.claude/skills/gstack/`）
   - 尝试修改或扩展其中的某个命令
   - 考虑把团队特定的流程封装成 Skills

3. **如果你是平台工程团队**
   - 建立内部 Skills 仓库
   - 封装内部的工具、库、流程
   - 参考 gstack 设计团队特定的流程工具

4. **如果你是技能开发者**
   - 关注 Skills 机制的演进
   - 考虑开源你的 Skills（类似于开源 VS Code 插件）
   - 参与可能的官方 Skills 市场

---

## 结尾
### 核心洞察的修正

本文开头的 TL;DR 说"两种哲学"，但经过分析，更准确的说法是：

**Skills 是 Claude Code 的能力扩展机制，gstack 是基于该机制构建的开发流程工具。**

两者的关系不是"流程 vs 能力"的对立，而是"机制 vs 应用"的层次。

### 关键结论

| 问题 | 答案 |
|------|------|
| gstack 和 Skills 是竞争关系吗？ | 不是。gstack 是用 Skills 实现的 |
| 我应该用哪个？ | 两者都用——gstack 作为起点，Skills 用于扩展 |
| 可以自建类似 gstack 的工具吗？ | 可以。学习 gstack 的 Skills 结构，按需定制 |
| 未来会如何演进？ | Skills 成为底层标准，上层出现多样化的流程工具 |

### 比喻修正

原比喻（需要修正）：
- ❌ "gstack 是乐谱，Skills 是乐器"（暗示两者平行）

更准确的理解：
- ✅ "Skills 是乐器制造技术，gstack 是用该技术制造的一把特定乐器"
- ✅ "Skills 是编程语言特性，gstack 是用该特性编写的框架"

### 最终建议

1. **从 gstack 开始**：如果你还没有成熟的 Claude Code 工作流，gstack 是一个很好的起点。

2. **理解 Skills 机制**：学习 gstack 的 Skills 结构，这会让你明白如何扩展和定制。

3. **逐步定制**：根据你的实际需求，添加自定义 Skills，修改或替换 gstack 的某些命令。

4. **关注生态演进**：Skills 机制还在发展，未来可能出现官方市场和更多工具。

这才是 AI-Native 软件工程的完整图景——不是选择一套固定的工具，而是理解底层机制，构建适合自己的工作流。

---

## 参考与延伸阅读

- [gstack GitHub](https://github.com/garrytan/gstack) - Garry Tan 的开源工具集
- [Claude Code Skills](https://code.claude.com/docs/en/skills) - Anthropic 官方文档
- [Lessons from Building Claude Code: How We Use Skills](https://x.com/trq212/status/2033949937936085378) - Thariq 的分享

---

*本文基于 gstack 开源代码和 Anthropic 官方文档深度分析。核心发现（gstack 是 Skills 的一种实现）可通过检查 `~/.claude/skills/gstack/` 目录结构验证。*

*发布于 [postcodeengineering.com](/)*
