# grekt remove

Remove an installed artifact and clean up synced files.

## Usage

```bash
grekt remove <artifact>
grekt rm <artifact>
```

## Description

Completely removes an artifact from the project, including:

1. Artifact files in `grekts/`
2. Entry in `installed.yaml`
3. Entry in `grekt.lock`
4. Synced files in `.claude/` (agents, skills, commands)

## Arguments

| Argument | Description |
|----------|-------------|
| `artifact` | Artifact ID (e.g., `@grekt/code-reviewer`) |

## Options

| Option | Description |
|--------|-------------|
| `-f, --force` | Skip confirmation prompt |

## Examples

### Remove with confirmation

```bash
grekt remove @grekt/code-reviewer
```

Output:
```
Will remove:

  @grekt/code-reviewer@1.0.0
    agent: agent.md
    skills: skills/review.md

Remove this artifact? (y/N)
```

### Force remove (no confirmation)

```bash
grekt remove @grekt/code-reviewer --force
```

### Using alias

```bash
grekt rm @grekt/code-reviewer
```

## What gets removed

### From `grekts/`

The entire artifact directory:
```
grekts/@grekt/code-reviewer/  ← Deleted
```

### From `.claude/`

All synced files for this artifact:
```
.claude/agents/@grekt-code-reviewer.md  ← Deleted
.claude/skills/grekt-code-reviewer_*.md ← Deleted
.claude/commands/grekt-code-reviewer_*.md ← Deleted
```

### From config files

- Entry removed from `grekts/installed.yaml`
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
