---
layout: default
title: 归档
permalink: /archive/
---

<div class="archive">
  <h1>文章归档</h1>
  
  {% assign postsByYear = site.posts | group_by_exp: 'post', 'post.date | date: "%Y"' %}
  
  {% for year in postsByYear %}
  <section class="archive-year">
    <h2>{{ year.name }}年</h2>
    <ul class="post-list">
      {% for post in year.items %}
      <li>
        <span class="post-date">{{ post.date | date: "%m月%d日" }}</span>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        {% if post.tags %}
        <span class="post-tags">
          {% for tag in post.tags %}
          <span class="tag">#{{ tag }}</span>
          {% endfor %}
        </span>
        {% endif %}
      </li>
      {% endfor %}
    </ul>
  </section>
  {% endfor %}
</div>
