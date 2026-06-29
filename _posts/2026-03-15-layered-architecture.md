---
layout: post
author: "@postcodeeng"
title: "\"分层的艺术：从 OSI 七层到 Agent OS 五层\""
date: 2026-03-15T10:00:00+08:00
categories: [Architecture, AI]
tags: [agent-os, layered-architecture, system-design, mental-models]
description: "分层架构是人类应对复杂性的终极武器——从 OSI 七层到 TCP/IP 四层再到 Agent OS 五层，分层的本质是将混沌切割为有意义的逻辑边界，层间通信成本决定架构成败。"
series: "Agent OS"
series_order: 3
slug: layered-architecture
math: true
---

## 1. TL;DR

分层架构是人类应对复杂性的终极武器。从 OSI 七层模型到 TCP/IP 四层，从 MVC 到微服务，再到 Agent OS 的五层架构——分层的本质从未改变：**将混沌切割为有意义的边界**。

Agent OS 的五层架构：
- **接口层 (Interface)**：与外部世界对话的窗口
- **编排层 (Orchestration)**：任务调度与流控制
- **认知层 (Cognition)**：推理、规划与决策
- **记忆层 (Memory)**：知识的存储与检索
- **执行层 (Execution)**：真实世界的行动

> 💡 **Key Insight**
>
> 好的分层不是物理隔离，而是逻辑边界；层间通信的成本决定了架构的成败。

<object data="/assets/images/2026-03-15-layered-architecture-05-agent-os-layers.svg" type="image/svg+xml" width="100%"></object>

---

<object data="/assets/images/2026-03-15-layered-architecture-01-toc.svg" type="image/svg+xml" width="100%"></object>

---

## 分层架构的历史

### OSI 七层模型：网络通信的圣经

1970年代，ISO 推出了开放系统互连（OSI）参考模型，将网络通信抽象为七个层次：

<object data="/assets/images/2026-03-15-layered-arch-01-layers.svg" type="image/svg+xml" width="100%"></object>

**核心原则**：
1. **封装**：每一层不关心其他层的实现细节
2. **标准化**：层间接口定义明确，允许独立演化
3. **分层独立**：某层变更不应影响其他层

但 OSI 的问题在于**过度设计**。七层对于实际应用过于繁琐，会话层和表示层的边界模糊，导致实现困难。

### TCP/IP 四层模型：实用主义的胜利

TCP/IP 协议栈用四层模型取代了 OSI 的七层：

<object data="/assets/images/2026-03-15-layered-arch-02-tcpip.svg" type="image/svg+xml" width="100%"></object>

**关键简化**：
- 会话层和表示层被并入应用层
- 数据链路层和物理层合并为网络接口层
- **每层职责更清晰，实现更简单**

> 💡 **洞察**：分层的数量不是固定的，而是取决于问题域的复杂度。**合适的分层是刚好能解决问题的那一层数**。

### 软件架构中的分层模式

#### MVC（Model-View-Controller）

<object data="/assets/images/2026-03-15-layered-arch-03-mvc.svg" type="image/svg+xml" width="100%"></object>

MVC 的核心思想：**将数据、逻辑、呈现分离**。这种分层使得 UI 可以独立变化而不影响业务逻辑。

### 三层架构（Presentation/Business/Data）

企业应用中最经典的分层：

<object data="/assets/images/2026-03-15-layered-arch-04-rest.svg" type="image/svg+xml" width="100%"></object>

### 微服务的分层

微服务本身也是一种分层——**按业务领域垂直分层**：

<object data="/assets/images/2026-03-15-layered-arch-05-services.svg" type="image/svg+xml" width="100%"></object>

---

## 为什么分层有效

### 关注点分离（Separation of Concerns）

> "The secret to building large apps is never build large apps. Break your applications into small pieces. Then, assemble those testable, bite-sized pieces into your big application." — Justin Meyer

分层架构的核心价值在于**将不同的关注点隔离到不同的层**。

> 💡 **Key Insight**
>
> 好的分层不是把代码分成几个文件，而是让每个团队可以独立在各自的层上工作而不影响彼此。

考虑一个不分层的 Agent 系统：

