---
layout: post
title: "领域术语的统一治理：业务术语表与代码命名规范的AI辅助对齐"
date: 2025-05-14T18:00:00+08:00
tags: [AI-Native软件工程, 领域术语, 知识治理, 代码规范]
description: "业务术语与代码命名不一致是AI代码生成质量的头号杀手，通过建立统一术语表定义业务概念与代码命名的显式映射，配合CI自动检测让人机协作基于一致的语义基础。"
author: "@postcodeeng"
series: aise
subtopic: context-engineering
---

> **TL;DR**
>
> 术语不一致是AI代码生成质量的头号杀手：
> 1. **术语鸿沟** — 业务说"客户"，代码写"User"，AI无所适从
> 2. **统一术语表** — 建立企业级业务术语与代码命名的映射
> 3. **AI辅助对齐** — 让AI理解业务语境，生成符合规范的代码
> 4. **持续治理** — 术语是活的，需要持续更新和演进
>
> 关键洞察：没有统一术语的AI生成，就像没有图纸的建筑——混乱且危险。

---

## 术语不一致的问题

### 混乱的现实

**场景：电商系统的命名混乱**

业务文档：
- "客户下单后，订单进入待支付状态"
- "商家可以查看客户的购买历史"

代码实现：
**问题**：
- 同一个业务概念，三种代码命名
- AI生成代码时无所适从
- 跨团队协作困难
- 知识检索效果差

### AI时代的术语危机

**问题1：AI理解困难**

AI 在生成代码时面临选择困境：它从海量互联网代码中训练而来，见过 `UserService`、`ClientManager`、`MemberHandler` 等无数种命名方式，但没有你的业务上下文。当 prompt 说"帮我写一个用户服务"，AI 在 `User`、`Client`、`Member` 之间做选择时，完全依赖概率而非业务规则。结果是：同一个 AI 工具、同一业务场景，每次生成的代码命名都不一样，更遑论跨团队了。

**问题2：RAG效果差**

知识库检索时：
- 搜索"客户" → 只找到部分文档（因为还有"用户"、"会员"）
- 搜索"订单" → 漏掉"交易"相关的知识

**问题3：新人 onboarding 困难**

新开发者需要学习：
- 业务术语
- 各团队的代码命名习惯
- 术语之间的映射关系

学习成本高，容易出错。

### 术语不一致的代价

| 代价类型 | 具体表现 | 量化影响 |
|---------|---------|---------|
| **沟通成本** | 需求讨论时需要反复确认"你说的是哪个XX" | +30%会议时间 |
| **开发效率** | 代码查找困难，理解业务逻辑慢 | -20%开发速度 |
| **Bug率** | 误用术语导致逻辑错误 | +15%Bug率 |
| **维护成本** | 代码可读性差，维护困难 | +50%维护时间 |
| **AI效果** | AI生成代码质量低 | -40%AI采纳率 |

---

## 统一术语治理模型

### 三层术语架构

<img src="/assets/images/2025-05-14-domain-terminology-governance-01-stack.svg" alt="三层术语架构" width="100%" loading="lazy" decoding="async">

### 术语治理原则

**原则1：单一事实来源（Single Source of Truth）**

所有术语定义集中管理，避免多个地方定义同一个术语。

**原则2：业务驱动（Business-Driven）**

术语从业务角度定义，技术命名服务于业务表达。

**原则3：显式映射（Explicit Mapping）**

业务术语和代码命名之间的关系必须显式记录，不能隐式假设。

**原则4：持续治理（Continuous Governance）**

术语是活的，需要随着业务发展持续更新。

---

## 业务术语表设计

### 术语表结构

一个标准的业务术语表条目包含以下核心字段：

| 字段 | 说明 | 示例 |
|------|------|------|
| **term_name** | 术语标准名称（英文） | `Customer` |
| **display_name** | 界面展示名称（中文） | `客户` |
| **definition** | 业务定义，一句话说明含义 | "已注册并完成身份验证的自然人或法人" |
| **alias** | 别名/曾用名 | `Client`, `User`, `Member` |
| **domain** | 所属业务域 | `sales` / `order` |
| **owner** | 术语负责人（业务方） | `产品代表-张三` |
| **status** | 状态：proposed / approved / deprecated | `approved` |
| **code_mapping** | 到代码层的映射规则 | `Customer` (class), `customerId` (field) |
| **example** | 使用示例 | "一个 Customer 可以有多个 Order" |

