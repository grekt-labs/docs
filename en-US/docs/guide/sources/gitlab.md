# GitLab

GitLab supports two modes: **source** (one artifact per repo) and **registry** (multiple artifacts per project).

## Comparison

| Feature | Source | Registry |
|---------|--------|------------------|
| Syntax | `gitlab:owner/repo` | `@scope/name` |
| Artifacts per project | 1 | Unlimited |
| Version listing | No | Yes |
| Deprecation | No | Yes |
| `grekt info` | No | Yes |
| Self-hosted | Yes | Yes |

---

## Source mode

Use a GitLab repository directly as an artifact.

### Usage

```bash
# gitlab.com
grekt add gitlab:owner/repo
grekt add gitlab:owner/repo#v1.0.0

# Self-hosted
grekt add gitlab:gitlab.company.com/owner/repo
grekt add gitlab:gitlab.company.com/owner/repo#main
```

### Authentication

```bash
export GITLAB_TOKEN=glpat-xxxxxxxxxxxx
```

::: tip
For permanent configuration (including self-hosted), use `grekt config token set`.
:::

### Limitations

Same as GitHub: one artifact per repository, no version listing, no deprecation.

---

## Registry (monorepo)

Use GitLab's generic package registry to host multiple artifacts in a single project.

### Why use this?

A single GitLab project can host your entire organization's artifacts:

```
gitlab.com/myteam/artifacts/
├── @myteam/code-reviewer@1.0.0
├── @myteam/code-reviewer@1.1.0
├── @myteam/agent-tools@2.0.0
├── @myteam/committer@1.5.0
└── ...
```

### Configuration

Create `.grekt/config.yaml` in your project:

```yaml
registries:
  "@myteam":
    type: gitlab
    project: myteam/artifacts
```

For self-hosted GitLab:

```yaml
registries:
  "@company":
    type: gitlab
    host: gitlab.company.com
    project: platform/shared-artifacts
```

#### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `type` | Yes | Must be `gitlab` |
| `project` | Yes | GitLab project path (e.g., `group/project`) |
| `host` | No | GitLab host (default: `gitlab.com`) |
| `token` | No | Access token (prefer env vars) |

### Usage

```bash
# Install
grekt add @myteam/agent-tools
grekt add @myteam/agent-tools@2.0.0

# List versions
grekt versions @myteam/agent-tools

# Get info
grekt info @myteam/agent-tools
```

### Publishing

To publish artifacts to a GitLab registry, see [Publishing](/en-US/docs/guide/managing/publishing). grekt routes to the correct registry based on the scope in your artifact's `name`.

### Multiple registries

```yaml
registries:
  "@frontend":
    type: gitlab
    project: frontend/artifacts
  "@backend":
    type: gitlab
    project: backend/artifacts
    host: gitlab.internal.com
```

Each scope resolves to its own GitLab project:

```bash
grekt add @frontend/components  # → frontend/artifacts
grekt add @backend/api-tools    # → backend/artifacts
```

### Authentication

Set `GITLAB_TOKEN` or configure via `grekt config registry set`. See [Authentication](/en-US/docs/guide/sources/authentication).

| Operation | Required GitLab Scope |
|-----------|----------------------|
| Download | `read_api` |
| Publish | `write_repository` |

### How it works

grekt uses GitLab's [Generic Package Registry](https://docs.gitlab.com/ee/user/packages/generic_packages/):

```
https://gitlab.com/api/v4/projects/:id/packages/generic/:name/:version/artifact.tar.gz
```

Versions are immutable once published.

---

## Related

- [Overview](/en-US/docs/guide/sources/overview) — Sources overview
- [GitHub](/en-US/docs/guide/sources/github) — GitHub source
- [Authentication](/en-US/docs/guide/sources/authentication) — Full auth guide
