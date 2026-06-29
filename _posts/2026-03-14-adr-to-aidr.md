---
layout: post
title: "\"AI-Native 架构决策记录：从 ADR 到 AIDR\""
date: 2026-03-14T10:00:00+08:00
tags: [AI-Native软件工程, 架构, ADR, AIDR, 决策记录]
description: "AIDR将架构决策从静态文档升级为可执行规范，决策即代码、规则即执行、版本即历史——没有自动验证的架构规范只是墙上标语。"
author: "@postcodeeng"
series: AI-Native软件工程系列 #53

redirect_from:
  - /adr-to-aidr.html
---

> **TL;DR**
>
> 本文核心观点：
> 1. **ADR 的局限** — 静态文档无法捕捉决策背后的推理过程
> 2. **AIDR 架构** — AI-Enhanced Architecture Decision Records，可验证、可追溯、可复用
> 3. **决策即代码** — 架构决策用结构化格式记录，可被 AI 理解和执行
> 4. **活的架构** — 架构文档与代码实现保持同步，自动验证一致性
>
> 关键洞察：架构决策的价值不在于记录结果，而在于记录可以复用的推理。

---

## ADR 的辉煌与瓶颈

### 什么是 ADR

Architecture Decision Records（架构决策记录）是 Michael Nygard 在 2011 年提出的概念，用于记录软件架构中的重要决策。

经典 ADR 格式通常包含以下字段：

- **Title** — 决策标题，简明概括（如"服务间通信使用异步消息队列"）
- **Status** — 决策状态：`proposed`（已提出）、`accepted`（已采纳）、`deprecated`（已废弃）、`superseded`（被替代）
- **Context** — 决策时的背景：面临什么问题、约束条件是什么、有哪些可选方案
- **Decision** — 决策本身：选择哪个方案、为什么
- **Consequences** — 决策的后果：正面收益、负面代价、可能的风险

Nygard 最初推荐用 Markdown 表格来写 ADR，后来社区扩展出 MADR（Markdown Any Decision Records）等模板。无论格式如何，核心都是这五个字段的组合。

### ADR 的价值

1. **决策可追溯** — 知道为什么做出某个选择
2. **知识沉淀** — 新成员快速理解架构背景
3. **避免重复讨论** — 已有决策无需重新辩论
4. **支持重构** — 理解决策边界，安全地修改

### 但问题也在积累

**场景一：决策与代码脱节**

架构师写了 ADR："服务间通信使用异步消息队列"

半年后，开发者在代码里直接调用了 HTTP API。

代码审查时：
- 开发者："我不知道有这个决策"
- 架构师："ADR 里写得清清楚楚"
- 代码：我按最简单的方式实现了

**场景二：推理过程丢失**

ADR 记录了"使用 Redis 作为缓存"，但没记录：
- 当时评估了哪些缓存方案？
- 性能测试数据是什么？
- 如果数据量增长 10 倍，这个决策还成立吗？

**场景三：无法验证**

ADR 说"微服务之间不允许直接数据库访问"，但：
- 如何检查代码是否遵守？
- 有没有违规的实例？
- 违规的后果是什么？

---

## 为什么传统 ADR 在 AI 时代不够用

### 问题 1：人类可读，但机器不可理解

ADR 是为人类编写的自然语言文档，AI 只能"阅读"但难以：
- 理解决策的精确约束
- 检查代码是否遵守
- 在类似场景下复用推理

### 问题 2：静态文档，无法与代码同步

ADR 一旦写入就很少更新，但代码在持续演进。

结果是：ADR 描述的是"设计时的架构"，而非"运行时的架构"。

### 问题 3：推理无法复用

每个 ADR 都是独立的，无法：
- 在不同项目中复用相似的决策逻辑
- 基于历史决策训练 AI 做出更好的建议
- 建立决策模式库

### 问题 4：缺乏验证机制

ADR 是"说明书"而非"契约"，没有强制力。

架构规范靠人自觉遵守，而非系统自动验证。

