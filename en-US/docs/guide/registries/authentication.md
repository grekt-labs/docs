# Registry Authentication

Configure authentication for private registries and Git sources.

::: info Project Required
All commands requiring authentication need a grekt project. Run `grekt init` first.
:::

## Configuration

All authentication is configured in `.grekt/config.yaml` (automatically gitignored):

```yaml
# Registry backends (for @scope/name artifacts)
registries:
  "@myteam":
    type: gitlab
    project: myteam/artifacts
    token: glpat-xxxxxxxxxxxx

# Git source tokens (for github: and gitlab: sources)
tokens:
  github: ghp_xxxxxxxxxxxx
  gitlab.com: glpat-xxxxxxxxxxxx
  gitlab.company.com: glpat-xxxxxxxxxxxx
```

## Token priority

### Registry backends (`@scope/name`)

1. Config file token in `.grekt/config.yaml`
2. Platform env var: `GITLAB_TOKEN` or `GITHUB_TOKEN`

### Git sources (`github:` / `gitlab:`)

1. Config file token in `.grekt/config.yaml` `tokens` section
2. Platform env var: `GITHUB_TOKEN` / `GITLAB_TOKEN` / `GH_TOKEN` / `GL_TOKEN`

::: tip Platform env vars as fallback
If you already have `GITHUB_TOKEN` or `GITLAB_TOKEN` set for other tools, grekt will use them automatically. No need to duplicate in the config file.
:::

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

## Security best practices

1. **Never commit tokens** — `.grekt/config.yaml` is gitignored by default
2. **Minimal permissions** — Only grant required scopes
3. **Rotate regularly** — Especially for long-lived tokens

## Troubleshooting

### Token not found

```
Error: Authentication required for @myteam
```

Check:
1. Token is set in `.grekt/config.yaml` under registries or tokens section
2. Config file path is correct (`.grekt/config.yaml`)

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
- [GitLab](/en-US/docs/guide/registries/gitlab) — GitLab setup
- [GitHub](/en-US/docs/guide/registries/github) — GitHub sources
