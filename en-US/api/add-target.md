---
description: "Interactively add AI tool sync targets to the project configuration."
---

# grekt add-target

Add new sync targets interactively.

```bash
grekt add-target
```

## Behavior

Opens a searchable selector to add AI tools to sync with. Type to filter the list, use `Space` to select, and `Enter` to confirm. Already configured targets are shown as disabled.

To remove targets, use [`grekt remove-target`](./remove-target.md).

## Built-in targets

### Full plugins

| Target | Entry Point |
|--------|-------------|
| `claude` | `.claude/CLAUDE.md` |
| `kiro` | `.kiro/steering/grekt.md` |
| `cursor` | `.cursorrules` |
| `copilot` | `.github/copilot-instructions.md` |
| `opencode` | `.opencode/` |
| `openclaw` | `skills/` + `AGENTS.md` |
| `windsurf` | `.windsurfrules` |
| `cline` | `.clinerules` |
| `aider` | `CONVENTIONS.md` |
| `continue` | `.continue/` |
| `amazonq` | `.amazonq/` |

### agentskills.io targets

These sync to `.agents/` following the [agentskills.io](https://agentskills.io) standard:

| Target | Display Name |
|--------|-------------|
| `codex` | Codex |
| `gemini` | Gemini CLI |
| `jules` | Jules |
| `zed` | Zed |
| `goose` | Goose |
| `devin` | Devin |
| `roocode` | RooCode |
| `kilocode` | Kilo Code |
| `amp` | Amp |
| `warp` | Warp |

The `global` target is a fallback for tools not listed above. It uses the same `.agents/` sync - select it if your tool supports agentskills.io but isn't in the list.

## Searchable selector

The target selector supports type-to-filter for quick navigation:

- **Type** to search and filter the list
- **Up/Down** to navigate
- **Space** to toggle selection
- **Enter** to confirm

## Custom targets

Select "Other (custom)" to configure a custom target:

1. **Internal ID** - kebab-case identifier for grekt config
2. **Display name** - shown in CLI output
3. **Context entry point** - main file for the AI tool
4. **Paths** - optional custom paths per category

Custom targets are saved to `grekt.yaml`:

```yaml
customTargets:
  my-tool:
    name: "My Tool"
    contextEntryPoint: ".my-tool/rules.md"
    paths:
      agents: ".my-tool/agents"
      skills: ".my-tool/skills"
```

## Examples

```bash
grekt add-target        # Interactive selection
grekt sync              # Apply to selected targets
```

## Notes

- Requires initialized project (`grekt init`)
- Updates `grekt.yaml` with selected targets
- Run `grekt sync` after to apply changes
