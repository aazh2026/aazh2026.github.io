---
layout: post
author: "@postcodeeng"
title: "接口隔离：人类与 AI 的契约设计"
date: 2026-03-15T10:00:00+08:00
tags: [接口隔离, SOLID, Intent-Driven, AI-Native, 软件工程]

redirect_from:
  - /interface-segregation.html
series: AI-Native Engineering
---

# 接口隔离：人类与 AI 的契约设计

> **TL;DR**
>
> - 人类与AI的协作本质上是一种契约关系，接口隔离原则的核心启示是：将"胖接口"拆分为"瘦接口"
> - 三种关键接口：Intent（意图契约）、Context（上下文边界）、Prompt（提示结构化）
> - 好的契约设计让AI成为可靠的协作者，而不是需要不断纠正方向的实习生
> - 核心公式：有效协作 = 清晰的边界 + 明确的契约 + 可预测的错误处理

---

- **第3节**：回顾 SOLID 中的 I——为什么胖接口会毁掉协作
- **第4节**：AI 时代三种新接口形态——Intent、Context、Prompt
- **第5节**：人类-AI 契约设计的四个要素
- **第6节**：实战设计 Intent 接口的粒度与一致性
- **第7节**：接口演化策略——向后兼容的艺术
- **第8节**：三个反直觉洞察
- **第9节**：工具链与最佳实践清单

---

## 接口隔离原则回顾：SOLID 中的 I

### 胖接口 vs 瘦接口

Robert C. Martin 在 SOLID 原则中提出：**"Clients should not be forced to depend on methods they do not use."**

> 💡 **Key Insight**
>
> 胖接口让调用者承担它不需要的负担，瘦接口让每个调用者只拿它真正用得上的东西——这条原则在 AI 时代变成了"让 AI 只看到它完成任务所需的上下文"。

**传统软件中的胖接口问题：**
一个典型的例子是 Java 的 `java.io.FileInputStream`——它同时继承了 `InputStream`、`Closeable`、`AutoCloseable`，但调用者往往只需要读取字节，却被迫背负了关闭、超时等不相关职责。一旦 `Closeable` 接口增加了 `close()` 以外的默认方法，所有实现者都被迫更新。

**瘦接口拆分：**
将上述接口拆分为 `Readable`（只读）、`Closeable`（只关闭）、`Flushable`（只刷新），调用者按需实现——这是接口隔离原则的核心应用。

### 为什么瘦接口更好

| 维度 | 胖接口 | 瘦接口 |
|-----|--------|--------|
| 理解成本 | 高（需要了解全部功能） | 低（只需了解相关部分） |
| 变更影响 | 大（一改牵动全局） | 小（局部修改） |
| 测试难度 | 高（需要覆盖所有方法） | 低（只测相关接口） |
| 可组合性 | 差（难以灵活组合） | 强（按需组合） |

**💡 关键洞察：** 接口隔离的本质是**关注点分离**——让调用者只依赖他们真正需要的东西。

<object data="/assets/images/2026-03-15-interface-segregation-01-fat-vs-thin.svg" type="image/svg+xml" width="100%"></object>

<object data="/assets/images/2026-03-15-interface-segregation-02-contract-architecture.svg" type="image/svg+xml" width="100%"></object>

---

## AI 时代的接口新形态

当人类成为"调用者"、AI 成为"服务提供者"时，接口的形态发生了根本性变化。我们需要三种新接口：

> 💡 **Key Insight**
>
> AI 作为服务提供者意味着接口必须为机器解析而设计，而不是为人类直觉而设计——Intent/Context/Prompt 三层结构是把"模糊的人类意图"转化为"精确的机器指令"的关键桥接。

### Intent 接口：意图的契约

**定义：** Intent 接口是人类表达"想要什么"的规范化方式。

**传统的模糊表达：**
"帮我优化一下这个函数"——这类请求没有说明是性能优化、代码风格优化还是逻辑修复，AI 只能靠猜测。不同时间、不同模型可能给出完全不同的答案，无法形成可重复的协作流程。

