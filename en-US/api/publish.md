# grekt publish

Publish an artifact to the registry.

```bash
grekt publish <path>
```

## Options

| Option | Description |
|--------|-------------|
| `--local` | Only create tarball, don't upload |
| `-o, --output <path>` | Output path for tarball (with `--local`) |
| `--s3` | Use S3-compatible storage (legacy mode) |

## Examples

```bash
# Publish to registry (requires login)
grekt login
grekt publish ./my-artifact

# Create tarball only
grekt publish ./my-artifact --local -o ./dist/artifact.tar.gz

# Legacy: publish to S3-compatible storage
grekt publish ./my-artifact --s3
```

## Authentication

Requires authentication via `grekt login`:

```bash
$ grekt publish ./artifact
✗ Not logged in
ℹ Run 'grekt login' first
```

## Behavior

1. Validates the manifest (`grekt.yaml`)
2. Creates a tarball
3. Checks version doesn't already exist
4. Uploads to registry

If the version already exists:

```bash
✗ Version 1.0.0 already exists for @author/name
ℹ Bump the version in grekt.yaml and try again
```

## S3 Legacy Mode

For backwards compatibility with S3-compatible storage:

```bash
grekt publish ./artifact --s3
```

Requires S3 credentials. See [Authentication](/en-US/docs/guide/authentication#s3-storage-legacy).

## Related Commands

- [grekt login](/en-US/api/login) — Log in to registry
- [grekt deprecate](/en-US/api/deprecate) — Mark a version as deprecated
- [grekt versions](/en-US/api/versions) — List available versions
