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

## Why lazy mode matters

Modern AI tools like Claude Code have built-in discovery mechanisms for skills and agents. But discovery alone doesn't solve context pollution.

If you install 50 artifacts directly into `.claude/skills/`, the tool still needs to index and potentially reference all of them. Even with smart discoverability, this adds noise to the AI's context window.

Lazy mode keeps artifacts **outside** the tool's directories until explicitly needed. The `.grekt/index` acts as a lightweight catalog — a few lines of text instead of full artifact content sitting in your tool's folders.

This gives you the best of both worlds:

- **Discoverability**: Artifacts remain findable via the index and keywords
- **Clean context**: Only CORE artifacts consume tool attention
- **On-demand loading**: Rare-use artifacts stay out of the way until you need them

Think of it as the difference between having 100 books on your desk vs. having a catalog card that tells you where to find them in the library.
