# Authentication

Credentials for registry operations and private repos.

::: info Project Required
All authentication commands require a grekt project. Run `grekt init` first.
:::

## Registry

For publishing, deprecating, and other registry operations.

### Interactive login

```bash
grekt login
```

Opens browser for GitHub OAuth authentication. Session is saved to `.grekt/config.yaml` in your project.

### CI/CD

For CI/CD, use email/password login:

```bash
grekt login --email user@example.com --password $PASSWORD
```

### Check status

```bash
grekt whoami
# Logged in as user@email.com

grekt logout
# ✓ Logged out
```

## Private sources & registries

For authentication with Git sources and self-hosted registries, see [Registry Authentication](/en-US/docs/guide/registries/authentication).

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
