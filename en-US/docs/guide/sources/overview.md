---
description: "Overview of the registry sources grekt supports: the public registry, self-hosted GitLab, GitHub, and local paths."
---

# Registries overview

grekt supports multiple ways to host and install artifacts.

## Registries

### Public registry

Browse and install artifacts directly from [explore.grekt.com](https://explore.grekt.com). No configuration needed.

```bash
grekt add @scope/artifact-name
```

### Self-hosted registry

Host your own registry on GitLab with version listing, deprecation, and [monorepo](/en-US/docs/guide/managing/monorepo) support. Requires [registry configuration](/en-US/docs/guide/sources/gitlab#registry-monorepo).

```bash
grekt add @myteam/agent-tools
grekt add @myteam/agent-tools@2.0.0
```

```yaml
# .grekt/config.yaml
registries:
  "@myteam":
    type: gitlab
    project: myteam/artifacts
```

## Git sources

Install directly from GitHub or GitLab repositories. No registry configuration needed, just a token for private repos.

```bash
grekt add github:user/my-agent
grekt add github:user/my-agent#v1.0.0

grekt add gitlab:user/my-agent
grekt add gitlab:gitlab.company.com/user/my-agent#v1.0.0
```

## Local sources

Install artifacts from local directories. Useful for development, testing, or sharing artifacts within a monorepo.

```bash
grekt add ./path/to/artifact
grekt add ../sibling-repo/artifact
grekt add /absolute/path/to/artifact
grekt add ~/shared/artifacts/my-agent
```

| Prefix | Example |
|--------|---------|
| `./` | Relative to current directory |
| `../` | Parent directory |
| `/` | Absolute path |
| `~/` | Home directory |

The directory must contain a valid `grekt.yaml` with artifact metadata. Local sources are copied to `.grekt/artifacts/` like any other source.

## Related

- [GitLab](/en-US/docs/guide/sources/gitlab) - Source + registry (monorepo)
- [GitHub](/en-US/docs/guide/sources/github) - GitHub source
- [Authentication](/en-US/docs/guide/sources/authentication) - Tokens
