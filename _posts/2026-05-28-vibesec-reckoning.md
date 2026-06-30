---
layout: post
title: "Vibe Coding 的账单来了：Thoughtworks 的教训"
date: 2026-05-28T14:00:00+08:00
tags: [AI安全, Vibe Coding, 开发实践, Agent架构]
author: "@postcodeeng"
series: aise
description: "告诉AI「要安全」不等于强制它安全——2026年25%的AI生成代码含已确认漏洞，解决之道是从「建议」到「门控」的转换，把安全规则编码为不可绕过的检查。"
---

> **TL;DR**
>
> Thoughtworks 的一个团队在扩展一个 vibe-coded prototype 时，AI 两次推荐了严重的安全风险配置：公开存储 bucket、给服务账号过度授权。团队在造成实际伤害前拦截了这些错误，但这些不是孤立事件——2026 年的数据显示，25% 的 AI 生成代码包含已确认的漏洞，1/5 的企业数据泄露现在由 AI 代码引起。
>
> **Key Insight:** 告诉 AI「要安全」不等于强制它安全。Prompt 可以被覆盖、被误解、被忽略。真正的防御需要从「建议」到「门控」的转换——把安全规则编码为不可绕过的检查，而不是可被忽略的提示。

---

## 两个差点发生的灾难

Thoughtworks 全球营销团队的 AI 应用组被要求扩展一个用 Gemini、Replit AI 和 Claude AI 构建的视频生成 prototype，这个原型是由一个「公民构建者」（非技术人员）用 vibe coding 方式开发的。

团队遇到了两次让他们工作停顿的时刻——两次都是 AI 建议了一个有严重安全含义的路径，两次都是有人问了正确的问题才拦截下来。

**安全风险 #1：公开存储访问**

AI 建议把存储 bucket 设为公开，或者把云文件存储设为「任何有链接的人都能访问」。当被质疑时，它辩解说每家公司都这么做。只有坚定的拒绝才能让 AI 给出安全的替代方案。

这可能已经泄露了敏感的未发布品牌资产和受众数据到公共互联网。

**安全风险 #2：过度 token 权限**

一个服务账号被授予了 Access Token Creator 角色，给了它创建短期令牌的能力，可以访问远远超出任务所需的数据库和其他资源。团队在运行代码之前拦截了这个问题。

这会让被破坏的服务账号能够在整个云工作空间中横向移动。

关键洞见是：AI 工具经常建议阻力最小的路径。那条路径不总是安全的。人类判断仍然必不可少，但不应该成为唯一的控制。

> 💡 **Key Insight**
>
> 告诉 AI「要安全」不等于强制它安全。Prompt 可以被覆盖、被误解、被忽略——而确定性检查不会。

---

## 数字背后的风险

这些事件不是孤立的。2026 年发表的研究证实，AI 辅助编程以速度进行创造了系统性的安全暴露。同样的风险正在整个行业重演。

| 统计 | 数据 | 来源 |
|------|------|------|
| AI 生成代码含已确认漏洞的比例 | **25%** | AppSec Santa, 2026 |
| 利用应用漏洞的攻击同比增长 | **44%** | SQ Magazine, 2026 |
| 含高危/严重漏洞的代码库比例 | **78%** | Black Duck OSSRA 2026 |
| 企业数据泄露由 AI 代码引起的比例 | **1/5** | Aikido Security, 2026 |
| 2026 年 3 月单月新增 CVE（来自 AI 代码） | **35 个** | Georgia Tech Vibe Security Radar |
| 有 prompt injection 暴露的 AI 系统比例 | **73%** | SQ Magazine, 2026 |
| 所有新企业软件中 AI 生成的比例 | **42%** | Sonar Developer Survey, 2026 |
| 安全团队表示跟上 AI 代码量越来越难的比例 | **62%** | ProjectDiscovery, 2026 |

这些数字揭示了一个系统性问题：AI 生成的代码正在以超出安全团队处理能力的速度进入生产环境。

---

<object data="/assets/images/2026-05-28-vibesec-reckoning-01-risk-matrix.svg" type="image/svg+xml" width="100%" aria-label="数字背后的风险" role="img"></object>

## 核心问题：Prompt 不够

在与工程和安全同事分享这些事件后，一个清晰的结论回来了：**告诉 AI agent 要安全，不等于强制它安全。**

Prompt 可以被覆盖、被误解、被忽略。当用户push back 一个限制，或者用不同方式表达请求时，约束就会消失。

工程领导层的一句话：

