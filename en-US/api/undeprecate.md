# grekt undeprecate

Remove deprecation from an artifact version.

```bash
grekt undeprecate <artifact@version>
```

## Options

| Option | Description |
|--------|-------------|
| `--s3` | Use S3-compatible storage (legacy mode) |

## Examples

```bash
# Remove deprecation
grekt undeprecate @author/agent@1.0.0

# Legacy: on S3 registry
grekt undeprecate @author/agent@1.0.0 --s3
```

## Authentication

Requires authentication via `grekt login`:

```bash
$ grekt undeprecate @author/agent@1.0.0
✗ Not logged in
ℹ Run 'grekt login' first
```

## Use cases

- Deprecation was added by mistake
- Issue was fixed in the same version (hotfix)
- Version is now considered safe again

## Related commands

- [grekt deprecate](/en-US/api/deprecate) — Mark a version as deprecated
- [grekt versions](/en-US/api/versions) — List versions with deprecation status
- [grekt login](/en-US/api/login) — Log in to registry
