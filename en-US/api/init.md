---
description: "Initialize grekt in a project with an interactive onboarding wizard that auto-detects AI tools, configures registries, and sets up the dashboard."
---

# grekt init

Initialize grekt in a project. Runs an interactive onboarding wizard that guides you through the full setup.

```bash
grekt init
```

## Options

| Option | Description |
|--------|-------------|
| `-y, --yes` | Skip prompts, use defaults (auto-detects tools, enables remote search) |
| `--targets <targets>` | Comma-separated list of targets, skips target selection prompt |

## What it does

The init wizard walks you through:

1. **Auto-detect AI tools**. Scans for `.claude/`, `.cursor/`, and other tool directories. Detected tools are pre-checked in the selection prompt
2. **Target selection**. Choose which AI tools to sync artifacts to
3. **Remote search**. Enable public registry search for artifact discovery
4. **Self-hosted registries**. Configure GitHub/GitLab registries with scope, provider, and prefix (monorepo mode)
5. **Dashboard**. Connect to a [grekt dashboard](/en-US/docs/guide/dashboard/overview) instance
6. **File creation**. Creates all project files and runs plugin setup
7. **Summary**. Shows created files, missing token warnings, and offers to install `@grekt/tools`

## What it creates

```
project/
├── .grekt/
│   ├── artifacts/     # Downloaded artifacts
│   ├── index          # Artifact index for AI tools
│   └── config.yaml    # Local config (registries, tokens, dashboard) - gitignored
├── grekt.yaml         # Project configuration
└── grekt.lock         # Lockfile (created on first add)
```

`.grekt/config.yaml` is only created when registries or dashboard are configured.

## Examples

```bash
# Interactive wizard
grekt init

# Auto-detect and use defaults
grekt init --yes

# Skip target prompt
grekt init --targets claude,cursor

```

## Notes

- Won't overwrite existing files. Exits early if already initialized
- If a `.gitignore` exists, `.grekt` will be added automatically. If no `.gitignore` is found, a warning will suggest adding it manually
- Change config later with `grekt config`
- Configure registries later with `grekt config registry set`
- Configure dashboard later with `grekt dashboard setup`
