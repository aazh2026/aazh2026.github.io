---
layout: default
title: 标签
permalink: /tags/
---

<div class="tags-page">
  <h1>标签云</h1>
  
  {% assign all_tags = site.posts | map: 'tags' | join: ',' | split: ',' | uniq | sort %}
  
  <div class="tag-cloud">
    {% for tag in all_tags %}
      {% if tag != '' %}
      <a href="#{{ tag }}" class="tag-link">#{{ tag }}</a>
      {% endif %}
    {% endfor %}
  </div>
  
  <hr>
  
  {% for tag in all_tags %}
    {% if tag != '' %}
    <section id="{{ tag }}" class="tag-section">
      <h2>#{{ tag }}</h2>
      <ul class="post-list">
        {% for post in site.posts %}
          {% if post.tags contains tag %}
          <li>
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            <span class="post-date">{{ post.date | date: "%Y-%m-%d" }}</span>
          </li>
          {% endif %}
        {% endfor %}
      </ul>
    </section>
    {% endif %}
  {% endfor %}
</div>