**Intent 接口的规范化：**
通过预定义的 Intent 类型和参数结构，将"帮我优化这个函数"这类模糊请求转化为 `Intent { type: "REFACTOR_CODE", target: "function_name", constraints: ["performance", "readability"] }`，让 AI 明确知道要做什么、做到什么程度。

**使用示例：**
```
Intent { type: "REVIEW_CODE", target: "src/auth.py", focus: ["security", "error_handling"] }
→ 返回安全性审查报告和具体修复建议
```

### Context 接口：上下文的边界

**定义：** Context 接口规定了 AI 能"看到"什么、不能"看到"什么。

**Context 的组成：**
```
interface Context {
  // 任务背景：项目类型、技术栈、约束条件
  project: { type: ProjectType, stack: string[], constraints: string[] };
  // 直接相关的代码、文档、配置
  relevant_files: { path: string, purpose: string, lines?: [number, number] }[];
  // 之前的决策、已知的失败模式
  history: { decision: string, rationale: string, date: string }[];
  // 如何判断任务完成
  success_criteria: { check: string, evidence: string }[];
  // 明确排除：AI 不应访问什么
  exclusions: { reason: string, pattern: string }[];
}
```
设计 Context 接口时，关键是问自己："AI 需要什么才能准确完成任务，又不需要什么冗余信息？" 不要把 Context 做成数据仓库，而是做成任务的最小必要条件。

**💡 关键洞察：** 好的 Context 接口不是"给 AI 越多信息越好"，而是"给 AI 刚好足够的信息"。信息过载会导致注意力分散，信息不足会导致猜测和幻觉。

### Prompt 接口：提示的结构化

**定义：** Prompt 接口是将人类意图转化为 AI 可理解指令的模板化机制。

**非结构化的 Prompt（容易出错）：**
"帮我看看这个代码有什么问题"——这类 Prompt 依赖 AI 的主观判断，不同时间、不同模型可能给出完全不同的答案。

**结构化的 Prompt 接口：**
```
{ "intent": "CODE_REVIEW", "target": "src/auth.py", "check": ["security", "performance"], "output_format": "structured" }
```
结构化确保每次调用的一致性和可验证性。

**Prompt 接口的优势：**
1. **可重复** —— 相同输入产生一致输出
2. **可验证** —— 可以检查变量是否完整
3. **可版本化** —— 模板变更可追溯
4. **可组合** —— 小模板组合成大模板

---

## 人类-AI 契约设计

好的契约设计让协作变得可预测。一个完整的人类-AI 契约包含四个要素：

> 💡 **Key Insight**
>
> 好的契约设计让协作变得可预测。一个完整的人类-AI 契约包含四个要素：清晰的边界、明确的输入输出、可预测的错误处理、版本演化策略。

### 清晰的边界

**边界定义了什么属于"这个任务"、什么不属于。**
清晰的边界通过明确的输入输出约定来实现。例如，一个代码审查 Intent 应明确声明：只读指定文件、不修改任何代码、不访问项目外部资源——这样 AI 的行为就可预测、可审计。

### 明确的输入输出

**使用类型系统定义契约：**
```
Intent {
  type: "CODE_GENERATION",
  input: { spec: MarkdownSpec, language: ProgrammingLanguage },
  output: { files: File[], tests: TestSpec[] },
  errors: { INCOMPLETE_SPEC: "缺少必填字段" }
}
```
强类型契约在编译期就能发现参数错误，而不是等到运行时。

### 错误处理约定

**错误处理契约模板：**
```
{ "error": "AMBIGUOUS_INTENT", "detail": "缺少 target 字段", "suggestion": "请指定要操作的目标" }
```
契约应明确定义错误分类：AMBIGUOUS_INTENT、INVALID_INPUT、BOUNDARY_VIOLATION、TIMEOUT 等，让调用者能针对性处理。

