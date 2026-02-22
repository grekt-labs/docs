---
description: "Understand grekt sync targets, the AI tools artifacts are synced to, and how each tool's format is handled."
---

# Targets

Targets are AI tools that grekt syncs artifacts to.

## Sync types

Each target syncs differently depending on how the AI tool reads configuration:

| Sync type | Behavior |
|-----------|----------|
| **Folder** | Creates directories per category (agents, skills, commands...) |
| **Rules only** | Merges all content into a single entry point file |

Some targets support both.

## Supported targets

| Target | Entry Point | Type | MCP |
|--------|-------------|------|-----|
| [`claude`](#claude) | `.claude/CLAUDE.md` | Folder + Rules | Yes |
| [`kiro`](#kiro) | `.kiro/steering/grekt.md` | Folder | Yes |
| [`cursor`](#cursor) | `.cursorrules` | Rules only | Yes |
| [`copilot`](#copilot) | `.github/copilot-instructions.md` | Rules only | Yes |
| [`opencode`](#opencode) | `.opencode/` | Folder | Yes |
| [`openclaw`](#openclaw) | `skills/` + `AGENTS.md` | Folder | No |
| [`windsurf`](#windsurf) | `.windsurfrules` | Folder + Rules | No |
| [`cline`](#cline) | `.clinerules` | Rules only | No |
| [`aider`](#aider) | `CONVENTIONS.md` | Rules only | No |
| [`continue`](#continue) | `.continue/` | Folder | No |
| [`amazonq`](#amazon-q) | `.amazonq/` | Folder | Yes |
| [`codex`](#codex) | `.agents/` | Folder | Yes |
| [`gemini`](#gemini) | `.agents/` | Folder | Yes |
| [`jules`](#jules) | `.agents/` | Folder | No |
| [`zed`](#zed) | `.agents/` | Folder | Yes |
| [`goose`](#goose) | `.agents/` | Folder | No |
| [`devin`](#devin) | `.agents/` | Folder | No |
| [`roocode`](#roocode) | `.agents/` | Folder | Yes |
| [`kilocode`](#kilo-code) | `.agents/` | Folder | Yes |
| [`amp`](#amp) | `.agents/` | Folder | Yes |
| [`warp`](#warp) | `.agents/` | Folder | No |
| [`global`](#global) | `.agents/` | Folder | No |

---

## Target details

### Claude

Syncs to Claude Code's `.claude/` directory. Creates folder structure for agents, skills, and commands. Injects bootstrap content in `CLAUDE.md`.

- **Entry point**: `.claude/CLAUDE.md` or `CLAUDE.md`
- **Directory**: `.claude/`
- **Categories**: All (agents, skills, commands, rules)
- **MCP support**: `.mcp.json`
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

### Kiro

Syncs to Kiro's `.kiro/` directory. Skills are placed in `.kiro/skills/` and instructions go in `.kiro/steering/`.

- **Entry point**: `.kiro/steering/grekt.md`
- **Directory**: `.kiro/`
- **Categories**: Skills only
- **MCP support**: `.kiro/settings/mcp.json`
- Strips Claude-specific frontmatter fields (`argument-hint`, `disable-model-invocation`, `user-invocable`, `model`, `context`, `agent`, `hooks`, `allowed-tools`)
- Converts grekt format to Kiro-native format

```
.kiro/
├── steering/
│   └── grekt.md
├── skills/
│   └── {artifact}-{skill-name}/
│       └── SKILL.md
└── settings/
    └── mcp.json
```

### Cursor

Syncs all artifact content into a single `.cursorrules` file.

- **Entry point**: `.cursorrules`
- **Type**: Rules only (no folder structure)
- **Categories**: All (merged into managed block)
- **MCP support**: `.cursor/mcp.json`

### Copilot

Syncs all artifact content into GitHub Copilot's instructions file.

- **Entry point**: `.github/copilot-instructions.md`
- **Type**: Rules only (no folder structure)
- **Categories**: All (merged into managed block)
- **MCP support**: `.vscode/mcp.json`

### OpenCode

Syncs to OpenCode's `.opencode/` directory.

- **Directory**: `.opencode/`
- **Categories**: All (agents, skills, commands, rules)
- **MCP support**: `opencode.json`

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
- **MCP support**: `.amazonq/mcp.json`

```
.amazonq/
├── agents/
├── skills/
└── commands/
```

### Codex

Syncs to `.agents/` following the [agentskills.io](https://agentskills.io) standard.

- **Directory**: `.agents/`
- **Categories**: Skills
- **MCP support**: `.codex/config.toml` (TOML format, key: `mcp_servers`)

### Gemini

Syncs to `.agents/` following the [agentskills.io](https://agentskills.io) standard.

- **Directory**: `.agents/`
- **Categories**: Skills
- **MCP support**: `.gemini/settings.json` (key: `mcpServers`)

### Jules

Syncs to `.agents/` following the [agentskills.io](https://agentskills.io) standard.

- **Directory**: `.agents/`
- **Categories**: Skills

### Zed

Syncs to `.agents/` following the [agentskills.io](https://agentskills.io) standard.

- **Directory**: `.agents/`
- **Categories**: Skills
- **MCP support**: `.zed/settings.json` (key: `context_servers`)

### Goose

Syncs to `.agents/` following the [agentskills.io](https://agentskills.io) standard.

- **Directory**: `.agents/`
- **Categories**: Skills

### Devin

Syncs to `.agents/` following the [agentskills.io](https://agentskills.io) standard.

- **Directory**: `.agents/`
- **Categories**: Skills

### RooCode

Syncs to `.agents/` following the [agentskills.io](https://agentskills.io) standard.

- **Directory**: `.agents/`
- **Categories**: Skills
- **MCP support**: `.roo/mcp.json` (key: `mcpServers`)

### Kilo Code

Syncs to `.agents/` following the [agentskills.io](https://agentskills.io) standard.

- **Directory**: `.agents/`
- **Categories**: Skills
- **MCP support**: `.kilocode/mcp.json` (key: `mcpServers`)

### Amp

Syncs to `.agents/` following the [agentskills.io](https://agentskills.io) standard.

- **Directory**: `.agents/`
- **Categories**: Skills
- **MCP support**: `.amp/settings.json` (key: `amp.mcpServers`)

### Warp

Syncs to `.agents/` following the [agentskills.io](https://agentskills.io) standard.

- **Directory**: `.agents/`
- **Categories**: Skills

### Global

Syncs to `.agents/` following the [agentskills.io](https://agentskills.io) standard. Fallback for tools not listed individually.

- **Directory**: `.agents/`
- **Categories**: Skills

---

## MCP distribution <Badge type="warning" text="Beta" />

When an artifact includes MCP server components, grekt automatically installs the MCP configuration into the target tool's config file during `grekt add` and removes it during `grekt remove`.

| Target | Config file | Server key |
|--------|------------|------------|
| Claude | `.mcp.json` | `mcpServers` |
| Kiro | `.kiro/settings/mcp.json` | `mcpServers` |
| Cursor | `.cursor/mcp.json` | `mcpServers` |
| Copilot | `.vscode/mcp.json` | `servers` |
| Amazon Q | `.amazonq/mcp.json` | `mcpServers` |
| OpenCode | `opencode.json` | `mcp` |
| Codex | `.codex/config.toml` | `mcp_servers` |
| Gemini | `.gemini/settings.json` | `mcpServers` |
| Zed | `.zed/settings.json` | `context_servers` |
| RooCode | `.roo/mcp.json` | `mcpServers` |
| Kilo Code | `.kilocode/mcp.json` | `mcpServers` |
| Amp | `.amp/settings.json` | `amp.mcpServers` |

MCP distribution is automatic. If a target is enabled and the artifact contains MCP components, the config is installed.

See [Artifacts MCPs](/en-US/docs/guide/artifacts#mcps) for the MCP component format.

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
