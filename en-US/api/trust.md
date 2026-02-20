---
description: "Mark an artifact as trusted so it is excluded from --fail-on checks during security scanning."
---

# grekt trust

Mark an artifact as trusted. Trusted artifacts are excluded from `--fail-on` evaluation in `grekt scan`, allowing known-risky artifacts to pass CI checks.

```bash
grekt trust <artifact>
```

## Arguments

| Argument | Description |
|----------|-------------|
| `artifact` | Artifact ID (e.g., `@scope/name`) |

## What it does

Sets `trusted: true` on the artifact entry in `grekt.yaml`. If the entry is in short form (`"1.0.0"`), it converts to long form automatically:

```yaml
# Before
artifacts:
  "@sketchy/tool": "1.0.0"

# After
artifacts:
  "@sketchy/tool":
    version: "1.0.0"
    mode: lazy
    trusted: true
```

## Example

```bash
grekt trust @sketchy/tool
```

## Use cases

- Acknowledging known-risky artifacts that your team has reviewed and accepted
- Preventing CI pipelines from blocking on artifacts you have already audited
- Temporarily bypassing `--fail-on` for artifacts pending upstream fixes

::: warning
Trusting an artifact does not make it safe. It only tells grekt to skip it during `--fail-on` evaluation. Always review the scan findings before trusting.
:::

## Related commands

- [grekt untrust](/en-US/api/untrust) - Remove trusted status
- [grekt scan](/en-US/api/scan) - Scan artifacts with `--fail-on` threshold
