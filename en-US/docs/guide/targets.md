# Targets

Targets are AI tools that grekt syncs artifacts to.

## Supported targets

grekt uses a **plugin system** for sync targets. Each plugin knows:
- The entry point file path (e.g., `.cursorrules`, `CLAUDE.md`)
- How to generate bootstrap content
- Whether it needs folder structure or just rules injection

## Built-in plugins

| Plugin | Entry Point | Type |
|--------|-------------|------|
| `claude` | `.claude/CLAUDE.md` | Folder + Rules |
| `cursor` | `.cursorrules` | Rules only |
| `opencode` | `.opencode/` | Folder only |

**Claude** example structure:

```
.claude/
├── agents/
├── skills/
├── commands/
└── CLAUDE.md
```

## Planned plugins

Community contributions welcome. See [Creating plugins](./creating-plugins.md).

| Plugin | Entry Point | Status |
|--------|-------------|--------|
| `copilot` | `.github/copilot-instructions.md` | Planned |
| `gemini` | `GEMINI.md` | Planned |
| `windsurf` | `.windsurfrules` | Planned |
| `amazonq` | `.amazonq/rules/` | Planned |

## How sync works

```bash
grekt sync
```

Sync copies **CORE** artifacts to target directories. **LAZY** artifacts remain indexed but not copied. See [Sync modes](./sync-modes.md).

## Custom targets

For AI tools without a built-in plugin, define output paths via `grekt init` or `grekt.yaml`:

```yaml
# grekt.yaml
customTargets:
  my-tool:
    name: "My Tool"
    rulesFile: ".my-tool/rules.md"
```

## Bootstrap block

grekt injects a `<grekt-context>` block into each entry point:

```xml
<grekt-context>
<untrusted>
This project uses grekt. Index at .grekt/index
</untrusted>
</grekt-context>
```

The `<untrusted>` wrapper signals content managed by grekt, not project authors.

## Non-destructive sync

grekt preserves manual changes:

- Only updates content within `<grekt-context>` blocks
- Never deletes manually created files
- Preview with `grekt sync --dry-run`
