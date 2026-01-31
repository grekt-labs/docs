# Quick start

This guide walks you through setting up grekt in a project and syncing your first artifact.

## Installation

::: warning EARLY ACCESS
grekt is in early development. Expect breaking changes.
:::

::: code-group

```bash [curl]
curl -fsSL https://grekt.com/install.sh | sh
```

```bash [brew]
brew tap grekt-labs/grekt && brew install grekt
```

:::

## Initialize a project

Every project using grekt needs to be initialized. This creates the configuration files and sets up which AI tools you want to sync to.

```bash
grekt init
```

You'll be prompted to select your targets — the AI tools where artifacts will be synced (Claude Code, Cursor, Windsurf...).

This creates the following structure in your project:

```
project/
├── .grekt/
│   ├── artifacts/      # Downloaded artifacts
│   └── config.yaml     # Local config (tokens, session) - gitignored
├── grekt.yaml          # Project configuration
└── grekt.lock          # Lockfile with exact versions and checksums
```

The `.grekt/config.yaml` file stores your authentication session and tokens. It's automatically added to `.gitignore`.

## Add an artifact

Artifacts are packages containing AI configurations: agents, skills, commands, rules... They can come from the grekt registry, GitHub, or GitLab.

```bash
# From the registry
grekt add @grekt/code-reviewer

# From GitHub (latest)
grekt add github:user/repo

# From GitHub (specific tag)
grekt add github:user/repo#v1.0.0

# From GitLab
grekt add gitlab:group/repo
```

When you add an artifact:
1. grekt downloads it to `.grekt/artifacts/`
2. Updates `grekt.yaml` with the artifact reference
3. Creates a lockfile entry with the exact version and checksum

By default, artifacts are added in **LAZY** mode (indexed but not copied to AI tools). Use `--core` to copy them directly to target directories like `.claude/agents/`.

::: tip Selective installation
Large artifacts may contain components you don't need. Use `--choose` to interactively select which agents, skills, or commands to install:

```bash
grekt add @grekt/git-flow --choose
```
:::

## Sync to your tools

Sync writes your artifacts to AI tool directories. Each target (Claude, Cursor...) has its own structure:

- **Claude**: Creates `.claude/agents/`, `.claude/skills/`, updates `CLAUDE.md`
- **Cursor**: Updates `.cursorrules` with artifact content

```bash
# Preview what will change
grekt sync --dry-run

# Apply changes
grekt sync
```

Only **CORE** mode artifacts are copied to target directories. **LAZY** mode artifacts (default) are indexed in `.grekt/index` for AI tools to discover on demand.

::: tip Auto sync
Set `autoSync: true` in your config to sync automatically when you add or remove artifacts.
:::

## Verify your setup

Run `grekt check` to verify artifact integrity and detect issues:

```bash
grekt check
```

This command:
- Verifies SHA256 checksums against the lockfile
- Detects local modifications (drift)
- Warns about conflicts like duplicate skill names
- Shows total context size and estimated tokens

To see what's installed:

```bash
grekt list
```

## Configuration

Your `grekt.yaml` tracks which artifacts are installed and how the project is configured:

```yaml
targets:
  - claude
  - cursor
autoSync: false
artifacts:
  @grekt/code-reviewer: "1.0.0"
  @grekt/git-flow:
    version: "2.0.0"
    skills:
      - skills/branch-naming.md
```

Manage settings with the config command:

```bash
# View current config
grekt config list

# Enable auto-sync
grekt config set autoSync true
```