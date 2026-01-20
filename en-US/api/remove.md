# grekt remove

Remove an installed artifact and clean up synced files.

## Usage

```bash
grekt remove <artifact>
grekt rm <artifact>
```

## Description

Completely removes an artifact from the project, including:

1. Artifact files in `.grekt/artifacts/`
2. Entry in `grekt.yaml`
3. Entry in `grekt.lock`
4. Synced files in `.claude/` (agents, skills, commands)

## Arguments

| Argument | Description |
|----------|-------------|
| `artifact` | Artifact ID (e.g., `code-reviewer`) |

## Options

| Option | Description |
|--------|-------------|
| `-f, --force` | Skip confirmation prompt |

## Examples

### Remove with confirmation

```bash
grekt remove code-reviewer
```

Output:
```
Will remove:

  code-reviewer@1.0.0
    agent: agent.md
    skills: skills/review.md

Remove this artifact? (y/N)
```

### Force remove (no confirmation)

```bash
grekt remove code-reviewer --force
```

### Using alias

```bash
grekt rm code-reviewer
```

## What gets removed

### From `.grekt/artifacts/`

The entire artifact directory:
```
.grekt/artifacts/code-reviewer/  ← Deleted
```

### From `.claude/`

All synced files for this artifact:
```
.claude/agents/code-reviewer.md  ← Deleted
.claude/skills/code-reviewer_*.md ← Deleted
.claude/commands/code-reviewer_*.md ← Deleted
```

### From config files

- Entry removed from `grekt.yaml`
- Entry removed from `grekt.lock`

## Notes

- Prompts for confirmation unless `--force` is used
- Cleans up empty directories after removal
- Run `grekt sync` after to update `CLAUDE.md` listing
- Does not affect other sync targets (Cursor, etc.) - run `grekt sync` to update them

## Related commands

- `grekt add` - Install artifacts
- `grekt list` - Show installed artifacts
- `grekt check` - Verify artifact integrity
