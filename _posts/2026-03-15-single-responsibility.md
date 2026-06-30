---
layout: post
author: "@postcodeeng"
title: "单一职责的升维：从类到 Agent"
date: 2026-03-15T09:00:00+08:00
categories: [Agent Design, Software Architecture]
tags: [SRP, Agent Architecture, Design-Patterns, Modular AI]
description: "单一职责原则从类升维到 Agent：一个混乱的 Agent 比混乱的类更难维护。CUBE 原则（Context、User、Business、Error）定义 Agent 边界，四种协作模式（管道、主从、黑板、服务网格）实现职责分离。"
series: agent-os
---

> **TL;DR**
>
> 一个类只有一个变化原因，一个Agent只有一个职责。单一职责原则（SRP）是面向对象设计的基石，但在AI Agent时代，它的边界被重新定义了。本文将SRP从"类"升维到"Agent"，揭示为什么一个混乱的Agent比混乱的类更难维护，并提供可落地的设计原则与代码示例。

---

## SRP 回顾：类的单一职责

### 定义

Robert C. Martin 在《敏捷软件开发》中定义：

> **一个类应该只有一个引起它变化的原因。**

注意，这里的关键不是"做一件事"，而是"只有一个变化原因"。一个类可以做很多事情，只要这些事情都源于同一个业务规则。

> 💡 **Key Insight**
>
> SRP 的本质是"一个变化原因"，而非"做一件事"。职责的边界由"什么会同时变化"来决定。

### 经典示例

来看一个具体的 SRP 违反场景：一个 `UserManager` 类同时处理用户认证、发送邮件和生成报表。这意味着认证逻辑的修改（比如引入新的 MFA 方案）会影响到邮件发送的可用性，而报表格式的调整又可能引入新的认证 bug。三个完全不相关的变化原因被塞进了同一个类。

遵循 SRP 的做法是将它们拆分：

```python
class AuthManager:    # 只处理认证：登录、登出、MFA、密码重置
class EmailService:   # 只处理邮件：发送、模板、批量通知
class ReportGenerator: # 只处理报表：数据提取、格式化、导出
```

拆分后，每个类的变化原因清晰可追溯：安全策略变了改 `AuthManager`，邮件模板改了改 `EmailService`，报表需求变了改 `ReportGenerator`。修改其中一个不会意外影响另外两个。

```python
# ❌ 违反 SRP：一个类处理多种不相关的职责
class UserManager:
    def authenticate(self): ...
    def send_email(self): ...
    def generate_report(self): ...
    def export_data(self): ...
```

遵循 SRP 的做法是拆分：

```python
# ✅ 遵循 SRP：每个类只有一个变化原因
class AuthManager: ...
class EmailService: ...
class ReportGenerator: ...
class DataExporter: ...
```

## 为什么 SRP 重要

### 关注点分离（Separation of Concerns）

当不同部门的修改需求汇聚在同一个类时，就会发生冲突。会计部门改薪资计算，技术部门改存储格式——它们不应该互相影响。

### 可维护性

单一职责的代码就像乐高积木：
- 修改一处，不会影响其他
- 容易定位问题
- 可以独立演进

### 可测试性

一个职责单一的类：
- 测试场景有限且明确
- 依赖容易 mock
- 单元测试写起来像散文一样流畅

---

## 从类到 Agent：SRP 的升维

### Agent 是什么？

在本文语境下，Agent 是：
- 具有自主决策能力的程序单元
- 可以调用工具、访问外部资源
- 通常运行在一个独立进程中（或容器中）
- 通过消息/事件与其他 Agent 协作

### 升维的必要性

**类的 SRP 问题：** 修改时需要重新编译、重新部署。

**Agent 的 SRP 问题：** 混乱的 Agent 会导致更严重的后果：

