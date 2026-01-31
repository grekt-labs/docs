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

Use interactive commands to configure authentication:

```bash
# Configure a registry backend for a scope
grekt config registry set @myteam

# Add a token for a git host (private repos)
grekt config token set
```

Or edit `.grekt/config.yaml` directly:

```yaml
# Registry backends (for @scope/name artifacts)
registries:
  "@myteam":
    type: gitlab
    host: gitlab.company.com
    project: myteam/artifacts
    token: glpat-xxxxxxxxxxxx

# Git source tokens (for github: and gitlab: sources)
tokens:
  github.com: ghp_xxxxxxxxxxxx
  gitlab.company.com: glpat-xxxxxxxxxxxx
```

::: tip Platform env vars
`GITHUB_TOKEN` and `GITLAB_TOKEN` work as fallback for `github.com` and `gitlab.com`. For self-hosted instances, use `grekt config token set`.
:::

For more details, see [Registry Authentication](/en-US/docs/guide/registries/authentication).
