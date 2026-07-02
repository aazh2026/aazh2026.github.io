# SVG Hero Template

预优化的 2×2 矩阵 Hero SVG 模板。从这个文件复制再编辑，永远不会出现 svgo 检查失败。

## 用法

```bash
# 1. 复制模板
cp _templates/svg-hero-template.svg \
   assets/images/2026-MM-DD-post-slug-01-four-quadrants.svg

# 2. 编辑 4 个象限 + 标题 + desc + 轴标签
#    把所有 [方括号] 占位符替换为实际内容
#    （[底部] 这种是故意保留的占位标签，不是装饰）

# 3. （通常不需要再 optimize）
#    模板本身已经 svgo-clean，但编辑后如果新增了元素，
#    跑一次保险：node scripts/optimize-svgo.js <path>

# 4. 在 post 中嵌入
<object data="/assets/images/2026-MM-DD-post-slug-01-four-quadrants.svg"
        type="image/svg+xml"
        width="100%"
        aria-label="[一段话描述这张图给屏幕阅读器]"></object>
```

## 编辑清单（必填）

| 元素 | 占位符 | 说明 |
|------|--------|------|
| `<title>` | `[POST TITLE]：[2x2 axis summary]` | **必填**，a11y 必需 |
| `<desc>` | `2x2 matrix showing ...` | **必填**，a11y 必需 |
| 主标题 | `[POST TITLE — replace]` | 标题中文化 |
| 数据源 | `来源 · [year H1/H2 论文集 / 数据源]` | 副标题 |
| X 轴名 + 左右标签 | `[X 轴：维度名]` / `[左侧]` / `[右侧]` | |
| Y 轴名 + 上下标签 | `[Y 轴：维度名]` / `[顶部]` / `[底部]` | |
| 4 个象限名称 | `[范式 N 名称]` | |
| 4 个出处 | `[paper · venue]` | 用 arXiv ID 或会议 |
| 4 个机制行 | `[机制 1]` / `[机制 2]` | 每象限 2 行 |
| 4 个 Key Insight | `「[Key Insight 短句]」` | 短句，≤ 15 字 |
| footer | `[可选：轴含义说明]` | 可删除 |

## 颜色（不要改）

| 用途 | 值 | 说明 |
|------|-----|------|
| 背景 | `#FAF9F5` | ivory（博客主背景） |
| 卡片 | `#FFFFFF` | paper |
| 强调 | `#D97757` | clay（边框 + 关键标签） |
| 主文字 | `#141413` | slate |
| 次文字 | `#87867F` | subtext / 轴标签 |
| 边框 | `#D1CFC5` | border / divider |

## `<object>` 嵌入片段（SVG —— 不带 aria-label）

```html
<object data="/assets/images/2026-MM-DD-post-slug-NN-desc.svg"
        type="image/svg+xml"
        width="100%"></object>
```

**不要在 SVG `<object>` 上加 `aria-label`** —— html-validate 的 `aria-label-misuse` 规则会阻断（SVG 内部 `<title>`/`<desc>` 已提供 a11y）。

`check-aria-labels.js` 已更新：**SVG `<object>` 自动跳过**，不要求 aria-label。非 SVG `<object>`（jpg/png）才需要 aria-label + role="img"。

## 字体（不要改）

- 标题 / 正文：`ui-serif, Georgia, serif`
- 代码 / 标签 / 出处：`ui-monospace, monospace`

## 视口（可改但需注意）

默认 `viewBox="0 0 720 500"`。如要改：
- 保持 720 宽：易嵌入博客
- 高度按内容比例调整
- 嵌入片段 `width="100%"` 会自动响应

## 不要做

- ❌ 不要在浏览器中"格式化"后再保存（会引入空白、注释 → 破坏 svgo-optimum）
- ❌ 不要用 `<img>` 替代 `<object>`（失去响应式 + a11y）
- ❌ **不要在 SVG `<object>` 上加 `aria-label`**（html-validate 会阻断）
- ❌ 不要省略 SVG 内部的 `<title>` 和 `<desc>`（a11y 必需）
- ❌ 不要复制非模板 SVG 当 hero（自己写的没经过 svgo 优化）