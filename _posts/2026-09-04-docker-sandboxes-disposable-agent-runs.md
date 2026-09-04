# Docker Sandboxes：让 Agent 跑在「 trailer 」而不是「房间」里

## Agent 拥有你机器的完整访问权

这件事很少被正面说，但它是真的：

当你对着一个 coding agent 说"帮我重构这个模块"，它执行的每一个命令都跑在你的用户权限下。`rm -rf`、读取 `~/.ssh/id_rsa`、全局安装 npm 包、用你的 AWS 凭证发请求——全部直接作用于主机，没有缓冲，没有边界。

这不是理论风险。Agent 常规操作包括：删除它认为"安全"的文件、修改系统级配置、启动后台服务、暴露主机端口。如果你在跑 cron 无人值守，这些行为没有人看着。

行业的主流解法一直是"给权限就完事了"或者"每步都问"。两个都没法接受。前者危险，后者等于取消 Agent 的意义。

Docker 给出的答案是 Sandboxes。

---

## 为什么是 microVM，不是容器

容器是 Docker 的主营业务，为什么不用容器隔离？

因为容器**共享宿主机的内核**。这是一个根本性的约束——Linux namespace 隔离再完善，内核漏洞或 capability 配置错误可以一路提权到 root。容器的安全边界是内核，而内核是你无法控制的那一层。

Sandboxes 的方案是 microVM：每个 Agent 运行在独立的轻量虚拟机里，有自己的内核，有自己的文件系统，有自己的 Docker 引擎，hypervisor 是它和主机之间的隔离层。

Docker 自己有一句话很准确：*给 Agent 一个锁着的房间，和给 Agent 一个停在外面的拖车，是两回事*。房间共享你的管道和线路；拖车不共享。

这意味着：Agent 在沙箱里可以自由地 build 和 run Docker 容器，而这些操作作用在沙箱自己的 Docker 引擎上，不是宿主机的——这解决了长期困扰开发者的 Docker-in-Docker 问题，而且不需要任何 hacky 挂载。

---

## 解决了什么问题

**1. 无人值守 Agent 第一次真正安全**

cron 跑 Claude Code 或 Codex 任务，过夜跑、周末跑、没有人在旁边看——在此之前这是冒险行为。Sandboxes 把最坏情况控制在沙箱内：删就删了，重置重来，主机不受影响。

**2. Docker-in-Docker 问题被优雅解决**

Agent 需要在隔离环境里构建和运行容器，这以前要么挂载 host socket（等于把 host Docker 引擎的控制权交给 Agent），要么搞 Docker-in-Docker（脆弱且难管理）。Sandboxes 自带私有 Docker 引擎，天然解决这个问题。

**3. 工作区路径一致性**

项目目录以相同绝对路径挂载进沙箱。这意味着 error message 里的文件路径和主机上看到的完全一致，不需要额外映射。这是工程细节，但直接影响 Agent 的调试效率。

**4. 网络隔离可配置**

沙箱默认网络隔离，TCP/UDP/ICMP 原始流量被阻断，HTTP/HTTPS 流量走白名单代理。可以针对团队或组织统一配置网络策略，这是企业治理层面的需求。

---

## 时间点的巧合

这件事值得注意：

Anthropic 在 2026 年 8 月 14 日将「auto mode」设为新 Claude Code 会话的默认权限模式——也就是说，新会话下 Agent 默认不需要每步请求批准。

Docker 几乎同时发布 Sandboxes，并且明确说：在 Sandboxes 里可以安全地使用 `--dangerously-skip-permissions`（YOLO mode）。

这是两个独立的产品决策，但合在一起说的事情很清楚：**行业正在把「无人值守 Agent」从一个需要小心翼翼的风险管理问题，变成一个可以在工程层面控制的基础设施问题**。

---

## 限制：沙箱保了什么，没保什么

沙箱能保的：主机文件系统、网络、Docker 引擎、其他进程。

沙箱不能保的：

- **Prompt injection**：Agent 读取了有毒的网页内容，然后在沙箱里根据那些内容做了错误决策——这是沙箱无法防御的，因为那是 Agent 自己的推理过程，不是系统级操作
- **你主动挂载进去的内容**：默认模式会把你的项目目录以读写方式挂载进去，Agent 对那个目录的修改会直接生效——隔离保护的是你的主目录和其他项目，不是你故意共享出去的部分

这两个限制不是缺陷，是边界。沙箱解决的是基础设施层的隔离，不解决 Agent 决策层的可靠性。

---

## 我的判断

Docker Sandboxes 的价值不是技术突破——microVM 隔离早就有，firecracker 等项目也做了类似的事。它的价值是**把正确的隔离模型带到了 Agent 工具链的主流战场**。

当 Docker 官方把这件事做成产品，并让它支持所有主流 coding agent（Claude Code、Codex、Copilot CLI、Gemini CLI、Kiro、OpenCode……），它就不再是极客的个人方案，而是一个可分发的工程标准。

接下来看的是：Sandboxes 的治理能力（Docker AI Governance）能不能真的在企业场景里落地，以及 Linux 支持和 MCP Gateway 支持什么时候来。这两个补齐之后，「用 Agent 跑生产任务」的基础设施才算真正完整。

---

**参考**

- Docker Sandboxes：https://www.docker.com/blog/docker-sandboxes-run-claude-code-and-other-coding-agents-unsupervised-but-safely/
- 安装（macOS）：`brew trust docker/tap && brew install docker/tap/sbx`
- 安装（Windows）：`winget install Docker.sbx`