### 版本与演化策略

**接口版本化示例：**
```
Intent_v1 { type, ... }      // 初始版本
Intent_v2 { type, context }  // 新增 context 字段（可选）
```
通过主版本号标识不兼容变更，副版本号标识向后兼容的新增功能。

---

## 实战：设计良好的 Intent 接口

### 粒度设计：多细才算合适？

**粒度太粗的问题：**
`Intent { type: "DO_EVERYTHING" }` —— 这种 Intent 过于抽象，AI 无法准确判断具体要做什么，输出结果高度依赖模型的"猜测"。

> 💡 **Key Insight**
>
> 粒度太粗的 Intent 让 AI 靠猜测工作，粒度太细的 Intent 让协作成本超过收益。恰到好处的粒度是一个 Intent 对应一个完整的最小工作单元。

**粒度太细的问题：**
每个字段都单独作为 Intent：`Intent { set_variable_x }`、`Intent { set_variable_y }` —— 过度碎片化导致调用成本激增，组装复杂工作流时调用链过长。

**恰到好处的粒度：**
一个 Intent 对应一个完整的最小工作单元：`Intent { type: "CODE_REVIEW", target: "path/to/file", focus: [...] }` —— 足够具体以避免歧义，又足够独立以支持单独调用和组合。

### 一致性设计：降低认知负荷

**命名一致性：**
同类 Intent 使用统一的命名空间：`CODE_REVIEW`、`CODE_GENERATE`、`CODE_TEST`——保持一致的动词+名词模式，降低学习成本。

**结构一致性：**
所有 Intent 共享相同的顶层字段：`{ type, target, constraints, output_format }`——统一结构让调用方只需实现一次解析逻辑。

### 可组合性设计

**乐高积木式的接口设计：**
将 Intent 拆分为原子级别的小单元——`FETCH_CONTEXT`、`ANALYZE_CODE`、`GENERATE_DIFF`、`VALIDATE_OUTPUT`——每个单元职责单一、可独立测试，可按需组合成复杂工作流。

**实战示例：复杂工作流：**
```
[FETCH_CONTEXT] → [ANALYZE_CODE] → [GENERATE_DIFF] → [VALIDATE_OUTPUT]
     ↑                                        ↓
     ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
```
通过管道组合多个原子 Intent，每个步骤的输出作为下一个步骤的输入，全程可追踪、可中断、可重试。

---

## 接口版本与演化

### 向后兼容的策略

**策略 1：添加而非修改**
新增字段始终作为可选字段引入，现有调用方不受影响。例如 `Intent_v1` 的 `type` 字段在 `Intent_v2` 中仍然支持，同时新增 `context` 字段供调用方选择性使用。

**策略 2：使用可选参数**
必填字段变更为可选字段是向后兼容的，反之则不兼容。设计时将"未来可能变化"的字段标记为可选，避免破坏性变更。

**策略 3：版本协商**
调用方在请求中声明支持的版本：`{ "intent_version": "1.2", ... }`，被调用方返回其支持的最高兼容版本，双方在重叠版本范围内执行。

### 弃用策略

**渐进式弃用流程：**
1. 在弃用版本中标记为 `deprecated: true`，返回警告但不阻断
2. 在下一个主版本中移除支持，AI 返回 `UNSUPPORTED_INTENT_VERSION` 错误
3. 提供迁移指南和自动化检测工具

### 迁移路径

**自动化迁移工具：**
提供 `migrate-intent --from v1 --to v2` 命令，自动将旧版本 Intent 转换为新版本格式，对不兼容字段抛出明确错误而非静默降级。

---

## 反直觉洞察

### 洞察 1："更少上下文 = 更好结果"

**直觉：** 给 AI 越多上下文，它理解得越准确。

**现实：** 上下文过载会导致注意力分散，关键信息被淹没。

### 洞察 2："显式约束 > 隐式理解"

**直觉：** AI 很聪明，应该能"理解"我的意图。