> 💡 **Key Insight**
> 传统 ADR 的核心缺陷不是"写得不够详细"，而是"无法与代码同步"。AI 时代的架构决策必须是可验证的，否则只是空文。

---

## AIDR：AI-Native 架构决策记录

### 核心思想

AIDR（AI-Enhanced Architecture Decision Records）将架构决策从"静态文档"升级为"可执行规范"。

> 💡 **Key Insight**
>
> AIDR 的核心突破是将决策的"描述权"和"执行权"合二为一：写下来的约束，机器自动检查，违规自动阻止。

### AIDR 的五个增强维度

AIDR 在 ADR 的基础上，从五个维度做了增强，使架构决策从静态文档升级为可执行的系统规范。下图概括了这五个维度的关系：

<object data="/assets/images/2026-03-14-adr-to-aidr-01-aidp-dimensions.svg" type="image/svg+xml" width="100%" aria-label="AIDR 五大增强维度" role="img"></object>

**结构化推理链**是最核心的增强：ADR 只记录结论，AIDR 还记录从问题到结论的每一步推导，AI 可以据此在相似场景下做类比推理。

### AIDR 格式示例

以下是一个 AIDR 的 JSON Schema 示例，包含状态、约束、验证规则等字段：

```json
{
  "id": "AIDR-001",
  "title": "服务间通信使用异步消息队列",
  "status": "accepted",
  "constraints": [...],
  "validation": {
    "rules": ["禁止直接 HTTP 调用", "消息必须经过队列"]
  }
}
```

---

## 实战：设计你的 AIDR 系统

### 第一步：建立 AIDR 仓库

建立 AIDR 仓库是整个系统的起点。和普通代码仓库不同，AIDR 仓库的核心不是代码，而是结构化的决策记录文件。

一个典型的仓库结构如下：

```
./docs/aidr/
  aidr.yaml          # AIDR 配置文件，定义全局约束和验证规则
  AIDR-001/          # 每个决策一个子目录
    index.json       # 该决策的 AIDR 主文件（JSON/YAML）
    rationale.md     # 推理过程文档（可选，供人类阅读）
    validation.cue   # 该决策专属的验证规则
  _templates/
    decision-template.json  # 新建 AIDR 的模板
```

`aidr.yaml` 配置文件中通常定义全局约束，例如"所有服务间通信必须经过消息队列"、"数据库访问只能在数据层进行"等。这些全局约束会作为默认验证规则注入到每个 AIDR 中。

建议在项目初始化时就创建 AIDR 仓库，并做第一次 commit。之后每当有重要架构决策，就在这个仓库中新增一条 AIDR，而不是在别处散落文档。

### 第二步：创建 AIDR 模板

AIDR 在 ADR 经典五字段基础上，增加了 AI 友好的结构化字段。一个完整的 AIDR 模板包含以下部分：

**身份字段**
- `decision_id`：唯一标识，如 `AIDR-042`，格式与 Jira ticket 一致便于追踪
- `title`：决策标题，与文件名对应
- `status`：当前状态，`proposed | accepted | rejected | deprecated | superseded`
- `created`：创建日期，ISO 8601 格式

**内容字段**
- `context`：背景描述，包括问题陈述、约束条件、涉及的系统和团队
- `options_considered`：曾考虑过的备选方案（列表形式），每个方案包含标题和放弃理由
- `resolution`：最终决策，以及完整的推理链（reasoning chain）—— 这是 AIDR 与传统 ADR 最大的区别。推理链记录了从 context 到 decision 的每一步推导，AI 可以据此在类似场景下做相似推理

**验证字段**
- `validation_rules`：机器可读的验证规则数组，每条规则是一个结构化描述（如 `no-direct-http-between-services`），可被 AIDR CLI 或 Semgrep 执行
- `violation_response`：`warn`（警告）| `fail`（阻止部署），默认 `fail`

**关联字段**
- `related_decisions`：相关 AIDR 的 ID 列表，形成决策图谱
- `consequences`：实施该决策后的正面和负面影响

