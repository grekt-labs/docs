# grekt list

List all installed artifacts.

## Usage

```bash
grekt list [options]
grekt ls [options]
```

## Description

Shows all artifacts installed in the current project with their versions and components.

## Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

## Aliases

- `grekt ls`

## Examples

### List artifacts

```bash
grekt list
```

Output:

```
Installed artifacts:

  @grekt/code-review@1.0.0  2.1 KB
    agent: agent.md
    skills: testing.md, debugging.md
    commands: review.md

  @myorg/docs-helper@2.1.0  5.3 KB ⚠
    agent: agent.md
    skills: markdown.md, api-docs.md
    commands: doc.md

────────────────────────────────────────
  Total: 7.4 KB (~1,850 tokens)
```

The ⚠ indicator shows artifacts larger than 5 KB.

### JSON output

```bash
grekt list --json
```

Output:

```json
{
  "artifacts": [
    {
      "name": "@grekt/code-review",
      "version": "1.0.0",
      "agent": "code-reviewer",
      "skills": ["testing", "debugging"],
      "commands": ["review"]
    },
    {
      "name": "@myorg/docs-helper",
      "version": "2.1.0",
      "agent": "docs-writer",
      "skills": ["markdown", "api-docs"],
      "commands": ["doc"]
    }
  ]
}
```

## Notes

- Reads from `grekts/installed.yaml`
- Shows components grouped by type
- Use `--json` for scripting and automation
