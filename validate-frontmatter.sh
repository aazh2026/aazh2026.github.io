#!/bin/bash
# 验证文章 frontmatter 格式

cd /Users/openclaw/.openclaw/workspace/blog-repo/_posts

ERRORS=0

for f in *.md; do
  # 检查 title 是否存在
  if ! grep -q "^title:" "$f"; then
    echo "❌ $f: 缺少 title"
    ERRORS=$((ERRORS+1))
    continue
  fi
  
  # 检查 layout: post 是否存在
  if ! grep -q "^layout: post" "$f"; then
    echo "❌ $f: 缺少 layout: post"
    ERRORS=$((ERRORS+1))
    continue
  fi
  
  # 检查 permalink 和 date 是否在同一行
  if grep -q "permalink:.*/date:" "$f"; then
    echo "❌ $f: permalink 和 date 在同一行"
    ERRORS=$((ERRORS+1))
  fi
  
  # 检查 permalink 和 tags 是否在同一行
  if grep -q "permalink:.*/tags:" "$f"; then
    echo "❌ $f: permalink 和 tags 在同一行"
    ERRORS=$((ERRORS+1))
  fi
  
  # 检查是否是 Daily Signal 文章（通过文件名）
  if echo "$f" | grep -qE "(reddit-digest|github-trending|financial-digest|ai-native-daily)"; then
    # Daily 文章应该有 permalink
    if ! grep -q "^permalink: /202[0-9]/[0-9]*/[0-9]*/" "$f"; then
      echo "⚠️  $f: Daily 文章应该有 permalink /YYYY/MM/DD/slug/"
      ERRORS=$((ERRORS+1))
    fi
  else
    # 非 Daily 文章不应该有 permalink（或只有全局格式）
    if grep -q "^permalink: /[a-z0-9-]*/$" "$f"; then
      echo "⚠️  $f: 非 Daily 文章建议不设置 permalink，使用全局配置"
    fi
  fi
  
  # 检查 title 是否用双引号
  if ! grep -q '^title: "' "$f"; then
    echo "⚠️  $f: title 建议使用双引号包裹"
  fi
done

if [ $ERRORS -eq 0 ]; then
  echo "✅ 所有文章格式检查通过"
else
  echo "❌ 发现 $ERRORS 个问题，请修复后再提交"
  exit 1
fi
