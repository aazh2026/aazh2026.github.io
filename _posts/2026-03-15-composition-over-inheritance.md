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

## TL;DR

- **继承的本质问题**：强耦合、脆弱的基类问题、违反封装、难以测试
- **组合的核心优势**：松耦合、高内聚、可替换、易扩展
- **从类组合到 Agent 组合**：同样的设计原则在 AI 时代的演进
- **Agent 组合模式**：能力组合、行为组合、记忆组合的三层架构
- **Prompt 与 Context 继承**：AI 时代的新继承形态，需要谨慎使用
- **反直觉洞察**：组合不是银弹，过度组合同样有害
- **实战代码**：可落地的 Agent 组合设计模式

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

```java
// 经典的 Java 继承噩梦
public class UserService extends BaseService 
    extends DatabaseConnection 
    extends TransactionManager 
    extends Logger 
    extends CacheManager {
    // 这个类继承了多少它不需要的东西？
}
```

**继承带来的问题：**

| 问题 | 表现 | 后果 |
|------|------|------|
| **脆弱的基类** | 修改父类影响所有子类 | 不敢改动核心代码 |
| **层次过深** | 继承链超过 3-4 层 | 理解成本高，调试困难 |
| **强耦合** | 子类依赖父类实现细节 | 无法独立演化 |
| **违反封装** | 子类知道父类内部 | 封装被破坏 |

### 组合的崛起

Go 语言的横空出世，彻底颠覆了 "一切皆类" 的思维模式：

```go
// Go 的组合方式
type UserService struct {
    db     DatabaseConnection  // 组合，不是继承
    tx     TransactionManager  // 依赖注入
    logger Logger              // 接口依赖
    cache  CacheManager        // 运行时替换
}
```

Go 没有继承，只有组合。这不是缺陷，而是设计上的刻意选择。

---

## 为什么组合更优：三个核心维度

### 1. 灵活性：运行时 vs 编译时

**继承是静态绑定：**
```python
# 继承：编译时就确定了关系
class MyAgent(BaseAgent):
    pass  # 一生都是 BaseAgent 的子类
```

**组合是动态绑定：**
```python
# 组合：运行时可以替换组件
class MyAgent:
    def __init__(self, llm: LLM, memory: Memory, tools: ToolSet):
        self.llm = llm        # 可以是 GPT-4，也可以是 Claude
        self.memory = memory  # 可以是向量存储，也可以是知识图谱
        self.tools = tools    # 运行时动态添加/移除工具
```

### 2. 解耦：接口 vs 实现

**继承的问题是 "是一个"：**
```
A is-a B 意味着 A 必须接受 B 的所有行为和状态
```

**组合的优势是 "有一个"：**
```
A has-a B 意味着 A 只使用 B 提供的接口
```

### 3. 测试性：可替换的依赖

**继承的测试困境：**
```python
# 很难测试：必须实例化整个继承链
class TestMyAgent(unittest.TestCase):
    def test_something(self):
        agent = MyAgent()  # 这会连带创建数据库连接、缓存...
        # 测试很困难
```

**组合的测试便利：**
```python
# 容易测试：注入 Mock 对象
class TestMyAgent(unittest.TestCase):
    def test_something(self):
        agent = MyAgent(
            llm=MockLLM(),
            memory=MockMemory(),
            tools=MockTools()
        )
        # 可以独立测试每个组件
```

---

## 从类组合到 Agent 组合

### Agent 系统的特殊性

传统软件组件之间的关系是静态的，但 Agent 系统有独特的挑战：

1. **动态能力发现**：Agent 可能在运行时学习新技能
2. **上下文依赖**：同一个 Agent 在不同上下文中表现不同
3. **多模态交互**：需要组合不同类型的输入/输出能力
4. **协作演化**：多个 Agent 协作时能力需要动态调整

### Agent 组合的三层模型

