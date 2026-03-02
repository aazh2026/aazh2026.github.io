# Aaron的技术博客

基于 Jekyll + GitHub Pages 构建的个人博客。

## 特性

- ✨ 响应式设计，适配移动端
- 🎨 中文优化排版（Noto Serif SC字体）
- 🏷️ 标签系统
- 📱 SEO优化
- 📝 RSS订阅
- ⚡ GitHub Actions自动部署

## 本地预览

```bash
# 安装依赖
bundle install

# 启动本地服务器
bundle exec jekyll serve

# 访问 http://localhost:4000
```

## 写作 workflow

1. 在 `_drafts/` 目录创建草稿
2. 完成后移动到 `_posts/`，文件名格式：`YYYY-MM-DD-title.md`
3. 提交并 push 到 main 分支
4. GitHub Actions 自动构建并部署

## 文章模板

```markdown
---
title: 文章标题
date: 2024-03-02 12:00:00 +0800
tags: [SRE, 系统设计]
---

正文内容...
```

## 目录结构

```
.
├── _config.yml          # 站点配置
├── _posts/              # 博客文章
├── _drafts/             # 草稿
├── _layouts/            # 页面模板
├── _includes/           # 可复用组件
├── assets/              # 静态资源
│   ├── css/
│   ├── images/
│   └── js/
├── .github/workflows/   # CI/CD配置
└── README.md
```

## 自定义域名

1. 在仓库 Settings → Pages → Custom domain 设置域名
2. 在仓库根目录创建 `CNAME` 文件，内容为你的域名
3. 配置 DNS CNAME 记录指向 `yourusername.github.io`

## 技术栈

- [Jekyll](https://jekyllrb.com/) - 静态网站生成器
- [GitHub Pages](https://pages.github.com/) - 免费托管
- [GitHub Actions](https://github.com/features/actions) - 自动部署
- [SCSS](https://sass-lang.com/) - 样式预处理

## 许可

MIT License
