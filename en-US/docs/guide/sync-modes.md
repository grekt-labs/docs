---
description: "Compare grekt's three artifact sync modes - lazy, copy, and eager - and choose the right one for your workflow."
---

# Sync modes

Artifacts can be installed in three modes that determine how they're synced to AI tools.

## Lazy mode (default)

Artifacts are indexed in `.grekt/index` but not copied to target directories. This is the default mode.

```bash
grekt add @scope/my-artifact
```

::: info NOTE
In large or compacted sessions, AI tools may lose track of indexed artifacts as earlier context gets dropped. If a lazy artifact isn't being picked up, try being more specific in your request (e.g., "find me the skill that handles branch naming" instead of just "create a branch").
:::

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

## Core-sym mode

Artifacts are symlinked to target directories instead of copied. Works like core mode but avoids file duplication.

```bash
grekt add @scope/my-artifact --core-sym
```

Benefits:
- Same immediate availability as core mode
- No file duplication (symlinks point to `.grekt/artifacts/`)
- Target files always reflect the artifact source
- Saves disk space with many core artifacts

::: warning AS IS copy
`--core-sym` symlinks artifact folders directly, no transforms are applied to adapt the structure for the destination target. Use `--core-sym` only when the artifact already matches the expected directory layout of your target tool. If it doesn't, use `--core` instead, which copies and transforms artifacts to fit each target.
:::


## Choosing a mode

| Use LAZY when... | Use CORE when... | Use CORE-SYM when... |
|------------------|------------------|----------------------|
| Artifact is rarely used | Artifact is used frequently | Same as CORE, but want no duplication |
| Reducing context size | Need immediate availability | Disk space matters |
| Many artifacts installed | Few critical artifacts | Development environment |

## Promoting LAZY to CORE

Remove and re-add the artifact with `--core` or `--core-sym`:

```bash
grekt remove @scope/my-artifact
grekt add @scope/my-artifact --core

# Or with symlinks
grekt remove @scope/my-artifact
grekt add @scope/my-artifact --core-sym
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

## Why lazy mode matters

Modern AI tools like Claude Code have built-in discovery mechanisms for skills and agents. But discovery alone doesn't solve context pollution.

If you install 50 artifacts directly into `.claude/skills/`, the tool still needs to index and potentially reference all of them. Even with smart discoverability, this adds noise to the AI's context window.

Lazy mode keeps artifacts **outside** the tool's directories until explicitly needed. The `.grekt/index` acts as a lightweight catalog - a few lines of text instead of full artifact content sitting in your tool's folders.

This gives you the best of both worlds:

- **Discoverability**: Artifacts remain findable via the index and keywords
- **Clean context**: Only CORE/CORE-SYM artifacts consume tool attention
- **On-demand loading**: Rare-use artifacts stay out of the way until you need them

Think of it as the difference between having 100 books on your desk vs. having a catalog card that tells you where to find them in the library.
