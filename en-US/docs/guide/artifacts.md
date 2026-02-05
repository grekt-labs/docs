# Artifacts

An artifact is a bundle of AI configurations: agents, skills, commands, MCPs, rules...

::: tip File organization
You can organize files however you want. The `grk-type` field in frontmatter defines what each file is — not its location. A file in `tools/linter.md` can be an agent, a skill, or anything else based on its frontmatter.
:::

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

Artifacts are stored in `.grekt/artifacts/` after installation.

## Manifest

Every artifact needs a `grekt.yaml`:

```yaml
name: "@your-scope/code-review"
version: "1.0.0"
description: "Code review assistant"
keywords:
  - code
  - review
  - quality
```

**Name formats:**
- `@scope/name` — Scoped name (required for publishing). The scope determines which registry to use.
- `name` — Unscoped name (local use only, cannot be published)

Keywords (3-5) are required for publishing.

## Components

### Agents

AI personas with specific behaviors:

```markdown
---
grk-type: agents
grk-name: code-reviewer
grk-description: Expert code reviewer
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
grk-type: skills
grk-name: testing
grk-description: Testing patterns knowledge
grk-agents: code-reviewer
---

When reviewing tests, check for edge cases and meaningful assertions.
```

### Commands

User-invokable actions:

```markdown
---
grk-type: commands
grk-name: review
grk-description: Review code changes
---

/review - Analyze changes and provide feedback
```

### MCPs

MCP server configurations (JSON format):

```json
{
  "grk-type": "mcps",
  "grk-name": "database",
  "grk-description": "Database MCP server",
  "config": { ... }
}
```

### Rules

Reusable rules and guidelines:

```markdown
---
grk-type: rules
grk-name: code-style
grk-description: Code style guidelines
---

Follow these coding conventions...
```

## Frontmatter

All component files use `grk-` prefixed properties to avoid collisions with other tools' frontmatter.

| Field | Required | Description |
|-------|----------|-------------|
| `grk-type` | Yes | `agents`, `skills`, `commands`, `mcps`, or `rules` |
| `grk-name` | Yes | Unique identifier |
| `grk-description` | Yes | What it does |
| `grk-agents` | No | Parent agent (for skills/commands) |

## Project files

### grekt.yaml

Project configuration:

```yaml
targets:
  - claude
artifacts:
  "@scope/utils": "1.0.0"              # LAZY mode (default)
  "@scope/my-artifact":
    version: "1.0.0"
    mode: core                          # CORE mode
```

### grekt.lock

Lockfile with exact versions and checksums. Generated automatically, do not edit.

### .grekt/index

Index of all installed artifacts. Used by AI tools for discovery. Generated automatically.
