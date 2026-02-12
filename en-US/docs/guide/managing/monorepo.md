# Monorepo

Manage multiple artifacts in a single repository.

## Workspace vs Registry prefix

Workspace coordinates **local operations** (batch publish). Registry prefix affects **remote naming** (package names in the registry). These solve different problems and can be used independently or together.

### Workspace

**Problem**: You have 5 artifacts in your repo. Running `grekt publish` 5 times is tedious.

**Solution**: Define a workspace, then `grekt publish --changed` publishes all at once.

```yaml
# grekt-workspace.yaml
workspaces:
  - "packages/*"
```

### Registry prefix

**Problem**: You have 2 scopes (`@acme-web`, `@acme-api`) but only one registry project. Without prefixes, `@acme-web/utils` and `@acme-api/utils` would both try to create a package named `utils`.

**Solution**: Add a `prefix` to avoid naming collisions.

```yaml
# .grekt/config.yaml
registries:
  "@acme-web":
    project: acme/artifacts
    prefix: web      # → package name: web-utils
  "@acme-api":
    project: acme/artifacts
    prefix: api      # → package name: api-utils
```

::: tip
The `prefix` is just a string prepended to package names. It doesn't need to match any folder in your git repo.
:::

::: warning Immutable after first publish
Once you publish with or without a prefix, you cannot change it. Adding, removing, or modifying the prefix will cause grekt to look for different package names in the registry.
:::

### Independence

These configs don't know about each other. You can use:
- Only workspace (each scope has its own registry project)
- Only prefix (one artifact, but avoiding collisions)
- Both together

## Setup

Create `grekt-workspace.yaml` at your repository root:

```yaml
workspaces:
  - "backend/*"
  - "frontend/*"
```

Each glob pattern points to directories containing artifacts.

## Structure

```
my-monorepo/
├── grekt-workspace.yaml
├── backend/
│   ├── auth-rules/
│   │   └── grekt.yaml      # @myorg/auth-rules
│   └── api-rules/
│       └── grekt.yaml      # @myorg/api-rules
└── frontend/
    └── ui-rules/
        └── grekt.yaml      # @myorg/ui-rules
```

Each artifact has its own `grekt.yaml` with independent versioning.

## Commands

### List artifacts

```bash
grekt workspace list
```

Shows all artifacts discovered in the workspace.

### Version with external tools

Use `--exec` to integrate with versioning tools like [changesets](https://github.com/changesets/changesets):

```bash
grekt version --exec "npx changeset version"
```

This:
1. Generates temporary `package.json` files (for changeset compatibility)
2. Runs your command
3. Syncs versions back to `grekt.yaml`
4. Cleans up temporary files

### Publish changed artifacts

```bash
grekt publish --changed
```

Publishes only artifacts where local version > registry version.

Preview without publishing:

```bash
grekt publish --changed --dry-run
```

## CI workflow

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
      - uses: oven-sh/setup-bun@v1

      - run: bun install
      - run: |
          grekt version --exec "npx changeset version"
          grekt publish --changed
```

## Versioning tools

grekt is agnostic to versioning tools. Use whatever fits your workflow:

- [changesets](https://github.com/changesets/changesets) - Changelog management
- [release-it](https://github.com/release-it/release-it) - Generic release automation
- Manual - `grekt version patch` per artifact

::: info Compatibility layer
Most versioning tools only support `package.json`, not `grekt.yaml`. The `--exec` flag generates temporary `package.json` files as a bridge. These are never committed - grekt syncs versions back to `grekt.yaml` and cleans up automatically.
:::

## Full example

Combining workspace and registry prefix:

```
acme-ai/
├── grekt-workspace.yaml
├── .grekt/
│   └── config.yaml
├── web/
│   ├── components/
│   │   └── grekt.yaml      # @acme-web/components
│   └── rules/
│       └── grekt.yaml      # @acme-web/rules
└── api/
    └── helpers/
        └── grekt.yaml      # @acme-api/helpers
```

`grekt-workspace.yaml`:
```yaml
workspaces:
  - "web/*"
  - "api/*"
```

`.grekt/config.yaml`:
```yaml
registries:
  "@acme-web":
    type: gitlab
    project: acme/ai-artifacts
    prefix: web
  "@acme-api":
    type: gitlab
    project: acme/ai-artifacts
    prefix: api
```

Result:
- Both scopes publish to one GitLab project (`acme/ai-artifacts`)
- Package names: `web-components`, `web-rules`, `api-helpers`
- `grekt publish --changed` publishes all updated artifacts at once

## Related

- [grekt workspace](/en-US/api/workspace) - Command reference
- [grekt version](/en-US/api/version) - Version bumping
- [grekt publish](/en-US/api/publish) - Publishing artifacts
- [Registry prefix](/en-US/docs/guide/sources/gitlab#monorepo-organization) - Registry organization
