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
| `customTargets` | Custom target definitions |
| `options.autoCheck` | Run integrity check after `add`/`install` |

## Examples

```bash
grekt config list
grekt config set targets claude,cursor
grekt config set autoSync true
grekt config set options.autoCheck true
grekt config get targets
```

## Options block

The `options` block in `grekt.yaml` contains optional settings:

```yaml
options:
  autoCheck: true  # Run integrity check after add/install
```

When `autoCheck` is enabled, `grekt add` and `grekt install` will automatically verify artifact integrity after completion.