问题在哪里？
- **难以测试**：需要模拟 HTTP、数据库、文件系统
- **难以修改**：改动一处可能影响全局
- **难以复用**：逻辑与具体实现深度耦合

### 抽象的力量

分层通过**抽象**隐藏了底层复杂性：

**每一层都只依赖下一层的抽象接口**，而不是具体实现。

### 可替换性

分层架构的另一个巨大优势是**组件可替换性**。

> 💡 **分层架构的核心收益**：层与层之间是契约关系，而非实现依赖。

---

## Agent OS 的五层架构

基于对分层架构历史的理解，我们提出了 Agent OS 的五层架构：

<object data="/assets/images/2026-03-15-layered-architecture-02-ascii-arch.svg" type="image/svg+xml" width="100%"></object>

### 层详解

#### 第5层：接口层 (Interface Layer)

**职责**：
- 接收用户输入（多模态）
- 协议适配（HTTP/WebSocket/gRPC）
- 输入验证和 sanitization
- 响应格式化

### 第4层：编排层 (Orchestration Layer)

**职责**：
- 任务分解与规划
- 子任务调度
- 并发控制
- 错误恢复与重试

### 第3层：认知层 (Cognition Layer)

**职责**：
- LLM 调用与响应解析
- 推理链（Chain of Thought）
- 工具选择与参数生成
- 策略优化

### 第2层：记忆层 (Memory Layer)

**职责**：
- 短期记忆（当前对话上下文）
- 长期记忆（知识库检索）
- 语义记忆（向量存储）
- 程序性记忆（技能/工具记忆）

### 第1层：执行层 (Execution Layer)

**职责**：
- 工具执行
- API 调用
- 文件系统操作
- 浏览器自动化
- 所有与外部世界的交互

---

## 分层与跨层通信

### Context 传递模式

层间通信的核心是 **Context 对象**——它像快递包裹一样在各层之间传递：

### 层间通信的三种模式

<object data="/assets/images/2026-03-15-layered-architecture-03-comm-patterns.svg" type="image/svg+xml" width="100%"></object>

<object data="/assets/images/2026-03-15-layered-architecture-06-cross-layer-comm.svg" type="image/svg+xml" width="100%"></object>

### 事件总线实现

在事件驱动架构中，Event Bus 是层间通信的核心枢纽。它通常位于编排层（Layer 4），上层通过 `publish(event)` 将事件投递到总线，而下层通过 `subscribe(event_type, handler)` 注册监听器。以代码审查 Agent 为例：当 Interface Layer 收到 GitHub Webhook 的 PR 事件时，它发布一个 `PRReceived` 事件；Orchestration Layer 订阅该事件后开始调度审查任务；Cognition Layer 完成分析后发布 `ReviewCompleted` 事件；Memory Layer 订阅该事件以存储审查历史。整个流程中，各层无需相互了解，只通过事件类型和解耦——这正是发布-订阅模式的价值所在。需要注意的是，事件总线引入了额外的复杂性：事件格式版本管理、事件顺序不确定性、以及跨层事件链的可追踪性。在设计时应该为每个事件附加元数据（event_id、timestamp、source_layer），并考虑引入事件溯源（Event Sourcing）机制来支持调试和回放。

> 💡 **Key Insight**
>
> 事件驱动的层间通信解耦了发布者和订阅者，但代价是增加了系统行为的可追踪性成本——你需要额外的机制（事件溯源、元数据标注）来弥补。

---

## 何时打破分层

### 性能优化场景

分层是有代价的。每一层都增加了：
- 序列化/反序列化开销
- 函数调用开销
- Context 拷贝开销

### 特殊场景的直接通信

分层架构的标准路径是上层调用下层、数据层层向上传递。但在某些场景下，这种"绕路"会带来不可接受的开销。一个典型例子是 webhook 场景：GitHub 向 Interface Layer 推送一个 PR 事件，标准路径是 Interface → Orchestration → Cognition → Memory → Execution，每层都要对 Context 做序列化和反序列化，开销巨大。如果这是一个高频率的自动化测试 webhook，每次只做简单的 diff 获取和缓存检查，完整的分层流程就是杀鸡用牛刀。直接通信的解法是允许 Interface Layer（Layer 5）直接调用 Execution Layer（Layer 1）的能力，跳过中间的 Cognition 和 Orchestration 层。这种"捷径"需要满足几个前提：操作是确定性的（不需要 LLM 推理）、性能瓶颈已通过 profiling 确认、并且保留完整的分层路径作为 fallback。打破分层不是无视分层，而是在充分理解分层代价后的有意识选择。

