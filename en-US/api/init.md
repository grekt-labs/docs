# grekt init

Initialize grekt in a project directory.

## Usage

```bash
grekt init [options]
```

## Description

Creates the grekt directory structure and configuration files in the current directory.

## Options

| Option | Description |
|--------|-------------|
| `-y, --yes` | Skip prompts and use defaults |

## What it creates

```
project/
├── .grekt/
│   └── artifacts/       # Downloaded artifacts (gitignored)
├── grekt.yaml           # Config + artifact declarations
└── grekt.lock           # Lockfile with versions/checksums
```

## Interactive prompts

When run without `--yes`, you'll be prompted to:

1. **Select sync targets** — Choose which AI tools to sync to (Claude, Cursor, OpenCode)

## Examples

### Basic initialization

```bash
grekt init
```

### Skip prompts with defaults

```bash
grekt init --yes
```

### In a new project

```bash
mkdir my-project
cd my-project
grekt init
```

## Generated files

### `grekt.yaml`

```yaml
targets:
  - claude
  - cursor
autoSync: false
artifacts: {}
```

### `grekt.lock`

```yaml
version: 1
artifacts: {}
```

## Notes

- Running `init` in an already initialized project will not overwrite existing files
- The `.grekt/artifacts/` directory is where artifacts will be downloaded
- Configuration can be changed later with `grekt config`
