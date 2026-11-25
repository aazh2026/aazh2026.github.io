---
layout: post
title: "测试覆盖率没告诉你的一件事：需求覆盖率"
date: 2026-11-25T11:30:00+08:00
tags: [需求覆盖, 验收标准, 可追溯性, CI, 质量门禁, AI生成代码]
description: "测试覆盖率回答「这行代码跑过吗」，不回答「这个需求实现了吗」。我写了一个工具 specgate：解析验收标准，在代码里找证据，给出需求覆盖率。确定性，无需 LLM。"
author: "@postcodeeng"
series: aise
subtopic: requirement-coverage
---

> **TL;DR**
>
> 测试覆盖率有个结构性盲区：它衡量**代码**，不衡量**需求**。
> 一份 spec 里有 12 条验收标准，代码里有 10 个函数、覆盖率 92% —— 这两个数字毫无关系。
> 我做了个工具 [`specgate`](https://github.com/aazh2026/specgate)：解析验收标准，在代码里找证据，
> 输出需求覆盖率，并在 CI 里作为门禁。确定性运行，不用 LLM，不用 API key。

---

## 那个数字骗了我很久

我给自己的博客写了 314 篇文章，做过 HarnessFix、LogicHunter、spec-driven test generation。
每次 push 完，CI 绿灯，coverage badge 88%，我心里是踏实的。

直到有一天我 review 一个 PR，发现一个功能压根没实现——而 CI 全绿，coverage 还在涨。

那一刻我意识到：**coverage 数字在回答一个错误的问题。**

### coverage 到底在测什么

coverage 的定义是"某行代码在测试执行中被执行过的比例"。这是个纯粹关于**代码行**的陈述。

而我想知道的是"spec 第 12 条验收标准，实现了吗"。

这两件事之间没有推导关系：

| | 测试覆盖率 | 需求覆盖率 |
|---|---|---|
| 度量单位 | 行 / 分支 | 验收标准 |
| 回答的问题 | "这行代码跑过吗" | "这个需求实现了吗" |
| 盲区 | 整个功能没写，照样 100% | — |

举个极端例子：一个仓库只有 `add(a, b) { return a + b }` 和一个对应的测试。
coverage = 100%。但如果 spec 上写着"用户可以导出发票为 CSV"，coverage 对此**一无所知**。

反过来，一个 5000 行的遗留系统 coverage 30%，里面可能 95% 的需求都实现得好好的。

**coverage 高 ≠ 需求实现得全。coverage 低 ≠ 需求没实现。**

它根本不是为这个问题设计的。

---

## 为什么现在这个问题变严重了

因为写代码的成本塌了。

2024 年写一个功能要花 40 分钟，其中 35 分钟在写、5 分钟在想。
2026 年写一个功能要花 8 分钟，其中 2 分钟在写、6 分钟在**审**。

瓶颈从"写"转移到了"验证"。而验收标准恰恰是最先腐烂的东西：

- 三个月前写的 spec，谁还记得 AC-7 到底指什么？
- Agent 改了一堆文件，有一条 AC 的实现被悄悄删了，测试没覆盖到，CI 全绿。
- 你招了个人来做 QA，第一件事是读 spec 理解"这个产品应该怎么工作"——然后发现 spec 本身有歧义。

更麻烦的是：**spec 和代码之间的链路没有任何工具在维护**。
spec 在 `docs/SPEC.md`，代码在 `src/`，中间靠人的记忆和 git blame 缝合。

> 顺带一提，我在这个领域做的调研发现，GitHub 上**已经有**成熟的 AI 代码 slop 检测工具（`aislop` 773 星、`AI-SLOP-Detector` 124 星），
> 也有成熟的 agent trace 调试工具。但"从 spec 反向验证实现"这个方向，**头部项目只有 14 星**。
> 空白不是因为没价值，是因为大家还没意识到自己有这个盲区。

---

## 我的解法：specgate

核心想法：**把 spec 里的验收标准当成代码里的"测试点"，然后像 coverage 一样去度量它。**

```text
  Requirement coverage: 80%  (5 criteria)

  ✔ covered    4
  ~ inferred   0
  ! untested   0
  ✗ uncovered  1

  Criterion                                    Status     Evidence
  ------------------------------------------------------------------------------
  AC-1         covered    #test/export.test.js:12
               User can export invoices as CSV
  AC-2         covered    #test/export.test.js:21
               Export respects the date range filter
  AC-5         uncovered  —
               Admin can schedule a recurring monthly export
```

### 为什么必须是确定性的

我特意**没有**用 LLM。三个原因：

1. **CI 需要确定性。** 同样的代码同样的 spec，必须得到同样的分数。否则这个数字没法当门禁用。
2. **成本。** 每次 CI 都调 LLM = 每次 CI 都花钱 + 等网络 + 可能的超时和限流。
3. **信任。** 一旦结论不可复现，团队就会开始忽略它。

所以 specgate 走的是**静态分析**路线，跟 ESLint、Semgrep 一个思路：词法 + 结构化匹配。

### 四步

**第一步：解析 spec。** 找到验收标准，给每条一个稳定 id。你写了 id 就用你的，没写就按顺序生成 `AC-1`、`AC-2`：

```markdown
## Acceptance Criteria

- [ ] AC-1: User can export invoices as CSV
- [ ] [AC-2] Export respects the date range filter
- [ ] Export fails loudly when the storage backend is unavailable
```

最后一条没有 id，照样能算。

**第二步：索引代码。** 遍历源码和测试文件，跳过 `node_modules`、`dist`。

这里有个坑我自己踩了：代码是 camelCase 的，spec 是自然语言。
`resetPassword` 和 "reset their password" 要能对上，`export_csv` 和 "export csv" 要能对上，
`HTTPResponse` 和 "http response" 也要能对上。

一开始我用朴素的 `split(/[^a-z0-9]+/)`，结果 `resetPassword` 变成一个 token `resetpassword`，
永远匹配不上英文句子 "reset password"。改成先按标识符边界拆分再分词：

```js
.replace(/([a-z0-9])([A-Z])/g, '$1 $2')     // camelCase
.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')   // HTTPServer
.replace(/[_\-.]+/g, ' ')                    // snake_case / kebab-case
```

**第三步：分级找证据。** 这是设计的核心。

| 级别 | 状态 | 含义 |
|---|---|---|
| `tagged` | `covered` | 有显式标记 `// AC-1` 指向它 |
| `named` | `inferred` | 测试名匹配上了标准的关键词 |
| `text` | `untested` | 只有实现代码匹配上了，没有任何东西钉住这个行为 |
| — | `uncovered` | 一点证据都没有 |

**第四步：打分。** 分级是有权重的，因为它们可信度不同：

```text
score = 100 × (covered×1.0 + inferred×0.75 + untested×0.4 + uncovered×0.0) / total
```

`inferred` 故意打了折。一个叫 `test_reset` 的测试可能测的是完全别的东西。
只有显式标记才值满分。

---

## 怎么用

```bash
# npm 包还在排队，先用 release tarball（免 token，不需要 npm 账号）
npx --yes --package=https://github.com/aazh2026/specgate/releases/download/v0.1.4/specgate-0.1.4.tgz specgate

# 或者指定 spec
specgate --spec docs/SPEC.md

# CI 门禁：覆盖率低于 80 直接失败
specgate --min 80 --fail-uncovered

# 输出 SARIF，直接传 GitHub code scanning
specgate --sarif-out specgate.sarif --format sarif
```

### 没有 spec？先 init

大部分人第一次用会卡在同一个地方：**我的项目没有写下来的 spec**。
所以我加了 `specgate init`：

```bash
npx --yes --package=https://github.com/aazh2026/specgate/releases/download/v0.1.4/specgate-0.1.4.tgz specgate init
```

它会检测你的技术栈（语言、测试框架、包管理器），生成一份结构化好的 `SPEC.md`，
再顺手放一个 `.github/workflows/requirements.yml` 门禁到仓库里。

三步就能跑起来：

1. `specgate init` — 生成 spec 骨架和 CI 门禁
2. 改写里面的验收标准，给每条一个 id
3. 在测试里加一行 `// AC-1` 标记，然后 `specgate` 看结果

GitHub Actions：

```yaml
name: Requirement coverage
on: [pull_request]

jobs:
  specgate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - uses: aazh2026/specgate@v0.1.4
        with:
          min: 80
          fail-uncovered: true
```

**门禁才是重点。** 一条 spec 说"用户能导出 CSV"，那一个没实现它的 PR 就该被挡住。

---

## 让"inferred"变成"covered"

specgate 的弱点很明确：**它匹配文本，不理解语义**。

"运维人员可以吊销会话" 匹配不上 `deleteToken()`——除非你显式标记。

所以设计上留了一条明确的升级路径：在代码里加一行注释。

```js
// AC-1: User can export invoices as CSV
test('exports invoices as CSV', () => { /* ... */ });
```

```python
# AC-2: Export respects the date range filter
def test_export_respects_date_range():
    ...
```

加完之后，这条标准从 `inferred`（打 0.75 折）升级到 `covered`（满分）。
**这就是它的可追溯性设计**：标记即契约。

我个人觉得这个 workflow 很顺：
1. 写 spec，拆成验收标准，每条带 id
2. 实现功能
3. 写测试时顺手加 `# AC-3`
4. CI 告诉你哪条还没落实

---

## 老实说，它的局限

不想把这东西吹成银弹：

- **文本匹配，不是语义理解。** 措辞差异大的需求要么匹配不上，要么误匹配。这是词法方案的固有代价。
- **`inferred` 终究是启发式。** 打了折不代表它错，只代表它不能当证据用。
- **中英文混排时要注意。** 中文标准去匹配英文标识符效果差，建议标准用和代码标识符一致的语言写。
- **它不是测试运行器。** 它不知道你的测试过没过。得配合你现有的测试套件用。
- **规则依赖显式标记的比例。** 团队如果完全不写标记，那它就退化成一个模糊的关键词匹配器，价值打折。

如果你的团队不写显式标记，我建议先从最核心的 5 条标准开始写标记，积累一点 `covered` 基线。

---

## 为什么开源

不是因为它多巧妙。是因为**每个用 AI 写代码的团队都有这个盲区，但大部分人没意识到**。

我搜过 GitHub：从 spec / acceptance criteria 反向验证实现这个方向，头部项目只有 14 星。
不是没人需要，是这个需求还没被"发现"。

顺便说，这工具本身也是 AI 写的（Claude + 我），符合它自己的理念——
但它**不是**一次 LLM 生成的产物：
- 30 个测试全绿
- 写测试的过程中抓到两个真 bug：camelCase 分词、tag 正则在 `//` 处截断
- 每个 bug 都补了对应的回归测试

这恰好说明了一件事：**能不能发现"它没实现 spec"，靠的就是"spec + 测试 + 门禁"这套机制本身。**
specgate 是这套机制的一个侧面。

```bash
git clone https://github.com/aazh2026/specgate
cd specgate && npm test
```

MIT 协议，欢迎提 issue 和 PR。如果你的团队有"从 spec 反查实现"的需求，
或者你也在做 AI 原生开发流程，这块欢迎交流。

---

### 相关阅读

- [Spec-Driven Test Generation：先写合约，再生成测试](https://postcodeengineering.com/spec-driven-test-generation/) — 用 spec 生成测试，是这个问题的另一半
- [HarnessFix 系列](https://postcodeengineering.com/) — Agent harness 的自我修复
