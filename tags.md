---
layout: default
title: 标签
permalink: /tags/
---

<div class="tags-page">
  <h1>🏷️ 标签云</h1>
  
  {% assign sorted_tags = site.tags | sort %}
  
  <div class="tag-cloud-page">
    {% for tag in sorted_tags %}
    <a href="#{{ tag[0] | slugify }}" class="tag">#{{ tag[0] }}</a>
    {% endfor %}
  </div>
  
  <hr style="margin: 48px 0; border: none; border-top: 1.5px solid var(--g200);">
  
  {% for tag in sorted_tags %}
  <section id="{{ tag[0] | slugify }}" class="tag-section" style="margin-bottom: 40px;">
    <h2 style="font-family: var(--serif); font-size: 20px; font-weight: 500; margin-bottom: 16px; color: var(--clay);">#{{ tag[0] }}</h2>
    <ul class="archive-list">
      {% for post in tag[1] %}
      <li>
        <span class="date">{{ post.date | date: "%Y-%m-%d" }}</span>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      </li>
      {% endfor %}
    </ul>
  </section>
  {% endfor %}
</div>