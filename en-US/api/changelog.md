---
description: "Generate changesets from git history for workspace artifacts using conventional commits."
---

# grekt changelog

Generate changesets from git history for workspace artifacts.

```bash
grekt changelog
grekt changelog --ci
```

## Options

| Option | Description |
|--------|-------------|
| `--ci` | Unattended mode (no prompts, auto-calculate bumps from commits) |
| `--format <format>` | Output format: `changeset` (default), `json`, `yaml` |
| `--since <ref>` | Override base ref for change detection |
| `--dry-run` | Preview without writing files |

## Examples

```bash
# Interactive — review and confirm bumps per artifact
grekt changelog

# CI mode — auto-generate from conventional commits
grekt changelog --ci

# Preview without writing
grekt changelog --dry-run

# Output as JSON instead of changeset files
grekt changelog --format json

# Detect changes since a specific ref
grekt changelog --since v1.0.0
```

## Output formats

### Changeset (default)

Generates `.changeset/*.md` files in the workspace root:

```markdown
---
"@scope/my-artifact": minor
---

- feat: add new validation rules
- fix: correct sync behavior
```

### JSON / YAML

Prints structured output to stdout with base ref, artifact names, versions, bump types, and commits.

```bash
grekt changelog --format json
grekt changelog --format yaml
```

## Behavior

### Interactive mode (default)

1. Detects base ref per artifact (from git tags or branch)
2. Scans git history for conventional commits
3. Maps changed files to workspace artifacts
4. Prompts for bump type per artifact (patch, minor, major, skip)
5. Generates output

### CI mode (`--ci`)

1. Same detection and analysis
2. Auto-calculates bump from commits:
   - Breaking changes → `major`
   - `feat:` → `minor`
   - Everything else → `patch`
3. Non-conventional commits are warned and skipped
4. Generates output without prompts

## Base ref detection

Priority:

1. Explicit `--since` flag
2. Feature branch → `origin/<default-branch>`
3. Default branch → per-artifact git tags (`@scope/name@version`)

::: info Full git history required
In CI, use `fetch-depth: 0` in your checkout step. `grekt changelog` needs full git history to detect changes and parse commits.
:::

## Requirements

- `grekt-workspace.yaml` in the current directory
- [Conventional commits](https://www.conventionalcommits.org/) for automatic bump calculation

## Related commands

- [grekt version](/en-US/api/version) - Apply version bumps
- [grekt publish](/en-US/api/publish) - Publish artifacts
- [Monorepo guide](/en-US/docs/guide/managing/monorepo) - Full release workflow
