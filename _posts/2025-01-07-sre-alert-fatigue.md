---
layout: post
title: "为什么太多监控等于没有监控"
date: 2025-01-07T02:00:00+08:00
tags: [SRE, 系统设计, 告警, 认知科学]
author: "@postcodeeng"
series: SRE思维实验室

redirect_from:
  - /sre-alert-fatigue.html
---

# 为什么太多监控等于没有监控

> *「PagerDuty在第100次告警后，变成了「狼来了」的男孩。」*

---

## 一、当告警变成噪音

2019年，一家SaaS公司的工程师平均每天收到 **47 条告警**。

其中：
- 42 条是误报（89%）
- 5 条是真实问题（11%）
- 0 条被及时处理（0%）

**结果：** 工程师对告警免疫了。当真正的故障发生时，告警被淹没在噪音中，无人响应。

这就是**告警疲劳（Alert Fatigue）**。

---

## 二、核心观点：信号检测的数学

信号检测理论告诉我们：

**当误报率过高时，真正的信号也会被忽视。**

| 告警策略 | 结果 |
|---------|------|
| 告警一切 | 告警疲劳，真实故障被忽略 |
| 只告警关键 | 可能遗漏问题，但更可能被响应 |

**关键洞察：** 不是「越多越好」，是「越准越好」。

---

## 三、穿越周期：从「全告警」到「智能告警」

### 阶段1：监控一切，告警一切

```
CPU > 80% → 告警
内存 > 70% → 告警
磁盘 > 60% → 告警
错误率 > 0.1% → 告警
...
```

**结果：** 每天数百条告警，团队麻木。

### 阶段2：只告警业务指标

```
成功率 < 99.9% → 告警
延迟 > P99阈值 → 告警
```

**结果：** 告警减少90%，响应率提升。

### 阶段3：智能降噪

```
单一异常 → 观察
连续异常 → 告警
多维度同时异常 → 紧急告警
```

**结果：** 只有真正的故障才触发告警。

---

## 四、反直觉洞察：关闭告警需要勇气

**直觉：** 多一条告警多一份安全。

**现实：** 每一条误报都在消耗团队的信任和注意力。

**更好的策略：**
- 定期审查告警，关闭误报
- 只保留影响用户体验的告警
- 用仪表盘代替告警

---

## 五、实战：如何设计有效的告警

### 原则1：业务指标优先

用户感受到的问题才是真正的故障。

### 原则2：可操作的告警

每条告警都应该有明确的行动指南：
- 检查什么？
- 如何修复？
- 联系谁？

### 原则3：分级告警

| 级别 | 条件 | 响应时间 |
|------|------|---------|
| P0 | 服务完全不可用 | 5分钟 |
| P1 | 核心功能受影响 | 30分钟 |
| P2 | 性能下降 | 4小时 |
| P3 | 非紧急问题 | 24小时 |

---

## 六、写在最后：少即是多

告警不是越多越好，是越准越好。

**最好的告警系统：**
- 每周只有少数几条告警
- 每条告警都是真实的故障
- 每次告警都能得到及时响应

> 当你每天收到47条告警时，你其实一条都没有收到。

---

## 📚 参考链接与延伸阅读

### 告警设计
- [Google SRE - Alerting](https://sre.google/sre-book/monitoring-distributed-systems/#alerting) — Google告警设计原则
- [PagerDuty Alerting Best Practices](https://www.pagerduty.com/resources/learn/alerting-best-practices/) — PagerDuty告警最佳实践
- [Alertmanager - Prometheus](https://prometheus.io/docs/alerting/latest/alertmanager/) — Prometheus告警管理

### 信号检测理论
- [Signal Detection Theory](https://en.wikipedia.org/wiki/Signal_detection_theory) — 信号检测理论
- [Reducing Alert Fatigue](https://www.infoq.com/articles/reduce-alert-fatigue/) — 减少告警疲劳策略
- [On-Call at GitHub](https://github.blog/2021-03-03-on-call-at-github/) — GitHub值班实践

### 实践案例
- [Etsy Alerting Philosophy](https://codeascraft.com/etsy-monitoring-and-graphing//) — Etsy监控与告警理念
- [Netflix Actionable Alerts](https://netflixtechblog.com/alerting-at-netflix-5fd44093b3ce) — Netflix可行动告警

---

*Published on 2024-03-08 | 深度阅读时间：约 5 分钟*

*SRE思维实验室系列 #07 —— 告警设计与信号检测*
