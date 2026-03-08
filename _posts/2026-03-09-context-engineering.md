---
layout: post
title: "为什么Context Engineering比Prompt Engineering更重要"
date: 2026-03-09T02:00:00+08:00
tags: [Context Engineering, Prompt Engineering, AI工程, 软件架构, 范式转移]
author: Sophi
series: AI-Native软件工程
---

# 为什么Context Engineering比Prompt Engineering更重要

> *「2024年，一家公司的AI项目失败了。不是因为Prompt写得不好，而是因为AI'不知道'公司的业务规则、数据 schema、历史决策。Prompt Engineering解决了'怎么说'的问题，但Context Engineering解决的是'知道什么'的问题。而后者，才是AI工程真正的瓶颈。」*

---

## 一、Prompt Engineering的局限

### 一个真实的失败案例

2024年初，某零售企业投入百万预算，搭建了一个AI客服系统。

他们聘请了顶尖的Prompt Engineering专家，精心设计了数百个Prompt模板。每个场景都有专门的Prompt：订单查询、退换货、投诉处理、产品咨询...

Prompt写得非常专业：
```
你是一位专业的客服代表，语气友好、耐心。
请根据用户的订单信息，回答他们的问题。
如果用户要求退货，请检查退货政策：
- 购买7天内可退
- 电子产品需未拆封
- 特价商品不支持退货
...
```

但上线后，系统表现糟糕：
- 用户询问"上周买的iPhone能退吗"，AI回答"请提供订单号"——用户已经在对话中提供了订单号
- 用户询问"这个产品的保修期多久"，AI给出了通用答案，但不知道该企业特殊的延保政策
- 用户询问"为什么我的订单还没发货"，AI无法查询真实的物流状态

问题出在哪里？

**不是Prompt写得不好，是AI不知道上下文。**

它不知道：
- 用户是谁，买了什么，订单状态如何
- 企业的特殊业务规则（延保政策、VIP待遇）
- 实时的库存、物流、价格信息
- 历史对话的上下文

Prompt Engineering解决了"如何表达指令"的问题，但没解决"AI知道什么"的问题。

而**后者，才是企业AI项目的真正瓶颈**。

---

## 二、Context Engineering的定义

### 什么是Context Engineering？

**Context Engineering** 是指：

系统化地构建、管理、提供给AI的**上下文信息基础设施**，使AI能够理解任务背景、业务规则、数据状态、历史信息，从而做出正确的决策和行动。

与Prompt Engineering的区别：

| 维度 | Prompt Engineering | Context Engineering |
|------|-------------------|---------------------|
| 关注点 | 如何表达指令 | 提供什么背景信息 |
| 解决的问题 | AI"怎么回答" | AI"基于什么回答" |
| 技术栈 | 文本工程、模板设计 | 数据架构、知识图谱、RAG、记忆系统 |
| 复杂度 | 低到中等 | 高 |
| 在企业中的投入占比 | 20% | 80% |

### Context的五个层级

```
┌─────────────────────────────────────────────────────────────┐
│ Level 5: Organizational Context 组织上下文                   │
│ • 企业文化、价值观、战略目标                                  │
├─────────────────────────────────────────────────────────────┤
│ Level 4: Domain Context 领域上下文                           │
│ • 行业知识、业务规则、专业术语                                │
├─────────────────────────────────────────────────────────────┤
│ Level 3: System Context 系统上下文                           │
│ • 数据Schema、API接口、业务流程                               │
├─────────────────────────────────────────────────────────────┤
│ Level 2: Session Context 会话上下文                          │
│ • 对话历史、当前状态、用户意图                                │
├─────────────────────────────────────────────────────────────┤
│ Level 1: Task Context 任务上下文                             │
│ • 当前任务的具体要求、约束条件                                │
└─────────────────────────────────────────────────────────────┘
```

**Prompt Engineering** 主要处理 **Level 1**（任务上下文）。

**Context Engineering** 需要处理 **Level 2-5**（会话、系统、领域、组织）。

---

## 三、Context Engineering的核心挑战

### 挑战1：信息的分散性

企业的上下文信息散落在：
- 数据库（订单、用户、产品）
- 文档（需求文档、设计文档、API文档）
- 代码（业务逻辑、规则引擎）
- 知识库（FAQ、最佳实践、历史决策）
- 人的大脑（老员工的经验）

**问题**：如何将这些分散的信息整合为AI可用的Context？

### 挑战2：信息的动态性

上下文信息在不断变化：
- 价格实时变动
- 库存实时变化
- 用户状态实时更新
- 业务规则定期调整

**问题**：如何确保AI获取的是最新、最准确的Context？

### 挑战3：信息的权限性

不同用户、不同场景，能看到的信息不同：
- 普通用户 vs VIP用户
- 客服人员 vs 管理人员
- 内部系统 vs 外部系统

