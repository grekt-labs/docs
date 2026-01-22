# grekt publish

Publish an artifact to an S3-compatible registry.

```bash
grekt publish <path>
```

## Options

| Option | Description |
|--------|-------------|
| `-r, --registry <name>` | Registry from credentials (default: "default") |
| `--local` | Only create tarball, don't upload |
| `-o, --output <path>` | Output path for tarball (with `--local`) |

## Examples

```bash
# Publish to default registry
grekt publish ./my-artifact

# Create tarball only
grekt publish ./my-artifact --local -o ./dist/artifact.tar.gz

# Publish to named registry
grekt publish ./my-artifact -r company
```

## Behavior

When publishing:

1. **Version check**: Verifies the version doesn't already exist in the registry
2. **Upload**: Uploads tarball to `artifacts/@author/name/version.tar.gz`
3. **Metadata**: Creates/updates `metadata.json` with latest version info

If the version already exists, publish will fail:

```bash
✗ Version 1.0.0 already exists for @author/name
ℹ Bump the version in grekt.yaml and try again
```

## Configuration

See [Authentication](/en-US/docs/guide/authentication#registry-publishing).

Environment variables:

```bash
export GREKT_STORAGE_ENDPOINT="https://xxx.r2.cloudflarestorage.com"
export GREKT_STORAGE_ACCESS_KEY_ID="..."
export GREKT_STORAGE_SECRET_ACCESS_KEY="..."
export GREKT_STORAGE_BUCKET="my-bucket"
```

Or `~/.grekt/credentials.yaml`:

```yaml
default:
  type: s3
  endpoint: https://xxx.r2.cloudflarestorage.com
  accessKeyId: your-key
  secretAccessKey: your-secret
  bucket: my-artifacts
```

## Supported Storage

| Provider | Endpoint |
|----------|----------|
| Cloudflare R2 | `https://<account>.r2.cloudflarestorage.com` |
| AWS S3 | `https://s3.<region>.amazonaws.com` |
| MinIO | `https://minio.example.com` |

## Registry Structure

```
artifacts/
  @author/name/
    metadata.json     # Version info and deprecations
    1.0.0.tar.gz
    1.0.1.tar.gz
    2.0.0.tar.gz
```

## Related Commands

- [grekt deprecate](/en-US/api/deprecate) — Mark a version as deprecated
- [grekt versions](/en-US/api/versions) — List available versions
- [grekt info](/en-US/api/info) — Show artifact metadata
