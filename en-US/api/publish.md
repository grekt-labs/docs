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

## Notes

- Artifact name from `grekt.yaml`: `@<author>/<name>`
- Uploaded to `artifacts/` prefix in bucket
- Use `--local` for CI pipelines
