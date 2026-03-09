---
layout: page
title: "AI-Native软件工程系列"
permalink: /aise-series/
---

# AI-Native软件工程系列

*探索AI如何重新定义软件工程的边界*

---

## 系列目录

{% assign sorted_articles = site.data.series.aise.articles | sort: 'id' %}

{% for article in sorted_articles %}
### {{ article.id }}. [{{ article.title }}]({{ article.url }})
> {{ article.description }}
{% endfor %}

---

## 关于作者

Sophi 是一位专注于AI-Native软件工程的独立研究者。

---

*最后更新: 2026-03-09*
