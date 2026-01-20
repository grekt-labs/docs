# grekt publish

Publish an artifact to a registry.

## Usage

```bash
grekt publish <path>
```

## Description

Creates a tarball from an artifact directory and uploads it to an S3-compatible registry (Cloudflare R2, AWS S3, MinIO, etc.).

## Arguments

| Argument | Description |
|----------|-------------|
| `path` | Path to artifact directory containing `grekt.yaml` |

## Options

| Option | Description |
|--------|-------------|
| `-r, --registry <name>` | Registry name from credentials file (default: "default") |
| `--local` | Only create tarball, don't upload |
| `-o, --output <path>` | Output path for tarball (with `--local`) |

## Examples

### Publish to default registry

```bash
grekt publish ./my-artifact
```

### Create tarball locally

```bash
grekt publish ./my-artifact --local
# Output: /tmp/@author-name.tar.gz
```

### Custom output path

```bash
grekt publish ./my-artifact --local -o ./dist/artifact.tar.gz
```

### Publish to named registry

```bash
grekt publish ./my-artifact -r company-registry
```

## Configuration

### Option 1: Environment variables

```bash
export GREKT_STORAGE_ENDPOINT="https://..."
export GREKT_STORAGE_ACCESS_KEY_ID="..."
export GREKT_STORAGE_SECRET_ACCESS_KEY="..."
export GREKT_STORAGE_BUCKET="my-bucket"
export GREKT_STORAGE_PUBLIC_URL="https://cdn.example.com"  # optional
```

### Option 2: Credentials file

Create `~/.grekt/credentials.yaml`:

```yaml
default:
  type: s3
  endpoint: https://abc123.r2.cloudflarestorage.com
  accessKeyId: your-access-key
  secretAccessKey: your-secret-key
  bucket: my-artifacts
  publicUrl: https://artifacts.example.com  # optional

company-registry:
  type: s3
  endpoint: https://s3.us-east-1.amazonaws.com
  accessKeyId: aws-access-key
  secretAccessKey: aws-secret-key
  bucket: company-artifacts
```

## Self-hosting

grekt supports any S3-compatible storage:

| Provider | Endpoint format |
|----------|-----------------|
| Cloudflare R2 | `https://<account>.r2.cloudflarestorage.com` |
| AWS S3 | `https://s3.<region>.amazonaws.com` |
| MinIO | `https://minio.example.com` |
| DigitalOcean Spaces | `https://<region>.digitaloceanspaces.com` |

### Self-hosted workflow

```bash
# 1. Set up credentials
cat > ~/.grekt/credentials.yaml << EOF
default:
  type: s3
  endpoint: https://minio.internal.com
  accessKeyId: admin
  secretAccessKey: password
  bucket: artifacts
  publicUrl: https://artifacts.internal.com
EOF

# 2. Publish artifacts
grekt publish ./my-artifact

# 3. Configure projects to use your registry
# In project's grekt.yaml:
registry: https://artifacts.internal.com/artifacts
```

## What happens

1. **Validates** artifact has `grekt.yaml` manifest
2. **Creates** tarball: `@author-name.tar.gz`
3. **Uploads** to `artifacts/@author/name.tar.gz` in bucket
4. **Returns** the install command

## Notes

- Artifacts are named from `grekt.yaml`: `@<author>/<name>`
- The tarball is uploaded to `artifacts/` prefix in the bucket
- Use `--local` for CI pipelines that handle upload separately
- Credentials file permissions are set to 0600 (owner-only)
