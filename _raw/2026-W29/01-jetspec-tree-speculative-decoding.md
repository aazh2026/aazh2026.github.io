---
paper_id: 01
title_en: "JetSpec: Causal Parallel Tree Speculative Decoding for Accelerating LLM Inference"
title_cn: "JetSpec：因果并行树投机解码加速 LLM 推理"
category: AI工程化 / 投机解码
tier: C
collected: 2026-07-02
week: 2026-W29
---

## 源信息

- **作者 / 机构**：Hao AI Lab / StepFun（阶跃星辰）
- **发布时间**：2026-06（arXiv: 2606.18394）
- **原文**：[arXiv:2606.18394](https://arxiv.org/abs/2606.18394)
- **代码**：[hao-ai-lab/JetSpec](https://github.com/hao-ai-lab/JetSpec)

## 核心技术亮点

- 提出因果并行树草稿生成（JetSpec）；相比标准自回归解码，Qwen3-8B 上最高 9.64× 端到端加速，MATH-500 平均一次验证接受 10.76 tokens
- HumanEval / LiveCodeBench / MT-Bench 上分别达 7.12×、7.67×、4.58× 加速；**明确针对 Agent 高频短轮次调用场景**
- 纯算法层优化，不修改基座模型权重，兼容 vLLM / SGLang 类推理框架接入

## 推荐受众

LLM 推理服务 / 部署工程师优化线上 Agent 或 Chat 服务吞吐与延迟。

## 初步分诊

- **适配性**：Tier C — 跳过（与 W27 Domino / W28 Domino 属于同一类：服务层加速）
- **理由**：
  1. 投机解码变体已累积 W27 Domino + W28 Domino 两篇；连续三周出现但博客主线不深入 serving 层
  2. 9.64× 加速数字漂亮但脱离 Agent 场景的端到端 wall-time 难以直接复用
- **若用**：仅作为合稿 *"Agent 推理栈的成本账"* 的一个旁支脚注，与 Domino / PCR 一起做"三周加速回顾"短文