一个具体的 AIDR 示例片段：

```json
{
  "decision_id": "AIDR-042",
  "title": "服务间通信强制使用消息队列",
  "status": "accepted",
  "context": "当前有 12 个微服务，部分服务之间存在直接 HTTP 调用……",
  "options_considered": [
    {"title": "直接 HTTP 调用", "reason": "实现简单，但增加耦合"},
    {"title": "消息队列", "reason": "解耦效果好，需要额外基础设施"}
  ],
  "resolution": "采用消息队列方案，推理链：直接调用→耦合风险高→解耦收益>基础设施成本→选消息队列",
  "validation_rules": ["no-direct-http-between-services"],
  "related_decisions": ["AIDR-038", "AIDR-040"]
}
```

### 第三步：编写验证规则

验证规则是 AIDR 区别于传统 ADR 的核心机制。每条规则将架构约束翻译成机器可执行的结构化描述。

规则格式推荐使用 CUE 或 JSON Schema。CUE 的优势在于支持字段路径跨度和类型约束，语义表达能力比 JSON Schema 更强，同时语法简洁、人类可读。

以"禁止服务间直接 HTTP 调用"为例，用 CUE 编写规则如下：

```cue
#ServiceCall: {
    caller:   string
    callee:   string
    protocol: string
    layer:    string
}

// 规则：所有跨服务调用必须通过消息队列
#NoDirectHTTP: {
    // 检查代码中的 HTTP 客户端调用
    for call in serviceCalls if call.protocol == "http" && call.layer == "inter-service" {
        violation: "直接 HTTP 调用被发现：\(call.caller) -> \(call.callee)，请改用消息队列"
    }
}
```

对应的 Semgrep 规则（用于检查源代码）：

```yaml
# .semgrep/inter-service-comm.yaml
rules:
  - id: no-direct-http-between-services
    pattern-either:
      - pattern: |
          fetch("http://service-$NAME/...")
      - pattern: |
          axios.get("http://service-$NAME/...")
    message: "服务间通信禁止直接 HTTP 调用，请通过消息队列进行"
    severity: ERROR
```

规则编写完成后，先在本地测试：用 AIDR CLI 的 `dry-run` 模式对现有代码库运行规则，确认无误后再将规则固化到仓库中。

### 第四步：CI/CD 集成

将 AIDR 验证集成到 CI/CD 流程中，每次提交自动检查架构合规性，是"违反即失败"原则落地的关键步骤。

在 GitHub Actions 中，可以在 `pull_request` 和 `push` 两个触发器上运行 AIDR 验证 job：

```yaml
# .github/workflows/arch-validation.yml
on: [pull_request, push]
jobs:
  aidr-validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run AIDR validation
        run: |
          aidr validate --config ./docs/aidr/aidr.yaml
          aidr report --format markdown >> $GITHUB_STEP_SUMMARY
      - name: Comment on PR
        if: github.event_name == 'pull_request'
        run: aidr comment --pr ${{ github.event.pull_request.number }}
```

验证失败时，job 会以非零退出码结束，直接阻止 MR 合入。对于已经存在的违规代码，建议先运行 `aidr audit --list-violations` 获取完整清单，逐条整改后再开启强制执行，避免一次性大批量阻止破坏开发节奏。

### 架构即代码 (Architecture as Code)

```yaml
# .github/workflows/arch-validation.yml
- name: Validate AIDR compliance
  run: aidr validate --rules no-direct-db-access
```

---

## 决策即代码：可执行的架构

### 架构即代码 (Architecture as Code)

传统 ADR 是一份自然语言文档，团队成员读完后自行理解、自行执行——没有约束力，也没有自动检查。

AIDR 的做法完全不同：架构决策本身就是代码。它以结构化数据（JSON/YAML/CUE）存储，附带机器可执行的验证规则。这意味着：

