# grekt version

Bump artifact versions manually or automatically via conventional commits.

```bash
grekt version [bump] [path]
```

## Arguments

| Argument | Description |
|----------|-------------|
| `bump` | Optional. One of `patch`, `minor`, `major`. If omitted, uses conventional commits. |
| `path` | Optional. Path to artifact or directory. Defaults to current directory. |

## Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Show what would happen without applying changes |

## Examples

### Manual bump

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

### Automatic (conventional commits)

```bash
# Analyze commits and bump accordingly
grekt version

# Preview without applying
grekt version --dry-run

# Analyze specific artifact
grekt version ./my-agent
```

## Output

```bash
$ grekt version patch --dry-run

ℹ Found 1 artifact(s)
  (dry-run mode)

  @grekt/my-agent: 1.2.0 → 1.2.1
```

## How it works

### Manual mode

When you specify `patch`, `minor`, or `major`:
- Directly bumps the version without analyzing commits
- Useful when not using conventional commits

### Automatic mode

When no bump type is specified:
1. Analyzes git commit history using [conventional commits](https://www.conventionalcommits.org/)
2. Calculates versions based on commit types:
   - `fix:` → patch (1.0.0 → 1.0.1)
   - `feat:` → minor (1.0.0 → 1.1.0)
   - `feat!:` or `BREAKING CHANGE:` → major (1.0.0 → 2.0.0)
3. Updates `version` in `grekt.yaml`

If no relevant commits are found, suggests using manual bump.

## Requirements

- Each artifact must have a valid `grekt.yaml` with `name`, `author`, and `version`
- For automatic mode: must be in a git repository with conventional commits
- For monorepo: tags should follow `@scope/name@version` convention

## Related commands

- [grekt publish](/en-US/api/publish) — Publish an artifact
- [grekt versions](/en-US/api/versions) — List available versions
