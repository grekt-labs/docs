# Sync modes

Artifacts can be installed in two modes that determine how they're synced to AI tools.

## Lazy mode (default)

Artifacts are indexed in `.grekt/index` but not copied to target directories. This is the default mode.

```bash
grekt add @scope/my-artifact
```

Benefits:
- Reduces context pollution
- Faster syncs
- AI tools can still discover artifacts via the index

## Core mode

Artifacts are copied to target directories (e.g., `.claude/agents/`) during sync. Use for frequently accessed artifacts.

```bash
grekt add @scope/my-artifact --core
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
grekt remove @scope/my-artifact
grekt add @scope/my-artifact --core
```

## The index file

Artifacts are indexed in `.grekt/index` for discovery. CORE artifacts are not present because they don't need to be discovered:

```
[agents]
@scope/reviewer:code,review
@scope/utils:utility,helpers

[skills]
@scope/testing:test,mocks
```

The index also includes a terminology block for AI tools that need term translation.
