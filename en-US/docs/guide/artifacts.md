# Artifacts

An artifact is a package containing AI configurations: agents, skills, commands...

## Structure

```
.grekt/artifacts/code-review/
├── grekt.yaml        # Manifest (required)
├── agent.md          # Agent definition
├── skills/
│   └── testing.md
└── commands/
    └── review.md
```

## Manifest

Every artifact needs a `grekt.yaml`:

```yaml
name: "code-review"
author: "grekt"
version: "1.0.0"
description: "Code review assistant"
```

## Components

### Agents

AI personas with specific behaviors:

```markdown
---
type: agent
name: code-reviewer
description: Expert code reviewer
---

You are an expert code reviewer. Focus on:
- Code quality
- Security vulnerabilities
- Best practices
```

### Skills

Reusable capabilities for agents:

```markdown
---
type: skill
name: testing
description: Testing patterns knowledge
agent: code-reviewer
---

When reviewing tests, check for edge cases and meaningful assertions.
```

### Commands

User-invokable actions:

```markdown
---
type: command
name: review
description: Review code changes
---

/review - Analyze changes and provide feedback
```

## Frontmatter

| Field | Required | Description |
|-------|----------|-------------|
| `type` | Yes | `agent`, `skill`, or `command` |
| `name` | Yes | Unique identifier |
| `description` | Yes | What it does |
| `agent` | No | Parent agent (for skills) |

## Project Files

### grekt.yaml

Project configuration:

```yaml
targets:
  - claude
autoSync: false
artifacts:
  code-review: "1.0.0"
```

### grekt.lock

Lockfile with exact versions and checksums:

```yaml
version: 1
artifacts:
  code-review:
    version: "1.0.0"
    integrity: "sha256:abc123..."
    source: "github:grekt/code-review"
    files:
      "agent.md": "sha256:def456..."
```

Ensures reproducible installs and integrity verification.
