---
layout: post
title: "当代码回滚遇上数据迁移：如何逆转时间？"
date: 2025-01-05T02:00:00+08:00
tags: [SRE, 系统设计, 数据迁移, 回滚策略]
author: Aaron
series: SRE思维实验室

redirect_from:
  - /sre-rollback-paradox.html
---

# 当代码回滚遇上数据迁移：如何逆转时间？

> *「想象你是时间旅行者，回到过去阻止了一场灾难。但当你回到现在，世界已经面目全非。」*

---

## 一、回滚的时间旅行悖论

软件回滚的困境：**当你试图「回到过去」（回滚代码），数据已经在新版本下发生了变化。**

**场景：**
- v1.0：用户有 `name` 字段
- v2.0：新增 `age` 字段，数据迁移完成
- 发现问题 → 回滚到 v1.0

**问题：** v1.0的代码不认识 `age` 字段，但数据库里已经有了。

**这不是代码问题，是数据不可逆问题。**

---

## 二、核心观点：数据迁移是不可逆的操作

让我说一个残酷的事实：

> **代码可以回滚，数据不能回滚。一旦你改变了数据格式，就永远改变了。**

为什么？

**熵增原理：** 系统总是从有序走向无序。数据变更增加了熵，无法自动恢复。

**业务连续性：** 回滚期间产生的新数据，如何在旧代码中解释？

---

## 三、穿越周期：三种回滚场景

### 场景1：纯代码变更（可逆）

仅逻辑变更，无数据变更。

**回滚：** 瞬间完成，无风险。

### 场景2：配置变更（基本可逆）

配置影响行为，但无持久化数据变更。

**回滚：** 简单，但可能影响运行中状态。

### 场景3：数据迁移（不可逆）⚠️

代码变更伴随数据格式变更。

**回滚：** **几乎不可能**，或成本极高。

---

## 四、反直觉洞察：向前修复，而非向后回滚

**传统思维：** 出问题了，回滚到上一个版本。

**数据迁移场景的现实：** 回滚比修复更危险。

**更好的策略：向前修复（Roll Forward）**

```
发现问题
↓
不 rollback，而是快速修复（hotfix）
↓
v2.1 发布，解决问题
```

**优势：**
- 避免数据格式来回切换的混乱
- 保持业务连续性
- 用户无感知

---

## 五、实战：数据迁移的安全策略

### 策略1：双写阶段

同时写入旧格式和新格式。

```
v1.5（过渡版本）：
- 写入旧格式（保证兼容性）
- 同时写入新格式（为未来准备）
- 读取旧格式
```

### 策略2：只增不改

不修改现有字段，只增加新字段。

```
旧代码看到新字段：忽略
新代码看到旧数据：使用默认值
```

### 策略3：蓝绿部署+数据同步

两个独立环境，数据双向同步。

```
蓝环境（v1.0）←→ 数据同步 ←→ 绿环境（v2.0）
```

发现问题时，流量切回蓝环境，数据无损。

---

## 六、写在最后：接受不可逆性

数据迁移的不可逆性，不是技术缺陷，是物理定律。

**最好的策略：**
- 设计可向前兼容的数据格式
- 避免破坏性变更
- 准备向前修复，而非向后回滚

> 在时间面前，我们都是单向度的。接受这一点，才能设计出真正 resilient 的系统。

---

## 📚 参考链接与延伸阅读

### 数据迁移策略
- [Stripe's Approach to Data Migrations](https://stripe.com/blog/online-migrations) — Stripe在线迁移实践
- [Evolutionary Database Design](https://martinfowler.com/articles/evodb.html) — Martin Fowler演进式数据库设计
- [Refactoring Databases](https://databaserefactoring.com/) — 数据库重构模式

### 版本控制与兼容性
- [Making Sense of Semantic Versioning](https://semver.org/) — 语义化版本规范
- [Backward Compatibility Guidelines](https://cloud.google.com/apis/design/compatibility) — Google API兼容性指南
- [Postel's Law](https://en.wikipedia.org/wiki/Robustness_principle) — 健壮性原则

### 部署模式
- [Blue-Green Deployment](https://martinfowler.com/bliki/BlueGreenDeployment.html) — 蓝绿部署详解
- [Feature Toggles](https://martinfowler.com/articles/feature-toggles.html) — 功能开关模式

---

*Published on 2024-03-06 | 深度阅读时间：约 5 分钟*

*SRE思维实验室系列 #05 —— 数据一致性与版本控制*
