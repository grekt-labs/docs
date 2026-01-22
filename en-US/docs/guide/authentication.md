# Authentication

Credentials for private repos and publishing. Loaded from environment variables first, then `~/.grekt/credentials.yaml`.

## GitHub

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

```bash
export GITLAB_TOKEN=glpat-xxxxxxxxxxxx
```

Or:

```yaml
gitlab.com:
  token: glpat-xxxxxxxxxxxx
```

### Self hosted GitLab

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

## Registry Publishing

For S3-compatible storage (R2, S3, MinIO):

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

## CI/CD

### GitHub Actions

```yaml
- name: Install artifacts
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: grekt install
```

### GitLab CI

```yaml
install:
  script:
    - grekt install
  variables:
    GITLAB_TOKEN: $CI_JOB_TOKEN
```