```
┌─────────────────────────────────────────────────────────┐
│  Layer 3: 能力组合 (Capability Composition)             │
│  思考、推理、规划、反思等认知能力的组合                  │
├─────────────────────────────────────────────────────────┤
│  Layer 2: 行为组合 (Behavior Composition)               │
│  工具使用、API 调用、数据处理的组合                      │
├─────────────────────────────────────────────────────────┤
│  Layer 1: 记忆组合 (Memory Composition)                 │
│  短期记忆、长期记忆、知识图谱的组合                      │
└─────────────────────────────────────────────────────────┘
```

### 为什么 Agent 更需要组合

**场景：一个销售助手 Agent**

如果用继承方式设计：
```python
# 继承地狱
class SalesAgent(ConversationalAgent):
    pass

class ConversationalAgent(LLMAgent):
    pass

class LLMAgent(BaseAgent):
    pass

# 现在需要同时支持销售 + 技术支持？
# 多重继承？Mixin？钻石问题？
```

如果用组合方式设计：
```python
# 优雅的组合
class Agent:
    def __init__(self):
        self.memory = CompositeMemory([
            ShortTermMemory(),
            LongTermMemory(),
            KnowledgeGraphMemory()
        ])
        self.cognition = CognitionEngine([
            ReasoningCapability(),
            PlanningCapability(),
            ReflectionCapability()
        ])
        self.behaviors = BehaviorSet([
            CRMBehavior(),
            EmailBehavior(),
            CalendarBehavior()
        ])
```

---

## 实战：设计可组合的 Agent 系统

### 核心接口设计

**1. 能力接口（Capability Interface）**

```python
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from dataclasses import dataclass

@dataclass
class AgentContext:
    """Agent 执行上下文"""
    session_id: str
    user_id: str
    task: str
    memory_snapshot: Dict[str, Any]
    metadata: Dict[str, Any]

class Capability(ABC):
    """能力基类：所有 Agent 能力的抽象接口"""
    
    @property
    @abstractmethod
    def name(self) -> str:
        """能力名称"""
        pass
    
    @abstractmethod
    def can_handle(self, context: AgentContext) -> bool:
        """判断是否能处理当前上下文"""
        pass
    
    @abstractmethod
    async def execute(self, context: AgentContext, input_data: Any) -> Any:
        """执行能力"""
        pass
    
    @abstractmethod
    def get_description(self) -> str:
        """获取能力的自然语言描述（供 LLM 理解）"""
        pass
```

**2. 记忆接口（Memory Interface）**

```python
class Memory(ABC):
    """记忆基类：所有记忆实现的抽象接口"""
    
    @abstractmethod
    async def store(self, key: str, value: Any, metadata: Dict = None) -> bool:
        """存储记忆"""
        pass
    
    @abstractmethod
    async def retrieve(self, query: str, limit: int = 5) -> List[Any]:
        """检索记忆"""
        pass
    
    @abstractmethod
    async def forget(self, key: str) -> bool:
        """遗忘记忆"""
        pass

class CompositeMemory(Memory):
    """组合记忆：将多个记忆源组合在一起"""
    
    def __init__(self, memories: List[Memory]):
        self.memories = memories
        self.priority_map = {m: i for i, m in enumerate(memories)}
    
    async def retrieve(self, query: str, limit: int = 5) -> List[Any]:
        """从所有记忆源检索并合并结果"""
        all_results = []
        
        for memory in self.memories:
            results = await memory.retrieve(query, limit)
            for r in results:
                all_results.append({
                    'data': r,
                    'source': memory.__class__.__name__,
                    'priority': self.priority_map[memory]
                })
        
        # 按优先级和相关性排序
        all_results.sort(key=lambda x: (x['priority'], -self._relevance_score(x['data'], query)))
        return [r['data'] for r in all_results[:limit]]
    
    def _relevance_score(self, data: Any, query: str) -> float:
        # 实现相关性评分逻辑
        return 1.0
```

**3. 行为接口（Behavior Interface）**