以电商核心域为例，`客户/Customer` 的完整条目如下：

```json
{
  "term_name": "Customer",
  "display_name": "客户",
  "definition": "在平台完成注册并通过身份验证的买家",
  "alias": ["Client", "Member", "Buyer"],
  "domain": "sales",
  "owner": "产品代表-李明",
  "status": "approved",
  "code_mapping": {
    "class": "Customer",
    "field": {
      "customerId": "string",
      "customerName": "string"
    }
  }
}
```

同样地，`订单/Order` 与 `支付/Payment` 也遵循相同的结构，三者通过 `customerId` 和 `orderId` 形成关联：`Customer 1:N Order`，`Order 1:1 Payment`。术语表本身不解释这些关系——这部分由 DDD 的 bounded context 和 aggregate boundary 负责。

> 💡 **Key Insight**
>
> 术语表定义"是什么"，领域模型定义"怎么组织"。两者组合才是完整的业务知识表示。

### 术语分类体系

术语按业务影响度和 AI 敏感性可以分为三类：

**1. 核心域术语（Core Domain Terms）**

直接代表业务核心概念的术语，数量少但影响面广。例如电商系统中的 `Customer`、`Order`、`Payment`、`Refund`。这类术语的错误使用会直接导致业务逻辑错误或 AI 生成代码的行为偏差。AI 对这类术语的敏感性最高——一旦混淆，生成代码的采纳率会大幅下降。

**2. 支持性术语（Supporting Terms）**

支撑核心域运作的术语，如 `ShippingAddress`（收货地址）、`Invoice`（发票）、`DiscountCode`（优惠码）。它们从核心域延伸出来，定义相对稳定，但跨系统使用时需要显式映射。

**3. 实现特定术语（Implementation-Specific Terms）**

由具体技术实现引入的术语，如数据库表名 `orders_v2`、微服务名 `payment-svc`。这类术语不在业务语言中出现，AI 生成时不应主动使用。

分类的核心标准有两个：**业务影响度**（这个词错了业务会不会挂）和 **AI敏感性**（这个词会不会直接影响 AI 生成质量）。分类结果直接决定术语表的维护优先级：核心域术语最先定义、最严格管控、实现特定术语则可以通过工具自动规范。

### 术语生命周期

术语从出现到消亡，经历以下四个阶段：

**proposed（提案）**：团队成员在日常开发中发现需要新增或修改的术语，提交提案并附上业务定义和代码映射建议。提案进入待评审队列。

**review（评审）**：术语委员会（产品代表、架构师、开发代表、AI工程师）对提案进行评审。核心域术语的评审最为严格，需要产品方和架构方双方确认。评审结果：approved / rejected / needs_revision。

**approved（已批准）**：术语正式进入受控状态。AI 工具和 IDE 插件开始强制使用该术语，拒绝非标准别名。所有新生成代码必须使用批准后的名称。

**deprecated（废弃）**：当业务发生变化，某个术语不再适用时，进入废弃状态。废弃术语在代码中保留（避免大规模重命名），但标记为 deprecated 并指引到新术语。AI 生成时不再推荐使用，但不会报错。

变更审批流程遵循"影响越大、审批越严"的原则：

- **核心域术语变更**：需全体委员会成员同意，需有 2 周公示期
- **支持性术语变更**：产品代表 + 架构师同意即可
- **实现特定术语变更**：开发代表 + CI 检查通过即可

每次变更都需要记录变更日志（change log），包括变更原因、变更日期、影响范围评估。AI 工具在注入 context 时可以读取变更日志，从而理解术语的演进历史。

---

## 代码命名规范

### 命名约定

代码命名规范是术语表在代码层的具身化表达。核心原则有三条：

