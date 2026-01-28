# grekt publish

Publish an artifact to the registry.

```bash
grekt publish <path>
```

## Options

| Option | Description |
|--------|-------------|
| `--local` | Only create tarball, don't upload |
| `-o, --output <path>` | Output path for tarball (with `--local`) |
| `--s3` | Use S3-compatible storage (legacy mode) |

## Examples

```bash
# Publish to registry (requires login)
grekt login
grekt publish ./my-artifact

# Create tarball only
grekt publish ./my-artifact --local -o ./dist/artifact.tar.gz

# Legacy: publish to S3-compatible storage
grekt publish ./my-artifact --s3
```

## Authentication

Requires authentication via `grekt login`:

```bash
$ grekt publish ./artifact
✗ Not logged in
ℹ Run 'grekt login' first
```

## Behavior

1. Validates the manifest (`grekt.yaml`)
2. Validates version is valid semver
3. Checks keywords (3-5 required)
4. Creates a tarball
5. Checks version doesn't already exist
6. Uploads to registry

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

## S3 Legacy Mode

For backwards compatibility with S3-compatible storage:

```bash
grekt publish ./artifact --s3
```

Requires S3 credentials. See [Authentication](/en-US/docs/guide/authentication#s3-storage-legacy).

## Related commands

- [grekt login](/en-US/api/login) — Log in to registry
- [grekt deprecate](/en-US/api/deprecate) — Mark a version as deprecated
- [grekt versions](/en-US/api/versions) — List available versions