```python
class Behavior(ABC):
    """行为基类：所有外部交互行为的抽象接口"""
    
    @property
    @abstractmethod
    def name(self) -> str:
        pass
    
    @abstractmethod
    def get_tools(self) -> List[Dict]:
        """返回可供 LLM 使用的工具描述"""
        pass
    
    @abstractmethod
    async def execute_tool(self, tool_name: str, params: Dict) -> Any:
        """执行具体工具"""
        pass

class BehaviorSet:
    """行为集合：动态组合多个行为"""
    
    def __init__(self):
        self._behaviors: Dict[str, Behavior] = {}
    
    def register(self, behavior: Behavior):
        """注册新行为"""
        self._behaviors[behavior.name] = behavior
    
    def unregister(self, name: str):
        """移除行为"""
        if name in self._behaviors:
            del self._behaviors[name]
    
    def get_all_tools(self) -> List[Dict]:
        """获取所有可用工具"""
        tools = []
        for behavior in self._behaviors.values():
            tools.extend(behavior.get_tools())
        return tools
    
    async def execute(self, tool_name: str, params: Dict) -> Any:
        """执行指定工具"""
        for behavior in self._behaviors.values():
            tools = behavior.get_tools()
            if any(t['name'] == tool_name for t in tools):
                return await behavior.execute_tool(tool_name, params)
        raise ValueError(f"Unknown tool: {tool_name}")
```

### 可组合 Agent 的实现

```python
class ComposableAgent:
    """
    可组合 Agent：通过组合而非继承构建
    
    设计原则：
    1. 所有组件通过接口交互，而非具体实现
    2. 组件可在运行时动态添加/移除
    3. 支持能力的条件激活
    """
    
    def __init__(
        self,
        llm: Any,  # LLM 客户端
        memory: Memory,
        behaviors: BehaviorSet,
        capabilities: List[Capability] = None
    ):
        self.llm = llm
        self.memory = memory
        self.behaviors = behaviors
        self.capabilities = capabilities or []
        self.context: Optional[AgentContext] = None
    
    async def run(self, task: str, user_id: str, session_id: str) -> str:
        """执行用户任务"""
        # 构建上下文
        self.context = AgentContext(
            session_id=session_id,
            user_id=user_id,
            task=task,
            memory_snapshot=await self._get_memory_snapshot(),
            metadata={}
        )
        
        # 存储用户输入
        await self.memory.store(
            f"user_input_{session_id}",
            {'role': 'user', 'content': task}
        )
        
        # 选择并执行合适的能力
        for capability in self._select_capabilities():
            result = await capability.execute(self.context, task)
            if result:
                # 存储结果
                await self.memory.store(
                    f"agent_response_{session_id}",
                    {'role': 'assistant', 'content': str(result)}
                )
                return str(result)
        
        # 默认：直接调用 LLM
        return await self._default_response(task)
    
    def _select_capabilities(self) -> List[Capability]:
        """根据上下文选择适合的能力"""
        return [
            cap for cap in self.capabilities
            if cap.can_handle(self.context)
        ]
    
    async def _get_memory_snapshot(self) -> Dict:
        """获取当前记忆快照"""
        recent = await self.memory.retrieve("recent_interactions", limit=10)
        return {'recent': recent}
    
    async def _default_response(self, task: str) -> str:
        """默认响应策略"""
        # 获取相关记忆
        relevant_memories = await self.memory.retrieve(task, limit=3)
        
        # 构建 Prompt
        prompt = self._build_prompt(task, relevant_memories)
        
        # 调用 LLM
        response = await self.llm.generate(prompt)
        return response
    
    def _build_prompt(self, task: str, memories: List[Any]) -> str:
        """构建 Prompt"""
        memory_str = "\n".join([str(m) for m in memories])
        tools_str = json.dumps(self.behaviors.get_all_tools(), indent=2)
        
        return f"""You are a helpful AI assistant.

Relevant context from memory:
{memory_str}

Available tools:
{tools_str}

User task: {task}

Please help the user with their task. Use tools if necessary."""
    
    def add_capability(self, capability: Capability):
        """动态添加能力"""
        self.capabilities.append(capability)
    
    def remove_capability(self, name: str):
        """动态移除能力"""
        self.capabilities = [c for c in self.capabilities if c.name != name]
```