**文档即代码**——AIDR 文件存放在代码仓库中，与业务代码一起接受 Code Review。决策的变更通过 Pull Request 进行，任何人都可以对决策本身提出修改意见，就像对代码的修改意见一样。

**规则即执行**——传统 ADR 中的"服务间通信使用消息队列"是一条文字描述，执行与否依赖开发者的自觉。AIDR 中这条约束变成了一条 `no-direct-http-between-services` 规则，每次 CI 运行都会自动检查，违规则阻止部署。

**版本即历史**——AIDR 文件的 Git 历史就是决策的完整演变历史。不需要另外写"决策变更记录"，每一次 `git diff` 都清楚地展示约束条件如何随时间演化。

这种"架构即代码"的思路，与 GitOps 和 Infrastructure as Code 一脉相承：一切可执行的规则都应该被代码化、被自动化、被版本化。

### 自动同步机制

AIDR 之所以能成为"活的架构文档"，关键在于它与代码之间建立了自动同步机制。

**Webhook 触发**——在 `push` 或 `pull_request` 事件触发时，CI 自动解析 AIDR 文件夹中的所有 `validation_rules`，将其转换为 Semgrep 或 ArchUnit 规则，对目标代码进行扫描。扫描结果写入 AIDR 仓库的 `auditLog` 中，记录哪些规则被触发、触发时间、对应 Commit SHA。

**状态联动**——AIDR 文件中的 `status` 字段与实际架构状态自动联动。当 CI 中所有验证规则通过时，系统自动将对应 AIDR 的 `validation_status` 标记为 `compliant`；当代码变更引入新的违规时，`validation_status` 变为 `violated`，并通过 GitHub PR comment 通知相关团队。

**过期检测**——AIDR 不是写入后就再也不动的文档。通过定期运行 `aidr audit --stale`，可以发现那些"决策时的假设已经失效但从未更新"的 AIDR。例如，当一条 AIDR 规定"数据量增长 10 倍时必须扩容"，而系统数据量监测显示已经超过该阈值，系统就会将该 AIDR 标记为 `needs-review`。

这种同步机制从根本上解决了传统 ADR"描述的是设计时的架构，而非运行时的架构"的问题。

### 违反即失败

"违反即失败"（Fail on Violation）是 AIDR  enforcement model 的核心原则。当架构违规被检测到时，CI/CD 流程直接阻止部署，而不是等到代码审查才发现问题。

传统架构审查依赖人工——架构师在 Code Review 中指出违规，开发者收到反馈后修改。这个过程的问题在于：**反馈周期长**，违规代码已经写完，等审查发现时开发者可能已经切换到其他任务；**依赖个人自觉**，开发者可以选择忽略架构建议；**无法规模化**，一个架构师追不上十几个开发者的代码产出速度。

AIDR 的"违反即失败"通过 CI 自动化解决了这三个问题。违规代码在提交那一刻就被拦截，开发者必须修复才能合入，没有任何灰色地带。这与"可验证的架构决策才有约束力"这条洞察完全一致：没有自动验证，架构规范只是建议；有了自动验证，架构规范才成为真正的规则。

在实际落地时，建议先从 `warn` 模式开始，让团队看到违规报告，等大家习惯了流程再切换到 `fail` 模式，避免一刀切引起开发团队的抵触情绪。

---

## 反直觉洞察：写更多文档，决策更快

### 洞察 1：文档成本 vs 决策成本

传统观念：写文档慢，不做决策快。

现实：
- 写一个 AIDR：2 小时
- 不做记录，3 个月后重新讨论同一个问题：8 小时 + 决策风险

**AIDR 的 ROI：投入 2 小时，节省 10 小时，降低风险。**

### 洞察 2：详细记录加速而非阻碍决策

反直觉：详细记录推理过程会让决策变慢。

现实：详细记录推理过程并不会让决策变慢，反而会显著加速未来的相似决策。

