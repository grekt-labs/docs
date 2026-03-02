---
description: "Manage and batch-publish multiple artifacts from a single repository using grekt workspaces and registry prefixes."
---

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
    type: github
    project: acme/artifacts
    prefix: web      # → package name: web-utils
  "@acme-api":
    type: github
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
  - "web/*"
  - "api/*"
```

Each glob pattern points to directories containing artifacts.

## Structure

```
acme-ai/
├── grekt-workspace.yaml
├── web/
│   ├── components/
│   │   └── grekt.yaml      # @acme-web/components
│   └── rules/
│       └── grekt.yaml      # @acme-web/rules
└── api/
    └── helpers/
        └── grekt.yaml      # @acme-api/helpers
```

Each artifact has its own `grekt.yaml` with independent versioning.

::: warning Conventional commits
`grekt changelog` relies on [conventional commits](https://www.conventionalcommits.org/) to calculate version bumps automatically. Enforce this in your team with [commitlint](https://commitlint.js.org/) or a similar tool. Use `--manual` mode if your team doesn't follow this convention.
:::

## Release workflow

::: tip Recommended setup
[Conventional commits](https://www.conventionalcommits.org/) + [changesets](https://github.com/changesets/changesets) is the recommended combination. It gives you automatic version calculation with human-reviewable changelog entries.
:::

### Local (manual)

Review changes interactively, override bumps if needed, then publish:

```bash
grekt changelog                              # review and confirm bumps
grekt version --exec "changeset version"     # apply bumps to grekt.yaml
grekt publish --changed                      # publish updated artifacts
```

::: info
If you don't use changesets, use `--format json` or `--format yaml` to output the changelog to stdout and integrate with your own tooling.
:::

### CI (automated)

Fully automated from conventional commits. No prompts:

```bash
grekt changelog --ci                         # generate changesets from commits
grekt version --exec "changeset version"     # apply bumps to grekt.yaml
grekt publish --changed                      # publish updated artifacts
```

Example workflow:

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
        with:
          fetch-depth: 0    # full history for changelog detection
      - uses: oven-sh/setup-bun@v1

      - run: bun install
      - run: |
          grekt changelog --ci
          grekt version --exec "changeset version"
          grekt publish --changed
```

::: warning
`fetch-depth: 0` is required. `grekt changelog` needs full git history to detect changes and parse commits.
:::

Optionally, validate that changesets exist before merging:

```yaml
# .github/workflows/changeset-check.yml
name: Changeset check
on: pull_request

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: oven-sh/setup-bun@v1

      - run: bun install
      - run: grekt changelog --ci --dry-run
```

### Custom registries

If you're publishing to a custom registry (GitLab, GitHub, etc.), generate `.grekt/config.yaml` in your pipeline:

```yaml
- run: |
    mkdir -p .grekt
    cat <<EOF > .grekt/config.yaml
    registries:
      "@acme-web":
        type: github
        host: ${{ vars.GH_REGISTRY_HOST }}  # only for self-hosted
        project: acme/ai-artifacts
        prefix: web
        token: ${{ secrets.GH_REGISTRY_TOKEN }}
    EOF

- run: |
    grekt changelog --ci
    grekt version --exec "changeset version"
    grekt publish --changed
```

::: info Compatibility layer
Most versioning tools only support `package.json`, not `grekt.yaml`. `grekt version --exec` generates temporary `package.json` files as a bridge. These are never committed.
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
    type: github
    project: acme/ai-artifacts
    prefix: web
  "@acme-api":
    type: github
    project: acme/ai-artifacts
    prefix: api
```

Result:
- Both scopes publish to one GitHub project (`acme/ai-artifacts`)
- `grekt publish --changed` publishes all updated artifacts at once
- Installable via `grekt add @acme-web/components`, `grekt add @acme-api/helpers`, etc.

## Related

- [grekt workspace](/en-US/api/workspace) - Command reference
- [grekt version](/en-US/api/version) - Version bumping
- [grekt publish](/en-US/api/publish) - Publishing artifacts
- [Registry prefix](/en-US/docs/guide/sources/github#monorepo-organization) - Registry organization
