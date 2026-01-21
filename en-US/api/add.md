# grekt add

Add an artifact from registry, GitHub, or GitLab.

```bash
grekt add <source>
```

## Options

| Option | Description |
|--------|-------------|
| `-c, --choose` | Select which components to install |

## Source Formats

| Format | Example |
|--------|---------|
| Registry | `@author/name` |
| GitHub | `github:owner/repo` |
| GitHub (ref) | `github:owner/repo#v1.0.0` |
| GitLab | `gitlab:owner/repo` |
| GitLab (self-hosted) | `gitlab:host.com/owner/repo` |

## Examples

```bash
# Registry
grekt add @grekt/code-reviewer

# GitHub
grekt add github:user/my-artifact
grekt add github:user/my-artifact#v1.0.0

# GitLab
grekt add gitlab:group/my-artifact
grekt add gitlab:gitlab.company.com/team/artifact#main

# Select components
grekt add @grekt/git-flow --choose
```

## Authentication

For private repos, set `GITHUB_TOKEN` or `GITLAB_TOKEN`. See [Authentication](/en-US/docs/guide/authentication).

## Notes

- Downloads to `.grekt/artifacts/<artifact-id>/`
- Updates `grekt.yaml` and `grekt.lock`
- Run `grekt sync` after adding
