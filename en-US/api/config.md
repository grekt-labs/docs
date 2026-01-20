# grekt config

Manage project configuration.

## Usage

```bash
grekt config <subcommand>
```

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `list` | Show current configuration |
| `set <key> <value>` | Set a configuration value |
| `get <key>` | Get a configuration value |

## Configuration file

Located at `.grekt/config.yaml` in your project:

```yaml
targets:
  - claude
  - cursor
  - opencode
autoSync: false
registry: https://custom-registry.example.com/artifacts  # optional
```

## Configuration keys

| Key | Description |
|-----|-------------|
| `targets` | AI tools to sync artifacts to (claude, cursor, opencode) |
| `autoSync` | Automatically sync after `grekt add` |
| `registry` | Custom artifact registry URL (defaults to grekt's public registry) |

## Examples

### List config

```bash
grekt config list
```

Output:

```
Configuration (.grekt/config.yaml):
  targets: claude, cursor
  autoSync: false
```

### Set targets

```bash
grekt config set targets claude,cursor
```

### Enable auto-sync

```bash
grekt config set autoSync true
```

### Get a value

```bash
grekt config get targets
```

Output:

```
claude, cursor
```

## Notes

- Config is always project-scoped
- Run `grekt init` first to create the config file
- Changes take effect immediately