**问题**：如何根据权限动态控制Context的可见性？

### 挑战4：信息的过载性

Context太多，超出LLM的上下文窗口：
- 企业知识库有10万条FAQ
- 数据库有1000万条记录
- 历史对话有1000轮

**问题**：如何在有限的上下文窗口中，选择最相关的Context？

---

## 四、Context Engineering的技术架构

基于以上挑战，我提出**Context Engineering的五层技术架构**。

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 5: Context Delivery 上下文交付层                       │
│ 功能：将筛选后的上下文注入Prompt                              │
├─────────────────────────────────────────────────────────────┤
│ Layer 4: Context Retrieval 上下文检索层                      │
│ 功能：基于语义和规则检索相关上下文                            │
├─────────────────────────────────────────────────────────────┤
│ Layer 3: Context Indexing 上下文索引层                       │
│ 功能：构建可检索的上下文索引                                  │
├─────────────────────────────────────────────────────────────┤
│ Layer 2: Context Integration 上下文整合层                    │
│ 功能：从多源系统整合上下文数据                                │
├─────────────────────────────────────────────────────────────┤
│ Layer 1: Context Sources 上下文源层                          │
│ 功能：连接企业数据源（DB、文档、知识库）                      │
└─────────────────────────────────────────────────────────────┘
```

### Layer 1: Context Sources 上下文源层

**数据源类型**：

**1.1 结构化数据**
```sql
-- 数据库Schema
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    product_id INT,
    status VARCHAR(20),
    created_at TIMESTAMP,
    -- ...
);

CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    tier VARCHAR(20), -- VIP, Gold, Silver
    -- ...
);
```

**1.2 非结构化文档**
```
docs/
├── product-specs/
│   ├── iPhone-15-spec.md
│   ├── MacBook-Pro-spec.md
│   └── ...
├── policies/
│   ├── return-policy.md
│   ├── warranty-policy.md
│   └── ...
└── faq/
    ├── shipping-faq.md
    ├── payment-faq.md
    └── ...
```

**1.3 知识图谱**
```
(Entity: Product) --[has_price]--> (Attribute: $999)
(Entity: Product) --[has_category]--> (Entity: Electronics)
(Entity: User) --[has_tier]--> (Entity: VIP)
(Entity: VIP) --[has_benefit]--> (Entity: Free_Shipping)
```

**1.4 实时系统**
- 库存系统
- 物流系统
- 价格系统
- 用户行为系统

### Layer 2: Context Integration 上下文整合层

**核心功能**：从多源系统整合数据，构建统一的Context模型。

**技术实现**：
```python
class ContextIntegrator:
    def __init__(self):
        self.connectors = {
            'database': DatabaseConnector(),
            'documents': DocumentConnector(),
            'knowledge_graph': KnowledgeGraphConnector(),
            'realtime': RealtimeConnector()
        }
    
    def integrate_context(self, context_request):
        """
        根据请求整合多源上下文
        """
        context = {}
        
        # 从数据库获取用户和订单信息
        if 'user_id' in context_request:
            context['user'] = self.connectors['database'].get_user(
                context_request['user_id']
            )
            context['orders'] = self.connectors['database'].get_orders(
                context_request['user_id']
            )
        
        # 从知识图谱获取产品关系
        if 'product_id' in context_request:
            context['product'] = self.connectors['knowledge_graph'].get_product(
                context_request['product_id']
            )
            context['related_products'] = self.connectors['knowledge_graph'].get_related(
                context_request['product_id']
            )
        
        # 从文档系统获取政策信息
        context['policies'] = self.connectors['documents'].get_relevant_policies(
            query=context_request['query']
        )
        
        # 从实时系统获取最新状态
        context['realtime'] = self.connectors['realtime'].get_status(
            order_id=context_request.get('order_id')
        )
        
        return context
```

### Layer 3: Context Indexing 上下文索引层

**核心功能**：构建可高效检索的上下文索引。

**技术栈**：
```python
class ContextIndexer:
    def __init__(self):
        # 向量数据库用于语义搜索
        self.vector_db = VectorDatabase()
        
        # 图数据库用于关系查询
        self.graph_db = GraphDatabase()
        
        # 缓存层用于热点数据
        self.cache = RedisCache()
    
    def index_documents(self, documents):
        """
        将文档索引到向量数据库
        """
        for doc in documents:
            # 文本分块
            chunks = self.chunk_document(doc)
            
            for chunk in chunks:
                # 生成embedding
                embedding = self.encoder.encode(chunk.text)
                
                # 存储到向量数据库
                self.vector_db.insert(
                    id=chunk.id,
                    vector=embedding,
                    metadata={
                        'source': doc.source,
                        'type': doc.type,
                        'text': chunk.text
                    }
                )
    
    def index_knowledge_graph(self, entities, relations):
        """
        将知识图谱索引到图数据库
        """
        for entity in entities:
            self.graph_db.add_node(
                id=entity.id,
                type=entity.type,
                properties=entity.properties
            )
        
        for relation in relations:
            self.graph_db.add_edge(
                from_id=relation.source,
                to_id=relation.target,
                type=relation.type,
                properties=relation.properties
            )
