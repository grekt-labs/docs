# Getting Started

grekt is an AI artifact manager for agents, skills, commands, and more that syncs configurations across AI coding assistants like Claude, Cursor, and others.

## Installation

::: warning EARLY ACCESS
grekt is currently in early development.
:::

```bash
curl -fsSL https://grekt.sh/install | bash
```

Or with npm:

```bash
npm install -g grekt
```

## Quick Start

### 1. Initialize your project

```bash
grekt init
```

This creates the grekt structure in your project:

```
project/
├── .grekt/
│   └── artifacts/       # Downloaded artifacts (gitignored)
├── grekt.yaml           # Config + artifact declarations
└── grekt.lock           # Lockfile with versions/checksums
```

During init, you'll be prompted to select your sync targets (Claude, Cursor, etc.).

### 2. Add an artifact

Install artifacts from GitHub:

```bash
# From a GitHub repository
grekt add github:grekt-labs/artifacts/@grekt/code-review

# From a GitHub URL
grekt add https://github.com/user/repo/tree/main/artifacts/@scope/name
```

Artifacts are downloaded to `.grekt/artifacts/<artifact-name>/`.

### 3. Sync to your AI tools

```bash
# Preview what will be synced
grekt sync --dry-run

# Sync to configured targets
grekt sync
```

This copies your artifacts to the appropriate locations:

- **Claude**: `.claude/agents/`, `.claude/skills/`, `.claude/commands/`
- **Cursor**: `.cursorrules`

### 4. List installed artifacts

```bash
grekt list
```

## Project Structure

After installing artifacts, your project looks like:

```
project/
├── .grekt/
│   └── artifacts/
│       └── code-review/
│           ├── grekt.yaml
│           ├── agent.md
│           └── skills/
│               └── testing.md
├── .claude/
│   ├── agents/
│   │   └── code-reviewer.md
│   ├── skills/
│   │   └── testing.md
│   ├── commands/
│   │   └── review.md
│   └── CLAUDE.md
├── .cursorrules
├── grekt.yaml
└── grekt.lock
```

## Configuration

Project configuration is stored in `grekt.yaml`:

```yaml
targets:
  - claude
  - cursor
autoSync: false
artifacts:
  code-review: "1.0.0"
```

Manage with:

```bash
# List config
grekt config list

# Set targets
grekt config set targets claude,cursor

# Enable auto-sync
grekt config set autoSync true
```

## Next Steps

- [Core Concepts](/en-US/docs/guide/concepts) — Understand artifacts and targets
- [CLI Reference](/en-US/api/) — Full command documentation
