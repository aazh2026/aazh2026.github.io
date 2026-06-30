---
layout: default
title: 订阅
permalink: /subscribe/
---

<div class="subscribe-page">
  <h1>📡 订阅</h1>
  <p>获取关于 AI-Native 软件工程和 Agent OS 的最新内容</p>
  
  <div style="margin: 40px 0;">
    <a href="/feed.xml" class="btn-secondary" style="display: inline-block; padding: 12px 24px; font-size: 14px; background: var(--paper); border: 1.5px solid var(--g300); border-radius: 999px; color: var(--slate); text-decoration: none;">📎 RSS 订阅</a>
  </div>
  
  <div style="text-align: left; margin-top: 48px;">
    <h2 style="font-family: var(--serif); font-size: 20px; font-weight: 500; margin-bottom: 20px;">热门标签</h2>
    <div class="tag-cloud-page" style="justify-content: flex-start;">
      <a href="/tags/#{% include tag-anchor.html name='AI-Native软件工程' %}" class="tag">#AI-Native软件工程</a>
      <a href="/tags/#{% include tag-anchor.html name='AI-Native' %}" class="tag">#AI-Native</a>
      <a href="/tags/#{% include tag-anchor.html name='Agent' %}" class="tag">#Agent</a>
      <a href="/tags/#{% include tag-anchor.html name='Architecture' %}" class="tag">#Architecture</a>
      <a href="/tags/#{% include tag-anchor.html name='Multi-Agent' %}" class="tag">#Multi-Agent</a>
    </div>
  </div>
  
  <div style="text-align: left; margin-top: 48px; font-size: 14px; color: var(--g500);">
    <p>RSS: <a href="/feed.xml" style="color: var(--clay);">{{ site.url }}/feed.xml</a></p>
    <p>GitHub: <a href="{{ site.data.author.github }}" style="color: var(--clay);">{{ site.data.author.github | replace: 'https://', '' }}</a></p>
  </div>
</div>