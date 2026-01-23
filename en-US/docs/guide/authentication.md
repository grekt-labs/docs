# Authentication

Credentials for registry operations and private repos.

## Registry

For publishing, deprecating, and other registry operations.

### Interactive login

```bash
grekt login
```

Opens browser for authentication. Session is saved to `~/.grekt/session.yaml`.

### CI/CD

For CI/CD, use email/password login:

```bash
grekt login --email user@example.com --password $PASSWORD
```

Or use API keys (recommended):

1. Create an API key via the web dashboard
2. Pass the key in the `Authorization` header

API keys start with `grk_` prefix and can be scoped to specific namespaces.

### Check status

```bash
grekt whoami
# Logged in as user@email.com

grekt logout
# ✓ Logged out
```

## Private sources & registries

For authentication with Git sources and self-hosted registries, see [Registry Authentication](/en-US/docs/guide/registries/authentication).

## S3 Storage (Legacy)

For self-hosted S3-compatible registries using `--s3` flag.

```bash
export GREKT_STORAGE_ENDPOINT=https://xxx.r2.cloudflarestorage.com
export GREKT_STORAGE_ACCESS_KEY_ID=your-key
export GREKT_STORAGE_SECRET_ACCESS_KEY=your-secret
export GREKT_STORAGE_BUCKET=your-bucket
```

Or in `~/.grekt/credentials.yaml`:

```yaml
default:
  type: s3
  endpoint: https://xxx.r2.cloudflarestorage.com
  accessKeyId: your-key
  secretAccessKey: your-secret
  bucket: your-bucket
```

## CI/CD Examples

### GitHub Actions

```yaml
- name: Publish artifact
  env:
    GREKT_PASSWORD: ${{ secrets.GREKT_PASSWORD }}
  run: |
    grekt login --email ci@example.com --password $GREKT_PASSWORD
    grekt publish ./artifact

- name: Install from private repo
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: grekt install
```

### GitLab CI

```yaml
publish:
  script:
    - grekt login --email $CI_EMAIL --password $CI_PASSWORD
    - grekt publish ./artifact

install:
  script:
    - grekt install
  variables:
    GITLAB_TOKEN: $CI_JOB_TOKEN
```
