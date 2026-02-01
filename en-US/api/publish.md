# grekt publish

Publish an artifact to a registry.

```bash
grekt publish [path]
```

## Examples

```bash
# Publish to configured registry
grekt publish ./my-artifact

# Publish current directory
grekt publish
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
8. Cleans up tarball

::: info Auto-generated components
The `components` field in `grekt.yaml` is **auto-generated** during publish. Do not edit it manually — it will be overwritten.

This field helps AI tools discover what's inside the artifact without scanning every file.
:::

## Version requirements

Versions must be valid [semantic versioning](https://semver.org/):

```yaml
# Valid
version: "1.0.0"
version: "2.1.0-beta.1"
version: "1.0.0+build.123"

# Invalid (will be rejected)
version: "v1.0.0"    # No 'v' prefix
version: "1.0"       # Must be X.Y.Z
version: "latest"    # Must be numeric
```

If the version is invalid:

```bash
✗ Invalid version: v1.0.0
ℹ Version must be valid semver (e.g., 1.0.0, 2.1.0-beta.1)
```

If keywords are missing or invalid:

```bash
✗ Manifest requires at least 3 keywords
ℹ Add 'keywords' array to grekt.yaml with 3-5 keywords

  Example:
    keywords:
      - git
      - commit
      - automation
```

If the version already exists:

```bash
✗ Version 1.0.0 already exists for @author/name
ℹ Bump the version in grekt.yaml and try again
```

## Related commands

- [grekt pack](/en-US/api/pack) — Create tarball without publishing
- [grekt versions](/en-US/api/versions) — List available versions
