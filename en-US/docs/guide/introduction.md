# Introduction

grekt is a package manager for AI artifacts. It lets you install, manage, and share agents, skills, and commands across your projects — and sync them to AI tools like Claude Code, Cursor, Windsurf, and others.

## The Problem

AI tools need context to be useful. You write custom instructions, create agents with specific behaviors, define skills... but this context is:

- **Scattered** across projects and tools
- **Hard to share** with your team
- **Tedious to sync** when you make changes
- **Not versioned** like the rest of your code

## The Solution

grekt treats AI context like dependencies. You declare what you need, install it, and sync it to your tools.

```bash
grekt add @grekt/code-reviewer    # Install an artifact
grekt sync                        # Sync to Claude, Cursor...
```

When someone publishes a better code reviewer agent, you `grekt add` it. When you improve your own, you `grekt publish` it.

## What are Artifacts?

Artifacts are packages of AI context. They can contain:

| Component | Description |
|-----------|-------------|
| **Agents** | Personas with specific behaviors and instructions |
| **Skills** | Reusable capabilities (code review, testing, docs...) |
| **Commands** | Slash commands for common workflows |

A single artifact might contain an agent with multiple skills and commands, or just a standalone skill you can mix with others.

## Sources

Install from multiple sources:

| Source | Example |
|--------|---------|
| Registry | `grekt add @author/artifact` |
| GitHub | `grekt add github:user/repo` |
| GitLab | `grekt add gitlab:group/repo` |

## Why grekt?

- **Reproducible**: Lockfile ensures everyone gets the same versions
- **Composable**: Mix artifacts from registry, GitHub, GitLab
- **Selective**: Install only the components you need with `--choose`
- **Versionable**: Pin versions, check for updates, deprecate old ones
- **Tool-agnostic**: Sync to Claude, Cursor, Windsurf, or custom targets

## Next

Ready to start? Head to the [Quick Start](/en-US/docs/guide/getting-started).
