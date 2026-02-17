# grekt config

Manage project configuration.

```bash
grekt config <subcommand>
```

## Subcommands

| Command | Description |
|---------|-------------|
| `list` | Show config |
| `set <key> <value>` | Set value |
| `get <key>` | Get value |
| `registry set [scope]` | Configure registry for a scope |
| `registry unset [scope]` | Remove registry for a scope |
| `token set` | Add token for a git host |
| `token unset [host]` | Remove token for a git host |

## Keys

| Key | Description |
|-----|-------------|
| `registry` | Custom registry URL |

Use [`grekt add-target`](/en-US/api/add-target) to configure sync targets interactively.

## Examples

```bash
# Basic config
grekt config list
grekt config set registry https://my-registry.com
grekt config get registry

# Registry backends for scoped artifacts
grekt config registry set @myteam
grekt config registry unset @myteam

# Git source tokens (github:, gitlab:)
grekt config token set
grekt config token unset github
```

## Registry configuration

Configure custom registries for scoped artifacts:

```bash
grekt config registry set @myteam
```

This starts an interactive flow to configure:
- Registry type (GitHub, GitLab)
- Repository or project path
- Authentication token (optional)

Configuration is stored in `.grekt/config.yaml`.

## Token configuration

Configure tokens for private git sources:

```bash
grekt config token set
```

Tokens are used when adding artifacts from `github:` or `gitlab:` sources. Priority:
1. Token in `.grekt/config.yaml`
2. Environment variable (`GITHUB_TOKEN`, `GITLAB_TOKEN`)

