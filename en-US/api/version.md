# grekt version

Calculate and apply semantic versions to artifacts based on conventional commits.

```bash
grekt version [path]
```

## Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Show what versions would be generated without applying |

## Examples

```bash
# Version all artifacts in current directory
grekt version

# Preview without applying
grekt version --dry-run

# Version a specific artifact
grekt version ./my-agent

# Version all artifacts in a directory
grekt version ./my-artifacts
```

## Output

```bash
$ grekt version --dry-run

ℹ Found 3 artifact(s)
  (dry-run mode)

  @grekt/agent-reviewer: 1.2.0 → 1.3.0 (2 minor commits)
  @grekt/skill-commit: 2.0.1 (no changes)
  @grekt/prompt-review: 0.5.0 → 1.0.0 (1 major commits)
```

## How it works

1. Scans for directories containing `grekt.yaml`
2. Analyzes git commit history using [conventional commits](https://www.conventionalcommits.org/)
3. Calculates new versions based on commit types:
   - `fix:` → patch bump (1.0.0 → 1.0.1)
   - `feat:` → minor bump (1.0.0 → 1.1.0)
   - `feat!:` or `BREAKING CHANGE:` → major bump (1.0.0 → 2.0.0)
4. Updates `version` field in `grekt.yaml`

## Requirements

- Must be run inside a git repository
- Commits must follow [conventional commits](https://www.conventionalcommits.org/) format
- Each artifact must have a valid `grekt.yaml` with `name`, `author`, and `version`

## Directory structure

Works with single artifacts or multi-artifact repositories:

```
# Single artifact
my-agent/
└── grekt.yaml

# Multi-artifact repo
my-artifacts/
├── agent-reviewer/
│   └── grekt.yaml
├── skill-commit/
│   └── grekt.yaml
└── prompt-review/
    └── grekt.yaml
```

## Related commands

- [grekt publish](/en-US/api/publish) — Publish an artifact
- [grekt versions](/en-US/api/versions) — List available versions
