---
description: "Interactively remove sync targets from the project config, with optional folder cleanup."
---

# grekt remove-target

Remove sync targets interactively.

```bash
grekt remove-target
```

## Behavior

Opens an interactive prompt showing currently configured targets. Select targets to remove from `grekt.yaml`.

After removing, prompts whether to delete the target folders (e.g., `.claude/`, `.cursorrules`).

## Folder cleanup

When prompted "Delete the folders created by these targets?":

- **Yes** - Deletes target directories and entry point files
- **No** - Only removes from config, keeps folders

### Full plugins

| Target | What gets deleted |
|--------|-------------------|
| `claude` | `.claude/` directory |
| `kiro` | `.kiro/` directory |
| `cursor` | `.cursorrules` file |
| `cline` | `.clinerules` file |
| `windsurf` | `.windsurf/` directory, `.windsurfrules` file |
| `copilot` | `.github/copilot-instructions.md` file |
| `aider` | `CONVENTIONS.md` file |
| `continue` | `.continue/` directory |
| `amazonq` | `.amazonq/` directory |
| `opencode` | `.opencode/` directory |
| `openclaw` | `skills/` directory, `AGENTS.md` file |
| custom | Target directory and entry point |

### agentskills.io targets and global

The targets `codex`, `gemini`, `jules`, `zed`, `goose`, `devin`, `roocode`, `kilocode`, `amp`, `warp`, and `global` all share the `.agents/` directory. The directory is only deleted when the last target using it is removed.

## Examples

```bash
grekt remove-target     # Interactive selection
```

## Notes

- Requires initialized project (`grekt init`)
- Updates `grekt.yaml` to remove selected targets
- Custom target configs are also removed from `grekt.yaml`
- Folder deletion is optional and defaults to "No"
- MCP configurations installed by removed targets are also cleaned up from tool config files
