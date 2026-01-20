# grekt sync

Sync installed artifacts to configured AI tools.

## Usage

```bash
grekt sync [options]
```

## Description

Copies artifacts from `grekts/` to the appropriate locations for each configured target (Claude, Cursor, etc.).

## Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Preview changes without applying |
| `-f, --force` | Skip confirmation prompts |
| `-t, --target <targets>` | Override configured targets (comma-separated) |

## Examples

### Preview changes

```bash
grekt sync --dry-run
```

### Sync to all configured targets

```bash
grekt sync
```

### Sync without confirmation

```bash
grekt sync --force
```

### Sync to specific target

```bash
grekt sync --target claude
```

### Sync to multiple targets

```bash
grekt sync --target claude,cursor
```

## Targets

### Claude

Creates organized directories in `.claude/`:

```
.claude/
├── agents/
│   └── agent-name.md
├── skills/
│   └── skill-name.md
├── commands/
│   └── command-name.md
└── CLAUDE.md
```

The `CLAUDE.md` file contains:
- grekt metadata block (managed automatically)
- User content (preserved on sync)

### Cursor

Updates the `.cursorrules` file with metadata pointing to installed artifacts.

## Non-destructive sync

grekt uses a non-destructive approach:

- **Preserves** user content outside managed sections
- **Marks** managed sections with special comments
- **Never** deletes files you created manually

### Managed sections

```markdown
<!-- grekt:start -->
This content is managed by grekt.
Do not edit manually.
<!-- grekt:end -->

Your custom content here is preserved.
```

## Dry-run output

The `--dry-run` flag shows what would happen:

```
Preview sync to claude:

  CREATE  .claude/agents/code-reviewer.md
  CREATE  .claude/skills/testing.md
  UPDATE  .claude/CLAUDE.md

No changes made (dry-run)
```

## Notes

- Run after `grekt add` to sync new packages
- Use `--dry-run` to preview before applying
- Configured targets are in `.grekt/config.yaml`
- Override with `--target` without changing config
