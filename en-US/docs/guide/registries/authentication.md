# Registry Authentication

Configure authentication for private registries and Git sources.

::: info Project Required
All commands requiring authentication need a grekt project. Run `grekt init` first.
:::

## Quick setup

Use interactive commands to configure authentication:

```bash
# Configure a registry backend for a scope
grekt config registry set @myteam

# Add a token for a git host
grekt config token set
```

Both commands will prompt you for the required information.

## Configuration file

All authentication is stored in `.grekt/config.yaml` (automatically gitignored):

```yaml
# Registry backends (for @scope/name artifacts)
registries:
  "@myteam":
    type: gitlab
    host: gitlab.company.com
    project: myteam/artifacts
    token: glpat-xxxxxxxxxxxx

# Git source tokens (for github: and gitlab: sources)
tokens:
  github.com: ghp_xxxxxxxxxxxx
  gitlab.com: glpat-xxxxxxxxxxxx
  gitlab.company.com: glpat-xxxxxxxxxxxx
```

## Registry backends

Registry backends allow you to host artifacts on GitLab or GitHub Package Registry.

```bash
grekt config registry set @myteam
```

You'll be prompted for:
- **Registry type**: GitLab or GitHub
- **Host**: e.g., `gitlab.com` or `gitlab.company.com`
- **Project path**: e.g., `myteam/artifacts`
- **Token**: (optional if using env vars)

To remove a registry:

```bash
grekt config registry unset @myteam
```

## Git source tokens

Tokens for accessing private Git repositories directly.

```bash
grekt config token set
```

You'll be prompted for:
- **Host**: e.g., `github.com`, `gitlab.company.com`
- **Token**: your personal access token

To remove a token:

```bash
grekt config token unset gitlab.company.com
```

## Token priority

### Registry backends (`@scope/name`)

1. Token in `.grekt/config.yaml` registry entry
2. Platform env var: `GITLAB_TOKEN` or `GITHUB_TOKEN` (only for `gitlab.com` / `github.com`)

### Git sources (`github:` / `gitlab:`)

1. Token in `.grekt/config.yaml` `tokens` section
2. Platform env var: `GITHUB_TOKEN` / `GITLAB_TOKEN` (only for `github.com` / `gitlab.com`)

::: warning Self-hosted requires explicit configuration
Environment variables like `GITHUB_TOKEN` and `GITLAB_TOKEN` only work for the default hosts (`github.com`, `gitlab.com`). For self-hosted instances, you must configure tokens explicitly using `grekt config token set`.
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
