# grekt upgrade

Upgrade artifacts to their latest registry versions.

```bash
grekt upgrade [artifact]
```

::: info Registry Only
This command only upgrades artifacts from registries. GitHub and GitLab sources are skipped. Use `git pull` for git-sourced artifacts.
:::

## Arguments

| Argument | Description |
|----------|-------------|
| `[artifact]` | Specific artifact to upgrade (e.g., `@scope/name`). Omit to upgrade all. |

## Examples

```bash
# Upgrade all outdated registry artifacts
grekt upgrade

# Upgrade a specific artifact
grekt upgrade @scope/my-artifact
```

## Output

```bash
$ grekt upgrade

Upgrading 2 artifact(s):

  @scope/my-artifact: 1.0.0 -> 2.0.0
  @scope/utils: 2.0.0 -> 3.1.0

Upgraded:
  @scope/my-artifact: 1.0.0 -> 2.0.0
  @scope/utils: 2.0.0 -> 3.1.0
```

When all artifacts are current:

```bash
$ grekt upgrade
All artifacts are up to date
```

## Component selection preservation

Artifacts installed with `--choose` retain their component selection during upgrade. If the new version has no structural changes, the previous selection applies silently.

When the new version adds or removes components, the upgrade shows a diff and re-opens the selector with previous items pre-checked:

```
@scope/git-flow: structural changes detected
  Removed components:
    - skills/old-feature.md
  New components:
    + skills/new-feature.md
    + agents/reviewer.md

? Select components to install:
  ◉ agent: Git Flow Agent
  ◯ agent: Reviewer           (new, unchecked)
  ◉ skill: Branch Management
  ◯ skill: New Feature         (new, unchecked)
  ◉ command: Create PR
```

## How it works

1. Reads `grekt.lock` and filters to registry artifacts
2. Checks each artifact's latest version via the registry
3. Downloads and installs artifacts with newer versions
4. Preserves component selections and sync mode (CORE/LAZY)
5. Updates `grekt.yaml`, `grekt.lock`, and regenerates the index
6. Auto-syncs to configured targets

## Related commands

- [grekt outdated](/en-US/api/outdated) — Check which artifacts have updates
- [grekt add](/en-US/api/add) — Add or update a single artifact
- [grekt install](/en-US/api/install) — Install from lockfile
