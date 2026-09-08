# Agent Client Protocol：让 Editor-Agent 集成走向 M+N 而非 M×N

---

## LSP 的历史重演

十年前，每个编辑器要为每种编程语言写独立的语法高亮、自动补全、跳转定义插件。M×N 的集成负担让好的工具被锁死在特定编辑器的生态里。然后 LSP（Language Server Protocol）出现了，所有编辑器通过同一个协议与所有语言服务器对话。集成成本从 M×N 降到了 M+N。

现在，AI 编码 agent 正在重演完全相同的局面。

每个编辑器为每个 agent 写独立集成，agent 要实现每个编辑器的专有 API 才能触达用户。Zed 有 Zed 的集成，Cursor 有 Cursor 的，VS Code 又是一套。换个 agent 要换一套工作流，换个编辑器要重新配置所有集成。没有人愿意被困在某个编辑器的 agent 生态里——但现状就是这样。

**Agent Client Protocol（ACP）** 做的事情和 LSP 一样：把 M×N 变成 M+N。

---

## ACP 是什么

ACP（Agent Client Protocol）是一个开放标准，用 JSON-RPC 2.0 作为传输层，标准化编辑器/IDE 与编码 agent 之间的通信。

核心通信模型：

- **Initialize**：协商协议版本和各自能力
- **Session setup**：创建新会话或恢复已有会话
- **Prompt turns**：发送用户消息，接收流式更新、工具调用、diff 输出

传输层支持两种模式：
- **本地 agent**：作为编辑器的子进程运行，JSON-RPC over stdio，轻量、流式、不需要网络
- **远程 agent**：通过 HTTP 或 WebSocket 通信，云端托管或独立基础设施

协议尽可能复用了 MCP（Model Context Protocol）的 JSON 表示，但为 agent 特有的 UX 元素（如 diff 展示）定义了自定义类型。默认用户可读文本格式是 Markdown，不需要编辑器支持 HTML 渲染。

---

## 三层协议的分工

ACP 不是唯一一个在 AI agent 领域出现的协议。实际上，现在同时存在三个协议，各自解决不同层次的耦合：

| 协议 | 方向 | 解决的问题 |
|------|------|-----------|
| **MCP**（Model Context Protocol） | Agent → 工具/数据源 | Agent 作为 MCP client 访问工具和数据 |
| **ACP**（Agent Client Protocol） | Editor → Agent | Editor 作为 ACP client 驱动 agent |
| **A2A**（Agent-to-Agent） | Agent ↔ Agent | 多 agent 协作通信 |

典型会话里，agent 同时扮演两个角色：对编辑器是 ACP server，对工具是 MCP client。Editor 把 MCP servers 传给 agent，agent 戴着两顶帽子在跑。

---

## 现状：生态已经在这里了

ACP 不是纸上规范等实现。2026年3月已经有：

**30+ agents**：Claude Agent、Codex CLI、GitHub Copilot（公开预览）、Gemini CLI、Cline、Goose、Junie（JetBrains）、OpenHands、Augment Code、Kiro CLI……

**20+ clients**：Zed（原生支持）、JetBrains IDEs、VS Code（插件）、Neovim（CodeCompanion、avante.nvim）、Emacs（agent-shell.el）、Obsidian，甚至 Slack 和 Telegram 机器人。

这个覆盖范围跨越了平常很少达成共识的供应商边界。Zed 原生引入，JetBrains 全面支持，社区为 Neovim 和 Emacs 写了客户端——但没有一对是私下谈判的结果。他们只需要双方都说话 version 1。

协议本身是 Apache 2.0 许可，有 TypeScript、Python、Rust、Kotlin 官方 SDK，GitHub 上 schema 已经到 v1.17.0。值得注意的是**版本分离设计**：crate 库版本快速迭代，但 wire compatibility 由 protocolVersion 决定，当前稳定 wire 版本是 1。这意味着一个两年前的 Neovim 插件仍然可以和全新的 agent 通信——LSP 学到的教训。

---

## Pi Harness：参考实现的意义

摘要里提到"Pi harness cited as reference impl"。这个引用指向的是 Gemini CLI 作为 ACP 的参考实现。Gemini CLI 内置了完整的 Pi harness——即那套围绕模型的引导和反馈系统。

这个设计选择意味深长：当你通过 ACP 连接一个 agent，你获得的不仅仅是一个 LLM，而是**一个围绕模型搭建的完整框架**：规划逻辑、工具、模型路由行为、可观测性。ACP 将 IDE 与 agent 之间的边界标准化，因此你可以无缝切换 agent 而无需改变 IDE 的集成方式。

可替换的单元规模大于 LLM 本身。

---

## 还没解决的问题

ACP 本身在快速演进，以下是仍需观察的点：

**远程 agent 支持**：完全支持远程场景（云端托管等）仍是进行中的工作，正在与 agentic 平台合作确保协议满足云端部署的具体需求。

**安全模型**：远程场景下的认证和权限边界需要更多规范工作。本地场景下 agent 作为子进程运行，权限边界相对清晰；远程场景引入了新的信任假设。

**复杂度控制**：LSP 的教训是核心保持简单，可选能力按需添加。ACP 正在走同样的路，但协议是否能在采用量增长后保持精简，还有待观察。

---

## 为什么这重要

ACP 的意义不在于让 editor-agent 集成"成为可能"——Zed、Cursor、Copilot 都已经各自实现了。它的意义在于让集成从**私有绑定**变成**公共契约**。

私有绑定的问题是：你的编辑器选择悄悄决定了你的 agent，你的 agent 选择悄悄决定了你能用哪个编辑器。一旦一方有独占功能，双方就绑定了。

ACP 是那个楔子，解开这个耦合。如果它站稳了，有趣的竞争会回到它本来应该决定胜负的地方——agent 本身的质量。而你回答"哪个 ACP？"的方式，会和你回答"哪个 JSON？"一样无聊：问的是它接了什么，而不是它是什么。

---

**参考**

- [agentclientprotocol.io](https://agentclientprotocol.io)
- [ACP: The Third Protocol Named ACP — dreaming.press](https://dreaming.press/posts/agent-client-protocol-acp-vs-mcp)
- [Agent Client Protocol: LSP for AI Coding Agents — prokopov.me](https://prokopov.me/posts/agent-client-protocol-lsp-for-coding-agents)
- [How to use AI agents in IntelliJ IDEA with ACP — JetBrains Blog](https://blog.jetbrains.com/zh-hans/idea/2026/08/how-to-use-ai-agents-in-intellij-idea-with-acp/)
