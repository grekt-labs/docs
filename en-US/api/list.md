# grekt list

List installed artifacts.

```bash
grekt list
grekt ls
```

## Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

## Example

```bash
grekt list
```

```
Installed artifacts:

  code-review@1.0.0  2.1 KB
    agent: agent.md
    skills: testing.md, debugging.md

  docs-helper@2.1.0  5.3 KB ⚠
    agent: agent.md
    skills: markdown.md

────────────────────────────────────────
  Total: 7.4 KB (~1,850 tokens)
```

The ⚠ indicates artifacts > 5 KB.
