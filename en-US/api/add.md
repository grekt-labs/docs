# grekt add

Add an artifact from a GitHub repository.

## Usage

```bash
grekt add <source>
```

## Description

Downloads and installs an artifact from GitHub. The artifact is saved to `grekts/` and registered in `installed.yaml` and `grekt.lock`.

## Arguments

| Argument | Description |
|----------|-------------|
| `source` | GitHub source (see formats below) |

## Source formats

### Short format

```bash
grekt add github:owner/repo/@scope/artifact-name
```

### URL format

```bash
grekt add https://github.com/owner/repo/tree/branch/path/@scope/artifact-name
```

## Examples

### Add from grekt-labs

```bash
grekt add github:grekt-labs/artifacts/@grekt/code-review
```

### Add from any GitHub repo

```bash
grekt add github:myorg/ai-tools/@myorg/testing-agent
```

### Add from a specific branch

```bash
grekt add https://github.com/user/repo/tree/develop/artifacts/@user/my-artifact
```

## What happens

1. **Validates** the source format
2. **Downloads** artifact files from GitHub API
3. **Parses** `grekt.yaml` manifest
4. **Scans** for components (agents, skills, commands)
5. **Updates** `grekts/installed.yaml`
6. **Updates** `grekt.lock` with version and checksum

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

- Requires internet connection to download from GitHub
- Uses GitHub API (rate limits may apply)
- Artifact is downloaded to `grekts/@scope/artifact-name/`
- Run `grekt sync` after adding to sync to your AI tools
