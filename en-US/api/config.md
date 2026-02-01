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
| `registry` | Custom registry URL |

Use [`grekt add-target`](/en-US/api/add-target) to configure sync targets interactively.

## Examples

```bash
grekt config list
grekt config set registry https://my-registry.com
grekt config get registry
```

## Options block

The `options` block in `grekt.yaml` contains optional settings:

```yaml
options:
  autoCheck: true  # Run integrity check after add/install
```

When `autoCheck` is enabled, `grekt add` and `grekt install` will automatically verify artifact integrity after completion.
