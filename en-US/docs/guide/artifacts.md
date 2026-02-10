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
license: "MIT"
repository: "https://your-repo.com/your-org/code-review"
```

**Name formats:**
- `@scope/name` — Scoped name (required for publishing). The scope determines which registry to use.
- `name` — Unscoped name (local use only, cannot be published)

Keywords (3-5) are required for publishing. `license` and `repository` are optional but recommended — they are displayed on the artifact detail page in the registry.

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

Reusable capabilities that can be invoked on demand:

```markdown
---
grk-type: skills
grk-name: testing
grk-description: Testing patterns knowledge
grk-agents: code-reviewer
---

When reviewing tests, check for edge cases and meaningful assertions.
```

::: warning Skills with direct invocation in lazy mode
[LAZY mode](/en-US/docs/guide/sync-modes) skills live outside your AI tool's directories, so `/skill` invocations won't work directly. Use the `/grekt` skill, available after running `grekt init`, to discover and load them on demand.

See the [full guide](/en-US/docs/guide/skill-router) for usage, token cost, and plugin authoring.
:::

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

### MCPs <Badge type="warning" text="Beta" />

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

### Hooks <Badge type="warning" text="Beta" />

::: warning Compatibility
Hooks are currently only supported by **Claude**. Other targets will ignore hook components.
:::

Lifecycle hooks that get installed into the target tool's settings. Hooks run shell commands at specific events (e.g. after a file is edited, before a tool is used). They are defined as JSON files:

```json
{
  "grk-type": "hooks",
  "grk-name": "format-on-save",
  "grk-description": "Auto-format files after edit",
  "target": "claude",
  "events": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "./format.sh"
          }
        ]
      }
    ]
  }
}
```

| Field | Description |
|-------|-------------|
| `target` | Which tool this hook is for (currently only `claude`) |
| `events` | Map of event names to hook definitions |
| `matcher` | Regex pattern to match tool names |
| `command` | Shell command to run (relative paths are resolved to the artifact directory) |

Hooks are **not** synced like other components. They are installed into the target's settings file (e.g. `.claude/settings.json`) when you run `grekt add`, and removed when you run `grekt remove`. During installation, grekt will show you what each hook does and ask for confirmation before modifying any settings.

Referenced scripts (like `format.sh` in the example) should be included in the artifact alongside the hook JSON file.

## Frontmatter

All component files use `grk-` prefixed properties to avoid collisions with other tools' frontmatter.

| Field | Required | Description |
|-------|----------|-------------|
| `grk-type` | Yes | `agents`, `skills`, `commands`, `mcps`, `rules`, or `hooks` |
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