### 分层的打破原则

> 💡 **打破分层的准则**：
> 1. **性能瓶颈已确认**：通过 profiling 证明分层是瓶颈
> 2. **场景可预测**：快速路径只用于确定性操作
> 3. **可回滚**：保留分层版本作为 fallback
> 4. **文档化**：明确标注哪些是"捷径"

---

## 反直觉洞察

### 分层越多 ≠ 架构越好

OSI 七层 vs TCP/IP 四层的教训：**分层数量应与问题复杂度匹配**。

| 层数 | 适用场景 | 示例 |
|------|----------|------|
| 2-3层 | 简单工具、单一职责 | 命令行工具、脚本 |
| 4-5层 | 复杂系统、多阶段处理 | Web 应用、Agent 系统 |
| 6-7层 | 超大规模、极端解耦 | 电信系统、企业级中间件 |

### 完美的分层是动态分层的

"应该分多少层"这个问题本身就是一个危险的问题——因为答案会随着系统规模、团队规模和问题域的复杂度而改变。一个 v1 版本的代码审查 Agent 可能只需要两层：Interface Layer 接收请求，Execution Layer 执行审查。随着功能增加，我们可能加入 Memory Layer 来缓存审查历史；随着审查规则越来越复杂，Cognition Layer 承担推理工作；随着多任务并发需求的出现，Orchestration Layer 成为必需品。同一个系统，从 2 层演进到 5 层，分层数量增加了一倍多，但每一层的职责边界其实没有本质变化——变化的是 Context 对象的复杂度和团队成员在各自层上独立工作的需求。好的分层架构设计，应该让增加新层或合并相邻层成为一件低成本的操作，而不是伤筋动骨的改造。这意味着分层的边界应该由**关注点**而非**代码量**来决定。

### 层间依赖的方向比层本身更重要

**关键原则**：
- ✅ 上层可以依赖下层
- ✅ 同层组件可以相互依赖（谨慎）
- ❌ 下层绝不应该依赖上层
- ❌ 避免循环依赖

### Context 膨胀是分层架构的隐形杀手

随着系统演化，Context 对象会不断膨胀：

**解决方案**：使用**分层 Context**

---

## 实战：设计分层的 Agent 系统

### 需求分析

我们要构建一个**代码审查 Agent**，它本质上是一个典型的多阶段处理系统，每个阶段对应 Agent OS 五层架构中的一层或多层。

首先，这个 Agent 需要**接收外部事件**：GitHub Webhook 推送 PR 创建事件，或者开发者在本地 CLI 传入 repo 和 PR 编号。这属于 Interface Layer 的职责——处理多种输入协议（HTTP、WebSocket、CLI）、解析原始请求、构建初始 Context 对象。无论输入来源是哪种，Interface Layer 的输出都是格式统一的 ReviewContext，里面包含 repository、head_sha、author 等元信息。

其次，Agent 需要**理解代码变更的内容**。给定一个 PR，Agent 必须能够获取完整的 diff 内容，解析出每个文件的变更统计（新增行数、删除行数、文件语言类型），并将这些结构化数据注入 Context 对象。这个过程由 Execution Layer 通过 GitHub API 来完成，是整个审查流程的数据准备阶段。

第三，Agent 需要**利用历史审查记录来提升分析质量**。同一个作者、同一个仓库的代码往往有相似的风格偏好和常见问题模式。Memory Layer 通过向量检索找到相似的历史审查，将团队踩过的坑作为上下文传给分析阶段——这是记忆层区别于简单工具的核心价值。

最后，Agent 需要**生成结构化的审查报告**，包含问题列表（按严重程度分类）、统计摘要、以及每个问题的具体位置和建议修复方案。认知层（Cognition Layer）负责这个核心推理工作，它调用 LLM 来分析代码变更中的潜在问题——安全漏洞、性能瓶颈、代码风格违规——并将结果聚合为 ReviewReport 返回。

