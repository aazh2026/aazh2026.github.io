---
layout: page
permalink: /uses/
title: "Uses"
description: "本站使用的工具与软件栈"
---

<div class="note-page">
  <h1>Uses</h1>
  <p class="updated">最后更新 2026-06-30</p>

  <p>这一页列出本站和日常工作流的工具栈。灵感来自
  <a href="https://uses.tech" rel="noopener">uses.tech</a>。</p>

  <h2>🌐 网站</h2>
  <ul>
    <li><a href="https://jekyllrb.com/">Jekyll 4.3</a> + <a href="https://github.com/jekyll/minima">Minima</a> 主题（自深度定制）</li>
    <li>GitHub Pages 部署 + <a href="https://plausible.io/">Plausible</a> 隐私友好分析</li>
    <li>Service Worker 离线缓存（PWA）</li>
    <li>自动化：<a href="https://github.com/aazh2026/aazh2026.github.io/tree/main/.github/workflows">5 个 CI workflow</a>（deploy / validate-frontmatter / link-check / markdownlint / CodeQL）</li>
  </ul>

  <h2>✍️ 写作</h2>
  <ul>
    <li>Markdown + 自定义 frontmatter schema（<code>title, date, tags, description, author, series</code>）</li>
    <li>每篇 post 独立 1200×630 OG 图（<a href="https://github.com/aazh2026/aazh2026.github.io/blob/main/scripts/generate-og-images.py">PIL 生成</a>）</li>
    <li>500+ 张原创 SVG 信息图（<a href="https://github.com/aazh2026/aazh2026.github.io/tree/main/assets/images">assets/images/</a>）</li>
    <li>风格：<a href="/WRITING-GUIDE.md">写作规范</a>（TL;DR + 原创图 + 💡 Key Insight + CC BY-NC-SA）</li>
  </ul>

  <h2>🎨 设计</h2>
  <ul>
    <li>配色：ivory <code>#FAF9F5</code> / paper <code>#FFFFFF</code> / slate <code>#141413</code> / clay <code>#C46D4E</code></li>
    <li>字体：<code>ui-serif, Georgia</code>（标题） / <code>system-ui</code>（正文） / <code>ui-monospace, SF Mono</code>（代码）</li>
    <li>CSS：单文件 SCSS（<a href="https://github.com/aazh2026/aazh2026.github.io/blob/main/assets/css/style.scss">style.scss</a>，约 1500 行）</li>
  </ul>

  <h2>🛠️ 工具</h2>
  <ul>
    <li>代码：Claude Code + 手写</li>
    <li>编辑器：VS Code</li>
    <li>终端：zsh + starship</li>
  </ul>

  <h2>🤖 AI 协作</h2>
  <ul>
    <li>主要模型：Claude（Opus 4 / Sonnet 4）</li>
    <li>用于：内容结构、文档撰写、CI 脚本、SEO 优化</li>
  </ul>
</div>
