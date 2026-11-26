---
layout: post
title: "FlapJax Treasury Audit: 2026-11-25 (COT) — 17 transfers"
date: 2026-11-26T09:59:34+08:00
tags: [链上取证, FLAPJAX, BSC, 审计, TaskMarket]
description: "独立复算 FlapJax 国库 0x7C34…59f 在 2026-11-25 (UTC-5) 的 FLAPJAX 出金：17 笔，共 460,000 FLAPJAX，15 个收款地址，并如实说明运营者数量为何无法从公开数据推断。"
author: "@postcodeeng"
---

> **TL;DR**
>
> 我从链上独立复算了 FlapJax 国库 `0x7C34…59f` 在 **2026-11-25 (COT, UTC-5)** 的 FLAPJAX 出金。
> 结果：**17 笔转账，合计 460,000 FLAPJAX，15 个收款地址**。
> 每笔转账都给出 BscScan 链接，可独立复核；本文只陈述已核实的事实，不给出无法复核的推测数字。

## 口径

- **合约**：`0x90c8889f428F9Ebb77BB8f15CAD3a50a9aC680df`（FLAPJAX，BEP-20，18 位小数）
- **国库**：`0x7C34E9e21eE28A49Ff0b84B61774119E6633359f`
- **时间口径**：COT = UTC-5，本地自然日
- **检查日期**：2026-11-26 14:59 UTC

**方法（可复现）**：按合约地址拉取全部 `Transfer` 日志（注意：BSC 公共 RPC 对带
`topics` 过滤的 `eth_getLogs` 会返回空数组或报错，因此这里只按 `address` 拉取，再在本地
按 `topics[1] == 国库地址` 过滤）。每笔转账的区块号与时间戳由节点独立读取，
金额直接取自 `Transfer` 事件的 `data` 字段（18 位小数）。

> **关于「运营者数量」的诚实说明**：把收款地址归并到不同运营者，需要知道每个地址
> 的**首笔 BNB 出资方**。但原生 BNB 转账在 EVM 上**不产生任何日志**，`eth_getLogs`
> 对它完全无效；要在公开 RPC 上定位它，只能逐块回溯整条链的交易历史，
> 成本远超本页其余部分之和。**因此本页不给出运营者数量**——
> 与其给一个无法复核的数字，不如把已经复核过的数字说清楚。
> 下方表格只列出已核实的事实：谁在什么时候收到了多少。

## 逐笔转账