传统模式下，当新成员加入团队或面临一个新问题时，标准的做法是开会讨论、约相关人员时间、逐个了解历史背景。这个过程可能需要数天甚至数周。如果团队有完善的 AIDR 库，新成员只需要花 30 分钟阅读相关决策记录，就能理解过去的推理过程、约束条件和已经尝试过的方案，不需要约任何人，就能直接开始工作。

更关键的是，AIDR 的推理链（reasoning chain）让决策变得可复用。当一个新问题出现时，AI 可以基于历史 AIDR 中的推理链，找到相似的 context 和约束条件，直接生成建议，而不需要从零开始讨论。这将决策的速度从"人月"单位缩短到"人时"甚至"人分钟"单位。

详细记录的核心价值在于：它把决策从"一次性事件"变成了"可积累的资产"。每做一次决策，就为未来的自己和他人大脑省下了一次重复推理。

### 洞察 3：可验证的架构决策才有约束力

如果架构决策无法验证，就只是"建议"而非"规则"。

可验证性 = 约束力 = 架构一致性

> 💡 **Key Insight**
>
> 没有自动验证机制，架构规范就只是"墙上标语"——写得再好，也只是装饰。AI 时代的架构决策必须可执行、可验证，才能真正约束系统行为。

---

## 工具链与实施路径

从 ADR 升级到 AIDR 不需要全新的技术栈，实际上是在现有 Git + CI/CD 基础上叠加 AIDR 层。下图展示了完整的工具链闭环：

<object data="/assets/images/2026-03-14-adr-to-aidr-02-cicd-validation.svg" type="image/svg+xml" width="100%" aria-label="工具链与实施路径（插图）" role="img"></object>

整个链路从 AIDR 仓库出发，经由 CI 在每次代码变更时自动验证架构合规性，验证结果写回 AIDR registry 并反馈到 PR comment，形成完整的"决策—验证—反馈"闭环。

### 推荐工具链 (2026)

| 功能 | 工具 | 说明 |
|------|------|------|
| AIDR 管理 | AIDR CLI | 命令行工具，创建、验证、查询 |
| 格式验证 | JSON Schema / CUE | 确保 AIDR 格式正确 |
| 代码验证 | ArchUnit, Semgrep | 检查代码是否符合架构规则 |
| 可视化 | Structurizr, Mermaid | 从 AIDR 生成架构图 |
| 决策支持 | AI 助手 | 基于历史 AIDR 提供建议 |

### 实施路径

**阶段 1：建立格式 (1-2 周)**
- 定义 AIDR 格式和模板
- 创建前 3-5 个 AIDR
- 建立评审流程

**阶段 2：添加验证 (2-4 周)**
- 编写关键规则的验证代码
- CI/CD 集成
- 开始强制执行

**阶段 3：全面采用 (1-3 个月)**
- 所有重要架构决策使用 AIDR
- 建立决策模式库
- AI 辅助决策建议

**阶段 4：智能化 (3-6 个月)**
- 基于历史 AIDR 训练 AI
- 自动识别架构违规
- 智能决策推荐

---

## 结语：架构的终极形态

让我们想象架构的终极形态：

**不是一张静态的架构图**，而是：
- 一套可执行的规则
- 一个自我验证的系统
- 一部持续演进的历史
- 一种可以复用的智慧

AIDR 让架构从"画在纸上的设计"变成"活在系统中的决策"。

> 💡 **Key Insight**
>
> 架构的终极形态不是一张静态图，而是一套与代码共生、可自动验证、随时间演进的决策系统——AIDR 让这成为可能。

当架构决策可以：
- 被机器理解
- 被自动验证
- 被跨项目复用
- 与代码同步演进

架构才真正成为了工程，而不仅是艺术。

---

**系列关联阅读**：
- [#46 AI-Native Code Review：从人工审查到 Agent 陪审团]({% post_url 2026-03-13-ai-native-code-review %})
- [#56 AI-Native 系统的可观测性进化](#)

**下一篇预告**：#56 AI-Native 系统的可观测性进化：从日志到意图追踪

---

*AI-Native软件工程系列 #53*

*Published on 2026-03-14*