**一：术语名称即类名**。业务术语的英文名称直接作为主要类的命名，这是最强约束，不可违反。`Customer`、`Order`、`PaymentService` 均直接来自术语表定义。

**二：变体通过组合表达**。术语的复数、时态、或限定形式，通过组合而非改名来表达。`Customer` 的集合是 `CustomerList` 或 `customers`，而不是 `CustomerEntitySet`；`Payment` 的历史记录是 `PaymentHistory`，而不是 `PaymentRecord`。

**三：技术概念不混入业务层**。`Repository`、`Service`、`Factory` 这些架构角色词是技术概念，它们与业务术语组合：`CustomerRepository`、`OrderService`——而不是把技术角色当作业务概念本身。

| 语言 | 类/接口 | 方法/函数 | 变量 | 常量 |
|------|---------|-----------|------|------|
| Java | `PascalCase` | `camelCase` | `camelCase` | `UPPER_SNAKE_CASE` |
| Python | `PascalCase` | `snake_case` | `snake_case` | `UPPER_SNAKE_CASE` |
| TypeScript | `PascalCase` | `camelCase` | `camelCase` | `UPPER_SNAKE_CASE` |

### 类名

类名必须与业务术语的英文名称完全一致，首字母大写，不使用缩写（`Customer` 而非 `Cust`，`Order` 而非 `Ord`）。

**正确示例**：
- `class Customer`
- `class Order`
- `class PaymentService`

**错误示例**：
- `class User`（术语表中 `User` 不是标准名称，`Customer` 才是）
- `class CustInfo`（缩写不清晰）
- `class OrderManager`（`Manager` 是技术角色词，不应混入业务类名）

### 方法名

方法名使用 `camelCase`，命名应体现业务操作而非技术动作。方法名通常由"动词 + 术语"组成：查询类用 `get`/`find`，变更类用 `create`/`update`/`cancel`，列表类用 `list`/`search`。

**正确示例**：`findCustomerById`、`createOrder`、`listPendingPayments`

**错误示例**：`getData`（什么数据？）、`doOrder`（do 语义不清）、`processIt`（代词指代不明）

### 变量名

变量名应描述业务含义而非技术类型。集合类型在变量名末尾加 `s` 或使用复数形式，不使用 `List`/`Map` 等类型后缀。

**正确示例**：`customer`、`order`、`activePayments`、`customerIds`

**错误示例**：`customerMap`（技术类型混入变量名）、`strName`（类型前缀：`str`/`int`/`bool` 是旧式 Hungarian notation）

### 语言特定规范

### Java

Java 的命名规范在 JSR-303 和 Google Java Style Guide 中有详细定义。类名遵循 `PascalCase`：`public class Customer`。方法名和变量名遵循 `camelCase`：`public Customer findCustomerById(String customerId)`。包名全部小写，按组织域名反写结构：`com.example.sales.domain.model`。

对于术语对齐的类，需要在 Javadoc 中标注对应的业务术语：

```java
/**
 * 客户 (Customer)
 * 对应业务术语表: sales.Customer
 * @since 2025-05-01
 */
public class Customer {
    /** 客户唯一标识 */
    private String customerId;
}
```

包结构按 DDD 分层：`domain.model` 放实体和值对象，`application.service` 放应用服务，`infrastructure.persistence` 放仓储实现。业务术语的聚合根（Aggregate Root）放在 `domain.model` 下，是代码与业务术语对齐最紧密的部分。

### Python

Python 遵循 PEP 8，类名使用 `PascalCase`，函数和变量使用 `snake_case`。与 Java 不同，Python 没有强制的包强制结构，但推荐按功能模块组织。

```python
class Customer:
    """客户 (Customer) — 对应术语表: sales.Customer"""
    def __init__(self, customer_id: str, customer_name: str):
        self.customer_id = customer_id
        self.customer_name = customer_name

    def list_orders(self) -> list["Order"]:
        """列出当前客户的所有订单"""
        ...
```

Python 的 Duck Typing 特性要求接口（Protocol）类也遵循相同的命名规范：不是 `ICustomer`（Java 风格），而是 `Customer` 本身作为接口名。实现类可以用 `CustomerImpl` 或带后缀的方式区分。

