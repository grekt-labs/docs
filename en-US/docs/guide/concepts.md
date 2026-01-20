# Core Concepts

grekt manages AI tool configurations through a simple but powerful model: **artifacts** contain **agents, skills, and commands** that sync to **targets**.

## Artifacts

An artifact is a collection of related AI configurations published under a scoped name like `@author/artifact-name`. Artifacts are stored in the `grekts/` directory.

### Artifact Structure

```
grekts/@author/artifact-name/
├── grekt.yaml           # Artifact manifest
├── agent.md             # Optional: Main agent definition
├── skills/
│   ├── testing.md
│   └── debugging.md
└── commands/
    └── review.md
```

### Artifact Manifest

Every artifact has a `grekt.yaml` manifest:

```yaml
name: "@author/artifact-name"
author: "Author Name"
version: "1.0.0"
description: "What this artifact does"
```

## Components

Artifacts contain three types of components:

### Agents

Agents are AI personas with specific capabilities. They define how the AI should behave for certain tasks.

```markdown
---
type: agent
name: code-reviewer
description: Expert code reviewer focused on best practices
---

You are an expert code reviewer. Focus on:
- Code quality and readability
- Performance implications
- Security vulnerabilities
- Best practices
```

### Skills

Skills are reusable capabilities that agents can use. They're modular pieces of knowledge or behavior.

```markdown
---
type: skill
name: testing
description: Knowledge about testing patterns
agent: code-reviewer
---

When reviewing tests:
- Check for edge cases
- Verify mocking is appropriate
- Ensure assertions are meaningful
```

### Commands

Commands are specific actions users can invoke. They're typically slash commands.

```markdown
---
type: command
name: review
description: Review code changes
---

/review - Analyze the current changes and provide feedback
```

## Frontmatter

All components use YAML frontmatter to define metadata:

| Field | Required | Description |
|-------|----------|-------------|
| `type` | Yes | `agent`, `skill`, or `command` |
| `name` | Yes | Unique identifier |
| `description` | Yes | What it does |
| `agent` | No | Parent agent (for skills) |

## Targets

Targets are AI tools that grekt can sync to. Each target has its own configuration format, and grekt handles the translation.

### Supported Targets

| Target | Directory/File | Description |
|--------|---------------|-------------|
| `claude` | `.claude/` | Claude Code and Claude Desktop |
| `cursor` | `.cursorrules` | Cursor IDE |

### How Sync Works

When you run `grekt sync`:

1. **Read** installed artifacts from `grekts/installed.yaml`
2. **Transform** components to target-specific format
3. **Write** to target locations

#### Claude Sync

Creates organized directories:

```
.claude/
├── agents/
│   └── code-reviewer.md
├── skills/
│   └── testing.md
├── commands/
│   └── review.md
└── CLAUDE.md              # Generated index
```

#### Cursor Sync

Updates the `.cursorrules` file with metadata pointing to installed artifacts.

## Lockfile

The `grekt.lock` file tracks exact versions and checksums of installed artifacts:

```yaml
version: 1
artifacts:
  "@author/artifact-name":
    version: "1.0.0"
    checksum: "sha256:abc123..."
    source: "github:author/repo/@author/artifact-name"
```

This ensures:
- **Reproducible installs** across machines
- **Integrity verification** via checksums
- **Version tracking** for updates

## Installed Index

The `grekts/installed.yaml` file tracks what's installed and where components are located:

```yaml
version: 1
artifacts:
  "@author/artifact-name":
    version: "1.0.0"
    agent: "agent.md"
    skills:
      - "skills/testing.md"
      - "skills/debugging.md"
    commands:
      - "commands/review.md"
```

## Non-destructive Sync

grekt uses a non-destructive sync approach:

- **Preserves manual changes** in target files
- **Marks managed sections** with special comments
- **Preview with `--dry-run`** before applying changes

This means you can safely add your own configurations alongside grekt-managed content.
