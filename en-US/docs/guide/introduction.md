# Introduction

grekt is an artifact manager for AI tools. It lets you install, manage, and share agents, skills, and commands across your projects — and sync them to AI tools like Claude Code, Cursor, Windsurf, and others.

## The problem

AI tools need context to be useful. You write custom instructions, create agents with specific behaviors, define skills... but this context is:

- **Scattered** across projects and tools
- **Hard to share** with your team
- **Tedious to sync** when you make changes
- **Not versioned** like the rest of your code

## The solution

grekt treats AI context like dependencies. You declare what you need, install it, and grekt will sync it to your tools.

```bash
grekt add @scope/my-artifact    # Install an artifact
```

Artifacts work like dependencies: install what others have built, or publish your own for your team (or the community) to use.

## What are artifacts?

Artifacts are bundles of AI context — agents, skills, commands, MCP configs, rules... anything your AI tools need to work well. A single artifact might contain a full agent with multiple skills and commands, or just a standalone rule you can mix with others.

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
- **Selective**: Install only the components you need with `--choose` pick specific agents, skills, or commands instead of the whole artifact
- **Context aware**: [Lazy mode](/en-US/docs/guide/sync-modes) keeps rarely-used artifacts indexed but outside your AI tool's context, avoiding clutter while maintaining discoverability
- **Versionable**: Pin versions, check for updates, deprecate old ones
- **Tool agnostic**: Sync to Claude, Cursor, Windsurf, etc... or any custom agent

## Next

Ready to start? Head to the [Quick start](/en-US/docs/guide/getting-started).
