# grekt undeprecate

Remove deprecation from an artifact version.

```bash
grekt undeprecate <artifact@version>
```

::: info S3 Registry Only
This command only works with S3-compatible registries (Cloudflare R2, AWS S3, MinIO).
For GitHub/GitLab sources, use their native release management.
:::

## Options

| Option | Description |
|--------|-------------|
| `-r, --registry <name>` | Registry from credentials (default: "default") |

## Examples

```bash
# Remove deprecation
grekt undeprecate @author/agent@1.0.0

# On specific registry
grekt undeprecate @author/agent@1.0.0 -r company
```

## Use Cases

- Deprecation was added by mistake
- Issue was fixed in the same version (hotfix)
- Version is now considered safe again

## Related Commands

- [grekt deprecate](/en-US/api/deprecate) — Mark a version as deprecated
- [grekt versions](/en-US/api/versions) — List versions with deprecation status
