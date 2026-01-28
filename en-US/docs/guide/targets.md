# Targets

Targets are AI tools that grekt syncs artifacts to.

## Supported targets

grekt works with any AI coding assistant that reads markdown files. Built-in sync plugins:

| Target | Output | Description |
|--------|--------|-------------|
| `claude` | `.claude/` | Claude Code, Claude Desktop |
| `cursor` | `.cursorrules` | Cursor IDE |
| `opencode` | `.opencode/` | OpenCode CLI |

Use [custom targets](#custom-targets) for Windsurf, Cline, Copilot, or any other tool.

## How sync works

```bash
grekt sync
```

1. Reads artifacts from `grekt.lock`
2. Copies **CORE** mode artifacts to target directories
3. Skips **LAZY** mode artifacts (indexed only)
4. Updates target config files

### Claude

For CORE artifacts, creates directories based on component type:

```
.claude/
├── agents/           # type: agent
├── skills/           # type: skill
├── commands/         # type: command
└── CLAUDE.md         # Points to .grekt/index
```

LAZY artifacts are discoverable via `.grekt/index`.

### Cursor

Appends to `.cursorrules` with markers for managed sections.

### OpenCode

Similar to Claude, creates directories for CORE artifacts.

## Non destructive Sync

grekt preserves your manual changes:

- Marks managed sections with comments
- Only updates grekt-managed content
- Preview with `grekt sync --dry-run`

## Custom targets

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
