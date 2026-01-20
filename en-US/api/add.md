# grekt add

Add an artifact from the registry.

## Usage

```bash
grekt add <artifact-id>
```

## Description

Downloads and installs an artifact from the registry. The artifact is saved to `.grekt/artifacts/` and registered in `grekt.yaml` and `grekt.lock`.

By default, artifacts are downloaded from grekt's public registry. You can configure a custom registry in `grekt.yaml`.

## Arguments

| Argument | Description |
|----------|-------------|
| `artifact-id` | Artifact identifier (e.g., `code-reviewer`) |

## Examples

### Add an artifact

```bash
grekt add code-reviewer
```

### Add another artifact

```bash
grekt add testing-agent
```

## What happens

1. **Downloads** artifact tarball from the registry
2. **Extracts** to `.grekt/artifacts/<artifact-id>/`
3. **Parses** `grekt.yaml` manifest
4. **Scans** for components (agents, skills, commands)
5. **Updates** `grekt.yaml` with artifact version
6. **Updates** `grekt.lock` with version, checksums, and component paths

## Artifact structure

Artifacts must have a `grekt.yaml` manifest:

```yaml
name: "my-artifact"
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

### `grekt.yaml`

```yaml
targets:
  - claude
autoSync: false
artifacts:
  my-artifact: "1.0.0"
```

### `grekt.lock`

```yaml
version: 1
artifacts:
  my-artifact:
    version: "1.0.0"
    integrity: "sha256:abc123..."
    source: "registry:my-artifact"
    files:
      "grekt.yaml": "sha256:def456..."
      "agent.md": "sha256:789abc..."
      "skills/skill1.md": "sha256:012def..."
    agent: "agent.md"
    skills:
      - "skills/skill1.md"
    commands:
      - "commands/cmd1.md"
```

The `files` field contains SHA256 checksums for each file, enabling drift detection with `grekt check`.

## Notes

- Requires internet connection to download from the registry
- Artifact is downloaded to `.grekt/artifacts/<artifact-id>/`
- Run `grekt sync` after adding to sync to your AI tools
- Configure a custom registry with `grekt config set registry <url>`