### 具体能力实现示例

**推理能力：**

```python
class ReasoningCapability(Capability):
    """推理能力：让 Agent 能够进行多步推理"""
    
    @property
    def name(self) -> str:
        return "reasoning"
    
    def can_handle(self, context: AgentContext) -> bool:
        # 当任务包含推理关键词时激活
        reasoning_keywords = ['分析', '比较', '为什么', 'how', 'why', 'analyze']
        return any(kw in context.task.lower() for kw in reasoning_keywords)
    
    def get_description(self) -> str:
        return """
        Reasoning capability allows the agent to perform multi-step logical reasoning.
        Use this when the task requires analysis, comparison, or explanation.
        """
    
    async def execute(self, context: AgentContext, input_data: Any) -> Any:
        """执行推理"""
        reasoning_steps = [
            "1. Understand the problem",
            "2. Identify relevant information",
            "3. Apply logical rules",
            "4. Draw conclusions"
        ]
        
        # 实际实现会使用 LLM 进行推理
        return f"Applying reasoning to: {input_data}"
```

**规划能力：**

```python
class PlanningCapability(Capability):
    """规划能力：让 Agent 能够制定执行计划"""
    
    @property
    def name(self) -> str:
        return "planning"
    
    def can_handle(self, context: AgentContext) -> bool:
        # 复杂任务需要规划
        complex_indicators = ['多步', '流程', 'plan', 'steps', 'process']
        task_length = len(context.task.split())
        return any(ind in context.task.lower() for ind in complex_indicators) or task_length > 20
    
    async def execute(self, context: AgentContext, input_data: Any) -> Any:
        """制定并执行计划"""
        # 1. 分解任务
        subtasks = await self._decompose_task(input_data)
        
        # 2. 按依赖排序
        ordered_tasks = self._order_by_dependency(subtasks)
        
        # 3. 执行计划
        results = []
        for task in ordered_tasks:
            result = await self._execute_subtask(task)
            results.append(result)
        
        return results
    
    async def _decompose_task(self, task: str) -> List[str]:
        """将任务分解为子任务"""
        # 使用 LLM 分解
        prompt = f"Break down this task into subtasks: {task}"
        return []  # 简化示例
    
    def _order_by_dependency(self, tasks: List[str]) -> List[str]:
        """按依赖关系排序"""
        return tasks  # 简化示例
    
    async def _execute_subtask(self, task: str) -> Any:
        """执行子任务"""
        return f"Executed: {task}"
```

### 编排模式：组合的组合

```python
class AgentOrchestrator:
    """
    Agent 编排器：组合多个 Agent 协作完成任务
    """
    
    def __init__(self):
        self.agents: Dict[str, ComposableAgent] = {}
        self.message_bus = MessageBus()
    
    def register_agent(self, agent_id: str, agent: ComposableAgent):
        """注册 Agent"""
        self.agents[agent_id] = agent
    
    async def execute_workflow(
        self,
        workflow: List[Dict],
        initial_input: str
    ) -> Dict[str, Any]:
        """
        执行工作流
        
        workflow: [
            {"agent": "agent_1", "task": "subtask_1"},
            {"agent": "agent_2", "task": "subtask_2", "depends_on": ["agent_1"]},
            ...
        ]
        """
        results = {}
        pending = set(w['agent'] for w in workflow)
        completed = set()
        
        while pending:
            # 找出可以执行的任务（依赖已满足）
            ready = [
                w for w in workflow
                if w['agent'] in pending
                and all(dep in completed for dep in w.get('depends_on', []))
            ]
            
            if not ready:
                raise ValueError("Circular dependency detected")
            
            # 并行执行就绪的任务
            tasks = [
                self._execute_agent_task(w, results)
                for w in ready
            ]
            batch_results = await asyncio.gather(*tasks)
            
            # 更新状态
            for w, result in zip(ready, batch_results):
                agent_id = w['agent']
                results[agent_id] = result
                pending.remove(agent_id)
                completed.add(agent_id)
        
        return results
    
    async def _execute_agent_task(
        self,
        workflow_item: Dict,
        previous_results: Dict
    ) -> Any:
        """执行单个 Agent 任务"""
        agent_id = workflow_item['agent']
        task = workflow_item['task']
        
        # 构建上下文
        context = {
            'task': task,
            'previous_results': previous_results,
            'workflow_context': workflow_item.get('context', {})
        }
        
        agent = self.agents[agent_id]
        return await agent.run(
            task=json.dumps(context),
            user_id="workflow",
            session_id=f"wf_{agent_id}_{int(time.time())}"
        )
```

