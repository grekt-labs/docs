---
description: "Manage AI context across all your AI tools from a single source of truth using grekt targets and sync."
---

# Multitool workflow

Use any combination of AI tools without duplicating or diverging your configs.

## The problem

You use multiple AI tools in your workflow. Each tool has its own config format:

- Claude Code reads from `.claude/`
- Cursor reads from `.cursorrules`
- Windsurf reads from `.windsurfrules`
- Copilot reads from `.github/copilot-instructions.md`
- And many more

You end up with the same agents and rules maintained separately for each tool. When you update one, the others go stale. Your code review agent behaves differently depending on which tool you're using.

Maintaining parity manually doesn't scale.

## The solution

### 1. Set up your targets

Targets tell grekt where to sync artifacts. Add one per AI tool:

```bash
grekt add-target claude
grekt add-target cursor
```

### 2. Add your artifacts

Install artifacts once. They **auto-sync to all configured targets**:

```bash
grekt add @your-org/code-review-agent --core
grekt add @your-org/project-rules --core
```

grekt translates your artifacts into each tool's native format and writes them to the correct locations automatically.

### 3. Keep everything aligned

When you upgrade an artifact, it auto-syncs again. Every tool sees the same version, formatted for its specific needs:

```bash
grekt upgrade @your-org/code-review-agent
```

## Result

Your project structure:

```
your-project/
├── grekt.yaml            # Committed
├── grekt.lock            # Committed
├── .grekt/               # Gitignored (local artifacts, index, config)
├── .claude/              # Claude Code target (folder + rules)
│   └── CLAUDE.md
├── .cursorrules          # Cursor target (rules)
└── src/
```

**One source of truth** in `grekt.yaml`, synced to every tool automatically.

## Related

- [Targets](/en-US/docs/guide/targets) - How targets work
- [grekt sync](/en-US/api/sync) - Sync artifacts to targets
- [grekt config](/en-US/api/config) - Configure targets and settings