> 「仅仅告诉 LLM 你希望输出 artifact 怎样是不够的。如果你绝对不想让某件事为真，它必须被编纂成在你开发生命周期中不可谈判的规则。」

思考这个问题：prompt 驱动开发不是强制代码覆盖率阈值。前者是建议，后者是门控。

Birgitta Böckeler 的 harness engineering 工作让这一点具体化了：开发者把 agent 包在一个外部「harness」中，沿着两个轴构建：

- **Guides（前馈控制）** 在 agent 行动之前预见不需要的行为并引导模型
- **Sensors（反馈控制）** 在 agent 行动之后观察代码，标记错误

- **Computational controls（计算控制）** 是确定性的、快速的、CPU 运行的（如 linter、测试套件）
- **Inferential controls（推理控制）** 依赖语义分析和 AI 驱动的判断（如特定的 system prompt 约束）

<object data="/assets/images/2026-05-28-vibesec-reckoning-01-prompt-vs-pipeline.svg" type="image/svg+xml" width="100%" aria-label="Prompt-driven vs Pipeline-gated" role="img"></object>

---

## 三步走的解决方案

### 短期习惯

在每一天的代码 session 中建立防御意识，是成本最低的起点。这些习惯不需要组织层面的协调，只需要个人层面的坚持。

**把技术安全规则喂进每个 session**。在 Claude、Cursor 或 Replit 中把组织的安全指南添加为「Rules」——这些规则在每次新的 coding session 开头自动加载，为 agent 的输出设定安全基线。例如，一个配置正确的 Rules 文件会告诉 agent：永远不要建议把存储 bucket 设为公开，永远不要建议在代码里硬编码 API key。AI agent 会把这些规则作为指导，使安全模式从一开始就更可能发生。但关键的是：Rules 是推理层的指导，不是强制——它们仍然需要被确定性检查备份，在部署之前，不安全的代码、暴露的 secret、过度授权或不安全的基础设施不能通过 CI。

**质疑 AI 建议的每一个权限**。当工具建议把某个资源公开，或分配一个宽泛的服务账号角色时，停下来问为什么。例如，AI 说「把这个存储 bucket 设为公开，这样测试环境可以访问」——这时需要追问：测试环境真的需要公开访问吗？一个私有 bucket 配合签名 URL 是否更合适？阻力最小的路径和安全路径很少是同一个，而安全的那个往往需要多花五分钟。

**尝试 red team prompt**。让 AI 扮演恶意者，pen test 它刚构建的东西。具体的 prompt 形式是：「假设你是一个外部攻击者，已经获得了这个系统的标准用户凭证，列出你最可能利用的三条攻击路径。」这个技术一致性地暴露出前瞻性 prompt 遗漏的漏洞——特别是在权限和数据暴露方面。

---

### 中期方案：安全上下文文件

团队把技术安全规则编译成一个结构化的上下文文件，在每个 AI coding session 开始前加载。它涵盖零信任执行、最小权限 secret 管理、harness 工程和供应链完整性。

与随意 prompt 的关键区别是**操作纪律**：文件是被版本化的、默认加载的、经过审查的、与自动化检查配对的。它作为一个全面的推理指南，告诉 agent 什么是好的——但必须与管道中的计算传感器配对，以验证输出是否可接受。

**安全上下文文件应包含的内容：**

| 领域 | 正确的做法 | 为什么重要 |
|------|-----------|-----------|
| 零信任和最小权限 | 每个服务账号和存储资源的严格身份验证和最小访问权限 | 设置推理引导参数，直接防止 token 权限风险 |
| Secret 管理 | AI 拒绝在代码中生成或存储 API key、密码或 token；总是路由到环境变量或 secret manager | 在 credential 到达 repository 之前阻止泄漏 |
| Harness 工程门控 | SAST 扫描、credential 扫描和基础设施验证必须在部署前通过；不依赖 prompt 指令 | 用确定性计算传感器备份推理指令 |
| 供应链完整性 | 只使用成熟的库；定期审计每个依赖的已知漏洞 | 减少 AI 建议 obscure 或未审核包的风险 |
| AI 问责制 | 所有 AI 生成的代码在部署前需要标记为 peer review 和自动化安全扫描；没有未批准 AI 使用 | 合规审计可追溯性所需 |

关键是：文件包含不可谈判的规则，强制 AI agent 拒绝违反政策的请求。如果 AI 被要求绕过检查、禁用日志或把东西设为公开访问，规则应该引导它拒绝并解释为什么。但重要的控制是：即使 agent 未能遵循指导，确定性检查和部署门控仍然应该捕获问题。

---

### 中期方案：每日安全情报 feed

