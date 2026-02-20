---
description: "Remove trusted status from an artifact so it is evaluated again during --fail-on checks."
---

# grekt untrust

Remove the trusted status from an artifact. The artifact will be evaluated again during `grekt scan --fail-on` checks.

```bash
grekt untrust <artifact>
```

## Arguments

| Argument | Description |
|----------|-------------|
| `artifact` | Artifact ID (e.g., `@scope/name`) |

## What it does

Removes the `trusted` field from the artifact entry in `grekt.yaml`. If the artifact is in short form (version string only), this is a no-op since short form entries are already not trusted.

## Example

```bash
grekt untrust @sketchy/tool
```

## Related commands

- [grekt trust](/en-US/api/trust) - Mark an artifact as trusted
- [grekt scan](/en-US/api/scan) - Scan artifacts with `--fail-on` threshold
