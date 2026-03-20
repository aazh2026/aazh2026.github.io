---
layout: post
title: "Harness Engineering 实战：Everything Claude Code 的系统化约束之道"
date: 2026-03-19T16:00:00+08:00
permalink: /everything-claude-code-harness-engineering/
tags: [AI-Native, Harness-Engineering, Claude-Code, System-Design]
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
> 
> everything-claude-code 是 Harness Engineering 的完整实战案例。它证明了：**AI 工程的核心不是 prompt 调优，而是构建系统化的约束机制（Harness）**。通过 Eval Harness、Rules Engine、自动化 Hooks 和持续学习机制，将不可控的 LLM 输出转化为可预测、可测试、可进化的工程系统。这篇文章从 Harness 的四大支柱出发，深度解析如何用系统化方法"驯服"AI。

---

> **什么是 Harness Engineering？**
> 
> 一句话定义：**把 AI 行为装进一个可测试、可约束、可进化的系统**。
> 
> 不是相信 AI 会做对，而是确保 AI 必须做对。

---

## 目录

1. [Harness Engineering 的本质](#harness-engineering-的本质)
2. [Harness 的四大支柱](#harness-的四大支柱)
3. [Eval Harness：把 AI 行为变成可测试对象](#eval-harness把-ai-行为变成可测试对象)
4. [Rules Engine：系统化约束（不是建议）](#rules-engine系统化约束不是建议)
5. [Hooks & Automation：无人值守的执行层](#hooks--automation无人值守的执行层)
6. [Continuous Learning：经验如何变成机制](#continuous-learning经验如何变成机制)
7. [Agent OS：Harness 的载体与实现](#agent-osharness-的载体与实现)
8. [真实场景推演：CRM 标签推荐系统](#真实场景推演crm-标签推荐系统)
9. [为什么必须 Harness？AI 的不可控性](#为什么必须-harnessai-的不可控性)
10. [从 Prompt 工程到 Harness 工程](#从-prompt-工程到-harness-工程)
11. [总结：Harness 是新的工程范式](#总结harness-是新的工程范式)

---

## Harness Engineering 的本质

### 为什么传统方法失败了？

大多数开发者使用 AI 的方式：

```
精心调优 Prompt → AI 生成代码 → 人工审查 → 发现问题 → 重新调优 Prompt
```

**问题**：
- Prompt 调优是**一次性技巧**，无法复用
- AI 行为**不可预测**，同样的输入可能产生不同输出
- 没有**积累机制**，每次都从零开始
- **质量不可控**，依赖 AI "自觉"

### Harness Engineering 的定义

> **Harness Engineering = 把 AI 行为装进一个可测试、可约束、可进化的系统**

借用 OpenAI 的定义：
> "Harness 是让 AI Agent 保持可控的工具和实践集合。"

但 everything-claude-code 更进一步：
- **不是**给 AI 一套工具让它更自由
- **而是**给 AI 一套约束让它更可靠

### 核心思想对比

| 维度 | Prompt Engineering | Harness Engineering |
|------|-------------------|---------------------|
| **关注点** | 单次对话优化 | 系统化约束设计 |
| **可复用性** | 低（场景特定） | 高（跨项目通用） |
| **可预测性** | 低（非确定性） | 高（约束强制） |
| **质量保障** | 靠运气 | 系统化测试 |
| **持续改进** | 无 | 自动学习沉淀 |

### everything-claude-code 的 Harness 设计

这个项目是 Harness Engineering 的**完整实战案例**：

```
┌─────────────────────────────────────────────────────────┐
│              Harness Engineering 体系                   │
├─────────────────────────────────────────────────────────┤
│  1️⃣ Eval Harness（测试层）                               │
│     └── 把 AI 行为变成可测试对象                         │
├─────────────────────────────────────────────────────────┤
│  2️⃣ Rules Engine（约束层）                               │
│     └── 系统化强制，不是建议                             │
├─────────────────────────────────────────────────────────┤
│  3️⃣ Hooks & Automation（执行层）                        │
│     └── 无人值守的自动化流水线                           │
├─────────────────────────────────────────────────────────┤
│  4️⃣ Continuous Learning（进化层）                        │
│     └── 经验自动沉淀为机制                               │
└─────────────────────────────────────────────────────────┘
```

**核心洞察**：
> "不是相信 AI 会做对，而是确保 AI 必须做对。"

---

## Harness 的四大支柱

everything-claude-code 的 Harness 体系由四个核心支柱构成：

```
┌─────────────────────────────────────────────────────────┐
│                   Harness 四大支柱                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌──────────────┐    ┌──────────────┐                 │
│   │    Eval      │    │    Rules     │                 │
│   │   Harness    │    │   Engine     │                 │
│   │   (测试层)    │    │   (约束层)    │                 │
│   └──────┬───────┘    └──────┬───────┘                 │
│          │                   │                         │
│          └─────────┬─────────┘                         │
│                    │                                   │
│            ┌───────┴───────┐                           │
│            │  AI Behavior  │                           │
│            └───────┬───────┘                           │
│                    │                                   │
│          ┌─────────┴─────────┐                         │
│          │                   │                         │
│   ┌──────┴───────┐    ┌──────┴───────┐               │
│   │    Hooks     │    │   Learning   │               │
│   │  (执行层)     │    │   (进化层)    │               │
│   └──────────────┘    └──────────────┘               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 支柱 1：Eval Harness（测试层）

**核心问题**：如何知道 AI 做得对不对？

**解决方案**：把 AI 输出当作产品，建立测试体系。

```yaml
# Capability Eval
Task: Generate API endpoint
Success Criteria:
  - Has error handling
  - Has input validation
  - Has tests
Test Method: automated_check

# Regression Eval
Task: Maintain existing functionality
Baseline: previous_version
Test Method: run_full_test_suite

# Metrics
pass@k: 5 attempts, 80% success rate
```

**关键洞察**：
- AI 输出不是"艺术品"，而是"产品"
- 产品必须有质量标准
- 标准必须可测试

### 支柱 2：Rules Engine（约束层）

**核心问题**：如何防止 AI 做错？

**解决方案**：系统化强制（不是建议）。

```
传统方式：
"请记得写测试" → AI 可能忘记

Harness 方式：
Rule: "所有函数必须有单元测试"
Enforcement: Reviewer Agent 强制检查
Result: 无测试 = 无法通过审查
```

**约束类型**：
- **硬约束**：必须满足（如安全规则）
- **软约束**：建议满足（如代码风格）
- **流程约束**：必须按步骤执行（如 TDD）

### 支柱 3：Hooks & Automation（执行层）

**核心问题**：如何自动化执行 Harness？

**解决方案**：自动触发机制。

| Hook | 触发时机 | 动作 |
|------|---------|------|
| `pre-commit` | 提交前 | 自动 review |
| `post-eval` | 评估后 | 记录 metrics |
| `session-stop` | 会话结束 | continuous-learning |
| `error-occurs` | 出错时 | 查询知识库 |

**核心价值**：无人值守的自动化流水线。

### 支柱 4：Continuous Learning（进化层）

**核心问题**：如何让 Harness 越用越强？

**解决方案**：经验自动沉淀为机制。

```
Session 1: AI 犯错 → 人工纠正
    ↓
Session 2: AI 可能再犯同样错误
    ↓
Continuous Learning: 提取模式 → 生成新 Skill
    ↓
Session 3+: AI 自动避免该错误
```

**关键突破**：
- 传统 AI：每次都是 fresh start
- Harness：每次都在进化

---

## Eval Harness：把 AI 行为变成可测试对象

### 为什么需要 Eval Harness？

**LLM 的核心问题：非确定性**

```
同样的 prompt，不同时间可能产生：
- 版本 A：正确但冗长
- 版本 B：简洁但有 bug
- 版本 C：完全偏离主题
```

人类工程师：
- 可以 review 代码质量
- 可以判断是否符合需求
- 可以指出具体问题

但这个过程是**人工、耗时、不可规模化的**。

### Eval Harness 的设计

**核心理念**：把"判断 AI 做得对不对"也变成可自动化的任务。

#### 1. Capability Eval（能力评估）

**问题**：AI 是否具备完成特定任务的能力？

**示例**：

```yaml
# eval-harness.yaml
capability: api_generation
task: |
  生成一个 FastAPI 端点，实现用户注册功能
  
  要求：
  - 输入验证（email, password）
  - 密码哈希存储
  - 返回 JWT token
  - 错误处理

evaluation_criteria:
  - criterion: input_validation
    check: "是否有 email 格式验证？"
    method: static_analysis
    
  - criterion: password_hashing
    check: "是否使用 bcrypt 而非明文存储？"
    method: pattern_matching
    
  - criterion: jwt_generation
    check: "是否返回有效的 JWT token？"
    method: runtime_test
    
  - criterion: error_handling
    check: "是否有 try-catch 和适当的 HTTP 状态码？"
    method: static_analysis

scoring:
  type: binary  # 通过/不通过
  # 或者
type: scale_1_10  # 1-10 分评分
```

**执行流程**：

```
AI 生成代码
    ↓
Capability Eval 运行
    ↓
逐项检查 criteria
    ↓
生成评估报告
    ↓
通过 → 继续
不通过 → 反馈给 AI 重新生成
```

#### 2. Regression Eval（回归评估）

**问题**：新功能是否破坏了旧功能？

**示例**：

```yaml
regression:
  baseline: commit_abc123  # 已知良好的版本
  test_suite: full_integration_tests
  
checks:
  - test: user_authentication_flow
    must_pass: true
    
  - test: database_migrations
    must_pass: true
    
  - test: api_response_times
    threshold: p99 < 200ms
```

**关键设计**：
- 每次修改后自动运行全量测试
- 对比 baseline 确保没有退化
- 量化指标（响应时间、错误率等）

#### 3. pass@k 指标

**问题**：AI 的成功率有多高？

**定义**：k 次尝试中至少成功 1 次的概率。

```
pass@1 = 第一次就成功的概率
pass@5 = 5 次内至少成功 1 次的概率
pass@10 = 10 次内至少成功 1 次的概率
```

**示例**：

```yaml
metrics:
  pass@k:
    k_values: [1, 3, 5, 10]
    target:
      pass@1: ">= 60%"
      pass@5: ">= 85%"
      pass@10: ">= 95%"
    
  tracking:
    - metric: pass@k_over_time
      purpose: 观察 AI 能力是否提升
```

**应用场景**：
- 评估不同 prompt 的效果
- 评估不同模型的能力
- 追踪项目随时间的改进

### Eval Harness 在 everything-claude-code 中的实现

**触发方式**：

```bash
# 用户触发
/eval run capability-name

# 自动触发（Hook）
pre-commit: eval run regression
```

**输出示例**：

```
═══════════════════════════════════════════
           Eval Harness Report
═══════════════════════════════════════════

Task: Generate API endpoint
Status: ✅ PASS

Criteria Results:
┌─────────────────────┬────────┐
│ Criterion           │ Status │
├─────────────────────┼────────┤
│ input_validation    │ ✅ PASS│
│ password_hashing    │ ✅ PASS│
│ jwt_generation      │ ✅ PASS│
│ error_handling      │ ⚠️ WARN│
└─────────────────────┴────────┘

Score: 8.5/10

Notes:
- Error handling exists but could be more specific
- Consider using custom exception classes

═══════════════════════════════════════════
```

---

## Rules Engine：系统化约束（不是建议）

### Prompt vs Rule：本质区别

| 维度 | Prompt | Rule |
|------|--------|------|
| **性质** | 请求 | 约束 |
| **强制性** | 软 | 硬 |
| **可检查性** | 难 | 易 |
| **一致性** | 低 | 高 |

**示例对比**：

```
【Prompt 方式】
"请写代码时记得处理错误"
→ AI 可能记得，可能忘记
→ 处理质量不一

【Rule 方式】
Rule: "所有函数必须有 try-catch"
Enforcement: Reviewer Agent 检查
Result: 不符合 = 无法通过
```

### Rules 的分类

#### 1. 硬约束（Hard Constraints）

**定义**：必须满足，不满足则拒绝。

**示例**（security.md）：

```markdown
# 安全规则（强制）

## 输入验证
- [强制] 所有用户输入必须验证
- [强制] SQL 查询必须使用参数化
- [强制] 不能拼接 SQL 字符串

## 认证授权
- [强制] 敏感操作必须验证身份
- [强制] JWT 必须设置过期时间
- [强制] 密码必须哈希存储（bcrypt）

## 数据保护
- [强制] 敏感数据不能记录到日志
- [强制] API 响应不能包含内部错误详情
- [强制] HTTPS 必须强制启用

违规处理：
- Reviewer Agent 必须标记为 Critical
- 必须修复后才能提交
```

#### 2. 软约束（Soft Constraints）

**定义**：建议满足，不满足可以讨论。

**示例**（coding-style.md）：

```markdown
# 编码规范（建议）

## 命名
- [建议] 函数名使用动词开头
- [建议] 常量使用 UPPER_SNAKE_CASE
- [建议] 类名使用 PascalCase

## 结构
- [建议] 函数长度 < 50 行
- [建议] 文件长度 < 500 行
- [建议] 圈复杂度 < 10

违规处理：
- Reviewer Agent 标记为 Warning
- 可以讨论后豁免
```

#### 3. 流程约束（Process Constraints）

**定义**：必须按特定流程执行。

**示例**（tdd-process.md）：

```markdown
# TDD 流程（强制）

## 步骤
1. [强制] RED: 先写测试（测试必须先失败）
2. [强制] GREEN: 实现代码（让测试通过）
3. [强制] REFACTOR: 重构优化（保持测试通过）
4. [强制] VERIFY: 运行全部测试

## 检查点
- 没有测试不能写实现
- 测试不通过不能进入下一步
- 重构后必须重新运行测试

违规处理：
- 流程中断
- 返回上一步重新执行
```

### Rules Engine 的实现

**Reviewer Agent 的工作流程**：

```
AI 生成代码
    ↓
Reviewer Agent 启动
    ↓
加载所有 Rule 文件
    ↓
逐项检查
    ↓
生成审查报告
    ├─ Critical: 必须修复
    ├─ Warning: 建议修复
    └─ Info: 仅供参考
    ↓
Critical 未修复？
    ├─ 是 → 拒绝提交
    └─ 否 → 通过
```

### Rule 文件的演进

**V1: 静态规则**

```markdown
- [强制] 所有函数必须有 docstring
```

**V2: 参数化规则**

```yaml
rule: docstring_required
scope: [public_functions, classes]
exceptions: [test_files, private_methods]
severity: critical
```

**V3: 自适应规则**

```yaml
rule: docstring_required
learning:
  source: past_reviews
  pattern: "哪些函数被人工豁免了 docstring"
  update: "自动调整规则范围"
```

---

## Hooks & Automation：无人值守的执行层

### 为什么需要 Hooks？

**问题**：Harness 需要人工触发，效率低、容易遗漏。

**解决方案**：自动化触发机制。

### Hook 类型

#### 1. 代码生命周期 Hooks

| Hook | 触发时机 | 动作 | 目的 |
|------|---------|------|------|
| `pre-write` | AI 开始写代码前 | 加载相关 Skill | 准备上下文 |
| `post-write` | AI 写完代码后 | 运行 linter | 即时检查 |
| `pre-commit` | 用户尝试提交前 | 运行 full eval | 质量门禁 |
| `post-commit` | 提交成功后 | 更新 metrics | 数据追踪 |

**示例**（.claude/hooks.yaml）：

```yaml
hooks:
  - name: pre-commit-eval
    trigger: pre-commit
    action:
      type: eval
      target: regression
    block_on_failure: true
    
  - name: auto-review
    trigger: post-write
    action:
      type: review
      reviewer: default
    
  - name: update-metrics
    trigger: post-commit
    action:
      type: metric
      operation: record
```

#### 2. 会话生命周期 Hooks

| Hook | 触发时机 | 动作 | 目的 |
|------|---------|------|------|
| `session-start` | 新会话开始 | 加载项目上下文 | 保持一致性 |
| `session-stop` | 会话结束 | 运行 continuous-learning | 经验沉淀 |
| `error-occurs` | AI 出错时 | 查询知识库 | 快速恢复 |
| `checkpoint` | 用户标记检查点 | 保存状态 | 长期记忆 |

**示例**：

```yaml
hooks:
  - name: load-context
    trigger: session-start
    action:
      type: context
      source: last_checkpoint
      
  - name: learn-from-session
    trigger: session-stop
    action:
      type: learning
      min_messages: 10
      pattern_types: [error_resolution, architecture_decision]
```

#### 3. 条件触发 Hooks

**基于状态的条件触发**：

```yaml
hooks:
  - name: security-alert
    trigger: post-write
    condition:
      type: pattern_match
      pattern: "sql.*format|eval\(|exec\("
    action:
      type: alert
      severity: critical
      message: "Potential security issue detected"
      
  - name: performance-check
    trigger: post-write
    condition:
      type: file_change
      path: "*.py"
    action:
      type: eval
      target: performance
```

### Automation 的价值

**传统方式**：
```
AI 生成代码
    ↓
人工：记得运行测试
    ↓
人工：检查一下代码风格
    ↓
人工：看看有没有安全问题
    ↓
人工：可以提交了
```

**Harness 自动化方式**：
```
AI 生成代码
    ↓
[自动] post-write hook: linter
[自动] pre-commit hook: eval harness
[自动] Reviewer Agent: rule check
    ↓
全部通过 → 自动提交
有失败 → 阻断并提示
```

**关键差异**：
- 传统：依赖人的记忆和自觉性
- Harness：系统化强制，不会遗漏

---

## Continuous Learning：经验如何变成机制

### 传统 AI 的遗忘问题

```
Session 1:
AI: "我应该如何处理这个错误？"
Human: "你应该这样做..."
AI: "明白了！"

Session 2 (一周后):
AI: "我应该如何处理这个错误？"  
Human: "（同样的解释）"
AI: "明白了！"
```

**问题**：AI 没有长期记忆，同样的错误会反复出现。

### Continuous Learning 的设计

**核心理念**：把人工纠正变成系统能力。

#### 学习流程

```
Session 结束
    ↓
评估对话有效性
    ↓
提取有价值的模式
    ├─ 错误解决模式
    ├─ 架构决策模式
    ├─ 用户偏好模式
    └─ 工具使用模式
    ↓
生成新 Skill 文件
    ↓
保存到学习目录
    ↓
后续会话自动加载
```

#### 实现细节

**Step 1: 评估有效性**

```python
def evaluate_session(messages):
    """评估对话是否值得学习"""
    
    # 过滤条件
    if len(messages) < 10:
        return {"effective": False, "reason": "too_short"}
    
    # 检测价值模式
    value_patterns = [
        "error_resolution",      # 错误解决
        "debugging_techniques",  # 调试技巧
        "user_corrections",      # 用户纠正
        "architecture_decisions", # 架构决策
        "refactoring_patterns"   # 重构模式
    ]
    
    detected = detect_patterns(messages, value_patterns)
    
    return {
        "effective": len(detected) > 0,
        "patterns": detected
    }
```

**Step 2: 模式提取**

```python
def extract_patterns(messages, pattern_type):
    """从对话中提取特定模式"""
    
    if pattern_type == "error_resolution":
        # 寻找：错误 → 尝试 → 失败 → 纠正 → 成功
        pattern = {
            "trigger": "FastAPI dependency injection error",
            "symptoms": ["AttributeError", "Depends not working"],
            "solution": "Use Depends() with callable, not direct instance",
            "example": "async def get_db(): yield db",
            "frequency": count_occurrences(messages, "dependency injection")
        }
    
    elif pattern_type == "user_preferences":
        # 寻找：用户反复要求的风格
        pattern = {
            "preference": "prefer_type_hints",
            "evidence": ["请添加类型注解", "需要类型提示"],
            "scope": "all_python_files"
        }
    
    return pattern
```

**Step 3: 生成 Skill**

```yaml
# ~/.claude/skills/learned/fastapi-dependency-injection.yaml
name: fastapi-dependency-injection
learned_from: session-2026-03-19
confidence: high  # 基于出现频率

triggers:
  - error: "Dependency injection failed"
  - error: "AttributeError in Depends"
  - keyword: ["Depends", "dependency injection"]

context: |
  ## FastAPI 依赖注入常见错误
  
  ### 错误模式
  ```python
  # ❌ 错误：直接使用实例
  db = Database()
  
  @app.get("/items")
  def get_items(db: Database = Depends(db)):  # 错误！
      ...
  ```
  
  ### 正确模式
  ```python
  # ✅ 正确：使用可调用对象
  def get_db():
      db = Database()
      try:
          yield db
      finally:
          db.close()
  
  @app.get("/items")
  def get_items(db: Database = Depends(get_db)):  # 正确！
      ...
  ```
  
  ### 检查清单
  - [ ] 是否使用了 yield 而不是 return？
  - [ ] 是否处理了资源释放？
  - [ ] 是否使用 callable 作为 Depends 参数？
```

### 学习效果

**使用前**：
```
Week 1: 遇到依赖注入错误 3 次，每次人工解释
Week 2: 遇到同样的错误 2 次，每次人工解释
Week 3: 遇到同样的错误 2 次...
```

**使用后**（Continuous Learning）：
```
Week 1: 遇到错误 → 人工解释 → 系统自动学习
Week 2: 遇到错误 → AI 自动应用已学习的 Skill → 快速解决
Week 3+: 错误率显著下降
```

### 学习的边界

**什么应该学习**：
- ✅ 项目特定的模式
- ✅ 用户的编码偏好
- ✅ 常见错误及解决方案
- ✅ 架构决策上下文

**什么不应该学习**：
- ❌ 通用的编程知识（已有训练数据）
- ❌ 过时的技术（需要定期清理）
- ❌ 临时的 workaround（需要标记）

---

## Agent OS：Harness 的载体与实现

### 为什么需要 Agent OS？

Harness Engineering 是**方法论**，Agent OS 是**实现载体**。

```
Harness Engineering（理论）
    ↓
everything-claude-code（实现）
    ↓
Agent OS（运行环境）
```

### Agent OS 的五层架构

#### Layer 5: 角色层（Agents）

**职责分离，避免"一个脑子"问题**。

| Agent | 职责 | 不做什么 |
|-------|------|---------|
| **Planner** | 架构设计、任务分解 | 不写代码 |
| **Coder** | 代码实现 | 不做架构决策 |
| **Reviewer** | 质量审查 | 不写代码 |

**协作流程**：
```
User Request
    ↓
Planner: 分解任务，输出设计文档
    ↓
Coder: 按设计实现代码
    ↓
Reviewer: 检查代码质量
    ↓
通过 → 提交
不通过 → 返回 Coder 修改
```

#### Layer 4: 能力层（Skills）

**可复用的能力模块**。

| Skill | 功能 | 对应 Harness 支柱 |
|-------|------|------------------|
| **TDD** | 测试驱动开发流程 | Rules（流程约束）|
| **eval-harness** | 能力评估 | Eval |
| **continuous-learning** | 自动学习 | Learning |

**Skill 的本质**：封装特定能力的"AI 插件 + 行为模板"。

#### Layer 3: 控制层（Rules）

**对应 Harness 的约束层**。

```
coding-style.md    → 编码规范
security.md        → 安全规则
testing.md         → 测试要求
tdd-process.md     → 流程约束
```

#### Layer 2: 执行层（Commands）

**用户与 Harness 交互的接口**。

| 命令 | 功能 | 激活的 Harness 组件 |
|------|------|-------------------|
| `/plan` | 架构规划 | Planner Agent |
| `/tdd` | TDD 开发 | Coder + TDD Skill + Rules |
| `/eval` | 能力评估 | eval-harness |
| `/review` | 代码审查 | Reviewer + Rules Engine |
| `/checkpoint` | 保存状态 | 持久化层 |

#### Layer 1: 工具层（MCP）

**AI 直接操作外部系统**。

| MCP | 功能 | 用途 |
|-----|------|------|
| **GitHub** | 代码仓库操作 | 自动提交、创建 PR |
| **Supabase** | 数据库操作 | 查询数据、修改结构 |
| **API** | 外部服务 | 调用第三方 API |

**核心价值**：消灭"人工搬运"环节。

### Agent OS 与 Harness 的关系

```
┌─────────────────────────────────────────────┐
│              Harness Engineering            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │  Eval   │ │  Rules  │ │  Hooks  │       │
│  │Harness  │ │ Engine  │ │   &     │       │
│  │         │ │         │ │ Learning│       │
│  └────┬────┘ └────┬────┘ └────┬────┘       │
│       └───────────┼───────────┘             │
│                   │                         │
│  ┌────────────────┴────────────────┐       │
│  │        Agent OS (实现)           │       │
│  │  ┌─────┐ ┌──────┐ ┌──────────┐  │       │
│  │  │Agents│ │Skills│ │Commands  │  │       │
│  │  └─────┘ └──────┘ └──────────┘  │       │
│  └─────────────────────────────────┘       │
└─────────────────────────────────────────────┘
```

**关系**：
- Harness 是**理论框架**
- Agent OS 是**实现载体**
- everything-claude-code 是**具体实现**
│  Layer 3: 控制层 (Rules)                                 │
│  ├── coding-style.md: 编码规范                           │
│  ├── security.md: 安全规则                               │
│  └── testing.md: 测试要求                                │
├─────────────────────────────────────────────────────────┤
│  Layer 2: 执行层 (Commands)                              │
│  ├── /plan: 规划模式                                     │
│  ├── /tdd: TDD 开发模式                                  │
│  ├── /verify: 验证模式                                   │
│  └── /review: 审查模式                                   │
├─────────────────────────────────────────────────────────┤
│  Layer 1: 工具层 (MCP)                                   │
│  ├── GitHub MCP: 代码仓库操作                            │
│  ├── Supabase MCP: 数据库操作                            │
│  └── API MCP: 外部服务集成                               │
└─────────────────────────────────────────────────────────┘
```

### Layer 5: 角色层 — 多 Agent 分裂

**核心思想**：避免"一个脑子"问题。

传统单 Agent：
```
用户：开发一个功能
Agent：（同时思考规划 + 写代码 + 检查质量）
结果：混乱、遗漏、自我矛盾
```

多 Agent 分裂：
```
用户：开发一个功能
Planner：（只负责规划）
  ↓
Coder：（只负责实现）
  ↓
Reviewer：（只负责审查）
结果：专业分工、质量可控
```

**关键设计**：
- 每个 Agent 有明确的职责边界
- Agent 之间通过结构化输出协作
- 避免上下文污染和能力混淆

### Layer 4: 能力层 — 可复用技能模块

**Skill 的定义**：封装特定能力的"AI 插件 + 行为模板"。

示例技能：

**TDD Skill**：
```yaml
name: tdd-flow
description: 测试驱动开发流程
triggers:
  - command: /tdd
steps:
  - RED: 生成测试用例
  - GREEN: 实现代码
  - REFACTOR: 优化结构
  - VERIFY: 运行测试
```

**eval-harness Skill**：
```yaml
name: eval-harness
description: AI 行为评估系统
capabilities:
  - capability-eval: 能力是否实现
  - regression-eval: 是否破坏旧功能
  - pass@k: 多次尝试成功率
```

**continuous-learning Skill**：
```yaml
name: continuous-learning
description: 自动学习沉淀
triggers:
  - hook: session-stop
actions:
  - 评估对话有效性
  - 提取有价值的模式
  - 生成新技能文件
```

### Layer 3: 控制层 — 机械约束（不是建议）

**核心思想**：把工程规范"编译进系统"。

不是：
```
Prompt: "请遵循我们的编码规范"
结果：AI 可能遵循，可能忽略
```

而是：
```
Rule File: coding-style.md
内容：具体的、可检查的规范
执行：Reviewer Agent 强制检查
结果：不符合规范无法通过
```

**规则示例**（coding-style.md）：
```markdown
# 编码规范（强制）

## 错误处理
- [强制] 所有函数必须有 try-catch
- [强制] 错误必须记录日志
- [强制] 不能吞掉异常

## 测试
- [强制] 新功能必须有单元测试
- [强制] 测试覆盖率 > 80%
- [强制] 边界情况必须测试

## 安全
- [强制] 用户输入必须验证
- [强制] SQL 必须使用参数化查询
- [强制] 敏感数据不能硬编码
```

**关键区别**：Prompt 是建议，Rules 是约束。

### Layer 2: 执行层 — 结构化命令

**Command 是用户与系统交互的接口**：

| 命令 | 作用 | 触发 Agent |
|------|------|-----------|
| `/plan` | 架构规划 | Planner |
| `/tdd` | TDD 开发 | Coder + TDD Skill |
| `/verify` | 系统验证 | Reviewer |
| `/review` | 代码审查 | Reviewer |
| `/eval` | 能力评估 | eval-harness |
| `/checkpoint` | 保存关键节点 | 系统 |

**设计原则**：
- 每个命令对应明确的模式
- 命令内部有严格的执行流程
- 用户不需要记住复杂的 prompt

### Layer 1: 工具层 — MCP 直接操作世界

**MCP（Model Context Protocol）**：AI 直接操作外部系统的标准接口。

**GitHub MCP**：
```python
# AI 可以直接执行
- 创建分支
- 提交代码
- 创建 PR
- 查看 CI 状态
```

**Supabase MCP**：
```python
# AI 可以直接操作
- 查询数据库
- 修改表结构
- 查看性能指标
```

**核心价值**：消灭"人工搬运"环节。

传统流程：
```
AI 生成代码 → 人工复制 → 粘贴到编辑器 → 提交到 Git
```

MCP 流程：
```
AI 生成代码 → MCP 直接提交到 Git
```

---

## 真实场景推演：CRM 标签推荐系统

我们用完整的 everything-claude-code 系统来开发一个真实功能。

### 需求

> 开发一个 SaaS CRM 的「客户标签推荐系统」
> 
> 功能：根据客户行为和资料，自动推荐标签

### 阶段 1：规划（/plan）

**用户输入**：
```
/plan Build customer tagging recommendation system
```

**系统内部**：

1. **Command Router** 识别 `/plan` 命令
2. **Planner Agent** 启动
3. **输出结构化规划**：

```markdown
# 客户标签推荐系统 - 架构设计

## 服务拆分
- tag-service: 标签管理核心服务
- recommendation-engine: 推荐算法引擎
- embedding-service: 客户资料向量化

## 技术选型
- Embedding: OpenAI text-embedding-3-small
- Vector DB: Pinecone / pgvector
- API: FastAPI + pydantic
- Cache: Redis

## API 定义
POST /api/v1/customers/{id}/tags/recommend
Response: { "tags": ["high-value", "tech-savvy", ...] }

## 数据模型
- Customer: id, profile, behaviors[]
- Tag: id, name, criteria, embedding
- Recommendation: customer_id, tags[], confidence, created_at

## 实现步骤
1. 数据模型设计
2. Embedding 服务搭建
3. 相似度计算算法
4. API 端点实现
5. 测试覆盖
```

**核心价值**：避免"直接写代码 → 重构地狱"

### 阶段 2：TDD 开发（/tdd）

**用户输入**：
```
/tdd Implement tag suggestion API
```

**系统内部执行循环**：

#### 🔴 RED（先写测试）

**TDD Skill 触发**：
```python
# 生成的测试用例
def test_tag_recommendation_basic():
    customer = create_customer(
        industry="technology",
        size="enterprise",
        behaviors=["downloaded_whitepaper", "attended_webinar"]
    )
    response = client.post(f"/api/v1/customers/{customer.id}/tags/recommend")
    assert response.status_code == 200
    assert "tech-savvy" in response.json()["tags"]
    assert "high-value" in response.json()["tags"]

def test_tag_recommendation_empty_customer():
    customer = create_empty_customer()
    response = client.post(f"/api/v1/customers/{customer.id}/tags/recommend")
    assert response.status_code == 200
    assert response.json()["tags"] == []

def test_tag_recommendation_confidence_scoring():
    customer = create_customer_with_partial_data()
    response = client.post(f"/api/v1/customers/{customer.id}/tags/recommend")
    for tag in response.json()["tags"]:
        assert "confidence" in tag
        assert 0 <= tag["confidence"] <= 1
```

#### 🟢 GREEN（实现功能）

**Coder Agent 编写代码**：
```python
@app.post("/api/v1/customers/{customer_id}/tags/recommend")
async def recommend_tags(customer_id: str):
    # 获取客户资料
    customer = await get_customer(customer_id)
    
    # 向量化
    customer_embedding = await embed_customer(customer)
    
    # 相似度搜索
    similar_tags = await vector_search(customer_embedding, top_k=5)
    
    # 过滤和排序
    recommended = filter_by_confidence(similar_tags, threshold=0.7)
    
    return {"tags": recommended}
```

#### 🔵 REFACTOR（优化）

**重构代码结构**：
- 提取 embedding 逻辑到服务层
- 优化数据库查询
- 添加缓存

#### ✅ VERIFY

**运行测试**：
```
pytest tests/test_tag_recommendation.py -v
# 所有测试通过
```

**边界检查**：
- 空客户资料处理
- 大量标签性能
- 并发请求

### 阶段 3：实时评估（eval-harness）

**用户输入**：
```
/eval run tag-recommendation
```

**eval-harness Skill 执行**：

```yaml
# Capability Eval
Task: Generate API with error handling
Success Criteria:
  - 有 try-catch 块
  - 有日志记录
  - 有输入验证
Status: ✅ PASS

# Regression Eval
Task: Check existing functionality
Tests:
  - customer_crud: ✅ PASS
  - auth_middleware: ✅ PASS
Status: ✅ NO REGRESSION

# pass@k Metric
Attempts: 5
Success Rate: 4/5 = 80%
Status: ✅ ACCEPTABLE
```

**核心价值**：AI 开发的"单元测试系统"

### 阶段 4：代码审查（/review）

**Reviewer Agent 检查清单**：

```markdown
## 代码审查报告

### 语法错误
✅ 无语法错误

### 异常处理
✅ 有 try-catch
⚠️ 建议：添加更具体的异常类型

### 安全漏洞
✅ 无 SQL 注入风险
✅ 用户输入已验证
⚠️ 建议：添加速率限制防止滥用

### 性能
✅ 使用了缓存
⚠️ 建议：考虑添加数据库索引

### 建议修改
1. 第 45 行：使用更具体的 ValueError 替代通用 Exception
2. 第 67 行：添加 @rate_limit 装饰器
3. 第 89 行：为 customer_tags 表添加索引
```

### 阶段 5：系统验证（/verify）

**边界测试**：
- 空客户资料
- 极大标签数量
- 并发请求

**异常路径**：
- 数据库连接失败
- Embedding 服务不可用
- 向量搜索超时

**性能分析**：
- P50 响应时间: 45ms
- P99 响应时间: 120ms
- 吞吐量: 1000 req/s

### 阶段 6：Checkpoint（关键设计冻结）

**保存关键状态**：

```bash
/checkpoint
```

**系统保存**：
- 当前架构设计
- 关键决策记录
- 上下文摘要
- 经验教训

**用于**：
- 长期项目记忆
- 新成员 onboarding
- 架构演进追踪

---

## 持续自我改进：经验如何变成机制

### 传统 AI 的问题

> "每次都是 fresh start"

同样的错误会反复出现，因为没有记忆和沉淀。

### continuous-learning Skill 的设计

**触发时机**：Session 结束（Stop Hook）

**自动执行三件事**：

#### 1️⃣ 评估本次对话

```python
def evaluate_session(messages):
    """评估对话有效性"""
    if len(messages) < 10:
        return "insufficient_data"
    
    value_patterns = [
        "error_resolution",
        "debugging_techniques", 
        "user_corrections",
        "architecture_decisions"
    ]
    
    detected = detect_patterns(messages, value_patterns)
    
    return {
        "effective": len(detected) > 0,
        "patterns": detected
    }
```

#### 2️⃣ 模式提取

**识别有价值的模式**：

```python
# 示例：错误解决模式
pattern = {
    "type": "error_resolution",
    "trigger": "FastAPI dependency injection error",
    "solution": "Use Depends() with callable, not direct instance",
    "context": "async def get_db(): yield db",
    "frequency": 3  # 出现了3次
}
```

#### 3️⃣ 生成新技能

**保存到学习目录**：

```bash
~/.claude/skills/learned/
├── fastapi-patterns.md      # 提取的模式
├── common-errors.md         # 常见错误
├── user-preferences.md      # 用户偏好
└── project-context.md       # 项目上下文
```

**生成的 Skill 示例**：

```yaml
# ~/.claude/skills/learned/fastapi-dependency-injection.yaml
name: fastapi-dependency-injection
learned_from: session-2026-03-19
triggers:
  - error: "Dependency injection failed"
  - keyword: ["Depends", "dependency"]
context: |
  当遇到 FastAPI 依赖注入错误时：
  
  常见错误：
  ```python
  # 错误：直接使用实例
  def get_db(): return Database()
  
  # 正确：使用可调用对象
  def get_db(): 
      db = Database()
      try:
          yield db
      finally:
          db.close()
  ```
  
  检查点：
  - 是否使用了 yield 而不是 return？
  - 是否处理了资源释放？
```

### 🔥 关键突破

| 传统 AI | everything-claude-code |
|---------|----------------------|
| 每次都是 fresh start | 每次都在进化 |
| 同样错误反复出现 | 错误变成知识 |
| 无积累 | 经验沉淀为技能 |
| 依赖个人 prompt 技巧 | 系统化能力提升 |

---

## Harness Engineering：最关键的工程创新

### 什么是 Harness Engineering？

一句话定义：

> "把 AI 行为'装进一个可测试、可约束、可进化的系统'"

不是相信 AI 会做对，而是**确保 AI 必须做对**。

### 在 everything-claude-code 中的实现

#### 1️⃣ Eval Harness（测试层）

**把 AI 行为变成可测试对象**：

```yaml
# Capability Eval
Task: Generate API endpoint
Success Criteria:
  - Has error handling
  - Has input validation  
  - Has tests
  - Follows coding style
Test Method: automated_check

# Regression Eval  
Task: Maintain existing functionality
Baseline: previous_version
Test Method: run_full_test_suite

# Metrics
pass@k: 5 attempts, 80% success rate
stability: std_dev < 0.1
```

**关键洞察**：
- AI 输出不是"艺术品"，而是"产品"
- 产品必须有质量标准
- 标准必须可测试

#### 2️⃣ Rules（约束层）

**系统化强制（不是建议）**：

```
传统方式：
"请记得写测试" → AI 可能忘记

everything-claude-code：
Rule: "所有函数必须有单元测试"
Enforcement: Reviewer Agent 强制检查
Result: 无测试 = 无法通过审查
```

**约束类型**：
- **硬约束**：必须满足（如安全规则）
- **软约束**：建议满足（如代码风格）
- **流程约束**：必须按步骤执行（如 TDD）

#### 3️⃣ Hooks（执行层）

**自动触发机制**：

| Hook | 触发时机 | 动作 |
|------|---------|------|
| `pre-commit` | 提交前 | 自动 review |
| `post-eval` | 评估后 | 记录 metrics |
| `session-stop` | 会话结束 | continuous-learning |
| `error-occurs` | 出错时 | 查询知识库 |

**核心价值**：自动化流水线，无需人工干预。

#### 4️⃣ Metrics（度量层）

**量化 AI 表现**：

```yaml
metrics:
  pass@k:
    description: k次尝试成功率
    target: >= 80%
    
  regression_rate:
    description: 破坏旧功能的概率
    target: < 5%
    
  code_quality_score:
    description: 代码质量评分
    factors:
      - test_coverage: 40%
      - style_compliance: 30%
      - security_score: 30%
    target: >= 85
    
  development_velocity:
    description: 开发速度
    unit: features/week
    baseline: human_baseline
```

### 和传统工程的对比

| 维度 | 传统软件工程 | AI Harness Engineering |
|------|-------------|----------------------|
| **测试对象** | 代码 | AI 行为 |
| **单元测试** | 函数测试 | Capability eval |
| **集成测试** | 模块测试 | Regression eval |
| **CI/CD** | 自动化部署 | 自动 hooks |
| **编码规范** | lint | Rules engine |
| **代码审查** | 人工 review | Reviewer Agent |
| **质量度量** | code coverage | pass@k, metrics |

### 为什么必须 Harness？

**因为 LLM 的本质特性**：

1. **非确定性**：同样的输入可能产生不同输出
2. **幻觉倾向**：可能生成看似正确但实际错误的内容
3. **上下文限制**：无法一次性记住所有约束
4. **错误累积**：小的偏差会随时间放大

**解决方案**：用系统约束代替"靠 AI 自觉"

---

## 系统流程图：完整运行视图

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Input                               │
│                     /plan /tdd /verify                          │
└─────────────────────────┬───────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Command Router                             │
│              识别命令类型 → 路由到对应 Agent                     │
└─────────────────────────┬───────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                        Agent Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Planner    │  │    Coder     │  │   Reviewer   │          │
│  │  (架构设计)   │  │   (代码实现)  │  │  (质量审查)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────┬───────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                        Skills Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │     TDD      │  │     Eval     │  │   Learning   │          │
│  │  (测试驱动)   │  │   (评估)      │  │   (学习)      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────┬───────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                       Rules Engine                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Coding    │  │   Security   │  │    Testing   │          │
│  │   (编码规范)  │  │   (安全规则)  │  │   (测试要求)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────┬───────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                        MCP Tools                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    GitHub    │  │     DB       │  │     APIs     │          │
│  │   (代码仓库)  │  │   (数据库)    │  │   (外部服务)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────┬───────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                       Eval Harness                              │
│              能力评估 / 回归测试 / 质量检查                       │
└─────────────────────────┬───────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                       Metrics Layer                             │
│              pass@k / 历史追踪 / 基线对比                         │
└─────────────────────────┬───────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                  Continuous Learning Hook                       │
│                    模式提取 → 新技能生成                         │
└─────────────────────────┬───────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Improved System                            │
│                         进化后的系统                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 关键洞察：AI 工程的未来形态

### 1️⃣ AI 工程的核心不是"模型"，是"控制系统"

everything-claude-code 证明：

```
❌ Prompt Engineering（调优提示词）
✅ System Engineering（设计控制系统）
```

**模型能力正在快速收敛**（GPT-4、Claude、Gemini 差距缩小），**系统设计的差异将成为核心竞争力**。

### 2️⃣ 最重要的能力：把"经验 → 机制"

| 经验 | 机制 |
|------|------|
| 人类经验 | → Skill |
| Bug | → Eval |
| Code Review | → Reviewer Agent |
| 最佳实践 | → Rules |
| 项目知识 | → Checkpoint |

**持续学习不是可选项，是必选项**。

### 3️⃣ 未来软件工程形态

**从**：
```
Human writes code
```

**到**：
```
Human defines system
    ↓
AI executes inside harness
    ↓
System measures and improves
```

**开发者角色的转变**：

| 传统 | AI-Native |
|------|-----------|
| 写代码 | 设计约束 |
| Debug | 设计 Eval |
| Code Review | 训练 Reviewer |
| 技术决策 | 架构 Harness |

---

## 总结：从使用 AI 到设计系统

everything-claude-code 不是一个工具，而是一个**工程范式**。

它告诉我们：

1. **不要只关注 Prompt** — 那是表层技巧
2. **投资系统设计** — 这才是长期价值
3. **建立约束机制** — 不要相信 AI 自觉
4. **持续学习沉淀** — 把经验变成机制
5. **量化度量一切** — 不可测量的无法改进

### 最后思考

当我们谈论"AI 编程"时，大多数人想到的是：

> "让 AI 帮我写代码"

everything-claude-code 展示的是另一个愿景：

> "设计一个系统，让 AI 在约束下高效、可靠地工作"

这不是替代人类工程师，而是**升级人类工程师的角色**——从执行者变成设计师，从编码者变成系统架构师。

**Harness Engineering** 可能是软件工程下一个十年的核心范式。

---

## 参考与延伸阅读

- [everything-claude-code GitHub](https://github.com/affaan-m/everything-claude-code) - 开源项目
- [Skills.sh - everything-claude-code](https://skills.sh/affaan-m/everything-claude-code) - Skill 市场
- [Harness Engineering - Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html) - 理论基础
- [Building Effective Agents - Anthropic](https://www.anthropic.com/engineering/building-effective-agents) - Agent 设计最佳实践

---

*本文基于 everything-claude-code 开源项目的深度架构分析。*

*发布于 [postcodeengineering.com](/)*
