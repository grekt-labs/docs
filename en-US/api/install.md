# grekt install

Install artifacts from lockfile (strict mode).

```bash
grekt install
grekt i
```

## Options

| Option | Description |
|--------|-------------|
| `--force` | Reinstall even if already present |

## Description

Installs all artifacts from `grekt.lock` with integrity verification. Use after cloning a project.

Unlike `grekt add`, this command:
- Reads from lockfile (not grekt.yaml)
- Verifies SHA checksums
- Fails if checksums don't match

## Examples

```bash
# After cloning
git clone <repo>
cd <repo>
grekt install

# Reinstall all
grekt install --force
```

## Integrity verification

Each file's SHA256 hash is verified against the lockfile:

```
Error: Integrity check failed for code-reviewer
  missing: skills/helper.md
  modified: agent.md
```

## Auto check

When `options.autoCheck` is enabled in `grekt.yaml`, an integrity check runs automatically after installing:

```yaml
options:
  autoCheck: true
```

```
✓ Installed @scope/my-artifact@1.0.0
✓ Installed @scope/git-flow@2.1.0

Integrity check:
✓ All 2 artifact(s) verified
```

## Notes

- Requires `grekt.lock` (run `grekt add` first if missing)
- Automatically syncs to targets after installing (same as `grekt add` and `grekt upgrade`)
- For private repos, set `GITHUB_TOKEN` or `GITLAB_TOKEN`