---

## 继承在 AI 时代的新形态

### Prompt 继承

虽然代码层面避免继承，但 Prompt 设计中出现了新的 "继承" 模式：

```python
# Prompt 继承：基础角色定义
BASE_PROMPT = """You are a helpful AI assistant.
Core principles:
- Always be honest
- Admit when you don't know
- Prioritize user safety
"""

# 继承基础 Prompt，添加特定领域知识
SALES_AGENT_PROMPT = BASE_PROMPT + """
You are now a sales assistant specialized in B2B software sales.
Additional principles:
- Focus on value proposition
- Ask discovery questions
- Handle objections professionally
"""

# 进一步继承
ENTERPRISE_SALES_PROMPT = SALES_AGENT_PROMPT + """
You specialize in enterprise sales ($100k+ deals).
Additional capabilities:
- Navigate procurement processes
- Handle security questionnaires
- Engage with C-level executives
"""
```

**Prompt 继承的风险：**
- **冲突原则**：子 Prompt 可能覆盖或矛盾父 Prompt 的指令
- **长度爆炸**：层层继承导致上下文过长
- **调试困难**：难以定位是哪个层次的 Prompt 导致了问题行为

**更安全的做法：Prompt 组合**

```python
class PromptComposer:
    """Prompt 组合器：通过组合而非继承构建 Prompt"""
    
    def __init__(self):
        self.sections: List[str] = []
        self.constraints: List[str] = []
    
    def add_section(self, section: str, priority: int = 0):
        """添加 Prompt 段落，按优先级排序"""
        self.sections.append((priority, section))
    
    def add_constraint(self, constraint: str):
        """添加约束条件"""
        self.constraints.append(constraint)
    
    def compose(self) -> str:
        """组合最终 Prompt"""
        # 按优先级排序
        self.sections.sort(key=lambda x: x[0], reverse=True)
        
        sections_text = "\n\n".join([s[1] for s in self.sections])
        constraints_text = "\n".join([f"- {c}" for c in self.constraints])
        
        return f"""{sections_text}

Important constraints:
{constraints_text}
"""

# 使用示例
composer = PromptComposer()
composer.add_section("You are a helpful AI assistant.", priority=100)
composer.add_section("You specialize in sales.", priority=50)
composer.add_section("Focus on enterprise deals.", priority=25)
composer.add_constraint("Always be honest")
composer.add_constraint("Respect user privacy")

final_prompt = composer.compose()
```

### Context 继承

Agent 在执行过程中，Context 的传递也呈现出继承特征：

```python
# Context 继承：任务分解时的上下文传递
async def decompose_task(parent_context: AgentContext, task: str):
    """
    子任务继承父任务的上下文，但可以进行修改
    """
    child_context = AgentContext(
        session_id=parent_context.session_id,
        user_id=parent_context.user_id,
        task=task,
        # 继承记忆快照
        memory_snapshot=parent_context.memory_snapshot.copy(),
        # 继承元数据，但可以添加新字段
        metadata={
            **parent_context.metadata,
            'parent_task': parent_context.task,
            'depth': parent_context.metadata.get('depth', 0) + 1
        }
    )
    return child_context
```

**Context 继承的最佳实践：**
- 使用 `copy()` 而非直接引用，避免副作用
- 明确哪些字段可继承，哪些需要重置
- 设置深度限制，防止无限递归

---

