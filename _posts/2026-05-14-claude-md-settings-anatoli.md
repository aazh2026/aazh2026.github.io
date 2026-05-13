# The 21 CLAUDE.md Settings That Actually Matter

*From a tweet by @AnatoliKopadze · 3M views · 8.3K bookmarks*

---

A single `CLAUDE.md` file hit #1 on GitHub Trending with 82,000 stars and 7,800 forks. Most people using Claude have never heard of it. The ones who have do not know what to put in it.

That gap is costing people hours every single week.

Every time you open a new Claude session, it starts with zero memory. It does not know your name, your work, your preferences, or how you like things done. You spend the first few minutes re-explaining everything, or you do not, and Claude gives you something that does not fit how you actually work. `CLAUDE.md` fixes this permanently.

This is not a developer tool. Writers use it to lock in their voice so Claude never sounds like someone else. Marketers use it to define their audience so Claude stops writing generic copy. Researchers use it to set how they want information structured. Business owners use it to give Claude the full context of their company.

---

## How Claude Talks to You

### 1. Kill the filler

Claude's default is to open every response with "Great question!", "Of course!", "Certainly!", "Absolutely!" — phrases that add nothing and waste your time. One instruction eliminates it permanently.

> Never open responses with filler phrases like "Great question!", "Of course!", "Certainly!", "Absolutely!", "Sure!", or similar warmups. Start every response with the actual answer. No preamble, no acknowledgment of the question.

### 2. Show options before acting

Claude picks one approach and runs with it by default. You ask it to rewrite a paragraph and it changes the entire tone of the piece. Now you are correcting something you did not ask to change.

> Before any significant task, Claude shows you 2-3 ways it could approach the work. You choose the direction that fits. What follows is what you actually wanted.

### 3. Be honest when you do not know

Claude will give you a confident, detailed, completely wrong answer before it admits uncertainty. It fills gaps with plausible-sounding information that feels true but is not.

> If you are uncertain about any fact, statistic, date, quote, or piece of information, say so explicitly before including it. "I'm not certain about this" is always better than presenting a guess as a fact.

### 4. Match length to what is actually needed

Ask Claude a simple question and it writes four paragraphs. Ask it something complex and it gives you a skeleton that looks complete but is not.

> Simple questions get direct, short answers. Complex tasks get full, detailed responses. Never compress or summarize work that requires real depth. Never pad responses with restatements of the question.

---

## How Claude Behaves

### 5. Ask before making big changes

You ask Claude to fix one paragraph and it rewrites the entire document. You ask it to shorten something and it removes sections you needed.

> Before making any change that significantly alters content I have already created — rewriting sections, removing paragraphs, restructuring the flow, changing tone — stop completely. Describe exactly what you are about to change and why. Wait for my confirmation before proceeding. "I think this would be better" is not permission to change it.

### 6. Stay focused on what was asked

Ask Claude to fix one thing and it will "improve" five others while it is in there.

> Only change what I specifically asked you to change. Do not rewrite, rephrase, restructure, or "improve" anything I did not ask about. If something else looks worth addressing, mention it at the end of your response. Do not touch it unless I explicitly ask.

### 7. Always tell me what you changed

You finish a task and are left scanning the output trying to figure out what is different.

> After completing any editing or writing task, always end with a brief summary: what was changed, what was left untouched, what needs my attention.

### 8. Never act on my behalf without asking

As AI tools become more connected — to your email, calendar, social accounts — the risk of Claude taking an action you did not fully intend grows.

> Never send, post, publish, share, or schedule anything on my behalf without my explicit confirmation in the current message. "You mentioned wanting to do this" is not confirmation. I must say yes in the current message.

---

## Your Context

### 9. Tell Claude who you are

Claude does not know if you are an expert or a beginner, a founder or a freelancer.

> About me: Name, Role, Background, Strong in (topics you know well), Still learning (areas where you need more context). Adjust the depth of every response to match this background.

### 10. Give Claude your project context

Every session starts with Claude knowing nothing about what you are working on.

> What I am working on: Project description, Goal, Audience, Tone, What to avoid. Apply this context to every task.

### 11. Define your writing style

> My writing style: [specific words you use or avoid, sentence length preference, paragraph vs list preference, tone]

---

## Memory and Continuity

### 12. Use MEMORY.md for important decisions

> At the end of each session, summarize key decisions and context in MEMORY.md. At the start of each session, read MEMORY.md first.

### 13. End sessions with a summary

> End every session by summarizing: where we left off, what the next step is, any decisions made.

### 14. Track errors and failures

> After any approach that fails, record what was tried and why it did not work in ERRORS.md. Check this file before attempting similar approaches.

### 15. Lock in facts that never change

> The following facts about my work are always true and should inform all responses: [list of fixed constraints]

---

## Developer Settings (Level Up)

### 16. Only touch directly relevant files

> Only modify files that are directly related to the task. Do not refactor, reformat, or touch other files, even if you notice issues in them.

### 17. Confirm before destructive actions

> Before deleting files, removing code, or overwriting existing implementations, stop and wait for explicit confirmation.

### 18. Production deployments are hard stops

> Never make changes to production environments, databases, or live systems without explicit confirmation in the current message.

### 19. Lock technology choices

> Do not suggest or implement technologies, frameworks, or approaches not already in use in this project.

### 20. Report file changes

> After completing any task, list all files that were created or modified.

### 21. Karpathy's 4 rules (the most important)

From Andrej Karpathy's viral rules for LLM coding:

> - If uncertain about requirements or approach, ask
> - Default to the simplest solution
> - Do not modify code unrelated to the task
> - Flag anything you are uncertain about

These four rules, by themselves, raised coding accuracy from 65% to 94%.

---

*The gap between someone who has set up CLAUDE.md and someone who has not is the gap between starting every conversation with a stranger and starting with a colleague who already knows how you work.*