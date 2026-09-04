# Agent Plugins：插件包装标准化，但最大的玩家缺席了

## 一个真实的开发者困境

你花了三天写了一个代码审查插件。技能定义、MCP 服务器配置、工作流说明，全都有了。

然后你发现它要跑在五个不同的环境里：Cursor、VS Code、GitHub Copilot、ChatGPT、Codex。每个环境有自己的目录结构、自己的 manifest 格式、自己的配置字段。

同一个插件，五个版本。这不是开发，这是包装税。

这就是 Agent Plugins 要解决的问题。

---

## 做了什么

Agent Plugins 是由 AWS、Cursor、GitHub（微软）、OpenAI 和 Vercel 联合发布的开放标准，2026 年 8 月 6 日发布 1.0.0 版本。

标准定义了一个最小可移植目录结构：

```
my-plugin/
├── plugin.json          ← 必须：清单文件
├── skills/
│   └── review/
│       └── SKILL.md     ← Agent Skill 定义
├── mcp.json             ← MCP 服务器配置
└── com.example.client/  ← 客户端特定扩展（其他客户端忽略）
```

`plugin.json` 最少只需要两个字段：`$schema` 和 `name`。其余都是可选的。

**两种可移植组件**：

- **Agent Skills**：指令和工作流定义，SKILL.md 格式，完全沿用已有的 Agent Skills 规范，不重新发明
- **MCP 服务器**：在 `mcp.json` 里声明 stdio、Streamable HTTP 或 legacy SSE 三种传输配置

标准只管包装和发现层，不管安装、权限、UX、发行——这些留给各客户端自己决定。这是关键的设计约束，让各厂商能够快速实现而不需要放弃对自己产品的控制。

---

## 为什么这值得关注

在 Agent Plugins 之前，每个主流工具都自己发明了一套插件格式。MCP 解决了「客户端如何连接外部工具」的问题，但它不管 Skill 如何打包和分发。

Agent Plugins 补的是这一层：让 Skill + MCP 配置打成一个包，能够跨客户端被发现和加载。

发布日当天，五个客户端类别同步支持：VS Code、Cursor、GitHub Copilot、ChatGPT/Codex、Kiro。这个覆盖面是关键——一个包装格式只有被足够多的目标工具读取，才有实际价值。

---

## 最大的缺口：Anthropic 不在场

标准发布时，Technical Steering Committee 的成员是：Amazon、Cursor、Microsoft、OpenAI、Vercel。

Anthropic 不在。

这是一件需要认真对待的事。Claude Code 是最早推动 Agent Skills 格式的工具，也是 Skill 生态最丰富的平台。但 Claude Code 用的 manifest 路径是 `.claude-plugin/plugin.json`，和 Agent Plugins 规定的根目录 `plugin.json` 不一样。

结果是：同一个插件包，Claude Code 不会自动发现它。需要手动重命名路径才能兼容。

这意味着「write once, run everywhere」目前还差一截。最重要的缺席者是 Agent Skills 最初的发起方，而 Skill 的格式正是这个标准的核心组件之一。

行业标准的生命力取决于关键玩家是否参与。Anthropic 的不在场，是一个真实的信号——而不是技术问题。

---

## v1 的安全现状：没有签名，没有沙箱

这是购买这个标准前需要知道的：

- **没有插件签名机制**：安装一个第三方插件等于执行它的代码，没有可验证的来源保证
- **没有沙箱边界定义**：规范把安全模型完全下放给了各客户端实现
- **凭证不打包**：标准明确说 `mcp.json` 里只含服务器 URL 和传输类型，不含凭证信息

规范自己也标注了这些是已知缺口，留到后续版本。但这些缺口在实践中不是小事——如果出现公共插件注册机制，没有签名验证的供应链风险会比传统 npm 生态更严重，因为 Skill 能直接影响 Agent 的推理过程。

---

## 我的判断

Agent Plugins 的方向是对的。多厂商背书、覆盖主流客户端、只定义最小可移植层而非强制统一体验——这些决策让采用成本足够低，厂商能够快速落地。

但 v1 是一个不完整的开始。最大缺口是 Anthropic 的缺席，这导致「everywhere」这个说法现在还不成立。如果 Claude Code 用户是你的目标用户群，你仍然在维护两套格式。

值得现在上手的场景：你在为 Cursor、VS Code、GitHub Copilot 等多个客户端维护同一套插件——立即合并，收益明确。

值得观望的场景：Claude Code 是你的主要目标——等 Anthropic 是否加入委员会，等路径兼容性明朗之后再迁移。

Agent Plugins 最终会长成什么样子，很大程度上取决于 Anthropic 什么时候、以什么方式参与进来。

---

**参考**

- 规范主页：https://agent-plugins.org/
- GitHub：https://github.com/agent-plugins/standard
- Launch 客户端：VS Code、Cursor、GitHub Copilot、ChatGPT、Codex、Kiro
