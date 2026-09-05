# Harness Engineering 的原点：Mitchell Hashimoto 的定义

---

## 一句话定义

> Every time the agent makes a mistake, build a mechanism so it never repeats the class of error.

这是 2026 年 2 月 5 日，Mitchell Hashimoto（HashiCorp 联合创始人、Terraform 共同开发者）在他的博客上第一次喊出"Harness Engineering"这个词时的核心命题。

几天后，OpenAI 发布了那篇著名的百万行代码实验报告——3 个工程师、零手工代码、一个新想法的产品。社区开始用 Harness Engineering 这个词来描述他们实际在做什么。一个月内，这个词从一篇博客变成了 AI 工程领域的共识语言。

---

## 核心公式

**Agent = Model + Harness**

就这么简单。Model 是 interchangeable 的——Claude、GPT、Gemini，哪个强换哪个，门槛不高。真正的工程发生在 Harness 里：约束、校验、记忆、安全边界、错误自愈。这是团队真正拥有和积累的东西。

Hashimoto 的原话是：模型是 commodity，可以互换。Harness 才是 product。

---

## 为什么这个词现在才出现

从 2022 到 2024 年，主流是 prompt engineering——优化措辞，改善单次输出。2025 年，Andrej Karpathy 公开说他自己的工作流已经翻转成"agent 驱动为主、手动编辑为辅"，context engineering 开始被广泛讨论。

但到 2026 年初，问题变了：模型能力够了，但在生产环境不够稳定。API 超时、context 耗尽、工具调用乱序、幻觉函数、任务失败却报成功——这些问题不会因为换一个模型消失。

Harness Engineering 填补的是这个缺口。它不是在做模型优化，也不是在做 prompt 优化，而是在**设计让错误在结构上变得不可能发生的环境**。

---

## 马的比喻

LinkedIn 上有人发过一个很准确的比喻：

- **马 = AI 模型**：力量强大，速度惊人，但它不知道该往哪走
- **Harness = 马具**：约束、护栏、反馈回路，把模型的力量变成真正的生产力
- **骑手 = 人类工程师**：提供方向，但不亲自奔跑

没有 harness 的 AI agent，就像一匹在旷野里狂奔的纯血赛马——速度快得惊人，看起来很震撼，但对你要完成的任务毫无帮助。

---

## Hashimoto 的 Discipline

每次 agent 犯错，不要 retry prompt，不要换模型。正确的回应是：

1. 把错误分类——是哪一类错误？
2. 分析为什么这个错误在当前环境里是可能的
3. 修改环境，让这类错误在结构上变得不可能
4. 加一条规则，或者加一个 linter，或者改一个权限设置

这很慢，不性感。但它是复合的。每一次修复都在降低未来同类错误的概率，系统可靠性随时间指数提升。

---

## 三个层次的落地差距

有人总结了三个层次的差距：

- **Prompt engineering**：能让你跑出一个 demo
- **Context engineering**：能让你跑出一个 prototype
- **Harness engineering**：才能让你走进 production

Demo 到 production 的距离，就是 harness 厚度的距离。

---

## OpenAI 的证明

OpenAI 那篇报告是最佳注脚：3 个人，5 个月，百万行代码，零手工编写。不是因为模型神奇，是因为周围的 harness 被无情地工程化了。

这也反过来证明了 Hashimoto 的核心论点：**模型是易耗品，harness 是资产**。模型会变，harness 可以跨模型复用。

---

**参考**

- [Mitchell Hashimoto — Harness Engineering (原文 404，参考 archived 版本及社区解读)](https://mitchellh.com/writing/harness-engineering)
- [Harness Engineering: The Key to Reliable AI Agents — LinkedIn/Hari Jaiswal](https://www.linkedin.com/posts/harijaiswal_aiagents-harnessengineering-aiengineering-activity-7459885293274390528-GCKE)
- [一文读懂 Harness Engineering — 今日头条](https://www.toutiao.com/article/7623600589453001256/)