## 反直觉洞察：组合不是银弹

### 洞察 1：过度组合的危害

```python
# 过度组合的反模式
class OverEngineeredAgent:
    def __init__(self):
        self.memory = CompositeMemory([
            ShortTermMemory(),
            LongTermMemory(),
            EpisodicMemory(),
            SemanticMemory(),
            ProceduralMemory(),
            # ... 20 more memory types
        ])
        # 每次检索需要查询 25 个存储，性能爆炸
```

**解决方案：
- 最多组合 3-5 个核心组件
- 使用适配器模式统一接口
- 考虑性能开销

### 洞察 2：继承在特定场景仍然有用

```python
# 例外：领域模型的继承
class DomainEvent(ABC):
    """领域事件基类：适合继承"""
    @property
    @abstractmethod
    def event_type(self) -> str:
        pass

class OrderCreated(DomainEvent):
    """订单创建事件"""
    @property
    def event_type(self) -> str:
        return "order.created"

class OrderCancelled(DomainEvent):
    """订单取消事件"""
    @property
    def event_type(self) -> str:
        return "order.cancelled"
```

**何时使用继承：**
- 真正的 "is-a" 关系（几何图形继承体系）
- 领域模型的分类（如上面的 Event 类型）
- 框架/库的扩展点设计

### 洞察 3：组合也需要设计

```python
# 糟糕的组合设计：所有组件都直接交互
class BadAgent:
    def __init__(self):
        self.llm = LLM()
        self.memory = Memory()
        self.tools = Tools()
    
    async def run(self, task):
        # LLM 直接调用 Memory
        memory_result = self.llm.call_memory(self.memory, task)
        # Memory 直接调用 Tools
        tool_result = self.memory.call_tools(self.tools, memory_result)
        # Tools 直接调用 LLM
        final = self.tools.call_llm(self.llm, tool_result)
        return final
# 组件之间的调用关系是一团乱麻
```

**更好的设计：Mediator 模式**

```python
class GoodAgent:
    def __init__(self):
        self.llm = LLM()
        self.memory = Memory()
        self.tools = Tools()
        self.mediator = AgentMediator(self.llm, self.memory, self.tools)
    
    async def run(self, task):
        # 所有交互通过 Mediator 协调
        return await self.mediator.execute(task)
```

---

## 代码示例与最佳实践

### 完整示例：销售助手 Agent

