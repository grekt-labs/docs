# GitLab

Use GitLab's Generic Package Registry to host multiple artifacts in a single project.

## Configuration

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

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `type` | Yes | Must be `gitlab` |
| `project` | Yes | GitLab project path or ID (e.g., `group/project` or `1413`) |
| `host` | No | GitLab host (default: `gitlab.com`) |
| `token` | No | Access token (prefer env vars) |
| `prefix` | No | Package name prefix for monorepo organization (immutable after first publish) |

## Usage

```bash
# Install
grekt add @myteam/agent-tools
grekt add @myteam/agent-tools@2.0.0

# List versions
grekt versions @myteam/agent-tools

# Get info
grekt info @myteam/agent-tools
```

## Authentication {#registry-auth}

For private GitLab registries, you need a token. Two options:

### Personal Access Tokens (PAT) — Recommended

PATs provide full functionality including version listing and "latest" resolution.

| Operation | Scope |
|-----------|-------|
| Download | `read_api` |
| Publish | `api` |

```yaml
# .grekt/config.yaml
registries:
  "@myteam":
    type: gitlab
    project: myteam/artifacts
    token: glpat-xxxxxxxxxxxx
```

### Deploy Tokens

Deploy Tokens provide minimum permissions but have a limitation: they cannot list package versions due to GitLab API restrictions.

| Operation | Scope |
|-----------|-------|
| Download (explicit version) | `read_package_registry` |
| Publish | `write_package_registry` |

::: warning Version required
With deploy tokens, you must specify the version explicitly:

```bash
grekt add @myteam/artifact@1.0.0  # works
grekt add @myteam/artifact        # fails (cannot resolve latest)
```

For "latest" resolution, use a PAT instead.
:::

### Environment variables

```bash
export GITLAB_TOKEN=glpat-xxxxxxxxxxxx
```

Or use `grekt config registry set @scope` for interactive setup. See [Authentication](/en-US/docs/guide/sources/authentication).

## Publishing

To publish artifacts to a GitLab registry, see [Publishing](/en-US/docs/guide/managing/publishing). grekt routes to the correct registry based on the scope in your artifact's `name`.

## Multiple registries

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

## Monorepo organization

Use `prefix` to organize multiple scopes within a single GitLab project:

```yaml
registries:
  "@sesame-frontend":
    type: gitlab
    project: sesame/artifacts
    prefix: frontend
  "@sesame-backend":
    type: gitlab
    project: sesame/artifacts
    prefix: backend
```

This creates packages with the prefix in the registry:

| Artifact | Package name in GitLab |
|----------|------------------------|
| `@sesame-frontend/utils` | `frontend-utils` |
| `@sesame-backend/api` | `backend-api` |

Both scopes share the same GitLab project while avoiding naming collisions.

::: warning Immutable after first publish
Once you publish with or without a prefix, you cannot change it. Adding, removing, or modifying the prefix will cause grekt to look for different package names in the registry.

If you need to change the prefix, you must rename the packages in your registry manually.
:::

## How it works

grekt uses GitLab's [Generic Package Registry](https://docs.gitlab.com/ee/user/packages/generic_packages/):

```
https://gitlab.com/api/v4/projects/:id/packages/generic/:name/:version/artifact.tar.gz
```

Versions are immutable once published.

---

## Source mode

Alternatively, use a GitLab repository directly as an artifact (one artifact per repo).

```bash
# gitlab.com
grekt add gitlab:owner/repo
grekt add gitlab:owner/repo#v1.0.0

# Self-hosted
grekt add gitlab:gitlab.company.com/owner/repo
```

For private repositories:

```bash
export GITLAB_TOKEN=glpat-xxxxxxxxxxxx
```

::: info Limitations
Source mode only supports one artifact per repository. No version listing, no deprecation, no `grekt info`.
:::

---

## Related

- [Overview](/en-US/docs/guide/sources/overview) — Sources overview
- [GitHub](/en-US/docs/guide/sources/github) — GitHub source
- [Authentication](/en-US/docs/guide/sources/authentication) — Full auth guide
