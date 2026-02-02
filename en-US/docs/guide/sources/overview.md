# Sources overview

grekt supports multiple ways to install artifacts.

## Git sources

Install directly from GitHub or GitLab repositories. Best for single artifacts — no registry configuration needed, just a token for private repos.

One repo = one artifact.

```bash
grekt add github:user/my-agent
grekt add github:user/my-agent#v1.0.0

grekt add gitlab:user/my-agent
grekt add gitlab:gitlab.company.com/user/my-agent#v1.0.0
```

## Registry

Host multiple artifacts in a single project. Requires [registry configuration](/en-US/docs/guide/sources/gitlab#registry-monorepo) but gives you version listing, deprecation, and better organization:

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

## Related

- [GitHub](/en-US/docs/guide/sources/github) — GitHub source
- [GitLab](/en-US/docs/guide/sources/gitlab) — Source + registry (monorepo)
- [Authentication](/en-US/docs/guide/sources/authentication) — Tokens