| 维度 | 类违反 SRP | Agent 违反 SRP |
|------|-----------|---------------|
| 影响范围 | 调用方 | 整个系统 |
| 调试难度 | 单步跟踪 | 分布式追踪 |
| 回滚成本 | 重启服务 | 协调多服务 |
| 理解成本 | 读代码 | 读代码 + 读 prompt + 读历史对话 |

> 💡 **Key Insight**
>
> Agent 违反 SRP 的代价远超类违反 SRP——影响范围是整个系统，而非单个调用方。

### 核心原则

> **一个 Agent 只有一个职责，并且这个职责应该是完整的、内聚的。**

这不是类的简单放大，而是对"职责"的重新定义。

> 💡 **Key Insight**
>
> Agent 的职责是"完整的内聚单元"——它独立完成一个业务动作，而非机械地"做一件事"。

---

## 设计单一职责的 Agent

### 粒度选择

选择 Agent 的粒度就像切蛋糕——太大或太小都不行。

#### 太粗：一个 Agent 包揽所有

<object data="/assets/images/2026-03-15-single-responsibility-01-anti.svg" type="image/svg+xml" width="100%" aria-label="太粗：一个 Agent 包揽所有" role="img"></object>

**问题：**
- Prompt 变得冗长复杂
- 上下文窗口被稀释
- 难以调试"它为什么这样做"
- 修改邮件功能可能影响写作功能

> 💡 **Key Insight**
>
> 粒度选择的本质是"业务边界"而非"功能数量"——按业务边界划分的 Agent，即使功能多一些，也比按功能拆分出的十几个碎片 Agent 更易于维护和协作。

#### 太细：每个小功能一个 Agent

**问题：**
- 通信开销爆炸
- 延迟无法忍受
- 系统复杂度超过收益

#### 正好：按业务边界划分

<object data="/assets/images/2026-03-15-single-responsibility-02-specialized.svg" type="image/svg+xml" width="100%" aria-label="正好：按业务边界划分" role="img"></object>

### 边界定义：CUBE 原则

我提出 **CUBE** 原则来定义 Agent 边界：

| 维度 | 说明 | 示例 |
|------|------|------|
| **C**ontext | 上下文一致 | 邮件 Agent 只关心邮件上下文 |
| **U**ser | 用户角色一致 | 面向内部员工的 vs 面向客户的 |
| **B**usiness | 业务领域一致 | 财务、人事、营销分开 |
| **E**rror | 错误处理一致 | 同类型错误在同一层处理 |

> 💡 **Key Insight**
>
> CUBE 原则是 Agent 边界的"体检表"——拿到一个候选 Agent，先问它：Context 统一吗？User 角色一致吗？Business 领域一致吗？Error 处理能放在同一层吗？四个问题有一个答不上来，就该考虑拆分。

### 协作模式

#### 模式一：管道模式（Pipeline）

**适用场景：** 数据流清晰、步骤固定的任务

数据沿固定链路流动，每个 Agent 只完成一道工序。前一个 Agent 的输出是后一个 Agent 的输入，没有跳跃，没有环路。

管道模式的优点是数据流清晰、易于监控每一步的输入输出，适合批处理场景。缺点是缺乏灵活性——如果中间某一步需要分支或回退，管道就难以应对。

**示例：** 新闻摘要系统 — `FetchAgent`（抓取）→ `ParseAgent`（清洗）→ `SummarizeAgent`（摘要）→ `PublishAgent`（发布）

每个 Agent 职责单一，数据沿管道单向流动。如果发布失败，从 `PublishAgent` 向上排查，每个环节的输入输出都可追溯。

#### 模式二：主从模式（Master-Worker）

**适用场景：** 需要协调多个专业 Agent

一个 Master Agent 掌握全局视图，负责分解任务、分配给专业 Workers、等待并行执行完成后汇总结果。Master 不做具体工作，只做协调；Worker 们各自专注自己的领域。

