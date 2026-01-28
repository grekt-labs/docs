# grekt publish

Publish an artifact to the registry.

```bash
grekt publish <path>
```

## Examples

::: code-group

```bash [Public registry]
# Requires grekt login
grekt login
grekt publish ./my-artifact
```

```bash [GitLab / GitHub]
# Uses GITLAB_TOKEN, GITHUB_TOKEN, or config
grekt publish ./my-artifact
```

:::

## Authentication

Authentication depends on the registry:

- **Public registry:** `grekt login` (stores token in `~/.grekt/credentials.yaml`)
- **GitLab / GitHub:** `GITLAB_TOKEN`, `GITHUB_TOKEN`, or token in `.grekt/config.yaml`

## Behavior

1. Validates the manifest (`grekt.yaml`)
2. Validates version is valid semver
3. Checks keywords (3-5 required)
4. Creates a tarball in `.grekt/tmp/`
5. Checks version doesn't already exist
6. Uploads to registry
7. Cleans up tarball

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

Keywords help with discoverability and are used in the artifact index.

If the version already exists:

```bash
✗ Version 1.0.0 already exists for @author/name
ℹ Bump the version in grekt.yaml and try again
```

## Related commands

- [grekt pack](/en-US/api/pack) — Create tarball without publishing
- [grekt deprecate](/en-US/api/deprecate) — Mark a version as deprecated
- [grekt versions](/en-US/api/versions) — List available versions
