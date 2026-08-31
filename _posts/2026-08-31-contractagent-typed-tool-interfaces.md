---
layout: post
title: "ContractAgent：当工具接口带上类型合约"
date: 2026-08-31T16:00:00+08:00
tags: [Agent框架, 类型系统, 软件工程]
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
>
> 本文核心观点：
> 1. **工具描述的语义空洞** — 标准工具 schema 只说怎么调，不说何时能用、调用后状态如何变化，Agent 规划时只能靠猜
> 2. **DSL 描述前置/副作用，轻量求解器剔除无效调用** — 工具签名携带形式化合约，求解器在规划阶段过滤 41% 非法调用
> 3. **多轮轨迹参数类型错误清零** — 有合约约束的参数传递经过多轮不累积错误，OpenAI Swarm 基准步数下降 22%
> 4. **Python 装饰器与 JSON Schema 双向转换** — 同一份合约定义既可作运行时检查，也可作静态校验

---

## 工具调用为什么总是靠猜

给 Agent 一套工具，Agent 拿到的是一份自然语言描述的列表。每个工具告诉你需要传什么参数，却不告诉你这个工具在什么情况下可以调用、调用之后会发生什么。

这是一个语义黑洞。Agent 看到两个工具：`send_email(recipient, body)` 和 `delete_email(email_id)`。它怎么知道在什么状态下前者会成功、后者会不会把收件箱清空？它靠的是prompt 里那一句"小心操作"，以及大量试错。

这个问题在单轮调用时还算可控。多轮规划一旦展开，参数类型错误、状态前置条件不满足、副作用累积，三种错误互相缠绕，在第四轮、第五轮的时候集中爆发。

## 合约作为工具接口的第一等公民

ContractAgent 的出发点很简单：工具的接口定义里，参数类型只是表层约束，更重要的是**前置条件**（调用前必须满足什么）和**副作用**（调用后状态如何变化）。

论文用一门轻量 DSL 来表达这两个维度：

```python
@contract(
    pre=["user_authenticated == True", "recipient in contacts"],
    post=["email.sent == True", "email.sent_at > now()"],
    side_effects=["mutates: inbox", "reads: contacts"]
)
def send_email(recipient: str, body: str) -> SendResult:
    ...
```

这份合约不是注释，是可执行的。Agent 在规划阶段就把每一步的合约提交给轻量求解器，求解器检查当前状态是否满足前置条件，不满足的调用路径直接剪枝。

结果显示：规划阶段剪掉了 41% 的无效调用。这些调用在传统架构里会走到执行阶段才发现参数错误或状态不匹配，然后回退重来。

## 多轮轨迹中的错误消减

多轮 Agent 任务里最顽固的一类错误是**参数类型错误在轮次间累积**。第五轮调用时参数类型和第一轮不一致，Agent 察觉不到，继续传错误格式的参数，等到执行层才能发现。

合约约束在这里起了结构性的作用：每一轮参数传递都经过合约校验，类型不匹配的调用在进入执行前就被拦截。多轮轨迹中的参数类型错误从有到无，OpenAI Swarm 基准上的任务完成步数下降 22%，不是因为 Agent 变聪明了，而是因为错误路径被提前切断。

## Python 装饰器与 JSON Schema 双向映射

ContractAgent 没有另起炉灶定义一套专有格式。同一份合约定义可以：

- 以 Python 装饰器形式嵌入工具实现，运行时生效
- 导出为 JSON Schema，用于静态校验和工具注册
- 从已有 JSON Schema 导入，生成带约束的装饰器代码

这把工具接入的门槛降到了普通 Python 开发者也能做的程度。现有工具加一层装饰器就有了合约，不需要改造底层实现。

## 结尾

工具接口的描述从"怎么调"进化到"何时调、调完会怎样"，是 Agent 框架走向生产级的关键一步。ContractAgent 证明了形式化合约在这个环节是可落地的——不需要重量级 theorem prover，一门轻量 DSL 加一个轻量求解器，就能过滤掉将近一半的无效规划路径。对于生产级 Agent 框架的设计者来说，这个思路值得优先考虑。

Paper: [ContractAgent: Typed Tool Interfaces with Compile-Time Guardrails](https://arxiv.org/abs/2608.14790) — arXiv:2608.14790
