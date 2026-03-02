# GitHub博客部署指南

## 📁 项目位置

本地路径：`~/.openclaw/workspace/github-blog/`

## 🚀 部署步骤

### Step 1: 创建GitHub仓库

1. 访问 https://github.com/new
2. 仓库名：**`aaronzh.github.io`**（必须是 username.github.io）
3. 选择 Public（私有仓库Pages功能受限）
4. 不勾选 "Initialize with README"
5. 点击 Create repository

### Step 2: 推送代码到GitHub

```bash
cd ~/.openclaw/workspace/github-blog/

# 初始化git仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Jekyll blog setup"

# 添加远程仓库（替换为你的用户名）
git remote add origin https://github.com/aaronzh/aaronzh.github.io.git

# 推送到main分支
git branch -M main
git push -u origin main
```

### Step 3: 启用GitHub Pages

1. 进入仓库 Settings → Pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 "gh-pages" /root
4. 点击 Save

### Step 4: 等待部署

- 首次部署需要 5-10 分钟
- 访问 `https://aaronzh.github.io` 查看效果

## 📝 发布新文章

### 方法A：本地编辑后推送

```bash
# 1. 创建新文章
cp _posts/YYYY-MM-DD-template.md _posts/2024-03-15-new-article.md

# 2. 编辑文章内容
vim _posts/2024-03-15-new-article.md

# 3. 提交并推送
git add .
git commit -m "Add new article: 文章标题"
git push
```

### 方法B：通过Obsidian发布（推荐）

1. 在Obsidian `03-内容工厂/3-终稿确认区/` 完成文章
2. 复制到 `~/.openclaw/workspace/github-blog/_posts/`
3. 修改文件名格式为 `YYYY-MM-DD-title.md`
4. 在文章开头添加 YAML frontmatter
5. `git add . && git commit -m "xxx" && git push`

## 🎨 自定义配置

### 修改站点信息

编辑 `_config.yml`：
```yaml
title: "你的博客名"
description: "博客描述"
author: "你的名字"
github_username: 你的GitHub用户名
```

### 添加自定义域名

1. 在仓库根目录创建 `CNAME` 文件：
```
www.yourdomain.com
```

2. 在DNS提供商添加 CNAME 记录：
```
www  CNAME  aaronzh.github.io.
```

3. 在GitHub Pages设置中配置自定义域名

### 修改主题颜色

编辑 `assets/css/style.scss` 中的颜色变量

## 🔧 常见问题

### Q1: 部署后样式丢失？
- 检查 `_config.yml` 中的 `baseurl` 是否为空
- 确保 CSS 路径使用 `relative_url` 过滤器

### Q2: 文章没有显示？
- 检查文件名格式：`YYYY-MM-DD-title.md`
- 检查是否有 YAML frontmatter
- 确保文件在 `_posts/` 目录

### Q3: 如何添加图片？
```markdown
![图片描述](/assets/images/your-image.png)
```
图片放在 `assets/images/` 目录

### Q4: 本地预览报错？
```bash
# 确保安装了依赖
bundle install

# 如果ruby版本问题，使用 rbenv/rvm 切换版本
```

## 📊 博客统计

当前已包含：
- ✅ 10篇SRE系列文章（~54,000字）
- ✅ 响应式设计
- ✅ SEO优化
- ✅ RSS订阅
- ✅ 标签系统
- ✅ GitHub Actions自动部署

## 🔗 相关链接

- [Jekyll官方文档](https://jekyllrb.com/docs/)
- [GitHub Pages文档](https://docs.github.com/en/pages)
- [Markdown语法](https://www.markdownguide.org/)

---

**部署完成后访问：** https://aaronzh.github.io
