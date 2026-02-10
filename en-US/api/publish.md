# grekt publish

Publish an artifact to a registry.

```bash
grekt publish [path]
grekt publish --changed
```

## Options

| Option | Description |
|--------|-------------|
| `--s3` | Use S3-compatible storage (legacy mode) |
| `--changed` | Publish only artifacts where local version > registry (workspace mode) |
| `--dry-run` | Show what would be published without publishing |

## Examples

```bash
# Publish to configured registry
grekt publish ./my-artifact

# Publish current directory
grekt publish

# Publish all changed artifacts in workspace
grekt publish --changed

# Preview what would be published
grekt publish --changed --dry-run
```

## Authentication

Configure your registry first:

```bash
grekt config registry set @myteam
```

Token priority:

1. Token in `.grekt/config.yaml` registry entry
2. Environment variable: `GITLAB_TOKEN` or `GITHUB_TOKEN`

See [Authentication](/en-US/docs/guide/sources/authentication) for details.

## Behavior

1. Validates the manifest (`grekt.yaml`)
2. Validates version is valid semver
3. Checks keywords (3-5 required)
4. Scans components and auto-generates `components` section
5. Creates a tarball in `.grekt/tmp/`
6. Checks version doesn't already exist
7. Uploads to registry
8. Sends `license` and `repository` (if present) to the registry
9. Cleans up tarball

::: info Auto-generated components
The `components` field in `grekt.yaml` is **auto-generated** during publish. Do not edit it manually — it will be overwritten.
:::

## Workspace mode

With `--changed`, grekt:

1. Discovers all artifacts in the workspace
2. Compares local version vs registry version for each
3. Publishes only where local > registry

```bash
$ grekt publish --changed

ℹ Checking 3 artifact(s) for changes...

  ↑ @myorg/auth-rules 1.2.0 (registry: 1.1.0)
  = @myorg/api-rules 2.0.0 (up to date)
  ↑ @myorg/ui-rules 1.0.0 (new)

ℹ 2 artifact(s) to publish

✓ Published @myorg/auth-rules@1.2.0
✓ Published @myorg/ui-rules@1.0.0

✓ Published 2 artifact(s)
```

Requires `grekt-workspace.yaml` in the current directory.

## Error handling

Invalid version:

```bash
✗ Invalid version: v1.0.0
ℹ Version must be valid semver (e.g., 1.0.0, 2.1.0-beta.1)
```

Missing keywords:

```bash
✗ Manifest requires at least 3 keywords
ℹ Add 'keywords' array to grekt.yaml with 3-5 keywords
```

Version exists:

```bash
✗ Version 1.0.0 already exists for @author/name
ℹ Bump the version in grekt.yaml and try again
```

## Related commands

- [grekt pack](/en-US/api/pack) — Create tarball without publishing
- [grekt version](/en-US/api/version) — Bump versions
- [grekt workspace](/en-US/api/workspace) — Workspace management
- [Monorepo guide](/en-US/docs/guide/managing/monorepo) — Full workflow
