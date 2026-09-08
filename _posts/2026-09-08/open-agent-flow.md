---
title: "OpenAgentFlow：Agent 舰队的系统级安全边界"
date: 2026-09-08
categories: [AI, Agent, Security, Infrastructure]
---

> 论文：*OpenAgentFlow: Enabling System-Wide Safety Boundaries for Heterogeneous AI Agent Fleets*
> arXiv: [2609.00015](https://arxiv.org/abs/2609.00015)
> 发布时间：2026 年 8 月

## 企业 Agent 时代的安全困境

企业中同时运行的 AI Agent 数量和类型正在急剧增长：不同供应商、不同能力、不同权限的 Agent 并存——有的读邮件、有的写代码、有的操作数据库、有的控制部署流水线。

现有的安全措施处于"有用但碎片化"的状态：prompt 层面的 guardrail、API 网关、沙箱隔离，各自管一段，但没有统一的治理层能在异构 Agent 舰队上实施一致的安全策略。

**问题不是单个 Agent 不够安全，而是整个系统缺乏系统级的安全边界。**

## 核心设计：控制平面 / 动作平面分离

OpenAgentFlow 提出的架构核心是**控制平面与动作平面分离**：

- **共享动作提交控制点（shared action-commit control point）**：所有 Agent 的外部操作——GUI 操作、API 调用、文件写入——都必须通过这个统一"安全闸门"，在执行前被拦截、审查、放行或拒绝。
- **策略可移植**：安全策略与具体 Agent 解耦，可以在异构舰队中统一应用，不依赖特定 Agent 框架。
- **审计日志可比**：不同 Agent 的行为日志被统一格式化，支持跨 Agent 的安全审计和事件溯源。

这个设计的本质是**把安全边界从 Agent 内部移到 Agent 外部**——不信任单个 Agent 的自我约束，而是用独立于 Agent 的基础设施层来强制执行策略。

## 为什么这是基础设施层的缺失拼图

现有的 Agent 安全讨论集中在：
- prompt injection 防护
- 工具调用的权限控制
- 沙箱隔离

这些都是单 Agent 视角。OpenAgentFlow 的贡献是把安全治理提升到**系统级**：当你的企业里有十几个不同来源的 Agent 同时运行，谁来保证它们不会越界？

这个视角转换的意义：从"让单个 Agent 更安全"到"让整个 Agent 生态系统可治理"。

## 实践意义

对于构建企业级 Agent 基础设施的团队：

1. **安全策略必须与 Agent 解耦**：策略不是 prompt 的一部分，而是独立执行的约束
2. **统一审计是合规前提**：跨 Agent 的安全审计需要统一格式的行为日志，不是各 Agent 自己记录
3. **动作控制点必须是强制的**：Agent 主动选择是否经过审查在工程上是不可靠的，必须是架构强制

OpenAgentFlow 不是又一个 Agent 框架——它是 Agent 基础设施层的架构提案，补的是生产环境的短板。

---

*基于用户提供摘要解读，arXiv PDF 暂未可获取。*
