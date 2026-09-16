---
title: "Agentic Coding运营全景图：Appliscale的八个杠杆实战总结"
date: 2026-09-16
tags:
  - agentic-coding
  - operating-model
  - harness
  - context-engineering
  - enterprise
---

# Agentic Coding运营全景图：Appliscale的八个杠杆实战总结

> 如果你只调了harness就觉得"落地成功"，你会失望的。八个杠杆要一起拉，才能看到复利。

## 这是什么

Appliscale（波兰的AI工程咨询公司）在2026年5月发了一篇非常系统的实战总结。不是广告，是一份**运营清单**——他们在真实客户项目里把这些杠杆都拉过一遍，诚实地说哪些work，哪些是 theater。

全文八个部分，每部分一个杠杆。以下是我认为最有价值的核心洞察，按重要性排序。

---

## 杠杆一：Harness——程序比模型更重要

> 同样的模型，在不同程序里输出差异巨大。

2026年的harness三类：
- **IDE集成**：Cursor、Windsurf、Copilot Agent、Zed AI
- **CLI/Terminal**：Claude Code、Codex CLI、opencode、aider
- **云端自治**：Devin、Factory、Amp、Jules

关键洞察：**开源harness（opencode、aider）模型可任意切换**；商业harness（Claude Code、Cursor）绑定了默认模型，行为更一致但无法审计内部prompt。

实际影响：当你换模型时，商业harness的性能下降比开源harness更明显——因为它的优化是针对特定模型做的。

---

## 杠杆二：Context Engineering——这是团队判断力投入的地方

这是全文最务实的部分。Context分两层：

**Harness自动处理的**：
- 直接文件读取、RAG、代码搜索、代码图谱、上下文压缩、子Agent并行探索

**人类要主动搭的**（真正的杠杆）：
- **Conventions文件**（AGENTS.md类）：行为改变投入产出比最高的
- **Skills**：条件指令，只在相关场景加载
- **库知识**：官方API skill（Vercel的React skill、Mastra的MCP docs）
- **扩展**：graphify把代码库变成可查询的图谱；pi context-mode把工具输出存入本地DB

> Context engineering是团队判断力投入的地方，模型猜不出来。

---

## 杠杆三：委托模式——决定了瓶颈在哪里

同一个工具，四种用法，杠杆差异巨大：

| 模式 | 瓶颈位置 | 理论杠杆 |
|------|---------|---------|
| **Intern** | 键盘（人 dispatch 任务） | 10-30%提升 |
| **Contractor** | 页面（人写spec，Agent交付） | 3-10x |
| **Partner** | 思考（人和Agent共同规划） | 最高单任务产出 |
| **Agency** | 编排（多Agent协调） | 理论上无上限 |

大多数团队以为自己用的是Contractor，实际用的是Intern——只是把Agent当超级autocomplete，而不是一个能端到端交付的 contractor。

> 模式四（Agency）是spectacular demos和spectacular failures的共同产地。

---

## 杠杆四：质量——四种失败模式和一个containment stack

**四种失败模式**：
1. **Hallucination**：编造不存在的API/库，通过浅层测试
2. **Reinvention**：用定制代码替代成熟库，维护成本悄悄累积
3. **Verbosity**：超过必要程度的代码量，review成本和加载成本双升
4. **Sycophancy**：同意人类错误假设并自信地推进——比hallucination更难发现

**Containment stack（四层）**：
1. 独立Reviewer Agent（CodeRabbit、Greptile、Qodo）——独立性是关键
2. Plan-and-diff review（人先审计划，后审diff，不逐行看）
3. Linter和类型检查（静态分析层）
4. Convention规则（针对verbosity和off-pattern）

> 外部PR-review服务叠加in-loop reviewer agent，因为**独立性是重点**：让第二个模型独立读diff，才能发现第一个模型遗漏的问题。

---

## 杠杆五：Evals——没有它，每次升级都是盲飞

**Test vs Eval的核心区别**：
- Test：检查你的**代码**，确定性
- Eval：检查你的**Agent系统**（模型+harness+conventions+skills+子Agent prompt），统计性

Eval的触发条件：**任何变化**——模型升级、harness升级、convention文件改动、新skill引入、子Agent prompt调整。

没有Eval，这些都是blind change。

**两类benchmark常被混淆**：
- **Public benchmarks**（SWE-bench Verified）：厂商claim的健康检查，和你的代码库无关
- **Internal evals**：你的任务、你的repo、你的正确性定义——唯一真实的信号

> 公开benchmark说"85%解决率"，不代表你的代码库上也是85%。几乎没有人有internal eval，但这是唯一有意义的数据。

---

## 杠杆六：安全——四个攻击向量

1. **数据中的Prompt注入**：文件、网页、工单里的隐藏指令，模型无法可靠区分数据和指令
2. **被黑的MCP或工具**：第三方服务返回恶意输出或悄悄外泄Agent上下文
3. **Slopsquatting**：Agent幻觉包名，攻击者注册同名恶意包，下一个Agent安装它
4. **失控命令**：Agent在无人监管下执行破坏性操作（批量删除、云服务超支）

**防御的诚实评估**：
- 沙箱：限制爆炸半径，不管你信不信任Agent
- Permission prompts：最接近security theater的东西——人类会疲劳，最终点Allow一切
- 最小权限原则：Agent的凭证是管理员权限，但判断力相当于新人

> Agent有管理员的凭证和新人的判断力。按这个假设配置权限。

---

## 杠杆七：经济学——模型大小、路由、缓存

**四层成本**：
1. **模型大小**：前沿模型(~Claude Opus)比小模型(~Haiku)贵10-15倍，按需分配
2. **编排模式**：单Agent最便宜；Planner+Workers+Reviewer贵2-5倍但复杂任务效果更好；并行探索最贵，适合设计工作
3. **缓存**：Prompt缓存配置好可以省50-80%的长会话成本——大多数团队严重低估了这个杠杆
4. **Harness本身**：相同任务，不同harness的token消耗量差异很大

**路由原则**：
> 小模型在内，大模型在边。Plan用前沿模型，Execute用小模型，Review用前沿模型。

---

## 杠杆八：Lock-in——最深的坑不告诉你自己

Lock-in按深度分层：

| 层级 | 深度 | 代价 |
|------|------|------|
| 模型 | 浅 | 换个setting，但harness调教决定性能 |
| 工具（MCP、Skills） | 可移植 | 迁移得了配置，迁移不了行为 |
| 框架（Mastra、CrewAI） | 中 | 抽象层剥离了model-specific优化 |
| Harness | 最深 | Skills、插件、状态（代码库索引、向量存储、对话历史）全部绑定 |
| 授权条款 | 放大器 | 商业条款引导你使用特定harness和特定模型 |

**Mastra的具体教训**：Anthropic的prompt缓存要求byte-for-byte完全相同的前缀。Mastra悄悄注入的时间戳或变化中的memory ID会破坏缓存匹配，token账单悄悄上涨。

> 抽象层省了你的工作，也剥夺了你需要的控制权。锁，从不宣布自己。

---

## 最诚实的部分

文末有一段难得的full disclosure：

> "我是Claude Code的重度用户，也是Anthropic的粉丝。这正是让我对两者都变得过度依赖感到不安的原因。"

这种坦诚在厂商内容里很少见。

---

来源：[Appliscale - Agentic coding, in practice](https://www.appliscale.io/blog/agentic-coding-in-practice)，2026-05-28
