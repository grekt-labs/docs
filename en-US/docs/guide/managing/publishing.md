---
description: "How to publish an artifact to a grekt registry, including required manifest fields and publish command usage."
---

# Publishing

Upload artifacts to a registry.

## Manifest requirements

Your artifact needs a `grekt.yaml`. For full details on artifact structure, see [Artifacts](/en-US/docs/guide/artifacts).

The required fields for publishing are:

```yaml
name: "@your-scope/my-artifact"
version: 1.0.0
description: What this artifact does
keywords:             # required (3-5)
  - keyword1
  - keyword2
  - keyword3
license: "MIT"                                      # optional
repository: "https://your-repo.com/you/my-artifact"    # optional
```

The `name` must include a scope (`@scope/name`). Your username is your scope, so if your username is `masterchief`, your artifacts are `@masterchief/my-artifact`.

`license` and `repository` are optional. When provided, they are shown on the artifact detail page in the registry.

::: warning KEYWORDS ARE REQUIRED
Publishing will fail without 3 to 5 keywords. They are used for indexing and discoverability. If you need help generating them, see [Generating keywords](#generating-keywords).
:::

## Publish

```bash
grekt publish ./path/to/artifact
```

This publishes to the grekt public registry by default. No extra configuration needed. If you have multiple artifacts to manage, see [Monorepo](#monorepo).

### What happens

1. **Validates manifest** - Checks required fields in `grekt.yaml`
2. **Creates tarball** - Packages files into `.grekt/tmp/`
3. **Checks uniqueness** - Fails if version already exists
4. **Uploads** - Sends to the registry
5. **Cleans up** - Removes the temporary tarball

### Pack only

To create a tarball without publishing, use [grekt pack](/en-US/api/pack):

```bash
grekt pack ./my-artifact
# Output: .grekt/tmp/@author-my-artifact.tar.gz
```

Useful for inspecting what gets packaged or distributing through other channels.

## Custom registries

::: info
If you just want to publish to the grekt public registry, skip this section. Custom registries are only needed for self-hosted or platform-specific setups (GitLab, GitHub, etc).
:::

grekt determines where to publish based on the scope in your artifact's `name`:

1. Extracts scope from `name` (e.g., `@myteam` from `@myteam/agent-tools`)
2. Checks `.grekt/config.yaml` for a registry matching that scope
3. If found, publishes to that registry instead of the public one

To configure a custom registry:

```bash
grekt config registry set @scope
```

This stores registry settings and tokens in `.grekt/config.yaml` (gitignored).

Example with GitLab:

```yaml
# .grekt/config.yaml
registries:
  "@myteam":
    type: gitlab
    project: myteam/artifacts
```

```yaml
# grekt.yaml
name: "@myteam/agent-tools"    # → publishes to GitLab (@myteam registry)
version: 1.0.0
```

For platform-specific setup, see [GitLab](/en-US/docs/guide/sources/gitlab) or [GitHub](/en-US/docs/guide/sources/github).

## Generating keywords

If your manifest doesn't have keywords, you have several options:

**Option 1: Add manually**

Write keywords directly in your `grekt.yaml`.

**Option 2: Ask your AI assistant**

Ask your AI assistant: "Generate keywords for my artifact based on its description"

**Option 3: Use grekt-keywords**

A Python tool for generating keywords automatically:

```bash
pip install grekt-keywords --index-url https://download.pytorch.org/whl/cpu
grekt-keywords --json "Your artifact description here"
```

The first run downloads a small ML model (~80MB). Subsequent runs work offline.

## Monorepo

For publishing multiple artifacts from a single repository, see [Monorepo](/en-US/docs/guide/managing/monorepo).

## Related

- [grekt pack](/en-US/api/pack) - Create tarball without publishing
- [grekt publish](/en-US/api/publish) - Command reference
- [GitLab](/en-US/docs/guide/sources/gitlab) - GitLab registry setup
- [Versioning](/en-US/docs/guide/managing/versioning) - Version management
- [Monorepo](/en-US/docs/guide/managing/monorepo) - Multiple artifacts in one repo
