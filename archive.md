---
layout: default
title: 归档
permalink: /archive/
---

<div class="archive-page">
  <h1>文章归档</h1>
  
  {% assign postsByYear = site.posts | group_by_exp: 'post', 'post.date | date: "%Y"' %}
  
  {% for year in postsByYear %}
  <section class="archive-year">
    <h2>{{ year.name }}年</h2>
    <ul class="archive-list">
      {% for post in year.items %}
      <li>
        <span class="date">{{ post.date | date: "%m月%d日" }}</span>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      </li>
      {% endfor %}
    </ul>
  </section>
  {% endfor %}
</div>