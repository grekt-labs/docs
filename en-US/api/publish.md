# grekt publish

Publish an artifact to the registry.

```bash
grekt publish <path>
```

## Options

| Option | Description |
|--------|-------------|
| `-r, --registry <name>` | Registry from credentials (default: "default") |
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

For CI/CD, use `GREKT_TOKEN`:

```bash
export GREKT_TOKEN=grk_xxxxxxxxxxxx
grekt publish ./artifact
```

## Behavior

1. **Version check**: Verifies the version doesn't already exist
2. **Upload**: Uploads tarball to registry
3. **Metadata**: Updates registry metadata

If the version already exists:

```bash
✗ Version 1.0.0 already exists for @author/name
ℹ Bump the version in grekt.yaml and try again
```

## S3 Legacy Mode

For backwards compatibility with S3-compatible storage, use `--s3`:

```bash
grekt publish ./artifact --s3
```

Requires S3 credentials in environment or `~/.grekt/credentials.yaml`:

```bash
export GREKT_STORAGE_ENDPOINT="https://xxx.r2.cloudflarestorage.com"
export GREKT_STORAGE_ACCESS_KEY_ID="..."
export GREKT_STORAGE_SECRET_ACCESS_KEY="..."
export GREKT_STORAGE_BUCKET="my-bucket"
```

Or:

```yaml
default:
  type: s3
  endpoint: https://xxx.r2.cloudflarestorage.com
  accessKeyId: your-key
  secretAccessKey: your-secret
  bucket: my-artifacts
```

## Related Commands

- [grekt login](/en-US/api/login) — Log in to registry
- [grekt deprecate](/en-US/api/deprecate) — Mark a version as deprecated
- [grekt versions](/en-US/api/versions) — List available versions
