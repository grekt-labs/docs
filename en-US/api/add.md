# grekt add

Add an artifact from registry, GitHub, or GitLab.

```bash
grekt add <source>
```

## Options

| Option | Description |
|--------|-------------|
| `-c, --choose` | Interactively select which components to install |
| `--core` | Mark artifact as CORE mode (copied to target, syncs automatically) |
| `--core-sym` | Mark artifact as CORE mode with symlinks (symlinked to target, syncs automatically, no transforms) |

## Source formats

| Format | Example |
|--------|---------|
| Registry | `@author/name` |
| Registry (version) | `@author/name@1.0.0` |
| GitHub | `github:owner/repo` |
| GitHub (ref) | `github:owner/repo#v1.0.0` |
| GitLab | `gitlab:owner/repo` |
| GitLab (self hosted) | `gitlab:host.com/owner/repo` |
| Local (relative) | `./path/to/artifact` |
| Local (absolute) | `/absolute/path` |
| Local (home) | `~/shared/artifact` |

## Examples

```bash
# Registry (latest version)
grekt add @scope/my-artifact

# Registry (specific version)
grekt add @scope/my-artifact@1.0.0

# GitHub
grekt add github:user/my-artifact
grekt add github:user/my-artifact#v1.0.0

# GitLab
grekt add gitlab:group/my-artifact
grekt add gitlab:gitlab.company.com/team/artifact#main

# Local
grekt add ./my-artifact
grekt add ~/shared/artifacts/my-agent
```

## Component selection

Artifacts can contain multiple components: agents, skills, and commands. By default, all components are installed. Use `--choose` to select only what you need:

```bash
grekt add @scope/git-flow --choose
```

```
@scope/git-flow@1.0.0

? Select components to install:
  ◉ agent: Git Flow Agent
  ◉ skill: Branch Management
  ◯ skill: Release Notes Generator
  ◉ command: Create PR
  ◯ command: Squash Commits
```

This is useful when:
- You only need specific skills from a large artifact
- You want to reduce context size for your AI tools
- The artifact has optional features you don't use

Selected components are tracked in `grekt.yaml`:

```yaml
artifacts:
  @scope/git-flow:
    version: "1.0.0"
    agent: true
    skills:
      - skills/branch-management.md
    commands:
      - commands/create-pr.md
```

When updating an artifact that was installed with `--choose`, the previous selection is preserved. If the new version adds or removes components, a diff is shown and the selector re-opens with previous items pre-checked.

Using `--choose` on an already partial artifact pre-checks the previous selection instead of checking all.

## Sync modes

Artifacts can be added in three modes:

| Mode | Behavior |
|------|----------|
| **LAZY** (default) | Indexed in `.grekt/index`, not synced to target |
| **CORE** | Copied to target directories (e.g., `.claude/agents/`) |
| **CORE-SYM** | Symlinked to target directories (no file duplication, no transforms) |

Use `--core` or `--core-sym` for artifacts you need immediately available in context:

```bash
# LAZY mode (default) - only indexed
grekt add @scope/my-artifact

# CORE mode - copied to .claude/agents/, .claude/skills/...
grekt add @scope/my-artifact --core

# CORE-SYM mode - symlinked to .claude/agents/, .claude/skills/...
grekt add @scope/my-artifact --core-sym
```

CORE and CORE-SYM mode artifacts are tracked in `grekt.yaml`:

```yaml
artifacts:
  @scope/my-artifact:
    version: "1.0.0"
    mode: core          # or core-sym
```

## Authentication

For private repos, set `GITHUB_TOKEN` or `GITLAB_TOKEN`. See [Authentication](/en-US/docs/guide/sources/authentication).

## Auto check

When `options.autoCheck` is enabled in `grekt.yaml`, an integrity check runs automatically after adding:

```yaml
options:
  autoCheck: true
```

```
✓ Installed @scope/my-artifact@1.0.0

Integrity check:
✓ All 3 artifact(s) verified
```

## Updating artifacts

If an artifact is already installed, `grekt add` will update it to the new version if it's higher:

```bash
$ grekt add @scope/my-artifact
Updating @scope/my-artifact: 1.0.0 → 2.0.0
✓ Installed @scope/my-artifact@2.0.0
```

If the installed version is the same or newer, it will skip:

```bash
$ grekt add @scope/my-artifact
Already installed: @scope/my-artifact@2.0.0
```

Use `grekt outdated` to check which artifacts have updates available, or `grekt upgrade` to upgrade all outdated artifacts at once.

## Notes

- Downloads to `.grekt/artifacts/<artifact-id>/`
- Updates `grekt.yaml` and `grekt.lock`
- LAZY mode requires `grekt sync` to update index
- CORE mode (`--core`) and CORE-SYM mode (`--core-sym`) sync automatically
- Deprecated versions show a warning but still install
- Versions must be valid semver (no `v` prefix)