```python
import asyncio
from typing import List, Dict, Any, Optional
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
import json
import time

# ==================== 接口定义 ====================

@dataclass
class AgentContext:
    session_id: str
    user_id: str
    task: str
    memory_snapshot: Dict[str, Any] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)

class Capability(ABC):
    @property
    @abstractmethod
    def name(self) -> str: pass
    
    @abstractmethod
    def can_handle(self, context: AgentContext) -> bool: pass
    
    @abstractmethod
    async def execute(self, context: AgentContext, input_data: Any) -> Any: pass

class Memory(ABC):
    @abstractmethod
    async def store(self, key: str, value: Any) -> bool: pass
    
    @abstractmethod
    async def retrieve(self, query: str, limit: int = 5) -> List[Any]: pass

class Behavior(ABC):
    @property
    @abstractmethod
    def name(self) -> str: pass
    
    @abstractmethod
    def get_tools(self) -> List[Dict]: pass
    
    @abstractmethod
    async def execute_tool(self, tool_name: str, params: Dict) -> Any: pass

# ==================== 具体实现 ====================

class InMemoryStorage(Memory):
    """内存存储实现（简化示例）"""
    def __init__(self):
        self._data: Dict[str, Any] = {}
    
    async def store(self, key: str, value: Any) -> bool:
        self._data[key] = value
        return True
    
    async def retrieve(self, query: str, limit: int = 5) -> List[Any]:
        # 简化的检索逻辑
        results = []
        for k, v in self._data.items():
            if query.lower() in k.lower() or query.lower() in str(v).lower():
                results.append(v)
        return results[:limit]

class CRMBehavior(Behavior):
    """CRM 行为：与 CRM 系统交互"""
    
    @property
    def name(self) -> str:
        return "crm"
    
    def get_tools(self) -> List[Dict]:
        return [
            {
                "name": "get_customer",
                "description": "Get customer information by ID",
                "parameters": {
                    "customer_id": "string"
                }
            },
            {
                "name": "update_deal_stage",
                "description": "Update deal stage",
                "parameters": {
                    "deal_id": "string",
                    "stage": "string"
                }
            }
        ]
    
    async def execute_tool(self, tool_name: str, params: Dict) -> Any:
        if tool_name == "get_customer":
            return {"id": params["customer_id"], "name": "Acme Corp", "status": "active"}
        elif tool_name == "update_deal_stage":
            return {"success": True, "deal_id": params["deal_id"], "new_stage": params["stage"]}
        raise ValueError(f"Unknown tool: {tool_name}")

class EmailBehavior(Behavior):
    """邮件行为：处理邮件相关任务"""
    
    @property
    def name(self) -> str:
        return "email"
    
    def get_tools(self) -> List[Dict]:
        return [
            {
                "name": "draft_email",
                "description": "Draft an email",
                "parameters": {
                    "to": "string",
                    "subject": "string",
                    "content": "string"
                }
            }
        ]
    
    async def execute_tool(self, tool_name: str, params: Dict) -> Any:
        if tool_name == "draft_email":
            return {
                "drafted": True,
                "to": params["to"],
                "subject": params["subject"]
            }
        raise ValueError(f"Unknown tool: {tool_name}")

class SalesCapability(Capability):
    """销售能力：处理销售相关任务"""
    
    @property
    def name(self) -> str:
        return "sales"
    
    def can_handle(self, context: AgentContext) -> bool:
        keywords = ['客户', '销售', '商机', 'deal', 'customer', 'opportunity']
        return any(kw in context.task.lower() for kw in keywords)
    
    async def execute(self, context: AgentContext, input_data: Any) -> Any:
        return f"[Sales Capability] Processing: {input_data}"

class AnalysisCapability(Capability):
    """分析能力：处理数据分析任务"""
    
    @property
    def name(self) -> str:
        return "analysis"
    
    def can_handle(self, context: AgentContext) -> bool:
        keywords = ['分析', '统计', '趋势', 'analyze', 'statistics']
        return any(kw in context.task.lower() for kw in keywords)
    
    async def execute(self, context: AgentContext, input_data: Any) -> Any:
        return f"[Analysis Capability] Analyzing: {input_data}"

# ==================== 核心 Agent ====================

class SalesAssistantAgent:
    """
    销售助手 Agent：通过组合构建
    """
    
    def __init__(self):
        # 组合记忆
        self.memory = InMemoryStorage()
        
        # 组合行为
        self.behaviors = BehaviorSet()
        self.behaviors.register(CRMBehavior())
        self.behaviors.register(EmailBehavior())
        
        # 组合能力
        self.capabilities: List[Capability] = [
            SalesCapability(),
            AnalysisCapability()
        ]
        
        # 模拟 LLM
        self.llm = MockLLM()
    
    async def process(self, user_input: str, user_id: str = "user_001") -> str:
        """处理用户输入"""
        session_id = f"session_{int(time.time())}"
        
        # 创建上下文
        context = AgentContext(
            session_id=session_id,
            user_id=user_id,
            task=user_input,
            memory_snapshot={}
        )
        
        # 存储用户输入
        await self.memory.store(f"input_{session_id}", {
            "role": "user",
            "content": user_input
        })
        
        # 选择并执行能力
        for capability in self.capabilities:
            if capability.can_handle(context):
                print(f"  → Using capability: {capability.name}")
                result = await capability.execute(context, user_input)
                
                # 存储结果
                await self.memory.store(f"output_{session_id}", {
                    "role": "assistant",
                    "content": result
                })
                
                return result
        
        # 默认响应
        return await self._default_response(user_input)
    
    async def _default_response(self, user_input: str) -> str:
        """默认响应"""
        tools = self.behaviors.get_all_tools()
        return f"I have {len(tools)} tools available. How can I help with: {user_input}?"
    
    def add_capability(self, capability: Capability):
        """动态添加能力"""
        self.capabilities.append(capability)
        print(f"Added capability: {capability.name}")
    
    def list_capabilities(self) -> List[str]:
        """列出所有能力"""
        return [c.name for c in self.capabilities]

class MockLLM:
    """模拟 LLM 客户端"""
    async def generate(self, prompt: str) -> str:
        return f"[LLM Response to: {prompt[:50]}...]"

# ==================== 演示 ====================

async def main():
    print("=" * 60)
    print("Sales Assistant Agent Demo - Composition Over Inheritance")
    print("=" * 60)
    
    # 创建 Agent
    agent = SalesAssistantAgent()
    
    print(f"\n初始能力: {agent.list_capabilities()}")
    print(f"可用工具: {[t['name'] for t in agent.behaviors.get_all_tools()]}")
    
    # 测试场景 1: 销售相关任务
    print("\n" + "-" * 60)
    print("场景 1: 销售相关查询")
    result = await agent.process("帮我查看客户 Acme Corp 的最新状态")
    print(f"结果: {result}")
    
    # 测试场景 2: 分析相关任务
    print("\n" + "-" * 60)
    print("场景 2: 数据分析")
    result = await agent.process("分析一下这季度的销售趋势")
    print(f"结果: {result}")
    
    # 测试场景 3: 普通查询
    print("\n" + "-" * 60)
    print("场景 3: 普通查询")
    result = await agent.process("今天天气怎么样？")
    print(f"结果: {result}")
    
    # 动态添加能力
    print("\n" + "-" * 60)
    print("动态扩展：添加新能力")
    
    class CalendarCapability(Capability):
        @property
        def name(self): return "calendar"
        def can_handle(self, ctx): return "会议" in ctx.task or "schedule" in ctx.task.lower()
        async def execute(self, ctx, data): return f"[Calendar] Scheduled: {data}"
    
    agent.add_capability(CalendarCapability())
    print(f"当前能力: {agent.list_capabilities()}")
    
    # 测试新能力
    print("\n" + "-" * 60)
    print("场景 4: 使用新能力")
    result = await agent.process("帮我安排一个与客户的会议")
    print(f"结果: {result}")
    
    print("\n" + "=" * 60)
    print("Demo 完成！")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
```

