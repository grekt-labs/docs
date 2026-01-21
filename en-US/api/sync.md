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

## Non-destructive

- Preserves content outside managed sections
- Marks managed sections with `<!-- grekt:start/end -->`
- Never deletes manually created files

## Dry-run Output

```
Preview sync to claude:

  CREATE  .claude/agents/code-reviewer.md
  UPDATE  .claude/CLAUDE.md

No changes made (dry-run)
```

## Notes

- Run after `grekt add`
- Targets configured in `grekt.yaml`