这四个能力对应着五层架构的不同职责：**接口层接收输入**，**执行层获取数据**，**记忆层检索上下文**，**认知层完成分析**，**编排层负责调度和聚合**。

### 架构设计

<object data="/assets/images/2026-03-15-layered-architecture-04-code-review-arch.svg" type="image/svg+xml" width="100%"></object>

```python
#!/usr/bin/env python3
"""
Code Review Agent - 分层架构示例
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Any, Protocol
from enum import Enum
import asyncio
import hashlib
from datetime import datetime

# ==================== 领域模型 ====================

class Severity(Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"

@dataclass
class CodeChange:
    file_path: str
    diff: str
    language: str
    additions: int
    deletions: int

@dataclass
class ReviewComment:
    file_path: str
    line_number: int
    message: str
    severity: Severity
    category: str  # "security", "performance", "style", etc.
    suggestion: Optional[str] = None

@dataclass
class ReviewReport:
    pr_id: str
    summary: str
    comments: List[ReviewComment]
    statistics: Dict[str, int]
    generated_at: datetime = field(default_factory=datetime.now)

# ==================== 第5层：接口层 ====================

@dataclass
class PRWebhookPayload:
    """GitHub PR Webhook 数据结构"""
    action: str
    pr_number: int
    repository: str
    head_sha: str
    diff_url: str
    author: str

class InterfaceLayer:
    """接口层：处理多种输入协议"""
    
    def __init__(self, orchestrator: "OrchestrationLayer"):
        self.orchestrator = orchestrator
    
    async def handle_webhook(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """处理 GitHub Webhook"""
        pr_payload = self._parse_webhook(payload)
        
        # 构建上下文
        context = ReviewContext(
            pr_id=f"{pr_payload.repository}#{pr_payload.pr_number}",
            repository=pr_payload.repository,
            head_sha=pr_payload.head_sha,
            diff_url=pr_payload.diff_url,
            author=pr_payload.author,
            timestamp=datetime.now()
        )
        
        # 调用编排层
        report = await self.orchestrator.review(context)
        
        return self._format_response(report)
    
    async def handle_cli(self, repo: str, pr_number: int) -> str:
        """处理 CLI 输入"""
        context = ReviewContext(
            pr_id=f"{repo}#{pr_number}",
            repository=repo,
            head_sha="",  # 将通过 API 获取
            diff_url=f"https://api.github.com/repos/{repo}/pulls/{pr_number}",
            author="cli_user",
            timestamp=datetime.now()
        )
        
        report = await self.orchestrator.review(context)
        return self._format_markdown(report)
    
    def _parse_webhook(self, payload: Dict) -> PRWebhookPayload:
        """解析并验证 Webhook 数据"""
        return PRWebhookPayload(
            action=payload.get("action", ""),
            pr_number=payload["pull_request"]["number"],
            repository=payload["repository"]["full_name"],
            head_sha=payload["pull_request"]["head"]["sha"],
            diff_url=payload["pull_request"]["diff_url"],
            author=payload["pull_request"]["user"]["login"]
        )
    
    def _format_response(self, report: ReviewReport) -> Dict[str, Any]:
        return {
            "pr_id": report.pr_id,
            "summary": report.summary,
            "comment_count": len(report.comments),
            "critical_issues": report.statistics.get("critical", 0)
        }
    
    def _format_markdown(self, report: ReviewReport) -> str:
        lines = [
            f"# Code Review Report: {report.pr_id}",
            "",
            f"**Generated:** {report.generated_at}",
            "",
            "## Summary",
            report.summary,
            "",
            "## Issues Found",
        ]
        
        for comment in sorted(report.comments, key=lambda c: c.severity.value):
            lines.extend([
                f"### [{comment.severity.value.upper()}] {comment.category}",
                f"**File:** `{comment.file_path}`:{comment.line_number}",
                f"{comment.message}",
            ])
            if comment.suggestion:
                lines.extend([
                    "**Suggestion:**",
                    f"```\n{comment.suggestion}\n```"
                ])
            lines.append("")
        
        return "\n".join(lines)

# ==================== 第4层：编排层 ====================

@dataclass
class ReviewContext:
    """贯穿审查流程的上下文"""
    pr_id: str
    repository: str
    head_sha: str
    diff_url: str
    author: str
    timestamp: datetime
    changes: List[CodeChange] = field(default_factory=list)
    history_reviews: List[Dict] = field(default_factory=list)

class OrchestrationLayer:
    """编排层：任务分解与调度"""
    
    def __init__(
        self,
        cognition: "CognitionLayer",
        memory: "MemoryLayer",
        execution: "ExecutionLayer"
    ):
        self.cognition = cognition
        self.memory = memory
        self.execution = execution
    
    async def review(self, context: ReviewContext) -> ReviewReport:
        """编排完整的代码审查流程"""
        
        # Phase 1: 获取代码变更（执行层）
        context.changes = await self.execution.fetch_diff(context.diff_url)
        
        # Phase 2: 检索历史审查（记忆层）
        context.history_reviews = await self.memory.get_similar_reviews(
            context.repository, context.author
        )
        
        # Phase 3: 并发分析每个文件
        file_tasks = [
            self._analyze_file(change, context)
            for change in context.changes
        ]
        file_results = await asyncio.gather(*file_tasks)
        
        # Phase 4: 聚合所有评论
        all_comments = []
        for comments in file_results:
            all_comments.extend(comments)
        
        # Phase 5: 生成总结（认知层）
        summary = await self.cognition.generate_summary(
            context.changes, all_comments
        )
        
        # Phase 6: 记录本次审查（记忆层）
        await self.memory.store_review(context, all_comments)
        
        # 构建报告
        return ReviewReport(
            pr_id=context.pr_id,
            summary=summary,
            comments=all_comments,
            statistics=self._calculate_stats(all_comments)
        )
    
    async def _analyze_file(
        self,
        change: CodeChange,
        context: ReviewContext
    ) -> List[ReviewComment]:
        """分析单个文件"""
        
        # 并行执行多种分析
        analysis_tasks = [
            self.cognition.analyze_security(change),
            self.cognition.analyze_performance(change),
            self.cognition.analyze_style(change, context.history_reviews),
        ]
        
        results = await asyncio.gather(*analysis_tasks)
        
        # 合并所有发现
        all_comments = []
        for comments in results:
            all_comments.extend(comments)
        
        return all_comments
    
    def _calculate_stats(self, comments: List[ReviewComment]) -> Dict[str, int]:
        stats = {"total": len(comments)}
        for sev in Severity:
            stats[sev.value] = sum(1 for c in comments if c.severity == sev)
        return stats

# ==================== 第3层：认知层 ====================

class LLMProvider(Protocol):
    """LLM 提供商抽象"""
    async def analyze(self, prompt: str, context: Dict) -> str:
        ...

class CognitionLayer:
    """认知层：代码分析与推理"""
    
    def __init__(self, llm: LLMProvider):
        self.llm = llm
        self.security_patterns = self._load_security_patterns()
    
    async def analyze_security(self, change: CodeChange) -> List[ReviewComment]:
        """安全分析"""
        prompt = f"""
        Analyze the following {change.language} code for security issues:
        
        Look for: SQL injection, XSS, path traversal, hardcoded secrets, etc.
        Return findings as JSON array with file_path, line, severity, message.
        """
        
        response = await self.llm.analyze(prompt, {"type": "security"})
        return self._parse_llm_response(response, change.file_path)
    
    async def analyze_performance(self, change: CodeChange) -> List[ReviewComment]:
        """性能分析"""
        prompt = f"""
        Analyze this {change.language} code for performance issues:
        N+1 queries, inefficient loops, memory leaks, etc.
        
        """
        
        response = await self.llm.analyze(prompt, {"type": "performance"})
        return self._parse_llm_response(response, change.file_path)
    
    async def analyze_style(
        self,
        change: CodeChange,
        history: List[Dict]
    ) -> List[ReviewComment]:
        """风格与最佳实践分析"""
        
        # 结合团队历史风格偏好
        style_context = self._extract_team_patterns(history)
        
        prompt = f"""
        Review this code against team style guidelines:
        {style_context}
        
        """
        
        response = await self.llm.analyze(prompt, {"type": "style"})
        return self._parse_llm_response(response, change.file_path)
    
    async def generate_summary(
        self,
        changes: List[CodeChange],
        comments: List[ReviewComment]
    ) -> str:
        """生成审查总结"""
        
        critical_count = sum(1 for c in comments if c.severity == Severity.CRITICAL)
        high_count = sum(1 for c in comments if c.severity == Severity.HIGH)
        
        lines = [
            f"Reviewed {len(changes)} files with {len(comments)} comments.",
        ]
        
        if critical_count > 0:
            lines.append(f"⚠️ Found {critical_count} critical security issues that need immediate attention.")
        if high_count > 0:
            lines.append(f"⚡ Found {high_count} high-priority issues.")
        
        lines.append("Overall code quality assessment based on changes.")
        
        return " ".join(lines)
    
    def _load_security_patterns(self) -> List[str]:
        # 加载已知的安全模式
        return ["eval(", "exec(", "subprocess.call", "os.system"]
    
    def _extract_team_patterns(self, history: List[Dict]) -> str:
        # 从历史审查中提取团队风格偏好
        return "Team prefers explicit error handling over exceptions."
    
    def _parse_llm_response(self, response: str, file_path: str) -> List[ReviewComment]:
        # 解析 LLM 响应为结构化评论
        # 简化实现，实际应使用结构化输出
        return []

# ==================== 第2层：记忆层 ====================

class VectorStore(Protocol):
    async def search(self, query: str, top_k: int) -> List[Dict]:
        ...
    async def upsert(self, documents: List[Dict]) -> None:
        ...

class MemoryLayer:
    """记忆层：审查历史存储与检索"""
    
    def __init__(self, vector_store: VectorStore):
        self.vector_store = vector_store
        self.cache: Dict[str, Any] = {}
    
    async def get_similar_reviews(
        self,
        repository: str,
        author: str
    ) -> List[Dict]:
        """检索相似的审查记录"""
        
        cache_key = f"{repository}:{author}"
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        # 向量检索相关审查
        query = f"code review patterns for {repository} by {author}"
        results = await self.vector_store.search(query, top_k=5)
        
        self.cache[cache_key] = results
        return results
    
    async def store_review(
        self,
        context: ReviewContext,
        comments: List[ReviewComment]
    ) -> None:
        """存储审查记录供未来检索"""
        
        # 构建文档
        document = {
            "id": hashlib.md5(context.pr_id.encode()).hexdigest(),
            "pr_id": context.pr_id,
            "repository": context.repository,
            "author": context.author,
            "comment_count": len(comments),
            "categories": list(set(c.category for c in comments)),
            "timestamp": context.timestamp.isoformat(),
            "content": self._summarize_for_embedding(comments)
        }
        
        await self.vector_store.upsert([document])
    
    def _summarize_for_embedding(self, comments: List[ReviewComment]) -> str:
        """生成用于向量化的摘要"""
        categories = {}
        for c in comments:
            categories.setdefault(c.category, []).append(c.message)
        
        parts = []
        for cat, msgs in categories.items():
            parts.append(f"{cat}: {len(msgs)} issues")
        
        return "; ".join(parts)

# ==================== 第1层：执行层 ====================

class GitHubAPI(Protocol):
    async def get_diff(self, url: str) -> str:
        ...
    async def post_comment(self, pr_id: str, comment: str) -> None:
        ...

class ExecutionLayer:
    """执行层：外部交互与工具执行"""
    
    def __init__(self, github: GitHubAPI, llm_client: Any):
        self.github = github
        self.llm_client = llm_client
    
    async def fetch_diff(self, diff_url: str) -> List[CodeChange]:
        """获取 PR 的 diff 内容"""
        
        diff_content = await self.github.get_diff(diff_url)
        
        # 解析 diff 为 CodeChange 对象
        changes = []
        for file_diff in self._split_by_file(diff_content):
            change = self._parse_file_diff(file_diff)
            changes.append(change)
        
        return changes
    
    async def post_comments(self, pr_id: str, comments: List[ReviewComment]) -> None:
        """将评论发布到 GitHub"""
        for comment in comments:
            formatted = self._format_github_comment(comment)
            await self.github.post_comment(pr_id, formatted)
    
    def _split_by_file(self, diff_content: str) -> List[str]:
        """按文件分割 diff"""
        # 简化实现
        return diff_content.split("diff --git")[1:]
    
    def _parse_file_diff(self, file_diff: str) -> CodeChange:
        """解析单个文件的 diff"""
        lines = file_diff.split("\n")
        
        # 提取文件路径
        file_path = lines[0].split(" b/")[-1] if " b/" in lines[0] else "unknown"
        
        # 统计变更
        additions = sum(1 for l in lines if l.startswith("+"))
        deletions = sum(1 for l in lines if l.startswith("-"))
        
        # 检测语言
        language = self._detect_language(file_path)
        
        return CodeChange(
            file_path=file_path,
            diff=file_diff,
            language=language,
            additions=additions,
            deletions=deletions
        )
    
    def _detect_language(self, file_path: str) -> str:
        """根据文件扩展名检测语言"""
        ext = file_path.split(".")[-1] if "." in file_path else ""
        mapping = {
            "py": "python",
            "js": "javascript",
            "ts": "typescript",
            "go": "go",
            "rs": "rust",
            "java": "java"
        }
        return mapping.get(ext, "text")
    
    def _format_github_comment(self, comment: ReviewComment) -> str:
        """格式化为 GitHub 评论格式"""
        emoji_map = {
            Severity.CRITICAL: "🚨",
            Severity.HIGH: "⚠️",
            Severity.MEDIUM: "💡",
            Severity.LOW: "ℹ️",
            Severity.INFO: "📝"
        }
        
        emoji = emoji_map.get(comment.severity, "💬")
        return f"{emoji} **[{comment.category.upper()}]** {comment.message}"

# ==================== 系统组装 ====================

class CodeReviewAgent:
    """完整的代码审查 Agent"""
    
    def __init__(
        self,
        github_api: GitHubAPI,
        llm_provider: LLMProvider,
        vector_store: VectorStore
    ):
        # 从底层开始构建
        self.execution = ExecutionLayer(github_api, llm_provider)
        self.memory = MemoryLayer(vector_store)
        self.cognition = CognitionLayer(llm_provider)
        self.orchestration = OrchestrationLayer(
            self.cognition, self.memory, self.execution
        )
        self.interface = InterfaceLayer(self.orchestration)
    
    async def review_pr(self, repo: str, pr_number: int) -> str:
        """CLI 入口"""
        return await self.interface.handle_cli(repo, pr_number)
    
    async def handle_webhook(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Webhook 入口"""
        return await self.interface.handle_webhook(payload)

# ==================== 使用示例 ====================

async def main():
    """演示如何使用分层架构的代码审查 Agent"""
    
    # 初始化各层依赖（使用模拟实现）
    class MockGitHubAPI:
        async def get_diff(self, url: str) -> str:
            return """diff --git a/src/main.py b/src/main.py
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/src/main.py
@@ -0,0 +1,10 @@
+import os
+
+def process_user_input(user_data):
+    query = f"SELECT * FROM users WHERE id = {user_data['id']}"
+    os.system(f"mysql -e '{query}'")
+    return eval(user_data['expression'])
+"""
    
    class MockLLMProvider:
        async def analyze(self, prompt: str, context: Dict) -> str:
            # 模拟 LLM 响应
            return "[]"
    
    class MockVectorStore:
        async def search(self, query: str, top_k: int) -> List[Dict]:
            return []
        async def upsert(self, documents: List[Dict]) -> None:
            pass
    
    # 构建 Agent
    agent = CodeReviewAgent(
        github_api=MockGitHubAPI(),
        llm_provider=MockLLMProvider(),
        vector_store=MockVectorStore()
    )
    
    # 执行审查
    report = await agent.review_pr("myorg/myrepo", 123)
    print(report)

if __name__ == "__main__":
    asyncio.run(main())
```

| 分层 | 不分层 |
|------|--------|
| 复杂系统 | 简单脚本 |
| 多团队协作 | 个人工具 |
| 长期维护 | 一次性任务 |
| 需要可测试性 | 快速原型 |
| 多个客户端 | 单一入口 |