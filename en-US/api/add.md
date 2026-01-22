# grekt add

Add an artifact from registry, GitHub, or GitLab.

```bash
grekt add <source>
```

## Options

| Option | Description |
|--------|-------------|
| `-c, --choose` | Interactively select which components to install |

## Source Formats

| Format | Example |
|--------|---------|
| Registry | `@author/name` |
| Registry (version) | `@author/name@1.0.0` |
| GitHub | `github:owner/repo` |
| GitHub (ref) | `github:owner/repo#v1.0.0` |
| GitLab | `gitlab:owner/repo` |
| GitLab (self hosted) | `gitlab:host.com/owner/repo` |

## Examples

```bash
# Registry (latest version)
grekt add @grekt/code-reviewer

# Registry (specific version)
grekt add @grekt/code-reviewer@1.0.0

# GitHub
grekt add github:user/my-artifact
grekt add github:user/my-artifact#v1.0.0

# GitLab
grekt add gitlab:group/my-artifact
grekt add gitlab:gitlab.company.com/team/artifact#main
```

## Component Selection

Artifacts can contain multiple components: agents, skills, and commands. By default, all components are installed. Use `--choose` to select only what you need:

```bash
grekt add @grekt/git-flow --choose
```

```
@grekt/git-flow@1.0.0

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
  @grekt/git-flow:
    version: "1.0.0"
    agent: true
    skills:
      - skills/branch-management.md
    commands:
      - commands/create-pr.md
```

## Authentication

For private repos, set `GITHUB_TOKEN` or `GITLAB_TOKEN`. See [Authentication](/en-US/docs/guide/authentication).

## Notes

- Downloads to `.grekt/artifacts/<artifact-id>/`
- Updates `grekt.yaml` and `grekt.lock`
- Run `grekt sync` after adding
- Deprecated versions show a warning but still install
