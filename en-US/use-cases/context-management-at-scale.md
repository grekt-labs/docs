---
description: "Manage large numbers of AI artifacts without context pollution. Use grekt sync modes to keep AI tools focused while maintaining discoverability."
---

# Context management at scale

Keep 20+ artifacts installed without overwhelming your AI tools. Lazy mode and the skill router give you scale without noise.

## The problem

Your team has been productive with grekt. You've published internal artifacts for code review, testing patterns, deployment procedures, database migrations, API design, and more. But now:

- Your AI tool loads 20+ agent files on every prompt
- The context window fills up with instructions for things you rarely use
- The tool loses focus because it's trying to follow too many rules at once
- Performance degrades as context grows

More artifacts should make your AI smarter, not slower. The problem isn't having too many artifacts, it's loading all of them all the time.

## The solution

### 1. Identify your core vs occasional artifacts

Some artifacts are needed on every interaction (project rules, coding standards). Others are used once a week (database migration agent, release checklist).

### 2. Set sync modes

Use `--core` for always-loaded artifacts. Everything else defaults to **lazy** mode, which stays indexed but out of context. Every `grekt add` auto-syncs:

```bash
# These load on every interaction (core mode)
grekt add @your-org/project-rules --core
grekt add @your-org/coding-standards --core

# These stay indexed but out of context until needed (lazy, the default)
grekt add @your-org/db-migration-agent
grekt add @your-org/release-checklist
grekt add @your-org/api-design-guide
```

Core artifacts are copied directly into your AI tool's context directories. Lazy artifacts appear only in `.grekt/index` for discoverability.

### 3. Use lazy artifacts on demand

When you need a lazy artifact, invoke it through the skill router:

```
/grekt db-migration-agent
```

The AI tool reads the index, finds the artifact, and loads it **on demand**. Once the task is done, it drops out of context.

## Result

With sync modes configured:

```
your-project/
├── grekt.yaml              # Committed - mode: core or lazy per artifact
├── grekt.lock              # Committed
├── .grekt/                 # Gitignored (downloaded artifacts, index)
├── .claude/                # Only core artifacts synced here
└── src/
```

Your AI tool's context stays clean with only 2 core artifacts loaded. The other 3 are one command away when you need them.

## Related

- [Sync modes](/en-US/docs/guide/sync-modes) - Core vs lazy mode details
- [Artifacts](/en-US/docs/guide/artifacts) - How artifacts are structured
- [grekt sync](/en-US/api/sync) - Sync command reference
