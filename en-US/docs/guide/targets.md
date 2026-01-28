# Targets

Targets are AI tools that grekt syncs artifacts to.

## Supported targets

grekt works with any AI coding assistant that reads markdown files: Claude, Cursor, Copilot, Codex, Antigravity, ClawdBot...

## How sync works

```bash
grekt sync
```

Sync copies **CORE** artifacts to target directories. **LAZY** artifacts remain indexed but not copied. See [Sync Modes](./sync-modes.md).

### Built-in plugins

Each plugin knows where to place components for its target tool.

**Claude** (example):

```
.claude/
├── agents/
├── skills/
├── commands/
└── CLAUDE.md
```

**Cursor** appends to `.cursorrules`. **OpenCode** uses `.opencode/`.

### Custom targets

Define your own output paths for any tool:

```yaml
customTargets:
  my-tool:
    name: "My Tool"
    rulesFile: ".my-tool-rules"
```

## Non-destructive sync

grekt preserves manual changes:

- Marks managed sections with comments
- Only updates grekt-managed content
- Preview with `grekt sync --dry-run`
