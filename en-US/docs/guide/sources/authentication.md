# Authentication

Configure authentication for private sources and registries.

## Quick setup

```bash
# Token for git sources (github:, gitlab:)
grekt config token set

# Registry for scoped artifacts (@scope/name)
grekt config registry set @myteam
```

Both commands are interactive and store credentials in `.grekt/config.yaml` (gitignored).

## Token priority

grekt checks these locations in order and uses the first token found:

### Git sources (`github:` / `gitlab:`)

1. Token in `.grekt/config.yaml` `tokens` section
2. Environment variable: `GITHUB_TOKEN` / `GITLAB_TOKEN`

### Registries (`@scope/name`)

1. Token in `.grekt/config.yaml` registry entry
2. Environment variable: `GITLAB_TOKEN` or `GITHUB_TOKEN`

::: warning
Environment variables only work for `github.com` and `gitlab.com`. For self-hosted instances, use `grekt config token set`.
:::

## Troubleshooting

### Authentication required

```
Error: Authentication required for @myteam
```

Run `grekt config token set` or `grekt config registry set @scope`.

### Permission denied

```
Error: 403 Forbidden
```

Check token has required scopes. For GitLab registries, Deploy Tokens with `read_package_registry` / `write_package_registry` are recommended over PATs. See [GitLab Authentication](/en-US/docs/guide/sources/gitlab#registry-auth).

## Related

- [GitHub](/en-US/docs/guide/sources/github) - GitHub setup
- [GitLab](/en-US/docs/guide/sources/gitlab) - GitLab setup
