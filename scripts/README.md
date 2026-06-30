# scripts/

博客维护脚本。两类：

## CI checks（npm script 入口，CI 也跑）

每个 check 都有 `check-*` 命名约定，对应的 fixer 用 `fix-*`。check 失败 → CI 红 → 阻断 merge。

| 脚本 | 检查什么 | 对应 fixer |
|---|---|---|
| `validate-frontmatter.py` | 204 post 的 YAML frontmatter 解析正确 | （手动） |
| `check-internal-links.js` | 内部链接全部 resolve（pre-build Node 脚本） | （手动） |
| `check-color-contrast.js` | 调色板的 7 组对比度达 WCAG AA | （手动） |
| `check-aria-labels.js` | 520 个 `<object>` 标签的 aria-label 不为占位 | `fix-aria-labels.js` |
| `check-code-fence-langs.js` | 204 post 无裸 ``` 代码围栏 | `fix-code-fence-langs.js` |
| `check-series.js` | 204 post 的 `series:` 值匹配规范 slug | `fix-series.js` |
| `check-svgo.js` | 546 SVG 文件已 svgo 优化 | `optimize-svgo.js` |

跑法：

```bash
npm run check-internal-links     # 单项
node scripts/check-internal-links.js   # 等价
```

## 一次性内容修复脚本

每次 sweep 沉淀的工具，专门处理某类内容 drift。**可重复运行**（幂等），失败时输出受影响文件清单。

| 脚本 | 何时用 | 用法 |
|---|---|---|
| `fix-published-on-drift.py` | `*Published on YYYY-MM-DD*` 与 frontmatter `date:` 不一致时 | `python3 scripts/fix-published-on-drift.py [--dry-run]` |
| `fix-last-updated-drift.py` | `*最后更新: YYYY-MM-DD*` 与 frontmatter `date:` 不一致时 | `python3 scripts/fix-last-updated-drift.py [--dry-run]` |
| `strip-series-footer.py` | 旧式 `*AI-Native软件工程系列 #NN*` footer 仍残留时 | `python3 scripts/strip-series-footer.py [--dry-run]` |
| `soften-orphan-claims.py` | 2025-* 文章中出现孤儿式弱归因短语时 | `python3 scripts/soften-orphan-claims.py [--dry-run]` |

这四个脚本都在 Sprint 1（footer drift sweep）的实战中沉淀，已写入 `_posts/` 里 100+ 文件。

## 不需要维护的脚本

| 脚本 | 来源 |
|---|---|
| `optimize-svgo.js` | 引用 svgo 库 |
| `generate-og-images.py` | Pillow 生成 OG 默认图 |
| `generate-favicons.py` | 类似 |
| `fix-*` 系列 | 与对应 `check-*` 配对的批量修复 |

## 给 sweep 编写者的指南

未来需要引入新的"内容类 drift"修复脚本时，遵循同样的命名和约定：

1. 命名为 `fix-<具体 drift 类型>.py`（动词优先）
2. 文件首段说明 drift 是什么、`--dry-run` 模式做什么
3. 输出受影响文件清单（成功/失败都列）
4. 写完之后，把"何时用"加到这个 README + WRITING-GUIDE.md
5. 如果该 drift 频繁出现，把 use case 作为新增规则写进 WRITING-GUIDE.md，避免下次出现
