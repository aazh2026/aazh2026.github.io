---
layout: page
permalink: /about/
title: 关于
description: Post-Code Engineering 博客作者与方法论介绍
---

<div class="about-content">
  <section class="author-card-large">
    <div class="author-avatar-large">◈</div>
    <div>
      <h1>Post-Code Engineering</h1>
      <p class="lead">AI-Native 软件工程实验室 · 记录正在发生的变化</p>
    </div>
  </section>

  <section>
    <h2>关于本站</h2>
    <p>
      <strong>Post-Code Engineering</strong> 是一个关于 AI 时代软件工程的独立博客，
      关注从「写代码」到「设计意图」的范式转移。
    </p>
    <p>
      这里是 <a href="/aise-series/">AISE 系列</a>、<a href="/agent-os-series/">Agent OS 系列</a>
      和 <a href="/memory-engineering-series/">Memory Engineering 系列</a> 的发源地，
      共 200+ 篇文章、500+ 张原创 SVG 信息图。
    </p>
  </section>

  <section>
    <h2>关于作者</h2>
    <p>
      维护者：<strong>@postcodeeng</strong>
    </p>
    <p>
      职业：软件工程师 / 技术作者<br>
      关注：AI 编程范式、Multi-Agent 系统、Context Engineering、AI 治理
    </p>
    <ul>
      <li><a href="/archive/">文章归档</a></li>
      <li><a href="/feed.xml">RSS 订阅</a></li>
      <li><a href="https://github.com/aazh2026">GitHub</a></li>
    </ul>
  </section>

  <section>
    <h2>写作约定</h2>
    <p>每篇文章遵循 <a href="/WRITING-GUIDE.md">写作规范</a>：</p>
    <ul>
      <li>TL;DR 摘要</li>
      <li>原创 SVG 信息图（基于品牌色 #FAF9F5 / #D97757）</li>
      <li>Key Insight 段落（💡）</li>
      <li>CC BY-NC-SA 4.0 许可</li>
    </ul>
  </section>

  <section>
    <h2>技术栈</h2>
    <p>本站由以下工具驱动：</p>
    <ul>
      <li><a href="https://jekyllrb.com/">Jekyll 4.3</a> + Minima 主题</li>
      <li>5 套 <a href="https://github.com/aazh2026/aazh2026.github.io/tree/main/.github/workflows">CI workflow</a>（pages / deploy / validate-frontmatter / link-check / markdownlint）</li>
      <li>每篇 post 独立 1200×630 OG 图（<a href="https://github.com/aazh2026/aazh2026.github.io/blob/main/scripts/generate-og-images.py">PIL 生成</a>）</li>
      <li>Service Worker 离线缓存（<a href="/sw.js">sw.js</a>）</li>
      <li><a href="https://plausible.io/">Plausible</a> 隐私友好分析</li>
    </ul>
  </section>

  <section>
    <h2>许可</h2>
    <p>
      所有文章采用 <a href="/LICENSE/">CC BY-NC-SA 4.0</a> 许可协议。
      欢迎转载、修改、非商业使用，但请署名并以相同方式共享。
    </p>
  </section>
</div>

<style>
.author-card-large {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin: 1rem 0 2.5rem;
  padding: 1.5rem;
  background: var(--g100);
  border-radius: 12px;
}
.author-avatar-large {
  width: 80px;
  height: 80px;
  background: var(--clay);
  color: var(--paper);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  flex-shrink: 0;
}
.author-card-large h1 {
  font-family: var(--serif);
  font-size: 28px;
  font-weight: 500;
  margin: 0 0 6px;
  color: var(--slate);
}
.author-card-large .lead {
  color: var(--g500);
  font-size: 15px;
  margin: 0;
}
.about-content section {
  margin-bottom: 2.5rem;
}
.about-content h2 {
  font-family: var(--serif);
  font-size: 22px;
  font-weight: 500;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1.5px solid var(--g200);
}
.about-content p {
  line-height: 1.7;
  margin: 0 0 1rem;
  color: var(--slate);
}
.about-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.about-content li {
  padding: 6px 0;
  border-bottom: 1px solid var(--g200);
}
.about-content li:last-child { border-bottom: none; }
.about-content a {
  color: var(--clay);
  text-decoration: none;
}
.about-content a:hover { text-decoration: underline; }
[data-theme="dark"] .author-card-large {
  background: var(--g100);
}
</style>
