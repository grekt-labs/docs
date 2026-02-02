# grekt version

Bump artifact versions.

```bash
grekt version <bump> [path]
```

## Arguments

| Argument | Description |
|----------|-------------|
| `bump` | Required. One of `patch`, `minor`, `major`. |
| `path` | Optional. Path to artifact or directory. Defaults to current directory. |

## Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Show what would happen without applying changes |

## Examples

```bash
# Bump patch version (1.0.0 → 1.0.1)
grekt version patch

# Bump minor version (1.0.0 → 1.1.0)
grekt version minor

# Bump major version (1.0.0 → 2.0.0)
grekt version major

# Bump specific artifact
grekt version patch ./my-agent

# Preview without applying
grekt version minor --dry-run
```

## Output

```bash
$ grekt version patch --dry-run

ℹ Found 1 artifact(s)
  (dry-run mode)

  @scope/my-artifact: 1.2.0 → 1.2.1
```

## How it works

- Reads current version from `grekt.yaml`
- Bumps according to [semver](https://semver.org/):
  - `patch`: 1.0.0 → 1.0.1
  - `minor`: 1.0.0 → 1.1.0
  - `major`: 1.0.0 → 2.0.0
- Writes updated version back to `grekt.yaml`

## Requirements

- Each artifact must have a valid `grekt.yaml` with `name`, `author`, and `version`

## Related commands

- [grekt publish](/en-US/api/publish) — Publish an artifact
- [grekt versions](/en-US/api/versions) — List available versions