**示例：** 会议安排系统 — `MasterAgent` 收到"安排周三下午和张三的会议"请求后，分解为三个并行任务：`CalendarWorker` 检查自己的可用时间、`EmailWorker` 查询张三的联系方式、`LocationWorker` 寻找可用会议室。三个 Worker 并行运行，完成后 Master 汇总结果并生成会议邀请。

这种模式适合"一个主控，多个专业执行"的结构。Master 的 prompt 相对稳定，因为它不处理具体业务；业务逻辑的变化都在各个 Worker 中。

#### 模式三：黑板模式（Blackboard）

**适用场景：** 复杂问题求解，各 Agent 贡献部分解

多个专业 Agent 同时运行在各自分配的任务上，通过一块共享的"黑板"交换中间结果。任何 Agent 可以读取黑板上的已有信息，并将自己的发现写回黑板。没有中心协调者，每个 Agent 自主决定何时读写。

这种模式的典型场景是代码审查：`SecurityAgent` 负责检查安全漏洞，`PerformanceAgent` 负责性能分析，`StyleAgent` 负责代码风格。它们各自独立运行，最后将审查结果统一写入黑板供人工或汇总 Agent 使用。

黑板模式的优势是高度并行、可扩展，适合开放性问题。缺点是 Agent 之间的通信是隐式的，调试和追踪需要依赖黑板的状态记录。

#### 模式四：服务网格模式（Service Mesh）

**适用场景：** 高度解耦、动态协作的系统

各 Agent 通过标准消息协议通信，编排逻辑与业务逻辑完全分离。Agent 不知道其他 Agent 的具体实现，只知道它们能响应什么消息。服务发现、路由、限流、监控都由基础设施层处理，不在业务 Agent 的 prompt 里。

这种模式适合大规模系统：Agent 数量多、协作关系复杂、需要在不修改 Agent 代码的情况下动态调整路由策略。比如在消息总线层面将 `EmailAgent` 的流量引到备用实现，或在不打乱已有协作链的情况下新增一个 `TranslationAgent`。

代价是架构复杂度高，需要维护消息总线和服务发现机制。适合团队已有服务治理经验、不缺基础设施建设的场景。

> 💡 **Key Insight**
>
> 协作模式没有优劣，只有场景适配——Pipeline 适合线性流程，Blackboard 适合开放问题，Master-Worker 适合需要协调的场景。

---

## 反模式：上帝 Agent 与面条 Agent

### 上帝 Agent（God Agent）

**症状：**
- Prompt 超过 2000 tokens
- 工具列表像电话簿一样长
- "你什么都能做"
- 每次修改都要动 prompt

**示例：** 一个处理邮件、日历、文档、搜索、报表、客服等所有功能的"全能 Agent"

下面是一个典型的上帝 Agent prompt 结构（实际生产中会远超 2000 tokens）：

```python
SYSTEM_PROMPT = """你是一个全能助手，可以：
工具：send_email, read_email, search_emails, create_calendar_event,
      check_calendar, book_room, search_documents, read_documents,
      write_reports, generate_charts, answer_customer_questions,
      search_knowledge_base, translate_text, ...
角色：你是一个有礼貌的助手
约束：...
"""
```

每次增加新功能就要修改这个 prompt，而修改 prompt 意味着 LLM 对"何时用哪个工具"的理解也会变——这是对全系统的冒险。

**问题：**
- LLM 难以精确理解"现在该用哪个能力"
- 上下文被稀释，响应质量下降
- 一个功能的 bug 可能影响整个 Agent
- 难以测试和复用

> 💡 **Key Insight**
>
> 上帝 Agent 的本质是"职责边界模糊"——所有能力堆在一起，每次修改都是对全系统的冒险。

### 面条 Agent（Spaghetti Agent）

**症状：**
- Agent 之间随意相互调用
- 调用链深度超过 5 层
- 循环依赖
- 不知道哪个 Agent 最终处理了请求

**示例：** Agent A 调用 B，B 调用 C，C 又回调 A，形成循环调用链

