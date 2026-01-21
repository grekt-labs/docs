# grekt remove

Remove an artifact.

```bash
grekt remove <artifact>
grekt rm <artifact>
```

## Options

| Option | Description |
|--------|-------------|
| `-f, --force` | Skip confirmation |

## Examples

```bash
grekt remove code-reviewer
grekt rm code-reviewer --force
```

## What gets removed

- `.grekt/artifacts/<artifact>/`
- `.claude/agents/<artifact>.md`
- `.claude/skills/<artifact>_*.md`
- Entry in `grekt.yaml` and `grekt.lock`

## Notes

- Run `grekt sync` after to update other targets
