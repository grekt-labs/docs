# grekt add-target

Add or configure sync targets interactively.

```bash
grekt add-target
```

## Behavior

Opens an interactive prompt to select AI tools to sync with. Supports both built-in plugins and custom target configuration.

## Built-in targets

| Target | Entry Point |
|--------|-------------|
| `claude` | `.claude/CLAUDE.md` |
| `cursor` | `.cursorrules` |
| `opencode` | `.opencode/` |

## Custom targets

Select "Other (custom)" to configure a custom target:

1. **Internal ID** — kebab-case identifier for grekt config
2. **Display name** — shown in CLI output
3. **Context entry point** — main file for the AI tool
4. **Paths** — optional custom paths per category

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
