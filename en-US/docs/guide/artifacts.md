---
description: "Learn what artifacts are in grekt: bundles of AI configurations including agents, skills, commands, MCPs, and rules."
---

# Artifacts

An artifact is a bundle of AI configurations: agents, skills, commands, MCPs, rules...

::: tip File organization
You can organize files however you want. The `grk-type` field in frontmatter defines what each file is - not its location. A file in `tools/linter.md` can be an agent, a skill, or anything else based on its frontmatter.
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
- `@scope/name` - Scoped name (required for publishing). The scope determines which registry to use.
- `name` - Unscoped name (local use only, cannot be published)

Keywords (3-5) are required for publishing. `license` and `repository` are optional but recommended - they are displayed on the artifact detail page in the registry.

## Components

### Agents

AI personas with specific behaviors:

```markdown
---
grk-type: agents
name: code-reviewer
description: Expert code reviewer
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
name: testing
description: Testing patterns knowledge
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
name: review
description: Review code changes
---

/review - Analyze changes and provide feedback
```

### MCPs <Badge type="warning" text="Beta" />

MCP server configurations (JSON format):

```json
{
  "grk-type": "mcps",
  "name": "database",
  "description": "Database MCP server",
  "config": { ... }
}
```

### Rules

Reusable rules and guidelines:

```markdown
---
grk-type: rules
name: code-style
description: Code style guidelines
---

Follow these coding conventions...
```

### Hooks <Badge type="warning" text="Beta" />

::: warning Compatibility
Hooks are currently only supported by **Claude**. Other targets will ignore hook components.
:::

Lifecycle hooks that get installed into the target tool's settings. Hooks run shell commands, prompts, or agents at specific events (e.g. after a file is edited, before a tool is used). They follow the [Claude Code hooks specification](https://docs.anthropic.com/en/docs/claude-code/hooks). Defined as JSON files:

```json
{
  "grk-type": "hooks",
  "name": "format-on-save",
  "description": "Auto-format files after edit",
  "target": "claude",
  "hooks": {
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
| `hooks` | Map of event names to hook definitions (follows Claude Code format) |
| `matcher` | Regex pattern to filter when a definition fires (optional) |
| `hooks[].hooks` | Array of hook entries: `command`, `prompt`, or `agent` type |

Hooks are **not** synced like other components. They are installed into the target's settings file (e.g. `.claude/settings.json`) when you run `grekt add`, and removed when you run `grekt remove`. During installation, grekt will show you what each hook does and ask for confirmation before modifying any settings.

Script files (like `format.sh`) placed alongside the hook JSON are automatically copied to `.claude/hooks/` during installation. For best practices on naming and structuring hooks, see [Publishing hooks](/en-US/docs/guide/managing/hooks).

## Frontmatter

| Field | Required | Description |
|-------|----------|-------------|
| `grk-type` | Yes | `agents`, `skills`, `commands`, `mcps`, `rules`, or `hooks` |
| `name` | Yes | Unique identifier |
| `description` | Yes | What it does |

::: tip Why grk-type?
`grk-type` uses the `grk-` prefix to avoid collisions with other tools' frontmatter.
:::

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
    mode: core                          # CORE mode (copied)
  "@scope/dev-tools":
    version: "1.0.0"
    mode: core-sym                      # CORE mode (symlinked)
```

### grekt.lock

Lockfile with exact versions and checksums. Generated automatically, do not edit.

### .grekt/index

Index of all installed artifacts. Used by AI tools for discovery. Generated automatically.