```python
# 面条 Agent 调用链示例
class AgentA:
    def handle(self, msg):
        if needs_email(msg):
            return agent_b.handle_email(msg)  # A → B

class AgentB:
    def handle_email(self, msg):
        if needs_translation(msg):
            return agent_c.translate(msg)     # B → C
        return send_email(msg)

class AgentC:
    def translate(self, msg):
        if msg.language == "en":
            return agent_a.process(msg)     # C → A（循环！）
        return msg
```

这条调用链的问题是：给 `AgentA` 一个英文邮件，它就进入了 `A→B→C→A` 的无限循环。即使加了最大深度限制，也只是掩盖了设计问题——调用关系本身已经无法预测。

**问题：**
- 调试时 stack trace 像迷宫
- 循环调用导致无限递归
- 无法预测性能
- 系统行为不可控

> 💡 **Key Insight**
>
> 面条 Agent 的根源是"缺乏编排层"——Agent 之间直接相互调用，没有 Orchestrator 做路由决策，导致调用关系变成一张无法预测的有向图。

### 正确的层次结构

<object data="/assets/images/2026-03-15-single-responsibility-03-orchestrator.svg" type="image/svg+xml" width="100%" aria-label="正确的层次结构" role="img"></object>

---

## 反直觉洞察

前面说了 SRP 的正面价值，这里有四个反直觉的观察，帮助你在实际项目中做出权衡。

### 洞察一：Agent 比类更需要 SRP

类的 SRP 违反主要影响代码可读性，Agent 的 SRP 违反影响系统稳定性。

**原因：**
- Agent 是自治的，行为更难预测
- Agent 通常有外部副作用（发送邮件、修改数据）
- Agent 的 prompt 修改会改变其行为，而非确定性逻辑修改

### 洞察二：合并比拆分更难

在类设计中，我们通常从一个大类开始，然后拆分。

在 Agent 设计中，**应该从一开始就保持独立**，因为：
- Agent 的 prompt 一旦混合，很难干净地分离
- Agent 可能有独立的状态和记忆
- 合并两个 Agent 的调用链比拆分更复杂

### 洞察三：Agent 的边界应该比类更宽松

类的职责边界应该清晰到"只能做一件事"，但 Agent 的边界可以稍微宽松——

只要它们：
1. 服务于同一用户场景
2. 共享同一上下文
3. 错误处理方式一致

**示例：** 同一个 Agent 处理"查询订单"和"取消订单"——两者共享订单上下文，可以合并

### 洞察四：延迟是 SRP 的隐性成本

严格遵循 SRP 可能导致 Agent 之间频繁的 RPC 调用。

**权衡：**
- 如果两个 Agent 总是同时调用，考虑合并
- 如果它们独立演进，保持分离
- 使用异步消息降低延迟感知

---

## 实战代码示例

### 项目结构

一个遵循 SRP 的 Agent 项目通常有以下几个目录：

```text
/agents              # 一个文件 = 一个 Agent，文件名即 Agent 名
    email_agent.py
    calendar_agent.py
    notification_agent.py
/shared              # 所有 Agent 共用的代码和配置
    prompts/         # prompt 模板，按领域组织
    tools/          # 工具函数，供各 Agent 调用
    models.py       # 模型配置
/orchestrators      # 编排逻辑：协调多个 Agent 的工作流
    meeting_orchestrator.py
    onboarding_orchestrator.py
/tests
    agents/         # 每个 Agent 的独立测试
    workflows/      # 编排器的集成测试
```

这种结构的核心理念：**每个 Agent 独立演进，互不感知对方的内部实现，只通过 Orchestrator 协调。** 当 `EmailAgent` 的 prompt 需要调整时，只需要修改那一个文件，不会意外影响 `CalendarAgent`。

### 基础 Agent 类

下面是一个最小化的 `BaseAgent` 抽象类，定义了所有单一职责 Agent 的共同循环：

