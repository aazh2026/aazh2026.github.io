# SWE 基准的标签是个谎言：SNC 三轴画像的反直觉发现

基准名称从来不告诉你它测的是什么。

"SWE-bench" 里有 bug fix，有 feature implementation，有 refactor。你以为你知道这些词的含义——直到你看到两个都标着"bug fix"的基准在统计上处于完全不同的高维空间。

Radin Shayanfar、Ahmed E. Hassan 等人（Queen's University / Auburn）在 arXiv:2609.01271 里引入了 Spread–Novelty–Centrality（SNC）画像，用三个轴替代名义标签，对 5 个主流 SWE 基准 + 14922 条轨迹做了实证画像。

---

## 三个轴，各有各的意思

**Spread**：任务扩散程度。涉及多少文件、跨越多少目录、在多大范围内要求改动。Spread 高的任务不是在一个文件里修一个函数，而是横跨多个子系统改十几处。

**Novelty**：任务对模型来说有多陌生。gold solution 里出现了多少模型没见过的东西——新 API、新模式、新依赖。Novelty 高的任务对模型的"见过吗"要求严苛。

**Centrality**：任务的中心性。改动有多接近代码库核心逻辑，还是只在边缘打转。Centrality 高的任务改的是影响其他所有模块的关键节点。

三个轴放在一起，才能画出一个任务的真实形状。

---

## 核心发现：标签是误导

论文的第一条结论简单说就是：**名义标签（bug fix / feature / refactor）对任务需求几乎无预测力**。

五个基准，两两比较，每一对都在至少两个 SNC 轴上统计可分。这意味着"两个都叫 bug fix"的基准，实际测的是完全不同的能力组合。你拿一个基准上的 pass@1 去预测另一个基准上的表现，基本等于掷骰子。

为什么会这样？论文追溯到了数据构建流程的差异——众包平台 vs 内部工程师 vs GitHub commit 历史，各自造出来的"bug fix"数据集在 Spread 上差了三个标准差。

**第二条发现更有意思**：Agent 的行为揭示了 gold solution 看不到的东西。

当 problem statement 故意省略提示时，Agent 生产的解决方案规模超过 gold；当数据整理流程导致 gold 被人为膨胀时，Agent 生产的规模小于 gold。任务描述怎么写，Agent 就怎么响应——但 gold solution 不会告诉你这一点，因为它已经是被人类整理过的"正确答案"，不是真实执行路径。

---

## 成功信号：模型家族不同

任务需求（低 SNC）与成功的关系是一致的——低 SNC 区域，所有模型家族、所有规模，都集中了成功案例。

但成功的行为特征是模型特定的：

**Claude 的成功路径**：靠"对齐 gold scope"。Claude 的文件 parity share（与 gold 重叠的文件比例）从小规模的 0.17 提升到大规模的 0.54。它通过精确匹配而不是超出 gold 来赢得任务。

**Qwen 的成功路径**：靠"超过 gold scope"。Qwen 在每个规模上都倾向于超出 gold 范围编写更多代码。

**两家的共同失败信号**："编辑太少"。编辑量不足对两个家族都是失败的前兆，只是原因不同——Claude 可能没改够，Qwen 可能没找到正确的改动位置。

---

## 实践含义

对于基准建设者：报告应附 SNC 分布，而不只是 pass@1。一个 60% 的分数如果来自高 Spread/高 Novelty 任务，和来自低 SNC 任务的 60% 完全不是一回事。

对于模型选型：拿自家仓库的 SNC 画像与基准的 SNC 分布做距离计算，比看排行榜总分更有预测价值。如果你的仓库是高 Spread/高 Novelty 类型，SWE-bench 90 分不代表你的场景能跑通。

对于 Agent 开发者："编辑太少"是一个通用失败信号，值得在 harness 里加监控。

---

**参考**

- What Does an Agentic Software Engineering Benchmark Measure? — arXiv:2609.01271
