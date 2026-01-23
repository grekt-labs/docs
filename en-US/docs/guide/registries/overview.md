# Registries Overview

grekt supports multiple ways to install artifacts depending on your needs.

## Platform comparison

| Feature | Public Registry | GitHub | GitLab Source | GitLab Backend |
|---------|-----------------|--------|---------------|----------------|
| Syntax | `@scope/name` | `github:owner/repo` | `gitlab:owner/repo` | `@scope/name` + config |
| Config needed | No | No | No | Yes |
| Artifacts per project | N/A | 1 | 1 | Unlimited |
| Version listing | Yes | No | No | Yes |
| Deprecation | Yes | No | No | Yes |
| Self-hosted | No | No | Yes | Yes |
| Monorepo | N/A | No | No | **Yes** |

## Quick start

### Public registry (default)

```bash
grekt add @grekt/code-reviewer
grekt add @grekt/code-reviewer@1.0.0
```

No configuration needed. Uses `registry.grekt.com`.

### GitHub (Source)

```bash
grekt add github:user/my-agent
grekt add github:user/my-agent#v1.0.0
```

One repository = one artifact. Simple, but limited.

### GitLab (Source)

```bash
grekt add gitlab:user/my-agent
grekt add gitlab:gitlab.company.com/user/my-agent#v1.0.0
```

Same as GitHub, but supports self-hosted instances.

### GitLab (Registry Backend)

```bash
grekt add @myteam/agent-tools
grekt add @myteam/agent-tools@2.0.0
```

Multiple artifacts in one GitLab project. Requires configuration:

```yaml
# .grekt/config.yaml
registries:
  "@myteam":
    type: gitlab
    project: myteam/artifacts
```

## When to Use What

| Use Case | Recommendation |
|----------|----------------|
| Public artifacts | Public registry |
| Open source artifact | GitHub or GitLab source |
| Quick prototype | GitHub or GitLab source |
| Organization with many artifacts | GitLab backend (monorepo) |
| Private/internal artifacts | GitLab backend |
| Immutable versioned releases | Public registry or GitLab backend |

## Related

- [GitHub](/en-US/docs/guide/registries/github) — GitHub source
- [GitLab](/en-US/docs/guide/registries/gitlab) — Source + backend (monorepo)
- [Authentication](/en-US/docs/guide/registries/authentication) — Tokens and CI/CD
