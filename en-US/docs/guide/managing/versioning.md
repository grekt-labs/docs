# Versioning

Version management and deprecation.

## Version format

grekt uses [Semantic Versioning](https://semver.org/) with the format `MAJOR.MINOR.PATCH`.

Each publish requires a unique version. If you try to publish an existing version:

```
✗ Version 1.0.0 already exists for @author/my-artifact
ℹ Bump the version in grekt.yaml and try again
```

Versions are immutable — this ensures that `grekt install` with a lockfile always produces the same result.

## Listing versions

```bash
grekt versions @author/my-artifact
```

Shows all published versions with deprecation status.

## Artifact info

```bash
grekt info @author/my-artifact
```

Shows latest version, description, author, and components.

## Deprecating

Mark a version as deprecated to warn users:

```bash
grekt deprecate @author/my-artifact@1.0.0 "Security fix in 1.0.1"
```

### Effects

- Version remains installable
- `grekt install` shows a warning when installing deprecated versions
- `grekt versions` marks it as deprecated
- `grekt info` includes deprecation message

### Why deprecate instead of delete?

Deleting versions breaks reproducibility. Projects using lockfiles expect specific versions to remain available. Deprecation warns users without breaking their builds.

::: warning Registry only
Deprecation only works with the official grekt registry. For artifacts hosted on GitHub or GitLab, deprecation is not supported — use delete to remove versions entirely.
:::

## Undeprecating

Remove deprecation from a version:

```bash
grekt undeprecate @author/my-artifact@1.0.0
```

## Related

- [grekt deprecate](/en-US/api/deprecate) — Command reference
- [grekt undeprecate](/en-US/api/undeprecate) — Command reference
- [grekt versions](/en-US/api/versions) — Command reference
- [grekt info](/en-US/api/info) — Command reference
