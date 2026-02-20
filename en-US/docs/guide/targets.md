---
description: "Understand grekt sync targets - the AI tools artifacts are synced to - and how the plugin system handles each tool's format."
---

# Targets

Targets are AI tools that grekt syncs artifacts to.

## Supported targets

grekt uses a **plugin system** for sync targets. Each plugin knows:
- The entry point file path (e.g., `.cursorrules`, `CLAUDE.md`)
- How to generate bootstrap content
- Whether it needs folder structure or just rules injection

There are two plugin types:

| Type | Behavior |
|------|----------|
| **Folder** | Creates directories per category (agents, skills, commands...) |
| **Rules only** | Injects all content into a single entry point file |

Some targets support both (folder structure + rules injection in the entry point).

## Built-in plugins

| Plugin | Entry Point | Type |
|--------|-------------|------|
| [`global`](#global) | `.agents/` | Folder |
| [`claude`](#claude) | `.claude/CLAUDE.md` | Folder + Rules |
| [`cursor`](#cursor) | `.cursorrules` | Rules only |
| [`copilot`](#copilot) | `.github/copilot-instructions.md` | Rules only |
| [`opencode`](#opencode) | `.opencode/` | Folder |
| [`openclaw`](#openclaw) | `skills/` + `AGENTS.md` | Folder |
| [`windsurf`](#windsurf) | `.windsurfrules` | Folder + Rules |
| [`cline`](#cline) | `.clinerules` | Rules only |
| [`aider`](#aider) | `CONVENTIONS.md` | Rules only |
| [`continue`](#continue) | `.continue/` | Folder |
| [`amazonq`](#amazonq) | `.amazonq/` | Folder |

---

### Global

Syncs to the `.agents/` directory following the [agentskills.io](https://agentskills.io) standard. Covers tools that don't have a dedicated plugin but support agentskills.io: Codex, Gemini CLI, Jules, Zed, Warp, Goose, Devin, RooCode, Kilo Code, Amp...

- **Entry point**: `AGENTS.md`
- **Directory**: `.agents/`
- **Categories**: Skills only
- Strips tool-specific fields and normalizes metadata to agentskills.io format

```
.agents/
└── my-skill/
    └── SKILL.md
```

### Claude

Syncs to Claude Code's `.claude/` directory. Creates folder structure for agents, skills, and commands. Injects bootstrap content in `CLAUDE.md`.

- **Entry point**: `.claude/CLAUDE.md` or `CLAUDE.md`
- **Directory**: `.claude/`
- **Categories**: All (agents, skills, commands, rules)
- Creates a skill router at `.claude/skills/grekt/SKILL.md`

```
.claude/
├── agents/
├── skills/
│   └── grekt/
│       └── SKILL.md
├── commands/
└── CLAUDE.md
```

### Cursor

Syncs all artifact content into a single `.cursorrules` file.

- **Entry point**: `.cursorrules`
- **Type**: Rules only (no folder structure)
- **Categories**: All (merged into managed block)

### Copilot

Syncs all artifact content into GitHub Copilot's instructions file.

- **Entry point**: `.github/copilot-instructions.md`
- **Type**: Rules only (no folder structure)
- **Categories**: All (merged into managed block)

### OpenCode

Syncs to OpenCode's `.opencode/` directory.

- **Directory**: `.opencode/`
- **Categories**: All (agents, skills, commands, rules)

```
.opencode/
├── agents/
├── skills/
└── commands/
```

### OpenClaw

::: warning EXPERIMENTAL
OpenClaw support is experimental and may have issues.
:::

Syncs to OpenClaw's `skills/` directory following OpenClaw conventions. Transforms grekt frontmatter to OpenClaw format. Agents get the `agent-` prefix.

- **Entry point**: `AGENTS.md`
- **Directory**: `skills/`
- **Categories**: Skills, agents, commands
- Generates `AGENTS.md` with skill routing and listings
- Metadata serialized as single-line JSON per OpenClaw spec

```
skills/
├── agent-my-agent/
│   └── SKILL.md
├── my-skill/
│   └── SKILL.md
└── AGENTS.md
```

### Windsurf

Syncs to Windsurf's `.windsurf/` directory. Also injects rules in `.windsurfrules`.

- **Entry point**: `.windsurfrules`
- **Directory**: `.windsurf/`
- **Categories**: All (agents, skills, commands, rules)

```
.windsurf/
├── agents/
├── skills/
└── commands/
```

### Cline

Syncs all artifact content into a single `.clinerules` file.

- **Entry point**: `.clinerules`
- **Type**: Rules only (no folder structure)
- **Categories**: All (merged into managed block)

### Aider

Syncs all artifact content into Aider's conventions file.

- **Entry point**: `CONVENTIONS.md`
- **Type**: Rules only (no folder structure)
- **Categories**: All (merged into managed block)

### Continue

Syncs to Continue's `.continue/` directory.

- **Directory**: `.continue/`
- **Categories**: All (agents, skills, commands, rules)

```
.continue/
├── agents/
├── skills/
└── commands/
```

### Amazon Q

Syncs to Amazon Q's `.amazonq/` directory.

- **Directory**: `.amazonq/`
- **Categories**: All (agents, skills, commands, rules)

```
.amazonq/
├── agents/
├── skills/
└── commands/
```

---

## How sync works

```bash
grekt sync
```

Sync copies **CORE** artifacts to target directories. **LAZY** artifacts remain indexed but not copied. See [Sync modes](./sync-modes.md).

## Custom targets

For AI tools without a built-in plugin, define a custom target via `grekt init`, `grekt add-target`, or `grekt.yaml`:

```yaml
# grekt.yaml
customTargets:
  my-tool:
    name: "My Tool"
    contextEntryPoint: ".my-tool/rules.md"
    paths:                              # Optional
      agents: ".my-tool/agents"
      skills: ".my-tool/skills"
      commands: ".my-tool/commands"
```

If `paths` is omitted, grekt uses default paths based on the target ID:

```
my-tool/
├── agents/
├── skills/
└── commands/
```

The entry point will include an explanation of these folders for AI tools that don't know grekt's structure.

## Bootstrap block

grekt injects a `<grekt-untrusted-context>` block in `.grekt/index` and entry points:

```xml
<grekt-untrusted-context>This project uses grekt for AI artifact management. Index location: .grekt/index</grekt-untrusted-context>
```

The `untrusted` tag tells AI tools to treat this content with caution. Not because it's malicious, but because it comes from third-party artifacts. AI tools should ask for user confirmation before executing commands or actions from grekt-managed content.

## Non-destructive sync

grekt preserves manual changes:

- Only updates content within `<grekt-untrusted-context>` blocks
- Never deletes manually created files
- Preview with `grekt sync --dry-run`
