# Publishing

Upload artifacts to a registry.

::: info BEFORE YOU START
If publishing to a private registry, configure `.grekt/config.yaml` first. This file stores your registry settings and tokens locally (gitignored).

```bash
grekt config registry set @scope
```
:::

## Manifest requirements

Your artifact needs a `grekt.yaml` with these fields:

```yaml
name: "@your-scope/my-artifact"
version: 1.0.0
description: What this artifact does
keywords:
  - keyword1
  - keyword2
  - keyword3
```

The `name` must include a scope (`@scope/name`) for publishing. The scope determines which registry to use.

## Keywords

Keywords are **required** for publishing (3-5). They enable discoverability in the artifact index.

If you need help generating keywords, see [Generating keywords](#generating-keywords) below.

## Publish

```bash
grekt publish ./path/to/artifact
```

### What happens

1. **Validates manifest** — Checks required fields in `grekt.yaml`
2. **Creates tarball** — Packages files into `.grekt/tmp/`
3. **Checks uniqueness** — Fails if version already exists
4. **Uploads** — Sends to configured registry
5. **Cleans up** — Removes the temporary tarball

### Pack only

To create a tarball without publishing, use [grekt pack](/en-US/api/pack):

```bash
grekt pack ./my-artifact
# Output: .grekt/tmp/@author-my-artifact.tar.gz
```

Useful for inspecting what gets packaged or distributing through other channels.

## Registry routing

grekt determines where to publish based on the scope in your artifact's `name`:

1. Extracts scope from `name` (e.g., `@myteam` from `@myteam/agent-tools`)
2. Checks `.grekt/config.yaml` for a registry matching that scope
3. If found, publishes to that registry (e.g., GitLab)

Example with GitLab registry:

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

## Generating keywords

If your manifest doesn't have keywords, you have several options:

**Option 1: Add manually**

Write keywords directly in your `grekt.yaml`.

**Option 2: Ask your AI assistant**

Ask your AI assistant: "Generate keywords for my artifact based on its description"

**Option 3: Use grekt-keywords**

A separate package for generating keywords automatically:

```bash
pip install grekt-keywords --index-url https://download.pytorch.org/whl/cpu
grekt-keywords --json "Your artifact description here"
```

The first run downloads a small ML model (~80MB). Subsequent runs work offline.

## Monorepo

For publishing multiple artifacts from a single repository, see [Monorepo](/en-US/docs/guide/managing/monorepo).

## Related

- [grekt pack](/en-US/api/pack) — Create tarball without publishing
- [grekt publish](/en-US/api/publish) — Command reference
- [GitLab](/en-US/docs/guide/sources/gitlab) — GitLab registry setup
- [Versioning](/en-US/docs/guide/managing/versioning) — Version management
- [Monorepo](/en-US/docs/guide/managing/monorepo) — Multiple artifacts in one repo
