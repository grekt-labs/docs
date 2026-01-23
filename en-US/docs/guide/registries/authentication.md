# Registry Authentication

Configure authentication for private registries and Git sources.

## Token priority

For each registry type, grekt checks tokens in this order:

### Registry backends (`@scope/name`)

1. Scope-specific env var: `GREKT_TOKEN_SCOPE`
2. Config file token in `.grekt/config.yaml`
3. Generic env var: `GITLAB_TOKEN` or `GITHUB_TOKEN`

### Git sources (`github:` / `gitlab:`)

1. Platform env var: `GITHUB_TOKEN` / `GITLAB_TOKEN`
2. Alternative names: `GH_TOKEN` / `GL_TOKEN`
3. Host-specific (GitLab): `GITLAB_TOKEN_HOSTNAME`

## Environment variables

### Scope-Specific Tokens

For registry backends, use scope-specific tokens:

```bash
# @myteam → GREKT_TOKEN_MYTEAM
export GREKT_TOKEN_MYTEAM=glpat-xxxxxxxxxxxx

# @my-org → GREKT_TOKEN_MY_ORG
export GREKT_TOKEN_MY_ORG=glpat-xxxxxxxxxxxx

# @company → GREKT_TOKEN_COMPANY
export GREKT_TOKEN_COMPANY=glpat-xxxxxxxxxxxx
```

Naming convention: `@scope-name` → `GREKT_TOKEN_SCOPE_NAME` (uppercase, hyphens become underscores).

### Platform tokens

For Git sources:

```bash
# GitHub
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
export GH_TOKEN=ghp_xxxxxxxxxxxx  # Alternative

# GitLab
export GITLAB_TOKEN=glpat-xxxxxxxxxxxx
export GL_TOKEN=glpat-xxxxxxxxxxxx  # Alternative
```

### Host-Specific Tokens (GitLab)

For self-hosted GitLab instances as sources:

```bash
# gitlab.company.com → GITLAB_TOKEN_GITLAB_COMPANY_COM
export GITLAB_TOKEN_GITLAB_COMPANY_COM=glpat-xxxxxxxxxxxx
```

## Config file

Store tokens in `.grekt/config.yaml` (add to `.gitignore`):

```yaml
registries:
  "@myteam":
    type: gitlab
    project: myteam/artifacts
    token: glpat-xxxxxxxxxxxx
```

Environment variables always take precedence over config file tokens.

## Required permissions

### GitLab Tokens

| Operation | Required Scope |
|-----------|---------------|
| Download | `read_api` |
| Publish | `write_repository` |
| List versions | `read_api` |

### GitHub Tokens

| Operation | Required Scope |
|-----------|---------------|
| Download (public) | None |
| Download (private) | `repo` |

## CI/CD Examples

### GitLab CI

```yaml
variables:
  # Use CI_JOB_TOKEN for same-project access
  GREKT_TOKEN_MYTEAM: $CI_JOB_TOKEN

stages:
  - install
  - publish

install:
  stage: install
  script:
    - grekt install

publish:
  stage: publish
  script:
    - grekt publish .
  rules:
    - if: $CI_COMMIT_TAG
```

For cross-project access, use a Project Access Token or Personal Access Token stored as a CI variable.

### GitHub Actions

```yaml
name: CI

on: [push, pull_request]

jobs:
  install:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install artifacts
        env:
          GREKT_TOKEN_MYTEAM: ${{ secrets.GITLAB_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: grekt install

  publish:
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/')
    steps:
      - uses: actions/checkout@v4

      - name: Publish
        env:
          GREKT_TOKEN_MYTEAM: ${{ secrets.GITLAB_TOKEN }}
        run: grekt publish .
```

### Other CI systems

```bash
# Set tokens before running grekt
export GREKT_TOKEN_MYTEAM="$GITLAB_TOKEN"
export GITHUB_TOKEN="$GH_TOKEN"

grekt install
```

## Security best practices

1. **Never commit tokens** — Use env vars or gitignored config files
2. **Use scope-specific tokens** — Limit blast radius if compromised
3. **Minimal permissions** — Only grant required scopes
4. **Rotate regularly** — Especially for CI/CD tokens
5. **Use CI native tokens** — Like `CI_JOB_TOKEN` in GitLab

## Troubleshooting

### Token not found

```
Error: Authentication required for @myteam
```

Check:
1. Env var name matches scope: `GREKT_TOKEN_MYTEAM` for `@myteam`
2. Token is exported in current shell
3. Config file path is correct

### Permission denied

```
Error: 403 Forbidden
```

Check:
1. Token has required scopes (`read_api`, `write_repository`)
2. Token has access to the project
3. Token hasn't expired

### Wrong registry

```
Error: Artifact not found
```

Check:
1. Scope matches config in `.grekt/config.yaml`
2. Project path is correct
3. Artifact exists in that registry

## Related

- [Overview](/en-US/docs/guide/registries/overview) — Registry concepts
- [GitLab Backend](/en-US/docs/guide/registries/gitlab-backend) — GitLab setup
- [Git Sources](/en-US/docs/guide/registries/sources) — Source authentication
