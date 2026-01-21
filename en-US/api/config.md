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

## Keys

| Key | Description |
|-----|-------------|
| `targets` | AI tools to sync to |
| `autoSync` | Sync after `grekt add` |
| `registry` | Custom registry URL |

## Examples

```bash
grekt config list
grekt config set targets claude,cursor
grekt config set autoSync true
grekt config get targets
```
