# Sources overview

grekt supports multiple ways to install and publish artifacts.

## Git sources

Install directly from GitHub or GitLab repositories. One repo = one artifact.

```bash
grekt add github:user/my-agent
grekt add github:user/my-agent#v1.0.0

grekt add gitlab:user/my-agent
grekt add gitlab:gitlab.company.com/user/my-agent#v1.0.0
```

## GitLab registry

Multiple artifacts in one GitLab project. Requires configuration:

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
