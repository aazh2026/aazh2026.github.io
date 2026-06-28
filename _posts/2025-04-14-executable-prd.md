---
layout: post
title: "AI时代PRD长什么样？——从文档到Executable Specification"
date: 2025-04-14T08:00:00+08:00
tags: [Executable PRD, 需求工程, AI-Native, 产品文档, 范式转移]
author: "@postcodeeng"
series: AI-Native软件工程

redirect_from:
  - /executable-prd/
---

# AI时代PRD长什么样？——从文档到Executable Specification

> *「2025年，产品经理Alice的PRD被AI直接编译成了可运行的代码。不是生成代码框架，是真正的业务逻辑、数据库Schema、API接口、前端页面。她的PRD不再是'给工程师看的文档'，是'产品的源代码'。这就是Executable Specification的时代。」*

---

## 传统PRD的困境

### PRD是什么？

**Product Requirements Document（产品需求文档）**，产品经理的核心产出，用来描述：
- 产品要解决什么问题
- 目标用户是谁
- 功能需求是什么
- 业务流程如何
- 验收标准怎样

### 传统PRD的典型结构

### 传统PRD的困境

**困境1：文档与实现的鸿沟**

**总周期：5-6周**

**问题**：自然语言的歧义性导致理解偏差。

**困境2：PRD的维护成本**

**困境3：PRD的不可执行性**

**困境4：AI时代的加速困境**

AI加速了代码生成，但需求定义的速度没有跟上。

---

## Executable Specification：新范式

### 什么是Executable Specification？

**Executable Specification（可执行规格说明）**：

一种结构化的、机器可读的、可直接编译为可运行代码的产品需求描述。

不是"给工程师看的文档"，是"产品的源代码"。

### Executable PRD vs 传统PRD

| 维度 | 传统PRD | Executable PRD |
|------|---------|----------------|
| 格式 | 自然语言文档 | 结构化代码/配置 |
| 读者 | 人类工程师 | 人类 + AI/机器 |
| 歧义性 | 高 | 低（结构化） |
| 可执行性 | 否 | 是 |
| 维护成本 | 高（多份文档） | 低（单一真相源） |
| 与代码关系 | 分离 | 一体 |

### Executable PRD的核心理念

**核心理念1：需求即代码**

**核心理念2：单一真相源**

**核心理念3：意图显式化**

---

## Executable PRD的技术实现

### 格式：结构化需求语言

**示例：用户下单功能**

### 编译：从PRD到可运行系统

**编译流程**：

{% figure center %}
<img src="/assets/images/2025-04-14-executable-prd-01-compilation-pipeline.png" alt="Executable PRD: Compilation Pipeline" style="width:100%;height:auto;">
*图 1：Executable PRD 编译流程——一份 YAML 规格说明通过 Spec Compiler 生成数据库 Schema、API 定义、业务逻辑、UI 组件、测试用例和文档，实现单一真相源到多份工件的高效转化。*
{% endfigure %}

{% figure center %}
<object data="/assets/images/2025-04-14-executable-prd-02-workflow.png" type="image/svg+xml" width="100%"></object>
*图 2：Executable PRD 工作流——结构化规格说明（YAML）通过 Spec Compiler 编译为 SQL Schema、OpenAPI 定义、业务逻辑、UI 组件、测试用例和文档，实现单一真相源。*
{% endfigure %}

### 编译示例

### 可执行性：PRD即测试

---

## Executable PRD的工作流程

### 新范式的工作流程

**周期：1-2天**（vs 传统5-6周）

### 各角色的转变

**产品经理**：
- **从**：写文档给工程师看
- **到**：写可执行的规格说明
- **技能**：结构化思维、业务规则建模

**工程师**：
- **从**：根据PRD写代码
- **到**：审查AI生成的代码，关注架构和边界情况
- **技能**：架构设计、代码审查、性能优化

**AI的角色**：
- **编译器**：将Executable PRD编译为代码
- **验证器**：自动测试和验证
- **助手**：解释规格、建议改进

---

## 实战：传统PRD vs Executable PRD

### 场景：优惠券功能

### 传统PRD

**问题**：
- "使用条件"具体是什么？
- 满减规则如何计算？
- 品类限制如何实现？
- 并发使用如何处理？

需要多次沟通才能明确。

### Executable PRD

**优势**：
- 所有业务规则显式定义
- 条件、计算逻辑精确
- 自动生成测试
- 可直接编译运行

---

## Executable PRD的挑战与应对

### 挑战1：学习曲线

**问题**：产品经理需要学习结构化规格语言

**应对**：
- 可视化编辑器（类似Figma但更结构化）
- AI辅助编写（自然语言→结构化规格）
- 培训渐进式迁移

### 挑战2：复杂度管理

**问题**：复杂系统的规格可能很长

**应对**：
- 模块化（像代码一样import/reuse）
- 分层（高层概览→低层细节）
- 版本控制（Git管理规格变更）

### 挑战3：与遗留系统集成

**问题**：已有系统不是Executable PRD生成的

**应对**：
- 逆向工程（从代码生成规格）
- 渐进式迁移
- 混合模式（部分用Executable，部分传统）

### 挑战4：AI编译器的成熟度

**问题**：AI生成的代码质量不稳定

**应对**：
- 人类审查环节（必须）
- 自动化测试（必须）
- 逐步提升AI能力

---

## 写在最后：从文档到源代码的范式转移

### 软件工程的历史脉络

每一代范式都缩短了"想法"到"实现"的距离。

### Executable PRD的意义

**不是**：让产品经理取代工程师
**而是**：让产品经理和工程师在同一语言上协作

**不是**：完全自动化开发
**而是**：自动化重复性工作，人类专注于创造性工作

**不是**：消灭文档
**而是**：让文档变得可执行、可验证、可维护

### 未来展望

**短期（1-2年）**：
- Executable PRD工具成熟
- 早期采用者（创业公司、创新团队）
- 与现有开发流程混合使用

**中期（3-5年）**：
- 行业标准形成
- 主流企业采用
- 产品经理技能转型

**长期（5-10年）**：
- "写PRD"成为编程的一种形式
- 产品经理 = 产品架构师
- 开发效率10倍提升

### 给产品经理的建议

**1. 开始学习结构化思维**
- 不是"描述功能"，是"定义规格"
- 学习业务规则建模
- 学习状态机、工作流

**2. 拥抱Executable工具**
- 尝试现有的低代码/无代码平台
- 学习结构化规格语言
- 与工程师协作定义规格

**3. 成为产品架构师**
- 不仅关注用户体验，关注系统架构
- 不仅关注功能，关注业务规则
- 不仅关注现在，关注可扩展性

---

## 📚 延伸阅读

### 相关概念
- **BDD (Behavior-Driven Development)**: 行为驱动开发，Executable Spec的思想前身
- **DSL (Domain-Specific Language)**: 领域特定语言
- **Model-Driven Development**: 模型驱动开发
- **Low-Code/No-Code**: 低代码/无代码平台

### 技术基础
- **YAML/JSON Schema**: 结构化数据定义
- **OpenAPI Specification**: API规格标准
- **GraphQL Schema**: 数据模型定义
- **Protocol Buffers**: 结构化数据序列化

### 工具实践
- **Figma Dev Mode**: 设计到开发的桥梁
- **Storybook**: 组件驱动的UI开发
- **Swagger/OpenAPI**: API规格和文档
- **JSON Schema**: 数据验证和文档

---

*Published on 2026-03-09*  
*深度阅读时间：约 18 分钟*

**AI-Native软件工程系列 #04** —— 从PRD到Executable Specification的需求工程革命