### TypeScript/JavaScript

TypeScript 的类型系统要求 interface 和 class 名称遵循 `PascalCase`，函数和变量遵循 `camelCase`。由于 JavaScript 的历史包袱，部分遗留代码可能混用命名风格——术语对齐的首要工作是统一新代码风格。

```typescript
// 客户 — 对应术语表: sales.Customer
interface Customer {
  customerId: string;
  customerName: string;
}

class CustomerService {
  findCustomerById(id: string): Promise<Customer | null> {
    // ...
  }
}
```

TypeScript 的 `type` 别名和 `interface` 在术语对齐层面等价，选用哪种取决于团队约定。关键是保持一致性：同一个术语在整个代码库中只映射到同一个类型名。
---

<img src="/assets/images/2025-05-14-domain-terminology-governance-02-ai-alignment.svg" alt="TypeScript/JavaScript" width="100%" loading="lazy" decoding="async">

## AI辅助对齐机制

### AI理解业务语境

AI 模型本身不理解业务——它无法天然知道 `Customer` 和 `User` 在你的系统里是不是同一个概念。但 AI 可以理解**映射关系**：当你在 prompt 里明确告诉它"本系统所有客户相关概念统一用 Customer 表示，禁止使用 User/Client/Member"，它就能遵循这条规则。

术语表在 AI 侧的核心作用是提供**语义锚点（Semantic Anchors）**。没有锚点时，AI 的词汇选择高度依赖 prompt 的措辞——这次写 `User`，下次写 `Client`，生成代码风格不一致。有了术语表，AI 的词汇选择有了唯一正确的答案。

术语之间的关系图（Entity-Relationship）也是重要的上下文。例如：

```text
Customer (客户) —1:N— Order (订单)
Order (订单) —1:1— Payment (支付)
Payment (支付) —N:1— Refund (退款)
```

这些关系告诉 AI：当它生成"取消订单"逻辑时，需要同时考虑 Payment 的状态，而不是孤立处理 Order。

> 💡 **Key Insight**
>
> AI 不懂业务，但它可以理解映射。术语表就是这个映射。

### Context注入

Context 注入是将术语表信息传递给 AI 的机制。注入方式有三种，按信息密度从低到高排列：

**方式一：内联注入（Inline Injection）**。在 prompt 中直接写入术语定义：

```text
术语表：
- Customer（客户）：在平台完成注册并通过身份验证的买家
- Order（订单）：客户提交的购买请求

问题：为"客户查看订单历史"生成接口
```

优点是简单直接，缺点是每次请求都要重复发送，维护成本高。

**方式二：文件引用（File Reference）**。将术语表存为 JSON/YAML 文件，通过路径引用注入：

```yaml
system: 请读取 /glossary/sales-terms.json 并严格遵循其中的命名规范
```

AI 工具在发送请求前自动读取文件内容拼接进 context。术语表由专人维护，AI 实时获取最新版本。

**方式三：向量检索（Vector Retrieval）**。将术语表切分为语义块，存入向量数据库。AI 收到请求时，先通过语义检索找到最相关的术语定义，只注入相关内容。这适合术语表非常庞大的企业级场景。

三种方式可以叠加使用：日常任务用内联注入保证确定性和速度，复杂任务用文件引用确保全面性，超大术语表用向量检索保证精准性。

### 代码生成对齐

代码生成对齐的目标是让 AI 生成的代码使用术语表中的标准名称，而不是它自己的偏好名称。核心机制有三个：

**一：约束生成（Constrained Generation）**。在 system prompt 中明确声明"只允许使用以下类名：Customer、Order、PaymentService。禁止使用：User、Client、Buyer"。这是最直接的约束，AI 的词汇选择被限制在批准列表内。

**二：上下文预热（Context Warming）**。在生成代码前，先向 AI 展示符合规范的示例代码（Reference Code）。AI 会从示例中学习命名风格——看到 `class Customer` 的示例后，自己生成时也倾向于用 `Customer`。

**三：后验纠正（Post-Generation Correction）**。AI 生成代码后，通过静态分析工具扫描输出，如果发现非标准名称（如 `User`），标记为违规并要求修正。这相当于给 AI 生成加了一层质量门。

