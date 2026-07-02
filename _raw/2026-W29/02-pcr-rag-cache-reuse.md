---
paper_id: 02
title_en: "PCR: A Prefetch-Enhanced Cache Reuse System for Low-Latency RAG Serving"
title_cn: "PCR：预取增强 KV 缓存复用的低延迟 RAG 服务"
category: AI工程化 / RAG 服务
tier: B
collected: 2026-07-02
week: 2026-W29
---

## 源信息

- **作者 / 机构**：未在素材中给出（arXiv: 2603.23049）
- **发布时间**：2026-03
- **原文**：[arXiv:2603.23049](https://arxiv.org/abs/2603.23049)
- **代码**：未在素材中给出

## 核心技术亮点

- 针对 RAG 场景设计 PCR 系统：基于调度队列的 KV Cache 预取 + 前瞻 LRU 替换 + 层间重叠流水线隐藏 SSD→DRAM 加载延迟
- 相比现有 KV 缓存复用方案最高实现 2.47× TTFT 加速，显著降低高并发 RAG 服务首 token 延迟
- 给出缓存命中率与预取窗口大小的量化调优建议，可直接指导生产 RAG 服务参数配置

## 推荐受众

RAG 平台后端工程师优化大规模文档检索 + 生成服务的 P99 延迟。

## 初步分诊

- **适配性**：Tier B — 合稿 / 外延
- **契合点**：与 [[ai-cost-model]] 形成 RAG 服务的"成本 / 延迟"双维度补充
- **候选用法**：作为合稿 *"Agent 推理栈的成本账"* 的旁线锚点（与 JetSpec / Domino / LCA 配对）
- **写作前置任务**：
  1. "2.47× TTFT 加速" 缺 baseline 口径 —— 是相对 SGLang 默认还是 vLLM 默认？需复核
  2. "缓存命中率与预取窗口大小的量化调优建议" 是写作素材金矿，建议作为正文配图（命中率 vs 预取窗口热图）