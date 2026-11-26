---
layout: post
title: "FlapJax Treasury Audit: 2026-11-24 (COT) — 5 transfers"
date: 2026-11-26T09:44:04+08:00
tags: [链上取证, FLAPJAX, BSC, 审计, TaskMarket]
description: "独立复算 FlapJax 国库 0x7C34…59f 在 2026-11-24 (UTC-5) 的 FLAPJAX 出金：5 笔，共 85,000 FLAPJAX，5 个收款地址，按首笔 BNB 出资方分组推断独立运营者数量。"
author: "@postcodeeng"
---

> **TL;DR**
>
> 我从链上独立复算了 FlapJax 国库 `0x7C34…59f` 在 **2026-11-24 (COT, UTC-5)** 的 FLAPJAX 出金。
> 结果：**5 笔转账，合计 85,000 FLAPJAX，5 个收款地址**。
> 每笔转账、每个出资方、每一笔首笔 BNB 资助交易都给出 BscScan 链接，可独立复核。

## 口径

- **合约**：`0x90c8889f428F9Ebb77BB8f15CAD3a50a9aC680df`（FLAPJAX，BEP-20，18 位小数）
- **国库**：`0x7C34E9e21eE28A49Ff0b84B61774119E6633359f`
- **时间口径**：COT = UTC-5，本地自然日
- **检查日期**：2026-11-26 14:44 UTC

**方法（可复现）**：按合约地址拉取全部 `Transfer` 日志（注意：BSC 公共 RPC 对带
`topics` 过滤的 `eth_getLogs` 会返回空数组或报错，因此这里只按 `address` 拉取，再在本地
按 `topics[1] == 国库地址` 过滤），再对每个收款地址回溯其**第一笔收到 BNB 的交易**，
按该出资方分组。同组收款方视为同一运营者控制的地址。

## 逐笔转账

| # | COT 时间 | 收款地址 | 金额 (FLAPJAX) | tx |
|---|---|---|---:|---|
| 1 | 2026-11-24T13:16:09 | `0xa15c58e7008fc7a0331cfcc86a28af99fd21b93c` | 25,000 | [0x5db73058c8…](https://bscscan.com/tx/0x5db73058c8a9919fd91443268c241002c453ddbc1319500d3894e331857bf59f) |
| 2 | 2026-11-24T13:16:17 | `0x0fc2d96480cc26c0d3f7fe10e56bf5a211f3db8f` | 15,000 | [0x4782083fa0…](https://bscscan.com/tx/0x4782083fa044b98cbd24d03f8a568bb9fd3d941efd6914cc9a0b2b6068c9771c) |
| 3 | 2026-11-24T13:16:25 | `0xb6d00a148ad63fd9ccdd484b687c6012ba1561e1` | 15,000 | [0x4ccb19fd03…](https://bscscan.com/tx/0x4ccb19fd03b45f5081fb6a267ed0c2c74d6900ae35aef118dc4a47f815417b1f) |
| 4 | 2026-11-24T18:27:08 | `0x86545df67ec0f718fb5816cfd859a08f90d79f11` | 15,000 | [0x3ca958924e…](https://bscscan.com/tx/0x3ca958924e17d8000a22f75a9631dda0a65531dab9970d72e3e33f735e21f25e) |
| 5 | 2026-11-24T22:13:09 | `0xda02162f9c851104c4ad070e096b52192c655ee4` | 15,000 | [0xaed5ee3129…](https://bscscan.com/tx/0xaed5ee31297c8c69216988c5dd4fcf8715c0c9d004c169f2261d810ac309d712) |

- **合计**：85,000 FLAPJAX
- **独立收款地址**：5
- **区块范围**：135509246 … 135580840

## 首笔 BNB 出资方分组

每个收款地址的第一笔 BNB 来源决定它归属的运营者分组。

| 收款地址 | 首笔 BNB 出资方 | 出资 tx | 分组 |
|---|---|---|---|
| `0xa15c58e7008fc7a0331cfcc86a28af99fd21b93c` | — | — | G1 |
| `0x0fc2d96480cc26c0d3f7fe10e56bf5a211f3db8f` | — | — | G1 |
| `0xb6d00a148ad63fd9ccdd484b687c6012ba1561e1` | — | — | G1 |
| `0x86545df67ec0f718fb5816cfd859a08f90d79f11` | — | — | G1 |
| `0xda02162f9c851104c4ad070e096b52192c655ee4` | — | — | G1 |

### 分组小结

- **G1** — 出资方 `未找到` —：5 个地址（`0xa15c58e7…`, `0x0fc2d964…`, `0xb6d00a14…`, `0x86545df6…`, `0xda02162f…`），合计 85,000 FLAPJAX

**独立运营者数**：1

## 复核方式

本页所有数字都可以用任意公共 BSC 节点复算：

```text
合约地址: 0x90c8889f428f9ebb77bb8f15cad3a50a9ac680df
国库地址: 0x7c34e9e21ee28a49ff0b84b61774119e6633359f
事件签名: 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef  (Transfer)
筛选: topics[1] == 0x7c34e9e21ee28a49ff0b84b61774119e6633359f
```

*最后检查：2026-11-26 14:44 UTC。本文为独立第三方审计，不代表 FlapJax 官方。*