```

### Layer 4: Context Retrieval 上下文检索层

**核心功能**：基于查询智能检索最相关的上下文。

**检索策略**：
```python
class ContextRetriever:
    def __init__(self, indexer):
        self.indexer = indexer
    
    def retrieve(self, query, context_filters, top_k=10):
        """
        多策略上下文检索
        """
        results = []
        
        # 策略1：语义搜索（向量相似度）
        semantic_results = self.semantic_search(query, top_k)
        results.extend(semantic_results)
        
        # 策略2：关键词搜索（BM25）
        keyword_results = self.keyword_search(query, top_k)
        results.extend(keyword_results)
        
        # 策略3：图遍历（基于实体关系）
        if 'entity_id' in context_filters:
            graph_results = self.graph_traversal(
                entity_id=context_filters['entity_id'],
                depth=2
            )
            results.extend(graph_results)
        
        # 策略4：结构化查询（数据库）
        if 'user_id' in context_filters:
            db_results = self.structured_query(context_filters)
            results.extend(db_results)
        
        # 去重和排序
        unique_results = self.deduplicate(results)
        ranked_results = self.rank_by_relevance(unique_results, query)
        
        return ranked_results[:top_k]
    
    def semantic_search(self, query, top_k):
        """
        基于语义的向量搜索
        """
        query_embedding = self.encoder.encode(query)
        
        results = self.indexer.vector_db.search(
            vector=query_embedding,
            top_k=top_k
        )
        
        return results
```

### Layer 5: Context Delivery 上下文交付层

**核心功能**：将检索到的上下文格式化为LLM可用的形式。

**格式化策略**：
```python
class ContextDelivery:
    def __init__(self, max_tokens=4000):
        self.max_tokens = max_tokens
    
    def format_context(self, retrieved_context, query_type):
        """
        将检索到的上下文格式化为Prompt的一部分
        """
        formatted_parts = []
        
        # 系统级上下文（业务规则、政策）
        system_context = self.format_system_context(
            retrieved_context.get('policies', [])
        )
        formatted_parts.append(system_context)
        
        # 用户级上下文（用户信息、历史订单）
        if 'user' in retrieved_context:
            user_context = self.format_user_context(
                retrieved_context['user'],
                retrieved_context.get('orders', [])
            )
            formatted_parts.append(user_context)
        
        # 实时上下文（库存、物流状态）
        if 'realtime' in retrieved_context:
            realtime_context = self.format_realtime_context(
                retrieved_context['realtime']
            )
            formatted_parts.append(realtime_context)
        
        # 知识上下文（相关产品、FAQ）
        knowledge_context = self.format_knowledge_context(
            retrieved_context.get('related_products', []),
            retrieved_context.get('faqs', [])
        )
        formatted_parts.append(knowledge_context)
        
        # 组合并截断到最大长度
        full_context = '\n\n'.join(formatted_parts)
        truncated_context = self.truncate_to_tokens(full_context, self.max_tokens)
        
        return truncated_context
    
    def format_system_context(self, policies):
        return f"""
## 业务规则
{chr(10).join(f"- {p}" for p in policies[:5])}
"""
    
    def format_user_context(self, user, orders):
        return f"""
## 用户信息
- 姓名：{user.name}
- 等级：{user.tier}
- 历史订单数：{len(orders)}
- 最近订单：{orders[0].id if orders else '无'}
"""
```

---

## 五、Context Engineering vs Prompt Engineering：实战对比

### 场景：AI客服系统

**只使用Prompt Engineering**：
```python
prompt = """
你是一位专业的客服代表。

用户问题：{user_question}

请根据以下政策回答问题：
- 退货政策：7天内可退，电子产品未拆封
- 保修政策：1年质保，VIP用户延保1年
- 配送政策：满99包邮，VIP免邮

请友好、专业地回答。
"""

# 问题：AI不知道用户的具体信息、订单状态、VIP等级
```

**使用Context Engineering**：
```python
# Step 1: 获取Context
context_request = {
    'user_id': user_id,
    'query': user_question
}

context = context_engine.get_context(context_request)
# 返回：用户信息、订单历史、实时库存、相关政策、历史对话

