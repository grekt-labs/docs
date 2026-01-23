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

Installs all artifacts from `grekt.lock` with integrity verification. Use after cloning a project or in CI/CD.

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
grekt sync

# Reinstall all
grekt install --force
```

## Integrity Verification

Each file's SHA256 hash is verified against the lockfile:

```
Error: Integrity check failed for code-reviewer
  missing: skills/helper.md
  modified: agent.md
```

## Auto Check

When `options.autoCheck` is enabled in `grekt.yaml`, an integrity check runs automatically after installing:

```yaml
options:
  autoCheck: true
```

```
✓ Installed @grekt/code-reviewer@1.0.0
✓ Installed @grekt/git-flow@2.1.0

Integrity check:
✓ All 2 artifact(s) verified
```

## Notes

- Requires `grekt.lock` (run `grekt add` first if missing)
- Run `grekt sync` after installing
- For private repos, set `GITHUB_TOKEN` or `GITLAB_TOKEN`
