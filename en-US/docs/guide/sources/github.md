# GitHub

Install artifacts directly from GitHub repositories.

## Usage

```bash
# Latest from default branch
grekt add github:owner/repo

# Specific tag
grekt add github:owner/repo#v1.0.0

# Specific branch
grekt add github:owner/repo#main

# Specific commit
grekt add github:owner/repo#abc1234
```

## Examples

```bash
grekt add github:grekt-labs/committer
grekt add github:grekt-labs/committer#v1.2.0
```

## Limitations

GitHub only supports **one artifact per repository**. The entire repository is downloaded as the artifact.

| Feature | GitHub |
|---------|--------|
| Artifacts per repo | 1 |
| Version listing | No |
| Deprecation | No |
| `grekt info` | No |
| `grekt versions` | No |

For multiple artifacts in one project, use [GitLab](/en-US/docs/guide/sources/gitlab) which supports monorepo via Generic Package Registry.

## Authentication

For private repositories on github.com:

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

Required scopes: `repo`

::: tip
For permanent configuration, use `grekt config token set`.
:::

## Related

- [Overview](/en-US/docs/guide/sources/overview) — Sources overview
- [GitLab](/en-US/docs/guide/sources/gitlab) — Monorepo support
- [Authentication](/en-US/docs/guide/sources/authentication) — Full auth guide
