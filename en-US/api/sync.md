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

## Examples

```bash
grekt sync --dry-run      # Preview
grekt sync                # Apply
grekt sync -f             # No confirmation
grekt sync -t claude      # Specific target
```

## Targets

### Claude

```
.claude/
├── agents/
├── skills/
├── commands/
└── CLAUDE.md
```

### Cursor

Updates `.cursorrules` with grekt metadata.

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
- **CORE-SYM**: Files are symlinked to target directories (no duplication)

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
