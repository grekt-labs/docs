# Publishing

Publish artifacts to the registry for others to install.

## Before you publish

Your artifact needs a valid manifest (`grekt.yaml`) with required fields:

```yaml
name: my-artifact
author: your-name
version: 1.0.0
description: What this artifact does
```

The artifact ID becomes `@author/name` (e.g., `@your-name/my-artifact`).

## Publish

```bash
# Login first
grekt login

# Publish
grekt publish ./path/to/artifact
```

This:

1. Validates the manifest
2. Creates a tarball
3. Checks version doesn't already exist
4. Uploads to registry

### Options

| Option | Description |
|--------|-------------|
| `--local` | Create tarball only, don't upload |
| `-o, --output <path>` | Output path for tarball (with `--local`) |
| `--s3` | Use S3-compatible storage (legacy) |

### Examples

```bash
# Publish to registry
grekt publish ./my-artifact

# Create tarball without uploading
grekt publish ./my-artifact --local -o ./dist/
```

## Version management

Each publish requires a unique version. If the version exists, publish fails:

```
✗ Version 1.0.0 already exists for @author/my-artifact
ℹ Bump the version in grekt.yaml and try again
```

Bump your version in `grekt.yaml` before publishing updates.

### Deprecating versions

Mark old versions as deprecated to warn users:

```bash
grekt deprecate @author/my-artifact@1.0.0 -m "Security fix in 1.0.1"
```

Deprecated versions remain installable but show a warning. To remove deprecation:

```bash
grekt undeprecate @author/my-artifact@1.0.0
```

### Listing versions

```bash
grekt versions @author/my-artifact
```

Shows all published versions with deprecation status.

## CI/CD Publishing

### GitHub Actions

```yaml
- name: Publish artifact
  env:
    GREKT_PASSWORD: ${{ secrets.GREKT_PASSWORD }}
  run: |
    grekt login --email ci@example.com --password $GREKT_PASSWORD
    grekt publish ./artifact
```

### GitLab CI

```yaml
publish:
  script:
    - grekt login --email $CI_EMAIL --password $CI_PASSWORD
    - grekt publish ./artifact
```

## Related

- [grekt publish](/en-US/api/publish) — Command reference
- [grekt deprecate](/en-US/api/deprecate) — Deprecate versions
- [grekt versions](/en-US/api/versions) — List versions
- [Artifacts](/en-US/docs/guide/artifacts) — Artifact structure
- [Authentication](/en-US/docs/guide/authentication) — Credentials setup
- [Self-Hosted Registries](/en-US/docs/guide/self-hosted-registries) — GitLab registry setup