三种机制组合使用的效果最佳：约束生成保证方向正确，上下文预热保证风格一致，后验纠正兜底捕获遗漏。

> 💡 **Key Insight**
>
> 没有术语治理，AI 代码生成就是"garbage in, garbage out"。

### 生成模板

以下是一个完整的 prompt 模板示例，展示如何将术语表上下文注入 AI 请求：

```markdown
【系统提示 - 必须严格遵循】

你是一位遵循 DDD 设计的 Java 工程师。
本项目的业务术语表定义如下，请生成代码时严格使用表中规定的名称。

## 术语表（sales 域）
| 术语 | 代码名称 | 禁止使用 |
|------|---------|---------|
| 客户 | Customer | User, Client, Member, Buyer |
| 订单 | Order | Transaction, Purchase |
| 支付 | Payment | Transaction, PaymentInfo |

## 命名规范
- 类名：PascalCase（来自术语表的英文名称）
- 方法名：camelCase，动词+术语（如 findCustomerById）
- 变量名：camelCase，使用术语单数或复数形式

【用户请求】
生成"客户下单并支付"的服务层代码，包含 Order 和 Payment 的创建逻辑。
```

模板的三个关键组成部分：术语定义表（明确"是什么"）、命名规范（明确"怎么写"）、业务场景描述（明确"做什么"）。三部分缺一不可——只有术语定义没有命名规范，AI 知道该用 `Customer` 但不知道怎么组织；只有命名规范没有术语定义，AI 可能自己发明 `Client` 这样的名称。

### 示例输出

**没有术语表时，AI 生成的代码**：

```java
// 混乱的命名：User、Client 混用
class UserService {
    Client findClientById(String id);
    List<UserOrder> getUserOrders(String userId);
}
```

问题：`User` 和 `Client` 是两个不同的非标准名称，`UserOrder` 是自创的复合词。代码库中很可能还存在 `Customer`、`Buyer` 等更多变体。

**有术语表时，AI 生成的代码**：

```java
// 一致的命名：全部来自术语表
class CustomerService {
    Customer findCustomerById(String customerId);
    List<Order> listCustomerOrders(String customerId);
}
```

对比效果：命名从混乱变为统一，`Customer`、`Order` 都来自术语表，可追溯、可验证。后续维护者看到 `CustomerService`，直接知道它对应业务中的哪个概念，不需要猜。

AI 生成质量差异的根本原因：没有术语表时，AI 在猜测你的偏好；有术语表时，AI 查表就知道正确答案。

### 命名冲突检测

命名冲突检测是将术语表作为规则引擎，对代码库进行静态分析的过程。检测机制的核心是**模式匹配**：将代码中出现的所有类名、变量名、方法名提取出来，与术语表中的批准名称（及其别名列表）逐一比对。

**检测规则分级**：

- **Error（错误）**：使用了术语表中的禁用名称（alias）。例如代码中出现 `class User`，而术语表规定 `Customer` 是标准名、`User` 是禁用别名，应报 Error。
- **Warning（警告）**：使用了术语表中没有定义但也未被禁用的名称。需要人工判断是否属于合理变体。
- **Info（提示）**：术语表已有标准名称，但代码使用了符合规范的别名形式（alias 在 approved 列表中）。

**检测范围**：覆盖 Java（AST 分析）、Python（AST 分析）、TypeScript（TS checker）的类名、接口名、方法名、变量名、字段名、包名。

**不纳入检测的例外**：
- 第三方库的类名（如 `java.util.HashMap`）
- 测试代码中的 mock 对象（可以有 `MockUser` 这样的测试命名）
- 遗留代码（经过评估后决定不迁移的历史代码）

### 自动检测代码中的术语不一致

自动检测通常集成在 CI/CD 流水线中，作为代码提交的 gate。典型流程：