```python
from abc import ABC, abstractmethod
from typing import Any

class BaseAgent(ABC):
    def __init__(self, name: str, model: str = "gpt-4o"):
        self.name = name
        self.model = model
        self.messages = []

    def receive_message(self, msg: dict) -> None:
        """接收一条消息，加入对话历史"""
        self.messages.append(msg)

    @abstractmethod
    def think(self) -> str:
        """核心推理逻辑：子类必须实现"""
        pass

    @abstractmethod
    def act(self, reasoning: str) -> dict:
        """根据推理结果执行动作：调用工具或返回文本"""
        pass

    def update_state(self, result: dict) -> None:
        """更新 Agent 内部状态（可选）"""
        pass

    def run(self, user_message: str) -> dict:
        """完整循环：收消息 → 推理 → 行动 → 更新状态"""
        self.receive_message({"role": "user", "content": user_message})
        reasoning = self.think()
        result = self.act(reasoning)
        self.update_state(result)
        return result
```

关键设计点：子类只需实现 `think()` 和 `act()`，无需关心消息收发和状态管理的共同逻辑——这是 `BaseAgent` 的职责，不是子类的。

### 邮件 Agent（单一职责示例）

`EmailAgent` 只处理邮件相关操作。它的 prompt 简洁、工具列表短、错误处理统一。

```python
class EmailAgent(BaseAgent):
    SYSTEM_PROMPT = """你是一个专业的邮件助手。
你的职责范围：阅读、搜索、发送、回复邮件。
超出邮件范畴的请求，你应该礼貌拒绝，或建议用户联系相应的专业 Agent。"""

    TOOLS = ["send_email", "read_email", "search_emails", "reply_email"]

    def think(self) -> str:
        # 只基于邮件上下文进行推理
        return self.llm.complete(
            messages=self.messages,
            system=self.SYSTEM_PROMPT,
            tools=self.TOOLS
        )

    def act(self, reasoning: dict) -> dict:
        # 邮件操作的结果更新到邮箱状态
        return self.execute_tool(reasoning)
```

**CUBE 原则在这个 Agent 上的体现：**
- **Context（上下文）**：邮件系统，包括收件箱、发件箱、草稿箱
- **User（用户）**：需要邮件协作的内部员工
- **Business（业务）**：邮件的发送、阅读、归档
- **Error（错误）**：发送失败、超时、收件人无效，都在邮件层处理

它不会去查日历、不会去写文档、更不会去做代码审查——这些是其他 Agent 的事。

### 日程 Agent（另一个单一职责示例）

`CalendarAgent` 与 `EmailAgent` 平行设计，只处理日程相关操作。

```python
class CalendarAgent(BaseAgent):
    SYSTEM_PROMPT = """你是一个专业的日程助手。
你的职责范围：创建日程、检查可用性、发送邀请、取消日程。
超出日程范畴的请求，你应该礼貌拒绝，或建议用户联系相应的专业 Agent。"""

    TOOLS = ["create_event", "check_availability", "send_invite", "cancel_event"]

    def think(self) -> str:
        return self.llm.complete(
            messages=self.messages,
            system=self.SYSTEM_PROMPT,
            tools=self.TOOLS
        )

    def act(self, reasoning: dict) -> dict:
        return self.execute_tool(reasoning)
```

**CUBE 原则检验：**
- **Context（上下文）**：日历系统，包括个人日程、会议室、共享日历
- **User（用户）**：内部员工（与 EmailAgent 一致）
- **Business（业务）**：日程的创建、查询、修改、取消
- **Error（错误）**：时间冲突、会议室不可用、邀请超时

如果需要"安排会议并通知参与者"，由 Orchestrator 协调 `CalendarAgent` 和 `EmailAgent` 协作——`CalendarAgent` 不直接调用邮件发送功能，这是编排层的职责。

### 编排器（协调多个单一职责 Agent）

