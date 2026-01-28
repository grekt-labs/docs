# Sync modes

Artifacts can be installed in two modes that determine how they're synced to AI tools.

## Lazy mode (default)

Artifacts are indexed in `.grekt/index` but not copied to target directories. This is the default mode.

```bash
grekt add @grekt/utils
```

Benefits:
- Reduces context pollution
- Faster syncs
- AI tools can still discover artifacts via the index

## Core mode

Artifacts are copied to target directories (e.g., `.claude/agents/`) during sync. Use for frequently accessed artifacts.

```bash
grekt add @grekt/code-reviewer --core
```

Benefits:
- Immediate availability in AI context
- No index lookup needed
- Best for critical agents and skills

## Choosing a mode

| Use LAZY when... | Use CORE when... |
|------------------|------------------|
| Artifact is rarely used | Artifact is used frequently |
| Reducing context size | Need immediate availability |
| Many artifacts installed | Few critical artifacts |

## Promoting LAZY to CORE

Remove and re-add the artifact with `--core`:

```bash
grekt remove @grekt/utils
grekt add @grekt/utils --core
grekt sync
```

## The index file

Lazy artifacts are indexed in `.grekt/index` for discovery:

```
[agents]
@grekt/utils:utility,helpers

[skills]
@grekt/utils:testing,mocks
```

CORE artifacts are not indexed they're already in the AI context.
