# Monorepo

Manage multiple artifacts in a single repository.

## Workspace vs Registry folder

These are complementary features:

| Feature | Purpose | Config file |
|---------|---------|-------------|
| **Workspace** | Organize artifacts in your **git repo** | `grekt-workspace.yaml` |
| **Registry folder** | Organize artifacts in the **registry** | `.grekt/config.yaml` |

Use workspace when you have multiple artifacts in one git repo.
Use registry `folder` when multiple scopes publish to one registry project.

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

- [changesets](https://github.com/changesets/changesets) — Changelog management
- [release-it](https://github.com/release-it/release-it) — Generic release automation
- Manual — `grekt version patch` per artifact

::: info Compatibility layer
Most versioning tools only support `package.json`, not `grekt.yaml`. The `--exec` flag generates temporary `package.json` files as a bridge. These are never committed — grekt syncs versions back to `grekt.yaml` and cleans up automatically.
:::

## Full example

Combining workspace and registry folder:

```
my-monorepo/
├── grekt-workspace.yaml
├── .grekt/
│   └── config.yaml
├── frontend/
│   └── design-system/
│       └── grekt.yaml      # @myorg-frontend/design-system
└── backend/
    └── api-rules/
        └── grekt.yaml      # @myorg-backend/api-rules
```

`grekt-workspace.yaml`:
```yaml
workspaces:
  - "frontend/*"
  - "backend/*"
```

`.grekt/config.yaml`:
```yaml
registries:
  "@myorg-frontend":
    type: gitlab
    project: myorg/artifacts
    folder: frontend
  "@myorg-backend":
    type: gitlab
    project: myorg/artifacts
    folder: backend
```

Result:
- Both scopes publish to the same GitLab project
- Package names: `frontend-design-system`, `backend-api-rules`
- `grekt publish --changed` publishes all updated artifacts at once

## Related

- [grekt workspace](/en-US/api/workspace) — Command reference
- [grekt version](/en-US/api/version) — Version bumping
- [grekt publish](/en-US/api/publish) — Publishing artifacts
- [Registry folder](/en-US/docs/guide/sources/gitlab#monorepo-organization) — Registry organization
