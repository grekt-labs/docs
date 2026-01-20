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
│   └── config.yaml      # Project configuration
├── grekts/
│   └── installed.yaml   # Empty package index
└── grekt.lock           # Empty lockfile
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

### `.grekt/config.yaml`

```yaml
targets:
  - claude
  - cursor
```

### `grekts/installed.yaml`

```yaml
version: 1
packages: {}
```

### `grekt.lock`

```yaml
version: 1
packages: {}
```

## Notes

- Running `init` in an already initialized project will not overwrite existing files
- The `grekts/` directory is where packages will be installed
- Configuration can be changed later with `grekt config`
