---
layout: default
title: 标签
permalink: /tags/
---

<div class="tags-page">
  <h1>🏷️ 标签云</h1>
  
  <!-- 收集所有标签 -->
  {% capture tags_string %}{% for post in site.posts %}{% for tag in post.tags %}{{ tag }},{% endfor %}{% endfor %}{% endcapture %}
  {% assign all_tags = tags_string | split: ',' | sort %}
  
  <div class="tag-cloud">
    {% assign previous_tag = '' %}
    {% for tag in all_tags %}
      {% if tag != '' %}
        {% unless tag == previous_tag %}
          <a href="#{{ tag }}" class="tag-link">#{{ tag }}</a>
        {% endunless %}
        {% assign previous_tag = tag %}
      {% endif %}
    {% endfor %}
  </div>
  
  <hr>
  
  <!-- 按标签显示文章 -->
  {% assign previous_tag = '' %}
  {% for tag in all_tags %}
    {% if tag != '' and tag != previous_tag %}
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
      {% assign previous_tag = tag %}
    {% endif %}
  {% endfor %}
</div>
