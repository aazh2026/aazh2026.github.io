---
layout: post
title: "为什么故障复盘不能追求「政治正确」"
date: 2025-01-08T02:00:00+08:00
tags: [SRE, 系统设计, 故障复盘, 组织学习]
author: Aaron
series: SRE思维实验室

redirect_from:
  - /2025/01/08/sre-postmortem.html
---

# 为什么故障复盘不能追求「政治正确」

> *「每次复盘会都变成了「我们都很努力」的表彰大会，但同样的故障下个月再次发生。」*

---

## 一、故障复盘的尴尬

某大厂的一次复盘会：

**场景：** 核心服务宕机2小时，损失数百万。

**复盘结论：**
- 「大家已经很努力了」
- 「这次情况比较特殊」
- 「下次我们会更加小心」

**一个月后：** 同样的故障再次发生。

**为什么？** 因为复盘追求的是「和谐」，而非「真相」。

---

## 二、核心观点：Blameless 不等于 No-Accountability

Google SRE 提倡「Blameless Postmortem」（无指责复盘）。

**但很多人误解了：**
- ❌ 不是「没人有错」
- ✅ 是「不针对个人，但针对系统设计」

**真正的问题：**
- 为什么系统允许这个错误发生？
- 为什么错误没有被及时发现？
- 为什么恢复花了这么长时间？

**是系统问题，不是人的问题。**

---

## 三、穿越周期：从「追责」到「学习」

### 传统复盘：追责模式

```
谁写的代码？
↓
谁批准的发布？
↓
谁值班没发现？
```

**结果：** 大家互相推诿，真相被掩盖。

### 现代复盘：学习模式

```
系统为什么允许这个错误？
↓
监控为什么没发现？
↓
如何防止再次发生？
```

**结果：** 发现系统性问题，持续改进。

---

## 四、反直觉洞察：真相往往不舒服

**舒适的复盘：** 「这是一次意外，大家都尽力了。」

**真实的复盘：** 「我们的系统设计有根本缺陷，需要大规模重构。」

**前者让人舒服，但无用。**
**后者让人难受，但有价值。**

**好的复盘应该：**
- 指出系统的真实弱点
- 承认设计决策的错误
- 提出根本性的改进方案

---

## 五、实战：如何进行有效的复盘

### 复盘模板

**1. 发生了什么？（时间线）**
- 客观描述，不解释原因

**2. 影响是什么？**
- 用户影响、业务损失

**3. 根本原因是什么？**
- 用「5个为什么」深挖
- 找到系统设计层面的问题

**4. 如何防止再次发生？**
- 具体的改进措施
- 负责人和截止日期

### 关键原则

- **不点名，不指责**
- **关注系统，不关注人**
- **追求真相，不求和谐**
- **可操作的改进，不是空洞的承诺**

---

## 六、写在最后：真相让人不舒服，但有用

故障复盘不是为了追究责任，是为了学习。

**但学习需要面对真相，而真相往往不舒服。**

> 最好的复盘不是让所有人满意的复盘，是让系统变得更好的复盘。

---

## 📚 参考链接与延伸阅读

### 故障复盘方法论
- [Google SRE - Postmortem](https://sre.google/sre-book/postmortem-culture/) — Google故障复盘文化
- [Etsy Blameless Postmortem](https://codeascraft.com/2025/01/08/blameless-postmortems/) — Etsy无指责复盘
- [Netflix Postmortem Template](https://netflixtechblog.com/fault-tolerance-in-a-high-volume-distributed-system-91ab4faae74a) — Netflix故障复盘模板

### 组织学习
- [The Field Guide to Understanding Human Error](https://www.amazon.com/Field-Guide-Understanding-Human-Error/dp/0754648267) — Sidney Dekker人为因素分析
- [Just Culture](https://www.amazon.com/Just-Culture-Balancing-Safety-Accountability/dp/1409440602) — 公正文化
- [Team Topologies](https://teamtopologies.com/) — 团队拓扑与组织设计

### 工具与模板
- [Postmortem Templates](https://github.com/dastergon/postmortem-templates) — 复盘模板集合
- [PagerDuty Postmortem Guide](https://www.pagerduty.com/resources/learn/post-mortem-incident-report/) — PagerDuty复盘指南

---

*Published on 2024-03-09 | 深度阅读时间：约 5 分钟*

*SRE思维实验室系列 #08 —— 组织学习与故障文化*
