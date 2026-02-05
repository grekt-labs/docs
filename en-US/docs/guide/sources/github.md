# GitHub

GitHub supports two modes: **source** (one artifact per repo) and **registry** (multiple artifacts via GHCR).

---

## Source mode

Install artifacts directly from GitHub repositories.

### Usage

```bash
# Latest from default branch
grekt add github:owner/repo

# Specific tag
grekt add github:owner/repo#v1.0.0

# Specific branch
grekt add github:owner/repo#main

# Specific commit
grekt add github:owner/repo#abc1234
```

### Examples

```bash
grekt add github:grekt-labs/committer
grekt add github:grekt-labs/committer#v1.2.0
```

### Limitations

Source mode only supports **one artifact per repository**. The entire repository is downloaded as the artifact.

| Feature | Source | Registry |
|---------|--------|----------|
| Syntax | `github:owner/repo` | `@scope/name` |
| Artifacts per project | 1 | Unlimited |
| Version listing | No | Yes |
| Deprecation | No | Yes |
| `grekt info` | No | Yes |

For multiple artifacts, use registry mode (GHCR) below.

### Authentication

For private repositories on github.com:

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

Required scopes: `repo`

::: tip
For permanent configuration, use `grekt config token set`.
:::

---

## Registry (GHCR)

Use GitHub Container Registry (GHCR) to host multiple artifacts in a single namespace.

### Configuration

```yaml
registries:
  "@myorg":
    type: github
    project: myorg
```

#### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `type` | Yes | Must be `github` |
| `project` | Yes | GHCR namespace (e.g., `myorg` for `ghcr.io/myorg/*`) |
| `host` | No | Registry host (default: `ghcr.io`) |
| `token` | No | Access token (prefer env vars) |
| `folder` | No | Repository name prefix for monorepo organization |

### Usage

```bash
grekt add @myorg/agent-tools
grekt add @myorg/agent-tools@2.0.0
grekt versions @myorg/agent-tools
```

### Monorepo organization

Use `folder` to organize multiple scopes within a single GHCR namespace:

```yaml
registries:
  "@frontend":
    type: github
    project: myorg
    folder: frontend
  "@backend":
    type: github
    project: myorg
    folder: backend
```

This creates OCI repositories with folder prefixes:

| Artifact | OCI repository |
|----------|----------------|
| `@frontend/utils` | `ghcr.io/myorg/frontend-utils` |
| `@backend/api` | `ghcr.io/myorg/backend-api` |

### Authentication

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

Required scopes: `read:packages` (download), `write:packages` (publish).

### Publishing requirements

Publishing to GHCR requires the `oras` CLI. Install from [oras.land](https://oras.land/).

## Related

- [Overview](/en-US/docs/guide/sources/overview) — Sources overview
- [GitLab](/en-US/docs/guide/sources/gitlab) — Monorepo support
- [Authentication](/en-US/docs/guide/sources/authentication) — Full auth guide
