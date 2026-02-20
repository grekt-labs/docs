---
description: "Best practices for packaging and publishing artifacts that include Claude Code hooks, with collision avoidance guidance."
---

# Publishing hooks

Best practices for publishing artifacts that include hooks.

## How hooks are installed

When a user runs `grekt add`, hooks go through this process:

1. **Script files** (non-JSON) in the artifact's `hooks/` directory are copied flat to `.claude/hooks/`
2. **Hook definitions** from JSON files are merged into `.claude/settings.json`
3. On `grekt remove`, definitions are removed from settings and script files are deleted

No path rewriting happens. Commands are inserted into settings exactly as you define them.

## File naming

Script files are copied flat to `.claude/hooks/` — there are no subdirectories per artifact. If two artifacts ship a file with the same name, the second one will be skipped with a collision warning.

**Prefix your scripts with the artifact name** to avoid collisions:

```
hooks/
├── hooks.json
├── my-artifact-format.sh        # Good
├── my-artifact-lint.sh           # Good
├── format.sh                     # Bad — too generic, will collide
└── lint.sh                       # Bad
```

## Command paths

Since scripts end up in `.claude/hooks/`, commands should use paths relative to that directory:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/my-artifact-format.sh"
          }
        ]
      }
    ]
  }
}
```

If your hook scripts reference other scripts, use relative paths between them since they all end up in the same directory.

## Hook types

Hooks follow the [Claude Code hooks specification](https://docs.anthropic.com/en/docs/claude-code/hooks). Three handler types are supported:

### Command

Runs a shell command:

```json
{
  "type": "command",
  "command": ".claude/hooks/my-script.sh",
  "timeout": 30
}
```

### Prompt

Processed by a model:

```json
{
  "type": "prompt",
  "prompt": "Check if this change follows our coding standards",
  "model": "haiku"
}
```

### Agent

Can use tools for up to 50 turns:

```json
{
  "type": "agent",
  "prompt": "Review and fix any linting issues",
  "model": "haiku"
}
```

## Supported events

All 14 Claude Code hook events are supported:

| Event | When it fires |
|-------|--------------|
| `SessionStart` | Session begins |
| `SessionEnd` | Session ends |
| `UserPromptSubmit` | User sends a prompt |
| `PreToolUse` | Before a tool is called |
| `PostToolUse` | After a tool is called |
| `PostToolUseFailure` | After a tool call fails |
| `PermissionRequest` | When a permission is needed |
| `Notification` | When a notification is sent |
| `SubagentStart` | Subagent starts |
| `SubagentStop` | Subagent stops |
| `Stop` | Agent stops |
| `TeammateIdle` | Teammate becomes idle |
| `TaskCompleted` | Task finishes |
| `PreCompact` | Before context compaction |

## Complete example

```
my-artifact/
├── grekt.yaml
└── hooks/
    ├── hooks.json
    └── my-artifact-format.sh
```

`hooks/hooks.json`:
```json
{
  "grk-type": "hooks",
  "grk-name": "auto-format",
  "grk-description": "Format files after edit",
  "target": "claude",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/my-artifact-format.sh"
          }
        ]
      }
    ]
  }
}
```

`hooks/my-artifact-format.sh`:
```bash
#!/bin/bash
npx prettier --write "$CLAUDE_FILE_PATHS"
```

## Related

- [Artifacts](/en-US/docs/guide/artifacts#hooks) - Hook component overview
- [grekt add](/en-US/api/add) - Installing artifacts with hooks
- [grekt remove](/en-US/api/remove) - Removing artifacts and their hooks