1. **提交触发**：开发者 push 代码到 feature branch，CI 流水线自动触发术语检查 job
2. **扫描阶段**：静态分析工具遍历本次变更的文件，提取所有标识符，与术语表比对
3. **报告阶段**：生成违规报告，包含违规位置（文件:行号）、违规类型、建议修正方案
4. **阻断/警告**：Error 级别可以配置为阻断合并，Warning 和 Info 只生成报告不阻断

也可以做增量检测：只检查本次变更相关的文件，不扫描整个代码库，以加快反馈速度。

检测工具推荐集成到已有工具链中：
- Java：配合 Checkstyle 或 PMD 的自定义规则
- Python：配合 Pylint 的自定义 plugin
- TypeScript：配合 ESLint 的自定义 rule

> 💡 **Key Insight**
>
> 人类用业务语言思考，AI 用代码语言生成。术语表让两者对齐。

### 示例检测

假设扫描一个 Java 文件，发现以下违规：

```java
public class User {          // Error: User → Customer
    private String clientName; // Error: clientName → customerId
    private String userEmail; // Warning: userEmail → customerEmail
}
```

**检测报告**：

| 行号 | 当前名称 | 术语表规定 | 级别 | 建议修正 |
|------|---------|-----------|------|---------|
| 1 | `User` | `Customer`（禁用别名：`User`, `Client`, `Member`） | Error | 重命名为 `Customer` |
| 3 | `clientName` | `customerId`（`Customer` 字段：customerId） | Error | 重命名为 `customerId` |
| 4 | `userEmail` | `customerEmail`（术语表中无此字段，但 customer → Customer 映射存在） | Warning | 确认为 `Customer` 的字段后使用 `customerEmail` |

开发者收到报告后，手动修正或运行 IDE 提供的 quick-fix（见 IDE 集成部分），将 `User` → `Customer` 等修正一次性应用到代码中。

### IDE集成

IDE 集成是将术语检查能力嵌入开发者日常工作流的关键。目标是让违规在**编写时**被发现，而不是在 CI 运行时才发现。

集成的核心方式是 **LSP（Language Server Protocol）扩展**。LSP 是微软主导的协议，主流 IDE（VS Code、IntelliJ IDEA、PyCharm）均支持。术语 LSP 扩展作为独立的 Language Server，接收 IDE 的文本文档和光标位置查询，返回诊断结果（diagnostics）。

扩展工作流程：

1. 开发者编写代码，保存文件
2. IDE 通过 LSP 协议将文件内容发送给术语 LSP Server
3. LSP Server 读取本地或远程术语表，对文件进行 AST 分析
4. 返回诊断结果（违规类型、位置、建议修正）
5. IDE 在编辑器中渲染内联警告（红色波浪线）和 quick-fix 灯泡

术语表文件可以通过 HTTP API 从中央术语管理平台实时拉取，也可以本地缓存后定期同步。这确保开发者始终使用最新版本的术语规范。

### 实时提示

实时提示（Real-time Hints）在开发者输入时立即给出反馈。典型场景：

开发者在编辑器中输入 `Client`，IDE 立即显示：

```text
⚠️ 术语违规
"Client" 不在批准的业务术语表中
建议：是否使用 "Customer"（已在术语表中注册）
[是] [否] [查看术语表]
```

点击"是"，IDE 自动将 `Client` 替换为 `Customer`。点击"查看术语表"，弹出术语详情卡片，显示 `Customer` 的定义、别名列表、code_mapping 信息。

实时提示的响应延迟要求在 200ms 以内，否则会打断开发者的输入节奏。这意味着术语 LSP Server 需要高效实现：术语表常驻内存，AST 分析走增量算法。

对于 JavaScript/TypeScript 这种动态语言，IDE 需要处理更复杂的情况：变量 `user` 可能指代 `User` 类型，也可能是普通字符串。需要结合 TypeScript 类型信息（如果可用）做更精确的判断。

### 自动补全

自动补全（Autocomplete / IntelliSense）让开发者在输入时就选择正确的术语名称，而不是输入完再纠正。

触发方式：在编辑器中输入任何字母，IDE 的 IntelliSense 弹出候选项。术语 LSP Server 会在候选项中插入术语表中的批准名称，并标记来源（"📋 术语表 - Customer"）。

**示例**：

