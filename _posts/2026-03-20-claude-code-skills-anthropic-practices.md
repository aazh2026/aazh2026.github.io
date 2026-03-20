---
layout: post
title: "Claude Code Skills 实战指南：Anthropic 的 9 种 Skill 类型与最佳实践"
date: 2026-03-20T22:00:00+08:00
permalink: /claude-code-skills-anthropic-practices/
tags: [AI-Native, Claude-Code, Skill, Anthropic, Best-Practices]
author: "@postcodeeng"
series: AI-Native Engineering
---

> **TL;DR**
> 
> Anthropic 工程师 Thariq 分享了内部使用数百个 Claude Code Skills 的经验，总结出 9 种 Skill 类型和一系列最佳实践。核心洞察：Skill 不只是 Markdown 文件，而是包含脚本、资产、数据的完整文件夹系统。本文深度解析这 9 种类型，以及如何设计高质量的 Skill。

---

## 📋 本文结构

1. [背景：Anthropic 如何使用 Skills](#背景anthropic-如何使用-skills)
2. [Skill 的本质：不只是 Markdown](#skill-的本质不只是-markdown)
3. [9 种 Skill 类型详解](#9-种-skill-类型详解)
4. [设计原则：来自实战的经验](#设计原则来自实战的经验)
5. [高级技巧：Hooks、内存与脚本](#高级技巧hooks内存与脚本)
6. [Skill 生态：分发与治理](#skill-生态分发与治理)
7. [与 Google ADK 的对比](#与-google-adk-的对比)
8. [结论：Skill 驱动的开发范式](#结论skill-驱动的开发范式)

---

## 背景：Anthropic 如何使用 Skills

### 规模

| 指标 | 数据 |
|------|------|
| **活跃 Skills** | 数百个 |
| **使用场景** | 日常开发全流程 |
| **团队规模** | 全公司 |
| **积累时间** | 持续迭代优化 |

### 核心洞察

**常见误解**：Skills 只是 Markdown 文件。

**实际情况**：
> "Skill 是一个文件夹，可以包含脚本、资产、数据等，Agent 可以发现、探索和操纵。"

这意味着 Skill 的能力远超简单的文本提示。

---

## Skill 的本质：不只是 Markdown

### 文件夹结构

```
skill-name/
├── SKILL.md              # 主要说明文档
├── config.json           # 配置信息
├── scripts/              # 可执行脚本
│   ├── verify.py
│   └── deploy.sh
├── assets/               # 模板和静态资源
│   └── template.md
├── references/           # 参考文档
│   └── api.md
└── data/                 # 数据文件
    └── history.log
```

### 配置选项

**Frontmatter 配置**：

```yaml
---
name: standup-post
description: Generate and post daily standup updates
triggers:
  - command: /standup
hooks:
  - type: PreToolUse
    script: scripts/verify.sh
memory:
  storage: ${CLAUDE_PLUGIN_DATA}/standup.log
---
```

### 动态能力

| 能力 | 说明 | 示例 |
|------|------|------|
| **脚本执行** | 运行本地脚本 | 自动化测试 |
| **数据存储** | 持久化记忆 | 历史记录 |
| **Hooks** | 事件响应 | PreToolUse 拦截 |
| **模板渲染** | 动态生成 | 代码脚手架 |

---

## 9 种 Skill 类型详解

### 类型 1：Library & API Reference（库和 API 参考）

**用途**：解释如何正确使用库、CLI 或 SDK。

**典型内容**：
- 内部库的使用方法
- 常见错误和陷阱（gotchas）
- 代码片段示例

**示例**：

```markdown
# billing-lib Skill

## 边缘情况
- 处理退款时必须先检查 invoice 状态
- 不要直接操作数据库，使用提供的 API

## 常见错误
❌ await db.query("UPDATE invoices...")
✅ await billing.updateInvoice(id, {...})
```

**设计要点**：
- 专注于"非显而易见"的知识
- 记录实际的坑和解决方案
- 包含具体的代码示例

---

### 类型 2：Product Verification（产品验证）

**用途**：测试和验证代码是否正常工作。

**核心价值**：
> "花一周时间让验证 Skill 变得优秀是值得的。"

**技术手段**：
- Playwright 浏览器自动化
- Tmux CLI 交互测试
- 录屏记录测试过程
- 程序化的状态断言

**示例**：

```markdown
# signup-flow-driver

## 测试流程
1. 访问注册页面
2. 填写邮箱 → 验证邮箱格式
3. 点击验证邮件 → 检查跳转
4. 完成 onboarding → 验证用户创建

## 验证点
- [ ] 用户存在于数据库
- [ ] 欢迎邮件已发送
- [ ] 初始状态正确
```

---

### 类型 3：Data Fetching & Analysis（数据获取与分析）

**用途**：连接数据栈，获取和分析数据。

**典型场景**：
- 查询业务指标
- 分析用户行为
- 生成数据报告

**示例**：

```markdown
# funnel-query

## 事件关联
- signup: `events.signup_completed`
- activation: `events.first_action`
- paid: `subscriptions.created`

## 常用查询
```sql
SELECT 
  DATE_TRUNC('day', signup_time) as day,
  COUNT(DISTINCT user_id) as signups,
  COUNT(DISTINCT CASE WHEN activated THEN user_id END) as activations
FROM users
WHERE signup_time > NOW() - INTERVAL '30 days'
GROUP BY 1
```
```

---

### 类型 4：Business Process Automation（业务流程自动化）

**用途**：将重复工作流自动化为单条命令。

**典型场景**：
- 生成日报
- 创建工单
- 发送通知

**示例**：

```markdown
# standup-post

## 工作流程
1. 获取昨日完成的任务（Jira API）
2. 获取代码提交（GitHub API）
3. 获取 Slack 讨论摘要
4. 生成格式化的 standup 内容
5. 发布到指定频道

## 记忆
保存到 `standups.log`，下次只显示 delta（变化）。
```

**关键设计**：
- 记录历史，支持增量更新
- 集成多个数据源
- 格式化和模板化输出

---

### 类型 5：Code Scaffolding & Templates（代码脚手架）

**用途**：生成框架代码和模板。

**优势**：
- 比纯代码生成器更灵活
- 可以包含自然语言约束
- 支持复杂的项目结构

**示例**：

```markdown
# new-service

## 创建步骤
1. 复制 `templates/service/` 到项目
2. 替换占位符：{{service_name}}
3. 配置 auth、logging、deploy
4. 运行初始化脚本

## 包含文件
- src/index.ts
- tests/unit.test.ts
- Dockerfile
- .github/workflows/ci.yml
```

---

### 类型 6：Code Quality & Review（代码质量与审查）

**用途**：强制执行代码规范，辅助代码审查。

**形式**：
- 确定性脚本（Linter、类型检查）
- LLM 驱动的审查（对抗性审查）

**示例**：

```markdown
# adversarial-review

## 流程
1. 生成初始代码
2. 启动"红队"子 Agent 批判代码
3. 根据反馈修复
4. 迭代直到问题降级为 nitpicks

## 审查维度
- [ ] 安全性（SQL 注入、XSS）
- [ ] 性能（N+1 查询、大 O 复杂度）
- [ ] 可维护性（可读性、测试覆盖）
```

---

### 类型 7：CI/CD & Deployment（CI/CD 与部署）

**用途**：代码获取、推送和部署。

**典型场景**：
- 监控 PR 并自动处理
- 渐进式部署
- 冲突解决

**示例**：

```markdown
# babysit-pr

## 监控流程
1. 监控 CI 状态
2. 如果失败，分析日志
3. 如果是 flaky test，重试
4. 如果有冲突，自动解决
5. 启用 auto-merge

## 自动修复
- 合并冲突 → 尝试 rebase
- 测试失败 → 检查是否为已知 flaky
- 依赖更新 → 运行兼容性检查
```

---

### 类型 8：Runbooks（运维手册）

**用途**：从症状到诊断的完整调查流程。

**核心价值**：
- 结构化的故障排查
- 多工具协调
- 生成调查报告

**示例**：

```markdown
# service-debugging

## 症状 → 工具映射
| 症状 | 工具 | 查询 |
|------|------|------|
| 高延迟 | Grafana | `latency_p99{service="api"}` |
| 错误率 | Sentry | `is:unresolved service:api` |
| 资源耗尽 | K8s | `kubectl top pods` |

## 输出格式
```
## 调查结果
- 时间：{{timestamp}}
- 症状：{{symptom}}
- 根因：{{root_cause}}
- 建议：{{recommendation}}
```
```

---

### 类型 9：Infrastructure Operations（基础设施操作）

**用途**：执行日常运维和破坏性操作。

**特点**：
- 涉及破坏性操作（删除、修改）
- 需要防护栏（guardrails）
- 通常需要人工确认

**示例**：

```markdown
# cleanup-orphans

## 流程
1. 扫描孤儿资源
2. 发布到 Slack 待清理频道
3. 等待 soak period（24h）
4. 用户确认后执行清理
5. 级联删除相关资源

## 防护栏
- 必须二次确认
- 有回滚计划
- 记录所有操作日志
```

---

## 设计原则：来自实战的经验

### 原则 1：不要陈述显而易见

**反例**：
```markdown
# Python Skill

Python 是一种编程语言。
使用函数来组织代码。
```

**正例**：
```markdown
# Python Skill

## 我们的代码风格
- 使用 black 格式化
- 类型注解必须完整
- 避免使用 * 导入

## 常见陷阱
- 不要在循环中查询数据库
- 记得关闭文件句柄
- 小心 mutable default arguments
```

**原则**：只提供能推动 Claude 离开默认思维模式的信息。

---

### 原则 2：建立 Gotchas 部分

> "任何 Skill 中最有价值的内容是 Gotchas 部分。"

**做法**：
1. 记录 Claude 使用 Skill 时的常见失败点
2. 持续更新，添加新的 gotchas
3. 从具体错误中学习

**示例**：

```markdown
## Gotchas

1. **不要在生产环境直接运行**
   - 总是先在 staging 测试
   - 使用 dry-run 模式验证

2. **数据库连接池会耗尽**
   - 记得关闭连接
   - 使用 context manager

3. **缓存可能过期**
   - TTL 设置为 1 小时
   - 关键数据实时查询
```

---

### 原则 3：使用文件系统和渐进式披露

**技巧**：

| 技术 | 用途 | 示例 |
|------|------|------|
| **分文件** | 避免一次性加载过多内容 | `references/api.md` |
| **模板** | 动态生成文件 | `assets/template.py` |
| **脚本库** | 复用工具函数 | `scripts/utils.py` |
| **数据文件** | 存储配置和历史 | `data/config.json` |

**渐进式披露**：
```
SKILL.md (概述)
    ↓
点击 references/
    ↓
按需读取 api.md、examples.md
```

---

### 原则 4：避免过度约束（Railroading）

**反例**：
```markdown
1. 打开文件 A
2. 复制第 3 行
3. 粘贴到文件 B 的第 5 行
```

**正例**：
```markdown
目标：将配置从 A 迁移到 B

参考：
- A 的配置格式：见 references/a-config.md
- B 的配置格式：见 references/b-config.md
- 常见映射关系：见 references/mapping.md
```

**区别**：
- 过度约束：不给灵活性
- 适度指导：提供信息，让 Claude 适应情况

---

### 原则 5：考虑配置和设置

**模式**：存储用户配置在 Skill 目录中。

```json
// config.json
{
  "slack_channel": "#engineering-standup",
  "jira_project": "ENG",
  "default_priority": "medium"
}
```

**初始化流程**：
```
Skill 第一次运行
    ↓
检查 config.json 是否存在
    ↓
不存在 → 询问用户配置
    ↓
保存配置
    ↓
后续使用配置
```

---

## 高级技巧：Hooks、内存与脚本

### On-Demand Hooks

**用途**：只在需要时激活的 hooks，不是一直运行。

**示例**：

```yaml
# /careful hook
# 只在生产环境操作时激活
trigger: PreToolUse
condition: env == "production"
actions:
  - block: rm -rf
  - block: DROP TABLE
  - confirm: kubectl delete
```

**好处**：
- 不会干扰日常开发
- 关键时刻提供保护
- 避免误操作

---

### 内存与数据存储

**用途**：Skill 可以"记住"之前的状态。

**实现方式**：

```python
# 存储数据到稳定目录
data_dir = os.environ.get('CLAUDE_PLUGIN_DATA')
log_file = os.path.join(data_dir, 'skill-name', 'history.log')

# 追加记录
with open(log_file, 'a') as f:
    f.write(f"{timestamp}: {action}\n")

# 读取历史
history = open(log_file).readlines()
```

**应用场景**：
- Standup Skill 记录昨日内容
- 分析 Skill 记录查询历史
- 自动化 Skill 记录执行日志

---

### 脚本与代码生成

**核心洞察**：
> "给 Claude 脚本和库，让它专注于组合和决策，而不是重建样板代码。"

**示例**：

```python
# scripts/data_utils.py
def fetch_events(start_date, end_date):
    """获取指定时间范围的事件"""
    ...

def analyze_funnel(events):
    """分析转化漏斗"""
    ...

def generate_report(analysis):
    """生成报告"""
    ...
```

**Claude 的使用方式**：
```python
# Claude 生成的脚本
from scripts.data_utils import fetch_events, analyze_funnel

events = fetch_events("2026-03-01", "2026-03-20")
analysis = analyze_funnel(events)
report = generate_report(analysis)
```

---

## Skill 生态：分发与治理

### 分发方式

**方式 1：代码仓库**
```
repo/
├── .claude/
│   └── skills/
│       ├── skill-a/
│       └── skill-b/
```

- 优点：版本控制，团队协作
- 缺点：每个 repo 都有一份，上下文膨胀

**方式 2：插件市场**
- 集中式的 Skill 市场
- 用户选择安装
- 更好的发现和治理

### 治理策略

**发现机制**：
1. 开发者创建 Skill，上传到 sandbox
2. 在团队频道分享
3. 获得 traction（使用量）
4. PR 提交到正式市场
5. 审核后发布

**质量控制**：
- 需要实际使用验证
- 避免重复和冗余
- 持续迭代改进

---

## 与 Google ADK 的对比

| 维度 | Claude Code Skills | Google ADK Skills |
|------|-------------------|-------------------|
| **范围** | Claude Code 专用 | 跨平台（Gemini CLI 等）|
| **结构** | 文件夹 + 脚本 | Markdown + YAML |
| **触发** | 命令、Hooks、描述匹配 | 关键词、模式 |
| **记忆** | 内置支持 | 需额外实现 |
| **脚本** | 直接支持 | 通过 Tools |
| **分发** | 插件市场（开发中）| Skill 市场 |

**互补性**：
- Claude Code Skills 更适合深度集成
- ADK Skills 更注重跨平台标准

---

## 结论：Skill 驱动的开发范式

### 范式转变

**从**：
```
人类编码
    ↓
AI 辅助（代码补全）
```

**到**：
```
Skill 定义流程
    ↓
AI 执行（自动化）
    ↓
人类监督和审查
```

### Skill 的核心价值

1. **知识封装**：将领域知识打包成可复用单元
2. **流程自动化**：重复工作流 → 单条命令
3. **质量保证**：内置验证和审查机制
4. **团队协作**：共享最佳实践

### 未来展望

**短期（1-2 年）**：
- Skill 市场成熟
- 更多预设 Skill
- 更好的发现机制

**中期（3-5 年）**：
- Skill 自动生成
- AI 根据观察学习创建 Skill
- 跨平台 Skill 标准

**长期（5+ 年）**：
- 大多数开发工作由 Skill 定义
- 人类专注于创新和审查
- Skill 成为软件工程的核心产出

---

## 参考与延伸阅读

- [Lessons from Building Claude Code: How We Use Skills](https://x.com/trq212/status/2033949937936085378) - Thariq 的完整分享
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) - 官方文档
- [Skill Creator](https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills) - 创建工具

---

*本文基于 Anthropic 工程师 Thariq 的分享和 Claude Code 官方文档整理。*

*发布于 [postcodeengineering.com](/)*
