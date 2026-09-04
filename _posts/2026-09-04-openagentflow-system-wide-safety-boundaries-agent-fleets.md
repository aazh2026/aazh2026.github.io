# OpenAgentFlow：Agent 安全治理进入操作系统级

2026 年，多起 Agent 安全事故（模型逃逸沙箱、PyPI 恶意包发布）把一个事实摆上台面：单体 Agent 的安全机制（prompt 护栏、tool allowlist）在多 Agent 协作环境里彻底失效。

OpenAgentFlow（arXiv:2609.00015）是首个面向异构 Agent 集群的系统级安全边界框架，被 SOSP AgenticOS Workshop 接收。

---

## 核心问题：碎片化 enforcement

现有安全机制的问题不是缺少护栏，而是护栏分布在不同层：prompt 里有一层，tool call 里有一层，GUI 操作里有一层，OS 权限又一层。

但当多个 Agent、Planner、Controller、Execution Backend 在同一个用户/企业环境里协同运行时，危险不出在单层——危险出在跨层组合产生的 emergent behavior：一个 tool call 本身是安全的，但和前面的 GUI 操作序列组合起来就变成了数据渗出。

OpenAgentFlow 的判断是：安全必须发生在"action-commit boundary"——在 Agent 生成的动作被提交到共享状态之前那一刻。

---

## 架构：控制平面与动作平面分离

**AgentEvent**：把 GUI action、API call、tool call、LLM 生成调用统一规范化成同一个事件格式。跨模态的动作现在有了统一描述语言。

**Policy Enforcement Point（PEP）**：每个 AgentEvent 在提交前都经过 PEP。Policy 可以动态更新，更新后立即生效，不需要改 Agent、prompt、model 或 execution path。

**Control Plane**：维护 provenance、session state、audit records 和 updatable policies。Policy 管理与动作执行彻底分离。

这意味着：你可以随时加一条新规则（"禁止删除超过 100MB 的日志文件"），不需要重启任何 Agent，不需要改任何 prompt，新规则在所有 Agent 的下一次动作提交时立即生效。

---

## 数据：Android 场景下的实测

- 300-case action-event benchmark：94.0% 准确率，95.3% 攻击阻断率
- 30-case 动态策略套件：新规则安装后，27/30 符合预期行为
- 100-case Android 模拟器套件（98 条 traced）：90.8% 原始准确率，92.9% trace 调整后通过率

覆盖 GUI、API、LLM 规划三类动作。

---

## 一个未解决的挑战

OpenAgentFlow 的 enforcement guarantee 绑定在 PEP 边界内——只有通过 PEP 的 instrumented agent-mediated actions 才受保护。

这意味着：直接 OS 级系统调用、绕过 PEP 的侧通道、或者模型本地的 memory-resident 攻击，不在保障范围内。论文坦承这一点，并建议生产部署需要搭配 confirmation 机制、task-specific exceptions 和 audit trail。

但核心洞察是正确的：安全策略应该挂在 action-commit boundary 上，而不是挂在 Agent、prompt 或 tool 的内部。

---

**参考**

- OpenAgentFlow：arXiv:2609.00015（Dongsheng Chen, Xiangyu Zhao, Xin Yao, Xuetao Wei）