### 最佳实践清单

**✅ Do（推荐做法）：**

1. **面向接口编程**
   ```python
   # 好：依赖抽象接口
   def __init__(self, memory: Memory):  # 接口类型
       self.memory = memory
   ```

2. **使用依赖注入**
   ```python
   # 好：依赖外部传入
   agent = Agent(memory=RedisMemory())
   ```

3. **保持组件单一职责**
   ```python
   # 好：每个类只做一件事
   class ShortTermMemory(Memory): pass
   class LongTermMemory(Memory): pass
   ```

4. **支持运行时配置**
   ```python
   # 好：可以在运行时改变行为
   agent.add_capability(NewCapability())
   agent.remove_behavior("old_behavior")
   ```

**❌ Don't（避免做法）：**

1. **避免深继承链**
   ```python
   # 坏：继承链超过 2 层
   class MyAgent(SmartAgent):  # SmartAgent 继承自 BaseAgent
       pass  # BaseAgent 继承自 AgentCore
   ```

2. **避免在子类中依赖父类实现细节**
   ```python
   # 坏：子类依赖父类的内部状态
   class MyAgent(BaseAgent):
       def run(self):
           self._internal_state = "modified"  # 危险！
   ```

3. **避免混合关注点**
   ```python
   # 坏：一个类处理太多事情
   class GodAgent:
       def handle_db(self): pass
       def handle_ui(self): pass
       def handle_ai(self): pass
   ```

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
*由 Aaron 整理发布*

*Published on 2026-03-15*
*阅读时间：约 20 分钟*

*下一篇预告：《Agent 的状态机设计》*
