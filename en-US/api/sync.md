---
description: "Sync installed artifacts to configured AI tools, with dry-run and target override support."
---

# grekt sync

Sync artifacts to AI tools.

```bash
grekt sync
```

## Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Preview without applying |
| `-f, --force` | Skip confirmation |
| `-t, --target <targets>` | Override targets (comma-separated) |
| `--from <directory>` | Sync from a local directory (no project setup needed) |
| `--name <id>` | Artifact identifier (required with `--from`) |

## Examples

```bash
grekt sync --dry-run      # Preview
grekt sync                # Apply
grekt sync -f             # No confirmation
grekt sync -t claude      # Specific target
```

## Local directory sync

Sync artifacts from a local directory without needing `grekt init`, `grekt.yaml`, or a lockfile. Useful for distributing AI skills alongside npm packages or any local source.

```bash
grekt sync --from ./skills --name my-tool --target claude
```

### Requirements

- `--from`: Path to a directory containing `.md` files with valid frontmatter
- `--name`: A unique identifier to namespace synced files (prevents collisions)
- `--target`: Required (no `grekt.yaml` to read targets from)

### Frontmatter format

Files must include `grk-type`, plus `name` and `description`:

```markdown
---
grk-type: skills
name: review
description: Code review skill
---
Your skill content here.
```

### Usage examples

```bash
# Dry run first
grekt sync --from ./skills --name my-tool --target claude --dry-run

# Multiple targets
grekt sync --from ./skills --name my-tool --target claude,cursor,copilot

# From an npm package
npx @grekt/cli sync --from ./node_modules/my-tool/skills --name my-tool --target claude
```

## Targets

See [Targets](/en-US/docs/guide/targets) for the full list of supported targets and their folder structures.

## Non destructive

- Preserves content outside managed sections
- Marks managed sections with `<grekt-untrusted-context>` blocks
- Never deletes manually created files

## Dry run output

```
Preview sync to claude:

  CREATE  .claude/agents/code-reviewer.md
  UPDATE  .claude/CLAUDE.md

No changes made (dry-run)
```

## Sync modes

Only **CORE** and **CORE-SYM** mode artifacts are synced to target directories. **LAZY** mode artifacts (default) are only indexed in `.grekt/index`.

- **CORE**: Files are copied to target directories
- **CORE-SYM**: Files are symlinked as is to target directories (no duplication, no transforms applied)

```bash
# Add as CORE to sync files (copy)
grekt add @scope/my-artifact --core
grekt sync

# Add as CORE-SYM to sync files (symlink)
grekt add @scope/my-artifact --core-sym
grekt sync

# LAZY artifacts are skipped during sync
grekt add @scope/utils
grekt sync  # Shows: @scope/utils (lazy mode)
```

To promote an existing LAZY artifact to CORE:

```bash
grekt remove @scope/utils
grekt add @scope/utils --core
# Or with symlinks:
grekt add @scope/utils --core-sym
```

## Notes

- Run after `grekt add`
- Targets configured in `grekt.yaml`
- LAZY artifacts indexed but not copied
- `--from` mode skips project setup entirely
