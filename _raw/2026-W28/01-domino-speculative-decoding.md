---
paper_id: 01
title_en: "Domino: Decoupling Causal Modeling from Autoregressive Drafting in Speculative Decoding"
title_cn: "解耦因果建模与自回归起草的投机解码框架"
category: AI工程化 / 推理优化
tier: C
collected: 2026-07-02
week: 2026-W28
overlap_with: 2026-W27/01-domino-speculative-decoding.md
---

## 源信息

- **作者 / 机构**：上海交大 EPIC 实验室、华科、电子科大、复旦、华为
- **发布时间**：2026-05（arXiv: 2605.29707）
- **原文**：[arXiv:2605.29707](https://arxiv.org/pdf/2605.29707)
- **代码**：[jianuo-huang/Domino](https://github.com/jianuo-huang/Domino)

## 核心技术亮点

- 将投机解码拆分为并行低开销草稿生成 + 自回归式高接受长度验证，针对 Qwen3 系列适配
- **相比 EAGLE-3（高接受低并行）和 DFlash（低延迟低接受）**，在 7B~14B 模型上实测吞吐提升 1.5×~2.3×
- 提供完整 HuggingFace 适配与可复现 benchmark 脚本

## 推荐受众

LLM 推理加速工程师做投机解码落地或 vLLM / SGLang 自定义 draft model 时直接参考。

## 初步分诊

- **适配性**：Tier C — 跳过
- **W28 vs W27 差异**：本次补充了 EAGLE-3 / DFlash 的对照基线 + 1.5×~2.3× 吞吐数字，论据更完整但适配性结论不变
- **理由**：纯服务层加速细节，博客 [[ai-cost-model]] 已覆盖 cost 侧；架构性叙事弱于博客主线
- **若用**：仅作为"推理加速一周"快报的一个 bullet；不适合成稿