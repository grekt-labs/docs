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

  @grekt/my-agent: 1.2.0 → 1.2.1

ℹ Dry run complete
```

## Requirements

- Each artifact must have a valid `grekt.yaml` with `name`, `author`, and `version`

## CI/CD Automation

Use with `semantic-release` for automated versioning based on conventional commits:

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Analyze commits
        id: semrel
        uses: cycjimmy/semantic-release-action@v4
        with:
          dry_run: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Bump version
        if: steps.semrel.outputs.new_release_published == 'true'
        run: grekt version ${{ steps.semrel.outputs.new_release_type }}

      - name: Publish
        if: steps.semrel.outputs.new_release_published == 'true'
        run: grekt publish
```

## Related commands

- [grekt publish](/en-US/api/publish) — Publish an artifact
- [grekt versions](/en-US/api/versions) — List available versions
