# The Three Rules for Running Codex for Days at a Time

*From a tweet by @ChrisHayduk · 165K views · 2.5K bookmarks*

---

Perceptive Codex users have noticed that the `/goal` command is now available — just start your prompt with `/goal`, and Codex loops continuously until it achieves your goal.

But using it effectively requires thinking about prompting differently than you may be used to.

---

## The Core Loop

Goal mode is a loop: the agent executes some actions, scores those actions, checks if the score satisfies the goal, and then continues or terminates.

The critical piece is step 3 — checking if the score satisfies the goal. **With a vague, qualitative goal, the loop's end state is underspecified.** How can the agent know when it has achieved "make my code better"? What state is "better enough"?

Two failure modes emerge with underspecified goals. In some cases, the model gives up early after working for only a few minutes. In other cases, the model never stops, making changes that flail about blindly.

---

## Rule 1: Specify a Clear, Quantitative Goal

A better goal than "make my code better" would be:

> "Reduce the runtime of the code contained in `specific_file` by 20% without causing any regressions in existing unit tests and integration tests."

The agent now has a clear, quantitative goal and clear constraints. The loop has a determinable end state.

**When the goal is qualitative, turn it into quantitative.** In one case, converting a NeurIPS paper to ICML format became: work through a 200-item checklist of formatting rules. Codex just needed to think "I am done when I have checked off 200/200." Even though each rule was vague in isolation, Codex could reason about when each rule was complete better than it could reason about "make this paper formatted correctly."

---

## Rule 2: Make the Feedback Loop Tight

In order for your agent to evaluate its actions against your goal, it needs a mechanism to test its changes. **The faster you can run this test, the faster the model gets feedback on its progress.**

The author runs protein structure model architecture searches. He used NanoFold — a small but well-sampled dataset — instead of the full training setup. This reduced scoring runtime from **days to minutes**.

Find any way to speed up this feedback loop without compromising the quality of the score. Use smaller model sizes. Use subsampled data. Use faster test harnesses. The constraint is not accuracy — it is iteration speed.

---

## Rule 3: Give the Agent Markdown Files to Think In

Codex can run continuously for days. Even with the compaction capabilities built into Codex, it is hard for the model to maintain a coherent thread over such a long timescale.

Rather than force the model to maintain all context in memory, expose markdown files for it to write to. The author uses three:

**PLAN.md** — captures the high-level plan the agent intends to follow. You can seed this with initial ideas.

**EXPERIMENTS.md** — where the agent tracks each experiment: title, brief description, result. This is the most important file. It lets both you and the agent review previous attempts and why they did or did not work.

**EXPERIMENT_NOTES.md** — the agent's scratchpad. Chronologically-ordered real-time thoughts as it executes. This file lets you audit the agent's thought process and nudge it back if it goes off track.

---

## The Whole Playbook

Set up a clear, measurable goal. Keep the feedback loop tight. Give the agent markdown files to think in.

With those three pieces in place, Codex will happily grind for hours — or even days — on your hardest problems.

The bottleneck is never the AI. It is whether you gave the loop a clear end state, a fast feedback mechanism, and a way to persist its thinking across sessions.