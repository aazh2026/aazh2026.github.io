# Post-Code Engineering

**AI-Native软件工程 | 从代码到意图 | 探索后代码时代的工程范式**

🔗 **博客地址**：https://aazh2026.github.io

---

## 📚 内容概览

### 🦞 Agent OS 系列（10篇，已完结）

从 SaaS 到 Agent OS 的完整迁移指南。

> **核心判断**：未来软件的主形态不是 SaaS，而是 **Agent OS（智能体操作系统）**

**涵盖主题**：
- 概念与愿景：范式转移、商业价值、交互设计
- 技术架构：五层架构、记忆系统、Multi-Agent 协作
- 实践案例：CRM 的 Agent 化重构
- 组织变革：AI Digital Employee
- 商业模式：Agent Economy

**系列统计**：
- 总字数：~123,000 字
- 代码示例：50+ 个
- 阅读时间：10-12 小时

**[→ 阅读 Agent OS 系列](https://aazh2026.github.io/agent-os-series/)**

---

### 🧠 AISE 系列（50+篇）

AI-Native 软件工程（AISE）五层架构模型的系统性探索。

**核心观点**：
- 代码是负债，不是资产
- Intent 是新的编程语言
- Context 管理是核心竞争力

**[→ 阅读 AISE 系列](https://aazh2026.github.io/aise-series/)**

---

### 🔒 Memory Engineering 系列（10篇）

从 Cold Start 到 Graceful Degradation：构建 AI 记忆系统的完整工程。

**[→ 阅读 Memory Engineering 系列](https://aazh2026.github.io/memory-engineering-series/)**

---

## 🎯 核心理念

### Post-Code 的含义

**Post-Code** 不是"没有代码"，而是"超越代码"。

当 AI 可以生成、理解、重构代码时，软件工程的核心竞争力正在从"写代码的能力"转向：

- **意图表达** —— 清晰定义"要什么"比"怎么写"更重要
- **架构思维** —— 设计系统的组合方式而非实现细节
- **Context 管理** —— 知道何时给 AI 什么信息

> 我们正从 **Code-Centric** 时代进入 **Intent-Centric** 时代。

### Hal Stack

本博客是 **Hal Stack**（AI-Native 软件工程方法论）的一部分：

| 组件 | 描述 |
|------|------|
| 🦞 **Agent OS** | Agent 操作系统架构 |
| 🧠 **AISE** | AI-Native 软件工程 |
| 📊 **Metrics** | AI 时代的效能度量 |
| 🔒 **Governance** | AI 治理与合规 |

---

## 📝 最新文章

- [测试覆盖率没告诉你的一件事：需求覆盖率](https://postcodeengineering.com/requirement-coverage/)
- [AI 编程代理的工程纪律：agent-skills 的反直觉设计](https://aazh2026.github.io/agent-skills/)
- [Loop Engineering：把你从流程里抽出来](https://aazh2026.github.io/loop-engineering/)
- [提示词是输入，循环是过程](https://aazh2026.github.io/loop-engineering/)
- [当 AI 编程走向确定性：Dynamic Workflows 与 Agent Harness 的殊途同归](https://aazh2026.github.io/deterministic-ai-programming/)
- [开源正在被 AI 垃圾淹没：Armin Ronacher 的 Pi 教训](https://aazh2026.github.io/open-source-ai-slop/)

**[→ 查看全部 205 篇文章](https://aazh2026.github.io/archive)**

---

## 🛠️ 开源项目

### [specgate](https://github.com/aazh2026/specgate)

**需求覆盖率：像测试覆盖率一样度量验收标准。**

测试覆盖率回答「这行代码跑过吗」，不回答「这个需求实现了吗」。
specgate 解析 spec 里的验收标准，在代码中分级查找证据（显式标记 / 测试名匹配 / 仅有实现），
输出需求覆盖率，并可在 CI 中作为门禁。

- 确定性运行，**不调用 LLM**，无 API key、无网络依赖
- 支持 text / JSON / SARIF 输出，可直接接入 GitHub code scanning
- 30 个测试覆盖全部核心路径

```bash
npx --yes specgate-cli
```

**[→ GitHub](https://github.com/aazh2026/specgate) · [博客详解](https://postcodeengineering.com/requirement-coverage/)**

### [vlab](https://github.com/aazh2026/vlab)

**回测数字最危险的地方：它看起来太像真的了。**

零依赖的资产配置回测实验室。重点不在画好看的净值曲线，而在**审计回测的输入假设**——
那些不会让程序报错、却能把结论改掉的坑。

- **双窗口口径**——「可投资现实」与「指数代理长窗口」强制分开陈述，不混用
- **未上市资产留现金**——不提前入场，超额权重不归一化
- **防未来函数护栏**——策略只能看到「截至当天」的数据，读 `mat[c][i+1]` 直接抛异常
- **有效性检验**——样本内/样本外切分、参数网格（含 overfit gap 与先知基线）、滚动前推
- **零运行时依赖**——纯 Python 标准库，零 CDN，单文件面板可离线打开
- 77 个回归测试，每个历史缺陷一个具名用例钉死

```bash
PYTHONPATH=src python3 -m vlab validate examples/momentum_rotation.py
```

**[→ GitHub](https://github.com/aazh2026/vlab) · [博客详解](https://postcodeengineering.com/backtest-validity/) · [在线面板](https://postcodeengineering.com/vlab/)**

---

## 🔧 技术栈

- **框架**：Jekyll 4.3 + Minima 主题
- **部署**：GitHub Pages (4 套 CI workflow)
- **SEO**：jekyll-seo-tag + 每篇独立 OG 图
- **a11y**：520 个 `<object>` 全部带 `aria-label` + skip-to-content
- **评论**：Giscus (GitHub Discussions 桥接)
- **主题**：浅色 / 深色 / 自动跟随系统
- **PWA**：webmanifest + OpenSearch

### 构建产物

- 205 篇文章
- 546 SVG（最大 36 KB，SVGO 压缩 17.4%）
- 204 张独立 OG 社交分享图（1200×630）
- 5 套 CI workflow + 1 个 pre-commit hook
- 3 个本地脚本（frontmatter / link-check / OG 生成 / 颜色对比）

---

## 🛡️ 质量保证

每个 PR 自动跑：
1. **YAML frontmatter 验证**（Python yaml.safe_load）
2. **内部 link 检查**（Node，178 个链接全检）
3. **markdownlint**（post 写作规范）
4. **颜色对比度**（WCAG AA）
5. **lychee**（构建后外链审计）

---

## 📬 订阅与联系

- **博客**：https://aazh2026.github.io
- **RSS**：https://aazh2026.github.io/feed.xml
- **Sitemap**：https://aazh2026.github.io/sitemap.xml
- **GitHub**：[@aazh2026](https://github.com/aazh2026)

---

## 📄 许可

本博客文章采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可协议。

代码示例采用 MIT 许可。

---

*Built with Jekyll + ❤️ + AI assistance*
