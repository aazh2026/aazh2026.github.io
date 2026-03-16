---
layout: post
title: "微服务反思：从'两个披萨'回到'一个仓库'"
date: 2026-03-16T15:00:00+08:00
permalink: /microservices-monolith-reconsideration/
tags: [Architecture, Microservices, Monolith, Team Structure, Engineering]
author: Aaron
series: AI-Native Engineering
---

> **TL;DR**> > "You don't need microservices. You need better module boundaries." 这篇文章质疑了微服务的普遍适用性，主张在团队真正独立、规模需求截然不同、或员工数超过 150 人之前，保持单体架构。微服务不是技术解决方案，而是组织结构的映射。

---

## 📋 本文结构

1. [那个激进的宣言](#那个激进的宣言)
2. [微服务的起源神话](#微服务的起源神话)
3. [两个披萨规则的误读](#两个披萨规则的误读)
4. [微服务的真实成本](#微服务的真实成本)
5. [何时拆分，何时保持](#何时拆分何时保持)
6. [模块化单体：被遗忘的第三条路](#模块化单体被遗忘的第三条路)
7. [Strangler Fig：渐进式演进](#strangler-fig渐进式演进)
8. [结论：没有银弹](#结论没有银弹)

---

## 那个激进的宣言

Reddit 上最近有一篇文章的标题很吸睛：

> **"Microservices: Shackles on your feet"**

副标题更激进：

> "You don't need microservices. You need better module boundaries. Split only when teams are truly independent, scaling needs are night-and-day different, or your headcount is pushing 150+. Before any of that — fix the code, draw real boundaries inside the monolith, set up tracing. Microservices don't fix a messy codebase. They just spread it across the network and make it someone else's 3 AM problem."

**你不需要微服务。你需要更好的模块边界。**

这篇文章引发了激烈讨论，因为它挑战了微服务作为"现代架构"的默认地位。

---

## 微服务的起源神话

微服务架构的流行通常归功于亚马逊和 Netflix 的成功案例。

故事是这样的：
- 亚马逊从单体架构开始
- 随着规模增长，单体成为瓶颈
- 他们拆分成微服务
- 成功！

但这个故事漏掉了关键细节。

### 亚马逊的真实情况

亚马逊在 2000 年代初期确实经历了架构转型，但：

1. **他们当时有 500+ 工程师**
2. **每个团队负责一个独立业务领域**
3. **部署频率是每天数千次**
4. **他们有专门的工具团队支持微服务生态**

> "Microservices are Amazon's solution to the problems that come with its organizational structure, a team has to be fed with two pizzas.. They are not a technical solution."

**微服务是亚马逊解决其组织结构问题的方案（一个团队只能吃两个披萨），不是技术解决方案。**

### Netflix 的情况

Netflix 的微服务转型：
- 发生在拥有数百名工程师之后
- 需要自建一整套基础设施（服务发现、熔断、监控）
- 成本：数百万美元的工程投入

---

## 两个披萨规则的误读

亚马逊 CTO Werner Vogels 提出的"两个披萨规则"经常被误读。

**原意**：团队规模应该小到两个披萨就能喂饱（6-10 人），这样沟通效率最高。

**误读**：所以每个团队应该有自己的微服务。

### 逻辑错误

两个披萨规则说的是**团队规模**，不是**服务边界**。

一个 10 人的团队可以维护：
- 一个单体应用
- 10 个微服务
- 或任何介于两者之间的架构

关键是**团队内部的协调成本**，不是代码部署形式。

---

## 微服务的真实成本

微服务架构有隐藏的成本，往往在决定采用后才显现出来。

### 开发成本

| 方面 | 单体 | 微服务 |
|------|------|--------|
| **本地开发** | `python app.py` | 启动 10 个服务，配置端口，处理依赖 |
| **调试** | 单步调试 | 分布式追踪，日志聚合 |
| **测试** | 单元 + 集成测试 | 契约测试，集成测试，端到端测试 |
| **API 变更** | 修改函数签名 | 版本管理，向后兼容，协调多个团队 |

### 运维成本

```yaml
# 单体：一个部署单元
deploy:
  - app

# 微服务：N 个部署单元
deploy:
  - service-user
  - service-order
  - service-payment
  - service-inventory
  - service-notification
  # ... 还有 20 个
```

每个服务需要：
- 独立的 CI/CD pipeline
- 独立的监控和告警
- 独立的日志聚合
- 独立的服务发现配置

### 故障排查成本

单体中的 bug：
1. 查看堆栈跟踪
2. 定位代码行
3. 修复

微服务中的 bug：
1. 查看入口服务日志
2. 发现它调用了服务 A
3. 查看服务 A 的日志
4. 发现它调用了服务 B
5. 查看服务 B 的日志...
6. 20 分钟后发现是网络超时
7. 检查服务发现配置
8. 发现问题在服务 C 的依赖版本

一位 Reddit 用户的经历：

> "I was working in a place that had a monolithic web app in C# (around 2015). Not really a problem... New CTO comes in and mandates that we switch to a microservice architecture... Split the monolith up into like 5 microservices... It quite literally killed the product. We basically rewrote the whole thing for no gain, more work, and made it harder to make changes."

---

## 何时拆分，何时保持

### ✅ 应该考虑拆分的信号

| 信号 | 说明 |
|------|------|
| **团队规模 > 150 人** | 康威定律开始严重阻碍开发 |
| **完全不同的扩展需求** | 一个服务需要 100 实例，另一个需要 2 个 |
| **真正的团队独立性** | 团队可以独立发布，不需要协调 |
| **技术栈分歧** | 必须用不同的语言/框架 |
| **合规要求** | 某些数据必须隔离处理 |

### ❌ 不应该拆分的理由

| 坏理由 | 为什么错 |
|--------|----------|
| "微服务很酷" | 技术选择应该基于需求，不是流行趋势 |
| "我们将来会需要" | YAGNI（You Aren't Gonna Need It）|
| "单体代码太乱" | 微服务会把混乱分散到网络上 |
| "每个领域一个服务" | 领域边界 ≠ 服务边界 |
| "为了容错" | 单体也可以有多个实例 |

---

## 模块化单体：被遗忘的第三条路

在单体和微服务之间，有一个被忽视的选择：**模块化单体**（Modular Monolith）。

### 核心思想

保持单一部署单元，但在代码层面严格划分模块：

```
myapp/
├── modules/
│   ├── user/           # 用户模块
│   │   ├── api.py      # 内部 API
│   │   ├── models.py   # 数据模型
│   │   └── service.py  # 业务逻辑
│   ├── order/          # 订单模块
│   │   ├── api.py
│   │   ├── models.py
│   │   └── service.py
│   └── payment/        # 支付模块
│       ├── api.py
│       ├── models.py
│       └── service.py
├── shared/             # 共享组件
├── tests/
└── app.py              # 统一的入口点
```

### 模块边界规则

1. **模块间通过 API 通信**
   ```python
   # 不要这样
   from modules.order.models import Order
   
   # 要这样
   from modules.order.api import get_order
   ```

2. **禁止跨模块数据库访问**
   ```python
   # 用户模块不能直接查询订单表
   ```

3. **每个模块有自己的业务逻辑**
   ```python
   # 订单模块负责订单生命周期
   # 支付模块只处理支付状态变更
   ```

### 模块化单体的优势

| 优势 | 说明 |
|------|------|
| **开发简单** | 单一仓库，单一部署 |
| **重构容易** | IDE 支持，类型检查 |
| **测试简单** | 集成测试在一个进程内 |
| **性能更好** | 没有网络调用开销 |
| **未来可拆分** | 当真正需要时，边界已经清晰 |

### 真实案例：Shopify

Shopify 是一个成功的模块化单体案例：
- 支持数百万商家
- 单一 Rails 代码库
- 清晰的模块边界
- 在需要的地方（支付、图片处理）使用独立服务

---

## Strangler Fig：渐进式演进

如果你已经有一个单体，想要迁移，**永远不要重写**。

使用 **Strangler Fig 模式**（绞杀榕模式）：

### 原理

1. 在单体前放置一个代理层（API Gateway）
2. 新功能在新服务中实现
3. 逐步将旧功能从单体中移出
4. 最终，单体被"绞杀"，可以退役

### 示例

```
初始状态：
[Client] → [Monolith]

第一步：
[Client] → [Gateway] → [Monolith]
                  ↓
               [New Service A]

第二步：
[Client] → [Gateway] → [Monolith (缩小)]
                  ↓
               [Service A]
               [Service B]

最终状态：
[Client] → [Gateway] → [Service A]
                  ↓
               [Service B]
               [Service C]
               [Service D]
```

### 为什么不要重写

> "When you do split, use a strangler fig. Not a rewrite. Never a rewrite."

重写的风险：
- 业务逻辑遗漏
- 需要同时维护两套系统
- 迁移期间的混乱
- 可能不会成功（著名的 Netscape 重写灾难）

---

## 结论：没有银弹

微服务不是银弹。单体也不是。

**正确的架构是适合你的团队规模和业务需求的架构。**

决策 checklist：

- [ ] 你的团队有 150+ 人吗？
- [ ] 你有真正的团队独立性需求吗？
- [ ] 不同组件有完全不同的扩展需求吗？
- [ ] 你有资源维护微服务基础设施吗？
- [ ] 单体内部已经有清晰的模块边界吗？

如果前四个都是"否"，而最后一个是"否"——**先做好模块化单体**。

正如 Reddit 上的共识：

> "As most wise developers have said 'it depends'"
> > 正如大多数聪明的开发者所说："看情况。"

不要盲目追随亚马逊或 Netflix 的架构。他们解决的问题可能不是你面临的问题。

**从简单开始，在需要时演进。**

---

## 参考与延伸阅读

- [Microservices: Shackles on your feet](https://howtocenterdiv.com/beyond-the-div/microservices-shackles-on-your-feet) - 原文
- [MonolithFirst](https://martinfowler.com/bliki/MonolithFirst.html) - Martin Fowler
- [Modular Monoliths](https://www.youtube.com/watch?v=5OjqD-owQvg) - Simon Brown
- [The Strangler Fig Pattern](https://martinfowler.com/bliki/StranglerFigApplication.html) - Martin Fowler
- [Shopify's Monolith](https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity) - Shopify Engineering

---

*本文灵感源自 2026-03-16 Reddit r/programming 讨论。*

*发布于 [postcodeengineering.com](/)*
