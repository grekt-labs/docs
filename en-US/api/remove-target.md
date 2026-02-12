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

| Target | What gets deleted |
|--------|-------------------|
| `claude` | `.claude/` directory |
| `cursor` | `.cursorrules` file |
| `opencode` | `.opencode/` directory |
| custom | Target directory and entry point |

## Examples

```bash
grekt remove-target     # Interactive selection
```

## Notes

- Requires initialized project (`grekt init`)
- Updates `grekt.yaml` to remove selected targets
- Custom target configs are also removed from `grekt.yaml`
- Folder deletion is optional and defaults to "No"
