---
layout: post
title: "单一职责的升维：从类到 Agent"
date: 2026-03-15 09:00:00 +0800
categories: [Agent Design, Software Architecture]
tags: [SRP, Agent Architecture, Design Patterns, Modular AI]
series: agent-os
---

> **TL;DR**
>
> 一个类只有一个变化原因，一个Agent只有一个职责。单一职责原则（SRP）是面向对象设计的基石，但在AI Agent时代，它的边界被重新定义了。本文将SRP从"类"升维到"Agent"，揭示为什么一个混乱的Agent比混乱的类更难维护，并提供可落地的设计原则与代码示例。

---

## 📋 本文结构

1. [单一职责原则（SRP）回顾](#3-单一职责原则srp回顾)
2. [为什么 SRP 重要](#4-为什么-srp-重要)
3. [从类到 Agent：SRP 的升维](#5-从类到-agentsrp-的升维)
4. [设计单一职责的 Agent](#6-设计单一职责的-agent)
5. [反模式：上帝 Agent 与面条 Agent](#7-反模式上帝-agent-与面条-agent)
6. [反直觉洞察](#8-反直觉洞察)
7. [实战代码示例](#9-实战代码示例)
8. [结语](#10-结语)

---

## 3. 单一职责原则（SRP）回顾

### 定义

Robert C. Martin 在《敏捷软件开发》中定义：

> **一个类应该只有一个引起它变化的原因。**

注意，这里的关键不是"做一件事"，而是"只有一个变化原因"。一个类可以做很多事情，只要这些事情都源于同一个业务规则。

### 经典示例

❌ **违反 SRP：**
```java
class Employee {
    void calculatePay() { ... }      // 会计部门关注
    void reportHours() { ... }       // 人力资源关注  
    void saveToDatabase() { ... }    // 技术部门关注
}
```

✅ **遵循 SRP：**
```java
class PayCalculator { ... }         // 会计部门
class HourReporter { ... }          // 人力资源
class EmployeeRepository { ... }    // 技术部门
```

---

## 4. 为什么 SRP 重要

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

## 5. 从类到 Agent：SRP 的升维

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

### 核心原则

> **一个 Agent 只有一个职责，并且这个职责应该是完整的、内聚的。**

这不是类的简单放大，而是对"职责"的重新定义。

---

## 6. 设计单一职责的 Agent

### 6.1 粒度选择

选择 Agent 的粒度就像切蛋糕——太大或太小都不行。

#### 太粗：一个 Agent 包揽所有

```
┌─────────────────────────────────────┐
│           万能 Agent                 │
│  ┌────────┐ ┌────────┐ ┌────────┐  │
│  │ 搜索   │ │ 分析   │ │ 写作   │  │
│  │ 邮件   │ │ 日历   │ │ 文件   │  │
│  └────────┘ └────────┘ └────────┘  │
└─────────────────────────────────────┘
```

**问题：**
- Prompt 变得冗长复杂
- 上下文窗口被稀释
- 难以调试"它为什么这样做"
- 修改邮件功能可能影响写作功能

#### 太细：每个小功能一个 Agent

```
Agent-发邮件 → Agent-写标题 → Agent-写正文 → Agent-检查拼写 → Agent-发送
```

**问题：**
- 通信开销爆炸
- 延迟无法忍受
- 系统复杂度超过收益

#### 正好：按业务边界划分

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ 邮件管理 Agent │    │ 日程协调 Agent │    │ 文档处理 Agent │
│  - 读取邮件   │    │  - 查询空闲   │    │  - 创建文档   │
│  - 撰写回复   │    │  - 安排会议   │    │  - 编辑内容   │
│  - 发送邮件   │    │  - 处理冲突   │    │  - 导出格式   │
└──────────────┘    └──────────────┘    └──────────────┘
```

### 6.2 边界定义：CUBE 原则

我提出 **CUBE** 原则来定义 Agent 边界：

| 维度 | 说明 | 示例 |
|------|------|------|
| **C**ontext | 上下文一致 | 邮件 Agent 只关心邮件上下文 |
| **U**ser | 用户角色一致 | 面向内部员工的 vs 面向客户的 |
| **B**usiness | 业务领域一致 | 财务、人事、营销分开 |
| **E**rror | 错误处理一致 | 同类型错误在同一层处理 |

### 6.3 协作模式

#### 模式一：管道模式（Pipeline）

```
输入 → [Agent A] → [Agent B] → [Agent C] → 输出
         ↓            ↓            ↓
       提取         分析         生成
```

**适用场景：** 数据流清晰、步骤固定的任务

**示例：** 新闻摘要系统
```
抓取 Agent → 提取 Agent → 分析 Agent → 摘要 Agent → 发布 Agent
```

#### 模式二：主从模式（Master-Worker）

```
         ┌→ [Worker A]
[Master] ┼→ [Worker B]
         └→ [Worker C]
```

**适用场景：** 需要协调多个专业 Agent

**示例：** 会议安排系统
```
协调 Agent (Master)
    ├→ 日历查询 Agent
    ├→ 会议室预订 Agent  
    └→ 通知发送 Agent
```

#### 模式三：黑板模式（Blackboard）

```
         ┌─ [Agent A] ─┐
[黑板/共享状态] ←┼─ [Agent B] ─┼→ [黑板/共享状态]
         └─ [Agent C] ─┘
```

**适用场景：** 复杂问题求解，各 Agent 贡献部分解

**示例：** 代码审查系统
```
黑板：代码 + 审查意见
    ├→ 安全审查 Agent (添加安全相关意见)
    ├→ 性能审查 Agent (添加性能相关意见)
    └→ 风格审查 Agent (添加风格相关意见)
```

#### 模式四：服务网格模式（Service Mesh）

```
[Agent A] ←──→ [Agent B]
    ↑              ↑
    └────[总线]────┘
```

**适用场景：** 高度解耦、动态协作的系统

---

## 7. 反模式：上帝 Agent 与面条 Agent

### 7.1 上帝 Agent（God Agent）

**症状：**
- Prompt 超过 2000 tokens
- 工具列表像电话簿一样长
- "你什么都能做"
- 每次修改都要动 prompt

**示例：**
```python
# ❌ 上帝 Agent
class UniversalAgent:
    """
    你是一个万能助手，可以：
    1. 处理邮件（读取、撰写、发送、归档）
    2. 管理日程（查询、创建、修改、删除）
    3. 操作文件（创建、编辑、删除、搜索）
    4. 网络搜索（Google、百度、Bing）
    5. 数据分析（CSV、Excel、JSON）
    6. 代码编写（Python、JavaScript、Go）
    7. 代码审查（安全、性能、风格）
    8. 系统管理（SSH、Docker、K8s）
    ...
    请根据用户输入判断需要做什么。
    """
```

**问题：**
- LLM 难以精确理解"现在该用哪个能力"
- 上下文被稀释，响应质量下降
- 一个功能的 bug 可能影响整个 Agent
- 难以测试和复用

### 7.2 面条 Agent（Spaghetti Agent）

**症状：**
- Agent 之间随意相互调用
- 调用链深度超过 5 层
- 循环依赖
- 不知道哪个 Agent 最终处理了请求

**示例：**
```python
# ❌ 面条式调用
class AgentA:
    def process(self, task):
        if task.type == "X":
            return AgentB().process(task)  # A → B
        return self.handle(task)

class AgentB:
    def process(self, task):
        if task.needs_more_info:
            return AgentA().process(task)  # B → A (循环!)
        return AgentC().process(task)    # B → C

class AgentC:
    def process(self, task):
        if task.is_complex:
            return AgentA().process(task)  # C → A (另一个循环!)
        return self.handle(task)
```

**问题：**
- 调试时 stack trace 像迷宫
- 循环调用导致无限递归
- 无法预测性能
- 系统行为不可控

### 7.3 正确的层次结构

```
┌─────────────────────────────────────┐
│          编排层 (Orchestrator)        │  ← 不做具体工作，只做协调
│         "让合适的 Agent 做合适的事"      │
├─────────────────────────────────────┤
│    邮件 Agent  │  日程 Agent  │  文件 Agent  │  ← 业务 Agent
├─────────────────────────────────────┤
│  LLM Client │ Search Tool │ File System │  ← 工具层
└─────────────────────────────────────┘
```

---

## 8. 反直觉洞察

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

**示例：**
```
邮件 Agent 可以同时处理：
- 读取邮件
- 撰写回复
- 发送邮件
- 归档邮件

因为这些都是"邮件管理"这一职责的子任务。
```

### 洞察四：延迟是 SRP 的隐性成本

严格遵循 SRP 可能导致 Agent 之间频繁的 RPC 调用。

**权衡：**
- 如果两个 Agent 总是同时调用，考虑合并
- 如果它们独立演进，保持分离
- 使用异步消息降低延迟感知

---

## 9. 实战代码示例

### 9.1 项目结构

```
agent_system/
├── agents/
│   ├── __init__.py
│   ├── base.py          # 基础 Agent 类
│   ├── email_agent.py   # 邮件 Agent
│   ├── calendar_agent.py # 日程 Agent
│   └── orchestrator.py  # 编排器
├── tools/
│   ├── email_client.py
│   └── calendar_client.py
└── main.py
```

### 9.2 基础 Agent 类

```python
# agents/base.py
from abc import ABC, abstractmethod
from typing import Any, Dict
from dataclasses import dataclass

@dataclass
class AgentContext:
    """Agent 执行上下文"""
    user_id: str
    session_id: str
    metadata: Dict[str, Any]

@dataclass  
class AgentResult:
    """Agent 执行结果"""
    success: bool
    data: Any
    error: str = None

class BaseAgent(ABC):
    """
    单一职责 Agent 的基类。
    
    每个子类应该：
    1. 只有一个明确的职责
    2. 只处理与之相关的工具
    3. 明确的输入输出契约
    """
    
    def __init__(self, name: str, context: AgentContext):
        self.name = name
        self.context = context
        self._tools = []
    
    @property
    @abstractmethod
    def description(self) -> str:
        """Agent 职责描述，用于编排器选择"""
        pass
    
    @property
    @abstractmethod
    def capabilities(self) -> list:
        """Agent 能力列表"""
        pass
    
    @abstractmethod
    async def execute(self, intent: str, params: Dict[str, Any]) -> AgentResult:
        """执行核心逻辑"""
        pass
    
    def can_handle(self, intent: str) -> bool:
        """判断是否能处理该意图"""
        return any(cap in intent.lower() for cap in self.capabilities)
```

### 9.3 邮件 Agent（单一职责示例）

```python
# agents/email_agent.py
from typing import Any, Dict, List
import json
from .base import BaseAgent, AgentContext, AgentResult

class EmailAgent(BaseAgent):
    """
    单一职责：处理所有与邮件相关的任务
    
    包括：
    - 读取/搜索邮件
    - 撰写邮件
    - 发送邮件
    - 管理邮件标签/归档
    
    不包括：
    - 管理日程（交给 CalendarAgent）
    - 处理文件（交给 FileAgent）
    """
    
    def __init__(self, context: AgentContext, email_client):
        super().__init__("EmailAgent", context)
        self.email_client = email_client
    
    @property
    def description(self) -> str:
        return """
        我是邮件管理专家，负责处理所有邮件相关任务：
        - 读取收件箱和特定邮件
        - 搜索历史邮件
        - 撰写和发送邮件
        - 管理邮件标签和归档
        """
    
    @property
    def capabilities(self) -> list:
        return ["email", "mail", "inbox", "send", "compose"]
    
    async def execute(self, intent: str, params: Dict[str, Any]) -> AgentResult:
        """
        根据意图路由到具体方法
        """
        try:
            action = self._classify_intent(intent)
            
            if action == "read":
                return await self._read_emails(params)
            elif action == "search":
                return await self._search_emails(params)
            elif action == "compose":
                return await self._compose_email(params)
            elif action == "send":
                return await self._send_email(params)
            elif action == "archive":
                return await self._archive_email(params)
            else:
                return AgentResult(
                    success=False,
                    data=None,
                    error=f"Unknown email action: {action}"
                )
        except Exception as e:
            return AgentResult(success=False, data=None, error=str(e))
    
    def _classify_intent(self, intent: str) -> str:
        """将自然语言意图分类为具体动作"""
        intent_lower = intent.lower()
        
        if any(w in intent_lower for w in ["read", "check", "open", "查看", "读取"]):
            return "read"
        elif any(w in intent_lower for w in ["search", "find", "look for", "搜索", "查找"]):
            return "search"
        elif any(w in intent_lower for w in ["write", "compose", "draft", "撰写", "写信"]):
            return "compose"
        elif any(w in intent_lower for w in ["send", "发送"]):
            return "send"
        elif any(w in intent_lower for w in ["archive", "归档", "存档"]):
            return "archive"
        return "unknown"
    
    async def _read_emails(self, params: Dict) -> AgentResult:
        """读取邮件"""
        limit = params.get("limit", 10)
        emails = await self.email_client.get_inbox(limit=limit)
        
        summary = self._summarize_emails(emails)
        return AgentResult(success=True, data={
            "emails": emails,
            "summary": summary
        })
    
    async def _search_emails(self, params: Dict) -> AgentResult:
        """搜索邮件"""
        query = params.get("query", "")
        emails = await self.email_client.search(query)
        
        return AgentResult(success=True, data={
            "query": query,
            "results": emails,
            "count": len(emails)
        })
    
    async def _compose_email(self, params: Dict) -> AgentResult:
        """撰写邮件（不发送）"""
        to = params.get("to")
        subject = params.get("subject", "")
        body = params.get("body", "")
        
        # 这里可以接入 LLM 来优化邮件内容
        draft = {
            "to": to,
            "subject": subject,
            "body": body,
            "draft_id": f"draft_{hash(body) % 10000}"
        }
        
        return AgentResult(success=True, data={
            "draft": draft,
            "ready_to_send": bool(to and subject and body)
        })
    
    async def _send_email(self, params: Dict) -> AgentResult:
        """发送邮件"""
        draft_id = params.get("draft_id")
        
        if draft_id:
            # 从草稿发送
            result = await self.email_client.send_draft(draft_id)
        else:
            # 直接发送
            result = await self.email_client.send(
                to=params.get("to"),
                subject=params.get("subject"),
                body=params.get("body")
            )
        
        return AgentResult(success=True, data={"sent": result})
    
    async def _archive_email(self, params: Dict) -> AgentResult:
        """归档邮件"""
        email_id = params.get("email_id")
        await self.email_client.archive(email_id)
        
        return AgentResult(success=True, data={"archived": email_id})
    
    def _summarize_emails(self, emails: List[Dict]) -> str:
        """生成邮件摘要"""
        unread = sum(1 for e in emails if not e.get("read", True))
        return f"共 {len(emails)} 封邮件，其中 {unread} 封未读"
```

### 9.4 日程 Agent（另一个单一职责示例）

```python
# agents/calendar_agent.py
from datetime import datetime, timedelta
from typing import Any, Dict
from .base import BaseAgent, AgentContext, AgentResult

class CalendarAgent(BaseAgent):
    """
    单一职责：处理所有与日程相关的任务
    
    包括：
    - 查询空闲时间
    - 创建/修改/删除会议
    - 处理会议冲突
    - 发送会议邀请
    """
    
    def __init__(self, context: AgentContext, calendar_client):
        super().__init__("CalendarAgent", context)
        self.calendar_client = calendar_client
    
    @property
    def description(self) -> str:
        return """
        我是日程管理专家，负责处理所有日程相关任务：
        - 查询空闲时间段
        - 创建、修改、取消会议
        - 处理日程冲突
        - 发送会议邀请
        """
    
    @property
    def capabilities(self) -> list:
        return ["calendar", "schedule", "meeting", "event", "time", "日程", "会议", "约会"]
    
    async def execute(self, intent: str, params: Dict[str, Any]) -> AgentResult:
        action = self._classify_intent(intent)
        
        handlers = {
            "check_availability": self._check_availability,
            "create_event": self._create_event,
            "modify_event": self._modify_event,
            "delete_event": self._delete_event,
            "list_events": self._list_events,
        }
        
        handler = handlers.get(action)
        if handler:
            return await handler(params)
        
        return AgentResult(success=False, data=None, error=f"Unknown action: {action}")
    
    def _classify_intent(self, intent: str) -> str:
        intent_lower = intent.lower()
        
        if any(w in intent_lower for w in ["free", "available", "busy", "空闲", "有空"]):
            return "check_availability"
        elif any(w in intent_lower for w in ["create", "schedule", "book", "创建", "安排"]):
            return "create_event"
        elif any(w in intent_lower for w in ["modify", "reschedule", "change", "修改", "改期"]):
            return "modify_event"
        elif any(w in intent_lower for w in ["delete", "cancel", "删除", "取消"]):
            return "delete_event"
        elif any(w in intent_lower for w in ["list", "show", "查看", "列出"]):
            return "list_events"
        return "unknown"
    
    async def _check_availability(self, params: Dict) -> AgentResult:
        """检查空闲时间"""
        date = params.get("date", datetime.now())
        duration_minutes = params.get("duration", 60)
        
        events = await self.calendar_client.get_events(date)
        free_slots = self._find_free_slots(events, duration_minutes)
        
        return AgentResult(success=True, data={
            "date": date,
            "free_slots": free_slots,
            "requested_duration": duration_minutes
        })
    
    async def _create_event(self, params: Dict) -> AgentResult:
        """创建会议"""
        event = {
            "title": params.get("title"),
            "start_time": params.get("start_time"),
            "end_time": params.get("end_time"),
            "attendees": params.get("attendees", []),
            "location": params.get("location"),
            "description": params.get("description")
        }
        
        # 检查冲突
        conflicts = await self._check_conflicts(event)
        if conflicts:
            return AgentResult(
                success=False,
                data={"conflicts": conflicts},
                error="Time slot conflicts detected"
            )
        
        created = await self.calendar_client.create_event(event)
        return AgentResult(success=True, data={"event": created})
    
    def _find_free_slots(self, events: list, duration: int) -> list:
        """从已有事件中找到空闲时间段"""
        # 实现空闲时间查找算法
        pass
    
    async def _check_conflicts(self, event: Dict) -> list:
        """检查时间冲突"""
        existing = await self.calendar_client.get_events(event["start_time"])
        conflicts = []
        for e in existing:
            if self._time_overlaps(e, event):
                conflicts.append(e)
        return conflicts
    
    def _time_overlaps(self, event1: Dict, event2: Dict) -> bool:
        """判断两个事件是否时间重叠"""
        start1 = event1["start_time"]
        end1 = event1["end_time"]
        start2 = event2["start_time"]
        end2 = event2["end_time"]
        return start1 < end2 and start2 < end1
```

### 9.5 编排器（协调多个单一职责 Agent）

```python
# agents/orchestrator.py
from typing import List, Dict, Any
from .base import BaseAgent, AgentContext, AgentResult

class Orchestrator:
    """
    编排器：负责协调多个单一职责的 Agent。
    
    编排器本身也遵循 SRP：
    - 不负责具体业务逻辑
    - 只负责：意图识别、Agent 选择、结果聚合
    """
    
    def __init__(self, context: AgentContext):
        self.context = context
        self.agents: List[BaseAgent] = []
        self.execution_history: List[Dict] = []
    
    def register_agent(self, agent: BaseAgent):
        """注册 Agent"""
        self.agents.append(agent)
    
    async def process(self, user_input: str) -> AgentResult:
        """
        处理用户输入，选择合适的 Agent 执行
        """
        # 1. 意图识别
        intent = self._parse_intent(user_input)
        
        # 2. 选择合适的 Agent
        selected_agents = self._select_agents(intent)
        
        if not selected_agents:
            return AgentResult(
                success=False,
                data=None,
                error=f"No agent can handle intent: {intent['action']}"
            )
        
        # 3. 执行（简单场景：只选一个最合适的）
        if len(selected_agents) == 1:
            agent = selected_agents[0]
            result = await agent.execute(intent["action"], intent["params"])
            
            self.execution_history.append({
                "input": user_input,
                "agent": agent.name,
                "result": result
            })
            
            return result
        
        # 4. 复杂场景：需要多个 Agent 协作
        return await self._coordinate_agents(selected_agents, intent)
    
    def _parse_intent(self, user_input: str) -> Dict[str, Any]:
        """
        解析用户意图
        
        在实际系统中，这里可能使用 LLM 进行意图识别
        """
        # 简化版：关键词匹配
        intent = {"action": user_input, "params": {}}
        
        # 提取参数（简化版）
        if "明天" in user_input:
            intent["params"]["date"] = "tomorrow"
        if "10点" in user_input:
            intent["params"]["time"] = "10:00"
        
        return intent
    
    def _select_agents(self, intent: Dict) -> List[BaseAgent]:
        """选择能处理该意图的 Agent"""
        action = intent["action"].lower()
        
        candidates = []
        for agent in self.agents:
            if agent.can_handle(action):
                candidates.append(agent)
        
        # 按匹配度排序（简化版：按 capabilities 匹配数量）
        candidates.sort(
            key=lambda a: sum(1 for c in a.capabilities if c in action),
            reverse=True
        )
        
        return candidates
    
    async def _coordinate_agents(self, agents: List[BaseAgent], intent: Dict) -> AgentResult:
        """
        协调多个 Agent 完成复杂任务
        
        示例："安排一个与客户的会议，并发送确认邮件"
        
        这需要：
        1. CalendarAgent - 安排会议
        2. EmailAgent - 发送确认邮件
        """
        results = []
        
        # 按依赖顺序执行
        for agent in agents:
            result = await agent.execute(intent["action"], intent["params"])
            results.append({"agent": agent.name, "result": result})
            
            if not result.success:
                # 失败时回滚或报错
                return AgentResult(
                    success=False,
                    data={"partial_results": results},
                    error=f"Agent {agent.name} failed: {result.error}"
                )
        
        return AgentResult(success=True, data={"results": results})
```

### 9.6 使用示例

```python
# main.py
import asyncio
from agents.base import AgentContext
from agents.email_agent import EmailAgent
from agents.calendar_agent import CalendarAgent
from agents.orchestrator import Orchestrator
from tools.email_client import EmailClient
from tools.calendar_client import CalendarClient

async def main():
    # 创建上下文
    context = AgentContext(
        user_id="user_123",
        session_id="session_456",
        metadata={}
    )
    
    # 创建工具客户端
    email_client = EmailClient()
    calendar_client = CalendarClient()
    
    # 创建单一职责的 Agent
    email_agent = EmailAgent(context, email_client)
    calendar_agent = CalendarAgent(context, calendar_client)
    
    # 创建编排器并注册 Agent
    orchestrator = Orchestrator(context)
    orchestrator.register_agent(email_agent)
    orchestrator.register_agent(calendar_agent)
    
    # 处理用户请求
    
    # 场景 1：检查邮件（EmailAgent 处理）
    result1 = await orchestrator.process("帮我查看最近的邮件")
    print(f"邮件查询结果: {result1.data}")
    
    # 场景 2：查看日程（CalendarAgent 处理）
    result2 = await orchestrator.process("明天有什么会议")
    print(f"日程查询结果: {result2.data}")
    
    # 场景 3：复杂场景（需要多个 Agent 协作）
    # 编排器识别出需要两个 Agent，协调它们完成
    result3 = await orchestrator.process(
        "明天下午 3 点安排一个团队会议，然后给所有人发邮件通知"
    )
    print(f"复杂任务结果: {result3.data}")

if __name__ == "__main__":
    asyncio.run(main())
```

---

## 10. 结语

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
