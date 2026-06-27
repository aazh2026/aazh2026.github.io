# AI 编程代理的工程纪律：agent-skills 的反直觉设计

"这很简单，不需要写 Spec。"

"写完代码再补测试。"

"先快速实现，回头再优化。"

这三条听起来都不像借口。它们像是合理的工程判断。但 Addy Osmani 认为它们是软件工程最常见的失败模式——不是执行问题，而是**判断问题**：人在压力下会不自觉地把错误的理由当作正确的推理。

他的开源项目 [agent-skills](https://github.com/addyosmani/agent-skills)（MIT license）是一套给 AI 编程代理使用的工程技能库，24 个技能，覆盖从"确定做什么"到"生产上线"的全流程。但它的真正价值不是那 24 个技能，而是它揭示的那个底层事实：**软件工程本质上是一套对抗人类自我欺骗倾向的系统化方法。** agent-skills 把这套方法编码成了代理可以执行的工作流。

> **TL;DR** — agent-skills 是 Google 工程总监 Addy Osmani 开源的一套 24 技能库，核心机制是反借口表格（rationalization table）和三层渐进披露（Progressive Disclosure）。本文重点：① 三个核心元规则 ② Spec / TDD / Beyoncé Rule 的设计逻辑 ③ SKILL.md 五种内容模式 ④ Google 工程文化如何渗入 skill 设计 ⑤ 24 技能全览表。

## 技能即反借口

Osmani 是 Google 工程总监，前端性能领域的知名工程师。这个项目在 GitHub 上获得大量关注，部分原因是它的写法罕见：每个技能不只是"做什么"，还有一个**反借口表格**（rationalization table）。

以 `incremental-implementation` 技能为例。这个技能的工作流是：实现一个切片 → 测试 → 验证 → 提交 → 下一个切片。它的反借口表格长这样：

| 借口 | 现实 |
|---|---|
| "最后一起测试就行" | Bug 会叠加。Slice 1 的 bug 会让 Slice 2-5 全错。 |
| "一次搞定更快" | "感觉"更快，直到某个东西坏了，你不知道是哪里坏的。 |

再看 `code-simplification` 技能。它的一条核心原则叫 **Chesterton's Fence**（"拆栅栏之前先问为什么"）：如果你在路边看到一道栅栏，不理解它为什么在那，就不要拆它——先理解原因，再判断原因是否还成立。这个原则被写进了简化流程的第一步：**在触碰任何代码之前，先回答：这代码为什么存在？**

这些表格不是修辞技巧。它们是系统化的**反自我欺骗机制**。

## 三个元规则

除了具体技能，agent-skills 还有一套适用于所有技能的核心行为规则。其中三条值得单独拿出来看：

**1. Surface Assumptions——显式声明你的假设**

在做任何非平凡的实现之前，显式列出你正在假设什么：

```
ASSUMPTIONS I'M MAKING:
1. 这是一个 Web 应用（不是原生移动端）
2. 认证使用 session-based cookies（不是 JWT）
3. 数据库是 PostgreSQL（基于现有 Prisma schema）
→ 现在纠正我，否则我就按这些假设继续。
```

这不是建议。这是为了解决最常见的失败模式：**做了错误的假设，然后在上面狂奔，最后在错误的基础上构建。** 在代码写完之前纠正假设，代价是 0；在代码交付之后纠正假设，代价是重写。

**2. Manage Confusion Actively——主动管理困惑**

当你遇到不一致、冲突的需求或不清晰的规格时：

```
1. 停下来。不要猜测。
2. 说出具体的困惑是什么。
3. 提出权衡或澄清问题。
4. 等待解决后再继续。
```

这是 AI 编程代理最常见的隐性失败模式：遇到不清楚的地方，选择一个看起来合理的解释，然后继续。最后这个"看起来合理的解释"往往是错的，但那时候已经不知道原始上下文是什么了。

**3. Enforce Simplicity——强制简化**

```
在完成任何实现之前，问自己：
- 能用更少的代码实现吗？
- 这些抽象是否值得它们的复杂度？
- 一个 senior engineer 会说"为什么不直接..."吗？

如果你写了 1000 行代码但 100 行就够——你失败了。
优先选择无聊的、显而易见的解法。耍小聪明代价很高。
```

Osmani 在这里用了一个具体的量化标准：**1000 行 vs 100 行 = 失败**。这不是说代码要刻意写得短，而是说当你写了 10 倍于必要的长度，你大概率在某处藏了不必要的复杂度，而那些复杂度迟早会变成 bug。

## Spec：分歧最小化协议

`spec-driven-development` 技能是最接近"元问题"的一个。

它的核心洞察是：**代码从来不单独存在。它总是某个规格的实现。问题只在于那个规格是写在纸上的，还是在脑子里默认的。**

这个技能要求在任何非平凡任务开始之前，先写一份 PRD，覆盖六个维度：目标、技术栈、执行命令、项目结构、代码风格、测试策略、边界定义。

它的触发条件：**任务超过 30 分钟实现、没有现成规格、需求模糊**——这三条同时满足时，必须走 spec 流程。

它的反借口表格里有一条：

> "这很简单，不需要写 spec"
> **现实**：简单的任务不需要*长的* spec，但它们仍然需要验收标准。两行 spec 也可以。

这不是流程官僚主义。这是一个**强制分歧显式化的机制**：如果写 spec 的过程中发现了两个人对需求的理解不一致，这个发现本身就是价值——它发生在写代码之前，而不是在代码交付之后。

## 测试金字塔与"Beyoncé Rule"

`test-driven-development` 技能里有一条以流行歌手命名的规则：**Beyoncé Rule**。

> 如果你喜欢它，你应该给它写测试。

它的意思是：基础设施变更、重构、迁移——这些都不是替你发现 bug 的责任方，**你的测试才是**。如果一个变更破坏了你的代码，而你之前没有为它写测试，那是你的责任，不是变更本身的责任。

与它配套的是测试金字塔（Test Pyramid）：80% 单元测试 / 15% 集成测试 / 5% 端到端测试。Small 测试（纯内存，无 I/O，毫秒级）是最快的，也是最稳定的；Large 测试（允许外部服务，分钟级）应该是最少的。AI 编程代理天然倾向于写 Medium/Large 测试，因为它们运行在更接近真实的上下文里。但 Small 测试才是金字塔的基石——它们最能精确隔离问题。

## 对抗最短路径

agent-skills 的 24 个技能有一个共同的主题：**它们全都在对抗某种默认倾向。**

Spec 对抗"直接开始写"的倾向。增量实现对抗"一次搞定"的倾向。TDD 对抗"最后再测"的倾向。代码简化对抗"加功能比删代码更重要"的倾向。主动管理困惑对抗"猜测着继续"的倾向。

这些倾向不是愚蠢的。它们是人类认知的正常现象：在资源有限的情况下，优先处理最直接的路径是理性的。但软件工程的教训是，这个"最直接的路径"在复杂系统里的代价，往往要很多步之后才显现——而且越晚显现，代价越高。

所以软件工程本质上是一套**对抗人类默认倾向的系统化方法**。agent-skills 把这套方法从人类工程师的脑子里，搬进了 AI 代理可执行的工作流。

这大概是这件事最反直觉的地方：不是 AI 学会了做什么，而是 AI 被强制不去做那些人类在同等情况下会忍不住做的事。

## SKILL.md 的三层渐进式披露

Osmani 的 agent-skills 和 Google Cloud Tech 的 Lavi Nigam、Shubham Saboo 在 ADK（Agent Development Kit）上的 Skill 设计实践，共同指向一个核心问题：**如何让 agent 获得足够的工程纪律，而不会把 `context window` 撑爆？**

答案是**渐进式披露**（Progressive Disclosure），在 ADK 的 `SkillToolset` 体系里实现为三个层级：

| 层级 | 内容 | 何时加载 | token 成本 |
|---|---|---|---|
| L1 | `SKILL.md` frontmatter（name + description） | 启动时全部注册 | ~100/技能 |
| L2 | `SKILL.md` 正文 | Agent 判断命中后才 load | 数千 |
| L3 | `references/`、`assets/`、`scripts/` | 指令执行到那一步再拉 | 按需 |

`SkillToolset` 自动给你三个工具：`list_skills`（L1）、`load_skill`（L2）、`load_skill_resource`（L3）。10 个 skill 的 agent，基线 `context window` 从"万级 token 单体 prompt"压到"千级 L1 元数据"——大约 **90% 省流**。

这个架构解决了一个根本矛盾：**工程纪律需要详细指令，但详细指令会撑爆 context。** 答案是不让所有指令同时加载，而是按需加载——就像一个 senior engineer 不是把所有项目的所有历史都记在脑子里，而是只在需要的时候查阅文档。

## 五种 SKILL.md 设计模式

在 GitHub 仓库 [lavinigam-gcp/build-with-adk](https://github.com/lavinigam-gcp/build-with-adk) 里，Lavi Nigam 提供了 5 种 Skill 内容设计模式的可运行实现，每种都有完整的 `SKILL.md` 样例和 Python 代码：

**1. Tool Wrapper——让 Agent 秒变某库领域专家**

痛点：Agent 调 SDK 永远写出过时用法，参数顺序乱。

做法：把库/框架的约定、踩坑点塞进 `references/conventions.md`。`SKILL.md` 监听 prompt 里的关键词（"fastapi"、"react"、"pydantic"）触发加载，加载后把这份资料当**最高优先级规则**执行。

`api-expert` 技能的 `references/conventions.md` 包含：使用 `Annotated` 做依赖注入、为所有 route 指定 `response_model`、用 `Field()` 做 Pydantic 验证、永不用 bare `except:` 捕获异常。

**2. Generator——模板驱动的确定性输出**

痛点：让 Agent 写 PRD / API 文档 / commit message，今天有目录明天没有，格式漂移。

做法：`assets/` 里放模板 + `references/` 里放风格指南，`SKILL.md` 指令写成"先读模板 → 再补变量 → 按风格指南填"。

`report-generator` 技能的输出结构由模板固定，Agent 只负责填变量。

**3. Reviewer——checklist 分级审查**

痛点：Agent 做 code review 要么啰嗦、要么漏项、不同 PR 标准不一致。

做法：审查规则拆成 `references/review-checklist.md`，每条带严重等级（Critical / Warning / Info）。`SKILL.md` 指令写成"逐条过、按等级输出结论"，最后产出结构化报告：Summary → Findings（按严重程度分组）→ Score（1-10）→ Top 3 Recommendations。

`code-reviewer` 技能的 checklist 覆盖：正确性（error）、安全性（error）、风格（warning）、性能（info）、文档（info）。

**4. Inversion——先采访，再动手**

痛点：用户说"帮我写个 API"，Agent 直接开写——框架/认证/数据库全选错。

做法：`SKILL.md` 里写**硬闸门规则**（"所有问题回答完之前禁止开始设计"），把访谈拆成多阶段，一次只问一题，等答完再下一题。

`project-planner` 技能分三阶段：Problem Discovery → Technical Constraints → Synthesis。第三阶段才 load `assets/plan-template.md`，产出结构化项目规划。

Inversion 最常见的组合是 **Inversion → Generator**：先反问收需求，再调模板出成果。

**5. Pipeline——多步串行 + 检查点**

痛点：复杂任务 Agent 跳步、漏环节。

做法：`SKILL.md` 明文列步骤 + **硬门禁**（上一步没经确认不能进下一步）。每步都要"用户确认 / 自动化验证通过"才放行。

`doc-pipeline` 技能的 4 步：Parse → Generate docstring → Assemble → Quality Check，每步都有明确退出标准。

## Google 工程文化如何渗进 skill 设计

Osmani 的 agent-skills 揭示了一个更深层的事实：**光有设计模式不够，真正让 skill "像 Google 人写的"是几条隐性纪律**，它们基本对应 *Software Engineering at Google* 一书里公开的实践：

**Scope discipline**：`SKILL.md` 里写死 "touch only what you're asked to touch"，禁止 Agent 顺手重构相邻文件。改动的边界就是风险的边界。

**Verification is non-negotiable**：每个 skill 终止于可验证证据（test pass / build clean / reviewer sign-off），"seems right" 不算完。这来自 Google 的测试文化：没有证据的代码质量声明是无效的。

**Progressive disclosure**：20 个 skill 不一起加载，用个 tiny meta-skill（`using-agent-skills`）做路由。这来自 Google 的"够用即可"原则——过度文档化和不足一样有害。

**Hyrum's Law / Chesterton's Fence / ~100 LOC PR sizing**：这些本来是 Google 代码评审里的暗语，现在直接编进 skill 的 `references/` 里。Hyrum's Law 说"当 API 有足够多的用户，所有对实现细节的依赖都是陷阱"；Chesterton's Fence 说"不理解为什么存在的东西就不要改动"。让 Agent 凌晨 3 点做设计决策时也不会忘掉它们。

## 24 个技能一览

agent-skills 的 24 个技能分为 6 个阶段：

| 阶段 | 技能 | 核心定位 |
|---|---|---|
| **Define** | `interview-me` | 通过提问提取用户真正想要的东西，直到~95%置信度 |
| | `idea-refine` | 把模糊想法通过发散/收敛思维变成具体提案 |
| | `spec-driven-development` | 写 PRD，覆盖目标、命令、结构、代码风格、测试策略、边界 |
| **Plan** | `planning-and-task-breakdown` | 把规格分解为小、可验证、带验收标准的任务 |
| **Build** | `incremental-implementation` | 薄垂直切片——实现一个、测试一个、验证一个、提交一个 |
| | `context-engineering` | 在正确的时间给代理正确的信息——规则文件、MCP 集成 |
| | `source-driven-development` | 每个框架决策都要基于官方文档，有据可查 |
| | `doubt-driven-development` | 对抗性审查——CLAIM → EXTRACT → DOUBT → RECONCILE → STOP |
| | `frontend-ui-engineering` | 组件架构、设计系统、状态管理、WCAG 2.1 AA |
| | `test-driven-development` | 红-绿-重构，测试金字塔，Beyoncé Rule |
| | `api-and-interface-design` | 契约优先设计、Hyrum's Law、单版本规则 |
| **Verify** | `browser-testing-with-devtools` | Chrome DevTools MCP 实时运行时验证 |
| | `debugging-and-error-recovery` | 五步 triage，重现→定位→简化→修复→防护 |
| **Review** | `code-review-and-quality` | 五轴审查，变更大小~100行，严重级别 Nit/Optional/FYI |
| | `code-simplification` | Chesterton's Fence，Rule of 500，减少复杂度同时保持行为 |
| | `security-and-hardening` | OWASP Top 10 预防，认证模式，依赖审计，三层边界系统 |
| | `performance-optimization` | Core Web Vitals 目标，分析工作流，anti-pattern 检测 |
| **Ship** | `git-workflow-and-versioning` | trunk-based development，原子提交，~100行变更 |
| | `ci-cd-and-automation` | Shift Left，Feature Flags，质量门禁流水线 |
| | `deprecation-and-migration` | 代码即负债思维模式，zombie code 清理 |
| | `documentation-and-adrs` | 架构决策记录，API 文档，inline 文档标准 |
| | `observability-and-instrumentation` | 结构化日志，RED 指标，OpenTelemetry 追踪 |
| | `shipping-and-launch` | 发布前检查清单，Feature Flag 生命周期，rollback 程序 |

## 结尾

agent-skills 里的每一个技能，都内置了三个共同机制：

**反借口表格**：记录"这一步人类/AI 会找什么借口跳过，以及为什么那是错的"。这是把工程纪律编码成可执行步骤的核心设计。

**验证非协商**：每步都有明确的退出证据要求。"看起来对"不够；必须有证据。

**渐进披露**：`using-agent-skills` 做路由，每个 skill 只在需要时才加载完整指令。

Osmani 在项目 README 里说了一句话值得放在结尾：**"AI coding agents default to the shortest path — which often means skipping specs, tests, security reviews, and the practices that make software reliable."**

技能的作用，就是强制代理不走那条最短路径。

> 仓库：[addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)（MIT license）；五种模式对应到 ADK 实现：[lavinigam-gcp/build-with-adk](https://github.com/lavinigam-gcp/build-with-adk)。
