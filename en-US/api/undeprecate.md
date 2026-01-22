# grekt undeprecate

Remove deprecation from an artifact version.

```bash
grekt undeprecate <artifact@version>
```

## Options

| Option | Description |
|--------|-------------|
| `-r, --registry <name>` | Registry from credentials (default: "default") |
| `--s3` | Use S3-compatible storage (legacy mode) |

## Examples

```bash
# Remove deprecation
grekt undeprecate @author/agent@1.0.0

# Legacy: on S3 registry
grekt undeprecate @author/agent@1.0.0 --s3 -r company
```

## Authentication

Requires authentication via `grekt login`:

```bash
$ grekt undeprecate @author/agent@1.0.0
✗ Not logged in
ℹ Run 'grekt login' first
```

## Use Cases

- Deprecation was added by mistake
- Issue was fixed in the same version (hotfix)
- Version is now considered safe again

## S3 Legacy Mode

For backwards compatibility with S3-compatible storage, use `--s3`:

```bash
grekt undeprecate @author/agent@1.0.0 --s3
```

Requires S3 credentials. See [grekt publish](/en-US/api/publish#s3-legacy-mode).

## Related Commands

- [grekt deprecate](/en-US/api/deprecate) — Mark a version as deprecated
- [grekt versions](/en-US/api/versions) — List versions with deprecation status
- [grekt login](/en-US/api/login) — Log in to registry
