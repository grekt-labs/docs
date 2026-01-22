# Targets

Targets are AI tools that grekt syncs artifacts to.

## Supported Targets

| Target | Output | Description |
|--------|--------|-------------|
| `claude` | `.claude/` | Claude Code and Claude Desktop |
| `cursor` | `.cursorrules` | Cursor IDE |

## How Sync Works

```bash
grekt sync
```

1. Reads artifacts from `grekt.lock`
2. Transforms to target-specific format
3. Writes to target locations

### Claude

Creates organized directories:

```
.claude/
├── agents/
│   └── code-reviewer.md
├── skills/
│   └── testing.md
├── commands/
│   └── review.md
└── CLAUDE.md
```

### Cursor

Appends to `.cursorrules` with markers for managed sections.

## Non destructive Sync

grekt preserves your manual changes:

- Marks managed sections with comments
- Only updates grekt-managed content
- Preview with `grekt sync --dry-run`

## Custom Targets

Define custom targets in `grekt.yaml`:

```yaml
targets:
  - claude
  - my-custom
customTargets:
  my-custom:
    name: "My Tool"
    rulesFile: ".my-tool-rules"
```