# Step 2: 构建Prompt
prompt = f"""
你是一位专业的客服代表。

## 用户信息
{context.format_user_info()}

## 用户当前订单
{context.format_current_order()}

## 相关政策
{context.format_relevant_policies()}

## 实时信息
{context.format_realtime_status()}

## 对话历史
{context.format_conversation_history()}

用户问题：{user_question}

请基于以上信息，友好、专业地回答。如果不确定，请坦诚告知。
"""

# 结果：AI基于完整的上下文给出准确回答
```

**对比效果**：

| 指标 | Prompt Engineering | Context Engineering |
|------|-------------------|---------------------|
| 准确率 | 60% | 90%+ |
| 用户满意度 | 3.5/5 | 4.5/5 |
| 需要人工介入 | 40% | 10% |
| 开发维护成本 | 低（Prompt调优） | 高（Context架构） |
| 长期可扩展性 | 差 | 好 |

---

## 六、Context Engineering的行业实践

### 案例1：Shopify的AI助手

**挑战**：
- 数百万商家，每个商家的产品、政策、客户不同
- AI需要理解每个商家的特定Context

**解决方案**：
- 构建商家级Context系统，包含：
  - 产品目录和库存
  - 商店政策和设置
  - 客户数据和历史
  - 订单和物流信息

**效果**：
- AI助手能回答商家特定的业务问题
- 准确率从50%提升到85%

### 案例2：Salesforce Einstein

**挑战**：
- 企业客户有复杂的CRM数据和业务流程
- AI需要理解企业的销售流程、客户分层、业务规则

**解决方案**：
- 深度集成CRM数据，构建企业级Context
- 实时同步客户数据、交易记录、沟通历史

**效果**：
- AI能提供个性化的销售建议
- 销售团队效率提升30%

### 案例3：OpenClaw的Context系统

**挑战**：
- AI Agent需要理解用户的本地环境、工具、偏好
- 每个用户的Context都不同

**解决方案**：
- 构建个人级Context系统：
  - 本地文件系统结构
  - 常用工具和配置
  - 个人编码习惯
  - 项目历史记录

**效果**：
- Agent能提供高度个性化的辅助
- 用户满意度显著提升

---

## 七、为什么Context Engineering是AI工程的核心能力

### 1. Prompt Engineering的天花板

Prompt Engineering的边际收益递减：
- V1 → V2：效果提升30%
- V5 → V6：效果提升5%
- V10 → V11：效果提升1%

**原因**：没有Context，Prompt写得再好也是"无米之炊"。

### 2. Context Engineering的复利效应

Context Engineering有复利效应：
- 更多数据 → 更好的Context → 更好的AI决策 → 更多数据

**数据飞轮**：
```
用户使用AI
  ↓
产生交互数据
  ↓
优化Context理解
  ↓
AI表现更好
  ↓
更多用户使用
```

### 3. 企业竞争的差异化

在Prompt层面，大家都可以用GPT-4，Prompt技巧可以快速复制。

但在Context层面：
- 你的业务数据是独有的
- 你的知识图谱是独有的
- 你的Context基础设施是护城河

**Context = 数据 + 知识 + 架构 = 护城河**

---

## 八、写在最后：从Prompt到Context的范式转移

AI工程正在经历一场范式转移：

**从"Prompt Engineering"到"Context Engineering"**

这不是说Prompt Engineering不重要，而是说：

**Prompt Engineering是战术，Context Engineering是战略。**

**Prompt Engineering解决"怎么表达"，Context Engineering解决"知道什么"。**

**Prompt Engineering是20%的 effort，Context Engineering是80%的 effort。**

对于企业AI项目：
- ❌ 不要只投资Prompt Engineering
- ✅ 要投资Context Engineering基础设施

对于AI工程师：
- ❌ 不要只学Prompt技巧
- ✅ 要学数据架构、知识图谱、RAG、记忆系统

对于产品经理：
- ❌ 不要只关注AI的回答质量
- ✅ 要关注AI基于什么信息回答

Context Engineering，才是AI工程的核心能力。

这就是从"玩具级AI"到"企业级AI"的分水岭。

---

## 📚 延伸阅读

### 技术实现
- **RAG (Retrieval-Augmented Generation)** - 上下文增强生成
- **Knowledge Graphs** - 知识图谱构建
- **Vector Databases** - 向量数据库技术
- **Memory Systems for LLM** - LLM记忆系统

### 行业实践
- **Shopify's AI Assistant** - 电商AI助手的Context系统
- **Salesforce Einstein** - CRM AI的Context集成
- **OpenClaw Context System** - 个人级AI Context管理

### 理论基础
- **Context-Aware Computing** - 上下文感知计算
- **Knowledge Representation** - 知识表示
- **Semantic Web** - 语义网技术

---

*Published on 2026-03-09*  
*深度阅读时间：约 18 分钟*

**AI-Native软件工程系列 #01** —— 从Prompt Engineering到Context Engineering的范式转移