开发者输入 `cust`，IntelliSense 弹出：
- `Customer` — 📋 术语表 (sales.Customer)
- `Custer` — 本地变量
- `CustomException` — 项目已有类

`Customer` 被优先推荐，且有明确的术语表来源标识。开发者按 Tab 键直接插入 `Customer`。

别名补全也受控：当输入 `user` 时，IntelliSense 不会推荐 `User`（因为它不在术语表中），而是推荐 `Customer` 并提示 `"User" 是 "Customer" 的已禁用别名`。

这种机制将术语合规性从"事后检查"变成"事前引导"——开发者从一开始就用正确的名称，而不是先用错误的再改。

---

## 实施与治理

> 💡 **Key Insight**
>
> 验证还是你的活：术语对齐工具可以检测违规，但判断"这个违规是不是合理的业务例外"仍然需要人。

### 实施路线图

**阶段1：术语盘点（1个月）**

- [ ] 梳理现有业务术语
- [ ] 整理代码中的命名现状
- [ ] 识别命名冲突和不一致
- [ ] 建立术语优先级（核心域优先）

**阶段2：建立术语表（1个月）**

- [ ] 定义核心域术语
- [ ] 建立业务-代码映射
- [ ] 制定命名规范
- [ ] 获得业务方确认

**阶段3：工具集成（1个月）**

- [ ] 部署术语管理平台
- [ ] IDE插件开发/配置
- [ ] CI/CD集成术语检查
- [ ] AI工具集成术语Context

**阶段4：治理运营（持续）**

- [ ] 术语变更审批流程
- [ ] 定期审计代码合规性
- [ ] 新术语快速 onboarding
- [ ] 度量和优化

### 治理组织

**术语委员会**：
- **产品代表**：提供业务定义
- **架构师**：制定技术规范
- **开发代表**：反馈实践问题
- **AI工程师**：确保AI兼容性

**职责**：
- 新术语审批
- 术语变更决策
- 规范更新
- 争议仲裁

### 度量指标

**合规性指标**：
- 术语覆盖率：代码中命名与术语表的匹配率
- 命名一致性：同一业务概念的不同代码命名数量
- 冲突数量：检测到的命名冲突数

**效果指标**：
- AI生成代码采纳率
- 新人上手时间
- 跨团队沟通效率
- Bug率（因术语混淆导致的）

---

## 结尾

术语治理不是一次性的项目，而是一种组织能力。

术语表定义"怎么说"，代码规范定义"怎么写"，AI 工具负责"怎么检查"——三者缺一，术语治理就运转不起来。但三者组合起来，效果是指数级的：沟通成本下降、代码质量上升、AI 生成采纳率提升。

三条立即可落地的行动：

**今天**：在代码库里搜索 `User`、`Client`、`Member` 三个词，统计它们出现的文件和行数。你会发现命名混乱比你想象的更严重。

**本周**：从核心域挑出 5 个最重要的业务术语（电商系统里通常是客户、订单、支付、退款），为每个术语定义英文名称和禁用别名，形成最小化术语表。

**本月**：把这 5 个术语的命名规范注入 AI 编程工具的 system prompt，让 AI 生成代码强制使用标准名称。然后在 CI 里接入一个简单的术语检查 job。

术语治理的 ROI 极高：投入 1 小时统一术语，节省的是后续所有人、所有 AI 工具、所有时间的沟通成本。

## 参考来源

**本系列**
- [AISE框架：AI-Native软件工程理论体系](/aise-framework-theory/)
- [Prompt Library的企业级管理](/prompt-library-enterprise-management/)
- [知识资产化](/knowledge-assetization/)

**领域驱动设计**
- Eric Evans, *Domain-Driven Design*, Addison-Wesley, 2003
- Vaughn Vernon, *Implementing Domain-Driven Design*, Addison-Wesley, 2013

**代码命名规范**
- Google Java Style Guide: https://google.github.io/styleguide/javaguide.html
- PEP 8: https://pep8.org
- Microsoft TypeScript Guidelines: https://typescript.github.io/

*AI-Native Engineering*

*深度阅读时间：约 10 分钟*
