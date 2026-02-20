---
description: "Overview of artifact lifecycle management in grekt: publishing, versioning, deprecation, and related commands."
---

# Managing artifacts

Lifecycle of artifacts in grekt: publishing, versioning, and deprecation.

## Available operations

| Command | Description |
|---------|-------------|
| `grekt publish` | Upload artifact to registry |
| `grekt versions` | List all versions of an artifact |
| `grekt info` | Get artifact details |
| `grekt outdated` | Check for newer versions |
| `grekt upgrade` | Upgrade artifacts to latest versions |
| `grekt deprecate` | Mark a version as deprecated |
| `grekt undeprecate` | Remove deprecation from a version |

## How grekt stores artifacts

When you publish, grekt:

1. Validates your `grekt.yaml` manifest
2. Creates a `.tar.gz` archive of your artifact
3. Calculates SHA256 integrity hash
4. Uploads to the registry

Versions are **immutable** - once published, a version cannot be modified or overwritten. This ensures deterministic installs via lockfile.

## Related

- [Publishing](/en-US/docs/guide/managing/publishing) - Upload artifacts
- [Versioning](/en-US/docs/guide/managing/versioning) - Versions and deprecation
