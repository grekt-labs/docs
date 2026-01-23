# Self-Hosted Registries

Host artifacts on your own infrastructure using GitLab Generic Package Registry.

## Configuration

Create `.grekt/config.yaml` in your project (gitignored):

```yaml
registries:
  "@myteam":
    type: gitlab
    project: group/artifacts
    token: glpat-xxxxxxxxxxxx
  "@company":
    type: gitlab
    project: org/shared-artifacts
    host: gitlab.company.com
    token: glpat-xxxxxxxxxxxx
```

| Field | Required | Description |
|-------|----------|-------------|
| `type` | Yes | Registry type: `gitlab` |
| `project` | Yes | GitLab project path (e.g., `group/project`) |
| `host` | No | GitLab host (default: `gitlab.com`) |
| `token` | No | Access token (can use env vars instead) |

## Usage

Once configured, use artifacts normally:

```bash
# Install from custom registry
grekt add @myteam/agent-tools
grekt add @myteam/agent-tools@2.0.0

# Install from public registry
grekt add @grekt/code-reviewer

# Publish to custom registry (reads author from grekt.yaml)
cd my-artifact
grekt publish .
```

Publishing automatically routes to the correct registry based on the artifact's `author` field.

## Authentication

Token priority (first match wins):

1. Environment variable: `GREKT_TOKEN_MYTEAM` (for `@myteam`)
2. Config file token
3. Generic: `GITLAB_TOKEN`

### Environment Variables

```bash
# Scope-specific (recommended for CI)
export GREKT_TOKEN_MYTEAM=glpat-xxxxxxxxxxxx

# Generic fallback
export GITLAB_TOKEN=glpat-xxxxxxxxxxxx
```

### Required Scopes

GitLab tokens need:

- `read_api` — Download artifacts
- `write_repository` — Publish artifacts

## CI/CD

### GitLab CI

```yaml
variables:
  GREKT_TOKEN_MYTEAM: $CI_JOB_TOKEN

install:
  script:
    - grekt install

publish:
  script:
    - grekt publish ./artifact
  rules:
    - if: $CI_COMMIT_TAG
```

### GitHub Actions

```yaml
- name: Install artifacts
  env:
    GREKT_TOKEN_MYTEAM: ${{ secrets.GITLAB_TOKEN }}
  run: grekt install

- name: Publish artifact
  env:
    GREKT_TOKEN_MYTEAM: ${{ secrets.GITLAB_TOKEN }}
  run: grekt publish ./artifact
```

## Storage

Artifacts are stored in GitLab's Generic Package Registry:

```
https://gitlab.com/api/v4/projects/:id/packages/generic/:name/:version/artifact.tar.gz
```

Each version creates a new package. Versions are immutable once published.

## Multiple Registries

Configure different registries per scope:

```yaml
registries:
  "@frontend":
    type: gitlab
    project: frontend/artifacts
  "@backend":
    type: gitlab
    project: backend/artifacts
    host: gitlab.internal.com
  "@shared":
    type: gitlab
    project: platform/shared
```

## Related

- [Publishing](/en-US/docs/guide/publishing) — Publish workflow
- [Authentication](/en-US/docs/guide/authentication) — Credentials setup
- [grekt publish](/en-US/api/publish) — Command reference
