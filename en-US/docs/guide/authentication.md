# Authentication

Credentials for registry operations and private repos.

## Registry

For publishing, deprecating, and other registry operations.

### Interactive Login

```bash
grekt login
```

Opens browser for authentication. Token is saved to `~/.grekt/credentials.yaml`.

### CI/CD

Use `GREKT_TOKEN` environment variable:

```bash
export GREKT_TOKEN=grk_xxxxxxxxxxxx
grekt publish ./artifact
```

Or pass token directly:

```bash
grekt login --token $GREKT_TOKEN
```

### Check Status

```bash
grekt whoami
# Logged in as user@email.com

grekt logout
# ✓ Logged out
```

## GitHub

For private repositories with `github:user/repo` source.

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

Or in `~/.grekt/credentials.yaml`:

```yaml
github:
  token: ghp_xxxxxxxxxxxx
```

Required scopes: `repo`

## GitLab

For private repositories with `gitlab:user/repo` source.

```bash
export GITLAB_TOKEN=glpat-xxxxxxxxxxxx
```

Or:

```yaml
gitlab.com:
  token: glpat-xxxxxxxxxxxx
```

### Self-hosted GitLab

```bash
# Host-specific: GITLAB_TOKEN_{HOST}
export GITLAB_TOKEN_GITLAB_COMPANY_COM=glpat-xxxxxxxxxxxx
```

Or:

```yaml
gitlab.company.com:
  token: glpat-xxxxxxxxxxxx
```

Required scopes: `read_api`, `read_repository`

## S3 Storage (Legacy)

For self-hosted S3-compatible registries using `--s3` flag.

```bash
export GREKT_STORAGE_ENDPOINT=https://xxx.r2.cloudflarestorage.com
export GREKT_STORAGE_ACCESS_KEY_ID=your-key
export GREKT_STORAGE_SECRET_ACCESS_KEY=your-secret
export GREKT_STORAGE_BUCKET=your-bucket
```

Or:

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
    GREKT_TOKEN: ${{ secrets.GREKT_TOKEN }}
  run: grekt publish ./artifact

- name: Install from private repo
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: grekt install
```

### GitLab CI

```yaml
publish:
  script:
    - grekt publish ./artifact
  variables:
    GREKT_TOKEN: $GREKT_REGISTRY_TOKEN

install:
  script:
    - grekt install
  variables:
    GITLAB_TOKEN: $CI_JOB_TOKEN
```

## Priority

Token resolution order:

1. Environment variable (`GREKT_TOKEN`, `GITHUB_TOKEN`, `GITLAB_TOKEN`)
2. Credentials file (`~/.grekt/credentials.yaml`)
