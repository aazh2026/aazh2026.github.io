---
layout: post
title: "PDD：Prompt作为第一等制品"
date: 2025-06-07T00:00:00+08:00
tags: [AI-Native软件工程, PDD, Prompt工程, 版本控制, Code Review]
author: "@postcodeeng"
series: AI-Native软件工程系列 #5
---

> **TL;DR**
> 
003e 本文核心观点：
> 1. **Prompt即代码** — Prompt需要版本控制、Code Review、CI/CD
> 2. **制品升级** — Prompt与源代码、测试、文档并列成为核心交付物
> 3. **工程化标准** — Prompt的编写、评审、部署需要标准化流程
> 4. **资产沉淀** — 高质量Prompt是可复用的组织知识资产

---

## 📋 本文结构

1. [为什么Prompt是第一等制品](#为什么prompt是第一等制品) — 从临时指令到核心资产
2. [Prompt版本控制](#prompt版本控制) — 如何管理Prompt的演进
3. [Prompt Code Review](#prompt-code-review) — 评审什么，怎么评审
4. [Prompt CI/CD](#prompt-cicd) — 自动化测试与部署
5. [Prompt资产管理](#prompt资产管理) — 组织级Prompt库建设
6. [结论](#结论) — PDD的工程化成熟度模型

---

## 为什么Prompt是第一等制品

> 💡 **Key Insight**
> 
003e 当AI生成代码成为常态，决定代码质量的不是编程技巧，而是Prompt质量。Prompt就是新时代的"源代码"。

### 软件制品的演进

```
2000年: 源代码是唯一制品
    ↓
2010年: 源代码 + 测试 + 文档
    ↓
2020年: 源代码 + 测试 + 文档 + 配置 + 基础设施代码
    ↓
2026年: 以上所有 + Prompt
```

### Prompt的核心地位

| 场景 | 没有Prompt | 有高质量Prompt |
|------|-----------|---------------|
| 新功能开发 | AI随机生成，需大量修改 | 一次生成接近可用 |
| Bug修复 | 反复试错 | 精确定位，定向修复 |
| 代码重构 | 可能引入新问题 | 保持行为一致 |
| 代码审查 | 人工检查所有代码 | 审查Prompt即可 |
| 知识传递 | 依赖文档和口头 | Prompt即文档 |

**Prompt质量直接决定AI产出质量。**

### Prompt作为制品的特征

```
源代码的特征          Prompt的特征
──────────────────────────────────────
可版本控制    ←→    可版本控制
可Code Review ←→    可Code Review
可测试        ←→    可测试（输出验证）
可复用        ←→    可复用（模板化）
有最佳实践    ←→    有最佳实践
需要维护      ←→    需要维护
```

**Prompt完全符合"第一等制品"的定义。**

---

## Prompt版本控制

> 💡 **Key Insight**
> 
003e Prompt的微小改动可能导致输出巨大变化。版本控制不仅是备份，更是可追溯的实验记录。

### Prompt版本控制挑战

**挑战1：语义版本不适用**

```
Prompt v1.0:
"实现一个用户登录功能"

Prompt v1.1:
"实现一个用户登录功能，使用JWT token"

Prompt v1.2:
"实现一个用户登录功能，使用JWT token，
 支持刷新机制，token过期时间30分钟"

都是"小改动"，但输出差异巨大。
```

**挑战2：难以diff**

```
- 实现用户登录
+ 实现用户登录和注册

这个diff没有显示真正的变化：注册功能的
约束条件、字段要求、验证规则...
```

**挑战3：输出不稳定**

```
同一个Prompt，两次运行结果可能不同。
如何知道是Prompt改了，还是AI随机性？
```

### Prompt版本控制方案

```yaml
# prompt.yaml
version: "2.1.0"
name: user-authentication
author: aaron@company.com
date: 2025-06-07

metadata:
  purpose: 用户认证模块实现
  domain: 电商系统
  language: TypeScript
  framework: NestJS

# 结构化Prompt，便于版本对比
context:
  system: 电商APP后端
  module: 认证中心
  
constraints:
  - 使用JWT进行状态管理
  - 密码使用bcrypt加密
  - 支持token刷新机制
  - 实现速率限制（5次/分钟）
  
acceptance_criteria:
  - 登录成功返回access_token和refresh_token
  - token过期时间：access 30分钟，refresh 7天
  - 密码错误时返回统一错误信息（不暴露用户存在性）
  - 记录登录日志（IP、时间、设备）

examples:
  - input: {username: "user@example.com", password: "correct"}
    output: {success: true, tokens: {...}}
  - input: {username: "user@example.com", password: "wrong"}
    output: {success: false, error: "Invalid credentials"}

# 版本历史
changelog:
  - version: "2.1.0"
    date: 2026-03-15
    changes:
      - 添加速率限制要求
      - 明确token过期时间
    author: aaron
    
  - version: "2.0.0"
    date: 2026-03-10
    changes:
      - 从Session迁移到JWT
      - 添加刷新机制
    author: aaron
    
  - version: "1.0.0"
    date: 2026-03-01
    changes:
      - 初始版本
    author: aaron
```

### Git管理Prompt的最佳实践

```
repo/
├── prompts/
│   ├── auth/
│   │   ├── login.yaml          # 登录Prompt
│   │   ├── register.yaml       # 注册Prompt
│   │   └── reset-password.yaml # 重置密码Prompt
│   ├── payment/
│   │   ├── checkout.yaml
│   │   └── refund.yaml
│   └── common/
│       ├── error-handling.yaml
│       └── logging.yaml
├── src/                        # 生成的源代码
├── tests/                      # 生成的测试
└── docs/                       # 生成的文档
```

**Commit Message规范：**
```
[prompt] auth/login: 添加速率限制约束

- 添加：5次/分钟登录限制
- 修改：错误信息不暴露用户存在性
- 影响：输出代码第45-67行

验证：已通过regression测试
```

---

## Prompt Code Review

> 💡 **Key Insight**
> 
003e Review Prompt比Review代码更高效：改Prompt一分钟，改代码可能需要一小时。

### Prompt Review检查清单

```markdown
## Prompt Review Checklist

### 完整性 ✓
- [ ] 上下文是否充分？（系统、模块、用户）
- [ ] 约束是否明确？（性能、安全、合规）
- [ ] 验收标准是否可验证？
- [ ] 是否有示例输入/输出？

### 精确性 ✓
- [ ] 术语使用是否一致？
- [ ] 是否有歧义表达？
- [ ] 边界条件是否覆盖？
- [ ] 异常场景是否说明？

### 可复用性 ✓
- [ ] 是否使用了通用模板？
- [ ] 是否有硬编码值应该参数化？
- [ ] 是否可被其他场景复用？

### 安全性 ✓
- [ ] 是否包含敏感信息？
- [ ] 是否考虑了注入攻击？
- [ ] 是否遵循最小权限原则？

### 版本兼容 ✓
- [ ] 是否与相关Prompt保持一致？
- [ ] 变更是否向下兼容？
- [ ] 是否需要更新依赖的Prompt？
```

### Review流程示例

**提交的Prompt：**
```yaml
name: payment-processing
version: "1.0.0"
context:
  system: 支付网关
constraints:
  - 支持信用卡和PayPal
  - 实现3D Secure验证
  - 记录所有交易日志
```

**Reviewer反馈：**
```markdown
## Review Comments

### ⚠️ 缺失关键约束
- 重试策略：支付失败后的重试次数和间隔？
- 幂等性：同一笔订单多次请求如何处理？
- 超时：支付接口超时时间？

### ⚠️ 安全考虑不足
- 建议添加：PCI DSS合规要求
- 建议添加：敏感数据脱敏规则
- 建议添加：异常交易的告警阈值

### 💡 建议改进
- 添加示例：成功的支付流程
- 添加示例：失败的支付流程（余额不足）
- 考虑添加：部分退款的支持

请修改后重新提交。
```

### AI辅助Prompt Review

```python
class PromptReviewer:
    def review(self, prompt: Prompt) -> ReviewReport:
        report = ReviewReport()
        
        # 使用LLM检查完整性
        completeness = self.llm.check_completeness(prompt)
        if not completeness.ok:
            report.add_issue("完整性", completeness.suggestions)
        
        # 检查与现有Prompt的一致性
        conflicts = self.check_consistency(prompt)
        for conflict in conflicts:
            report.add_issue("一致性", conflict)
        
        # 生成测试用例验证Prompt
        test_results = self.validate_with_tests(prompt)
        if test_results.failure_rate > 0.1:
            report.add_issue("可靠性", f"测试失败率: {test_results.failure_rate}")
        
        return report
```

---

## Prompt CI/CD

> 💡 **Key Insight**
> 
003e Prompt变更必须经过自动化验证，确保输出质量稳定。Prompt的CI/CD是整个AI-Native开发流程的基石。

### Prompt测试金字塔

```
           ▲
          ▲▲▲       集成测试：Prompt + 上下文 → 完整功能
         ▲▲▲▲▲
        ▲▲▲▲▲▲▲     契约测试：Prompt输出格式验证
       ▲▲▲▲▲▲▲▲▲
      ▲▲▲▲▲▲▲▲▲▲▲    单元测试：单个Prompt输出质量
```

### Prompt CI Pipeline

```yaml
# .github/workflows/prompt-ci.yml
name: Prompt CI

on:
  push:
    paths:
      - 'prompts/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # 1. Prompt语法检查
      - name: Lint Prompts
        run: |
          prompt-lint prompts/
      
      # 2. 模式验证
      - name: Schema Validation
        run: |
          validate-prompt-schema prompts/
      
      # 3. 生成测试
      - name: Generate Test Outputs
        run: |
          for prompt in prompts/**/*.yaml; do
            ai-generate --prompt $prompt --output test-output/
          done
      
      # 4. 运行测试套件
      - name: Run Tests
        run: |
          pytest tests/prompt-validation/
      
      # 5. 回归测试
      - name: Regression Tests
        run: |
          prompt-regression-test --baseline main --current HEAD
      
      # 6. 质量评分
      - name: Quality Score
        run: |
          prompt-quality-score --output report.json
      
      # 7. 发布（仅main分支）
      - name: Publish to Prompt Registry
        if: github.ref == 'refs/heads/main'
        run: |
          prompt-registry publish prompts/
```

### Prompt测试示例

```python
# tests/test_auth_login_prompt.py

import pytest
from prompt_tester import PromptTester

tester = PromptTester()

class TestAuthLoginPrompt:
    """测试登录Prompt的输出质量"""
    
    def test_prompt_generates_required_files(self):
        """验证生成了所有必要文件"""
        result = tester.run_prompt("auth/login.yaml")
        
        assert "controller.ts" in result.files
        assert "service.ts" in result.files
        assert "dto.ts" in result.files
        assert "test.spec.ts" in result.files
    
    def test_jwt_implementation_correct(self):
        """验证JWT实现符合要求"""
        result = tester.run_prompt("auth/login.yaml")
        code = result.get_file("service.ts")
        
        assert "jwt.sign" in code
        assert "refreshToken" in code
        assert "30m" in code or "30 * 60" in code  # 30分钟过期
    
    def test_rate_limit_implemented(self):
        """验证速率限制已实现"""
        result = tester.run_prompt("auth/login.yaml")
        code = result.get_file("controller.ts")
        
        assert "@Throttle" in code or "rateLimit" in code
        assert "5" in code  # 5次限制
    
    def test_security_considerations(self):
        """验证安全考虑"""
        result = tester.run_prompt("auth/login.yaml")
        code = result.get_file("service.ts")
        
        # 不暴露用户存在性
        assert "Invalid credentials" in code
        assert "User not found" not in code
        
        # 使用bcrypt
        assert "bcrypt" in code or "bcryptjs" in code
    
    def test_regression_no_auth_bypass(self):
        """回归测试：确保没有认证绕过漏洞"""
        result = tester.run_prompt("auth/login.yaml")
        
        vulnerabilities = tester.security_scan(result)
        assert not vulnerabilities.critical
```

### Prompt部署策略

```
┌─────────────────────────────────────────┐
│  Prompt Registry (Prompt仓库)           │
├─────────────────────────────────────────┤
│                                         │
│  auth/login@2.1.0  ← 生产环境使用       │
│  auth/login@2.2.0-beta  ← 测试环境      │
│  auth/login@3.0.0-alpha  ← 开发中       │
│                                         │
└─────────────────────────────────────────┘

部署流程：
1. PR合并 → 自动生成Prompt版本
2. 自动化测试通过 → 标记为beta
3. 人工验收通过 → 提升为stable
4. 灰度发布 → 逐步替换生产Prompt
5. 监控输出质量 → 回滚或全量发布
```

---

## Prompt资产管理

> 💡 **Key Insight**
> 
003e 高质量Prompt是可复用的知识资产。组织级Prompt库是AI-Native企业的核心竞争力。

### Prompt库架构

```
organization-prompts/
├── standards/
│   ├── code-style.yaml          # 代码风格规范
│   ├── error-handling.yaml      # 错误处理标准
│   ├── logging.yaml             # 日志规范
│   └── security.yaml            # 安全要求
│
├── domains/
│   ├── e-commerce/
│   │   ├── checkout.yaml
│   │   ├── inventory.yaml
│   │   └── payment.yaml
│   ├── fintech/
│   │   ├── kyc.yaml
│   │   └── compliance.yaml
│   └── healthcare/
│       └── hipaa-compliance.yaml
│
├── frameworks/
│   ├── nestjs/
│   │   ├── crud-module.yaml
│   │   └── auth-module.yaml
│   ├── react/
│   │   ├── component.yaml
│   │   └── hook.yaml
│   └── django/
│       └── rest-api.yaml
│
└── templates/
    ├── microservice.yaml
    ├── lambda-function.yaml
    └── cron-job.yaml
```

### Prompt发现与复用

```python
# 搜索可复用的Prompt
prompts = registry.search(
    domain="e-commerce",
    language="typescript",
    tags=["payment", "security"],
    quality_score>=4.5
)

# 基于现有Prompt创建变体
base_prompt = registry.get("auth/login@2.1.0")
custom_prompt = base_prompt.fork()
custom_prompt.add_constraint("支持OAuth2.0登录")
custom_prompt.add_constraint("支持多因素认证")
```

### Prompt质量度量

| 指标 | 说明 | 目标值 |
|------|------|--------|
| **成功率** | Prompt一次生成可用代码的概率 | > 80% |
| **修改率** | 生成后需要人工修改的比例 | < 20% |
| **复用率** | 被其他Prompt引用/继承的比例 | > 30% |
| **满意度** | 开发者对输出的主观评分 | > 4.0/5 |
| **版本迭代** | 平均每个Prompt的版本数 | 3-5 |

---

## 结论

### 🎯 Takeaway

| 临时使用Prompt | 工程化使用Prompt |
|--------------|----------------|
| 复制粘贴到ChatGPT | 版本控制管理 |
| 口头交流最佳实践 | Code Review流程 |
| 凭感觉调整 | 数据驱动优化 |
| 个人知识 | 组织资产 |
| 一次性的 | 可复用、可继承 |

PDD（Prompt-Driven Development）不是取代软件开发，而是**重塑软件开发的起点**。

当Prompt成为第一等制品，我们获得了：
- **可追溯的决策历史**（Prompt版本）
- **可复用的知识资产**（Prompt库）
- **可自动化的质量保证**（Prompt CI/CD）
- **可规模化的AI协作**（标准化流程）

这是AI-Native软件工程的基础设施。

> "代码是意图的实现，Prompt是意图的表达。管理好Prompt，就管理好了软件开发的源头。"

---

### PDD成熟度模型

| 级别 | 特征 | 达成标准 |
|------|------|----------|
| **L1 临时** | 偶尔使用AI，Prompt随意编写 | 有个别开发者使用ChatGPT |
| **L2 规范** | 建立Prompt编写规范 | 有标准模板和检查清单 |
| **L3 版本化** | Prompt纳入版本控制 | 所有Prompt在Git中管理 |
| **L4 自动化** | CI/CD流水线验证Prompt | 自动化测试覆盖Prompt变更 |
| **L5 资产化** | 组织级Prompt库运营 | Prompt被度量、优化、复用 |

**你的组织在哪个级别？**

---

## 📚 延伸阅读

**经典案例**
- LangChain的Prompt管理实践：如何管理数千个生产级Prompt
- OpenAI的Prompt工程指南：企业级Prompt设计原则

**本系列相关**
- [TDD的死亡与重生](#) (第1篇)
- [SDD 2.0：用户故事的Prompt工程化](#) (第2篇)
- [CDD：上下文工程即核心竞争力](#) (第6篇)

**学术理论**
- 《Prompt Engineering Guide》(DAIR.AI): Prompt工程系统方法
- 《Software Engineering at Google》: 大规模软件工程实践
- 《The Mythical Man-Month》(Fred Brooks): 软件工程经典，理解工程化的本质

---

*AI-Native软件工程系列 #5*
*深度阅读时间：约 12 分钟*
