---
layout: post
title: "Context Engineering 解读：让 AI 看到该看到的东西"
date: 2026-03-18T19:00:00+08:00
permalink: /context-engineering-coding-agents-martin-fowler/
tags: [AI-Native, Context, Agent, Martin-Fowler, Engineering]
author: Aaron
series: AI-Native Engineering
---

> **TL;DR**
> 
> Context Engineering（上下文工程）正在成为 AI 编程助手的核心竞争力。Claude Code 正在引领这场创新，但其他工具也在快速跟进。Martin Fowler 系统性地梳理了上下文工程的现状：从可复用 Prompts 到 Context Interfaces（工具、MCP、Skills），再到谁来决定加载上下文（LLM vs 人类 vs Agent 软件）。核心原则：给模型恰到好处的上下文——不多不少。

---

## 📋 本文结构

1. [什么是 Context Engineering？](#什么是-context-engineering)
2. [上下文的三大类别](#上下文的三大类别)
3. [Context Interfaces：让模型获取更多信息的通道](#context-interfaces让模型获取更多信息的通道)
4. [谁来决定加载上下文？](#谁来决定加载上下文)
5. [保持上下文精简的艺术](#保持上下文精简的艺术)
6. [Claude Code 的上下文创新](#claude-code-的上下文创新)
7. [实践建议：构建有效的上下文策略](#实践建议构建有效的上下文策略)
8. [结论：Context is King](#结论context-is-king)

---

## 什么是 Context Engineering？

### 简单定义

**Bharani Subramaniam**（ThoughtWorks）的定义：
> "Context engineering is curating what the model sees so that you get a better result."
> 
> 上下文工程是精心策划模型看到的内容，以获得更好的结果。

### 为什么重要？

AI 编程助手的上下文配置选项在过去几个月**爆炸式增长**。

**Claude Code** 正在引领这场创新，但其他工具（Cursor、GitHub Copilot、Windsurf 等）也在快速跟进。

**对于开发者而言**：
- 强大的上下文工程正在成为开发体验的核心部分
- 会配置上下文的开发者 > 不会配置的开发者
- Context Engineering 能力可能成为新的竞争力

---

## 上下文的三大类别

### 1. 可复用 Prompts（Reusable Prompts）

**基础形式**：Markdown 文件中的 Prompts

**两大意图类别**：

| 类型 | 目的 | 示例 |
|------|------|------|
| **Instructions（指令）** | 告诉 Agent 做什么 | "按照以下方式编写 E2E 测试：..." |
| **Guidance（指导）** | 一般性约定和规范 | "始终编写相互独立的测试" |

**区别**：
- Instructions：具体任务导向
- Guidance：通用规则导向

**实践中**：两者往往混合使用

### 2. 代码库作为上下文

**最基础也最强大的上下文**：当前工作区的文件

**关键反思**：
> 你的现有代码作为上下文的质量如何？

这本质上是在问：**你的代码库是否具有 AI 友好的设计？**

**AI 友好代码的特征**：
- 清晰的模块边界
- 一致的命名规范
- 良好的文件组织
- 充足的注释（但不是冗余）
- 明确的接口定义

### 3. Context Interfaces（上下文接口）

**定义**：描述 LLM 如何获取更多上下文的机制

**三种主要形式**：

```
┌─────────────────────────────────────────┐
│         Context Interfaces              │
├─────────────────────────────────────────┤
│  1. Tools（内置工具）                    │
│     - Bash 命令                         │
│     - 文件搜索                          │
│     - 代码分析                          │
├─────────────────────────────────────────┤
│  2. MCP Servers（模型上下文协议）        │
│     - 自定义程序/脚本                    │
│     - 访问数据源                         │
│     - 执行特定动作                       │
├─────────────────────────────────────────┤
│  3. Skills（技能）                       │
│     - 按需加载的资源                     │
│     - 补充说明文档                       │
│     - 特定领域脚本                       │
└─────────────────────────────────────────┘
```

---

## Context Interfaces：让模型获取更多信息的通道

### Tools：内置能力

**典型工具**：
- `bash`：执行命令
- `read_file`：读取文件
- `search_files`：搜索代码
- `view_directory`：查看目录结构

**特点**：
- 由 Agent 软件提供
- 模型可以直接调用
- 确定性行为

### MCP Servers：自定义扩展

**MCP（Model Context Protocol）**：

由 Anthropic 推出的开放协议，允许：
- 自定义程序暴露数据和动作给 AI
- 可以在本地或远程运行
- 标准化接口

**使用场景**：
```yaml
# MCP Server 示例
mcp_servers:
  - name: "company-database"
    description: "访问公司内部数据库"
    endpoint: "localhost:3000"
    
  - name: "documentation-search"
    description: "搜索内部文档"
    endpoint: "https://docs.internal.com/mcp"
```

**模型使用方式**：
```
用户：查询上个月的销售数据
Agent：我需要访问数据库
    ↓
调用 MCP Server "company-database"
    ↓
执行查询，返回结果
    ↓
生成回答
```

### Skills：按需加载

**最新进入上下文工程的概念**

**定义**：描述额外资源、说明、文档、脚本等，LLM 可以在认为相关时**按需加载**。

**与 Tools/MCP 的区别**：

| 维度 | Tools/MCP | Skills |
|------|-----------|--------|
| **触发** | 模型决定调用 | 模型决定加载 |
| **内容** | 数据/动作 | 知识/说明 |
| **形式** | API 接口 | 文档/代码片段 |

**示例**：
```yaml
# Skill 定义
skills:
  - name: "react-best-practices"
    trigger: "当处理 React 代码时"
    content: ".skills/react-patterns.md"
    
  - name: "testing-strategies"
    trigger: "当编写测试时"
    content: ".skills/testing-guide.md"
```

---

## 谁来决定加载上下文？

**三种决策模式**：

### 模式 1：LLM 决定

**特点**：
- 允许 Agent 无人监督运行
- 存在不确定性（LLM 可能不会在你期望时加载）
- **示例**：Skills

**优点**：
- 自动化程度高
- 可以处理开放式任务

**风险**：
- 非确定性行为
- 可能遗漏重要上下文

### 模式 2：人类决定

**特点**：
- 人类显式调用上下文
- 给予完全控制
- 降低自动化程度
- **示例**：Slash commands（如 `/docs`）

**优点**：
- 确定性
- 精确控制

**缺点**：
- 需要人工干预
- 不适合大规模自动化

### 模式 3：Agent 软件决定

**特点**：
- 由 Agent 软件在确定性时间点触发
- 基于预定义规则
- **示例**：Claude Code Hooks

**Claude Code Hooks 示例**：
```yaml
hooks:
  - trigger: "before_file_edit"
    action: "load_related_tests"
    
  - trigger: "after_git_commit"
    action: "update_changelog"
    
  - trigger: "on_error"
    action: "search_similar_issues"
```

**最佳实践**：
- 关键路径用确定性触发（Hooks）
- 灵活场景用 LLM 决定（Skills）
- 需要精确控制时用人类决定（Commands）

---

## 保持上下文精简的艺术

### 核心挑战

**目标**：平衡上下文量——**不多不少**

**为什么重要**：
1. **效果下降**：Agent 在太多上下文时表现变差
2. **成本因素**：Token 越多，成本越高
3. **速度影响**：处理更多上下文需要更长时间

### 策略：分层上下文

```
Tier 1: 始终加载（轻量级）
├── 项目基础信息
├── 编码规范
└── 常用模式

Tier 2: 按需加载（中等）
├── 相关文件
├── 领域特定知识
└── 工具文档

Tier 3: 实时获取（重量级）
├── 数据库查询
├── 外部 API 调用
└── 完整文档搜索
```

### 具体技术

**1. 智能文件选择**

不是加载整个代码库：
```python
# 不好的做法
load_all_files()

# 好的做法
relevant_files = find_related_files(current_file)
load_files(relevant_files)
```

**2. 摘要 vs 完整内容**

```python
# 大文件：提供摘要 + 关键部分
if file_size > 1000_lines:
    provide_summary(file)
    provide_key_sections(file, relevant_parts)
else:
    provide_full_content(file)
```

**3. 缓存常用上下文**

```python
# 缓存频繁使用的上下文
cache = {
    "project_structure": get_project_tree(),
    "coding_standards": load_standards(),
    "common_patterns": load_patterns()
}
```

---

## Claude Code 的上下文创新

### 当前领先的功能

**1. 自动上下文发现**

Claude Code 能够：
- 自动识别相关文件
- 理解代码依赖关系
- 推断项目结构

**2. 动态上下文加载**

```
用户开始编辑文件 A
    ↓
Claude Code 自动：
- 加载文件 A
- 查找文件 A 的依赖
- 查找相关测试
- 查找相关配置
    ↓
提供全面的上下文支持
```

**3. 上下文压缩**

- 大文件自动摘要
- 保留关键信息
- 去除冗余内容

### 其他工具的跟进

| 工具 | 上下文特性 |
|------|-----------|
| **Cursor** | Rules、.cursorrules、Composer |
| **GitHub Copilot** | Copilot Chat、Workspace 上下文 |
| **Windsurf** | Cascade、实时上下文 |
| **Zed** | Assistant Panel、上下文感知 |

**趋势**：所有主流工具都在加强上下文工程能力。

---

## 实践建议：构建有效的上下文策略

### 第一步：盘点你的上下文

**问自己**：
- 我的项目有哪些关键知识？
- 哪些文档经常被查阅？
- 哪些规则经常被违反？
- 哪些信息缺失会导致 AI 犯错？

### 第二步：设计分层策略

**基础层**（始终可用）：
```markdown
# .cursorrules / claude.md

## 项目概述
- 技术栈：React + TypeScript + Node.js
- 架构：Clean Architecture
- 测试策略：TDD，覆盖率 > 80%

## 编码规范
- 使用函数组件而非类组件
- 所有 API 调用必须通过 service layer
- 错误处理必须使用统一模式
```

**领域层**（按需加载）：
```markdown
# .skills/authentication.md

## 认证模块知识

### 使用的库
- jwt-decode: Token 解析
- bcrypt: 密码哈希

### 关键文件
- src/auth/service.ts: 认证逻辑
- src/auth/guard.ts: 路由守卫

### 常见模式
...
```

### 第三步：建立反馈循环

```
观察 AI 的表现
    ↓
识别失败案例
    ↓
分析：缺少什么上下文？
    ↓
添加/改进上下文
    ↓
测试验证
    ↓
回到第一步
```

### 第四步：测量和优化

**关键指标**：
- AI 生成代码的接受率
- 修改次数
- 引入的 bug 数量
- 开发速度

---

## 结论：Context is King

Context Engineering 代表了 AI 辅助开发的新范式：

**不是更好的模型，而是更好的上下文。**

### 核心原则

1. **Curate, Don't Dump**
   - 精心策划上下文
   - 不要无差别地倾倒信息

2. **Right Context, Right Time**
   - 在正确的时间提供正确的上下文
   - 分层策略是关键

3. **Continuous Improvement**
   - 上下文策略需要持续迭代
   - 基于实际表现优化

4. **Hybrid Decision Making**
   - 结合 LLM、人类和确定性规则
   - 不同场景用不同策略

### 对开发者的启示

- **新技能**：Context Engineering 成为核心竞争力
- **新角色**：可能出现专门的 Context Engineer
- **新思维**：从写代码转向策划上下文

### 最后思考

模型能力正在快速收敛（GPT-4、Claude、Gemini 差距缩小），**上下文质量将成为差异化竞争的关键**。

那些掌握 Context Engineering 的开发者，将比那些仅依赖模型能力的开发者有巨大优势。

**投资你的上下文，就是投资你的 AI 竞争力。**

---

## 参考与延伸阅读

- [Context Engineering for Coding Agents](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html) - Martin Fowler
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/agents/claude-code) - Anthropic
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP 官方文档
- [AI-Friendly Code Design](https://www.thoughtworks.com/radar/techniques/ai-friendly-code-design) - ThoughtWorks Tech Radar

---

*本文基于 Martin Fowler 关于 Context Engineering 的深度文章解读。*

*发布于 [postcodeengineering.com](/)*
