# grekt add

Add an artifact from the registry.

## Usage

```bash
grekt add <artifact-id>
```

## Description

Downloads and installs an artifact from the registry. The artifact is saved to `grekts/` and registered in `installed.yaml` and `grekt.lock`.

By default, artifacts are downloaded from grekt's public registry. You can configure a custom registry in `.grekt/config.yaml`.

## Arguments

| Argument | Description |
|----------|-------------|
| `artifact-id` | Artifact identifier (e.g., `@grekt/code-reviewer`) |

## Examples

### Add an artifact

```bash
grekt add @grekt/code-reviewer
```

### Add from a scoped namespace

```bash
grekt add @myorg/testing-agent
```

## What happens

1. **Downloads** artifact tarball from the registry
2. **Extracts** to `grekts/@scope/artifact-name/`
3. **Parses** `grekt.yaml` manifest
4. **Scans** for components (agents, skills, commands)
5. **Updates** `grekts/installed.yaml`
6. **Updates** `grekt.lock` with version and checksums

## Artifact structure

Artifacts must have a `grekt.yaml` manifest:

```yaml
name: "@scope/artifact-name"
author: "Author Name"
version: "1.0.0"
description: "Artifact description"
```

And contain `.md` files with frontmatter:

```markdown
---
type: agent
name: my-agent
description: What this agent does
---

Agent content here...
```

## Output files

### `grekts/installed.yaml`

```yaml
version: 1
artifacts:
  "@scope/artifact-name":
    version: "1.0.0"
    agent: "agent.md"
    skills:
      - "skills/skill1.md"
    commands:
      - "commands/cmd1.md"
```

### `grekt.lock`

```yaml
version: 1
artifacts:
  "@scope/artifact-name":
    version: "1.0.0"
    integrity: "sha256:abc123..."
    source: "github:owner/repo/@scope/artifact-name"
    files:
      "grekt.yaml": "sha256:def456..."
      "agent.md": "sha256:789abc..."
      "skills/skill1.md": "sha256:012def..."
```

The `files` field contains SHA256 checksums for each file, enabling drift detection with `grekt check`.

## Notes

- Requires internet connection to download from the registry
- Artifact is downloaded to `grekts/@scope/artifact-name/`
- Run `grekt sync` after adding to sync to your AI tools
- Configure a custom registry with `grekt config set registry <url>`
