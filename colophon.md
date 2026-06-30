---
layout: page
permalink: /colophon/
title: "Colophon"
description: "关于本站设计、字体与构建过程"
---

<div class="note-page">
  <h1>Colophon</h1>
  <p class="updated">最后更新 2026-06-30</p>

  <p>这一页记录本站的设计选择、字体与构建过程。</p>

  <h2>🎨 设计</h2>
  <p>本站追求一种"工程师手稿"的质感：</p>
  <ul>
    <li><strong>配色</strong>：象牙白 <code>#FAF9F5</code> 作为底色，<code>#C46D4E</code> 陶土色作为强调色，参考旧纸张和工程笔记本的视觉</li>
    <li><strong>排版</strong>：衬线字体（ui-serif）作为标题，等宽字体（ui-monospace）作为 meta 与代码 — 强调"技术文档"而非"杂志"</li>
    <li><strong>节奏</strong>：1.55–1.7 行高，clamp 字号 38–62px 标题，避免大字号过冲</li>
  </ul>

  <h2>🔤 字体</h2>
  <ul>
    <li><strong>标题</strong>：<code>ui-serif, Georgia, "Times New Roman", Times, serif</code>（系统衬线优先）</li>
    <li><strong>正文</strong>：<code>system-ui, -apple-system, "Segoe UI", Roboto, ...</code>（系统字体，避免 FOUT）</li>
    <li><strong>代码</strong>：<code>ui-monospace, "SF Mono", Menlo, Monaco, Consolas</code></li>
  </ul>

  <h2>🏗️ 构建</h2>
  <ul>
    <li>静态站点生成：Jekyll 4.3.3</li>
    <li>主题：Minima 2.5（被深度覆盖）</li>
    <li>插件：feed / sitemap / seo-tag / redirect-from / last-modified-at / minifier / paginate</li>
    <li>资产管线：单文件 SCSS 编译为 <code>style.css</code>，无 JS 打包（直接内嵌或外链 CDN）</li>
    <li>CI：GitHub Actions（5 个 workflow）</li>
  </ul>

  <h2>♿ 可访问性</h2>
  <ul>
    <li>WCAG 2.1 AA 目标</li>
    <li>键盘导航：所有交互元素可达，<code>:focus-visible</code> 视觉提示</li>
    <li>读者工具：字号缩放、高对比度、减少动效（见左下角工具栏）</li>
    <li>520+ <code>&lt;object&gt;</code> 标签均有 aria-label（信息图描述）</li>
  </ul>

  <h2>📊 性能</h2>
  <ul>
    <li>首页 JS：&lt; 50KB（Mermaid 按需懒加载）</li>
    <li>CSS：单文件，gzip 后约 15KB</li>
    <li>PWA：Service Worker 离线缓存（首屏 + 静态资源）</li>
    <li>全站 OG 图自动生成（1200×630）</li>
  </ul>

  <h2>🙏 致谢</h2>
  <ul>
    <li><a href="https://jekyllrb.com/">Jekyll</a> — 简洁而强大的静态站点生成器</li>
    <li><a href="https://plausible.io/">Plausible</a> — 隐私友好的轻量分析</li>
    <li><a href="https://pages.github.com/">GitHub Pages</a> — 免费的静态托管</li>
    <li><a href="https://giscus.app/">Giscus</a> — 基于 GitHub Discussions 的评论系统</li>
  </ul>

  <h2>📜 许可</h2>
  <p>本站所有原创内容采用
    <a href="/LICENSE/">CC BY-NC-SA 4.0</a> 许可协议。
    代码片段采用 MIT 许可。
  </p>
</div>
