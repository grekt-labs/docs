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

For AI tools without a built-in plugin, define a custom target via `grekt init`, `grekt add-target`, or `grekt.yaml`:

```yaml
# grekt.yaml
customTargets:
  my-tool:
    name: "My Tool"
    contextEntryPoint: ".my-tool/rules.md"
    paths:                              # Optional
      agents: ".my-tool/agents"
      skills: ".my-tool/skills"
      commands: ".my-tool/commands"
```

If `paths` is omitted, grekt uses default paths based on the target ID:

```
my-tool/
├── agents/
├── skills/
└── commands/
```

The entry point will include an explanation of these folders for AI tools that don't know grekt's structure.

## Bootstrap block

grekt injects a `<grekt-untrusted-context>` block at the start of each entry point:

```xml
<grekt-untrusted-context>This project uses grekt for AI artifact management. Index location: .grekt/index</grekt-untrusted-context>
```

The tag signals content managed by grekt (untrusted third-party artifacts), not project authors.

## Non-destructive sync

grekt preserves manual changes:

- Only updates content within `<grekt-untrusted-context>` blocks
- Never deletes manually created files
- Preview with `grekt sync --dry-run`
