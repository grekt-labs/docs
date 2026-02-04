# grekt version

Bump artifact versions.

```bash
grekt version <bump> [path]
grekt version --exec <command>
```

## Arguments

| Argument | Description |
|----------|-------------|
| `bump` | One of `patch`, `minor`, `major`, `prerelease`. Required unless using `--exec`. |
| `path` | Path to artifact or directory. Defaults to current directory. |

## Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Show what would happen without applying changes |
| `--beta` | Use beta identifier for prerelease (required with `prerelease`) |
| `--exec <command>` | Run external versioning command (workspace mode) |

## Examples

```bash
# Bump patch version (1.0.0 → 1.0.1)
grekt version patch

# Bump minor version (1.0.0 → 1.1.0)
grekt version minor

# Bump major version (1.0.0 → 2.0.0)
grekt version major

# Prerelease (1.0.0 → 1.0.1-beta.0)
grekt version prerelease --beta

# Bump specific artifact
grekt version patch ./my-agent

# Preview without applying
grekt version minor --dry-run

# Use external versioning tool (workspace mode)
grekt version --exec "npx changeset version"
```

## Output

```bash
$ grekt version patch --dry-run

ℹ Found 1 artifact(s)
  (dry-run mode)

  @scope/my-artifact: 1.2.0 → 1.2.1
```

## Workspace mode

When using `--exec`, grekt:

1. Generates temporary `package.json` files for each artifact
2. Runs your command (e.g., changeset)
3. Syncs versions from `package.json` back to `grekt.yaml`
4. Cleans up temporary files

Requires `grekt-workspace.yaml` in the current directory.

::: info Why package.json?
Most versioning tools (changeset, release-it, etc.) only support `package.json`. The `--exec` flag provides a compatibility layer until native `grekt.yaml` support is available. The generated `package.json` files are temporary and never committed.
:::

```bash
$ grekt version --exec "npx changeset version"

ℹ Workspace: 3 artifact(s)
✓ Generated 3 package.json file(s)

ℹ Running: npx changeset version
# ... changeset output ...

✓ Updated 2 grekt.yaml file(s)
✓ Removed temporary package.json files

✓ Version update complete
```

## Related commands

- [grekt publish](/en-US/api/publish) — Publish artifacts
- [grekt workspace](/en-US/api/workspace) — Workspace management
- [Monorepo guide](/en-US/docs/guide/managing/monorepo) — Full workflow
