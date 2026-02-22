---
description: "Install all artifacts from the lockfile with integrity verification, for use after cloning a project."
---

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
| `--ci` | Fail if local artifacts are detected (also auto-detected via `CI` env var) |

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

## Local artifacts

Local artifacts (added via `./path`) are skipped during install since their paths are machine-specific. In CI environments, this becomes a hard error to prevent broken pipelines.

CI mode is activated automatically when the `CI` environment variable is set (standard in GitHub Actions, GitLab CI, etc.), or manually with `--ci`.

```bash
# CI pipeline — fails if someone committed local artifacts
grekt install --ci
```

## Notes

- Requires `grekt.lock` (run `grekt add` first if missing)
- Automatically syncs to targets after installing (same as `grekt add` and `grekt upgrade`)
- Local artifacts are skipped (silently in dev, error in CI)
- For private repos, set `GITHUB_TOKEN` or `GITLAB_TOKEN`
