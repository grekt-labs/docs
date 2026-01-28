# Publishing

Upload artifacts to the registry.

## Manifest requirements

Your artifact needs a `grekt.yaml` with these fields:

```yaml
name: my-artifact
author: your-name
version: 1.0.0
description: What this artifact does
keywords:
  - keyword1
  - keyword2
  - keyword3
```

The artifact ID becomes `@author/name` (e.g., `@your-name/my-artifact`).

## Keywords

Keywords are **required** for publishing. They enable discoverability in the artifact index.

- **Minimum:** 3 keywords
- **Maximum:** 5 keywords

### Generating keywords

If your manifest doesn't have keywords, you have three options:

**Option 1: Use grekt-keywords (recommended for frequent publishers)**

```bash
# Install (CPU-only, ~300MB)
pip install grekt-keywords --index-url https://download.pytorch.org/whl/cpu

# Generate keywords from your description
grekt-keywords --json "Your artifact description here"
# ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
```

The first run downloads a small ML model (~80MB) from Hugging Face Hub. Subsequent runs work offline using the cached model.

**Option 2: Use @grekt/tools agent**

```bash
grekt add @grekt/tools
```

Then ask your AI assistant: "Generate keywords for my artifact"

**Option 3: Add manually**

Write keywords directly in your `grekt.yaml`.

## Publishing

::: code-group

```bash [Public registry]
# Requires grekt login
grekt login
grekt publish ./path/to/artifact
```

```bash [GitLab / GitHub]
# Uses GITLAB_TOKEN, GITHUB_TOKEN, or config
grekt publish ./path/to/artifact
```

:::

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

grekt determines where to publish based on the `author` field in your manifest:

1. Checks `.grekt/config.yaml` for a registry matching `@author`
2. If found, publishes to that backend (e.g., GitLab)
3. If not found, publishes to public registry (`registry.grekt.com`)

Example with GitLab backend:

```yaml
# .grekt/config.yaml
registries:
  "@myteam":
    type: gitlab
    project: myteam/artifacts
```

```yaml
# grekt.yaml
name: agent-tools
author: "@myteam"    # → publishes to GitLab
version: 1.0.0
```

## Related

- [grekt pack](/en-US/api/pack) — Create tarball without publishing
- [grekt publish](/en-US/api/publish) — Command reference
- [GitLab registry](/en-US/docs/guide/registries/gitlab) — GitLab backend setup
- [Versioning](/en-US/docs/guide/managing/versioning) — Version management
