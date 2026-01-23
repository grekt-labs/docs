# grekt info

Show information about an artifact in the registry.

```bash
grekt info <artifact>
```

::: info S3 Registry Only
This command only works with S3-compatible registries (Cloudflare R2, AWS S3, MinIO).
For GitHub/GitLab sources, check the repository directly.
:::

## Options

| Option | Description |
|--------|-------------|
| `-r, --registry <name>` | Registry from credentials (default: "default") |

## Examples

```bash
# Show artifact info
grekt info @author/agent

# From specific registry
grekt info @author/agent -r company
```

## Output

```bash
$ grekt info @author/code-reviewer

@author/code-reviewer

  Latest:     2.1.0
  Versions:   4 (2 deprecated)
  Created:    2024-11-15
  Updated:    2025-01-20
```

## Related commands

- [grekt versions](/en-US/api/versions) — List all versions with details
- [grekt add](/en-US/api/add) — Install an artifact