**现实：** 显式的约束比隐式的假设更可靠。

### 洞察 3："契约应该'拒绝'而不是'猜测'"

**直觉：** AI 应该尽可能帮用户完成任务，即使输入不完美。

**现实：** 模糊的输入导致模糊的结果，明确的拒绝比错误的猜测更好。

---

## 工具链与最佳实践

### 7.1 契约定义工具

**JSON Schema 定义契约：**
```json
{ "type": "object", "properties": { "type": { "enum": ["CODE_REVIEW", "CODE_GENERATE"] }, "target": { "type": "string" } }, "required": ["type"] }
```
使用 JSON Schema 可以自动验证 Intent 格式是否合规，在运行时捕获无效请求。

### 7.2 契约验证工具

使用 JSON Schema 验证器（如 `ajv`）在调用前校验 Intent 格式：
```bash
ajv validate --spec=draft7 --schema=intent-schema.json intent.json
```
验证失败的请求应直接返回错误，而不是发送给 AI 处理，避免无效调用消耗资源。

**设计阶段：**
- [ ] 明确定义契约的边界（什么做、什么不做）
- [ ] 使用类型系统定义输入输出
- [ ] 设计合理的错误分类和响应
- [ ] 规划版本演化策略

**实现阶段：**
- [ ] 先写契约，再写实现
- [ ] 为契约编写自动化测试
- [ ] 实现严格的输入验证（拒绝 > 猜测）
- [ ] 记录每个契约的变更日志

**使用阶段：**
- [ ] 在调用前验证输入
- [ ] 处理所有错误情况
- [ ] 监控契约使用情况（频率、成功率、错误分布）
- [ ] 收集反馈持续优化

**演化阶段：**
- [ ] 保持向后兼容至少一个主版本
- [ ] 提前公告弃用计划
- [ ] 提供自动化迁移工具
- [ ] 维护变更日志和迁移指南

### 7.4 契约模板

```json
{
  "intent": {
    "type": "INTENT_TYPE",
    "version": "1.0",
    "target": "resource identifier",
    "constraints": {},
    "context": {}
  },
  "output": {
    "format": "structured",
    "schema": {}
  },
  "errors": [
    { "code": "ERROR_CODE", "message": "Human readable message", "suggestion": "Recovery action" }
  ]
}
```
使用统一模板确保所有 Intent 具备完整的可操作性。

## 结语

接口隔离原则在 AI 时代的核心启示是：**清晰的契约胜过聪明的猜测**。

当人类与 AI 协作时，我们不是在和一个全知的 oracle 对话，而是在和一个强大的 but 需要明确指引的协作者共事。好的契约设计：

1. **降低认知负荷** —— 双方都知道该期待什么
2. **提高可靠性** —— 可预测的结果比"有时候很好"更重要
3. **支持演化** —— 清晰的边界让变更变得可控

**记住这个公式：**
> 有效协作 = 清晰的边界 + 明确的契约 + 可预测的错误处理

在 AI-Native 的开发范式中，花时间在契约设计上，是最值得的投资。因为一旦契约确定，AI 就能成为真正可靠的协作者，而不是一个需要你不断纠正方向的实习生。

**下一步：**
- 回顾你现有的 AI 交互，找出"胖接口"
- 选择一个高频场景，设计一个清晰的 Intent 接口
- 建立团队的 AI 契约规范

---

*本文是 Agent OS 系列的第 4 篇。系列索引：[Agent OS: 重新思考 AI 时代的开发范式](/agent-os-intro/)*

---

## 参考与延伸阅读

1. Robert C. Martin - *Agile Software Development, Principles, Patterns, and Practices* (SOLID 原则来源)
2. *Designing Data-Intensive Applications* - Martin Kleppmann (契约设计的经典)
3. [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) (接口规范的行业标准)
4. [JSON Schema](https://json-schema.org/) (结构化数据验证)

---

*有问题或想法？欢迎在评论区讨论。*
