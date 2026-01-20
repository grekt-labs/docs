# grekt install

Install artifacts from the lockfile.

## Usage

```bash
grekt install
grekt i
```

## Description

Installs all artifacts listed in `grekt.lock`. This is the recommended way to set up a project after cloning, similar to `npm install` or `pnpm install`.

Unlike `grekt add`, this command:
- Reads from **lockfile** (not grekt.yaml)
- Verifies **SHA integrity** after download
- **Fails fast** if checksums don't match

This ensures reproducible installs across machines and CI environments.

## Options

| Option | Description |
|--------|-------------|
| `--force` | Reinstall all artifacts, even if already present |

## Examples

### Install after cloning

```bash
git clone <repo>
cd <repo>
grekt install
grekt sync
```

### Reinstall all artifacts

```bash
grekt install --force
```

### Using the alias

```bash
grekt i
```

## What happens

1. **Reads** `grekt.lock` for artifact list
2. For each artifact:
   - **Downloads** from source specified in lockfile
   - **Verifies** file checksums match lockfile
   - **Fails** if integrity check fails
3. **Skips** artifacts already installed (unless `--force`)

## Integrity verification

The install command verifies each file's SHA256 hash:

```yaml
# grekt.lock
artifacts:
  code-reviewer:
    version: "1.0.0"
    integrity: "sha256:abc123..."
    files:
      "agent.md": "sha256:def456..."
      "skills/review.md": "sha256:789abc..."
```

If the downloaded content doesn't match, installation fails:

```
Error: Integrity check failed for code-reviewer
  missing: skills/helper.md
  modified: agent.md
```

## When to use

| Scenario | Command |
|----------|---------|
| Add new artifact | `grekt add <id>` |
| Clone existing project | `grekt install` |
| CI/CD pipeline | `grekt install` |
| Fix corrupted artifacts | `grekt install --force` |

## Notes

- Requires `grekt.lock` to exist (run `grekt add` first if missing)
- Run `grekt sync` after installing to sync with AI tools
- Skips already-installed artifacts by default (faster reinstalls)
