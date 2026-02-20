---
description: "Configure GitHub Container Registry as a grekt artifact source, including required token scopes and YAML setup."
---

# GitHub

Use GitHub Container Registry (GHCR) to host multiple artifacts in a single namespace.

## Authentication

You need a GitHub personal access token with the required scopes before configuring the registry.

Required scopes: `read:packages` (download), `write:packages` (publish).

```bash
grekt config registry set @myorg
```

See [Authentication](/en-US/docs/guide/sources/authentication).

## Configuration

```yaml
registries:
  "@myorg":
    type: github
    project: myorg
```

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `type` | Yes | Must be `github` |
| `project` | Yes | GHCR namespace (e.g., `myorg` for `ghcr.io/myorg/*`) |
| `host` | No | Registry host (default: `ghcr.io`) |
| `token` | No | Access token (prefer `grekt config registry set`) |
| `prefix` | No | Repository name prefix for monorepo organization (immutable after first publish) |

## Usage

```bash
# Install
grekt add @myorg/agent-tools
grekt add @myorg/agent-tools@2.0.0

# List versions
grekt versions @myorg/agent-tools
```

## Monorepo organization

Use `prefix` to organize multiple scopes within a single GHCR namespace:

```yaml
registries:
  "@frontend":
    type: github
    project: myorg
    prefix: frontend
  "@backend":
    type: github
    project: myorg
    prefix: backend
```

This creates OCI repositories with the prefix:

| Artifact | OCI repository |
|----------|----------------|
| `@frontend/utils` | `ghcr.io/myorg/frontend-utils` |
| `@backend/api` | `ghcr.io/myorg/backend-api` |

::: warning Immutable after first publish
Once you publish with or without a prefix, you cannot change it. Adding, removing, or modifying the prefix will cause grekt to look for different repository names in GHCR.

If you need to change the prefix, you must rename the repositories in your registry manually.
:::

## Publishing

Publishing to GHCR requires the `oras` CLI. Install from [oras.land](https://oras.land/).

---

## Source mode

Alternatively, use a GitHub repository directly as an artifact (one artifact per repo).

```bash
# Latest from default branch
grekt add github:owner/repo

# Specific tag
grekt add github:owner/repo#v1.0.0

# Specific branch or commit
grekt add github:owner/repo#main
grekt add github:owner/repo#abc1234
```

For private repositories:

```bash
grekt config token set github
```

::: info Limitations
Source mode only supports one artifact per repository. No version listing, no deprecation, no `grekt info`.
:::

---

## Related

- [Overview](/en-US/docs/guide/sources/overview) - Registries overview
- [GitLab](/en-US/docs/guide/sources/gitlab) - GitLab registry
- [Authentication](/en-US/docs/guide/sources/authentication) - Full auth guide