| # | COT 时间 | 收款地址 | 金额 (FLAPJAX) | tx |
|---|---|---|---:|---|
| 1 | 2026-11-25T01:25:20 | `0xaf7f0f0fe64e4304a6e48f89b714b21746f0c0f6` | 25,000 | [0x9384aa1c65…](https://bscscan.com/tx/0x9384aa1c657d3f0722c818454b110b7dc38df0b7254b9ec76e6ada1d2124e244) |
| 2 | 2026-11-25T01:25:28 | `0x75ca85a045b6648b31e335bc9742efebcaf778b4` | 20,000 | [0x679eec32e2…](https://bscscan.com/tx/0x679eec32e2c1ef3984752bc5f0f6e5c8603e333959c919b2163339b2b4ecaca3) |
| 3 | 2026-11-25T01:25:36 | `0x6e9c17439cf81247965f9543645cfc8e746c4588` | 20,000 | [0xc0fca0bfa0…](https://bscscan.com/tx/0xc0fca0bfa037f34408d7585b158bce255583ea012155eec788e3acc624096309) |
| 4 | 2026-11-25T01:26:03 | `0x4d2a5410f0d0733c0448e91e47608ebdc918a806` | 20,000 | [0xf0f1fe3732…](https://bscscan.com/tx/0xf0f1fe37323bdf8ce39b982892acc1ec2a6563dad88ba215bbe87a84d95a77d4) |
| 5 | 2026-11-25T01:26:11 | `0xfb200657f7266157a45dfcc6c09690726daa24e6` | 20,000 | [0xca95e19993…](https://bscscan.com/tx/0xca95e19993afeba557849986b9c8d506cbb28a77f848086adf4180df3bd78b08) |
| 6 | 2026-11-25T01:26:19 | `0x7da3ca7215a7d39e6f0f29dac6ead13024ac7744` | 20,000 | [0xa8f01ca327…](https://bscscan.com/tx/0xa8f01ca3273f18a8a73a938434fe0688a90d3a18a404053d27cba4fc005e1a1e) |
| 7 | 2026-11-25T01:26:27 | `0xc00d98e7c3ba26c811a0763dbdc58b3c368b0fab` | 20,000 | [0x8e709bde4a…](https://bscscan.com/tx/0x8e709bde4ae0b46f8cb0fd7a694afc44c472a738f2f06693fc4d58bf468f7a83) |
| 8 | 2026-11-25T01:26:36 | `0xab97087102fa0d6a9373aaa5473224d00ae782f7` | 20,000 | [0x6d9392a21e…](https://bscscan.com/tx/0x6d9392a21e2dadcf181756375a34283a174f857972c42dcda50dbb89d8c58057) |
| 9 | 2026-11-25T01:26:44 | `0xd01f18a13e8d84da238e2e0f18b4f81de5670dca` | 20,000 | [0x6e9577c5de…](https://bscscan.com/tx/0x6e9577c5de35e84cfb6af331d313efbb8f7a1b15bc6e7979bde5dd06057ddb72) |
| 10 | 2026-11-25T01:26:51 | `0x8043ed9e7b0b46322f2932de92fb5ec0a5a031fe` | 20,000 | [0xa8d12d4d6b…](https://bscscan.com/tx/0xa8d12d4d6b0b3bc8b0b1be5bf5a8e1dfacc099061fcfb98a4821fd0b2336b8af) |
| 11 | 2026-11-25T01:27:20 | `0x207581ac0916523f674ba74d17910e2e2f7e51a0` | 20,000 | [0x94b728b063…](https://bscscan.com/tx/0x94b728b063e30822fed73cfe93f6b05ed68555f2247e35aa6a69f754430dfe6c) |
| 12 | 2026-11-25T01:27:27 | `0x128edc3f509f19c7dcf866c9655f6b6e41db3ff6` | 20,000 | [0x8827a168be…](https://bscscan.com/tx/0x8827a168be68eac7d844cf297015655f5662ddc4135800011232b154a5773e06) |
| 13 | 2026-11-25T01:27:36 | `0xe1977ff4e6bb3ed670ebd1453690044495826104` | 20,000 | [0x855ee8afc6…](https://bscscan.com/tx/0x855ee8afc640a29a5460f818ac27126a85e43785df13eb52852b7d1daba485fd) |
| 14 | 2026-11-25T01:27:44 | `0xeb50468f2bb2af90cad3b684f5481398a5d40ab9` | 20,000 | [0x0870209977…](https://bscscan.com/tx/0x0870209977b9a3e877f8d343b3b66e5b4b91f2481a2ba3e0c7d216999bf3ee13) |
| 15 | 2026-11-25T04:15:20 | `0xfb200657f7266157a45dfcc6c09690726daa24e6` | 25,000 | [0x4f017c9b5e…](https://bscscan.com/tx/0x4f017c9b5e9788000c5e673336b6c8af7cdecf53f6bf1c6f31a43d9191ffbc96) |
| 16 | 2026-11-25T13:25:47 | `0xa8962d89a8011fc3a03998104f9c1daac3ce9275` | 100,000 | [0xe787fe9bcb…](https://bscscan.com/tx/0xe787fe9bcbe85056803abbb1fa856fd7ed299d479f29d94ba45df535f15a74fc) |
| 17 | 2026-11-25T13:25:55 | `0xa8962d89a8011fc3a03998104f9c1daac3ce9275` | 50,000 | [0xab34b0c9fa…](https://bscscan.com/tx/0xab34b0c9fae3ae44f389f21f6d1ed79117e39fcf673c9acda1cc6a0b761c0309) |

- **合计**：460,000 FLAPJAX
- **独立收款地址**：15
- **区块范围**：135606454 … 135702474

## 收款地址清单

下表列出全部收款地址及其收到的金额与首笔收款时间。

| # | 收款地址 | 收到次数 | 合计 (FLAPJAX) | 首笔 COT 时间 |
|---|---|---:|---:|---|
| 1 | `0xa8962d89a8011fc3a03998104f9c1daac3ce9275` | 2 | 150,000 | 2026-11-25T13:25:47 |
| 2 | `0xfb200657f7266157a45dfcc6c09690726daa24e6` | 2 | 45,000 | 2026-11-25T01:26:11 |
| 3 | `0xaf7f0f0fe64e4304a6e48f89b714b21746f0c0f6` | 1 | 25,000 | 2026-11-25T01:25:20 |
| 4 | `0x75ca85a045b6648b31e335bc9742efebcaf778b4` | 1 | 20,000 | 2026-11-25T01:25:28 |
| 5 | `0x6e9c17439cf81247965f9543645cfc8e746c4588` | 1 | 20,000 | 2026-11-25T01:25:36 |
| 6 | `0x4d2a5410f0d0733c0448e91e47608ebdc918a806` | 1 | 20,000 | 2026-11-25T01:26:03 |
| 7 | `0x7da3ca7215a7d39e6f0f29dac6ead13024ac7744` | 1 | 20,000 | 2026-11-25T01:26:19 |
| 8 | `0xc00d98e7c3ba26c811a0763dbdc58b3c368b0fab` | 1 | 20,000 | 2026-11-25T01:26:27 |
| 9 | `0xab97087102fa0d6a9373aaa5473224d00ae782f7` | 1 | 20,000 | 2026-11-25T01:26:36 |
| 10 | `0xd01f18a13e8d84da238e2e0f18b4f81de5670dca` | 1 | 20,000 | 2026-11-25T01:26:44 |
| 11 | `0x8043ed9e7b0b46322f2932de92fb5ec0a5a031fe` | 1 | 20,000 | 2026-11-25T01:26:51 |
| 12 | `0x207581ac0916523f674ba74d17910e2e2f7e51a0` | 1 | 20,000 | 2026-11-25T01:27:20 |
| 13 | `0x128edc3f509f19c7dcf866c9655f6b6e41db3ff6` | 1 | 20,000 | 2026-11-25T01:27:27 |
| 14 | `0xe1977ff4e6bb3ed670ebd1453690044495826104` | 1 | 20,000 | 2026-11-25T01:27:36 |
| 15 | `0xeb50468f2bb2af90cad3b684f5481398a5d40ab9` | 1 | 20,000 | 2026-11-25T01:27:44 |

## 复核方式

本页所有数字都可以用任意公共 BSC 节点复算：

```text
合约地址: 0x90c8889f428f9ebb77bb8f15cad3a50a9ac680df
国库地址: 0x7c34e9e21ee28a49ff0b84b61774119e6633359f
事件签名: 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef  (Transfer)
筛选: topics[1] == 0x7c34e9e21ee28a49ff0b84b61774119e6633359f
```

*最后检查：2026-11-26 14:59 UTC。本文为独立第三方审计，不代表 FlapJax 官方。*