工作流程监控团队主动使用的工具和语言，每天传递新的 CVE、平台公告和安全公告。这不是另一个安全仪表盘——而是把情报整合进开发者的日常节奏，让他们不需要主动去找就能知道风险在哪里。

覆盖领域最重要的四个维度：团队编写所用的语言（如 Python、TypeScript）、部署到的云平台（AWS、GCP、Azure）、AI coding 工具本身（Claude、Cursor、Replit、GitHub Copilot），以及通用 CVE 数据库（NVD、GitHub Advisory Database）。2026 年 3 月单月新增 35 个来自 AI 代码相关工具的 CVE，这个数字已经高于许多中型安全团队的日常处理能力。云平台的配置变更、主流 AI 工具的模型版本更新，都是高价值的监控节点。

目标是在披露当天了解漏洞，而不是几周后——在 62% 的安全团队表示跟上 AI 代码量越来越难的背景下，情报的及时性直接决定了响应窗口。42% 的所有新企业软件现在是 AI 生成或 AI 辅助，这个比例还在上升，意味着加速开发的工具也是最有可能出现在新 CVE 披露中的工具。在 ProjectDiscovery 的调查中，超过六成安全团队承认他们当前的流程无法应对 AI 代码量的增速，这不是危言耸听，是资源错配的结构性信号。

---

## 长期改变：从 Prompt 到 Pipeline

从个人习惯到组织能力，需要在系统层面重新设计人与 AI 之间的交互结构。三个机制需要同时推进，才能真正把安全从「建议」变成「门控」。

**把 harness 工程集成到标准 prototype 模板中**。从概率性 prompt 转向显式反馈循环，是组织层面最重要的一步。当一个 prototype 从个人 session 升级为团队项目时，harness 应该成为 scaffold 的一部分——而不是事后追加。具体来说，如果计算传感器（如自动化安全扫描器）触发，agentic 循环必须结构性强制模型自我纠正，直到它通过。没有这个强制循环，agent 会不断产生新的不安全的代码，等待人类在 review 时发现——这等于把安全责任外包给了疲惫的 reviewer。

**把安全规则 feed 到 application builder（Cursor、Claude 等）**。把组织的技术安全规则编译成结构化上下文 markdown 文件，加载为模型必须遵守的「Rules」——这在最便宜的点捕获最常见的失误，在任何代码被 commit 之前。关键是操作纪律：文件是被版本化的、默认加载的、经过审查的、与自动化检查配对的。如果 AI 被要求绕过检查、禁用日志或把东西设为公开访问，规则应该引导它拒绝并解释为什么。但即使 agent 未能遵循指导，确定性检查和部署门控仍然应该捕获问题。

**让安全路径成为容易的路径**。这是改变激励机制的核心：给构建者一个安全默认起始点。预先配置身份验证模式、私有存储默认值、secret 处理和依赖扫描的模板，减少任何人走向不安全配置的机会。当安全选项是默认选项时，阻力最小的路径就是安全的路径——而不是相反。这需要 platform 团队主动建设这些模板，并把它们作为 AI coding 工具的标准上下文加载进去。

---

## 深层洞见：安全的路径不是阻力最小的路径

这篇来自 Thoughtworks 的文章揭示了一个 AI 编程时代的基本矛盾：

**AI 的设计目标是减少阻力**——它总是建议最简单、最快速的路径来完成用户的请求。但安全的路径往往需要更多的步骤、更严格的配置、更深入的思考。

> 💡 **Key Insight**
>
> AI 的设计目标是减少阻力——它总是建议最简单、最快速的路径来完成用户的请求。但安全的路径往往需要更多的步骤、更严格的配置、更深入的思考。

当 AI 被设计成减少阻力时，它也在系统性地减少安全。

这不是 AI 的 bug。这是产品设计的目标和安全性之间的根本张力。Vibe coding 让非技术人员也能构建应用——但它也让没有安全意识的人能够构建不安全的应用。

解决方案不是让用户成为安全专家，而是把安全控制从「建议」变成「门控」——从「提示 AI 要安全」变成「不允许不安全的代码通过」。

---

## 延伸阅读

- Martin Fowler 原文: https://martinfowler.com/articles/vibesec-reckoning.html
- Birgitta Böckeler harness engineering: https://martinfowler.com/articles/harness-engineering.html
- Black Duck OSSRA 2026 Report: https://www.blackduck.com/blog/open-source-trends-ossra-report.html
- AppSec Santa AI Generated Code Security: https://www.paperclipped.de/en/blog/ai-generated-code-security-vulnerabilities/