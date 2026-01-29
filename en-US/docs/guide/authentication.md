# Authentication

Credentials for registry operations and private repos.

::: info Project Required
All authentication commands require a grekt project. Run `grekt init` first.
:::

## Registry login

::: warning COMING SOON
The public grekt registry is not yet available. Currently, only GitLab and self-hosted registries are supported, and they use token-based authentication (see below).
:::

For publishing and other registry operations on the public grekt registry.

```bash
# Interactive login (opens browser)
grekt login

# Check current user
grekt whoami

# Logout
grekt logout
```

Session is saved to `.grekt/config.yaml` in your project.

## Private sources & registries

For authentication with Git sources (github:, gitlab:) and self-hosted registries, configure tokens in `.grekt/config.yaml`:

```yaml
# Registry backends (for @scope/name artifacts)
registries:
  "@myteam":
    type: gitlab
    project: myteam/artifacts
    token: glpat-xxxxxxxxxxxx

# Git source tokens (for github: and gitlab: sources)
tokens:
  github: ghp_xxxxxxxxxxxx
  gitlab.com: glpat-xxxxxxxxxxxx
```

::: tip Platform env vars
If you already have `GITHUB_TOKEN` or `GITLAB_TOKEN` set, grekt will use them automatically as fallback.
:::

For more details, see [Registry Authentication](/en-US/docs/guide/registries/authentication).
