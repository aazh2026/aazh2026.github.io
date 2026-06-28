---
layout: post
title: "组合优于继承：Agent 协作中的设计智慧"
date: 2026-03-15T10:00:00+08:00
tags: [AI, Agent, Design-Patterns, Software-Architecture, Technical]
author: "@postcodeeng"
series: "Agent-OS-Series"
series_title: "从 SaaS 到 Agent OS"

redirect_from:
  - /composition-over-inheritance.html
---

*"在软件设计中，继承是白盒复用，组合是黑盒复用。白盒让你看到太多你不该关心的细节，黑盒让你只关注你需要的接口。"*
*—— GoF《设计模式》*

---

> **TL;DR**
>
> 组合优于继承是软件设计的基本原则：继承带来强耦合、脆弱的基类问题、违反封装等固有问题，而组合提供松耦合、高内聚、可替换、易扩展的优势。这一原则从类组合演进为 Agent 组合：通过能力组合、行为组合、记忆组合的三层架构，实现更灵活的 Agent 系统设计。但需注意，组合不是银弹，过度组合同样有害。

---

## 📋 本文结构

- [继承 vs 组合：一场三十年的争论](#继承-vs-组合一场三十年的争论)
- [为什么组合更优：三个核心维度](#为什么组合更优三个核心维度)
- [从类组合到 Agent 组合](#从类组合到-agent-组合)
- [实战：设计可组合的 Agent 系统](#实战设计可组合的-agent-系统)
- [继承在 AI 时代的新形态](#继承在-ai-时代的新形态)
- [反直觉洞察：组合不是银弹](#反直觉洞察组合不是银弹)
- [代码示例与最佳实践](#代码示例与最佳实践)
- [写在最后](#写在最后)

---

## 继承 vs 组合：一场三十年的争论

### GoF 设计模式的启示

1994年，四位软件工程大师（Gang of Four）在《设计模式》一书中写下了 software engineering 史上最具影响力的建议之一：

> **"Favor object composition over class inheritance."**
> **（优先使用对象组合，而非类继承。）**

这句话不是否定继承的价值，而是指出了继承被滥用的普遍问题。

### Java 时代的继承滥用

在 2000 年代的 Java 企业开发中，继承滥用达到了顶峰：

**继承带来的问题：**

| 问题 | 表现 | 后果 |
|------|------|------|
| **脆弱的基类** | 修改父类影响所有子类 | 不敢改动核心代码 |
| **层次过深** | 继承链超过 3-4 层 | 理解成本高，调试困难 |
| **强耦合** | 子类依赖父类实现细节 | 无法独立演化 |
| **违反封装** | 子类知道父类内部 | 封装被破坏 |

### 组合的崛起

Go 语言的横空出世，彻底颠覆了 "一切皆类" 的思维模式：

Go 没有继承，只有组合。这不是缺陷，而是设计上的刻意选择。

---

## 为什么组合更优：三个核心维度

### 1. 灵活性：运行时 vs 编译时

**继承是静态绑定：**
**组合是动态绑定：**
### 2. 解耦：接口 vs 实现

**继承的问题是 "是一个"：**
**组合的优势是 "有一个"：**
### 3. 测试性：可替换的依赖

**继承的测试困境：**
**组合的测试便利：**
---

## 从类组合到 Agent 组合

### Agent 系统的特殊性

传统软件组件之间的关系是静态的，但 Agent 系统有独特的挑战：

1. **动态能力发现**：Agent 可能在运行时学习新技能
2. **上下文依赖**：同一个 Agent 在不同上下文中表现不同
3. **多模态交互**：需要组合不同类型的输入/输出能力
4. **协作演化**：多个 Agent 协作时能力需要动态调整

### Agent 组合的三层模型

<object data="/assets/images/2026-03-15-composition-01-stack.svg" type="image/svg+xml" width="100%"></object>

### 为什么 Agent 更需要组合

**场景：一个销售助手 Agent**

如果用继承方式设计：
如果用组合方式设计：
---

## 实战：设计可组合的 Agent 系统

### 核心接口设计

**1. 能力接口（Capability Interface）**

**2. 记忆接口（Memory Interface）**

**3. 行为接口（Behavior Interface）**

### 可组合 Agent 的实现

### 具体能力实现示例

**推理能力：**

**规划能力：**

### 编排模式：组合的组合

<object data="/assets/images/2026-03-15-composition-02-orchestrator.svg" type="image/svg+xml" width="100%"></object>

---

## 继承在 AI 时代的新形态

### Prompt 继承

虽然代码层面避免继承，但 Prompt 设计中出现了新的 "继承" 模式：

**Prompt 继承的风险：**
- **冲突原则**：子 Prompt 可能覆盖或矛盾父 Prompt 的指令
- **长度爆炸**：层层继承导致上下文过长
- **调试困难**：难以定位是哪个层次的 Prompt 导致了问题行为

**更安全的做法：Prompt 组合**

### Context 继承

Agent 在执行过程中，Context 的传递也呈现出继承特征：

**Context 继承的最佳实践：**
- 使用 `copy()` 而非直接引用，避免副作用
- 明确哪些字段可继承，哪些需要重置
- 设置深度限制，防止无限递归

---

## 反直觉洞察：组合不是银弹

### 洞察 1：过度组合的危害

**解决方案：
- 最多组合 3-5 个核心组件
- 使用适配器模式统一接口
- 考虑性能开销

### 洞察 2：继承在特定场景仍然有用

**何时使用继承：**
- 真正的 "is-a" 关系（几何图形继承体系）
- 领域模型的分类（如上面的 Event 类型）
- 框架/库的扩展点设计

### 洞察 3：组合也需要设计

**更好的设计：Mediator 模式**

---

## 代码示例与最佳实践

### 完整示例：销售助手 Agent

### 最佳实践清单

**✅ Do（推荐做法）：**

1. **面向接口编程**
2. **使用依赖注入**
3. **保持组件单一职责**
4. **支持运行时配置**
**❌ Don't（避免做法）：**

1. **避免深继承链**
2. **避免在子类中依赖父类实现细节**
3. **避免混合关注点**
---

## 写在最后

组合优于继承不是教条，而是经过三十年软件工程实践验证的设计智慧。

### 核心要点回顾

| 维度 | 继承 | 组合 |
|------|------|------|
| 关系 | is-a（是一个） | has-a（有一个） |
| 耦合度 | 高（白盒复用） | 低（黑盒复用） |
| 灵活性 | 编译时固定 | 运行时动态 |
| 测试性 | 困难（必须实例化整个继承链） | 容易（注入 Mock） |
| 适用场景 | 真正的分类体系 | 功能能力的组装 |

### 给 AI 开发者的建议

1. **从组合开始**：设计 Agent 时，先用组合思维思考能力如何组装
2. **延迟使用继承**：只有当 "is-a" 关系非常明显时才考虑继承
3. **关注接口**：组件之间的契约比实现更重要
4. **保持简单**：不要过度设计，3-5 个核心组件通常是最佳平衡点

### 最后的话

> "软件设计的本质是在约束中寻找平衡。组合给了你灵活性，但也需要更多设计思考。继承看似简单，却可能在未来埋下隐患。"

在 AI Agent 开发中，这一点尤为重要。Agent 系统需要快速迭代、灵活调整，组合设计让这种调整成为可能。

选择组合，不是因为简单，而是因为正确。

---

## 📚 延伸阅读

**本系列文章**

- [Agent OS 的五层架构模型](/agent-os-five-layer-architecture/)
- [Multi-Agent 协作](/multi-agent-collaboration/)
- [从 Human-driven 到 Agent-driven](/human-driven-to-agent-driven/)

**经典参考**

- [Design Patterns: Elements of Reusable Object-Oriented Software](https://en.wikipedia.org/wiki/Design_Patterns) - GoF 经典
- [Composition over Inheritance](https://en.wikipedia.org/wiki/Composition_over_inheritance) - Wikipedia
- [Effective Java](https://www.oracle.com/java/technologies/effective-java.html) - Joshua Bloch
- [The Go Programming Language](https://golang.org/) - Go 语言设计哲学

---

*Agent OS 系列 - 设计模式篇*
*由 @postcodeeng 整理发布*

*Published on 2026-03-15*
*阅读时间：约 20 分钟*

*下一篇预告：《Agent 的状态机设计》*
