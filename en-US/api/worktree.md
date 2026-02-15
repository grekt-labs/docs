# grekt worktree

Manage git worktree integration.

```bash
grekt worktree <command>
```

## Commands

| Command | Description |
|---------|-------------|
| `sync` | Copy `.grekt/` from the original repo to the current worktree |

## grekt worktree sync

When using `git worktree`, gitignored directories like `.grekt/` are not present in the new worktree. This command copies `.grekt/` from the original repository.

```bash
grekt worktree sync
```

### Options

| Option | Description |
|--------|-------------|
| `-f, --force` | Overwrite existing `.grekt/` without confirmation |

### Examples

```bash
# Create a worktree and sync grekt config
git worktree add ../feature-branch feature-branch
cd ../feature-branch
grekt worktree sync

# Overwrite without confirmation
grekt worktree sync --force
```

### Behavior

1. Detects if the current directory is inside a git worktree
2. Resolves the original repository root
3. Copies `.grekt/` recursively to the current worktree

If `.grekt/` already exists in the worktree, you'll be prompted for confirmation unless `--force` is used.

### Errors

| Condition | Message |
|-----------|---------|
| Not a git repo | `Not inside a git repository` |
| Not a worktree | `Not inside a git worktree` |
| No `.grekt/` in original | `No .grekt/ directory found in the original repository` |