`Orchestrator` 持有各专业 Agent 的引用，负责路由和跨 Agent 工作流。

```python
class MeetingOrchestrator:
    def __init__(self):
        self.email_agent = EmailAgent()
        self.calendar_agent = CalendarAgent()

    def handle(self, user_request: str) -> dict:
        # 第一步：意图分类，决定调用哪个 Agent
        intent = self.classify_intent(user_request)

        if intent == "schedule_meeting":
            return self._schedule_meeting(user_request)
        elif intent == "send_email":
            return self.email_agent.run(user_request)
        else:
            return {"error": "无法处理此请求"}

    def _schedule_meeting(self, request: str) -> dict:
        # 1. 日程 Agent 检查可用性
        availability = self.calendar_agent.run(
            f"检查可用时间：{request}"
        )
        if availability.has_conflict:
            return {"status": "conflict", "details": availability}

        # 2. 创建日程
        event = self.calendar_agent.run(
            f"创建日程：{request}"
        )

        # 3. 邮件 Agent 发送邀请
        invite = self.email_agent.run(
            f"发送会议邀请：{event.title}, {event.time}"
        )

        return {
            "status": "success",
            "event": event,
            "invite_sent": invite.success
        }
```

**编排器的设计原则：它不包含任何业务逻辑，只负责路由和组装。** 业务逻辑都在各个专业 Agent 中。当 `EmailAgent` 需要替换成另一个邮件服务时，只需要修改 `EmailAgent` 一个文件。

### 使用示例

完整的协作流程：以"安排周三下午和张三的会议并发邮件通知他"为例。

```python
orchestrator = MeetingOrchestrator()

result = orchestrator.handle(
    "帮我安排周三下午和张三的会议并发邮件通知他"
)

# 内部流程：
# 1. Orchestrator.classify_intent() → "schedule_meeting"
# 2. CalendarAgent.run("检查周三下午张三的可用时间") → 14:00-16:00 有空
# 3. CalendarAgent.run("创建日程：周三下午 3 点，与张三的会议") → event_id=123
# 4. EmailAgent.run("发送会议邀请：周三下午 3 点会议，邀请张三") → sent=true
# 5. 返回 {"status": "success", "event_id": 123, "invite_sent": true}
```

用户说了一句话，背后是三个专业 Agent 的有序协作。每个 Agent 只做一件事，但组合起来完成了一个完整的业务动作。这就是 SRP 在 Agent 时代的意义：**粒度细到每个 Agent 职责单一，协作复杂到能完成真实业务。**

---

## 结语

单一职责原则从类到 Agent 的升维，本质上是软件复杂性的升维。

### 关键要点回顾

1. **一个 Agent 一个职责**：不是限制，而是解放
2. **CUBE 原则**：Context、User、Business、Error 定义边界
3. **四种协作模式**：Pipeline、Master-Worker、Blackboard、Service Mesh
4. **警惕反模式**：上帝 Agent 和面条 Agent 都是噩梦
5. **延迟是隐性成本**：SRP 不是越细越好，要平衡通信开销

### 最后的建议

**从简单开始，按需拆分。**

不要一开始就设计 20 个 Agent。从一个 Email Agent 开始，当它变得臃肿时，再拆分出 Notification Agent 和 Contact Agent。

记住：**合并容易，拆分难。但在 Agent 世界里，一开始就保持独立比事后拆分更容易。**

---

> *"简单是复杂的终极形态。"* —— 达芬奇

---

**系列文章：** [Agent 操作系统系列](/series/agent-os)

**相关阅读：**
- [Agent 的自治边界：何时该停止，何时该求助](/agent-autonomy-boundaries/)
- [Workflow vs Agent：自动化工作流与自主代理的设计哲学](/workflow-vs-agent/)

---

*如果你在设计 Agent 系统时遇到了职责划分的困惑，欢迎在评论区分享你的场景。*
