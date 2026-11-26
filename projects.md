---
layout: page
permalink: /projects/
title: 开源项目
description: Post-Code Engineering 的开源项目：把博客里的方法论变成可以直接用的工具
---

<div class="note-page">
  <h1>开源项目</h1>
  <p class="updated">最后更新 2026-11-25</p>

  <p>
    博客里写的东西，很多最终都变成了可运行的工具。
    这一页列出来，方便你直接拿去用。
  </p>

  <h2>🛡️ specgate</h2>

  <p>
    <strong>需求覆盖率：像测试覆盖率那样度量验收标准。</strong>
  </p>

  <p>
    测试覆盖率回答「这行代码跑过吗」，不回答「这个需求实现了吗」。
    这是一份 spec 里有 12 条验收标准、代码里有 10 个函数、覆盖率 92% 的仓库——
    这两个数字毫无关系。
  </p>

  <p>
    specgate 解析 spec 里的验收标准，在代码中分级查找证据
    （显式标记 / 测试名匹配 / 仅有实现），输出需求覆盖率，并能在 CI 里作为门禁。
  </p>

  <ul>
    <li><strong>确定性运行</strong>——不调 LLM，无 API key、无网络。同一份代码同一份 spec，每次结果一样。</li>
    <li><strong>零运行时依赖</strong>——安装即跑，Node.js 20+。</li>
    <li>输出 text / JSON / SARIF，可直接接 GitHub code scanning。</li>
    <li>GitHub Action 一行接入：<code>uses: aazh2026/specgate@v0.1.1</code></li>
    <li><code>specgate init</code> 一键生成 spec 骨架和 CI 门禁，自动探测你的技术栈。</li>
  </ul>

  <p>
    <a href="https://github.com/aazh2026/specgate">GitHub →</a> ·
    <a href="/requirement-coverage/">博客详解 →</a>
  </p>

  <h2>📊 vlab</h2>

  <p>
    <strong>回测数字最危险的地方：它看起来太像真的了。</strong>
  </p>

  <p>
    零依赖的资产配置回测实验室，重点不在画好看的净值曲线，
    而在<strong>审计回测的输入假设</strong>——那些不会让程序报错、
    却能把结论改掉的坑。
  </p>

  <ul>
    <li><strong>双窗口口径</strong>——"可投资现实"与"指数代理长窗口"强制分开陈述，不混用</li>
    <li><strong>未上市资产留现金</strong>——不提前入场，超额权重不归一化</li>
    <li><strong>防未来函数护栏</strong>——策略只能看到"截至当天"的数据，读 <code>mat[c][i+1]</code> 直接抛异常</li>
    <li><strong>有效性检验</strong>——样本内/样本外切分、参数网格（含 overfit gap 与先知基线）、滚动前推</li>
    <li><strong>零运行时依赖</strong>——纯 Python 标准库，零 CDN，单文件面板可离线打开</li>
    <li>77 个回归测试，每个历史缺陷一个具名用例钉死</li>
  </ul>

  <p>
    <a href="https://github.com/aazh2026/vlab">GitHub →</a> ·
    <a href="/backtest-validity/">博客详解 →</a> ·
    <a href="https://postcodeengineering.com/vlab/">在线面板 →</a>
  </p>

  <h2>为什么做这个</h2>

  <p>
    写代码的成本塌了之后，瓶颈从「写」转移到了「验证」。
    而验收标准是最先腐烂的东西——三个月前写的 spec，
    没人还记得 AC-7 到底指什么。
  </p>

  <p>
    我搜过 GitHub：从 spec / acceptance criteria 反向验证实现这个方向，
    头部项目只有 14 星。空白不是因为没价值，是因为大家还没意识到自己有这个盲区。
  </p>

  <h2>在用吗？</h2>

  <p>
    目前还是 0 star，所以这一页是我自己给自己的项目导流。
    如果你试过觉得有用，或者觉得方向不对但值得聊，都欢迎开 issue 或直接邮件。
  </p>
</div>
