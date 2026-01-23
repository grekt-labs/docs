# grekt versions

List all available versions of an artifact.

```bash
grekt versions <artifact>
```

::: info S3 Registry Only
This command only works with S3-compatible registries (Cloudflare R2, AWS S3, MinIO).
For GitHub/GitLab sources, check the repository tags/releases directly.
:::

## Options

| Option | Description |
|--------|-------------|
| `-r, --registry <name>` | Registry from credentials (default: "default") |

## Examples

```bash
# List versions
grekt versions @author/agent

# From specific registry
grekt versions @author/agent -r company
```

## Output

```bash
$ grekt versions @author/code-reviewer

@author/code-reviewer
  latest: 2.1.0

  2.1.0 (latest)
  2.0.0
  1.1.0 ⚠ deprecated: "Use 2.x for new API support"
  1.0.0 ⚠ deprecated: "Security fix in 1.1.0"
```

## Installing specific versions

```bash
# Install latest
grekt add @author/agent

# Install specific version
grekt add @author/agent@1.0.0
```

## Related commands

- [grekt info](/en-US/api/info) — Show artifact summary
- [grekt deprecate](/en-US/api/deprecate) — Mark a version as deprecated
- [grekt add](/en-US/api/add) — Install an artifact
