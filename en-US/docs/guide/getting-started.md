# Quick Start

This guide walks you through setting up grekt in a project and syncing your first artifact.

## Installation

::: warning EARLY ACCESS
grekt is in early development. Expect breaking changes.
:::

::: code-group

```bash [curl]
curl -fsSL grekt.com | sh
```

```bash [brew]
brew install grekt
```

```bash [npm]
npm install -g grekt
```

```bash [pnpm]
pnpm add -g grekt
```

```bash [bun]
bun add -g grekt
```

:::

## Initialize a Project

Every project using grekt needs to be initialized. This creates the configuration files and sets up which AI tools you want to sync to.

```bash
grekt init
```

You'll be prompted to select your targets — the AI tools where artifacts will be synced (Claude Code, Cursor, Windsurf...).

This creates three things in your project:

```
project/
├── .grekt/artifacts/   # Where downloaded artifacts live
├── grekt.yaml          # Project configuration
└── grekt.lock          # Lockfile with exact versions and checksums
```

## Add an artifact

Artifacts can come from the grekt registry, GitHub, or GitLab. The `add` command downloads the artifact and updates your configuration.

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

::: tip Selective Installation
Large artifacts may contain components you don't need. Use `--choose` to interactively select which agents, skills, or commands to install:

```bash
grekt add @grekt/git-flow --choose
```
:::

## Sync to Your Tools

After adding artifacts, sync them to your AI tools. The sync command reads your artifacts and writes the appropriate configuration files for each target.

```bash
# Preview what will change
grekt sync --dry-run

# Apply changes
grekt sync
```

If you have `autoSync: true` in your config, syncing happens automatically when you add or remove artifacts.

## Verify your setup

Check that everything is installed correctly and see what's in your project:

```bash
# List installed artifacts
grekt list

# Verify integrity and check for issues
grekt check
```

The `check` command verifies that artifact files haven't been modified and warns about potential conflicts like duplicate skill names.

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