---
layout: post
title: "Harness Engineering 解读：让 AI Agent 可控的工程实践"
date: 2026-03-18T18:00:00+08:00
permalink: /harness-engineering-martin-fowler/
tags: [AI-Native, Agent, Harness, Martin-Fowler, Engineering]
author: Aaron
series: AI-Native Engineering
---

> **TL;DR**
> 
> OpenAI 团队用 5 个月时间、零手写代码，构建了一个超过 100 万行代码的真实产品。他们的秘密武器是 "Harness"——一套约束 AI Agent 的工具和实践。Martin Fowler 深度解读了这个案例，提出了 Harness Engineering 的概念：通过上下文工程、架构约束和"垃圾回收"机制，让 AI 生成的代码可维护、可信赖。

---

## 📋 本文结构

1. [什么是 Harness？](#什么是-harness)
2. [OpenAI 的百万行代码实验](#openai-的百万行代码实验)
3. [Harness 的三层架构](#harness-的三层架构)
4. [从"生成 Anything"到"约束解空间"](#从生成-anything到约束解空间)
5. [Harness 会成为新的服务模板吗？](#harness-会成为新的服务模板吗)
6. [技术栈收敛的趋势](#技术栈收敛的趋势)
7. [实践建议：构建你的第一个 Harness](#实践建议构建你的第一个-harness)
8. [结论：可控的 AI 自主](#结论可控的-ai-自主)

---

## 什么是 Harness？

**Harness** 原意是"马具"——用来控制和引导马匹的工具。

在 AI 工程中，Harness 指的是：**让 AI Agent 保持可控的工具和实践集合**。

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

## OpenAI 的百万行代码实验

### 实验设置

**约束条件**：
- 零手写代码（"no manually typed code at all"）
- 使用 Codex Agent 开发
- 时间：5 个月
- 结果：超过 100 万行代码的真实产品

**关键洞察**：
> "当 Agent 遇到困难时，我们将其视为信号：识别缺失的内容——工具、护栏、文档——并通过让 Codex 自己编写修复程序将其反馈到仓库中。"

### 为什么能成功？

不是 Prompt 工程，而是 **Harness 工程**。

OpenAI 团队构建了一套系统来：
1. **提供上下文**（Context Engineering）
2. **约束架构**（Architectural Constraints）
3. **维护质量**（Garbage Collection）

---

## Harness 的三层架构

Martin Fowler 将 OpenAI 的实践归纳为三个层次：

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

**关键原则**：
> Context is king. The better the context, the better the AI's decisions.

### Layer 2: 架构约束

**核心问题**：如何防止 Agent 生成混乱的代码？

**混合方法**：
- **确定性约束**：自定义 Linter、结构测试（不可绕过）
- **LLM 约束**：让 Agent 自己检查架构合规性

**约束示例**：
```yaml
# 架构约束配置
architecture_constraints:
  - rule: "所有 API 调用必须通过 service layer"
    linter: custom_api_linter
    
  - rule: "数据库访问必须封装在 repository 中"
    test: structural_test_db_access
    
  - rule: "组件依赖必须遵循分层架构"
    agent_check: "检查 import 是否符合分层规则"
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

**类比**：
- 就像垃圾回收器自动管理内存
- Harness 自动维护代码健康

---

## 从"生成 Anything"到"约束解空间"

### 早期的错误假设

**AI 编码的初期愿景**：
- LLM 可以生成任何语言、任何模式的代码
- 无需约束，LLM 会自己搞定
- 无限的灵活性

### 现实的经验

OpenAI 的实验表明：
> 为了增加信任和可靠性，必须**约束解决方案空间**。

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

**未来的 Harness 模板**：
- 针对常见应用拓扑的预配置 Harness
- 包含：
  - 自定义 Linter
  - 结构测试
  - 基础上下文和知识文档
  - 上下文提供者（可观测性、浏览器等）

### 选择 Harness，而非选择技术栈

**Martin Fowler 的预测**：
> 开发者可能不再仔细选择每个库和框架，而是选择**适合目标应用拓扑的 Harness**。

**工作流程**：
1. 选择 Harness 模板（如"电商后端 Harness"）
2. 根据具体需求调整
3. 随时间演进

### 挑战：分叉和同步

**问题**：
- 团队 A 改进了 Harness
- 团队 B 也想用这些改进
- 但团队 B 已经做了很多定制

**类比**：
- 类似于今天服务模板的更新挑战
- 可能需要的解决方案：
  - 可插拔的 Harness 组件
  - 语义化版本管理
  - 自动化的 Harness 升级工具

---

## 技术栈收敛的趋势

### 当前：技术栈爆炸

- 前端：React、Vue、Svelte、Angular...
- 后端：Node、Python、Go、Rust...
- 数据库：PostgreSQL、MongoDB、Redis...
- 每个团队都有自己的偏好

### 未来：Harness 驱动的收敛

**驱动力**：

1. **Agent 友好性优先**
   - 人类开发者口味的重要性下降
   - "Agent 能理解和生成"成为关键标准
   - 框架的 AI 友好性比语法糖更重要

2. **Harness 生态系统的网络效应**
   - 好的 Harness 吸引更多用户
   - 更多用户贡献改进
   - 形成正反馈循环

3. **效率压倒偏好**
   - 小效率和怪癖不再重要
   - 因为开发者不直接处理这些细节
   - 选择标准：Harness 质量 > 个人喜好

**预测**：
> 我们可能会看到技术栈收敛到少数几个有高质量 Harness 支持的选项。

---

## 实践建议：构建你的第一个 Harness

### 第一步：识别关键约束

**问自己**：
- 我的项目最重要的是什么？（性能？安全？可维护性？）
- 什么错误是最不能容忍的？
- 什么样的代码结构会让未来的维护更容易？

### 第二步：从简单开始

**最小可行 Harness**：
```
项目根目录
├── .harness/
│   ├── rules/           # 规则文件
│   ├── context/         # 上下文文档
│   └── agents/          # 专用 Agent 配置
├── src/
└── tests/
```

### 第三步：逐步增强

**阶段 1**：基本 Linter 和测试
**阶段 2**：上下文文档和示例
**阶段 3**：自动化质量检查
**阶段 4**：自主修复 Agent

### 示例：最小 Harness

```yaml
# .harness/config.yaml
name: "My Project Harness"
version: "1.0.0"

# 架构约束
architecture:
  pattern: "layered"
  layers:
    - name: "api"
      allowed_dependencies: ["service"]
    - name: "service"  
      allowed_dependencies: ["repository"]
    - name: "repository"
      allowed_dependencies: ["model"]

# 质量规则
quality_rules:
  - name: "test_coverage"
    threshold: 80%
  
  - name: "documentation"
    required: ["api", "service"]

# 上下文
context:
  knowledge_base: ".harness/context/knowledge.md"
  dynamic_sources:
    - type: "observability"
      endpoint: "..."
```

---

## 结论：可控的 AI 自主

Harness Engineering 代表了一种新的工程范式：

**不是让 AI 完全自主，而是让 AI 在精心设计的约束下自主。**

### 核心原则

1. **Context is King**
   - 投资上下文工程
   - 让 AI 知道它需要知道的一切

2. **Constraints Enable Freedom**
   - 约束不是限制，而是保护
   - 在边界内，AI 可以更自信地行动

3. **Automated Maintenance**
   - 把代码健康当作基础设施
   - 让 Agent 自动对抗腐烂

4. **Iterative Improvement**
   - Harness 不是一次性构建
   - 当 AI 遇到困难时，改进 Harness

### 对开发者的意义

- **从编码到策展**：工作重心从写代码转向设计约束
- **从工具到系统**：关注整体系统而不仅是功能实现
- **从个体到团队**：Harness 是团队协作的基础设施

### 最后思考

OpenAI 的百万行代码实验证明了一点：

> AI 可以构建大规模、可维护的软件系统——但前提是我们构建了正确的 Harness。

这不是 AI 取代开发者的故事，而是**开发者角色进化**的故事。

Harness Engineer 可能成为新的专业角色——专门设计和维护让 AI 高效工作的系统。

---

## 参考与延伸阅读

- [Harness Engineering: Leveraging Codex in an Agent-First World](https://openai.com/index/harness-engineering/) - OpenAI
- [Harness Engineering - Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html) - 本文解读来源
- [Mitchell Hashimoto: My AI Adoption Journey](https://mitchellh.com/writing/my-ai-adoption-journey#step-5-engineer-the-harness) - Harness 概念来源
- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) - Anthropic

---

*本文基于 Martin Fowler 对 OpenAI Harness Engineering 文章的深度解读。*

*发布于 [postcodeengineering.com](/)*
