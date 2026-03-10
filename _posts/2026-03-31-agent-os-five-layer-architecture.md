---
layout: post
title: "Agent OS 的五层架构模型"
date: 2026-03-31T10:00:00+08:00
tags: [AI, Agent, Architecture, System-Design, Technical]
author: Aaron
series: "Agent-OS-Series"
series_title: "从 SaaS 到 Agent OS"

redirect_from:
  - /2026/03/31/agent-os-five-layer-architecture.html
---

*"架构决定上限，工程决定下限。"
*

---

## TL;DR

- **Agent OS 五层架构**：Tools → Memory → Runtime → Orchestration → Interface
- **每一层的职责**：从连接外部世界到与用户交互的完整链条
- **关键设计决策**：每一层的技术选型和权衡
- **实现路径**：从 MVP 到生产级的演进路线
- **常见陷阱**：数据一致性、延迟、安全等核心挑战

---

## 📋 本文结构

- [为什么需要分层架构？](#为什么需要分层架构)
- [五层架构全景图](#五层架构全景图)
- [Layer 1: Tools & Connectors](#layer-1-tools--connectors)
- [Layer 2: Memory & State](#layer-2-memory--state)
- [Layer 3: Agent Runtime](#layer-3-agent-runtime)
- [Layer 4: Orchestration](#layer-4-orchestration)
- [Layer 5: Interface](#layer-5-interface)
- [实现路径：从 MVP 到生产](#实现路径从-mvp-到生产)
- [写在最后](#写在最后)

---

## 为什么需要分层架构？

### Agent 系统的复杂性

构建一个生产级的 Agent 系统，你需要处理：

- **外部连接**：API、数据库、第三方系统
- **记忆管理**：短期记忆、长期记忆、知识图谱
- **推理能力**：规划、执行、反思、学习
- **多 Agent 协作**：任务分配、通信、冲突解决
- **用户交互**：自然语言理解、界面呈现

如果把这些都耦合在一起，系统会变得：
- 难以维护
- 难以扩展
- 难以调试
- 难以测试

### 分层架构的优势

| 优势 | 说明 |
|------|------|
| **关注点分离** | 每层只解决一类问题 |
| **可替换性** | 可以独立升级某一层的技术栈 |
| **可测试性** | 每层可以独立测试 |
| **团队协作** | 不同团队可以并行开发不同层 |

---

## 五层架构全景图

```
┌─────────────────────────────────────────────────────────┐
│  Layer 5: Interface Layer                               │
│  用户交互层：自然语言接口、命令行、轻量 GUI              │
├─────────────────────────────────────────────────────────┤
│  Layer 4: Orchestration Layer                           │
│  编排层：多 Agent 协作、工作流管理、任务调度             │
├─────────────────────────────────────────────────────────┤
│  Layer 3: Agent Runtime Layer                           │
│  运行时层：推理循环、工具调用、错误处理                  │
├─────────────────────────────────────────────────────────┤
│  Layer 2: Memory & State Layer                          │
│  记忆层：短期记忆、长期记忆、知识图谱、状态管理          │
├─────────────────────────────────────────────────────────┤
│  Layer 1: Tools & Connectors Layer                      │
│  工具层：API 连接、数据读写、外部系统交互                │
└─────────────────────────────────────────────────────────┘
```

**数据流向：**

```
User Input → Interface → Orchestration → Runtime → Memory ↔ Tools
                                              ↑___________|
```

---

## Layer 1: Tools & Connectors

### 职责

- 连接外部系统（CRM、ERP、数据库、API）
- 执行具体操作（读取、写入、调用）
- 处理认证、授权、限流
- 数据格式转换

### 核心组件

**1. Connector Registry**

管理所有可用的连接器和工具：

```python
class ConnectorRegistry:
    def __init__(self):
        self.connectors = {}
    
    def register(self, name: str, connector: Connector):
        self.connectors[name] = connector
    
    def get(self, name: str) -> Connector:
        return self.connectors.get(name)
    
    def list_available(self) -> List[str]:
        return list(self.connectors.keys())
```

**2. Base Connector 接口**

```python
class BaseConnector(ABC):
    @abstractmethod
    def authenticate(self, credentials: dict) -> bool:
        """认证连接"""
        pass
    
    @abstractmethod
    def execute(self, action: str, params: dict) -> Result:
        """执行操作"""
        pass
    
    @abstractmethod
    def get_schema(self) -> Schema:
        """获取数据结构"""
        pass
```

**3. 具体 Connector 示例**

```python
class SalesforceConnector(BaseConnector):
    def execute(self, action: str, params: dict) -> Result:
        if action == "create_lead":
            return self.create_lead(params)
        elif action == "update_opportunity":
            return self.update_opportunity(params)
        # ...
    
    def create_lead(self, params: dict) -> Result:
        # 调用 Salesforce API
        response = self.client.Lead.create(params)
        return Result(success=True, data=response)
```

### 关键技术决策

| 决策 | 选项 | 建议 |
|------|------|------|
| **协议支持** | REST、GraphQL、gRPC | 优先 REST，GraphQL 用于复杂查询 |
| **认证方式** | OAuth 2.0、API Key、JWT | 根据外部系统选择 |
| **错误处理** | 重试、熔断、降级 | 必须实现熔断器 |
| **限流** | 令牌桶、漏桶 | API 调用必须限流 |

### 实践建议

1. **工具描述**：每个 connector 需要提供自然语言描述，让 Agent 知道它能做什么
2. **参数验证**：严格的输入验证，防止错误参数导致的问题
3. **幂等性**：关键操作必须是幂等的，防止重复执行
4. **审计日志**：所有操作都要记录，便于调试和合规

---

## Layer 2: Memory & State

### 职责

- 存储和管理 Agent 的记忆
- 维护对话上下文
- 持久化用户偏好和业务知识
- 管理 Agent 的状态

### 记忆类型

```
┌─────────────────────────────────────────────┐
│           Memory Hierarchy                  │
├─────────────────────────────────────────────┤
│  Working Memory (工作记忆)                   │
│  • 当前对话上下文                            │
│  • 活跃任务状态                              │
│  • 临时变量                                  │
│  生命周期：会话级                            │
├─────────────────────────────────────────────┤
│  Short-term Memory (短期记忆)                │
│  • 近期对话历史                              │
│  • 最近执行的操作                            │
│  • 临时学习的内容                            │
│  生命周期：小时-天级                         │
├─────────────────────────────────────────────┤
│  Long-term Memory (长期记忆)                 │
│  • 用户偏好                                  │
│  • 业务规则                                  │
│  • 历史成功案例                              │
│  生命周期：永久                              │
├─────────────────────────────────────────────┤
│  Knowledge Graph (知识图谱)                  │
│  • 实体关系                                  │
│  • 业务概念                                  │
│  • 组织信息                                  │
│  生命周期：永久                              │
└─────────────────────────────────────────────┘
```

### 实现方案

**1. Working Memory**

```python
class WorkingMemory:
    """工作记忆：当前会话的上下文"""
    
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.context_window = []  # 最近 N 轮对话
        self.active_tasks = {}    # 当前执行的任务
        self.variables = {}       # 临时变量
    
    def add_to_context(self, message: Message):
        self.context_window.append(message)
        # 保持窗口大小
        if len(self.context_window) > MAX_CONTEXT_SIZE:
            self.context_window.pop(0)
    
    def get_context(self) -> List[Message]:
        return self.context_window
```

**2. Short-term Memory**

使用 Vector DB 存储：

```python
class ShortTermMemory:
    """短期记忆：可检索的近期信息"""
    
    def __init__(self, vector_store: VectorStore):
        self.vector_store = vector_store
    
    def store(self, content: str, metadata: dict):
        """存储记忆"""
        embedding = self.embed(content)
        self.vector_store.add(
            id=generate_id(),
            embedding=embedding,
            content=content,
            metadata=metadata,
            timestamp=now()
        )
    
    def retrieve(self, query: str, k: int = 5) -> List[Memory]:
        """检索相关记忆"""
        query_embedding = self.embed(query)
        return self.vector_store.search(
            query_embedding, 
            k=k,
            filter={"timestamp": {">": now() - timedelta(days=7)}}
        )
```

**3. Long-term Memory**

使用关系型数据库 + 缓存：

```python
class LongTermMemory:
    """长期记忆：用户偏好和业务知识"""
    
    def __init__(self, db: Database, cache: Cache):
        self.db = db
        self.cache = cache
    
    def get_user_preference(self, user_id: str, key: str):
        # 先查缓存
        cached = self.cache.get(f"user:{user_id}:pref:{key}")
        if cached:
            return cached
        
        # 再查数据库
        value = self.db.query(
            "SELECT value FROM user_preferences WHERE user_id = ? AND key = ?",
            user_id, key
        )
        
        # 写入缓存
        self.cache.set(f"user:{user_id}:pref:{key}", value)
        return value
    
    def update_user_preference(self, user_id: str, key: str, value: any):
        self.db.execute(
            "INSERT OR REPLACE INTO user_preferences (user_id, key, value) VALUES (?, ?, ?)",
            user_id, key, value
        )
        self.cache.set(f"user:{user_id}:pref:{key}", value)
```

**4. Knowledge Graph**

使用图数据库：

```python
class KnowledgeGraph:
    """知识图谱：实体和关系"""
    
    def __init__(self, graph_db: GraphDatabase):
        self.graph = graph_db
    
    def add_entity(self, entity: Entity):
        """添加实体"""
        self.graph.run("""
            MERGE (e:Entity {id: $id})
            SET e.name = $name, e.type = $type
        """, id=entity.id, name=entity.name, type=entity.type)
    
    def add_relation(self, from_id: str, relation: str, to_id: str):
        """添加关系"""
        self.graph.run("""
            MATCH (a:Entity {id: $from_id})
            MATCH (b:Entity {id: $to_id})
            MERGE (a)-[r:$relation]->(b)
        """, from_id=from_id, to_id=to_id, relation=relation)
    
    def query(self, start_entity: str, relation_type: str, depth: int = 2):
        """查询关系"""
        return self.graph.run("""
            MATCH path = (start:Entity {id: $start})-[:$relation*1..$depth]-(related)
            RETURN related, path
        """, start=start_entity, relation=relation_type, depth=depth)
```

### 关键技术决策

| 组件 | 技术选型 | 理由 |
|------|----------|------|
| **Vector DB** | Pinecone / Milvus / PGVector | 根据规模和成本选择 |
| **图数据库** | Neo4j / Dgraph / Amazon Neptune | Neo4j 生态最成熟 |
| **缓存** | Redis / Memcached | Redis 支持更多数据结构 |
| **主数据库** | PostgreSQL / MySQL | 根据团队熟悉度选择 |

---

## Layer 3: Agent Runtime

### 职责

- 管理 Agent 的生命周期
- 执行推理循环（Observation → Thought → Action）
- 调用工具并处理结果
- 处理错误和异常
- 管理上下文窗口

### 核心组件

**1. ReAct Loop（推理-行动循环）**

```python
class ReActRuntime:
    """
    ReAct: Reasoning and Acting
    思考 → 行动 → 观察 → 重复
    """
    
    def __init__(self, llm: LLM, tools: ToolRegistry, memory: MemorySystem):
        self.llm = llm
        self.tools = tools
        self.memory = memory
    
    def run(self, task: str, max_iterations: int = 10) -> Result:
        context = self.memory.get_context()
        
        for i in range(max_iterations):
            # 1. 思考（Reasoning）
            thought = self.think(task, context)
            
            # 2. 决定行动（Action Decision）
            action = self.decide_action(thought)
            
            if action.type == "FINISH":
                return Result(success=True, output=action.output)
            
            # 3. 执行行动（Acting）
            observation = self.execute_action(action)
            
            # 4. 更新上下文
            context.add_step(thought, action, observation)
            
            # 5. 检查是否需要人工介入
            if self.needs_human_intervention(context):
                return Result(
                    success=False, 
                    status="NEEDS_APPROVAL",
                    context=context
                )
        
        return Result(success=False, status="MAX_ITERATIONS_REACHED")
    
    def think(self, task: str, context: Context) -> Thought:
        """让 LLM 思考下一步"""
        prompt = self.build_thought_prompt(task, context)
        return self.llm.generate(prompt)
    
    def decide_action(self, thought: Thought) -> Action:
        """根据思考决定行动"""
        # 解析 LLM 输出，确定是调用工具还是完成任务
        pass
    
    def execute_action(self, action: Action) -> Observation:
        """执行行动并观察结果"""
        if action.tool:
            tool = self.tools.get(action.tool)
            return tool.execute(action.params)
        return Observation(content="No tool called")
```

**2. Plan-and-Execute（计划-执行模式）**

适合复杂多步骤任务：

```python
class PlanAndExecuteRuntime:
    """
    先制定计划，再逐步执行
    """
    
    def run(self, task: str) -> Result:
        # 1. 制定计划
        plan = self.create_plan(task)
        
        # 2. 执行计划
        for step in plan.steps:
            result = self.execute_step(step)
            
            if not result.success:
                # 重新规划
                plan = self.replan(plan, step, result)
        
        return Result(success=True, output=self.compile_results())
    
    def create_plan(self, task: str) -> Plan:
        """让 LLM 制定执行计划"""
        prompt = f"""
        Task: {task}
        
        Create a step-by-step plan to accomplish this task.
        Available tools: {self.tools.list_available()}
        
        Plan:
        """
        plan_text = self.llm.generate(prompt)
        return self.parse_plan(plan_text)
```

**3. Reflection（反思改进）**

```python
class ReflectionCapability:
    """
    让 Agent 能够反思自己的错误并改进
    """
    
    def reflect(self, task: str, actions: List[Action], result: Result) -> Lessons:
        """反思执行过程"""
        prompt = f"""
        Task: {task}
        Actions taken: {actions}
        Result: {result}
        
        Analyze what went well and what could be improved.
        Provide specific lessons for future similar tasks.
        """
        reflection = self.llm.generate(prompt)
        return self.parse_lessons(reflection)
    
    def apply_lessons(self, lessons: Lessons, future_tasks: List[str]):
        """将经验教训应用到未来任务"""
        for task in future_tasks:
            if self.is_similar(task, lessons.original_task):
                task.add_context(f"Previous lesson: {lessons.summary}")
```

### 关键技术决策

| 决策 | 建议 |
|------|------|
| **Runtime 模式** | 从 ReAct 开始，复杂任务用 Plan-and-Execute |
| **迭代限制** | 默认 10 次，防止无限循环 |
| **错误处理** | 区分可恢复错误和致命错误 |
| **人工介入** | 高风险操作必须人工确认 |
| **超时控制** | 单次 LLM 调用 < 30s，整体任务 < 5min |

---

## Layer 4: Orchestration

### 职责

- 管理多个 Agent 的协作
- 任务分解和分配
- 处理 Agent 之间的通信
- 解决冲突和竞争条件
- 监控执行进度

### 多 Agent 架构模式

**模式 1：主管-工作者（Supervisor-Workers）**

```
┌─────────────────┐
│   Supervisor    │  负责：任务分解、分配、汇总
│     Agent       │
└────────┬────────┘
         │
    ┌────┼────┬────────┐
    ↓    ↓    ↓        ↓
┌─────┐┌─────┐┌─────┐┌─────┐
│Work ││Work ││Work ││Work │
│er 1 ││er 2 ││er 3 ││er 4 │
└─────┘└─────┘└─────┘└─────┘
```

**模式 2：平等协作（Peer-to-Peer）**

```
┌─────┐ ←→ ┌─────┐
│Agent│    │Agent│
│  A  │ ←→ │  B  │
└──┬──┘    └──┬──┘
   ↕          ↕
┌──┴──┐    ┌──┴──┐
│Agent│ ←→ │Agent│
│  C  │    │  D  │
└─────┘    └─────┘
```

**模式 3：层级结构（Hierarchy）**

```
        ┌─────────┐
        │  CEO    │
        │ Agent   │
        └────┬────┘
       ┌─────┼─────┐
       ↓     ↓     ↓
    ┌────┐┌────┐┌────┐
    │VP 1││VP 2││VP 3│
    └──┬─┘└──┬─┘└──┬─┘
    ┌──┴──┐  │  ┌──┴──┐
    │Team │  │  │Team │
    └─────┘  │  └─────┘
```

### 实现方案

```python
class OrchestrationEngine:
    """
    多 Agent 编排引擎
    """
    
    def __init__(self):
        self.agents = {}
        self.message_bus = MessageBus()
        self.task_queue = TaskQueue()
    
    def register_agent(self, agent_id: str, agent: Agent):
        """注册 Agent"""
        self.agents[agent_id] = agent
        agent.set_message_bus(self.message_bus)
    
    def execute_workflow(self, workflow: Workflow) -> Result:
        """执行工作流"""
        execution_plan = self.create_execution_plan(workflow)
        
        for step in execution_plan:
            if step.type == "SINGLE":
                result = self.execute_single_agent_step(step)
            elif step.type == "PARALLEL":
                result = self.execute_parallel_step(step)
            elif step.type == "CONDITIONAL":
                result = self.execute_conditional_step(step)
            
            if not result.success:
                return self.handle_failure(workflow, step, result)
        
        return Result(success=True)
    
    def execute_parallel_step(self, step: Step) -> Result:
        """并行执行多个 Agent"""
        futures = []
        for agent_id in step.agents:
            agent = self.agents[agent_id]
            future = self.executor.submit(agent.run, step.subtask)
            futures.append((agent_id, future))
        
        # 收集结果
        results = {}
        for agent_id, future in futures:
            results[agent_id] = future.result(timeout=step.timeout)
        
        # 汇总结果
        return self.aggregate_results(results)
    
    def handle_agent_communication(self, from_agent: str, to_agent: str, message: Message):
        """处理 Agent 间通信"""
        if to_agent == "BROADCAST":
            # 广播给所有 Agent
            for agent_id, agent in self.agents.items():
                if agent_id != from_agent:
                    agent.receive_message(message)
        else:
            # 单播
            self.agents[to_agent].receive_message(message)
```

---

## Layer 5: Interface

### 职责

- 接收用户输入（自然语言、命令、点击）
- 展示 Agent 的输出和状态
- 提供人工介入的入口
- 管理用户会话

### 界面形式

**1. 对话式界面（Chat Interface）**

```
┌─────────────────────────────┐
│  💬 Agent Assistant         │
├─────────────────────────────┤
│                             │
│  Agent: 你好！我是你的销售   │
│  助手。今天需要我做什么？    │
│                             │
│  ─────────────────────────  │
│  User: 帮我看看这周要跟进    │
│  的客户                      │
│                             │
│  Agent: 找到 5 个客户需要    │
│  跟进：                      │
│  1. Acme Corp - 合同待签     │
│  2. ...                      │
│                             │
│  [帮我起草邮件] [安排会议]   │
│                             │
├─────────────────────────────┤
│ [输入消息...]        [发送] │
└─────────────────────────────┘
```

**2. 命令式界面（Command Interface）**

```
> /find leads high-value not-contacted 7d
找到 12 个高价值客户，7 天内未联系

> /draft follow-up email
已生成 3 个版本的跟进邮件

> /schedule meeting tomorrow 2pm
已发送会议邀请
```

**3. 嵌入式界面（Embedded Widget）**

在现有 SaaS 界面中添加 AI 助手按钮，点击后弹出对话窗口。

### 关键设计原则

**1. 渐进式披露**
- 默认显示简洁结果
- 可展开查看详细过程
- 保留手动调整入口

**2. 多模态输出**
- 文本：自然语言解释
- 表格：结构化数据
- 图表：趋势和分布
- 卡片：实体信息

**3. 实时反馈**
- 显示 Agent 正在思考
- 展示执行进度
- 允许中途取消

---

## 实现路径：从 MVP 到生产

### Phase 1: MVP（1-2 个月）

**目标**：验证核心概念

**技术栈：**
- Layer 1：3-5 个核心 Connector
- Layer 2：简单数据库存储上下文
- Layer 3：ReAct Runtime + OpenAI GPT-4
- Layer 4：单 Agent，无需编排
- Layer 5：简单 Chat 界面

**关键指标：**
- 能完成 3-5 个核心场景
- 响应时间 < 10s
- 准确率 > 70%

### Phase 2: 产品化（3-6 个月）

**目标**：内部或种子客户试用

**增强：**
- Layer 2：添加 Vector DB 支持长期记忆
- Layer 3：添加错误处理和人工介入
- Layer 4：支持 2-3 个 Agent 协作
- Layer 5：添加命令界面和嵌入式 Widget

**关键指标：**
- 覆盖 80% 核心场景
- 响应时间 < 5s
- 准确率 > 85%
- 用户满意度 > 4/5

### Phase 3: 生产级（6-12 个月）

**目标**：大规模商用

**完善：**
- 所有层都达到生产级标准
- 完整的监控和可观测性
- 安全合规（SOC2、GDPR）
- 多租户支持

**关键指标：**
- 可用性 99.9%
- 响应时间 < 3s
- 准确率 > 90%
- 支持 1000+ 并发

---

## 写在最后

**Agent OS 的五层架构不是一个理论模型，而是可以落地的工程方案。**

每一层都有明确的职责边界：
- **Tools**：连接外部世界
- **Memory**：存储知识和经验
- **Runtime**：思考和行动
- **Orchestration**：协作和调度
- **Interface**：与人交互

**关键成功因素：**

1. **从简单开始**：不要试图一次性实现所有功能
2. **数据质量优先**：Agent 的智能取决于数据的质量
3. **人工介入机制**：永远给用户控制的权利
4. **持续迭代**：Agent 需要不断学习和改进

**最后的话：**

> 架构决定上限，工程决定下限。
> 
> 好的 Agent OS 架构可以让你走得更远，但只有扎实的工程实现才能让你走得稳。

---

## 📚 延伸阅读

**本系列文章**

- [Agent OS：SaaS 之后的下一个软件形态](/2026/03/10/agent-os-future-of-software.html)
- [为什么你的 SaaS 产品需要 Agent 层？](/2026/03/17/why-your-saas-needs-agent-layer.html)
- [从 Human-driven 到 Agent-driven](/2026/03/24/human-driven-to-agent-driven.html)
- [Agent 的记忆系统设计](/2026/04/07/agent-memory-system-design.html)
- [Multi-Agent 协作](/2026/04/14/multi-agent-collaboration.html)

**外部资源**

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.google.com/abs/2210.03629)
- [LangChain Architecture](https://python.langchain.com/docs/modules/)
- [Building LLM Systems](https://hamel.dev/blog/posts/llm-systems/)

---

*Agent OS 系列 - 第 4 篇*
*由 Aaron 整理发布*

*Published on 2026-03-31*
*阅读时间：约 15 分钟*

*下一篇预告：《Agent 的记忆系统设计》*
