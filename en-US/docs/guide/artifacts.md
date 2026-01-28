# Artifacts

An artifact is a package containing AI configurations: agents, skills, commands, MCPs, rules...

## Structure

Only `grekt.yaml` is required. Organize files however you want:

```
my-artifact/
├── grekt.yaml        # Manifest (required)
├── agent.md
├── review-skill.md
└── tools/
    ├── linter.md
    └── mcp.json
```

The `type` field in frontmatter defines what each file is, not its location.

Artifacts are stored in `.grekt/artifacts/` after installation.

## Manifest

Every artifact needs a `grekt.yaml`:

```yaml
name: "code-review"
author: "grekt"
version: "1.0.0"
description: "Code review assistant"
keywords:
  - code
  - review
  - quality
```

Keywords (3-5) are required for publishing.

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

### MCPs

MCP server configurations (JSON format):

```json
{
  "type": "mcp",
  "name": "database",
  "description": "Database MCP server",
  "config": { ... }
}
```

### Rules

Reusable rules and guidelines:

```markdown
---
type: rule
name: code-style
description: Code style guidelines
---

Follow these coding conventions...
```

## Frontmatter

| Field | Required | Description |
|-------|----------|-------------|
| `type` | Yes | `agent`, `skill`, `command`, `mcp`, or `rule` |
| `name` | Yes | Unique identifier |
| `description` | Yes | What it does |
| `agent` | No | Parent agent (for skills/commands) |

## Project files

### grekt.yaml

Project configuration:

```yaml
targets:
  - claude
artifacts:
  "@grekt/utils": "1.0.0"              # LAZY mode (default)
  "@grekt/code-review":
    version: "1.0.0"
    mode: core                          # CORE mode
```

### grekt.lock

Lockfile with exact versions and checksums. Generated automatically, do not edit.

### .grekt/index

Index of all installed artifacts. Used by AI tools for discovery. Generated automatically.
